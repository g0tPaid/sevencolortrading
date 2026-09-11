import fs from "fs";
import path from "path";

import {
  isApplicationStatus,
  isExportExperience,
  type ApplicationStatus,
  type CreateApplicationInput,
  type FactoryApplication,
} from "@/lib/factory-applications";

export {
  APPLICATION_STATUSES,
  isApplicationStatus,
  type ApplicationStatus,
  type CreateApplicationInput,
  type ExportExperience,
  type FactoryApplication,
} from "@/lib/factory-applications";

const FALLBACK_DIR = "/tmp/sourcing-analytics";
const STORE_FILE = "factory-applications.json";
const MAX_RECORDS = 2000;

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
      `[factory-applications] data dir "${preferred}" is not writable; falling back to ${FALLBACK_DIR}`,
    );
  }

  fs.mkdirSync(FALLBACK_DIR, { recursive: true });
  resolvedDir = FALLBACK_DIR;
  return resolvedDir;
}

function storePath(): string {
  return path.join(resolveDataDir(), STORE_FILE);
}

function optionalString(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed || undefined;
}

function normalizeCategories(value: unknown): string[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[,，;；|]+/)
      : [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const tag = item.trim().slice(0, 80);
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
    if (out.length >= 20) break;
  }
  return out;
}

function normalizeApplication(raw: unknown): FactoryApplication | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;

  const companyNameEn = optionalString(data.companyNameEn, 200);
  const contactName = optionalString(data.contactName, 120);
  const phone = optionalString(data.phone, 40);
  const email = optionalString(data.email, 160);
  const city = optionalString(data.city, 80);
  const province = optionalString(data.province, 80);
  const categories = normalizeCategories(data.categories);
  const id = optionalString(data.id, 80);
  const createdAt = optionalString(data.createdAt, 40);

  if (!companyNameEn || !contactName || !phone || !email || !city || !province || !id || !createdAt) {
    return null;
  }
  if (categories.length === 0) return null;

  const exportExperience = isExportExperience(data.exportExperience) ? data.exportExperience : undefined;

  const status: ApplicationStatus = isApplicationStatus(data.status) ? data.status : "pending";

  return {
    id,
    createdAt,
    status,
    sourcePath: optionalString(data.sourcePath, 200) || "/factories/register",
    companyNameEn,
    companyNameZh: optionalString(data.companyNameZh, 200),
    contactName,
    phone,
    wechat: optionalString(data.wechat, 80),
    email,
    city,
    province,
    categories,
    moq: optionalString(data.moq, 80),
    exportExperience,
    licenseNumber: optionalString(data.licenseNumber, 40),
    alibabaOrWebsite: optionalString(data.alibabaOrWebsite, 400),
    notes: optionalString(data.notes, 2000),
  };
}

function loadStore(): FactoryApplication[] {
  try {
    const raw = fs.readFileSync(storePath(), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const list = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && Array.isArray((parsed as { applications?: unknown }).applications)
        ? (parsed as { applications: unknown[] }).applications
        : [];
    const applications = list
      .map(normalizeApplication)
      .filter((item): item is FactoryApplication => item !== null);
    applications.sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
    return applications.slice(0, MAX_RECORDS);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      console.warn("[factory-applications] could not read factory-applications.json; starting empty");
    }
    return [];
  }
}

function saveStore(applications: FactoryApplication[]): void {
  const file = storePath();
  const tmp = `${file}.tmp`;
  const capped = applications.slice(0, MAX_RECORDS);
  fs.writeFileSync(tmp, `${JSON.stringify(capped)}\n`, "utf8");
  fs.renameSync(tmp, file);
}

function createApplicationSync(input: CreateApplicationInput): FactoryApplication {
  const categories = normalizeCategories(input.categories);
  const record: FactoryApplication = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
    sourcePath: optionalString(input.sourcePath, 200) || "/factories/register",
    companyNameEn: input.companyNameEn.trim().slice(0, 200),
    companyNameZh: optionalString(input.companyNameZh, 200),
    contactName: input.contactName.trim().slice(0, 120),
    phone: input.phone.trim().slice(0, 40),
    wechat: optionalString(input.wechat, 80),
    email: input.email.trim().slice(0, 160),
    city: input.city.trim().slice(0, 80),
    province: input.province.trim().slice(0, 80),
    categories,
    moq: optionalString(input.moq, 80),
    exportExperience: isExportExperience(input.exportExperience) ? input.exportExperience : undefined,
    licenseNumber: optionalString(input.licenseNumber, 40),
    alibabaOrWebsite: optionalString(input.alibabaOrWebsite, 400),
    notes: optionalString(input.notes, 2000),
  };

  const applications = loadStore();
  applications.unshift(record);
  saveStore(applications);
  return record;
}

function listApplicationsSync(): FactoryApplication[] {
  return loadStore();
}

function updateApplicationStatusSync(id: string, status: ApplicationStatus): FactoryApplication | null {
  const applications = loadStore();
  const index = applications.findIndex((item) => item.id === id);
  if (index === -1) return null;
  applications[index] = { ...applications[index], status };
  saveStore(applications);
  return applications[index];
}

export function createApplication(input: CreateApplicationInput): Promise<FactoryApplication> {
  return withLock(() => createApplicationSync(input));
}

export function listApplications(): Promise<FactoryApplication[]> {
  return withLock(() => listApplicationsSync());
}

export function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<FactoryApplication | null> {
  return withLock(() => updateApplicationStatusSync(id, status));
}
