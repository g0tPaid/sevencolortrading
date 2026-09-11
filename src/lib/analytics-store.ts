import { createHash } from "crypto";
import fs from "fs";
import path from "path";

const FALLBACK_DIR = "/tmp/sourcing-analytics";
const STORE_FILE = "analytics.json";
const MAX_DAYS = 120;
const MAX_VISITORS_PER_DAY = 5000;
const MAX_SESSIONS = 2000;
const TOP_COUNTRIES = 15;
const RECENT_SESSIONS = 20;

export type PeriodStats = {
  pageviews: number;
  uniques: number;
};

export type CountryStat = {
  code: string;
  visits: number;
  pageviews: number;
};

export type RecentSession = {
  country: string;
  durationSeconds: number;
  pageviews: number;
  lastSeen: string;
};

export type AnalyticsStats = {
  today: PeriodStats;
  week: PeriodStats;
  allTime: PeriodStats;
  since: string;
  avgDurationSeconds: number;
  sessionCount: number;
  countries: CountryStat[];
  recentSessions: RecentSession[];
};

type DayBucket = {
  pageviews: number;
  uniques: number;
  visitors: string[];
};

type SessionRecord = {
  country: string;
  firstSeen: string;
  lastSeen: string;
  pageviews: number;
};

type CountryBucket = {
  visits: number;
  pageviews: number;
};

type AnalyticsStore = {
  totalPageviews: number;
  totalUniques: number;
  createdAt: string;
  days: Record<string, DayBucket>;
  sessions: Record<string, SessionRecord>;
  countries: Record<string, CountryBucket>;
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
    sessions: {},
    countries: {},
  };
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeCountryCode(value: unknown): string {
  if (typeof value !== "string") return "ZZ";
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "ZZ";
  return code;
}

