# Ethical Charter — Branding & Decoration Botswana

**Applies to:** pricing, contracts, data, sourcing, partners, labour, environment.
**Tone:** Islamic best practice *without being religious* — i.e. universal ethics that happen to align with Islamic finance/ethics, expressed in secular, audit-friendly language. No religious language on client-facing surfaces unless the client requests it. The substance must pass a Shariah-aware audit *and* a Western ESG audit *and* Botswana law.

## 1) Financial integrity — no riba, no gharar

| Principle (Islamic term, secular wording) | How B&D implements it | Where it is enforced |
|---|---|---|
| **No riba (no exploitative interest)** | No hidden late-payment interest. Credit cost is an *explicit, pre-agreed markup* — `+2% /30d` in the quote engine — shown as a line item, not compounding daily. No payday-style lending. If a client cannot pay cash, we offer 30d terms at a fixed uplift or we keep COD — their choice before order. We do not borrow at punitive rates to fund their order. | `BDB-020 credit policy`, `store/assets/app.js → credit_surcharge`, admin quote sheet |
| **No gharar (no ambiguity)** | Every quote states: spec, thread colours, placement, size matrix, quantity, unit price, VAT, delivery, lead time, validity (30d stocked / 14d import), deposit. No "T&Cs apply" without the T&Cs attached. | `SOP-01` + quote template |
| **No maisir (no speculation with client money)** | We do not order imported stock with client deposits before confirming HS/duty/lead. Modelled costs are labelled *indicative — not a firm offer* everywhere. | `store/index.html` prototype badge + app.js engine |

This passes both IFRS 15 (revenue) and Shariah finance review because the finance charge is a *transparent murabaha-style markup* (cost + disclosed profit), not interest on a loan.

## 2) Truthfulness — sidq & amanah

- **Certificate truth:** each SKU's certificate is the *actual* test report/CoC, not a look-alike. File hash logged. `BDB-022` pack attached <4 min or we say we cannot supply.
- **Lead-time truth:** SA-trade 5–7d, import 6–10w including CoC. We never promise 72h on import.
- **Data amanah (trust):** client logo, size matrix, price list is *amanah*. Stored encrypted, Botswana-resident copy (`BDB-030`), deleted from partner after 30d (`BDB-017`). Breach = 72h notice.

## 3) Fairness — 'adl & ihsan (justice + excellence)

- **Partners:** month-to-month scope-sheet, 3-strike before termination, scorecard published, late payment to partners ≤7d. No tying, no kickbacks. (`BDB-017`)
- **Workers:** two operators per machine (`BDB-031` upcoming), PPE per SOP, Workers Compensation compliant.
- **Clients:** 50% deposit for new clients, not 100% — shares risk fairly. Rework ≤2% (`SOP-09`) at our cost if our defect.
- **Environment:** buffer stock only top-12, fix/repair offer before reorder, waste ledger per SOP.

## 4) Halal-aware supply chain (secular wording: "material & labour provenance")

- We ask every supplier: material composition, country of origin, labour standards. Leather flagged for source (bovine vs porcine); we default to treated bovine/PU where client has halal preference, and we *state the material* so the client can decide.
- No haram imagery on decoration without client sign-off (we digitise exactly what they approve — `SOP-03`).
- Local CMT lane gets 10–15% PPRA preference *and* is our local-content value answer — supports Botswana jobs (`BDB-004/035`).

## 5) Zakat / CSR — without preaching

- 2.5% of net profit earmarked annually for community (school uniforms for under-resourced learners, or fit-for-purpose workwear donation). Tracked in `SOP-10 month-end`, disbursed locally, reported in price index. Not marketed as religious.

## 6) How this is audited

- **Quote audit (weekly):** pick 2 quotes — does the VAT, credit uplift, delivery and validity match the charter?
- **SOP audit (monthly):** partner scorecards, rework %, breach drill log (`BDB-030`).
- **Public page:** `/ethical-charter.html` (plain language, no Arabic terms) so any buyer — bank, mine, ministry — can cite it in procurement.

> This charter is a *constraint that wins tenders*. Government and mining procurement increasingly score ethics/governance. A shop that can show cost+markup transparency, no hidden interest, and documented provenance beats a cheaper shop that cannot explain its price.
