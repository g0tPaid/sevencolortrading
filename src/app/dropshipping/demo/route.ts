type Item = {
  name: string | null;
  description: string;
  imageUrl: string | null;
  quantity: string;
  unitPrice: string;
  amount: string;
};

type Shipment = {
  number: string;
  issueDate?: string;
  awaiting?: boolean;
  status?: string;
  staffTrackingStatus?: string;
  shippedAt: string | null;
  shipmentUpdatedAt?: string | null;
  shipmentWeightKg: string | null;
  partnerOrderNumber: string | null;
  endRecipientName: string | null;
  endRecipientAddress: string | null;
  shipmentContact?: { addressLine2?: string; city?: string; region?: string; postcode?: string; country?: string };
  shipmentCarrier: string | null;
  shippingToCountry: string | null;
  shippingMethod: string | null;
  fulfillmentStatus: string | null;
  internationalTrackingNumber: string | null;
  localTrackingNumber: string | null;
  currency: string;
  subtotal: string;
  shipping: string;
  taxAmount: string;
  discount: string;
  total: string;
  items: Item[];
};

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]!);
}

function imageUrl(value: string | null) {
  if (!value) return null;
  if (value.startsWith('data:image/svg+xml,')) return value;
  if (/^\/uploads\/[\w./%+-]+$/.test(value) && !value.includes('..')) return value;
  if (/^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(value)) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

function money(amount: string, currency: string) {
  const number = Number(amount);
  if (!Number.isFinite(number)) return '—';
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency, currencyDisplay: 'code' }).format(number);
  } catch {
    return currency + ' ' + number.toFixed(2);
  }
}

function detail(label: string, value: string | null) {
  if (!value) return '';
  return '<div><dt>' + escapeHtml(label) + '</dt><dd>' + escapeHtml(value) + '</dd></div>';
}

function trackShipmentButton() {
  return '<a class="track-shipment" href="https://www.sourcing.center/track" target="_blank" rel="noopener noreferrer">Track shipment <span aria-hidden="true">↗</span></a>';
}

function shipmentCard(shipment: Shipment, photos: string[]) {
  const currency = shipment.currency;
  const price = (amount: string) => money(amount, currency);
  const products = shipment.items.map((item) => {
    const image = imageUrl(item.imageUrl);
    const title = item.name || item.description || 'Product';
    const photo = image
      ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(title) + '" loading="lazy" referrerpolicy="no-referrer">'
      : '<div class="photo" aria-hidden="true"></div>';
    return '<li>' + photo + '<div><strong>' + escapeHtml(title) + '</strong>' +
      (item.description?.trim() && item.description.trim() !== title.trim()
        ? '<small class="attributes">' + escapeHtml(item.description.trim()) + '</small>' : '') +
      '<small>' + escapeHtml(Number(item.quantity) + ' × ' + price(item.unitPrice)) + '</small></div>' +
      '<b>' + escapeHtml(price(item.amount)) + '</b></li>';
  }).join('');
  const tracking = shipment.internationalTrackingNumber || (shipment.shippingMethod === 'LOCAL' ? shipment.localTrackingNumber : null);
  const inactive = shipment.status === 'CANCELLED' || shipment.status === 'VOID';
  const status = inactive ? (shipment.status === 'VOID' ? 'Void' : 'Cancelled') :
    (shipment.fulfillmentStatus === 'SHIPPED_INTERNATIONAL' ||
      (shipment.fulfillmentStatus === 'SHIPPED_TO_CHINA_CENTER' && shipment.shippingMethod === 'LOCAL')) ? 'Shipped · awaiting reception' :
    shipment.fulfillmentStatus ? shipment.fulfillmentStatus :
      shipment.status && ['DRAFT', 'SENT', 'VIEWED', 'PARTIAL', 'OVERDUE'].includes(shipment.status) ? 'Awaiting payment' : 'Awaiting shipment';
  return '<article><header><div><p class="eyebrow">Invoice ' + escapeHtml(shipment.number) + '</p>' +
    '<h2>' + escapeHtml(shipment.partnerOrderNumber ? 'Order ' + shipment.partnerOrderNumber : shipment.number) + '</h2></div>' +
    '<span class="badge' + (shipment.awaiting || inactive ? ' awaiting' : '') + '">' + escapeHtml(status) + '</span></header>' +
    '<dl class="details">' + detail('Recipient', shipment.endRecipientName || 'Not provided') +
    detail('Delivery address', [shipment.endRecipientAddress, shipment.shipmentContact?.addressLine2,
      [shipment.shipmentContact?.city, shipment.shipmentContact?.region, shipment.shipmentContact?.postcode].filter(Boolean).join(' '),
      shipment.shipmentContact?.country].filter(Boolean).join('\n')) + detail('Destination', shipment.shippingToCountry) +
    detail('Carrier', shipment.shipmentCarrier) + detail('Tracking number', tracking || (status === 'Awaiting payment' ? 'Awaiting payment' : shipment.awaiting ? 'Awaiting shipment' : 'Pending')) +
    detail('Carrier status', shipment.staffTrackingStatus || null) +
    detail('Shipment weight', shipment.shipmentWeightKg != null ? shipment.shipmentWeightKg + ' kg' : null) + detail('Invoice date', shipment.issueDate ? shipment.issueDate.slice(0, 10) : null) + '</dl><ul aria-label="Products">' + products + '</ul>' +
    '<dl class="totals">' + detail('Products', price(shipment.subtotal)) + detail('Shipping', price(shipment.shipping)) +
    (Number(shipment.discount) > 0 ? detail('Discount', price(shipment.discount)) : '') +
    (Number(shipment.taxAmount) > 0 ? detail('Tax', price(shipment.taxAmount)) : '') +
    detail('Total', price(shipment.total)) + '</dl>' + (tracking && !inactive ? trackShipmentButton() : '') + shipmentPhotos(photos) + '</article>';
}

