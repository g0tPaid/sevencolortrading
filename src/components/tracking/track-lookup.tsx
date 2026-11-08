"use client";

import { FormEvent, useEffect, useRef, useState, type Ref } from "react";
import { countryLabel } from "@/lib/analytics-geo";
import { WORLD_LAND_PATH } from "@/components/home/world-land-path";
import { greetingNameSpan, shipmentPhase, type ShipmentPhase } from "@/lib/tracking/greeting";
import { newestFirst } from "@/lib/tracking/public-view";
import { pointOnRoute, routeArc } from "@/lib/tracking/route-map";
import {
  searchPresentation,
  shouldBringTimelineIntoView,
  timelineNeedsScroll,
  timelineScrollBehavior,
} from "@/lib/tracking/track-present";
import { TrackPromo } from "@/components/tracking/track-promo";
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

function useRouteMotion(active: boolean) {
  const [reduce, setReduce] = useState(false);
  const [t, setT] = useState(0);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  useEffect(() => {
    if (!active || reduce) return;
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      setT(((now - started) / 9000) % 1);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduce]);
  return { t, animate: active && !reduce };
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
  const motion = useRouteMotion(phase === "in_transit");
  if (!arc) return null;
  const fly = phase === "in_transit" && motion.animate;
  const progress = phase === "delivered" ? 1 : fly ? motion.t : 0;
  const point = pointOnRoute(arc, progress);
  return (
    <figure
      className="overflow-hidden rounded-[1.5rem] border border-line bg-paper shadow-[0_16px_40px_-28px_rgba(16,16,16,0.55)]"
      data-testid="track-route"
      data-route-motion={fly ? "fly" : "still"}
    >
      <figcaption className="px-4 pb-2 pt-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted sm:px-5">
        <span>Route illustration</span>
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
          <g transform={`translate(${point.x} ${point.y})`} data-plane-progress={progress.toFixed(2)}>
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
  const [searchId, setSearchId] = useState(0);
  const [holdId, setHoldId] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const activeSearch = useRef(0);
  const inFlight = useRef(false);
  const submittedNumber = useRef("");
  const holdTimer = useRef<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const broughtFor = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (holdTimer.current != null) window.clearTimeout(holdTimer.current);
    };
  }, []);

  function clearHold() {
    if (holdTimer.current != null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  async function lookup(trackingNumber: string, carrierId: string | undefined, silent: boolean, requestId: number) {
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
      if (activeSearch.current !== requestId) return;
      if (!response.ok || data.ok === false) {
        setResult(null);
        setError(data.error || "Tracking could not be loaded. Try again.");
        return;
      }
      setError(null);
      setResult(data);
    } catch {
      if (activeSearch.current !== requestId) return;
      setResult(null);
      setError("Tracking could not be loaded. Try again.");
    } finally {
      if (!silent && activeSearch.current === requestId) {
        inFlight.current = false;
        setPending(false);
      }
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (inFlight.current) return;
    const presentation = searchPresentation(number);
    const requestId = activeSearch.current + 1;
    activeSearch.current = requestId;
    setSearchId(requestId);
    setAnnouncement("");
    setPollExhausted(false);
    clearHold();
    if (presentation.kind === "invalid") {
      setHoldId(null);
      setResult(null);
      setPending(false);
      setError(presentation.message);
      return;
    }
    submittedNumber.current = presentation.number;
    inFlight.current = true;
    setResult(null);
    setError(null);
    setHoldId(requestId);
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null;
      if (activeSearch.current !== requestId) return;
      setHoldId((current) => (current === requestId ? null : current));
    }, presentation.holdMs);
    await lookup(presentation.number, undefined, false, requestId);
  }

  const pollKey = result?.state === "pending" ? String(searchId) : "";
  useEffect(() => {
    if (!pollKey) return;
    const requestId = Number(pollKey);
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (activeSearch.current !== requestId) {
        clearInterval(timer);
        return;
      }
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
      void lookup(submittedNumber.current, carrierId, true, requestId);
    }, 2000);
    return () => clearInterval(timer);
    // Poll only while this search is pending. The submitted number lives in a ref.
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

  const holding = holdId !== null;
  const showProgress = !holding && !pollExhausted && (pending || result?.state === "pending");
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
  const visibleCards = holding ? [] : cards;

  useEffect(() => {
    const node = timelineRef.current;
    if (
      !shouldBringTimelineIntoView({
        holding,
        hasTimeline: node != null,
        searchId,
        broughtForSearchId: broughtFor.current,
      }) ||
      !node
    ) {
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = node.getBoundingClientRect().top;
    if (timelineNeedsScroll(top, window.innerHeight)) {
      node.scrollIntoView({ behavior: timelineScrollBehavior(reduce), block: "start" });
    }
    if (document.activeElement?.id !== "tracking-number") node.focus({ preventScroll: true });
    broughtFor.current = searchId;
    setAnnouncement("Tracking timeline");
  }, [holding, searchId, visibleCards.length]);

  return (
    <div className="mx-auto max-w-xl">
      <h1 data-testid="track-heading" className="track-page-heading mb-5 font-display text-[2.4rem] font-semibold leading-[0.95] tracking-tight text-ink sm:mb-6 sm:text-[3.35rem]">
        Track Global Parcels
        <span className="track-page-rule" aria-hidden />
      </h1>
      <p className="sr-only" aria-live="polite" data-testid="track-live">
        {announcement}
      </p>
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
          aria-busy={pending || holding}
          className="track-search-btn inline-flex min-h-12 w-full min-w-[9.5rem] items-center justify-center gap-2 rounded-2xl bg-ink px-5 text-sm font-semibold text-paper focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {pending ? <span className="track-search-spin" aria-hidden /> : <SearchMark />}
          {pending ? "Searching" : "Search"}
        </button>
      </form>
      <style>{`
        .track-search-btn {
          transition: transform 200ms cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 200ms ease;
          box-shadow: inset 0 -3px 0 #E31C23, 0 10px 22px -16px rgba(29, 29, 31, 0.9);
        }
        .track-search-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: inset 0 -3px 0 #E31C23, 0 16px 28px -14px rgba(227, 28, 35, 0.55);
        }
        .track-search-btn:active:not(:disabled) { transform: translateY(0) scale(0.98); }
        .track-search-btn:focus-visible {
          box-shadow: inset 0 -3px 0 #E31C23, 0 0 0 2px var(--canvas), 0 0 0 4px #E31C23;
        }
        .track-search-icon { transition: transform 200ms cubic-bezier(0.34, 1.5, 0.64, 1); }
        .track-search-btn:hover:not(:disabled) .track-search-icon { transform: translate(1px, -1px) scale(1.08); }
        .track-search-spin {
          width: 16px;
          height: 16px;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
          animation: track-search-spin 0.8s linear infinite;
        }
        @keyframes track-search-spin { to { transform: rotate(360deg); } }
        .track-page-heading { animation: track-heading-in 560ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        .track-page-rule {
          display: block;
          width: 4.75rem;
          height: 3px;
          margin-top: 0.7rem;
          border-radius: 999px;
          background: var(--accent);
          transform-origin: left center;
          animation: track-heading-rule 720ms cubic-bezier(0.16, 1, 0.3, 1) 160ms both;
        }
        .track-greeting-name {
          color: var(--accent);
          font-weight: 650;
          background-image: linear-gradient(var(--accent), var(--accent));
          background-repeat: no-repeat;
          background-position: 0 100%;
          background-size: 100% 2px;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
          animation: track-name-line 680ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes track-heading-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes track-heading-rule {
          from { transform: scaleX(0); }
          to { transform: none; }
        }
        @keyframes track-name-line {
          from { background-size: 0 2px; }
          to { background-size: 100% 2px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .track-search-btn,
          .track-search-icon,
          .track-search-spin,
          .track-page-heading,
          .track-page-rule,
          .track-greeting-name { animation: none; transition: none; }
          .track-search-btn:hover,
          .track-search-btn:active,
          .track-search-btn:hover .track-search-icon,
          .track-page-rule { transform: none; }
        }
      `}</style>
      {holding ? <TrackPromo /> : null}
      {showProgress ? <TrackingProgress label={progressLabel} /> : null}

      {!holding && error ? (
        <p role="alert" className="mt-4 rounded-2xl border border-line bg-paper-elevated px-4 py-3 text-sm text-ink">
          {error}
        </p>
      ) : null}

      {!holding && result && !result.found && result.state !== "pending" ? (
        <p data-testid="track-empty" role="status" className="mt-4 text-sm text-ink">
          {result.message}
        </p>
      ) : null}

      {!holding && result?.state === "multiple" ? (
        <p className="mt-4 text-sm text-ink">{result.message}</p>
      ) : null}

      {visibleCards.map((card, index) => (
        <ResultCard
          key={`${card.trackingNumber}-${card.carrier.id ?? card.carrier.name}`}
          shipment={card}
          onRefresh={onRefresh}
          refreshing={refreshing || showProgress}
          timelineRef={index === 0 ? timelineRef : undefined}
        />
      ))}
    </div>
  );
}

