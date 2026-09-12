/**
 * Curated review cards for /reviews.
 *
 * Every entry is a SAMPLE until the product owner pastes approved Reddit /
 * LinkedIn quotes and permalinks. Do not treat these as live testimonials.
 * Do not emit AggregateRating / star schema until real copy is in place.
 */

export type ReviewSource = "Reddit" | "LinkedIn" | "Email";

export type Review = {
  id: string;
  quote: string;
  name: string;
  handle: string;
  source: ReviewSource;
  date?: string;
  url: string;
  /** Always true for in-repo samples. Flip off only when a quote is approved. */
  sample: true;
};

export const reviewsIntro = {
  eyebrow: "Reviews",
  title: "What buyers say after the factory floor",
  description:
    "Seven Color Trading — sourcing.center — is a China desk with own warehouses in Xiamen and Dubai. These cards show the format we will use for public notes from Reddit, LinkedIn, and client desks.",
  sampleNote:
    "Sample reviews for layout only. Replace each quote, handle, and link-out with an approved permalink before launch. No star ratings until then.",
} as const;

export const sampleReviews: Review[] = [
  {
    id: "reddit-first-sku",
    quote:
      "Needed a real factory for a first SKU, not another Alibaba thread. The Xiamen desk sent two maker options, a sample video, and a unit cost we could actually plan around — without a 3,000-piece MOQ speech.",
    name: "Jordan Hale",
    handle: "u/example-buyer-jordan",
    source: "Reddit",
    date: "Mar 2026",
    url: "https://www.reddit.com/r/smallbusiness/",
    sample: true,
  },
  {
    id: "linkedin-3pl",
    quote:
      "We were stitching a China factory, a brokered warehouse, and Dubai inbound across three inboxes. Putting stock into their own Xiamen and Al Ain warehouses — same relationship manager — cut the handoffs. Counts and photo QC land in one place.",
    name: "Lina Farouk",
    handle: "example-lina-farouk",
    source: "LinkedIn",
    date: "Feb 2026",
    url: "https://www.linkedin.com/",
    sample: true,
  },
  {
    id: "reddit-qc",
    quote:
      "Asked for pictures before anything left the factory. They sent a photo/video pack on the inbound lot, flagged two carton issues, and held the ship until we signed off. Boring in the best way.",
    name: "Chris Nguyen",
    handle: "u/example-qc-chris",
    source: "Reddit",
    date: "Jan 2026",
    url: "https://www.reddit.com/r/FulfillmentByAmazon/",
    sample: true,
  },
  {
    id: "linkedin-visit",
    quote:
      "Flew into Xiamen for a hosted visit — warehouse walk-through, two factories in our category, interpreter on the floor. Not a tourist tour. We locked the QC standard before we left.",
    name: "Elena Rossi",
    handle: "example-elena-rossi",
    source: "LinkedIn",
    url: "https://www.linkedin.com/",
    sample: true,
  },
];
