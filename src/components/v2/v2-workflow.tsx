"use client";

import { motion } from "framer-motion";
import {
  Beaker,
  ClipboardCheck,
  Factory,
  FileSearch,
  Lightbulb,
  PackageCheck,
  Plane,
  Quote,
  Ship,
} from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { workflowSteps } from "@/lib/v2-content";

const icons = [
  Lightbulb,
  FileSearch,
  Factory,
  Quote,
  Beaker,
  PackageCheck,
  ClipboardCheck,
  Ship,
  Plane,
] as const;

export function V2Workflow() {
  return (
    <section id="workflow" className="scroll-mt-28 border-y border-line bg-white py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Workflow</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Idea to delivery — one timeline
          </h2>
          <p className="mt-4 text-muted sm:text-lg">
            From the first sketch or SKU brief to goods at your door — one controlled path with
            Seven Color on the ground in China.
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl">
          {/* Ambient rail */}
          <div
            className="pointer-events-none absolute inset-x-8 top-0 hidden h-full sm:block"
            aria-hidden
          >
            <div className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-gradient-to-b from-accent/40 via-line to-accent/40 lg:left-0 lg:top-1/2 lg:h-px lg:w-full lg:translate-x-0 lg:bg-gradient-to-r" />
          </div>

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workflowSteps.map((step, i) => {
              const Icon = icons[i] ?? Lightbulb;
              const isFirst = i === 0;
              const isLast = i === workflowSteps.length - 1;

              return (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.05, duration: 0.45 }}
                  whileHover={{ y: -4 }}
                  className={`workflow-step relative overflow-hidden rounded-[1.5rem] p-5 sm:p-6 ${
                    isFirst || isLast ? "workflow-step-accent sm:col-span-1" : ""
                  } ${isLast ? "sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        isFirst || isLast
                          ? "bg-accent text-white shadow-[0_12px_28px_rgba(214,0,0,0.28)]"
                          : "bg-accent-soft text-accent"
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 font-mono text-[10px] font-semibold text-paper">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                        {step.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
                    </div>
                  </div>
                  {isLast ? (
                    <div
                      className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl"
                      style={{
                        background: "radial-gradient(circle, rgba(214,0,0,0.35), transparent 70%)",
                      }}
                      aria-hidden
                    />
                  ) : null}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
