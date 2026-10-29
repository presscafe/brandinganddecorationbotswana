# BDB-012 — CRM Pipeline + Quote Follow-Up Cadence

**Owner:** Director (until commercial hire). **Tool:** `admin.html → Customers/Quotes` (IndexedDB, free) + optional Google Sheets mirror. **No paid HubSpot needed until 150 accounts / 40 quotes/mo.**

## Stages (ERP status → sheet column)
`Inquiry → Quote draft → Sent → Approved (deposit) → Production → Kitting → Delivered → Invoiced → Paid → Repeat`

## Follow-up cadence (auto-task in ERP notes; set calendar reminder)
- **D2 after Sent:** “Did the quote answer the brief? Any revision?” (WhatsApp)
- **D7:** “Quantity / artwork / deadline change?” 
- **D14:** Validity expiry reminder;Offer to re-quote if import line.
- **Lost reason** (mandatory): price / lead time / capability / no budget / ghost. Log to improve next.

## Sheet mirror (free) — create Google Sheet with columns:
`Date | Ref (BDB-YYYYMMDD-HHMM) | Customer | Product | Qty | Total exVAT | Margin% | Status | Delivery zone | Next action | Owner | Outcome`

## KPIs (review weekly Fri 15m, `SOP-10` monthly)
Conversion ≥30% (sent→approved), AOV ≥P11k rising, repeat rate ≥40% (90d), receivables >30d ≤20%.


---
**LIVE SHEET (29-Oct-2026):** https://docs.google.com/spreadsheets/d/1a4vlNCEeK_JfOz89eQ9nYsHqFrg1LJR8RYNE2pZ8z_Q/edit
5 tabs: Pipeline (17 cols incl. WA consent + next follow-up) | Quotes | FollowUps (D2/D7/D14) | Certificates (BDB-022) | Backups (DPA weekly BW copy). Headers bold + banded + example rows pre-filled. Owner: Director to share with Finance Editor only (BDB-030 access control). Use this as single source; admin.html is offline mirror for field use.
