import { createHmac, timingSafeEqual } from "node:crypto";
import { getDb } from "@/lib/tracking/db";
import { listProof, readProof } from "@/lib/tracking/dropship-proof";

const photoMimes = new Set(["image/jpeg", "image/png", "image/webp"]);
const tokenLifetime = 30 * 60;

function secret() {
  return process.env.PARTNER_SHIPMENT_PHOTO_KEY || "";
}

function equal(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function acceptsPhotoIndexKey(value: string | null) {
  const key = secret();
  return Boolean(key && value && equal(value, "Bearer " + key));
}

function signPhoto(shipment: string, photo: string, expires: number) {
  return createHmac("sha256", secret())
    .update(JSON.stringify(["partner-shipment-photo", shipment, photo, expires])).digest("base64url");
}

export function partnerShipmentPhotos(number: string, prefix: string, orders: { order: string; tracking: string }[]) {
  const shipments = getDb().prepare(`
    SELECT id, order_number AS "order", tracking_number AS tracking
    FROM shipments WHERE upper(replace(replace(trim(customer_ref), '-', ''), ' ', '')) IN (?, ?)
  `).all(prefix + number, number + prefix) as { id: string; order: string | null; tracking: string | null }[];
  const expires = Math.floor(Date.now() / 1000) + tokenLifetime;
  const normalized = (text: string | null) => (text ?? "").trim().toUpperCase();
  return orders.map(({ order, tracking }) => {
    const matches = shipments.filter((shipment) => {
      if (order && normalized(shipment.order) !== normalized(order)) return false;
      return tracking ? normalized(shipment.tracking) === normalized(tracking) : Boolean(order);
    });
    return matches.flatMap(({ id }) => listProof(id).filter(({ mime }) => photoMimes.has(mime)).map(({ id: photo }) =>
      "/api/partner-shipment-photos/" + encodeURIComponent(id) + "/" + encodeURIComponent(photo) +
      "?expires=" + expires + "&signature=" + signPhoto(id, photo, expires)));
  });
}

export function readSignedShipmentPhoto(shipment: string, photo: string, expires: string | null, signature: string | null) {
  if (!secret() || !expires || !signature || !/^[0-9]{10}$/.test(expires) || !/^[A-Za-z0-9_-]{43}$/.test(signature)) return undefined;
  const cutoff = Number(expires);
  const now = Math.floor(Date.now() / 1000);
  if (cutoff < now || cutoff > now + tokenLifetime || !equal(signature, signPhoto(shipment, photo, cutoff))) return undefined;
  const file = readProof(shipment, photo);
  return file && photoMimes.has(file.mime) ? file : undefined;
}
