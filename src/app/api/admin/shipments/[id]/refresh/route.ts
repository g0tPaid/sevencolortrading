import { json } from "@/lib/tracking/http";
import { MSG } from "@/lib/tracking/messages";
import { adminGuard, adminShipment, manualRefresh } from "@/lib/tracking/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await adminGuard(request, true);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const result = manualRefresh(id);
  if (result === "missing") return json({ ok: false, error: "Not found" }, 404);
  const shipment = adminShipment(id);
  const message =
    result === "queued"
      ? MSG.refreshQueued
      : result === "already_queued"
        ? MSG.refreshPending
        : result === "stopped"
          ? MSG.deliveredStop
          : MSG.refreshCooldown;
  return json({ ok: true, refresh: result, message, shipment });
}
