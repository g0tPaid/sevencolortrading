import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/admin-auth';
import { ShopifyOrderStore } from '@/lib/shopify/order-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function ShopifyOrdersPage() {
  const session = await getSessionFromCookies((await cookies()).toString());
  if (!session) redirect('/login');
  const path = process.env.SHOPIFY_DB_PATH;
  if (!path) return <section className="rounded-3xl border border-line bg-paper-elevated p-6"><h1 className="text-2xl font-semibold">Shopify orders</h1><p className="mt-2 text-sm text-muted">Shopify is not connected. Configure a private database and an approved development app before importing orders.</p></section>;
  const store = new ShopifyOrderStore(path);
  const orders = (() => { try { return store.staffOrders(); } finally { store.close(); } })();
  return <section className="space-y-5"><div><h1 className="font-display text-3xl font-semibold text-ink">Shopify orders</h1><p className="mt-2 text-sm text-muted">Imported merchant orders. Shopify retail payment does not authorize purchasing.</p></div><div className="overflow-x-auto rounded-2xl border border-line bg-paper-elevated"><table className="w-full text-left text-sm"><thead><tr>{['Merchant','Store','Order','Retail payment','Workflow','Last update'].map(h=><th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>{orders.map(o=><tr key={String(o.shop)+':'+String(o.shopify_id)} className="border-t border-line">{[o.display_name,o.shop,o.number,o.retail_payment,o.stage,o.updated_at].map((v,i)=><td key={i} className="p-3">{String(v??'')}</td>)}</tr>)}</tbody></table>{orders.length===0&&<p className="p-5 text-sm text-muted">No imported Shopify orders.</p>}</div></section>;
}

