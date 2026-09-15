import type { Metadata } from "next";
import Link from "next/link";
import { CommonQuestions } from "@/components/seo/common-questions";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand, PageHero } from "@/components/shared/page-shell";
import { ProofChips } from "@/components/trust/proof-chips";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { uaeSourcingFaqs } from "@/lib/money-page-faqs";
import { pages } from "@/lib/route-seo";
import { faqPageJsonLd } from "@/lib/seo";
import { breadcrumbGraph } from "@/lib/structured-data";
import { whatsappPresets } from "@/lib/whatsapp";

export const metadata: Metadata = pages.sourcingForUae;

export default function SourcingForUaePage() {
  const uae = company.offices.find((office) => office.country === "United Arab Emirates");

  return (
    <>
      <JsonLd data={faqPageJsonLd([...uaeSourcingFaqs])} />
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "China sourcing for the UAE", path: "/sourcing-for/uae" },
        ])}
      />
      <WhatsAppPrefill message={whatsappPresets.uae} />
      <PageHero
        eyebrow="China sourcing for the UAE"
        title="China factory desk plus our own Dubai / Al Ain warehouse"
        description="Source in China, inspect on the ground, then stage stock in the operator-owned UAE hub for GCC replenishment. Not a USA clone page and not a 3PL broker."
      />
      <Container className="py-16">
        <ProofChips className="justify-start" />
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted" data-seo-answer>
          Sourcing Center is the China desk of {company.legalNameFull}, with HQ and warehouse in
          Xiamen and a licensed UAE branch warehouse in Al Ain (Dubai / Al Ain hub). UAE trade
          license {uae?.license ?? "143609"}. Buyers in Dubai, Abu Dhabi, Sharjah, and the wider GCC
          use this path when they need China factories and a warehouse that is already in the
          Emirates, on the same relationship manager.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <article className="glass-card rounded-[1.5rem] p-6">
            <h2 className="font-display text-xl font-semibold text-ink">China sourcing</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Verified factories, no required MOQ, photo/video QC. Optional 1688 buying paid in RMB
              into the Xiamen warehouse. Inspection USD 110 per inspector day.
            </p>
          </article>
          <article className="glass-card rounded-[1.5rem] p-6">
            <h2 className="font-display text-xl font-semibold text-ink">UAE warehouse</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {uae?.address}. Receive, store, pick, pack, ship. Operator-owned, not a brokered 3PL
              introduction.
            </p>
          </article>
          <article className="glass-card rounded-[1.5rem] p-6">
            <h2 className="font-display text-xl font-semibold text-ink">GCC lanes</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Sea, air, or express after inbound QC. Stock can leave from Xiamen or from Al Ain.
              Incoterms should match where you take risk.
            </p>
          </article>
        </div>

        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
          This is not a “China sourcing for USA” template with the country name swapped. The UAE
          page exists because the company actually runs a warehouse and license here. We do not
          publish a general freight tariff or invent duty tables for every HS code. Ask the desk for
          a lane quote. Field note:{" "}
          <Link
            href="/knowledge/incoterms-for-gcc"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            Incoterms for China → GCC
          </Link>
          {" · "}
          <Link href="/3pl" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            3PL warehouses
          </Link>
          {" · "}
          <Link href="/logistics" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            freight
          </Link>
          {" · "}
          <Link href="/contact" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            RFQ
          </Link>
          .
        </p>
        <CommonQuestions items={[...uaeSourcingFaqs]} heading="UAE sourcing questions" />
      </Container>
      <CtaBand
        title="RFQ for UAE / GCC inbound"
        description="SKU, quantity, and whether stock should sit in Xiamen, Al Ain, or both. Reply in 24 hours."
        whatsappMessage={whatsappPresets.uae}
      />
    </>
  );
}
