import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { knowledgeArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Knowledge Center",
  description: "Guides on RFQs, factory audits, Incoterms, and private label for China importers.",
};

export default function KnowledgePage() {
  return (
    <>
      <PageHero
        eyebrow="Knowledge center"
        title="Procurement notes from the field"
        description="Practical writing for teams buying from China — not generic trade blog filler."
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2">
        {knowledgeArticles.map((a) => (
          <Link key={a.slug} href={`/knowledge/${a.slug}`} className="rounded-3xl border border-line bg-paper-elevated p-7 transition hover:border-accent/40">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{a.category}</p>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink">{a.title}</h2>
            <p className="mt-3 text-sm text-muted">{a.readTime} read</p>
          </Link>
        ))}
      </Container>
      <CtaBand />
    </>
  );
}
