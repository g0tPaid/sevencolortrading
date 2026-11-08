import { createHash, randomUUID } from "crypto";
import type { DatabaseSync, SqlValue } from "node:sqlite";
import { getDb, withImmediate } from "@/lib/tracking/db";
import {
  TERMINAL_STATUSES,
  TrackingInputError,
  type CarrierResolution,
  type ProviderLog,
  type Shipment,
  type ShipmentEvent,
  type ShipmentStatus,
  type TrackingSettings,
} from "@/lib/tracking/types";

type Row = Record<string, SqlValue>;

function text(value: SqlValue | undefined): string | null {
  if (typeof value === "string") return value;
  return null;
}

function num(value: SqlValue | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  return 0;
}

function mapShipment(row: Row): Shipment {
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
    customerRef: text(row.customer_ref),
    customerName: text(row.customer_name),
    orderNumber: text(row.order_number),
    trackingNumber: text(row.tracking_number) ?? "",
    carrierId: text(row.carrier_id),
    carrierResolution: (text(row.carrier_resolution) ?? "unresolved") as CarrierResolution,
    carrierCandidates: candidates,
    origin: text(row.origin),
    destination: text(row.destination),
    originCountry: text(row.origin_country),
    destinationCountry: text(row.destination_country),
    postcode: text(row.postcode),
    phoneLast4: text(row.phone_last4),
    status: (text(row.status) ?? "Unknown") as ShipmentStatus,
    statusDetail: text(row.status_detail),
    eta: text(row.eta),
    lastEventAt: text(row.last_event_at),
    lastRefreshedAt: text(row.last_refreshed_at),
    nextCheckAt: text(row.next_check_at),
    refreshStopped: num(row.refresh_stopped) === 1,
    consecutiveFailures: num(row.consecutive_failures),
    lastError: text(row.last_error),
    notes: text(row.notes),
    createdAt: text(row.created_at) ?? "",
    updatedAt: text(row.updated_at) ?? "",
  };
}

function mapEvent(row: Row): ShipmentEvent {
  return {
    id: text(row.id) ?? "",
    shipmentId: text(row.shipment_id) ?? "",
    fingerprint: text(row.fingerprint) ?? "",
    occurredAt: text(row.occurred_at),
    status: (text(row.status) ?? "Unknown") as ShipmentStatus,
    description: text(row.description) ?? "",
    location: text(row.location),
    stage: text(row.stage),
    tieOrder: row.tie_order == null ? null : num(row.tie_order),
    createdAt: text(row.created_at) ?? "",
  };
}

function mapLog(row: Row): ProviderLog {
  return {
    id: text(row.id) ?? "",
    shipmentId: text(row.shipment_id),
    carrierId: text(row.carrier_id),
    outcome: text(row.outcome) ?? "",
    httpStatus: row.http_status == null ? null : num(row.http_status),
    durationMs: row.duration_ms == null ? null : num(row.duration_ms),
    errorKind: text(row.error_kind),
    createdAt: text(row.created_at) ?? "",
  };
}

export function getSettings(): TrackingSettings {
  const row = getDb().prepare("SELECT * FROM tracking_settings WHERE id = 1").get();
  if (!row) throw new Error("tracking settings missing");
  return {
    newIntervalHours: num(row.new_interval_hours),
    activeIntervalHours: num(row.active_interval_hours),
    stalledIntervalHours: num(row.stalled_interval_hours),
    stalledAfterHours: num(row.stalled_after_hours),
    maxConsecutiveFailures: num(row.max_consecutive_failures),
    globalConcurrency: num(row.global_concurrency),
    perCarrierConcurrency: num(row.per_carrier_concurrency),
    perCarrierGapMs: num(row.per_carrier_gap_ms),
    publicRefreshCooldownMinutes: num(row.public_refresh_cooldown_minutes),
    publicDailyCap: num(row.public_daily_cap) || 2000,
    publicFreshHours: num(row.public_fresh_hours) || 6,
    publicInterestHours: num(row.public_interest_hours) || 48,
    publicMaxRows: num(row.public_max_rows) || 2000,
    publicConcurrency: num(row.public_concurrency) || 1,
    publicOutstandingCap: num(row.public_outstanding_cap) || 20,
    updatedAt: text(row.updated_at) ?? "",
  };
}

