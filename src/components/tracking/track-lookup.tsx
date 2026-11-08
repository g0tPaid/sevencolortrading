"use client";

import { FormEvent, useEffect, useState } from "react";
import { countryLabel } from "@/lib/analytics-geo";
import { SevenColorMark } from "@/components/brand/seven-color-mark";
import { newestFirst } from "@/lib/tracking/public-view";
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

function MarkedCraft({ kind }: { kind: "plane" | "truck" }) {
  const plane = kind === "plane";
  return (
    <span className={`track-craft track-craft-${kind} relative inline-block h-12 w-20 text-ink`}>
      <svg viewBox="0 0 80 48" className="h-full w-full" fill="none" aria-hidden>
        {plane ? (
          <>
            <path d="M6 28h34l10-8h16l6 6v4H58L46 36H18L6 28z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M28 28V18M40 27l8 9" stroke="currentColor" strokeWidth="1.6" />
          </>
        ) : (
          <>
            <path d="M8 30V20h28l8 8h20v8H8z" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="22" cy="36" r="4" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="58" cy="36" r="4" stroke="currentColor" strokeWidth="1.6" />
          </>
        )}
      </svg>
      <span className={plane ? "absolute left-7 top-3" : "absolute left-3 top-2"}>
        <SevenColorMark size={16} title="" />
      </span>
    </span>
  );
}

function RouteIllustration() {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <MarkedCraft kind="plane" />
      <MarkedCraft kind="truck" />
    </div>
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Status</p>
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
            <div className="mt-4">
              <RouteIllustration />
            </div>
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
            {shipment.message ? <p className="mt-5 text-xs leading-relaxed text-muted">{shipment.message}</p> : null}
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
            .track-craft { animation: track-craft-drift 4.8s ease-in-out infinite; }
            .track-craft-truck { animation-delay: -1.6s; }
            @keyframes track-craft-drift {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }
            @media (prefers-reduced-motion: reduce) {
              .track-craft { animation: none; }
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
