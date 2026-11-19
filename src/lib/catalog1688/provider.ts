import { createHmac } from "node:crypto";
import { offerUrl, type CatalogOffer, type CatalogRates, type CatalogResult } from "./model";

const ROOT = "https://gw.open.1688.com/openapi/";
const NAMESPACE = "com.alibaba.fenxiao.crossborder";
const PAGE_SIZE = 20;
const MAX_PAGE = 40;
type JsonObject = Record<string, unknown>;

function object(value: unknown): JsonObject | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function positive(value: unknown): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") return undefined;
  if (typeof value === "string" && !/^\d+(?:\.\d+)?$/.test(value.trim())) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 && n < 1e10 ? n : undefined;
}

function numberOrZero(value: unknown): number | undefined {
  if (value === 0 || value === "0") return 0;
  return positive(value);
}

function idString(value: unknown): string | undefined {
  const id = typeof value === "string" ? value : typeof value === "number" && Number.isSafeInteger(value) ? String(value) : "";
  return /^\d{6,18}$/.test(id) ? id : undefined;
}

export function safeImage(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value.startsWith("//") ? `https:${value}` : value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port &&
      (url.hostname === "alicdn.com" || url.hostname.endsWith(".alicdn.com")) ? url.href : undefined;
  } catch { return undefined; }
}

function priceRange(value: unknown): CatalogOffer["priceCny"] {
  const single = positive(value);
  if (single !== undefined) return { min: single, max: single };
  if (typeof value !== "string") return undefined;
  const range = /^(\d+(?:\.\d+)?)\s*[-~–—]\s*(\d+(?:\.\d+)?)$/.exec(value.trim());
  const min = positive(range?.[1]);
  const max = positive(range?.[2]);
  return min && max && max >= min ? { min, max } : undefined;
}

export function normalizeOffer(value: unknown): CatalogOffer | null {
  const row = object(value);
  if (!row) return null;
  const id = idString(row.offerId);
  const originalTitle = str(row.subject);
  const translated = str(row.subjectTrans);
  if (!id || (!originalTitle && !translated)) return null;
  const price = object(row.priceInfo);
  const image = safeImage(row.imageUrl);
  const moq = positive(row.minOrderQuantity);
  return {
    id,
    title: (translated || originalTitle)!.slice(0, 500),
    ...(translated && originalTitle && translated !== originalTitle ? { originalTitle: originalTitle.slice(0, 500) } : {}),
    ...(image ? { image } : {}),
    url: offerUrl(id),
    priceCny: priceRange(price?.price),
    moq: moq && Number.isInteger(moq) ? moq : undefined,
    monthlySold: numberOrZero(row.monthSold),
    singleUnit: row.isOnePsale === true || row.isOnePsale === "true",
    promotionPriceCny: positive(price?.promotionPrice),
  };
}

/** Restrict traversal to known response envelopes; never accept arbitrary strings as offers. */
export function extractOffers(payload: unknown): CatalogOffer[] {
  const root = object(payload);
  const failed = (code: unknown) => code !== undefined && code !== null && code !== "" && code !== 0 && code !== "0";
  if (!root || root.error || failed(root.errorCode) || root.success === false || root.success === "false") throw new Error("Upstream error");
  const result = object(root.result);
  if (result?.success === false || result?.success === "false" || failed(result?.errorCode)) throw new Error("Upstream error");
  const keys = ["result", "data", "offerList", "products", "list", "items", "offers", "productInfo", "productList", "productDetail"];
  function walk(value: unknown, depth: number): { found: boolean; offers: CatalogOffer[] } {
    if (depth > 5) return { found: false, offers: [] };
    if (Array.isArray(value)) {
      if (!value.length) return { found: true, offers: [] };
      const offers = value.slice(0, 100).map(normalizeOffer).filter((it): it is CatalogOffer => it !== null);
      if (offers.length) return { found: true, offers };
      return { found: false, offers: [] };
    }
    const row = object(value);
    if (!row) return { found: false, offers: [] };
    const offer = normalizeOffer(row);
    if (offer) return { found: true, offers: [offer] };
    for (const key of keys) {
      if (Object.hasOwn(row, key)) {
        const nested = walk(row[key], depth + 1);
        if (nested.found) return nested;
      }
    }
    return { found: false, offers: [] };
  }
  const found = walk(root, 0);
  if (!found.found) throw new Error("Unrecognized offer response");
  return [...new Map(found.offers.map(offer => [offer.id, offer])).values()];
}

type Config = { appKey: string; secret: string; refreshToken?: string; accessToken?: string };

function config(): Config | null {
  if (process.env.ALI1688_PUBLIC_CATALOG_ENABLED !== "true") return null;
  const appKey = process.env.ALI1688_APP_KEY?.trim();
  const secret = process.env.ALI1688_APP_SECRET?.trim();
  const refreshToken = process.env.ALI1688_REFRESH_TOKEN?.trim();
  const accessToken = process.env.ALI1688_ACCESS_TOKEN?.trim();
  if (!appKey || !/^[a-zA-Z0-9_-]{1,100}$/.test(appKey) || !secret || (!refreshToken && !accessToken)) return null;
  return { appKey, secret, refreshToken, accessToken };
}

export function catalogEnabled() { return config() !== null; }

export function sign1688(path: string, params: Record<string, string>, secret: string): string {
  const body = Object.keys(params).filter(k => k !== "_aop_signature").sort().map(k => `${k}${params[k]}`).join("");
  return createHmac("sha1", secret).update(path + body, "utf8").digest("hex").toUpperCase();
}

