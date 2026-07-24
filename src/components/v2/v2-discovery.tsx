"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { discoveryFilters, trendingProducts } from "@/lib/v2-content";

export function V2Discovery() {
  const [active, setActive] = useState<string>(discoveryFilters[0]);

  return (
    <section id="discovery" className="scroll-mt-28 py-24 sm:py-32">
      <Container>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Product discovery
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Find what&apos;s worth making
          </h2>
          <p className="mt-4 text-muted sm:text-lg">
            Signal over catalog noise — growth, margin, MOQ, and lead time at a glance.
          </p>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {discoveryFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                active === f
                  ? "bg-ink text-paper dark:bg-accent"
                  : "border border-line text-muted hover:text-ink",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trendingProducts.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className="glass-card overflow-hidden rounded-[1.75rem]"
            >
              <div className="relative h-48 overflow-hidden sm:h-52">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority={i < 3}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    {p.tag}
                  </span>
                  <span className="text-sm font-semibold text-emerald-300">{p.growth}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-ink">{p.name}</h3>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted">MOQ</dt>
                    <dd className="mt-0.5 font-medium text-ink">{p.moq}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Factory price</dt>
                    <dd className="mt-0.5 font-medium text-ink">{p.price}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted">Lead time</dt>
                    <dd className="mt-0.5 font-medium text-ink">{p.lead}</dd>
                  </div>
                </dl>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
