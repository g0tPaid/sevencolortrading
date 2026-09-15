import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand } from "@/components/shared/page-shell";
import { ProofChips } from "@/components/trust/proof-chips";
import { Container } from "@/components/ui/primitives";
import { comparePages } from "@/lib/compare";
import { whatsappPresets } from "@/lib/whatsapp";
import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.compare;

export default function CompareIndexPage() {
  return (
    <>
      <WhatsAppPrefill message={whatsappPresets.home} />
      <Container className="pb-10 pt-28 sm:pt-32">
        <p className="section-kicker">Compare</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          Compare a China sourcing agent with Alibaba, 1688, and DIY
        </h1>
        <p className="mt-4 max-w-2xl text-muted sm:text-lg">
          Pages for buyers choosing between a marketplace, 1688, DIY freight, or a remote QC pack,
          and a China desk with own warehouses (China hub in Xiamen and Dubai).
        </p>
        <ProofChips className="mt-6 justify-start" />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {comparePages.map((page) => (
            <Link
              key={page.slug}
              href={`/compare/${page.slug}`}
              className="glass-card glass-card-hover flex flex-col rounded-[1.5rem] p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {page.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-xl font-semibold text-ink">{page.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{page.description}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink">
                Read the comparison
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </Container>
      <CtaBand whatsappMessage={whatsappPresets.rfq} />
    </>
  );
}
