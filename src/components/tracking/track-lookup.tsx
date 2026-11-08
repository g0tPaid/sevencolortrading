"use client";

import { FormEvent, useEffect, useState } from "react";
import { countryLabel } from "@/lib/analytics-geo";
import { WORLD_LAND_PATH } from "@/components/home/world-land-path";
import { shipmentPhase, type ShipmentPhase } from "@/lib/tracking/greeting";
import { newestFirst } from "@/lib/tracking/public-view";
import { routeArc } from "@/lib/tracking/route-map";
import { glossTrackingText, hasChinese } from "@/lib/tracking/zh-en";

type PublicEvent = {
  time: string | null;
  status: string;
  description: string;
  location: string | null;
};

type PublicShipment = {
  trackingNumber: string;
  carrier: {
    id: string | null;
    name: string | null;
    resolution: string;
    candidates: Array<{ id: string; name: string }>;
  };
  status: string;
  statusDetail: string | null;
  origin: string | null;
  destination: string | null;
  originCountryCode: string | null;
  destinationCountryCode: string | null;
  eta: string | null;
  lastUpdated: string | null;
  events: PublicEvent[];
  message: string | null;
  reference?: string | null;
  pieces?: string | null;
  timeNote?: string | null;
  greeting?: string | null;
};

type LookupResponse = {
  ok?: boolean;
  state?: string;
  found?: boolean;
  error?: string;
  message?: string | null;
  refresh?: string;
  candidates?: Array<{ id: string; name: string }>;
  shipment?: PublicShipment | null;
  shipments?: PublicShipment[];
};

function flagFor(code: string | null): string | null {
  if (!code || !/^[A-Z]{2}$/.test(code)) return null;
  const points = [...code].map((char) => 0x1f1e6 + (char.charCodeAt(0) - 65));
  return String.fromCodePoint(...points);
}

function carrierCopy(shipment: PublicShipment): string {
  if (shipment.carrier.resolution === "ambiguous") {
    const names = shipment.carrier.candidates.map((item) => item.name).join(", ");
    return names
      ? `Carrier could not be determined. Possible carriers: ${names}.`
      : "Carrier could not be determined from this tracking number.";
  }
  if (shipment.carrier.resolution === "pattern" && shipment.carrier.name) {
    return `Possible carrier from the number pattern: ${shipment.carrier.name}. Not confirmed by the carrier yet.`;
  }
  if (shipment.carrier.resolution === "unsupported") {
    return "This carrier is not supported by shipment tracking yet.";
  }
  if (shipment.carrier.resolution === "forwarder") {
    return "Forwarder tracking page.";
  }
  if (shipment.carrier.resolution === "manual" && shipment.carrier.name) {
    return `Carrier selected by the desk: ${shipment.carrier.name}.`;
  }
  if (shipment.carrier.name) return shipment.carrier.name;
  return "Carrier not determined yet.";
}

function Gloss({
  text,
  prominent = false,
  testId,
}: {
  text: string;
  prominent?: boolean;
  testId?: string;
}) {
  const gloss = glossTrackingText(text);
  if (!hasChinese(text) || gloss.state === "plain") {
    const className = prominent ? "font-display text-3xl font-bold text-ink" : "text-sm font-medium text-ink";
    return prominent ? (
      <h2 className={className} data-testid={testId}>
        {text}
      </h2>
    ) : (
      <p className={className} data-testid={testId}>
        {text}
      </p>
    );
  }
  return (
    <div>
      <p className="text-sm text-ink" data-testid={prominent ? "track-status-zh" : undefined}>
        {text}
      </p>
      {gloss.state === "translated" ? (
        prominent ? (
          <h2 className="mt-1 font-display text-3xl font-bold leading-tight text-ink" data-testid={testId ?? "track-translation"}>
            {gloss.english}
          </h2>
        ) : (
          <p className="mt-0.5 text-sm font-semibold text-ink" data-testid={testId ?? "track-translation"}>
            {gloss.english}
          </p>
        )
      ) : (
        <p className="mt-0.5 text-xs text-muted" data-testid="track-translation-unavailable">
          English translation unavailable
        </p>
      )}
    </div>
  );
}

