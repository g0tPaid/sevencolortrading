import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// The SDK authenticates the exact raw request body before any processing.
// No customer details or webhook payloads are logged or retained by this app.
export async function action({ request }: ActionFunctionArgs) {
  const { topic, shop, payload } = await authenticate.webhook(request);
  const event = String(topic).toLowerCase().replaceAll("_", "/").replace("/data/request", "/data_request");
  if (!["customers/data_request", "customers/redact", "shop/redact"].includes(event)) {
    return new Response(null, { status: 400 });
  }

  // Account linking, once enabled, stores order references in a separate service.
  // Do not acknowledge a privacy request until that service has processed it.
  if (process.env.SC_CONNECTION_URL) {
    const endpoint = process.env.SC_PRIVACY_URL;
    const secret = process.env.SHOPIFY_LINK_SECRET;
    if (!endpoint || !secret || secret.length < 32) return new Response(null, { status: 503 });
    try {
      const url = new URL(endpoint);
      if (url.protocol !== "https:") return new Response(null, { status: 503 });
      const data = payload as { orders_requested?: unknown; orders_to_redact?: unknown; data_request?: { id?: unknown } };
      const result = await fetch(url, {
        method: "POST",
        redirect: "error",
        signal: AbortSignal.timeout(10000),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ shop, topic: event, orderIds: data.orders_requested ?? data.orders_to_redact ?? [], requestId: data.data_request?.id }),
      });
      if (!result.ok) return new Response(null, { status: 503 });
    } catch {
      return new Response(null, { status: 503 });
    }
  }

  // The current read-only order viewer does not store customer or order payloads.
  // Shopify staff/shop session credentials are the only Shopify data in its database.
  if (event === "shop/redact") {
    await db.session.deleteMany({ where: { shop } });
  }
  return new Response(null, { status: 200 });
}

