'use client';

import { useState, type FormEvent } from 'react';

export function ShopifyConnectionCode() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setCode(''); setError('');
    const values = new FormData(event.currentTarget);
    try {
      const result = await fetch('/api/shopify/connection/issue', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerNumber: values.get('customerNumber'), shop: values.get('shop') }) });
      const body = await result.json();
      if (!result.ok || !body.code) setError(body.error || 'Unable to generate code');
      else setCode(body.code);
    } catch { setError('Unable to generate code'); }
    finally { setBusy(false); }
  }
  return <div className="rounded-2xl border border-line bg-paper-elevated p-5">
    <h2 className="font-semibold text-ink">Connect a dropshipper</h2>
    <p className="mt-1 text-sm text-muted">Verify the customer reference and Shopify domain before issuing a one-time code. Share it privately; it expires in 15 minutes.</p>
    <form onSubmit={submit} className="mt-4 flex flex-wrap gap-3 items-end">
      <label className="text-sm">Customer number<input name="customerNumber" required placeholder="DS-XXXXXXXX" className="block mt-1 rounded-xl border border-line bg-paper p-2" /></label>
      <label className="text-sm">Shopify domain<input name="shop" required placeholder="store.myshopify.com" className="block mt-1 rounded-xl border border-line bg-paper p-2" /></label>
      <button type="submit" disabled={busy} className="rounded-xl bg-accent px-4 py-2 text-white text-sm font-semibold">{busy ? 'Generating...' : 'Generate connection code'}</button>
    </form>
    {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
    {code && <div className="mt-3"><p className="text-sm">One-time code (15 minutes)</p><code className="block break-all select-all rounded-lg bg-paper p-2 mt-1">{code}</code></div>}
  </div>;
}

