import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromCookies } from "@/lib/admin-auth-edge";

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const needsDashboardAuth = isDashboardPath(pathname);
  const needsApiAuth = isProtectedApi(pathname, method);

  if (!needsDashboardAuth && !needsApiAuth) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie");
  const session = await getSessionFromCookies(cookieHeader);

  if (session) {
    return NextResponse.next();
  }

  if (needsApiAuth) {
    return unauthorizedJson();
  }

  // Avoid redirect loop if somehow /login matched (it shouldn't)
  if (pathname === "/login") {
    return NextResponse.next();
  }

  return loginRedirect(request);
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/api/factory-applications",
    "/api/factory-applications/:path*",
    "/api/analytics/stats",
  ],
};

