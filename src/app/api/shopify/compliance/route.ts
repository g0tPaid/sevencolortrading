import { timingSafeEqual } from 'node:crypto';
import { ShopifyOrderStore } from '@/lib/shopify/order-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const reply = (status: number) => new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_LINK_SECRET;
  const db = process.env.SHOPIFY_DB_PATH;
  if (!secret || secret.length < 32 || !db) return reply(503);
  const expected = Buffer.from(`Bearer ${secret}`);
  const supplied = Buffer.from(request.headers.get('authorization') || '');
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return reply(401);
  let data: { shop?: unknown; topic?: unknown; orderIds?: unknown; requestId?: unknown };
  let ids: string[];
  try {
    const raw = await request.text();
    if (raw.length > 500000) return reply(413);
    data = JSON.parse(raw);
    if (!data || typeof data.shop !== 'string' || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(data.shop)) return reply(400);
    if (!Array.isArray(data.orderIds) || data.orderIds.length > 10000) return reply(400);
    ids = data.orderIds.map(id => {
      if (typeof id === 'number' && !Number.isSafeInteger(id)) throw new Error('Invalid ID');
      const value = typeof id === 'string' || typeof id === 'number' ? String(id) : '';
      if (/^\d+$/.test(value)) return `gid://shopify/Order/${value}`;
      if (/^gid:\/\/shopify\/Order\/\d+$/.test(value)) return value;
      throw new Error('Invalid ID');
    });
  } catch { return reply(400); }
  try {
    const store = new ShopifyOrderStore(db);
    try {
      if (data.topic === 'shop/redact') store.redactShop(data.shop as string);
      else if (data.topic === 'customers/redact') store.redactOrders(data.shop as string, ids);
      else if (data.topic === 'customers/data_request') {
        const id = String(data.requestId ?? '');
        if (!/^\d+$/.test(id)) return reply(400);
        store.queueDataRequest(data.shop as string, id, ids);
      } else return reply(400);
      return reply(200);
    } finally { store.close(); }
  } catch { return reply(503); }
}
