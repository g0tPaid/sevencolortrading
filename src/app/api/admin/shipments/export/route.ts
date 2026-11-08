import { adminGuard, exportShipmentsCsv } from "@/lib/tracking/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await adminGuard(request, false);
  if (!auth.ok) return auth.response;
  const csv = exportShipmentsCsv();
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"shipments.csv\"",
      "Cache-Control": "private, no-store",
    },
  });
}
