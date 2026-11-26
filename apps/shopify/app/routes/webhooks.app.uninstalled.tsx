import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { warehouseConnection } from '../warehouse-approval.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  if (process.env.SC_CONNECTION_URL) {
    try { await warehouseConnection(shop, 'uninstall'); }
    catch { return new Response(null, { status: 503 }); }
  }

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  if (session) {
    await db.session.deleteMany({ where: { shop } });
  }
  await db.$executeRaw`DELETE FROM WarehouseNotification WHERE shop=${shop}`;

  return new Response();
};
