import { NextResponse } from "next/server";
import { recordHit } from "@/lib/analytics-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "sc_vid";
const ONE_YEAR = 60 * 60 * 24 * 365;
const BOT_UA = /bot|crawl|spider|slurp|facebookexternalhit|preview/i;
const IGNORED_PREFIXES = ["/api", "/dashboard", "/admin", "/_next"];

function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey === name) return rest.join("=") || undefined;
  }
  return undefined;
}

function normalizePath(input: unknown): string {
  if (typeof input !== "string" || !input.trim()) return "/";
  let value = input.trim();
  try {
    if (/^https?:\/\//i.test(value)) value = new URL(value).pathname || "/";
  } catch {
    // keep as-is
  }
  const path = value.split("?")[0].split("#")[0] || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function shouldIgnore(path: string, ua: string): boolean {
  if (BOT_UA.test(ua)) return true;
  return IGNORED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function mintVisitorId(): string {
  return crypto.randomUUID();
}

export async function POST(request: Request) {
  let path = "/";
  try {
    const body = (await request.json()) as { path?: unknown };
    path = normalizePath(body?.path);
  } catch {
    path = "/";
  }

  const ua = request.headers.get("user-agent") || "";
  if (shouldIgnore(path, ua)) {
    return NextResponse.json({ ok: true });
  }

  const existing = readCookie(request.headers.get("cookie"), COOKIE);
  const visitorId = existing && existing.length >= 8 ? existing : mintVisitorId();

  await recordHit({ visitorId, path });

  const response = NextResponse.json({ ok: true });
  if (!existing || existing !== visitorId) {
    response.cookies.set({
      name: COOKIE,
      value: visitorId,
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
  }
  return response;
}
