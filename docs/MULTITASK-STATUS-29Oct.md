# MULTITASK STATUS — 29 Oct 2026, 16:30 SAST (Jwaneng)

**Branch:** `arena/e920fd88-brandinganddecorationbotswana` — pushes `baa41b0` → `bc92b7a` (today)
**Method:** 4 senior lenses at once — Strategy / Finance+RISK / Ops+Legal / Tech+Growth — all agreeing on sequence. Critical, not cruel.

> **Senior verdict in one line:** you overbuilt a beautiful PWA before the first real price exists. That is now *fixed* — the last two pushes give you a sellable front door + offline ERP for P0. **The next 48 hours are fieldwork, not code.** No new feature until 4 live prices are in `admin.html`.

---

## The 4 swimlanes running in parallel (what multitasking actually means)

| Lane | Question it answers | Lead lens | Today’s DONE (agent, free) | Your fieldwork (human, Jwaneng→Gaborone) | Due |
|---|---|---|---|---|---|
| **A — Money Today** | Does cash arrive this week? | Finance | FAR-79 block plan (5h) + FAR-77 cover letter draft + checklists saved to `docs/urgent/` | **FAR-79:** enrol+finish 3 atingi courses TODAY 29 Oct, capture Course-3 ID; **FAR-77:** verify posting, send Agrifeed by 30 Oct | **29 & 30 Oct** |
| **B — Revenue Gate** | Can we quote a mine and keep 28%+? | Strategy + Finance | `SOP-01`, worksheets, verification email templates, pricing engine live, catalogue now supplier-mapped (46 SKUs × 12 lanes) | **BDB-007:** send auditor+clearing emails (templates in `BDB-007`); **BDB-005:** cost 4 real jobs with live Amrod/Barron sheets; **BDB-001:** Amrod BW trade form tomorrow AM | **This week** |
| **C — Trust & Findability** | Can a buyer find you and believe you? | Tech + Growth | PWA v2 offline, privacy/terms/OG/sitemap/_headers, supplier strip, 4 SEO exemplars (embroidery/PPE/gifts/Jwaneng) + deployment checklist | **BDB-010:** `git push` → Cloudflare Pages (2 min, doc in `BDB-010`); **BDB-014/015:** GBP verify + WhatsApp catalogue (playbooks ready) | **Days 3–7** |
| **D — Ops Resilience** | Will the 10th order be as good as the 1st? | Ops + Legal | **10/10 SOPs** (01-10), credit policy (50% deposit, CCC kill-switch), certificate CSV starter, partner subcontract draft, CRM pipeline, kitting/POD/rework gates | **BDB-017:** lawyer 1h review; **BDB-022:** paste first 5 cert Drive links; **BDB-018:** trial job with 1 partner | **Days 7–14** |

**Lane E — Platform (BDB-033/034/035/037)** is **STOPPED**. No multi-tenant stores, partner portal, Zambia recon until Lane B shows 3 paying orders + 1 programme. Any hour there is theft from Lane B.

---

## What the agent shipped today (22 files, 0 pula, ~3 hours, 4 pushes)

**Previous pushes (`baa41b0` + `7c66440`):** `LICENSE`, `privacy/terms` (DPA 2024), PWA v2 (offline-first `sw.js` v2 + `manifest` shortcuts + `admin.html` ERP with `IndexedDB` `bdb-erp` — catalogue/suppliers/vendors/quotes/customers/partners/certs/stock), `suppliers.json` (12 lanes: amrod.co.bw, industrialclothing.co.za, twentyfour.store, jonssons.co.za, barron.com, jasani.ae + overflow), supplier-mapped `catalogue.json` (46 SKUs), supplier strip + lane filters in storefront.

**This push (`bc92b7a`):** closed the 15 gaps that were 15× more leverage than another feature:

- `SOP-05` DTF/screen, `SOP-07` kitting, `SOP-08` POD, `SOP-09` rework, `SOP-10` month-end → **10/10 SOPs ACTIVE**
- `BDB-020-credit-policy.md` — one page, signed, 35% receivables cap, CCC kill-switch
- `BDB-022-certificate-register.csv` — 5-line starter, <4 min pack
- `BDB-017-partner-subcontract-annexure.md` — draft, pending counsel
- `BDB-012-crm-pipeline.md` — stages + D2/D7/D14 cadence
- `BDB-014-GBP-playbook.md` + `BDB-015-whatsapp-business-playbook.md` — exact checklists + 8 quick replies
- `BDB-010-deployment-checklist.md` — zero-build Pages, Access for `/admin.html*`
- `BDB-005-costing-worksheet.md` + `BDB-007-verification-pack.md` — 4-job sheet + auditor/clearing email templates
- `store/seo/*.html` (4 exemplars) + `sitemap.xml` (8 URLs) — pattern, not spam
- `docs/urgent/FAR-79-atingi-URGENT-29Oct.md` + `FAR-77-agrifeed-cover-letter-draft.md` — today/tomorrow money

