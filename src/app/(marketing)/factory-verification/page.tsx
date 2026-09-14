import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { verificationSteps } from "@/lib/content";

import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.factoryVerification;

export default function FactoryVerificationPage() {
  return (
    <>
      <PageHero
        eyebrow="Factory verification"
        title="Know the factory before you fund production"
        description="Our Xiamen team validates credentials, capacity, and quality systems before you commit purchase orders."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-dark rounded-[1.75rem] p-8 text-paper">
          <p className="font-display text-2xl font-semibold">Verification workflow</p>
          <p className="mt-3 text-sm text-paper/70">
            Structured audits designed for procurement, not tourism factory tours.
          </p>
        </div>
        <ol className="space-y-3">
          {verificationSteps.map((step, i) => (
            <li key={step} className="glass-card flex gap-4 rounded-2xl px-5 py-4">
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
