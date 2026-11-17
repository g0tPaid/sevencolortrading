import { proofMediaResponse } from "@/lib/tracking/media-response";
import { readSignedShipmentPhoto } from "@/lib/tracking/partner-shipment-photos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ shipment: string; photo: string }> }) {
  const { shipment, photo } = await params;
  const search = new URL(request.url).searchParams;
  return proofMediaResponse(request, readSignedShipmentPhoto(shipment, photo, search.get("expires"), search.get("signature")));
}
