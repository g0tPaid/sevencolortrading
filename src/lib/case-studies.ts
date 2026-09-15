/**
 * Anonymized case-study programs for /case-studies.
 * Outcomes are conservative ranges from typical desk engagements.
 * Cards are labeled “example engagement” until a named client approves facts.
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
  /** Always true until a named, approved client story replaces the range. */
  exampleEngagement: true;
};

export const caseStudiesIntro = {
  eyebrow: "Case studies",
  title: "How the desk actually runs",
  description:
    "Three anonymized programs: factory sourcing across China, own-warehouse 3PL from our Xiamen warehouse and Dubai, and a hosted Visit China trip with QC. Figures are conservative ranges from example engagements, not published client KPIs.",
  exampleNote:
    "Example engagements. Ranges are typical of how the desk operates. Swap in approved client facts when they are cleared to publish.",
} as const;

export const caseStudies: CaseStudy[] = [
  {
    slug: "china-factory-sourcing",
    title: "China factory sourcing for a first SKU",
    industry: "New product",
    summary:
      "A DTC founder needed a manufacturable path: NDA, verified makers, a sample from one unit, then a controlled pilot.",
    result: "Sample path and a sellable pilot. No catalog-MOQ speech.",
    problem:
      "Buildable idea, no China network. Marketplace quotes ignored the spec, asked for a 3,000-piece first run, and offered no photo proof before a deposit.",
    whatWeDid: [
      "NDA before the brief left the China desk.",
      "Shortlisted two verified makers in the right cluster.",
      "Sample from one unit: materials, pack, photographed cost target.",
      "Held production until the buyer approved the photo/video pack.",
    ],
    outcome:
      "Locked sample, a written unit-cost band, and a pilot they could sell through. Freight on the same desk. No third marketplace in the middle.",
    metrics: [
      { label: "Factories shortlisted", value: "2–3" },
      { label: "Sample turnaround", value: "1–2 weeks" },
      { label: "Typical pilot", value: "100–500 units" },
    ],
    whatsappPreset: "factorySourcing",
    exampleEngagement: true,
  },
  {
    slug: "xiamen-dubai-3pl",
    title: "China hub and Dubai 3PL on one desk",
    industry: "3PL",
    summary:
      "A GCC retailer already bought in China but lost time between factory release, a brokered warehouse, and Dubai inbound.",
    result: "Factory inbound, photo QC, and GCC replenishment. No 3PL broker.",
    problem:
      "Counts in one inbox, QC in another, Dubai inbound in a third. They needed receive, store, pick, pack, and ship next to the factory relationship.",
    whatWeDid: [
      "Received lots into our China hub warehouse in Xiamen, counted and photographed.",
      "Photo QC on inbound before stock sat as sellable.",
      "Staged replenishment in the Dubai / Al Ain warehouse.",
      "Released pick waves from either hub on the same manager.",
    ],
    outcome:
      "Sourcing, warehouse, and freight stayed on one operator: Seven Color Trading Co Ltd. Hold in China, forward to the UAE, or mix lanes without re-onboarding a 3PL.",
    metrics: [
      { label: "Hubs used", value: "Xiamen + Dubai" },
      { label: "China → UAE cycle", value: "10–16 days" },
      { label: "Pick cadence", value: "Weekly waves" },
    ],
    whatsappPreset: "threePl",
    exampleEngagement: true,
  },
  {
    slug: "factory-visit-qc",
    title: "Hosted factory visit and QC on the floor",
    industry: "Visit / QC",
    summary:
      "A buyer would not commit a container on catalog photos. The China desk hosted a working Visit China trip: warehouse, two factories, inspection standard, then terms.",
    result: "QC pack and commercial brief locked before the flight home.",
    problem:
      "Catalog images and a video call were not enough to release a deposit. They needed to walk capacity and agree defect language in the same room as the factory.",
    whatWeDid: [
      "Hosted arrival in Xiamen: airport coordination, HQ warehouse, locked itinerary.",
      "Two verified factory appointments: line, capacity, samples on the table.",
      "Walked the inspection standard and photo/video pack used before export.",
      "Closed commercial terms and the shipping lane they would buy.",
    ],
    outcome:
      "Production brief signed after seeing the floor. Interpreter, transfers, and hotel sat with the same desk that later ran QC, not a tour operator at the gate.",
    metrics: [
      { label: "Typical itinerary", value: "3 working days" },
      { label: "Factories on the floor", value: "2–3" },
      { label: "QC pack", value: "Locked before departure" },
    ],
    whatsappPreset: "factoryVisit",
    exampleEngagement: true,
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
