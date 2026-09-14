"use client";

import { growthCopy } from "@/lib/factory-growth";
import { cn } from "@/lib/utils";
import { useFactoryGrowthUi } from "./locale-context";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useFactoryGrowthUi();

  return (
    <div
      role="group"
      aria-label={t(growthCopy.langAria)}
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-white/70 p-1 text-xs font-semibold tracking-wide shadow-sm backdrop-blur-md",
        className,
      )}
    >
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
        className={cn(
          "rounded-full px-3 py-1.5 transition",
          lang === "en" ? "bg-ink text-paper" : "text-muted hover:text-ink",
        )}
      >
        {growthCopy.langEn}
      </button>
      <span className="px-1 text-muted/50" aria-hidden>
        |
      </span>
      <button
        type="button"
        aria-pressed={lang === "zh"}
        lang="zh-CN"
        onClick={() => setLang("zh")}
        className={cn(
          "rounded-full px-3 py-1.5 transition",
          lang === "zh" ? "bg-ink text-paper" : "text-muted hover:text-ink",
        )}
      >
        {growthCopy.langZh}
      </button>
    </div>
  );
}
