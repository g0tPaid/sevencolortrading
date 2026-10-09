import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.terms;

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Using sourcing.center"
        description="The site is an inquiry desk for China sourcing, inspection, Visit China, and own-warehouse 3PL. Pages are not a catalog invoice or a guaranteed factory quote."
      />
      <Container className="max-w-3xl space-y-8 py-16 text-muted leading-relaxed">
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">The operator</h2>
          <p className="mt-3">
            {company.legalNameFull} ({company.legalName}) runs this site. Indicative product ranges,
            margin bands, and article examples are planning notes. A real price needs a spec, quantity,
            and a factory that will make it.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">Quotes and orders</h2>
          <p className="mt-3">
            An RFQ or WhatsApp thread is not a purchase order. Inspection at USD 110 per inspector day,
            freight, and 3PL are quoted from the brief. You stay responsible for destination law,
            duties, and how you sell the goods.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">Your submissions</h2>
          <p className="mt-3">
            Do not send information you do not have the right to share. We may refuse work that we
            cannot verify or that sits outside ordinary goods trade.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">Contact</h2>
          <p className="mt-3">
            {company.emails.sme} · {company.emails.corporate} · {company.phones[1]} · {company.phones[0]}.
          </p>
        </section>
      </Container>
    </>
  );
}
