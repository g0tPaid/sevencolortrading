import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import test from "node:test";
import { POST as createShipmentRoute } from "@/app/api/admin/shipments/route";
import { ADMIN_SESSION_COOKIE, createSessionToken } from "@/lib/admin-auth";
import { closeTrackingDatabase, getDb, openDatabase, useTrackingDatabase } from "@/lib/tracking/db";
import { addProof, listProof, readTrackingMedia, removeProof } from "@/lib/tracking/dropship-proof";
import { FIXTURE_DELIVERED, FIXTURE_IN_TRANSIT, FIXTURE_TRACKING_NUMBER, FIXTURE_WITH_ETA } from "@/lib/tracking/fixtures";
import { MSG } from "@/lib/tracking/messages";
import { processShipment } from "@/lib/tracking/refresh";
import { backoffMs } from "@/lib/tracking/schedule";
import { scraperBaseUrl, type ScraperClient } from "@/lib/tracking/scraper-client";
import {
  createShipmentRecord,
  exportShipmentsCsv,
  importShipmentsCsv,
  publicLookup,
  writeSettings,
} from "@/lib/tracking/service";
import { interpretDetection } from "@/lib/tracking/status";
import {
  claimQueued,
  countOpenQueue,
  enqueueRefresh,
  getSettings,
  getShipment,
  listEvents,
} from "@/lib/tracking/store";
import { trackingMedia } from "@/lib/tracking/tracking-media";
import { ScraperError, type TrackBody } from "@/lib/tracking/types";
import { normalizeTrackingNumber } from "@/lib/tracking/validate";
import { runSchedulerTick } from "@/lib/tracking/worker";

const NOW = new Date("2026-04-01T12:00:00.000Z");
let dbFile = "";

function calls(trackBody: TrackBody = FIXTURE_IN_TRANSIT) {
  const trackCalls: unknown[] = [];
  const detectCalls: unknown[] = [];
  const client: ScraperClient = {
    async health() {
      return true;
    },
    async detect(number) {
      detectCalls.push(number);
      return {
        trackingNumber: number,
        carrier: "ups",
        confidence: "high",
        candidates: ["ups"],
        source: "number",
      };
    },
    async track(input) {
      trackCalls.push(input);
      return trackBody;
    },
  };
  return { client, trackCalls, detectCalls };
}

test.beforeEach(() => {
  process.env.TRACKING_SCHEDULER = "0";
  process.env.TRACKING_FORWARDER = "0";
  const dir = mkdtempSync(path.join(tmpdir(), "tracking-"));
  dbFile = path.join(dir, "shipments.sqlite");
  useTrackingDatabase(dbFile);
});

test.afterEach(() => {
  closeTrackingDatabase();
  delete process.env.TRACKING_SCRAPER_BASE_URL;
});

test("migration creates indexed shipment tables", () => {
  const sql = readFileSync("src/lib/tracking/migrations/001_init.sql", "utf8");
  assert.match(sql, /CREATE TABLE IF NOT EXISTS shipments/);
  assert.match(sql, /shipment_events/);
  assert.match(sql, /tracking_provider_logs/);
  assert.match(sql, /shipments_due/);
  assert.match(readFileSync("src/lib/tracking/migrations/001_down.sql", "utf8"), /DROP TABLE IF EXISTS shipments/);
  const settings = getSettings();
  assert.equal(settings.newIntervalHours, 5);
  assert.equal(settings.activeIntervalHours, 10);
  assert.equal(settings.stalledIntervalHours, 18);
});

