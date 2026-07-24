import { cn } from "@/lib/utils";
import { SevenColorMark } from "@/components/brand/seven-color-mark";

type SourcingLogoProps = {
  className?: string;
  /** Compact for nav; hero for first viewport brand */
  size?: "nav" | "hero" | "footer";
  /** Show Seven Color byline under the mark */
  showByline?: boolean;
  /** Light wordmark for dark backgrounds (e.g. footer) */
  onDark?: boolean;
};

/**
 * Official sourcing.center wordmark + Seven Color 7 mark.
 */
export function SourcingLogo({
  className,
  size = "nav",
  showByline = false,
  onDark = false,
}: SourcingLogoProps) {
  const sourcing =
    size === "hero"
      ? "text-[2.75rem] sm:text-6xl md:text-7xl"
      : size === "footer"
        ? "text-3xl"
        : "text-[1.35rem] sm:text-xl";

  const center =
    size === "hero"
      ? "mt-1 text-base tracking-[0.18em] sm:mt-1.5 sm:text-lg"
      : size === "footer"
        ? "mt-0.5 text-sm tracking-[0.16em]"
        : "mt-0.5 text-[10px] tracking-[0.14em] sm:text-[11px]";

  const byMark = size === "hero" ? 28 : 22;

  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className="inline-flex flex-col items-start leading-none">
        <span
          className={cn(
            "font-logo font-bold tracking-[-0.02em]",
            onDark ? "text-white" : "text-ink",
            sourcing,
          )}
        >
          sourc
          <span className="relative inline-block">
            ı
            <span
              className="absolute left-1/2 top-[0.06em] h-[0.22em] w-[0.22em] -translate-x-1/2 rounded-full bg-[#E31C23]"
              aria-hidden
            />
          </span>
          ng
        </span>
        <span
          className={cn(
            "font-sans font-medium",
            onDark ? "text-[#E85A6A]" : "text-[#9B1B2E] dark:text-[#E85A6A]",
            center,
          )}
        >
          .center
        </span>
      </span>

      {showByline ? (
        <span
          className={cn(
            "mt-4 inline-flex items-center gap-2 font-sans font-medium",
            onDark ? "text-white/70" : "text-ink-soft",
            size === "hero" ? "text-sm sm:text-base" : "text-xs",
          )}
        >
          <span>by</span>
          <SevenColorMark size={byMark} />
          <span>Seven Color Trading · China</span>
        </span>
      ) : null}

      <span className="sr-only">sourcing.center by Seven Color</span>
    </span>
  );
}
