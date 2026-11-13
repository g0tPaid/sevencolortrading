"use client";

import { MAX_PROOF_BYTES, MAX_PROOF_FILES, PHOTO_TYPES, ShipmentPhotoDropZone } from "@/components/dashboard/shipment-photo-drop-zone";
import { DropshipProofControls } from "@/components/dashboard/dropship-proof-controls";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Carrier = { id: string; name: string };
type EventRow = { occurredAt: string | null; status: string; description: string; location: string | null };
type LogRow = { createdAt: string; outcome: string; httpStatus: number | null; durationMs: number | null; errorKind: string | null };
type Shipment = {
  id: string;
  customerRef: string | null;
  customerName: string | null;
  orderNumber: string | null;
  trackingNumber: string;
  carrierId: string | null;
  carrierName: string | null;
  carrierResolution: string;
  status: string;
  statusDetail: string | null;
  origin: string | null;
  destination: string | null;
  postcode: string | null;
  phoneLast4: string | null;
  eta: string | null;
  lastRefreshedAt: string | null;
  nextCheckAt: string | null;
  lastError: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  events?: EventRow[];
  logs?: LogRow[];
};
type Settings = {
  newIntervalHours: number;
  activeIntervalHours: number;
  stalledIntervalHours: number;
  stalledAfterHours: number;
  maxConsecutiveFailures: number;
  globalConcurrency: number;
  perCarrierConcurrency: number;
  perCarrierGapMs: number;
  publicRefreshCooldownMinutes: number;
};

const STATUSES = [
  "Information Received",
  "Picked Up",
  "In Transit",
  "Arrived at Destination Country",
  "Customs Clearance",
  "Customs Released",
  "Out for Delivery",
  "Delivered",
  "Delivery Exception",
  "Returned to Sender",
  "Unknown",
];

const emptyForm = {
  customerName: "",
  customerRef: "",
  orderNumber: "",
  trackingNumber: "",
  carrierId: "",
  origin: "",
  destination: "",
  postcode: "",
  phoneLast4: "",
  notes: "",
};

async function api(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    signal: AbortSignal.timeout(30_000),
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; [key: string]: unknown };
  if (!response.ok || data.ok === false) throw new Error(data.error || "Request failed");
  return data;
}

