import { test } from 'node:test';
import assert from 'node:assert/strict';
import { configuredLocation, requestBlockReason } from './fulfillment.server.ts';

const shop = 'sourcing-center-test.myshopify.com';
const location = 'gid://shopify/Location/123';
const candidate = () => ({
  id: 'gid://shopify/FulfillmentOrder/456', status: 'OPEN', requestStatus: 'UNSUBMITTED',
  assignedLocation: { location: { id: location } },
  supportedActions: [{ action: 'REQUEST_FULFILLMENT' }],
  order: { displayFinancialStatus: 'PAID', cancelledAt: null },
});

test('only configured shop IDs are accepted', () => {
  const config = JSON.stringify({ [shop]: location });
  assert.equal(configuredLocation(shop, config), location);
  assert.equal(configuredLocation('another.myshopify.com', config), null);
  assert.equal(configuredLocation(shop, '{'), null);
  assert.equal(configuredLocation(shop, JSON.stringify({ [shop]: '123' })), null);
});
test('eligible paid order may be requested', () => assert.equal(requestBlockReason(candidate(), location), null));
test('missing config or wrong location blocks request', () => {
  assert.ok(requestBlockReason(candidate(), null));
  assert.ok(requestBlockReason(candidate(), 'gid://shopify/Location/999'));
  assert.ok(requestBlockReason(null, location));
});
test('all non-paid statuses and cancelled orders are blocked', () => {
  for (const displayFinancialStatus of ['PENDING', 'AUTHORIZED', 'PARTIALLY_PAID', 'REFUNDED', 'VOIDED']) {
    assert.ok(requestBlockReason({ ...candidate(), order: { displayFinancialStatus, cancelledAt: null } }, location));
  }
  assert.ok(requestBlockReason({ ...candidate(), order: { displayFinancialStatus: 'PAID', cancelledAt: '2026-11-26' } }, location));
});
test('submitted, accepted, held, closed or unsupported orders cannot be requested', () => {
  for (const requestStatus of ['SUBMITTED', 'ACCEPTED', 'CANCELLATION_REQUESTED']) assert.ok(requestBlockReason({ ...candidate(), requestStatus }, location));
  for (const status of ['ON_HOLD', 'CLOSED', 'IN_PROGRESS']) assert.ok(requestBlockReason({ ...candidate(), status }, location));
  assert.ok(requestBlockReason({ ...candidate(), supportedActions: [] }, location));
});
