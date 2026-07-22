import type { Metadata } from 'next';
import { PrimaryCta } from '@/components/cta';
import { CATEGORIES, SERVICES, SPECTRUM } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Personal shopper, product sourcing, quality inspection, and shipping from China with no minimum order.',
};

export default function ServicesPage() {
  return (
    <main>
      <section className="border-b border-line bg-ink px-4 py-16 text-paper sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-paper/50">Services</p>
          <h1 className="font-display mt-4 max-w-[13ch] text-5xl font-black uppercase leading-[0.88] tracking-[-0.03em] sm:text-7xl">
            Inquiry to delivery
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper/70">
            From small accessories to industrial materials — sourced from verified manufacturers,
            with no minimum order.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="divide-y divide-line border-y border-line">
          {SERVICES.map((service, index) => (
            <article key={service.title} className="grid gap-4 py-8 sm:grid-cols-[140px_1fr]">
              <div className="h-1.5 w-12 self-start" style={{ backgroundColor: SPECTRUM[index % SPECTRUM.length] }} />
              <div>
                <h2 className="font-display text-3xl font-black uppercase tracking-[-0.02em]">
                  {service.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/70">{service.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-ink bg-ink py-16 text-paper">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <h2 className="font-display text-4xl font-black uppercase tracking-[-0.03em]">Categories</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => (
              <article key={category.title} className="border-t border-paper/20 pt-4">
                <div className="mb-4 h-1.5 w-10" style={{ backgroundColor: SPECTRUM[(index + 1) % SPECTRUM.length] }} />
                <h3 className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-paper/60">{category.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-12">
            <PrimaryCta />
          </div>
        </div>
      </section>
    </main>
  );
}
