import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { caseStudies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Selected Seven Color sourcing programs across retail, ecommerce, and hospitality.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Outcomes, not slogans"
        description="Representative programs showing how the desk operates under real constraints."
      />
      <Container className="grid gap-4 py-16 lg:grid-cols-3">
        {caseStudies.map((c) => (
          <article key={c.title} className="rounded-3xl border border-line bg-paper-elevated p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{c.industry}</p>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink">{c.title}</h2>
            <p className="mt-3 text-sm font-medium text-ink">{c.result}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.summary}</p>
          </article>
        ))}
      </Container>
      <CtaBand />
    </>
  );
}
