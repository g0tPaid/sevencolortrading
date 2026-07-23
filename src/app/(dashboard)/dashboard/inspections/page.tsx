export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Inspection Photos</h1>
        <p className="mt-2 text-sm text-muted">Client desk preview data for procurement workflows.</p>
      </div>
      <div className="rounded-3xl border border-line bg-paper-elevated p-4 sm:p-6">
        <ul className="space-y-3">
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">Pack A</span><span className="text-muted">Line sampling · blinds</span><span className="text-muted">24 images</span><span className="hidden text-right text-ink md:block"></span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">Pack B</span><span className="text-muted">Finished goods table</span><span className="text-muted">16 images</span><span className="hidden text-right text-ink md:block"></span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">Pack C</span><span className="text-muted">Container loading</span><span className="text-muted">9 images</span><span className="hidden text-right text-ink md:block"></span></li>
        </ul>
      </div>
    </div>
  );
}
