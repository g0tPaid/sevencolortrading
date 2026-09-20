import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromCookies } from "@/lib/admin-auth-edge";
import {
  FACTORY_ZH_COOKIE,
  GEO_COUNTRY_COOKIE,
  countryFromHeaders,
  geoCookieOptions,
  shouldShowFactoryZh,
} from "@/lib/geo-detect";

const CANONICAL_ORIGIN = "https://sourcing.center";
const LEGACY_HOSTS = new Set([
  "www.sourcing.center",
  "sevencolor.online",
  "www.sevencolor.online",
]);

/** Public hostname from the proxy/client. Never use nextUrl.hostname (often the internal bind). */
function requestHostname(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-host");
  const raw = forwarded?.split(",")[0]?.trim() || request.headers.get("host") || "";
  return raw.split(":")[0]?.toLowerCase() ?? "";
}

/** 301 legacy hosts → apex, same path + query. Skips localhost, Railway internals, and the apex host. */
function hostToCanonicalRedirect(request: NextRequest): NextResponse | null {
  if (!LEGACY_HOSTS.has(requestHostname(request))) return null;
  const dest = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    CANONICAL_ORIGIN,
  );
  return NextResponse.redirect(dest, 301);
}

function loginRedirect(request: NextRequest): NextResponse {
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

function unauthorizedJson(): NextResponse {
  return NextResponse.json(
    { ok: false, error: "Unauthorized" },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}

function isProtectedApi(pathname: string, method: string): boolean {
  const m = method.toUpperCase();

  if (pathname === "/api/analytics/stats" && m === "GET") return true;

  if (pathname === "/api/factory-applications" && m === "GET") return true;
  if (pathname === "/api/rfq" && m === "GET") return true;
  if (pathname === "/api/visit-inquiries" && m === "GET") return true;

  // PATCH /api/factory-applications/:id
  if (
    m === "PATCH" &&
    /^\/api\/factory-applications\/[^/]+$/.test(pathname)
  ) {
    return true;
  }

  return false;
}

function isDashboardPath(pathname: string): boolean {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

/** Sync CF/Railway country headers + Accept-Language. No IP lookup (keeps marketing pages static). */
function applyFactoryGeoHint(request: NextRequest, response: NextResponse) {
  const headerCountry = countryFromHeaders(request.headers);
  const existingCountry = request.cookies.get(GEO_COUNTRY_COOKIE)?.value;
  const country = headerCountry ?? existingCountry ?? null;
  const acceptLanguage = request.headers.get("accept-language");
  const cookies = geoCookieOptions();

  if (headerCountry && headerCountry !== existingCountry) {
    response.cookies.set({ name: GEO_COUNTRY_COOKIE, value: headerCountry, ...cookies });
  }

  if (
    request.cookies.get(FACTORY_ZH_COOKIE)?.value !== "1" &&
    shouldShowFactoryZh({ country, acceptLanguage })
  ) {
    response.cookies.set({ name: FACTORY_ZH_COOKIE, value: "1", ...cookies });
  }
}

export async function middleware(request: NextRequest) {
  const hostRedirect = hostToCanonicalRedirect(request);
  if (hostRedirect) return hostRedirect;

  const { pathname } = request.nextUrl;
  const method = request.method;

  const needsDashboardAuth = isDashboardPath(pathname);
  const needsApiAuth = isProtectedApi(pathname, method);

  let response: NextResponse;

  if (!needsDashboardAuth && !needsApiAuth) {
    response = NextResponse.next();
  } else {
    const cookieHeader = request.headers.get("cookie");
    const session = await getSessionFromCookies(cookieHeader);

    if (session) {
      response = NextResponse.next();
    } else if (needsApiAuth) {
      response = unauthorizedJson();
    } else if (pathname === "/login") {
      response = NextResponse.next();
    } else {
      response = loginRedirect(request);
    }
  }

  applyFactoryGeoHint(request, response);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
