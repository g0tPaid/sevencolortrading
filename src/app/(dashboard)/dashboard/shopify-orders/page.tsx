import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/admin-auth';
import { ShopifyOrderStore } from '@/lib/shopify/order-store';
import { ShopifyConnectionCode } from '@/components/dashboard/shopify-connection-code';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function completePrivacyRequest(form: FormData) {
  'use server';
  const session = await getSessionFromCookies((await cookies()).toString());
  if (!session) redirect('/login');
  const path = process.env.SHOPIFY_DB_PATH;
  if (!path) return;
  const shop = String(form.get('shop') ?? '');
  const requestId = String(form.get('requestId') ?? '');
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop) || !/^\d+$/.test(requestId)) return;
  if (form.get('confirmed') !== 'on') return;
  const store = new ShopifyOrderStore(path);
  try { store.completeDataRequest(shop, requestId); }
  finally { store.close(); }
  revalidatePath('/dashboard/shopify-orders');
}

export default async function ShopifyOrdersPage() {
  const session = await getSessionFromCookies((await cookies()).toString());
  if (!session) redirect('/login');
  const path = process.env.SHOPIFY_DB_PATH;
  if (!path) return <section className="rounded-3xl border border-line bg-paper-elevated p-6"><h1 className="text-2xl font-semibold">Shopify orders</h1><p className="mt-2 text-sm text-muted">Shopify is not connected. Configure a private database and an approved development app before importing orders.</p></section>;
  const store = new ShopifyOrderStore(path);
  const { orders, privacyRequests } = (() => { try { return { orders: store.staffOrders(), privacyRequests: store.staffPrivacyRequests() }; } finally { store.close(); } })();
  return <section className="space-y-5"><div><h1 className="font-display text-3xl font-semibold text-ink">Shopify orders</h1><p className="mt-2 text-sm text-muted">Imported merchant orders. Shopify retail payment does not authorize purchasing.</p></div><ShopifyConnectionCode /><div className="overflow-x-auto rounded-2xl border border-line bg-paper-elevated"><table className="w-full text-left text-sm"><thead><tr>{['Merchant','Store','Order','Retail payment','Workflow','Last update'].map(h=><th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>{orders.map(o=><tr key={String(o.shop)+':'+String(o.shopify_id)} className="border-t border-line">{[o.display_name,o.shop,o.number,o.retail_payment,o.stage,o.updated_at].map((v,i)=><td key={i} className="p-3">{String(v??'')}</td>)}</tr>)}</tbody></table>{orders.length===0&&<p className="p-5 text-sm text-muted">No imported Shopify orders.</p>}</div><div className="overflow-x-auto rounded-2xl border border-line bg-paper-elevated p-5"><h2 className="font-semibold text-ink">Privacy data requests</h2><p className="mt-1 text-sm text-muted">Staff must review these requests and provide the appropriate data to the verified merchant through a secure channel. Once completed, confirm and remove the request references.</p><table className="mt-3 w-full text-left text-sm"><thead><tr>{['Store','Request ID','Order references','Received','Completion'].map(h=><th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>{privacyRequests.map(r=><tr key={String(r.shop)+':'+String(r.request_id)} className="border-t border-line">{[r.shop,r.request_id,r.order_ids,r.received_at].map((v,i)=><td key={i} className="p-3 break-all">{String(v??'')}</td>)}<td className="p-3"><form action={completePrivacyRequest} className="space-y-2"><input type="hidden" name="shop" value={String(r.shop)}/><input type="hidden" name="requestId" value={String(r.request_id)}/><label className="flex items-center gap-2"><input type="checkbox" name="confirmed" required/> Request securely fulfilled</label><button type="submit" className="rounded-lg border border-line px-3 py-1">Complete and erase references</button></form></td></tr>)}</tbody></table>{privacyRequests.length===0&&<p className="mt-3 text-sm text-muted">No privacy requests.</p>}</div></section>;
}
