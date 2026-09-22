import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getStats, parseDateKey } from "@/lib/analytics-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const from = parseDateKey(url.searchParams.get("from")) ?? undefined;
  const to = parseDateKey(url.searchParams.get("to")) ?? undefined;
  const stats = await getStats({ from, to });
  return NextResponse.json(stats, {
    headers: { "Cache-Control": "no-store" },
  });
}
