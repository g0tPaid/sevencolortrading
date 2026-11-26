import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WAREHOUSE_ADDRESS, warehouseAddressMatches } from './warehouse.ts';

test('configured warehouse preserves the supplied address', () => {
  assert.equal(WAREHOUSE_ADDRESS.address1, 'No. 79, Huli Street');
  assert.equal(WAREHOUSE_ADDRESS.address2, 'Huli District');
  assert.equal(WAREHOUSE_ADDRESS.city, 'Xiamen');
  assert.equal(WAREHOUSE_ADDRESS.countryCode, 'CN');
  assert.equal(WAREHOUSE_ADDRESS.zip, '361000');
  assert.ok(warehouseAddressMatches(WAREHOUSE_ADDRESS));
});

test('unverified or mismatched warehouse cannot be used', () => {
  assert.equal(warehouseAddressMatches(null), false);
  assert.equal(warehouseAddressMatches({ ...WAREHOUSE_ADDRESS, countryCode: 'US' }), false);
  assert.equal(warehouseAddressMatches({ ...WAREHOUSE_ADDRESS, zip: '000000' }), false);
});
