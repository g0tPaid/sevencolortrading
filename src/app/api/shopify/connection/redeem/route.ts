import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { ShopifyOrderStore } from '@/lib/shopify/order-store';
import { REVIEW_ACCOUNT, reviewIdentity } from '@/lib/shopify/review-account';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers });

// Only the Shopify app server may call this endpoint after its official SDK authenticates the shop.
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_LINK_SECRET;
  const db = process.env.SHOPIFY_DB_PATH;
  if (!secret || secret.length < 32 || !db) return reply({ error: 'Shopify connection disabled' }, 503);
  const expected = Buffer.from(`Bearer ${secret}`);
  const supplied = Buffer.from(request.headers.get('authorization') || '');
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return reply({ error: 'Unauthorized' }, 401);
  let body: { shop?: string; customerNumber?: string; code?: string };
  try { const raw = await request.text(); if (raw.length > 4096) throw Error(); body = JSON.parse(raw); }
  catch { return reply({ error: 'Invalid request' }, 400); }
  if (typeof body?.shop !== 'string' || typeof body?.customerNumber !== 'string' || typeof body?.code !== 'string') return reply({ error: 'Invalid request' }, 400);
  try {
    if (body.customerNumber.trim().toUpperCase() === REVIEW_ACCOUNT) {
      const identity = reviewIdentity(body.shop, body.code.trim(), process.env.SHOPIFY_REVIEW_PASSWORD_HASH);
      if (!identity) return reply({ error: 'Invalid review credentials' }, 400);
      // Reviewer connections exercise the real linking logic using only a separate sandbox database.
      const sandbox = new ShopifyOrderStore(`${db}.review`);
      try {
        const { code } = sandbox.issueConnectionCode(identity.shop, identity.merchantId, identity.displayName);
        const connected = sandbox.redeemConnectionCode(identity.shop, identity.merchantId, code);
        return connected ? reply({ connected: true, demo: true }) : reply({ error: 'Unable to connect review sandbox' }, 400);
      } finally { sandbox.close(); }
    }
    const store = new ShopifyOrderStore(db);
    try {
      const connected = store.redeemConnectionCode(body.shop, body.customerNumber.trim().toUpperCase(), body.code.trim());
      return connected ? reply({ connected: true }) : reply({ error: 'Invalid or expired connection code' }, 400);
    } finally { store.close(); }
  } catch { return reply({ error: 'Unable to connect store' }, 400); }
}

