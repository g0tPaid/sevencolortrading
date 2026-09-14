import { NextResponse } from "next/server";
import { createApplication } from "@/lib/factory-applications-store";
import { isPackageId, packageLabels, type PackageId } from "@/lib/factory-growth";
import { notifyFactoryApplication } from "@/lib/factory-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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

function splitLocation(raw: string): { city: string; province: string } {
  const value = raw.replace(/[，]/g, ",").trim();
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      city: parts[0].slice(0, 80),
      province: parts.slice(1).join(", ").slice(0, 80),
    };
  }
  return { city: value.slice(0, 80), province: "China" };
}

function parseProducts(value: string): string[] {
  const parts = value.split(/[,，;；|/]+/).map((part) => part.trim()).filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of parts) {
    const tag = part.slice(0, 80);
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
    if (out.length >= 20) break;
  }
  if (out.length === 0 && value.trim()) out.push(value.trim().slice(0, 80));
  return out;
}

function honeypotFilled(body: Record<string, unknown>): boolean {
  const bait = asString(body.website_url) || asString(body.websiteUrl);
  return bait.length > 0;
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

  const companyName = asString(body.companyName).slice(0, 200);
  const contactName = asString(body.contactName).slice(0, 120);
  const phone = asString(body.phone).slice(0, 40);
  const email = asString(body.email).slice(0, 160);
  const factoryLocation = asString(body.factoryLocation).slice(0, 160);
  const mainProducts = asString(body.mainProducts).slice(0, 400);
  const packageRaw = asString(body.packageId);
  const packageId: PackageId = isPackageId(packageRaw) ? packageRaw : "unsure";

  if (companyName.length < 2) {
    return NextResponse.json({ ok: false, error: "Company / factory name is required" }, { status: 400 });
  }
  if (contactName.length < 2) {
    return NextResponse.json({ ok: false, error: "Contact person is required" }, { status: 400 });
  }
  if (!looksLikePhone(phone)) {
    return NextResponse.json({ ok: false, error: "A valid phone number is required" }, { status: 400 });
  }
  if (!looksLikeEmail(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required" }, { status: 400 });
  }
  if (!factoryLocation) {
    return NextResponse.json({ ok: false, error: "Factory location is required" }, { status: 400 });
  }
  if (!mainProducts) {
    return NextResponse.json({ ok: false, error: "Main products are required" }, { status: 400 });
  }

  const { city, province } = splitLocation(factoryLocation);
  const websiteRaw = asString(body.existingWebsite);
  let alibabaOrWebsite: string | undefined;
  let websiteNote = "";
  if (websiteRaw) {
    alibabaOrWebsite = normalizeUrl(websiteRaw);
    if (!alibabaOrWebsite) {
      websiteNote = `Existing website (unparsed): ${websiteRaw.slice(0, 300)}`;
    }
  }

  const whatsapp = asString(body.whatsapp).slice(0, 40);
  const message = asString(body.message).slice(0, 1500);
  const lang = asString(body.lang) === "zh" ? "zh" : "en";
  const packageLabel = packageLabels[packageId][lang];

  const notes = [
    "Kind: factory-growth inquiry (not a vendor registration)",
    `Package: ${packageLabel}`,
    whatsapp ? `WhatsApp: ${whatsapp}` : "",
    websiteNote,
    message ? `Message: ${message}` : "",
    `Form language: ${lang}`,
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 2000);

  const created = await createApplication({
    companyNameEn: companyName,
    contactName,
    phone,
    wechat: asString(body.wechat).slice(0, 80) || undefined,
    email,
    city,
    province,
    categories: parseProducts(mainProducts),
    alibabaOrWebsite,
    notes,
    sourcePath: "/factory-growth",
  });

  void notifyFactoryApplication(created).catch((error) => {
    console.error("[factory-growth-notify] unexpected", error);
  });

  return NextResponse.json({ ok: true, id: created.id });
}
