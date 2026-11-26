import { createHash, timingSafeEqual } from 'node:crypto';

export const REVIEW_ACCOUNT = 'REVIEW-0001';

export function reviewShopKey(shop: string) {
  if (!/^[a-z0-9][a-z0-9-]{0,62}\.myshopify\.com$/.test(shop)) return null;
  return `review-${createHash('sha256').update(shop).digest('hex').slice(0, 32)}.myshopify.com`;
}

export function reviewIdentity(shop: string, password: string, digest: string | undefined) {
  if (!/^[a-z0-9][a-z0-9-]{0,62}\.myshopify\.com$/.test(shop) || !/^[A-Za-z0-9_-]{32}$/.test(password) || !digest || !/^[a-f0-9]{64}$/.test(digest)) return null;
  const actual = createHash('sha256').update(password).digest();
  if (!timingSafeEqual(actual, Buffer.from(digest, 'hex'))) return null;
  // No real customer reference or Shopify domain is stored in the demo database.
  const key = createHash('sha256').update(shop).digest('hex').slice(0, 32);
  return { shop: `review-${key}.myshopify.com`, merchantId: `review-${key}`, displayName: 'Shopify review sandbox' };
}
