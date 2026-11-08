# Shipment tracking

Cached shipment tracking for sourcing.center. The public page reads the database. A scheduler refreshes due shipments through a private [universal-parcel-scraper](https://github.com/plhery/universal-parcel-scraper) process. There is no paid tracking subscription and no tracking-vendor API key in this repo.

This is not a live carrier integration until the private scraper is running. Fixture tests and one local process check are described below. They are not production lookups.

## What was reviewed

| Item | Evidence |
| --- | --- |
| Source commit | `80d71f91f705068b523759b0e8598b3dc5e13c9e` on `plhery/universal-parcel-scraper` |
| npm package | `universal-parcel-scraper@0.1025.0-main.5567`, `gitHead` equal to that commit, `engines.node` `>=24` |
| License | Apache-2.0 (`LICENSE` in that repo). The optional TRAWL image is AGPL-3.0 and is not used. |
| HTTP API | `server/openapi.json` at that commit: `GET /health`, `GET /v1/carriers`, `POST /v1/detect`, `POST /v1/recognize`, `POST /v1/track` |
| Container registry | `GET /v2/plhery/universal-parcel-scraper/tags/list` on 2026-11-08. Tags stop at `0.637.1`. There is no `0.1025.0` image and no `latest` tag. |
| Stable image | `ghcr.io/plhery/universal-parcel-scraper:0.637.1` exists and matches git tag `v0.637.1` (`611c16879f47`). That release is older than the API this app calls, so the app does not use it. |
| Upstream Dockerfile | `node:26.12.1-trixie-slim`, installs Chromium, `CMD node dist/cli/index.js serve`, health check `GET /health` |

`POST /v1/track` body is `{ number, carrier?, postcode?, phoneDigits?, budgetMs? }`. A 200 body is `{ carrier, source, result, attempts }`. `result.events[]` use `stage`, `stage_source`, and `instant`. `result.expected_delivery` is the only ETA this app stores. Failures use `{ error, hint: { kind, retryAfterMs? }, attempts? }` and may send `Retry-After`.

Stages in `data/stages.json`: `pending`, `registered`, `accepted`, `in_transit`, `out_for_delivery`, `delivered`, `customs`, `failed_attempt`, `ready_for_pickup`, `returned`, `exception`.

## Runtime that was actually started

Docker is not installed in the build environment, so `services/tracking-scraper/Dockerfile` was not built and Chromium was not measured.

Node 24.11.1 was used to run the pinned npm package directly (no Chromium child process):

```text
HOST=127.0.0.1 PORT=18080 SCRAPER_PROVIDERS= SCRAPER_TOKEN=… \
  node node_modules/universal-parcel-scraper/dist/cli/index.js serve
```

| Check | Result |
| --- | --- |
| `GET /health` | `200` `{"ok":true}` in 0–2 ms |
| `POST /v1/detect` without a token | `401` |
| `POST /v1/detect` `{"text":"1Z999AA10123456784"}` with the token | `200` in 17 ms server-side / 36 ms client-side. Body: carrier `ups`, confidence `high`, candidates `["ups"]`. This is offline pattern detection of the number the upstream README uses as an example. It is not a live delivery. |
| `POST /v1/track` for that same placeholder, `budgetMs` 5000, `SCRAPER_PROVIDERS` empty | `502` after 5007 ms. Body hint `budget`. Attempt `{ source: "ups", kind: "budget", durationMs: 5002 }`. No events. Not a successful live track. |
| Process RSS after that call | 305360 KB (about 298 MB) for the Node process. No Chromium process was present. Virtual size is not reported as capacity. |
| Server log lines | Method, route, status, duration. The tracking number was not in the log. |

The placeholder was not rejected as `invalid_input` by this build; the UPS attempt used the whole 5 second budget. Do not treat that as a working UPS lookup.

## Deployment reality

The site is one Railway service (`railway.toml`): Nixpacks, `npm run build`, `npm run start`, health check `/`. Data is JSON files on `DATA_DIR` (default `/data`, else `/tmp/sourcing-analytics`). There is no Postgres and no existing SQL migration runner.

Tracking reuses that volume as `shipments.sqlite`. The Next.js process starts the scheduler from `src/instrumentation.ts` unless `TRACKING_SCHEDULER=0`. That matches a long-running Node server. It is not a separate cron, and it was not deployed.

Hard limits, all still true:

- Railway MCP was not authenticated, so replica count, RAM, and plan were not read.
- `railway.toml` does not set memory or replicas.
- The private scraper is a separate service. This follow-up does not change `services/tracking-scraper/Dockerfile`. Public and admin checks call `TRACKING_SCRAPER_BASE_URL`. If that service is down, the stored result says the tracking service is not reachable and no events are invented.
- Horizontal web replicas do not share a Railway volume. Run the scheduler on one instance (`TRACKING_SCHEDULER=0` on the others) or the sqlite file will split. Claims are rows in that file, so they only dedupe processes that share the file.
- Node must be `>=22.13.0` because the database uses `node:sqlite`. The scraper image uses Node 26. The web app does not import the scraper package.

Do not point `TRACKING_SCRAPER_BASE_URL` at a public URL. The client reads that variable only, allows `http` or `https` with no userinfo, path, query, or hash, and sets `redirect: "error"`.

## Files

Created:

- `docs/shipment-tracking.md`
- `services/tracking-scraper/Dockerfile`
- `services/tracking-scraper/docker-compose.yml`
- `scripts/tracking-worker.ts`
- `src/instrumentation.ts`
- `src/instrumentation-node.ts`
- `src/types/node-sqlite.d.ts`
- `src/lib/tracking/` (database, scheduler, scraper client, CSV, fixtures, tests)
- `src/lib/tracking/migrations/001_init.sql`
- `src/lib/tracking/migrations/001_down.sql`
- `src/lib/tracking/migrations/002_public_cache.sql`
- `src/lib/tracking/migrations/002_down.sql`
- `src/lib/tracking/public-cache.ts`
- `src/app/(marketing)/track/page.tsx`
- `src/components/tracking/track-lookup.tsx`
- `src/app/(dashboard)/dashboard/shipments/page.tsx`
- `src/components/dashboard/shipments-desk.tsx`
- `src/app/api/track/route.ts`
- `src/app/api/track/refresh/route.ts`
- `src/app/api/admin/shipments/route.ts`
- `src/app/api/admin/shipments/[id]/route.ts`
- `src/app/api/admin/shipments/[id]/refresh/route.ts`
- `src/app/api/admin/shipments/settings/route.ts`
- `src/app/api/admin/shipments/import/route.ts`
- `src/app/api/admin/shipments/export/route.ts`

Modified:

- `package.json`, `package-lock.json` (`tsx` devDependency, `test:tracking`, `typecheck`, `tracking:worker`, Node `>=22.13.0`)
- `tsconfig.json`
- `.gitignore` (sqlite files)
- `README.md`
- `src/middleware.ts` (admin shipment APIs require the existing session)
- `src/app/sitemap.ts` (`/track`)
- `src/components/layout/site-footer.tsx`
- `src/components/dashboard/shell.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`

Not modified: Railway start command, marketing routes other than the new `/track` link, factory/RFQ/news stores, production data.

## Migrations

`001_init.sql` creates only tracking tables: `schema_migrations`, `tracking_settings`, `shipments`, `shipment_events`, `tracking_work_claims`, `tracking_refresh_queue`, `tracking_carrier_leases`, `tracking_provider_logs`, `tracking_rate_limits`. Indexes cover due work, order number, customer name, customer ref, status, and event fingerprints. Foreign keys are on. Unique `(tracking_number_norm, carrier_id)` when a carrier is set, and unique `tracking_number_norm` while the carrier is still null.

The app applies `001_init.sql` on first open. Statements are `IF NOT EXISTS` / `ON CONFLICT DO NOTHING`. Re-running does not drop or rewrite shipment rows. JSON stores are not opened by this migration.

Apply after review, by deploying or by starting the app with the volume mounted. To apply by hand:

```bash
sqlite3 "$TRACKING_DB_PATH" < src/lib/tracking/migrations/001_init.sql
```

Rollback, with the app stopped. This drops only the tracking tables. If the sqlite file contains nothing else, moving that file aside is the same rollback.

```bash
sqlite3 "$TRACKING_DB_PATH" < src/lib/tracking/migrations/001_down.sql
```

Do not run either command against production before this change is reviewed. This branch did not.

## Environment names

No values belong in git.

| Name | Role |
| --- | --- |
| `DATA_DIR` or `ANALYTICS_DATA_DIR` | Existing data directory. Default `/data`. |
| `TRACKING_DB_PATH` | Optional sqlite path. Default `$DATA_DIR/shipments.sqlite`. |
| `TRACKING_SCRAPER_BASE_URL` | Private scraper origin. Default `http://127.0.0.1:8080`. |
| `TRACKING_SCRAPER_TOKEN` | Bearer token. Must match the scraper's `SCRAPER_TOKEN`. |
| `TRACKING_SCHEDULER` | `0` disables the in-process scheduler. |
| `TRACKING_TICK_MS` | Tick interval, 5000–600000. Default 60000. |
| `TRACKING_BUDGET_MS` | Per lookup budget, 5000–45000. Default 20000. |
| `TRACKING_WORKER_ID` | Claim owner label. Default hostname and pid. |
| `TRACKING_TRUSTED_PROXY_HOPS` | `X-Forwarded-For` hops. Default `1`. `0` uses one shared bucket. |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | Existing admin session. |

Scraper process (not read from the browser): `HOST`, `PORT`, `SCRAPER_TOKEN`, `SCRAPER_PROVIDERS` (empty here, so commercial fallbacks and UPU are off), `SCRAPER_DEMO_PAGE=false`, `SCRAPER_RATE_LIMIT`, `SCRAPER_MAX_CONCURRENT`, `SCRAPER_CACHE_MS`, `SCRAPER_FAILURE_CACHE_MS`, `SCRAPER_TRUSTED_PROXIES`, `TRACKING_CHROMIUM_PATH`. FedEx, UPS, and DHL developer keys stay unset.

## Docker and network

`services/tracking-scraper/docker-compose.yml` publishes `127.0.0.1:8080` only. Inside the container `HOST=0.0.0.0` so a private Docker network can reach it. On Railway, do not attach a public domain or a public port. Set the web service's `TRACKING_SCRAPER_BASE_URL` to `http://<private-hostname>:8080`.

Health check: `GET /health` from inside the container.

The image was not built here. Building it needs Docker, network access to npm and Debian, and enough disk for Node 26 plus Chromium.

Dedicated worker, only if the web scheduler is turned off on that replica:

```bash
TRACKING_SCHEDULER=0 npm run start          # web replicas that must not poll
npm run tracking:worker                     # one process, needs tsx installed
```

`npm run tracking:worker` uses the `tsx` devDependency. Railway's production install may omit devDependencies. The supported production scheduler is `src/instrumentation.ts` inside `npm run start`, which does not need `tsx`.

## API

Public responses are `Cache-Control: private, no-store`. They never include customer name, customer id, order number, notes, postcode, phone digits, internal id, or provider logs.

`POST /api/track`

```json
{ "trackingNumber": "FIXTUREUPS123456789" }
```

Found:

```json
{
  "ok": true,
  "found": true,
  "shipment": {
    "trackingNumber": "FIXTUREUPS123456789",
    "carrier": { "id": "ups", "name": "UPS", "resolution": "confirmed", "candidates": [] },
    "status": "In Transit",
    "statusDetail": "carrier wording",
    "origin": null,
    "destination": null,
    "originCountryCode": "CN",
    "destinationCountryCode": "US",
    "eta": null,
    "lastUpdated": "2026-04-01T12:00:00.000Z",
    "events": [
      { "time": "2026-03-02T10:00:00.000Z", "status": "In Transit", "description": "carrier wording", "location": "Guangzhou" }
    ],
    "message": null
  }
}
```

Public lookup does not require an admin shipment. `POST /api/track` accepts any tracking number of 4–40 letters and digits. A fresh public-cache hit returns the stored carrier result and does not call the scraper. A cold or stale number is queued once, coalesced across processes, and the page polls until the worker stores a result. `state` is `pending`, `ready`, `multiple`, `unsupported`, `unavailable`, `timeout`, `not_found`, `rejected`, `empty`, or `throttled`. `found` is true only for `ready` or `multiple`. An empty carrier reply is not a success. Upstream `/v1/track` without a carrier settles on one winner. This app instead calls `POST /v1/detect`, then `POST /v1/track` for at most 4 allowlisted candidates, two at a time, inside one deadline. A history counts only when that carrier returns a nonempty event and, if the reply includes a tracking number, it matches the number searched. Several real histories are returned separately. None, or only timeouts, is an honest no-result or retry message. A previously stored `ambiguous` row is checked again instead of asking the visitor to pick a carrier. A cold search returns `pending` immediately and starts that job in the web process; the 60 second scheduler tick is only the backup. A verified history is stored as soon as that carrier answers, while any remaining candidates still run. The page polls every 2 seconds and shows an indeterminate progress bar only while the lookup is pending. A fresh cache hit does not start a check.

The public cache is `public_track_cache` / `public_track_events`. It has no customer, order, or note columns. The same tracking number can exist on an admin shipment without that private data appearing in the public response.

Supported carriers are the allowlist in this document. A number that matches none of them returns an unsupported result. This is not a lookup for every carrier worldwide.

Cold public lookups share a daily cap (`public_daily_cap`, default 2000, bounds 100–20000). Per-address requests are limited, outstanding public jobs are capped, and public work waits while the admin desk has more due shipments than its concurrency setting. Public rows refresh only while someone has looked them up recently (`public_interest_hours`, default 48) and then stop. Delivered public rows are not polled forever.

`POST /api/track/refresh` repeats that same public lookup. It does not require a registered admin shipment.

Admin routes use the existing `sc_admin_session` cookie. Middleware and the handler both require it. Mutations also require `Origin` or `Referer` host to match `X-Forwarded-Host` or `Host`.

| Method | Path | Body |
| --- | --- | --- |
| GET | `/api/admin/shipments?q=&carrier=&status=&limit=&offset=` | — |
| POST | `/api/admin/shipments` | customer, order, tracking, carrier, origin, destination, postcode, phoneLast4, notes |
| GET | `/api/admin/shipments/:id` | shipment, events, provider log (outcome, status, duration only) |
| PATCH | `/api/admin/shipments/:id` | same fields as create |
| DELETE | `/api/admin/shipments/:id` | — |
| POST | `/api/admin/shipments/:id/refresh` | — |
| GET | `/api/admin/shipments/settings` | settings and carrier allowlist |
| PUT | `/api/admin/shipments/settings` | interval numbers |
| GET | `/api/admin/shipments/export` | CSV download |
| POST | `/api/admin/shipments/import` | `{ "csv": "..." }` or `text/csv` |

There is no customer or order table. `customerRef`, `customerName`, and `orderNumber` are text on the shipment. Several shipments can share an order number. Status, ETA, and events are written only from a carrier payload or left unknown. Delivered and returned shipments stop. An admin change of tracking number or carrier clears a terminal status back to Unknown and queues a new check. It does not invent a delivered event.

Carrier resolution values: `unresolved`, `ambiguous`, `pattern`, `confirmed`, `manual`, `unsupported`. `pattern` means one high-confidence candidate from `/v1/detect`. `confirmed` means `/v1/track` returned that same carrier. A low-confidence or multi-candidate detect is stored as ambiguous and is not tracked until a carrier is selected. The carrier field on a low-confidence detect is ignored.

Public status vocabulary: Information Received, Picked Up, In Transit, Arrived at Destination Country, Customs Clearance, Customs Released, Out for Delivery, Delivered, Delivery Exception, Returned to Sender, Unknown.

Mapping: `pending` and `registered` → Information Received; `accepted` → Picked Up; `in_transit` → In Transit; `customs` → Customs Clearance; `out_for_delivery` → Out for Delivery; `delivered` → Delivered; `failed_attempt` and `exception` → Delivery Exception; `returned` → Returned to Sender; `ready_for_pickup` and anything else → Unknown. Customs Released and Arrived at Destination Country are used only when the carrier text matches a short explicit phrase (`customs released`, `cleared customs`, `arrived at destination country`, and the close variants in `src/lib/tracking/status.ts`). Other arrival wording stays on the stage mapping. The original description is kept either way.

Country flags render only for ISO codes that are both supplied by the carrier (`origin_country` / `destination_country`) and present in `COUNTRY_CENTROIDS`. There is no carrier logo set in this repo.

## Scheduler

Defaults, editable inside these bounds: new 4–6 hours (default 5), active 8–12 (default 10), no-movement 12–24 (default 18). No movement means the newest parseable event is at least 48 hours old (`stalledAfterHours`, bounds 24–168). A shipment with no stored event uses the new interval. Delivered and returned set `refresh_stopped` and `next_check_at` null.

Each tick reads settings from sqlite, checks scraper `/health`, and if that fails moves due rows forward 15 minutes without adding events. Otherwise it inserts queue rows for due shipments. An open queue row for the same shipment blocks another, including manual refresh. Claims are `BEGIN IMMEDIATE` plus `tracking_work_claims`, expire after 120 seconds, and are deleted on expiry so a dead worker is recovered. The tick claims up to `globalConcurrency` (1–4, default 2) and at most `perCarrierConcurrency` (1–2, default 1) per carrier, then runs those lookups one after another on the one sqlite connection. A carrier lease of `perCarrierGapMs` (default 2000, bounds 500–60000) spaces the next claim.

Failures use a 30 minute base, doubling each consecutive failure, capped at the no-movement interval, with ±10% jitter. The exponent stops growing at `maxConsecutiveFailures` (3–12, default 8). `invalid_input` stops automatic retries. `not_found`, timeouts, rate limits, and challenges keep the previous events and wait. `rate_limited` and `challenge` also honor `retryAfterMs`. No retry bypasses a carrier block.

Public lookup is 30 per 10 minutes per hashed client address. Public refresh is 10 per hour and also the cooldown (default 15 minutes, bounds 5–60). Admin mutations are 120 per 10 minutes per session user. Counters are sqlite rows, so they are shared by processes using the same file.

## Admin use

Open `/dashboard/shipments` after `/login`. `/admin/shipments` redirects there with the existing temporary redirect. Search matches tracking number, customer name, customer id, and order number. Filters are carrier and status. The form adds or edits. Delete removes the shipment and its events. Queue refresh coalesces with the scheduler. CSV import is 500 data rows and 1 MB. Cells that start with `=`, `+`, `-`, `@`, or a tab are stored as text. Export prefixes those cells with a single quote and quotes commas and newlines. Phone last-4 is not in the CSV. Postcode is, because some carriers require it (GLS Germany's catalog entry does; PostNL, DHL, and DPD mark it optional).

## Carrier matrix

Catalog and carrier folders inspected at commit `80d71f91f705068b523759b0e8598b3dc5e13c9e` via the GitHub contents API. "Fixture-tested" means that commit has `adapter.test.ts` and a `fixtures/` directory. "Upstream live file" means a `*.live.test.ts` file is in the folder. This project did not run those tests and did not complete a live lookup.

| Request | Catalog id | Adapter | This repo's class |
| --- | --- | --- | --- |
| China Post | `china-post` | `carriers/china-post`, `browser: true` | adapter present, fixture-tested, upstream live file present |
| Cainiao | `aliexpress` (display name "AliExpress / Cainiao"). No `cainiao` id | `carriers/aliexpress`, refresh min 30 / failure 60 | adapter present, fixture-tested, upstream live file present |
| 4PX | `four-px` | `carriers/four-px` | adapter present, fixture-tested, upstream live file present |
| YunExpress | `yunexpress` | `carriers/yunexpress`, `browser: true`, high rule `^YT\d{16}$` | adapter present, fixture-tested, upstream live file present |
| Yanwen | `yanwen` | `carriers/yanwen` | adapter present, fixture-tested, upstream live file present |
| SF Express | `sf-express` | `carriers/sf-express`, `browser: true`. 12-digit numbers are low confidence | adapter present, fixture-tested, upstream live file present |
| ZTO | `zto` | `carriers/zto`, `browser: true`. Folder has `adapter.test.ts` and `adapter.live.test.ts` and no `fixtures/` directory | adapter present, upstream live file present, fixture directory absent |
| ZTO International | `zto-international` | separate adapter, not in the original name list but used for cross-border ZTO | allowlisted; not re-listed as a fixtures audit |
| YTO | `yto` | `carriers/yto` | adapter present, fixture-tested, upstream live file present |
| STO | `sto` | `carriers/sto` | adapter present, fixture-tested, upstream live file present |
| J&T Express | `j-and-t` | `carriers/j-and-t` | adapter present, fixture-tested, upstream live file present |
| J&T Express China | `j-and-t-cn` | optional phone last-4. Without it the catalog says other sources are asked. Those sources are disabled here | adapter present. Phone is optional and never returned publicly |
| DHL | `dhl`, `dhl-express`, `dhl-ecommerce` | `browser: true` on these three. `dhl` postcode is optional for 12-digit numbers. No `DHL_API_KEY` is set | `dhl` fixture-tested and upstream live file present. Express and eCommerce are allowlisted dedicated adapters |
| FedEx | `fedex` | `browser: true`, `carriers/fedex` has `adapter.live.test.ts`. No FedEx API key is set | adapter present, fixture-tested, upstream live file present |
| UPS | `ups` | `carriers/ups` has `adapter.test.ts`, `fixtures/`, `api.live.test.ts`, `api.test.ts`, and no `adapter.live.test.ts`. No UPS client id is set | adapter present, fixture-tested, upstream API live file present. Local track attempt timed out (see above) |
| USPS | `usps` | `browser: true`, refresh min 30 / failure 60 | adapter present, fixture-tested, upstream live file present |
| Royal Mail | `royal-mail` | `browser: true`, refresh min 60 | adapter present, fixture-tested, upstream live file present |
| Aramex | `aramex` | `carriers/aramex` | adapter present, fixture-tested, upstream live file present |
| DPD | `dpd` is "DPD Switzerland" and `browser: true`. Also allowlisted: `dpd-de`, `dpd-uk`, `dpd-nl`, `dpd-fr` | Postcode optional in the Switzerland and Germany entries | `dpd` fixture-tested and upstream live file present. Country ids are separate adapters; a shared number is ambiguous until one is selected |
| GLS | No single `gls` id. Allowlisted: `gls-de` (refresh 60/240, postcode required for detailed history), `gls-fr` (refresh 60), `gls-es`, `gls-it` | `gls-de` has `adapter.test.ts` and `fixtures/` and no `*.live.test.ts` | fixture-tested where that folder has fixtures. Not live-tested here. A generic "GLS" choice would be a guess and is not offered |
| PostNL | `spring-gds`, display name "PostNL" | `carriers/spring-gds`, refresh min 30, optional Dutch postcode for some `3S` numbers | adapter present, fixture-tested, upstream live file present |
| Canada Post | `canada-post` | `carriers/canada-post` | adapter present, fixture-tested, upstream live file present |
| Australia Post | `australia-post` | `browser: true` | adapter present, fixture-tested, upstream live file present |
| Correos | `correos-spain` | `carriers/correos-spain` | adapter present, fixture-tested, upstream live file present |
| La Poste | `la-poste` (display name "La Poste / Colissimo") | `adapter.test.ts` and `fixtures/`, no `*.live.test.ts` | adapter present, fixture-tested, no upstream live file in the folder listing |

`browser: true` means the upstream adapter declares a browser transport. It is not recorded here as a permanent block. None of these folders were classified as blocked from the listing alone. A `challenge` or `rate_limited` response is stored as a wait, not evaded.

Anything outside the allowlist, including the explicit "Unsupported carrier" choice, is stored and shown as unsupported. No events are created for it.

## Tests

`npm run test:tracking` uses the system sqlite (`node:sqlite`) and a temp file per test. 15 tests, 15 passed, 0 skipped, on Node v22.23.4:

- migration tables and default intervals
- registration, shared order number, single queue row
- ambiguous detect does not call track
- fixture in-transit reply, ETA only when the fixture includes one, duplicate events ignored, null ETA clears a previous carrier ETA
- unsupported carrier and invalid numbers
- timeout keeps events and sets a future check
- sqlite claims, per-carrier batch cap, second connection cannot insert the same claim, reopen still sees the claim, expiry recovers it
- delivered stops a later tick
- admin route 401 without a cookie and 403 for a foreign `Origin`
- public lookup does not call `fetch`, and the JSON omits customer, order, notes, postcode, and phone
- CSV formula export prefix, overlong notes rejected, 501 rows rejected
- settings outside 4–6 / 8–12 / 12–24 rejected
- manual refresh coalesces; scraper URL rejects userinfo, `file:`, and a path
- `next.config.ts` still redirects `/admin` and `/admin/:path*` to the dashboard
- scraper health failure postpones due work and does not invent a status

Not run: upstream carrier fixture suites, upstream live suites, a successful live track, the Docker image, production Railway, or a browser test of every marketing route (see the build notes in the PR).

## Capacity and cost

Calculated from the defaults, not from production metrics.

| Fleet | Assumption | Lookups per day |
| --- | --- | --- |
| 100 active | every 10 hours | 240 |
| 500 active | every 10 hours | 1,200 |
| 500 new | every 5 hours | 2,400 |
| 500 on the fastest allowed new interval | every 4 hours | 3,000 |
| 500 with no movement | every 18 hours | about 667 |
| One failing shipment | capped at 18 hours | about 1.3 |

Default drain rate is 2 claimed lookups per 60 second tick, processed one at a time, about 2,880 per day if each lookup finishes inside the tick. A 20 second budget makes 2 sequential lookups take about 40 seconds, still inside the tick. 4 lookups at 20 seconds would overrun the tick; the overlap guard skips the next tick until the current one finishes, so the real rate would be lower. A fleet of 500 all on a 4 hour interval (3,000/day) is above the default 2,880/day cap. The 8–12 hour active band at 500 shipments (1,200–1,500/day) fits under that cap. Retries are included in the cap, not added on top of it.

Measured on this machine, Node 24, no Chromium: detect 17–36 ms; one budget-expired UPS attempt about 5 s; RSS about 298 MB after that attempt. Idle RSS before the track call was not sampled. Docker image size, Chromium RSS, and carrier latency were not measured. Server RAM and CPU limits are not in the repo and were not visible without Railway access, so suitability of the current server is not confirmed.

Zero tracking subscription is not zero hosting. The existing Railway service is already paid or credited by whatever plan it is on. A second scraper container adds that plan's usage. This change does not buy a tracking API and does not reserve free capacity.

## Maintenance

Watch admin provider logs for `unavailable`, `budget`, `rate_limited`, and `challenge`. `unavailable` on every row means the scraper process or `TRACKING_SCRAPER_BASE_URL` is wrong. A growing `next_check_at` backlog means the tick cap is below the fleet. Delivered rows should show a null next check. The sqlite file should stay on the volume; it is gitignored.
