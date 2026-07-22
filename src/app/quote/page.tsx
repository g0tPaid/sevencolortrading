import type { Metadata } from 'next';
import { QuoteForm } from '@/components/quote-form';
import { SPECTRUM } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Get Quote',
  description:
    'Request a detailed sourcing quotation with pricing, timeline, and recommendations. Free, no obligation.',
};

export default function QuotePage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Get quote</p>
        <h1 className="font-display mt-3 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
          Request a product quote
        </h1>
        <p className="mt-5 text-base leading-7 text-ink/75">
          Tell us what you need, and we&apos;ll provide a detailed quotation with pricing, timeline,
          and sourcing recommendations.
        </p>
        <ul className="mt-8 space-y-4">
          {[
            { value: '24h', label: 'Response time' },
            { value: 'Free', label: 'No-obligation quote' },
            { value: '100%', label: 'Transparent pricing' },
          ].map((item, index) => (
            <li key={item.label} className="flex items-center gap-4 rounded-2xl border border-line bg-white/70 px-4 py-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: SPECTRUM[index % SPECTRUM.length] }}
                aria-hidden
              />
              <div>
                <p className="font-display text-xl font-bold tracking-[-0.03em]">{item.value}</p>
                <p className="text-sm text-muted">{item.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <QuoteForm />
    </main>
  );
}
