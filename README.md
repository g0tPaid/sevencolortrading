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

