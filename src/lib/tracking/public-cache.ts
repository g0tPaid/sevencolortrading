import { randomUUID } from "crypto";
import type { SqlValue } from "node:sqlite";
import { COUNTRY_CENTROIDS } from "@/lib/analytics-geo";
import { carrierName, isTrackableCarrier } from "@/lib/tracking/carriers";
import { getDb, withImmediate } from "@/lib/tracking/db";
import { eventFingerprint } from "@/lib/tracking/fingerprint";
import { trackingGreeting } from "@/lib/tracking/greeting";
import { MSG } from "@/lib/tracking/messages";
import type { PublicShipment } from "@/lib/tracking/public-view";
import {
  FORWARDER_CARRIER_ID,
  FORWARDER_PROVIDER_VERSION,
  fetchForwarderDocument,
  forwarderMessage,
  type ForwarderDocument,
} from "@/lib/tracking/forwarder-source";
import { liveScraperClient, scraperField, type ScraperClient } from "@/lib/tracking/scraper-client";
import { eventDescription, eventTime, interpretDetection, mapStage, shipmentStatusFromResult } from "@/lib/tracking/status";
import { consumeRateLimit, countAdminDue, getSettings, writeProviderLog } from "@/lib/tracking/store";
import {
  ScraperError,
  TrackingInputError,
  type ShipmentStatus,
  type TrackBody,
  type TrackEventBody,
} from "@/lib/tracking/types";
import { cleanCarrierId, normalizeTrackingNumber } from "@/lib/tracking/validate";

export type PublicState =
  | "pending"
  | "ready"
  | "ambiguous"
  | "unsupported"
  | "unavailable"
  | "timeout"
  | "not_found"
  | "rejected"
  | "empty"
  | "throttled";

type CacheRow = {
  id: string;
  trackingNumber: string;
  carrierId: string | null;
  carrierResolution: string;
  carrierCandidates: string[];
  status: ShipmentStatus;
  statusDetail: string | null;
  origin: string | null;
  destination: string | null;
  originCountry: string | null;
  destinationCountry: string | null;
  eta: string | null;
  outcome: PublicState;
  message: string | null;
  fetchedAt: string | null;
  freshUntil: string | null;
  interestUntil: string | null;
  refreshStopped: boolean;
  consecutiveFailures: number;
  providerVersion: number | null;
  referenceCode: string | null;
  packageCount: string | null;
  greetingName: string | null;
};

const IP_LIMIT = 60;
const IP_WINDOW_MS = 10 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
/** Upstream `/v1/track` without a carrier settles one winner. We still ask each plausible adapter, capped, so a second real history is not dropped. */
const MAX_CANDIDATES = 4;
const FANOUT_CONCURRENCY = 2;

function text(value: SqlValue | undefined): string | null {
  return typeof value === "string" ? value : null;
}

function num(value: SqlValue | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  return 0;
}

function mapRow(row: Record<string, SqlValue>): CacheRow {
  let candidates: string[] = [];
  const raw = text(row.carrier_candidates);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) candidates = parsed.filter((item) => typeof item === "string");
    } catch {
      candidates = [];
    }
  }
  return {
    id: text(row.id) ?? "",
    trackingNumber: text(row.tracking_number) ?? "",
    carrierId: text(row.carrier_id),
    carrierResolution: text(row.carrier_resolution) ?? "unresolved",
    carrierCandidates: candidates,
    status: (text(row.status) ?? "Unknown") as ShipmentStatus,
    statusDetail: text(row.status_detail),
    origin: text(row.origin),
    destination: text(row.destination),
    originCountry: text(row.origin_country),
    destinationCountry: text(row.destination_country),
    eta: text(row.eta),
    outcome: (text(row.outcome) ?? "pending") as PublicState,
    message: text(row.message),
    fetchedAt: text(row.fetched_at),
    freshUntil: text(row.fresh_until),
    interestUntil: text(row.interest_until),
    refreshStopped: num(row.refresh_stopped) === 1,
    consecutiveFailures: num(row.consecutive_failures),
    providerVersion: row.provider_version == null ? null : num(row.provider_version),
    referenceCode: text(row.reference_code),
    packageCount: text(row.package_count),
    greetingName: text(row.greeting_name),
  };
}

function knownCountry(code: string | null): string | null {
  if (!code || !COUNTRY_CENTROIDS[code]) return null;
  return code;
}

