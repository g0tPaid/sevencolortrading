"use client";

import { useMemo, useState } from "react";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type FactoryApplication,
} from "@/lib/factory-applications";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: "Pending",
  contacted: "Contacted",
  approved: "Approved",
  rejected: "Rejected",
};

function statusClass(status: ApplicationStatus): string {
  switch (status) {
    case "pending":
      return "bg-accent-soft text-accent";
    case "contacted":
      return "border border-line bg-paper text-ink";
    case "approved":
      return "bg-ink text-paper";
    case "rejected":
      return "bg-paper text-muted";
  }
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function FactoryApplicationsTable({
  initial,
}: {
  initial: FactoryApplication[];
}) {
  const [rows, setRows] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pending = useMemo(
    () => rows.filter((row) => row.status === "pending").length,
    [rows],
  );

  async function setStatus(id: string, status: ApplicationStatus) {
    const current = rows.find((row) => row.id === id);
    if (!current || current.status === status) return;

    setBusyId(id);
    setError(null);
    try {
      const response = await fetch(`/api/factory-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; application?: FactoryApplication; error?: string }
        | null;
      if (!response.ok || !data?.ok || !data.application) {
        setError(data?.error || "Could not update status.");
        return;
      }
      const updated = data.application;
      setRows((prev) => prev.map((row) => (row.id === id ? updated : row)));
    } catch {
      setError("Network error while updating status.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-display text-2xl font-semibold text-ink">{pending}</span>
          <span className="ml-2">pending</span>
          <span className="mx-2 text-line">·</span>
          <span>{rows.length} total</span>
        </p>
      </div>

      {error ? (
        <p className="rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-ink" role="alert">
          {error}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-3xl border border-line bg-paper-elevated p-8 text-sm text-muted">
          No factory applications yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-3xl border border-line bg-paper-elevated p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{row.companyNameEn}</p>
                  {row.companyNameZh ? (
                    <p className="mt-0.5 text-sm text-muted">{row.companyNameZh}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                      statusClass(row.status),
                    )}
                  >
                    {STATUS_LABEL[row.status]}
                  </span>
                  <span className="text-xs text-muted">{formatDate(row.createdAt)}</span>
                </div>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">Contact</dt>
                  <dd className="mt-1 text-ink">{row.contactName}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">Phone / WeChat</dt>
                  <dd className="mt-1 text-ink">
                    {row.phone}
                    {row.wechat ? <span className="text-muted"> · {row.wechat}</span> : null}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">Email</dt>
                  <dd className="mt-1 break-all text-ink">{row.email}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">City</dt>
                  <dd className="mt-1 text-ink">
                    {row.city}
                    {row.province ? `, ${row.province}` : ""}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">Categories</dt>
                  <dd className="mt-1 text-ink">{row.categories.join(", ")}</dd>
                </div>
                {row.moq ? (
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">MOQ</dt>
                    <dd className="mt-1 text-ink">{row.moq}</dd>
                  </div>
                ) : null}
                {row.exportExperience ? (
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">Export</dt>
                    <dd className="mt-1 capitalize text-ink">{row.exportExperience}</dd>
                  </div>
                ) : null}
                {row.licenseNumber ? (
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">License</dt>
                    <dd className="mt-1 font-mono text-xs text-ink">{row.licenseNumber}</dd>
                  </div>
                ) : null}
                {row.alibabaOrWebsite ? (
                  <div className="sm:col-span-2">
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">Web</dt>
                    <dd className="mt-1 break-all text-ink">{row.alibabaOrWebsite}</dd>
                  </div>
                ) : null}
                {row.notes ? (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">Notes</dt>
                    <dd className="mt-1 text-muted">{row.notes}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                {APPLICATION_STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={busyId === row.id || row.status === status}
                    onClick={() => setStatus(row.id, status)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50",
                      row.status === status
                        ? "border-accent bg-accent-soft text-ink"
                        : "border-line text-muted hover:border-accent/40 hover:text-ink",
                    )}
                  >
                    {STATUS_LABEL[status]}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
