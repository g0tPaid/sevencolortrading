"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileLock2, Lightbulb, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import {
  ideaPathSteps,
  ideationDemo,
  newProductDemo,
} from "@/lib/v2-content";

type Mode = "catalog" | "new";

export function V2Ideation() {
  const [mode, setMode] = useState<Mode>("new");
  const [value, setValue] = useState<string>(newProductDemo.input);
  const [ran, setRan] = useState(true);

  function switchMode(next: Mode) {
    setMode(next);
    setValue(next === "new" ? newProductDemo.input : ideationDemo.input);
    setRan(true);
  }

  const catalogRows: [string, string][] = [
    ["Recommended products", ideationDemo.products.join(" · ")],
    ["Estimated costs", ideationDemo.costs],
    ["Manufacturing regions", ideationDemo.regions],
    ["MOQ", ideationDemo.moq],
    ["Margins", ideationDemo.margins],
    ["Shipping estimate", ideationDemo.shipping],
  ];

  const newRows: [string, string][] = [
    ["Concept brief", newProductDemo.concept],
    ["IP protection", newProductDemo.protection],
    ["Development path", newProductDemo.development],
    ["Sampling", newProductDemo.sampling],
    ["Manufacturing regions", newProductDemo.regions],
    ["Estimated costs", newProductDemo.costs],
    ["MOQ", newProductDemo.moq],
    ["Shipping estimate", newProductDemo.shipping],
  ];

  const rows = mode === "new" ? newRows : catalogRows;

  return (
    <section id="ideation" className="scroll-mt-28 border-y border-line bg-white py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Product ideation
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Existing products — or a brand-new invention
          </h2>
          <p className="mt-4 text-muted sm:text-lg">
            Already know the SKU? We match factories. Have something never made before? We protect
            it under NDA, develop it, sample it, and source it from China.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-md justify-center gap-2 rounded-full border border-line bg-paper p-1.5">
          <button
            type="button"
            onClick={() => switchMode("new")}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              mode === "new" ? "bg-ink text-paper dark:bg-accent" : "text-muted hover:text-ink"
            }`}
          >
            <Lightbulb className="h-4 w-4" aria-hidden />
            New product idea
          </button>
          <button
            type="button"
            onClick={() => switchMode("catalog")}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              mode === "catalog" ? "bg-ink text-paper dark:bg-accent" : "text-muted hover:text-ink"
            }`}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Brand / catalog
          </button>
        </div>

        <div id="new-idea" className="mx-auto mt-10 max-w-3xl scroll-mt-28">
          <div className="glass-card rounded-[1.75rem] p-5 sm:p-7">
            {mode === "new" ? (
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-ink">
                <FileLock2 className="h-3.5 w-3.5 text-accent" aria-hidden />
                NDAs signed before any factory sees your brief
              </p>
            ) : null}
            <label htmlFor="idea-input" className="text-sm font-medium text-muted">
              {mode === "new" ? "Describe your new product idea" : "Describe the brand or category"}
            </label>
            <textarea
              id="idea-input"
              rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                mode === "new"
                  ? "I invented a… / I want to create a product that…"
                  : "I want to start a skincare brand."
              }
              className="mt-2 w-full resize-none rounded-2xl border border-line bg-paper px-4 py-3 text-ink outline-none ring-accent focus:ring-2"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setRan(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Sparkles className="h-4 w-4" />
                {mode === "new" ? "Map development path" : "Generate plan"}
              </button>
              <Link
                href="#rfq"
                className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink"
              >
                {mode === "new" ? "Bring my idea to life" : "Talk to the desk"}
              </Link>
            </div>
          </div>

          {ran ? (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 grid gap-4 sm:grid-cols-2"
            >
              {rows.map(([label, val], i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="glass-card rounded-2xl p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-ink">{val}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </div>

        {mode === "new" ? (
          <div className="mx-auto mt-16 max-w-5xl">
            <h3 className="text-center font-display text-2xl font-semibold text-ink sm:text-3xl">
              Do you have a product idea? Let&apos;s bring it to life.
            </h3>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ideaPathSteps.map((step, i) => (
                <motion.li
                  key={step.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06 }}
                >
                  <p className="font-mono text-xs text-accent">{step.n}</p>
                  <h4 className="mt-3 font-display text-lg font-semibold text-ink">{step.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                </motion.li>
              ))}
            </ol>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="#rfq"
                className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper dark:bg-accent"
              >
                Bring my idea to life
              </Link>
              <Link
                href="/oem-odm"
                className="inline-flex rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink"
              >
                OEM / ODM path
              </Link>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
