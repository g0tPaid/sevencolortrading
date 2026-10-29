import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { ProofChips } from "@/components/trust/proof-chips";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { pages } from "@/lib/route-seo";
import { siteUrl } from "@/lib/seo";
import { breadcrumbGraph } from "@/lib/structured-data";
import { whatsappHref, whatsappPresets } from "@/lib/whatsapp";

const whatsappMessage = whatsappPresets.freightForwarding;

const modes = [
  {
    title: "Sea",
    text: "Containers and LCL when the calendar can wait and the cube is large. The usual replenishment lane.",
  },
  {
    title: "Air",
    text: "Launch dates and stockouts that will not wait for a vessel. Shorter transit, higher cost.",
  },
  {
    title: "Rail",
    text: "China–Europe overland when you want a calendar between sea and air. Quoted when the cargo and the corridor fit. No timetable is published here.",
  },
] as const;

const help = [
  {
    title: "Same desk as the order",
    text: "The lane is booked with the sourcing brief, not handed to a second company you have to educate.",
  },
  {
    title: "After the goods are counted",
    text: "Freight starts once inspection is done, or once the lot is inbound at our Xiamen warehouse.",
  },
  {
    title: "Tracking stays here",
    text: "Customs questions and tracking stay on this desk, including stock that also sits in Dubai / Al Ain.",
  },
] as const;

export const metadata: Metadata = {
  ...pages.freightForwarding,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function FreightForwardingPage() {
  const pageUrl = `${siteUrl}/freight-forwarding`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${pageUrl}#webpage`,
          url: pageUrl,
          name: "China Freight Forwarding: Sea, Air, and Rail Lanes",
          description: pages.freightForwarding.description,
          isPartOf: { "@id": `${siteUrl}/#website` },
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["h1", "h2", "[data-seo-answer]"],
          },
        }}
      />
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Freight forwarding", path: "/freight-forwarding" },
        ])}
      />
      <WhatsAppPrefill message={whatsappMessage} />
      <Container className="pb-16 pt-28 sm:pt-32">
        <section aria-labelledby="freight-place">
          <h1
            id="freight-place"
            className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
          >
            Where it sits
          </h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Source", "Factory, sample, and purchase order. Freight is not the first conversation."],
              ["Check", "Inspection on the ground, or photo and video QC, before the booking is final."],
              ["Forward", "Sea, air, or rail from the factory or the Xiamen warehouse."],
            ].map(([title, text], i) => (
              <article key={title} className="glass-card rounded-[1.5rem] p-6">
                <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="freight-modes">
          <h2
            id="freight-modes"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Sea, air, and rail
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Three calendars for a finished lot. Samples and small parcels still move as express.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {modes.map((mode) => (
              <article key={mode.title} className="glass-card rounded-[1.5rem] p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{mode.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{mode.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="freight-help">
          <h2
            id="freight-help"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            How we help
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {help.map((item) => (
              <article key={item.title} className="glass-card rounded-[1.5rem] p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="freight-vs-3pl">
          <h2
            id="freight-vs-3pl"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Freight forwarding or 3PL
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="glass-card rounded-[1.5rem] p-6">
              <h3 className="font-display text-xl font-semibold text-ink">Book a lane</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Use freight forwarding when the job is to move a shipment: a lot, a container, or a
                parcel to Amazon, your warehouse, or a customer.
              </p>
            </article>
            <article className="glass-card rounded-[1.5rem] p-6">
              <h3 className="font-display text-xl font-semibold text-ink">Hold the stock</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Use 3PL when the job is to receive, store, then pick and pack later, including
                single units, in Xiamen or Dubai / Al Ain. Many orders do both: stage, then release
                a lane when you are ready to sell.
              </p>
            </article>
          </div>
        </section>

        <p className="mt-10 text-sm text-muted">
          Sea, air, and express detail:{" "}
          <Link href="/logistics" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            freight lanes and customs
          </Link>
          . Warehouses:{" "}
          <Link href="/3pl" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            own 3PL in Xiamen and Dubai
          </Link>
          . Before the box leaves:{" "}
          <Link href="/inspection" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            inspection at USD 110 per inspector day
          </Link>
          .
        </p>
      </Container>

      <section className="pb-16 pt-6 sm:pb-20">
        <Container>
          <div className="glass-panel rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
              Talk to us on WhatsApp
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Send the cargo, the destination, and whether it should move now or sit in Xiamen or
              Dubai first. A relationship manager replies within 24 hours.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={whatsappHref(whatsappMessage)}>Talk to us on WhatsApp</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Get a quote in 24h
              </ButtonLink>
            </div>
            <ProofChips className="mt-6 justify-start" />
          </div>
        </Container>
      </section>
    </>
  );
}
