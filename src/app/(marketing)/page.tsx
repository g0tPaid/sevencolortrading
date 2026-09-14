import type { Metadata } from "next";
import Link from "next/link";
import { UpdatesStrip } from "@/components/home/updates-strip";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { V2ChinaVisit } from "@/components/v2/v2-china-visit";
import { V2Cta } from "@/components/v2/v2-cta";
import { V2Hero } from "@/components/v2/v2-hero";
import { V2Ideation } from "@/components/v2/v2-ideation";
import { V2Network } from "@/components/v2/v2-network";
import { V2ThreePl } from "@/components/v2/v2-3pl";
import { V2Dropshipping } from "@/components/v2/v2-dropshipping";
import { V2Inspection } from "@/components/v2/v2-inspection";
import { V2AmazonFba } from "@/components/v2/v2-amazon-fba";
import { V2Trust } from "@/components/v2/v2-trust";
import { V2Why } from "@/components/v2/v2-why";
import { V2Workflow } from "@/components/v2/v2-workflow";
import { CommonQuestions } from "@/components/seo/common-questions";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/primitives";
import { pages } from "@/lib/route-seo";
import { homepageAggregateFaqJsonLd } from "@/lib/seo";
import { homepageAggregateFaqs } from "@/lib/v2-content";
import { whatsappPresets } from "@/lib/whatsapp";

export const metadata: Metadata = pages.home;

export default function HomePage() {
  return (
    <>
      <JsonLd data={homepageAggregateFaqJsonLd()} />
      <WhatsAppPrefill message={whatsappPresets.home} />
      <V2Hero />
      <UpdatesStrip />
      <V2Workflow />
      <V2Ideation />
      <V2Network />
      <V2ThreePl />
      <V2Dropshipping />
      <V2Inspection />
      <V2AmazonFba />
      <V2Why />
      <V2Trust />
      <V2ChinaVisit />
      <Container className="pb-4">
        <CommonQuestions items={homepageAggregateFaqs} heading="Common questions" />
        <p className="mt-6 text-sm text-muted">
          Full list:{" "}
          <Link href="/faq" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            sourcing.center/faq
          </Link>
          .
        </p>
      </Container>
      <V2Cta />
    </>
  );
}