test("registration stores a shipment and queues one refresh", () => {
  const shipment = createShipmentRecord(
    {
      customerName: "Fixture Customer",
      customerRef: "CUST-1",
      orderNumber: "ORD-1",
      trackingNumber: "fixture ups 123456789",
      carrierId: "ups",
      origin: "Shenzhen",
      destination: "Austin",
      notes: "desk note",
    },
    NOW,
  );
  assert.equal(shipment.trackingNumber, "FIXTUREUPS123456789");
  assert.equal(shipment.customerName, "Fixture Customer");
  assert.equal(shipment.orderNumber, "ORD-1");
  assert.equal(shipment.carrierResolution, "manual");
  assert.equal(countOpenQueue(), 1);
  const second = createShipmentRecord(
    { orderNumber: "ORD-1", trackingNumber: "YT1234567890123456", carrierId: "yunexpress" },
    NOW,
  );
  assert.equal(second.orderNumber, "ORD-1");
  assert.notEqual(second.id, shipment.id);
});

test("new proof uploads appear automatically after two photos while older private files stay private", () => {
  const shipment = createShipmentRecord(
    { trackingNumber: "FIXTUREUPS123456789", carrierId: "ups" },
    NOW,
  );
  const jpeg = Buffer.from([255, 216, 255]);
  const mp4 = Buffer.from([0, 0, 0, 0, 102, 116, 121, 112]);
  assert.equal(addProof(shipment.id, mp4), true);
  const [olderFile] = listProof(shipment.id);
  getDb().prepare("DELETE FROM dropship_tracking_media WHERE media_id = ?").run(olderFile.id);

  assert.equal(addProof(shipment.id, jpeg), true);
  assert.equal(addProof(shipment.id, mp4), true);
  const [, firstPhoto, video] = listProof(shipment.id);
  assert.deepEqual(trackingMedia(shipment.trackingNumber, "ups"), []);
  assert.equal(readTrackingMedia(video.id), undefined);

  assert.equal(addProof(shipment.id, jpeg), true);
  const secondPhoto = listProof(shipment.id)[3];
  assert.deepEqual(trackingMedia(shipment.trackingNumber, "ups").map(({ id }) => id),
    [firstPhoto.id, video.id, secondPhoto.id]);
  assert.equal(readTrackingMedia(video.id)?.mime, "video/mp4");
  assert.equal(readTrackingMedia(olderFile.id), undefined);

  removeProof(shipment.id, secondPhoto.id);
  assert.deepEqual(trackingMedia(shipment.trackingNumber, "ups"), []);
  assert.equal(readTrackingMedia(video.id), undefined);
});

test("low-confidence detection stays ambiguous and does not track", async () => {
  const { client, trackCalls } = calls();
  client.detect = async () => ({
    trackingNumber: "123456789012",
    carrier: "sf-express",
    confidence: "low",
    candidates: ["sf-express", "zto"],
    source: "number",
  });
  const shipment = createShipmentRecord({ trackingNumber: "123456789012" }, NOW);
  await processShipment(shipment.id, { client, now: NOW });
  const stored = getShipment(shipment.id);
  assert.equal(stored?.carrierId, null);
  assert.equal(stored?.carrierResolution, "ambiguous");
  assert.equal(stored?.lastError, MSG.ambiguous);
  assert.deepEqual(stored?.carrierCandidates, ["sf-express", "zto"]);
  assert.equal(trackCalls.length, 0);
  assert.equal(
    interpretDetection({
      trackingNumber: "123456789012",
      carrier: "sf-express",
      confidence: "low",
      candidates: ["sf-express"],
      source: "number",
    }).kind,
    "ambiguous",
  );
});

