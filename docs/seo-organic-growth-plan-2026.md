# sourcing.center — SEO & organic growth plan

**Status:** audit complete. **No site-wide or UI changes in this PR.**  
**Date:** 15 Sep 2026  
**Live crawl:** 46 sitemap URLs, all HTTP 200  
**Goal KPI:** qualified organic RFQs / sourcing inquiries — not pageviews or article count.

This document is the Days 1–7 deliverable. Major page work, URL changes, new landing pages, and claim/copy on money pages wait for human approval.

---

## 0. Data availability (do not guess)

| Source | Status |
| --- | --- |
| Live crawl of sitemap + HTML (titles, H1, word count, schema, redirects) | **Done** |
| Codebase (forms, reviews, case studies, metadata) | **Done** |
| Live SERP sampling for money queries (web search, 15 Sep 2026) | **Done (page-1 composition, not rank tracking)** |
| Google Search Console (clicks, impressions, CTR, queries, countries) | **DATA REQUIRED** |
| Google Analytics / organic RFQ attribution | **DATA REQUIRED** (site has first-party `/dashboard` pageviews, not GSC) |
| Ahrefs / Semrush volumes, KD, backlinks | **DATA REQUIRED** |
| PageSpeed Insights / CrUX Core Web Vitals | **DATA REQUIRED** (public PSI API quota exhausted this run) |
| Bing Webmaster | **DATA REQUIRED** |
| Production RFQ → lead conversion | **DATA REQUIRED** — and the public RFQ form currently does **not persist or send** (see §8) |

Until GSC is connected, “current ranking” in the keyword map is **unknown**. SERP sampling is enough to say sourcing.center was **not on page 1** for the money queries listed in §5.

**Access needed next:** Search Console property `https://sourcing.center` (or domain property), 16-month export of Queries + Pages + Countries. Optional: Ahrefs site explorer for competitors `jingsourcing.com`, `leelinegroup.com`, `supplyia.com`, `guidedimports.com`, `sourcingallies.com`.

---

## 1. Audit summary (what is actually true)

### What is already strong

- Indexable: `robots.txt` allows `*` and major AI crawlers; sitemap at `/sitemap.xml`; www → apex 301; `/inspect` `/qc` `/fba` `/dropship` redirect to canonicals.
- Unique titles, descriptions, canonicals, OG/Twitter on marketing routes; one H1 on HTML pages.
- Legitimate schema: Organization, WebSite, LocalBusiness/Warehouse (Xiamen + Al Ain), Service/Offer on several service pages, FAQPage on FAQ and several knowledge/compare pages. **No fake AggregateRating.**
- Real differentiators competitors mostly lack: **operator-owned 3PL (Xiamen + Dubai / Al Ain)**, **DUNS 509419282**, published China + UAE licenses, **USD 110/day inspection**, NDA-first OEM, Visit China hosted from Xiamen, `llms.txt` for AI citation.
- Deep pages that already exist: homepage (~3.2k words of on-page copy), `/faq`, `/inspection`, `/amazon-fba`, `/knowledge/how-to-source-from-china`, `/knowledge/china-quality-inspection-guide`, `/factory-growth` (bilingual factory-facing), `/news`.
- Homepage TTFB from this crawl: **~110 ms** (server is not the bottleneck).

### What is blocking rankings and leads

1. **The money query is not on a money page.** Title targets “China Sourcing Agent”; the H1 is “One Platform for Product Ideation & Sourcing.” Google and AI overviews reward H1/body that match the query. Brand-platform H1 fights the title.
2. **No 1688 page anywhere** (zero `1688` strings in `src/`). JingSourcing, YoungSourcing, SoSourcing, Goodcan, Woosourcing all own this cluster. That is a commercial gap, not a blog gap.
3. **Thin commercial shells** (~320–360 words, one H2): `/factory-verification`, `/industries` (cards, no URLs), `/how-it-works`, `/private-label`, and four knowledge stubs (`how-to-write-an-rfq`, `factory-audit-checklist`, `incoterms-for-gcc`, `private-label-packaging`).
4. **Industry slugs exist in data (`electronics`, `fashion`, …) but have no routes.** Do not auto-publish doorway pages; only build where capability is real.
5. **English/Chinese architecture is incomplete.** Buyer site is English. Bilingual switchers exist only on `/factory-growth` and `/news`. No site-wide hreflang. Do not auto-translate the buyer site.
6. **Authority gap:** sourcing.center does not appear in 2026 “best China sourcing agent” roundups sampled (HiSourcing top 15, CJDropshipping 30). JingSourcing/Supplyia/Leeline/Guided Imports do.
7. **Proof is conservative by design** (correct legally) but weak for SERP trust: reviews are first-name notes with `approved: false`; case studies are labeled example engagements. Fine — do not invent. Unlock **approved** named proof when the desk clears it.
8. **RFQ and Visit forms do not submit to a server.** They `preventDefault` and show a success state. WhatsApp is the only real lead path. This is the highest-ROI fix and is not a UI redesign.

