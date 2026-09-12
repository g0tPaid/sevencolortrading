import { countryFromHeaders, normalizeCountry } from "@/lib/geo-detect";

const PRIVATE_IP =
  /^(?:127\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|::1$|fc|fd|fe80)/i;

const countryCache = new Map<string, string>();

export { countryFromHeaders, normalizeCountry } from "@/lib/geo-detect";

function firstForwardedIp(header: string | null): string | null {
  if (!header) return null;
  const first = header.split(",")[0]?.trim();
  return first || null;
}

function clientIpFromHeaders(headers: Headers): string | null {
  const forwarded = firstForwardedIp(headers.get("x-forwarded-for"));
  if (forwarded) return forwarded;
  const real = headers.get("x-real-ip")?.trim();
  return real || null;
}

function isPrivateIp(ip: string): boolean {
  const cleaned = ip.replace(/^\[|\]$/g, "");
  if (cleaned.includes(":")) {
    const lower = cleaned.toLowerCase();
    if (lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80")) {
      return true;
    }
  }
  return PRIVATE_IP.test(cleaned);
}

async function lookupCountryCode(ip: string): Promise<string> {
  const cached = countryCache.get(ip);
  if (cached) return cached;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);

  try {
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/country_code/`, {
      method: "GET",
      headers: { Accept: "text/plain" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      countryCache.set(ip, "ZZ");
      return "ZZ";
    }
    const text = (await res.text()).trim();
    const code = normalizeCountry(text) ?? "ZZ";
    countryCache.set(ip, code);
    return code;
  } catch {
    countryCache.set(ip, "ZZ");
    return "ZZ";
  } finally {
    clearTimeout(timer);
  }
}

/** Resolve visitor country. Never throws. Returns ISO code or "ZZ". */
export async function resolveCountry(headers: Headers): Promise<string> {
  try {
    const fromHeader = countryFromHeaders(headers);
    if (fromHeader) return fromHeader;

    const ip = clientIpFromHeaders(headers);
    if (!ip || isPrivateIp(ip)) return "ZZ";

    return await lookupCountryCode(ip);
  } catch {
    return "ZZ";
  }
}
