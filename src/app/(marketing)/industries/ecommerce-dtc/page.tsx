import type { Metadata } from "next";
import Link from "next/link";
import { CommonQuestions } from "@/components/seo/common-questions";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand, PageHero } from "@/components/shared/page-shell";
import { ProofChips } from "@/components/trust/proof-chips";
import { Container } from "@/components/ui/primitives";
import { ecommerceDtcFaqs } from "@/lib/money-page-faqs";
import { pages } from "@/lib/route-seo";
import { faqPageJsonLd } from "@/lib/seo";
import { breadcrumbGraph } from "@/lib/structured-data";
import { whatsappPresets } from "@/lib/whatsapp";

export const metadata: Metadata = pages.industriesEcommerceDtc;

const plays = [
  {
    title: "First SKU, small quantity",
    text: "No required MOQ. Sample from 1 unit, photo/video QC, then a pilot lot. Marketplace listings are a scan; the desk matches a verified maker.",
  },
  {
    title: "Private label / Amazon FBA",
    text: "OEM, packaging, inspection, FBA carton marks, freight to Amazon inbound or hold in Xiamen/Dubai 3PL. Not Amazon partnership. Not Seller Central management.",
  },
  {
    title: "DTC replenishment",
    text: "Inbound to our own warehouses, then pick, pack, and ship single units from held stock. CSV / spreadsheet / store export handoff, not a claimed live Shopify app.",
  },
];

export default function EcommerceDtcPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd([...ecommerceDtcFaqs])} />
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: "Ecommerce and DTC", path: "/industries/ecommerce-dtc" },
        ])}
      />
      <WhatsAppPrefill message={whatsappPresets.rfq} />
      <PageHero
        eyebrow="Ecommerce and DTC"
        title="China sourcing for DTC and marketplace sellers"
        description="Small first orders, photo/video QC, Amazon FBA private-label prep, and own-warehouse dropship from Xiamen and Dubai. One China desk, not a broker catalog."
      />
      <Container className="py-16">
        <ProofChips className="justify-start" />
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted" data-seo-answer>
          Ecommerce and DTC teams usually need three things a marketplace listing does not include:
          a factory they can actually buy from, proof before a deposit, and stock that can pick as
          single units. Sourcing Center runs that from Xiamen Ajmal Seven Color Trading Co Ltd:
          sourcing, inspection at USD 110 per inspector day, Amazon FBA prep, and operator-owned
          3PL in Xiamen and Dubai / Al Ain.
        </p>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plays.map((item) => (
            <article key={item.title} className="glass-card rounded-[1.5rem] p-6">
              <h2 className="font-display text-xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
          Start with an{" "}
          <Link href="/contact" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            RFQ
          </Link>
          , a{" "}
          <Link href="/1688-sourcing" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            1688 link
          </Link>
          , or{" "}
          <Link href="/amazon-fba" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            Amazon FBA private label
          </Link>
          . Fulfillment:{" "}
          <Link href="/dropshipping" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            dropshipping
          </Link>
          {" · "}
          <Link href="/3pl" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            3PL
          </Link>
          . This is the one industry page we published as a full URL so it is not a doorway farm of
          cloned category pages.
        </p>
        <CommonQuestions items={[...ecommerceDtcFaqs]} heading="DTC sourcing questions" />
      </Container>
      <CtaBand title="Send the SKU or product idea" whatsappMessage={whatsappPresets.rfq} />
    </>
  );
}