### Homepage vs contact (intent collision)

| URL | Title (good) | H1 (weaker for query) |
| --- | --- | --- |
| `/` | China Sourcing Agent — Visit China, Own 3PL Warehouses | One Platform for Product Ideation & Sourcing |
| `/contact` | China Factory Sourcing — No MOQ and Photo/Video QC | Talk to a relationship manager |
| `/compare` | Compare China Sourcing Agent… | Straight answers, not catalog copy |
| `/factory-verification` | China Factory Verification… | Know the factory before you fund production |
| `/how-it-works` | How China Factory Sourcing Works | A controlled path from inquiry to door delivery |

Copy-level H1 alignment (not a redesign) is a Days 8–14 job after approval.

---

## 2. Site inventory (crawl)

| Path | Words (approx) | Notes |
| --- | --- | --- |
| `/` | 3251 | Strong body; H1 mismatch |
| `/inspection` | 953 | Best commercial service page |
| `/amazon-fba` | 1153 | Strong FBA private-label page |
| `/contact` | 680 | Actual sourcing request URL; H1 is “talk to RM” |
| `/3pl` `/dropshipping` `/logistics` `/visit` | 720–770 | Solid service pages |
| `/oem-odm` | 608 | Exists; no separate OEM vs ODM URLs |
| `/factory-verification` | 325 | **Thin money page** |
| `/industries` | 346 | Six cards, no child URLs |
| `/how-it-works` | 356 | Timeline only |
| `/private-label` | 348 | Overlaps OEM + FBA |
| `/knowledge/how-to-source-from-china` | 1851 | Best informational asset |
| `/knowledge/china-quality-inspection-guide` | 1541 | Best QC asset |
| Other knowledge (3PL/visit/company) | 610–720 | OK supporting |
| Four knowledge stubs | 340–354 | Template bullets — expand or noindex later (do not noindex without approval) |
| `/compare/*` (3) | 675–694 | Agent vs Alibaba exists; **no vs 1688** |
| `/case-studies/*` (3) | 475–501 | Example engagements |
| `/news` + 3 posts | live | Hub exists; not a substitute for money pages |
| `/factory-growth` | 2616 | Factory-facing ZH/EN — separate audience |

**Orphans / weak internal links:** `/updates` is a pointer list; `/news` is in footer + mobile only; industry cards do not link out; knowledge stubs barely interlink to `/inspection` and `/contact`.

---

## 3. Commercial keyword map

Demand and competition below are **qualitative from SERP composition**, not tool volumes. Replace with GSC/Ahrefs when available.

**Legend:** intent T = transactional, CI = commercial investigation, I = informational, R = regional. Priority = Business + Organic + Commercial + Ranking opportunity + Ease (each 0–10).

