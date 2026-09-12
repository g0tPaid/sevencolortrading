import { cn } from "@/lib/utils";

/** Official Seven Color mark — red geometric 7 on Apple-style glass. */
export function SevenColorMark({
  className,
  size = 40,
  title = "Seven Color",
}: {
  className?: string;
  size?: number;
  title?: string;
}) {
  return (
    <span
      className={cn("logo-glass relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/seven-color-mark-clear.svg"
        alt={title}
        width={size}
        height={size}
        className="relative z-[1] h-[78%] w-[78%] object-contain"
      />
    </span>
  );
}
