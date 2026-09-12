import { NextResponse } from "next/server";
import { recordHit, recordPulse } from "@/lib/analytics-store";
import { FACTORY_ZH_COOKIE, GEO_COUNTRY_COOKIE, geoCookieOptions } from "@/lib/geo-detect";
import { resolveCountry } from "@/lib/geo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "sc_vid";
const ONE_YEAR = 60 * 60 * 24 * 365;
const BOT_UA = /bot|crawl|spider|slurp|facebookexternalhit|preview/i;
const IGNORED_PREFIXES = ["/api", "/dashboard", "/admin", "/_next"];

type HitType = "pageview" | "heartbeat" | "leave";

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

function normalizeType(input: unknown): HitType {
  if (input === "heartbeat" || input === "leave" || input === "pageview") return input;
  return "pageview";
}

function isBot(ua: string): boolean {
  return BOT_UA.test(ua);
}

function shouldIgnorePath(path: string): boolean {
  return IGNORED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function mintVisitorId(): string {
  return crypto.randomUUID();
}

export async function POST(request: Request) {
  let path = "/";
  let type: HitType = "pageview";
  try {
    const body = (await request.json()) as { path?: unknown; type?: unknown };
    path = normalizePath(body?.path);
    type = normalizeType(body?.type);
  } catch {
    path = "/";
    type = "pageview";
  }

  const ua = request.headers.get("user-agent") || "";
  if (isBot(ua)) {
    return NextResponse.json({ ok: true });
  }

  if (type === "pageview" && shouldIgnorePath(path)) {
    return NextResponse.json({ ok: true });
  }

  const existing = readCookie(request.headers.get("cookie"), COOKIE);
  const visitorId = existing && existing.length >= 8 ? existing : mintVisitorId();

  let resolvedCountry: string | null = null;
  if (type === "pageview") {
    resolvedCountry = await resolveCountry(request.headers);
    await recordHit({ visitorId, path, country: resolvedCountry });
  } else {
    await recordPulse({ visitorId });
  }

  const response = NextResponse.json({ ok: true });
  if (resolvedCountry && resolvedCountry !== "ZZ") {
    const cookies = geoCookieOptions();
    response.cookies.set({
      name: GEO_COUNTRY_COOKIE,
      value: resolvedCountry,
      ...cookies,
    });
    if (resolvedCountry === "CN") {
      response.cookies.set({ name: FACTORY_ZH_COOKIE, value: "1", ...cookies });
    }
  }
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