| Keyword | Intent | Topic | Commercial | Demand (est.) | Comp | Current rank | Target URL | Exists? | Gap | Priority | Country | Lang | Conv. |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| china sourcing agent | T | Core | 10 | High | High | **DATA REQUIRED** (not p1 in sample) | `/` (H1) or `/china-sourcing-agent` | Partial | H1/body | 46 | Global | EN | High |
| china sourcing company | T | Core | 10 | High | High | DATA REQUIRED | `/` + `/about` + `/knowledge/china-sourcing-company-xiamen-dubai-3pl` | Partial | Entity page | 42 | Global | EN | High |
| china factory sourcing | T | Core | 9 | Med-High | Med | DATA REQUIRED | `/contact` | Partial | H1 | 44 | Global | EN | High |
| china sourcing services | T | Core | 8 | Med | Med | DATA REQUIRED | `/services` | Yes thin-mid | Depth | 38 | Global | EN | Med |
| china procurement company | T | Core | 8 | Med | Med | DATA REQUIRED | `/contact` or `/procurement` | No dedicated | New only if desk confirms corp procurement | 36 | Global | EN | High |
| china sourcing agent vs alibaba | CI | Platforms | 9 | High | Med | DATA REQUIRED | `/compare/sourcing-agent-vs-alibaba` | **Yes** | Expand 1688 + fees | 43 | Global | EN | High |
| china sourcing agent vs 1688 | CI | Platforms | 9 | High | Med | n/a | `/compare/sourcing-agent-vs-1688` | **No** | New compare | 45 | Global | EN | High |
| 1688 sourcing agent | T | Platforms | 10 | High | High | n/a | `/1688-sourcing` | **No** | New money page | 47 | Global | EN | High |
| how to buy from 1688 | I | Platforms | 7 | High | High | n/a | `/knowledge/how-to-source-from-1688` | **No** | Cluster | 40 | Global | EN | Med |
| best china sourcing agent | CI | Core | 9 | High | High | n/a | `/` + future “how to choose” | No listicle | Criteria page, not “we’re #1” | 39 | Global | EN | High |
| china sourcing agent cost | CI | Core | 9 | Med-High | Med | n/a | `/knowledge/china-sourcing-agent-cost` | **No** | Must not invent fees | 41 | Global | EN | High |
| how to source products from china | I | Sourcing | 8 | High | High | DATA REQUIRED | `/knowledge/how-to-source-from-china` | **Yes** | SERP-upgrade (tables, landed cost, 1688) | 44 | Global | EN | Med-High |
| how to find a chinese factory | I | Factories | 8 | High | High | DATA REQUIRED | `/knowledge/how-to-find-a-chinese-factory` | **No** | New; link `/factory-verification` | 41 | Global | EN | High |
| china supplier verification | T | Factories | 9 | Med-High | Med | DATA REQUIRED | `/factory-verification` | Thin | Expand to money page | 46 | Global | EN | High |
| china factory verification | T | Factories | 9 | Med | Med | DATA REQUIRED | `/factory-verification` | Thin | Same URL | 45 | Global | EN | High |
| china quality inspection | T | QC | 9 | High | High | DATA REQUIRED | `/inspection` | **Yes** | Title/H1 + AQL snippet | 44 | Global | EN | High |
| pre-shipment inspection china | T | QC | 8 | Med-High | High (SGS/QIMA) | DATA REQUIRED | `/inspection` | Partial | Section + FAQ | 40 | Global | EN | High |
| china 3pl | T | Logistics | 8 | Med | Med | DATA REQUIRED | `/3pl` | **Yes** | Keep; unique “own warehouse” | 42 | Global/GCC | EN | High |
| amazon fba sourcing from china | T | FBA | 9 | High | High | DATA REQUIRED | `/amazon-fba` | **Yes** | Keep; add prep checklist | 42 | US | EN | High |
| oem manufacturing china | T | OEM | 8 | High | High | DATA REQUIRED | `/oem-odm` | Partial | Split OEM vs ODM later | 38 | Global | EN | High |
| no moq china manufacturers | CI | Core | 8 | Med | Med | DATA REQUIRED | `/contact` + knowledge | Claim exists | Dedicated explainer | 40 | Global | EN | High |
| china sourcing agent usa | R | Regional | 8 | Med | Med | n/a | `/sourcing-for/usa` **only if unique** | No | Do not clone | 32 | US | EN | High |
| china sourcing agent uae | R | Regional | 9 | Med | Low-Med | n/a | `/sourcing-for/uae` | No | Dubai warehouse is real differentiation | 41 | UAE | EN | High |
| china sourcing agent saudi arabia | R | Regional | 8 | Med | Low-Med | n/a | `/sourcing-for/saudi-arabia` | No | Incoterms GCC page exists (thin) | 38 | SA | EN | High |
| 中国采购代理 / 验厂 | T | Core | 7 | Med | High | n/a | Not a translated clone of `/` | No buyer ZH | Separate ZH IA later | 28 | CN/TW | ZH | Med |

Full machine table: [`seo-keyword-map-2026.csv`](./seo-keyword-map-2026.csv).

---

## 4. Competitor gap (sampled SERPs, not copied)

