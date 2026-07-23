export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">QC Reports</h1>
        <p className="mt-2 text-sm text-muted">Client desk preview data for procurement workflows.</p>
      </div>
      <div className="rounded-3xl border border-line bg-paper-elevated p-4 sm:p-6">
        <ul className="space-y-3">
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">QC-2201</span><span className="text-muted">PO-1042 blinds</span><span className="text-muted">Pending approval</span><span className="hidden text-right text-ink md:block">18 photos</span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">QC-2194</span><span className="text-muted">PO-1038 smart plugs</span><span className="text-muted">Passed</span><span className="hidden text-right text-ink md:block">12 photos</span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">QC-2188</span><span className="text-muted">Carton labeling audit</span><span className="text-muted">Passed</span><span className="hidden text-right text-ink md:block">6 photos</span></li>
        </ul>
      </div>
    </div>
  );
}