function BrandedPlane({ facesLeft }: { facesLeft: boolean }) {
  return (
    <g transform={facesLeft ? "scale(-1 1)" : undefined} data-plane-facing={facesLeft ? "left" : "right"}>
      <image
        href="/tracking/sourcing-center-plane.png"
        width="170"
        height="90"
        x="-85"
        y="-45"
        data-testid="track-plane"
      />
    </g>
  );
}

function RouteLabel({ x, y, text }: { x: number; y: number; text: string }) {
  const above = y > 56;
  return (
    <text
      x={x}
      y={above ? y - 22 : y + 38}
      textAnchor="middle"
      fontSize="26"
      fontWeight="600"
      fill="#161616"
      stroke="#f7f4ef"
      strokeWidth="8"
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {text}
    </text>
  );
}

function RouteMap({
  origin,
  destination,
  phase,
}: {
  origin: string;
  destination: string;
  phase: ShipmentPhase;
}) {
  const arc = routeArc(origin, destination);
  if (!arc) return null;
  const parked = phase === "delivered" ? arc.to : arc.from;
  const fly = phase === "in_transit";
  return (
    <figure
      className="mt-5 overflow-hidden rounded-[1.5rem] border border-line bg-paper shadow-[0_16px_40px_-28px_rgba(16,16,16,0.55)]"
      data-testid="track-route"
      data-route-motion={fly ? "fly" : "still"}
    >
      <figcaption className="flex items-baseline justify-between gap-3 px-4 pb-2 pt-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted sm:px-5">
        <span>Route illustration</span>
        <span className="font-normal normal-case tracking-normal">Natural Earth</span>
      </figcaption>
      <div className="mx-3 mb-3 overflow-hidden rounded-2xl border border-line/80 bg-[#f4f1ec] sm:mx-4">
        <svg viewBox="0 0 1000 500" className="block h-auto w-full" role="img" aria-label={`Route illustration from ${arc.originLabel} to ${arc.destinationLabel}`}>
          <rect width="1000" height="500" fill="#f7f4ef" />
          <path d={WORLD_LAND_PATH} fill="#d9d3c8" />
          <path d={arc.d} fill="none" stroke="#E31C23" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
          <circle cx={arc.from.x} cy={arc.from.y} r="8" fill="#161616" />
          <circle cx={arc.to.x} cy={arc.to.y} r="8" fill="#E31C23" />
          <RouteLabel x={arc.from.x} y={arc.from.y} text={arc.originLabel} />
          <RouteLabel x={arc.to.x} y={arc.to.y} text={arc.destinationLabel} />
          {fly ? (
            <g className="track-plane-fly">
              <animateMotion dur="9s" repeatCount="indefinite" path={arc.d} />
              <BrandedPlane facesLeft={arc.facesLeft} />
            </g>
          ) : null}
          <g className={fly ? "track-plane-still" : undefined} transform={`translate(${parked.x} ${parked.y})`}>
            <BrandedPlane facesLeft={arc.facesLeft} />
          </g>
        </svg>
      </div>
    </figure>
  );
}

function Place({
  label,
  text,
  code,
}: {
  label: string;
  text: string | null;
  code: string | null;
}) {
  const flag = flagFor(code);
  const country = code ? countryLabel(code) : null;
  const value = text || country;
  return (
    <div className="rounded-2xl border border-line bg-paper px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="mt-1 flex items-start gap-1.5">
        {flag ? (
          <span className="mt-0.5" aria-hidden>
            {flag}
          </span>
        ) : null}
        {value ? <Gloss text={value} /> : <p className="text-sm text-ink">Not supplied</p>}
      </div>
    </div>
  );
}

