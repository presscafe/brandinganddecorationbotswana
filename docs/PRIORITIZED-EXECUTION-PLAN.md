# PRIORITIZED EXECUTION PLAN — Branding & Decoration Botswana

**Date:** 29 October 2026 · **Author:** collective senior review (commercial, ops, finance, compliance, tech)
**Tone:** critical, not cruel. Every “no” is a cheaper “yes” later.
**Location context:** Jwaneng, Botswana — mining & contractor market adjacent; Gaborone is the commercial hub.

> **The one-line verdict:** you have a strong thesis, a clever prototype, and **zero evidenced revenue**. Until four real jobs are costed from written supplier quotations, every number in `04` and every price in `store/` is a story. The highest-ROI work in the next 30 days is **validation, not building**.

---

## 0. What is actually blocking you (honest)

| # | Brutal truth | Why it kills you if ignored |
|---|---|---|
| 1 | **No verified landed cost.** Catalogue costs are “modelled placeholders.” You cannot quote a mine or a tender with fake numbers without reputational suicide. | You lose the first serious buyer forever. |
| 2 | **No trade account.** Without Amrod Botswana (or equivalent) you have no product margin and no credit. | You are a print shop, not a programme partner. |
| 3 | **Prototype shows placeholder contact** (`quotes@example.co.bw`, empty WhatsApp). | A procurement officer who clicks “Send on WhatsApp” and gets a dead end will not return. |
| 4 | **No privacy/terms, no licence, no SEO fundamentals.** The store loads but is invisible to Google and untrustworthy to a compliance-minded buyer. | You cannot be found; when found, you cannot be trusted. |
| 5 | **Cash-cycle ignorance.** Government and mines pay 45–90 days. Without a written credit policy and a facility plan, one P180k order will bankrupt you. | R1 in the risk register — exposure 20/25. |
| 6 | **Counterfeit/compliance risk.** Selling uncertified PPE or garments without BOBS CoC is an ethical and legal landmine. | One injury, one exposed certificate gap, and the brand is dead. |

**What is NOT blocking you:** a new framework, a new brand name, a fancy dashboard, regional expansion, or an Astro migration. All deferred.

---

## 1. The re-prioritised backlog (expert weighted)

Original 37 items (`08-backlog.csv` / PRE-12→48) are correct but in **phase order**, not **risk order**. Below is the same work re-sequenced by *“what kills revenue or trust if not done first.”*

### TIER 0 — DO THIS WEEK (blocks everything else) — P0

| Rank | ID | Task | Effort | Why P0 |
|---|---|---|---|---|
| 1 | **BDB-007** | Verify corporate tax (22→24.5%?), VAT treatment, BOBS CoC obligations | 5d | Every price, every margin, every import assumption is wrong until this is written. Get auditor + clearing agent in writing. |
| 2 | **BDB-005** | Cost four real client jobs end-to-end from live quotations | 10d | Converts `04` from estimate to evidence. Do this even before all trade accounts are open — use live retail quotes if needed. |
| 3 | **BDB-001** | Amrod Botswana trade account | 3d | Primary supply margin. Apply this week with CIPA + VAT docs. |
| 4 | **BDB-002** | Second source (Barron / ProBrand tier) | 3d | No single-supplier risk; benchmark price. |
| 5 | **BDB-020** | Write credit policy & receivables controls | 5d | 50% deposit rule, credit limits, max receivables. Written, signed, enforced from order #1. |
| 6 | **DIGITAL-P0** | Fix prototype trust killers (this commit) | 0.5d | Privacy, terms, licence, OG/JSON-LD, robots/sitemap, headers — done 29 Oct (see below). Replace `WHATSAPP_NUMBER`/`EMAIL` before any outreach. |

**Exit gate for Tier 0:** you can show a buyer a quote built from a written supplier price, with correct VAT/duty, a validity date, and a certificate reference — and you know whether you made 28%+.

### TIER 1 — BUILD THE MINIMUM COMMERCIAL MACHINE (Weeks 2–4) — P1

| Rank | ID | Task | Effort |
|---|---|---|---|
| 7 | BDB-010 | Deploy store to Cloudflare Pages on real domain | 2d |
| 8 | BDB-011 | Replace 60 SKUs with verified costs in `catalogue.json` | 7d (after BDB-005) |
| 9 | BDB-022 | Certificate-per-SKU register (per-SKU proof pack ≤4 min) | 10d |
| 10 | BDB-014 | Google Business Profile — verify, 10 photos, review engine | 2d |
| 11 | BDB-015 | WhatsApp Business catalogue + quick replies + opt-in list | 2d |
| 12 | BDB-008/009 | PPRA IPMS + supplier codes + standing tender pack | 10d |
| 13 | BDB-012 | CRM pipeline + follow-up cadence (D2/D7/D14) | 3d |
| 14 | BDB-017 | Partner subcontract + QC annexure (lawyer-reviewed) | 7d |
| 15 | BDB-019 | First 5 SOPs (SOP-01..05 done 29 Oct; SOP-06 done 29 Oct; SOP-07..10 next) | 15d |

