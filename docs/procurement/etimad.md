# Etimad — live registration (T009)

**Official login:** https://login.etimad.sa/Account/Login?culture=en  
**Official portal:** https://portal.etimad.sa/en-us/  
**Path:** “New Account for No CR entities of the type foreign supplier” → `/Suppliers/CreateInstitution`  
**Status:** **BLOCKED from this cloud IP.** Form not filled. No account created. No documents uploaded. No fee.

## What we verified

- Domain **etimad.sa** is the official Saudi Ministry of Finance platform (DGA banner).
- Foreign / no-CR registration exists and is the correct path for the Chinese company (no Saudi CR, no Nafath).
- FAQ: users outside KSA log in with username/password; a Saudi regional HQ is **not** required just to use the platform (some later services may require it).
- Clicking **New Account** opens `https://login.etimad.sa/Suppliers/CreateInstitution`.
- That URL is rejected by the platform WAF (F5): “The requested URL was rejected / الوصول لهذه الصفحة غير مسموح به”. Support ID example: `3112896272736700339`. Contact: Etimad **19990**.
- Same reject from this datacenter via curl and from the browser agent. This is an IP/WAF filter, not a missing field.

## Owner action (residential / office browser)

From China or UAE, open the login URL above, complete **Verify you are human** (Cloudflare), then click **New Account** for foreign / no-CR. If the form opens, type the China field map (`china-company-field-map.md`). If you still see the reject page, call **19990** with the Support ID on screen.

Do **not** use Nafath. Do **not** pay Sadad / tender fees / any “1500 SAR subscription” without saying so here. Do **not** upload the passport.

## If the form opens — type these

| Field | Value |
| --- | --- |
| Legal name | XIAMEN AJMAL SEVEN COLOR TRADING CO., LTD |
| Country | China |
| Address | Room 208 (Area B), No. 10-2, Yuehua Road, Xiamen Area of China (Fujian) Pilot Free Trade Zone |
| License / USCC | 91350200MAE8W9E67A |
| Established | 6 January 2025 |
| Legal representative | AJMAL ABDUL JABBAR AHAMED |
| Email | info@sevencolortrading.com |
| Mobile | +86 180 5926 2730 |
| Website | https://sourcing.center |
| Employees | 0–10 |
| Turnover (USD) | 150000 |
| Username if asked | ajmal.sevencolor |
| License file | English scan only |
| Bank | USD Bank of China Xiamen (numbers in gitignored vault) |

Reply here with a screenshot if the form opens, or **yes** to start **NEOM** while Etimad waits on a non-cloud IP.
