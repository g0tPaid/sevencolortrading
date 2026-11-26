import { WAREHOUSE_NAME, WAREHOUSE_ADDRESS, warehouseAddressMatches } from './warehouse';
import { warehouseConnection } from './warehouse-approval.server';

// Only a verified, staff-approved connection qualifies. The original test store
// remains an isolated demonstration; no live requests are sent for this shop.
export async function warehouseApproval(shop: string): Promise<{ approved: boolean; demo: boolean }> {
  if (shop === 'sourcing-center-test.myshopify.com') return { approved: true, demo: true };
  return warehouseConnection(shop);
}

export function warehouseCallback(appUrl = process.env.SHOPIFY_APP_URL): string | null {
  try {
    const url = new URL(appUrl ?? '');
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    return `${url.origin}/warehouse`;
  } catch { return null; }
}

export const FIND_WAREHOUSE = `#graphql
  query SourcingCenterWarehouse {
    shop { fulfillmentServices { id serviceName callbackUrl location { id address { address1 address2 city zip countryCode provinceCode } } } }
  }
`;

export const CREATE_WAREHOUSE = `#graphql
  mutation SourcingCenterCreateWarehouse($name: String!, $callback: URL!) {
    fulfillmentServiceCreate(name: $name, callbackUrl: $callback, inventoryManagement: false, trackingSupport: false) {
      fulfillmentService { id location { id } }
      userErrors { message }
    }
  }
`;

export const SET_WAREHOUSE_ADDRESS = `#graphql
  mutation SourcingCenterSetWarehouseAddress($id: ID!, $input: LocationEditInput!) {
    locationEdit(id: $id, input: $input) {
      location { id address { address1 address2 city zip countryCode provinceCode } }
      userErrors { message }
    }
  }
`;

type WarehouseService = { id: string; serviceName: string; callbackUrl: string | null; location: { id: string; address: Record<string, string | null> } | null };
type Admin = { graphql: (query: string, options?: { variables?: Record<string, unknown> }) => Promise<Response> };

export async function findWarehouse(admin: Admin, callback: string) {
  const response = await admin.graphql(FIND_WAREHOUSE);
  const body = await response.json() as { data?: { shop?: { fulfillmentServices: WarehouseService[] } }; errors?: unknown[] };
  if (!response.ok || body.errors?.length || !body.data?.shop) throw new Error('Could not retrieve warehouse configuration');
  const matching = body.data.shop.fulfillmentServices.filter(service => service.serviceName === WAREHOUSE_NAME && service.callbackUrl === callback);
  if (matching.length > 1) throw new Error('Duplicate warehouse services require staff review');
  return matching[0] ?? null;
}

export async function provisionWarehouse(admin: Admin, shop: string, callback: string) {
  if (!(await warehouseApproval(shop)).approved) throw new Error('Connect an approved Sourcing Center account before registering a warehouse.');
  const existing = await findWarehouse(admin, callback);
  let id = existing?.location?.id;
  if (id && warehouseAddressMatches(existing?.location?.address)) return id;
  if (existing && !id) throw new Error('Existing warehouse has no location. Contact support.');
  if (!id) {
    const response = await admin.graphql(CREATE_WAREHOUSE, { variables: { name: WAREHOUSE_NAME, callback } });
    const body = await response.json() as { data?: { fulfillmentServiceCreate?: { fulfillmentService?: { location?: { id: string } }; userErrors: { message: string }[] } }; errors?: unknown[] };
    const result = body.data?.fulfillmentServiceCreate;
    if (!response.ok || body.errors?.length || !result || result.userErrors.length || !result.fulfillmentService?.location?.id) throw new Error(result?.userErrors.map(error => error.message).join('; ') || 'Shopify could not register the warehouse. Refresh before retrying.');
    id = result.fulfillmentService.location.id;
  }
  const response = await admin.graphql(SET_WAREHOUSE_ADDRESS, { variables: { id, input: { address: WAREHOUSE_ADDRESS } } });
  const body = await response.json() as { data?: { locationEdit?: { location?: { id: string; address: Record<string, string | null> }; userErrors: { message: string }[] } }; errors?: unknown[] };
  const result = body.data?.locationEdit;
  if (!response.ok || body.errors?.length || !result || result.userErrors.length || !result.location || !warehouseAddressMatches(result.location.address)) throw new Error(result?.userErrors.map(error => error.message).join('; ') || 'Warehouse was registered but its address could not be verified. Refresh and retry setup.');
  return result.location.id;
}
