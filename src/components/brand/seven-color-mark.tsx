import { cn } from "@/lib/utils";

/** Neon-red geometric 7 on black — Seven Color mark */
export function SevenColorMark({
  className,
  size = 28,
  title = "Seven Color",
}: {
  className?: string;
  size?: number;
  title?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("shrink-0 rounded-[4px] shadow-sm ring-1 ring-black/20", className)}
      role="img"
      aria-label={title}
    >
      <rect width="100" height="100" rx="12" fill="#0A0A0A" />
      <path
        fill="#FF0040"
        d="M14 16h64v14H44L26 76H12L32 30h46V16H14zm56 14L50 76h13l20-46H70z"
      />
      <path fill="#FF0040" d="M22 78l11-9 7 9-11 11-7-11z" />
    </svg>
  );
}
