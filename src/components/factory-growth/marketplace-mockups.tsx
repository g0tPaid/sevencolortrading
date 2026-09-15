"use client";

import { growthCopy } from "@/lib/factory-growth";
import { useFactoryGrowthUi } from "./locale-context";

function ListingCard({
  channel,
  title,
  spec,
  price,
  note,
}: {
  channel: string;
  title: string;
  spec: string;
  price: string;
  note: string;
}) {
  return (
    <article className="glass-card rounded-[1.35rem] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">{channel}</p>
      <div className="mt-3 flex gap-3">
        <div
          className="h-16 w-16 shrink-0 rounded-xl border border-line"
          style={{
            background: "linear-gradient(145deg, rgba(15,23,42,0.06), rgba(214,0,0,0.08))",
          }}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{title}</p>
          <p className="mt-1 text-xs text-muted">{spec}</p>
          <p className="mt-2 font-mono text-[11px] text-muted">{price}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">{note}</p>
    </article>
  );
}

/** Generic listing frames. No Amazon/eBay logos or affiliation marks. */
export function MarketplaceMockups() {
  const { t, lang } = useFactoryGrowthUi();
  const note =
    lang === "zh"
      ? "仅示意结构，不是官方后台，也不使用平台商标。"
      : "Structural mockup only, not an official console, and no marketplace marks.";
  const title = lang === "zh" ? "标题来自工厂资料" : "Title from factory files";
  const spec = lang === "zh" ? "型号 · 仅工厂提供的规格" : "SKU · factory-supplied specs only";
  const price = lang === "zh" ? "价格面议" : "Price on request";

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <ListingCard
          channel={lang === "zh" ? "平台示意 · 美国站" : "Marketplace A · US"}
          title={title}
          spec={spec}
          price={price}
          note={note}
        />
        <ListingCard
          channel={lang === "zh" ? "平台示意 · 跨境店铺" : "Marketplace B"}
          title={title}
          spec={spec}
          price={price}
          note={note}
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">{t(growthCopy.marketDisclaimer)}</p>
    </div>
  );
}
