'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
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
    <div className="rounded-[28px] border border-line bg-white/80 p-5 shadow-[0_20px_60px_rgba(11,18,32,0.06)] backdrop-blur sm:p-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
        Best for startups & beginners
      </p>
      <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.03em] text-ink">
        Tell us your budget — we&apos;ll source the best product in class.
      </h3>
      <label className="mt-5 block text-[12px] font-semibold tracking-[0.08em] text-ink/70">
        Product description *
      </label>
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={4}
        placeholder="What do you need, quantity, target price, destination…"
        className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none ring-accent/30 placeholder:text-muted/70 focus:ring-2"
      />
      <button
        type="button"
        onClick={send}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ink-soft sm:w-auto"
      >
        Send inquiry on WhatsApp
      </button>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#2563eb]/15 blur-3xl" />
          <div className="absolute -right-16 top-40 h-80 w-80 rounded-full bg-[#e11d48]/12 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:pb-20 lg:pt-20">
          <div>
            <p className="rise-in text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
              Version 2 · {BRAND.domain}
            </p>
            <h1 className="rise-in rise-delay-1 font-display mt-4 max-w-[14ch] text-[48px] font-extrabold leading-[0.92] tracking-[-0.055em] text-ink sm:text-[68px]">
              {BRAND.name}
            </h1>
            <p className="rise-in rise-delay-2 mt-5 max-w-xl text-lg leading-8 text-ink/75 sm:text-xl">
              Source anything and everything from China with zero hassle. No MOQ. Offices in Dubai
              and China. 1:1 customer service.
            </p>
            <div className="rise-in rise-delay-3 mt-8 flex flex-wrap gap-3">
              <PrimaryCta />
              <SecondaryCta href="/services">See services</SecondaryCta>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {['No MOQ', 'Dubai & China offices', 'Photos before shipping', '24/7 WhatsApp'].map(
                (item, index) => (
                  <span
                    key={item}
                    className="rounded-full border border-line bg-white/70 px-3 py-1.5 text-[11px] font-semibold tracking-[0.06em] text-ink/80"
                    style={{ borderBottomColor: SPECTRUM[index % SPECTRUM.length] }}
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="float-soft relative overflow-hidden rounded-[32px] border border-line bg-ink p-6 text-white shadow-[0_30px_80px_rgba(11,18,32,0.28)] sm:p-8">
            <div className="spectrum-line absolute inset-x-0 top-0 h-1" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
              How it works
            </p>
            <ol className="mt-5 space-y-4">
              {HOW_IT_WORKS.map((step) => (
                <li key={step.step} className="grid grid-cols-[auto_1fr] gap-3">
                  <span className="font-display text-2xl font-bold text-white/35">{step.step}</span>
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-semibold tracking-[-0.02em]">{step.title}</p>
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                        {step.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-white/65">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BRAND.stats.map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-line bg-white/75 px-5 py-6"
            >
              <div
                className="mb-3 h-1 w-10 rounded-full"
                style={{ backgroundColor: SPECTRUM[index % SPECTRUM.length] }}
              />
              <p className="font-display text-3xl font-bold tracking-[-0.04em]">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
            Product categories
          </p>
          <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.04em] text-ink sm:text-5xl">
            What can we source for you?
          </h2>
          <p className="mt-4 text-base leading-7 text-ink/70">
            From consumer electronics to industrial equipment — we source everything with no
            minimum order.
          </p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <article
              key={category.title}
              className="rounded-[24px] border border-line bg-white/70 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(11,18,32,0.08)]"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: SPECTRUM[index % SPECTRUM.length] }}
                aria-hidden
              />
              <h3 className="font-display mt-4 text-xl font-bold tracking-[-0.03em]">
                {category.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">{category.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Don&apos;t see your category?{' '}
          <Link href="/quote" className="font-semibold text-accent underline-offset-2 hover:underline">
            We source anything from China — request a quote
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Why choose us</p>
          <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
            Your eyes and ears in China
          </h2>
          <p className="mt-4 text-base leading-7 text-ink/70">
            We&apos;re not just a sourcing company — we&apos;re your personal shopping partner in
            China. With no minimum orders and offices in both Dubai and China, international
            sourcing stays simple.
          </p>
          <ul className="mt-7 space-y-3">
            {WHY_US.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-ink/80">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <HomeInquiry />
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
            Client testimonials
          </p>
          <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
            Trusted by 1,000+ customers
          </h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <blockquote
              key={item.name}
              className="rounded-[28px] border border-line bg-white/75 p-6"
            >
              <div
                className="h-1 w-12 rounded-full"
                style={{ backgroundColor: SPECTRUM[(index + 2) % SPECTRUM.length] }}
              />
              <p className="mt-5 text-[15px] leading-7 text-ink/80">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-6">
                <p className="font-semibold tracking-[-0.02em]">{item.name}</p>
                <p className="text-sm text-muted">
                  {item.role} · {item.place}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 pb-8 sm:px-6">
        <div className="overflow-hidden rounded-[36px] border border-line bg-ink px-6 py-12 text-white sm:px-10 sm:py-14">
          <div className="spectrum-line mb-8 h-1 w-28 rounded-full" />
          <h2 className="font-display max-w-[16ch] text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
            Ready to source from China?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
            No minimum order required. Tell us what you need, and your personal relationship
            manager will handle everything — with pictures and videos before shipping.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryCta className="!shadow-none" />
            <a
              href={waUrl(`Hi Seven Color — ready to start sourcing via ${BRAND.domain}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