function view(row: CacheRow): PublicShipment {
  const forwarder = row.carrierResolution === "forwarder";
  const candidates = forwarder
    ? []
    : row.carrierCandidates
        .map((id) => {
          const name = carrierName(id);
          return name ? { id, name } : null;
        })
        .filter((item): item is { id: string; name: string } => item !== null);
  const events = getDb()
    .prepare(
      `SELECT occurred_at, status, description, location FROM public_track_events
       WHERE cache_id = ? ORDER BY COALESCE(occurred_at, created_at) ASC, COALESCE(tie_order, 0) ASC`,
    )
    .all(row.id)
    .map((event) => ({
      time: text(event.occurred_at),
      status: text(event.status) ?? "Unknown",
      description: text(event.description) ?? "",
      location: text(event.location),
    }));
  return {
    trackingNumber: row.trackingNumber,
    carrier: {
      id: forwarder || row.carrierResolution === "ambiguous" ? null : row.carrierId,
      name: forwarder ? "Forwarder tracking page" : row.carrierResolution === "ambiguous" ? null : carrierName(row.carrierId),
      resolution: row.carrierResolution,
      candidates,
    },
    status: row.status,
    statusDetail: row.statusDetail,
    origin: forwarder ? "China" : row.origin,
    destination: row.destination,
    originCountryCode: forwarder ? knownCountry("CN") : knownCountry(row.originCountry),
    destinationCountryCode: knownCountry(row.destinationCountry),
    eta: row.eta,
    lastUpdated: row.fetchedAt,
    events,
    message: row.message,
    reference: row.referenceCode,
    pieces: row.packageCount,
    timeNote: forwarder ? MSG.forwarderTimeNote : null,
    greeting: forwarder ? trackingGreeting(row.status, row.greetingName) : null,
  };
}

function fresh(row: CacheRow, now: Date): boolean {
  const until = row.freshUntil ? Date.parse(row.freshUntil) : Number.NaN;
  return Number.isFinite(until) && until > now.getTime();
}

function hoursFrom(now: Date, hours: number): string {
  return new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
}

function findCache(number: string, carrierId: string | null): CacheRow | null {
  const row = carrierId
    ? getDb()
        .prepare("SELECT * FROM public_track_cache WHERE tracking_number = ? AND carrier_id = ?")
        .get(number, carrierId)
    : getDb()
        .prepare("SELECT * FROM public_track_cache WHERE tracking_number = ? AND carrier_id IS NULL")
        .get(number);
  return row ? mapRow(row) : null;
}

function listCache(number: string): CacheRow[] {
  return getDb()
    .prepare("SELECT * FROM public_track_cache WHERE tracking_number = ? ORDER BY updated_at DESC")
    .all(number)
    .map(mapRow);
}

function jobOpen(cacheId: string): boolean {
  const row = getDb()
    .prepare("SELECT id FROM public_track_jobs WHERE cache_id = ? AND state IN ('queued', 'running')")
    .get(cacheId);
  return Boolean(row);
}

function outstanding(): number {
  return num(
    getDb()
      .prepare("SELECT COUNT(*) AS n FROM public_track_jobs WHERE state IN ('queued', 'running')")
      .get()?.n,
  );
}

function touchInterest(id: string, now: Date): void {
  const settings = getSettings();
  getDb()
    .prepare("UPDATE public_track_cache SET interest_until = ?, updated_at = ? WHERE id = ?")
    .run(hoursFrom(now, settings.publicInterestHours), now.toISOString(), id);
}

function evictExpired(now: Date): void {
  const settings = getSettings();
  const count = num(getDb().prepare("SELECT COUNT(*) AS n FROM public_track_cache").get()?.n);
  if (count < settings.publicMaxRows) return;
  const extra = count - settings.publicMaxRows + 1;
  getDb()
    .prepare(
      `DELETE FROM public_track_cache WHERE id IN (
         SELECT id FROM public_track_cache
         WHERE fresh_until IS NOT NULL AND fresh_until < ?
           AND (interest_until IS NULL OR interest_until < ?)
           AND id NOT IN (SELECT cache_id FROM public_track_jobs WHERE state IN ('queued', 'running'))
         ORDER BY updated_at ASC
         LIMIT ?
       )`,
    )
    .run(now.toISOString(), now.toISOString(), extra);
}

function response(row: CacheRow, state: PublicState, message: string | null, status = 200) {
  const shipment = state === "pending" && row.outcome === "pending" && !row.fetchedAt ? null : view(row);
  const found = state === "ready";
  return {
    status,
    body: {
      ok: true as const,
      state,
      found,
      message,
      shipment,
      candidates: shipment?.carrier.candidates ?? view(row).carrier.candidates,
    },
  };
}

export type ForwarderSource = (number: string, now: Date) => Promise<ForwarderDocument>;

export type PublicLookupOptions = {
  carrierId?: string | null;
  client?: ScraperClient;
  processNow?: boolean;
  forwarder?: ForwarderSource;
};

const forwarderFlights = new Map<string, Promise<ForwarderDocument>>();

