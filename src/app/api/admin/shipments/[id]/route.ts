import { errorResponse, json, readJson } from "@/lib/tracking/http";
import { adminGuard, adminShipment, removeShipment, updateShipmentRecord } from "@/lib/tracking/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await adminGuard(request, false);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const shipment = adminShipment(id);
  if (!shipment) return json({ ok: false, error: "Not found" }, 404);
  return json({ ok: true, shipment });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await adminGuard(request, true);
  if (!auth.ok) return auth.response;
  try {
    const { id } = await params;
    const body = await readJson(request, 100_000);
    const shipment = updateShipmentRecord(id, body);
    if (!shipment) return json({ ok: false, error: "Not found" }, 404);
    return json({ ok: true, shipment: adminShipment(shipment.id) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await adminGuard(request, true);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  if (!removeShipment(id)) return json({ ok: false, error: "Not found" }, 404);
  return json({ ok: true });
}
