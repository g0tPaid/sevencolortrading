"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { ideationDemo } from "@/lib/v2-content";

export function V2Ideation() {
  const [value, setValue] = useState<string>(ideationDemo.input);
  const [ran, setRan] = useState(true);

  return (
    <section id="ideation" className="scroll-mt-28 border-y border-line bg-paper-elevated py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Product ideation
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            From brand idea to manufacturable SKU
          </h2>
          <p className="mt-4 text-muted sm:text-lg">
            Describe what you want to build. The platform returns products, costs, regions, and
            logistics — before you talk to a factory.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="glass-card rounded-[1.75rem] p-5 sm:p-7">
            <label htmlFor="idea-input" className="text-sm font-medium text-muted">
              Your idea
            </label>
            <textarea
              id="idea-input"
              rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-2 w-full resize-none rounded-2xl border border-line bg-paper px-4 py-3 text-ink outline-none ring-accent focus:ring-2"
            />
            <button
              type="button"
              onClick={() => setRan(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Sparkles className="h-4 w-4" /> Generate plan
            </button>
          </div>

          {ran ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 grid gap-4 sm:grid-cols-2"
            >
              {[
                ["Recommended products", ideationDemo.products.join(" · ")],
                ["Estimated costs", ideationDemo.costs],
                ["Manufacturing regions", ideationDemo.regions],
                ["MOQ", ideationDemo.moq],
                ["Margins", ideationDemo.margins],
                ["Shipping estimate", ideationDemo.shipping],
              ].map(([label, val], i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
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
      </Container>
    </section>
  );
}
