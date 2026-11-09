import { readTrackingMedia } from "@/lib/tracking/dropship-proof";
import { proofMediaResponse } from "@/lib/tracking/media-response";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proofMediaResponse(request, /^[a-f0-9-]{36}$/.test(id) ? readTrackingMedia(id) : undefined);
}
