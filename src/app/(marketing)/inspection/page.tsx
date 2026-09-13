import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand } from "@/components/shared/page-shell";
import { ProofChips } from "@/components/trust/proof-chips";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { absoluteUrl, inspectionFaqJsonLd, inspectionPageJsonLd } from "@/lib/seo";
import {
  inspection,
  inspectionFaqs,
  inspectionPrice,
  inspectionServices,
  inspectionSteps,
  inspectionWhen,
} from "@/lib/v2-content";
import { whatsappPresets } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Inspection Services in China",
  description:
    "On-the-ground inspection in China from Seven Color Trading — factory audits, pre-shipment (PSI), during production (DUPRO), loading supervision, and photo/video defect reports. Not remote-only.",
  keywords: [
    "China inspection services",
    "pre-shipment inspection China",
    "DUPRO inspection China",
    "factory audit Xiamen",
    "loading supervision China",
    "photo video QC China",
    "Seven Color Trading inspection",
  ],
  alternates: { canonical: absoluteUrl("/inspection") },
  openGraph: {
    title: "Inspection Services in China | Sourcing Center",
    description:
      "Factory audits, PSI, DUPRO, loading supervision, and photo/video defect packs — inspectors on the ground in China.",
    url: absoluteUrl("/inspection"),
    type: "website",
  },
};

export default function InspectionPage() {
  return (
    <>
      <JsonLd data={inspectionPageJsonLd()} />
      <JsonLd data={inspectionFaqJsonLd()} />
      <WhatsAppPrefill message={whatsappPresets.inspection} />
      <Container className="pb-16 pt-28 sm:pt-32">
        <p className="section-kicker">
          {company.legalName} · Xiamen desk · on the ground
        </p>
        <h1 className="mt-3">
          <span className="block font-display text-[4.25rem] font-semibold leading-[0.85] tracking-tight text-accent sm:text-[7rem] lg:text-[8.5rem]">
            {inspection.eyebrow}
          </span>
          <span className="mt-5 block font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            {inspection.title}
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted sm:text-lg">{inspection.description}</p>
        <aside className="glass-panel mt-8 max-w-xl rounded-[1.75rem] px-6 py-6 sm:px-8 sm:py-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Price</p>
          <p className="mt-2 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
            USD 110
            <span className="ml-2 font-display text-2xl font-semibold text-muted sm:text-3xl">
              {inspectionPrice.period}
            </span>
          </p>
          <p className="mt-2 text-sm text-muted">{inspectionPrice.note}</p>
        </aside>
        <p className="mt-6 max-w-2xl text-sm text-muted">
          Legal entity {company.legalNameFull}. Inspectors work from the Xiamen, China desk — complementary
          to hosted factory visits, sourcing, and own-warehouse 3PL. We do not claim a third-party
          inspection accreditation on this page.
        </p>
        <ProofChips className="mt-6 justify-start" />

        <section className="mt-12" aria-labelledby="inspection-services">
          <h2
            id="inspection-services"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            What we inspect
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {inspectionServices.map((item) => (
              <article key={item.title} className="glass-card rounded-[1.5rem] p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="inspection-when">
          <h2
            id="inspection-when"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            When to use inspection
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {inspectionWhen.map((item) => (
              <article key={item.title} className="glass-card rounded-[1.5rem] p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="inspection-process">
          <h2
            id="inspection-process"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            How an inspection runs
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {inspectionSteps.map((step, i) => (
              <article key={step.title} className="glass-card rounded-[1.5rem] p-6">
                <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="inspection-faq">
          <h2
            id="inspection-faq"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Frequently asked questions about inspection
          </h2>
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {inspectionFaqs.map((item) => (
              <div key={item.q} className="glass-card rounded-[1.5rem] p-6">
                <dt className="font-display text-lg font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted" data-seo-answer>
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-10 text-sm text-muted">
          Deciding between flying in and a lot-level check?{" "}
          <Link
            href="/compare/factory-visit-vs-remote-qc"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            Factory visit vs remote QC
          </Link>
          . Hosted trip:{" "}
          <Link href="/visit" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            Visit China
          </Link>
          . Hold stock after QC:{" "}
          <Link href="/3pl" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            Own 3PL warehouses
          </Link>
          . Audit checklist:{" "}
          <Link
            href="/knowledge/factory-audit-checklist"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            factory audit notes
          </Link>
          .
        </p>
      </Container>
      <CtaBand
        title="Talk to the inspection desk"
        description="USD 110 / day per inspector. Send the SKU, quantity, factory or warehouse location, and spec — a relationship manager in Xiamen replies within 24 hours."
        whatsappMessage={whatsappPresets.inspection}
      />
    </>
  );
}
