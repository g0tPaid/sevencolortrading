import { NextResponse } from "next/server";
import { clearedSessionCookieHeader } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.headers.append("Set-Cookie", clearedSessionCookieHeader());
  return response;
}
