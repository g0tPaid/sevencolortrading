import { COUNTRY_CENTROIDS } from "@/lib/analytics-geo";
import { carrierName } from "@/lib/tracking/carriers";
import { MSG } from "@/lib/tracking/messages";
import type { Shipment, ShipmentEvent } from "@/lib/tracking/types";

export type PublicEvent = {
  time: string | null;
  status: string;
  description: string;
  location: string | null;
};

export type PublicShipment = {
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
  reference: string | null;
  pieces: string | null;
  timeNote: string | null;
};

/** Newest source time first. Comparison uses the printed text, so a timezone is not applied. */
export function newestFirst<T extends { time: string | null }>(events: T[]): T[] {
  return events
    .map((event, index) => ({ event, index }))
    .sort((left, right) => {
      const a = left.event.time ?? "";
      const b = right.event.time ?? "";
      if (a !== b) return a < b ? 1 : -1;
      return left.index - right.index;
    })
    .map((item) => item.event);
}

function knownCountry(code: string | null): string | null {
  if (!code || !COUNTRY_CENTROIDS[code]) return null;
  return code;
}

export function toPublicShipment(shipment: Shipment, events: ShipmentEvent[]): PublicShipment {
  const candidates = shipment.carrierCandidates
    .map((id) => {
      const name = carrierName(id);
      return name ? { id, name } : null;
    })
    .filter((item): item is { id: string; name: string } => item !== null);

  return {
    trackingNumber: shipment.trackingNumber,
    carrier: {
      id: shipment.carrierResolution === "ambiguous" ? null : shipment.carrierId,
      name: shipment.carrierResolution === "ambiguous" ? null : carrierName(shipment.carrierId),
      resolution: shipment.carrierResolution,
      candidates,
    },
    status: shipment.status,
    statusDetail: shipment.statusDetail,
    origin: shipment.origin,
    destination: shipment.destination,
    originCountryCode: knownCountry(shipment.originCountry),
    destinationCountryCode: knownCountry(shipment.destinationCountry),
    eta: shipment.eta,
    lastUpdated: shipment.lastRefreshedAt,
    events: events.map((event) => ({
      time: event.occurredAt,
      status: event.status,
      description: event.description,
      location: event.location,
    })),
    message: shipment.lastError ?? (events.length === 0 ? MSG.storedPending : null),
    reference: null,
    pieces: null,
    timeNote: null,
  };
}
