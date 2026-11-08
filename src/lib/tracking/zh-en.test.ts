import assert from "node:assert/strict";
import test from "node:test";
import { glossTrackingText } from "@/lib/tracking/zh-en";

test("the newest forwarder status keeps the flight wording and does not invent a departure or ETA", () => {
  const gloss = glossTrackingText("转运中11/8号航班/");
  assert.equal(gloss.state, "translated");
  if (gloss.state !== "translated") return;
  assert.equal(gloss.english, "In transit — November 8 flight");
  assert.equal(/depart|eta|scheduled|landed/i.test(gloss.english), false);
});

test("the five verified event lines translate under the Chinese", () => {
  const cases: Array<[string, string]> = [
    ["11/8号航班", "November 8 flight"],
    ["货物离开操作中心", "Shipment left the operating center"],
    ["到达收货点", "Arrived at the receiving point"],
    ["货物电子信息已经收到", "Electronic shipment information received"],
    ["货件信息已发送给 FedEx", "Shipment information sent to FedEx"],
    ["深圳", "Shenzhen"],
    ["货物离开深圳操作中心", "Shipment left the Shenzhen operating center"],
    ["转运中12/3号航班", "In transit — December 3 flight"],
  ];
  for (const [source, english] of cases) {
    const gloss = glossTrackingText(source);
    assert.equal(gloss.state, "translated", source);
    if (gloss.state === "translated") assert.equal(gloss.english, english, source);
  }
});

test("english and source times need no gloss, and unknown Chinese is not guessed", () => {
  assert.deepEqual(glossTrackingText("In Transit"), { state: "plain" });
  assert.deepEqual(glossTrackingText("2026-11-06 16:38:53"), { state: "plain" });
  assert.deepEqual(glossTrackingText("US"), { state: "plain" });
  assert.equal(glossTrackingText("这是一句没有把握的备注").state, "unavailable");
  assert.equal(glossTrackingText("到达未知镇").state, "unavailable");
});
