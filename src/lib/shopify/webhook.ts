import { createHmac, timingSafeEqual } from 'node:crypto';
import type { OrderInput, OrderTopic, ShopifyOrderStore } from './order-store';

export function verifyShopifyWebhook(raw: Buffer, signature: string | null, secret: string): boolean {
  if (!secret || !signature || !/^[A-Za-z0-9+/]{43}=$/.test(signature)) return false;
  const provided = Buffer.from(signature, 'base64');
  const expected = createHmac('sha256', secret).update(raw).digest();
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}
const orderTopics: OrderTopic[] = ['orders/create', 'orders/updated', 'orders/cancelled'];

type OrderPayload = {
  admin_graphql_api_id?: string; name?: string; financial_status?: string; currency?: string; updated_at?: string;
  line_items?: { admin_graphql_api_id?: string; title?: string; variant_title?: string; sku?: string; quantity?: number }[];
};

export function normalizeOrder(payload: OrderPayload): OrderInput {
  if (!payload || !/^gid:\/\/shopify\/Order\/\d+$/.test(payload.admin_graphql_api_id ?? '') || !Array.isArray(payload.line_items)) throw new Error('Invalid Shopify order payload');
  return { id: payload.admin_graphql_api_id!, number: payload.name ?? '', retailPayment: payload.financial_status ?? 'unknown', currency: payload.currency ?? '', updatedAt: payload.updated_at ?? '', items: payload.line_items.map(item => ({ id: item.admin_graphql_api_id ?? '', title: item.title ?? '', variant: item.variant_title, sku: item.sku, quantity: item.quantity ?? -1 })) };
}

export function processShopifyWebhook(store: ShopifyOrderStore, raw: Buffer, headers: Headers, secret: string) {
  if (!verifyShopifyWebhook(raw,headers.get('x-shopify-hmac-sha256'),secret)) return { status: 401, result: 'unauthenticated' };
  const shop = headers.get('x-shopify-shop-domain') ?? '';
  const topic = headers.get('x-shopify-topic') ?? '';
  const eventId = headers.get('x-shopify-event-id') ?? '';
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop) || !eventId) return { status: 400, result: 'invalid_headers' };
  if (topic === 'app/uninstalled') {
    store.uninstall(shop);
    return { status: 200, result: 'uninstalled' };
  }
  if (!orderTopics.includes(topic as OrderTopic)) return { status: 400, result: 'unsupported_topic' };
  let order: OrderInput;
  try { order = normalizeOrder(JSON.parse(raw.toString('utf8'))); }
  catch { return { status: 400, result: 'invalid_payload' }; }
  try { return { status: 200, result: store.ingest(shop,eventId,topic as OrderTopic,order) }; }
  catch { return { status: 503, result: 'processing_failed' }; }
}

