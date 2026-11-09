import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  PROMO_COPY,
  PROMO_HOLD_MS,
  PROMO_HREF,
  promoMotionFitsHold,
  searchPresentation,
  shouldBringTimelineIntoView,
  timelineNeedsScroll,
  timelineScrollBehavior,
} from "@/lib/tracking/track-present";

test("a valid search holds the real result for three seconds behind the house line", () => {
  assert.equal(PROMO_COPY, "Buy anything from China from www.sourcing.center");
  assert.equal(PROMO_HREF, "https://www.sourcing.center");
  assert.equal(PROMO_HOLD_MS, 3000);
  const ready = searchPresentation(" 384423693978 ");
  assert.equal(ready.kind, "search");
  if (ready.kind !== "search") return;
  assert.equal(ready.number, "384423693978");
  assert.equal(ready.holdMs, 3000);
  assert.equal(ready.promo, PROMO_COPY);
  assert.equal(ready.href, PROMO_HREF);
  assert.equal(ready.promo.includes("?"), false);
  assert.equal(promoMotionFitsHold(), true);
  assert.equal(promoMotionFitsHold(undefined, 2000), false);
});

test("invalid input does not start the promo", () => {
  for (const input of ["", "   ", "12", "!!!", "hello", "buy anything"]) {
    const presentation = searchPresentation(input);
    assert.equal(presentation.kind, "invalid", input);
    if (presentation.kind !== "invalid") continue;
    assert.equal(presentation.message.includes("sourcing.center"), false);
  }
});

test("the timeline is brought in once after the hold, including a later search", () => {
  assert.equal(
    shouldBringTimelineIntoView({ holding: true, hasTimeline: true, searchId: 1, broughtForSearchId: null }),
    false,
  );
  assert.equal(
    shouldBringTimelineIntoView({ holding: false, hasTimeline: false, searchId: 1, broughtForSearchId: null }),
    false,
  );
  assert.equal(
    shouldBringTimelineIntoView({ holding: false, hasTimeline: true, searchId: 1, broughtForSearchId: null }),
    true,
  );
  assert.equal(
    shouldBringTimelineIntoView({ holding: false, hasTimeline: true, searchId: 1, broughtForSearchId: 1 }),
    false,
  );
  assert.equal(
    shouldBringTimelineIntoView({ holding: false, hasTimeline: true, searchId: 2, broughtForSearchId: 1 }),
    true,
  );
  assert.equal(timelineScrollBehavior(false), "smooth");
  assert.equal(timelineScrollBehavior(true), "auto");
  assert.equal(timelineNeedsScroll(180, 800), false);
  assert.equal(timelineNeedsScroll(40, 800), true);
  assert.equal(timelineNeedsScroll(760, 800), true);
});

test("the route illustration keeps its honesty label and does not print Natural Earth", () => {
  const page = readFileSync(new URL("../../components/tracking/track-lookup.tsx", import.meta.url), "utf8");
  assert.equal(page.includes("Natural Earth"), false);
  assert.equal(page.includes(">Route illustration<"), true);
  assert.equal(page.includes(PROMO_COPY), false);
  const promo = readFileSync(new URL("../../components/tracking/track-promo.tsx", import.meta.url), "utf8");
  assert.equal(promo.includes("PROMO_COPY"), true);
  assert.equal(promo.includes("progressbar"), false);
  assert.equal(promo.includes("aria-valuenow"), false);
  assert.match(promo, /prefers-reduced-motion:\s*reduce/);
  assert.match(promo, /sourcing-center-plane\.png/);
  assert.equal(promo.includes("scaleX(-1)"), false);
  assert.equal(promo.includes("rotate("), false);
  assert.equal(page.includes("scroll-mt-32"), true);
  assert.equal(page.includes("Track Global Parcels"), true);
  assert.match(page, /color:\s*#d60000/);
  assert.equal(page.includes("/tracking/sourcing-center-plane.png"), true);
  assert.equal(page.includes("track-cozy-cloud"), false);
  assert.equal(page.includes("track-cozy-plane"), false);
  const card = readFileSync(new URL("../../components/tracking/track-sourcing-card.tsx", import.meta.url), "utf8");
  assert.equal(card.includes("/tracking/sourcing-center-ad-banner.webp"), true);
  assert.equal(card.includes("/tracking/sourcing-center-plane.png"), false);
  assert.match(card, /\{TRACK_HOME_LABEL\}/);
  assert.match(card, /href=\{TRACK_HOME_HREF\}/);
  const land = readFileSync(new URL("../../components/home/world-land-path.ts", import.meta.url), "utf8");
  assert.match(land, /Natural Earth 110m/);
  assert.match(land, /public domain/i);
});
