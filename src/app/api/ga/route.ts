import { NextResponse } from "next/server";
import { gaMeasurementIdFromEnv, googleAdsIdFromEnv } from "@/lib/ga";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tag IDs are public (they appear in page source). Used so static pages can still load gtag after a Railway env change. */
export async function GET() {
  const id = gaMeasurementIdFromEnv();
  const adsId = googleAdsIdFromEnv();
  return NextResponse.json(
    { id, adsId },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
