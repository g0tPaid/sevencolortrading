export type CatalogOffer = {
  id: string;
  title: string;
  originalTitle?: string;
  image?: string;
  url: string;
  priceCny?: { min: number; max: number };
  moq?: number;
  monthlySold?: number;
  singleUnit?: boolean;
  promotionPriceCny?: number;
};

export type CatalogRates = Partial<Record<"USD" | "AED", { rate: number; date: string }>>;

export type CatalogResult = {
  offers: CatalogOffer[];
  page: number;
  hasMore: boolean;
  rates: CatalogRates;
  fetchedAt: string;
};

/** Never follow a pasted URL on the server; only extract the canonical offer ID. */
export function parseOfferId(value: string): string | null {
  const trimmed = value.trim();
  if (/^\d{6,18}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    if (url.hostname !== "detail.1688.com" && url.hostname !== "m.1688.com") return null;
    return /^\/offer\/(\d{6,18})\.html\/?$/.exec(url.pathname)?.[1] ?? null;
  } catch {
    return null;
  }
}

export function offerUrl(id: string) {
  return `https://detail.1688.com/offer/${id}.html`;
}

export function formatOfferPrice(range: CatalogOffer["priceCny"], currency: "CNY" | "USD" | "AED", rates: CatalogRates) {
  if (!range) return null;
  const rate = currency === "CNY" ? 1 : rates[currency]?.rate;
  if (!rate) return null;
  const display = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 });
  const min = display.format(range.min * rate);
  const max = display.format(range.max * rate);
  return min === max ? min : `${min} – ${max}`;
}

