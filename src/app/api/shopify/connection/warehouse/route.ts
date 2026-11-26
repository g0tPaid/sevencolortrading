import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { ShopifyOrderStore } from '@/lib/shopify/order-store';
import { reviewShopKey } from '@/lib/shopify/review-account';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

// Called only from the authenticated Shopify app server, never from a browser.
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_LINK_SECRET;
  const path = process.env.SHOPIFY_DB_PATH;
  if (!secret || secret.length < 32 || !path) return reply({ error: 'Service unavailable' }, 503);
  const expected = Buffer.from(`Bearer ${secret}`);
  const supplied = Buffer.from(request.headers.get('authorization') || '');
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return reply({ error: 'Unauthorized' }, 401);
  let data: { shop?: unknown; intent?: unknown; kind?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 4096) return reply({ error: 'Invalid request' }, 413);
    data = JSON.parse(raw);
  } catch { return reply({ error: 'Invalid request' }, 400); }
  if (!data || typeof data.shop !== 'string' || !/^[a-z0-9][a-z0-9-]{0,62}\.myshopify\.com$/.test(data.shop)) return reply({ error: 'Invalid shop' }, 400);
  if (data.intent !== 'status' && data.intent !== 'notice' && data.intent !== 'uninstall') return reply({ error: 'Invalid intent' }, 400);
  if (data.intent === 'notice' && data.kind !== 'FULFILLMENT_REQUEST' && data.kind !== 'CANCELLATION_REQUEST') return reply({ error: 'Invalid notification' }, 400);
  try {
    const live = new ShopifyOrderStore(path);
    try {
      if (data.intent === 'uninstall') live.uninstall(data.shop);
      if (live.isConnected(data.shop)) {
        if (data.intent === 'notice' && !live.recordWarehouseNotice(data.shop, data.kind as 'FULFILLMENT_REQUEST' | 'CANCELLATION_REQUEST')) return reply({ approved: false }, 403);
        return reply({ approved: true, demo: false });
      }
    } finally { live.close(); }
    const key = reviewShopKey(data.shop);
    if (key) {
      const sandbox = new ShopifyOrderStore(`${path}.review`);
      try {
        if (data.intent === 'uninstall') sandbox.uninstall(key);
        if (sandbox.isConnected(key)) return reply({ approved: true, demo: true });
      }
      finally { sandbox.close(); }
    }
    return reply({ approved: false, demo: false });
  } catch { return reply({ error: 'Service unavailable' }, 503); }
}
