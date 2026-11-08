import assert from "node:assert/strict";
import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import test from "node:test";
import { closeTrackingDatabase, useTrackingDatabase } from "@/lib/tracking/db";
import { FIXTURE_IN_TRANSIT, FIXTURE_TRACKING_NUMBER } from "@/lib/tracking/fixtures";
import { MSG } from "@/lib/tracking/messages";
import { publicLookup } from "@/lib/tracking/public-cache";
import { runPublicPump } from "@/lib/tracking/public-cache";
import type { ScraperClient } from "@/lib/tracking/scraper-client";
import { createShipmentRecord } from "@/lib/tracking/service";
import { getSettings, saveSettings, searchShipments } from "@/lib/tracking/store";
import { ScraperError, type TrackBody } from "@/lib/tracking/types";
import { runSchedulerTick } from "@/lib/tracking/worker";

const NOW = new Date("2026-04-01T12:00:00.000Z");

function client(trackBody: TrackBody = FIXTURE_IN_TRANSIT) {
  const trackCalls: unknown[] = [];
  const detectCalls: unknown[] = [];
  const scraper: ScraperClient = {
    async health() {
      return true;
    },
    async detect(number) {
      detectCalls.push(number);
      return { trackingNumber: number, carrier: "ups", confidence: "high", candidates: ["ups"], source: "number" };
    },
    async track(input) {
      trackCalls.push(input);
      return { ...trackBody, carrier: input.carrier };
    },
  };
  return { scraper, trackCalls, detectCalls };
}

test.beforeEach(() => {
  process.env.TRACKING_SCHEDULER = "0";
  const dir = mkdtempSync(path.join(tmpdir(), "public-track-"));
  useTrackingDatabase(path.join(dir, "shipments.sqlite"));
});

test.afterEach(() => {
  closeTrackingDatabase();
});

test("unregistered number is looked up from a fixture and then served from cache", async () => {
  const { scraper, trackCalls } = client();
  const first = await publicLookup(FIXTURE_TRACKING_NUMBER, "198.51.100.10", NOW, { client: scraper, processNow: true });
  assert.equal(first.body.state, "ready");
  assert.equal(first.body.found, true);
  assert.equal(first.body.shipment?.status, "In Transit");
  assert.equal(first.body.shipment?.events.length, 2);
  assert.equal(trackCalls.length, 1);
  assert.equal(searchShipments({ q: FIXTURE_TRACKING_NUMBER }).total, 0);

  const second = await publicLookup(FIXTURE_TRACKING_NUMBER, "198.51.100.10", new Date(NOW.getTime() + 1000), {
    client: scraper,
    processNow: true,
  });
  assert.equal(second.body.state, "ready");
  assert.equal(trackCalls.length, 1);
  const encoded = JSON.stringify(second.body);
  assert.equal(encoded.includes("customerName"), false);
  assert.equal(encoded.includes("notes"), false);
});

test("cold lookups coalesce onto one scraper call", async () => {
  const { scraper, trackCalls } = client();
  const a = await publicLookup(FIXTURE_TRACKING_NUMBER, "198.51.100.11", NOW, { client: scraper });
  const b = await publicLookup(FIXTURE_TRACKING_NUMBER, "198.51.100.12", new Date(NOW.getTime() + 1000), {
    client: scraper,
  });
  assert.equal(a.body.state, "pending");
  assert.equal(b.body.state, "pending");
  assert.equal(trackCalls.length, 0);
  const pumped = await runPublicPump({ client: scraper, now: NOW, ignoreAdminBacklog: true });
  assert.equal(pumped, 1);
  assert.equal(trackCalls.length, 1);
  const done = await publicLookup(FIXTURE_TRACKING_NUMBER, "198.51.100.11", new Date(NOW.getTime() + 2000), {
    client: scraper,
  });
  assert.equal(done.body.state, "ready");
  assert.equal(trackCalls.length, 1);
});

function history(carrier: string, description: string): TrackBody {
  return {
    carrier,
    source: "fixture",
    result: {
      current_stage: "in_transit",
      last_status_text: description,
      events: [
        {
          stage: "in_transit",
          stage_source: "fixture",
          description,
          instant: "2026-03-02T10:00:00.000Z",
        },
      ],
    },
  };
}

test("ambiguous numbers are checked automatically and empty replies are not success", async () => {
  const { scraper, trackCalls } = client();
  scraper.detect = async () => ({
    trackingNumber: "123456789012",
    carrier: "sf-express",
    confidence: "low",
    candidates: ["sf-express", "sto", "zto"],
    source: "number",
  });
  scraper.track = async (input) => {
    trackCalls.push(input);
    if (input.carrier === "zto") return history("zto", "Fixture scan — ZTO history. Not a live carrier response.");
    if (input.carrier === "sto") return { carrier: "sto", source: "fixture", result: { events: [] } };
    throw new ScraperError("not_found", 404);
  };
  const result = await publicLookup("123456789012", "198.51.100.13", NOW, { client: scraper, processNow: true });
  assert.equal(result.body.state, "ready");
  assert.equal(result.body.found, true);
  assert.equal(result.body.shipment?.carrier.name, "ZTO Express");
  assert.equal(result.body.message, null);
  assert.equal(result.body.message === MSG.selectCarrier, false);
  assert.equal(trackCalls.length, 3);
});

