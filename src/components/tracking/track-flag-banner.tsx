"use client";

import { useState } from "react";
import { TRACK_BLESSING, TRACK_FLAGS } from "@/lib/tracking/flag-banner";

/** Flag strip and blessing under the idle ad. Hidden with that ad during lookup. */
export function TrackFlagBanner() {
  const [paused, setPaused] = useState(false);
  const [before, after] = TRACK_BLESSING.split("China");

  return (
    <div className="track-flag-banner mt-4" data-testid="track-flag-banner">
      <div className="mb-2 flex items-center justify-end">
        <button
          type="button"
          className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d60000] focus-visible:ring-offset-2"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? "Play flags" : "Pause flags"}
        </button>
      </div>
      <p id="track-flag-label" className="sr-only">
        A sample of country flags from around the world. Not a list of places we ship.
      </p>
      <div className="track-flag-window" role="region" aria-labelledby="track-flag-label">
        <div className={`track-flag-track${paused ? " is-paused" : ""}`}>
          <FlagRow />
          <FlagRow hidden />
        </div>
      </div>
      <p data-testid="track-blessing" className="track-blessing mx-auto mt-4 max-w-[18rem] text-center text-[1.15rem] font-medium leading-snug text-ink sm:max-w-lg sm:text-lg">
        {before}
        <span className="font-semibold text-[#d60000]">China</span>
        {after}
      </p>
      <style>{`
        .track-flag-window { overflow: hidden; width: 100%; max-width: 100%; }
        .track-flag-track { display: flex; width: max-content; animation: track-flags-ltr 36s linear infinite; }
        .track-flag-track.is-paused { animation-play-state: paused; }
        .track-flag-row { display: flex; flex: none; align-items: center; gap: 0.65rem; padding-right: 0.65rem; margin: 0; list-style: none; }
        .track-flag-row img { display: block; height: 1.75rem; width: auto; border-radius: 0.2rem; box-shadow: 0 0 0 1px rgba(29, 29, 31, 0.12); }
        .track-blessing { font-family: var(--font-fraunces), var(--font-playfair), "Times New Roman", Georgia, serif; }
        @keyframes track-flags-ltr {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .track-flag-track { animation: none; }
        }
      `}</style>
    </div>
  );
}

function FlagRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="track-flag-row" aria-hidden={hidden || undefined}>
      {TRACK_FLAGS.map((flag) => (
        <li key={flag.code}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/tracking/flags/${flag.code}.svg`} alt={hidden ? "" : flag.name} width={40} height={30} />
        </li>
      ))}
    </ul>
  );
}