function ensureForwarderRow(number: string, now: Date): CacheRow {
  const existing = findCache(number, FORWARDER_CARRIER_ID);
  if (existing) return existing;
  const id = randomUUID();
  const iso = now.toISOString();
  getDb()
    .prepare(
      `INSERT INTO public_track_cache (
        id, tracking_number, carrier_id, carrier_resolution, carrier_candidates, status, outcome, message,
        interest_until, refresh_stopped, consecutive_failures, created_at, updated_at, provider_version
      ) VALUES (?, ?, ?, 'forwarder', '[]', 'Unknown', 'pending', NULL, ?, 0, 0, ?, ?, ?)`,
    )
    .run(id, number, FORWARDER_CARRIER_ID, hoursFrom(now, getSettings().publicInterestHours), iso, iso, FORWARDER_PROVIDER_VERSION);
  return getCache(id)!;
}

function storeForwarderEvents(cacheId: string, events: ForwarderDocument & { kind: "ready" }, now: Date): void {
  getDb().prepare("DELETE FROM public_track_events WHERE cache_id = ?").run(cacheId);
  events.events.forEach((event, index) => {
    const description = clip(event.description, 1000);
    const location = event.location ? clip(event.location, 300) : null;
    getDb()
      .prepare(
        `INSERT INTO public_track_events (
          id, cache_id, fingerprint, occurred_at, status, description, location, stage, tie_order, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'forwarder', ?, ?)`,
      )
      .run(
        randomUUID(),
        cacheId,
        eventFingerprint({
          time: event.time,
          stage: "forwarder",
          description,
          location: location ?? "",
          tie: String(index),
        }),
        event.time,
        clip(description, 300),
        description,
        location,
        index,
        now.toISOString(),
      );
  });
}

function rememberForwarder(
  number: string,
  now: Date,
  fields: { outcome: PublicState; message: string | null; hours: number },
): CacheRow {
  const row = ensureForwarderRow(number, now);
  getDb().prepare("DELETE FROM public_track_events WHERE cache_id = ?").run(row.id);
  saveOutcome(row.id, now, {
    outcome: fields.outcome,
    message: fields.message,
    carrier_resolution: "forwarder",
    status: "Unknown",
    status_detail: null,
    reference_code: null,
    package_count: null,
    greeting_name: null,
    provider_version: FORWARDER_PROVIDER_VERSION,
    fetched_at: now.toISOString(),
    fresh_until: hoursFrom(now, fields.hours),
    refresh_stopped: 0,
  });
  return getCache(row.id) ?? row;
}

function rememberForwarderReady(number: string, now: Date, parsed: Extract<ForwarderDocument, { kind: "ready" }>): CacheRow {
  const row = ensureForwarderRow(number, now);
  storeForwarderEvents(row.id, parsed, now);
  saveOutcome(row.id, now, {
    outcome: "ready",
    carrier_resolution: "forwarder",
    status: clip(parsed.status, 300),
    status_detail: null,
    origin: null,
    destination: parsed.destination,
    origin_country: null,
    destination_country: country(parsed.destination),
    eta: null,
    message: MSG.forwarderHistory,
    reference_code: parsed.reference,
    package_count: parsed.pieces,
    greeting_name: parsed.displayName,
    provider_version: FORWARDER_PROVIDER_VERSION,
    fetched_at: now.toISOString(),
    fresh_until: hoursFrom(now, 2),
    refresh_stopped: 0,
    consecutive_failures: 0,
  });
  return getCache(row.id) ?? row;
}

async function consultForwarder(number: string, now: Date, source: ForwarderSource) {
  const cached = findCache(number, FORWARDER_CARRIER_ID);
  if (cached && fresh(cached, now) && cached.providerVersion === FORWARDER_PROVIDER_VERSION) {
    return cached.outcome === "ready" ? response(cached, "ready", cached.message) : null;
  }
  let flight = forwarderFlights.get(number);
  if (!flight) {
    flight = source(number, now)
      .catch(() => ({ kind: "parser_failure" as const }))
      .finally(() => {
        forwarderFlights.delete(number);
      });
    forwarderFlights.set(number, flight);
  }
  const parsed = await flight;
  if (parsed.kind === "not_found") {
    rememberForwarder(number, now, { outcome: "not_found", message: null, hours: 0.5 });
    return null;
  }
  if (parsed.kind === "ready") {
    const row = rememberForwarderReady(number, now, parsed);
    return response(row, "ready", row.message);
  }
  const outcome: PublicState = parsed.kind === "timeout" ? "timeout" : parsed.kind === "throttled" ? "throttled" : "unavailable";
  rememberForwarder(number, now, {
    outcome,
    message: forwarderMessage(parsed.kind),
    hours: parsed.kind === "challenge" ? 0.5 : 1 / 6,
  });
  return null;
}

