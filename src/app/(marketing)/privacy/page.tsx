import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.privacy;

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="How we use details you send the desk"
        description="RFQs, WhatsApp messages, and factory applications go to Xiamen Ajmal Seven Color Trading Co Ltd so we can quote, inspect, or fulfill. We do not sell inquiry lists."
      />
      <Container className="max-w-3xl space-y-8 py-16 text-muted leading-relaxed">
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">Who we are</h2>
          <p className="mt-3">
            {company.legalNameFull} operates sourcing.center (Seven Color Trading DBA sourcing.center).
            China hub: {company.offices[1]?.address}. UAE hub: {company.offices[0]?.address}. DUNS{" "}
            {company.credentials.dunsNumber}.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">What we collect</h2>
          <p className="mt-3">
            Name, company, email, phone, WhatsApp, product brief, quantity, destination, and files you
            attach to an RFQ, visit request, or factory registration. Server logs may include IP and
            browser for security and traffic stats.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">How we use it</h2>
          <p className="mt-3">
            To reply to sourcing, inspection, 3PL, Visit China, and factory-growth requests; to run
            photo/video QC; and to keep a working file on your order. We may share what is needed with
            a factory or warehouse on that job. We do not sell your contacts.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">Contact</h2>
          <p className="mt-3">
            Email {company.emails.sme} or {company.emails.corporate}. China {company.phones[1]}. UAE{" "}
            {company.phones[0]}.
          </p>
        </section>
      </Container>
    </>
  );
}
