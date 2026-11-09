import { listProof } from "@/lib/tracking/dropship-proof";
import { listByTracking } from "@/lib/tracking/store";
import { normalizeTrackingNumber } from "@/lib/tracking/validate";

export function trackingMedia(trackingNumber: string, carrierId?: string) {
  const matches = listByTracking(normalizeTrackingNumber(trackingNumber));
  if (matches.length !== 1) return [];
  const shipment = matches[0];
  if (carrierId && shipment.carrierId && carrierId !== shipment.carrierId) return [];
  const files = listProof(shipment.id);
  if (files.filter((item) => item.mime.startsWith("image/")).length < 2) return [];
  return files.filter((item) => item.published).map(({ id, mime }) => ({ id, mime }));
}
