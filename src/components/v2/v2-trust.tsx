"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { platformStats } from "@/lib/v2-content";

export function V2Trust() {
  return (
    <section id="trust" className="section-y scroll-mt-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Trust</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Sourcing.center {company.byline}
          </h2>
          <p className="mt-4 text-muted sm:text-lg">
            {company.legalNameFull}. {company.history} China hub in Xiamen and a Dubai / Al Ain
            warehouse.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4 sm:mt-10">
          {platformStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center"
            >
              <p className="font-display text-4xl font-semibold text-ink sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2">
          {company.offices.map((o) => (
            <div key={o.city} className="glass-card rounded-[1.5rem] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {o.role}
              </p>
              <p className="mt-2 font-display text-xl font-semibold text-ink">
                {o.city}, {o.country}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{o.address}</p>
              <p className="mt-3 font-mono text-xs text-muted">License {o.license}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {company.locations.map((loc) => (
            <a
              key={loc.phone}
              href={loc.href}
              className="glass-card rounded-[1.5rem] px-5 py-4 transition hover:border-accent/30"
            >
              <p className="font-mono text-base font-semibold text-ink">{loc.phone}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">{loc.label}</p>
            </a>
          ))}
        </div>

        <div className="glass-card mx-auto mt-10 max-w-3xl rounded-[1.75rem] p-6 sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Image
              src="/dun-bradstreet.png"
              alt="Dun & Bradstreet"
              width={72}
              height={62}
              className="h-[62px] w-auto object-contain"
              unoptimized
            />
            <div>
              <p className="font-display text-xl font-semibold text-ink">
                {company.credentials.dunBradstreet}
              </p>
              <p className="mt-1 font-mono text-sm text-muted">
                DUNS {company.credentials.dunsNumber}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {company.credentials.shelfNote}
              </p>
              <p className="mt-2 text-sm text-ink">
                Registered Vendor Pathways for{" "}
                {company.credentials.retailVendors.slice(0, 3).join(", ")} and more.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted">
                {company.credentials.licenses.map((lic) => (
                  <li key={lic.number}>
                    <span className="font-medium text-ink">{lic.region}</span>
                    {" · "}
                    <span className="font-mono">
                      {lic.kind} {lic.number}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Chinese factory looking to supply our buyers?{" "}
          <Link href="/factories/register" className="font-medium text-ink underline-offset-4 hover:underline">
            Factory registration
          </Link>
          <span className="text-muted"> · 工厂登记</span>
        </p>
      </Container>
    </section>
  );
}
