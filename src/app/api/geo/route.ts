import { NextResponse } from "next/server";
import {
  FACTORY_ZH_COOKIE,
  GEO_COUNTRY_COOKIE,
  countryFromHeaders,
  geoCookieOptions,
  prefersChinese,
  shouldShowFactoryZh,
} from "@/lib/geo-detect";
import { resolveCountry } from "@/lib/geo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const acceptLanguage = request.headers.get("accept-language");
  const headerCountry = countryFromHeaders(request.headers);

  let country = headerCountry ?? "ZZ";
  if (!headerCountry && !prefersChinese(acceptLanguage)) {
    country = await resolveCountry(request.headers);
  }

  const showFactoryZh = shouldShowFactoryZh({ country, acceptLanguage });
  const response = NextResponse.json(
    { country, showFactoryZh },
    { headers: { "Cache-Control": "no-store" } },
  );

  const cookies = geoCookieOptions();
  if (country && country !== "ZZ") {
    response.cookies.set({ name: GEO_COUNTRY_COOKIE, value: country, ...cookies });
  }
  if (showFactoryZh) {
    response.cookies.set({ name: FACTORY_ZH_COOKIE, value: "1", ...cookies });
  }

  return response;
}
