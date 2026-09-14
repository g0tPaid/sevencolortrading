"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SourcingLogo } from "@/components/brand/sourcing-logo";
import { FactoryLabel } from "@/components/layout/factory-label";
import { cn } from "@/lib/utils";

const pageLinks = [
  { href: "/3pl", label: "3PL", highlight: true },
  { href: "/inspection", label: "Inspection" },
  { href: "/amazon-fba", label: "Amazon FBA" },
  { href: "/factories/register", label: "Factories" },
  { href: "/dropshipping", label: "Dropship" },
  { href: "/#visit", label: "Visit China" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/reviews", label: "Reviews" },
];

const homeLinks = [
  { href: "/#new-idea", label: "New idea" },
  { href: "/#network", label: "Network" },
  { href: "/#workflow", label: "Workflow" },
  { href: "/#inspection", label: "Inspection" },
  { href: "/#amazon-fba", label: "Amazon FBA" },
  { href: "/#trust", label: "Trust" },
];

export function V2Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.dataset.navOpen = open ? "true" : "";
    return () => {
      document.body.style.overflow = "";
      delete document.body.dataset.navOpen;
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={cn(
          "glass-nav pointer-events-auto mx-auto flex max-w-6xl items-center gap-3 rounded-full px-3 py-2 transition-all duration-300 sm:px-4 sm:py-2.5",
          scrolled || open ? "glass-nav-scrolled" : "",
        )}
      >
        <Link href="/" onClick={() => setOpen(false)} className="min-w-0 shrink-0">
          <SourcingLogo size="nav" />
        </Link>
        <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {pageLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-2.5 py-1.5 text-[13px] transition",
                l.href === "/factories/register" && "whitespace-nowrap",
                l.highlight
                  ? "font-semibold text-accent hover:bg-accent-soft"
                  : "text-muted hover:bg-white/50 hover:text-ink",
              )}
            >
              {l.href === "/factories/register" ? <FactoryLabel /> : l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center lg:flex">
          <Link
            href="/#rfq"
            className="rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-paper transition hover:opacity-90"
          >
            Start Sourcing
          </Link>
        </div>
        <button
          type="button"
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/40 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-sheet pointer-events-auto mx-auto mt-2 max-w-6xl rounded-[1.75rem] p-3 sm:p-4 lg:hidden"
          >
            <div className="flex flex-col">
              {pageLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-2xl px-3 py-3 text-[15px]",
                    l.highlight ? "font-semibold text-accent" : "text-ink",
                  )}
                >
                  {l.href === "/factories/register" ? <FactoryLabel /> : l.label}
                </Link>
              ))}
              <div className="my-1 h-px bg-line" />
              {homeLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-3 py-3 text-[15px] text-muted"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/#rfq"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-ink px-4 py-3 text-center text-sm font-medium text-paper"
              >
                Start Sourcing
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
