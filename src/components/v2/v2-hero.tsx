"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { SourcingLogo } from "@/components/brand/sourcing-logo";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { companyHighlights, heroExamples } from "@/lib/v2-content";

const ideationWords = ["Ideation", "Invention", "Development", "Concepts"] as const;
const sourcingWords = ["Sourcing", "Manufacturing", "Production", "Logistics"] as const;

function AnimatedHeadlineWord({
  words,
  intervalMs = 2800,
  delayMs = 0,
  className,
}: {
  words: readonly string[];
  intervalMs?: number;
  delayMs?: number;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let intervalId = 0;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setIdx((i) => (i + 1) % words.length);
      }, intervalMs);
    }, delayMs);
    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, [words.length, intervalMs, delayMs]);

  return (
    <span
      className={`relative inline-flex h-[1.15em] min-w-[7.5ch] overflow-hidden align-bottom sm:min-w-[8.5ch] ${className ?? ""}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[idx]}
          initial={{ y: "80%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-70%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-0 whitespace-nowrap text-accent"
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible whitespace-nowrap" aria-hidden>
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
    </span>
  );
}

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
          Welcome
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.06, duration: 0.55 }}
          className="mt-8 flex justify-center sm:mt-10"
        >
          <SourcingLogo
            size="hero"
            showByline
            className="items-center [&>span:first-child]:items-center"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <Image
            src="/dun-bradstreet.png"
            alt="Dun & Bradstreet"
            width={56}
            height={48}
            className="h-10 w-auto object-contain sm:h-12"
            unoptimized
          />
          <div className="text-left">
            <p className="text-xs font-medium text-ink sm:text-sm">
              {company.credentials.dunBradstreet}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted sm:text-sm">
              DUNS {company.credentials.dunsNumber}
            </p>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.55 }}
          className="font-headline mx-auto mt-12 max-w-5xl text-[2.4rem] font-semibold leading-[1.12] text-ink sm:mt-14 sm:text-5xl md:text-6xl lg:text-[4.6rem]"
        >
          <span className="sr-only">
            One Platform for Product Ideation &amp; Sourcing
          </span>
          <span aria-hidden className="inline">
            One Platform for Product{" "}
            <AnimatedHeadlineWord words={ideationWords} intervalMs={3000} />
            {" "}
            &amp;{" "}
            <AnimatedHeadlineWord
              words={sourcingWords}
              intervalMs={3000}
              delayMs={1500}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.5 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {company.description}
        </motion.p>

        <motion.ul
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-5"
        >
          {companyHighlights.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-ink sm:text-xs"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.form
          id="rfq"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5 }}
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
            href="#new-idea"
            className="inline-flex w-full items-center justify-center rounded-full border border-line bg-paper px-6 py-3 text-sm font-semibold text-ink transition hover:border-ink/20 sm:w-auto"
          >
            I have a new product idea
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
