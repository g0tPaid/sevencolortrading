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


