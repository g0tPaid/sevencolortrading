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
  { id: "sunyou", name: "SunYou", family: "SunYou", minRefreshMinutes: null, browser: false },
  { id: "yunda", name: "Yunda Express", family: "Yunda Express", minRefreshMinutes: null, browser: false },
  { id: "jd-logistics", name: "JD Logistics", family: "JD Logistics", minRefreshMinutes: null, browser: true },
  { id: "17feia", name: "17FEIA", family: "17FEIA", minRefreshMinutes: null, browser: false },
  { id: "anjun", name: "Anjun Logistics", family: "Anjun Logistics", minRefreshMinutes: null, browser: false },
  { id: "anserx", name: "AnserX", family: "AnserX", minRefreshMinutes: null, browser: false },
  { id: "bestfulfill", name: "BestFulfill Packet", family: "BestFulfill Packet", minRefreshMinutes: null, browser: false },
  { id: "byhd", name: "BYHD", family: "BYHD", minRefreshMinutes: null, browser: false },
  { id: "chukou1", name: "Chukou1", family: "Chukou1", minRefreshMinutes: null, browser: false },
  { id: "cj-packet", name: "CJ Packet", family: "CJ Packet", minRefreshMinutes: null, browser: false },
  { id: "cne", name: "CNE Express", family: "CNE Express", minRefreshMinutes: null, browser: false },
  { id: "cttyex", name: "CTTYEX", family: "CTTYEX", minRefreshMinutes: null, browser: false },
  { id: "dayone", name: "DayOne", family: "DayOne", minRefreshMinutes: null, browser: false },
  { id: "deppon", name: "Deppon", family: "Deppon", minRefreshMinutes: null, browser: false },
  { id: "dhlink", name: "DHLink", family: "DHLink", minRefreshMinutes: null, browser: false },
  { id: "dobropost", name: "DobroPost", family: "DobroPost", minRefreshMinutes: null, browser: false },
  { id: "dongdu", name: "Dongdu Logistics", family: "Dongdu Logistics", minRefreshMinutes: null, browser: false },
  { id: "dpex", name: "DPEX Worldwide", family: "DPEX Worldwide", minRefreshMinutes: null, browser: false },
  { id: "ecms-express", name: "ECMS Express", family: "ECMS Express", minRefreshMinutes: null, browser: false },
  { id: "energia-tk", name: "TK Energia", family: "TK Energia", minRefreshMinutes: null, browser: false },
  { id: "equick", name: "Equick", family: "Equick", minRefreshMinutes: null, browser: false },
  { id: "ets-express", name: "ETS Express", family: "ETS Express", minRefreshMinutes: null, browser: false },
  { id: "far-international", name: "FAR International", family: "FAR International", minRefreshMinutes: null, browser: false },
  { id: "first-line", name: "FIRST LINE", family: "FIRST LINE", minRefreshMinutes: null, browser: false },
  { id: "gzyl", name: "GZYL", family: "GZYL", minRefreshMinutes: null, browser: false },
  { id: "huahan", name: "HuaHan Logistics", family: "HuaHan Logistics", minRefreshMinutes: null, browser: false },
  { id: "huaya-express", name: "Huaya Express", family: "Huaya Express", minRefreshMinutes: null, browser: false },
  { id: "hywl", name: "Huiyi Logistics", family: "Huiyi Logistics", minRefreshMinutes: null, browser: false },
  { id: "imile", name: "iMile", family: "iMile", minRefreshMinutes: null, browser: false },
  { id: "intel-valley", name: "Intel-Valley", family: "Intel-Valley", minRefreshMinutes: null, browser: false },
  { id: "jcex", name: "JCEX", family: "JCEX", minRefreshMinutes: null, browser: false },
  { id: "jhgj", name: "Jiuhao International", family: "Jiuhao International", minRefreshMinutes: null, browser: false },
  { id: "jifan", name: "Jifan", family: "Jifan", minRefreshMinutes: null, browser: false },
  { id: "jrt", name: "JRT", family: "JRT", minRefreshMinutes: null, browser: false },
  { id: "js-express", name: "JS Express", family: "JS Express", minRefreshMinutes: null, browser: true },
  { id: "junfeng-international", name: "JunFeng International", family: "JunFeng International", minRefreshMinutes: null, browser: false },
  { id: "kec-ecommerce", name: "KEC eCommerce", family: "KEC eCommerce", minRefreshMinutes: null, browser: false },
  { id: "komon-express", name: "Komon Express", family: "Komon Express", minRefreshMinutes: null, browser: false },
  { id: "kun-express", name: "Kun Express", family: "Kun Express", minRefreshMinutes: null, browser: false },
  { id: "lingdong", name: "Lingdong International", family: "Lingdong International", minRefreshMinutes: null, browser: false },
  { id: "linhan", name: "LinHan International", family: "LinHan International", minRefreshMinutes: null, browser: false },
  { id: "liuchen", name: "Liuchen", family: "Liuchen", minRefreshMinutes: null, browser: false },
  { id: "lm-parcel", name: "LM Parcel", family: "LM Parcel", minRefreshMinutes: null, browser: false },
  { id: "mayiyinfu", name: "Mayi Yinfu", family: "Mayi Yinfu", minRefreshMinutes: null, browser: false },
  { id: "meihoo-pegasus", name: "MeiHoo Pegasus", family: "MeiHoo Pegasus", minRefreshMinutes: null, browser: false },
  { id: "meso-global", name: "Meso-global", family: "Meso-global", minRefreshMinutes: null, browser: false },
  { id: "mtscn", name: "Meiteshun Logistics", family: "Meiteshun Logistics", minRefreshMinutes: null, browser: false },
  { id: "omgo", name: "OMGO", family: "OMGO", minRefreshMinutes: null, browser: false },
  { id: "pengyou", name: "Pengyou", family: "Pengyou", minRefreshMinutes: null, browser: false },
  { id: "pfc-express", name: "PFC Express", family: "PFC Express", minRefreshMinutes: null, browser: false },
  { id: "profit-fields", name: "Profit Fields", family: "Profit Fields", minRefreshMinutes: null, browser: false },
  { id: "quick-fort", name: "Quick Fort", family: "Quick Fort", minRefreshMinutes: null, browser: false },
  { id: "sfc", name: "SFC Service", family: "SFC Service", minRefreshMinutes: null, browser: false },
  { id: "shouwu", name: "Shouwu International", family: "Shouwu International", minRefreshMinutes: null, browser: false },
  { id: "speedpak", name: "SpeedPAK", family: "SpeedPAK", minRefreshMinutes: null, browser: false },
  { id: "sptexp", name: "SPT Express", family: "SPT Express", minRefreshMinutes: null, browser: false },
  { id: "stone3pl", name: "Stone3PL", family: "Stone3PL", minRefreshMinutes: null, browser: false },
  { id: "suhu", name: "Suhu Express", family: "Suhu Express", minRefreshMinutes: null, browser: false },
  { id: "techlink", name: "Techlink", family: "Techlink", minRefreshMinutes: null, browser: false },
  { id: "thhy", name: "Tianhui Hengyuan", family: "Tianhui Hengyuan", minRefreshMinutes: null, browser: false },
  { id: "timely-titan", name: "Timely Titan Express", family: "Timely Titan Express", minRefreshMinutes: null, browser: false },
  { id: "topyou", name: "TopYou", family: "TopYou", minRefreshMinutes: null, browser: true },
  { id: "tsjy", name: "TSJY", family: "TSJY", minRefreshMinutes: null, browser: false },
  { id: "ubi-smart-parcel", name: "UBI Smart Parcel", family: "UBI Smart Parcel", minRefreshMinutes: null, browser: false },
  { id: "wanbexpress", name: "WanbExpress", family: "WanbExpress", minRefreshMinutes: null, browser: true },
  { id: "we-world-express", name: "We World Express", family: "We World Express", minRefreshMinutes: null, browser: false },
  { id: "wiio", name: "Wiio", family: "Wiio", minRefreshMinutes: null, browser: false },
  { id: "winit", name: "WINIT", family: "WINIT", minRefreshMinutes: null, browser: false },
  { id: "wooliiporter", name: "WooliiPorter", family: "WooliiPorter", minRefreshMinutes: null, browser: false },
  { id: "xinghe-freight", name: "Xinghe Freight", family: "Xinghe Freight", minRefreshMinutes: null, browser: false },
  { id: "ydh", name: "YDH", family: "YDH", minRefreshMinutes: null, browser: false },
  { id: "yilong-logistics", name: "Yilong Logistics", family: "Yilong Logistics", minRefreshMinutes: null, browser: false },
  { id: "yypost", name: "YYpost", family: "YYpost", minRefreshMinutes: null, browser: false },
  { id: "zecheng", name: "Zecheng International Logistics", family: "Zecheng International Logistics", minRefreshMinutes: null, browser: false },
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
