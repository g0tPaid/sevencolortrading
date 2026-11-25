import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, isAbsolute } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';

// Keep Shopify records separate from the legacy shipment database and marketing JSON files.
// Production remains disabled until the storage path and Shopify app are provisioned.
export const schema = `
CREATE TABLE IF NOT EXISTS sc_merchants (
  id TEXT PRIMARY KEY, display_name TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sc_stores (
  shop TEXT PRIMARY KEY, merchant_id TEXT NOT NULL REFERENCES sc_merchants(id),
  installed_at TEXT NOT NULL, uninstalled_at TEXT
);
CREATE TABLE IF NOT EXISTS sc_connection_codes (
  digest TEXT PRIMARY KEY, shop TEXT NOT NULL, merchant_id TEXT NOT NULL,
  display_name TEXT NOT NULL, expires_at INTEGER NOT NULL, redeemed_at INTEGER
);
CREATE INDEX IF NOT EXISTS sc_connection_codes_shop ON sc_connection_codes(shop, merchant_id);
CREATE TABLE IF NOT EXISTS sc_orders (
  shop TEXT NOT NULL REFERENCES sc_stores(shop), shopify_id TEXT NOT NULL,
  number TEXT NOT NULL, retail_payment TEXT NOT NULL, currency TEXT NOT NULL,
  stage TEXT NOT NULL CHECK(stage IN ('imported','awaiting_quotation','cancelled','refund_pending')),
  source_updated_at TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  PRIMARY KEY (shop, shopify_id)
);
CREATE TABLE IF NOT EXISTS sc_order_items (
  shop TEXT NOT NULL, order_id TEXT NOT NULL, line_id TEXT NOT NULL,
  title TEXT NOT NULL, variant TEXT, sku TEXT, quantity INTEGER NOT NULL CHECK(quantity >= 0),
  PRIMARY KEY (shop, order_id, line_id),
  FOREIGN KEY (shop, order_id) REFERENCES sc_orders(shop, shopify_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS sc_webhook_events (
  shop TEXT NOT NULL REFERENCES sc_stores(shop), event_id TEXT NOT NULL,
  topic TEXT NOT NULL, received_at TEXT NOT NULL, PRIMARY KEY (shop,event_id)
);
CREATE TABLE IF NOT EXISTS sc_privacy_requests (
  shop TEXT NOT NULL, request_id TEXT NOT NULL, order_ids TEXT NOT NULL,
  received_at TEXT NOT NULL, PRIMARY KEY (shop,request_id)
);
CREATE TABLE IF NOT EXISTS sc_order_audit (
  id INTEGER PRIMARY KEY, shop TEXT NOT NULL, order_id TEXT NOT NULL,
  from_stage TEXT, to_stage TEXT NOT NULL, actor TEXT NOT NULL, changed_at TEXT NOT NULL,
  FOREIGN KEY (shop, order_id) REFERENCES sc_orders(shop, shopify_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS sc_orders_stage ON sc_orders(stage, updated_at);
CREATE INDEX IF NOT EXISTS sc_stores_merchant ON sc_stores(merchant_id);
`;

export type OrderInput = {
  id: string; number: string; retailPayment: string; currency: string; updatedAt: string;
  items: { id: string; title: string; variant?: string; sku?: string; quantity: number }[];
};
export type OrderTopic = 'orders/create' | 'orders/updated' | 'orders/cancelled' | 'refunds/create';

function validShop(shop: string) {
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)) throw new Error('Invalid Shopify store');
  return shop;
}
function required(value: string, max = 250) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error('Invalid order field');
  return value.trim();
}

