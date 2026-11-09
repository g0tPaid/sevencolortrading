import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { TRACK_HOME_HREF, TRACK_HOME_LABEL } from "@/lib/tracking/sourcing-card";

test("the idle track ad keeps the banner and homepage link, without the source buttons", () => {
  assert.equal(TRACK_HOME_LABEL, "www.sourcing.center");
  assert.equal(TRACK_HOME_HREF, "https://sourcing.center");
  const card = readFileSync(new URL("../../components/tracking/track-sourcing-card.tsx", import.meta.url), "utf8");
  const page = readFileSync(new URL("../../components/tracking/track-lookup.tsx", import.meta.url), "utf8");
  assert.equal(card.includes("<h2"), false);
  assert.equal(card.includes("Buy from 1688.com"), false);
  assert.equal(card.includes("Buy from Xianyu"), false);
  assert.equal(card.includes("Buy from factories"), false);
  const banner = card.indexOf("/tracking/sourcing-center-ad-banner.webp");
  const home = card.indexOf("{TRACK_HOME_LABEL}");
  assert.equal(banner >= 0 && home > banner, true);
  assert.equal(card.includes("sourcing-center-plane.png"), false);
  assert.equal(card.includes("object-fit"), false);
  assert.match(card, /width=\{1774\}/);
  assert.match(card, /height=\{887\}/);
  assert.equal(page.includes("1688 goods"), false);
  assert.equal(page.includes("track-cozy-cloud"), false);
  assert.equal(page.includes("track-cozy-gift"), false);
});
