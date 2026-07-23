import type { Metadata } from "next";
import { WorldShippingMap } from "@/components/home/world-map";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Logistics",
  description: "Sea, air, and express freight from China with Dubai hub support and customs guidance.",
};

export default function LogisticsPage() {
  return (
    <>
      <PageHero
        eyebrow="Logistics"
        title="Freight that matches how you actually buy"
        description="Consolidate in China, stage through Dubai when needed, and deliver with tracking your ops team can trust."
      />
      <Container className="py-16">
        <WorldShippingMap />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Sea freight", "Cost-efficient containers and LCL for replenishment."],
            ["Air freight", "Launch windows and urgent replenishment."],
            ["Express", "Samples and small parcels with door delivery."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-3xl border border-line bg-paper-elevated p-6">
              <h2 className="font-display text-xl font-semibold text-ink">{t}</h2>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
