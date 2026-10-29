# SOP-10 — Month-End: Margin by Job, Partner Scorecards, Consumption Reports, Cash-Cycle Review

**Purpose:** the business is managed on measured margin and cash, not revenue vanity.  
**Trigger:** last 2 working days of month.  
**Owner:** Director + Finance. **Rev:** 29 Oct 2026.

## Steps
1. **Export ERP:** `admin.html → Import/Export → Export ALL` → save `bdb-export-YYYY-MM-DD.json`.
2. **Margin by job:** pivot quotes/orders: revenue, direct cost, gross profit, margin %. Flag any job <28% (decorated) or <18% (commodity) — why? Log in `docs/04` variance note.
3. **Partner scorecards:** per partner: on-time %, defect %, communication (<4h?). Top 2 get priority volume next month. Bottom 1 gets written improvement plan. 3 strikes in 6 months = removal.
4. **Consumption report:** per programme client: issued vs forecast, size mix, reorder point. Email client with PDF (authority + upsell).
5. **Cash cycle:** receivables aging (30/60/90d), payables, inventory days (≤35d buffer), cash conversion cycle (target ≤45d). If CCC >75d two months running → stop new credit sales (per `docs/04` §7).
6. **Decide:** one-page memo: what to continue / fix / stop. File in `docs/decisions/YYYY-MM-DD-month-end.md`.

## Quality gate
- [ ] Full export saved to Drive + Git
- [ ] Every job has margin %; no blank
- [ ] Partner scorecards published to partners (transparent)
- [ ] CCC computed and compared to target

## Records
Export + pivot sheet + memo → Drive `/Finance/YYYY-MM/` + Git commit.