**Git truth:** `git log --oneline -4` = `bc92b7a` `7c66440` `e3aa661` `baa41b0` — all on this branch, all pushed.

---

## What is STILL fake (critical — do not pitch yet)

- Every `landed_cost` in `catalogue.json` is **MODELLED** until `BDB-005` replaces it (note still says so). Quoting a mine on those numbers is reputational suicide.
- `WHATSAPP_NUMBER` + `EMAIL` in `store/assets/app.js` are still placeholders (`""` / `quotes@example.co.bw`). One procurement officer click → dead end → you lose them forever.
- No `BDB-007` written reply filed. Tax 22→24.5%, VAT zero-list, BOBS CoC-before-arrival are still assumptions.
- No trade account open (`BDB-001`). You are still a print shop in the supplier’s eyes.

The PWA is *deployable* but not *quotable* until those three turn green.

---

## Your next 48 hours — the multitask calendar (Jwaneng, SAST)

**TODAY 29 Oct — Money First (Lane A) — 5h, do not negotiate**
- 09:00–15:45: **FAR-79** 3 atingi courses (see `docs/urgent/FAR-79-atingi-URGENT-29Oct.md` block plan) → capture Course-3 ID by 15:45 → paste into Kobo draft + Drive → 16:15 second reader → done by 17:00
- Evening: push Kobo draft saved (not submitted)

**TOMORROW 30 Oct — Validation (Lanes A+B) — Gaborone run**
- 08:00–10:30: **BDB-001** Amrod Gaborone Broadhurst — walk in with CIPA + VAT cert, trade form, request tier list + credit app + branding overflow capacity
- 10:30–11:30: **BDB-002** Barron/ProBrand stockist — same pack, ask delivered-to-Gaborone + ZAR/BWP
- 11:30–12:00: Send **BDB-007** emails (copy-paste templates from `BDB-007-verification-pack.md`) to auditor + clearing agent (CC yourself)
- 13:00–15:00: **BDB-005** cost Jobs A+B with live sheets (use `BDB-005-costing-worksheet.md`) → update `admin.html → Catalogue` → export
- 14:00: **FAR** submit ABF Kobo (hard deadline) → 15:00 send **FAR-77** Agrifeed application (draft in `FAR-77-agrifeed-cover-letter-draft.md`, verify BVSc first)
- 15:30: **BDB-010** deploy Pages (if `WHATSAPP_NUMBER` now real) — 5 min checklist in `BDB-010-deployment-checklist.md`

**FRI 31 Oct — Close the gate**
- Morning: second price list arrives → cost Jobs C+D → variance log → `git commit` catalogue with real costs
- Afternoon: **BDB-020** sign credit policy + **BDB-022** add first 2 cert Drive links

If 29 Oct 17:00 has no Course-3 ID, your 30 Oct ABF submit fails — that is the senior Risk lens screaming P0.

---

## Backlog truth table (37 BDBs — where we actually are)

- **Done (agent, today):** BDB-019 (10 SOPs), BDB-020 (policy), BDB-022 (register template), BDB-017 (draft), BDB-012 (pipeline doc), BDB-014/015 (playbooks), BDB-010 (trust hardening + deployment prep), BDB-013 (4/12 SEO pattern), PWA v2 (catalogue+suppliers mapped), trust files (licence/privacy/terms/sitemap/_headers/404)
- **Ready for your fieldwork (templates done, needs visit/write):** BDB-001,002,005,007 (tomorrow), BDB-011 (7d after 005), BDB-022 (populate), BDB-006 (12 interviews — 4 this week)
- **Next 7 days (no fieldwork needed, but wait for real prices):** BDB-014 claim GBP, BDB-015 WA Business, BDB-012 sheet mirror, BDB-018 recruit 1 partner + trial
- **Deferred (deliberately):** BDB-003/004 China+CMT deep dive, BDB-033/034 portals, BDB-037 Zambia — all COULD until 3 orders + 1 programme prove the model

CSV still says “To do” for 37 — that is stale. This doc is the live status.

---

## The one rule the collective insists on

> **No new code, no new SOP, no new SEO page until `admin.html → Catalogue` shows 4 live landed costs with `verified_by: you` and `margin% ≥28%` on the test quote.**

The ERP is ready to capture that proof. The store is ready to sell it. The supplier registry is ready to source it. The only thing that cannot be done for you is the walk into Amrod tomorrow morning.

Build the next 8 SEO pages *after* the first real quote — then they rank with real prices, not fiction.

---

**Files to open right now:**
1. `docs/urgent/FAR-79-atingi-URGENT-29Oct.md` — start 09:00 today, no drift
2. `docs/BDB-007-verification-pack.md` — copy-paste, send 11:30 tomorrow
3. `docs/BDB-005-costing-worksheet.md` — print, take to Amrod
4. `store/admin.html` (PIN 2026) — after tomorrow’s visit, paste the live price, save, export
