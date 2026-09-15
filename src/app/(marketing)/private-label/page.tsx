import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";

import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.privateLabel;

export default function PrivateLabelPage() {
  return (
    <>
      <PageHero
        eyebrow="Private label"
        title="Your brand on proven manufacturing lines"
        description="From packaging artwork to carton marks, we coordinate private label programs with factories that can actually scale. Photo/video QC before mass release. Amazon inbound has its own page."
      />
      <Container className="grid gap-4 py-16 md:grid-cols-3">
        {["Brand packaging", "Label & insert control", "Retail-ready cartons"].map((t) => (
          <div key={t} className="glass-card rounded-[1.5rem] p-7">
            <h2 className="font-display text-xl font-semibold text-ink">{t}</h2>
            <p className="mt-3 text-sm text-muted">
              Artwork checks, sample approvals, and production oversight before mass release.
            </p>
          </div>
        ))}
        <p className="md:col-span-3 mt-2 text-sm text-muted">
          Heading to Amazon inbound?{" "}
          <Link href="/amazon-fba" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            Amazon FBA private label
          </Link>{" "}
          covers OEM, inspection, carton marks, and freight. Develop the product first on{" "}
          <Link href="/oem-odm" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            OEM / ODM
          </Link>
          . Packing checklist:{" "}
          <Link
            href="/knowledge/private-label-packaging"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            what to approve before mass production
          </Link>
          . Inspection at USD 110 per inspector day:{" "}
          <Link href="/inspection" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            /inspection
          </Link>
          .
        </p>
      </Container>
      <CtaBand />
    </>
  );
}
