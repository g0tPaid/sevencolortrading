"use client";

import { growthCopy } from "@/lib/factory-growth";
import { useFactoryGrowthUi } from "./locale-context";

/** Decorative English factory site for international buyers — no fake stats, awards, or testimonials. */
export function FactoryWebsiteMockup() {
  const { t, lang } = useFactoryGrowthUi();

  const nav =
    lang === "zh"
      ? ["工厂", "产品", "能力", "联系"]
      : ["Factory", "Products", "Capability", "Contact"];
  const headline =
    lang === "zh" ? "面向国际买家的制造能力" : "Manufacturing built for international buyers";
  const sub =
    lang === "zh"
      ? "产品页只展示工厂提供的真实规格与照片。"
      : "Product pages show only the factory’s own specs and photographs.";
  const products =
    lang === "zh"
      ? ["产品系列 A", "产品系列 B", "产品系列 C"]
      : ["Product family A", "Product family B", "Product family C"];

  return (
    <div className="glass-panel relative overflow-hidden rounded-[1.75rem] p-3 sm:p-4">
      <div className="rounded-[1.25rem] border border-line bg-paper-elevated shadow-inner">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="ml-2 truncate font-mono text-[10px] text-muted">
            your-factory.com
          </span>
        </div>
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              Factory
            </p>
            <ul className="hidden gap-3 text-[11px] text-muted sm:flex">
              {nav.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="mt-4 font-display text-xl font-semibold leading-tight text-ink sm:text-2xl">
            {headline}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">{sub}</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {products.map((name, i) => (
              <div key={name} className="overflow-hidden rounded-xl border border-line bg-white/70">
                <div
                  className="h-12 sm:h-16"
                  style={{
                    background:
                      i === 0
                        ? "linear-gradient(135deg, rgba(214,0,0,0.12), rgba(15,23,42,0.06))"
                        : i === 1
                          ? "linear-gradient(135deg, rgba(15,23,42,0.08), rgba(214,0,0,0.05))"
                          : "linear-gradient(160deg, rgba(15,23,42,0.05), rgba(214,0,0,0.1))",
                  }}
                  aria-hidden
                />
                <p className="px-2 py-1.5 text-[10px] text-ink">{name}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted">
            <span className="glass-chip rounded-full px-2 py-1">WhatsApp</span>
            <span className="glass-chip rounded-full px-2 py-1">Email</span>
            <span className="glass-chip rounded-full px-2 py-1">WeChat</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted">{t(growthCopy.concept)}</p>
    </div>
  );
}
