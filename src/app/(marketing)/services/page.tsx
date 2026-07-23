import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { categories, services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "Full China sourcing desk — verification, QC, private label, OEM/ODM, and logistics.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="A complete sourcing operating system"
        description="Every capability your procurement team needs between RFQ and delivery — without marketplace noise."
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2">
        {services.map((s) => (
          <Link key={s.href} href={s.href} className="rounded-3xl border border-line bg-paper-elevated p-7 transition hover:border-accent/40">
            <h2 className="font-display text-2xl font-semibold text-ink">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{s.description}</p>
          </Link>
        ))}
      </Container>
      <Container className="pb-10">
        <h2 className="font-display text-2xl font-semibold text-ink">Categories we cover</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.slug} className="rounded-2xl border border-line px-5 py-4">
              <p className="font-medium text-ink">{c.title}</p>
              <p className="mt-1 text-sm text-muted">{c.description}</p>
            </div>
          ))}
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
