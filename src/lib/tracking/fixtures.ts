import type { TrackBody } from "@/lib/tracking/types";

/**
 * Synthetic carrier replies for tests and screenshots.
 * These are not live carrier responses and do not use a customer tracking number.
 */

export const FIXTURE_TRACKING_NUMBER = "FIXTUREUPS123456789";

export const FIXTURE_IN_TRANSIT: TrackBody = {
  carrier: "ups",
  source: "fixture",
  result: {
    status: "Fixture in transit",
    current_stage: "in_transit",
    last_status_text: "Fixture scan — departed facility. Not a live carrier response.",
    last_update: "2026-03-02T10:00:00.000Z",
    expected_delivery: null,
    origin_country: "CN",
    destination_country: "US",
    events: [
      {
        stage: "accepted",
        stage_source: "fixture",
        instant: "2026-03-01T08:00:00.000Z",
        description: "Fixture scan — picked up. Not a live carrier response.",
        location: "Shenzhen",
      },
      {
        stage: "in_transit",
        stage_source: "fixture",
        instant: "2026-03-02T10:00:00.000Z",
        description: "Fixture scan — departed facility. Not a live carrier response.",
        location: "Guangzhou",
      },
    ],
  },
  attempts: [{ source: "fixture", kind: "ok", durationMs: 5 }],
};

export const FIXTURE_WITH_ETA: TrackBody = {
  ...FIXTURE_IN_TRANSIT,
  result: {
    ...FIXTURE_IN_TRANSIT.result,
    expected_delivery: "2026-03-06",
  },
};

export const FIXTURE_DELIVERED: TrackBody = {
  carrier: "ups",
  source: "fixture",
  result: {
    current_stage: "delivered",
    last_status_text: "Fixture scan — delivered. Not a live carrier response.",
    expected_delivery: null,
    events: [
      {
        stage: "delivered",
        stage_source: "fixture",
        instant: "2026-03-08T15:00:00.000Z",
        description: "Fixture scan — delivered. Not a live carrier response.",
        location: "Austin",
      },
    ],
  },
};
