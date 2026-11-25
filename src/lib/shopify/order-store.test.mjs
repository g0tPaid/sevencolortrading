import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ShopifyOrderStore } from './order-store.ts';

const order = { id: 'gid://shopify/Order/1', number: '#1001', retailPayment: 'PAID', currency: 'USD', updatedAt: '2026-11-25T00:00:00Z', items: [{ id: 'line1', title: 'Mug', quantity: 2 }] };
const a = 'store-a.myshopify.com', b = 'store-b.myshopify.com';

test('imports safely and deduplicates delivery IDs', () => {
  const s = new ShopifyOrderStore(':memory:');
  try {
    s.linkStore(a, 'merchant-a', 'A');
    assert.equal(s.ingest(a, 'event-1', 'orders/create', order), 'processed');
    assert.equal(s.ingest(a, 'event-1', 'orders/create', order), 'duplicate');
    const rows = s.merchantOrders('merchant-a');
    assert.equal(rows.length, 1);
    assert.equal(rows[0].retail_payment, 'PAID');
    assert.equal(rows[0].stage, 'imported'); // retail payment does not authorize purchasing
  } finally { s.close(); }
});
test('tenant isolation and multi-store linkage', () => {
  const s = new ShopifyOrderStore(':memory:');
  try {
    s.linkStore(a, 'merchant-a', 'A'); s.linkStore(b, 'merchant-b', 'B');
    s.linkStore('store-c.myshopify.com', 'merchant-a', 'A');
    s.ingest(a, 'event-1', 'orders/create', order);
    s.ingest(b, 'event-1', 'orders/create', { ...order, number: '#B' });
    s.ingest('store-c.myshopify.com', 'event-1', 'orders/create', order);
    assert.equal(s.merchantOrders('merchant-a').length, 2);
    assert.equal(s.merchantOrders('merchant-b')[0].number, '#B');
    assert.throws(() => s.linkStore(a, 'merchant-b', 'B'), /already linked/);
    assert.throws(() => s.ingest('unknown.myshopify.com','e','orders/create',order), /not connected/);
  } finally { s.close(); }
});
test('updates, stale events, cancellation and uninstall', () => {
  const s = new ShopifyOrderStore(':memory:');
  try {
    s.linkStore(a, 'merchant-a', 'A');
    s.ingest(a, '1', 'orders/create', order);
    const newer = { ...order, number: '#1002', updatedAt: '2026-11-25T01:00:00Z' };
    s.ingest(a,'2','orders/updated',newer);
    assert.equal(s.ingest(a,'3','orders/updated',order),'stale');
    assert.equal(s.merchantOrders('merchant-a')[0].number,'#1002');
    s.ingest(a,'4','orders/cancelled',order);
    assert.equal(s.merchantOrders('merchant-a')[0].number,'#1002');
    s.ingest(a,'5','orders/updated',{...newer,updatedAt:'2026-11-25T02:00:00Z'});
    assert.equal(s.merchantOrders('merchant-a')[0].stage,'cancelled');
    s.uninstall(a);
    assert.equal(s.merchantOrders('merchant-a').length,0);
    assert.throws(() => s.ingest(a,'6','orders/create',order),/not connected/);
  } finally { s.close(); }
});
test('invalid item rolls back both order and event, permitting a retry', () => {
  const s = new ShopifyOrderStore(':memory:');
  try {
    s.linkStore(a,'merchant-a','A');
    assert.throws(() => s.ingest(a,'1','orders/create',{...order,items:[{id:'1',title:'Mug',quantity:-1}]}));
    assert.equal(s.staffOrders().length,0);
    assert.equal(s.ingest(a,'1','orders/create',order),'processed');
    s.ingest(a,'2','refunds/create',order);
    assert.equal(s.staffOrders()[0].stage,'refund_pending');
  } finally { s.close(); }
});