test("fixture carrier reply stores events, ETA only when supplied, and dedups", async () => {
  const { client } = calls();
  const shipment = createShipmentRecord({ trackingNumber: FIXTURE_TRACKING_NUMBER, carrierId: "ups" }, NOW);
  await processShipment(shipment.id, { client, now: NOW });
  let stored = getShipment(shipment.id);
  assert.equal(stored?.status, "In Transit");
  assert.equal(stored?.statusDetail, "Fixture scan — departed facility. Not a live carrier response.");
  assert.equal(stored?.eta, null);
  assert.equal(stored?.carrierResolution, "confirmed");
  assert.equal(stored?.originCountry, "CN");
  assert.equal(stored?.destinationCountry, "US");
  assert.equal(listEvents(shipment.id).length, 2);
  assert.equal(listEvents(shipment.id)[0]?.status, "Picked Up");

  client.track = async () => FIXTURE_WITH_ETA;
  await processShipment(shipment.id, { client, now: new Date(NOW.getTime() + 1000) });
  stored = getShipment(shipment.id);
  assert.equal(stored?.eta, "2026-03-06");
  assert.equal(listEvents(shipment.id).length, 2);

  client.track = async () => ({
    ...FIXTURE_WITH_ETA,
    result: { ...FIXTURE_WITH_ETA.result, expected_delivery: null },
  });
  await processShipment(shipment.id, { client, now: new Date(NOW.getTime() + 2000) });
  assert.equal(getShipment(shipment.id)?.eta, null);
});

test("unsupported carrier and invalid numbers do not invent events", async () => {
  const { client, trackCalls } = calls();
  const shipment = createShipmentRecord({ trackingNumber: "LOCAL123456", carrierId: "unsupported" }, NOW);
  await processShipment(shipment.id, { client, now: NOW });
  assert.equal(trackCalls.length, 0);
  assert.equal(getShipment(shipment.id)?.lastError, MSG.unsupported);
  assert.equal(listEvents(shipment.id).length, 0);
  assert.throws(() => normalizeTrackingNumber("!!!"), /4–40/);
  assert.throws(() => createShipmentRecord({ trackingNumber: "AB", carrierId: "ups" }, NOW));
});

test("provider timeout keeps stored events and schedules a bounded retry", async () => {
  const { client } = calls();
  const shipment = createShipmentRecord({ trackingNumber: FIXTURE_TRACKING_NUMBER, carrierId: "ups" }, NOW);
  await processShipment(shipment.id, { client, now: NOW });
  client.track = async () => {
    throw new ScraperError("budget", 0);
  };
  const later = new Date(NOW.getTime() + 60_000);
  await processShipment(shipment.id, { client, now: later });
  const stored = getShipment(shipment.id);
  assert.equal(listEvents(shipment.id).length, 2);
  assert.equal(stored?.status, "In Transit");
  assert.equal(stored?.lastError, MSG.timeout);
  assert.ok(stored?.nextCheckAt && Date.parse(stored.nextCheckAt) > later.getTime());
  const first = backoffMs(1, 18 * 60 * 60 * 1000, () => 0.5);
  const second = backoffMs(2, 18 * 60 * 60 * 1000, () => 0.5);
  const capped = backoffMs(20, 18 * 60 * 60 * 1000, () => 0.5);
  assert.ok(second > first);
  assert.equal(capped, 18 * 60 * 60 * 1000);
});

test("due work is claimed in sqlite and recovered after expiry", () => {
  const shipment = createShipmentRecord({ trackingNumber: FIXTURE_TRACKING_NUMBER, carrierId: "ups" }, NOW);
  const sibling = createShipmentRecord({ trackingNumber: "YT1234567890123456", carrierId: "ups" }, NOW);
  const batched = claimQueued(2, "worker-a", NOW, 60_000, 1);
  assert.equal(batched.length, 1);
  getDb().prepare("DELETE FROM tracking_work_claims").run();
  getDb().prepare("UPDATE tracking_refresh_queue SET state = 'queued'").run();

  const first = claimQueued(2, "worker-a", NOW, 60_000, 2);
  assert.deepEqual(first.sort(), [shipment.id, sibling.id].sort());
  assert.deepEqual(claimQueued(2, "worker-b", NOW, 60_000, 2), []);

  const other = openDatabase(dbFile);
  assert.throws(() => {
    other
      .prepare(
        "INSERT INTO tracking_work_claims (shipment_id, owner, expires_at, purpose) VALUES (?, 'other', ?, 'refresh')",
      )
      .run(shipment.id, new Date(NOW.getTime() + 60_000).toISOString());
  });
  other.close();

  closeTrackingDatabase();
  useTrackingDatabase(dbFile);
  assert.deepEqual(claimQueued(2, "worker-c", NOW, 60_000, 2), []);

  getDb()
    .prepare("UPDATE tracking_work_claims SET expires_at = ?")
    .run(new Date(NOW.getTime() - 1000).toISOString());
  const recovered = claimQueued(2, "worker-d", NOW, 60_000, 2);
  assert.equal(recovered.length, 2);
});

