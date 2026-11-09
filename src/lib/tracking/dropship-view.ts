type OrderView = {
  orderNumber: string | null;
  status: string;
  trackingNumber: string;
  carrierName: string | null;
  eta: string | null;
  events: { status: string; occurredAt: string | null; location: string | null }[];
  media: { src: string; mime: string }[];
};

function escape(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export function renderDropshipOrder(order: OrderView) {
  const events = order.events.map((event) =>
    '<li><strong>' + escape(event.status) + '</strong><small>' +
    escape([event.occurredAt?.slice(0, 10), event.location].filter(Boolean).join(" · ")) +
    '</small></li>').join("");
  const media = order.media.map((item, index) => {
    const src = escape(item.src);
    const video = item.mime.startsWith("video/");
    const label = (video ? "Video " : "Photo ") + (index + 1);
    const preview = video
      ? '<video controls preload="metadata" aria-label="' + label + '" src="' + src + '"></video>'
      : '<a href="' + src + '" target="_blank" rel="noreferrer"><img loading="lazy" alt="Pre-shipment ' + label.toLowerCase() + '" src="' + src + '"></a>';
    return '<figure>' + preview + '<figcaption>' + label + '</figcaption></figure>';
  }).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta name="referrer" content="no-referrer">
<title>Dropship order · Sourcing Center</title>
<style>
:root{color-scheme:light;font:16px system-ui,sans-serif;color:var(--ink);background:var(--canvas);--ink:#1d1d1f;--canvas:#f5f5f7;--muted:#6e6e73;--accent:#d60000;--line:rgba(29,29,31,.08);--glass:rgba(255,255,255,.72);--tint:rgba(214,0,0,.08)}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse 80% 46% at 50% 0%,var(--tint),transparent 58%);min-height:100vh}main{max-width:980px;margin:auto;padding:48px 20px 72px}
header{margin-bottom:28px}.brand{color:var(--accent);font-size:13px;font-weight:700;letter-spacing:.13em;text-transform:uppercase}
h1,h2{font-family:Georgia,serif;letter-spacing:-.035em;margin:0}h1{font-size:clamp(2.25rem,6vw,4rem);line-height:1.08}
h2{font-size:1.65rem}h3{margin:20px 0 0}p,dt,small,figcaption{color:var(--muted)}
section{border:1px solid var(--line);border-radius:24px;background:var(--glass);box-shadow:0 10px 32px rgba(15,23,42,.06);padding:24px;margin-top:20px}
.status{display:inline-block;border-radius:30px;background:var(--tint);color:var(--accent);padding:7px 13px;font-weight:700}
dl,.media{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:16px}
dd{margin:4px 0 0;font-weight:650;overflow-wrap:anywhere}dt,small,figcaption{font-size:.875rem}
ol{padding:0;list-style:none}li{border-left:2px solid var(--accent);padding:3px 0 3px 14px;margin:10px 0}small{display:block;margin-top:2px}
figure{margin:0;background:var(--canvas);border-radius:12px;overflow:hidden}
img,video{display:block;width:100%;aspect-ratio:16/9;object-fit:contain}video{background:#172728}
figcaption{padding:10px 12px}
@media(prefers-color-scheme:dark){:root{color-scheme:dark;--ink:#f5f5f7;--canvas:#0c0c0e;--muted:#a1a1a6;--accent:#ff3b3b;--line:rgba(255,255,255,.1);--glass:rgba(28,28,30,.72);--tint:rgba(255,59,59,.14)}}
</style>
</head>
<body><main>
<header><p class="brand">Sourcing Center · Private order view</p><h1>Your dropship order</h1>${order.orderNumber ? '<p>Order ' + escape(order.orderNumber) + '</p>' : ""}</header>
<section aria-labelledby="shipping"><h2 id="shipping">Shipping status</h2><p class="status">${escape(order.status)}</p>
<dl><div><dt>Tracking number</dt><dd>${escape(order.trackingNumber)}</dd></div>
<div><dt>Carrier</dt><dd>${escape(order.carrierName || "Awaiting confirmation")}</dd></div>
<div><dt>Estimated delivery</dt><dd>${escape(order.eta || "Awaiting carrier estimate")}</dd></div></dl>
<h3>Tracking history</h3>${events ? "<ol>" + events + "</ol>" : "<p>Carrier updates will appear here when available.</p>"}</section>
<section aria-labelledby="proof"><h2 id="proof">Pre-shipment photos and videos</h2>
<p>Photos and clips shared by the warehouse team before dispatch.</p>
${media ? '<div class="media">' + media + '</div>' : "<p>The warehouse team hasn’t shared any media yet.</p>"}</section>
</main></body></html>`;
}