test("unsupported, timeout, and empty carrier replies are not success", async () => {
  const unsupported = client();
  unsupported.scraper.detect = async () => ({
    trackingNumber: "LOCAL123456",
    carrier: "",
    confidence: "none",
    candidates: [],
    source: "none",
  });
  const missing = await publicLookup("LOCAL123456", "198.51.100.14", NOW, {
    client: unsupported.scraper,
    processNow: true,
  });
  assert.equal(missing.body.state, "unsupported");
  assert.equal(missing.body.found, false);
  assert.equal(unsupported.trackCalls.length, 0);

  const timeout = client();
  timeout.scraper.track = async () => {
    throw new ScraperError("budget", 0);
  };
  const timed = await publicLookup("YT1234567890123456", "198.51.100.15", NOW, {
    client: timeout.scraper,
    processNow: true,
    carrierId: "yunexpress",
  });
  assert.equal(timed.body.state, "timeout");
  assert.equal(timed.body.found, false);
  assert.equal(timed.body.message, MSG.timeout);

  const empty = client();
  empty.scraper.track = async () => ({
    carrier: "ups",
    source: "fixture",
    result: { events: [] },
  });
  const blank = await publicLookup(FIXTURE_TRACKING_NUMBER, "198.51.100.16", NOW, {
    client: empty.scraper,
    processNow: true,
    carrierId: "ups",
  });
  assert.equal(blank.body.state, "empty");
  assert.equal(blank.body.found, false);
  assert.equal(blank.body.message, MSG.emptyResult);
});

test("daily cap, queue saturation, and admin backlog protect the scheduler", async () => {
  const settings = getSettings();
  saveSettings({ ...settings, publicDailyCap: 100, publicOutstandingCap: 5 }, NOW);
  const { scraper, trackCalls } = client();
  for (let i = 0; i < 5; i += 1) {
    const number = `YT${String(i).padStart(16, "0")}`;
    const queued = await publicLookup(number, "198.51.100.20", NOW, { client: scraper, carrierId: "yunexpress" });
    assert.equal(queued.body.state, "pending");
  }
  const saturated = await publicLookup("YT0000000000000099", "198.51.100.20", NOW, {
    client: scraper,
    carrierId: "yunexpress",
  });
  assert.equal(saturated.status, 429);
  assert.equal(saturated.body.error, MSG.busy);
  assert.equal(trackCalls.length, 0);

  saveSettings({ ...getSettings(), publicDailyCap: 100, publicOutstandingCap: 20 }, NOW);
  const capped = client();
  saveSettings({ ...getSettings(), publicDailyCap: 1 }, NOW);
  await publicLookup("YT1234567890123001", "198.51.100.21", NOW, { client: capped.scraper, carrierId: "yunexpress" });
  const over = await publicLookup("YT1234567890123002", "198.51.100.22", NOW, {
    client: capped.scraper,
    carrierId: "yunexpress",
  });
  assert.equal(over.status, 429);
  assert.equal(over.body.error, MSG.dailyLimit);

  createShipmentRecord({ trackingNumber: "FIXTUREUPS111111111", carrierId: "ups" }, NOW);
  createShipmentRecord({ trackingNumber: "FIXTUREUPS222222222", carrierId: "ups" }, NOW);
  createShipmentRecord({ trackingNumber: "FIXTUREUPS333333333", carrierId: "ups" }, NOW);
  const pumped = await runPublicPump({ client: scraper, now: NOW });
  assert.equal(pumped, 0);
  const tick = await runSchedulerTick({
    client: scraper,
    now: NOW,
    checkHealth: false,
  });
  assert.equal(tick.claimed > 0, true);
  assert.equal(searchShipments({ q: "Hidden" }).total, 0);
});

