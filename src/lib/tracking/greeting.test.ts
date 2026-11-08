import assert from "node:assert/strict";
import test from "node:test";
import { extractGivenName, shipmentPhase, trackingGreeting } from "@/lib/tracking/greeting";
import { parseForwarderHtml } from "@/lib/tracking/forwarder-source";

const NUMBER = "384423693978";

function page(recipient: string, status = "转运中11/8号航班/"): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
    <form action="trackIndex.htm"><textarea name="documentCode"></textarea></form>
    <div class="div_cont"><div class="danhao">【${NUMBER}】运单信息 件数:【1】</div>
    <div class="menu_"><ul>
      <li class="div_li3 abc">参考号</li><li class="div_li3 abc">跟踪号码</li><li class="div_li1 abc">目的地</li>
      <li class="div_li2 abc">当地时间</li><li class="div_li4 abc">最新状态</li><li class="div_li3 abc">收件人</li>
    </ul><ul>
      <li class="div_li3">REF123456</li><li class="div_li3">${NUMBER}</li><li class="div_li1">US</li>
      <li class="div_li2">2026-11-06 16:38:53</li><li class="div_li4">${status}</li>
      <li class="div_li3">${recipient}</li>
    </ul></div>
    <div class="men_li"><table><tr><td>2026-11-06 16:38:53</td><td>深圳</td><td>11/8号航班</td></tr></table></div>
    </div></body></html>`;
}

test("a simple personal name keeps only the given name", () => {
  assert.equal(extractGivenName("Pat Example"), "Pat");
  assert.equal(extractGivenName("Maria"), "Maria");
  assert.equal(extractGivenName("Mary-Jane Smith"), "Mary-Jane");
  const parsed = parseForwarderHtml(page("Pat Example"), NUMBER);
  assert.equal(parsed.kind, "ready");
  if (parsed.kind !== "ready") return;
  assert.equal(parsed.givenName, "Pat");
  assert.equal(JSON.stringify(parsed).includes("Example"), false);
  assert.equal(JSON.stringify(parsed).includes("Pat Example"), false);
});

test("joint names, organizations, masks, and markup do not yield a name", () => {
  for (const value of [
    "Sam & Alex Example",
    "Sam and Alex Example",
    "Acme Logistics Ltd",
    "华南公司",
    "J***",
    "<script>alert(1)</script>",
    "pat@example.com",
    "Pat 13800138000",
    "张三",
    "Example, Pat",
    "Pat Middle Example",
    "",
  ]) {
    assert.equal(extractGivenName(value), null, value);
  }
  const stripped = extractGivenName("Pat <script>alert(1)</script> Example");
  assert.equal(stripped, "Pat");
  assert.equal(stripped?.includes("<"), false);
  assert.equal(stripped?.includes("alert"), false);
  const parsed = parseForwarderHtml(page("Sam & Alex Example"), NUMBER);
  assert.equal(parsed.kind, "ready");
  if (parsed.kind !== "ready") return;
  assert.equal(parsed.givenName, null);
  const encoded = JSON.stringify(parsed);
  assert.equal(encoded.includes("Sam"), false);
  assert.equal(encoded.includes("Alex"), false);
  assert.equal(encoded.includes("&"), false);
});

test("greetings follow the status and never claim movement when it is unknown", () => {
  assert.equal(shipmentPhase("转运中11/8号航班/"), "in_transit");
  assert.equal(trackingGreeting("转运中11/8号航班/", "Pat"), "Pat, your shipment is on its way to you. Cheers!");
  assert.equal(trackingGreeting("转运中11/8号航班/", null), "Your shipment is on its way to you. Cheers!");
  assert.equal(trackingGreeting("已签收", "Pat"), "Pat, your shipment has been delivered. Cheers!");
  assert.equal(trackingGreeting("货物电子信息已经收到", null), "Your shipment is being prepared. Cheers!");
  assert.equal(trackingGreeting("异常", "Pat"), null);
  assert.equal(trackingGreeting("Unknown", "Pat"), null);
  assert.equal(trackingGreeting("转运中", "Pat Example"), "Your shipment is on its way to you. Cheers!");
  const escaped = trackingGreeting("转运中", "Pat<script>");
  assert.equal(escaped, "Your shipment is on its way to you. Cheers!");
  assert.equal(extractGivenName("A".repeat(40) + " Example"), null);
});
