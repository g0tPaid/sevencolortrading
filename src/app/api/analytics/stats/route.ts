import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getStats } from "@/lib/analytics-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;

  const stats = await getStats();
  return NextResponse.json(stats, {
    headers: { "Cache-Control": "no-store" },
  });
}
