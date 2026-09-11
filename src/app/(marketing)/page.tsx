import type { Metadata } from "next";
import { V2ChinaVisit } from "@/components/v2/v2-china-visit";
import { V2Cta } from "@/components/v2/v2-cta";
import { V2Hero } from "@/components/v2/v2-hero";
import { V2Ideation } from "@/components/v2/v2-ideation";
import { V2Network } from "@/components/v2/v2-network";
import { V2ThreePl } from "@/components/v2/v2-3pl";
import { V2Dropshipping } from "@/components/v2/v2-dropshipping";
import { V2Trust } from "@/components/v2/v2-trust";
import { V2Why } from "@/components/v2/v2-why";
import { V2Workflow } from "@/components/v2/v2-workflow";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, defaultDescription, homepageAggregateFaqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "China Sourcing, Factory Visits, 3PL & Dropshipping from Xiamen and Dubai",
  description: defaultDescription,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "Sourcing Center — China Sourcing, Own 3PL & Dropshipping",
    description: defaultDescription,
    url: absoluteUrl("/"),
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homepageAggregateFaqJsonLd()} />
      <V2Hero />
      <V2Ideation />
      <V2Network />
      <V2ThreePl />
      <V2Dropshipping />
      <V2Why />
      <V2Workflow />
      <V2Trust />
      <V2ChinaVisit />
      <V2Cta />
    </>
  );
}
