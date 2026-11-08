import { requireAdmin, json, sameOrigin } from "@/lib/tracking/http";
import { publicLookup as lookupPublicCache, type PublicLookupOptions } from "@/lib/tracking/public-cache";
import { carrierName, CARRIERS, UNSUPPORTED_CARRIER_ID } from "@/lib/tracking/carriers";
import { csvRecords, toCsv } from "@/lib/tracking/csv";
import { MSG } from "@/lib/tracking/messages";
import { parseShipmentInput } from "@/lib/tracking/validate";
import {
  consumeRateLimit,
  deleteShipment,
  enqueueRefresh,
  findByTracking,
  getSettings,
  getShipment,
  insertShipment,
  listEvents,
  listLogs,
  saveSettings,
  searchShipments,
  updateShipmentRow,
  validateSettings,
  type QueueResult,
} from "@/lib/tracking/store";
import { TrackingInputError, type Shipment, type ShipmentInput, type TrackingSettings } from "@/lib/tracking/types";
import { cleanCarrierId, cleanPhoneLast4, cleanPostcode, normalizeTrackingNumber } from "@/lib/tracking/validate";

function textOrNull(value: unknown, max: number, label: string): string | null | undefined {
  if (value === undefined) return undefined;
  if (value == null) return null;
  if (typeof value !== "string") throw new TrackingInputError(`${label} must be text.`);
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > max) throw new TrackingInputError(`${label} is too long.`);
  return trimmed;
}

export async function adminGuard(request: Request, mutate: boolean) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth;
  if (mutate && !sameOrigin(request)) {
    return { ok: false as const, response: json({ ok: false, error: MSG.forbidden }, 403) };
  }
  if (mutate && !consumeRateLimit(`admin:${auth.user}`, 120, 10 * 60 * 1000, new Date())) {
    return { ok: false as const, response: json({ ok: false, error: MSG.tooMany }, 429) };
  }
  return auth;
}

export function adminShipment(id: string) {
  const shipment = getShipment(id);
  if (!shipment) return null;
  return {
    ...shipment,
    carrierName: carrierName(shipment.carrierId),
    events: listEvents(id),
    logs: listLogs(id),
  };
}

export function createShipmentRecord(body: Record<string, unknown>, now = new Date()): Shipment {
  const input = parseShipmentInput(body);
  return insertFromInput(input, now);
}

function insertFromInput(input: ShipmentInput, now: Date): Shipment {
  const unsupported = input.carrierId === UNSUPPORTED_CARRIER_ID;
  const shipment = insertShipment(
    {
      trackingNumber: input.trackingNumber,
      customerRef: input.customerRef ?? null,
      customerName: input.customerName ?? null,
      orderNumber: input.orderNumber ?? null,
      carrierId: input.carrierId ?? null,
      carrierResolution: unsupported ? "unsupported" : input.carrierId ? "manual" : "unresolved",
      origin: input.origin ?? null,
      destination: input.destination ?? null,
      postcode: input.postcode ?? null,
      phoneLast4: input.phoneLast4 ?? null,
      notes: input.notes ?? null,
      status: "Unknown",
      lastError: unsupported ? MSG.unsupported : null,
      refreshStopped: unsupported,
      nextCheckAt: unsupported ? null : now.toISOString(),
    },
    now,
  );
  if (!unsupported) enqueueRefresh(shipment.id, "create", now);
  return shipment;
}

export function updateShipmentRecord(id: string, body: Record<string, unknown>, now = new Date()): Shipment | null {
  const existing = getShipment(id);
  if (!existing) return null;
  const fields: Record<string, string | number | null | undefined> = {};
  const assign = (column: string, value: string | null | undefined) => {
    if (value !== undefined) fields[column] = value;
  };
  assign("customer_ref", textOrNull(body.customerRef ?? body.customer_ref, 80, "Customer ID"));
  assign("customer_name", textOrNull(body.customerName ?? body.customer_name, 120, "Customer name"));
  assign("order_number", textOrNull(body.orderNumber ?? body.order_number, 80, "Order number"));
  assign("origin", textOrNull(body.origin, 160, "Origin"));
  assign("destination", textOrNull(body.destination, 160, "Destination"));
  assign("notes", textOrNull(body.notes, 2000, "Notes"));
  if ("postcode" in body) fields.postcode = cleanPostcode(body.postcode);
  if ("phoneLast4" in body || "phone_last4" in body) {
    fields.phone_last4 = cleanPhoneLast4(body.phoneLast4 ?? body.phone_last4);
  }

  let tracking = existing.trackingNumber;
  if ("trackingNumber" in body || "tracking_number" in body) {
    const raw = body.trackingNumber ?? body.tracking_number;
    if (typeof raw !== "string") throw new TrackingInputError("Enter a tracking number of 4–40 letters and digits.");
    tracking = normalizeTrackingNumber(raw);
    fields.tracking_number = tracking;
    fields.tracking_number_norm = tracking;
  }

  let carrier = existing.carrierId;
  if ("carrierId" in body || "carrier" in body) {
    carrier = cleanCarrierId(body.carrierId ?? body.carrier);
    fields.carrier_id = carrier;
  }

  const identityChanged = tracking !== existing.trackingNumber || carrier !== existing.carrierId;
  if (identityChanged) {
    const unsupported = carrier === UNSUPPORTED_CARRIER_ID;
    fields.carrier_resolution = unsupported ? "unsupported" : carrier ? "manual" : "unresolved";
    fields.carrier_candidates = "[]";
    fields.refresh_stopped = unsupported ? 1 : 0;
    fields.next_check_at = unsupported ? null : now.toISOString();
    fields.consecutive_failures = 0;
    fields.last_error = unsupported ? MSG.unsupported : null;
    if (existing.status === "Delivered" || existing.status === "Returned to Sender") {
      fields.status = "Unknown";
      fields.status_detail = null;
      fields.eta = null;
    }
  }

  try {
    updateShipmentRow(id, fields, now);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/UNIQUE/i.test(message)) {
      throw new TrackingInputError("A shipment with this tracking number and carrier already exists.");
    }
    throw error;
  }
  if (identityChanged && carrier !== UNSUPPORTED_CARRIER_ID) enqueueRefresh(id, "edit", now);
  return getShipment(id);
}

