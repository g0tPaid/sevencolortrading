import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { requireAdminSession } from '@/lib/admin-auth';
import { siteUrl } from '@/lib/seo';
import { ShopifyOrderStore } from '@/lib/shopify/order-store';
import { getStaffPartnerLabels } from '@/lib/tracking/soloflow-staff-partners';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers });

export async function POST(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;
  const origin = request.headers.get('origin');
  if (!origin || (origin !== siteUrl && origin !== new URL(request.url).origin)) return reply({ error: 'Invalid origin' }, 403);
  if (!process.env.SHOPIFY_DB_PATH) return reply({ error: 'Shopify connection is disabled' }, 503);
  let body: { customerNumber?: string; shop?: string };
  try { const raw = await request.text(); if (raw.length > 4096) throw Error(); body = JSON.parse(raw); }
  catch { return reply({ error: 'Invalid request' }, 400); }
  const customerNumber = typeof body?.customerNumber === 'string' ? body.customerNumber.trim().toUpperCase() : '';
  const shop = typeof body?.shop === 'string' ? body.shop.trim().toLowerCase() : '';
  const applicationId = /^DS-[0-9A-F]{8}$/.test(customerNumber);
  const partnerId = /^(?:[A-Z0-9]{1,12}-)?[0-9]{4}$/.test(customerNumber);
  if (!applicationId && !partnerId) return reply({ error: 'Enter your SoloFlow dropshipper ID (e.g. A-3848) or Sourcing Center application ID.' }, 400);
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)) return reply({ error: 'Enter the exact Shopify domain ending in .myshopify.com.' }, 400);
  try {
    const customer = partnerId
      ? (() => { const name = getStaffPartnerLabels()(customerNumber); return name ? { id: customerNumber, name } : undefined; })()
      : (await readFile(path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH || '/tmp', 'dropshipping-applications.jsonl'), 'utf8')).split('\n').filter(Boolean).map(line => JSON.parse(line) as { id: string; name: string }).find(row => row.id === customerNumber);
    if (!customer) return reply({ error: partnerId ? 'SoloFlow dropshipper not found in the synced partner list. Open SoloFlow and sync the partners, then retry.' : 'Customer reference not found' }, 404);
    // Issuance by authenticated staff is the approval step. Verify the recipient before sharing the code.
    const store = new ShopifyOrderStore(process.env.SHOPIFY_DB_PATH);
    try { return reply(store.issueConnectionCode(shop, customer.id, customer.name)); }
    finally { store.close(); }
  } catch (error) {
    if (error instanceof Error && error.message === 'Store already linked') return reply({ error: 'Shop already linked to a different customer' }, 409);
    return reply({ error: 'Unable to issue connection code' }, 503);
  }
}
