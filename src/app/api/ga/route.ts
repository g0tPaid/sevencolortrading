import { NextResponse } from "next/server";
import { gaMeasurementIdFromEnv, googleAdsIdFromEnv } from "@/lib/ga";
import { redditPixelIdFromEnv } from "@/lib/reddit-pixel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tag IDs are public (they appear in page source). Used so static pages can still load gtag after a Railway env change. */
export async function GET() {
  const id = gaMeasurementIdFromEnv();
  const adsId = googleAdsIdFromEnv();
  const redditId = redditPixelIdFromEnv();
  return NextResponse.json(
    { id, adsId, redditId },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
