import type { Metadata } from "next";
import Link from "next/link";
import { WorldShippingMap } from "@/components/home/world-map";
import { CommonQuestions } from "@/components/seo/common-questions";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { serviceCommonQuestions } from "@/lib/faq";
import { pages } from "@/lib/route-seo";
import { offerNode, serviceCopy } from "@/lib/structured-data";
import { fulfillment, fulfillmentHubs, fulfillmentSteps } from "@/lib/v2-content";

export const metadata: Metadata = pages.logistics;

export default function LogisticsPage() {
  return (
    <>
      <JsonLd data={offerNode("logistics")} />
      <PageHero
        eyebrow="3PL & Logistics"
        title="Warehouses we run — freight that matches how you buy"
        description="Full 3PL in Xiamen and Dubai, tied to the sourcing desk. Then sea, air, or express with tracking your ops team can trust."
      />
      <Container className="py-16">
        <h2>
          <span className="block font-display text-[3.5rem] font-semibold leading-[0.85] tracking-tight text-accent sm:text-7xl">
            {fulfillment.eyebrow}
          </span>
          <span className="mt-4 block font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {fulfillment.title}
          </span>
        </h2>
        <p className="mt-3 max-w-2xl text-muted">{fulfillment.description}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted" data-seo-answer>
          {serviceCopy.logistics.description}
        </p>
        <p className="mt-3 text-sm text-muted">
          Legal entity {company.legalNameFull}. DUNS {company.credentials.dunsNumber}. Since{" "}
          {company.founded}.
        </p>
        <p className="mt-3 text-sm">
          <Link href="/3pl" className="font-medium text-accent underline-offset-4 hover:underline">
            Full 3PL warehouse page
          </Link>
          {" · "}
          <Link href="/inspection" className="font-medium text-accent underline-offset-4 hover:underline">
            Inspection before freight
          </Link>
          {" · "}
          <Link href="/visit" className="font-medium text-accent underline-offset-4 hover:underline">
            Hosted factory visit
          </Link>
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {fulfillmentSteps.map((step) => (
            <div key={step.title} className="glass-card rounded-[1.5rem] p-6">
              <h3 className="font-display text-xl font-semibold text-ink">3PL {step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {fulfillmentHubs.map((hub) => (
            <div key={hub.city} className="glass-card rounded-[1.5rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{hub.role}</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                {hub.city} · {hub.country}
              </h3>
              <p className="mt-2 text-sm text-muted">{hub.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Freight lanes
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Consolidate in China, stage through Dubai when needed, and deliver with tracking.
          </p>
        </div>
        <WorldShippingMap />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Sea freight", "Cost-efficient containers and LCL for replenishment."],
            ["Air freight", "Launch windows and urgent replenishment."],
            ["Express", "Samples and small parcels with door delivery."],
          ].map(([t, d]) => (
            <div key={t} className="glass-card rounded-[1.5rem] p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
        <CommonQuestions items={serviceCommonQuestions.logistics} />
      </Container>
      <CtaBand />
    </>
  );
}
