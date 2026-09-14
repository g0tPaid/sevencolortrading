"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Warehouse } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { fulfillment, fulfillmentFaqs, fulfillmentHubs, fulfillmentSteps } from "@/lib/v2-content";

export function V2ThreePl() {
  return (
    <section
      id="3pl"
      aria-labelledby="three-pl-heading"
      className="scroll-mt-32 py-8 sm:scroll-mt-36 sm:py-10"
    >
      <Container>
        <div className="glass-dark relative overflow-hidden rounded-[2rem] px-5 pb-12 pt-14 text-paper sm:px-10 sm:pb-16 sm:pt-16 lg:px-14">
          <div className="relative">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-paper/55">
              Own warehouses · not a broker · China hub in Xiamen &amp; Dubai
            </p>
            <h2 id="three-pl-heading" className="mt-3 max-w-4xl">
              <span className="block font-display text-[3.75rem] font-semibold leading-[0.88] tracking-tight text-accent sm:text-[6.5rem] lg:text-[7.5rem]">
                {fulfillment.eyebrow}
              </span>
              <span className="mt-5 block font-display text-3xl font-semibold tracking-tight text-paper sm:mt-6 sm:text-5xl">
                {fulfillment.title}
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-paper/70 sm:text-lg">{fulfillment.description}</p>

            <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
              {fulfillmentSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex shrink-0 items-center gap-2"
                >
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-paper">
                    {step.title}
                  </span>
                  {i < fulfillmentSteps.length - 1 ? (
                    <span className="text-paper/40" aria-hidden>
                      →
                    </span>
                  ) : null}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {fulfillmentSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-dark-card rounded-[1.35rem] p-5 sm:p-6"
                >
                  <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-paper">
                    3PL {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/65">{step.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {fulfillmentHubs.map((hub, i) => (
                <motion.div
                  key={hub.city}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + i * 0.04 }}
                  className="glass-dark-solid rounded-[1.35rem] px-5 py-5 sm:px-6 sm:py-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{hub.role}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">
                    {hub.city}
                    <span className="text-muted"> · {hub.country}</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{hub.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <h3 className="font-display text-2xl font-semibold text-paper">
                3PL questions importers ask
              </h3>
              <dl className="mt-5 grid gap-3 lg:grid-cols-2">
                {fulfillmentFaqs.map((item) => (
                  <div
                    key={item.q}
                    className="glass-dark-card rounded-[1.35rem] p-5 sm:p-6"
                  >
                    <dt className="font-display text-lg font-semibold text-paper">{item.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-paper/70" data-seo-answer>
                      {item.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/3pl"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Warehouse className="h-4 w-4" aria-hidden />
                3PL warehouses
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/logistics"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-white/15"
              >
                Freight lanes and customs
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
