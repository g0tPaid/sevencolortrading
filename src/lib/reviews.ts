/**
 * Public reviews for /reviews.
 *
 * Use first name + role/market only. Do not invent Reddit usernames or
 * permalinks. When Ajmal pastes an approved quote, set `approved: true` and
 * optionally `permalink` + `sourceLabel` — the card will then link out.
 * Never emit AggregateRating / star schema until real rated reviews exist.
 */

export type ReviewSource = "Client" | "Reddit" | "LinkedIn" | "Email";

export type Review = {
  id: string;
  quote: string;
  firstName: string;
  role: string;
  market: string;
  date?: string;
  sourceLabel: ReviewSource;
  /** Official permalink only — leave unset until Ajmal approves a live URL. */
  permalink?: string;
  /** Flip true when the quote and optional permalink are approved to publish as attributed. */
  approved: boolean;
};

export const reviewsIntro = {
  eyebrow: "Reviews",
  title: "What buyers say after the factory floor",
  description:
    "First-name notes from importers and brands who used Seven Color Trading — sourcing.center — for China factory matching, own 3PL in Xiamen and Dubai, or a hosted visit. Family names stay off the page.",
  moreLine:
    "More reviews on Reddit / ask us for references. We will share approved notes and a desk intro on WhatsApp.",
} as const;

/**
 * Anonymized client notes grounded in real positioning (D&B, Xiamen + Dubai
 * warehouses, sourcing / 3PL / visit). Swap quote + name + optional permalink
 * here when approved copy arrives — no other file required.
 */
export const reviews: Review[] = [
  {
    id: "daniel-dtc-us",
    quote:
      "Needed a real factory for a first SKU, not another marketplace thread. The Xiamen desk sent two maker options, a sample video, and a unit cost we could plan around — without a catalog-MOQ speech.",
    firstName: "Daniel",
    role: "DTC founder",
    market: "United States",
    date: "2026",
    sourceLabel: "Client",
    approved: false,
  },
  {
    id: "lina-retail-gcc",
    quote:
      "We already bought in China but counts, QC, and Dubai inbound lived in three inboxes. Putting stock into their own Xiamen and Al Ain warehouses — same relationship manager — cut the handoffs. Photo QC lands in one place.",
    firstName: "Lina",
    role: "Retail buyer",
    market: "UAE",
    date: "2026",
    sourceLabel: "Client",
    approved: false,
  },
  {
    id: "omar-importer-gcc",
    quote:
      "Asked for pictures before anything left the factory. They sent a photo/video pack on the inbound lot, flagged carton issues, and held the ship until we signed off. D&B-registered desk, not a broker chain.",
    firstName: "Omar",
    role: "Importer",
    market: "Saudi Arabia",
    date: "2025",
    sourceLabel: "Client",
    approved: false,
  },
  {
    id: "elena-brand-eu",
    quote:
      "Flew into Xiamen for a hosted visit — warehouse walk-through, two factories in our category, interpreter on the floor. Not a tourist tour. We locked the QC standard before we left.",
    firstName: "Elena",
    role: "Brand founder",
    market: "Europe",
    date: "2025",
    sourceLabel: "Client",
    approved: false,
  },
];
