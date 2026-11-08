"use client";

import { FormEvent, useEffect, useState } from "react";
import { countryLabel } from "@/lib/analytics-geo";

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
};

type LookupResponse = {
  ok?: boolean;
  state?: string;
  found?: boolean;
  error?: string;
  message?: string | null;
  refresh?: string;
  candidates?: Array<{ id: string; name: string }>;
  shipment?: PublicShipment;
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
  if (shipment.carrier.resolution === "manual" && shipment.carrier.name) {
    return `Carrier selected by the desk: ${shipment.carrier.name}.`;
  }
  if (shipment.carrier.name) return shipment.carrier.name;
  return "Carrier not determined yet.";
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
      <p className="mt-1 text-sm text-ink">
        {flag ? (
          <span className="mr-1.5" aria-hidden>
            {flag}
          </span>
        ) : null}
        {value || "Not supplied"}
      </p>
    </div>
  );
}

export function TrackLookup() {
  const [number, setNumber] = useState("");
  const [pending, setPending] = useState(false);
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
    await lookup(number);
  }

  const pollKey = result?.state === "pending" ? result.shipment?.trackingNumber ?? number : "";
  useEffect(() => {
    if (!pollKey) return;
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (attempts > 15) {
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

  const shipment = result?.found ? result.shipment : null;
  const events = [...(shipment?.events ?? [])].sort((a, b) => {
    const left = a.time ? Date.parse(a.time) : Number.NaN;
    const right = b.time ? Date.parse(b.time) : Number.NaN;
    if (Number.isFinite(left) && Number.isFinite(right) && left !== right) return right - left;
    return 0;
  });

  return (
    <div className="mx-auto max-w-xl">
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
          disabled={pending}
          aria-busy={pending}
          className="rounded-2xl bg-ink px-5 py-3 text-sm font-medium text-paper disabled:opacity-60"
        >
          Search
        </button>
      </form>
      {pending ? (
        <p role="status" className="mt-3 text-sm text-muted">
          Searching…
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-4 rounded-2xl border border-line bg-paper-elevated px-4 py-3 text-sm text-ink">
          {error}
        </p>
      ) : null}

      {result?.state === "pending" && !pending ? (
        <p role="status" className="mt-3 text-sm text-muted">
          {result.message || "Checking this number with the carrier."}
        </p>
      ) : null}

      {result?.state === "ambiguous" ? (
        <div className="mt-4">
          <p className="text-sm text-ink">{result.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(result.candidates ?? result.shipment?.carrier.candidates ?? []).map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => void lookup(number, candidate.id)}
                className="rounded-full border border-line px-3 py-1.5 text-sm text-ink"
              >
                {candidate.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {result && !result.found && result.state !== "pending" && result.state !== "ambiguous" ? (
        <p data-testid="track-empty" role="status" className="mt-4 text-sm text-ink">
          {result.message}
        </p>
      ) : null}

      {shipment ? (
        <section className="mt-6 space-y-4" data-testid="track-result">
          <div className="rounded-[1.75rem] border border-line bg-paper-elevated p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Status</p>
            <h2 data-testid="track-status" className="mt-2 font-display text-3xl font-semibold text-ink">
              {shipment.status}
            </h2>
            {shipment.statusDetail ? (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{shipment.statusDetail}</p>
            ) : null}
            <p className="mt-4 text-sm text-ink">{carrierCopy(shipment)}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted">Last updated</dt>
                <dd className="mt-1 text-ink">{shipment.lastUpdated || "Not yet"}</dd>
              </div>
              <div>
                <dt className="text-muted">Carrier ETA</dt>
                <dd className="mt-1 text-ink">{shipment.eta || "No carrier ETA"}</dd>
              </div>
            </dl>
            {shipment.message ? <p className="mt-4 text-sm text-muted">{shipment.message}</p> : null}
            <button
              type="button"
              data-testid="track-refresh"
              onClick={onRefresh}
              disabled={refreshing}
              className="mt-5 rounded-full border border-line px-4 py-2 text-sm text-ink disabled:opacity-60"
            >
              {refreshing ? "Queuing refresh…" : "Refresh"}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Place label="Origin" text={shipment.origin} code={shipment.originCountryCode} />
            <Place label="Destination" text={shipment.destination} code={shipment.destinationCountryCode} />
          </div>

          <div className="rounded-[1.75rem] border border-line bg-paper-elevated p-5 sm:p-6">
            <h3 className="font-display text-xl font-semibold text-ink">Timeline</h3>
            {events.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No carrier events are stored.</p>
            ) : (
              <ol className="mt-4 space-y-4">
                {events.map((event, index) => (
                  <li key={`${event.time ?? "t"}-${index}`} className="border-l-2 border-line pl-4">
                    <p className="text-sm font-medium text-ink">{event.status}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{event.description}</p>
                    <p className="mt-1 text-xs text-muted">
                      {event.time || "Time not supplied"}
                      {event.location ? ` · ${event.location}` : ""}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
