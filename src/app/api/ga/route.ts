import { NextResponse } from "next/server";
import { gaMeasurementIdFromEnv } from "@/lib/ga";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Measurement IDs are public (they appear in page source). Used so static pages can still load GA after a Railway env change. */
export async function GET() {
  const id = gaMeasurementIdFromEnv();
  return NextResponse.json(
    { id },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