type Stock = { name: string; sku: string | null; imageUrl: string | null; allocated: string; shipped: string; remaining: string };

function inventory(rows: Stock[]) {
  if (!rows.length) return '';
  return '<section class="inventory" aria-label="Partner stock"><h2>Your stock</h2><ul>' + rows.map((row) => {
    const image = imageUrl(row.imageUrl);
    const thumb = image ? '<img src="' + escapeHtml(image) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : '<div class="photo" aria-hidden="true"></div>';
    return '<li>' + thumb + '<div><strong>' + escapeHtml(row.name) + '</strong>' +
      (row.sku ? '<small>' + escapeHtml(row.sku) + '</small>' : '') + '</div><dl class="totals">' +
      detail('Allocated', row.allocated) + detail('Shipped', row.shipped) + detail('In stock', row.remaining) + '</dl></li>';
  }).join('') + '</ul></section>';
}

function shipmentPhotos(paths: string[]) {
  if (!paths.length) return '';
  return '<p class="eyebrow" style="margin-top:16px">Pre-shipment photos · illustrative samples</p><div class="shipment-photos">' + paths.map((url, i) => '<img src="' + escapeHtml(url) + '" alt="Illustrative warehouse proof ' + (i + 1) + '">').join('') + '</div>';
}
const styles = `
.track-shipment{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#8e1744;border:1px solid #8e1744;color:#fff;border-radius:12px;padding:10px 16px;font-weight:700;text-decoration:none;line-height:1.4;margin-top:16px;min-height:44px}.track-shipment:hover{background:#701237}.track-shipment:focus-visible{outline:3px solid #d894ae;outline-offset:3px}.top .track-shipment{margin-top:8px}
*{box-sizing:border-box}body{margin:0;background:#f7f6f5;color:#251b21;font:15px/1.5 system-ui,sans-serif}
/* Subtle, non-interactive Sourcing Center watermark across the customer shipment portal. */
body::after{content:"";position:fixed;inset:0;z-index:9999;pointer-events:none;user-select:none;background-repeat:repeat;background-size:360px 190px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='190' viewBox='0 0 360 190'%3E%3Ctext x='180' y='95' transform='rotate(-30 180 95)' text-anchor='middle' font-family='Arial,sans-serif' font-size='21' font-weight='600' fill='%23251b21' fill-opacity='.11'%3Ewww.sourcing.center%3C/text%3E%3C/svg%3E")}
@media(max-width:600px){body::after{background-size:280px 150px}}
main{max-width:1150px;margin:auto;padding:clamp(16px,4vw,48px)}.top,article header{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}
h1,h2,p,dl,dd{margin:0}h1{font-size:clamp(28px,6vw,45px);letter-spacing:-.04em;line-height:1.12}h2{font-size:19px;overflow-wrap:anywhere}
.eyebrow{color:#774356;font-size:12px;font-weight:700;margin-bottom:5px}.partner{color:#695c63;margin-top:6px}nav{display:flex;gap:8px;flex-wrap:wrap}
nav a{color:#781538;border:1px solid #e6d7dd;background:#fff;border-radius:999px;padding:8px 14px;text-decoration:none;font-weight:600}
.portal-brand{display:block;width:min(100%,310px);height:auto;margin-bottom:24px;border-radius:0;background:transparent}
.partner-name{display:inline-block;overflow-wrap:anywhere}
.customer-id{margin-top:10px;color:#695c63;font-size:14px}.customer-id strong{color:#781538}
@media(prefers-reduced-motion:no-preference){.partner-name{animation:welcome-name .65s ease-out both}}
@keyframes welcome-name{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.attributes{white-space:pre-line;overflow-wrap:anywhere}.badge.awaiting{color:#795310;background:#fff1d5}
nav a[aria-current=true]{background:#8e1744;color:#fff}.shipments{display:grid;gap:14px;margin:22px 0}.grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))}
article,.empty,.inventory{background:#fff;border:1px solid #ece4e7;border-radius:18px;padding:clamp(14px,3vw,24px);min-width:0}article header{margin-bottom:16px}.badge{font-size:12px;font-weight:700;color:#176145;background:#e7f6ed;border-radius:999px;padding:5px 10px}
.details{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,145px),1fr));gap:10px 16px}dt,small{color:#695c63;font-size:12px}dd{overflow-wrap:anywhere;white-space:pre-line;font-weight:600}
ul{padding:0;margin:16px 0;list-style:none;border-top:1px solid #efe9eb}li{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid #efe9eb}li strong{overflow-wrap:anywhere}small{display:block}
img,.photo{width:48px;height:48px;object-fit:cover;border-radius:8px;background:#f4edf0}.totals{display:flex;flex-wrap:wrap;gap:8px 20px}.totals div:last-child dd{color:#8e1744}.pagination{margin-top:16px}.inventory{margin-top:20px}.inventory ul{margin-bottom:0}.inventory li{grid-template-columns:48px minmax(0,1fr) minmax(90px,auto)}.inventory .totals{gap:5px 12px}.inventory li:last-child{border-bottom:0}.shipment-photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px;margin-top:16px}.shipment-photos img{width:100%;height:100px;object-fit:cover}
`;


