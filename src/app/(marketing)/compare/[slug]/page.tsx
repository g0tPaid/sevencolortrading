import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand } from "@/components/shared/page-shell";
import { ProofChips } from "@/components/trust/proof-chips";
import { Container } from "@/components/ui/primitives";
import { comparePages, getComparePage } from "@/lib/compare";
import { comparePageFaqJsonLd, routeMetadata } from "@/lib/seo";
import { compareMeta } from "@/lib/route-seo";
import { breadcrumbGraph } from "@/lib/structured-data";
import { whatsappPresets } from "@/lib/whatsapp";

export function generateStaticParams() {
  return comparePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) return { title: "Compare" };
  const meta = compareMeta[slug];
  return routeMetadata({
    title: meta?.title ?? page.title,
    description: meta?.description ?? page.description,
    path: `/compare/${page.slug}`,
    type: "article",
  });
}

export default async function CompareDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) notFound();

  const whatsappMessage = whatsappPresets[page.whatsappPreset];

  return (
    <>
      <JsonLd data={comparePageFaqJsonLd(page)} />
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: page.title, path: `/compare/${page.slug}` },
        ])}
      />
      <WhatsAppPrefill message={whatsappMessage} />
      <Container className="pb-10 pt-28 sm:pt-32">
        <nav className="text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/compare" className="hover:text-ink">
            Compare
          </Link>
          <span className="px-2" aria-hidden>
            /
          </span>
          <span className="text-ink">{page.title}</span>
        </nav>
        <p className="section-kicker mt-6">{page.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          {page.title}
        </h1>
        <p className="mt-4 max-w-2xl text-muted sm:text-lg" data-seo-answer>
          {page.answer}
        </p>
        <ProofChips className="mt-6 justify-start" />

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {[page.left, page.right].map((col) => (
            <article key={col.name} className="glass-card rounded-[1.5rem] p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {col.tag}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{col.name}</h2>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted">
                {col.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <article className="glass-panel mt-6 rounded-[1.5rem] p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Verdict</p>
          <p className="mt-3 text-base leading-relaxed text-ink">{page.verdict}</p>
        </article>

        <section className="mt-16" aria-labelledby="compare-faq">
          <h2
            id="compare-faq"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {page.faqs.map((item) => (
              <div key={item.q} className="glass-card rounded-[1.5rem] p-6">
                <dt className="font-display text-lg font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted" data-seo-answer>
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {page.related.length ? (
          <section className="mt-16" aria-labelledby="compare-related">
            <h2 id="compare-related" className="font-display text-2xl font-semibold text-ink">
              Related
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {page.related.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="glass-card glass-card-hover block rounded-[1.35rem] p-5 text-sm font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
      <CtaBand
        title="Talk through your path"
        description="WhatsApp opens with this comparison already named. A relationship manager replies within 24 hours."
        whatsappMessage={whatsappMessage}
      />
    </>
  );
}
