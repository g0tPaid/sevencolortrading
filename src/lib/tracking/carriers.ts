/**
 * Allowlist drawn from universal-parcel-scraper catalog.json at
 * commit 80d71f91f705068b523759b0e8598b3dc5e13c9e (package 0.1025.0).
 * Display names are the catalog displayName values. Adapter evidence is in
 * docs/shipment-tracking.md. This list is not a claim that a live lookup works.
 */

export type CarrierInfo = {
  id: string;
  name: string;
  family: string;
  /** Catalog tracking.refresh.minMinutes, when the carrier publishes one. */
  minRefreshMinutes: number | null;
  browser: boolean;
};

export const UNSUPPORTED_CARRIER_ID = "unsupported";

export const CARRIERS: CarrierInfo[] = [
  { id: "china-post", name: "China Post", family: "China Post", minRefreshMinutes: null, browser: true },
  { id: "aliexpress", name: "AliExpress / Cainiao", family: "Cainiao", minRefreshMinutes: 30, browser: false },
  { id: "four-px", name: "4PX", family: "4PX", minRefreshMinutes: null, browser: false },
  { id: "yunexpress", name: "YunExpress", family: "YunExpress", minRefreshMinutes: null, browser: true },
  { id: "yanwen", name: "Yanwen", family: "Yanwen", minRefreshMinutes: null, browser: false },
  { id: "sf-express", name: "SF Express", family: "SF Express", minRefreshMinutes: null, browser: true },
  { id: "zto", name: "ZTO Express", family: "ZTO", minRefreshMinutes: null, browser: true },
  { id: "zto-international", name: "ZTO International", family: "ZTO", minRefreshMinutes: null, browser: false },
  { id: "yto", name: "YTO Express", family: "YTO", minRefreshMinutes: null, browser: false },
  { id: "sto", name: "STO Express", family: "STO", minRefreshMinutes: null, browser: false },
  { id: "j-and-t", name: "J&T Express", family: "J&T Express", minRefreshMinutes: null, browser: false },
  { id: "j-and-t-cn", name: "J&T Express China", family: "J&T Express", minRefreshMinutes: null, browser: false },
  { id: "dhl", name: "DHL", family: "DHL", minRefreshMinutes: null, browser: true },
  { id: "dhl-express", name: "DHL Express", family: "DHL", minRefreshMinutes: null, browser: true },
  { id: "dhl-ecommerce", name: "DHL eCommerce", family: "DHL", minRefreshMinutes: null, browser: true },
  { id: "fedex", name: "FedEx", family: "FedEx", minRefreshMinutes: null, browser: true },
  { id: "ups", name: "UPS", family: "UPS", minRefreshMinutes: null, browser: true },
  { id: "usps", name: "USPS", family: "USPS", minRefreshMinutes: 30, browser: true },
  { id: "royal-mail", name: "Royal Mail", family: "Royal Mail", minRefreshMinutes: 60, browser: true },
  { id: "aramex", name: "Aramex", family: "Aramex", minRefreshMinutes: null, browser: false },
  { id: "dpd", name: "DPD Switzerland", family: "DPD", minRefreshMinutes: null, browser: true },
  { id: "dpd-de", name: "DPD Germany", family: "DPD", minRefreshMinutes: null, browser: false },
  { id: "dpd-uk", name: "DPD UK", family: "DPD", minRefreshMinutes: null, browser: false },
  { id: "dpd-nl", name: "DPD Netherlands", family: "DPD", minRefreshMinutes: null, browser: false },
  { id: "dpd-fr", name: "DPD France", family: "DPD", minRefreshMinutes: null, browser: false },
  { id: "gls-de", name: "GLS Germany", family: "GLS", minRefreshMinutes: 60, browser: false },
  { id: "gls-fr", name: "GLS France", family: "GLS", minRefreshMinutes: 60, browser: false },
  { id: "gls-es", name: "GLS Spain", family: "GLS", minRefreshMinutes: null, browser: false },
  { id: "gls-it", name: "GLS Italy", family: "GLS", minRefreshMinutes: null, browser: false },
  { id: "spring-gds", name: "PostNL", family: "PostNL", minRefreshMinutes: 30, browser: false },
  { id: "canada-post", name: "Canada Post", family: "Canada Post", minRefreshMinutes: null, browser: false },
  { id: "australia-post", name: "Australia Post", family: "Australia Post", minRefreshMinutes: null, browser: true },
  { id: "correos-spain", name: "Correos", family: "Correos", minRefreshMinutes: null, browser: false },
  { id: "la-poste", name: "La Poste / Colissimo", family: "La Poste", minRefreshMinutes: null, browser: false },
  { id: "swiss-post", name: "Swiss Post", family: "Swiss Post", minRefreshMinutes: null, browser: false },
  { id: "chronopost", name: "Chronopost", family: "Chronopost", minRefreshMinutes: null, browser: false },
  { id: "asendia", name: "Asendia", family: "Asendia", minRefreshMinutes: null, browser: true },
  { id: "hermes-de", name: "Hermes Germany", family: "Hermes Germany", minRefreshMinutes: null, browser: false },
  { id: "an-post", name: "An Post", family: "An Post", minRefreshMinutes: null, browser: false },
  { id: "bpost", name: "bpost", family: "bpost", minRefreshMinutes: null, browser: false },
  { id: "austrian-post", name: "Austrian Post", family: "Austrian Post", minRefreshMinutes: null, browser: false },
  { id: "postnord", name: "PostNord", family: "PostNord", minRefreshMinutes: null, browser: false },
  { id: "posti", name: "Posti", family: "Posti", minRefreshMinutes: null, browser: false },
  { id: "purolator", name: "Purolator", family: "Purolator", minRefreshMinutes: null, browser: false },
  { id: "canpar", name: "Canpar", family: "Canpar", minRefreshMinutes: null, browser: false },
  { id: "ontrac", name: "OnTrac", family: "OnTrac", minRefreshMinutes: null, browser: false },
  { id: "uniuni", name: "UniUni", family: "UniUni", minRefreshMinutes: null, browser: false },
  { id: "landmark-global", name: "Landmark Global", family: "Landmark Global", minRefreshMinutes: null, browser: false },
  { id: "correios-br", name: "Correios Brazil", family: "Correios Brazil", minRefreshMinutes: null, browser: true },
  { id: "nz-post", name: "NZ Post", family: "NZ Post", minRefreshMinutes: null, browser: false },
  { id: "singapore-post", name: "Singapore Post", family: "Singapore Post", minRefreshMinutes: null, browser: false },
  { id: "japan-post", name: "Japan Post", family: "Japan Post", minRefreshMinutes: null, browser: false },
  { id: "yamato", name: "Yamato Transport", family: "Yamato Transport", minRefreshMinutes: null, browser: false },
  { id: "korea-post", name: "Korea Post", family: "Korea Post", minRefreshMinutes: null, browser: false },
  { id: "hongkong-post", name: "Hongkong Post", family: "Hongkong Post", minRefreshMinutes: null, browser: false },
  { id: "ninja-van", name: "Ninja Van", family: "Ninja Van", minRefreshMinutes: null, browser: false },
  { id: "tnt", name: "TNT", family: "TNT", minRefreshMinutes: null, browser: false },
  { id: "aramex-au", name: "Aramex Australia", family: "Aramex", minRefreshMinutes: null, browser: false },
  { id: "cj-logistics", name: "CJ Logistics", family: "CJ Logistics", minRefreshMinutes: null, browser: false },
  { id: "emirates-post", name: "Emirates Post", family: "Emirates Post", minRefreshMinutes: null, browser: true },
  { id: "evri-uk", name: "Evri UK", family: "Evri", minRefreshMinutes: null, browser: true },
  { id: "intelcom", name: "Intelcom / Dragonfly", family: "Intelcom / Dragonfly", minRefreshMinutes: null, browser: false },
  { id: "janio", name: "Janio", family: "Janio", minRefreshMinutes: null, browser: false },
  { id: "naqel", name: "Naqel Express", family: "Naqel Express", minRefreshMinutes: null, browser: false },
  { id: "passport", name: "Passport", family: "Passport", minRefreshMinutes: null, browser: false },
  { id: "sagawa", name: "Sagawa Express", family: "Sagawa Express", minRefreshMinutes: null, browser: false },
  { id: "saudi-post", name: "Saudi Post", family: "Saudi Post", minRefreshMinutes: null, browser: false },
  { id: "sendle", name: "Sendle", family: "Sendle", minRefreshMinutes: null, browser: false },
  { id: "speedaf", name: "Speedaf", family: "Speedaf", minRefreshMinutes: null, browser: false },
  { id: "team-global-express", name: "Team Global Express", family: "Team Global Express", minRefreshMinutes: null, browser: false },
];

