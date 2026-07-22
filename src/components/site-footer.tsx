import Link from 'next/link';
import { BRAND, NAV, SERVICES, SPECTRUM } from '@/lib/brand';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-3xl font-bold tracking-[-0.04em]">{BRAND.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">{BRAND.description}</p>
          <div className="mt-5 flex gap-1.5">
            {SPECTRUM.map((color) => (
              <span
                key={color}
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Quick links</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Services</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {SERVICES.map((service) => (
              <li key={service.title}>{service.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <a href={`mailto:${BRAND.emails.sme}`} className="hover:text-white">
                {BRAND.emails.sme}
              </a>
            </li>
            <li>
              <a href={`tel:${BRAND.phones.dubai}`} className="hover:text-white">
                {BRAND.phones.dubai}
              </a>
            </li>
            <li>
              <a href={`tel:${BRAND.phones.china}`} className="hover:text-white">
                {BRAND.phones.china}
              </a>
            </li>
            <li>
              <a href={`tel:${BRAND.phones.india}`} className="hover:text-white">
                {BRAND.phones.india}
              </a>
            </li>
          </ul>
          <p className="mt-5 text-xs leading-5 text-white/45">{BRAND.hours}</p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-[11px] tracking-[0.08em] text-white/40 sm:px-6">
        © {new Date().getFullYear()} {BRAND.name} · {BRAND.domain} · Version 2
      </div>
    </footer>
  );
}
