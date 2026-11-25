# Sourcing.center Shopify integration - Phase 1 foundation

## Existing-system audit

The production repository is a Next.js 15 / React 19 / TypeScript application on Railway, using a persistent `/data` volume. The current shipment tracking service uses SQLite; inquiry, RFQ and dropshipping application data are file-backed. The existing admin session uses an HMAC-protected cookie and shared admin credentials, not merchant accounts or role-based access. The existing dashboard includes shipment tracking, applications and a SoloFlow link. Railway has a PostgreSQL service, but the existing tracking code does not use it. Do not change the existing shipment database or deployment.

## Architecture and delivery plan

1. Separate embedded Shopify app using the official React Router template, Shopify managed installation, session token exchange and offline shop sessions. Associate shops with verified Sourcing.center merchant accounts; support multiple shops per merchant. Import initial orders via the Admin GraphQL API and reconcile after webhook delivery. Admin desk shows imported orders, with shop IDs as tenant boundaries. Use the current stable 2026-10 API version, subject to retesting.
2. Staff creates a quote and merchant approves/pays Sourcing.center separately from retail Shopify payment. No purchase is authorized by the customer's retail payment. Integrate with SoloFlow only through a reviewed interface.
3. Staff purchases manually after confirmed payment; warehouse reception (3-5 days), QC (1 day), merchant approval and consolidation/dispatch (2 days). Record images, exceptions and stage timestamps.
4. International transit (13-19 days), tracking, Shopify fulfillment order API, reconciliation, cancellation and refund exceptions.
5. Analytics, role-based permissions, alerts, operational reporting and additional automation with explicit authorization.

## Implemented in this branch

- Separate SQLite repository for merchant/store mapping, normalized orders and items, webhook deduplication and audit events; transaction boundaries prevent partial imports. No existing database is altered.
- Signed order-create/update/cancel and uninstall webhook receiver, disabled by default. It does not retain raw customer data, addresses, emails or phone numbers.
- Read-only Shopify orders page inside the existing authenticated staff dashboard. No merchant interface is exposed yet.
- Tests for idempotency, isolation, cancellation, stale events, uninstall, rollback and verified webhook handling.

Run: `node --experimental-strip-types --test src/lib/shopify/*.test.mjs` (seven tests passed locally using Node 24).

## Customer-number connection

The staff Shopify orders page can issue a short-lived, single-use code after staff verifies the customer's existing `DS-XXXXXXXX` application reference and Shopify domain. The code is stored as a SHA-256 digest and bound to the specific shop and customer; replacement invalidates the earlier code. The embedded Shopify app authenticates the shop with Shopify's SDK and calls the backend redemption endpoint server-to-server. No email or customer-facing shared secret is required.

Configure `SHOPIFY_LINK_SECRET` (a randomly generated secret of at least 32 characters) in both services as a private environment variable. The embedded service uses `SC_CONNECTION_URL` pointing to the HTTPS redemption endpoint. This is a development foundation, not a public-ready release; verify the complete flow in the test store and add operational customer approval/ownership verification before launch.

## Configuration and remaining Phase 1 gates

Use only a separate development database (`SHOPIFY_DB_PATH` must be an absolute path). `SHOPIFY_WEBHOOKS_ENABLED=0` by default; enable only after configuring `SHOPIFY_API_SECRET` securely and completing the integration review. Do not commit any credentials. The staff dashboard reads this database only when configured.

- Create/access a Shopify development dashboard app and development store; repair the unavailable local Shopify CLI installation, scaffold the official embedded app, and configure its credentials through private environment variables.
- Implement merchant authentication/linking UI, encrypted offline session storage, GraphQL pagination/backfill, queue/retry/reconciliation, full webhook subscription lifecycle and refund handling. Test against an actual development store.
- Implement mandatory `customers/data_request`, `customers/redact` and `shop/redact` compliance webhooks and retention policy before public distribution. Request protected customer data access before handling customer addresses/contact details.
- Review a dedicated PostgreSQL schema and migration for production/multi-replica infrastructure; add merchant-level authorization and staff roles. Test migrations only in development first.
- Verify full Next.js integration build, live Shopify install/uninstall, order updates, scoped access, data deletion, and App Store review requirements. Production deployment and database changes require explicit owner approval.

## Official documentation

- https://shopify.dev/docs/apps/build/authentication-authorization/app-installation
- https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/token-exchange
- https://shopify.dev/docs/apps/build/webhooks
- https://shopify.dev/docs/apps/build/privacy-law-compliance
- https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements

## Public launch checklist (limited-visibility listing)

Use Shopify public distribution with a limited-visibility App Store listing if the owner wishes to send customers a direct link. Both visibility options require the same review. The distribution method cannot be changed once selected. Register for the App Store only with owner approval of its one-time fee. Before submission: provision a permanent HTTPS app host and persistent encrypted session storage; configure required Admin API IP allowlisting; implement and test mandatory privacy webhooks and deletion/retention for all connected stores; request protected customer data access if fulfillment needs addresses; complete merchant onboarding and order synchronization; test installation and cancellation; prepare truthful screenshots, support contact and privacy policy. Do not submit an unfinished app or publish it until review gates are met.

- https://shopify.dev/docs/apps/launch/distribution
- https://shopify.dev/docs/apps/launch/distribution/visibility
- https://shopify.dev/docs/apps/launch/app-store-review/review-process
- https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance
- https://shopify.dev/changelog/posts/ip-allowlists-are-now-required-for-public-apps

