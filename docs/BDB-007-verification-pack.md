# BDB-007 — Tax / VAT / BOBS Verification Pack (Email Templates + Checklist)

**Goal:** written confirmation from auditor + clearing agent filed in `docs/06-APPENDIX/` so every price, margin and import assumption is defensible.

## Checklist (5 days)
- [ ] Auditor: corporate tax rate (22% → 24.5% proposal? enacted? effective date) + VAT rate (14%) + zero-rated list changes + VAT threshold P1m + BURS filing dates
- [ ] Clearing agent: BOBS CoC list for garments (compulsory), CoC before arrival since 1 Apr 2024, 2–6w budget, SACU duty 40–45% clothing (verify HS per SKU), 14% VAT on imports
- [ ] Updated `store/data/catalogue.json → config.vat_rate` + `docs/04` margins + `store/assets/app.js` surcharges
- [ ] Filed PDFs in `docs/06-APPENDIX/` + Drive

## Template 1 — Auditor (copy, fill brackets)
Subject: Verification request — Branding & Decoration Botswana — tax/VAT assumptions
Body:
> Dear [Auditor name],
>
> We are validating assumptions before quoting. Please confirm in writing (or mark up the table below) for our exact mix (branded workwear, PPE, gifts, display):
>
> | Item | Our assumption | Your confirmation |
> |---|---|---|
> | Corporate tax rate | 22% (Budget proposed 24.5%) | Enacted rate + effective date |
> | VAT standard rate | 14% | Current + threshold P1m |
> | Zero-rated VAT list | 2025 list | Any 2026 trimming? |
> | VAT on remote services | Amendment Bill 2025 pending | Commencement? |
> | Deposit/treatment | 50% deposit invoicing VAT point | VAT point on deposit vs delivery |
>
> Attached: our product mix. Reply by [date +3d] allows us to price correctly. Invoice for verification time is approved.
>
> Regards, [Director], [Phone]

## Template 2 — Clearing agent
Subject: BOBS CoC + SACU duty verification — garment/PPE imports (5 SKUs)
Body:
> Dear [Clearing agent],
>
> Please verify for these 5 SKUs (HS guess attached — please correct):
> 1. Golf shirt pique 180gsm (HS 6105.10?) 2. Conti suit poly-cotton (6211?) 3. Hi-vis vest (6114?) 4. Safety boot leather (6403?) 5. Notebook PU (4820?)
>
> Questions per SKU:
> - Compulsory BOBS standard? CoC required before arrival? Cost + time per CoC?
> - Correct HS + SACU MFN rate (clothing 40–45%?) + VAT 14% base
> - SACU vs extra-union treatment if sourced via SA trade (duty embedded?) vs direct China
>
> Please confirm HS + rate + CoC time/cost in writing. We cost landed = FOB + freight + clearing + duty + VAT.
>
> Regards, [Director]

## File the replies
Save auditor/clearing emails as PDF: `docs/06-APPENDIX/2026-10-XX-auditor-verification.pdf` + update `docs/06` §1 table with “[Verified YYYY-MM-DD]”.
