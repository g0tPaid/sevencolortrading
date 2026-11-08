import { errorResponse, json, readJson, clientKey } from "@/lib/tracking/http";
import { startPublicWork } from "@/lib/tracking/public-cache";
import { publicLookup } from "@/lib/tracking/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson(request, 8_000);
    const trackingNumber = typeof body.trackingNumber === "string" ? body.trackingNumber : "";
    const carrierId = typeof body.carrierId === "string" ? body.carrierId : undefined;
    const result = await publicLookup(trackingNumber, clientKey(request), new Date(), { carrierId });
    if (result.status === 200 && "state" in result.body && result.body.state === "pending") {
      startPublicWork();
    }
    return json(result.body, result.status);
  } catch (error) {
    return errorResponse(error);
  }
}
