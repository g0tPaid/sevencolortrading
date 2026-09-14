# sourcing.center — Procurement registration workspace

**Confidential — internal use.** Not linked from the public site. Next session: read this file first, then `session-log.md` and `database.json`. Do not repeat completed research.

## Status (session 1)

| Phase | Status |
| --- | --- |
| Inspect project / documents | Done — **no uploaded company documents found** |
| Company profile | Draft from **published site facts only** |
| Document index | Created — vault is empty |
| Procurement database | **50 targets** researched and scored |
| Registrations started | **None** — blocked on documents + owner approval |
| RFQ monitoring | Not started — no portal logins yet |

## Source of truth

1. Approved documents (none in repo yet)
2. Published site content in `src/lib/content.ts` and `public/llms.txt`
3. Official buyer portals verified by domain (`.gov.ae`, `.gov.sa`, company TLD)

If a portal field is not in (1) or (2): **UNKNOWN — OWNER APPROVAL REQUIRED**. Do not guess.

## Do not do without owner approval

- Accept terms, codes of conduct, or legal declarations
- Upload licenses, IDs, bank letters, or financials
- Pay portal or tender fees
- Submit quotes / tenders
- Send outreach emails (drafts only)

## File map

| File | Purpose |
| --- | --- |
| `company-profile.md` | Verified vs unknown fields |
| `document-index.md` | Vault index (empty) |
| `missing-information.md` | What the owner must provide |
| `descriptions.md` | Approved copy variants (from published site) |
| `database.json` | Machine-readable target DB |
| `targets.md` | Ranked human table + next actions |
| `registration-gates.md` | First-wave portals and stop reasons |
| `session-log.md` | Session history |