test("delivered shipments stop and are not refreshed again", async () => {
  const { client, trackCalls } = calls(FIXTURE_DELIVERED);
  const shipment = createShipmentRecord({ trackingNumber: FIXTURE_TRACKING_NUMBER, carrierId: "ups" }, NOW);
  await processShipment(shipment.id, { client, now: NOW });
  const stored = getShipment(shipment.id);
  assert.equal(stored?.status, "Delivered");
  assert.equal(stored?.refreshStopped, true);
  assert.equal(stored?.nextCheckAt, null);
  const tick = await runSchedulerTick({ client, now: new Date(NOW.getTime() + 86_400_000), checkHealth: false });
  assert.equal(tick.claimed, 0);
  assert.equal(trackCalls.length, 1);
  assert.equal(enqueueRefresh(shipment.id, "manual", NOW), "stopped");
});

test("admin routes reject anonymous and cross-origin mutations", async () => {
  const denied = await createShipmentRoute(
    new Request("http://localhost:3000/api/admin/shipments", {
      method: "POST",
      headers: { "content-type": "application/json", host: "localhost:3000", origin: "http://localhost:3000" },
      body: JSON.stringify({ trackingNumber: FIXTURE_TRACKING_NUMBER, carrierId: "ups" }),
    }),
  );
  assert.equal(denied.status, 401);

  const token = await createSessionToken("admin");
  const forged = await createShipmentRoute(
    new Request("http://localhost:3000/api/admin/shipments", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        host: "localhost:3000",
        origin: "https://evil.example",
        cookie: `${ADMIN_SESSION_COOKIE}=${token}`,
      },
      body: JSON.stringify({ trackingNumber: FIXTURE_TRACKING_NUMBER, carrierId: "ups" }),
    }),
  );
  assert.equal(forged.status, 403);

  const allowed = await createShipmentRoute(
    new Request("http://localhost:3000/api/admin/shipments", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        host: "localhost:3000",
        origin: "http://localhost:3000",
        cookie: `${ADMIN_SESSION_COOKIE}=${token}`,
      },
      body: JSON.stringify({
        trackingNumber: FIXTURE_TRACKING_NUMBER,
        carrierId: "ups",
        customerName: "Hidden Customer",
        notes: "secret note",
        orderNumber: "ORD-9",
      }),
    }),
  );
  assert.equal(allowed.status, 201);
});

test("public lookup does not return admin customer records", async () => {
  const admin = createShipmentRecord(
    {
      trackingNumber: FIXTURE_TRACKING_NUMBER,
      carrierId: "ups",
      customerName: "Hidden Customer",
      customerRef: "CUST-SECRET",
      orderNumber: "ORD-SECRET",
      notes: "secret note",
      postcode: "78701",
      phoneLast4: "9088",
    },
    NOW,
  );
  const result = await publicLookup(FIXTURE_TRACKING_NUMBER, "203.0.113.9", NOW);
  const encoded = JSON.stringify(result.body);
  for (const secret of ["Hidden Customer", "CUST-SECRET", "ORD-SECRET", "secret note", "78701", "9088"]) {
    assert.equal(encoded.includes(secret), false, secret);
  }
  assert.equal(result.body.found, false);
  assert.notEqual(result.body.message, MSG.notRegistered);
  assert.equal(getShipment(admin.id)?.customerName, "Hidden Customer");
});

