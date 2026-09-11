"use client";

import { motion } from "framer-motion";
import { ButtonLink, Container } from "@/components/ui/primitives";

const steps = [
  {
    n: "01",
    title: "Share the idea (NDAs signed)",
    text: "A sketch, a sample photo, or just a sentence — protected under NDA before we open the brief.",
  },
  {
    n: "02",
    title: "Shape the design",
    text: "Materials, sizing, packaging, and cost targets — refined with factories that can actually build it.",
  },
  {
    n: "03",
    title: "Prototype & source",
    text: "Samples first. Verified makers. No MOQ games — start small, scale when it’s right.",
  },
  {
    n: "04",
    title: "Prove & ship",
    text: "Photo and video QC before anything leaves China. Then freight to your door.",
  },
] as const;

export function ProductIdeaSection() {
  return (
    <section id="idea-path" className="relative scroll-mt-28 overflow-hidden border-y border-line py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 10% 20%, rgba(227,28,35,0.08), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(15,118,110,0.10), transparent 50%)",
        }}
      />
      <Container className="relative">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E31C23]">
            Idea to product
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Do you have a product idea?
            <span className="mt-2 block text-[#9B1B2E] dark:text-[#E85A6A]">
              Let&apos;s bring it to life.
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Think of us as your{" "}
            <span className="font-semibold text-ink">central command for sourcing from China</span>
            . One desk for ideas, design, factories, QC, and shipping — so you don&apos;t juggle
            ten chats and guesswork.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="relative"
            >
              <p className="font-mono text-xs text-[#E31C23]">{step.n}</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              {i < steps.length - 1 ? (
                <span
                  className="absolute -right-3 top-8 hidden h-px w-6 bg-line lg:block"
                  aria-hidden
                />
              ) : null}
            </motion.li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#rfq">Bring my idea to life</ButtonLink>
          <ButtonLink href="/oem-odm" variant="secondary">
            OEM / ODM path
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
