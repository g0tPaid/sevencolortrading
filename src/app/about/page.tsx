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
    <main>
      <section className="border-b border-line bg-ink px-4 py-16 text-paper sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-paper/50">About</p>
          <h1 className="font-display mt-4 max-w-[14ch] text-5xl font-black uppercase leading-[0.88] tracking-[-0.03em] sm:text-7xl">
            Connecting businesses to global manufacturing
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper/70">
            Since 2014, {BRAND.shortName} has helped businesses of all sizes source quality products
            from verified manufacturers worldwide.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-0 px-4 py-16 sm:px-6 md:grid-cols-2">
        <article className="border border-line p-7 md:border-r-0">
          <div className="h-1.5 w-12" style={{ backgroundColor: SPECTRUM[0] }} />
          <h2 className="font-display mt-5 text-3xl font-black uppercase tracking-[-0.02em]">Mission</h2>
          <p className="mt-4 text-sm leading-7 text-ink/70">
            Simplify global sourcing with transparent, reliable supply-chain work so businesses can
            grow while we handle international procurement.
          </p>
        </article>
        <article className="border border-line p-7">
          <div className="h-1.5 w-12" style={{ backgroundColor: SPECTRUM[5] }} />
          <h2 className="font-display mt-5 text-3xl font-black uppercase tracking-[-0.02em]">Vision</h2>
          <p className="mt-4 text-sm leading-7 text-ink/70">
            Become the world&apos;s most trusted sourcing partner — known for quality, integrity,
            and relationships that last on both sides of the factory gate.
          </p>
        </article>
      </section>

      <section className="border-y border-line bg-paper-2 py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <h2 className="font-display text-4xl font-black uppercase tracking-[-0.03em]">By the numbers</h2>
          <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: '500+', label: 'Verified suppliers' },
              { value: '50+', label: 'Countries served' },
              { value: '$50M+', label: 'Products sourced' },
              { value: '1,000+', label: 'Happy clients' },
            ].map((stat, index) => (
              <div key={stat.label}>
                <div className="h-1 w-8" style={{ backgroundColor: SPECTRUM[index % SPECTRUM.length] }} />
                <p className="font-display mt-3 text-4xl font-black tracking-[-0.03em]">{stat.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-0 px-4 py-16 sm:px-6 md:grid-cols-2">
        {[BRAND.offices.dubai, BRAND.offices.china].map((office, index) => (
          <article key={office.label} className="border border-ink bg-ink p-8 text-paper md:odd:border-r-0">
            <div className="h-1.5 w-12" style={{ backgroundColor: SPECTRUM[(index + 3) % SPECTRUM.length] }} />
            <h3 className="font-display mt-5 text-3xl font-black uppercase tracking-[-0.02em]">
              {office.label}
            </h3>
            <ul className="mt-4 space-y-1.5 text-sm leading-6 text-paper/65">
              {office.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <div className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <PrimaryCta />
      </div>
    </main>
  );
}