export class ShopifyOrderStore {
  private db: DatabaseSync;
  constructor(file: string) {
    if (file !== ':memory:') {
      if (!isAbsolute(file)) throw new Error('SHOPIFY_DB_PATH must be absolute');
      mkdirSync(dirname(file), { recursive: true });
    }
    this.db = new DatabaseSync(file);
    this.db.exec('PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
    this.db.exec(schema);
  }
  close() { this.db.close(); }
  private transaction<T>(fn: () => T): T {
    this.db.exec('BEGIN IMMEDIATE');
    try { const value = fn(); this.db.exec('COMMIT'); return value; }
    catch (e) { this.db.exec('ROLLBACK'); throw e; }
  }
  // Invoke only after authenticated Shopify installation and explicit staff-approved linking.
  private linkStoreInTransaction(shop: string, merchantId: string, name: string) {
      const existing = this.db.prepare('SELECT merchant_id FROM sc_stores WHERE shop = ?').get(shop);
      if (existing && existing.merchant_id !== merchantId) throw new Error('Store already linked');
      const now = new Date().toISOString();
      this.db.prepare('INSERT INTO sc_merchants VALUES (?, ?, ?) ON CONFLICT(id) DO NOTHING').run(merchantId,name,now);
      this.db.prepare('INSERT INTO sc_stores VALUES (?, ?, ?, NULL) ON CONFLICT(shop) DO UPDATE SET uninstalled_at=NULL').run(shop,merchantId,now);
  }
  linkStore(shop: string, merchantId: string, name: string) {
    validShop(shop); required(merchantId); required(name);
    return this.transaction(() => this.linkStoreInTransaction(shop, merchantId, name));
  }
  // Staff must verify the customer number against an approved application before issuing a code.
  // The code is random, stored only as a digest, tied to the shop and valid for 15 minutes.
  issueConnectionCode(shop: string, merchantId: string, name: string) {
    validShop(shop); required(merchantId); required(name);
    const code = randomBytes(24).toString('base64url');
    const digest = createHash('sha256').update(code).digest('hex');
    const expiresAt = Date.now() + 15 * 60 * 1000;
    this.transaction(() => {
      const existing = this.db.prepare('SELECT merchant_id FROM sc_stores WHERE shop=?').get(shop);
      if (existing && existing.merchant_id !== merchantId) throw new Error('Store already linked');
      this.db.prepare('DELETE FROM sc_connection_codes WHERE shop=? AND merchant_id=?').run(shop, merchantId);
      this.db.prepare('INSERT INTO sc_connection_codes VALUES (?,?,?,?,?,NULL)').run(digest, shop, merchantId, name, expiresAt);
    });
    return { code, expiresAt };
  }
  // shop must be obtained from a verified Shopify admin session, not a browser field.
  redeemConnectionCode(shop: string, merchantId: string, code: string) {
    validShop(shop); required(merchantId);
    if (!/^[A-Za-z0-9_-]{32}$/.test(code)) return false;
    const digest = createHash('sha256').update(code).digest('hex');
    return this.transaction(() => {
      const entry = this.db.prepare('SELECT display_name FROM sc_connection_codes WHERE digest=? AND shop=? AND merchant_id=? AND redeemed_at IS NULL AND expires_at>?').get(digest, shop, merchantId, Date.now());
      if (!entry) return false;
      this.linkStoreInTransaction(shop, merchantId, String(entry.display_name));
      this.db.prepare('UPDATE sc_connection_codes SET redeemed_at=? WHERE digest=?').run(Date.now(), digest);
      return true;
    });
  }
  // Caller must authenticate the delivery via the official Shopify adapter before invoking this method.
  ingest(shop: string, eventId: string, topic: OrderTopic, order: OrderInput) {
    validShop(shop); required(eventId); required(order.id); required(order.number);
    if (!['orders/create','orders/updated','orders/cancelled','refunds/create'].includes(topic)) throw new Error('Unsupported topic');
    if (!Number.isFinite(Date.parse(order.updatedAt))) throw new Error('Invalid update time');
    if (!/^[A-Z]{3}$/.test(order.currency)) throw new Error('Invalid currency');
    required(order.retailPayment);
    if (!Array.isArray(order.items) || order.items.length > 1000) throw new Error('Invalid items');
    const updatedAt = new Date(order.updatedAt).toISOString();
    return this.transaction(() => {
      const store = this.db.prepare('SELECT merchant_id FROM sc_stores WHERE shop=? AND uninstalled_at IS NULL').get(shop);
      if (!store) throw new Error('Store not connected');
      const now = new Date().toISOString();
      const event = this.db.prepare('INSERT INTO sc_webhook_events VALUES (?,?,?,?) ON CONFLICT DO NOTHING').run(shop,eventId,topic,now);
      if (!Number(event.changes)) return 'duplicate' as const;
      const old = this.db.prepare('SELECT stage, source_updated_at FROM sc_orders WHERE shop=? AND shopify_id=?').get(shop,order.id);
      if (old && String(old.source_updated_at) > updatedAt && !['orders/cancelled','refunds/create'].includes(topic)) return 'stale' as const;
      const previous = old ? String(old.stage) : null;
      const stage = previous === 'cancelled' || topic === 'orders/cancelled' ? 'cancelled' : previous === 'refund_pending' || topic === 'refunds/create' ? 'refund_pending' : previous ?? 'imported';
      // Cancellation/refund notifications may arrive late; update the workflow only,
      // without replacing the latest known order snapshot with older data.
      if (old && String(old.source_updated_at) > updatedAt) {
        if (stage !== previous) {
          this.db.prepare('UPDATE sc_orders SET stage=?,updated_at=? WHERE shop=? AND shopify_id=?').run(stage,now,shop,order.id);
          this.db.prepare('INSERT INTO sc_order_audit(shop,order_id,from_stage,to_stage,actor,changed_at) VALUES (?,?,?,?,?,?)').run(shop,order.id,previous,stage,'shopify:'+eventId,now);
        }
        return 'processed' as const;
      }
      this.db.prepare(`INSERT INTO sc_orders VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(shop,shopify_id) DO UPDATE SET
        number=excluded.number, retail_payment=excluded.retail_payment, currency=excluded.currency,
        stage=excluded.stage, source_updated_at=excluded.source_updated_at, updated_at=excluded.updated_at`)
        .run(shop,order.id,order.number,order.retailPayment,order.currency,stage,updatedAt,now,now);
      this.db.prepare('DELETE FROM sc_order_items WHERE shop=? AND order_id=?').run(shop,order.id);
      for (const item of order.items) {
        required(item.id); required(item.title,500);
        if (!Number.isSafeInteger(item.quantity) || item.quantity < 0) throw new Error('Invalid item quantity');
        this.db.prepare('INSERT INTO sc_order_items VALUES (?,?,?,?,?,?,?)').run(shop,order.id,item.id,item.title,item.variant??null,item.sku??null,item.quantity);
      }
      if (stage !== previous) this.db.prepare('INSERT INTO sc_order_audit(shop,order_id,from_stage,to_stage,actor,changed_at) VALUES (?,?,?,?,?,?)').run(shop,order.id,previous,stage,'shopify:'+eventId,now);
      return 'processed' as const;
    });
  }
  // Merchant identifier must come from authenticated account linkage, never from client-supplied shop data.
  merchantOrders(merchantId: string) {
    return this.db.prepare('SELECT o.* FROM sc_orders o JOIN sc_stores s ON s.shop=o.shop WHERE s.merchant_id=? AND s.uninstalled_at IS NULL ORDER BY o.updated_at DESC LIMIT 200').all(merchantId);
  }
  staffOrders() {
    return this.db.prepare('SELECT o.*, m.display_name FROM sc_orders o JOIN sc_stores s ON s.shop=o.shop JOIN sc_merchants m ON m.id=s.merchant_id ORDER BY o.updated_at DESC LIMIT 200').all();
  }
  uninstall(shop: string) {
    validShop(shop);
    this.db.prepare('UPDATE sc_stores SET uninstalled_at=? WHERE shop=?').run(new Date().toISOString(),shop);
  }
  // This operation is called only by the authenticated compliance pipeline.
  // Orders and their dependent items/audit rows are scoped to the verified shop.
  redactOrders(shop: string, orderIds: string[]) {
    validShop(shop);
    if (!Array.isArray(orderIds) || orderIds.length > 10000 || orderIds.some(id => !/^gid:\/\/shopify\/Order\/\d+$/.test(id))) throw new Error('Invalid order identifiers');
    return this.transaction(() => {
      const remove = this.db.prepare('DELETE FROM sc_orders WHERE shop=? AND shopify_id=?');
      for (const id of new Set(orderIds)) remove.run(shop,id);
      const redacted = new Set(orderIds);
      const pending = this.db.prepare('SELECT request_id, order_ids FROM sc_privacy_requests WHERE shop=?').all(shop);
      const update = this.db.prepare('UPDATE sc_privacy_requests SET order_ids=? WHERE shop=? AND request_id=?');
      for (const row of pending) update.run(JSON.stringify((JSON.parse(String(row.order_ids)) as string[]).filter(id => !redacted.has(id))), shop, String(row.request_id));
    });
  }
  redactShop(shop: string) {
    validShop(shop);
    return this.transaction(() => {
      const store = this.db.prepare('SELECT merchant_id FROM sc_stores WHERE shop=?').get(shop);
      this.db.prepare('DELETE FROM sc_connection_codes WHERE shop=?').run(shop);
      this.db.prepare('DELETE FROM sc_orders WHERE shop=?').run(shop);
      this.db.prepare('DELETE FROM sc_webhook_events WHERE shop=?').run(shop);
      this.db.prepare('DELETE FROM sc_privacy_requests WHERE shop=?').run(shop);
      this.db.prepare('DELETE FROM sc_stores WHERE shop=?').run(shop);
      if (store) this.db.prepare('DELETE FROM sc_merchants WHERE id=? AND NOT EXISTS (SELECT 1 FROM sc_stores WHERE merchant_id=?) AND NOT EXISTS (SELECT 1 FROM sc_connection_codes WHERE merchant_id=?)').run(String(store.merchant_id),String(store.merchant_id),String(store.merchant_id));
    });
  }
  queueDataRequest(shop: string, requestId: string, orderIds: string[]) {
    validShop(shop); required(requestId, 100);
    if (!Array.isArray(orderIds) || orderIds.length > 10000 || orderIds.some(id => !/^gid:\/\/shopify\/Order\/\d+$/.test(id))) throw new Error('Invalid order identifiers');
    this.db.prepare('INSERT INTO sc_privacy_requests VALUES (?,?,?,?) ON CONFLICT DO NOTHING').run(shop, requestId, JSON.stringify([...new Set(orderIds)]), new Date().toISOString());
  }
  staffPrivacyRequests() {
    return this.db.prepare('SELECT * FROM sc_privacy_requests ORDER BY received_at ASC LIMIT 200').all();
  }
}
