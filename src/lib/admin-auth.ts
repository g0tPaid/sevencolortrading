/**
 * Admin auth for the dashboard (no NextAuth).
 *
 * Required env (production):
 * - ADMIN_USERNAME
 * - ADMIN_PASSWORD
 *
 * Optional:
 * - ADMIN_SESSION_SECRET: HMAC key for session cookies; if unset, a stable key
 *   is derived from ADMIN_PASSWORD + a fixed app salt (see admin-auth-edge.ts).
 *   Prefer setting ADMIN_SESSION_SECRET explicitly.
 *
 * Dev fallback: if username/password unset and NODE_ENV !== "production",
 * accepts admin / admin (console.warn once).
 */

import { timingSafeEqual } from "crypto";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  clearedSessionCookieHeader,
  createSessionToken,
  getSessionFromCookies,
  sessionCookieHeader,
  sessionCookieOptions,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/admin-auth-edge";

export {
  ADMIN_SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  clearedSessionCookieHeader,
  createSessionToken,
  getSessionFromCookies,
  sessionCookieHeader,
  sessionCookieOptions,
  verifySessionToken,
};
export type { SessionPayload };

let warnedDevFallback = false;

export type AdminCredentialsConfig =
  | { configured: true; username: string; password: string; source: "env" | "dev-fallback" }
  | { configured: false; reason: string };

export function getAdminCredentialsConfig(): AdminCredentialsConfig {
  const username = process.env.ADMIN_USERNAME?.trim() ?? "";
  const password = process.env.ADMIN_PASSWORD?.trim() ?? "";
  const isProd = process.env.NODE_ENV === "production";

  if (username && password) {
    return { configured: true, username, password, source: "env" };
  }

  if (isProd) {
    return {
      configured: false,
      reason: "Admin credentials not configured",
    };
  }

  if (!warnedDevFallback) {
    warnedDevFallback = true;
    console.warn(
      "[admin-auth] ADMIN_USERNAME/ADMIN_PASSWORD unset. Using dev fallback admin/admin. Set env vars for production.",
    );
  }
  return { configured: true, username: "admin", password: "admin", source: "dev-fallback" };
}

function safeEqualString(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) {
    // Spend roughly constant work on length mismatch
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
}

export function verifyCredentials(username: string, password: string): {
  ok: boolean;
  error?: string;
  user?: string;
} {
  const config = getAdminCredentialsConfig();
  if (!config.configured) {
    return { ok: false, error: config.reason };
  }

  const userOk = safeEqualString(username, config.username);
  const passOk = safeEqualString(password, config.password);
  if (!userOk || !passOk) {
    return { ok: false, error: "Invalid username or password" };
  }
  return { ok: true, user: config.username };
}

/** Defense-in-depth helper for Route Handlers. */
export async function requireAdminSession(
  request: Request,
): Promise<{ ok: true; session: SessionPayload } | { ok: false; response: Response }> {
  const session = await getSessionFromCookies(request.headers.get("cookie"));
  if (!session) {
    return {
      ok: false,
      response: Response.json(
        { ok: false, error: "Unauthorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }
  return { ok: true, session };
}
