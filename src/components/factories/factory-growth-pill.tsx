import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GROWTH_PATH } from "@/lib/factory-growth";
import { cn } from "@/lib/utils";

/** Optional factory-growth chip. Never presented as a condition of free vendor registration. */
export function FactoryGrowthPill({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1.5", className)}>
      <Link
        href={GROWTH_PATH}
        className="glass-chip inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
      >
        <span>Factory growth</span>
        <span className="text-muted">·</span>
        <span lang="zh-CN">工厂国际形象</span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
      </Link>
      <p className="text-xs leading-snug text-muted">
        Optional · 可选 · 登记仍免费
      </p>
    </div>
  );
}
