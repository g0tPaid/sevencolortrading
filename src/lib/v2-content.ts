/** Version 2 landing content. Company facts always from src/lib/content.ts (v1) */

/** Brand-new invention examples for the ideation search */
export const newIdeaExamples = [
  "A foldable travel steamer for silk",
  "Smart pet feeder with camera",
  "Refillable skincare pod system",
  "Modular hotel bedside light",
  "Child-safe magnetic building tiles",
] as const;

export const companyHighlights = [
  {
    label: "NO MOQ",
    detail: "Start from one unit",
  },
  {
    label: "Verified Factories",
    detail: "Audited suppliers only",
  },
  {
    label: "Photo & Video QC",
    detail: "Approve before it ships",
  },
] as const;

/** Existing brand / catalog-style ideation demo */
export const ideationDemo = {
  input: "I want to start a skincare brand.",
  products: ["Vitamin C serum set", "Clay mask jars", "Travel mini kit"],
  costs: "$1.80–$4.60 / unit",
  regions: "Guangdong · Zhejiang",
  moq: "100–300 pcs",
  margins: "48–65% retail",
  shipping: "Air 5–8d · Sea 22–30d",
} as const;

/** Brand-new product invention demo. NDA first, then development */
export const newProductDemo = {
  input: "I invented a foldable travel steamer that fits in a laptop sleeve.",
  concept: "Compact dual-voltage garment steamer · silicone water tank · travel lock",
  protection: "NDA signed before we open the brief with any factory",
  development: "Materials · BOM · packaging · cost targets with buildable makers",
  sampling: "Prototype samples first, start from 1 unit, scale when ready",
  regions: "Shenzhen · Zhongshan (small appliances)",
  costs: "Tooling quote + $8–$14 / unit at 500 pcs",
  moq: "No MOQ for sampling · production when you are ready",
  shipping: "Sample air 4–7d · bulk sea 22–30d",
} as const;

type PathProfile = {
  match: RegExp;
  concept: (idea: string) => string;
  regions: string;
  costs: string;
  development: string;
  sampling: string;
};

const NEW_PRODUCT_PROFILES: PathProfile[] = [
  {
    match: /steam|iron|garment|laptop sleeve|travel steamer/i,
    concept: () =>
      "Compact dual-voltage garment steamer · silicone water tank · travel lock",
    regions: "Shenzhen · Zhongshan (small appliances)",
    costs: "Tooling quote + $8–$14 / unit at 500 pcs",
    development: "Materials · BOM · packaging · cost targets with buildable makers",
    sampling: "Prototype samples first, start from 1 unit, scale when ready",
  },
  {
    match: /pet|dog|cat|feeder|carrier|animal/i,
    concept: (idea) =>
      `Pet-tech brief from your note · soft goods + electronics if needed · “${clip(idea)}”`,
    regions: "Dongguan · Yiwu (pet · soft goods)",
    costs: "Sample $12–$28 · bulk $6–$18 / unit at 300 pcs",
    development: "Size grades · mesh/fabric BOM · safety tether · packaging insert",
    sampling: "Soft prototype → fit test with pets → revise → pilot run",
  },
  {
    match: /skin|beauty|serum|cosmetic|refill|pod/i,
    concept: (idea) =>
      `Beauty formula + pack system · airless / refill options · “${clip(idea)}”`,
    regions: "Guangzhou · Shanghai (cosmetics)",
    costs: "Formula + pack $1.40–$4.80 / unit at 1,000 pcs",
    development: "INCI draft · pack tooling · stability · claim-safe labeling",
    sampling: "Lab samples → pack mockups → pilot fill under NDA",
  },
  {
    match: /light|lamp|led|mirror|electronics|smart|device|charger/i,
    concept: (idea) =>
      `Electronics DFM brief · PCB + enclosure · “${clip(idea)}”`,
    regions: "Shenzhen · Dongguan (electronics)",
    costs: "PCBA + enclosure $4–$16 / unit at 500 pcs",
    development: "Schematic · enclosure · firmware scope · certifications path",
    sampling: "Engineering sample → EVT → DVT → mass",
  },
  {
    match: /furniture|chair|hotel|lobby|sofa|table/i,
    concept: (idea) =>
      `Hospitality furniture brief · frame + upholstery · “${clip(idea)}”`,
    regions: "Foshan · Zhejiang (furniture)",
    costs: "Sample $90–$180 · bulk $55–$140 / unit",
    development: "CAD · foam/fabric BOM · knock-down packing · fire codes",
    sampling: "1–2 showroom samples → revise · hotel pilot order",
  },
  {
    match: /dress|apparel|fashion|fabric|textile|silk|gown/i,
    concept: (idea) =>
      `Apparel tech-pack path · fit + fabric · “${clip(idea)}”`,
    regions: "Hangzhou · Guangzhou (apparel)",
    costs: "Sample $35–$90 · bulk $18–$48 / unit at 50 pcs",
    development: "Tech pack · graded sizes · fabric mill · trim board",
    sampling: "Proto → fit sample → size set → bulk",
  },
  {
    match: /pack|box|gift|packaging|label/i,
    concept: (idea) =>
      `Private-label packaging brief · rigid / folding · “${clip(idea)}”`,
    regions: "Dongguan · Wenzhou (packaging)",
    costs: "Tooling + $0.80–$2.80 / unit at 1,000 pcs",
    development: "Dieline · material · foil/emboss · insert tray",
    sampling: "White sample → printed proof → mass",
  },
];

