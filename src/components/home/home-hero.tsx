"use client";

import { motion } from "framer-motion";
import { SourcingLogo } from "@/components/brand/sourcing-logo";
import { RfqForm } from "@/components/home/rfq-form";
import { ButtonLink, Container } from "@/components/ui/primitives";

const highlights = [
  "NO MOQ — START FROM ONE UNIT",
  "VERIFIED FACTORIES ONLY",
  "PHOTO & VIDEO QC BEFORE SHIP",
] as const;

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-fade opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(227,28,35,0.14), transparent 70%)" }}
        aria-hidden
      />
      <Container className="relative grid items-center gap-10 py-10 sm:gap-12 sm:py-14 lg:min-h-[86vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-20">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#E31C23]"
          >
            Welcome to the Sourcing Center
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <SourcingLogo size="hero" showByline className="items-start" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-8 max-w-xl"
          >
            <h1 className="font-display text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl md:text-[2.75rem]">
              Do you have a product idea?
              <span className="mt-2 block text-[#9B1B2E] dark:text-[#E85A6A]">
                Let&apos;s bring it to life.
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Your{" "}
              <span className="font-semibold text-ink">central command for sourcing from China</span>
              — idea, design, factories, QC, and shipping in one place. No MOQ. Proof before it
              leaves.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-7 space-y-2.5"
          >
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm font-semibold tracking-wide text-ink sm:text-base"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#E31C23]" aria-hidden />
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="mt-8 flex w-full flex-col gap-3 sm:flex-row"
          >
            <ButtonLink href="#rfq" className="w-full sm:w-auto">
              Bring my idea to life
            </ButtonLink>
            <ButtonLink href="#idea-path" variant="secondary" className="w-full sm:w-auto">
              See how it works
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          id="rfq"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="scroll-mt-28 md:animate-float"
        >
          <RfqForm />
        </motion.div>
      </Container>
    </section>
  );
}
