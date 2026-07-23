import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Since 2014, Seven Color has connected buyers to verified manufacturers across China with desks in Xiamen and Dubai.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Connecting businesses to global manufacturing"
        description="Seven Color simplifies China procurement with transparent sourcing, on-ground verification, and logistics through Dubai and Xiamen."
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Mission</h2>
          <p className="mt-3 text-muted leading-relaxed">
            To simplify global sourcing with reliable supply-chain execution so teams can focus on growth while we handle international procurement complexity.
          </p>
          <h2 className="mt-10 font-display text-2xl font-semibold text-ink">Vision</h2>
          <p className="mt-3 text-muted leading-relaxed">
            To be the sourcing partner procurement teams trust for quality, integrity, and operational clarity — from first sample to repeat containers.
          </p>
        </div>
        <div className="rounded-3xl border border-line bg-paper-elevated p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Offices</p>
          <ul className="mt-6 space-y-6">
            {company.offices.map((o) => (
              <li key={o.city}>
                <p className="font-semibold text-ink">{o.city} · {o.role}</p>
                <p className="mt-1 text-sm text-muted leading-relaxed">{o.address}</p>
                <p className="mt-1 font-mono text-xs text-muted">License {o.license}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">{company.hours}</p>
        </div>
      </Container>
      <Container className="pb-8">
        <div className="grid grid-cols-3 gap-4">
          {company.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-paper-elevated p-5">
              <p className="font-display text-2xl font-semibold text-ink">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
