import { acceptsPhotoIndexKey } from "@/lib/tracking/partner-shipment-photos";
import { getStaffPartnerLabels } from "@/lib/tracking/soloflow-staff-partners";
import { getDb } from "@/lib/tracking/db";
import { CARRIERS } from "@/lib/tracking/carriers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };

type Partner = { number: string; prefix: string };
type Row = { order: string | null; tracking: string | null; recipient: string | null; carrier: string | null; origin: string | null; destination: string | null; postcode: string | null; status: string | null; customerRef: string | null };

function aliases(partner: Partner) {
  return new Set([partner.prefix + partner.number, partner.number + partner.prefix]);
}
function canonical(ref: string | null) {
  return (ref ?? "").trim().toUpperCase().replace(/[\s-]/g, "");
}

export async function POST(request: Request) {
  if (!acceptsPhotoIndexKey(request.headers.get("authorization"))) {
    return Response.json({ error: "Not found" }, { status: 404, headers });
  }
  const data = await request.json().catch(() => null);
  if (!data || typeof data.number !== "string" || !/^[0-9]{4}$/.test(data.number) ||
    typeof data.prefix !== "string" || !/^[A-Z0-9]{0,12}$/.test(data.prefix)) {
    return Response.json({ error: "Invalid partner" }, { status: 400, headers });
  }
  // Use the existing authenticated, organization-scoped partner registry;
  // never return staff rows for an unknown or ambiguous customer reference.
  getStaffPartnerLabels();
  const db = getDb();
  const partners = db.prepare("SELECT number, prefix FROM soloflow_staff_partners").all() as Partner[];
  const target = partners.find(p => p.number === data.number && p.prefix === data.prefix);
  if (!target) return Response.json({ shipments: [] }, { headers });
  const safeAliases = [...aliases(target)].filter(alias =>
    partners.filter(p => aliases(p).has(alias)).length === 1);
  if (!safeAliases.length) return Response.json({ shipments: [] }, { headers });
  const rows = db.prepare(`
    SELECT order_number AS "order", tracking_number AS tracking, customer_name AS recipient,
      carrier_id AS carrier, origin, COALESCE(destination, destination_country) AS destination,
      postcode, status, customer_ref AS customerRef
    FROM shipments
    WHERE upper(replace(replace(trim(customer_ref),'-',''),' ','')) IN (?, ?)
    ORDER BY created_at DESC, id DESC
  `).all(safeAliases[0], safeAliases[1] ?? safeAliases[0]) as Row[];
  const shipments = rows.filter(row => safeAliases.includes(canonical(row.customerRef))).map(row => ({
    order: row.order ?? "",
    tracking: row.tracking ?? "",
    recipient: row.recipient ?? "",
    carrier: CARRIERS.find(carrier => carrier.id === row.carrier)?.name ?? row.carrier ?? "",
    origin: row.origin ?? "",
    destination: row.destination ?? "",
    postcode: row.postcode ?? "",
    status: row.status ?? "Unknown",
  }));
  return Response.json({ shipments }, { headers });
}
