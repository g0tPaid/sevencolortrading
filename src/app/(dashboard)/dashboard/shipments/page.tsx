export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Shipment Tracking</h1>
        <p className="mt-2 text-sm text-muted">Client desk preview data for procurement workflows.</p>
      </div>
      <div className="rounded-3xl border border-line bg-paper-elevated p-4 sm:p-6">
        <ul className="space-y-3">
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">SC-AE-889</span><span className="text-muted">Xiamen → Jebel Ali</span><span className="text-muted">In transit</span><span className="hidden text-right text-ink md:block">ETA 6 days</span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">SC-AE-874</span><span className="text-muted">Yiwu → Dubai</span><span className="text-muted">Customs</span><span className="hidden text-right text-ink md:block">ETA 2 days</span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">SC-EU-221</span><span className="text-muted">Xiamen → Rotterdam</span><span className="text-muted">Booked</span><span className="hidden text-right text-ink md:block">ETD Fri</span></li>
        </ul>
      </div>
    </div>
  );
}