test("all carrier misses, multiple histories, candidate cap, and a stuck ambiguous row", async () => {
  const none = client();
  none.scraper.detect = async () => ({
    trackingNumber: "123456789013",
    carrier: "sf-express",
    confidence: "low",
    candidates: ["sf-express", "zto"],
    source: "number",
  });
  none.scraper.track = async (input) => {
    none.trackCalls.push(input);
    throw new ScraperError("not_found", 404);
  };
  const missed = await publicLookup("123456789013", "198.51.100.40", NOW, { client: none.scraper, processNow: true });
  assert.equal(missed.body.state, "not_found");
  assert.equal(missed.body.found, false);
  assert.equal(missed.body.message, MSG.noHistory);

  const both = client();
  both.scraper.detect = async () => ({
    trackingNumber: "123456789014",
    carrier: "fedex",
    confidence: "low",
    candidates: ["fedex", "sf-express"],
    source: "number",
  });
  both.scraper.track = async (input) => {
    both.trackCalls.push(input);
    return history(input.carrier, `Fixture scan — ${input.carrier}. Not a live carrier response.`);
  };
  const multi = await publicLookup("123456789014", "198.51.100.41", NOW, { client: both.scraper, processNow: true });
  assert.equal(multi.body.state, "multiple");
  assert.equal(multi.body.found, true);
  assert.equal(multi.body.shipments?.length, 2);
  assert.deepEqual(
    multi.body.shipments?.map((item) => item.carrier.name).sort(),
    ["FedEx", "SF Express"],
  );

  const capped = client();
  capped.scraper.detect = async () => ({
    trackingNumber: "123456789015",
    carrier: "sf-express",
    confidence: "low",
    candidates: ["sf-express", "sto", "zto", "yto", "fedex", "j-and-t"],
    source: "number",
  });
  capped.scraper.track = async (input) => {
    capped.trackCalls.push(input);
    throw new ScraperError("not_found", 404);
  };
  await publicLookup("123456789015", "198.51.100.42", NOW, { client: capped.scraper, processNow: true });
  assert.equal(capped.trackCalls.length, 4);

  const { getDb } = await import("@/lib/tracking/db");
  getDb()
    .prepare(
      `INSERT INTO public_track_cache (
        id, tracking_number, carrier_id, carrier_resolution, carrier_candidates, status, outcome, message,
        fetched_at, fresh_until, interest_until, refresh_stopped, consecutive_failures, created_at, updated_at
      ) VALUES ('stuck', '123456789016', NULL, 'ambiguous', '["sf-express","zto"]', 'Unknown', 'ambiguous', ?, ?, ?, ?, 0, 0, ?, ?)`,
    )
    .run(
      MSG.selectCarrier,
      NOW.toISOString(),
      new Date(NOW.getTime() + 86_400_000).toISOString(),
      new Date(NOW.getTime() + 86_400_000).toISOString(),
      NOW.toISOString(),
      NOW.toISOString(),
    );
  const upgrade = client();
  upgrade.scraper.detect = async () => ({
    trackingNumber: "123456789016",
    carrier: "zto",
    confidence: "low",
    candidates: ["sf-express", "zto"],
    source: "number",
  });
  upgrade.scraper.track = async (input) => {
    upgrade.trackCalls.push(input);
    if (input.carrier === "zto") return history("zto", "Fixture scan — upgraded. Not a live carrier response.");
    throw new ScraperError("not_found", 404);
  };
  const upgraded = await publicLookup("123456789016", "198.51.100.43", NOW, { client: upgrade.scraper, processNow: true });
  assert.equal(upgraded.body.state, "ready");
  assert.equal(upgraded.body.shipment?.carrier.name, "ZTO Express");
  assert.notEqual(upgraded.body.message, MSG.selectCarrier);
});

test("a short fanout budget does not call every candidate", async () => {
  process.env.TRACKING_PUBLIC_FANOUT_MS = "4000";
  try {
    const { scraper, trackCalls } = client();
    scraper.detect = async () => ({
      trackingNumber: "123456789017",
      carrier: "sf-express",
      confidence: "low",
      candidates: ["sf-express", "sto", "zto", "yto"],
      source: "number",
    });
    scraper.track = async (input) => {
      trackCalls.push(input);
      await new Promise((resolve) => setTimeout(resolve, 2500));
      throw new ScraperError("budget", 0);
    };
    const result = await publicLookup("123456789017", "198.51.100.44", NOW, { client: scraper, processNow: true });
    assert.equal(result.body.state, "timeout");
    assert.equal(result.body.found, false);
    assert.ok(trackCalls.length < 4);
    assert.equal(result.body.message, MSG.timedOutSearch);
  } finally {
    delete process.env.TRACKING_PUBLIC_FANOUT_MS;
  }
});

test("a down scraper tells the public cache the service is unconfigured", async () => {
  const scraper: ScraperClient = {
    async health() {
      return false;
    },
    async detect() {
      throw new Error("detect");
    },
    async track() {
      throw new Error("track");
    },
  };
  const result = await publicLookup(FIXTURE_TRACKING_NUMBER, "198.51.100.30", NOW, { client: scraper, processNow: true });
  assert.equal(result.body.state, "unavailable");
  assert.equal(result.body.found, false);
  assert.equal(result.body.message, MSG.serviceDown);
  const again = await publicLookup(FIXTURE_TRACKING_NUMBER, "198.51.100.30", new Date(NOW.getTime() + 1000), {
    client: scraper,
    processNow: true,
  });
  assert.equal(again.body.state, "unavailable");
});
