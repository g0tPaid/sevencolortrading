import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSessionFromCookies(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json(
    { ok: true, user: session.u },
    { headers: { "Cache-Control": "no-store" } },
  );
}
