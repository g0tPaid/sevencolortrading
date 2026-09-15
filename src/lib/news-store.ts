import { unstable_noStore as noStore } from "next/cache";
import fs from "fs";
import path from "path";

import {
  NEWS_STORE_FILE,
  compareNewsDateDesc,
  isNewsKind,
  seedNewsPosts,
  type NewsFaq,
  type NewsPost,
  type NewsPublishInput,
} from "@/lib/news";

const FALLBACK_DIR = "/tmp/sourcing-analytics";
const MAX_RECORDS = 500;
const MAX_TAGS = 12;
const MAX_PARAS = 24;
const MAX_FAQS = 8;

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
      `[news] data dir "${preferred}" is not writable; falling back to ${FALLBACK_DIR}`,
    );
  }

  fs.mkdirSync(FALLBACK_DIR, { recursive: true });
  resolvedDir = FALLBACK_DIR;
  return resolvedDir;
}

function storePath(): string {
  return path.join(resolveDataDir(), NEWS_STORE_FILE);
}

function optionalString(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed || undefined;
}

function requiredString(value: unknown, max: number): string | undefined {
  return optionalString(value, max);
}

export function isValidNewsSlug(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length >= 3 && value.length <= 80;
}

function normalizeDate(value: unknown): string | undefined {
  const raw = optionalString(value, 40);
  if (!raw) return undefined;
  const day = raw.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return undefined;
  const time = Date.parse(`${day}T00:00:00Z`);
  if (!Number.isFinite(time)) return undefined;
  return day;
}

function normalizeTimestamp(value: unknown): string | undefined {
  const raw = optionalString(value, 40);
  if (!raw) return undefined;
  const time = Date.parse(raw);
  if (!Number.isFinite(time)) return normalizeDate(raw);
  return new Date(time).toISOString();
}

function normalizeTags(value: unknown): string[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[,，;；|]+/)
      : [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const tag = item.trim().slice(0, 40);
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
    if (out.length >= MAX_TAGS) break;
  }
  return out;
}

function normalizeParagraphs(value: unknown): string[] | undefined {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\n{2,}/)
      : [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const para = item.trim().slice(0, 4000);
    if (!para) continue;
    out.push(para);
    if (out.length >= MAX_PARAS) break;
  }
  return out.length > 0 ? out : undefined;
}

function normalizeFaqs(value: unknown): NewsFaq[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out: NewsFaq[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const qEn = optionalString(row.qEn, 200);
    const aEn = optionalString(row.aEn, 800);
    const qZh = optionalString(row.qZh, 200);
    const aZh = optionalString(row.aZh, 800);
    if (!qEn || !aEn || !qZh || !aZh) continue;
    out.push({ qEn, aEn, qZh, aZh });
    if (out.length >= MAX_FAQS) break;
  }
  return out.length > 0 ? out : undefined;
}

function normalizeUrl(value: unknown): string | undefined {
  const trimmed = optionalString(value, 500);
  if (!trimmed) return undefined;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString().slice(0, 500);
  } catch {
    return undefined;
  }
}

export function normalizeNewsPost(raw: unknown): NewsPost | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const slug = optionalString(data.slug, 80);
  if (!isValidNewsSlug(slug)) return null;

  const date = normalizeDate(data.date);
  const titleEn = requiredString(data.titleEn, 180);
  const titleZh = requiredString(data.titleZh, 180);
  const summaryEn = requiredString(data.summaryEn, 500);
  const summaryZh = requiredString(data.summaryZh, 500);
  const takeawayEn = requiredString(data.takeawayEn, 400);
  const takeawayZh = requiredString(data.takeawayZh, 400);
  const sourceName = requiredString(data.sourceName, 120);
  const sourceUrl = normalizeUrl(data.sourceUrl);
  if (!date || !titleEn || !titleZh || !summaryEn || !summaryZh || !takeawayEn || !takeawayZh) {
    return null;
  }
  if (!sourceName || !sourceUrl) return null;

  const kind = isNewsKind(data.kind) ? data.kind : "brief";
  const updatedAt = normalizeTimestamp(data.updatedAt);

  return {
    slug,
    date,
    kind,
    titleEn,
    titleZh,
    summaryEn,
    summaryZh,
    takeawayEn,
    takeawayZh,
    sourceName,
    sourceUrl,
    tags: normalizeTags(data.tags),
    bodyEn: normalizeParagraphs(data.bodyEn),
    bodyZh: normalizeParagraphs(data.bodyZh),
    faqs: normalizeFaqs(data.faqs),
    updatedAt,
  };
}

function loadVolumePosts(): NewsPost[] {
  try {
    const raw = fs.readFileSync(storePath(), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const list = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && Array.isArray((parsed as { posts?: unknown }).posts)
        ? (parsed as { posts: unknown[] }).posts
        : [];
    return list.map(normalizeNewsPost).filter((item): item is NewsPost => item !== null);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      console.warn("[news] could not read news-posts.json; using seed only");
    }
    return [];
  }
}

function saveVolumePosts(posts: NewsPost[]): void {
  const file = storePath();
  const tmp = `${file}.tmp`;
  const capped = posts.slice(0, MAX_RECORDS);
  fs.writeFileSync(tmp, `${JSON.stringify({ posts: capped }, null, 2)}\n`, "utf8");
  fs.renameSync(tmp, file);
}

function mergePosts(volume: NewsPost[]): NewsPost[] {
  const bySlug = new Map<string, NewsPost>();
  for (const post of seedNewsPosts) bySlug.set(post.slug, post);
  for (const post of volume) bySlug.set(post.slug, post);
  return Array.from(bySlug.values()).sort(compareNewsDateDesc).slice(0, MAX_RECORDS);
}

function listNewsSync(): NewsPost[] {
  return mergePosts(loadVolumePosts());
}

function getNewsPostSync(slug: string): NewsPost | null {
  return listNewsSync().find((post) => post.slug === slug) ?? null;
}

function upsertNewsPostSync(input: NewsPublishInput): NewsPost {
  const normalized = normalizeNewsPost({
    ...input,
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  });
  if (!normalized) {
    throw new Error("Invalid news post");
  }

  const volume = loadVolumePosts();
  const index = volume.findIndex((post) => post.slug === normalized.slug);
  if (index === -1) {
    volume.unshift(normalized);
  } else {
    volume[index] = normalized;
  }
  volume.sort(compareNewsDateDesc);
  saveVolumePosts(volume);
  return normalized;
}

export function listNews(): Promise<NewsPost[]> {
  noStore();
  return withLock(() => listNewsSync());
}

export function getNewsPost(slug: string): Promise<NewsPost | null> {
  noStore();
  return withLock(() => getNewsPostSync(slug));
}

export function upsertNewsPost(input: NewsPublishInput): Promise<NewsPost> {
  return withLock(() => upsertNewsPostSync(input));
}
