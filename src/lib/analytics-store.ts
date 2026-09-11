import { createHash } from "crypto";
import fs from "fs";
import path from "path";

const FALLBACK_DIR = "/tmp/sourcing-analytics";
const STORE_FILE = "analytics.json";
const MAX_DAYS = 120;
const MAX_VISITORS_PER_DAY = 5000;

export type PeriodStats = {
  pageviews: number;
  uniques: number;
};

export type AnalyticsStats = {
  today: PeriodStats;
  week: PeriodStats;
  allTime: PeriodStats;
  since: string;
};

type DayBucket = {
  pageviews: number;
  uniques: number;
  visitors: string[];
};

type AnalyticsStore = {
  totalPageviews: number;
  totalUniques: number;
  createdAt: string;
  days: Record<string, DayBucket>;
};

let writeChain: Promise<unknown> = Promise.resolve();
let resolvedDir: string | null = null;
let loggedFallback = false;

function withLock<T>(fn: () => T): Promise<T> {
  const run = writeChain.then(() => fn());
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function canWriteDir(dir: string): boolean {
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function resolveDataDir(): string {
  if (resolvedDir) return resolvedDir;

  const preferred = process.env.ANALYTICS_DATA_DIR || process.env.DATA_DIR || "/data";
  if (canWriteDir(preferred)) {
    resolvedDir = preferred;
    return resolvedDir;
  }

  if (!loggedFallback) {
    loggedFallback = true;
    console.warn(
      `[analytics] data dir "${preferred}" is not writable; falling back to ${FALLBACK_DIR}`,
    );
  }

  fs.mkdirSync(FALLBACK_DIR, { recursive: true });
  resolvedDir = FALLBACK_DIR;
  return resolvedDir;
}

function storePath(): string {
  return path.join(resolveDataDir(), STORE_FILE);
}

function emptyStore(at = new Date()): AnalyticsStore {
  return {
    totalPageviews: 0,
    totalUniques: 0,
    createdAt: at.toISOString(),
    days: {},
  };
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeStore(raw: unknown): AnalyticsStore {
  if (!raw || typeof raw !== "object") return emptyStore();
  const data = raw as Record<string, unknown>;
  const days: Record<string, DayBucket> = {};
  if (data.days && typeof data.days === "object") {
    for (const [key, value] of Object.entries(data.days as Record<string, unknown>)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !value || typeof value !== "object") continue;
      const day = value as Record<string, unknown>;
      const visitors = Array.isArray(day.visitors)
        ? day.visitors.filter((id): id is string => typeof id === "string").slice(0, MAX_VISITORS_PER_DAY)
        : [];
      days[key] = {
        pageviews: Math.max(0, asNumber(day.pageviews)),
        uniques: Math.max(0, asNumber(day.uniques, visitors.length)),
        visitors,
      };
    }
  }

  return {
    totalPageviews: Math.max(0, asNumber(data.totalPageviews)),
    totalUniques: Math.max(0, asNumber(data.totalUniques)),
    createdAt: typeof data.createdAt === "string" ? data.createdAt : emptyStore().createdAt,
    days,
  };
}

function loadStore(): AnalyticsStore {
  try {
    const raw = fs.readFileSync(storePath(), "utf8");
    return normalizeStore(JSON.parse(raw));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      console.warn("[analytics] could not read analytics.json; starting from zeros");
    }
    return emptyStore();
  }
}

function saveStore(store: AnalyticsStore): void {
  const file = storePath();
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(store)}\n`, "utf8");
  fs.renameSync(tmp, file);
}

export function utcDateKey(at: Date): string {
  return at.toISOString().slice(0, 10);
}

function shiftUtcDate(key: string, days: number): string {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return utcDateKey(date);
}

function lastNDateKeys(todayKey: string, n: number): string[] {
  const keys: string[] = [];
  for (let i = 0; i < n; i += 1) {
    keys.push(shiftUtcDate(todayKey, -i));
  }
  return keys;
}

function pruneDays(store: AnalyticsStore, todayKey: string): void {
  const cutoff = shiftUtcDate(todayKey, -(MAX_DAYS - 1));
  for (const key of Object.keys(store.days)) {
    if (key < cutoff) delete store.days[key];
  }
  const remaining = Object.keys(store.days).sort();
  if (remaining.length > MAX_DAYS) {
    for (const key of remaining.slice(0, remaining.length - MAX_DAYS)) {
      delete store.days[key];
    }
  }
}

function hashVisitorId(visitorId: string): string {
  return createHash("sha256").update(`sc:${visitorId}`).digest("hex").slice(0, 20);
}

function visitorSeenBefore(store: AnalyticsStore, hash: string): boolean {
  for (const day of Object.values(store.days)) {
    if (day.visitors.includes(hash)) return true;
  }
  return false;
}

function ensureDay(store: AnalyticsStore, key: string): DayBucket {
  const existing = store.days[key];
  if (existing) return existing;
  const created: DayBucket = { pageviews: 0, uniques: 0, visitors: [] };
  store.days[key] = created;
  return created;
}

function periodFromDays(store: AnalyticsStore, keys: string[]): PeriodStats {
  let pageviews = 0;
  const hashes = new Set<string>();
  let overflow = 0;

  for (const key of keys) {
    const day = store.days[key];
    if (!day) continue;
    pageviews += day.pageviews;
    for (const visitor of day.visitors) hashes.add(visitor);
    overflow += Math.max(0, day.uniques - day.visitors.length);
  }

  return { pageviews, uniques: hashes.size + overflow };
}

function recordHitSync({
  visitorId,
  at = new Date(),
}: {
  visitorId: string;
  path: string;
  at?: Date;
}): void {
  if (!visitorId) return;

  const store = loadStore();
  const todayKey = utcDateKey(at);
  pruneDays(store, todayKey);

  const day = ensureDay(store, todayKey);
  const hash = hashVisitorId(visitorId);

  store.totalPageviews += 1;
  day.pageviews += 1;

  if (!day.visitors.includes(hash)) {
    const seenAllTime = visitorSeenBefore(store, hash);
    day.uniques += 1;
    if (day.visitors.length < MAX_VISITORS_PER_DAY) {
      day.visitors.push(hash);
    }
    if (!seenAllTime) store.totalUniques += 1;
  }

  saveStore(store);
}

function getStatsSync(at = new Date()): AnalyticsStats {
  const store = loadStore();
  const todayKey = utcDateKey(at);
  pruneDays(store, todayKey);

  const today = store.days[todayKey] ?? { pageviews: 0, uniques: 0, visitors: [] };
  const week = periodFromDays(store, lastNDateKeys(todayKey, 7));
  const since =
    store.createdAt ||
    Object.keys(store.days).sort()[0] ||
    at.toISOString();

  return {
    today: { pageviews: today.pageviews, uniques: today.uniques },
    week,
    allTime: { pageviews: store.totalPageviews, uniques: store.totalUniques },
    since,
  };
}

export function recordHit(input: { visitorId: string; path: string; at?: Date }): Promise<void> {
  return withLock(() => recordHitSync(input));
}

export function getStats(at?: Date): Promise<AnalyticsStats> {
  return withLock(() => getStatsSync(at));
}
