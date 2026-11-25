import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { ShopifyOrderStore } from '@/lib/shopify/order-store';

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
    const store = new ShopifyOrderStore(db);
    try {
      const connected = store.redeemConnectionCode(body.shop, body.customerNumber.trim().toUpperCase(), body.code.trim());
      return connected ? reply({ connected: true }) : reply({ error: 'Invalid or expired connection code' }, 400);
    } finally { store.close(); }
  } catch { return reply({ error: 'Unable to connect store' }, 400); }
}

