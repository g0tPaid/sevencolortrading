import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { whatsappPresets } from "@/lib/whatsapp";
import { Container } from "@/components/ui/primitives";
import { caseStudies } from "@/lib/case-studies";
import { comparePages } from "@/lib/compare";
import { knowledgeArticles } from "@/lib/content";

import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.knowledge;

export default function KnowledgePage() {
  return (
    <>
      <WhatsAppPrefill message={whatsappPresets.rfq} />
      <PageHero
        eyebrow="Knowledge center"
        title="Procurement notes from the field"
        description="Practical writing for teams buying from China — not generic trade blog filler."
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2">
        <p className="md:col-span-2 text-sm text-muted">
          Start with the{" "}
          <Link href="/faq" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            China sourcing FAQ
          </Link>{" "}
          or a field guide below. How-to path:{" "}
          <Link
            href="/knowledge/how-to-source-from-china"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            how to source from China
          </Link>
          {" · "}
          <Link
            href="/knowledge/china-quality-inspection-guide"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            China quality inspection guide
          </Link>
          .
        </p>
        {knowledgeArticles.map((a) => (
          <Link key={a.slug} href={`/knowledge/${a.slug}`} className="glass-card glass-card-hover rounded-[1.5rem] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{a.category}</p>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink">{a.title}</h2>
            <p className="mt-3 text-sm text-muted">{a.readTime} read</p>
          </Link>
        ))}
      </Container>
      <Container className="pb-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-kicker">Compare</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Answer-shaped comparisons
            </h2>
          </div>
          <Link
            href="/compare"
            className="text-sm font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            All comparisons
          </Link>
        </div>
        <div className="mb-16 grid gap-4 lg:grid-cols-3">
          {comparePages.map((page) => (
            <Link
              key={page.slug}
              href={`/compare/${page.slug}`}
              className="glass-card glass-card-hover rounded-[1.5rem] p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {page.eyebrow}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">{page.title}</h3>
              <p className="mt-3 text-sm text-muted">{page.description}</p>
            </Link>
          ))}
        </div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-kicker">Case studies</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Example engagements from the desk
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="text-sm font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            All case studies
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="glass-card glass-card-hover rounded-[1.5rem] p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{study.industry}</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">{study.title}</h3>
              <p className="mt-3 text-sm text-muted">{study.result}</p>
            </Link>
          ))}
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
