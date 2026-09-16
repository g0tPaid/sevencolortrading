/**
 * Public reviews for /reviews.
 *
 * Only `approved: true` quotes ship on the page (and in the JS bundle via the
 * published list). Do not invent Reddit usernames, permalinks, or star ratings.
 * When a real attributed quote is approved, add it here with `approved: true`
 * and optionally `permalink` + `sourceLabel`.
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
  /** Official permalink only. Leave unset until a live URL is approved. */
  permalink?: string;
  /** Flip true only for a quote the desk has approved to publish. */
  approved: boolean;
};

export const reviewsIntro = {
  eyebrow: "References",
  title: "Ask for a live reference, not a review farm",
  description:
    "This page does not publish star ratings, Trustpilot widgets, or anonymous quotes. Licenses and DUNS are on the about and FAQ pages. For a named client intro, WhatsApp the desk.",
  moreLine:
    "We will share an approved reference on WhatsApp when we have one that matches your market. Until then, verify the China and UAE licenses yourself.",
} as const;

/** Only approved rows are rendered. Keep this empty rather than shipping placeholders. */
export const reviews: Review[] = [];

export function publishedReviews(): Review[] {
  return reviews.filter((review) => review.approved);
}
