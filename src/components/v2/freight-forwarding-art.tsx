import { SpectrumRail } from "@/components/ui/primitives";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Lucide warehouse / plane / train-front / ship / map-pin paths, one scene. */
export function FreightForwardingArt() {
  return (
    <figure className="mx-auto mt-8 w-full max-w-3xl sm:mt-10">
      <div className="glass-panel relative overflow-hidden rounded-[2rem] px-4 py-8 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-70" aria-hidden />
        <div className="relative">
          <SpectrumRail className="mx-auto mb-6 w-16 sm:mb-8" />
          <svg
            viewBox="0 0 680 268"
            className="mx-auto block h-auto w-full text-ink"
            role="img"
            aria-labelledby="freight-art-title freight-art-desc"
          >
            <title id="freight-art-title">Freight lanes from Xiamen</title>
            <desc id="freight-art-desc">
              A warehouse in Xiamen connected to a destination by three parallel lanes: air, rail, and sea.
            </desc>
            <ellipse cx="340" cy="132" rx="78" ry="118" style={{ fill: "var(--accent-soft)" }} />

            <g className="text-muted" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <line x1="112" y1="52" x2="300" y2="52" />
              <line x1="380" y1="52" x2="548" y2="52" />
              <line x1="112" y1="132" x2="300" y2="132" />
              <line x1="380" y1="132" x2="548" y2="132" />
              <line x1="112" y1="212" x2="300" y2="212" />
              <line x1="380" y1="212" x2="548" y2="212" />
            </g>
            <g className="text-accent" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M536 44 L548 52 L536 60" />
              <path d="M536 124 L548 132 L536 140" />
              <path d="M536 204 L548 212 L536 220" />
            </g>

            <g transform="translate(28 104) scale(2.35)" {...stroke}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z" />
              <path d="M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11" />
              <path d="M6 13h12" />
              <path d="M6 17h12" />
            </g>

            <g transform="translate(316 31) scale(1.75)" className="text-ink" {...stroke}>
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </g>

            <g transform="translate(316 111) scale(1.75)" className="text-ink" {...stroke}>
              <path d="M8 3.1V7a4 4 0 0 0 8 0V3.1" />
              <path d="m9 15-1-1" />
              <path d="m15 15 1-1" />
              <path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" />
              <path d="m8 19-2 3" />
              <path d="m16 19 2 3" />
            </g>

            <g transform="translate(316 191) scale(1.75)" className="text-ink" {...stroke}>
              <path d="M12 10.189V14" />
              <path d="M12 2v3" />
              <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
              <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76" />
              <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            </g>

            <g transform="translate(588 108) scale(2.15)" className="text-ink" {...stroke}>
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" className="fill-accent stroke-accent" />
            </g>
          </svg>
          <figcaption className="mt-2 text-center text-sm text-muted sm:mt-4">
            Air, rail, or sea from the Xiamen warehouse to the destination you name.
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
