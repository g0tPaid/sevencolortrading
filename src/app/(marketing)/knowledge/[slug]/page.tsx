import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { knowledgeArticles } from "@/lib/content";

export function generateStaticParams() {
  return knowledgeArticles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const article = knowledgeArticles.find((a) => a.slug === slug);
    return article
      ? { title: article.title, description: `${article.category} · ${article.readTime} read` }
      : { title: "Article" };
  });
}

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = knowledgeArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <>
      <PageHero eyebrow={article.category} title={article.title} description={`${article.readTime} read · Field notes from Seven Color desks.`} />
      <Container className="prose-none max-w-3xl py-16 text-muted">
        <p className="text-base leading-relaxed">
          This briefing summarizes how our Xiamen and Dubai teams run {article.category.toLowerCase()} work for active buyers.
          Use it as a checklist when preparing an RFQ or reviewing a supplier.
        </p>
        <ul className="mt-8 space-y-3 text-sm">
          <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">Define measurable acceptance criteria before sampling.</li>
          <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">Request photo/video evidence at each production gate.</li>
          <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">Align Incoterms, lead time, and payment terms in writing.</li>
          <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">Confirm packaging and labeling against your market requirements.</li>
        </ul>
      </Container>
      <CtaBand />
    </>
  );
}
