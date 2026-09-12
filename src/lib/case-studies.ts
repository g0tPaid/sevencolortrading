/**
 * Example case-study programs for /case-studies.
 * Metrics and narratives are illustrative — replace with approved client facts
 * before treating them as published outcomes.
 */

export type CaseStudyMetric = {
  label: string;
  value: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  industry: string;
  summary: string;
  result: string;
  problem: string;
  whatWeDid: string[];
  outcome: string;
  metrics: CaseStudyMetric[];
  whatsappPreset: "factorySourcing" | "threePl" | "factoryVisit";
};

export const caseStudiesIntro = {
  eyebrow: "Case studies",
  title: "How the desk actually runs",
  description:
    "Three example programs — new-product factory sourcing, own-warehouse 3PL in Xiamen and Dubai, and a hosted factory visit with QC. Figures are illustrative of the operating model, not published client KPIs.",
  sampleNote:
    "Example programs for structure and tone. Metrics are illustrative. Swap in approved client facts before treating these as live case studies.",
} as const;

export const caseStudies: CaseStudy[] = [
  {
    slug: "china-factory-sourcing",
    title: "China factory sourcing for a first SKU",
    industry: "New product",
    summary:
      "A DTC founder needed a manufacturable path for a compact travel appliance — NDA, verified makers, samples from one unit, then a controlled pilot.",
    result: "Sample path and pilot lot without a catalog-MOQ speech.",
    problem:
      "The founder had a buildable idea and a cost band, but no China network. Marketplace quotes ignored the spec, asked for a 3,000-piece first run, and offered no photo proof before a deposit. They needed a factory that could sample from one unit and a desk that would stay on the line through QC.",
    whatWeDid: [
      "Signed an NDA before the brief left the Xiamen desk.",
      "Shortlisted two verified makers in the right appliance cluster — not a public catalog dump.",
      "Built a sample from one unit: materials, BOM, pack, and a photographed cost target.",
      "Held production until the founder approved the photo/video pack.",
    ],
    outcome:
      "The buyer left with a locked sample, a written unit-cost band, and a pilot quantity they could actually sell through — then freight on the same desk. No third marketplace in the middle.",
    metrics: [
      { label: "Factories shortlisted", value: "2" },
      { label: "Sample turnaround", value: "11 days" },
      { label: "Pilot lot", value: "280 units" },
    ],
    whatsappPreset: "factorySourcing",
  },
  {
    slug: "xiamen-dubai-3pl",
    title: "Xiamen and Dubai 3PL on one desk",
    industry: "3PL",
    summary:
      "A GCC retailer already bought in China but lost time between factory release, a brokered warehouse, and Dubai inbound. Stock moved into warehouses we operate.",
    result: "Factory inbound, photo QC, and GCC replenishment without a 3PL broker.",
    problem:
      "Counts lived in one inbox, QC in another, and Dubai inbound in a third. The retailer did not need another introduction to someone else’s warehouse — they needed receive, store, pick, pack, and ship next to the factory relationship.",
    whatWeDid: [
      "Received lots from the factory floor into the Xiamen HQ warehouse — counted and photographed.",
      "Ran photo QC on inbound before anything sat as sellable stock.",
      "Staged replenishment in the Dubai / Al Ain warehouse closer to the shelf.",
      "Released weekly pick waves from either hub on the same relationship manager.",
    ],
    outcome:
      "Sourcing, warehouse, and freight stayed on one operator — Seven Color Trading Co Ltd — not a broker stack. The buyer could hold in China, forward to the UAE, or pick a mixed lane without re-onboarding a 3PL.",
    metrics: [
      { label: "Hubs used", value: "Xiamen + Dubai" },
      { label: "China → UAE cycle", value: "12 days" },
      { label: "Pick cadence", value: "Weekly waves" },
    ],
    whatsappPreset: "threePl",
  },
  {
    slug: "factory-visit-qc",
    title: "Hosted factory visit and QC on the floor",
    industry: "Visit / QC",
    summary:
      "A buyer would not commit a container on catalog photos. The Xiamen desk hosted a working trip: warehouse, two factories, inspection standard, then terms.",
    result: "QC pack and commercial brief locked before the flight home.",
    problem:
      "Catalog images and a video call were not enough to release a deposit. The buyer needed to walk capacity, see in-process goods, and agree defect language in the same room as the factory — without a tourist itinerary.",
    whatWeDid: [
      "Hosted arrival in Xiamen: airport coordination, HQ warehouse walk-through, locked itinerary.",
      "Ran two verified factory appointments in the buyer’s category — line, capacity, samples on the table.",
      "Walked the inspection standard and photo/video pack the desk already uses before export.",
      "Closed commercial terms and the shipping lane they would actually buy.",
    ],
    outcome:
      "The buyer signed the production brief after seeing the floor. Interpreter, transfers, and hotel coordination sat with the same desk that would later run QC — not a tour operator handed off at the gate.",
    metrics: [
      { label: "Itinerary", value: "3 working days" },
      { label: "Factories visited", value: "2" },
      { label: "QC pack", value: "Locked on day 3" },
    ],
    whatsappPreset: "factoryVisit",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
