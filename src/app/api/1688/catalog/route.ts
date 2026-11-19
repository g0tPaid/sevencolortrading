import { NextResponse } from "next/server";
import { catalogEnabled, lookup1688, type Search } from "@/lib/catalog1688/provider";
import { parseOfferId } from "@/lib/catalog1688/model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const windowMs = 60_000;
const MAX_BODY = 420_000;
const buckets = new Map<string, { count: number; until: number }>();
let globalBucket = { count: 0, until: 0 };

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function allowed(request: Request, cost: number) {
  const now = Date.now();
  // A global per-process cap protects the upstream quota even if proxy headers are spoofed.
  if (globalBucket.until <= now) globalBucket = { count: 0, until: now + windowMs };
  const key = (request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",").at(-1) || "unknown").trim().slice(0, 100);
  if (buckets.size > 1000) for (const [id, bucket] of buckets) if (bucket.until <= now) buckets.delete(id);
  if (buckets.size >= 2000 && !buckets.has(key)) return false;
  const existing = buckets.get(key);
  const next = existing && existing.until > now ? existing : { count: 0, until: now + windowMs };
  if (next.count + cost > 12 || globalBucket.count + cost > 60) return false;
  next.count += cost;
  globalBucket.count += cost;
  buckets.set(key, next);
  return true;
}

async function run(request: Request, search: Search) {
  if (!catalogEnabled()) return json({ ok: false, code: "NOT_CONNECTED", message: "Live catalog access is not connected yet. Send our China sourcing desk your product brief, 1688 link or photo for a quote." }, 503);
  if (!allowed(request, search.mode === "image" ? 2 : 1)) return json({ ok: false, code: "RATE_LIMIT", message: "Please wait a moment before searching again." }, 429);
  try {
    const result = await lookup1688(search);
    return json({ ok: true, ...result });
  } catch {
    // No raw provider errors, API keys, or authorization details are returned to browsers.
    return json({ ok: false, code: "CATALOG_UNAVAILABLE", message: "The catalog could not return verified results. Try again or request a quote from the sourcing desk." }, 502);
  }
}

function pageNumber(value: string | null) {
  const parsed = Number(value ?? "1");
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 40 ? parsed : 1;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (params.get("mode") === "status") return json({ ok: true, connected: catalogEnabled() });
  if (params.get("mode") === "offer") {
    const id = parseOfferId(params.get("q") ?? "");
    if (!id) return json({ ok: false, message: "Paste a full 1688 product link or numeric offer ID." }, 400);
    return run(request, { mode: "offer", id });
  }
  const query = (params.get("q") ?? "").replace(/\s+/g, " ").trim();
  if (query.length < 2 || query.length > 100) return json({ ok: false, message: "Enter a product keyword between 2 and 100 characters." }, 400);
  const sort = params.get("sort");
  return run(request, { mode: "keyword", query, page: pageNumber(params.get("page")), ...(sort === "price-asc" || sort === "price-desc" || sort === "sales-desc" ? { sort } : {}) });
}

async function readBody(request: Request) {
  const length = Number(request.headers.get("content-length"));
  if (length > MAX_BODY || !request.body) throw new Error("Invalid body");
  const reader = request.body.getReader();
  let total = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const next = await reader.read();
    if (next.done) break;
    total += next.value.byteLength;
    if (total > MAX_BODY) { await reader.cancel(); throw new Error("Image too large"); }
    chunks.push(next.value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export async function POST(request: Request) {
  if (!catalogEnabled()) return json({ ok: false, code: "NOT_CONNECTED", message: "Live image search is not connected yet. Send a photo using the sourcing request form." }, 503);
  try {
    const body = await readBody(request) as { image?: unknown; consent?: unknown };
    if (body.consent !== true || typeof body.image !== "string" || !/^[a-zA-Z0-9+/]+={0,2}$/.test(body.image) || body.image.length % 4 !== 0) throw new Error("Invalid image");
    const bytes = Buffer.from(body.image, "base64");
    // Client normalizes photos to JPEG, and oversized files are rejected before contacting 1688.
    if (bytes.length < 4 || bytes.length > 300_000 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff || bytes.at(-2) !== 0xff || bytes.at(-1) !== 0xd9) throw new Error("Invalid image");
    return run(request, { mode: "image", base64: body.image, page: 1 });
  } catch {
    return json({ ok: false, message: "Choose a valid product image, consent to send it to 1688, or use the sourcing request form." }, 400);
  }
}

