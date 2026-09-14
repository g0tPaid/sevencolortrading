# sourcing.center — Procurement registration workspace

**Confidential — internal use.** Not linked from the public site. Next session: read this file first, then `session-log.md` and `database.json`. Do not repeat completed research.

## Status (session 7)

| Phase | Status |
| --- | --- |
| Inspect project / documents | China license + passport + bank facts in gitignored vault |
| Company profile | License facts beat website copy (`china-company-field-map.md`) |
| Document index | License indexed; passport and bank numbers local only |
| Procurement database | **50 targets** researched and scored |
| Registrations started | **Emirates epic** — registration phase complete; pending email activation |
| Registering entity | **LOCKED: Chinese company** (`registering-entity.md`) |
| RFQ monitoring | Not started |

## Source of truth

1. Approved documents (China license in gitignored `vault/`; facts indexed in `document-index.md`)
2. Published site content in `src/lib/content.ts` and `public/llms.txt`
3. Official buyer portals verified by domain (`.gov.ae`, `.gov.sa`, company TLD)

If a portal field is not in (1) or (2): **UNKNOWN — OWNER APPROVAL REQUIRED**. Do not guess.

## Do not do without owner approval

- **Supplier policies / codes of conduct:** owner standing order 2026-09-14 — **tick all**
- Upload **passport / ID** (still per-portal)
- Pay portal or tender **fees**
- Submit quotes / tenders
- Send outreach emails (drafts only)
- Invent ISO (employees now locked at 0–10)

Bank account **numbers** live only in gitignored `vault/bank-accounts.md` (this GitHub repo is public).

## File map

| File | Purpose |
| --- | --- |
| `company-profile.md` | Verified vs unknown fields |
| `document-index.md` | Vault index |
| `missing-information.md` | What the owner must provide |
| `descriptions.md` | Approved copy variants (from published site) |
| `database.json` | Machine-readable target DB |
| `targets.md` | Ranked human table + next actions |
| `registration-gates.md` | First-wave portals and stop reasons |
| `session-log.md` | Session history |
| `registering-entity.md` | Locked: Chinese company + MoF branch warning |
| `china-company-field-map.md` | Exact fields we may type on portals |
| `emirates-epic.md` | Live Emirates form state + policy summaries |
| `etimad.md` | Live Etimad foreign-supplier registration |
