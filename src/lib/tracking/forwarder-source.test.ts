import assert from "node:assert/strict";
import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import test from "node:test";
import { closeTrackingDatabase, getDb, useTrackingDatabase } from "@/lib/tracking/db";
import {
  claimForwarderRequest,
  FORWARDER_REQUEST_LIMIT,
  parseForwarderHtml,
  readForwarderBody,
} from "@/lib/tracking/forwarder-source";
import { MSG } from "@/lib/tracking/messages";
import { publicLookup } from "@/lib/tracking/public-cache";
import { newestFirst } from "@/lib/tracking/public-view";
import type { ScraperClient } from "@/lib/tracking/scraper-client";
import { createShipmentRecord } from "@/lib/tracking/service";
import { getShipment } from "@/lib/tracking/store";
import { FIXTURE_IN_TRANSIT } from "@/lib/tracking/fixtures";
import type { ForwarderDocument } from "@/lib/tracking/forwarder-source";

const NUMBER = "384423693978";
const NOW = new Date("2026-11-08T15:20:00.000Z");
const GB18030_PAGE =
  "PCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PG1ldGEgY2hhcnNldD0iZ2IxODAzMCI+PHRpdGxlPrnsvKOy6dGvPC90aXRsZT48L2hlYWQ+PGJvZHk+Cjxmb3JtIGFjdGlvbj0idHJhY2tJbmRleC5odG0iIG1ldGhvZD0icG9zdCI+PHRleHRhcmVhIG5hbWU9ImRvY3VtZW50Q29kZSI+PC90ZXh0YXJlYT48L2Zvcm0+CjxkaXYgY2xhc3M9ImRhbmhhbyI+ob4zODQ0MjM2OTM5Nzihv9TLtaXQxc+iILz+yv06ob4xob88L2Rpdj4KPGRpdiBjbGFzcz0ibWVudV8gY2xlYXJmaXgiPjx1bCBjbGFzcz0iY2xlYXJmaXgiPgo8bGkgY2xhc3M9ImRpdl9saTMgYWJjIj6yzr+8usU8L2xpPjxsaSBjbGFzcz0iZGl2X2xpMyBhYmMiPrj619m6xcLrPC9saT48bGkgY2xhc3M9ImRpdl9saTEgYWJjIj7Ev7XEtdg8L2xpPjxsaSBjbGFzcz0iZGl2X2xpMiBhYmMiPrWxtdjKsbzkPC9saT48bGkgY2xhc3M9ImRpdl9saTQgYWJjIj7X7tDC17TMrDwvbGk+PGxpIGNsYXNzPSJkaXZfbGkzIGFiYyI+ytW8/sjLPC9saT4KPC91bD48dWwgY2xhc3M9ImNsZWFyZml4Ij4KPGxpIGNsYXNzPSJkaXZfbGkzIj5SRUYxMjM0NTY8L2xpPjxsaSBjbGFzcz0iZGl2X2xpMyI+Mzg0NDIzNjkzOTc4PC9saT48bGkgY2xhc3M9ImRpdl9saTEiPlVTPC9saT48bGkgY2xhc3M9ImRpdl9saTIiPjIwMjYtMTEtMDMgMTQ6MDE6MTY8L2xpPjxsaSBjbGFzcz0iZGl2X2xpNCI+tb2078rVu/W14zwvbGk+PGxpIGNsYXNzPSJkaXZfbGkzIj5QYXQgRXhhbXBsZTwvbGk+CjwvdWw+PC9kaXY+CjxkaXYgY2xhc3M9Im1lbl9saSI+PHRhYmxlPjx0cj48dGQ+MjAyNi0xMS0wMyAxNDowMToxNjwvdGQ+PHRkPsnu29o8L3RkPjx0ZD61vbTvytW79bXjPC90ZD48L3RyPjwvdGFibGU+PC9kaXY+CjwvYm9keT48L2h0bWw+";

const EVENTS = [
  { time: "2026-11-06 16:38:53", location: "", description: "11/8号航班" },
  { time: "2026-11-03 15:19:43", location: "深圳", description: "货物离开操作中心" },
  { time: "2026-11-03 14:01:16", location: "深圳", description: "到达收货点" },
  { time: "2026-11-02 20:00:27", location: "", description: "货物电子信息已经收到" },
  { time: "2026-11-02 06:01:50", location: "US", description: "货件信息已发送给 FedEx" },
];