function normalizeSession(raw: unknown): SessionRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const firstSeen = typeof row.firstSeen === "string" ? row.firstSeen : null;
  const lastSeen = typeof row.lastSeen === "string" ? row.lastSeen : firstSeen;
  if (!firstSeen || !lastSeen) return null;
  return {
    country: normalizeCountryCode(row.country),
    firstSeen,
    lastSeen,
    pageviews: Math.max(0, asNumber(row.pageviews)),
  };
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

  const sessions: Record<string, SessionRecord> = {};
  if (data.sessions && typeof data.sessions === "object") {
    for (const [hash, value] of Object.entries(data.sessions as Record<string, unknown>)) {
      const session = normalizeSession(value);
      if (session) sessions[hash] = session;
    }
  }

  const countries: Record<string, CountryBucket> = {};
  if (data.countries && typeof data.countries === "object") {
    for (const [code, value] of Object.entries(data.countries as Record<string, unknown>)) {
      if (!value || typeof value !== "object") continue;
      const bucket = value as Record<string, unknown>;
      const normalized = normalizeCountryCode(code);
      countries[normalized] = {
        visits: Math.max(0, asNumber(bucket.visits)),
        pageviews: Math.max(0, asNumber(bucket.pageviews)),
      };
    }
  }

  return {
    totalPageviews: Math.max(0, asNumber(data.totalPageviews)),
    totalUniques: Math.max(0, asNumber(data.totalUniques)),
    createdAt: typeof data.createdAt === "string" ? data.createdAt : emptyStore().createdAt,
    days,
    sessions,
    countries,
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

function sessionDurationSeconds(session: SessionRecord): number {
  const first = Date.parse(session.firstSeen);
  const last = Date.parse(session.lastSeen);
  if (!Number.isFinite(first) || !Number.isFinite(last)) return 0;
  return Math.max(0, Math.floor((last - first) / 1000));
}

function ensureCountry(store: AnalyticsStore, code: string): CountryBucket {
  const key = normalizeCountryCode(code);
  const existing = store.countries[key];
  if (existing) return existing;
  const created: CountryBucket = { visits: 0, pageviews: 0 };
  store.countries[key] = created;
  return created;
}

function pruneSessions(store: AnalyticsStore): void {
  const entries = Object.entries(store.sessions);
  if (entries.length <= MAX_SESSIONS) return;

  entries.sort((a, b) => a[1].lastSeen.localeCompare(b[1].lastSeen));
  const removeCount = entries.length - MAX_SESSIONS;
  for (let i = 0; i < removeCount; i += 1) {
    const [hash, session] = entries[i];
    delete store.sessions[hash];
    const bucket = store.countries[session.country];
    if (bucket) {
      bucket.visits = Math.max(0, bucket.visits - 1);
      bucket.pageviews = Math.max(0, bucket.pageviews - session.pageviews);
      if (bucket.visits === 0 && bucket.pageviews === 0) {
        delete store.countries[session.country];
      }
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
  country,
  at = new Date(),
}: {
  visitorId: string;
  path: string;
  country?: string;
  at?: Date;
}): void {
  if (!visitorId) return;

  const store = loadStore();
  const todayKey = utcDateKey(at);
  pruneDays(store, todayKey);

  const day = ensureDay(store, todayKey);
  const hash = hashVisitorId(visitorId);
  const iso = at.toISOString();
  const resolvedCountry = normalizeCountryCode(country ?? "ZZ");

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

  const existing = store.sessions[hash];
  if (!existing) {
    store.sessions[hash] = {
      country: resolvedCountry,
      firstSeen: iso,
      lastSeen: iso,
      pageviews: 1,
    };
    const bucket = ensureCountry(store, resolvedCountry);
    bucket.visits += 1;
    bucket.pageviews += 1;
  } else {
    existing.pageviews += 1;
    existing.lastSeen = iso;

    if (resolvedCountry !== "ZZ" && (existing.country === "ZZ" || !existing.country)) {
      const oldCode = existing.country || "ZZ";
      if (oldCode !== resolvedCountry) {
        const oldBucket = store.countries[oldCode];
        if (oldBucket) {
          oldBucket.visits = Math.max(0, oldBucket.visits - 1);
          oldBucket.pageviews = Math.max(0, oldBucket.pageviews - (existing.pageviews - 1));
          if (oldBucket.visits === 0 && oldBucket.pageviews === 0) {
            delete store.countries[oldCode];
          }
        }
        existing.country = resolvedCountry;
        const next = ensureCountry(store, resolvedCountry);
        next.visits += 1;
        next.pageviews += existing.pageviews - 1;
      }
    }

    const bucket = ensureCountry(store, existing.country);
    bucket.pageviews += 1;
  }

  pruneSessions(store);
  saveStore(store);
}

function recordPulseSync({
  visitorId,
  at = new Date(),
}: {
  visitorId: string;
  at?: Date;
}): void {
  if (!visitorId) return;

  const store = loadStore();
  const hash = hashVisitorId(visitorId);
  const session = store.sessions[hash];
  if (!session) return;

  session.lastSeen = at.toISOString();
  pruneSessions(store);
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

  const sessionList = Object.values(store.sessions);
  const durations = sessionList.map(sessionDurationSeconds);
  const lasting = durations.filter((d) => d >= 1);
  const avgSource = lasting.length > 0 ? lasting : durations;
  const avgDurationSeconds =
    avgSource.length === 0
      ? 0
      : Math.round(avgSource.reduce((sum, d) => sum + d, 0) / avgSource.length);

  const countries = Object.entries(store.countries)
    .map(([code, bucket]) => ({
      code,
      visits: bucket.visits,
      pageviews: bucket.pageviews,
    }))
    .sort((a, b) => b.visits - a.visits || b.pageviews - a.pageviews || a.code.localeCompare(b.code))
    .slice(0, TOP_COUNTRIES);

  const recentSessions = Object.values(store.sessions)
    .slice()
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
    .slice(0, RECENT_SESSIONS)
    .map((session) => ({
      country: session.country,
      durationSeconds: sessionDurationSeconds(session),
      pageviews: session.pageviews,
      lastSeen: session.lastSeen,
    }));

  return {
    today: { pageviews: today.pageviews, uniques: today.uniques },
    week,
    allTime: { pageviews: store.totalPageviews, uniques: store.totalUniques },
    since,
    avgDurationSeconds,
    sessionCount: sessionList.length,
    countries,
    recentSessions,
  };
}

export function recordHit(input: {
  visitorId: string;
  path: string;
  country?: string;
  at?: Date;
}): Promise<void> {
  return withLock(() => recordHitSync(input));
}

export function recordPulse(input: { visitorId: string; at?: Date }): Promise<void> {
  return withLock(() => recordPulseSync(input));
}

export function getStats(at?: Date): Promise<AnalyticsStats> {
  return withLock(() => getStatsSync(at));
}

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  if (total < 60) return `${total}s`;
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (remMins === 0 && secs === 0) return `${hours}h`;
  if (secs === 0) return `${hours}h ${remMins}m`;
  return `${hours}h ${remMins}m ${secs}s`;
}
