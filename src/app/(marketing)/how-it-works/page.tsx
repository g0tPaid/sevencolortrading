import type { Metadata } from "next";
import Link from "next/link";
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
        title="How China factory sourcing works: RFQ to delivery"
        description="Share the brief once. The China desk sources verified factories, photo/video QC, inspects at USD 110/day when you want a lot check, then ships from Xiamen or Dubai."
      />
      <Container className="py-16">
        <p className="mb-10 max-w-3xl text-sm leading-relaxed text-muted" data-seo-answer>
          Four gates: RFQ, factory match, quality proof, then freight or own 3PL. No required MOQ.
          1688 links are welcome; the desk pays in RMB and receives into the Xiamen warehouse. Field
          guide:{" "}
          <Link href="/knowledge/how-to-source-from-china" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            how to source from China
          </Link>
          {" · "}
          <Link href="/1688-sourcing" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            1688 sourcing
          </Link>
          {" · "}
          <Link href="/factory-verification" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            factory verification
          </Link>
          {" · "}
          <Link href="/inspection" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            inspection
          </Link>
          .
        </p>
        <SourcingTimeline />
      </Container>
      <CtaBand title="Start with a 5-minute RFQ" />
    </>
  );
}
