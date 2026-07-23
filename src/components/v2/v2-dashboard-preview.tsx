"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/primitives";
import { dashboardModules } from "@/lib/v2-content";

export function V2DashboardPreview() {
  return (
    <section className="border-y border-line bg-paper-elevated py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Client desk
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              Your sourcing command center
            </h2>
            <p className="mt-4 text-muted sm:text-lg">
              Orders, QC, freight, and files — structured like a payments OS, built for China
              sourcing.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper dark:bg-accent"
          >
            Open client desk
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card mt-12 overflow-hidden rounded-[1.75rem]"
        >
          <div className="flex items-center gap-2 border-b border-line px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-muted">sourcing.center / desk</span>
          </div>
          <div className="grid gap-px bg-line md:grid-cols-[200px_1fr]">
            <aside className="bg-paper p-4">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Workspace
              </p>
              <ul className="mt-3 space-y-1">
                {dashboardModules.map((m, i) => (
                  <li
                    key={m}
                    className={`rounded-xl px-3 py-2 text-sm ${
                      i === 0 ? "bg-accent-soft font-medium text-ink" : "text-muted"
                    }`}
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </aside>
            <div className="bg-paper p-5 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Active orders", "12"],
                  ["In inspection", "4"],
                  ["In transit", "7"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-line p-4">
                    <p className="text-xs text-muted">{label}</p>
                    <p className="mt-2 font-display text-3xl font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 overflow-hidden rounded-2xl border border-line">
                <div className="grid grid-cols-4 gap-2 border-b border-line bg-paper-elevated px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  <span>Order</span>
                  <span>Factory</span>
                  <span>QC</span>
                  <span>Ship</span>
                </div>
                {[
                  ["SC-24081", "Shenzhen LED Co", "Passed", "Dubai hub"],
                  ["SC-24076", "Yiwu Pack Ltd", "Photos ready", "Sea · week 3"],
                  ["SC-24071", "Foshan Seat OEM", "Sampling", "—"],
                ].map((row) => (
                  <div
                    key={row[0]}
                    className="grid grid-cols-4 gap-2 border-b border-line px-4 py-3 text-sm text-ink last:border-0"
                  >
                    {row.map((cell) => (
                      <span key={cell} className="truncate">
                        {cell}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
