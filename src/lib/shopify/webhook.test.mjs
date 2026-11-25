import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { ShopifyOrderStore } from './order-store.ts';
import { processShopifyWebhook } from './webhook.ts';

test('signed Shopify order delivery succeeds, tampered body does not', () => {
  const store=new ShopifyOrderStore(':memory:');
  try {
    const shop='example.myshopify.com'; const secret='test-only-secret';
    store.linkStore(shop,'test-merchant','Test');
    const raw=Buffer.from(JSON.stringify({admin_graphql_api_id:'gid://shopify/Order/1',name:'#1001',financial_status:'paid',currency:'USD',updated_at:'2026-11-25T00:00:00Z',line_items:[{admin_graphql_api_id:'gid://shopify/LineItem/1',title:'Mug',quantity:1}],shipping_address:{name:'Synthetic Person'}}));
    const headers=new Headers({'x-shopify-hmac-sha256':createHmac('sha256',secret).update(raw).digest('base64'),'x-shopify-shop-domain':shop,'x-shopify-topic':'orders/create','x-shopify-event-id':'event-1'});
    assert.equal(processShopifyWebhook(store,Buffer.concat([raw,Buffer.from(' ')]),headers,secret).status,401);
    assert.equal(store.staffOrders().length,0);
    assert.equal(processShopifyWebhook(store,raw,headers,secret).result,'processed');
    assert.equal(processShopifyWebhook(store,raw,headers,secret).result,'duplicate');
    assert.equal(store.staffOrders().length,1);
    assert.equal(JSON.stringify(store.staffOrders()).includes('Synthetic Person'),false);
  } finally {store.close();}
});