export async function publicLookup(trackingNumber: string, rateKey: string, now = new Date(), opts?: PublicLookupOptions) {
  if (!consumeRateLimit(`public-ip:${rateKey}`, IP_LIMIT, IP_WINDOW_MS, now)) {
    return { status: 429, body: { ok: false as const, error: MSG.tooMany } };
  }
  let norm: string;
  try {
    norm = normalizeTrackingNumber(trackingNumber);
  } catch (error) {
    const message = error instanceof TrackingInputError ? error.message : MSG.generic;
    return { status: 400, body: { ok: false as const, error: message } };
  }
  let carrierId: string | null = null;
  if (opts?.carrierId) {
    try {
      carrierId = cleanCarrierId(opts.carrierId);
    } catch (error) {
      const message = error instanceof TrackingInputError ? error.message : MSG.generic;
      return { status: 400, body: { ok: false as const, error: message } };
    }
    if (!carrierId || !isTrackableCarrier(carrierId)) {
      return { status: 400, body: { ok: false as const, error: "Choose a supported carrier." } };
    }
  }

  const source = opts?.forwarder ?? (process.env.TRACKING_FORWARDER === "0" ? null : fetchForwarderDocument);
  if (!carrierId && source) {
    const forwarderHit = await consultForwarder(norm, now, source);
    if (forwarderHit) return forwarderHit;
  }

  if (!carrierId) {
    const open = findCache(norm, null);
    if (open && jobOpen(open.id)) return pendingWithProgress(norm, open);
    const several = historiesResponse(norm, now);
    if (several) return several;
  }

  const cached = carrierId ? findCache(norm, carrierId) : pickCached(norm, now);
  if (cached && fresh(cached, now) && cached.outcome !== "pending" && cached.outcome !== "ambiguous") {
    touchInterest(cached.id, now);
    return response(cached, cached.outcome, cached.message);
  }
  if (cached && jobOpen(cached.id) && (cached.outcome === "ambiguous" || cached.outcome === "pending")) {
    return pendingWithProgress(norm, cached);
  }

  const settings = getSettings();
  if (outstanding() >= settings.publicOutstandingCap) {
    return { status: 429, body: { ok: false as const, error: MSG.busy } };
  }
  evictExpired(now);
  if (num(getDb().prepare("SELECT COUNT(*) AS n FROM public_track_cache").get()?.n) >= settings.publicMaxRows) {
    return { status: 429, body: { ok: false as const, error: MSG.cacheFull } };
  }
  const upgradingAmbiguity = cached?.outcome === "ambiguous";
  if (!upgradingAmbiguity && !consumeRateLimit("public-cold", settings.publicDailyCap, DAY_MS, now)) {
    return { status: 429, body: { ok: false as const, error: MSG.dailyLimit } };
  }

  const row = upsertPending(norm, carrierId, now);
  const inserted = enqueueJob(row.id, now);
  if (!inserted) {
    // Coalesced onto an existing job. The daily counter already incremented; that is one check.
  }
  if (opts?.processNow) {
    await processPublicJobAsync(row.id, opts.client ?? liveScraperClient(), now);
    const several = historiesResponse(norm, now);
    if (several) return several;
    const ready = listCache(norm).filter((item) => item.outcome === "ready" && item.carrierId);
    if (ready.length === 1) return response(ready[0]!, "ready", ready[0]!.message);
    const done = getCache(row.id);
    if (done) return response(done, done.outcome === "pending" ? "pending" : done.outcome, done.message);
  }
  const current = getCache(row.id) ?? row;
  if (jobOpen(current.id)) return pendingWithProgress(norm, current);
  return response(current, "pending", current.message ?? MSG.checking);
}

function pendingWithProgress(number: string, open: CacheRow) {
  const ready = listCache(number).filter((row) => row.outcome === "ready" && row.carrierId);
  const message = ready.length > 0 ? MSG.partialReady : MSG.checkingCarriers;
  if (ready.length > 1) {
    return {
      status: 200,
      body: {
        ok: true as const,
        state: "pending" as const,
        found: true,
        message,
        shipment: null,
        shipments: ready.map(view),
        candidates: [] as Array<{ id: string; name: string }>,
      },
    };
  }
  if (ready.length === 1) {
    return {
      status: 200,
      body: {
        ok: true as const,
        state: "pending" as const,
        found: true,
        message,
        shipment: view(ready[0]!),
        candidates: [] as Array<{ id: string; name: string }>,
      },
    };
  }
  return response(open, "pending", message);
}

/** Starts one public job immediately. The 60s scheduler tick remains the backup. */
export function startPublicWork(client?: ScraperClient): void {
  void runPublicPump({ client: client ?? liveScraperClient(), ignoreAdminBacklog: false }).catch(() => {
    console.error("[tracking] public dispatch failed");
  });
}

