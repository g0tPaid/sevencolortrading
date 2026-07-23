import Link from "next/link";
import { SourcingLogo } from "@/components/brand/sourcing-logo";
import { Container, SpectrumRail } from "@/components/ui/primitives";
import { company, services } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-line bg-ink-soft text-paper dark:bg-paper-elevated dark:text-ink">
      <SpectrumRail className="absolute inset-x-0 top-0 rounded-none" />
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <SourcingLogo size="footer" onDark className="items-start dark:hidden" />
            <SourcingLogo size="footer" className="hidden items-start dark:flex" />
            <p className="mt-3 text-sm leading-relaxed text-paper/70 dark:text-muted">
              {company.tagline}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50 dark:text-muted">
              Platform
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-paper/80 hover:text-paper dark:text-muted dark:hover:text-ink">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50 dark:text-muted">
              Company
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["About", "/about"],
                ["How it works", "/how-it-works"],
                ["Case studies", "/case-studies"],
                ["Knowledge", "/knowledge"],
                ["Contact", "/contact"],
                ["Client desk", "/dashboard"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-paper/80 hover:text-paper dark:text-muted dark:hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50 dark:text-muted">
              Offices
            </p>
            <ul className="mt-4 space-y-4 text-sm text-paper/80 dark:text-muted">
              {company.offices.map((o) => (
                <li key={o.city}>
                  <p className="font-medium text-paper dark:text-ink">
                    {o.city}, {o.country}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed">{o.address}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-paper/50 dark:border-line dark:text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {company.legalName}</p>
          <p>
            {company.emails.corporate} · {company.phones[0]}
          </p>
        </div>
      </Container>
    </footer>
  );
}
