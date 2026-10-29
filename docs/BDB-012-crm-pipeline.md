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