export function saveSettings(settings: TrackingSettings, now: Date): TrackingSettings {
  getDb()
    .prepare(
      `UPDATE tracking_settings SET
        new_interval_hours = ?,
        active_interval_hours = ?,
        stalled_interval_hours = ?,
        stalled_after_hours = ?,
        max_consecutive_failures = ?,
        global_concurrency = ?,
        per_carrier_concurrency = ?,
        per_carrier_gap_ms = ?,
        public_refresh_cooldown_minutes = ?,
        public_daily_cap = ?,
        public_fresh_hours = ?,
        public_interest_hours = ?,
        public_max_rows = ?,
        public_concurrency = ?,
        public_outstanding_cap = ?,
        updated_at = ?
      WHERE id = 1`,
    )
    .run(
      settings.newIntervalHours,
      settings.activeIntervalHours,
      settings.stalledIntervalHours,
      settings.stalledAfterHours,
      settings.maxConsecutiveFailures,
      settings.globalConcurrency,
      settings.perCarrierConcurrency,
      settings.perCarrierGapMs,
      settings.publicRefreshCooldownMinutes,
      settings.publicDailyCap,
      settings.publicFreshHours,
      settings.publicInterestHours,
      settings.publicMaxRows,
      settings.publicConcurrency,
      settings.publicOutstandingCap,
      now.toISOString(),
    );
  return getSettings();
}

const SETTING_BOUNDS: Record<keyof Omit<TrackingSettings, "updatedAt">, [number, number]> = {
  newIntervalHours: [4, 6],
  activeIntervalHours: [8, 12],
  stalledIntervalHours: [12, 24],
  stalledAfterHours: [24, 168],
  maxConsecutiveFailures: [3, 12],
  globalConcurrency: [1, 4],
  perCarrierConcurrency: [1, 2],
  perCarrierGapMs: [500, 60_000],
  publicRefreshCooldownMinutes: [5, 60],
  publicDailyCap: [100, 20_000],
  publicFreshHours: [1, 24],
  publicInterestHours: [1, 168],
  publicMaxRows: [100, 20_000],
  publicConcurrency: [1, 2],
  publicOutstandingCap: [5, 100],
};

export function validateSettings(input: Record<string, unknown>): TrackingSettings {
  const current = getSettings();
  const next: TrackingSettings = { ...current, updatedAt: current.updatedAt };
  for (const key of Object.keys(SETTING_BOUNDS) as Array<keyof typeof SETTING_BOUNDS>) {
    if (!(key in input)) continue;
    const value = input[key];
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TrackingInputError("Scheduler settings must be numbers inside the allowed bounds.");
    }
    const [min, max] = SETTING_BOUNDS[key];
    if (value < min || value > max) {
      throw new TrackingInputError("Scheduler settings must be numbers inside the allowed bounds.");
    }
    next[key] = value;
  }
  return next;
}

export type NewShipment = {
  trackingNumber: string;
  customerRef: string | null;
  customerName: string | null;
  orderNumber: string | null;
  carrierId: string | null;
  carrierResolution: CarrierResolution;
  origin: string | null;
  destination: string | null;
  postcode: string | null;
  phoneLast4: string | null;
  notes: string | null;
  status: ShipmentStatus;
  lastError: string | null;
  refreshStopped: boolean;
  nextCheckAt: string | null;
};

