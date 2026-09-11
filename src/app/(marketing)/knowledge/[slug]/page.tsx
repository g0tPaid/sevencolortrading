import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { knowledgeArticles } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { fulfillmentFaqs } from "@/lib/v2-content";

export function generateStaticParams() {
  return knowledgeArticles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const article = knowledgeArticles.find((a) => a.slug === slug);
    if (!article) return { title: "Article" };
    const description =
      "excerpt" in article && article.excerpt
        ? article.excerpt
        : `${article.category} guide from Sourcing Center (Seven Color Trading Co Ltd) in Xiamen and Dubai.`;
    return {
      title: article.title,
      description,
      alternates: { canonical: absoluteUrl(`/knowledge/${article.slug}`) },
      openGraph: {
        title: `${article.title} | Sourcing Center`,
        description,
        url: absoluteUrl(`/knowledge/${article.slug}`),
        type: "article",
      },
    };
  });
}

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = knowledgeArticles.find((a) => a.slug === slug);
  if (!article) notFound();
  const isThreePl = slug === "3pl-warehouses-xiamen-dubai";
  const excerpt = "excerpt" in article ? article.excerpt : undefined;

  return (
    <>
      <PageHero
        eyebrow={article.category}
        title={article.title}
        description={`${article.readTime} read · Field notes from Seven Color desks in Xiamen and Dubai.`}
      />
      <Container className="prose-none max-w-3xl py-16 text-muted">
        <p className="text-base leading-relaxed text-ink">
          {excerpt ??
            `This briefing summarizes how our Xiamen and Dubai teams run ${article.category.toLowerCase()} work for active buyers. Use it as a checklist when preparing an RFQ or reviewing a supplier.`}
        </p>
        {isThreePl ? (
          <>
            <p className="mt-4 text-base leading-relaxed">
              Buyers searching for “3PL China”, “warehouse in Xiamen”, or “3PL Dubai for importers” are usually deciding
              between a broker, Amazon FBA, and an operator who already sits on the factory floor. Sourcing Center is
              the third option: own warehouses, same relationship manager as sourcing.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">
                Xiamen HQ warehouse receives from factories, counts, and photographs inbound.
              </li>
              <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">
                Dubai / Al Ain warehouse stages GCC replenishment closer to the shelf.
              </li>
              <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">
                Pick, pack, and ship from either hub — one unit or a container program.
              </li>
              <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">
                Canonical service page:{" "}
                <Link href="/3pl" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
                  sourcing.center/3pl
                </Link>
                .
              </li>
            </ul>
            <h2 className="mt-12 font-display text-2xl font-semibold text-ink">3PL FAQ</h2>
            <dl className="mt-6 space-y-4">
              {fulfillmentFaqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-line bg-paper-elevated p-5">
                  <dt className="font-medium text-ink">{item.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed" data-seo-answer>
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <ul className="mt-8 space-y-3 text-sm">
            <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">
              Define measurable acceptance criteria before sampling.
            </li>
            <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">
              Request photo/video evidence at each production gate.
            </li>
            <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">
              Align Incoterms, lead time, and payment terms in writing.
            </li>
            <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-3">
              Confirm packaging and labeling against your market requirements.
            </li>
          </ul>
        )}
      </Container>
      <CtaBand />
    </>
  );
}
