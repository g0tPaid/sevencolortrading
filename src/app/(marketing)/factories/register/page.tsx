import type { Metadata } from "next";
import { FactoryRegisterForm } from "@/components/factories/factory-register-form";
import { FactoryLabel } from "@/components/layout/factory-label";
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

const joinBenefits = [
  {
    en: "Reach overseas buyers through Seven Color Trading’s sourcing network.",
    zh: "对接海外买家：进入已通过 Seven Color Trading 采购的进口商与品牌的供应商短名单。",
  },
  {
    en: "Get considered for buyer RFQs and hosted factory visits from the Xiamen desk.",
    zh: "询盘与访厂：有机会承接买家询盘，并纳入厦门团队安排的访华验厂行程。",
  },
  {
    en: "Partner with a China–UAE trade company that already runs sourcing, photo/video QC, and 3PL hubs in Xiamen and Dubai.",
    zh: "中阿贸易伙伴：与已负责采购、验货，并在厦门、迪拜自营仓储（3PL）的贸易公司合作。",
  },
  {
    en: "Applications are reviewed for license, capacity, and buyer fit — not an automatic public listing.",
    zh: "审核入驻：厦门团队审核执照、产能与匹配度；提交申请不会自动公开展示。",
  },
] as const;

function FactoryJoinBrief() {
  return (
    <article className="glass-card rounded-[1.5rem] p-6 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">为什么入驻</p>
      <h2 className="mt-2 font-display text-xl font-semibold text-ink sm:text-2xl">Why join</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Apply to join Seven Color Trading’s vendor shortlist for Sourcing Center buyers. We are a
        China–UAE sourcing partner — not a public marketplace.
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted" lang="zh-CN">
        入驻 Seven Color Trading 供应商库，对接 Sourcing Center 的海外买家。我们是中阿采购合作方，不是公开集市。
      </p>
      <ul className="mt-5 space-y-3.5">
        {joinBenefits.map((item) => (
          <li key={item.en} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
            <div>
              <p className="text-sm leading-relaxed text-ink">{item.en}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted" lang="zh-CN">
                {item.zh}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function FactoryRegisterPage() {
  return (
    <>
      <Container className="pb-16 pt-28 sm:pt-32">
        <p className="section-kicker">
          {company.legalName} · Xiamen · 工厂登记
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          <FactoryLabel /> — register as a vendor
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
          <div className="lg:sticky lg:top-28">
            <FactoryJoinBrief />
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
