import { TrackingInputError } from "@/lib/tracking/types";
import { normalizeTrackingNumber } from "@/lib/tracking/validate";

export type SearchPresentation = { kind: "invalid"; message: string } | { kind: "search"; number: string };

/** Invalid numbers do not start a lookup. Valid numbers use the same rules as the API. */
export function searchPresentation(input: string): SearchPresentation {
  try {
    const number = normalizeTrackingNumber(input);
    return { kind: "search", number };
  } catch (error) {
    const message =
      error instanceof TrackingInputError
        ? error.message
        : "Enter a tracking number of 4–40 letters and digits.";
    return { kind: "invalid", message };
  }
}

/**
 * Scroll the timeline into view once per search, and only when a real result
 * card exists. Polling the same search must not scroll again.
 */
export function shouldBringTimelineIntoView(input: {
  hasTimeline: boolean;
  searchId: number;
  broughtForSearchId: number | null;
}): boolean {
  if (!input.hasTimeline || input.searchId <= 0) return false;
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
