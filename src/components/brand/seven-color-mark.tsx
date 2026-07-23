import Image from "next/image";
import { cn } from "@/lib/utils";

/** Neon-red geometric 7 on black — Seven Color mark */
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
    <Image
      src="/seven-color-mark.png"
      alt={title}
      width={size}
      height={size}
      className={cn(
        "shrink-0 rounded-[6px] bg-black object-contain shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-black/30",
        className,
      )}
      priority
      unoptimized
    />
  );
}
