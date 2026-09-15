"use client";

import { newsCopy } from "@/lib/news";
import { cn } from "@/lib/utils";
import { useNewsUi } from "./locale-context";

export function NewsLanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useNewsUi();

  return (
    <div
      role="group"
      aria-label={t(newsCopy.langAria)}
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
        {newsCopy.langEn}
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
        {newsCopy.langZh}
      </button>
    </div>
  );
}