function pickCached(number: string, now: Date): CacheRow | null {
  const rows = listCache(number).filter((row) => row.carrierId !== FORWARDER_CARRIER_ID);
  const freshReady = rows.filter((row) => fresh(row, now) && row.outcome === "ready");
  if (freshReady.length === 1) return freshReady[0]!;
  const freshOther = rows.filter((row) => fresh(row, now) && row.outcome !== "pending" && row.outcome !== "ready");
  if (freshOther.length === 1) return freshOther[0]!;
  return rows.find((row) => row.carrierId === null) ?? (rows.length === 1 ? rows[0]! : null);
}

function getCache(id: string): CacheRow | null {
  const row = getDb().prepare("SELECT * FROM public_track_cache WHERE id = ?").get(id);
  return row ? mapRow(row) : null;
}

function upsertPending(number: string, carrierId: string | null, now: Date): CacheRow {
  const existing = findCache(number, carrierId);
  const iso = now.toISOString();
  if (existing) {
    getDb()
      .prepare(
        `UPDATE public_track_cache
         SET outcome = 'pending', message = ?, interest_until = ?, updated_at = ?
         WHERE id = ?`,
      )
      .run(MSG.checking, hoursFrom(now, getSettings().publicInterestHours), iso, existing.id);
    return getCache(existing.id) ?? existing;
  }
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO public_track_cache (
        id, tracking_number, carrier_id, carrier_resolution, carrier_candidates, status, outcome, message,
        interest_until, refresh_stopped, consecutive_failures, created_at, updated_at
      ) VALUES (?, ?, ?, ?, '[]', 'Unknown', 'pending', ?, ?, 0, 0, ?, ?)`,
    )
    .run(
      id,
      number,
      carrierId,
      carrierId ? "manual" : "unresolved",
      MSG.checking,
      hoursFrom(now, getSettings().publicInterestHours),
      iso,
      iso,
    );
  return getCache(id)!;
}

function enqueueJob(cacheId: string, now: Date): boolean {
  const result = getDb()
    .prepare(
      `INSERT INTO public_track_jobs (id, cache_id, state, created_at)
       SELECT ?, ?, 'queued', ?
       WHERE NOT EXISTS (
         SELECT 1 FROM public_track_jobs WHERE cache_id = ? AND state IN ('queued', 'running')
       )`,
    )
    .run(randomUUID(), cacheId, now.toISOString(), cacheId);
  return num(result.changes) > 0;
}

function finishJob(cacheId: string): void {
  getDb().prepare("DELETE FROM public_track_jobs WHERE cache_id = ?").run(cacheId);
  getDb().prepare("DELETE FROM public_track_claims WHERE cache_id = ?").run(cacheId);
}

function saveOutcome(id: string, now: Date, fields: Record<string, SqlValue | null>): void {
  const entries = Object.entries(fields);
  const sets = entries.map(([key]) => `${key} = ?`).join(", ");
  getDb()
    .prepare(`UPDATE public_track_cache SET ${sets}, updated_at = ? WHERE id = ?`)
    .run(...entries.map(([, value]) => value), now.toISOString(), id);
}

function freshHoursFor(outcome: PublicState, settingsHours: number): number {
  if (outcome === "ready") return settingsHours;
  if (outcome === "ambiguous" || outcome === "unsupported" || outcome === "rejected") return 24;
  if (outcome === "not_found" || outcome === "empty") return 1;
  return 0.25;
}

function country(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : null;
}

function clip(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

function storeEvents(cacheId: string, events: TrackEventBody[], now: Date): number {
  let kept = 0;
  for (const event of events.slice(0, 200)) {
    if (!event || typeof event.stage !== "string") continue;
    const description = clip(eventDescription(event), 1000);
    if (!description) continue;
    const occurredAt = eventTime(event);
    const location = event.location?.trim() ? clip(event.location.trim(), 300) : null;
    const result = getDb()
      .prepare(
        `INSERT INTO public_track_events (
          id, cache_id, fingerprint, occurred_at, status, description, location, stage, tie_order, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(cache_id, fingerprint) DO NOTHING`,
      )
      .run(
        randomUUID(),
        cacheId,
        eventFingerprint({
          time: occurredAt ?? "",
          stage: event.stage,
          description,
          location: location ?? "",
          tie: event.tie_order == null ? "" : String(event.tie_order),
        }),
        occurredAt,
        mapStage(event.stage, description),
        description,
        location,
        event.stage,
        typeof event.tie_order === "number" ? event.tie_order : null,
        now.toISOString(),
      );
    if (num(result.changes) > 0) kept += 1;
  }
  return kept;
}

function applyBody(row: CacheRow, body: TrackBody, now: Date): void {
  const settings = getSettings();
  if (!body || body.carrier !== row.carrierId) {
    saveOutcome(row.id, now, {
      outcome: "empty",
      message: MSG.mismatch,
      fetched_at: now.toISOString(),
      fresh_until: hoursFrom(now, 1),
      refresh_stopped: 0,
    });
    return;
  }
  const result = body.result ?? {};
  const events = Array.isArray(result.events) ? result.events : [];
  storeEvents(row.id, events, now);
  const detailSource =
    (typeof result.last_status_text === "string" && result.last_status_text.trim()) ||
    (events.length ? eventDescription(events[events.length - 1]!) : "");
  const detail = detailSource ? clip(detailSource, 1000) : null;
  let status: ShipmentStatus = result.current_stage
    ? shipmentStatusFromResult(result.current_stage, detail)
    : "Unknown";
  if (!result.current_stage && events.length > 0) {
    status = mapStage(events[events.length - 1]!.stage, eventDescription(events[events.length - 1]!));
  }
  const eventCount = num(
    getDb().prepare("SELECT COUNT(*) AS n FROM public_track_events WHERE cache_id = ?").get(row.id)?.n,
  );
  const hasStatus = Boolean(result.current_stage) || status !== "Unknown";
  if (!hasStatus && eventCount === 0) {
    saveOutcome(row.id, now, {
      outcome: "empty",
      status: "Unknown",
      status_detail: null,
      message: MSG.emptyResult,
      fetched_at: now.toISOString(),
      fresh_until: hoursFrom(now, 1),
      carrier_resolution: "confirmed",
      consecutive_failures: 0,
    });
    return;
  }
  const terminal = status === "Delivered" || status === "Returned to Sender";
  let eta: string | null = row.eta;
  if (result.expected_delivery_withdrawn === true || result.expected_delivery === null) eta = null;
  else if (typeof result.expected_delivery === "string" && result.expected_delivery.trim()) {
    eta = clip(result.expected_delivery.trim(), 80);
  }
  saveOutcome(row.id, now, {
    outcome: "ready",
    status,
    status_detail: detail,
    eta,
    message: null,
    fetched_at: now.toISOString(),
    fresh_until: hoursFrom(now, terminal ? 24 * 7 : settings.publicFreshHours),
    next_check_at: terminal ? null : hoursFrom(now, settings.publicFreshHours),
    refresh_stopped: terminal ? 1 : 0,
    carrier_resolution: "confirmed",
    consecutive_failures: 0,
    origin_country: row.originCountry ?? country(result.origin_country),
    destination_country: row.destinationCountry ?? country(result.destination_country),
  });
}

function historiesResponse(number: string, now: Date) {
  const rows = listCache(number).filter(
    (row) => fresh(row, now) && row.outcome === "ready" && row.carrierId && row.carrierId !== FORWARDER_CARRIER_ID,
  );
  if (rows.length < 2) return null;
  return {
    status: 200,
    body: {
      ok: true as const,
      state: "multiple" as const,
      found: true,
      message: MSG.severalHistories,
      shipment: null,
      shipments: rows.map(view),
      candidates: [] as Array<{ id: string; name: string }>,
    },
  };
}

function echoedTrackingNumber(body: TrackBody): string | null {
  const bag = body as unknown as Record<string, unknown>;
  const result = (body.result ?? {}) as unknown as Record<string, unknown>;
  for (const value of [bag.trackingNumber, bag.tracking_number, bag.number, result.trackingNumber, result.tracking_number, result.number]) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function isGenuine(body: TrackBody, askedCarrier: string, number: string): boolean {
  if (body.carrier !== askedCarrier || !isTrackableCarrier(body.carrier)) return false;
  const echoed = echoedTrackingNumber(body);
  if (echoed) {
    try {
      if (normalizeTrackingNumber(echoed) !== number) return false;
    } catch {
      return false;
    }
  }
  return (body.result?.events ?? []).some((event) => eventDescription(event).length > 0);
}

function ensureCarrierRow(number: string, carrierId: string, now: Date): CacheRow {
  const existing = findCache(number, carrierId);
  if (existing) return existing;
  const id = randomUUID();
  const iso = now.toISOString();
  getDb()
    .prepare(
      `INSERT INTO public_track_cache (
        id, tracking_number, carrier_id, carrier_resolution, carrier_candidates, status, outcome, message,
        interest_until, refresh_stopped, consecutive_failures, created_at, updated_at
      ) VALUES (?, ?, ?, 'pattern', '[]', 'Unknown', 'pending', NULL, ?, 0, 0, ?, ?)`,
    )
    .run(id, number, carrierId, hoursFrom(now, getSettings().publicInterestHours), iso, iso);
  return getCache(id)!;
}

async function fanoutCandidates(row: CacheRow, candidates: string[], client: ScraperClient, now: Date): Promise<void> {
  const list = [...new Set(candidates.filter((id) => isTrackableCarrier(id)))].slice(0, MAX_CANDIDATES);
  const configured = Number(process.env.TRACKING_PUBLIC_FANOUT_MS ?? "20000");
  const budget = Number.isFinite(configured) ? Math.min(25_000, Math.max(1000, configured)) : 20_000;
  const deadline = Date.now() + budget;
  const started = Date.now();
  const attempts: Array<{ carrier: string; outcome: string }> = [];
  const matches: Array<{ carrier: string; body: TrackBody }> = [];
  let cursor = 0;

  async function worker() {
    for (;;) {
      if (deadline - Date.now() < 3000) return;
      const index = cursor;
      if (index >= list.length) return;
      cursor += 1;
      const carrier = list[index]!;
      const remaining = Math.max(1000, Math.min(12_000, deadline - Date.now()));
      try {
        const body = await client.track({ number: row.trackingNumber, carrier, budgetMs: remaining });
        if (isGenuine(body, carrier, row.trackingNumber)) {
          const stored = ensureCarrierRow(row.trackingNumber, carrier, now);
          applyBody({ ...stored, carrierId: carrier }, body, now);
          matches.push({ carrier, body });
          attempts.push({ carrier, outcome: "ready" });
        } else {
          attempts.push({ carrier, outcome: "empty" });
        }
      } catch (error) {
        attempts.push({ carrier, outcome: error instanceof ScraperError ? error.kind : "unavailable" });
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(FANOUT_CONCURRENCY, list.length) }, () => worker()));
  for (let index = cursor; index < list.length; index += 1) {
    attempts.push({ carrier: list[index]!, outcome: "timeout" });
  }
  writeProviderLog({
    shipmentId: null,
    carrierId: null,
    outcome: "fanout",
    httpStatus: null,
    durationMs: Date.now() - started,
    errorKind: `attempts:${attempts.length}`,
    now,
  });
  if (matches.length > 0) {
    getDb().prepare("DELETE FROM public_track_cache WHERE id = ?").run(row.id);
    return;
  }
  const timedOut = attempts.length > 0 && attempts.every((item) => item.outcome === "timeout" || item.outcome === "budget" || item.outcome === "transport");
  saveOutcome(row.id, now, {
    outcome: timedOut ? "timeout" : "not_found",
    message: timedOut ? MSG.timedOutSearch : MSG.noHistory,
    attempt_log: JSON.stringify(attempts),
    carrier_candidates: JSON.stringify(list),
    carrier_resolution: "unresolved",
    fetched_at: now.toISOString(),
    fresh_until: hoursFrom(now, timedOut ? 0.25 : 1),
    refresh_stopped: 0,
  });
}

export async function processPublicJobAsync(cacheId: string, client: ScraperClient, now: Date): Promise<void> {
  const initial = getCache(cacheId);
  if (!initial) {
    finishJob(cacheId);
    return;
  }
  try {
    const healthy = await client.health();
    if (!healthy) {
      saveOutcome(initial.id, now, {
        outcome: "unavailable",
        message: MSG.serviceDown,
        fetched_at: now.toISOString(),
        fresh_until: hoursFrom(now, 0.25),
      });
      return;
    }
    let carrierId = initial.carrierId;
    if (!carrierId) {
      const detected = await client.detect(initial.trackingNumber);
      const decision = interpretDetection(detected);
      saveOutcome(initial.id, now, { carrier_candidates: JSON.stringify(decision.candidates) });
      if (decision.kind === "ambiguous") {
        await fanoutCandidates(initial, decision.candidates, client, now);
        return;
      }
      if (decision.kind !== "unique") {
        saveOutcome(initial.id, now, {
          outcome: "unsupported",
          carrier_resolution: "unsupported",
          message: decision.kind === "none" ? MSG.notSupportedNumber : MSG.unsupported,
          fetched_at: now.toISOString(),
          fresh_until: hoursFrom(now, 24),
          refresh_stopped: 1,
        });
        return;
      }
      carrierId = decision.carrierId;
      saveOutcome(initial.id, now, { carrier_id: carrierId, carrier_resolution: "pattern" });
    }
    const current = getCache(initial.id) ?? initial;
    const body = await client.track({
      number: current.trackingNumber,
      carrier: carrierId,
      budgetMs: Number(process.env.TRACKING_BUDGET_MS ?? "20000") || 20_000,
    });
    applyBody({ ...current, carrierId }, body, now);
  } catch (error) {
    const current = getCache(initial.id) ?? initial;
    if (error instanceof ScraperError) {
      const field = scraperField(error);
      const outcome: PublicState =
        error.kind === "not_found"
          ? "not_found"
          : error.kind === "invalid_input"
            ? "rejected"
            : error.kind === "budget" || error.kind === "transport"
              ? "timeout"
              : error.kind === "rate_limited" || error.kind === "challenge"
                ? "throttled"
                : "unavailable";
      const message =
        outcome === "not_found"
          ? MSG.notFound
          : outcome === "rejected"
            ? MSG.rejected
            : outcome === "timeout"
              ? MSG.timeout
              : outcome === "throttled"
                ? MSG.throttled
                : field === "postcode"
                  ? MSG.postcode
                  : outcome === "unavailable"
                    ? MSG.serviceDown
                    : MSG.unusable;
      saveOutcome(current.id, now, {
        outcome,
        message,
        fetched_at: now.toISOString(),
        fresh_until: hoursFrom(now, freshHoursFor(outcome, 1)),
        consecutive_failures: Math.min(8, current.consecutiveFailures + 1),
        refresh_stopped: outcome === "rejected" ? 1 : 0,
      });
      return;
    }
    saveOutcome(current.id, now, {
      outcome: "unavailable",
      message: MSG.serviceDown,
      fetched_at: now.toISOString(),
      fresh_until: hoursFrom(now, 0.25),
    });
  } finally {
    finishJob(cacheId);
  }
}

export async function runPublicPump(opts?: {
  client?: ScraperClient;
  now?: Date;
  limit?: number;
  ignoreAdminBacklog?: boolean;
}): Promise<number> {
  const now = opts?.now ?? new Date();
  const settings = getSettings();
  if (!opts?.ignoreAdminBacklog && countAdminDue(now) > settings.globalConcurrency) return 0;
  const client = opts?.client ?? liveScraperClient();
  const limit = Math.min(opts?.limit ?? settings.publicConcurrency, settings.publicConcurrency);
  const ids = claimPublic(limit, now);
  for (const id of ids) {
    await processPublicJobAsync(id, client, now);
  }
  return ids.length;
}

function claimPublic(limit: number, now: Date): string[] {
  const nowIso = now.toISOString();
  const exp = new Date(now.getTime() + 120_000).toISOString();
  return withImmediate((db) => {
    db.prepare("DELETE FROM public_track_claims WHERE expires_at <= ?").run(nowIso);
    db.prepare(
      `UPDATE public_track_jobs SET state = 'queued'
       WHERE state = 'running' AND cache_id NOT IN (SELECT cache_id FROM public_track_claims)`,
    ).run();
    const rows = db
      .prepare(
        `SELECT j.cache_id AS cache_id, COALESCE(c.carrier_id, '') AS carrier_id
         FROM public_track_jobs j
         JOIN public_track_cache c ON c.id = j.cache_id
         WHERE j.state = 'queued'
           AND j.cache_id NOT IN (SELECT cache_id FROM public_track_claims)
         ORDER BY j.created_at`,
      )
      .all();
    const taken = new Map<string, number>();
    const chosen: string[] = [];
    for (const row of rows) {
      if (chosen.length >= limit) break;
      const carrier = text(row.carrier_id) || "_open";
      if ((taken.get(carrier) ?? 0) >= 1) continue;
      taken.set(carrier, 1);
      const id = text(row.cache_id);
      if (id) chosen.push(id);
    }
    const insert = db.prepare("INSERT INTO public_track_claims (cache_id, owner, expires_at) VALUES (?, 'public', ?)");
    const mark = db.prepare("UPDATE public_track_jobs SET state = 'running' WHERE cache_id = ? AND state = 'queued'");
    for (const id of chosen) {
      insert.run(id, exp);
      mark.run(id);
    }
    return chosen;
  });
}

export function failQueuedPublicAsUnavailable(now: Date): number {
  const rows = getDb()
    .prepare("SELECT cache_id FROM public_track_jobs WHERE state IN ('queued', 'running')")
    .all();
  for (const row of rows) {
    const id = text(row.cache_id);
    if (!id) continue;
    saveOutcome(id, now, {
      outcome: "unavailable",
      message: MSG.serviceDown,
      fetched_at: now.toISOString(),
      fresh_until: hoursFrom(now, 0.25),
    });
    finishJob(id);
  }
  return rows.length;
}

export function enqueueStalePublic(now: Date): number {
  const settings = getSettings();
  const rows = getDb()
    .prepare(
      `SELECT id FROM public_track_cache
       WHERE refresh_stopped = 0
         AND outcome = 'ready'
         AND interest_until IS NOT NULL AND interest_until > ?
         AND fresh_until IS NOT NULL AND fresh_until <= ?
         AND id NOT IN (SELECT cache_id FROM public_track_jobs WHERE state IN ('queued', 'running'))
       ORDER BY fresh_until ASC
       LIMIT 2`,
    )
    .all(now.toISOString(), now.toISOString());
  let queued = 0;
  if (outstanding() >= settings.publicOutstandingCap) return 0;
  for (const row of rows) {
    const id = text(row.id);
    if (!id) continue;
    if (enqueueJob(id, now)) queued += 1;
  }
  return queued;
}
