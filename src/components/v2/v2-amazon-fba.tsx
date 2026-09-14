"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, PackageCheck } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { amazonFba, amazonFbaFaqs, amazonFbaSteps } from "@/lib/v2-content";
import { whatsappHref, whatsappPresets } from "@/lib/whatsapp";

export function V2AmazonFba() {
  return (
    <section
      id="amazon-fba"
      aria-labelledby="amazon-fba-heading"
      className="scroll-mt-32 py-8 sm:scroll-mt-36 sm:py-10"
    >
      <Container>
        <div className="glass-dark relative overflow-hidden rounded-[2rem] px-5 pb-12 pt-14 text-paper sm:px-10 sm:pb-16 sm:pt-16 lg:px-14">
          <div className="relative">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-paper/70">
              Private label from China · not an Amazon partner
            </p>
            <h2 id="amazon-fba-heading" className="mt-3 max-w-4xl">
              <span className="block font-display text-[3.75rem] font-semibold leading-[0.88] tracking-tight text-accent sm:text-[6.5rem] lg:text-[7.5rem]">
                {amazonFba.eyebrow}
              </span>
              <span className="mt-5 block font-display text-3xl font-semibold tracking-tight text-paper sm:mt-6 sm:text-5xl">
                {amazonFba.title}
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-paper/80 sm:text-lg">{amazonFba.description}</p>

            <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
              {amazonFbaSteps.map((step, i) => (
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
                  {i < amazonFbaSteps.length - 1 ? (
                    <span className="text-paper/40" aria-hidden>
                      →
                    </span>
                  ) : null}
                </motion.div>
              ))}
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {amazonFbaSteps.map((item, i) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-dark-card rounded-[1.35rem] p-5 sm:p-6"
                >
                  <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-paper">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/80">{item.text}</p>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10">
              <h3 className="font-display text-2xl font-semibold text-paper">
                Amazon FBA questions brands ask
              </h3>
              <dl className="mt-5 grid gap-3 lg:grid-cols-2">
                {amazonFbaFaqs.slice(0, 4).map((item) => (
                  <div key={item.q} className="glass-dark-card rounded-[1.35rem] p-5 sm:p-6">
                    <dt className="font-display text-lg font-semibold text-paper">{item.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-paper/80" data-seo-answer>
                      {item.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappHref(whatsappPresets.amazonFba)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                WhatsApp Amazon FBA
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <Link
                href="/amazon-fba"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-white/15"
              >
                <PackageCheck className="h-4 w-4" aria-hidden />
                Amazon FBA private label
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/oem-odm"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-white/15"
              >
                OEM / ODM
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
