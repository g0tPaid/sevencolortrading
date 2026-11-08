import { clientKey, errorResponse, json, readJson } from "@/lib/tracking/http";
import { publicRefresh } from "@/lib/tracking/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson(request, 8_000);
    const trackingNumber = typeof body.trackingNumber === "string" ? body.trackingNumber : "";
    const carrierId = typeof body.carrierId === "string" ? body.carrierId : undefined;
    const result = await publicRefresh(trackingNumber, clientKey(request), new Date(), { carrierId });
    return json(result.body, result.status);
  } catch (error) {
    return errorResponse(error);
  }
}