| Competitor | What they win with | Gap vs sourcing.center |
| --- | --- | --- |
| **JingSourcing** | Exact-match pages: `/1688-agent/`, Alibaba how-to, inspection vs 3PL companies, pricing page, product-category pages, US phone, “4000+ clients” | 1688 + Alibaba clusters; public fee model; roundup presence. **Do not copy client counts or “#1”.** |
| **LeelineGroup / LeelineSourcing** | Consultant positioning, OEM/ODM, published social proof (reviews widget), “brands spending $200k+” | Corporate procurement language; review widgets. We have D&B + licenses instead — lean into that, don’t fake stars. |
| **Supplyia** | Yiwu mixed-SKU, FBA, published entities (Yiwu + HK) | Mixed-SKU consolidation story. We can tell **own-warehouse consolidation in Xiamen/Dubai** instead. |
| **Guided Imports** | US-run, FBA prep + freight content depth | FBA shipping guides. We have `/amazon-fba` — add China→FBA logistics sections, not a clone. |
| **Sourcing Allies** | Western-owned OEM/engineering, fee-explainer blog | “How to choose an agent” + OEM complexity. Fits Visit China + NDA OEM. |
| **ChinaSource Pro / MFE / Goodcan** | Homepage H1 = “China sourcing agent”; invoice transparency; fee vs kickback | **H1/query alignment.** Our proof should be license + warehouse + photo QC, not invented kickback exposés. |
| **AQI / HQTS / QIMA / SGS** | Own “inspection” SERP | Don’t compete as a global TIC brand. Compete as **desk-tied inspection at USD 110/day + 3PL inbound**. |

**Keywords they rank for that we do not cover with a URL:** 1688 sourcing agent; how to buy from 1688; sourcing agent cost/fees; best sourcing agent (criteria); factory vs trading company; landed cost from China; shipping to USA/UAE/Amazon FBA as dedicated guides; electronics/furniture/bags industry URLs.

---

## 5. Twenty highest-value ranking opportunities

Scored as specified (sum of five 0–10 factors). Highest first.

