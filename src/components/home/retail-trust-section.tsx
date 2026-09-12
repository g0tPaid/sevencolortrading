"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";

export function RetailTrustSection() {
  const { credentials } = company;

  return (
    <section className="border-y border-line bg-paper-elevated py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-start gap-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E31C23]">
              Credentials
            </p>
            <div className="flex items-center gap-4">
              <Image
                src="/dun-bradstreet.png"
                alt="Dun & Bradstreet"
                width={88}
                height={76}
                className="h-[76px] w-auto object-contain"
                unoptimized
              />
              <div>
                <p className="font-display text-2xl font-semibold text-ink">
                  Dun &amp; Bradstreet
                </p>
                <p className="mt-1 text-sm font-medium text-[#9B1B2E] dark:text-[#E85A6A]">
                  Registered company
                </p>
                <p className="mt-1 font-mono text-sm text-muted">
                  DUNS {credentials.dunsNumber}
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Verified business identity for global trade — the trust layer buyers and retailers
              look for before they commit.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
              Products you&apos;ve already seen on the shelf
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              {credentials.shelfNote}
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink sm:text-lg">
              We&apos;re a{" "}
              <span className="font-semibold">registered vendor</span> for major retailers
              including{" "}
              <span className="font-semibold">Walmart</span>,{" "}
              <span className="font-semibold">Target</span>, and more — plus the sourcing desk
              behind countless SKUs that land in big-box aisles worldwide.
            </p>

            <p className="mt-8 text-sm font-semibold tracking-wide text-ink sm:text-base">
              {credentials.retailVendors.join("  ·  ")}
            </p>
            <p className="mt-3 text-xs text-muted">{credentials.retailNote}</p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
