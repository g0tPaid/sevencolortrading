import { ShopifyOrderStore } from '@/lib/shopify/order-store';
import { processShopifyWebhook, verifyShopifyWebhook } from '@/lib/shopify/webhook';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };
const MAX_BYTES = 2_000_000;

export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_API_SECRET;
  const file = process.env.SHOPIFY_DB_PATH;
  if (!secret || !file || process.env.SHOPIFY_WEBHOOKS_ENABLED !== '1') return Response.json({ ok:false },{status:503,headers});
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BYTES) return Response.json({ ok:false },{status:413,headers});
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ ok:false },{status:400,headers});
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const {done,value} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) { await reader.cancel(); return Response.json({ok:false},{status:413,headers}); }
    chunks.push(value);
  }
  const raw = Buffer.concat(chunks);
  if (!verifyShopifyWebhook(raw,request.headers.get('x-shopify-hmac-sha256'),secret)) return Response.json({ok:false},{status:401,headers});
  try {
    const store = new ShopifyOrderStore(file);
    try { const result = processShopifyWebhook(store,raw,request.headers,secret); return Response.json({ok:result.status===200},{status:result.status,headers}); }
    finally { store.close(); }
  } catch { return Response.json({ok:false},{status:503,headers}); }
}

