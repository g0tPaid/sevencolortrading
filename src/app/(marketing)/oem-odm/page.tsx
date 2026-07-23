import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "OEM / ODM",
  description: "OEM and ODM product development from concept and tooling through mass production.",
};

export default function OemOdmPage() {
  return (
    <>
      <PageHero
        eyebrow="OEM / ODM"
        title="Develop products without losing control"
        description="Concept support, supplier matching, tooling coordination, and production management with IP-aware workflows."
      />
      <Container className="py-16">
        <div className="grid gap-4 md:grid-cols-4">
          {["Brief", "Prototype", "Tooling", "Mass production"].map((s, i) => (
            <div key={s} className="rounded-3xl border border-line bg-paper-elevated p-6">
              <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-3 font-display text-lg font-semibold text-ink">{s}</p>
            </div>
          ))}
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
