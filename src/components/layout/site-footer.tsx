import Link from "next/link";
import { SourcingLogo } from "@/components/brand/sourcing-logo";
import { FactoryLabel } from "@/components/layout/factory-label";
import { Container, SpectrumRail } from "@/components/ui/primitives";
import { company, services } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="footer-glass relative mt-6 border-t border-white/10 text-paper">
      <SpectrumRail className="absolute inset-x-0 top-0 rounded-none" />
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <SourcingLogo size="footer" showByline onDark className="items-start" />
            <p className="mt-3 text-sm leading-relaxed text-paper/70">
              {company.tagline}
            </p>
            <p className="mt-2 text-xs text-paper/55">
              {company.legalNameFull} · since {company.founded}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">
              Platform
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className={
                      s.href === "/3pl" ||
                      s.href === "/dropshipping" ||
                      s.href === "/inspection" ||
                      s.href === "/amazon-fba" ||
                      s.href === "/1688-sourcing"
                        ? "inline-flex items-center gap-2 font-semibold text-accent hover:opacity-90"
                        : "text-paper/80 hover:text-paper"
                    }
                  >
                    {s.title}
                    {s.href === "/3pl" ? (
                      <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        3PL
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">
              Company
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["About", "/about"],
                ["How it works", "/how-it-works"],
                ["Case studies", "/case-studies"],
                ["Knowledge", "/knowledge"],
                ["FAQ", "/faq"],
                ["Compare", "/compare"],
                ["References", "/reviews"],
                ["Updates", "/updates"],
                ["News", "/news"],
                ["1688 sourcing", "/1688-sourcing"],
                ["UAE / GCC", "/sourcing-for/uae"],
                ["Contact", "/contact"],
                ["Visit China", "/visit"],
                ["Inspection", "/inspection"],
                ["Amazon FBA", "/amazon-fba"],
                ["3PL", "/3pl"],
                ["Factories", "/factories/register"],
                ["Factory growth", "/factory-growth"],
                ["Dropshipping", "/dropshipping"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-paper/80 hover:text-paper">
                    {href === "/factories/register" ? <FactoryLabel /> : label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">
              Offices
            </p>
            <ul className="mt-4 space-y-4 text-sm text-paper/80">
              {company.offices.map((o) => (
                <li key={o.city}>
                  <p className="font-medium text-paper">
                    {o.city}, {o.country}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed">{o.address}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-paper/55">
                    License {o.license}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 space-y-5 border-t border-white/10 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {company.locations.map((loc) => (
              <a
                key={loc.phone}
                href={loc.href}
                className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 transition hover:border-white/25 hover:bg-white/10"
              >
                <p className="font-mono text-sm font-semibold tracking-tight text-paper sm:text-base">
                  {loc.phone}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/55">
                  {loc.label}
                </p>
              </a>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-paper/55">
              Credentials
            </p>
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/dun-bradstreet.png"
                alt="Dun & Bradstreet"
                width={48}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <div>
                <p className="text-sm font-medium text-paper">
                  {company.credentials.dunBradstreet}
                </p>
                <p className="mt-0.5 font-mono text-xs text-paper/60">
                  DUNS {company.credentials.dunsNumber}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-paper/70">
              Registered Vendor Pathways for Walmart, Target, and other major retailers.
            </p>
            <ul className="mt-3 space-y-2 text-xs text-paper/70">
              {company.credentials.licenses.map((lic) => (
                <li key={lic.number} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="shrink-0 font-medium text-paper/90">
                    {lic.region}
                  </span>
                  <span className="font-mono tracking-tight">
                    {lic.kind} {lic.number}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {company.legalName}
            </p>
            <p>{company.emails.corporate}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
