'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BRAND, NAV, SPECTRUM } from '@/lib/brand';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="spectrum-rail rail-pulse" aria-hidden>
        {SPECTRUM.map((color) => (
          <span key={color} style={{ backgroundColor: color }} />
        ))}
      </div>
      <div className="mx-auto flex max-w-[1200px] items-end justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0" onClick={() => setOpen(false)}>
          <span className="font-display block text-[34px] font-black leading-none tracking-[-0.02em] text-ink sm:text-[42px]">
            SEVEN COLOR
          </span>
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            Trading Co · {BRAND.domain}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-[12px] font-semibold uppercase tracking-[0.16em] transition',
                  active ? 'text-signal' : 'text-ink/70 hover:text-ink',
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/quote"
            className="bg-ink px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-paper transition hover:bg-signal"
          >
            Get quote
          </Link>
        </nav>

        <button
          type="button"
          className="border border-ink px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-paper-2 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'border-b border-line py-3 text-sm font-semibold uppercase tracking-[0.14em]',
                  pathname === item.href ? 'text-signal' : 'text-ink',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
