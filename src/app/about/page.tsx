import type { Metadata } from 'next';
import { PrimaryCta } from '@/components/cta';
import { BRAND, SPECTRUM } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Since 2014, Seven Color Trading has helped businesses source quality products from verified manufacturers worldwide.',
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">About us</p>
      <h1 className="font-display mt-3 max-w-[18ch] text-4xl font-extrabold tracking-[-0.05em] text-ink sm:text-6xl">
        Connecting businesses to global manufacturing
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-ink/75">
        Since 2014, {BRAND.shortName} has helped businesses of all sizes source quality products from
        verified manufacturers worldwide. We specialize in end-to-end sourcing solutions that save
        you time, money, and headaches.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <article className="rounded-[28px] border border-line bg-white/75 p-7">
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: SPECTRUM[0] }} />
          <h2 className="font-display mt-5 text-2xl font-bold tracking-[-0.03em]">Our mission</h2>
          <p className="mt-3 text-sm leading-7 text-ink/70">
            To simplify global sourcing by providing transparent, reliable, and efficient supply
            chain solutions that empower businesses to focus on growth while we handle the
            complexity of international procurement.
          </p>
        </article>
        <article className="rounded-[28px] border border-line bg-white/75 p-7">
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: SPECTRUM[5] }} />
          <h2 className="font-display mt-5 text-2xl font-bold tracking-[-0.03em]">Our vision</h2>
          <p className="mt-3 text-sm leading-7 text-ink/70">
            To become the world&apos;s most trusted sourcing partner, known for quality, integrity,
            and exceptional service. We aim to build lasting relationships with clients and
            suppliers that drive mutual success.
          </p>
        </article>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-bold tracking-[-0.04em]">
          Global reach, local expertise
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink/70">
          We operate across multiple continents with established supplier networks and on-ground
          teams in Dubai and China.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: '500+', label: 'Verified suppliers' },
            { value: '50+', label: 'Countries served' },
            { value: '$50M+', label: 'Products sourced' },
            { value: '1,000+', label: 'Happy clients' },
          ].map((stat, index) => (
            <div key={stat.label} className="rounded-3xl border border-line bg-white/70 px-5 py-6">
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

      <section className="mt-14 grid gap-4 md:grid-cols-2">
        {[BRAND.offices.dubai, BRAND.offices.china].map((office, index) => (
          <article key={office.label} className="rounded-[28px] border border-line bg-ink p-7 text-white">
            <div
              className="h-1 w-12 rounded-full"
              style={{ backgroundColor: SPECTRUM[(index + 3) % SPECTRUM.length] }}
            />
            <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.03em]">{office.label}</h3>
            <ul className="mt-4 space-y-1.5 text-sm leading-6 text-white/65">
              {office.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <div className="mt-12">
        <PrimaryCta />
      </div>
    </main>
  );
}
