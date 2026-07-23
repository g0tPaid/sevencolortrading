export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Orders</h1>
        <p className="mt-2 text-sm text-muted">Client desk preview data for procurement workflows.</p>
      </div>
      <div className="rounded-3xl border border-line bg-paper-elevated p-4 sm:p-6">
        <ul className="space-y-3">
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">PO-1042</span><span className="text-muted">Roller blinds</span><span className="text-muted">QC review</span><span className="hidden text-right text-ink md:block">AED 18,400</span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">PO-1038</span><span className="text-muted">Smart plugs</span><span className="text-muted">In production</span><span className="hidden text-right text-ink md:block">USD 6,220</span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">PO-1021</span><span className="text-muted">Hospitality chairs</span><span className="text-muted">Shipped</span><span className="hidden text-right text-ink md:block">AED 42,900</span></li>
        </ul>
      </div>
    </div>
  );
}
