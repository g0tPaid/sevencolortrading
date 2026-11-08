import { TrackingInputError } from "@/lib/tracking/types";
import { normalizeTrackingNumber } from "@/lib/tracking/validate";

/** House line shown on a valid search. Capitalization is part of the copy. */
export const PROMO_LEAD = "Buy anything from China from ";
export const PROMO_HOST = "www.sourcing.center";
export const PROMO_COPY = `${PROMO_LEAD}${PROMO_HOST}`;
export const PROMO_HREF = "https://www.sourcing.center";
/** Lookup starts immediately. The result stays hidden for this long. */
export const PROMO_HOLD_MS = 3000;

export type SearchPresentation =
  | { kind: "invalid"; message: string }
  | { kind: "search"; number: string; holdMs: number; promo: string; href: string };

/** Invalid numbers never start the promo. Valid numbers use the same rules as the API. */
export function searchPresentation(input: string): SearchPresentation {
  try {
    const number = normalizeTrackingNumber(input);
    return { kind: "search", number, holdMs: PROMO_HOLD_MS, promo: PROMO_COPY, href: PROMO_HREF };
  } catch (error) {
    const message =
      error instanceof TrackingInputError
        ? error.message
        : "Enter a tracking number of 4–40 letters and digits.";
    return { kind: "invalid", message };
  }
}

/**
 * Scroll the timeline into view once per search, after the promo hold, and only
 * when a real result card exists. Polling the same search must not scroll again.
 */
export function shouldBringTimelineIntoView(input: {
  holding: boolean;
  hasTimeline: boolean;
  searchId: number;
  broughtForSearchId: number | null;
}): boolean {
  if (input.holding || !input.hasTimeline || input.searchId <= 0) return false;
  return input.broughtForSearchId !== input.searchId;
}

export function timelineScrollBehavior(prefersReducedMotion: boolean): ScrollBehavior {
  return prefersReducedMotion ? "auto" : "smooth";
}

/** Matches the timeline's scroll-mt-32 offset under the fixed header. */
export const TIMELINE_HEADER_OFFSET = 128;

/** Scroll only when the timeline heading is under the header or below the fold. */
export function timelineNeedsScroll(top: number, viewportHeight: number, headerOffset = TIMELINE_HEADER_OFFSET): boolean {
  const minimumVisible = 160;
  return top < headerOffset || top > viewportHeight - minimumVisible;
}
