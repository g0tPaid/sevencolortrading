import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { siteUpdates, updatesIntro } from "@/lib/updates";
import { absoluteUrl } from "@/lib/seo";
import { whatsappPresets } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Updates",
  description:
    "Dated one-liners from the Sourcing Center desk — pointers into Knowledge, case studies, and comparison pages.",
  alternates: { canonical: absoluteUrl("/updates") },
  robots: { index: true, follow: true },
};

export default function UpdatesPage() {
  return (
    <>
      <WhatsAppPrefill message={whatsappPresets.updates} />
      <Container className="pb-10 pt-28 sm:pt-32">
        <p className="section-kicker">{updatesIntro.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          {updatesIntro.title}
        </h1>
        <p className="mt-4 max-w-2xl text-muted sm:text-lg">{updatesIntro.description}</p>
        <ol className="mt-10 space-y-3">
          {siteUpdates.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="glass-card glass-card-hover flex flex-col gap-1 rounded-[1.35rem] px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <time dateTime={item.iso} className="shrink-0 font-mono text-xs text-muted sm:w-28">
                  {item.date}
                </time>
                <span className="text-sm font-medium text-ink sm:text-base">{item.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
      <CtaBand whatsappMessage={whatsappPresets.updates} />
    </>
  );
}
