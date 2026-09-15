import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  createInquiry,
  inquiryUploadLimits,
  isAllowedInquiryFile,
  listInquiries,
  saveInquiryFiles,
  type CreateInquiryInput,
} from "@/lib/inquiries-store";
import { notifyInquiry } from "@/lib/inquiries-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asString(value: unknown): string {
  return typeof value !== "string" && typeof value !== "number" ? "" : String(value).trim();
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 160;
}

function looksLikePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 20 && value.length <= 40;
}

function honeypotFilled(body: Record<string, unknown>): boolean {
  const bait = asString(body.website_url) || asString(body.websiteUrl);
  return bait.length > 0;
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store" } });
}

async function parseBody(request: Request): Promise<{
  fields: Record<string, unknown>;
  files: Array<{ name: string; type: string; size: number; bytes: Buffer }>;
}> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const fields: Record<string, unknown> = {};
    const files: Array<{ name: string; type: string; size: number; bytes: Buffer }> = [];
    for (const [key, value] of form.entries()) {
      if (typeof value === "string") {
        fields[key] = value;
        continue;
      }
      if (key !== "files" && key !== "file") continue;
      const blob = value as File;
      if (!blob.size) continue;
      const bytes = Buffer.from(await blob.arrayBuffer());
      files.push({
        name: blob.name || "upload",
        type: blob.type || "application/octet-stream",
        size: blob.size,
        bytes,
      });
    }
    return { fields, files };
  }

  const parsed = await request.json();
  if (!parsed || typeof parsed !== "object") {
    throw new Error("invalid");
  }
  return { fields: parsed as Record<string, unknown>, files: [] };
}

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;

  const inquiries = await listInquiries("rfq");
  return NextResponse.json(
    { inquiries },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  let fields: Record<string, unknown> = {};
  let files: Array<{ name: string; type: string; size: number; bytes: Buffer }> = [];
  try {
    const parsed = await parseBody(request);
    fields = parsed.fields;
    files = parsed.files;
  } catch {
    return jsonError("Invalid request body", 400);
  }

  if (honeypotFilled(fields)) {
    return jsonError("Rejected", 400);
  }

  const name = asString(fields.name).slice(0, 120);
  const phone = asString(fields.whatsapp) || asString(fields.phone);
  const description = asString(fields.description).slice(0, 4000);
  const email = asString(fields.email).slice(0, 160);
  const quantity = asString(fields.quantity).slice(0, 80);
  const budget = asString(fields.budget).slice(0, 80);
  const sourcePath = asString(fields.sourcePath).slice(0, 200) || "/contact";

  if (name.length < 2) return jsonError("Name is required", 400);
  if (!looksLikePhone(phone)) return jsonError("A valid WhatsApp / phone number is required", 400);
  if (description.length < 8) return jsonError("Product description is required", 400);
  if (email && !looksLikeEmail(email)) return jsonError("Email is invalid", 400);

  const acceptedFiles = files.filter(isAllowedInquiryFile).slice(0, inquiryUploadLimits.maxFiles);

  const input: CreateInquiryInput = {
    kind: "rfq",
    sourcePath,
    name,
    phone: phone.slice(0, 40),
    email: email || undefined,
    description,
    quantity: quantity || undefined,
    budget: budget || undefined,
  };

  const created = await createInquiry(input);
  if (acceptedFiles.length) {
    const saved = await saveInquiryFiles(created.id, acceptedFiles);
    if (saved.length) created.files = saved;
  }

  void notifyInquiry(created).catch((error) => {
    console.error("[inquiries-notify] unexpected", error);
  });

  return NextResponse.json({ ok: true, id: created.id }, { headers: { "Cache-Control": "no-store" } });
}
