import Link from "next/link";
import {
  Boxes,
  Camera,
  FileText,
  MessageSquare,
  Receipt,
  Ship,
} from "lucide-react";

const cards = [
  { href: "/dashboard/orders", label: "Active orders", value: "12", icon: Boxes },
  { href: "/dashboard/messages", label: "Unread messages", value: "4", icon: MessageSquare },
  { href: "/dashboard/invoices", label: "Open invoices", value: "3", icon: Receipt },
  { href: "/dashboard/qc-reports", label: "QC pending", value: "2", icon: FileText },
  { href: "/dashboard/inspections", label: "Photo packs", value: "18", icon: Camera },
  { href: "/dashboard/shipments", label: "In transit", value: "5", icon: Ship },
];

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Overview</h1>
        <p className="mt-2 text-sm text-muted">
          Track orders, QC, documents, and shipments across your Seven Color programs.
        </p>
      </div>
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
