import { acceptsPhotoIndexKey } from "@/lib/tracking/partner-shipment-photos";
import { saveStaffPartners } from "@/lib/tracking/soloflow-staff-partners";
import { syncStaffOrder } from "@/lib/tracking/soloflow-staff-orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };

export async function POST(request: Request) {
  if (!acceptsPhotoIndexKey(request.headers.get("authorization"))) {
    return Response.json({ error: "Not found" }, { status: 404, headers });
  }
  const data = await request.json().catch(() => null);
  if (data && typeof data === "object" && "partners" in data) {
    return saveStaffPartners(data.partners)
      ? Response.json({ ok: true }, { headers })
      : Response.json({ error: "Invalid dropshipper list" }, { status: 400, headers });
  }
  const result = data && typeof data === "object" ? syncStaffOrder(data) : null;
  return result
    ? Response.json(result, { headers })
    : Response.json({ error: "Invalid order" }, { status: 400, headers });
}
