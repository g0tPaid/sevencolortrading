"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/primitives";
import { workflowSteps } from "@/lib/v2-content";

export function V2Workflow() {
  return (
    <section id="workflow" className="scroll-mt-28 py-24 sm:py-32">
      <Container>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Workflow</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Idea to delivered — one timeline
          </h2>
        </div>

        <div className="mt-14 overflow-x-auto pb-4">
          <ol className="flex min-w-max items-start gap-0">
            {workflowSteps.map((step, i) => (
              <li key={step} className="relative flex w-36 flex-col items-center px-2">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-xs font-semibold text-ink"
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>
                {i < workflowSteps.length - 1 ? (
                  <span className="absolute left-[calc(50%+1.25rem)] top-5 h-px w-[calc(100%-2.5rem)] bg-line" />
                ) : null}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  className="mt-4 text-center text-sm font-medium text-ink"
                >
                  {step}
                </motion.p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
