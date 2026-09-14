import type { Metadata } from "next";
import Link from "next/link";
import { CommonQuestions } from "@/components/seo/common-questions";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand, ServiceBadgeHero } from "@/components/shared/page-shell";
import { ProofChips } from "@/components/trust/proof-chips";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { serviceCommonQuestions } from "@/lib/faq";
import { amazonFbaFaqJsonLd, amazonFbaPageJsonLd } from "@/lib/seo";
import { pages } from "@/lib/route-seo";
import { offerNode } from "@/lib/structured-data";
import {
  amazonFba,
  amazonFbaFaqs,
  amazonFbaSteps,
  amazonFbaWhen,
} from "@/lib/v2-content";
import { whatsappPresets } from "@/lib/whatsapp";

export const metadata: Metadata = pages.amazonFba;

export default function AmazonFbaPage() {
  return (
    <>
      <JsonLd data={amazonFbaPageJsonLd()} />
      <JsonLd data={amazonFbaFaqJsonLd()} />
      <JsonLd data={offerNode("amazon-fba")} />
      <WhatsAppPrefill message={whatsappPresets.amazonFba} />
      <Container className="pb-16 pt-28 sm:pt-32">
        <p className="section-kicker">
          {company.legalName} · China desk · private label for Amazon FBA
        </p>
        <ServiceBadgeHero badge={amazonFba.eyebrow} subtitle={amazonFba.title} />
        <p className="mt-4 max-w-2xl text-ink-soft sm:text-lg">{amazonFba.description}</p>
        <p className="mt-6 max-w-2xl text-sm text-ink-soft">
          Legal entity {company.legalNameFull}. Founded {company.founded}. DUNS{" "}
          {company.credentials.dunsNumber}. On-ground China capability — sourcing, OEM, packaging, QC at
          USD 110 per inspector day, carton-mark coordination, and freight — not Amazon partnership, not
          Seller Central account management, and no published Amazon FBA package price.
        </p>
        <ProofChips className="mt-6 justify-start" />

        <section className="mt-12" aria-labelledby="amazon-fba-steps">
          <h2
            id="amazon-fba-steps"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            How Amazon FBA private label runs from China
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {amazonFbaSteps.map((item) => (
              <article key={item.title} className="glass-card rounded-[1.5rem] p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="amazon-fba-when">
          <h2
            id="amazon-fba-when"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            When to use this desk
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {amazonFbaWhen.map((item) => (
              <article key={item.title} className="glass-card rounded-[1.5rem] p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="amazon-fba-faq">
          <h2
            id="amazon-fba-faq"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Frequently asked questions about Amazon FBA private label
          </h2>
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {amazonFbaFaqs.map((item) => (
              <div key={item.q} className="glass-card rounded-[1.5rem] p-6">
                <dt className="font-display text-lg font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-soft" data-seo-answer>
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <CommonQuestions
          items={serviceCommonQuestions["amazon-fba"]}
          heading="Related OEM, inspection, and 3PL questions"
        />

        <p className="mt-10 text-sm text-ink-soft">
          Develop the SKU first:{" "}
          <Link href="/oem-odm" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            OEM / ODM
          </Link>
          . Generic brand packaging:{" "}
          <Link
            href="/private-label"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            private label
          </Link>
          . Lot-level QC:{" "}
          <Link href="/inspection" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            inspection at USD 110 per inspector day
          </Link>
          . Hold or release stock:{" "}
          <Link href="/3pl" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            own 3PL warehouses
          </Link>
          . Sea, air, or express:{" "}
          <Link href="/logistics" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            freight lanes
          </Link>
          . 3PL vs marketplace fulfillment:{" "}
          <Link
            href="/knowledge/china-3pl-vs-broker-vs-fba"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            3PL vs broker vs FBA
          </Link>
          .
        </p>
      </Container>
      <CtaBand
        title="Talk to the Amazon FBA desk"
        description="Send the SKU, packaging notes, and whether goods should go to Amazon or sit in Xiamen or Dubai. A relationship manager replies within 24 hours. Inspection, when booked, is USD 110 per inspector day."
        whatsappMessage={whatsappPresets.amazonFba}
      />
    </>
  );
}
