import type { Metadata } from "next";
import Link from "next/link";
import { CommonQuestions } from "@/components/seo/common-questions";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand, PageHero } from "@/components/shared/page-shell";
import { ProofChips } from "@/components/trust/proof-chips";
import { Container } from "@/components/ui/primitives";
import { verificationSteps } from "@/lib/content";
import { factoryVerificationFaqs } from "@/lib/money-page-faqs";
import { pages } from "@/lib/route-seo";
import { faqPageJsonLd } from "@/lib/seo";
import { breadcrumbGraph } from "@/lib/structured-data";
import { whatsappPresets } from "@/lib/whatsapp";

export const metadata: Metadata = pages.factoryVerification;

const checks = [
  {
    title: "License and entity",
    text: "Business license number, legal name, and whether the quotation matches the entity on the floor. China license review of the kind published on GSXT / National Enterprise Credit. Export credentials when the maker claims they ship themselves.",
  },
  {
    title: "Factory or trading company",
    text: "Walk the line. A trading layer can still be useful; you should know which one you are depositing with. See factory vs trading company in the knowledge base.",
  },
  {
    title: "Capacity and lead time",
    text: "Active lines, not a showroom. MOQ the factory will actually run, not the listing speech. Sample vs mass-production path.",
  },
  {
    title: "Quality system",
    text: "Incoming material, in-process checks, packing. Photo/video of the floor. Optional formal inspection at USD 110 per inspector day.",
  },
];

export default function FactoryVerificationPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd([...factoryVerificationFaqs])} />
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Factory verification", path: "/factory-verification" },
        ])}
      />
      <WhatsAppPrefill message={whatsappPresets.rfq} />
      <PageHero
        eyebrow="China factory verification"
        title="China factory verification: license, lines, and capacity"
        description="Xiamen team validates credentials, capacity, and quality systems before you commit a purchase order. License checks, line walkthrough, then commercial terms. Not a tourist factory tour."
      />
      <Container className="py-16">
        <ProofChips className="justify-start" />
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted" data-seo-answer>
          Factory verification is the identity and capacity check. Pre-shipment inspection is the
          lot check. Sourcing Center runs both from the China desk of Xiamen Ajmal Seven Color
          Trading Co Ltd (Sourcing.center established 2024; 10+ years of China sourcing and
          manufacturing experience dating back to 2014; DUNS 509419282, China license 91350200MAE8W9E67A). Use
          verification on a first maker, a 1688 seller you have never walked, or whenever listing
          photos are the only proof you have been sent.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-dark rounded-[1.75rem] p-8 text-paper">
            <p className="font-display text-2xl font-semibold">Verification workflow</p>
            <p className="mt-3 text-sm text-paper/70">
              Structured audits designed for procurement, not tourism factory tours. Pair with a
              hosted Visit China trip when you want to walk the line yourself.
            </p>
          </div>
          <ol className="space-y-3">
            {verificationSteps.map((step, i) => (
              <li key={step} className="glass-card flex gap-4 rounded-2xl px-5 py-4">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm font-medium text-ink">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="mt-16 font-display text-2xl font-semibold text-ink sm:text-3xl">
          What the desk actually checks
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {checks.map((item) => (
            <article key={item.title} className="glass-card rounded-[1.5rem] p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
          After verification, lock the lot with{" "}
          <Link href="/inspection" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            on-the-ground inspection
          </Link>{" "}
          (USD 110 per inspector day), hold stock in{" "}
          <Link href="/3pl" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            own 3PL in Xiamen or Dubai
          </Link>
          , or fly a{" "}
          <Link href="/visit" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            hosted factory visit
          </Link>
          . Importer checklist:{" "}
          <Link
            href="/knowledge/factory-audit-checklist"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            factory audit checklist
          </Link>
          {" · "}
          <Link
            href="/knowledge/factory-vs-trading-company"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            factory vs trading company
          </Link>
          {" · "}
          <Link href="/1688-sourcing" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            1688 buying
          </Link>
          .
        </p>
        <CommonQuestions items={[...factoryVerificationFaqs]} heading="Factory verification questions" />
      </Container>
      <CtaBand title="Send the factory name or 1688 link" whatsappMessage={whatsappPresets.rfq} />
    </>
  );
}
