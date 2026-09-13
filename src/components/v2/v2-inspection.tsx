"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ClipboardCheck } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { inspection, inspectionPrice, inspectionServices } from "@/lib/v2-content";
import { whatsappHref, whatsappPresets } from "@/lib/whatsapp";

export function V2Inspection() {
  return (
    <section
      id="inspection"
      aria-labelledby="inspection-heading"
      className="scroll-mt-32 py-8 sm:scroll-mt-36 sm:py-10"
    >
      <Container>
        <div className="glass-dark relative overflow-hidden rounded-[2rem] px-5 pb-12 pt-14 text-paper sm:px-10 sm:pb-16 sm:pt-16 lg:px-14">
          <div className="relative">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-paper/55">
              On the ground in China · not remote-only
            </p>
            <h2 id="inspection-heading" className="mt-3 max-w-4xl">
              <span className="block font-display text-[3.75rem] font-semibold leading-[0.88] tracking-tight text-accent sm:text-[6.5rem] lg:text-[7.5rem]">
                {inspection.eyebrow}
              </span>
              <span className="mt-5 block font-display text-3xl font-semibold tracking-tight text-paper sm:mt-6 sm:text-5xl">
                {inspection.title}
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-paper/70 sm:text-lg">{inspection.description}</p>

            <div className="glass-dark-solid mt-6 inline-flex flex-col gap-1 rounded-[1.35rem] px-5 py-4 sm:flex-row sm:items-baseline sm:gap-4 sm:px-6 sm:py-5">
              <p className="font-display text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
                USD 110
              </p>
              <div>
                <p className="font-display text-xl font-semibold text-paper">{inspectionPrice.period}</p>
                <p className="mt-0.5 text-sm text-paper/65">{inspectionPrice.note}</p>
              </div>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {inspectionServices.map((item, i) => (
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
                  <p className="mt-2 text-sm leading-relaxed text-paper/65">{item.text}</p>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappHref(whatsappPresets.inspection)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                WhatsApp inspection
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <Link
                href="/inspection"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-white/15"
              >
                <ClipboardCheck className="h-4 w-4" aria-hidden />
                Inspection services
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
