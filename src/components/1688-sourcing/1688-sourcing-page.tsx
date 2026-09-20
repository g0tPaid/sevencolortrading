import Link from "next/link";
import { CommonQuestions } from "@/components/seo/common-questions";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand, PageHero } from "@/components/shared/page-shell";
import { ProofChips } from "@/components/trust/proof-chips";
import { Container } from "@/components/ui/primitives";
import { sourcing1688Faqs } from "@/lib/money-page-faqs";
import { faqPageJsonLd } from "@/lib/seo";
import { breadcrumbGraph } from "@/lib/structured-data";
import { whatsappPresets } from "@/lib/whatsapp";

const steps = [
  {
    title: "Send the 1688 link",
    text: "Paste the 1688 URL, SKU, or a photo. The China desk reads the listing the same business day. You do not need a 1688 account.",
  },
  {
    title: "We pay in RMB",
    text: "Xiamen Ajmal Seven Color Trading Co Ltd places and pays the domestic order. Mainland payment, address, and language sit with the trading company, not with you.",
  },
  {
    title: "Parcel into our Xiamen warehouse",
    text: "The factory or 1688 seller ships domestically to our own warehouse on Huli Avenue, Huli District, Xiamen. We count and photograph inbound. This is not a brokered slot.",
  },
  {
    title: "QC, then hold or export",
    text: "Photo/video QC on inbound. Formal PSI, DUPRO, or loading at USD 110 per inspector day when you want a lot check. Then 3PL hold, dropship, or sea/air/express from Xiamen or Dubai.",
  },
];

const vsSelf = [
  {
    title: "Buying 1688 yourself",
    points: [
      "Need a Chinese payment path, a mainland receive address, and enough Mandarin to argue a defect.",
      "Listing photos are not a factory identity check.",
      "Export, carton marks, and GCC replenishment are extra vendors.",
    ],
  },
  {
    title: "Sourcing Center desk",
    points: [
      "China trading company pays RMB and receives into our Xiamen warehouse.",
      "License and factory vs trader checks before a deposit when the SKU is new.",
      "Same desk for inspection, own 3PL in Xiamen and Dubai / Al Ain, and Visit China.",
    ],
  },
];

export function Sourcing1688Page() {
  return (
    <>
      <JsonLd data={faqPageJsonLd([...sourcing1688Faqs])} />
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "1688 sourcing", path: "/1688-sourcing" },
        ])}
      />
      <WhatsAppPrefill message={whatsappPresets.sourcing1688} />
      <PageHero
        eyebrow="1688 sourcing agent"
        title="We buy from 1688 in China, QC in Xiamen, then export"
        description="1688 is a domestic wholesale catalog. Sourcing Center is the on-ground desk: RMB payment, inbound to our own Xiamen warehouse, photo/video QC, then 3PL or freight. Not a 1688 app and not an official 1688 partner."
      />
      <Container className="py-16">
        <ProofChips className="justify-start" />
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted" data-seo-answer>
          Send a 1688 link, a Taobao-style wholesale SKU, or a photo. The Xiamen desk of Xiamen Ajmal
          Seven Color Trading Co Ltd (Sourcing.center established 2024; 10+ years of China sourcing
          and manufacturing experience dating back to 2014; DUNS 509419282) pays in RMB, takes the domestic
          parcel into our warehouse, and only then talks export. That is how importers use 1688
          without a Chinese account. It is not a public storefront of every 1688 listing.
        </p>

        <h2 className="mt-12 font-display text-2xl font-semibold text-ink sm:text-3xl">
          How 1688 buying runs on this desk
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <article key={step.title} className="glass-card rounded-[1.5rem] p-6">
              <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-16 font-display text-2xl font-semibold text-ink sm:text-3xl">
          1688 vs doing it yourself
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {vsSelf.map((col) => (
            <article key={col.title} className="glass-card rounded-[1.5rem] p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{col.title}</h3>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
                {col.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <h2 className="mt-16 font-display text-2xl font-semibold text-ink sm:text-3xl">
          What this page does not claim
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          We do not claim a 1688 partnership, a live 1688 browser plugin, or a price list of every
          SKU. Factory pack sizes on 1688 still apply to that listing. Sourcing Center does not add
          a marketplace-style MOQ on top. Inspection, when you want a formal lot check, is the
          published rate: USD 110 per inspector day. Sourcing, 3PL, and freight are quoted from the
          RFQ. We do not invent a commission percentage on this site.
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          Related:{" "}
          <Link href="/compare/sourcing-agent-vs-1688" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            sourcing agent vs 1688
          </Link>
          {" · "}
          <Link href="/compare/sourcing-agent-vs-alibaba" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            sourcing agent vs Alibaba
          </Link>
          {" · "}
          <Link href="/knowledge/how-to-source-from-1688" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            how to source from 1688
          </Link>
          {" · "}
          <Link href="/factory-verification" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            factory verification
          </Link>
          {" · "}
          <Link href="/inspection" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            inspection
          </Link>
          {" · "}
          <Link href="/3pl" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            own 3PL
          </Link>
          {" · "}
          <Link href="/contact" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            send an RFQ
          </Link>
          .
        </p>
        <CommonQuestions items={[...sourcing1688Faqs]} heading="1688 sourcing questions" />
      </Container>
      <CtaBand
        title="Send a 1688 link with the RFQ"
        description="Paste the listing, quantity, and destination. A relationship manager in China replies within 24 hours."
        whatsappMessage={whatsappPresets.sourcing1688}
      />
    </>
  );
}
