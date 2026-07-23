import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ShieldCheck } from "lucide-react";
import { RfqForm } from "@/components/home/rfq-form";
import { SourcingTimeline } from "@/components/home/sourcing-timeline";
import { WorldShippingMap } from "@/components/home/world-map";
import { Reveal } from "@/components/shared/reveal";
import {
  ButtonLink,
  Container,
  SectionHeading,
  SpectrumRail,
} from "@/components/ui/primitives";
import {
  categories,
  company,
  faqs,
  industries,
  testimonials,
  whyUs,
} from "@/lib/content";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-fade opacity-60" aria-hidden />
        <div
          className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
          aria-hidden
        />
        <Container className="relative grid min-h-0 items-center gap-8 py-10 sm:gap-12 sm:py-16 lg:min-h-[88vh] lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <SpectrumRail className="mb-6 w-28 sm:mb-8" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              sourcing.center
            </p>
            <p className="mt-2 font-display text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
              Seven Color
            </p>
            <h1 className="mt-4 max-w-xl text-lg font-medium leading-snug text-ink-soft sm:mt-5 sm:text-2xl">
              China sourcing infrastructure for procurement teams that refuse to guess.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted sm:mt-5 sm:text-lg">
              No MOQ. Verified factories. Photo & video QC. Freight from Xiamen and Dubai —
              built like an enterprise desk, not a brochure site.
            </p>
            <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <ButtonLink href="#rfq" className="w-full sm:w-auto">
                Open sourcing request
              </ButtonLink>
              <ButtonLink href="/how-it-works" variant="secondary" className="w-full sm:w-auto">
                See the workflow
              </ButtonLink>
            </div>
            <div className="mt-8 flex flex-col gap-2 text-sm text-muted sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 shrink-0 text-accent" /> No minimum order
              </span>
              <span className="inline-flex items-center gap-2">
                <Building2 className="h-4 w-4 shrink-0 text-accent" /> Dubai & China offices
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-accent" /> Pre-shipment QC
              </span>
            </div>
          </div>
          <div id="rfq" className="md:animate-float scroll-mt-28">
            <RfqForm />
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-y border-line bg-paper-elevated">
        <Container className="grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {company.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.05}>
              <p className="font-display text-3xl font-semibold text-ink md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Categories */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Product categories"
            title="What we source"
            description="From a single sample to container programs — electronics to industrial steel."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 0.04}>
                <Link
                  href="/services"
                  className="group block rounded-3xl border border-line bg-paper-elevated p-6 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg"
                >
                  <p className="font-mono text-xs text-accent">/{cat.slug}</p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{cat.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition group-hover:opacity-100">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="border-y border-line bg-paper-elevated py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Inquiry to delivery — one controlled path"
            description="A four-stage sourcing timeline with on-ground verification before anything ships."
          />
          <div className="mt-14">
            <SourcingTimeline />
          </div>
          <div className="mt-10">
            <ButtonLink href="/how-it-works" variant="secondary">
              Full process detail
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Map + Why */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Trade lanes"
              title="Xiamen sourcing. Dubai logistics. Global delivery."
              description="Live routes across our primary hubs — sea, air, and express with customs guidance."
            />
            <div className="mt-8">
              <WorldShippingMap />
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Why Seven Color"
              title="Your eyes and ears in China"
              description="We operate as an extension of your procurement team — not a marketplace middleman."
            />
            <ul className="mt-8 space-y-3">
              {whyUs.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-paper-elevated px-4 py-3 text-sm text-ink"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Industries */}
      <section className="border-y border-line bg-ink-soft py-20 text-paper dark:bg-paper-elevated dark:text-ink sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Industry expertise"
            title="Built for buyers who ship for real"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 dark:border-line dark:bg-paper"
              >
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/70 dark:text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <ButtonLink href="/industries" variant="secondary">
              View industries
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Trust"
            title="Trusted by 1,000+ buyers"
            description="From DTC founders to GCC retailers — verified delivery stories."
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-3xl border border-line bg-paper-elevated p-6"
              >
                <p className="text-sm leading-relaxed text-ink">“{t.quote}”</p>
                <footer className="mt-6 border-t border-line pt-4 text-sm">
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="text-muted">
                    {t.role} · {t.region}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-paper-elevated py-20 sm:py-28">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Answers before you RFQ" align="center" />
          <div className="mt-10 space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-line bg-paper px-5 py-4"
              >
                <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-ink px-8 py-14 text-paper dark:bg-accent dark:text-paper sm:px-12">
            <SpectrumRail className="absolute inset-x-0 top-0 rounded-none" />
            <p className="font-display text-3xl font-semibold sm:text-4xl">
              Ready to source from China?
            </p>
            <p className="mt-4 max-w-xl text-paper/75">
              Tell us what you need. Your relationship manager handles suppliers, QC, and
              shipping — with proof before anything leaves the factory.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink"
              >
                Request a quote
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-paper"
              >
                Open client desk
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