function clip(idea: string, n = 42) {
  const t = idea.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n)}…` : t;
}

export type DevelopmentPathResult = {
  concept: string;
  protection: string;
  development: string;
  sampling: string;
  regions: string;
  costs: string;
  moq: string;
  shipping: string;
};

/** Build a development-path card set from a free-text product idea. */
export function mapDevelopmentPath(idea: string): DevelopmentPathResult {
  const text = idea.trim();
  const profile =
    NEW_PRODUCT_PROFILES.find((p) => p.match.test(text)) ??
    ({
      match: /.*/,
      concept: (i: string) =>
        `Manufacturable concept brief · materials + form · “${clip(i || "your invention")}”`,
      regions: "Guangdong · Zhejiang (matched to category)",
      costs: "Sample quote first · unit cost after BOM lock",
      development: "Materials · BOM · packaging · cost targets with buildable makers",
      sampling: "Prototype samples first, start from 1 unit, scale when ready",
    } satisfies PathProfile);

  return {
    concept: profile.concept(text || newProductDemo.input),
    protection: "NDA signed before we open the brief with any factory",
    development: profile.development,
    sampling: profile.sampling,
    regions: profile.regions,
    costs: profile.costs,
    moq: "No MOQ for sampling · production when you are ready",
    shipping: "Sample air 4–7d · bulk sea 22–30d",
  };
}

export type CatalogPlanResult = {
  products: string;
  costs: string;
  regions: string;
  moq: string;
  margins: string;
  shipping: string;
};

/** Build a catalog / brand plan card set from free text. */
export function mapCatalogPlan(idea: string): CatalogPlanResult {
  const text = idea.trim().toLowerCase();
  if (/skin|beauty|serum|cosmetic/.test(text)) {
    return {
      products: "Vitamin C serum set · Clay mask jars · Travel mini kit",
      costs: "$1.80–$4.60 / unit",
      regions: "Guangdong · Zhejiang",
      moq: "100–300 pcs",
      margins: "48–65% retail",
      shipping: "Air 5–8d · Sea 22–30d",
    };
  }
  if (/pet|dog|cat/.test(text)) {
    return {
      products: "Soft travel carrier · Slow feeder bowl · Grooming kit",
      costs: "$3.20–$14 / unit",
      regions: "Yiwu · Dongguan",
      moq: "50–200 pcs",
      margins: "42–60% retail",
      shipping: "Air 5–9d · Sea 22–30d",
    };
  }
  if (/home|kitchen|blend|mirror|led/.test(text)) {
    return {
      products: "Portable blender · LED vanity mirror · Gift box set",
      costs: "$3.80–$22 / unit",
      regions: "Shenzhen · Zhongshan",
      moq: "50–200 pcs",
      margins: "45–62% retail",
      shipping: "Air 5–8d · Sea 22–30d",
    };
  }
  return {
    products: ideationDemo.products.join(" · "),
    costs: ideationDemo.costs,
    regions: ideationDemo.regions,
    moq: ideationDemo.moq,
    margins: ideationDemo.margins,
    shipping: ideationDemo.shipping,
  };
}

export const ideaPathSteps = [
  {
    n: "01",
    title: "Share the idea (NDAs signed)",
    text: "A sketch, a sample photo, or just a sentence, protected under NDA before we open the brief.",
  },
  {
    n: "02",
    title: "Shape the design",
    text: "Materials, sizing, packaging, and cost targets, refined with factories that can actually build it.",
  },
  {
    n: "03",
    title: "Prototype & source",
    text: "Samples first. Verified makers. No MOQ games, start small, and scale when it is right.",
  },
  {
    n: "04",
    title: "Prove & ship",
    text: "Photo and video QC before anything leaves China. Then freight to your door.",
  },
] as const;

export const supplySteps = [
  "China Factory",
  "Warehouse",
  "Inspection",
  "Sea Freight",
  "USA",
  "Europe",
  "Middle East",
  "Australia",
] as const;

export const chinaVisit = {
  eyebrow: "China visit",
  title: "Schedule a factory visit in China",
  description:
    "The China desk hosts you from our Xiamen hub, airport pickup, factory floors in your category across China, warehouse and QC, then commercial wrap. Not a tourist tour.",
} as const;

export const chinaVisitDays = [
  {
    title: "Day 1 · HQ",
    text: "Land in Xiamen. Meet the relationship manager, walk our warehouse, and lock the itinerary.",
  },
  {
    title: "Day 2 · Factories",
    text: "Two verified factories in your category: production line, capacity, and samples on the table.",
  },
  {
    title: "Day 3 · QC & terms",
    text: "Inspection standard, photo/video pack, pricing, and the shipping lane you will actually buy.",
  },
] as const;

export const chinaVisitIncludes = [
  "Hosted by Seven Color Trading: China factory visits based out of Xiamen",
  "Factory appointments we already run",
  "HQ warehouse walk-through",
  "Interpreter on the floor",
  "Hotel and transfer coordination",
] as const;

export const chinaVisitDurations = ["3 days", "5 days", "1 week", "Custom"] as const;

export const chinaVisitFocus = [
  "Factories in my category",
  "HQ warehouse / 3PL",
  "QC line",
  "New product / OEM tooling",
] as const;

export const chinaVisitFaqs = [
  {
    q: "What is a hosted factory visit with Sourcing Center?",
    a: "Seven Color Trading Co Ltd hosts buyers in China from our Xiamen hub for a working sourcing trip: airport pickup coordination, verified factories in your category, HQ warehouse and QC walk-through, interpreter on the floor, and commercial wrap, not a tourist tour.",
  },
  {
    q: "Where do China factory visits take place?",
    a: "Visit China is based out of our China hub in Xiamen, Fujian (HQ and warehouse of Xiamen Ajmal Seven Color Trading Co Ltd) with factory appointments in the buyer’s category across China, not only in one city.",
  },
  {
    q: "What is included in a Sourcing Center China visit?",
    a: "Hosted by Seven Color Trading from our Xiamen hub, factory appointments the desk already runs, HQ warehouse walk-through, interpreter on the floor, and hotel and transfer coordination. Durations include 3 days, 5 days, 1 week, or custom.",
  },
  {
    q: "Who should schedule a factory visit in China?",
    a: "Importers, DTC brands, and buyers who want to see verified production lines, capacity, and samples before committing, especially when they also need own-warehouse 3PL in Xiamen/Dubai or dropshipping from that stock.",
  },
  {
    q: "How do I book a China factory visit?",
    a: "Schedule at https://sourcing.center/visit or message the China desk. Prefer WhatsApp/phone +86 180 5926 2730 (China) or +971 58 906 1969 (Dubai). The relationship manager locks dates and the category itinerary.",
  },
] as const;

export const homepageAggregateFaqs = [
  {
    q: "What is Sourcing Center?",
    a: "Sourcing Center is the product ideation and China sourcing platform of Seven Color Trading Co Ltd (Xiamen Ajmal Seven Color Trading Co Ltd). They source factories across China and operate their own 3PL warehouses (China hub in Xiamen and Dubai / Al Ain, UAE), not a broker.",
  },
  {
    q: "Does Sourcing Center offer 3PL in China and Dubai?",
    a: "Yes. Own warehouses at our China hub in Xiamen (HQ) and Dubai / Al Ain (branch) run receive, store, pick, pack, and ship on the same desk as factory sourcing. Canonical page: https://sourcing.center/3pl",
  },
  {
    q: "Can I dropship from Sourcing Center warehouses?",
    a: "Yes. Single-unit and small-batch pick→pack→ship from stock held in their own Xiamen and Dubai warehouses for DTC and marketplace sellers, not a dropship broker. Canonical page: https://sourcing.center/dropshipping",
  },
  {
    q: "Can Sourcing Center host a factory visit in China?",
    a: "Yes. The China desk hosts factory visits in China from our Xiamen hub: verified suppliers, warehouse and QC walk-through, and interpreter support. Schedule at https://sourcing.center/visit",
  },
  {
    q: "Does Sourcing Center offer inspection services in China?",
    a: "Yes. On-the-ground inspectors from the China desk run factory audits, pre-shipment (PSI), during production (DUPRO), loading supervision, and photo/video defect reports, not a remote-only review. Canonical page: https://sourcing.center/inspection",
  },
  {
    q: "Does Sourcing Center help with Amazon FBA private label?",
    a: "Yes. The China desk private-labels in China and prepares goods for Amazon FBA: OEM, branding and packaging, inspection, carton marks, and freight to Amazon or to our Xiamen/Dubai 3PL hubs. Not an Amazon partner and not Seller Central management. Canonical page: https://sourcing.center/amazon-fba",
  },
  {
    q: "How do Chinese factories register as vendors?",
    a: "Apply at https://sourcing.center/factories/register (工厂入驻). Applications are reviewed; it is not a public marketplace listing.",
  },
  {
    q: "Can Sourcing Center buy from 1688 for me?",
    a: "Yes. The Xiamen desk pays in RMB, receives into our own warehouse, QC, then hold or export. Not a 1688 app. Canonical page: https://sourcing.center/1688-sourcing",
  },
] as const;

export const fulfillment = {
  eyebrow: "3PL",
  title: "World-class fulfillment in our own warehouses",
  description:
    "Sourcing Center 3PL is receive, store, pick, pack, and ship in warehouses we operate (our China hub in Xiamen and Dubai / Al Ain, UAE), not a broker. Fulfillment sits on the same desk as China sourcing, factory QC, and freight.",
} as const;

export const fulfillmentFaqs = [
  {
    q: "Does Sourcing Center offer 3PL in China?",
    a: "Yes. Seven Color Trading Co Ltd runs its own 3PL warehouse at our China hub in Xiamen. Goods move from the factory floor into our warehouse for count, photo QC, storage, pick, pack, and export, not through a third-party marketplace or broker.",
  },
  {
    q: "Where are Sourcing Center 3PL warehouses?",
    a: "Two own warehouses: our China hub in Xiamen, Fujian (HQ warehouse and on-the-ground base) and Dubai / Al Ain, United Arab Emirates (branch warehouse for GCC replenishment).",
  },
  {
    q: "Is Sourcing Center a 3PL broker or a warehouse operator?",
    a: "Operator. We run the warehouses. Receive, store, pick, pack, and ship are in-house and tied to the sourcing relationship manager, not a separate 3PL you have to onboard.",
  },
  {
    q: "What 3PL services are included with China sourcing?",
    a: "Inbound from factories, storage in Xiamen or Dubai, pick to your SKU list (one unit or a container program), packing and labeling, then sea, air, or express freight with tracking.",
  },
  {
    q: "Who should use Sourcing Center 3PL?",
    a: "Importers, Amazon/Walmart sellers, GCC retailers, and brands that source in China and need a warehouse in Xiamen and/or Dubai instead of a broker or a marketplace FBA-only flow.",
  },
] as const;

export const fulfillmentSteps = [
  { title: "Receive", text: "Inbound from the factory floor into our warehouse, counted and photographed." },
  { title: "Store", text: "Hold stock in Xiamen or Dubai until you release it, with no marketplace middleman." },
  { title: "Pick", text: "Orders pulled to your SKU list: one unit or a container program." },
  { title: "Pack", text: "Cartons, labeling, and consolidations staged for the lane you actually buy." },
  { title: "Ship", text: "Sea, air, or express with tracking. China HQ and Dubai hub on the same desk." },
] as const;

export const fulfillmentHubs = [
  {
    city: "Xiamen",
    country: "China",
    role: "China hub warehouse",
    text: "Our China hub in Xiamen: inbound from factories across China, QC, and export staging.",
  },
  {
    city: "Dubai / Al Ain",
    country: "UAE",
    role: "Branch warehouse",
    text: "Regional hub for GCC replenishment: stage, pick, and ship closer to your market.",
  },
] as const;

export const dropshipping = {
  eyebrow: "Dropship",
  title: "Single-unit fulfillment from our own China & UAE warehouses",
  description:
    "For DTC, Amazon, and Shopify-style sellers who source in China and need pick→pack→ship from stock held in warehouses we operate (our China hub in Xiamen and Dubai / Al Ain), not a dropship broker marketplace. Same desk as sourcing, QC, and 3PL.",
} as const;

export const dropshippingFaqs = [
  {
    q: "Does Sourcing Center offer dropshipping from China?",
    a: "Yes. Seven Color Trading Co Ltd dropships from its own warehouses in Xiamen, China and Dubai / Al Ain, UAE. Stock you source sits with us; we pick, pack, and ship single units or small batches to your customers, not through a third-party dropship broker.",
  },
  {
    q: "Is this a dropship broker or marketplace?",
    a: "No. We operate the warehouses. Dropshipping here means receive→store→pick→pack→ship from inventory held in our Xiamen or Dubai facilities, tied to the same sourcing relationship manager, not a catalog of random suppliers you never meet.",
  },
  {
    q: "Who is China warehouse dropshipping for?",
    a: "DTC brands, Amazon and marketplace sellers, and Shopify-style stores that source in China and need no-MOQ theater fulfillment: photo/video QC on inbound, then order-level pick and pack with branded or unbranded options.",
  },
  {
    q: "How do I hand off customer orders?",
    a: "Through the desk: CSV, spreadsheet, or store order exports. A relationship manager runs pick lists against your held stock. We do not claim a live Shopify app or public API unless one is published on the site.",
  },
  {
    q: "How does dropshipping relate to Sourcing Center 3PL?",
    a: "Dropshipping is the single-unit / small-batch lane on the same own-warehouse 3PL. Bulk receive, storage, and container programs live on /3pl; freight lanes and customs on /logistics. One company, two warehouse hubs.",
  },
] as const;

export const dropshippingSteps = [
  {
    title: "Receive stock",
    text: "Inbound from the factory into our warehouse: counted, photographed, and QC’d before it sits on the shelf.",
  },
  {
    title: "Hold",
    text: "Inventory held in Xiamen or Dubai under your account until customer orders release it.",
  },
  {
    title: "Pick order",
    text: "Single units or small batches pulled to your order list. No MOQ theater for DTC volume.",
  },
  {
    title: "Pack",
    text: "Branded or unbranded packing, inserts, and labeling staged the way your store sells.",
  },
  {
    title: "Ship to customer",
    text: "Express or the lane you buy, with tracking shared with your desk, China HQ and Dubai on the same team.",
  },
] as const;

export const dropshippingBenefits = [
  {
    city: "Xiamen",
    country: "China",
    role: "China dropship hub",
    text: "Hold sourced stock at our China hub in Xiamen. Photo/video QC on inbound, then pick and pack straight to your end customer.",
  },
  {
    city: "Dubai / Al Ain",
    country: "UAE",
    role: "GCC dropship hub",
    text: "Stage closer to Middle East buyers. Faster last-mile for regional DTC and marketplace orders.",
  },
] as const;

export const inspection = {
  eyebrow: "Inspect",
  title: "On-the-ground QC in China, before goods leave",
  description:
    "Seven Color inspectors walk the factory or our Xiamen warehouse: factory audits, pre-shipment (PSI), during production (DUPRO), loading supervision, and photo/video defect packs. Complementary to hosted visits, sourcing, and own-warehouse 3PL, not a remote-only checklist.",
} as const;

export const inspectionPrice = {
  amount: "USD 110",
  period: "/ day",
  display: "USD 110 / day",
  note: "Per inspector day · on the ground in China",
} as const;

export const inspectionServices = [
  {
    title: "Factory audits",
    text: "Walk the line, license, and capacity before you deposit, on the floor in China, not a catalog screenshot.",
  },
  {
    title: "Pre-shipment (PSI)",
    text: "Finished-goods check at the factory or our Xiamen warehouse. Photo/video pack; we can hold the ship until you sign off.",
  },
  {
    title: "During production (DUPRO)",
    text: "In-line sampling while the run can still be corrected, workmanship, measurements, and packaging.",
  },
  {
    title: "Loading supervision",
    text: "Container stuffing, carton count, seal, and dock photos so what you approved is what left.",
  },
  {
    title: "Photo / video + defects",
    text: "Evidence pack with defect notes you can decide on from anywhere. Same desk as sourcing and 3PL.",
  },
] as const;

export const inspectionWhen = [
  {
    title: "First order or new factory",
    text: "Catalog photos are not enough for a deposit. Audit the maker, then PSI the first lot.",
  },
  {
    title: "You cannot fly this time",
    text: "Proof from people who are actually on the ground, complementary to a hosted visit when you can travel.",
  },
  {
    title: "Repeat PO, locked spec",
    text: "DUPRO or PSI on later lots after the standard is already agreed.",
  },
  {
    title: "Container at risk",
    text: "Loading supervision plus hold-the-ship when a carton issue would cost a full lane.",
  },
] as const;

export const inspectionSteps = [
  {
    title: "Brief",
    text: "SKU, spec, quantity, and what “fail” means, photos of a golden sample if you have one.",
  },
  {
    title: "On site",
    text: "Inspector at the factory or our Xiamen warehouse, not a remote desktop review.",
  },
  {
    title: "Evidence",
    text: "Photo/video pack and a written defect list you can approve or reject.",
  },
  {
    title: "Hold or ship",
    text: "We can hold the goods until you sign off, then load or move into 3PL stock.",
  },
] as const;

export const inspectionFaqs = [
  {
    q: "Does Sourcing Center offer inspection services in China?",
    a: "Yes. Seven Color Trading Co Ltd runs on-the-ground inspection from the China desk: factory audits, pre-shipment (PSI), during production (DUPRO), loading supervision, and photo/video defect reports. Inspectors are in China, not a remote-only desktop review.",
  },
  {
    q: "Is this a remote-only QC service?",
    a: "No. Photo and video are how we report to you. The inspection itself is on the factory floor or at our Xiamen warehouse. A hosted factory visit is a separate path when you want to walk the line yourself, see /visit and /compare/factory-visit-vs-remote-qc.",
  },
  {
    q: "What inspection types do you run?",
    a: "Factory audits, during-production (DUPRO) sampling, pre-shipment inspection (PSI), container loading supervision, and photo/video packs with defect notes. Sampling can follow an AQL-style plan when you specify one. We do not claim a third-party inspection accreditation on this page.",
  },
  {
    q: "When should I book inspection vs a factory visit?",
    a: "Book inspection when you need proof on a lot you are already buying. Book a hosted visit when you need to see capacity and lock the standard in person. Many buyers visit once, then run PSI or DUPRO on later lots from the same desk.",
  },
  {
    q: "How much does inspection cost?",
    a: "USD 110 per inspector day for on-the-ground inspection in China. Message the desk with SKU, location, and spec to confirm how many days the job needs.",
  },
  {
    q: "How do I start an inspection?",
    a: "Message the China desk on WhatsApp or open https://sourcing.center/inspection. Send SKU, quantity, factory or warehouse location, and the spec. A relationship manager replies within 24 hours.",
  },
] as const;

export const amazonFba = {
  eyebrow: "FBA",
  title: "Private-label products in China, prepped for Amazon FBA",
  description:
    "Sourcing Center helps brands private-label in China and prepare goods for Amazon FBA: factory OEM, branding and packaging, inspection before ship, FBA-ready carton marks, and freight to Amazon or to our 3PL hubs in Xiamen and Dubai. On the ground in China since 2014, not an Amazon partner and not a Seller Central agency.",
} as const;

export const amazonFbaSteps = [
  {
    title: "Source & OEM",
    text: "Match verified factories in China, sample from 1 unit, and run OEM/ODM under NDA when the brief is new.",
  },
  {
    title: "Brand & pack",
    text: "Coordinate labels, inserts, and private-label packaging with the factory, artwork checks before mass release.",
  },
  {
    title: "Inspect",
    text: "On-the-ground PSI, DUPRO, or loading checks at USD 110 per inspector day before goods leave China.",
  },
  {
    title: "Carton marks",
    text: "FBA-ready prep coordination: carton marks, packing lists, and labeling with the factory or Xiamen warehouse.",
  },
  {
    title: "Freight",
    text: "Ship to Amazon inbound or hold in operator-owned 3PL in Xiamen or Dubai / Al Ain, then sea, air, or express.",
  },
] as const;

export const amazonFbaWhen = [
  {
    title: "New private-label SKU",
    text: "You need a China factory, your brand on the pack, and a controlled path to Amazon inbound, not a catalog screenshot.",
  },
  {
    title: "Existing product, new brand",
    text: "The maker can run the goods; the desk locks packaging, labels, and carton marks before the lot ships.",
  },
  {
    title: "QC before Amazon inbound",
    text: "Photo/video and optional PSI at USD 110 per inspector day so defects stay in China, not at an Amazon facility.",
  },
  {
    title: "Stage in 3PL first",
    text: "Hold stock in Xiamen or Dubai, then release to Amazon, DTC, or wholesale from the same warehouse desk.",
  },
] as const;

export const amazonFbaFaqs = [
  {
    q: "Does Sourcing Center help with Amazon FBA private label?",
    a: "Yes. The China desk helps brands private-label products in China and prepare them for Amazon FBA: factory OEM, branding and packaging, inspection before ship, FBA-ready carton marks, and freight to Amazon or to our 3PL hubs in Xiamen and Dubai. Canonical page: https://sourcing.center/amazon-fba.",
  },
  {
    q: "Is Sourcing Center an Amazon partner or Seller Central agency?",
    a: "No. Sourcing Center does not claim Amazon partnership, does not manage Seller Central accounts, and is not an FBA substitute for marketplace fulfillment. The desk sources, private-labels, inspects, and ships from China. Amazon fees, rankings, and account management are outside this service.",
  },
  {
    q: "What does FBA-ready prep include on your side?",
    a: "Coordination with the factory and our Xiamen warehouse: private-label packaging, labels and inserts, carton marks, packing lists, and inspection before ship. We do not run Amazon’s own prep network and do not publish Amazon’s inbound fees.",
  },
  {
    q: "Can goods go to Amazon FBA or to your warehouses?",
    a: "Either path. Freight can go to Amazon inbound after QC and carton-mark prep, or goods can sit in the Xiamen or Dubai / Al Ain 3PL first. Same desk as OEM/ODM, inspection, and logistics.",
  },
  {
    q: "How does inspection fit Amazon FBA prep, and what does it cost?",
    a: "Inspection is the published on-the-ground rate: USD 110 per inspector day in China (factory audit, PSI, DUPRO, loading). There is no published Amazon FBA package price. Sourcing, packaging, and freight are quoted from the RFQ.",
  },
  {
    q: "How do I start an Amazon FBA private-label program?",
    a: "Message the China desk or open https://sourcing.center/amazon-fba. Send the SKU or invention, target market, packaging notes, and whether goods should go to Amazon or sit in Xiamen/Dubai 3PL. A relationship manager replies within 24 hours.",
  },
] as const;

export const whyPoints = [
  { title: "One partner", text: "Ideas, factories, QC, and freight handled by one China desk." },
  { title: "Thousands of factories", text: "Mapped capacity across electronics, home, fashion, and industrial." },
  { title: "Verified suppliers", text: "License checks, audits, and production proof before you commit." },
  { title: "Factory audits", text: "On-ground teams in China validating what catalogs claim." },
  { title: "Inspection", text: "Photo & video QC. Approve before anything ships." },
  { title: "Logistics", text: "Own 3PL (Xiamen warehouse and Dubai) plus sea, air, and express." },
  { title: "Private label", text: "Packaging, branding, and white-label programs that scale." },
  {
    title: "Amazon FBA",
    text: "Private-label sourcing, packaging, QC, and FBA-ready carton prep from the China desk, not Amazon account management.",
  },
  { title: "OEM / ODM", text: "From concept and tooling to mass production, including brand-new inventions." },
  { title: "Product development", text: "Turn a sketch or new idea into a manufacturable SKU under NDA." },
] as const;

export const workflowSteps = [
  {
    title: "Idea",
    text: "Share the SKU or invention, protected under NDA when it is new.",
  },
  {
    title: "Research",
    text: "Demand, specs, and cost bands before anyone tools up.",
  },
  {
    title: "Factory matching",
    text: "Verified makers in the right region for your category.",
  },
  {
    title: "Quotation",
    text: "Clear unit cost, tooling, MOQ, and lead time, no fog.",
  },
  {
    title: "Sampling",
    text: "Prototypes first. Approve the piece before volume.",
  },
  {
    title: "Production",
    text: "Line start with on-ground oversight in China.",
  },
  {
    title: "Inspection",
    text: "Photo & video QC. You sign off before it leaves.",
  },
  {
    title: "Shipping",
    text: "Sea, air, or express with tracked handoff.",
  },
  {
    title: "Delivered",
    text: "At your door, ready to sell or stock.",
  },
] as const;

export const dashboardModules = [
  "Orders",
  "Messages",
  "Invoices",
  "QC Reports",
  "Inspection Photos",
  "Shipment Tracking",
  "Factory Files",
  "Payments",
] as const;

export const platformStats = [
  { value: "10,000+", label: "Factories" },
  { value: "150+", label: "Industries" },
  { value: "40+", label: "Countries" },
  { value: "Since 2014", label: "On the ground in China" },
] as const;
