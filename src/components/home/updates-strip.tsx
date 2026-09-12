import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { homepageUpdates } from "@/lib/updates";

export function UpdatesStrip() {
  return (
    <section className="pb-2 pt-2 sm:pb-4" aria-labelledby="updates-strip-heading">
      <Container>
        <div className="glass-card rounded-[1.5rem] px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                Updates
              </p>
              <h2 id="updates-strip-heading" className="sr-only">
                Desk updates
              </h2>
            </div>
            <Link
              href="/updates"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-ink"
            >
              All updates
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {homepageUpdates.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex flex-col gap-1 py-2.5 text-sm transition hover:text-accent sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <time
                    dateTime={item.iso}
                    className="shrink-0 font-mono text-[11px] text-muted sm:w-24"
                  >
                    {item.date}
                  </time>
                  <span className="font-medium text-ink">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
