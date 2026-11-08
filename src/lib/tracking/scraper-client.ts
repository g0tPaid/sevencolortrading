import { ScraperError, type DetectionBody, type TrackBody } from "@/lib/tracking/types";

export type TrackRequest = {
  number: string;
  carrier: string;
  postcode?: string | null;
  phoneLast4?: string | null;
  budgetMs: number;
};

export type ScraperClient = {
  health(): Promise<boolean>;
  detect(number: string): Promise<DetectionBody>;
  track(input: TrackRequest): Promise<TrackBody>;
};

export function scraperBaseUrl(): string {
  const raw = process.env.TRACKING_SCRAPER_BASE_URL?.trim() || "http://127.0.0.1:8080";
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ScraperError("unavailable", 0);
  }
  if (url.username || url.password) throw new ScraperError("unavailable", 0);
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new ScraperError("unavailable", 0);
  if (url.pathname !== "/" && url.pathname !== "") throw new ScraperError("unavailable", 0);
  if (url.search || url.hash) throw new ScraperError("unavailable", 0);
  return url.origin;
}

function budgetMs(): number {
  const raw = Number(process.env.TRACKING_BUDGET_MS ?? "20000");
  if (!Number.isFinite(raw)) return 20_000;
  return Math.min(45_000, Math.max(5_000, Math.round(raw)));
}

function authHeaders(): HeadersInit {
  const token = process.env.TRACKING_SCRAPER_TOKEN?.trim();
  const headers: Record<string, string> = { "content-type": "application/json", accept: "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;
  return headers;
}

async function readHint(response: Response): Promise<{ kind: string; retryAfterMs?: number; field?: string }> {
  const header = response.headers.get("retry-after");
  const headerMs = header && Number.isFinite(Number(header)) ? Number(header) * 1000 : undefined;
  let kind = response.status === 404 ? "not_found" : response.status === 429 ? "rate_limited" : "transport";
  let field: string | undefined;
  try {
    const body = (await response.json()) as { hint?: { kind?: string; retryAfterMs?: number }; field?: string };
    if (body.hint?.kind) kind = body.hint.kind;
    if (typeof body.field === "string") field = body.field;
    const retry = body.hint?.retryAfterMs ?? headerMs;
    return { kind, retryAfterMs: retry, field };
  } catch {
    return { kind, retryAfterMs: headerMs, field };
  }
}

export function liveScraperClient(): ScraperClient {
  return {
    async health() {
      try {
        const response = await fetch(`${scraperBaseUrl()}/health`, {
          method: "GET",
          redirect: "error",
          cache: "no-store",
          signal: AbortSignal.timeout(3_000),
        });
        if (!response.ok) return false;
        const body = (await response.json()) as { ok?: boolean };
        return body.ok === true;
      } catch {
        return false;
      }
    },
    async detect(number) {
      let response: Response;
      try {
        response = await fetch(`${scraperBaseUrl()}/v1/detect`, {
          method: "POST",
          redirect: "error",
          cache: "no-store",
          headers: authHeaders(),
          body: JSON.stringify({ text: number }),
          signal: AbortSignal.timeout(8_000),
        });
      } catch {
        throw new ScraperError("budget", 0);
      }
      if (!response.ok) {
        const hint = await readHint(response);
        throw new ScraperError(hint.kind, response.status, hint.retryAfterMs);
      }
      const body = (await response.json()) as DetectionBody;
      return {
        trackingNumber: String(body.trackingNumber ?? number),
        carrier: String(body.carrier ?? ""),
        confidence: body.confidence === "high" || body.confidence === "low" ? body.confidence : "none",
        candidates: Array.isArray(body.candidates) ? body.candidates.filter((id) => typeof id === "string") : [],
        source: String(body.source ?? "none"),
      };
    },
    async track(input) {
      const payload: Record<string, unknown> = {
        number: input.number,
        carrier: input.carrier,
        budgetMs: input.budgetMs || budgetMs(),
      };
      if (input.postcode) payload.postcode = input.postcode;
      if (input.phoneLast4) payload.phoneDigits = input.phoneLast4;
      let response: Response;
      try {
        response = await fetch(`${scraperBaseUrl()}/v1/track`, {
          method: "POST",
          redirect: "error",
          cache: "no-store",
          headers: authHeaders(),
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout((input.budgetMs || budgetMs()) + 2_000),
        });
      } catch {
        throw new ScraperError("budget", 0);
      }
      if (!response.ok) {
        const hint = await readHint(response);
        const error = new ScraperError(hint.kind, response.status, hint.retryAfterMs);
        if (hint.field) (error as ScraperError & { field?: string }).field = hint.field;
        throw error;
      }
      return (await response.json()) as TrackBody;
    },
  };
}

export function scraperField(error: ScraperError): string | undefined {
  return (error as ScraperError & { field?: string }).field;
}
