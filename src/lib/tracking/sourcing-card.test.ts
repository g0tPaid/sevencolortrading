import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { TRACK_HOME_HREF, TRACK_HOME_LABEL, TRACK_SOURCES } from "@/lib/tracking/sourcing-card";

test("the idle track ad links to real pages and does not redraw the banner headline", () => {
  assert.equal(TRACK_HOME_LABEL, "www.sourcing.center");
  assert.equal(TRACK_HOME_HREF, "https://sourcing.center");
  assert.deepEqual(
    TRACK_SOURCES.map((source) => [source.label, source.href]),
    [
      ["Buy from 1688.com", "/1688-sourcing"],
      ["Buy from Xianyu", "/contact"],
      ["Buy from factories", "/factory-verification"],
    ],
  );
  const card = readFileSync(new URL("../../components/tracking/track-sourcing-card.tsx", import.meta.url), "utf8");
  const page = readFileSync(new URL("../../components/tracking/track-lookup.tsx", import.meta.url), "utf8");
  assert.equal(card.includes("<h2"), false);
  assert.equal(card.includes("track-sourcing-title"), false);
  const banner = card.indexOf("/tracking/sourcing-center-ad-banner.webp");
  const home = card.indexOf("{TRACK_HOME_LABEL}");
  const buys = card.indexOf("TRACK_SOURCES.map");
  assert.equal(banner < home && home < buys, true);
  assert.equal(TRACK_SOURCES[0].logo, "/tracking/logos/1688.png");
  assert.equal(TRACK_SOURCES[1].logo, "/tracking/logos/xianyu.png");
  assert.equal(TRACK_SOURCES[2].logo, null);
  assert.equal(card.includes("sourcing-center-plane.png"), false);
  assert.equal(card.includes("object-fit"), false);
  assert.match(card, /width=\{1774\}/);
  assert.match(card, /height=\{887\}/);
  assert.equal(page.includes("1688 goods"), false);
  assert.equal(page.includes("track-cozy-cloud"), false);
  assert.equal(page.includes("track-cozy-gift"), false);
});
