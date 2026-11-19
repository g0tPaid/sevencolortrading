# Sourcing Center 1688 catalog

The `/1688` page can accept English keyword searches, canonical offer links and photos, and collect sourcing quote requests through the existing RFQ pipeline. It never publishes example listings or invented prices. If the API is not authorized, it offers an independent sourcing request instead.

## Activate live supplier results

1. Sign in at https://open.1688.com/ with the company's developer account. Apply for the cross-border sourcing API solution and confirm the approved permissions for keyword search, detail queries, image upload/search, and downstream display of supplier data and prices.
2. Add the approved app key, app secret and authorized refresh token as **server-only Railway variables** on the `sevencolortrading` production service: `ALI1688_APP_KEY`, `ALI1688_APP_SECRET`, `ALI1688_REFRESH_TOKEN` (or `ALI1688_ACCESS_TOKEN` for a short-lived authorized test).
3. Review provider entitlement, quota, data usage and republishing rights before setting `ALI1688_PUBLIC_CATALOG_ENABLED=true`. Test a real keyword, offer ID and non-sensitive product image and verify returned pricing units, minimum quantities, image permissions, and translated names against the supplier listing.
4. If the account is not approved or the connection is unavailable, disable the flag. The manual quote flow remains available.

No credentials belong in source control, browser code, or chat. The gateway uses read-only catalog operations, not payment or ordering. Search results are cached briefly in memory; uploaded photos are not persisted by the catalog endpoint. Currency conversions are indicative, and purchase decisions require supplier verification and final quotes. The API limits requests per process; review commercial quota and billing before public activation.