export function removeShipment(id: string): boolean {
  return deleteShipment(id);
}

export function listShipments(url: URL) {
  const status = url.searchParams.get("status") ?? "";
  const carrierId = url.searchParams.get("carrier") ?? "";
  const result = searchShipments({
    q: url.searchParams.get("q") ?? "",
    carrierId,
    status,
    limit: Number(url.searchParams.get("limit") ?? "50"),
    offset: Number(url.searchParams.get("offset") ?? "0"),
  });
  return {
    ok: true,
    total: result.total,
    carriers: CARRIERS,
    shipments: result.shipments.map((shipment) => ({
      ...shipment,
      carrierName: carrierName(shipment.carrierId),
    })),
  };
}

export function readSettingsResponse() {
  return { ok: true, settings: getSettings(), carriers: CARRIERS };
}

export function writeSettings(body: Record<string, unknown>, now = new Date()): TrackingSettings {
  const raw = (body.settings ?? body) as Record<string, unknown>;
  return saveSettings(validateSettings(raw), now);
}

export async function publicLookup(
  trackingNumber: string,
  rateKey: string,
  now = new Date(),
  opts?: PublicLookupOptions,
) {
  return lookupPublicCache(trackingNumber, rateKey, now, opts);
}

export async function publicRefresh(trackingNumber: string, rateKey: string, now = new Date(), opts?: PublicLookupOptions) {
  return lookupPublicCache(trackingNumber, rateKey, now, opts);
}

function queueIfDue(shipment: Shipment, requestedBy: string, now: Date, cooldownMinutes: number): QueueResult | "not_due" {
  if (shipment.refreshStopped || shipment.status === "Delivered" || shipment.status === "Returned to Sender") {
    return "stopped";
  }
  if (shipment.lastRefreshedAt) {
    const elapsed = now.getTime() - Date.parse(shipment.lastRefreshedAt);
    if (Number.isFinite(elapsed) && elapsed < cooldownMinutes * 60 * 1000) return "not_due";
  }
  return enqueueRefresh(shipment.id, requestedBy, now);
}

export function manualRefresh(id: string, now = new Date()): QueueResult | "not_due" | "missing" {
  const shipment = getShipment(id);
  if (!shipment) return "missing";
  return queueIfDue(shipment, "manual", now, 2);
}

export function exportShipmentsCsv(): string {
  const rows: Array<Record<string, string | null>> = [];
  for (let offset = 0; offset < 5000; offset += 200) {
    const page = searchShipments({ limit: 200, offset }).shipments;
    if (page.length === 0) break;
    for (const shipment of page) {
      rows.push({
        customer_name: shipment.customerName,
        customer_ref: shipment.customerRef,
        order_number: shipment.orderNumber,
        tracking_number: shipment.trackingNumber,
        carrier: shipment.carrierId === UNSUPPORTED_CARRIER_ID ? "unsupported" : carrierName(shipment.carrierId),
        origin: shipment.origin,
        destination: shipment.destination,
        postcode: shipment.postcode,
        notes: shipment.notes,
      });
    }
    if (page.length < 200) break;
  }
  return toCsv(rows);
}

export function importShipmentsCsv(text: string, now = new Date()): {
  created: number;
  updated: number;
  errors: Array<{ row: number; message: string }>;
} {
  const records = csvRecords(text);
  let created = 0;
  let updated = 0;
  const errors: Array<{ row: number; message: string }> = [];
  records.forEach((record, index) => {
    const row = index + 2;
    try {
      const input = parseShipmentInput({
        customer_name: record.customer_name ?? "",
        customer_ref: record.customer_ref ?? "",
        order_number: record.order_number ?? "",
        tracking_number: record.tracking_number ?? "",
        carrier: record.carrier ?? "",
        origin: record.origin ?? "",
        destination: record.destination ?? "",
        postcode: record.postcode ?? "",
        notes: record.notes ?? "",
      });
      const existing = findByTracking(input.trackingNumber, input.carrierId ?? null);
      if (!existing) {
        insertFromInput(input, now);
        created += 1;
        return;
      }
      const patch: Record<string, unknown> = {};
      if (input.customerName) patch.customerName = input.customerName;
      if (input.customerRef) patch.customerRef = input.customerRef;
      if (input.orderNumber) patch.orderNumber = input.orderNumber;
      if (input.origin) patch.origin = input.origin;
      if (input.destination) patch.destination = input.destination;
      if (input.postcode) patch.postcode = input.postcode;
      if (input.notes) patch.notes = input.notes;
      updateShipmentRecord(existing.id, patch, now);
      updated += 1;
    } catch (error) {
      errors.push({
        row,
        message: error instanceof TrackingInputError ? error.message : "Row was skipped.",
      });
    }
  });
  return { created, updated, errors };
}
