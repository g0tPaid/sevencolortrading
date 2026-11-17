import { acceptsPhotoIndexKey, partnerShipmentPhotos } from "@/lib/tracking/partner-shipment-photos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };

export async function POST(request: Request) {
  if (!acceptsPhotoIndexKey(request.headers.get("authorization"))) {
    return Response.json({ error: "Not found" }, { status: 404, headers });
  }
  const data = await request.json().catch(() => null);
  if (!data || typeof data.number !== "string" || !/^[0-9]{4}$/.test(data.number) ||
    typeof data.prefix !== "string" || !/^[A-Z0-9]{0,12}$/.test(data.prefix) ||
    !Array.isArray(data.orders) || data.orders.length > 2000 ||
    data.orders.some((row: { order?: unknown; tracking?: unknown } | null) => !row ||
      typeof row.order !== "string" || row.order.length > 250 ||
      typeof row.tracking !== "string" || row.tracking.length > 250)) {
    return Response.json({ error: "Invalid shipment references" }, { status: 400, headers });
  }
  return Response.json({ photos: partnerShipmentPhotos(data.number, data.prefix, data.orders) }, { headers });
}
