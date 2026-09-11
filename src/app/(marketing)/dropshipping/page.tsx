import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { absoluteUrl, dropshippingFaqJsonLd, dropshippingPageJsonLd } from "@/lib/seo";
import {
  dropshipping,
  dropshippingBenefits,
  dropshippingFaqs,
  dropshippingSteps,
} from "@/lib/v2-content";

export const metadata: Metadata = {
  title: "Dropshipping from China Warehouses in Xiamen & Dubai",
  description:
    "Dropship single units and small batches from Seven Color Trading own warehouses in Xiamen, China and Dubai / Al Ain, UAE. Photo/video QC, pick→pack→ship for DTC, Amazon, and Shopify-style sellers. Not a dropship broker.",
  keywords: [
    "dropshipping from China",
    "China warehouse dropship",
    "Xiamen dropshipping",
    "Dubai dropshipping warehouse",
    "DTC China fulfillment",
    "Amazon seller China warehouse",
    "pick pack ship China",
    "Seven Color Trading dropshipping",
  ],
  alternates: { canonical: absoluteUrl("/dropshipping") },
  openGraph: {
    title: "Dropshipping from China Warehouses | Sourcing Center",
    description:
      "Single-unit and small-batch dropship from own warehouses in Xiamen and Dubai — receive, store, pick, pack, and ship to your customers.",
    url: absoluteUrl("/dropshipping"),
    type: "website",
  },
};

export default function DropshippingPage() {
  return (
    <>
      <JsonLd data={dropshippingPageJsonLd()} />
      <JsonLd data={dropshippingFaqJsonLd()} />
      <Container className="pb-16 pt-28 sm:pt-32">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Seven Color Trading Co Ltd · own warehouses · not a broker
        </p>
        <h1 className="mt-3">
          <span className="block font-display text-[4.25rem] font-semibold leading-[0.85] tracking-tight text-accent sm:text-[7rem] lg:text-[8.5rem]">
            {dropshipping.eyebrow}
          </span>
          <span className="mt-5 block font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            {dropshipping.title}
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted sm:text-lg">{dropshipping.description}</p>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Legal entity {company.legalNameFull}. DUNS {company.credentials.dunsNumber}. Dropship
          fulfillment from{" "}
          {dropshippingBenefits.map((h) => `${h.city}, ${h.country}`).join(" and ")}.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {dropshippingSteps.map((step) => (
            <article key={step.title} className="rounded-3xl border border-line bg-paper-elevated p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {dropshippingBenefits.map((hub) => (
            <article key={hub.city} className="rounded-3xl border border-line bg-paper p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{hub.role}</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                {hub.city} · {hub.country}
              </h3>
              <p className="mt-2 text-sm text-muted">{hub.text}</p>
            </article>
          ))}
        </div>

        <section className="mt-16" aria-labelledby="dropshipping-faq">
          <h2
            id="dropshipping-faq"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Frequently asked questions about dropshipping
          </h2>
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {dropshippingFaqs.map((item) => (
              <div key={item.q} className="rounded-3xl border border-line bg-paper-elevated p-6">
                <dt className="font-display text-lg font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted" data-seo-answer>
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-10 text-sm text-muted">
          Need bulk inbound or container programs?{" "}
          <Link href="/3pl" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            Own 3PL warehouses
          </Link>
          . Sea, air, or express after the warehouse?{" "}
          <Link
            href="/logistics"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            Freight lanes and customs
          </Link>
          .
        </p>
      </Container>
      <CtaBand
        title="Talk to the dropship desk"
        description="Tell us the SKU, expected order volume, and whether stock should sit in Xiamen or Dubai. Hand off orders by CSV, spreadsheet, or store export — a relationship manager replies within 24 hours."
      />
    </>
  );
}