export function insertShipment(input: NewShipment, now: Date): Shipment {
  const id = randomUUID();
  const iso = now.toISOString();
  try {
    getDb()
      .prepare(
        `INSERT INTO shipments (
          id, customer_ref, customer_name, order_number, tracking_number, tracking_number_norm,
          carrier_id, carrier_resolution, carrier_candidates, origin, destination, origin_country,
          destination_country, postcode, phone_last4, status, status_detail, eta, last_event_at,
          last_refreshed_at, next_check_at, refresh_stopped, consecutive_failures, last_error, notes,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, ?, NULL, NULL, ?, ?, ?, NULL, NULL, NULL, NULL, ?, ?, 0, ?, ?, ?, ?
        )`,
      )
      .run(
        id,
        input.customerRef,
        input.customerName,
        input.orderNumber,
        input.trackingNumber,
        input.trackingNumber,
        input.carrierId,
        input.carrierResolution,
        input.origin,
        input.destination,
        input.postcode,
        input.phoneLast4,
        input.status,
        input.nextCheckAt,
        input.refreshStopped ? 1 : 0,
        input.lastError,
        input.notes,
        iso,
        iso,
      );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/UNIQUE/i.test(message)) {
      throw new TrackingInputError("A shipment with this tracking number and carrier already exists.");
    }
    throw error;
  }
  return getShipment(id)!;
}

export function getShipment(id: string): Shipment | null {
  const row = getDb().prepare("SELECT * FROM shipments WHERE id = ?").get(id);
  return row ? mapShipment(row) : null;
}

export function findByTracking(norm: string, carrierId: string | null): Shipment | null {
  const row = carrierId
    ? getDb()
        .prepare("SELECT * FROM shipments WHERE tracking_number_norm = ? AND carrier_id = ?")
        .get(norm, carrierId)
    : getDb()
        .prepare("SELECT * FROM shipments WHERE tracking_number_norm = ? AND carrier_id IS NULL")
        .get(norm);
  return row ? mapShipment(row) : null;
}

export function listByTracking(norm: string): Shipment[] {
  return getDb()
    .prepare(
      `SELECT * FROM shipments
       WHERE tracking_number_norm = ?
       ORDER BY updated_at DESC`,
    )
    .all(norm)
    .map(mapShipment);
}

function like(value: string): string {
  return `%${value.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}

export function searchShipments(query: {
  q?: string;
  carrierId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): { shipments: Shipment[]; total: number } {
  const q = (query.q ?? "").trim().toLowerCase();
  const carrier = query.carrierId ?? "";
  const status = query.status ?? "";
  const limit = Math.min(Math.max(query.limit ?? 50, 1), 200);
  const offset = Math.min(Math.max(query.offset ?? 0, 0), 10_000);
  const pattern = like(q);
  const where = `
    WHERE (? = '' OR lower(tracking_number) LIKE ? ESCAPE '\\'
      OR lower(coalesce(customer_name, '')) LIKE ? ESCAPE '\\'
      OR lower(coalesce(order_number, '')) LIKE ? ESCAPE '\\'
      OR lower(coalesce(customer_ref, '')) LIKE ? ESCAPE '\\')
      AND (? = '' OR carrier_id = ?)
      AND (? = '' OR status = ?)
  `;
  const args: SqlValue[] = [q, pattern, pattern, pattern, pattern, carrier, carrier, status, status];
  const total = num(
    getDb().prepare(`SELECT COUNT(*) AS n FROM shipments ${where}`).get(...args)?.n,
  );
  const shipments = getDb()
    .prepare(`SELECT * FROM shipments ${where} ORDER BY updated_at DESC LIMIT ? OFFSET ?`)
    .all(...args, limit, offset)
    .map(mapShipment);
  return { shipments, total };
}

export function updateShipmentRow(id: string, fields: Record<string, SqlValue | undefined>, now: Date): void {
  const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
  if (entries.length === 0) return;
  const sets = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = entries.map(([, value]) => (value === undefined ? null : value));
  getDb()
    .prepare(`UPDATE shipments SET ${sets}, updated_at = ? WHERE id = ?`)
    .run(...values, now.toISOString(), id);
}

export function deleteShipment(id: string): boolean {
  const result = getDb().prepare("DELETE FROM shipments WHERE id = ?").run(id);
  return num(result.changes) > 0;
}

export function listEvents(shipmentId: string): ShipmentEvent[] {
  return getDb()
    .prepare(
      `SELECT * FROM shipment_events
       WHERE shipment_id = ?
       ORDER BY COALESCE(occurred_at, created_at) ASC, COALESCE(tie_order, 0) ASC`,
    )
    .all(shipmentId)
    .map(mapEvent);
}

export function insertEventIgnore(event: Omit<ShipmentEvent, "id" | "createdAt">, now: Date): boolean {
  const result = getDb()
    .prepare(
      `INSERT INTO shipment_events (
        id, shipment_id, fingerprint, occurred_at, status, description, location, stage, tie_order, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(shipment_id, fingerprint) DO NOTHING`,
    )
    .run(
      randomUUID(),
      event.shipmentId,
      event.fingerprint,
      event.occurredAt,
      event.status,
      event.description,
      event.location,
      event.stage,
      event.tieOrder,
      now.toISOString(),
    );
  return num(result.changes) > 0;
}

export function listLogs(shipmentId: string): ProviderLog[] {
  return getDb()
    .prepare(
      `SELECT * FROM tracking_provider_logs
       WHERE shipment_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
    )
    .all(shipmentId)
    .map(mapLog);
}

