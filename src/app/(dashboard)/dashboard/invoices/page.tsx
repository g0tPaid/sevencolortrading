export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Invoices</h1>
        <p className="mt-2 text-sm text-muted">Client desk preview data for procurement workflows.</p>
      </div>
      <div className="rounded-3xl border border-line bg-paper-elevated p-4 sm:p-6">
        <ul className="space-y-3">
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">INV-778</span><span className="text-muted">PO-1021 balance</span><span className="text-muted">Paid</span><span className="hidden text-right text-ink md:block">AED 12,000</span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">INV-791</span><span className="text-muted">PO-1042 deposit</span><span className="text-muted">Due</span><span className="hidden text-right text-ink md:block">AED 5,520</span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">INV-802</span><span className="text-muted">Air freight surcharge</span><span className="text-muted">Due</span><span className="hidden text-right text-ink md:block">USD 410</span></li>
        </ul>
      </div>
    </div>
  );
}
