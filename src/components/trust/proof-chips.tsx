import { cn } from "@/lib/utils";
import { proofChips } from "@/lib/proof";

export function ProofChips({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        className,
      )}
      aria-label="Trust signals"
    >
      {proofChips.map((chip) => (
        <li
          key={chip.label}
          className={cn(
            "rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide sm:text-xs",
            tone === "dark"
              ? "border border-white/15 bg-white/10 text-paper/90"
              : "glass-chip text-ink",
          )}
          title={chip.detail}
        >
          {chip.label}
        </li>
      ))}
    </ul>
  );
}
