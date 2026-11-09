import { dropshipShipmentId, listProof } from "@/lib/tracking/dropship-proof";
import { renderDropshipOrder } from "@/lib/tracking/dropship-view";
import { adminShipment } from "@/lib/tracking/service";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const id = dropshipShipmentId(token);
  const shipment = id && adminShipment(id);
  const headers = {
    "Cache-Control": "private, no-store",
    "Content-Type": "text/html; charset=utf-8",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; media-src 'self'; frame-ancestors 'none'; base-uri 'none'",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
  };
  if (!shipment) return new Response("This private order link is unavailable.", { status: 404, headers });
  const media = listProof(shipment.id).map((item) => ({
    mime: item.mime,
    src: "/api/dropship-proof/" + token + "/" + item.id,
  }));
  // Keep the private URL out of the site's analytics and advertising scripts.
  return new Response(renderDropshipOrder({ ...shipment, media }), { headers });
}
