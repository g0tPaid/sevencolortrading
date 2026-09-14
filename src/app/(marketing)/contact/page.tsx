import type { Metadata } from "next";
import { RfqForm } from "@/components/home/rfq-form";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CommonQuestions } from "@/components/seo/common-questions";
import { JsonLd } from "@/components/seo/json-ld";
import { ProofChips } from "@/components/trust/proof-chips";
import { PageHero } from "@/components/shared/page-shell";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { serviceCommonQuestions } from "@/lib/faq";
import { pages } from "@/lib/route-seo";
import { offerNode, serviceCopy } from "@/lib/structured-data";
import { whatsappHref, whatsappPresets } from "@/lib/whatsapp";

export const metadata: Metadata = pages.contact;

export default function ContactPage() {
  return (
    <>
      <JsonLd data={offerNode("sourcing")} />
      <WhatsAppPrefill message={whatsappPresets.rfq} />
      <PageHero
        eyebrow="Contact"
        title="Talk to a relationship manager"
        description="Corporate and SME desks available. WhatsApp support around the clock."
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-2">
        <div className="space-y-6">
          <ProofChips className="justify-start" />
          <p className="text-sm leading-relaxed text-muted" data-seo-answer>
            {serviceCopy.sourcing.description}
          </p>
          <div className="glass-card rounded-[1.5rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Email</p>
            <p className="mt-3 text-ink">{company.emails.corporate} (Corporate)</p>
            <p className="text-ink">{company.emails.sme} (SMEs)</p>
          </div>
          <div className="glass-card rounded-[1.5rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Phone / WhatsApp</p>
            <ul className="mt-3 space-y-1 text-ink">
              {company.phones.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <ButtonLink href={whatsappHref(whatsappPresets.rfq)} className="mt-4">
              Prefill WhatsApp
            </ButtonLink>
          </div>
          {company.offices.map((o) => (
            <div key={o.city} className="glass-card rounded-[1.5rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{o.city}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{o.address}</p>
              <p className="mt-2 font-mono text-xs text-muted">License {o.license}</p>
            </div>
          ))}
          <div className="glass-card rounded-[1.5rem] p-6">
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
      <Container className="pb-16">
        <CommonQuestions items={serviceCommonQuestions.sourcing} />
      </Container>
    </>
  );
}
