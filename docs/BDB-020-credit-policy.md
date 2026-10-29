# BDB-020 — Credit Policy & Receivables Controls (Active from Order #1)

**Owner:** Finance / Director. **Rev:** 29 Oct 2026. **Applies to:** every Branding & Decoration Botswana sale.
**Risk it kills:** R1 exposure 20 — insolvency from funding client balance sheets. **Reference:** `docs/04` §7, `docs/06` R1.

## The rule (one page, enforceable)
1. **New account (first order):** 50% deposit before art/production, balance on POD/collection. No exception >P30k. Cash sale allowed.
2. **Repeat account:** 30-day terms only with approved limit (see §2). 60-day only blue-chip + facility-backed.
3. **Government/mines:** milestone billing or advance; no 60-day government work without bank/CEDA facility in place.
4. **No informal credit, no “pay after tender award”, no order above limit without cleared funds.**

## 2. Credit limit per account (fill before first credit sale)
| Account | Limit (P) | Terms | Approved by | Date | Review |
|---|---|---|---|---|---|
| *Example: Bank Gaborone* | 80,000 | 30d | Director | 2026-10-29 | Quarterly |
|  |  |  |  |  |  |

Limit ≤35% of trailing 3-month revenue (aggregate). Single client ≤25% of revenue (R4).

## 3. Pricing of credit (must be in every quote)
`credit_surcharge = 0% prepay | +2% 30d | +4% 60d` per `store/data/catalogue.json → config`. If client asks for longer, price it or refuse.

## 4. Controls — monthly cadence (no excuses)
- **Day 5:** VAT return by 25th, PAYE by 15th, ageing report printed (0-30 / 31-60 / 61-90 / 90+)
- **Day 15:** Director reviews ageing — any 60+ without PTP (promise to pay) → stop new credit sales to that account
- **Day 30:** Receivables >30d ≤20% of total receivables (KPI). If >35% → freeze new credit.
- **CCCCheck:** Cash conversion cycle ≤45d target, never >75d two months running → action in `SOP-10`.

## 5. Collections
D2: friendly WhatsApp (“POD + invoice attached, due DATE”), D7: call, D14: written reminder + pause new jobs, D30: formal letter + interest per terms, D45: legal review. Log every contact in ERP (`admin.html → Quotes` notes).

## 6. Instruments
- Facility: overdraft/invoice discounting investigated once 3 months clean invoices; cost 2–4%/mo — only if gross margin >35% (else value-destroying).
- No CEDA/LEA debt for inventory — only for machines via revenue.

**Signature:** Director _____________ Finance _____________ Date _____________
