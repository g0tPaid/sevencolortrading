import type { DetectionBody, ShipmentStatus, TrackEventBody } from "@/lib/tracking/types";
import { isTrackableCarrier } from "@/lib/tracking/carriers";

const STAGE_STATUS: Record<string, ShipmentStatus> = {
  pending: "Information Received",
  registered: "Information Received",
  accepted: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  failed_attempt: "Delivery Exception",
  exception: "Delivery Exception",
  returned: "Returned to Sender",
  customs: "Customs Clearance",
  ready_for_pickup: "Unknown",
};

const RELEASED =
  /\b(customs?\s+released|released\s+(by|from)\s+customs|cleared\s+customs|customs\s+cleared|customs\s+clearance\s+completed|import\s+customs\s+cleared)\b/i;

const ARRIVED_COUNTRY =
  /\barriv(?:ed|al)\s+(?:at|in)\s+(?:the\s+)?destination\s+country\b/i;

export function mapStage(stage: string | null | undefined, description: string | null | undefined): ShipmentStatus {
  const key = (stage ?? "").trim();
  const text = description ?? "";
  if (key === "customs" && RELEASED.test(text)) return "Customs Released";
  if ((key === "in_transit" || key === "customs" || key === "accepted") && ARRIVED_COUNTRY.test(text)) {
    return "Arrived at Destination Country";
  }
  if (key in STAGE_STATUS) return STAGE_STATUS[key]!;
  return "Unknown";
}

export function shipmentStatusFromResult(
  stage: string | null | undefined,
  detail: string | null | undefined,
): ShipmentStatus {
  return mapStage(stage, detail);
}

export type DetectionDecision =
  | { kind: "unique"; carrierId: string; candidates: string[] }
  | { kind: "ambiguous"; candidates: string[] }
  | { kind: "unsupported"; candidates: string[] }
  | { kind: "none"; candidates: string[] };

/**
 * A high-confidence single candidate is a pattern match, not carrier confirmation.
 * Anything else stays ambiguous. Regex shape alone is not treated as proof.
 */
export function interpretDetection(body: DetectionBody): DetectionDecision {
  const candidates = [...new Set(body.candidates.filter((id) => typeof id === "string" && id.trim()))];
  const highSingle = body.confidence === "high" && candidates.length === 1;
  if (!highSingle) {
    if (candidates.length === 0 && (body.confidence === "none" || !body.carrier)) {
      return { kind: "none", candidates };
    }
    return { kind: "ambiguous", candidates };
  }
  const carrierId = candidates[0]!;
  if (!isTrackableCarrier(carrierId)) return { kind: "unsupported", candidates };
  return { kind: "unique", carrierId, candidates };
}

export function eventDescription(event: TrackEventBody): string {
  const original = event.original_description?.trim();
  const description = event.description?.trim();
  return original || description || "";
}

export function eventTime(event: TrackEventBody): string | null {
  const instant = typeof event.instant === "string" ? event.instant.trim() : "";
  if (instant) return instant;
  const time = event.time?.trim();
  return time || null;
}
