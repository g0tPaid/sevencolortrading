export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Messages</h1>
        <p className="mt-2 text-sm text-muted">Client desk preview data for procurement workflows.</p>
      </div>
      <div className="rounded-3xl border border-line bg-paper-elevated p-4 sm:p-6">
        <ul className="space-y-3">
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">Ajmal · Xiamen desk</span><span className="text-muted">Sample photos ready for PO-1042 approval</span><span className="text-muted">2h</span><span className="hidden text-right text-ink md:block"></span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">Dubai logistics</span><span className="text-muted">Customs docs uploaded for SC-AE-889</span><span className="text-muted">5h</span><span className="hidden text-right text-ink md:block"></span></li>
              <li className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm md:grid-cols-4"><span className="font-medium text-ink">QC lead</span><span className="text-muted">Minor carton mark issue — awaiting your decision</span><span className="text-muted">1d</span><span className="hidden text-right text-ink md:block"></span></li>
        </ul>
      </div>
    </div>
  );
}
