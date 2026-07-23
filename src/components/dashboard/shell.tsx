"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  Camera,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
  PackageSearch,
  Receipt,
  Ship,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: Boxes },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
  { href: "/dashboard/qc-reports", label: "QC Reports", icon: FileText },
  { href: "/dashboard/inspections", label: "Inspection Photos", icon: Camera },
  { href: "/dashboard/shipments", label: "Shipment Tracking", icon: Ship },
  { href: "/dashboard/documents", label: "Documents", icon: FolderOpen },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-paper-elevated/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg spectrum-rail text-[11px] font-bold text-white">
              SC
            </span>
            <span className="min-w-0">
              <span className="block font-display text-sm font-semibold leading-tight text-ink">
                Sourcing Center
              </span>
              <span className="block truncate text-[10px] text-muted">Client desk</span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-full border border-line px-3 py-1.5 text-xs text-muted sm:inline-flex"
            >
              Marketing site
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-3xl border border-line bg-paper-elevated p-3 lg:sticky lg:top-20">
          <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Workspace
          </p>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Dashboard">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-accent-soft font-medium text-ink"
                      : "text-muted hover:bg-paper hover:text-ink",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 hidden rounded-2xl border border-line bg-paper p-3 lg:block">
            <PackageSearch className="h-4 w-4 text-accent" />
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Demo client desk UI — connect auth and APIs for production.
            </p>
          </div>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
