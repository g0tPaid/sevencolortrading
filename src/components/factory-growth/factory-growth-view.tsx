"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { ButtonLink, Container } from "@/components/ui/primitives";
import {
  PRICE_GROWTH,
  PRICE_WEBSITE,
  buyerChecklist,
  compareRows,
  growthCopy,
  growthExtras,
  marketingPoints,
  materialsNeeded,
  noPromises,
  focusPoints,
  problemCards,
  processSteps,
  serviceOverview,
  timelineMonths,
  upgradePoints,
  websiteFeatures,
  whyCards,
  workflowSteps,
  growthFaqs,
  type PackageId,
} from "@/lib/factory-growth";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { FactoryWebsiteMockup } from "./factory-website-mockup";
import { GrowthInquiryForm } from "./growth-inquiry-form";
import { LanguageSwitcher } from "./language-switcher";
import { MarketplaceMockups } from "./marketplace-mockups";
import { useFactoryGrowthUi } from "./locale-context";

function scrollToInquiry() {
  document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionKicker({ children }: { children: string }) {
  return <p className="section-kicker">{children}</p>;
}

export function FactoryGrowthView() {
  const { t, lang, setPackageId } = useFactoryGrowthUi();

  function startWith(id: PackageId) {
    setPackageId(id);
    scrollToInquiry();
  }

  return (
    <div lang={lang === "zh" ? "zh-CN" : "en"} className="pt-24 sm:pt-28">
      <WhatsAppPrefill message={t(growthCopy.whatsappPreset)} />
      <Container className="relative pb-16 pt-2 sm:pt-4">
        <div className="mb-5 flex justify-end">
          <LanguageSwitcher />
        </div>
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionKicker>{t(growthCopy.kicker)}</SectionKicker>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              {t(growthCopy.h1)}
            </h1>
            <p className="mt-4 max-w-2xl text-muted sm:text-lg">{t(growthCopy.subhead)}</p>
            <p className="mt-3 text-sm font-medium text-ink">{t(growthCopy.concept)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startWith("growth")}
                className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:opacity-90"
              >
                {t(growthCopy.ctaStart)}
              </button>
              <a
                href="#packages"
                className="inline-flex items-center justify-center rounded-full border border-line bg-white/50 px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent/40"
              >
                {t(growthCopy.ctaCompare)}
              </a>
            </div>
            <p className="mt-4 max-w-xl text-xs leading-relaxed text-muted">{t(growthCopy.support)}</p>
          </div>
          <FactoryWebsiteMockup />
        </section>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.problemKicker)}</SectionKicker>
          <h2 className="mt-3 max-w-3xl font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.problemTitle)}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{t(growthCopy.problemBody)}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {problemCards.map((card) => (
              <article key={card.title.en} className="glass-card rounded-[1.5rem] p-6">
                <h3 className="font-display text-lg font-semibold text-ink">{t(card.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(card.text)}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.checklistKicker)}</SectionKicker>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.checklistTitle)}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{t(growthCopy.checklistLead)}</p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {buyerChecklist.map((item, i) => (
              <li key={item.title.en} className="glass-card rounded-[1.35rem] p-4">
                <p className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-base font-semibold text-ink">{t(item.title)}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{t(item.text)}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.overviewKicker)}</SectionKicker>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.overviewTitle)}
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {serviceOverview.map((item) => (
              <a
                key={item.title.en}
                href={item.href}
                className="glass-card glass-card-hover rounded-[1.5rem] p-6"
              >
                <h3 className="font-display text-xl font-semibold text-ink">{t(item.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(item.text)}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {t(growthCopy.ctaCompare)}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <div id="packages" className="mt-20 scroll-mt-32">
          <SectionKicker>{t(growthCopy.packagesKicker)}</SectionKicker>
          <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-2">
            <article
              id="package-website"
              className="glass-card flex scroll-mt-28 flex-col rounded-[1.75rem] p-6 sm:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">01</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
                {t(growthCopy.websiteName)}
              </h2>
              <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
                {PRICE_WEBSITE}
              </p>
              <ul className="mt-6 space-y-2.5">
                {websiteFeatures.map((item) => (
                  <li key={item.en} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    <span>{t(item)}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => startWith("website")}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition hover:opacity-90"
              >
                {t(growthCopy.websiteCta)}
              </button>
            </article>

            <article
              id="package-growth"
              className="relative flex scroll-mt-28 flex-col rounded-[1.75rem] border-2 border-accent bg-[color-mix(in_oklab,var(--glass-fill-strong)_92%,var(--accent-soft))] p-6 shadow-[0_18px_50px_rgba(214,0,0,0.08)] sm:p-8"
            >
              <span className="absolute right-5 top-5 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                {t(growthCopy.growthBadge)}
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">02</p>
              <h2 className="mt-2 max-w-[14ch] font-display text-2xl font-semibold text-ink sm:max-w-none">
                {t(growthCopy.growthName)}
              </h2>
              <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
                {PRICE_GROWTH}
              </p>
              <p className="mt-2 text-sm font-medium text-ink">{t(growthCopy.includesWebsite)}</p>
              <ul className="mt-6 space-y-2.5">
                {growthExtras.map((item) => (
                  <li key={item.en} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    <span>{t(item)}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => startWith("growth")}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {t(growthCopy.growthCta)}
              </button>
            </article>
          </div>
        </div>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.compareKicker)}</SectionKicker>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.compareTitle)}
          </h2>
          <div className="mt-8 hidden overflow-hidden rounded-[1.5rem] border border-line md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/50 text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">{t(growthCopy.compareFeatureCol)}</th>
                  <th className="px-5 py-3 font-medium">{t(growthCopy.websiteName)}</th>
                  <th className="px-5 py-3 font-medium">{t(growthCopy.growthName)}</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.feature.en} className="border-t border-line">
                    <th className="px-5 py-3 font-medium text-ink">{t(row.feature)}</th>
                    <td className="px-5 py-3 text-muted">{t(row.website)}</td>
                    <td className="px-5 py-3 text-ink">{t(row.growth)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid gap-3 md:hidden">
            {compareRows.map((row) => (
              <article key={row.feature.en} className="glass-card rounded-[1.35rem] p-4">
                <h3 className="font-display text-base font-semibold text-ink">{t(row.feature)}</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.12em] text-muted">
                      {t(growthCopy.websiteName)}
                    </dt>
                    <dd className="mt-0.5 text-ink">{t(row.website)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.12em] text-accent">
                      {t(growthCopy.growthName)}
                    </dt>
                    <dd className="mt-0.5 text-ink">{t(row.growth)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.upgradeKicker)}</SectionKicker>
          <h2 className="mt-3 max-w-3xl font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.upgradeTitle)}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{t(growthCopy.upgradeBody)}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {upgradePoints.map((item) => (
              <li key={item.en} className="glass-card flex gap-3 rounded-[1.35rem] p-5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span className="text-sm leading-relaxed text-ink">{t(item)}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.marketKicker)}</SectionKicker>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.marketTitle)}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{t(growthCopy.marketBody)}</p>
          <div className="mt-8">
            <MarketplaceMockups />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <p className="glass-card rounded-[1.35rem] p-5 text-sm leading-relaxed text-ink">
              {t(growthCopy.marketWebsiteNote)}
            </p>
            <p className="glass-card rounded-[1.35rem] p-5 text-sm leading-relaxed text-ink">
              {t(growthCopy.marketGrowthNote)}
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.workflowKicker)}</SectionKicker>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.workflowTitle)}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{t(growthCopy.workflowNote)}</p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-5">
            {workflowSteps.map((step) => (
              <li key={step.title.en} className="glass-card rounded-[1.35rem] p-4">
                <p className="font-mono text-[11px] text-accent">{t(step.kicker)}</p>
                <p className="mt-2 font-display text-base font-semibold text-ink">{t(step.title)}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-20" >
          <article
            id="package-marketing"
            className="glass-panel scroll-mt-28 rounded-[1.75rem] p-6 sm:p-8"
          >
            <SectionKicker>{t(growthCopy.marketingKicker)}</SectionKicker>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              {t(growthCopy.marketingName)}
            </h2>
            <p className="mt-4 font-display text-3xl font-semibold text-ink">
              {t(growthCopy.marketingPrice)}
            </p>
            <p className="mt-4 max-w-2xl text-muted">{t(growthCopy.marketingBody)}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {marketingPoints.map((item) => (
                <li key={item.en} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-muted">{t(growthCopy.marketingDisclaimer)}</p>
            <button
              type="button"
              onClick={() => startWith("marketing")}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition hover:opacity-90"
            >
              {t(growthCopy.marketingCta)}
            </button>
          </article>
        </Reveal>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.timelineKicker)}</SectionKicker>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.timelineTitle)}
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {timelineMonths.map((item) => (
              <article key={item.title.en} className="glass-card rounded-[1.5rem] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {t(item.month)}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{t(item.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(item.text)}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.whyKicker)}</SectionKicker>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.whyTitle)}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{t(growthCopy.whyBody)}</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {whyCards.map((card) => (
              <article key={card.title.en} className="glass-card rounded-[1.5rem] p-6">
                <h3 className="font-display text-lg font-semibold text-ink">{t(card.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(card.text)}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.needKicker)}</SectionKicker>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.needTitle)}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{t(growthCopy.needBody)}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {materialsNeeded.map((item) => (
              <li key={item.en} className="glass-card flex gap-3 rounded-[1.35rem] p-4 text-sm text-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                {t(item)}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.processKicker)}</SectionKicker>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.processTitle)}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{t(growthCopy.processNote)}</p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step) => (
              <li
                key={step.n}
                className={cn(
                  "glass-card rounded-[1.5rem] p-5",
                  step.n === "06" && "lg:col-span-3",
                )}
              >
                <p className="font-mono text-[11px] text-accent">{step.n}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{t(step.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(step.text)}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-20">
          <article className="glass-panel rounded-[1.75rem] p-6 sm:p-8">
            <SectionKicker>{t(growthCopy.crossKicker)}</SectionKicker>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t(growthCopy.crossTitle)}
            </h2>
            <p className="mt-4 max-w-2xl text-muted">{t(growthCopy.crossBody)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/factories/register">{t(growthCopy.crossRegister)}</ButtonLink>
              <button
                type="button"
                onClick={() => startWith("unsure")}
                className="inline-flex items-center justify-center rounded-full border border-line bg-white/50 px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent/40"
              >
                {t(growthCopy.crossGrowth)}
              </button>
            </div>
          </article>
        </Reveal>

        <div className="mt-20">
          <GrowthInquiryForm />
        </div>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.faqKicker)}</SectionKicker>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.faqTitle)}
          </h2>
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {growthFaqs.map((item) => (
              <div key={item.q.en} className="glass-card rounded-[1.5rem] p-6">
                <dt className="font-display text-lg font-semibold text-ink">{t(item.q)}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted" data-seo-answer>
                  {t(item.a)}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-20">
          <SectionKicker>{t(growthCopy.honestyKicker)}</SectionKicker>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(growthCopy.honestyTitle)}
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="glass-card rounded-[1.5rem] p-6">
              <h3 className="font-display text-xl font-semibold text-ink">
                {t(growthCopy.noPromiseTitle)}
              </h3>
              <ul className="mt-4 space-y-3">
                {noPromises.map((item) => (
                  <li key={item.en} className="text-sm leading-relaxed text-muted">
                    {t(item)}
                  </li>
                ))}
              </ul>
            </article>
            <article className="glass-card rounded-[1.5rem] p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{t(growthCopy.focusTitle)}</h3>
              <ul className="mt-4 space-y-3">
                {focusPoints.map((item) => (
                  <li key={item.en} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    <span>{t(item)}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Reveal>

        <Reveal className="mt-20 mb-8">
          <div className="glass-panel rounded-[2rem] px-6 py-10 sm:px-10">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
              {t(growthCopy.finalTitle)}
            </h2>
            <p className="mt-3 max-w-2xl text-muted">{t(growthCopy.finalBody)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startWith("growth")}
                className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {t(growthCopy.ctaStart)}
              </button>
              <a
                href="#packages"
                className="inline-flex items-center justify-center rounded-full border border-line bg-white/50 px-5 py-2.5 text-sm font-medium text-ink"
              >
                {t(growthCopy.ctaCompare)}
              </a>
              <ButtonLink href="/factories/register" variant="ghost">
                {t(growthCopy.crossRegister)}
              </ButtonLink>
              <ButtonLink href={whatsappHref(t(growthCopy.whatsappPreset))} variant="secondary">
                WhatsApp
              </ButtonLink>
            </div>
            <p className="mt-5 text-xs text-muted">{t(growthCopy.support)}</p>
            <p className="mt-2 text-xs text-muted">
              <Link href="/factories/register" className="underline decoration-accent/40 underline-offset-4">
                /factories/register
              </Link>
              {" · "}
              {t(growthCopy.finalPriceLine)}
            </p>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