const BY_ID = new Map(CARRIERS.map((carrier) => [carrier.id, carrier]));
const BY_NAME = new Map(CARRIERS.map((carrier) => [carrier.name.toLowerCase(), carrier]));

export function carrierById(id: string | null | undefined): CarrierInfo | null {
  if (!id) return null;
  return BY_ID.get(id) ?? null;
}

export function isTrackableCarrier(id: string | null | undefined): boolean {
  return !!id && id !== UNSUPPORTED_CARRIER_ID && BY_ID.has(id);
}

export function carrierName(id: string | null | undefined): string | null {
  if (!id) return null;
  if (id === UNSUPPORTED_CARRIER_ID) return "Unsupported carrier";
  return BY_ID.get(id)?.name ?? null;
}

/** Accept a catalog id or exact display name. Unknown text is not guessed. */
export function resolveCarrierToken(token: string | null | undefined): string | null {
  if (token == null) return null;
  const trimmed = token.trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase() === "unsupported" || trimmed.toLowerCase() === "unsupported carrier") {
    return UNSUPPORTED_CARRIER_ID;
  }
  if (BY_ID.has(trimmed)) return trimmed;
  const byName = BY_NAME.get(trimmed.toLowerCase());
  if (byName) return byName.id;
  return null;
}
