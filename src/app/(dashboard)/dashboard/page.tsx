import Link from "next/link";
import {
  Boxes,
  Camera,
  Eye,
  FileText,
  MessageSquare,
  Receipt,
  Ship,
  Users,
} from "lucide-react";
import { getStats } from "@/lib/analytics-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const cards = [
  { href: "/dashboard/orders", label: "Active orders", value: "12", icon: Boxes },
  { href: "/dashboard/messages", label: "Unread messages", value: "4", icon: MessageSquare },
  { href: "/dashboard/invoices", label: "Open invoices", value: "3", icon: Receipt },
  { href: "/dashboard/qc-reports", label: "QC pending", value: "2", icon: FileText },
  { href: "/dashboard/inspections", label: "Photo packs", value: "18", icon: Camera },
  { href: "/dashboard/shipments", label: "In transit", value: "5", icon: Ship },
];

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

export default async function DashboardHomePage() {
  const stats = await getStats();

  const periods = [
    { label: "Today", pageviews: stats.today.pageviews, uniques: stats.today.uniques },
    { label: "Last 7 days", pageviews: stats.week.pageviews, uniques: stats.week.uniques },
    { label: "All time", pageviews: stats.allTime.pageviews, uniques: stats.allTime.uniques },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Overview</h1>
        <p className="mt-2 text-sm text-muted">
          Track orders, QC, documents, and shipments across your Seven Color programs.
        </p>
      </div>

      <section className="rounded-3xl border border-line bg-paper-elevated p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Traffic</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">Website visitors</h2>
          </div>
          <Users className="h-5 w-5 text-accent" aria-hidden />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {periods.map((period) => (
            <div key={period.label} className="rounded-2xl border border-line bg-paper p-4">
              <p className="text-sm text-muted">{period.label}</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-ink">
                  {formatCount(period.pageviews)}
                </span>
                <span className="text-xs text-muted">pageviews</span>
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-ink">
                <Eye className="h-3.5 w-3.5 text-accent" aria-hidden />
                <span className="font-medium">{formatCount(period.uniques)}</span>
                <span className="text-muted">unique visitors</span>
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-muted">
          Counts public marketing pages only. Stored on the server. Periods use UTC calendar days.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ href, label, value, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-3xl border border-line bg-paper-elevated p-5 transition hover:border-accent/40"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{label}</p>
              <Icon className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-ink">{value}</p>
          </Link>
        ))}
      </div>
      <div className="rounded-3xl border border-line bg-paper-elevated p-6">
        <h2 className="font-display text-xl font-semibold text-ink">Latest activity</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {[
            "QC pack uploaded for PO-1042 · Transparent roller blinds",
            "Shipment SC-AE-889 departed Xiamen · ETA Jebel Ali 6 days",
            "Invoice INV-778 marked paid",
            "Factory verification completed · Huli District supplier #A29",
          ].map((item) => (
            <li key={item} className="rounded-2xl border border-line bg-paper px-4 py-3 text-muted">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
