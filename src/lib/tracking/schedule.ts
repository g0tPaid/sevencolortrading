import { TERMINAL_STATUSES, type Shipment, type TrackingSettings } from "@/lib/tracking/types";

export type Cadence = "new" | "active" | "stalled" | "stopped";

const BACKOFF_BASE_MS = 30 * 60 * 1000;

export function parseTime(value: string | null | undefined): number | null {
  if (!value) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

export function shipmentCadence(shipment: Shipment, settings: TrackingSettings, now: Date): Cadence {
  if (shipment.refreshStopped || TERMINAL_STATUSES.has(shipment.status)) return "stopped";
  const created = parseTime(shipment.createdAt);
  const ageMs = created == null ? Number.POSITIVE_INFINITY : now.getTime() - created;
  const fresh = ageMs <= 24 * 60 * 60 * 1000;
  if (!shipment.lastRefreshedAt || !shipment.lastEventAt) return "new";
  if (fresh && (shipment.status === "Information Received" || shipment.status === "Unknown")) return "new";
  const moved = parseTime(shipment.lastEventAt);
  if (moved == null) return "active";
  const quietHours = (now.getTime() - moved) / (60 * 60 * 1000);
  if (quietHours >= settings.stalledAfterHours) return "stalled";
  return "active";
}

export function cadenceHours(cadence: Cadence, settings: TrackingSettings): number | null {
  if (cadence === "stopped") return null;
  if (cadence === "new") return settings.newIntervalHours;
  if (cadence === "stalled") return settings.stalledIntervalHours;
  return settings.activeIntervalHours;
}

export function nextCheckIso(shipment: Shipment, settings: TrackingSettings, now: Date): string | null {
  const hours = cadenceHours(shipmentCadence(shipment, settings, now), settings);
  if (hours == null) return null;
  return new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
}

/** Exponential delay capped at the stalled interval, with +/- 10% jitter. */
export function backoffMs(failures: number, capMs: number, rng: () => number = Math.random): number {
  const steps = Math.max(0, Math.min(failures, 12) - 1);
  const exp = Math.min(capMs, BACKOFF_BASE_MS * 2 ** steps);
  const jitter = exp * 0.1 * (rng() * 2 - 1);
  return Math.max(60_000, Math.round(exp + jitter));
}

export function stalledCapMs(settings: TrackingSettings): number {
  return settings.stalledIntervalHours * 60 * 60 * 1000;
}
