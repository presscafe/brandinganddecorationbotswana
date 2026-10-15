# THE ORCHESTRATION MODEL — How to Be the Ideal Competitor Without Owning Everything

**Premise:** you cannot out-inventory Amrod, out-price Shenzhen, or out-spend a bank. You can out-design, out-document, out-serve and out-system every local rival, and then rent everything else.

---

## 1. The architecture: four layers, own the middle two

```
        ┌──────────────────────────────────────────────────────────────┐
  L1    │  DEMAND LAYER (owned, digital)                               │
        │  Website · quote engine · WhatsApp · CRM · tender desk · SEO  │
        └──────────────────────────────────────────────────────────────┘
                                   ↓  specification + order
        ┌──────────────────────────────────────────────────────────────┐
  L2    │  ORCHESTRATION LAYER (owned IP — the real asset)             │
        │  Product data · pricing rules · Brand Vault · job routing ·   │
        │  QC standards · SLA clock · partner scorecards · margin rules │
        └──────────────────────────────────────────────────────────────┘
                    ↓ production                    ↓ supply
        ┌──────────────────────────┐    ┌──────────────────────────────┐
  L3    │  PRODUCTION LAYER        │    │  SUPPLY LAYER (partners)     │
        │  Owned hub (Gaborone)    │    │  Amrod/BW trade account      │
        │  + vetted partner network│    │  SA stockists · direct import│
        │  embroidery·DTF·screen·  │    │  local manufacturers         │
        │  sublimation·laser·kitting│   │  buffer stock: top 50 SKUs   │
        └──────────────────────────┘    └──────────────────────────────┘
```

**Capital rule:** money goes into machines, artwork, systems and people — not into slow-moving inventory or vehicles. Inventory depth is the fastest way for a Botswana SME to die; the continent's US$800m B2B-distribution lesson is unambiguous [S37][S38][S39].

---

## 2. Layer 1 — Demand

| Component | What it is | Cost | Priority |
|---|---|---|---|
| Storefront + quote engine | Static PWA in `store/`, deployed free on Cloudflare Pages or Netlify | Free | **Now** |
| WhatsApp Business (catalogue + quick replies + catalogue link) | Primary channel in Botswana; buyers expect it | Free | **Now** |
| Google Business Profile + reviews | Local intent capture ("embroidery Gaborone") | Free | **Now** |
| SEO content engine | Product × town × compliance pages (see `05`) | Free (time) | Weeks 1–12 |
| CRM | Start with a spreadsheet/Notion-grade CRM; upgrade to a paid tool only when >150 accounts or >40 quotes/month | Free → low | Month 1 |
| Tender desk | PPRA/IPMS registration, supplier codes, tax clearance, standing bid library | Fees for codes | Month 1 |
| Account management | 1 commercial person per ~40–60 active accounts | Payroll | Month 2 |

**Target funnel maths (illustrative, validate):** 1,200 monthly organic+social visits → 6% quote requests (72) → 35% conversion (25 orders) → average order P12,000 → P300,000/month. This is the arithmetic the SEO plan in `05` is designed to feed. If real conversion is half this, the model still funds itself — but only if gross margin per order is ≥35%.

---

## 3. Layer 2 — Orchestration (the asset that compounds)

Six systems, all documented and digital. Build in this order.

### 3.1 Product & price master (week 1)
One canonical list of what you can actually supply, with: SKU, supplier(s), MOQ, lead time, landed cost, decoration options, sell price bands by quantity tier, certificate reference. Minimum viable: 60 SKUs. Year-1 target: 400–800.

### 3.2 Brand Vault (per client, week 1)
- Logo files (vector + raster), approved variants, clear-space rules
- Pantone/CMYK/RAL references, thread colour matches
- Size matrix per department/site, with historical consumption
- Approved product list, budget rules, approval chain, delivery addresses
- **Why it matters:** the Brand Vault is the switching cost. It is also the deliverable that turns a one-off order into a relationship.

