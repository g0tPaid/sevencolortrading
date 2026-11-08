export const SHIPMENT_STATUSES = [
  "Information Received",
  "Picked Up",
  "In Transit",
  "Arrived at Destination Country",
  "Customs Clearance",
  "Customs Released",
  "Out for Delivery",
  "Delivered",
  "Delivery Exception",
  "Returned to Sender",
  "Unknown",
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const TERMINAL_STATUSES: ReadonlySet<ShipmentStatus> = new Set([
  "Delivered",
  "Returned to Sender",
]);

export type CarrierResolution =
  | "unresolved"
  | "ambiguous"
  | "pattern"
  | "confirmed"
  | "manual"
  | "unsupported";

export type Shipment = {
  id: string;
  customerRef: string | null;
  customerName: string | null;
  orderNumber: string | null;
  trackingNumber: string;
  carrierId: string | null;
  carrierResolution: CarrierResolution;
  carrierCandidates: string[];
  origin: string | null;
  destination: string | null;
  originCountry: string | null;
  destinationCountry: string | null;
  postcode: string | null;
  phoneLast4: string | null;
  status: ShipmentStatus;
  statusDetail: string | null;
  eta: string | null;
  lastEventAt: string | null;
  lastRefreshedAt: string | null;
  nextCheckAt: string | null;
  refreshStopped: boolean;
  consecutiveFailures: number;
  lastError: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ShipmentEvent = {
  id: string;
  shipmentId: string;
  fingerprint: string;
  occurredAt: string | null;
  status: ShipmentStatus;
  description: string;
  location: string | null;
  stage: string | null;
  tieOrder: number | null;
  createdAt: string;
};

export type ProviderLog = {
  id: string;
  shipmentId: string | null;
  carrierId: string | null;
  outcome: string;
  httpStatus: number | null;
  durationMs: number | null;
  errorKind: string | null;
  createdAt: string;
};

export type TrackingSettings = {
  newIntervalHours: number;
  activeIntervalHours: number;
  stalledIntervalHours: number;
  stalledAfterHours: number;
  maxConsecutiveFailures: number;
  globalConcurrency: number;
  perCarrierConcurrency: number;
  perCarrierGapMs: number;
  publicRefreshCooldownMinutes: number;
  publicDailyCap: number;
  publicFreshHours: number;
  publicInterestHours: number;
  publicMaxRows: number;
  publicConcurrency: number;
  publicOutstandingCap: number;
  updatedAt: string;
};

export type ShipmentInput = {
  customerRef?: string | null;
  customerName?: string | null;
  orderNumber?: string | null;
  trackingNumber: string;
  carrierId?: string | null;
  origin?: string | null;
  destination?: string | null;
  postcode?: string | null;
  phoneLast4?: string | null;
  notes?: string | null;
};

export type DetectionBody = {
  trackingNumber: string;
  carrier: string;
  confidence: "high" | "low" | "none";
  candidates: string[];
  source: string;
};

export type TrackEventBody = {
  time?: string;
  description?: string;
  location?: string;
  original_description?: string;
  stage: string;
  stage_source: string;
  instant?: string | null;
  tie_order?: number;
};

export type TrackBody = {
  carrier: string;
  source: string;
  result: {
    status?: string;
    current_stage?: string;
    last_status_text?: string | null;
    last_update?: string | null;
    expected_delivery?: string | null;
    expected_delivery_withdrawn?: boolean;
    destination_country?: string;
    origin_country?: string;
    events?: TrackEventBody[];
  };
  attempts?: Array<{ source: string; kind: string; durationMs: number }>;
};

export class TrackingInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TrackingInputError";
  }
}

export class ScraperError extends Error {
  readonly kind: string;
  readonly httpStatus: number;
  readonly retryAfterMs?: number;

  constructor(kind: string, httpStatus: number, retryAfterMs?: number) {
    super(kind);
    this.name = "ScraperError";
    this.kind = kind;
    this.httpStatus = httpStatus;
    this.retryAfterMs = retryAfterMs;
  }
}