export function TrackLookup() {
  const [number, setNumber] = useState("");
  const [pending, setPending] = useState(false);
  const [pollExhausted, setPollExhausted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResponse | null>(null);

  async function lookup(trackingNumber: string, carrierId?: string, silent = false) {
    if (!silent) {
      setPending(true);
      setError(null);
    }
    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ trackingNumber, carrierId }),
      });
      const data = (await response.json()) as LookupResponse;
      if (!response.ok || data.ok === false) {
        setResult(null);
        setError(data.error || "Tracking could not be loaded. Try again.");
        return;
      }
      setResult(data);
    } catch {
      setResult(null);
      setError("Tracking could not be loaded. Try again.");
    } finally {
      if (!silent) setPending(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (pending || (result?.state === "pending" && !pollExhausted)) return;
    setPollExhausted(false);
    await lookup(number);
  }

  const pollKey = result?.state === "pending" ? result.shipment?.trackingNumber ?? number : "";
  useEffect(() => {
    if (!pollKey) return;
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (attempts > 15) {
        setPollExhausted(true);
        setResult((current) =>
          current?.state === "pending"
            ? { ...current, message: "The check is still running. Search again in a moment." }
            : current,
        );
        clearInterval(timer);
        return;
      }
      const carrierId = result?.shipment?.carrier.id ?? undefined;
      void lookup(number, carrierId, true);
    }, 2000);
    return () => clearInterval(timer);
    // Poll only while this search is pending. `lookup` closes over the current number.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollKey]);

  async function onRefresh() {
    if (!result?.shipment || refreshing) return;
    setRefreshing(true);
    setError(null);
    try {
      const response = await fetch("/api/track/refresh", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ trackingNumber: result.shipment.trackingNumber }),
      });
      const data = (await response.json()) as LookupResponse;
      if (!response.ok || data.ok === false) {
        setError(data.error || "Tracking could not be loaded. Try again.");
        return;
      }
      setResult(data);
    } catch {
      setError("Tracking could not be loaded. Try again.");
    } finally {
      setRefreshing(false);
    }
  }

  const showProgress = !pollExhausted && (pending || result?.state === "pending");
  const progressLabel =
    result?.shipment || result?.shipments?.length
      ? "A result is in. Still checking other possible carriers."
      : result?.message || "Checking this number with the carrier.";
  const shipment = result?.state === "ready" ? result.shipment : result?.state === "pending" ? result.shipment : null;
  const cards =
    result?.shipments?.length
      ? result.shipments
      : shipment
        ? [shipment]
        : [];

  return (
    <div className="mx-auto max-w-xl">
      <h1 data-testid="track-heading" className="mb-5 font-display text-3xl font-semibold tracking-tight text-ink sm:mb-6 sm:text-5xl">
        Track Global Parcels
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="tracking-number" className="sr-only">
          Tracking number
        </label>
        <input
          id="tracking-number"
          data-testid="track-number"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="Tracking number"
          className="min-w-0 flex-1 rounded-2xl border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus:border-accent"
        />
        <button
          type="submit"
          data-testid="track-submit"
          disabled={showProgress}
          aria-busy={showProgress}
          className="rounded-2xl bg-ink px-5 py-3 text-sm font-medium text-paper disabled:opacity-60"
        >
          Search
        </button>
      </form>
      {showProgress ? <TrackingProgress label={progressLabel} /> : null}

      {error ? (
        <p role="alert" className="mt-4 rounded-2xl border border-line bg-paper-elevated px-4 py-3 text-sm text-ink">
          {error}
        </p>
      ) : null}

      {result && !result.found && result.state !== "pending" ? (
        <p data-testid="track-empty" role="status" className="mt-4 text-sm text-ink">
          {result.message}
        </p>
      ) : null}

      {result?.state === "multiple" ? (
        <p className="mt-4 text-sm text-ink">{result.message}</p>
      ) : null}

      {cards.map((card) => (
        <ResultCard key={`${card.trackingNumber}-${card.carrier.id ?? card.carrier.name}`} shipment={card} onRefresh={onRefresh} refreshing={refreshing || showProgress} />
      ))}
    </div>
  );
}

