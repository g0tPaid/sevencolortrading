import { errorResponse, json, readJson } from "@/lib/tracking/http";
import { adminGuard, adminShipment, createShipmentRecord, listShipments } from "@/lib/tracking/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await adminGuard(request, false);
  if (!auth.ok) return auth.response;
  try {
    return json(listShipments(new URL(request.url)));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const auth = await adminGuard(request, true);
  if (!auth.ok) return auth.response;
  try {
    const body = await readJson(request, 100_000);
    const shipment = createShipmentRecord(body);
    return json({ ok: true, shipment: adminShipment(shipment.id) }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
