import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { ProofChips } from "@/components/trust/proof-chips";
import { SampleNote } from "@/components/trust/sample-note";
import { TrustCta } from "@/components/trust/trust-cta";
import { Container } from "@/components/ui/primitives";
import { caseStudies, caseStudiesIntro } from "@/lib/case-studies";
import { caseStudiesIndexJsonLd } from "@/lib/seo";
import { whatsappPresets } from "@/lib/whatsapp";
import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.caseStudies;

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={caseStudiesIndexJsonLd()} />
      <WhatsAppPrefill message={whatsappPresets.caseStudies} />
      <Container className="pb-10 pt-28 sm:pt-32">
        <p className="section-kicker">{caseStudiesIntro.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          {caseStudiesIntro.title}
        </h1>
        <p className="mt-4 max-w-2xl text-muted sm:text-lg">{caseStudiesIntro.description}</p>
        <SampleNote>{caseStudiesIntro.exampleNote}</SampleNote>
        <ProofChips className="mt-5 justify-start" />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="glass-card glass-card-hover flex flex-col rounded-[1.5rem] p-7"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {study.industry}
                </p>
                {study.exampleEngagement ? (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                    Example engagement
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold text-ink">{study.title}</h2>
              <p className="mt-3 text-sm font-medium text-ink">{study.result}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{study.summary}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink">
                Problem → Result
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </Container>
      <TrustCta
        title="Want a program like these?"
        description="Tell the desk the SKU, quantity, and whether you need factory matching, 3PL, or a Xiamen visit."
        whatsappMessage={whatsappPresets.caseStudies}
      />
    </>
  );
}
