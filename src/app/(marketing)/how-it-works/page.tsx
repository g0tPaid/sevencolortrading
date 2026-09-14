import type { Metadata } from "next";
import { SourcingTimeline } from "@/components/home/sourcing-timeline";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";

import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.howItWorks;

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="A controlled path from inquiry to door delivery"
        description="Share requirements once. We source, verify, inspect, and ship — with proof at every gate."
      />
      <Container className="py-16">
        <SourcingTimeline />
      </Container>
      <CtaBand title="Start with a 5-minute RFQ" />
    </>
  );
}
