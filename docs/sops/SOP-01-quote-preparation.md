# SOP-01 — Quote preparation and validity rules

**Purpose:** every quote that leaves is priced from verified costs, carries correct tax/duty/credit/delivery, respects the 28% decorated-work margin floor, and expires on a stated date. No quote is a guess.

**Trigger:** any request for a price (WhatsApp, email, phone, tender, walk-in).

**Owner:** Director (until a commercial lead is appointed). **Revision:** 2026-10-29 v1.

---

## 1. Intake (5 min)

1. Capture in CRM/spreadsheet: client name, contact, organisation, delivery zone, deadline, opportunity type (transactional / programme / tender).
2. Ask the three qualifying questions:
   - What is the use case and quantity per item?
   - What artwork/logo positions are required?
   - Is there a hard deadline or site delivery constraint?
3. If artwork not yet supplied, request vector file (AI/EPS/SVG/PDF) plus a raster preview and Pantone references.

## 2. Costing (use `store/data/catalogue.json` + verified supplier sheet)

1. Identify the product(s) in the catalogue. If not in the 60-SKU master, price from the live supplier sheet — never invent.
2. Landed cost = product cost duty-paid per channel (`sa_trade` = duty embedded; `import` = FOB + freight + clearing + 40–45% MFN duty + 14% VAT where applicable; `local` = factory price). HS code must be recorded for any imported line.
3. Margin tier by quantity: <25 → 48%, 25–99 → 40%, 100–499 → 34%, 500+ → 28% (see `store/data/catalogue.json` `margin_tiers`). Never quote decorated work below **28% gross margin** including delivery.
4. Decoration: unit price × quantity + setup (digitising P120, screen P220/colour, etc.) per `decoration` table. Decoration margin floor = cost × 1.5; if method is accidentally cheaper, floor applies.
5. Surcharges: credit (+2% per 30 days), rush (+20% ≤72h), delivery per zone (free ≥ P25,000 ex VAT).
6. VAT @ 14% added at the end.

## 3. Validation gates (must pass before sending)

- [ ] Landed cost is from a **written supplier quotation** ≤30 days old, not a model estimate.
- [ ] Duty/HS code checked with clearing agent for any imported garment line.
- [ ] Margin ≥28% (quote engine flags PASS/REVIEW — REVIEW requires Director sign-off).
- [ ] Delivery zone fee correct per `delivery` table.
- [ ] Validity stated: **14 days** (imported) or **30 days** (stocked). Expiry date = today + validity.
- [ ] Exclusions stated: artwork revisions beyond one proof, size-matrix changes after first-article approval, site access delays.

## 4. Output

1. Generate via `store/` quote engine **and** export/attach the full breakdown (product + decoration + setup + surcharges + delivery + VAT).
2. Add quote reference `BDB-YYYYMMDD-HHMM`, client/project line, and source channel label.
3. Attach certificate pack reference (SOP-02 / BDB-022) for any PPE/compliance-critical line.
4. Send as PDF + WhatsApp summary. Store the sent file in Drive: `Clients/{Client}/Quotes/{QuoteRef}.pdf` and link it in the CRM/Linear issue.

## 5. Follow-up

- Day 2: “Did the quote answer the brief?” (WhatsApp)
- Day 7: “Any revision to quantity/artwork/deadline?”
- Day 14: expiry reminder. Log outcome: Won / Lost / No decision + reason.

## 6. Records

- CRM row + Drive file + Linear comment (on the relevant BDB issue) with: quoted total ex VAT / incl VAT, margin %, outcome, and variance vs modelled cost if different.

## 7. Red lines

- No quote below the margin floor without written Director exception (recorded with reason).
- No retroactive discount, no informal “commission” to procurement staff — ever.
- No validity extension without re-costing imported lines.

---

**Sign-off:** Director reviews the first 20 quotes personally. Thereafter spot-check 1 in 4.
