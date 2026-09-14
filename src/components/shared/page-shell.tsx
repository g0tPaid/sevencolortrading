import type { Metadata } from "next";
import { ProofChips } from "@/components/trust/proof-chips";
import { Container, SectionHeading, ButtonLink } from "@/components/ui/primitives";
import { whatsappHref, whatsappPresets } from "@/lib/whatsapp";

export function pageMetadata(title: string, description: string): Metadata {
  return { title, description };
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden pb-12 pt-28 sm:pb-16 sm:pt-32">
      <div className="absolute inset-0 grid-fade opacity-50" aria-hidden />
      <Container className="relative">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
      </Container>
    </section>
  );
}

export function CtaBand({
  title = "Ready when you are",
  description = "Send your RFQ — a relationship manager replies within 24 hours from China or Dubai.",
  whatsappMessage = whatsappPresets.rfq,
}: {
  title?: string;
  description?: string;
  whatsappMessage?: string;
}) {
  return (
    <section className="pb-16 pt-6 sm:pb-20">
      <Container>
        <div className="glass-panel rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-3 max-w-xl text-muted">{description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Get a quote in 24h</ButtonLink>
            <ButtonLink href={whatsappHref(whatsappMessage)} variant="secondary">
              WhatsApp
            </ButtonLink>
            <ButtonLink href="/#new-idea" variant="ghost">
              I have a new product idea
            </ButtonLink>
          </div>
          <ProofChips className="mt-6 justify-start" />
        </div>
      </Container>
    </section>
  );
}
