"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/primitives";

export function V2Cta() {
  return (
    <section className="pb-28 pt-8 sm:pb-36">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-line bg-ink px-8 py-16 text-center text-paper sm:px-12 sm:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(214,0,0,0.35), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Ready to build your next product?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-paper/70 sm:text-lg">
              Start your sourcing journey with Sourcing.center — ideation, factories, QC, and freight.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="#rfq"
                className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
              >
                Start Sourcing
              </Link>
              <Link
                href="/contact"
                className="inline-flex rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-paper"
              >
                Talk to the desk
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
