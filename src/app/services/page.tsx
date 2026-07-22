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
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Services</p>
      <h1 className="font-display mt-3 max-w-[16ch] text-4xl font-extrabold tracking-[-0.05em] sm:text-6xl">
        End-to-end sourcing, from inquiry to delivery
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-ink/75">
        From small consumer accessories to large-scale industrial materials, we source any product
        you need from verified manufacturers worldwide — with no minimum order.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {SERVICES.map((service, index) => (
          <article key={service.title} className="rounded-[28px] border border-line bg-white/75 p-7">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: SPECTRUM[index % SPECTRUM.length] }}
              aria-hidden
            />
            <h2 className="font-display mt-4 text-2xl font-bold tracking-[-0.03em]">{service.title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink/70">{service.body}</p>
          </article>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold tracking-[-0.04em]">Product categories</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <article key={category.title} className="rounded-[24px] border border-line bg-white/70 p-5">
              <div
                className="h-1 w-10 rounded-full"
                style={{ backgroundColor: SPECTRUM[(index + 1) % SPECTRUM.length] }}
              />
              <h3 className="font-display mt-4 text-xl font-bold tracking-[-0.03em]">{category.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{category.body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <PrimaryCta>Request a quote</PrimaryCta>
      </div>
    </main>
  );
}
