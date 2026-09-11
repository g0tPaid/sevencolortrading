/**
 * Edge-compatible admin session helpers (Web Crypto).
 * Used by middleware and shared by Node route handlers via admin-auth.ts.
 *
 * Env:
 * - ADMIN_SESSION_SECRET (recommended) — HMAC key for session tokens
 * - ADMIN_PASSWORD — used only to derive a fallback key when SESSION_SECRET is unset
 *
 * Prefer setting ADMIN_SESSION_SECRET in production so rotating the password
 * does not invalidate/re-derive session keys unexpectedly.
 */

export const ADMIN_SESSION_COOKIE = "sc_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // ~7 days

const APP_SALT = "sourcing.center/admin-session/v1";

export type SessionPayload = {
  u: string;
  exp: number; // unix seconds
};

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  const b64 =
    typeof btoa === "function"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const b64 = padded + pad;
  if (typeof atob === "function") {
    const binary = atob(b64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  }
  return new Uint8Array(Buffer.from(b64, "base64"));
}

function textEncoder(): TextEncoder {
  return new TextEncoder();
}

async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return new Uint8Array(digest);
}

/** Resolve HMAC key material from env (stable across Edge + Node). */
export async function getSessionSecretBytes(): Promise<Uint8Array> {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicit) {
    return textEncoder().encode(explicit);
  }
  const password = process.env.ADMIN_PASSWORD?.trim() ?? "";
  // Derive a stable key from password + fixed app salt when SESSION_SECRET is missing.
  // Documented: set ADMIN_SESSION_SECRET explicitly in production when possible.
  const material = textEncoder().encode(`${password}:${APP_SALT}`);
  return sha256(material);
}

async function importHmacKey(secret: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    secret as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function hmacSign(secret: Uint8Array, message: string): Promise<Uint8Array> {
  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, textEncoder().encode(message));
  return new Uint8Array(sig);
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

export async function createSessionToken(
  username: string,
  ttlSeconds: number = SESSION_TTL_SECONDS,
): Promise<string> {
  const payload: SessionPayload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const body = base64UrlEncode(textEncoder().encode(JSON.stringify(payload)));
  const secret = await getSessionSecretBytes();
  const sig = base64UrlEncode(await hmacSign(secret, body));
  return `${body}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;

  try {
    const secret = await getSessionSecretBytes();
    const expected = await hmacSign(secret, body);
    const provided = base64UrlDecode(sig);
    if (!timingSafeEqualBytes(expected, provided)) return null;

    const json = new TextDecoder().decode(base64UrlDecode(body));
    const payload = JSON.parse(json) as SessionPayload;
    if (!payload || typeof payload.u !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.u) return null;
    return payload;
  } catch {
    return null;
  }
}

export function parseCookieHeader(cookieHeader: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(value);
    } catch {
      out[key] = value;
    }
  }
  return out;
}

export async function getSessionFromCookies(
  cookieHeader: string | null | undefined,
): Promise<SessionPayload | null> {
  const cookies = parseCookieHeader(cookieHeader);
  const token = cookies[ADMIN_SESSION_COOKIE];
  if (!token) return null;
  return verifySessionToken(token);
}

export function sessionCookieOptions(maxAge: number = SESSION_TTL_SECONDS): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

/** Serialize Set-Cookie for clearing the session. */
export function clearedSessionCookieHeader(): string {
  const opts = sessionCookieOptions(0);
  const parts = [
    `${ADMIN_SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}

export function sessionCookieHeader(token: string): string {
  const opts = sessionCookieOptions();
  const parts = [
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}`,
    `Path=${opts.path}`,
    "HttpOnly",
    `SameSite=Lax`,
    `Max-Age=${opts.maxAge}`,
  ];
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}
