import Image from "next/image";
import { cn } from "@/lib/utils";

/** Official Seven Color mark — red geometric 7 on transparent / white */
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
      src="/seven-color-mark-clear.png"
      alt={title}
      width={size}
      height={size}
      className={cn("shrink-0 bg-transparent object-contain", className)}
      priority
      unoptimized
    />
  );
}
