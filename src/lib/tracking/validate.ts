import { resolveCarrierToken, UNSUPPORTED_CARRIER_ID } from "@/lib/tracking/carriers";
import { TrackingInputError, type ShipmentInput } from "@/lib/tracking/types";

const LIMITS = {
  customerRef: 80,
  customerName: 120,
  orderNumber: 80,
  origin: 160,
  destination: 160,
  notes: 2000,
} as const;

export function normalizeTrackingNumber(input: string): string {
  const norm = input.trim().toUpperCase().replace(/[\s-]+/g, "");
  if (!/^[A-Z0-9]{4,40}$/.test(norm)) {
    throw new TrackingInputError("Enter a tracking number of 4–40 letters and digits.");
  }
  const hasDigit = /\d/.test(norm);
  const shortLetters = /^[A-Z]{6,10}$/.test(norm);
  if (!hasDigit && !shortLetters) {
    throw new TrackingInputError("Enter a tracking number of 4–40 letters and digits.");
  }
  return norm;
}

function textField(value: unknown, max: number, label: string): string | null {
  if (value == null) return null;
  if (typeof value !== "string") throw new TrackingInputError(`${label} must be text.`);
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > max) throw new TrackingInputError(`${label} is too long.`);
  return trimmed;
}

export function cleanPostcode(value: unknown): string | null {
  const text = textField(value, 12, "Postcode");
  if (!text) return null;
  if (!/^(?=.{3,12}$)(?=.*\d)[A-Za-z0-9]+(?:[ -][A-Za-z0-9]+)*$/.test(text)) {
    throw new TrackingInputError("Postcode must be 3–12 characters and include a digit.");
  }
  return text;
}

export function cleanPhoneLast4(value: unknown): string | null {
  const text = textField(value, 4, "Phone last 4");
  if (!text) return null;
  if (!/^[0-9]{4}$/.test(text)) {
    throw new TrackingInputError("Phone last 4 must be four digits.");
  }
  return text;
}

export function cleanCarrierId(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== "string") throw new TrackingInputError("Carrier must be a listed carrier.");
  const trimmed = value.trim();
  if (!trimmed) return null;
  const resolved = resolveCarrierToken(trimmed);
  if (!resolved) throw new TrackingInputError("Choose a supported carrier or leave it unset.");
  return resolved;
}

export function parseShipmentInput(body: Record<string, unknown>, opts?: { trackingRequired?: boolean }): ShipmentInput {
  const trackingRequired = opts?.trackingRequired !== false;
  const trackingRaw = body.trackingNumber ?? body.tracking_number;
  let trackingNumber = "";
  if (typeof trackingRaw === "string" && trackingRaw.trim()) {
    trackingNumber = normalizeTrackingNumber(trackingRaw);
  } else if (trackingRequired) {
    throw new TrackingInputError("Enter a tracking number of 4–40 letters and digits.");
  }

  return {
    customerRef: textField(body.customerRef ?? body.customer_ref, LIMITS.customerRef, "Customer ID"),
    customerName: textField(body.customerName ?? body.customer_name, LIMITS.customerName, "Customer name"),
    orderNumber: textField(body.orderNumber ?? body.order_number, LIMITS.orderNumber, "Order number"),
    trackingNumber,
    carrierId: cleanCarrierId(body.carrierId ?? body.carrier),
    origin: textField(body.origin, LIMITS.origin, "Origin"),
    destination: textField(body.destination, LIMITS.destination, "Destination"),
    postcode: cleanPostcode(body.postcode),
    phoneLast4: cleanPhoneLast4(body.phoneLast4 ?? body.phone_last4),
    notes: textField(body.notes, LIMITS.notes, "Notes"),
  };
}

export function carrierIsUnsupported(carrierId: string | null | undefined): boolean {
  return carrierId === UNSUPPORTED_CARRIER_ID;
}