### 3.3 Pricing rules engine (week 2)
Rules, not guesses:
`Sell = (Landed product cost + Decoration cost + Kitting/packaging + Freight to site + Payment-term cost) × (1 + target margin)`
- Target margins: decoration-led work 45–60%; product-led supply 25–35%; programme contracts 30–40% blended; network take-rate revenue 100% margin.
- **Duty-aware:** every imported line carries its SACU duty rate (clothing 40–45%) and 14% VAT into the quote [S30][S31][S19].
- **Payment-term cost:** add 1.5–2.5% per 30 days of credit to the sell price. If you are funding the client's balance sheet, it must be priced or refused.

### 3.4 Job routing & capacity board (week 2)
Every order becomes a job with: specification sheet, artwork reference, quantity, deadline, assigned resource (own machine or named partner), QC checkpoints, delivery slot. Weekly capacity board prevents the classic failure — over-promising during a tender season and missing every deadline.

### 3.5 QC standards & first-article approval (week 2)
- Written checklist per decoration type (stitch count/size/placement tolerance, print cure, colour match, wash test on first article)
- **First-article approval mandatory** for orders >100 units: one finished unit photographed and signed off by the client before bulk runs
- Defect policy published: remake target ≤2%, credit or remake within 5 working days

### 3.6 Partner scorecards (week 3)
Measure every partner monthly: on-time %, defect %, communication, price adherence, capacity honesty. Reward the top two with volume and priority; put the bottom one on a written improvement plan. Three strikes = removal. Publish the scorecard to the partner — transparency improves behaviour more than threats.

> **Rule that keeps quality alive:** you are the brand of record on the invoice. A partner's error is *your* error. No exceptions, no blame-shifting in front of a client.

---

## 4. Layer 3 — Production

### 4.1 Phase-1 owned equipment (Gaborone hub)

| Item | Purpose | Indicative cost (landed, VAT excluded/claimable) | Source anchor |
|---|---|---|---|
| 15-needle single-head industrial embroidery machine | Logos on polos, caps, workwear — the workhorse | US$2,750–3,500 machine (China) → **P45k–P65k** landed with freight/duty/software | [S45] |
| Embroidery software / digitiser | Pattern creation; alternative: free/open tools + paid service bureau | P0–P60k (buy vs outsource digitising) | estimate |
| DTF printer (mid-tier) + shaker/oven or powder station | Full-colour short runs, polyester, caps, complex art | US$2,500–6,000 → **P45k–P95k** | [S43][S44] |
| Heat press (pneumatic or swing) | DTF/HTV application | P12k–P30k | [S44] |
| Manual screen-print carousel + exposure unit + screens | Bulk low-colour runs (or outsource in Phase 1) | P45k–P130k (optional Phase 1) | estimate |
| CO₂ laser engraver 60–80W | Drinkware, awards, signage, premium gifting | P35k–P80k (Phase 2) | estimate |
| Consumables opening stock | Thread, backing, film, powder, ink, blanks buffer | P40k–P80k | estimate |
| Fitting/QC bench, shelving, packing station, camera for first-article | Kitting and documentation | P20k–P40k | estimate |

**Phase-1 recommendation (lean, de-risked):** embroidery + DTF + heat press + kitting, with screen print and signage outsourced to partners. Capital ≈ **P250k–P400k** including three months of working capital buffer. Add screen print and laser only when volume proves the bottleneck.

### 4.2 Partner network (the multiplier)

| Partner type | Role | Commercial terms | Governance |
|---|---|---|---|
| Decorators (embroidery/DTF/screen) in Gaborone, Francistown, Maun, Palapye, Selebi-Phikwe, Kasane | Overflow + out-of-town fulfilment | Cost-plus or 60/40 margin split in partner's favour on production; you own client, artwork, QC, invoicing | Written subcontract + QC annexure; scorecard; 3-strike rule |
| Cut-and-sew / garment manufacturers (Botswana) | Local-content qualification, custom garments, bulk gowns/overalls | Open-book cost + agreed margin | Quality audits; sample approval; capacity reservation |
| Signage & large-format | Banners, billboards, vehicle branding, exhibition builds | Margin 20–35%, or referral fee | Site-survey documentation; install liability insurance evidence |
| Logistics (courier + ad hoc bakkie) | Site delivery, nationwide drops | Per-drop pricing, no fleet purchase | Track-and-trace requirement; proof-of-delivery photographs |
| Specialists: digitising, photography, graphic design | Visual and art services | Per-job | Fixed turnaround SLA |

