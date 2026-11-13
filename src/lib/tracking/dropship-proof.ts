import { createHash, randomBytes, randomUUID } from "node:crypto";
import { getDb, withImmediate } from "@/lib/tracking/db";

export const MAX_PROOF_BYTES = 16 * 1024 * 1024;
const hash = (token: string) => createHash("sha256").update(token).digest("hex");

function db() {
  const connection = getDb();
  connection.exec(`
    CREATE TABLE IF NOT EXISTS dropship_links (
      shipment_id TEXT PRIMARY KEY REFERENCES shipments(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS dropship_proof (
      id TEXT PRIMARY KEY,
      shipment_id TEXT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
      mime TEXT NOT NULL,
      bytes BLOB NOT NULL
    );
    CREATE TABLE IF NOT EXISTS dropship_tracking_media (
      media_id TEXT PRIMARY KEY REFERENCES dropship_proof(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS dropship_proof_shipment ON dropship_proof(shipment_id);
  `);
  return connection;
}

export function issueDropshipLink(shipmentId: string) {
  const token = randomBytes(32).toString("base64url");
  db().prepare(`INSERT INTO dropship_links VALUES (?, ?)
    ON CONFLICT(shipment_id) DO UPDATE SET token_hash = excluded.token_hash`).run(shipmentId, hash(token));
  return "/dropshipping/orders/" + token;
}

export function revokeDropshipLink(shipmentId: string) {
  db().prepare("DELETE FROM dropship_links WHERE shipment_id = ?").run(shipmentId);
}

export function dropshipShipmentId(token: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const row = db().prepare("SELECT shipment_id FROM dropship_links WHERE token_hash = ?").get(hash(token));
  return typeof row?.shipment_id === "string" ? row.shipment_id : null;
}

export function listProof(shipmentId: string) {
  return db().prepare("SELECT id, mime, EXISTS(SELECT 1 FROM dropship_tracking_media WHERE media_id = id) AS published FROM dropship_proof WHERE shipment_id = ? ORDER BY rowid")
    .all(shipmentId) as { id: string; mime: string; published: number }[];
}

export function readProof(shipmentId: string, id: string) {
  return db().prepare("SELECT mime, bytes FROM dropship_proof WHERE shipment_id = ? AND id = ?")
    .get(shipmentId, id) as { mime: string; bytes: Uint8Array } | undefined;
}

export function removeProof(shipmentId: string, id: string) {
  db().prepare("DELETE FROM dropship_proof WHERE shipment_id = ? AND id = ?").run(shipmentId, id);
}

export function addProof(shipmentId: string, bytes: Buffer) {
  let mime: string;
  if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) mime = "image/jpeg";
  else if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) mime = "image/png";
  else if (bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP") mime = "image/webp";
  else if (bytes.subarray(4, 8).toString() === "ftyp") mime = "video/mp4";
  else return false;
  db();
  return withImmediate((connection) => {
    const count = connection.prepare("SELECT COUNT(*) AS total FROM dropship_proof WHERE shipment_id = ?").get(shipmentId);
    if (Number(count?.total) >= 8) return false;
    const id = randomUUID();
    connection.prepare("INSERT INTO dropship_proof VALUES (?, ?, ?, ?)").run(id, shipmentId, mime, bytes);
    connection.prepare("INSERT INTO dropship_tracking_media (media_id) VALUES (?)").run(id);
    return true;
  });
}

export function readTrackingMedia(id: string) {
  return db().prepare(`SELECT mime, bytes FROM dropship_proof
    JOIN dropship_tracking_media ON media_id = id WHERE id = ?
    AND (SELECT COUNT(*) FROM dropship_proof AS photo
      WHERE photo.shipment_id = dropship_proof.shipment_id AND photo.mime LIKE 'image/%') >= 2`).get(id) as
    { mime: string; bytes: Uint8Array } | undefined;
}
