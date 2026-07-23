import type { Metadata } from "next";
import { Container, SectionHeading, SpectrumRail, ButtonLink } from "@/components/ui/primitives";

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
    <section className="relative overflow-hidden border-b border-line pb-14 pt-10 sm:pb-20 sm:pt-14">
      <div className="absolute inset-0 grid-fade opacity-40" aria-hidden />
      <Container className="relative">
        <SpectrumRail className="mb-8 w-24" />
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </Container>
    </section>
  );
}

export function CtaBand({
  title = "Ready when you are",
  description = "Send your RFQ — a relationship manager replies within 24 hours from China or Dubai.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-[2rem] border border-line bg-paper-elevated px-8 py-12 sm:px-10">
          <h2 className="font-display text-3xl font-semibold text-ink">{title}</h2>
          <p className="mt-3 max-w-xl text-muted">{description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Get a quote in 24h</ButtonLink>
            <ButtonLink href="/dashboard" variant="secondary">
              Client desk
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
