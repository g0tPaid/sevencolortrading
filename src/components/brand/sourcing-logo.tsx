import Image from "next/image";
import { cn } from "@/lib/utils";

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
 * Official sourcing.center wordmark:
 * "sourcing" — bold black serif with red tittle on the i
 * ".center" — smaller maroon sans underneath
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

  const markSize = size === "hero" ? 18 : 14;

  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <span
        className={cn(
          "font-logo font-bold tracking-[-0.02em]",
          onDark ? "text-white" : "text-ink",
          sourcing,
        )}
      >
        sourc
        <span className="relative inline-block">
          {/* Dotless i so we can place the brand red tittle */}
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
      {showByline ? (
        <span
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 text-center font-sans font-medium",
            onDark ? "text-white/60" : "text-muted",
            size === "hero" ? "text-sm sm:text-base" : "text-[10px]",
          )}
        >
          by
          <Image
            src="/seven-color-badge.svg"
            alt=""
            width={markSize}
            height={markSize}
            className="inline-block rounded-[3px]"
            aria-hidden
          />
          <span>Seven Color Trading Co Ltd · China</span>
        </span>
      ) : null}
      <span className="sr-only">sourcing.center</span>
    </span>
  );
}
