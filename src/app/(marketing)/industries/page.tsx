import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { industries } from "@/lib/content";

import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.industries;

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Expertise shaped by real buying cycles"
        description="Playbooks for teams that replenish weekly, launch seasons, or deliver projects on hard deadlines. Ecommerce and DTC has its own URL; other verticals stay on this index on purpose."
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2 lg:grid-cols-3">
        {industries.map((item) => {
          const body = (
            <>
              <h2 className="font-display text-xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
              {"href" in item && item.href ? (
                <p className="mt-4 text-sm font-medium text-ink">Open the DTC playbook</p>
              ) : null}
            </>
          );
          return "href" in item && item.href ? (
            <Link key={item.title} href={item.href} className="glass-card glass-card-hover rounded-[1.5rem] p-7">
              {body}
            </Link>
          ) : (
            <article key={item.title} className="glass-card rounded-[1.5rem] p-7">
              {body}
            </article>
          );
        })}
      </Container>
      <CtaBand />
    </>
  );
}
