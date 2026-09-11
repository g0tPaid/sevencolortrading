import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieHeader,
  verifyCredentials,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    const parsed = await request.json();
    if (parsed && typeof parsed === "object") body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  const result = verifyCredentials(username, password);
  if (!result.ok || !result.user) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const token = await createSessionToken(result.user);
  const response = NextResponse.json(
    { ok: true, user: result.user },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.headers.append("Set-Cookie", sessionCookieHeader(token));
  return response;
}
