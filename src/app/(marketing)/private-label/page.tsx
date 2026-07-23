import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Private Label",
  description: "Private label and white-label manufacturing with packaging, branding, and QC.",
};

export default function PrivateLabelPage() {
  return (
    <>
      <PageHero
        eyebrow="Private label"
        title="Your brand on proven manufacturing lines"
        description="From packaging artwork to carton marks — we coordinate private label programs with factories that can actually scale."
      />
      <Container className="grid gap-4 py-16 md:grid-cols-3">
        {["Brand packaging", "Label & insert control", "Retail-ready cartons"].map((t) => (
          <div key={t} className="rounded-3xl border border-line bg-paper-elevated p-7">
            <h2 className="font-display text-xl font-semibold text-ink">{t}</h2>
            <p className="mt-3 text-sm text-muted">
              Artwork checks, sample approvals, and production oversight before mass release.
            </p>
          </div>
        ))}
      </Container>
      <CtaBand />
    </>
  );
}
