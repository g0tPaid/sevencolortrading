import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { createInquiry, listInquiries, type CreateInquiryInput } from "@/lib/inquiries-store";
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

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;

  const inquiries = await listInquiries("visit");
  return NextResponse.json(
    { inquiries },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    const parsed = await request.json();
    if (parsed && typeof parsed === "object") body = parsed as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON", 400);
  }

  if (honeypotFilled(body)) {
    return jsonError("Rejected", 400);
  }

  const name = asString(body.name).slice(0, 120);
  const email = asString(body.email).slice(0, 160);
  const phone = asString(body.phone).slice(0, 40);
  const startDate = asString(body.startDate).slice(0, 40);
  const company = asString(body.company).slice(0, 200);
  const duration = asString(body.duration).slice(0, 40);
  const travelers = asString(body.travelers).slice(0, 20);
  const focus = asString(body.focus).slice(0, 80);
  const notes = asString(body.notes).slice(0, 2000);
  const sourcePath = asString(body.sourcePath).slice(0, 200) || "/visit";

  if (name.length < 2) return jsonError("Name is required", 400);
  if (!looksLikeEmail(email)) return jsonError("A valid email is required", 400);
  if (!looksLikePhone(phone)) return jsonError("A valid WhatsApp / phone number is required", 400);
  if (!startDate) return jsonError("Preferred start date is required", 400);

  const input: CreateInquiryInput = {
    kind: "visit",
    sourcePath,
    name,
    phone,
    email,
    company: company || undefined,
    startDate,
    duration: duration || undefined,
    travelers: travelers || undefined,
    focus: focus || undefined,
    notes: notes || undefined,
    description: notes || undefined,
  };

  const created = await createInquiry(input);
  void notifyInquiry(created).catch((error) => {
    console.error("[inquiries-notify] unexpected", error);
  });

  return NextResponse.json({ ok: true, id: created.id }, { headers: { "Cache-Control": "no-store" } });
}
