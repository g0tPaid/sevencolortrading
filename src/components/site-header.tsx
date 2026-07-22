'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BRAND, NAV } from '@/lib/brand';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[#f7f8fb]/88 backdrop-blur-md">
      <div className="spectrum-line h-[3px] w-full" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0" onClick={() => setOpen(false)}>
          <span className="font-display block text-[22px] font-bold leading-none tracking-[-0.04em] text-ink sm:text-[26px]">
            {BRAND.shortName}
          </span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
            Trading · Dubai & China
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-3.5 py-2 text-[12px] font-semibold tracking-[0.08em] transition',
                  active ? 'bg-ink text-white' : 'text-ink/75 hover:bg-ink/5 hover:text-ink',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/quote"
            className="hidden rounded-full bg-accent px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_30px_rgba(225,29,72,0.25)] transition hover:brightness-110 sm:inline-flex"
          >
            Request a quote
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line text-ink md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-xl px-3 py-3 text-sm font-semibold',
                  pathname === item.href ? 'bg-ink text-white' : 'text-ink hover:bg-paper-deep',
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-accent px-3 py-3 text-center text-sm font-bold text-white"
            >
              Request a quote
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
