import type { ActionFunctionArgs } from 'react-router';
import { createHmac, timingSafeEqual } from 'node:crypto';
import db from '../db.server';
import { warehouseSetupAllowed } from '../warehouse.server';

// Shopify sends only a notification kind. The real request details remain in
// Shopify; this durable signal does not accept, fulfill, or purchase anything.
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') return new Response(null, { status: 405 });
  const secret = process.env.SHOPIFY_API_SECRET;
  const signature = request.headers.get('x-shopify-hmac-sha256');
  if (!secret || !signature) return new Response(null, { status: 401 });
  const shop = request.headers.get('x-shopify-shop-domain') ?? '';
  if (!warehouseSetupAllowed(shop)) return new Response(null, { status: 403 });
  if (Number(request.headers.get('content-length') ?? 0) > 4096) return new Response(null, { status: 413 });
  const reader = request.body?.getReader();
  if (!reader) return new Response(null, { status: 400 });
  const chunks: Uint8Array[] = [];
  let length = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 4096) { await reader.cancel(); return new Response(null, { status: 413 }); }
    chunks.push(value);
  }
  const raw = Buffer.concat(chunks);
  const supplied = Buffer.from(signature, 'base64');
  const computed = createHmac('sha256', secret).update(raw).digest();
  if (supplied.length !== computed.length || !timingSafeEqual(supplied, computed)) return new Response(null, { status: 401 });
  try {
    const { kind } = JSON.parse(raw.toString('utf8')) as { kind?: string };
    if (kind !== 'FULFILLMENT_REQUEST' && kind !== 'CANCELLATION_REQUEST') return new Response(null, { status: 400 });
    const session = await db.session.findFirst({ where: { shop, isOnline: false }, select: { id: true } });
    if (!session) return new Response(null, { status: 403 });
    const receivedAt = new Date().toISOString();
    await db.$executeRaw`INSERT INTO WarehouseNotification (shop, kind, receivedAt) VALUES (${shop}, ${kind}, ${receivedAt}) ON CONFLICT(shop, kind) DO UPDATE SET receivedAt=excluded.receivedAt`;
    return new Response(null, { status: 200 });
  } catch { return new Response(null, { status: 503 }); }
}
