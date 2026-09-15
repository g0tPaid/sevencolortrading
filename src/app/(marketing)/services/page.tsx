import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { categories, services } from "@/lib/content";

import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.services;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="China sourcing services: QC, OEM, 3PL, 1688 buying"
        description="Every capability between RFQ and delivery: verification, USD 110/day inspection, private label, OEM/ODM, Amazon FBA prep, 1688 buying, and own-warehouse logistics."
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2">
        {services.map((s) => (
          <Link key={s.href} href={s.href} className="glass-card glass-card-hover rounded-[1.5rem] p-7">
            <h2 className="font-display text-2xl font-semibold text-ink">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{s.description}</p>
          </Link>
        ))}
      </Container>
      <Container className="pb-10">
        <h2 className="font-display text-2xl font-semibold text-ink">Categories we cover</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.slug} className="glass-card rounded-2xl px-5 py-4">
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
