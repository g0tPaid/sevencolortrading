import { getSessionFromCookies } from "@/lib/admin-auth-edge";
import { MSG } from "@/lib/tracking/messages";
import { TrackingInputError } from "@/lib/tracking/types";

export function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function requireAdmin(
  request: Request,
): Promise<{ ok: true; user: string } | { ok: false; response: Response }> {
  const session = await getSessionFromCookies(request.headers.get("cookie"));
  if (!session) return { ok: false, response: json({ ok: false, error: MSG.unauthorized }, 401) };
  return { ok: true, user: session.u };
}

export function sameOrigin(request: Request): boolean {
  const hostHeader = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(",")[0]!
    .trim()
    .toLowerCase();
  if (!hostHeader) return false;
  const origin = request.headers.get("origin") ?? request.headers.get("referer");
  if (!origin) return false;
  try {
    return new URL(origin).host.toLowerCase() === hostHeader;
  } catch {
    return false;
  }
}

export function clientKey(request: Request): string {
  const hops = Number(process.env.TRACKING_TRUSTED_PROXY_HOPS ?? "1");
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded || !Number.isFinite(hops) || hops <= 0) return "unknown";
  const parts = forwarded
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const index = parts.length - hops;
  return parts[index] ?? "unknown";
}

export async function readJson(request: Request, maxBytes: number): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (text.length > maxBytes) throw new TrackingInputError("Request is too large.");
  const type = request.headers.get("content-type") ?? "";
  if (text && !type.toLowerCase().includes("application/json") && !type.toLowerCase().includes("text/csv")) {
    throw new TrackingInputError("Send JSON.");
  }
  if (!text) return {};
  if (type.toLowerCase().includes("text/csv")) return { csv: text };
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new TrackingInputError("Send JSON.");
    }
    return parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof TrackingInputError) throw error;
    throw new TrackingInputError("Send JSON.");
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof TrackingInputError) return json({ ok: false, error: error.message }, 400);
  console.error("[tracking]", error instanceof Error ? error.name : "error");
  return json({ ok: false, error: MSG.generic }, 500);
}
