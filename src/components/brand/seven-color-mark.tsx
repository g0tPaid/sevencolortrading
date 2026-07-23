import Image from "next/image";
import { cn } from "@/lib/utils";

/** Official Seven Color mark — red geometric 7 on black */
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
      className={cn("shrink-0 rounded-[6px] object-contain", className)}
      priority
      unoptimized
    />
  );
}
