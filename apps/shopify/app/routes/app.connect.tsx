import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from 'react-router';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { authenticate } from '../shopify.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop, available: Boolean(process.env.SC_CONNECTION_URL && process.env.SHOPIFY_LINK_SECRET) };
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const secret = process.env.SHOPIFY_LINK_SECRET;
  const endpoint = process.env.SC_CONNECTION_URL;
  if (!endpoint || !secret || secret.length < 32) return { error: 'Connection service not configured.' };
  const form = await request.formData();
  const customerNumber = String(form.get('customerNumber') || '').trim().toUpperCase();
  const code = String(form.get('code') || '').trim();
  if (!/^DS-[0-9A-F]{8}$/.test(customerNumber) || !/^[A-Za-z0-9_-]{32}$/.test(code)) return { error: 'Enter a valid customer number and connection code.' };
  try {
    const url = new URL(endpoint);
    if (url.protocol !== 'https:') return { error: 'Connection service not configured.' };
    const response = await fetch(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000), headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` }, body: JSON.stringify({ shop: session.shop, customerNumber, code }) });
    if (!response.ok) return { error: 'Connection failed. Check your code or contact Sourcing Center.' };
    const result = await response.json();
    return result.connected === true ? { connected: true } : { error: 'Connection failed.' };
  } catch { return { error: 'Connection service unavailable. Try again later.' }; }
}

export default function Connect() {
  const { shop, available } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const busy = useNavigation().state !== 'idle';
  return <s-page heading="Connect your Sourcing Center account">
    <s-section heading="Your Shopify store"><s-paragraph>{shop}</s-paragraph><s-paragraph>Ask Sourcing Center for a private, one-time connection code. No email verification is needed.</s-paragraph></s-section>
    <s-section heading="Customer connection">
      {!available ? <s-paragraph>The customer connection service is not configured yet.</s-paragraph> : <Form method="post">
        <div style={{ display: 'grid', gap: '12px', maxWidth: '440px' }}>
          <label>Customer number<input name="customerNumber" placeholder="DS-XXXXXXXX" required maxLength={11} style={{ display:'block', width:'100%', padding:'10px' }} /></label>
          <label>Connection code<input name="code" type="password" required autoComplete="off" maxLength={32} style={{ display:'block', width:'100%', padding:'10px' }} /></label>
          <button type="submit" disabled={busy}>{busy ? 'Connecting...' : 'Connect store'}</button>
        </div>
      </Form>}
      {result?.error && <s-paragraph>{result.error}</s-paragraph>}
      {result?.connected && <s-paragraph>Store connected successfully.</s-paragraph>}
    </s-section>
  </s-page>;
}
export const headers: HeadersFunction = (args) => boundary.headers(args);

