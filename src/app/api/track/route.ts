import { errorResponse, json, readJson, clientKey } from "@/lib/tracking/http";
import { publicLookup } from "@/lib/tracking/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson(request, 8_000);
    const trackingNumber = typeof body.trackingNumber === "string" ? body.trackingNumber : "";
    const result = publicLookup(trackingNumber, clientKey(request));
    return json(result.body, result.status);
  } catch (error) {
    return errorResponse(error);
  }
}
