import { proofMediaResponse } from "@/lib/tracking/media-response";
import { dropshipShipmentId, readProof } from "@/lib/tracking/dropship-proof";

export async function GET(request: Request, { params }: { params: Promise<{ token: string; media: string }> }) {
  const { token, media } = await params;
  const shipmentId = dropshipShipmentId(token);
  const file = shipmentId && readProof(shipmentId, media);
  return proofMediaResponse(request, file || undefined);
}
