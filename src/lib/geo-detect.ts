/** Sync, edge-safe geo / language hints. Safe to import from middleware. */

export const GEO_COUNTRY_COOKIE = "sc_cc";
export const FACTORY_ZH_COOKIE = "sc_factory_zh";
export const GEO_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const COUNTRY_HEADERS = [
  "cf-ipcountry",
  "x-vercel-ip-country",
  "x-country-code",
  "cloudfront-viewer-country",
  "x-appengine-country",
] as const;

export function normalizeCountry(code: string | null | undefined): string | null {
  if (!code) return null;
  const trimmed = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(trimmed) || trimmed === "XX") return null;
  return trimmed;
}

function headerValue(headers: Headers, name: string): string | null {
  return headers.get(name) ?? headers.get(name.toUpperCase());
}

/** Country from CDN / platform headers only. No IP lookup. */
export function countryFromHeaders(headers: Headers): string | null {
  for (const name of COUNTRY_HEADERS) {
    const code = normalizeCountry(headerValue(headers, name));
    if (code) return code;
  }
  return null;
}

export function isChineseLanguageTag(tag: string): boolean {
  const normalized = tag.trim().toLowerCase().split(";")[0]?.trim() ?? "";
  return normalized === "zh" || normalized.startsWith("zh-");
}

/** True when Accept-Language or navigator.languages includes zh / zh-CN / zh-Hans. */
export function prefersChinese(
  input: string | readonly string[] | null | undefined,
): boolean {
  if (!input) return false;
  if (typeof input === "string") {
    return input.split(",").some((part) => isChineseLanguageTag(part));
  }
  return input.some((part) => isChineseLanguageTag(part));
}

export function shouldShowFactoryZh(opts: {
  country?: string | null;
  acceptLanguage?: string | readonly string[] | null;
}): boolean {
  return normalizeCountry(opts.country) === "CN" || prefersChinese(opts.acceptLanguage);
}

export function geoCookieOptions() {
  return {
    path: "/",
    maxAge: GEO_COOKIE_MAX_AGE,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  };
}