function ResultCard({
  shipment,
  onRefresh,
  refreshing,
  timelineRef,
}: {
  shipment: PublicShipment;
  onRefresh: () => void;
  refreshing: boolean;
  timelineRef?: Ref<HTMLDivElement>;
}) {
  const events = newestFirst(shipment.events);
  const forwarder = shipment.carrier.resolution === "forwarder";
  const headingId = timelineRef ? "track-timeline-heading" : undefined;
  return (
    <section className="mt-6 space-y-4" data-testid="track-result">
      <div className="rounded-[1.75rem] border border-line bg-paper-elevated p-5 sm:p-6">
        {shipment.greeting ? <GreetingLine greeting={shipment.greeting} /> : null}
        <p className={`${shipment.greeting ? "mt-4" : ""} text-[11px] font-semibold uppercase tracking-[0.16em] text-muted`}>Status</p>
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
      </div>

      <div
        ref={timelineRef}
        tabIndex={timelineRef ? -1 : undefined}
        id={timelineRef ? "track-timeline" : undefined}
        data-testid="track-timeline"
        aria-labelledby={headingId}
        className="scroll-mt-32 rounded-[1.75rem] border border-line bg-paper-elevated p-5 outline-none focus-visible:ring-2 focus-visible:ring-accent sm:p-6"
      >
        <h3 id={headingId} className="font-display text-xl font-semibold text-ink">
          Timeline
        </h3>
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

      <div className="grid gap-3 sm:grid-cols-2">
        <Place label="Origin" text={shipment.origin} code={shipment.originCountryCode} />
        <Place label="Destination" text={shipment.destination} code={shipment.destinationCountryCode} />
      </div>

      {shipment.originCountryCode && shipment.destinationCountryCode ? (
        <RouteMap
          origin={shipment.originCountryCode}
          destination={shipment.destinationCountryCode}
          phase={shipmentPhase(shipment.status)}
        />
      ) : null}
    </section>
  );
}

function GreetingLine({ greeting }: { greeting: string }) {
  const parts = greetingNameSpan(greeting);
  return (
    <p data-testid="track-greeting" className="text-lg font-medium leading-snug text-ink">
      {parts ? (
        <span data-testid="track-greeting-name" className="track-greeting-name break-words">
          {parts.name}
        </span>
      ) : null}
      {parts ? parts.rest : greeting}
    </p>
  );
}

function SearchMark() {
  return (
    <svg className="track-search-icon" width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <circle cx="8" cy="8" r="5.1" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="8" r="1.7" fill="#E31C23" />
      <path d="M12.1 12.2 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
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
