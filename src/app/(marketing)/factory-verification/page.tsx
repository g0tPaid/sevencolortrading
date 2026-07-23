import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { verificationSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: "Factory Verification",
  description: "On-ground factory audits, license checks, and capacity validation in China.",
};

export default function FactoryVerificationPage() {
  return (
    <>
      <PageHero
        eyebrow="Factory verification"
        title="Know the factory before you fund production"
        description="Our Xiamen team validates credentials, capacity, and quality systems before you commit purchase orders."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-line bg-ink-soft p-8 text-paper dark:bg-paper-elevated dark:text-ink">
          <p className="font-display text-2xl font-semibold">Verification workflow</p>
          <p className="mt-3 text-sm text-paper/70 dark:text-muted">
            Structured audits designed for procurement, not tourism factory tours.
          </p>
        </div>
        <ol className="space-y-3">
          {verificationSteps.map((step, i) => (
            <li key={step} className="flex gap-4 rounded-2xl border border-line bg-paper-elevated px-5 py-4">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-sm font-medium text-ink">{step}</span>
            </li>
          ))}
        </ol>
      </Container>
      <CtaBand />
    </>
  );
}