**Exit gate:** site live on HTTPS with real contact, GBP verified, tender desk ready, certificate register started, 3–5 partners under written terms.

### TIER 2 — PROVE REPEATABILITY (Weeks 5–12) — P1/P2

| Rank | ID | Task |
|---|---|---|
| 16 | BDB-006 | 12 buyer interviews (documented failure points) — do 4 in Tier 0, 8 here |
| 17 | BDB-023 | Land first 5 paying orders + 2 case studies (discount for permission, not for free) |
| 18 | BDB-003/004 | China-agent landed cost (MOQ 500+, HS codes, freight) + local cut-make-trim trial |
| 19 | BDB-013 | 12 SEO pages (product × town × compliance) — after verified costs |
| 20 | BDB-024/025 | First Client Brand Store → 3 subscribed stores (MRR ≥ P6,600) |
| 21 | BDB-026 | One programme contract (uniform or PPE, with SLA + quarterly review) |
| 22 | BDB-027 | Submit one tender/RFQ (even if small — for the learning) |
| 23 | BDB-028/029 | Price Index Q1 + Tender Radar (manual 90 days) |
| 24 | BDB-030/031 | Data-protection controls + second operator cross-trained |

### TIER 3 — PLATFORM (Quarter 2+, only if Tier 1–2 gates passed) — P2/P3

BDB-032 screen capacity, BDB-033 multi-tenant stores, BDB-034 partner portal, BDB-035/036 local make + laser, BDB-037 expansion recon. All **Could** — do not touch until 3 stores + 1 programme are live.

---

## 2. What was fixed TODAY (29 Oct 2026) — prototype trust killers

These are the 30-minute fixes that move trust from 2/10 to 7/10 before you send a single link to a buyer:

| File | Fix | Why it mattered |
|---|---|---|
| `LICENSE` | Added MIT licence | Repo had none — unusable for partners/hires |
| `store/privacy.html` | Botswana DPA 2024-aligned notice (72h breach, resident copy, minimisation, retention) | Required before any PII collection; compliance buyers ask for it |
| `store/terms.html` | Validity, duty/VAT, payment, artwork/first-article, QC, delivery, returns, ethics, liability | Stops “but you quoted P…” disputes; required for tenders |
| `store/index.html` | Added canonical, OG/Twitter, JSON-LD `LocalBusiness` + `FAQPage`, footer links to privacy/terms/sitemap | Invisible to Google before; now indexable with rich results |
| `store/robots.txt` + `sitemap.xml` | Crawl + sitemap | SEO baseline |
| `store/_headers` | HSTS, nosniff, frame-deny, CSP, cache rules | Security + performance on Cloudflare Pages |
| `docs/sops/SOP-01..04`, SOP-06 | Quote prep, Brand Vault, first-article, embroidery QC, partner receipt QC | The 5 controls that prevent the first flagship defect |

**Still placeholder — replace before outreach:**

```js
// store/assets/app.js
WHATSAPP_NUMBER: ""          // → "2677XXXXXXX" (full, no +/spaces)
EMAIL: "quotes@example.co.bw" // → your monitored inbox
```

Deploying with these placeholders = broadcasting “we are not ready.”

---

## 3. The expert playbook for BDB-001..007 (the validation sprint)

### BDB-001 — Amrod Botswana
- Walk in: CIPA certificate, VAT certificate, trading licence (if Agent licence pending, say so), director ID, reference client (even if former employer).
- Ask for: tier price list (all categories you intend to sell), MOQ, lead time Gaborone, credit application, branding overflow capacity, and whether they co-refer clients who need local decoration.
- Record: price, MOQ, lead time, duty-embedded status, contact name + direct line.

### BDB-002 — SA stockist (Barron/ProBrand)
- Same pack. Ask specifically: delivery method into Gaborone (road freight, courier, collection), ZAR vs BWP settlement, and returns policy for wrong sizes.

### BDB-003 — China agent
- Do not lead with “500 units of everything.” Quote 3 real lines (e.g. softshell, tote, bottle) at 500/1000 MOQ.
- Demand: FOB price, HS code, carton specs, production time, sample cost. Then cost Gaborone landed = FOB + freight + clearing + SACU duty (40–45% clothing) + 14% VAT + inland delivery. That landed number is the only one that matters.