test('staff-issued connection code is shop-bound, customer-bound, and single-use', () => {
  const s = new ShopifyOrderStore(':memory:');
  try {
    const { code } = s.issueConnectionCode(a, 'DS-12345678', 'Customer A');
    assert.equal(s.redeemConnectionCode(b, 'DS-12345678', code), false);
    assert.equal(s.redeemConnectionCode(a, 'DS-87654321', code), false);
    assert.equal(s.redeemConnectionCode(a, 'DS-12345678', code), true);
    assert.equal(s.redeemConnectionCode(a, 'DS-12345678', code), false);
    s.ingest(a, 'event', 'orders/create', order);
    assert.equal(s.merchantOrders('DS-12345678').length, 1);
    assert.throws(() => s.issueConnectionCode(a, 'DS-87654321', 'Customer B'), /already linked/);
  } finally { s.close(); }
});

test('generating a new code invalidates the previous code', () => {
  const s = new ShopifyOrderStore(':memory:');
  try {
    const old = s.issueConnectionCode(a, 'DS-12345678', 'Customer A');
    const fresh = s.issueConnectionCode(a, 'DS-12345678', 'Customer A');
    assert.equal(s.redeemConnectionCode(a, 'DS-12345678', old.code), false);
    assert.equal(s.redeemConnectionCode(a, 'DS-12345678', fresh.code), true);
  } finally { s.close(); }
});

test('SoloFlow dropshipper IDs work with shop-bound connection codes', () => {
  const s = new ShopifyOrderStore(':memory:');
  try {
    const { code } = s.issueConnectionCode(a, 'A-3848', 'Synthetic Partner');
    assert.equal(s.redeemConnectionCode(b, 'A-3848', code), false);
    assert.equal(s.redeemConnectionCode(a, 'A-3849', code), false);
    assert.equal(s.redeemConnectionCode(a, 'A-3848', code), true);
    assert.equal(s.redeemConnectionCode(a, 'A-3848', code), false);
  } finally { s.close(); }
});

test('privacy redaction is shop-scoped and repeatable', () => {
  const s = new ShopifyOrderStore(':memory:');
  try {
    s.linkStore(a,'merchant-a','A'); s.linkStore(b,'merchant-b','B');
    s.ingest(a,'event-a','orders/create',order);
    s.ingest(b,'event-b','orders/create',order);
    s.redactOrders(a,[order.id]); s.redactOrders(a,[order.id]);
    assert.equal(s.merchantOrders('merchant-a').length,0);
    assert.equal(s.merchantOrders('merchant-b').length,1);
    assert.throws(() => s.redactOrders(a,['invalid']),/Invalid order identifiers/);
    const code = s.issueConnectionCode(a,'merchant-a','A').code;
    s.redactShop(a); s.redactShop(a);
    assert.equal(s.redeemConnectionCode(a,'merchant-a',code),false);
    assert.throws(() => s.ingest(a,'event-c','orders/create',order),/not connected/);
    assert.equal(s.merchantOrders('merchant-b').length,1);
  } finally { s.close(); }
});

test('privacy requests are durable, deduplicated and redacted by shop', () => {
  const s = new ShopifyOrderStore(':memory:');
  try {
    s.queueDataRequest(a,'123',[order.id]);
    s.queueDataRequest(a,'123',[order.id]);
    s.queueDataRequest(b,'123',[order.id]);
    assert.equal(s.staffPrivacyRequests().length, 2);
    s.redactOrders(a,[order.id]);
    assert.equal(s.staffPrivacyRequests().find(r=>r.shop===a).order_ids, '[]');
    assert.equal(s.staffPrivacyRequests().find(r=>r.shop===b).order_ids, JSON.stringify([order.id]));
    s.redactShop(a);
    assert.equal(s.staffPrivacyRequests().length, 1);
    assert.equal(s.staffPrivacyRequests()[0].shop,b);
  } finally { s.close(); }
});
