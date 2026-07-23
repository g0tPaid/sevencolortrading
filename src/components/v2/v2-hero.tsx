"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { heroExamples } from "@/lib/v2-content";

export function V2Hero() {
  const [query, setQuery] = useState("");
  const [exampleIdx, setExampleIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setExampleIdx((i) => (i + 1) % heroExamples.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="absolute inset-0 mission-grid" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(214,0,0,0.12), transparent 68%)",
        }}
        aria-hidden
      />

      <Container className="relative max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold uppercase tracking-[0.28em] text-accent"
        >
          Product ideation & sourcing OS
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.55 }}
          className="mx-auto mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl md:text-7xl"
        >
          One Platform for Product Ideation &amp; Sourcing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          Discover winning product ideas, validate demand, connect with verified manufacturers,
          manage production, and source directly from China—all from one intelligent platform.
        </motion.p>

        <motion.form
          id="rfq"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={(e) => e.preventDefault()}
          className="glass-card mx-auto mt-10 flex max-w-2xl scroll-mt-28 items-center gap-3 rounded-[1.75rem] px-4 py-3 sm:px-5 sm:py-4"
        >
          <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden />
          <div className="relative min-w-0 flex-1 text-left">
            <label htmlFor="manufacture-search" className="sr-only">
              What do you want to manufacture?
            </label>
            <input
              id="manufacture-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to manufacture?"
              className="w-full bg-transparent text-base text-ink outline-none placeholder:text-muted/70"
            />
            {!query ? (
              <p className="pointer-events-none mt-1 truncate text-xs text-muted">
                Try{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={heroExamples[exampleIdx]}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="inline-block font-medium text-ink"
                  >
                    {heroExamples[exampleIdx]}
                  </motion.span>
                </AnimatePresence>
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            className="hidden shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white sm:inline-flex"
          >
            Search
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="#ideation"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:opacity-90 sm:w-auto dark:bg-accent"
          >
            Start Sourcing <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="#discovery"
            className="inline-flex w-full items-center justify-center rounded-full border border-line bg-paper px-6 py-3 text-sm font-semibold text-ink transition hover:border-ink/20 sm:w-auto"
          >
            Explore Products
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
