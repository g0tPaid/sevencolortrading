"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { SourcingLogo } from "@/components/brand/sourcing-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ButtonLink } from "@/components/ui/primitives";
import { services, industries } from "@/lib/content";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/industries", label: "Industries" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/knowledge", label: "Knowledge" },
];

export function FloatingNav() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-6xl items-center gap-3 rounded-2xl border px-3 py-2 transition-all duration-300 sm:px-4",
          scrolled || open || mega
            ? "glass shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
            : "border-transparent bg-transparent",
        )}
      >
        <Link href="/" className="flex min-w-0 items-center py-1" onClick={() => setOpen(false)}>
          <SourcingLogo size="nav" />
        </Link>

        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setMega(true)}
            onMouseLeave={() => setMega(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted transition hover:text-ink"
              aria-expanded={mega}
            >
              Platform <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {mega ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full z-50 pt-3"
                >
                  <div className="glass w-[560px] rounded-2xl p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-2">
                      {services.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-xl p-3 transition hover:bg-accent-soft"
                          onClick={() => setMega(false)}
                        >
                          <p className="text-sm font-semibold text-ink">{item.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-muted">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 border-t border-line pt-3">
                      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                        Industries
                      </p>
                      <div className="flex flex-wrap gap-2 px-1">
                        {industries.slice(0, 4).map((item) => (
                          <Link
                            key={item.title}
                            href="/industries"
                            className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-accent/40 hover:text-ink"
                            onClick={() => setMega(false)}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm text-muted transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="rounded-full px-3 py-2 text-sm text-muted transition hover:text-ink"
          >
            Client desk
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink href="/contact" className="hidden sm:inline-flex" variant="primary">
            Get a quote
          </ButtonLink>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="pointer-events-auto mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-line glass p-4 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {services.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2.5 text-sm text-muted"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                className="rounded-xl px-3 py-2.5 text-sm text-muted"
                onClick={() => setOpen(false)}
              >
                Client desk
              </Link>
              <Link
                href="/about"
                className="rounded-xl px-3 py-2.5 text-sm text-muted"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper dark:bg-accent"
                onClick={() => setOpen(false)}
              >
                Get a quote
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
