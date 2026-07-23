import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { industries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Industries",
  description: "Industry playbooks for ecommerce, retail, hospitality, industrial, fashion, and construction buyers.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Expertise shaped by real buying cycles"
        description="Playbooks for teams that replenish weekly, launch seasons, or deliver projects on hard deadlines."
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2 lg:grid-cols-3">
        {industries.map((item) => (
          <article key={item.title} className="rounded-3xl border border-line bg-paper-elevated p-7">
            <h2 className="font-display text-xl font-semibold text-ink">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
          </article>
        ))}
      </Container>
      <CtaBand />
    </>
  );
}