### BDB-005 — Four real jobs (the most valuable task in the whole plan)
Cost these four archetypes end-to-end with live numbers:
1. **Bank uniform rollout:** 80 golf shirts + 40 caps, embroidered, delivered Gaborone.
2. **Mining PPE issue set:** 50 sets (coverall + boots + gloves + hard hat), branded, mine-gate delivery.
3. **Corporate gift drop:** 120 notebooks + 120 pens, pad-printed, kitted.
4. **Event kit:** 2 gazebos + 10 pull-ups + 100 tees, mixed decoration, hard deadline.
For each: product cost (written), decoration cost, kitting, delivery, credit cost, margin %, delivery promise. Variance vs `04` §3 → update `04` and `catalogue.json` in the same commit.

### BDB-006 — 12 buyer interviews
Script (10 min each, notes in CRM):
> Last order: what, quantity, supplier, price, lead time, what went wrong, payment terms, what would make you reorder without a quote process?
Target: 4 mining/contractor, 4 corporate (bank/telco/retail), 2 government/council, 2 school/NGO. The “what went wrong” column is the product spec.

### BDB-007 — Tax/VAT/BOBS
One email to auditor + one to clearing agent, with the table in `06` §1 as the question list. Get answers in writing and file in `docs/06-APPENDIX/` (or Drive). Update `04` §6 and `store/data/catalogue.json` `config.vat_rate` / duty assumptions immediately.

---

## 4. What to say to buyers this week (while validating)

Do not pitch “we have everything.” Pitch:

> “We’re Branding & Decoration Botswana — Gaborone-based, programme-grade branding for workwear, PPE and merchandise. We specify, source, brand and deliver to site with paperwork that survives an audit — embroidery/DTF/screen in Gaborone, plus a vetted national decorator network. I’m validating supply and costs this week for 4 real job types. Can I quote your next small order at a real price and deliver it to prove the process — even 30 units?”

Then listen for the failure story — that is the gap.

---

## 5. Guardrails (the critical “don’t”)

1. **Don’t quote from memory or from the modelled catalogue.** If you don’t have a written supplier price, say “I’ll revert within 4 hours with a firm price” — and do.
2. **Don’t take a government order on 60-day terms without a facility.** Cap government exposure until a bank/CEDA facility exists (R7).
3. **Don’t compete on commodity glove/boot price.** Sell decorated, kitted, compliant, on-time — or decline.
4. **Don’t store client employee size matrices in Linear/Notion.** Drive only, access-controlled, Botswana-resident copy (DPA 2024).
5. **Don’t overbuild.** The store is good enough. The next SEO page can wait until the fourth real job is costed.

---

## 6. How to work this repo daily (10 min)

1. Morning: open `docs/08-backlog.csv` or Linear — pick the top Tier 0 item not Done. Move to In Progress.
2. Do the supplier visit / call / quote. Record numbers, names, dates in the issue comment + Drive.
3. Evening: move to Done with one line: outcome + what it unlocked + link to evidence.
4. Friday 15 min: open `docs/04` variance section — does the model still hold? If not, change the model.

---

## 7. Linear hygiene (because messy Linear = lost momentum)

- Your workspace is `FAR` (team key `FAR`), not `PRE` — the docs still say `PRE` historically. Don’t rename the key; just know that new issues are `FAR-81` onwards.
- Command Centre project `8cd306dc` is the 30-day sprint (until 20 Nov 2026). Put Tier 0/1 work there. The BDB strategy docs are the *spec* — the project is the *clock*.
- Every issue: **Do / Done when / Ref** description + a status that tells the truth. `In Progress` = you worked it this week. `In Review` = waiting on someone — say who, in a comment.

---

## 8. Metrics that prove you’re moving (review weekly)

| Metric | Week 1 target | Day 30 target | Day 90 target |
|---|---|---|---|
| Written supplier price lists on file | 2 | 3 + landed costs | 60 SKUs verified |
| Real jobs costed (BDB-005) | 2 | 4 | 4 variances closed |
| Buyer interviews documented | 4 | 8 | 12 |
| Quote-to-order conversion | — | ≥20% | ≥30% |
| Gross margin per order | measured | ≥32% | ≥38% blended |
| On-time delivery | — | ≥90% | ≥95% |
| Rework/defect | — | ≤3% | ≤2% |
| Paying orders | 0 | 2–3 | 5 + 2 case studies |
| Client Brand Stores (subscribed) | 0 | 1 pilot | 3 (MRR ≥ P6,600) |

If Tier 0 exit gate is not met by end of Week 2, stop and diagnose — don’t plough into SEO pages and portals.

---

## 9. The next single action (today)

> **Complete one supplier visit in Gaborone tomorrow morning — Amrod Botswana first — and cost one real job the same afternoon using the quote engine with the live price. Log both in the backlog by tomorrow night.**

Everything else is preparation for that moment.
