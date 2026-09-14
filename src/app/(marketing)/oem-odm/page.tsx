import type { Metadata } from "next";
import Link from "next/link";
import { CommonQuestions } from "@/components/seo/common-questions";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { serviceCommonQuestions } from "@/lib/faq";
import { pages } from "@/lib/route-seo";
import { offerNode, serviceCopy } from "@/lib/structured-data";

export const metadata: Metadata = pages.oemOdm;

export default function OemOdmPage() {
  return (
    <>
      <JsonLd data={offerNode("oem-odm")} />
      <PageHero
        eyebrow="OEM / ODM"
        title="Develop products without losing control"
        description="Concept support, supplier matching, tooling coordination, and production management with IP-aware workflows."
      />
      <Container className="py-16">
        <p className="max-w-2xl text-sm leading-relaxed text-muted" data-seo-answer>
          {serviceCopy["oem-odm"].description}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Legal entity {company.legalNameFull}, DUNS {company.credentials.dunsNumber}, since{" "}
          {company.founded}. Warehouses in Xiamen and Dubai / Al Ain.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {["Brief", "Prototype", "Tooling", "Mass production"].map((s, i) => (
            <div key={s} className="glass-card rounded-[1.5rem] p-6">
              <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-3 font-display text-lg font-semibold text-ink">{s}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          After sampling, lock quality with{" "}
          <Link href="/inspection" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            on-the-ground inspection
          </Link>
          , prep a{" "}
          <Link href="/amazon-fba" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            Amazon FBA private-label inbound
          </Link>
          , or book a{" "}
          <Link href="/visit" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            hosted factory visit in China
          </Link>
          . Start the RFQ on{" "}
          <Link href="/contact" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            the contact page
          </Link>
          .
        </p>
        <CommonQuestions items={serviceCommonQuestions["oem-odm"]} />
      </Container>
      <CtaBand />
    </>
  );
}