**Network economics:** at 40% of production volume routed to partners and a 35% share of the gross margin, the network contribution to profit is meaningful without capital. Ten active partners in six towns gives you national coverage for the price of ten subcontracts.

### 4.3 Capacity plan and pride

Do not route critical, brand-defining jobs (executive gifting, bank uniforms, tender samples) to partners in year one. Partners are for volume overflow and out-of-town. Own the jobs that define you.

---

## 5. Layer 4 — Supply

Three channels, used deliberately per line item:

| Channel | Use for | Advantages | Watch-outs |
|---|---|---|---|
| **1. SA trade accounts** (Amrod Botswana, Barron/ProBrand-type, other SA stockists) | 60–70% of lines: workwear, corporate clothing, headwear, gifting, drinkware | Duty already embedded, MOQ 1, 2–7 day lead into Gaborone, credit terms, returns | ZAR exposure; Botswana-specific stock gaps; delivery volatility |
| **2. Direct import** (China/India/Türkiye via agents) | High-run plain items, gazebos, banners, tech gifts, bags, drinkware where duty is low | Best unit cost at volume; margin expansion | 40–45% duty on clothing **must** be in the model [S30][S31]; 6–10 week lead; MOQ; BOBS CoC for compulsory-standard goods incl. garments [S28][S29]; FX risk |
| **3. Local manufacture/finish** (Botswana CIPAs, cut-and-sew, assembly) | Local-content bids, custom garments, value-addition claims | **5–15% preference margin in tenders; 10% mining preference for locally produced supplies** [S21][S22][S23] | Capacity and quality capability limited; needs active development and audits |

**Sourcing discipline:**
- Never single-source a line that represents >15% of revenue.
- Keep 3 approved suppliers per top-selling category, with current price and lead time on file.
- Quote validity 14–21 days on imported lines; 30 days on locally stocked lines.
- Certificate-per-SKU register (test reports, CE/EN/ISO references, MSDS where applicable) is a client-facing asset, not back-office. Competitive advantage: **your competitor cannot produce this on demand; you email it in 4 minutes.**

---

## 6. Productised offers (fixed scopes, fixed prices, repeatable)

| # | Offer | Scope | Price structure | Why it sells |
|---|---|---|---|---|
| 1 | **Branded Workwear Programme** | Annual specification, size matrix, 3 collections/yr, stockholding of top 12 lines, quarterly reporting | Setup + per-issue pricing + optional holding fee | Removes HR/procurement effort; recurring |
| 2 | **PPE Issue-Set Programme** (mining/projects) | Site-spec issue sets, kitted per worker, delivered to gate on schedule, certificate pack | Per-issue-set price, quarterly volumes | Non-discretionary, safety-file compliant, high ticket |
| 3 | **Corporate Gifting Retainer** | Quarterly curated gift drops to a defined recipient list, kitted and delivered | Monthly retainer + product cost | Budget smoothing, executive-quality presentation |
| 4 | **Event & Activation Kit** | Merch + branding + on-site setup, delivered to deadline | Fixed package price by delegate count | Deadline-driven, high urgency premium |
| 5 | **Client Brand Store** | White-label online store: approved catalogue, logo vault, budget control, approvals, reporting | Setup fee + monthly platform fee + order margin | **Highest-margin, stickiest revenue** |
| 6 | **Tender & Compliance Pack** | Specification drafting, local-content documentation, certificate compilation for a bid | Fixed fee per bid, or included with supply commitment | Small spend, unlocks large contracts |
| 7 | **Network Partner Subscription** | Order routing, invoicing support, QC templates, brand alignment for network decorators | Monthly fee + take rate on routed jobs | Turns competitors into a distribution channel |