test("csv import validates rows and export escapes formulas", () => {
  const header = "customer_name,customer_ref,order_number,tracking_number,carrier,origin,destination,postcode,notes";
  const malicious = `${header}\n=HYPERLINK("http://evil"),ref,ORD-1,${FIXTURE_TRACKING_NUMBER},UPS,Shenzhen,Austin,78701,note\n`;
  const imported = importShipmentsCsv(malicious, NOW);
  assert.equal(imported.created, 1);
  assert.equal(imported.errors.length, 0);
  const csv = exportShipmentsCsv();
  assert.match(csv, /'=HYPERLINK/);
  assert.doesNotMatch(csv, /^"=HYPERLINK/m);

  const tooLong = `${header}\nname,ref,ORD-2,YT1234567890123456,YunExpress,,,,${"x".repeat(3000)}\n`;
  const rejected = importShipmentsCsv(tooLong, NOW);
  assert.equal(rejected.created, 0);
  assert.equal(rejected.errors.length, 1);

  const rows = [header, ...Array.from({ length: 501 }, (_, index) => `n,r,o,YT${String(index).padStart(16, "0")},YunExpress,,,,`)];
  assert.throws(() => importShipmentsCsv(rows.join("\n"), NOW), /500/);
});

test("scheduler settings reject values outside the bounds", () => {
  assert.throws(() => writeSettings({ newIntervalHours: 3 }, NOW), /bounds/);
  assert.throws(() => writeSettings({ activeIntervalHours: 13 }, NOW), /bounds/);
  assert.throws(() => writeSettings({ stalledIntervalHours: 11 }, NOW), /bounds/);
  const saved = writeSettings({ newIntervalHours: 4, activeIntervalHours: 12, stalledIntervalHours: 24 }, NOW);
  assert.equal(saved.newIntervalHours, 4);
  assert.equal(saved.activeIntervalHours, 12);
  assert.equal(getSettings().stalledIntervalHours, 24);
});

test("manual refresh coalesces and the scraper URL is not request-controlled", () => {
  const shipment = createShipmentRecord({ trackingNumber: FIXTURE_TRACKING_NUMBER, carrierId: "ups" }, NOW);
  assert.equal(enqueueRefresh(shipment.id, "manual", NOW), "already_queued");
  assert.equal(countOpenQueue(), 1);
  process.env.TRACKING_SCRAPER_BASE_URL = "http://user:pass@127.0.0.1:8080";
  assert.throws(() => scraperBaseUrl());
  process.env.TRACKING_SCRAPER_BASE_URL = "file:///etc/passwd";
  assert.throws(() => scraperBaseUrl());
  process.env.TRACKING_SCRAPER_BASE_URL = "http://127.0.0.1:8080/internal";
  assert.throws(() => scraperBaseUrl());
  process.env.TRACKING_SCRAPER_BASE_URL = "http://127.0.0.1:8080";
  assert.equal(scraperBaseUrl(), "http://127.0.0.1:8080");
});

test("admin redirect to the dashboard is still configured", () => {
  const config = readFileSync("next.config.ts", "utf8");
  assert.match(config, /source:\s*"\/admin"/);
  assert.match(config, /source:\s*"\/admin\/:path\*"/);
  assert.match(config, /destination:\s*"\/dashboard\/:path\*"/);
});

test("a down scraper postpones due work instead of inventing a status", async () => {
  const shipment = createShipmentRecord({ trackingNumber: FIXTURE_TRACKING_NUMBER, carrierId: "ups" }, NOW);
  const client: ScraperClient = {
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
  const tick = await runSchedulerTick({ client, now: NOW });
  assert.equal(tick.postponed, true);
  assert.equal(tick.claimed, 0);
  const stored = getShipment(shipment.id);
  assert.equal(stored?.status, "Unknown");
  assert.equal(stored?.lastError, MSG.unavailable);
  assert.equal(listEvents(shipment.id).length, 0);
});
