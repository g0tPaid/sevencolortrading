import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  searchPresentation,
  shouldBringTimelineIntoView,
  timelineNeedsScroll,
  timelineScrollBehavior,
} from "@/lib/tracking/track-present";

test("a valid search starts a lookup with no promotional hold", () => {
  const ready = searchPresentation(" 384423693978 ");
  assert.equal(ready.kind, "search");
  if (ready.kind !== "search") return;
  assert.equal(ready.number, "384423693978");
  assert.equal("holdMs" in ready, false);
  const page = readFileSync(new URL("../../components/tracking/track-lookup.tsx", import.meta.url), "utf8");
  assert.equal(page.includes("TrackPromo"), false);
  assert.equal(page.includes("setHoldId"), false);
  assert.equal(page.includes("Buy anything from China"), false);
  assert.match(page, /Checking this number with the carrier/);
  assert.equal(page.includes("TrackCarrierStrip"), true);
  const carriers = readFileSync(new URL("../../lib/tracking/carrier-logos.ts", import.meta.url), "utf8");
  assert.equal(carriers.includes('name: "FedEx"'), true);
  assert.equal(carriers.includes('name: "UPS"'), true);
  assert.equal(carriers.includes('name: "Cainiao"'), true);
  assert.match(carriers, /Not a list of carriers this page supports/);
  const strip = readFileSync(new URL("../../components/tracking/track-carrier-strip.tsx", import.meta.url), "utf8");
  assert.match(strip, /from \{ transform: translateX\(-50%\)/);
  assert.match(strip, /to \{ transform: translateX\(0\)/);
  assert.match(strip, /prefers-reduced-motion:\s*reduce/);
  assert.equal(strip.includes("Pause"), false);
});

test("invalid input does not start a lookup", () => {
  for (const input of ["", "   ", "12", "!!!", "hello", "buy anything"]) {
    const presentation = searchPresentation(input);
    assert.equal(presentation.kind, "invalid", input);
    if (presentation.kind !== "invalid") continue;
    assert.equal(presentation.message.includes("sourcing.center"), false);
  }
});

test("the timeline is brought in once per search, including a later search", () => {
  assert.equal(
    shouldBringTimelineIntoView({ hasTimeline: false, searchId: 1, broughtForSearchId: null }),
    false,
  );
  assert.equal(
    shouldBringTimelineIntoView({ hasTimeline: true, searchId: 1, broughtForSearchId: null }),
    true,
  );
  assert.equal(
    shouldBringTimelineIntoView({ hasTimeline: true, searchId: 1, broughtForSearchId: 1 }),
    false,
  );
  assert.equal(
    shouldBringTimelineIntoView({ hasTimeline: true, searchId: 2, broughtForSearchId: 1 }),
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
  assert.equal(page.includes("TrackPromo"), false);
  assert.equal(page.includes("scroll-mt-32"), true);
  assert.equal(page.includes("Track Global Parcels"), true);
  assert.equal(page.includes("track-heading-rule"), false);
  assert.equal(page.includes(".track-page-heading::after"), false);
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
