# Seven Color Trading (v2)

Modern sourcing website for **[sevencolortrading.com](https://sevencolortrading.com)** — version two of the Seven Color China sourcing brand.

Content and business details were pulled from the live Seven Color site (`sevencolor.online`; `sevencolor.info` did not resolve in this environment). Contact already lists `info@sevencolortrading.com` for SMEs.

## Stack

- Next.js 15 (App Router)
- Tailwind CSS 4
- Framer Motion / Lucide

## Pages

- `/` — hero, how it works, categories, why us, testimonials, CTA
- `/about` — mission, vision, offices, stats
- `/services` — services + categories
- `/quote` — WhatsApp quote form
- `/contact` — offices, phones, WhatsApp contact form

## Develop

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```

Point `sevencolortrading.com` at the Railway / host deploy of this repo.
