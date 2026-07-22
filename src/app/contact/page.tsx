import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { BRAND, SPECTRUM } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Seven Color Trading in Dubai and China. Email, phone, and WhatsApp support for sourcing inquiries.',
};

export default function ContactPage() {
  return (
    <main className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">Contact</p>
        <h1 className="font-display mt-3 text-5xl font-black uppercase leading-[0.9] tracking-[-0.03em] sm:text-6xl">
          Get in touch
        </h1>
        <p className="mt-5 text-base leading-7 text-ink/70">
          Questions about sourcing? Reach the Dubai or China desk — WhatsApp is fastest.
        </p>

        <div className="mt-10 space-y-6">
          <div className="border-t border-line pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Email</p>
            <a href={`mailto:${BRAND.emails.sme}`} className="mt-2 block text-lg font-semibold hover:text-signal">
              {BRAND.emails.sme}
            </a>
            <a href={`mailto:${BRAND.emails.corporate}`} className="mt-1 block text-sm text-muted hover:text-signal">
              {BRAND.emails.corporate} · corporate
            </a>
          </div>
          <div className="border-t border-line pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Phone / WhatsApp</p>
            <ul className="mt-2 space-y-1 text-sm font-semibold">
              <li>
                <a href={`tel:${BRAND.phones.dubai}`}>{BRAND.phones.dubai}</a>
              </li>
              <li>
                <a href={`tel:${BRAND.phones.china}`}>{BRAND.phones.china}</a>
              </li>
              <li>
                <a href={`tel:${BRAND.phones.india}`}>{BRAND.phones.india}</a>
              </li>
            </ul>
          </div>
          {[BRAND.offices.dubai, BRAND.offices.china].map((office, index) => (
            <div key={office.label} className="border-t border-line pt-4">
              <div className="h-1 w-8" style={{ backgroundColor: SPECTRUM[(index + 4) % SPECTRUM.length] }} />
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{office.label}</p>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-ink/75">
                {office.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-sm text-muted">{BRAND.hours}</p>
        </div>
      </div>
      <ContactForm />
    </main>
  );
}
