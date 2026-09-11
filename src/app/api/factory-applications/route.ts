import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { createApplication, listApplications } from "@/lib/factory-applications-store";
import {
  isExportExperience,
  type CreateApplicationInput,
} from "@/lib/factory-applications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseCategories(value: unknown): string[] {
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

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 160;
}

function looksLikePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 20 && value.length <= 40;
}

function normalizeUrl(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString().slice(0, 400);
  } catch {
    return undefined;
  }
}

function honeypotFilled(body: Record<string, unknown>): boolean {
  const bait = asString(body.website_url) || asString(body.websiteUrl);
  return bait.length > 0;
}

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;

  const applications = await listApplications();
  return NextResponse.json(
    { applications },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    const parsed = await request.json();
    if (parsed && typeof parsed === "object") body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (honeypotFilled(body)) {
    return NextResponse.json({ ok: false, error: "Rejected" }, { status: 400 });
  }

  const companyNameEn = asString(body.companyNameEn).slice(0, 200);
  const contactName = asString(body.contactName).slice(0, 120);
  const phone = asString(body.phone).slice(0, 40);
  const email = asString(body.email).slice(0, 160);
  const city = asString(body.city).slice(0, 80);
  const province = asString(body.province).slice(0, 80);
  const categories = parseCategories(body.categories);

  if (companyNameEn.length < 2) {
    return NextResponse.json({ ok: false, error: "Company name is required" }, { status: 400 });
  }
  if (contactName.length < 2) {
    return NextResponse.json({ ok: false, error: "Contact name is required" }, { status: 400 });
  }
  if (!looksLikePhone(phone)) {
    return NextResponse.json({ ok: false, error: "A valid phone number is required" }, { status: 400 });
  }
  if (!looksLikeEmail(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required" }, { status: 400 });
  }
  if (!city) {
    return NextResponse.json({ ok: false, error: "City is required" }, { status: 400 });
  }
  if (!province) {
    return NextResponse.json({ ok: false, error: "Province is required" }, { status: 400 });
  }
  if (categories.length === 0) {
    return NextResponse.json({ ok: false, error: "At least one category is required" }, { status: 400 });
  }

  const exportRaw = asString(body.exportExperience);
  const exportExperience = isExportExperience(exportRaw) ? exportRaw : undefined;

  const websiteRaw = asString(body.alibabaOrWebsite);
  let alibabaOrWebsite: string | undefined;
  if (websiteRaw) {
    alibabaOrWebsite = normalizeUrl(websiteRaw);
    if (!alibabaOrWebsite) {
      return NextResponse.json({ ok: false, error: "Website / Alibaba URL is invalid" }, { status: 400 });
    }
  }

  const input: CreateApplicationInput = {
    companyNameEn,
    companyNameZh: asString(body.companyNameZh).slice(0, 200) || undefined,
    contactName,
    phone,
    wechat: asString(body.wechat).slice(0, 80) || undefined,
    email,
    city,
    province,
    categories,
    moq: asString(body.moq).slice(0, 80) || undefined,
    exportExperience,
    licenseNumber: asString(body.licenseNumber).slice(0, 40) || undefined,
    alibabaOrWebsite,
    notes: asString(body.notes).slice(0, 2000) || undefined,
    sourcePath: asString(body.sourcePath).slice(0, 200) || "/factories/register",
  };

  const created = await createApplication(input);
  return NextResponse.json({ ok: true, id: created.id });
}
