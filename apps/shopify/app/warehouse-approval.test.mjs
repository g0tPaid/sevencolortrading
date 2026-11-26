import { test } from 'node:test';
import assert from 'node:assert/strict';
import { warehouseConnection } from './warehouse-approval.server.ts';

test('warehouse eligibility is verified against the existing trusted backend', async () => {
  process.env.SC_CONNECTION_URL = 'https://example.invalid/api/shopify/connection/redeem';
  process.env.SHOPIFY_LINK_SECRET = 'synthetic-test-secret-'.repeat(3);
  const response = await warehouseConnection('approved-shop.myshopify.com','status',undefined,async (url,init) => {
    assert.equal(url.pathname,'/api/shopify/connection/warehouse');
    assert.equal(url.origin,'https://example.invalid');
    assert.equal(init.redirect,'error');
    assert.equal(JSON.parse(init.body).shop,'approved-shop.myshopify.com');
    return Response.json({approved:true,demo:false});
  });
  assert.deepEqual(response,{approved:true,demo:false});
  assert.deepEqual(await warehouseConnection('other-shop.myshopify.com','status',undefined,async()=>Response.json({approved:false})),{approved:false,demo:false});
  await assert.rejects(warehouseConnection('other-shop.myshopify.com','status',undefined,async()=>new Response(null,{status:503})));
  await assert.rejects(warehouseConnection('example.com'));
});
