import type { Metadata } from "next";
import { FactoryRegisterForm } from "@/components/factories/factory-register-form";
import { CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

const description =
  "Chinese factories apply to become verified vendors for Sourcing Center buyers via Seven Color Trading Co Ltd in Xiamen. 工厂入驻 / 申请成为供应商 — not a marketplace free-for-all.";

export const metadata: Metadata = {
  title: "Factory Vendor Registration in China / 工厂入驻",
  description,
  keywords: [
    "factory vendor registration China",
    "Chinese factory supplier application",
    "工厂入驻",
    "工厂登记",
    "申请成为供应商",
    "工厂供应商登记",
    "Seven Color Trading factory vendor",
    "Sourcing Center supplier registration",
  ],
  alternates: { canonical: absoluteUrl("/factories/register") },
  openGraph: {
    title: "Factory Vendor Registration | Sourcing Center",
    description,
    url: absoluteUrl("/factories/register"),
  },
};

const points = [
  {
    title: "Verified factories only",
    zh: "仅核实工厂",
    text: "We shortlist manufacturers for Sourcing Center buyers. License, capacity, and quality still get checked on the ground in China.",
  },
  {
    title: "Not a public marketplace",
    zh: "并非公开集市",
    text: "Submitting this form does not list you for anyone to browse. The Xiamen desk reviews applications and contacts factories when there is a buyer fit.",
  },
  {
    title: "Supply our programs",
    zh: "对接我们的采购项目",
    text: "Goods move through Seven Color Trading Co Ltd — sourcing, QC, and own 3PL in Xiamen and Dubai — not through an anonymous catalog.",
  },
];

export default function FactoryRegisterPage() {
  return (
    <>
      <Container className="pb-16 pt-28 sm:pt-32">
        <p className="section-kicker">
          {company.legalName} · Xiamen · 工厂登记
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          Factories — register as a vendor
        </h1>
        <p className="mt-2 font-display text-xl text-accent sm:text-2xl">工厂供应商登记</p>
        <p className="mt-4 max-w-2xl text-muted sm:text-lg">
          Apply to supply Sourcing Center buyers through {company.legalNameFull} in Xiamen. We work
          with verified factories only — this is not a marketplace free-for-all.
        </p>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          申请成为供应商，向 Sourcing Center 买家供货。我们只合作经核实的工厂，不会对所有申请自动上架。
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {points.map((point) => (
              <article key={point.title} className="glass-card rounded-[1.5rem] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{point.zh}</p>
                <h2 className="mt-2 font-display text-xl font-semibold text-ink">{point.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{point.text}</p>
              </article>
            ))}
          </div>
          <FactoryRegisterForm />
        </div>
      </Container>
      <CtaBand
        title="Already a buyer?"
        description="Send an RFQ and a relationship manager replies within 24 hours from China or Dubai."
      />
    </>
  );
}