export function ShipmentsDesk() {
  const [q, setQ] = useState("");
  const [carrier, setCarrier] = useState("");
  const [status, setStatus] = useState("");
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [rows, setRows] = useState<Shipment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [detail, setDetail] = useState<Shipment | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [saveProgress, setSaveProgress] = useState<{ done: number; total: number } | null>(null);
  const saving = saveProgress !== null;
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async (query: { q: string; carrier: string; status: string }, savedShipment?: Shipment) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query.q) params.set("q", query.q);
      if (query.carrier) params.set("carrier", query.carrier);
      if (query.status) params.set("status", query.status);
      const data = await api(`/api/admin/shipments?${params.toString()}`, { cache: "no-store" });
      const shipments = (data.shipments as Shipment[]) ?? [];
      const savedRow = shipments.find((shipment) => shipment.id === savedShipment?.id) ?? savedShipment;
      setRows(savedRow ? [savedRow, ...shipments.filter((shipment) => shipment.id !== savedRow.id)] : shipments);
      setTotal(Number(data.total ?? 0));
      setCarriers((data.carriers as Carrier[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Shipments could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load({ q: "", carrier: "", status: "" });
    void api("/api/admin/shipments/settings", { headers: {} })
      .then((data) => setSettings(data.settings as Settings))
      .catch(() => setSettings(null));
  }, [load]);

  function onSearch(event: FormEvent) {
    event.preventDefault();
    void load({ q, carrier, status });
  }

  async function showSavedShipment(shipment: Shipment) {
    setQ("");
    setCarrier("");
    setStatus("");
    setRows((current) => [shipment, ...current.filter((row) => row.id !== shipment.id)]);
    await load({ q: "", carrier: "", status: "" }, shipment);
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaveError(null);
    setSaveNotice(null);
    if (!editing && photos.length < 2) {
      setSaveError("Select at least two photos before adding the shipment.");
      return;
    }
    setSaveProgress({ done: 0, total: editing ? 1 : photos.length + 1 });
    setError(null);
    setNotice(null);
    const payload = {
      customerName: form.customerName,
      customerRef: form.customerRef,
      orderNumber: form.orderNumber,
      trackingNumber: form.trackingNumber,
      carrierId: form.carrierId,
      origin: form.origin,
      destination: form.destination,
      postcode: form.postcode,
      phoneLast4: form.phoneLast4,
      notes: form.notes,
    };
    try {
      if (editing) {
        const data = await api(`/api/admin/shipments/${editing}`, { method: "PATCH", body: JSON.stringify(payload) });
        const shipment = data.shipment as Shipment;
        setDetail(shipment);
        setSaveProgress({ done: 1, total: 1 });
        setSaveNotice("Shipment updated.");
        await showSavedShipment(shipment);
      } else {
        const created = await api("/api/admin/shipments", { method: "POST", body: JSON.stringify(payload) });
        const shipment = created.shipment as Shipment;
        const uploadErrors: string[] = [];
        let done = 1;
        setSaveProgress({ done, total: photos.length + 1 });
        for (const photo of photos) {
          try {
            const response = await fetch("/api/admin/shipments/" + encodeURIComponent(shipment.id) + "/proof?action=upload", {
              method: "POST",
              body: photo,
              signal: AbortSignal.timeout(60_000),
            });
            if (!response.ok) {
              const result = await response.json().catch(() => null);
              throw new Error(result?.error || `Upload failed (HTTP ${response.status}).`);
            }
          } catch (error) {
            const reason = error instanceof Error && error.name === "TimeoutError"
              ? "Upload timed out."
              : error instanceof Error ? error.message : "Upload failed.";
            uploadErrors.push(`${photo.name}: ${reason}`);
          } finally {
            done += 1;
            setSaveProgress({ done, total: photos.length + 1 });
          }
        }
        setPhotos([]);
        setDetail(shipment);
        setEditing(shipment.id);
        if (uploadErrors.length) {
          setSaveError("Tracking details were saved. Check the photo panel above before retrying these uploads. " + uploadErrors.join(" "));
        } else {
          setSaveNotice("Shipment added and photos uploaded.");
        }
        await showSavedShipment(shipment);
      }
    } catch (err) {
      setSaveError(err instanceof Error && err.name === "TimeoutError"
        ? "The save request timed out. Check the shipment list before retrying."
        : err instanceof Error ? err.message : "Shipment was not saved.");
    } finally {
      setSaveProgress(null);
    }
  }

  async function openRow(id: string, showMedia = false) {
    setError(null);
    setSaveError(null);
    setSaveNotice(null);
    try {
      const data = await api(`/api/admin/shipments/${id}`, { headers: {} });
      const shipment = data.shipment as Shipment;
      setDetail(shipment);
      requestAnimationFrame(() => document.getElementById(showMedia ? "shipment-media" : "shipment-editor")?.scrollIntoView());
      setEditing(id);
      setForm({
        customerName: shipment.customerName ?? "",
        customerRef: shipment.customerRef ?? "",
        orderNumber: shipment.orderNumber ?? "",
        trackingNumber: shipment.trackingNumber,
        carrierId: shipment.carrierId ?? "",
        origin: shipment.origin ?? "",
        destination: shipment.destination ?? "",
        postcode: shipment.postcode ?? "",
        phoneLast4: shipment.phoneLast4 ?? "",
        notes: shipment.notes ?? "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Shipment could not be opened.");
    }
  }

  async function onDelete() {
    if (!editing) return;
    if (!window.confirm("Delete this shipment and its stored events?")) return;
    try {
      await api(`/api/admin/shipments/${editing}`, { method: "DELETE" });
      setEditing(null);
      setDetail(null);
      setForm(emptyForm);
      setNotice("Shipment deleted.");
      await load({ q, carrier, status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Shipment was not deleted.");
    }
  }

  async function onRefresh() {
    if (!editing) return;
    try {
      const data = await api(`/api/admin/shipments/${editing}/refresh`, { method: "POST", body: "{}" });
      setNotice(typeof data.message === "string" ? data.message : "Refresh queued.");
      await openRow(editing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refresh was not queued.");
    }
  }

  function addPhotos(files: File[]) {
    if (saving || !files.length) return;
    if (photos.length + files.length > MAX_PROOF_FILES || files.some((file) =>
      !PHOTO_TYPES.includes(file.type) || !file.size || file.size > MAX_PROOF_BYTES
    )) {
      setError("Select up to eight JPEG, PNG, or WebP photos, 16 MB each.");
      return;
    }
    setError(null);
    setPhotos((selected) => [...selected, ...files]);
  }

  async function onImport(file: File) {
    const csv = await file.text();
    try {
      const data = await api("/api/admin/shipments/import", { method: "POST", body: JSON.stringify({ csv }) });
      const errors = (data.errors as Array<{ row: number; message: string }> | undefined) ?? [];
      setNotice(`Imported ${String(data.created)} new and ${String(data.updated)} updated. ${errors.length} row errors.`);
      await load({ q, carrier, status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "CSV was not imported.");
    }
  }

  async function onSettings(event: FormEvent) {
    event.preventDefault();
    if (!settings) return;
    try {
      const data = await api("/api/admin/shipments/settings", { method: "PUT", body: JSON.stringify(settings) });
      setSettings(data.settings as Settings);
      setNotice("Scheduler settings saved. The worker reads them on the next tick.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Settings were not saved.");
    }
  }

  const fieldClass = "mt-1 w-full rounded-2xl border border-line bg-paper px-3 py-2 text-sm text-ink";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Shipments</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Several tracking numbers can share one order number. There is no separate customer or order table, so those fields are references typed here. /admin/shipments opens this desk.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-2xl border border-line bg-paper-elevated px-4 py-3 text-sm text-ink">
          {error}
        </p>
      ) : null}
      {notice ? <p className="rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink">{notice}</p> : null}

      <form onSubmit={onSearch} className="grid gap-3 rounded-3xl border border-line bg-paper-elevated p-4 md:grid-cols-4">
        <label className="text-sm text-ink md:col-span-2">
          Search
          <input
            data-testid="shipments-search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Tracking, customer, or order"
            className={fieldClass}
          />
        </label>
        <label className="text-sm text-ink">
          Carrier
          <select value={carrier} onChange={(event) => setCarrier(event.target.value)} className={fieldClass}>
            <option value="">All</option>
            <option value="unsupported">Unsupported carrier</option>
            {carriers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-ink">
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClass}>
            <option value="">All</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-2xl bg-ink px-4 py-2 text-sm text-paper md:col-span-4 md:w-fit">
          Search
        </button>
      </form>

      <div id="shipment-list" className="scroll-mt-24 overflow-x-auto rounded-3xl border border-line bg-paper-elevated">
        {loading ? <p className="p-4 text-sm text-muted">Loading shipments…</p> : null}
        {!loading && rows.length === 0 ? <p className="p-4 text-sm text-muted">No shipments match.</p> : null}
        {rows.length > 0 ? (
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Carrier</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => void openRow(row.id)} className="font-medium text-ink underline-offset-2 hover:underline">
                      {row.trackingNumber}
                    </button>
                    <button type="button" onClick={() => void openRow(row.id, true)} className="mt-1 block text-xs font-semibold text-accent underline underline-offset-2">
                      Upload photos / video
                    </button>
                  </td>
                  <td className="px-4 py-3 text-ink">{row.customerName || "—"}</td>
                  <td className="px-4 py-3 text-ink">{row.orderNumber || "—"}</td>
                  <td className="px-4 py-3 text-ink">{row.carrierName || row.carrierResolution}</td>
                  <td className="px-4 py-3 text-ink">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        <p className="px-4 py-3 text-xs text-muted">{total} shipment{total === 1 ? "" : "s"}</p>
      </div>

      {detail ? (
        <section id="shipment-media" className="scroll-mt-24 rounded-3xl border border-line bg-paper-elevated p-4">
          <h2 className="font-display text-2xl font-semibold text-ink">Pre-shipment photos and videos</h2>
          <p className="mt-1 text-sm text-muted">Tracking number {detail.trackingNumber}</p>
          <DropshipProofControls key={detail.id} shipmentId={detail.id} />
        </section>
      ) : null}

      <form id="shipment-editor" onSubmit={onSave} className="scroll-mt-24 grid gap-3 rounded-3xl border border-line bg-paper-elevated p-4 sm:grid-cols-2">
        <h2 className="font-display text-2xl font-semibold text-ink sm:col-span-2">
          {editing ? "Edit shipment" : "Add shipment"}
        </h2>
        {(
          [
            ["customerName", "Customer name"],
            ["customerRef", "Customer ID"],
            ["orderNumber", "Order number"],
            ["trackingNumber", "Tracking number"],
            ["origin", "Origin"],
            ["destination", "Destination"],
            ["postcode", "Delivery postcode"],
            ["phoneLast4", "Phone last 4"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-sm text-ink">
            {label}
            <input
              value={form[key]}
              onChange={(event) => setForm({ ...form, [key]: event.target.value })}
              className={fieldClass}
            />
          </label>
        ))}
        <label className="text-sm text-ink">
          Carrier
          <select
            value={form.carrierId}
            onChange={(event) => setForm({ ...form, carrierId: event.target.value })}
            className={fieldClass}
          >
            <option value="">Not set</option>
            <option value="unsupported">Unsupported carrier</option>
            {carriers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-ink sm:col-span-2">
          Internal notes
          <textarea
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
            rows={3}
            className={fieldClass}
          />
        </label>
        {!editing && (
          <div className="rounded-2xl border border-line p-4 sm:col-span-2">
            <p className="text-sm font-semibold text-ink">Pre-shipment pictures</p>
            <p className="mt-1 text-sm text-muted">Select 2 to 8 JPEG, PNG, or WebP photos, up to 16 MB each. Anyone with the tracking number can see these photos. Keep addresses, shipping labels, and personal details out of uploads.</p>
            <label className="mt-3 inline-flex cursor-pointer rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink focus-within:ring-2 focus-within:ring-accent">
              Upload pictures
              <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={saving}
                onChange={(event) => {
                  const files = Array.from(event.currentTarget.files ?? []);
                  event.currentTarget.value = "";
                  addPhotos(files);
                }} />
            </label>
            <ShipmentPhotoDropZone disabled={saving} onPhotos={addPhotos} />
            <p role="status" className="mt-2 text-sm text-muted">{photos.length} photo(s) selected</p>
            {photos.length > 0 && <button type="button" disabled={saving} className="mt-2 text-sm underline" onClick={() => setPhotos([])}>Clear selection</button>}
          </div>
        )}
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button type="submit" disabled={saving} className="rounded-2xl bg-ink px-4 py-2 text-sm text-paper disabled:opacity-50">
            {saving ? "Saving…" : editing ? "Save changes" : "Add shipment"}
          </button>
          {editing ? (
            <>
              <button type="button" onClick={() => void onRefresh()} className="rounded-2xl border border-line px-4 py-2 text-sm">
                Queue refresh
              </button>
              <button type="button" onClick={() => void onDelete()} className="rounded-2xl border border-line px-4 py-2 text-sm">
                Delete
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setDetail(null);
                  setForm(emptyForm);
                  setSaveError(null);
                  setSaveNotice(null);
                }}
                className="rounded-2xl border border-line px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </>
          ) : null}
        </div>
        {saveProgress && (
          <div className="space-y-1 text-sm sm:col-span-2">
            <p role="status" id="shipment-save-progress">
              {saveProgress.done === 0 ? "Saving tracking details…" : saveProgress.done < saveProgress.total
                ? `Uploading photo ${saveProgress.done} of ${saveProgress.total - 1}…`
                : "Refreshing the shipment list…"}
            </p>
            <progress aria-labelledby="shipment-save-progress" className="w-full accent-accent"
              value={saveProgress.done || undefined} max={saveProgress.total} />
          </div>
        )}
        {saveError && <p role="alert" className="rounded-xl border border-red-500 p-3 text-sm text-ink sm:col-span-2">{saveError}</p>}
        {saveNotice && <p role="status" className="text-sm text-ink sm:col-span-2">{saveNotice} <a href="#shipment-list" className="underline">View shipment list</a></p>}
      </form>

      {detail ? (
        <section className="rounded-3xl border border-line bg-paper-elevated p-4">
          <h2 className="font-display text-2xl font-semibold text-ink">History</h2>
          <p className="mt-2 text-xs text-muted">Internal id {detail.id}</p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Created</dt>
              <dd>{detail.createdAt}</dd>
            </div>
            <div>
              <dt className="text-muted">Updated</dt>
              <dd>{detail.updatedAt}</dd>
            </div>
            <div>
              <dt className="text-muted">Carrier ETA</dt>
              <dd>{detail.eta || "No carrier ETA"}</dd>
            </div>
            <div>
              <dt className="text-muted">Next check</dt>
              <dd>{detail.nextCheckAt || "Not scheduled"}</dd>
            </div>
          </dl>
          {detail.lastError ? <p className="mt-3 text-sm text-ink">{detail.lastError}</p> : null}
          <h3 className="mt-4 text-sm font-semibold text-ink">Events</h3>
          {(detail.events ?? []).length === 0 ? <p className="mt-2 text-sm text-muted">No carrier events are stored.</p> : null}
          <ul className="mt-2 space-y-2">
            {(detail.events ?? []).map((event, index) => (
              <li key={`${event.occurredAt ?? "e"}-${index}`} className="text-sm">
                <span className="font-medium">{event.status}</span> — {event.description}
                <span className="block text-xs text-muted">
                  {event.occurredAt || "Time not supplied"}
                  {event.location ? ` · ${event.location}` : ""}
                </span>
              </li>
            ))}
          </ul>
          <h3 className="mt-4 text-sm font-semibold text-ink">Provider log</h3>
          <ul className="mt-2 space-y-1 text-xs text-muted">
            {(detail.logs ?? []).map((log, index) => (
              <li key={`${log.createdAt}-${index}`}>
                {log.createdAt} · {log.outcome}
                {log.httpStatus ? ` · HTTP ${log.httpStatus}` : ""}
                {log.durationMs != null ? ` · ${log.durationMs} ms` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-paper-elevated p-4">
          <h2 className="font-display text-2xl font-semibold text-ink">CSV</h2>
          <p className="mt-2 text-sm text-muted">Import up to 500 rows. Export escapes spreadsheet formulas.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                void fetch("/api/admin/shipments/export")
                  .then((response) => response.blob())
                  .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "shipments.csv";
                    link.click();
                    URL.revokeObjectURL(url);
                  })
                  .catch(() => setError("CSV could not be exported."));
              }}
              className="rounded-2xl border border-line px-4 py-2 text-sm text-ink"
            >
              Export CSV
            </button>
            <label className="rounded-2xl border border-line px-4 py-2 text-sm text-ink">
              Import CSV
              <input
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void onImport(file);
                  event.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
        {settings ? (
          <form onSubmit={onSettings} className="rounded-3xl border border-line bg-paper-elevated p-4">
            <h2 className="font-display text-2xl font-semibold text-ink">Scheduler</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["newIntervalHours", "New hours", 4, 6],
                  ["activeIntervalHours", "Active hours", 8, 12],
                  ["stalledIntervalHours", "No-movement hours", 12, 24],
                ] as const
              ).map(([key, label, min, max]) => (
                <label key={key} className="text-sm text-ink">
                  {label}
                  <input
                    type="number"
                    min={min}
                    max={max}
                    step="0.5"
                    value={settings[key]}
                    onChange={(event) => setSettings({ ...settings, [key]: Number(event.target.value) })}
                    className={fieldClass}
                  />
                </label>
              ))}
            </div>
            <button type="submit" className="mt-3 rounded-2xl bg-ink px-4 py-2 text-sm text-paper">
              Save intervals
            </button>
          </form>
        ) : null}
      </section>
    </div>
  );
}
