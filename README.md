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

## Factory application alerts

When a factory submits `/factories/register`, the application is **always saved**. Ops notify is best-effort and must not fail the public form.

Railway / production env (all optional):

- `FACTORY_NOTIFY_WEBHOOK` — `POST` JSON (`text` + `application`) to Slack, Discord, Make, or a WhatsApp automation
- `FACTORY_NOTIFY_EMAIL` — recipient address for the ops alert
- `RESEND_API_KEY` — required to actually send the email (https://api.resend.com/emails)
- `FACTORY_NOTIFY_FROM` — optional From address (defaults to `info@sevencolor.online`)

If a notify call fails, the API still returns `{ ok: true }` and logs `[factory-notify]`.

Factory international-presence inquiries from `/factory-growth` are stored in the same applications file with `sourcePath: "/factory-growth"` and use the same notify channels. They are not vendor registrations.


