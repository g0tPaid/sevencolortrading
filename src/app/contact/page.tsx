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
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr]">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Contact</p>
        <h1 className="font-display mt-3 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-5 text-base leading-7 text-ink/75">
          Have questions about our sourcing services? Our team is here to help you find the right
          solution for your business.
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-[24px] border border-line bg-white/75 p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Email</p>
            <a href={`mailto:${BRAND.emails.sme}`} className="mt-2 block font-semibold hover:text-accent">
              {BRAND.emails.sme} <span className="font-normal text-muted">(SMEs)</span>
            </a>
            <a
              href={`mailto:${BRAND.emails.corporate}`}
              className="mt-1 block text-sm text-ink/70 hover:text-accent"
            >
              {BRAND.emails.corporate} <span className="text-muted">(Corporate)</span>
            </a>
            <p className="mt-2 text-xs text-muted">Response within 24 hours</p>
          </div>

          <div className="rounded-[24px] border border-line bg-white/75 p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Phone</p>
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
            <p className="mt-3 text-xs text-muted">WhatsApp {BRAND.whatsapp} · 24 hours available</p>
          </div>

          {[BRAND.offices.dubai, BRAND.offices.china].map((office, index) => (
            <div key={office.label} className="rounded-[24px] border border-line bg-white/75 p-5">
              <div
                className="h-1 w-10 rounded-full"
                style={{ backgroundColor: SPECTRUM[(index + 4) % SPECTRUM.length] }}
              />
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                {office.label}
              </p>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-ink/75">
                {office.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}

          <p className="text-sm text-muted">Office hours: {BRAND.hours}</p>
        </div>
      </div>

      <ContactForm />
    </main>
  );
}