function ResultCard({
  shipment,
  onRefresh,
  refreshing,
}: {
  shipment: PublicShipment;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const events = newestFirst(shipment.events);
  const forwarder = shipment.carrier.resolution === "forwarder";
  return (
        <section className="mt-6 space-y-4" data-testid="track-result">
          <div className="rounded-[1.75rem] border border-line bg-paper-elevated p-5 sm:p-6">
            {shipment.greeting ? (
              <p data-testid="track-greeting" className="text-lg font-medium leading-snug text-ink">
                {shipment.greeting}
              </p>
            ) : null}
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Status</p>
            <div className="mt-2">
              <Gloss text={shipment.status} prominent testId="track-status" />
            </div>
            {shipment.statusDetail && shipment.statusDetail !== shipment.status ? (
              <div className="mt-3">
                <Gloss text={shipment.statusDetail} />
              </div>
            ) : null}
            {!forwarder && shipment.carrier.name ? <p className="mt-4 text-sm text-ink">{carrierCopy(shipment)}</p> : null}
            {shipment.eta ? (
              <p className="mt-3 text-sm text-ink">
                <span className="text-muted">ETA </span>
                {shipment.eta}
              </p>
            ) : null}
            {shipment.originCountryCode && shipment.destinationCountryCode ? (
              <RouteMap
                origin={shipment.originCountryCode}
                destination={shipment.destinationCountryCode}
                phase={shipmentPhase(shipment.status)}
              />
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Place label="Origin" text={shipment.origin} code={shipment.originCountryCode} />
            <Place label="Destination" text={shipment.destination} code={shipment.destinationCountryCode} />
          </div>

          <div className="rounded-[1.75rem] border border-line bg-paper-elevated p-5 sm:p-6">
            <h3 className="font-display text-xl font-semibold text-ink">Timeline</h3>
            {shipment.timeNote ? <p className="mt-2 text-xs text-muted">{shipment.timeNote}</p> : null}
            {events.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No carrier events are stored.</p>
            ) : (
              <ol className="mt-4 space-y-5">
                {events.map((event, index) => (
                  <li key={`${event.time ?? "t"}-${index}`} data-testid="track-event" className="border-l-2 border-line pl-4">
                    <Gloss text={event.description || event.status} />
                    {event.description && event.status && event.description !== event.status ? (
                      <div className="mt-2">
                        <Gloss text={event.status} />
                      </div>
                    ) : null}
                    <p className="mt-1 text-xs text-muted">{event.time || "Time not supplied"}</p>
                    {event.location ? (
                      <div className="mt-1">
                        <Gloss text={event.location} />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}
            <button
              type="button"
              data-testid="track-refresh"
              onClick={onRefresh}
              disabled={refreshing}
              className="mt-4 rounded-full border border-line px-4 py-2 text-sm text-ink disabled:opacity-60"
            >
              {refreshing ? "Queuing refresh…" : "Refresh"}
            </button>
          </div>
          <style>{`
            @media (prefers-reduced-motion: reduce) {
              .track-plane-fly { display: none; }
            }
            @media (prefers-reduced-motion: no-preference) {
              .track-plane-still { display: none; }
            }
          `}</style>
        </section>
  );
}

function TrackingProgress({ label }: { label: string }) {
  return (
    <div className="mt-3">
      <div
        role="progressbar"
        aria-label={label}
        data-testid="track-progress"
        className="h-1.5 w-full overflow-hidden rounded-full bg-accent-soft"
      >
        <div className="track-progress-slide h-full w-1/3 rounded-full bg-accent" />
      </div>
      <p role="status" aria-live="polite" className="mt-2 text-sm text-muted">
        {label}
      </p>
      <style>{`
        .track-progress-slide { animation: track-progress-slide 1.1s ease-in-out infinite; }
        @keyframes track-progress-slide {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(320%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .track-progress-slide { animation: none; width: 100%; }
        }
      `}</style>
    </div>
  );
}
