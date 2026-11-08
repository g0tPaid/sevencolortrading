import assert from "node:assert/strict";
import test from "node:test";
import { greetingNameSpan, recipientDisplayName, shipmentPhase, trackingGreeting } from "@/lib/tracking/greeting";
import { parseForwarderHtml } from "@/lib/tracking/forwarder-source";
import { pointOnRoute, routeArc, routeTangentX } from "@/lib/tracking/route-map";

const NUMBER = "384423693978";

function page(recipient: string, status = "转运中11/8号航班/"): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
    <form action="trackIndex.htm"><textarea name="documentCode"></textarea></form>
    <div class="div_cont"><div class="danhao">【${NUMBER}】运单信息 件数:【1】</div>
    <div class="menu_"><ul>
      <li class="div_li3 abc">参考号</li><li class="div_li3 abc">跟踪号码</li><li class="div_li1 abc">目的地</li>
      <li class="div_li2 abc">当地时间</li><li class="div_li4 abc">最新状态</li><li class="div_li3 abc">收件人</li>
    </ul><ul>
      <li class="div_li3">Hidden Reference</li><li class="div_li3">${NUMBER}</li><li class="div_li1">US</li>
      <li class="div_li2">2026-11-06 16:38:53</li><li class="div_li4">${status}</li>
      <li class="div_li3">${recipient}</li>
    </ul></div>
    <div class="men_li"><table><tr><td>2026-11-06 16:38:53</td><td>深圳</td><td>11/8号航班</td></tr></table></div>
    </div></body></html>`;
}

test("the labeled display name is kept whole, including a joint name", () => {
  assert.equal(recipientDisplayName("Pat Example"), "Pat Example");
  assert.equal(recipientDisplayName("Maria"), "Maria");
  assert.equal(recipientDisplayName("Sam & Alex Example"), "Sam & Alex Example");
  assert.equal(recipientDisplayName("Sam &amp; Alex Example"), "Sam & Alex Example");
  const parsed = parseForwarderHtml(page("Sam & Alex Example"), NUMBER);
  assert.equal(parsed.kind, "ready");
  if (parsed.kind !== "ready") return;
  assert.equal(parsed.displayName, "Sam & Alex Example");
  assert.equal(JSON.stringify(parsed).includes("Hidden Reference"), false);
});

test("a missing, masked, contact, or markup-only recipient is not a name", () => {
  for (const value of ["", "J***", "pat@example.com", "Pat 13800138000", "12 Secret Road", "<script>alert(1)</script>"]) {
    assert.equal(recipientDisplayName(value), null, value);
  }
  const stripped = recipientDisplayName("Pat <script>alert(1)</script> Example");
  assert.equal(stripped, "Pat Example");
  assert.equal(stripped?.includes("<"), false);
  assert.equal(stripped?.includes("alert"), false);
  const parsed = parseForwarderHtml(page(""), NUMBER);
  assert.equal(parsed.kind, "ready");
  if (parsed.kind !== "ready") return;
  assert.equal(parsed.displayName, null);
});

test("greetings follow the status and never claim movement when it is unknown", () => {
  assert.equal(shipmentPhase("转运中11/8号航班/"), "in_transit");
  assert.equal(
    trackingGreeting("转运中11/8号航班/", "Sam & Alex Example"),
    "Sam & Alex Example, your shipment is on its way to you. Cheers!",
  );
  assert.equal(trackingGreeting("转运中11/8号航班/", null), "Your shipment is on its way to you. Cheers!");
  assert.equal(trackingGreeting("已签收", "Pat Example"), "Pat Example, your shipment has been delivered. Cheers!");
  assert.equal(trackingGreeting("货物电子信息已经收到", null), "Your shipment is being prepared. Cheers!");
  assert.equal(trackingGreeting("异常", "Pat Example"), null);
  assert.equal(trackingGreeting("Unknown", "Pat Example"), null);
  assert.equal(trackingGreeting("转运中", "pat@example.com"), "Your shipment is on its way to you. Cheers!");
});

test("only the composed display name is marked, including a joint name", () => {
  const joint = trackingGreeting("转运中11/8号航班/", "Sam & Alex Example");
  const single = trackingGreeting("已签收", "Pat Example");
  const nameless = trackingGreeting("转运中11/8号航班/", null);
  assert.ok(joint && single && nameless);
  const jointParts = greetingNameSpan(joint);
  const singleParts = greetingNameSpan(single);
  assert.equal(jointParts?.name, "Sam & Alex Example");
  assert.equal(jointParts && jointParts.name + jointParts.rest, joint);
  assert.equal(singleParts?.name, "Pat Example");
  assert.equal(singleParts && singleParts.name + singleParts.rest, single);
  assert.equal(greetingNameSpan(nameless), null);
  assert.equal(greetingNameSpan("Pat Example, your shipment is on its way"), null);
  assert.equal(greetingNameSpan("pat@example.com, your shipment is on its way to you. Cheers!"), null);
});

test("a route illustration needs two known countries and does not invent a stop", () => {
  const arc = routeArc("CN", "US");
  assert.ok(arc);
  assert.equal(arc?.originLabel, "China");
  assert.equal(arc?.destinationLabel, "United States");
  assert.equal(arc?.facesLeft, true);
  for (const t of [0, 0.25, 0.5, 0.75, 1]) {
    assert.ok(arc && routeTangentX(arc, t) < 0, `tangent at ${t}`);
  }
  const start = arc && pointOnRoute(arc, 0);
  const middle = arc && pointOnRoute(arc, 0.5);
  const end = arc && pointOnRoute(arc, 1);
  assert.ok(start && middle && end);
  assert.ok(Math.abs(start.x - arc.from.x) < 0.2);
  assert.ok(Math.abs(end.x - arc.to.x) < 0.2);
  assert.ok(middle.x < start.x && middle.x > end.x);
  assert.equal(routeArc("US", "CN")?.facesLeft, false);
  assert.equal(routeArc("CN", null), null);
  assert.equal(routeArc("CN", "CN"), null);
  assert.equal(routeArc("CN", "ZZ"), null);
  assert.equal(arc?.d.includes("L"), false);
});
