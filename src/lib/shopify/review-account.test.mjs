import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { reviewIdentity } from './review-account.ts';
import { ShopifyOrderStore } from './order-store.ts';

const password = 'a'.repeat(32);
const digest = createHash('sha256').update(password).digest('hex');

test('rejects missing or incorrect credentials and invalid shop domain', () => {
  assert.equal(reviewIdentity('test.myshopify.com', password, undefined), null);
  assert.equal(reviewIdentity('test.myshopify.com', 'b'.repeat(32), digest), null);
  assert.equal(reviewIdentity('example.com', password, digest), null);
});

test('unique synthetic test accounts use the real connection code flow in isolation', () => {
  const a = reviewIdentity('merchant-a.myshopify.com', password, digest);
  const b = reviewIdentity('merchant-b.myshopify.com', password, digest);
  assert.notEqual(a.merchantId, b.merchantId);
  assert.notEqual(a.shop, 'merchant-a.myshopify.com');
  const demo = new ShopifyOrderStore(':memory:');
  const production = new ShopifyOrderStore(':memory:');
  try {
    production.linkStore('merchant-a.myshopify.com', 'REAL-1000', 'Actual merchant');
    const { code } = demo.issueConnectionCode(a.shop, a.merchantId, a.displayName);
    assert.equal(demo.redeemConnectionCode(b.shop, b.merchantId, code), false);
    assert.equal(demo.redeemConnectionCode(a.shop, a.merchantId, code), true);
    assert.equal(demo.redeemConnectionCode(a.shop, a.merchantId, code), false);
    assert.throws(() => production.linkStore('merchant-a.myshopify.com', a.merchantId, a.displayName));
  } finally { demo.close(); production.close(); }
});

