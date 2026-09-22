"use client";

import { useMemo, useState } from "react";
import { WORLD_LAND_PATH } from "@/components/home/world-land-path";
import { countryLabel, countryMapPoint, flagEmoji } from "@/lib/analytics-geo";
import type { CountryStat } from "@/lib/analytics-store";
import { cn } from "@/lib/utils";

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

export function VisitorWorldMap({ countries }: { countries: CountryStat[] }) {
  const [hover, setHover] = useState<string | null>(null);

  const points = useMemo(() => {
    const max = Math.max(1, ...countries.map((row) => row.visits));
    return countries
      .map((row) => {
        const point = countryMapPoint(row.code);
        if (!point) return null;
        const t = Math.sqrt(row.visits / max);
        return {
          ...row,
          x: point.x,
          y: point.y,
          r: 4 + t * 18,
          opacity: 0.35 + t * 0.55,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .sort((a, b) => b.visits - a.visits);
  }, [countries]);

  const active = points.find((row) => row.code === hover) ?? null;
  const totalVisits = countries.reduce((sum, row) => sum + row.visits, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="relative">
        <svg
          viewBox="0 0 1000 500"
          className="h-auto w-full"
          role="img"
          aria-label="Visitor countries on a world map"
        >
          <rect width="1000" height="500" className="fill-canvas" />
          <path d={WORLD_LAND_PATH} className="fill-ink/15 dark:fill-ink/20" />
          {points.map((row) => (
            <g key={row.code}>
              <circle
                cx={row.x}
                cy={row.y}
                r={row.r + 6}
                className="pointer-events-none fill-accent/10"
                style={{ opacity: hover === row.code ? 1 : 0 }}
              />
              <circle
                cx={row.x}
                cy={row.y}
                r={row.r}
                className="fill-accent stroke-paper"
                strokeWidth={1.5}
                style={{ opacity: row.opacity }}
                onMouseEnter={() => setHover(row.code)}
                onMouseLeave={() => setHover((current) => (current === row.code ? null : current))}
                onFocus={() => setHover(row.code)}
                onBlur={() => setHover((current) => (current === row.code ? null : current))}
                tabIndex={0}
                role="img"
                aria-label={`${countryLabel(row.code)}: ${formatCount(row.visits)} visits`}
              />
            </g>
          ))}
        </svg>

        {active ? (
          <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-line bg-paper-elevated/95 px-3 py-2 text-sm shadow-sm">
            <p className="font-medium text-ink">
              <span className="mr-1.5" aria-hidden>
                {flagEmoji(active.code)}
              </span>
              {countryLabel(active.code)}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {formatCount(active.visits)} visits · {formatCount(active.pageviews)} views
            </p>
          </div>
        ) : countries.length === 0 ? (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">
            No country data for this range.
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2 text-xs text-muted">
        <span>{formatCount(totalVisits)} visits plotted</span>
        <span className={cn("inline-flex items-center gap-2")}>
          Fewer
          <span className="inline-flex h-2 w-16 overflow-hidden rounded-full bg-accent/20">
            <span className="h-full w-full bg-gradient-to-r from-accent/30 to-accent" />
          </span>
          More
        </span>
      </div>
    </div>
  );
}
