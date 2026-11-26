export function ShopifyWarehouseNotices({ notices }: { notices: Record<string, unknown>[] }) {
  return <div className="overflow-x-auto rounded-2xl border border-line bg-paper-elevated p-5">
    <h2 className="font-semibold text-ink">Warehouse requests</h2>
    <p className="mt-1 text-sm text-muted">Latest Shopify request and cancellation signals from linked stores. These are staff follow-up alerts, not purchase or shipment authorizations. Confirm individual order details with the merchant before proceeding.</p>
    <table className="mt-3 w-full text-left text-sm"><thead><tr>{['Merchant','Shopify store','Request','Last received'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
      <tbody>{notices.map(n => <tr key={String(n.shop)+':'+String(n.kind)} className="border-t border-line">
        {[n.display_name,n.shop,n.kind==='FULFILLMENT_REQUEST'?'Fulfillment requested':'Cancellation requested',n.received_at].map((v,i)=><td key={i} className="p-3">{String(v??'')}</td>)}
      </tr>)}</tbody></table>
    {!notices.length && <p className="mt-3 text-sm text-muted">No warehouse requests yet.</p>}
  </div>;
}
