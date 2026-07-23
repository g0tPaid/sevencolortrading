import type { Metadata } from "next";
import { RfqForm } from "@/components/home/rfq-form";
import { PageHero } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Seven Color sourcing desks in Dubai and Xiamen. RFQ response within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a relationship manager"
        description="Corporate and SME desks available. WhatsApp support around the clock."
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-paper-elevated p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Email</p>
            <p className="mt-3 text-ink">{company.emails.corporate} (Corporate)</p>
            <p className="text-ink">{company.emails.sme} (SMEs)</p>
          </div>
          <div className="rounded-3xl border border-line bg-paper-elevated p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Phone / WhatsApp</p>
            <ul className="mt-3 space-y-1 text-ink">
              {company.phones.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          {company.offices.map((o) => (
            <div key={o.city} className="rounded-3xl border border-line bg-paper-elevated p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{o.city}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{o.address}</p>
              <p className="mt-2 font-mono text-xs text-muted">License {o.license}</p>
            </div>
          ))}
          <div className="rounded-3xl border border-line bg-paper-elevated p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Credentials</p>
            <p className="mt-3 text-sm font-medium text-ink">{company.credentials.dunBradstreet}</p>
            <p className="mt-1 font-mono text-sm text-muted">DUNS {company.credentials.dunsNumber}</p>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {company.credentials.licenses.map((lic) => (
                <li key={lic.number}>
                  {lic.region}: {lic.kind} {lic.number}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <RfqForm />
      </Container>
    </>
  );
}
