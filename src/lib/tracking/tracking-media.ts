import { listProof } from "@/lib/tracking/dropship-proof";
import { listByTracking } from "@/lib/tracking/store";
import { normalizeTrackingNumber } from "@/lib/tracking/validate";

export function trackingMedia(trackingNumber: string, carrierId?: string) {
  const matches = listByTracking(normalizeTrackingNumber(trackingNumber));
  if (matches.length !== 1) return [];
  const shipment = matches[0];
  if (carrierId && shipment.carrierId && carrierId !== shipment.carrierId) return [];
  return listProof(shipment.id).filter((item) => item.published).map(({ id, mime }) => ({ id, mime }));
}
