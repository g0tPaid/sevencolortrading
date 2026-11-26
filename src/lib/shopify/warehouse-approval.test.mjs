import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ShopifyOrderStore } from './order-store.ts';
import { reviewShopKey } from './review-account.ts';

const shop = 'approved-shop.myshopify.com';
test('only staff-approved and redeemed shops may activate warehouse', () => {
  const store = new ShopifyOrderStore(':memory:');
  try {
    assert.equal(store.isConnected(shop), false);
    assert.equal(store.recordWarehouseNotice(shop,'FULFILLMENT_REQUEST'), false);
    const {code} = store.issueConnectionCode(shop,'A-1234','Example');
    assert.equal(store.isConnected(shop), false);
    assert.equal(store.redeemConnectionCode(shop,'A-1234',code),true);
    assert.equal(store.isConnected(shop),true);
    assert.equal(store.isConnected('other-shop.myshopify.com'),false);
    assert.equal(store.recordWarehouseNotice(shop,'FULFILLMENT_REQUEST'),true);
    assert.equal(store.recordWarehouseNotice(shop,'FULFILLMENT_REQUEST'),true);
    assert.equal(store.staffWarehouseNotices().length,1);
    store.uninstall(shop);
    assert.equal(store.isConnected(shop),false);
    assert.equal(store.staffWarehouseNotices().length,0);
  } finally { store.close(); }
});
test('warehouse alerts are removed on shop redaction and retention expiry', () => {
  const store = new ShopifyOrderStore(':memory:');
  try {
    store.linkStore(shop,'A-1234','Example');
    store.recordWarehouseNotice(shop,'CANCELLATION_REQUEST');
    store.purgeExpiredRecords(Date.now()+31*86400000);
    assert.equal(store.staffWarehouseNotices().length,0);
    store.recordWarehouseNotice(shop,'FULFILLMENT_REQUEST');
    store.redactShop(shop);
    assert.equal(store.staffWarehouseNotices().length,0);
  } finally { store.close(); }
});
test('sandbox keys are separate from any real store identity', () => {
  const key = reviewShopKey(shop);
  assert.ok(key?.startsWith('review-'));
  assert.notEqual(key,shop);
  assert.notEqual(key,reviewShopKey('other-shop.myshopify.com'));
  assert.equal(reviewShopKey('not-a-shop.com'),null);
});