| # | Action | BV | Org | Comm | Rank | Ease | Score | Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Make RFQ + Visit forms actually deliver leads (API/email/WhatsApp), keep current UI | 10 | 6 | 10 | 5 | 9 | **40** | Conversion / technical |
| 2 | Expand `/factory-verification` into the supplier/factory verification money page | 9 | 8 | 9 | 8 | 7 | **41** | On-page |
| 3 | New `/1688-sourcing` (only if desk actually buys 1688 / pays RMB) | 9 | 9 | 10 | 8 | 5 | **41** | New URL — **REQUIRES CONFIRMATION** |
| 4 | Align homepage H1 + first screen to “China sourcing agent” **without layout redesign** | 9 | 9 | 10 | 8 | 7 | **43** | Copy |
| 5 | SERP-upgrade `/knowledge/how-to-source-from-china` (tables, 1688 vs Alibaba, landed cost, checklist) | 8 | 9 | 7 | 8 | 7 | **39** | Content |
| 6 | Align `/contact` H1 to factory sourcing; keep form | 9 | 7 | 10 | 7 | 8 | **41** | Copy |
| 7 | New compare: sourcing agent vs 1688 (mirror existing vs Alibaba) | 8 | 8 | 9 | 8 | 7 | **40** | New URL |
| 8 | Strengthen `/inspection` for “China quality inspection” / PSI / AQL snippets | 8 | 8 | 9 | 7 | 7 | **39** | On-page |
| 9 | Cost explainer (ranges + models only; **no fake price list**) | 8 | 8 | 9 | 7 | 5 | **37** | Content — **REQUIRES FEE MODEL CONFIRMATION** |
| 10 | Internal links: knowledge ↔ inspection/3pl/contact/visit; footer already has News | 7 | 8 | 6 | 7 | 8 | **36** | Internal linking |
| 11 | `/amazon-fba` + China→FBA logistics section (unique vs Guided Imports) | 8 | 7 | 8 | 7 | 6 | **36** | On-page |
| 12 | UAE/GCC regional page using real Dubai warehouse + Incoterms (not a USA clone) | 8 | 7 | 8 | 6 | 5 | **34** | New URL |
| 13 | Expand how-to-find-a-factory + factory vs trader | 7 | 8 | 7 | 7 | 6 | **35** | Content |
| 14 | “How to choose a China sourcing agent” criteria page (no “we’re #1”) | 7 | 8 | 8 | 6 | 6 | **35** | Content |
| 15 | Landed-cost checklist or calculator (lead magnet / links) | 7 | 8 | 7 | 6 | 5 | **33** | Tool |
| 16 | Expand `/oem-odm` and `/private-label` instead of new thin URLs | 7 | 7 | 8 | 6 | 6 | **34** | On-page |
| 17 | GSC quick wins (positions 4–20) once data exists | 8 | 9 | 8 | 9 | 8 | **42** | **Blocked on GSC** |
| 18 | Approve 1–3 real case studies / review permalinks | 9 | 6 | 8 | 5 | 3 | **31** | Proof — **REQUIRES DESK** |
| 19 | One industry page **only** if a real category specialist exists (start: hospitality/GCC or electronics — pick one) | 7 | 7 | 7 | 6 | 4 | **31** | New URL — **REQUIRES CONFIRMATION** |
| 20 | Digital PR / genuine roundup inclusion (not PBNs) | 6 | 8 | 6 | 7 | 3 | **30** | Links |

Priority 4’s component scores sum to 43 if H1 change is approved; it is the highest **ranking** on-page action. Priority 1 is the highest **lead** action even if it does not move rankings.

---

## 6. Ten fastest SEO wins (Days 8–21, after approval)

Copy and metadata only unless noted. No layout redesign.

1. **Wire RFQ + Visit forms** to the same notify path as factory applications (or email/WhatsApp). Current success state is false.
2. **Homepage H1** to match the already-good title (China sourcing agent + 3PL/visit proof). Keep glass hero; change words.
3. **`/contact` H1** → factory sourcing / start an RFQ (title already says this).
4. **`/factory-verification`:** add process, GSXT/license check language the desk already uses, capacity, trader-vs-factory, FAQ JSON-LD, link to `/inspection` and `/visit`.
5. **`/inspection`:** add a 40–60 word definition block for snippet (“China quality inspection is…”), AQL table, PSI vs DUPRO vs loading — much of this already lives in the knowledge guide; **internally link both ways**.
6. **How-to-source guide:** add comparison table Alibaba vs 1688 vs desk; link `/compare/sourcing-agent-vs-alibaba`; add “next step: RFQ”.
7. **Four knowledge stubs:** either expand to 800+ useful words with checklists **or** fold into the two strong guides. Do not leave doorway stubs.
8. **Title/H1 alignment** on `/how-it-works`, `/compare` index, `/services` — keep unique titles, make H1 describe the query.
9. **Internal links from homepage + FAQ** to `/inspection`, `/3pl`, `/amazon-fba`, `/factory-verification`, `/knowledge/how-to-source-from-china` with natural anchors.
10. **Connect Search Console** and export 16 months. That unlocks real quick wins (positions 4–20) and makes this plan measurable.

---

## 7. Ten largest content gaps

1. **1688 sourcing agent** (entire cluster missing).
2. **Sourcing agent vs 1688** (vs Alibaba exists).
3. **Agent cost / fee models** (competitors publish 5–10% or retainers; we must not invent — desk must state how sourcing.center charges).
4. **How to find / verify a factory** as a guide (verification page is a 325-word list).
5. **Factory vs trading company**.
6. **Landed cost from China** (calculator or worked example).
7. **How to buy from 1688 outside China**.
8. **Regional pages with real differences** (UAE/GCC first; USA/UK only if shipping/customs content is unique).
9. **Industry URLs** (data model has categories; no pages).
10. **Chinese-language buyer pages** (not factory-growth). Only after EN money pages convert.

Do **not** fill gaps with AI clones of JingSourcing.

---

## 8. Ten largest conversion problems

1. **RFQ form does not send.** `src/components/home/rfq-form.tsx` `onSubmit` only `setSent(true)`. Files never leave the browser. Used on `/contact` and homepage `#rfq` if present.
2. **Visit form same pattern** (`china-visit-form.tsx`). User is told “request received.”
3. Primary homepage CTA goes to `/contact`, which then uses the same non-submitting form. WhatsApp float is the real funnel — **good**, but the form competes with it dishonestly.
4. Extra RFQ fields (quantity, budget, email, photo) are hidden behind “add extra fields” — photo-first funnel is almost there and unused.
5. Homepage H1 does not say the job the buyer searched (“sourcing agent”).
6. `/industries` cannot convert by industry (no path, no CTA per card beyond page-level band).
7. Reviews/case studies are explicitly examples — correct, but SERP competitors show volume social proof. Unlock approved quotes rather than inventing.
8. No public fee/transparency block (competitors use this to win CI queries). **REQUIRES SOURCING.CENTER CONFIRMATION** of fee model.
9. Desktop nav omits News and omits a single “Sourcing” money item (3PL/Inspection/FBA are listed — good for those services, weak for “agent”).
10. No GSC/GA4 → RFQ attribution, so organic lead KPI cannot be managed. **DATA REQUIRED.**

---

## 9. Technical SEO (fix high-impact first)

| Item | Finding | Action |
| --- | --- | --- |
| Indexability | Allow all; sitemap 46 URLs including `/news` posts | Keep |
| Canonicals | Present, apex | Keep |
| Hreflang | Only news + factory-growth | Do not fake hreflang for EN-only pages |
| Duplicate | Service vs knowledge overlap (3PL, visit, inspection, dropship) | Differentiate: service = hire us; knowledge = how-to. Cross-link, don’t merge yet |
| Thin | See §1 | Expand or combine |
| JS | H1 on homepage is client-rendered in React but present in SSR HTML (crawl saw it) | OK |
| Images / alt | D&B logo has alt; **DATA REQUIRED** for full image audit | Later |
| CWV | **DATA REQUIRED** | Run PSI in GSC |
| Sitemap homepage | Included as `https://sourcing.center` | OK |
| llms.txt | Strong AI-search asset | Keep updated when money pages ship |

**Do not** noindex knowledge stubs, change URLs, or delete pages without approval.

---

## 10. 90-day execution plan (money pages first)

### Days 1–7 (this document)

- Crawl, SERP sample, competitor gaps, keyword map, conversion audit.
- **Blocked:** GSC, PSI, backlink metrics.

### Days 8–30 (foundations — approve before build)

1. **Lead plumbing:** persist RFQ + visit + optional photo to `/data` or email/webhook (mirror factory-applications). Keep existing fields/UI.
2. **Copy alignment:** homepage H1, contact H1, verification/how-it-works H1s.
3. **Turn `/factory-verification` into a real money page.**
4. **Upgrade the two strong knowledge guides** (source from China; inspection) to beat Woosourcing/QIMA-style SERPs — tables, checklists, desk process, CTAs.
5. **1688:** only after desk confirms the service. If yes: `/1688-sourcing` + compare vs 1688. If no: do not publish.
6. **Internal linking pass** (no nav crowding).
7. **One tool:** RFQ template download or landed-cost spreadsheet (no fake calculator math).
8. Connect GSC. Baseline branded vs non-branded.

**Do not** in month 1: 12 industry pages, 8 country clones, daily AI articles, or a site redesign.

### Days 31–60

- One GCC/UAE page with real warehouse/customs differences.
- Expand OEM/ODM and FBA pages.
- Agent-cost page if fee model is cleared.
- Factory vs trader + find-a-factory guide.
- CTR tests on titles **after** GSC baseline (high impressions, low CTR).
- Begin legitimate outreach: trade/logistics publishers, not directories.
- **REQUIRES DESK:** 1 approved case study.

### Days 61–90

- Double down on URLs that gained impressions.
- One industry page if capability is confirmed.
- Update decaying pages rather than adding twins.
- Link acquisition from the tool/checklist.
- Re-run competitor SERP sample; adjust map.
- Still no “we’re #1 in China.”

---

## 11. Publishing rules for this program

- SERP-first: open the live results before writing.
- No fabricated customers, savings, certifications, or rankings.
- Chinese pages: native, not machine-cloned English.
- Programmatic SEO: country/industry only with unique logistics/category substance.
- Human approval required before: new money URLs, fee claims, case studies, URL deletes, homepage H1 (brand-facing), 1688 service claims.

---

## 12. Next 7 days (exact)

1. **Human:** Connect Google Search Console; export Queries + Pages.
2. **Human:** Confirm whether the desk sources 1688 / pays RMB for overseas buyers.
3. **Human:** Confirm fee model that can be published (commission vs project vs hybrid) — or confirm “quoted per RFQ only.”
4. **Human:** Approve fixing RFQ + Visit persistence (no UI redesign).
5. **Human:** Approve homepage + contact H1 copy direction (keyword-aligned vs current brand-platform H1).
6. **Human:** Pick **one** industry that is genuinely served for a future page (or defer).
7. After approvals: implement items 1–2 in Days 8–14 on a separate PR.

---

## 13. What this PR does not do

- No UI redesign, no new landing pages shipped, no articles published, no title/H1 changes live.
- No merge of this strategy into production behavior.

The flywheel to build toward:

**Google query → useful answer → D&B / warehouse / inspection proof → RFQ that actually arrives → customer → approved case study → higher rankings.**
