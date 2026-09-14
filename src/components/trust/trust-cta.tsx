import { ProofChips } from "@/components/trust/proof-chips";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { whatsappHref } from "@/lib/whatsapp";

export function TrustCta({
  title = "Start a sourcing conversation",
  description = "Send an RFQ to the China or Dubai desk — or message WhatsApp with this page already in the thread.",
  whatsappMessage,
}: {
  title?: string;
  description?: string;
  whatsappMessage: string;
}) {
  return (
    <section className="pb-16 pt-6 sm:pb-20">
      <Container>
        <div className="glass-panel rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-3 max-w-xl text-muted">{description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/#rfq">Start sourcing</ButtonLink>
            <ButtonLink href={whatsappHref(whatsappMessage)} variant="secondary">
              WhatsApp
            </ButtonLink>
          </div>
          <ProofChips className="mt-6 justify-start" />
        </div>
      </Container>
    </section>
  );
}
