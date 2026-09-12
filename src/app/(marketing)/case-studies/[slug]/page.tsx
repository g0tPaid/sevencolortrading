import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { SampleNote } from "@/components/trust/sample-note";
import { TrustCta } from "@/components/trust/trust-cta";
import { Container } from "@/components/ui/primitives";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import { absoluteUrl, caseStudyPageJsonLd } from "@/lib/seo";
import { whatsappPresets } from "@/lib/whatsapp";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case study" };
  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: absoluteUrl(`/case-studies/${study.slug}`) },
    openGraph: {
      title: `${study.title} | Sourcing Center`,
      description: study.summary,
      url: absoluteUrl(`/case-studies/${study.slug}`),
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const related = caseStudies.filter((item) => item.slug !== study.slug);
  const whatsappMessage = whatsappPresets[study.whatsappPreset];

  return (
    <>
      <JsonLd data={caseStudyPageJsonLd(study)} />
      <WhatsAppPrefill message={whatsappMessage} />
      <Container className="pb-10 pt-28 sm:pt-32">
        <nav className="text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/case-studies" className="hover:text-ink">
            Case studies
          </Link>
          <span className="px-2" aria-hidden>
            /
          </span>
          <span className="text-ink">{study.title}</span>
        </nav>
        <p className="section-kicker mt-6">{study.industry}</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          {study.title}
        </h1>
        <p className="mt-4 max-w-2xl text-muted sm:text-lg">{study.summary}</p>
        <SampleNote>
          Example program. Metrics below are illustrative of how the desk operates — not published client KPIs.
        </SampleNote>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {study.metrics.map((metric) => (
            <div key={metric.label} className="glass-card rounded-[1.5rem] p-6">
              <p className="font-display text-2xl font-semibold text-ink">{metric.value}</p>
              <p className="mt-1 text-sm text-muted">{metric.label}</p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                Illustrative
              </p>
            </div>
          ))}
        </div>

        <ol className="mt-10 grid gap-4 lg:grid-cols-3">
          <li className="glass-card rounded-[1.5rem] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">01 · Problem</p>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink">What was stuck</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{study.problem}</p>
          </li>
          <li className="glass-card rounded-[1.5rem] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">02 · What we did</p>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink">The desk path</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              {study.whatWeDid.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </li>
          <li className="glass-card rounded-[1.5rem] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">03 · Result</p>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink">{study.result}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{study.outcome}</p>
          </li>
        </ol>

        {related.length ? (
          <section className="mt-16" aria-labelledby="related-case-studies">
            <h2
              id="related-case-studies"
              className="font-display text-2xl font-semibold tracking-tight text-ink"
            >
              Other example programs
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/case-studies/${item.slug}`}
                  className="glass-card glass-card-hover rounded-[1.5rem] p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {item.industry}
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold text-ink">{item.title}</p>
                  <p className="mt-2 text-sm text-muted">{item.result}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
      <TrustCta
        title="Talk through a similar program"
        description="Start sourcing from the RFQ, or open WhatsApp with this case study already named."
        whatsappMessage={whatsappMessage}
      />
    </>
  );
}
