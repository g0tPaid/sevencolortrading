import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Quality Inspection",
  description: "Pre-shipment QC with photos, videos, and defect reporting before goods leave China.",
};

const checks = [
  "Incoming material spot checks",
  "In-line production sampling",
  "Pre-shipment AQL-style inspections",
  "Photo and video approval packs",
  "Packaging, labeling, and barcode validation",
  "Container loading supervision",
];

export default function QualityInspectionPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality inspection"
        title="Nothing ships until you approve the evidence"
        description="Structured QC with visual proof — so buyers in Dubai, Europe, or the US can decide with confidence."
      />
      <Container className="grid gap-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {checks.map((c) => (
          <div key={c} className="rounded-3xl border border-line bg-paper-elevated p-6 text-sm font-medium text-ink">
            {c}
          </div>
        ))}
      </Container>
      <CtaBand />
    </>
  );
}
