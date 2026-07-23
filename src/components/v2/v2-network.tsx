"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/primitives";
import { WorldShippingMap } from "@/components/home/world-map";
import { supplySteps } from "@/lib/v2-content";

export function V2Network() {
  return (
    <section id="network" className="scroll-mt-28 py-24 sm:py-32">
      <Container>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Global supply network
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            China to your market — one controlled path
          </h2>
          <p className="mt-4 text-muted sm:text-lg">
            Factories, warehouse, inspection, and freight lanes visualized like mission control.
          </p>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {supplySteps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="flex shrink-0 items-center gap-2"
            >
              <span className="rounded-full border border-line bg-paper-elevated px-4 py-2 text-sm font-medium text-ink">
                {step}
              </span>
              {i < supplySteps.length - 1 ? (
                <span className="text-muted" aria-hidden>
                  →
                </span>
              ) : null}
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <WorldShippingMap />
        </div>
      </Container>
    </section>
  );
}
