import { carrierById, isTrackableCarrier } from "@/lib/tracking/carriers";
import { eventFingerprint } from "@/lib/tracking/fingerprint";
import { MSG } from "@/lib/tracking/messages";
import { backoffMs, nextCheckIso, stalledCapMs } from "@/lib/tracking/schedule";
import { liveScraperClient, scraperField, type ScraperClient } from "@/lib/tracking/scraper-client";
import { eventDescription, eventTime, interpretDetection, mapStage, shipmentStatusFromResult } from "@/lib/tracking/status";
import {
  getSettings,
  getShipment,
  insertEventIgnore,
  releaseShipment,
  setCarrierLease,
  updateShipmentRow,
  writeProviderLog,
} from "@/lib/tracking/store";
import { ScraperError, type Shipment, type TrackBody, type TrackEventBody } from "@/lib/tracking/types";

const ISO_COUNTRY = /^[A-Z]{2}$/;

function country(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  return ISO_COUNTRY.test(code) ? code : null;
}

function clip(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

function scheduleFailure(shipment: Shipment, now: Date, message: string, retryAfterMs?: number): void {
  const settings = getSettings();
  const failures = Math.min(settings.maxConsecutiveFailures, shipment.consecutiveFailures + 1);
  const wait = Math.max(backoffMs(failures, stalledCapMs(settings)), retryAfterMs ?? 0);
  updateShipmentRow(
    shipment.id,
    {
      consecutive_failures: failures,
      last_error: message,
      next_check_at: new Date(now.getTime() + wait).toISOString(),
      last_refreshed_at: now.toISOString(),
    },
    now,
  );
}

function stopWith(shipment: Shipment, now: Date, message: string): void {
  updateShipmentRow(
    shipment.id,
    {
      refresh_stopped: 1,
      next_check_at: null,
      last_error: message,
      last_refreshed_at: now.toISOString(),
    },
    now,
  );
}

function newestEventTime(events: TrackEventBody[]): string | null {
  let best: string | null = null;
  let bestMs = Number.NEGATIVE_INFINITY;
  for (const event of events) {
    const stamp = eventTime(event);
    const ms = stamp ? Date.parse(stamp) : Number.NaN;
    if (Number.isFinite(ms) && ms >= bestMs) {
      bestMs = ms;
      best = stamp;
    }
  }
  return best;
}

export function applyTrackBody(shipment: Shipment, body: TrackBody, now: Date): "applied" | "mismatch" {
  if (!body || typeof body.carrier !== "string" || body.carrier !== shipment.carrierId) {
    scheduleFailure(shipment, now, MSG.mismatch);
    return "mismatch";
  }
  const result = body.result ?? {};
  const events = Array.isArray(result.events) ? result.events.slice(0, 200) : [];
  for (const event of events) {
    if (!event || typeof event.stage !== "string") continue;
    const description = clip(eventDescription(event), 1000);
    if (!description) continue;
    const occurredAt = eventTime(event);
    const location = event.location?.trim() ? clip(event.location.trim(), 300) : null;
    insertEventIgnore(
      {
        shipmentId: shipment.id,
        fingerprint: eventFingerprint({
          time: occurredAt ?? "",
          stage: event.stage,
          description,
          location: location ?? "",
          tie: event.tie_order == null ? "" : String(event.tie_order),
        }),
        occurredAt,
        status: mapStage(event.stage, description),
        description,
        location,
        stage: event.stage,
        tieOrder: typeof event.tie_order === "number" ? event.tie_order : null,
      },
      now,
    );
  }

  const detailSource =
    (typeof result.last_status_text === "string" && result.last_status_text.trim()) ||
    (events.length ? eventDescription(events[events.length - 1]!) : "");
  const detail = detailSource ? clip(detailSource, 1000) : null;
  let status = result.current_stage
    ? shipmentStatusFromResult(result.current_stage, detail)
    : ("Unknown" as const);
  if (!result.current_stage && events.length > 0) {
    const last = events[events.length - 1]!;
    status = mapStage(last.stage, eventDescription(last));
  }
  const terminal = status === "Delivered" || status === "Returned to Sender";
  let eta: string | null = shipment.eta;
  if (result.expected_delivery_withdrawn === true || result.expected_delivery === null) eta = null;
  else if (typeof result.expected_delivery === "string" && result.expected_delivery.trim()) {
    eta = clip(result.expected_delivery.trim(), 80);
  }
  const settings = getSettings();
  const lastEventAt = newestEventTime(events) ?? shipment.lastEventAt;
  const draft: Shipment = {
    ...shipment,
    status,
    lastEventAt,
    lastRefreshedAt: now.toISOString(),
    refreshStopped: terminal,
    carrierResolution: "confirmed",
  };
  updateShipmentRow(
    shipment.id,
    {
      status,
      status_detail: detail,
      eta,
      last_event_at: lastEventAt,
      last_refreshed_at: now.toISOString(),
      last_error: null,
      consecutive_failures: 0,
      carrier_resolution: "confirmed",
      refresh_stopped: terminal ? 1 : 0,
      next_check_at: terminal ? null : nextCheckIso(draft, settings, now),
      origin_country: shipment.originCountry ?? country(result.origin_country),
      destination_country: shipment.destinationCountry ?? country(result.destination_country),
    },
    now,
  );
  return "applied";
}

export async function processShipment(
  id: string,
  opts?: { client?: ScraperClient; now?: Date },
): Promise<void> {
  const now = opts?.now ?? new Date();
  const client = opts?.client ?? liveScraperClient();
  const started = Date.now();
  const shipment = getShipment(id);
  if (!shipment) {
    releaseShipment(id);
    return;
  }
  const leaseCarrier = shipment.carrierId || "_unresolved";
  try {
    if (shipment.carrierResolution === "unsupported" || shipment.carrierId === "unsupported") {
      stopWith(shipment, now, MSG.unsupported);
      writeProviderLog({
        shipmentId: shipment.id,
        carrierId: shipment.carrierId,
        outcome: "unsupported",
        httpStatus: null,
        durationMs: Date.now() - started,
        errorKind: "unsupported",
        now,
      });
      return;
    }
    if (shipment.refreshStopped || shipment.status === "Delivered" || shipment.status === "Returned to Sender") {
      updateShipmentRow(shipment.id, { refresh_stopped: 1, next_check_at: null, last_error: MSG.deliveredStop }, now);
      writeProviderLog({
        shipmentId: shipment.id,
        carrierId: shipment.carrierId,
        outcome: "skipped",
        httpStatus: null,
        durationMs: Date.now() - started,
        errorKind: "stopped",
        now,
      });
      return;
    }
    let carrierId = shipment.carrierId;
    if (!carrierId) {
      const detected = await client.detect(shipment.trackingNumber);
      const decision = interpretDetection(detected);
      updateShipmentRow(shipment.id, { carrier_candidates: JSON.stringify(decision.candidates) }, now);
      if (decision.kind === "ambiguous") {
        const settings = getSettings();
        updateShipmentRow(
          shipment.id,
          {
            carrier_resolution: "ambiguous",
            last_error: MSG.ambiguous,
            last_refreshed_at: now.toISOString(),
            next_check_at: new Date(now.getTime() + settings.stalledIntervalHours * 60 * 60 * 1000).toISOString(),
          },
          now,
        );
        writeProviderLog({
          shipmentId: shipment.id,
          carrierId: null,
          outcome: "ambiguous",
          httpStatus: 200,
          durationMs: Date.now() - started,
          errorKind: null,
          now,
        });
        return;
      }
      if (decision.kind === "unsupported" || decision.kind === "none") {
        stopWith(shipment, now, decision.kind === "none" ? MSG.unknownNumber : MSG.unsupported);
        writeProviderLog({
          shipmentId: shipment.id,
          carrierId: null,
          outcome: decision.kind === "none" ? "unknown" : "unsupported",
          httpStatus: 200,
          durationMs: Date.now() - started,
          errorKind: decision.kind,
          now,
        });
        return;
      }
      carrierId = decision.carrierId;
      updateShipmentRow(
        shipment.id,
        { carrier_id: carrierId, carrier_resolution: "pattern" },
        now,
      );
    }

    if (!isTrackableCarrier(carrierId) || !carrierById(carrierId)) {
      stopWith(shipment, now, MSG.unsupported);
      writeProviderLog({
        shipmentId: shipment.id,
        carrierId,
        outcome: "unsupported",
        httpStatus: null,
        durationMs: Date.now() - started,
        errorKind: "unsupported",
        now,
      });
      return;
    }

    const current = getShipment(shipment.id) ?? shipment;
    const body = await client.track({
      number: current.trackingNumber,
      carrier: carrierId,
      postcode: current.postcode,
      phoneLast4: current.phoneLast4,
      budgetMs: Number(process.env.TRACKING_BUDGET_MS ?? "20000") || 20_000,
    });
    const applied = applyTrackBody({ ...current, carrierId }, body, now);
    writeProviderLog({
      shipmentId: shipment.id,
      carrierId,
      outcome: applied === "applied" ? "ok" : "mismatch",
      httpStatus: 200,
      durationMs: Date.now() - started,
      errorKind: applied === "applied" ? null : "mismatch",
      now,
    });
  } catch (error) {
    const current = getShipment(shipment.id) ?? shipment;
    if (error instanceof ScraperError) {
      const field = scraperField(error);
      const message =
        error.kind === "not_found"
          ? MSG.notFound
          : error.kind === "invalid_input"
            ? MSG.rejected
            : error.kind === "budget" || error.kind === "transport"
              ? MSG.timeout
              : error.kind === "rate_limited" || error.kind === "challenge"
                ? MSG.throttled
                : error.kind === "input_required" && field === "postcode"
                  ? MSG.postcode
                  : error.kind === "input_required"
                    ? MSG.extraInput
                    : MSG.unusable;
      if (error.kind === "invalid_input") stopWith(current, now, message);
      else scheduleFailure(current, now, message, error.retryAfterMs);
      writeProviderLog({
        shipmentId: shipment.id,
        carrierId: current.carrierId,
        outcome: error.kind,
        httpStatus: error.httpStatus || null,
        durationMs: Date.now() - started,
        errorKind: error.kind,
        now,
      });
      return;
    }
    scheduleFailure(current, now, MSG.unavailable);
    writeProviderLog({
      shipmentId: shipment.id,
      carrierId: current.carrierId,
      outcome: "unavailable",
      httpStatus: null,
      durationMs: Date.now() - started,
      errorKind: "unavailable",
      now,
    });
  } finally {
    const settings = getSettings();
    const until = new Date(now.getTime() + settings.perCarrierGapMs).toISOString();
    setCarrierLease(leaseCarrier, until);
    const latest = getShipment(id);
    if (latest?.carrierId && latest.carrierId !== leaseCarrier) setCarrierLease(latest.carrierId, until);
    releaseShipment(id);
  }
}