let tokenCache: { token: string; expires: number } | undefined;
let tokenRefresh: Promise<string> | undefined;

async function accessToken(cfg: Config): Promise<string> {
  if (!cfg.refreshToken) return cfg.accessToken!;
  if (tokenCache && tokenCache.expires > Date.now()) return tokenCache.token;
  if (tokenRefresh) return tokenRefresh;
  tokenRefresh = (async () => {
    const res = await fetch(`${ROOT}param2/1/system.oauth2/getToken/${cfg.appKey}`, {
      method: "POST", cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({ grant_type: "refresh_token", client_id: cfg.appKey, client_secret: cfg.secret, refresh_token: cfg.refreshToken! }),
    });
    if (!res.ok) throw new Error("Authorization unavailable");
    const body = object(await res.json());
    const token = str(body?.access_token);
    if (!token) throw new Error("Authorization unavailable");
    const ttl = positive(body?.expires_in) ?? 3600;
    tokenCache = { token, expires: Date.now() + Math.max(30, Math.min(ttl - 60, 36_000)) * 1000 };
    return token;
  })();
  try { return await tokenRefresh; } finally { tokenRefresh = undefined; }
}

async function call(cfg: Config, method: string, fields: Record<string, string>): Promise<unknown> {
  const path = `param2/1/${NAMESPACE}/${method}/${cfg.appKey}`;
  const params = { ...fields, access_token: await accessToken(cfg) };
  const signature = sign1688(path, params, cfg.secret);
  const res = await fetch(ROOT + path, {
    method: "POST", cache: "no-store", redirect: "error", signal: AbortSignal.timeout(12_000),
    body: new URLSearchParams({ ...params, _aop_signature: signature }),
  });
  if (!res.ok) { if (res.status === 401) tokenCache = undefined; throw new Error("Catalog request failed"); }
  return res.json();
}

async function currencyRates(): Promise<CatalogRates> {
  try {
    const res = await fetch("https://api.frankfurter.dev/v2/rates?base=CNY&quotes=USD,AED", { next: { revalidate: 21600 }, signal: AbortSignal.timeout(4000), redirect: "error" });
    if (!res.ok) return {};
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return {};
    const rates: CatalogRates = {};
    for (const item of data) {
      const row = object(item);
      const rate = positive(row?.rate);
      const quote = row?.quote;
      const date = str(row?.date);
      if (row?.base === "CNY" && (quote === "USD" || quote === "AED") && rate && date && /^\d{4}-\d{2}-\d{2}$/.test(date)) rates[quote] = { rate, date };
    }
    return rates;
  } catch { return {}; }
}

export type Search = { mode: "keyword"; query: string; page: number; sort?: "price-asc" | "price-desc" | "sales-desc" } | { mode: "offer"; id: string } | { mode: "image"; base64: string; page: number };

/** Short-lived process cache for repeat queries. No image data or credentials are cached in search entries. */
const resultsCache = new Map<string, { result: CatalogResult; expiry: number }>();

export async function lookup1688(request: Search): Promise<CatalogResult> {
  const cfg = config();
  if (!cfg) throw new Error("Catalog not configured");
  const page = request.mode === "offer" ? 1 : Math.min(MAX_PAGE, Math.max(1, request.page));
  const cacheKey = request.mode === "image" ? null : JSON.stringify(request);
  const cached = cacheKey && resultsCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) return cached.result;
  let raw: unknown;
  if (request.mode === "offer") {
    raw = await call(cfg, "product.search.queryProductDetail", { detailParams: JSON.stringify({ offerIds: [request.id], country: "en" }) });
  } else if (request.mode === "image") {
    const upload = await call(cfg, "product.image.upload", { uploadImageParam: JSON.stringify({ imageBase64: request.base64 }) });
    const outer = object(upload);
    const result = object(outer?.result);
    const inner = object(result?.result);
    const value = inner?.imageId ?? result?.imageId ?? result?.result ?? outer?.imageId;
    const imageId = typeof value === "string" || typeof value === "number" ? String(value) : "";
    if (!imageId || imageId === "0" || imageId.length > 200) throw new Error("Image search unavailable for this image");
    raw = await call(cfg, "product.search.imageQuery", { searchParams: JSON.stringify({ imageId, country: "en", pageNo: page, pageSize: PAGE_SIZE }) });
  } else {
    const sort = request.sort === "price-asc" ? { price: "asc" } : request.sort === "price-desc" ? { price: "desc" } : request.sort === "sales-desc" ? { monthSold: "desc" } : undefined;
    raw = await call(cfg, "product.search.keywordQuery", { searchParams: JSON.stringify({ keyword: request.query, country: "en", pageNo: page, pageSize: PAGE_SIZE, ...(sort ? { sort: JSON.stringify(sort) } : {}) }) });
  }
  const offers = extractOffers(raw).slice(0, PAGE_SIZE);
  if (request.mode === "offer" && offers.some(offer => offer.id !== request.id)) throw new Error("Offer mismatch");
  const result = { offers, page, hasMore: request.mode !== "offer" && page < MAX_PAGE && offers.length === PAGE_SIZE, rates: offers.length ? await currencyRates() : {}, fetchedAt: new Date().toISOString() };
  if (cacheKey) {
    if (resultsCache.size >= 200) resultsCache.delete(resultsCache.keys().next().value!);
    resultsCache.set(cacheKey, { result, expiry: Date.now() + 2 * 60_000 });
  }
  return result;
}

