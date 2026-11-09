"use client";

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
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async (query: { q: string; carrier: string; status: string }) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query.q) params.set("q", query.q);
      if (query.carrier) params.set("carrier", query.carrier);
      if (query.status) params.set("status", query.status);
      const data = await api(`/api/admin/shipments?${params.toString()}`, { headers: {} });
      setRows((data.shipments as Shipment[]) ?? []);
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

  async function onSave(event: FormEvent) {
    event.preventDefault();
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
        await api(`/api/admin/shipments/${editing}`, { method: "PATCH", body: JSON.stringify(payload) });
        setNotice("Shipment updated.");
      } else {
        await api("/api/admin/shipments", { method: "POST", body: JSON.stringify(payload) });
        setNotice("Shipment added. A refresh was queued.");
      }
      setForm(emptyForm);
      setEditing(null);
      await load({ q, carrier, status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Shipment was not saved.");
    }
  }

  async function openRow(id: string) {
    setError(null);
    try {
      const data = await api(`/api/admin/shipments/${id}`, { headers: {} });
      const shipment = data.shipment as Shipment;
      setDetail(shipment);
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

      <div className="overflow-x-auto rounded-3xl border border-line bg-paper-elevated">
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

      <form onSubmit={onSave} className="grid gap-3 rounded-3xl border border-line bg-paper-elevated p-4 sm:grid-cols-2">
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
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button type="submit" className="rounded-2xl bg-ink px-4 py-2 text-sm text-paper">
            {editing ? "Save changes" : "Add shipment"}
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
                }}
                className="rounded-2xl border border-line px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </>
          ) : null}
        </div>
      </form>

      {detail ? (
        <section className="rounded-3xl border border-line bg-paper-elevated p-4">
          <h2 className="font-display text-2xl font-semibold text-ink">History</h2>
          <p className="mt-2 text-xs text-muted">Internal id {detail.id}</p>
          <DropshipProofControls key={detail.id} shipmentId={detail.id} />
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
