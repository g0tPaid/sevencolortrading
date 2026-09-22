# Seven Color — China Sourcing Platform

Premium B2B sourcing platform for Seven Color Trading (sevencolor.online / sourcing.center).

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion + GSAP
- next-themes (dark/light)

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Structure

- Marketing site: `/` and platform pages
- Client desk UI: `/dashboard/*`

## Admin desk auth

Password-protected `/login` session for `/dashboard/*` and sensitive admin APIs.

Railway / production env vars:

- `ADMIN_USERNAME` (required)
- `ADMIN_PASSWORD` (required)
- `ADMIN_SESSION_SECRET` (optional but recommended — HMAC key for `sc_admin_session` cookie; if unset, derived from `ADMIN_PASSWORD` + a fixed app salt)

In development, unset credentials fall back to `admin` / `admin`.

## Google Analytics 4 and Google Ads

The first-party `/dashboard` visitor counter stays. One Google tag (gtag.js) loads in `<head>` on every page with:

- GA4 web stream `G-7QEW0MNP6C`
- Google Ads tag `AW-18461569757`

Railway / production env (optional):

- `GA_MEASUREMENT_ID` — override the default Measurement ID. `NEXT_PUBLIC_GA_MEASUREMENT_ID` also works.
- `GOOGLE_ADS_ID` — override the default Ads ID. `NEXT_PUBLIC_GOOGLE_ADS_ID` also works.

Realtime check: https://analytics.google.com → Reports → Realtime.

Google Ads check: Google Ads → Tools → Google tag / Tag Assistant. The Ads crawler looks for `AW-18461569757` in page HTML.

Tracked:

- `page_view` on each App Router navigation (GA4)
- `generate_lead` after a saved RFQ, Visit China request, factory application, or factory-growth inquiry
- `contact` when the WhatsApp float is clicked

Conversion actions in Google Ads still need a conversion label (`AW-18461569757/xxxxx`) from the Ads UI. Until that label exists, this repo only installs the sitewide tag. Link the GA4 property to the Ads account to import `generate_lead` and `contact` without a second snippet.

No names, emails, or phone numbers are sent to Google.

## Reddit Pixel

Official Reddit Ads pixel in `<head>` on every page (`rdt('init')` + `PageVisit`). App Router navigations fire another `PageVisit` after the first paint so the head snippet is not double-counted.

Railway / production env (required for the pixel to load — there is no default ID in the repo):

- `REDDIT_PIXEL_ID` — Events Manager pixel ID, looks like `a2_…`. `NEXT_PUBLIC_REDDIT_PIXEL_ID` also works.

Until that variable is set, the snippet is omitted so a placeholder ID cannot leak into production HTML.

Check: Reddit Ads → Events Manager, plus the Reddit Pixel Helper Chrome extension on https://sourcing.center.

No emails, phone numbers, or other match keys are sent to Reddit.

## Daily China sourcing news

Public hub: `/news` (index) and `/news/[slug]` (bilingual EN | 中文). `/updates` stays as dated desk notes.

Posts are merged from a static seed (`src/lib/news.ts`) plus a Railway volume JSON file (`/data/news-posts.json`, same `DATA_DIR` / `ANALYTICS_DATA_DIR` pattern as analytics and factory applications). Volume rows override seed by slug.

**Publish without a deploy** (preferred for the daily agent):

```bash
curl -sS -X POST https://sourcing.center/api/news \
  -H "Content-Type: application/json" \
  -H "x-news-publish-secret: $NEWS_PUBLISH_SECRET" \
  -d '{
    "slug": "2026-09-16-example-sourced-brief",
    "date": "2026-09-16",
    "titleEn": "...",
    "titleZh": "...",
    "summaryEn": "...",
    "summaryZh": "...",
    "takeawayEn": "...",
    "takeawayZh": "...",
    "sourceName": "Primary outlet name",
    "sourceUrl": "https://example.com/original-story",
    "tags": ["logistics", "tariffs"],
    "bodyEn": ["Paragraph one.", "Paragraph two."],
    "bodyZh": ["第一段。", "第二段。"]
  }'
```

Auth for `POST /api/news`:

- `NEWS_PUBLISH_SECRET` via `x-news-publish-secret` or `Authorization: Bearer …` (daily agent)
- or an existing admin session cookie (same as `/dashboard`)

`GET /api/news` is public (`{ posts }`). `GET /api/news?slug=…` returns one post.

Do not publish unsourced tariff numbers or invented policy claims. Seed content is a how-the-desk-works note only.

Railway / production env:

- `NEWS_PUBLISH_SECRET` (recommended for the daily agent)
- `DATA_DIR` or `ANALYTICS_DATA_DIR` (optional; defaults to `/data`)

## Factory application alerts

When a factory submits `/factories/register`, the application is **always saved**. Ops notify is best-effort and must not fail the public form.

Railway / production env (all optional):

- `FACTORY_NOTIFY_WEBHOOK` — `POST` JSON (`text` + `application`) to Slack, Discord, Make, or a WhatsApp automation
- `FACTORY_NOTIFY_EMAIL` — recipient address for the ops alert
- `RESEND_API_KEY` — required to actually send the email (https://api.resend.com/emails)
- `FACTORY_NOTIFY_FROM` — optional From address (defaults to `info@sevencolor.online`)

If a notify call fails, the API still returns `{ ok: true }` and logs `[factory-notify]`.

Factory international-presence inquiries from `/factory-growth` are stored in the same applications file with `sourcePath: "/factory-growth"` and use the same notify channels. They are not vendor registrations.

## Buyer RFQ and Visit China forms

The contact RFQ (`/contact`, homepage hero on the v1 layout) and Visit China form (`/visit`) **persist**. Fake client-only success states are gone.

- `POST /api/rfq` — public. `multipart/form-data` (preferred) or JSON. Required: `name`, `whatsapp` (or `phone`), `description` (min 8 chars). Optional: `email`, `quantity`, `budget`, `sourcePath`, files (`files`, max 4, 6MB, images/PDF/Excel/CSV). Honeypot: `website_url`.
- `POST /api/visit-inquiries` — public JSON. Required: `name`, `email`, `phone`, `startDate`.
- `GET` on both routes is admin-session only (same cookie as `/dashboard`).

Records: `/data/inquiries.json` (same `DATA_DIR` / `ANALYTICS_DATA_DIR` pattern; fallback `/tmp/sourcing-analytics`). Optional RFQ uploads: `/data/rfq-uploads/{id}/`. If a file write fails, the text inquiry still saves.

Ops notify reuses `FACTORY_NOTIFY_WEBHOOK` / `FACTORY_NOTIFY_EMAIL` / `RESEND_API_KEY`. Best-effort; never fails the public form. Logs `[inquiries-notify]`.


