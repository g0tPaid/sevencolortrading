import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

type Order = {
  id: string;
  name: string;
  createdAt: string;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string;
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const response = await admin.graphql(`
    query SourcingCenterOrders {
      orders(first: 50, sortKey: CREATED_AT, reverse: true) {
        nodes {
          id name createdAt displayFinancialStatus displayFulfillmentStatus
          totalPriceSet { shopMoney { amount currencyCode } }
        }
      }
    }`);
  const result = await response.json() as { data?: { orders?: { nodes?: Order[] } }; errors?: unknown[] };
  const orders: Order[] = result.data?.orders?.nodes ?? [];
  return { shop: session.shop, orders, failed: !response.ok || Boolean(result.errors?.length) };
}

export default function Home() {
  const { shop, orders, failed } = useLoaderData<typeof loader>();
  return (
    <s-page heading="Sourcing Center">
      <s-section heading="Connected Shopify store">
        <s-paragraph>{shop}</s-paragraph>
        <s-paragraph>View recent orders from your connected shop. This development view is read-only and does not start purchasing or fulfillment.</s-paragraph>
      </s-section>
      <s-section heading="Recent Shopify orders">
        {failed ? <s-paragraph>Unable to retrieve orders. Check the app permissions and try again.</s-paragraph> : orders.length === 0 ? <s-paragraph>No orders found.</s-paragraph> :
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
              <thead><tr><th>Order</th><th>Date</th><th>Retail payment</th><th>Fulfillment</th><th>Total</th></tr></thead>
              <tbody>{orders.map(order => <tr key={order.id}>
                <td>{order.name}</td><td>{order.createdAt.slice(0, 10)}</td>
                <td>{order.displayFinancialStatus}</td><td>{order.displayFulfillmentStatus}</td>
                <td>{order.totalPriceSet.shopMoney.amount} {order.totalPriceSet.shopMoney.currencyCode}</td>
              </tr>)}</tbody>
            </table>
          </div>}
      </s-section>
      <s-section heading="Sourcing workflow">
        <s-paragraph>Quote, merchant approval and separate payment, purchasing, warehouse QC, shipping and tracking.</s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (args) => boundary.headers(args);

