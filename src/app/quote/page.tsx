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
    <main className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">Get quote</p>
        <h1 className="font-display mt-3 text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] sm:text-6xl">
          Request a product quote
        </h1>
        <p className="mt-5 text-base leading-7 text-ink/70">
          Pricing, timeline, and sourcing recommendations — usually within 24 hours.
        </p>
        <ul className="mt-10 space-y-5">
          {[
            { value: '24h', label: 'Response time' },
            { value: 'Free', label: 'No-obligation quote' },
            { value: '100%', label: 'Transparent pricing' },
          ].map((item, index) => (
            <li key={item.label} className="border-t border-line pt-4">
              <div className="h-1 w-8" style={{ backgroundColor: SPECTRUM[index % SPECTRUM.length] }} />
              <p className="font-display mt-2 text-3xl font-black tracking-[-0.03em]">{item.value}</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
      <QuoteForm />
    </main>
  );
}
