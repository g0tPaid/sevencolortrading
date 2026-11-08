import { errorResponse, json, readJson } from "@/lib/tracking/http";
import { CSV_MAX_BYTES } from "@/lib/tracking/csv";
import { adminGuard, importShipmentsCsv } from "@/lib/tracking/service";
import { TrackingInputError } from "@/lib/tracking/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await adminGuard(request, true);
  if (!auth.ok) return auth.response;
  try {
    const type = request.headers.get("content-type") ?? "";
    let csv = "";
    if (type.includes("text/csv")) {
      csv = await request.text();
      if (csv.length > CSV_MAX_BYTES) throw new TrackingInputError("CSV is larger than 1 MB.");
    } else {
      const body = await readJson(request, CSV_MAX_BYTES);
      if (typeof body.csv !== "string") throw new TrackingInputError("CSV must be text.");
      csv = body.csv;
    }
    return json({ ok: true, ...importShipmentsCsv(csv) });
  } catch (error) {
    return errorResponse(error);
  }
}