Recommendation: launch offers 2, 4 and 5 first (highest margin per unit of effort: 5 for recurrence, 2 for ticket size, 4 for cash speed).

---

## 7. The Client Brand Store — your moat product (detail)

**What the client gets:** a branded URL (e.g. `clientname.brandinganddecoration.co.bw`), approved catalogue with their logos applied, department/site budgets, approval workflow, employee self-service, spend reporting, and automatic reorder of consumables.

**What you get:** guaranteed order flow, margin on every transaction, near-zero customer-acquisition cost after setup, and a permanent operational tie-in with their procurement process.

**Build path:**
- **Months 1–3 (v1):** single-tenant static store (the PWA in `store/`), one client, manual order processing via WhatsApp/email; price: setup P6,000–15,000 + P1,500–3,000/month + order margin.
- **Months 4–9 (v2):** multi-tenant with login, per-user budgets, approval states, order history. Stack: Cloudflare Pages + Workers + D1/KV (free tiers), or a low-cost no-code backend if speed matters more than ownership.
- **Months 10–24 (v3):** API, punch-out catalogue, client ERP integration (Sage/Pastel is common in Botswana), automatic replenishment triggers, PromoStandards-style product data feeding distributors [S40].

**Commercial guardrail:** do not give the store away free to win orders. It is a subscription product; free stores destroy the recurring revenue thesis and invite churn.

---

## 8. Operations manual — the ten SOPs to write first

1. Quote preparation and validity rules (with duty and payment-term calculation)
2. Artwork intake and Brand Vault update
3. Digitising and first-article approval
4. Embroidery production and QC
5. DTF/screen production, curing and wash-test
6. Partner job issue, in-progress check and receipt QC
7. Kitting, packing and packing-list generation
8. Delivery, proof of delivery and installation sign-off
9. Defect, rework and credit-note handling
10. Month-end: margin by job, partner scorecards, client consumption report, cash-cycle review

Each SOP: purpose, trigger, steps, quality gate, records, owner, revision date. Store in the repo (`docs/sops/`) so they are versioned, portable and not trapped in anyone's head.

---

## 9. Brand, identity and messaging decisions

- **Name:** keep *Branding & Decoration Botswana*. Descriptive names rank better in local search and require less marketing spend to explain.
- **Tagline options (pick one, do not hedge):**
  1. *Specified. Branded. Delivered. Every site, every time.* ← recommended (proof-led)
  2. *Programme-grade branding for organisations that can't get it wrong.*
  3. *Your brand, on every back in Botswana.*
- **Voice:** plain, operational, documentary. Show the checklist, the certificate, the delivery photo, the on-time percentage. Buyers in mining and procurement trust evidence, not adjectives.
- **Proof artefacts every client should receive:** specification sheet → first-article photo → QC record → certificate pack → proof of delivery → consumption/budget report. This chain *is* the brand.

---

## 10. Governance, ethics and risk control in the orchestration model

- **Honesty in capability:** never claim a capability a partner does not demonstrably have. Disclose subcontracting when asked; do not hide it.
- **Fair dealing with partners:** written terms, prompt payment (target ≤30 days from client receipt), transparent margin splits, no poaching their staff or clients in breach of good faith. A network built on exploitation collapses.
- **No counterfeit or grey-market safety equipment. Ever.** If a supplier cannot provide traceability, they cannot supply you. Safety failures injure workers and end companies.
- **Conflict of interest:** if you hold an interest in a partner entity, disclose it in writing to clients upon request.
- **Data handling:** client artwork, employee size data and contact details are personal/business data — handle per Botswana's Data Protection Act (see `06`).
- **Insurance:** public liability, goods-in-transit, professional indemnity, and (when the fleet grows) commercial vehicle cover. Obtain written quotes before your first large contract; many corporate clients will ask for the certificate.
- **Contracts:** a one-page master services agreement + specification annexure + SLA, reviewed by a Botswana-qualified lawyer once, then reused. Do not draft contracts from templates found on the internet.
