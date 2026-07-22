import Link from 'next/link';
import { BRAND, NAV, SERVICES, SPECTRUM } from '@/lib/brand';

export function SiteFooter() {
  return (
    <footer className="mt-0 border-t border-ink bg-ink text-paper">
      <div className="spectrum-rail" aria-hidden>
        {SPECTRUM.map((color) => (
          <span key={color} style={{ backgroundColor: color }} />
        ))}
      </div>
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-4xl font-black leading-none tracking-[-0.02em]">SEVEN COLOR</p>
          <p className="mt-4 text-sm leading-6 text-paper/60">{BRAND.tagline}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-paper/40">Navigate</p>
          <ul className="mt-4 space-y-2 text-sm uppercase tracking-[0.12em] text-paper/75">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-paper/40">Services</p>
          <ul className="mt-4 space-y-2 text-sm text-paper/75">
            {SERVICES.map((service) => (
              <li key={service.title}>{service.title}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-paper/40">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-paper/75">
            <li>
              <a href={`mailto:${BRAND.emails.sme}`}>{BRAND.emails.sme}</a>
            </li>
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
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-[10px] uppercase tracking-[0.18em] text-paper/35 sm:px-6">
        © {new Date().getFullYear()} {BRAND.name} · Dubai & China · v2
      </div>
    </footer>
  );
}
