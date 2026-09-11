"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/primitives";
import { whyPoints } from "@/lib/v2-content";

export function V2Why() {
  return (
    <section className="border-t border-line bg-white py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Why Sourcing.center
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Your company for ideation, factories, and delivery
          </h2>
          <p className="mt-4 max-w-xl text-muted sm:text-lg">
            Sourcing.center by Seven Color Trading Co Ltd · China — one team from a brand-new
            product idea through to arrival, with China on the ground and desks that stay with you.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {whyPoints.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-[1.5rem] p-5 sm:p-6"
            >
              <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
