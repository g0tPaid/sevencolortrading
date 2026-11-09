import { TRACK_CARRIER_NOTE, TRACK_CARRIERS } from "@/lib/tracking/carrier-logos";

/** Tiny brand examples sliding left to right, directly above the tracking field. */
export function TrackCarrierStrip() {
  return (
    <div className="track-carrier-strip mb-3" data-testid="track-carrier-strip">
      <p id="track-carrier-label" className="sr-only">
        {TRACK_CARRIER_NOTE}
      </p>
      <div className="track-carrier-window" role="region" aria-labelledby="track-carrier-label">
        <div className="track-carrier-track">
          <CarrierRow />
          <CarrierRow hidden />
        </div>
      </div>
      <style>{`
        .track-carrier-window { overflow: hidden; width: 100%; max-width: 100%; }
        .track-carrier-track { display: flex; width: max-content; animation: track-carriers-ltr 32s linear infinite; }
        .track-carrier-row { display: flex; flex: none; align-items: center; gap: 1.25rem; padding-right: 1.25rem; margin: 0; list-style: none; }
        .track-carrier-row img { display: block; height: 1.25rem; width: auto; }
        @keyframes track-carriers-ltr {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .track-carrier-track { animation: none; }
        }
      `}</style>
    </div>
  );
}

function CarrierRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="track-carrier-row" aria-hidden={hidden || undefined}>
      {TRACK_CARRIERS.map((carrier) => (
        <li key={carrier.file}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/tracking/carriers/${carrier.file}`} alt={hidden ? "" : carrier.name} height={18} />
        </li>
      ))}
    </ul>
  );
}
