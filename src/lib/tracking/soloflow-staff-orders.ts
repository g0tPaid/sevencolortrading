import { getDb, withImmediate } from "@/lib/tracking/db";
import { createShipmentRecord, updateShipmentRecord } from "@/lib/tracking/service";
import { getShipment } from "@/lib/tracking/store";
import { CARRIERS } from "@/lib/tracking/carriers";

const fields = ["phone", "address", "addressLine2", "city", "region", "postcode", "country"] as const;
type Field = typeof fields[number];
type Contact = Record<Field, string>;

function db() {
  const db = getDb();
  db.exec(`CREATE TABLE IF NOT EXISTS soloflow_staff_orders (
    invoice_id TEXT PRIMARY KEY,
    shipment_id TEXT NOT NULL UNIQUE REFERENCES shipments(id) ON DELETE CASCADE,
    revision TEXT NOT NULL,
    contact TEXT NOT NULL,
    edited INTEGER NOT NULL DEFAULT 0
  )`);
  return db;
}

function value(input: unknown, max: number) {
  return typeof input === "string" ? input.trim().slice(0, max) : "";
}

function contactDetails(input: unknown): Contact {
  const info = input && typeof input === "object" ? input as Record<string, unknown> : {};
  return Object.fromEntries(fields.map((field) => [field, value(info[field], field === "address" ? 500 : 200)])) as Contact;
}

export function staffContact(shipmentId: string): Contact | null {
  const row = db().prepare("SELECT contact FROM soloflow_staff_orders WHERE shipment_id = ?").get(shipmentId);
  return typeof row?.contact === "string" ? contactDetails(JSON.parse(row.contact)) : null;
}

export function editStaffContact(id: string, input: unknown) {
  db().prepare("UPDATE soloflow_staff_orders SET contact = ?, edited = 1 WHERE shipment_id = ?")
    .run(JSON.stringify(contactDetails(input)), id);
}

export function syncStaffOrder(input: Record<string, unknown>) {
  const id = value(input.id, 80);
  const reference = value(input.reference, 80).toUpperCase();
  const order = value(input.order, 80);
  const revision = value(input.revision, 35);
  if (!/^[a-z0-9_-]{10,80}$/i.test(id) || !/^(?:[A-Z0-9]{1,12}-)?[0-9]{4}$/.test(reference) ||
    !order || !Number.isFinite(Date.parse(revision))) return null;
  const contact = contactDetails(input.contact);
  const customerName = value(input.customerName, 120);
  db();
  const link = withImmediate((connection) => {
    const previous = connection.prepare("SELECT shipment_id, revision FROM soloflow_staff_orders WHERE invoice_id = ?").get(id);
    if (typeof previous?.shipment_id === "string") {
      if (revision > String(previous.revision)) {
        connection.prepare("UPDATE soloflow_staff_orders SET revision = ?, contact = CASE WHEN edited = 0 THEN ? ELSE contact END WHERE invoice_id = ?")
          .run(revision, JSON.stringify(contact), id);
      }
      return previous.shipment_id;
    }
    const [prefix, number] = reference.includes("-") ? reference.split("-") : ["", reference];
    const existing = connection.prepare(`SELECT id FROM shipments
      WHERE upper(replace(replace(trim(customer_ref),'-',''),' ','')) IN (?, ?)
        AND upper(trim(order_number)) = ?
        AND NOT EXISTS (SELECT 1 FROM soloflow_staff_orders WHERE shipment_id = shipments.id)
        ORDER BY created_at DESC LIMIT 2`)
      .all(prefix + number, number + prefix, order.toUpperCase());
    const shipmentId = existing.length === 1 ? String(existing[0].id) : createShipmentRecord({
      customerRef: reference, customerName, orderNumber: order, destination: contact.country, trackingNumber: "",
    }).id;
    connection.prepare("INSERT INTO soloflow_staff_orders (invoice_id, shipment_id, revision, contact) VALUES (?, ?, ?, ?)")
      .run(id, shipmentId, revision, JSON.stringify(contact));
    return shipmentId;
  });
  let shipment = getShipment(link);
  if (shipment && (!shipment.trackingNumber || !shipment.carrierId)) {
    const track = value(input.tracking, 80);
    const selection = value(input.carrier, 120).toLowerCase();
    const carrierId = CARRIERS.find((option) => option.id === selection || option.name.toLowerCase() === selection)?.id;
    const patch = {
      ...(!shipment.trackingNumber && track ? { trackingNumber: track } : {}),
      ...(!shipment.carrierId && carrierId ? { carrierId } : {}),
    };
    if (Object.keys(patch).length) {
      // Leave a valid staff order even if the supplied carrier or code needs staff review.
      try { shipment = updateShipmentRecord(link, patch) ?? shipment; } catch { /* staff can correct tracking */ }
    }
  }
  return { shipmentId: link, tracking: shipment?.trackingNumber ?? "", carrier: shipment?.carrierId ?? "" };
}
