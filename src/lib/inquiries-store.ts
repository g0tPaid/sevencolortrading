import fs from "fs";
import path from "path";

import {
  isInquiryKind,
  type CreateInquiryInput,
  type Inquiry,
  type InquiryFileMeta,
  type InquiryKind,
} from "@/lib/inquiries";

export {
  INQUIRY_KINDS,
  isInquiryKind,
  type CreateInquiryInput,
  type Inquiry,
  type InquiryFileMeta,
  type InquiryKind,
} from "@/lib/inquiries";

const FALLBACK_DIR = "/tmp/sourcing-analytics";
const STORE_FILE = "inquiries.json";
const UPLOAD_DIR = "rfq-uploads";
const MAX_RECORDS = 2000;
const MAX_FILES = 4;
const MAX_FILE_BYTES = 6 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".csv", ".xls", ".xlsx"]);

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
      `[inquiries] data dir "${preferred}" is not writable; falling back to ${FALLBACK_DIR}`,
    );
  }

  fs.mkdirSync(FALLBACK_DIR, { recursive: true });
  resolvedDir = FALLBACK_DIR;
  return resolvedDir;
}

function storePath(): string {
  return path.join(resolveDataDir(), STORE_FILE);
}

function uploadsRoot(): string {
  return path.join(resolveDataDir(), UPLOAD_DIR);
}

function optionalString(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed || undefined;
}

function normalizeFiles(value: unknown): InquiryFileMeta[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out: InquiryFileMeta[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const data = item as Record<string, unknown>;
    const filename = optionalString(data.filename, 160);
    const mime = optionalString(data.mime, 120);
    const size = typeof data.size === "number" && Number.isFinite(data.size) ? Math.max(0, Math.floor(data.size)) : 0;
    if (!filename || !mime) continue;
    out.push({ filename, mime, size });
    if (out.length >= MAX_FILES) break;
  }
  return out.length ? out : undefined;
}

function normalizeInquiry(raw: unknown): Inquiry | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const id = optionalString(data.id, 80);
  const createdAt = optionalString(data.createdAt, 40);
  const name = optionalString(data.name, 120);
  const phone = optionalString(data.phone, 40);
  if (!id || !createdAt || !name || !phone) return null;
  if (!isInquiryKind(data.kind)) return null;

  return {
    id,
    createdAt,
    kind: data.kind,
    sourcePath: optionalString(data.sourcePath, 200) || (data.kind === "visit" ? "/visit" : "/contact"),
    name,
    phone,
    email: optionalString(data.email, 160),
    company: optionalString(data.company, 200),
    description: optionalString(data.description, 4000),
    quantity: optionalString(data.quantity, 80),
    budget: optionalString(data.budget, 80),
    startDate: optionalString(data.startDate, 40),
    duration: optionalString(data.duration, 40),
    travelers: optionalString(data.travelers, 20),
    focus: optionalString(data.focus, 80),
    notes: optionalString(data.notes, 2000),
    files: normalizeFiles(data.files),
  };
}

function loadStore(): Inquiry[] {
  try {
    const raw = fs.readFileSync(storePath(), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const list = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && Array.isArray((parsed as { inquiries?: unknown }).inquiries)
        ? (parsed as { inquiries: unknown[] }).inquiries
        : [];
    const inquiries = list.map(normalizeInquiry).filter((item): item is Inquiry => item !== null);
    inquiries.sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
    return inquiries.slice(0, MAX_RECORDS);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      console.warn("[inquiries] could not read inquiries.json; starting empty");
    }
    return [];
  }
}

function saveStore(inquiries: Inquiry[]): void {
  const file = storePath();
  const tmp = `${file}.tmp`;
  const capped = inquiries.slice(0, MAX_RECORDS);
  fs.writeFileSync(tmp, `${JSON.stringify(capped)}\n`, "utf8");
  fs.renameSync(tmp, file);
}

function safeUploadName(original: string, index: number): string {
  const base = path.basename(original).replace(/[^\w.\-]+/g, "_").slice(0, 80);
  const ext = path.extname(base).toLowerCase();
  const stem = path.basename(base, ext).slice(0, 40) || `file-${index + 1}`;
  const allowedExt = ALLOWED_EXT.has(ext) ? ext : "";
  return `${String(index + 1).padStart(2, "0")}-${stem}${allowedExt}`;
}

export function isAllowedInquiryFile(file: { name: string; type: string; size: number }): boolean {
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) return false;
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return false;
  if (file.type && !ALLOWED_MIME.has(file.type) && file.type !== "application/octet-stream") {
    return false;
  }
  return true;
}

function writeInquiryFilesSync(id: string, files: Array<{ name: string; type: string; size: number; bytes: Buffer }>): InquiryFileMeta[] {
  const dir = path.join(uploadsRoot(), id);
  fs.mkdirSync(dir, { recursive: true });
  const saved: InquiryFileMeta[] = [];
  files.slice(0, MAX_FILES).forEach((file, index) => {
    if (!isAllowedInquiryFile(file)) return;
    const filename = safeUploadName(file.name, index);
    fs.writeFileSync(path.join(dir, filename), file.bytes);
    saved.push({
      filename,
      size: file.size,
      mime: file.type || "application/octet-stream",
    });
  });
  return saved;
}

function createInquirySync(input: CreateInquiryInput): Inquiry {
  const record: Inquiry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    kind: input.kind,
    sourcePath: optionalString(input.sourcePath, 200) || (input.kind === "visit" ? "/visit" : "/contact"),
    name: input.name.trim().slice(0, 120),
    phone: input.phone.trim().slice(0, 40),
    email: optionalString(input.email, 160),
    company: optionalString(input.company, 200),
    description: optionalString(input.description, 4000),
    quantity: optionalString(input.quantity, 80),
    budget: optionalString(input.budget, 80),
    startDate: optionalString(input.startDate, 40),
    duration: optionalString(input.duration, 40),
    travelers: optionalString(input.travelers, 20),
    focus: optionalString(input.focus, 80),
    notes: optionalString(input.notes, 2000),
    files: input.files && input.files.length ? input.files.slice(0, MAX_FILES) : undefined,
  };

  const inquiries = loadStore();
  inquiries.unshift(record);
  saveStore(inquiries);
  return record;
}

export function createInquiry(input: CreateInquiryInput): Promise<Inquiry> {
  return withLock(() => createInquirySync(input));
}

export async function saveInquiryFiles(
  id: string,
  files: Array<{ name: string; type: string; size: number; bytes: Buffer }>,
): Promise<InquiryFileMeta[]> {
  return withLock(() => {
    let saved: InquiryFileMeta[] = [];
    try {
      saved = writeInquiryFilesSync(id, files);
    } catch (error) {
      console.warn("[inquiries] could not write RFQ uploads; keeping text inquiry", error);
      return [];
    }
    if (!saved.length) return [];
    const inquiries = loadStore();
    const index = inquiries.findIndex((item) => item.id === id);
    if (index === -1) return saved;
    inquiries[index] = { ...inquiries[index], files: saved };
    saveStore(inquiries);
    return saved;
  });
}

export function listInquiries(kind?: InquiryKind): Promise<Inquiry[]> {
  return withLock(() => {
    const inquiries = loadStore();
    return kind ? inquiries.filter((item) => item.kind === kind) : inquiries;
  });
}

export const inquiryUploadLimits = {
  maxFiles: MAX_FILES,
  maxFileBytes: MAX_FILE_BYTES,
} as const;