function sampleImage(label: string, color: string, kind: 'shirt' | 'box' | 'bag') {
  const shape = kind === 'shirt' ? '<path d="M75 49l34-17 21 14 21-14 34 17 30 42-32 21-15-19v80H92V93l-15 19-32-21z" fill="'+color+'" stroke="#333" stroke-width="2"/>' : kind === 'bag' ? '<rect x="77" y="67" width="106" height="108" rx="14" fill="'+color+'"/><path d="M105 73V53a25 25 0 0150 0v20" fill="none" stroke="#555" stroke-width="7"/>' : '<path d="M47 76l83-34 83 34v81l-83 32-83-32z" fill="#c8a27b" stroke="#946a46" stroke-width="2"/><path d="M47 76l83 33 83-33M130 109v80M89 59l83 34" fill="none" stroke="#946a46" stroke-width="3"/><rect x="137" y="118" width="42" height="23" fill="#fff"/>';
  return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 220"><rect width="260" height="220" fill="#f0e9e4"/><ellipse cx="130" cy="185" rx="92" ry="12" fill="#ded4cc"/>'+shape+'<text x="130" y="211" text-anchor="middle" font-family="Arial" font-size="11" fill="#695c63">'+label+'</text></svg>');
}
const shirt = sampleImage('SAMPLE • Cotton T-shirt', '#343a42', 'shirt');
const bag = sampleImage('SAMPLE • Everyday tote', '#c69d75', 'bag');
const parcel = sampleImage('SAMPLE • Packed parcel', '#c8a27b', 'box');
const base = {shippedAt:null, shipmentWeightKg:null, endRecipientAddress:null, shipmentCarrier:null, shippingToCountry:'United Kingdom', shippingMethod:'INTERNATIONAL', internationalTrackingNumber:null, localTrackingNumber:null, currency:'USD', taxAmount:'0', discount:'0'};
const shipments: Shipment[] = [
  {...base, number:'DEMO-INV-1043', partnerOrderNumber:'#1043', issueDate:'2026-11-27', endRecipientName:'Sample recipient A', status:'SENT', fulfillmentStatus:null, awaiting:true, subtotal:'12', shipping:'6', total:'18', items:[{name:'Cotton T-shirt', description:'Black · Size L',imageUrl:shirt,quantity:'1',unitPrice:'12',amount:'12'}]},
  {...base, number:'DEMO-INV-1042', partnerOrderNumber:'#1042', issueDate:'2026-11-26', endRecipientName:'Sample recipient B', status:'PAID', fulfillmentStatus:'Quality check completed', awaiting:true, shippingToCountry:'Australia', subtotal:'22', shipping:'8', total:'30',items:[{name:'Everyday tote',description:'Beige · Standard',imageUrl:bag,quantity:'2',unitPrice:'11',amount:'22'}]},
  {...base, number:'DEMO-INV-1041', partnerOrderNumber:'#1041', issueDate:'2026-11-24', endRecipientName:'Sample recipient C', status:'PAID', fulfillmentStatus:'SHIPPED_INTERNATIONAL', shippingToCountry:'United Arab Emirates', shipmentCarrier:'Example Express', internationalTrackingNumber:'DEMO-NOT-TRACKABLE-1041', shipmentWeightKg:'0.8', subtotal:'24', shipping:'9', total:'33',items:[{name:'Cotton T-shirt',description:'Black · Size M',imageUrl:shirt,quantity:'2',unitPrice:'12',amount:'24'}]},
  {...base, number:'DEMO-INV-1040', partnerOrderNumber:'#1040', issueDate:'2026-11-20',endRecipientName:'Sample recipient D',status:'PAID',fulfillmentStatus:'Delivered',shippingToCountry:'United States',shipmentCarrier:'Example Express',internationalTrackingNumber:'DEMO-NOT-TRACKABLE-1040',subtotal:'11',shipping:'6',total:'17',items:[{name:'Everyday tote',description:'Beige · Standard',imageUrl:bag,quantity:'1',unitPrice:'11',amount:'11'}]}
];
const stock: Stock[] = [{name:'Cotton T-shirt',sku:'DEMO-TSHIRT',imageUrl:shirt,allocated:'50',shipped:'18',remaining:'32'},{name:'Everyday tote',sku:'DEMO-TOTE',imageUrl:bag,allocated:'30',shipped:'12',remaining:'18'}];
export function GET(request: Request) {
  const view = new URL(request.url).searchParams.get('view') === 'grid' ? 'grid' : 'list';
  const nav = '<nav aria-label="Shipment layout"><a aria-current="'+(view==='list')+'" href="?view=list">List</a><a aria-current="'+(view==='grid')+'" href="?view=grid">Grid</a></nav>';
  const cards = shipments.map((s,i)=>shipmentCard(s, i===0?[]:i===1?[bag]:[i===2?shirt:bag,parcel])).join('');
  const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dropshipping portal demo · Sourcing Center</title><style>'+styles+' .demo-banner{background:#fff1d5;border:1px solid #eadab5;border-radius:14px;padding:14px 18px;margin-bottom:24px;color:#795310}.demo-banner a{color:#781538;font-weight:700}.portal-brand{object-fit:contain;object-position:left;height:auto}.demo-note{margin:12px 0;color:#695c63;font-size:13px}</style></head><body><main><div class="demo-banner"><strong>DEMO · Sample partner portal</strong><br>All orders, recipients, tracking numbers and images are fictional examples. No real customer data or live shipments are shown. <a href="/dropshipping">Become a dropshipping partner ↗</a></div><img class="portal-brand" src="https://soloflow.practicalthings.store/icons/partner-portal-logo.png" alt="Sourcing Center by Seven Color Trading Co Ltd"><div class="top"><div><h1>Welcome, <span class="partner-name">Demo Store</span></h1><p class="customer-id">Customer ID <strong>SC-DEMO</strong></p></div><div>'+nav+trackShipmentButton()+'</div></div><p class="partner">'+shipments.length+' orders · Demo preview</p><p class="demo-note">Your real private portal updates automatically every 30 seconds. Sample tracking numbers cannot be tracked.</p><section aria-label="All shipments" class="shipments '+view+'">'+cards+'</section>'+inventory(stock)+'<p class="demo-note">Ready to get your own private portal? <a href="/dropshipping" style="color:#781538;font-weight:700">Apply to become a partner ↗</a></p></main></body></html>';
  return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'public, max-age=300','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data: https://soloflow.practicalthings.store; base-uri 'none'; frame-ancestors 'none'; form-action 'none'","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"}});
}
