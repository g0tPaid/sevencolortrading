import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from 'react-router';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { authenticate } from '../shopify.server';
import { CANDIDATE_FIELDS, SUBMIT_REQUEST, requestBlockReason } from '../fulfillment.server';
import type { FulfillmentCandidate } from '../fulfillment.server';
import { findWarehouse, provisionWarehouse, warehouseCallback, warehouseApproval } from '../warehouse.server';
import { warehouseConnection } from '../warehouse-approval.server';
import { WAREHOUSE_ADDRESS, WAREHOUSE_NAME, warehouseAddressMatches } from '../warehouse';

type Row = FulfillmentCandidate & { orderName: string };
type DisplayRow = Row & { blocked: string | null };
type Result = { error: string; success?: never } | { success: string; error?: never };

async function resolveLocation(admin: Parameters<typeof findWarehouse>[0], approved: boolean) {
  const callback = warehouseCallback();
  if (!callback || !approved) return null;
  const warehouse = await findWarehouse(admin, callback);
  return warehouseAddressMatches(warehouse?.location?.address) ? warehouse?.location?.id ?? null : null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  try {
    const { approved: setupAllowed, demo } = await warehouseApproval(session.shop);
    const location = await resolveLocation(admin, setupAllowed);
    if (!location) return { available: false, setupAllowed, demo, rows: [] as DisplayRow[], failed: false };
    const response = await admin.graphql(`#graphql
      query SourcingCenterFulfillmentOrders {
        fulfillmentOrders(first: 50) { nodes { ${CANDIDATE_FIELDS} orderName } }
      }`);
    const body = await response.json() as { data?: { fulfillmentOrders?: { nodes: Row[] } }; errors?: unknown[] };
    if (!response.ok || body.errors?.length || !body.data?.fulfillmentOrders) throw new Error('Unable to load');
    return { available: true, setupAllowed, demo, rows: body.data.fulfillmentOrders.nodes.filter(row => row.assignedLocation.location?.id === location).map(row => ({ ...row, blocked: requestBlockReason(row, location) })), failed: false };
  } catch { return { available: false, setupAllowed: false, demo: false, rows: [] as DisplayRow[], failed: true }; }
}

export async function action({ request }: ActionFunctionArgs): Promise<Result> {
  const { admin, session } = await authenticate.admin(request);
  const form = await request.formData();
  if (form.get('intent') === 'setup') {
    const callback = warehouseCallback();
    if (!callback || form.get('confirm') !== 'yes') return { error: 'Warehouse setup is not available.' };
    try {
      await provisionWarehouse(admin, session.shop, callback);
      return { success: 'Xiamen warehouse registered with Shopify. You can assign inventory and orders to this location.' };
    } catch (error) { return { error: error instanceof Error ? error.message : 'Warehouse setup could not be completed.' }; }
  }
  const id = form.get('fulfillmentOrderId');
  if (typeof id !== 'string' || !/^gid:\/\/shopify\/FulfillmentOrder\/\d+$/.test(id) || form.get('confirm') !== 'yes') return { error: 'Confirm the fulfillment request first.' };
  try {
    const approval = await warehouseApproval(session.shop);
    const location = await resolveLocation(admin, approval.approved);
    if (!location) return { error: 'Sourcing Center fulfillment is not configured for this store.' };
    // Always reload the candidate from this authenticated store before writing.
    const lookup = await admin.graphql(`#graphql
      query SourcingCenterFulfillmentCandidate($id: ID!) {
        fulfillmentOrder(id: $id) { ${CANDIDATE_FIELDS} }
      }`, { variables: { id } });
    const body = await lookup.json() as { data?: { fulfillmentOrder?: FulfillmentCandidate }; errors?: unknown[] };
    if (!lookup.ok || body.errors?.length) return { error: 'Unable to verify this order with Shopify.' };
    const blocked = requestBlockReason(body.data?.fulfillmentOrder ?? null, location);
    if (blocked) return { error: blocked };
    const response = await admin.graphql(SUBMIT_REQUEST, { variables: { id } });
    const result = await response.json() as { data?: { fulfillmentOrderSubmitFulfillmentRequest?: { submittedFulfillmentOrder?: { id: string }; userErrors: { message: string }[] } }; errors?: unknown[] };
    const payload = result.data?.fulfillmentOrderSubmitFulfillmentRequest;
    if (!response.ok || result.errors?.length || !payload || payload.userErrors.length || !payload.submittedFulfillmentOrder) return { error: payload?.userErrors.map(e => e.message).join('; ') || 'Shopify could not submit the request. Refresh before retrying.' };
    if (!approval.demo) {
      try {
        const notified = await warehouseConnection(session.shop, 'notice', 'FULFILLMENT_REQUEST');
        if (!notified.approved || notified.demo) throw new Error('Staff notification unavailable');
      } catch { return { success: 'Request submitted to Shopify. Staff notification is pending; contact Sourcing Center if needed. Do not submit again.' }; }
    }
    return { success: 'Request submitted to Shopify. This is not a shipment confirmation, payment approval, or purchase authorization.' };
  } catch { return { error: 'Shopify could not confirm the request. Refresh and check the current status before retrying.' }; }
}

export default function Fulfillment() {
  const { available, setupAllowed, demo, rows, failed } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const busy = useNavigation().state !== 'idle';
  return <s-page heading="Fulfillment requests">
    <s-section heading="Request fulfillment from Sourcing Center">
      <s-paragraph>Requests are limited to paid orders already assigned to your approved Sourcing Center location. A request does not initiate purchasing or mark an order fulfilled.</s-paragraph>
      {demo && <s-paragraph>Review sandbox: no live request is sent to Sourcing Center staff.</s-paragraph>}
      {!available && !setupAllowed && !failed && <s-paragraph>Connect your approved Sourcing Center account using Connect account, then return here.</s-paragraph>}
      {!available && setupAllowed && <Form method="post">
        <s-paragraph>{WAREHOUSE_NAME}: {WAREHOUSE_ADDRESS.address1}, {WAREHOUSE_ADDRESS.address2}, Xiamen, Fujian, China {WAREHOUSE_ADDRESS.zip}</s-paragraph>
        <input type="hidden" name="intent" value="setup" />
        <label><input type="checkbox" name="confirm" value="yes" required /> Register this warehouse in {demo ? 'the test store' : 'my Shopify store'}</label>{' '}
        <button type="submit" disabled={busy}>Register warehouse</button>
      </Form>}
      {failed && <s-paragraph>Unable to retrieve fulfillment orders. Check app permissions and try again.</s-paragraph>}
      {available && !failed && rows.length === 0 && <s-paragraph>No orders are assigned to the configured warehouse.</s-paragraph>}
      {result?.error && <s-paragraph>{result.error}</s-paragraph>}
      {result?.success && <s-paragraph>{result.success}</s-paragraph>}
      {rows.map(row => <div key={row.id} style={{ borderBottom: '1px solid #ddd', padding: '12px 0' }}>
        <s-paragraph>{row.orderName} - {row.requestStatus} / {row.order.displayFinancialStatus}</s-paragraph>
        {row.blocked ? <s-paragraph>{row.blocked}</s-paragraph> : <Form method="post">
          <input type="hidden" name="fulfillmentOrderId" value={row.id} />
          <label><input type="checkbox" name="confirm" value="yes" required /> Confirm request for this order</label>{' '}
          <button type="submit" disabled={busy}>Request fulfillment</button>
        </Form>}
      </div>)}
    </s-section>
  </s-page>;
}

export const headers: HeadersFunction = args => boundary.headers(args);
