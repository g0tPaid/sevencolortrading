type Intent = 'status' | 'notice' | 'uninstall';
export type WarehouseNotice = 'FULFILLMENT_REQUEST' | 'CANCELLATION_REQUEST';

export async function warehouseConnection(shop: string, intent: Intent = 'status', kind?: WarehouseNotice, fetcher = fetch) {
  if (!/^[a-z0-9][a-z0-9-]{0,62}\.myshopify\.com$/.test(shop)) throw new Error('Invalid Shopify shop');
  const endpoint = process.env.SC_CONNECTION_URL;
  const secret = process.env.SHOPIFY_LINK_SECRET;
  if (!endpoint || !secret || secret.length < 32) throw new Error('Connection service unavailable');
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || url.username || url.password || !url.pathname.endsWith('/connection/redeem')) throw new Error('Connection service unavailable');
  url.pathname = url.pathname.replace(/\/redeem$/, '/warehouse');
  url.search = '';
  url.hash = '';
  const response = await fetcher(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(5000), headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` }, body: JSON.stringify({ shop, intent, ...(kind ? { kind } : {}) }) });
  if (!response.ok) throw new Error('Connection service unavailable');
  const result = await response.json() as { approved?: unknown; demo?: unknown };
  return { approved: result.approved === true, demo: result.demo === true };
}
