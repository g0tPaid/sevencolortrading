'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PrimaryCta, SecondaryCta } from '@/components/cta';
import {
  BRAND,
  CATEGORIES,
  HOW_IT_WORKS,
  SPECTRUM,
  TESTIMONIALS,
  WHY_US,
  waUrl,
} from '@/lib/brand';

function HomeInquiry() {
  const [description, setDescription] = useState('');

  function send() {
    const message = description.trim()
      ? `Hi Seven Color — product inquiry from ${BRAND.domain}:\n\n${description.trim()}`
      : `Hi Seven Color — I'd like a sourcing quote via ${BRAND.domain}`;
    window.open(waUrl(message), '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="border border-line bg-paper-2 p-6 sm:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
        Start with a budget
      </p>
      <h3 className="font-display mt-2 text-3xl font-black uppercase tracking-[-0.02em] text-ink sm:text-4xl">
        Tell us what you need. We&apos;ll find it in China.
      </h3>
      <label className="mt-6 block text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
        Product description
      </label>
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={4}
        placeholder="Product, quantity, target price, destination…"
        className="mt-2 w-full border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
      />
      <button
        type="button"
        onClick={send}
        className="mt-4 inline-flex w-full items-center justify-center bg-ink px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-paper transition hover:bg-signal sm:w-auto"
      >
        Send on WhatsApp
      </button>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Hero: one composition — brand, headline, line, CTA, full-bleed port image */}
      <section className="relative min-h-[92vh] overflow-hidden bg-ink text-paper">
        <Image
          src="/hero-china-port.jpg"
          alt="China container port at dusk"
          fill
          priority
          className="hero-ken object-cover object-center opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-[1200px] flex-col justify-end px-4 pb-14 pt-28 sm:px-6 sm:pb-20">
          <p className="slide-up text-[11px] font-bold uppercase tracking-[0.32em] text-paper/70">
            Dubai · Xiamen · No MOQ
          </p>
          <h1 className="slide-up slide-delay-1 font-display mt-3 max-w-[11ch] text-[64px] font-black uppercase leading-[0.86] tracking-[-0.03em] sm:text-[96px] lg:text-[112px]">
            Seven Color Trading
          </h1>
          <p className="slide-up slide-delay-2 mt-5 max-w-md text-base leading-7 text-paper/80 sm:text-lg">
            Source anything from China with zero hassle — your eyes and ears on the ground.
          </p>
          <div className="slide-up slide-delay-2 mt-8 flex flex-wrap gap-3">
            <PrimaryCta />
            <SecondaryCta href="/about" className="border-paper/40 text-paper hover:bg-paper hover:text-ink">
              About the house
            </SecondaryCta>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <div className="spectrum-rail rail-pulse" aria-hidden>
            {SPECTRUM.map((color) => (
              <span key={color} style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">How it works</p>
            <h2 className="font-display mt-3 text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] sm:text-6xl">
              Four steps.
              <br />
              Then it ships.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-ink/70">
            From inquiry to delivery, we handle sourcing, negotiation, inspection, and freight so
            you can stay focused on selling.
          </p>
        </div>

        <ol className="mt-12 divide-y divide-line border-y border-line">
          {HOW_IT_WORKS.map((step) => (
            <li
              key={step.step}
              className="grid gap-3 py-6 sm:grid-cols-[88px_1fr_120px] sm:items-baseline"
            >
              <span className="font-display text-4xl font-black text-signal">{step.step}</span>
              <div>
                <p className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">
                  {step.title}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{step.body}</p>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/50 sm:text-right">
                {step.time}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-ink bg-ink py-16 text-paper sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-paper/45">
            What we source
          </p>
          <h2 className="font-display mt-3 max-w-[14ch] text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] sm:text-6xl">
            Anything. No minimum order.
          </h2>
          <div className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => (
              <article key={category.title} className="border-t border-paper/20 pt-4">
                <div
                  className="mb-4 h-1.5 w-10"
                  style={{ backgroundColor: SPECTRUM[index % SPECTRUM.length] }}
                />
                <h3 className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-paper/60">{category.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-sm text-paper/55">
            Don&apos;t see it listed?{' '}
            <Link href="/quote" className="text-paper underline underline-offset-4">
              Ask anyway — we source across categories.
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">Why us</p>
          <h2 className="font-display mt-3 text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] sm:text-6xl">
            Your team in China
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-ink/70">
            Offices and warehouses in Dubai and China. Photos and videos before shipping. A personal
            relationship manager on every order.
          </p>
          <ul className="mt-8 space-y-0 border-y border-line">
            {WHY_US.map((item) => (
              <li
                key={item}
                className="border-b border-line py-3.5 text-sm font-medium leading-6 text-ink/85 last:border-b-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <HomeInquiry />
      </section>

      <section className="border-t border-line bg-paper-2 py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">Proof</p>
          <h2 className="font-display mt-3 text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em]">
            Clients talk.
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {TESTIMONIALS.map((item, index) => (
              <blockquote key={item.name} className="border-t-4 pt-5" style={{ borderColor: SPECTRUM[index] }}>
                <p className="text-[15px] leading-7 text-ink/80">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-6">
                  <p className="font-display text-xl font-bold uppercase tracking-[-0.02em]">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {item.role} · {item.place}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-signal py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display max-w-[12ch] text-5xl font-black uppercase leading-[0.88] tracking-[-0.03em] sm:text-6xl">
              Ready to source?
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-white/85">
              No minimum order. Tell us the product — your manager handles the rest, with pictures
              and videos before it leaves China.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="bg-ink px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-paper transition hover:bg-paper hover:text-ink"
            >
              Request a quote
            </Link>
            <a
              href={waUrl(`Hi Seven Color — ready to start sourcing via ${BRAND.domain}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-signal"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