export function writeProviderLog(entry: {
  shipmentId: string | null;
  carrierId: string | null;
  outcome: string;
  httpStatus: number | null;
  durationMs: number | null;
  errorKind: string | null;
  now: Date;
}): void {
  getDb()
    .prepare(
      `INSERT INTO tracking_provider_logs (
        id, shipment_id, carrier_id, outcome, http_status, duration_ms, error_kind, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      randomUUID(),
      entry.shipmentId,
      entry.carrierId,
      entry.outcome,
      entry.httpStatus,
      entry.durationMs,
      entry.errorKind,
      entry.now.toISOString(),
    );
}

export function consumeRateLimit(bucket: string, limit: number, windowMs: number, now: Date): boolean {
  const start = Math.floor(now.getTime() / windowMs) * windowMs;
  const key = createHash("sha256").update(bucket).digest("hex").slice(0, 24);
  const count = withImmediate((db) => {
    db.prepare("DELETE FROM tracking_rate_limits WHERE window_start < ?").run(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    db.prepare(
      `INSERT INTO tracking_rate_limits (bucket, window_start, count) VALUES (?, ?, 1)
       ON CONFLICT(bucket, window_start) DO UPDATE SET count = count + 1`,
    ).run(key, start);
    return num(db.prepare("SELECT count AS n FROM tracking_rate_limits WHERE bucket = ? AND window_start = ?").get(key, start)?.n);
  });
  return count <= limit;
}

export type QueueResult = "queued" | "already_queued" | "stopped" | "missing";

export function enqueueRefresh(shipmentId: string, requestedBy: string, now: Date): QueueResult {
  return withImmediate((db) => enqueueRefreshOn(db, shipmentId, requestedBy, now));
}

function enqueueRefreshOn(db: DatabaseSync, shipmentId: string, requestedBy: string, now: Date): QueueResult {
  const row = db.prepare("SELECT refresh_stopped, status FROM shipments WHERE id = ?").get(shipmentId);
  if (!row) return "missing";
  const status = text(row.status) as ShipmentStatus;
  if (num(row.refresh_stopped) === 1 || TERMINAL_STATUSES.has(status)) return "stopped";
  const result = db
    .prepare(
      `INSERT INTO tracking_refresh_queue (id, shipment_id, state, requested_by, created_at)
       SELECT ?, ?, 'queued', ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM tracking_refresh_queue
         WHERE shipment_id = ? AND state IN ('queued', 'running')
       )`,
    )
    .run(randomUUID(), shipmentId, requestedBy, now.toISOString(), shipmentId);
  if (num(result.changes) === 0) return "already_queued";
  db.prepare(
    `UPDATE shipments SET next_check_at = ?, updated_at = ? WHERE id = ? AND refresh_stopped = 0`,
  ).run(now.toISOString(), now.toISOString(), shipmentId);
  return "queued";
}

export function enqueueDue(now: Date): number {
  return withImmediate((db) => {
    const result = db
      .prepare(
        `INSERT INTO tracking_refresh_queue (id, shipment_id, state, requested_by, created_at)
         SELECT lower(hex(randomblob(16))), id, 'queued', 'scheduler', ?
         FROM shipments
         WHERE refresh_stopped = 0
           AND next_check_at IS NOT NULL
           AND next_check_at <= ?
           AND id NOT IN (
             SELECT shipment_id FROM tracking_refresh_queue WHERE state IN ('queued', 'running')
           )`,
      )
      .run(now.toISOString(), now.toISOString());
    return num(result.changes);
  });
}

export function postponeDue(now: Date, delayMs: number, message: string): number {
  const next = new Date(now.getTime() + delayMs).toISOString();
  const result = getDb()
    .prepare(
      `UPDATE shipments
       SET next_check_at = ?, last_error = ?, updated_at = ?
       WHERE refresh_stopped = 0 AND next_check_at IS NOT NULL AND next_check_at <= ?`,
    )
    .run(next, message, now.toISOString(), now.toISOString());
  return num(result.changes);
}

export function claimQueued(limit: number, owner: string, now: Date, ttlMs: number, perCarrier: number): string[] {
  const nowIso = now.toISOString();
  const exp = new Date(now.getTime() + ttlMs).toISOString();
  return withImmediate((db) => {
    db.prepare("DELETE FROM tracking_work_claims WHERE expires_at <= ?").run(nowIso);
    db.prepare(
      `UPDATE tracking_refresh_queue
       SET state = 'queued'
       WHERE state = 'running'
         AND shipment_id NOT IN (SELECT shipment_id FROM tracking_work_claims)`,
    ).run();
    const rows = db
      .prepare(
        `SELECT q.shipment_id AS shipment_id, COALESCE(s.carrier_id, '') AS carrier_id
         FROM tracking_refresh_queue q
         JOIN shipments s ON s.id = q.shipment_id
         LEFT JOIN tracking_carrier_leases l ON l.carrier_id = COALESCE(s.carrier_id, '_unresolved')
         WHERE q.state = 'queued'
           AND s.refresh_stopped = 0
           AND q.shipment_id NOT IN (SELECT shipment_id FROM tracking_work_claims)
           AND (l.next_allowed_at IS NULL OR l.next_allowed_at <= ?)
         ORDER BY q.created_at`,
      )
      .all(nowIso);
    const taken = new Map<string, number>();
    const chosen: string[] = [];
    for (const row of rows) {
      if (chosen.length >= limit) break;
      const carrier = text(row.carrier_id) || "_unresolved";
      const count = taken.get(carrier) ?? 0;
      if (count >= perCarrier) continue;
      taken.set(carrier, count + 1);
      const id = text(row.shipment_id);
      if (id) chosen.push(id);
    }
    const insert = db.prepare(
      "INSERT INTO tracking_work_claims (shipment_id, owner, expires_at, purpose) VALUES (?, ?, ?, 'refresh')",
    );
    const mark = db.prepare(
      "UPDATE tracking_refresh_queue SET state = 'running' WHERE shipment_id = ? AND state = 'queued'",
    );
    for (const id of chosen) {
      insert.run(id, owner, exp);
      mark.run(id);
    }
    return chosen;
  });
}

export function releaseShipment(shipmentId: string): void {
  const db = getDb();
  db.prepare("DELETE FROM tracking_work_claims WHERE shipment_id = ?").run(shipmentId);
  db.prepare("DELETE FROM tracking_refresh_queue WHERE shipment_id = ?").run(shipmentId);
}

export function setCarrierLease(carrierId: string, untilIso: string): void {
  getDb()
    .prepare(
      `INSERT INTO tracking_carrier_leases (carrier_id, next_allowed_at) VALUES (?, ?)
       ON CONFLICT(carrier_id) DO UPDATE SET next_allowed_at = excluded.next_allowed_at`,
    )
    .run(carrierId, untilIso);
}

export function countOpenQueue(): number {
  return num(getDb().prepare("SELECT COUNT(*) AS n FROM tracking_refresh_queue").get()?.n);
}

export function countAdminDue(now: Date): number {
  return num(
    getDb()
      .prepare(
        `SELECT COUNT(*) AS n FROM shipments
         WHERE refresh_stopped = 0 AND next_check_at IS NOT NULL AND next_check_at <= ?`,
      )
      .get(now.toISOString())?.n,
  );
}