function page(options?: {
  number?: string;
  reference?: string;
  recipient?: string;
  status?: string;
  destination?: string;
  pieces?: string;
  localTime?: string;
  events?: Array<{ time: string; location: string; description: string }>;
  comment?: string;
  extra?: string;
}): string {
  const number = options?.number ?? NUMBER;
  const events = options?.events ?? EVENTS;
  const rows = events
    .map((event) => `<tr><td>${event.time}</td><td>${event.location}</td><td>${event.description}</td></tr>`)
    .join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>轨迹查询</title></head><body>
    <form action="trackIndex.htm" method="post"><textarea name="documentCode"></textarea></form>
    <div class="div_cont"><div class="danhao">【${number}】运单信息 件数:【${options?.pieces ?? "1"}】${options?.comment ?? ""}</div>
    <div class="menu_ clearfix"><ul class="clearfix">
      <li class="div_li3 abc">参考号</li><li class="div_li3 abc">跟踪号码</li><li class="div_li1 abc">目的地</li>
      <li class="div_li2 abc">当地时间</li><li class="div_li4 abc">最新状态</li><li class="div_li3 abc">收件人</li>
      <li class="div_li3 abc">地址</li>
    </ul><ul class="clearfix">
      <li class="div_li3" title="${options?.reference ?? "REF123456"}">${options?.reference ?? "REF123456"}</li>
      <li class="div_li3">${number}</li>
      <li class="div_li1">${options?.destination ?? "US"}</li>
      <li class="div_li2">${options?.localTime ?? "2026-11-06 16:38:53"}&nbsp;</li>
      <li class="div_li4">${options?.status ?? "转运中11/8号航班/"}&nbsp;</li>
      <li class="div_li3">${options?.recipient ?? "Pat Example"}</li>
      <li class="div_li3">12 Secret Road</li>
    </ul></div>
    <div class="men_li"><table>${rows}</table></div></div>${options?.extra ?? ""}</body></html>`;
}

function source(document: ForwarderDocument | string) {
  const calls: string[] = [];
  return {
    calls,
    forwarder: async (number: string) => {
      calls.push(number);
      return typeof document === "string" ? parseForwarderHtml(document, number) : document;
    },
  };
}

function scraper() {
  const trackCalls: unknown[] = [];
  const client: ScraperClient = {
    async health() {
      return true;
    },
    async detect(number) {
      return { trackingNumber: number, carrier: "ups", confidence: "high", candidates: ["ups"], source: "number" };
    },
    async track(input) {
      trackCalls.push(input);
      return { ...FIXTURE_IN_TRANSIT, carrier: input.carrier };
    },
  };
  return { client, trackCalls };
}

function shipped(result: Awaited<ReturnType<typeof publicLookup>>) {
  if (!("state" in result.body)) throw new Error(result.body.error);
  return result.body;
}

test.beforeEach(() => {
  delete process.env.TRACKING_FORWARDER;
  process.env.TRACKING_SCHEDULER = "0";
  const dir = mkdtempSync(path.join(tmpdir(), "forwarder-track-"));
  useTrackingDatabase(path.join(dir, "shipments.sqlite"));
});

test.afterEach(() => {
  closeTrackingDatabase();
});

test("parses five source events without recipient data or a timezone", () => {
  const parsed = parseForwarderHtml(
    page({
      comment: "<!-- 运输方式:【美国联邦-小货价】 -->",
      events: EVENTS.map((event, index) =>
        index === 3 ? { ...event, description: `${event.description} 13800138000 person@example.com` } : event,
      ),
    }),
    NUMBER,
  );
  assert.equal(parsed.kind, "ready");
  if (parsed.kind !== "ready") return;
  assert.equal(parsed.status, "转运中11/8号航班/");
  assert.equal(parsed.reference, "REF123456");
  assert.equal(parsed.pieces, "1");
  assert.equal(parsed.destination, "US");
  assert.equal(parsed.givenName, "Pat");
  assert.equal(parsed.events.length, 5);
  assert.deepEqual(
    parsed.events.map((event) => event.time),
    EVENTS.map((event) => event.time),
  );
  assert.equal(parsed.events[0]?.description, "11/8号航班");
  assert.equal(parsed.events[1]?.location, "深圳");
  assert.equal(parsed.events[1]?.description, "货物离开操作中心");
  assert.equal(parsed.events[3]?.description, "货物电子信息已经收到");
  const encoded = JSON.stringify(parsed);
  for (const secret of ["Pat Example", "12 Secret Road", "13800138000", "person@example.com", "美国联邦-小货价", "<"]) {
    assert.equal(encoded.includes(secret), false, secret);
  }
  assert.equal(encoded.includes("Z"), false);
  const newest = newestFirst(parsed.events.map((event) => ({ time: event.time })));
  assert.equal(newest[0]?.time, "2026-11-06 16:38:53");
});

test("strips markup instead of treating a broken event as an empty waybill", () => {
  const parsed = parseForwarderHtml(
    page({
      events: [
        {
          time: "2026-11-02 20:00:27",
          location: '<img src=x onerror=alert(1)>',
          description: "<script>alert(1)</script>货物电子信息已经收到",
        },
      ],
    }),
    NUMBER,
  );
  assert.equal(parsed.kind, "ready");
  if (parsed.kind !== "ready") return;
  assert.equal(parsed.events[0]?.description, "货物电子信息已经收到");
  assert.equal(parsed.events[0]?.location, null);
  const encoded = JSON.stringify(parsed);
  assert.equal(encoded.includes("<script"), false);
  assert.equal(encoded.includes("onerror"), false);
  assert.equal(encoded.includes("alert"), false);
});

test("empty waybill is not found, and unreadable or challenged pages are not misses", () => {
  assert.equal(parseForwarderHtml(page({ number: "", events: [], status: "", destination: "", pieces: "" }), NUMBER).kind, "not_found");
  assert.equal(parseForwarderHtml("<html><body>maintenance</body></html>", NUMBER).kind, "parser_failure");
  assert.equal(parseForwarderHtml("<html><body><form>验证码</form></body></html>", NUMBER).kind, "challenge");
  const shifted = parseForwarderHtml(page({ localTime: "2026-11-06T16:38:53Z" }), NUMBER);
  assert.equal(shifted.kind, "parser_failure");
});

test("decodes a gb18030 page from the declared charset", () => {
  const bytes = Buffer.from(GB18030_PAGE, "base64");
  const parsed = readForwarderBody(bytes, "text/html;charset=gb18030", NUMBER);
  assert.equal(parsed.kind, "ready");
  if (parsed.kind !== "ready") return;
  assert.equal(parsed.events[0]?.description, "到达收货点");
  assert.equal(parsed.events[0]?.time, "2026-11-03 14:01:16");
  assert.equal(JSON.stringify(parsed).includes("Pat Example"), false);
});

test("a forwarder history is preferred and a stale carrier miss is not returned", async () => {
  const admin = createShipmentRecord(
    {
      trackingNumber: NUMBER,
      carrierId: "fedex",
      customerName: "Hidden Customer",
      notes: "secret note",
    },
    NOW,
  );
  getDb()
    .prepare(
      `INSERT INTO public_track_cache (
        id, tracking_number, carrier_id, carrier_resolution, carrier_candidates, status, outcome, message,
        fetched_at, fresh_until, interest_until, refresh_stopped, consecutive_failures, created_at, updated_at
      ) VALUES ('old-miss', ?, NULL, 'unresolved', '["fedex","sf-express","sto","zto"]', 'Unknown', 'not_found', ?, ?, ?, ?, 0, 0, ?, ?)`,
    )
    .run(
      NUMBER,
      MSG.noHistory,
      "2026-11-08T15:03:49.218Z",
      "2026-11-08T16:03:49.218Z",
      "2026-11-10T15:03:49.218Z",
      "2026-11-08T15:03:49.218Z",
      "2026-11-08T15:03:49.218Z",
    );
  const { client, trackCalls } = scraper();
  const { calls, forwarder } = source(page());
  const result = shipped(await publicLookup(NUMBER, "198.51.100.40", NOW, { client, processNow: true, forwarder }));
  assert.equal(result.state, "ready");
  assert.equal(result.found, true);
  assert.equal(result.shipment?.carrier.resolution, "forwarder");
  assert.equal(result.shipment?.status, "转运中11/8号航班/");
  assert.equal(result.shipment?.events.length, 5);
  assert.equal(result.shipment?.eta, null);
  assert.equal(result.shipment?.origin, "China");
  assert.equal(result.shipment?.originCountryCode, "CN");
  assert.equal(result.shipment?.greeting, "Pat, your shipment is on its way to you. Cheers!");
  const stored = JSON.stringify(getDb().prepare("SELECT * FROM public_track_cache").all());
  assert.equal(stored.includes("Example"), false);
  assert.equal(stored.includes("Pat Example"), false);
  assert.equal(result.shipment?.timeNote, MSG.forwarderTimeNote);
  assert.equal(result.shipment?.events.some((event) => event.time?.endsWith("Z")), false);
  assert.equal(trackCalls.length, 0);
  assert.equal(calls.length, 1);
  const again = shipped(
    await publicLookup(NUMBER, "198.51.100.40", new Date(NOW.getTime() + 1000), {
      client,
      processNow: true,
      forwarder,
    }),
  );
  assert.equal(again.state, "ready");
  assert.equal(calls.length, 1);
  assert.equal(getShipment(admin.id)?.customerName, "Hidden Customer");
  assert.equal(getShipment(admin.id)?.notes, "secret note");
  const encoded = JSON.stringify(again);
  assert.equal(encoded.includes("Hidden Customer"), false);
  assert.equal(encoded.includes("secret note"), false);
  assert.equal(encoded.includes("Pat Example"), false);
});

test("an empty forwarder waybill falls through to the carrier, and parallel lookups share one read", async () => {
  const missed = source(page({ number: "", events: [], status: "", destination: "", pieces: "" }));
  const { client, trackCalls } = scraper();
  const fallback = shipped(
    await publicLookup("1Z999AA10123456784", "198.51.100.41", NOW, {
      client,
      processNow: true,
      forwarder: missed.forwarder,
    }),
  );
  assert.equal(fallback.state, "ready");
  assert.equal(fallback.shipment?.carrier.name, "UPS");
  assert.equal(trackCalls.length, 1);
  assert.equal(missed.calls.length, 1);

  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let reads = 0;
  const forwarder = async () => {
    reads += 1;
    await gate;
    return parseForwarderHtml(page(), NUMBER);
  };
  const first = publicLookup(NUMBER, "198.51.100.42", NOW, { forwarder });
  const second = publicLookup(NUMBER, "198.51.100.43", NOW, { forwarder });
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(reads, 1);
  release();
  const both = await Promise.all([first, second]);
  assert.equal(shipped(both[0]).state, "ready");
  assert.equal(shipped(both[1]).state, "ready");
  assert.equal(reads, 1);
});

test("timeout and parser failure are not stored as a carrier miss", async () => {
  const { client, trackCalls } = scraper();
  const timed = shipped(
    await publicLookup(NUMBER, "198.51.100.44", NOW, {
      client,
      processNow: true,
      forwarder: async () => ({ kind: "timeout" }),
    }),
  );
  assert.equal(timed.state, "timeout");
  assert.equal(timed.message, MSG.forwarderTimeout);
  assert.equal(trackCalls.length, 0);

  const broken = shipped(
    await publicLookup("ZZNORESULT1", "198.51.100.45", new Date(NOW.getTime() + 1000), {
      client,
      processNow: true,
      forwarder: async () => ({ kind: "parser_failure" }),
    }),
  );
  assert.equal(broken.state, "unavailable");
  assert.equal(broken.message, MSG.forwarderUnusable);
  assert.notEqual(broken.message, MSG.noHistory);
  assert.equal(trackCalls.length, 0);

  const challenged = shipped(
    await publicLookup("ZZNORESULT2", "198.51.100.46", new Date(NOW.getTime() + 2000), {
      client,
      processNow: true,
      forwarder: async () => ({ kind: "challenge" }),
    }),
  );
  assert.equal(challenged.message, MSG.forwarderChallenge);
  assert.equal(trackCalls.length, 0);
});

test("the forwarder request limit is shared and finite", () => {
  for (let index = 0; index < FORWARDER_REQUEST_LIMIT; index += 1) {
    assert.equal(claimForwarderRequest(NOW), true);
  }
  assert.equal(claimForwarderRequest(NOW), false);
});
