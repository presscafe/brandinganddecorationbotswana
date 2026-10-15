# Branding & Decoration Botswana

**Programme-grade branding partner for Botswana** — branded workwear, PPE, corporate clothing, headwear,
corporate gifts and event display.

> *Specified. Branded. Delivered. Every site, every time.*

This repository holds the commercial strategy package and the working digital front door for the enterprise.
It is not a generic e-commerce theme any more: it is the operating base for a Botswana business that
**orchestrates** supply, decoration, partner capacity and delivery instead of owning a warehouse full of stock.

---

## Start here

| If you want to… | Open |
|---|---|
| Understand the whole strategy in one sitting | [`docs/00-executive-brief.md`](docs/00-executive-brief.md) |
| See the market evidence | [`docs/01-market-research-ssa-2026.md`](docs/01-market-research-ssa-2026.md) |
| Know exactly who you are up against | [`docs/02-competitive-map.md`](docs/02-competitive-map.md) |
| Understand how the business actually runs | [`docs/03-orchestration-operating-model.md`](docs/03-orchestration-operating-model.md) |
| See the numbers, margins and capital plan | [`docs/04-commercial-model-unit-economics.md`](docs/04-commercial-model-unit-economics.md) |
| Plan the digital assets and SEO | [`docs/05-digital-asset-blueprint.md`](docs/05-digital-asset-blueprint.md) |
| Check compliance and risk exposure | [`docs/06-compliance-risk-register.md`](docs/06-compliance-risk-register.md) |
| Trace every figure to a source | [`docs/07-sources.md`](docs/07-sources.md) |
| Work the delivery backlog | [`docs/08-backlog.csv`](docs/08-backlog.csv) (import to Linear/Notion) |
| Launch the storefront | [`store/README.md`](store/README.md) |

---

## The one-paragraph thesis

Amrod, Barron and the South African distributor layer own catalogue breadth and landed cost, and they are
**trade-only** — they sell to resellers, not to corporates. Botswana's local market is split between commodity
PPE distributors with no branding capability and micro print shops that cannot carry a 600-unit multi-site
rollout. The gap in the middle — specification, compliant sourcing, quality decoration, kitting, multi-site
delivery, replenishment and digital reordering — is unoccupied. This enterprise occupies it: own the decoration
capacity and the orchestration system, rent the supply and the logistics, and monetise through decoration
margin, programme contracts and Client Brand Stores.

---

## What is in this repo

```
docs/                 Strategy, research, compliance and commercial package
  00-executive-brief.md
  01-market-research-ssa-2026.md
  02-competitive-map.md
  03-orchestration-operating-model.md
  04-commercial-model-unit-economics.md
  05-digital-asset-blueprint.md
  06-compliance-risk-register.md
  07-sources.md
  08-backlog.csv
  archive/            Original Gatsby theme README (kept for reference)
  sops/               Standard operating procedures (to be written — see backlog BDB-019)

store/                Working storefront + instant quote engine (static PWA, no build step)
  index.html          Hero, quote engine, catalogue, programme services, partner recruitment
  assets/app.js       Duty-aware pricing engine (volume tiers, decoration, credit, rush, VAT)
  assets/styles.css   Mobile-first responsive + print stylesheet for client quotations
  data/catalogue.json Product master, decoration methods, delivery zones, pricing rules
  sw.js, manifest.webmanifest

src/, static/, *.js   The original Gatsby theme (currently unmodified, pending decision — see below)
cypress/, netlify.toml
```

---

## Run the storefront locally

```bash
cd store
python3 -m http.server 8080     # then open http://localhost:8080
```

Deploy free on Cloudflare Pages with **no build command** and **output directory `store`**. See
`store/README.md` for the full checklist, including everything that must be replaced before this touches a
real customer.

---

## Status and the next action

**Current status: pre-revenue. Strategy package and digital prototype complete. Nothing has been sold yet.**

The single next action (from the executive brief):

> **Complete five supplier quotation rounds — one Amrod Botswana trade account, one SA stockist, one China
> agent, one Botswana cut-make-trim factory, one local competitor-turned-partner — and cost four real client
> jobs end-to-end using the quote engine in `store/`.**

That converts every modelled number in `docs/04-commercial-model-unit-economics.md` from *estimate* to
*evidence*. It costs time and transport, not capital.

---

## Retired: the original Gatsby theme

This repository began life as an unmodified Netlify/Matter Gatsby e-commerce theme. That theme was **retired on
15 October 2026** — mock data, demo branding, Cypress scaffolding and a build pipeline that produced nothing of
commercial value. The storefront of record is the zero-build static PWA in `store/`.

The full rationale, what was removed, the exact commit to restore from, and the trigger conditions for a future
Astro migration are recorded in [`docs/decisions/2026-10-15-retire-gatsby-theme.md`](docs/decisions/2026-10-15-retire-gatsby-theme.md).

## Non-negotiables

1. No counterfeit, grey-market or untraceable safety equipment — traceability or no supply.
2. No improper inducements, no bid manipulation, no informal commissions to procurement staff.
3. Every quoted figure traceable to a verified cost; quotes carry 14-day validity and stated exclusions.
4. Personal data minimised, access-controlled, with a Botswana-resident copy (Data Protection Act 2024).
5. Nothing in this repository is legal, tax or compliance advice — verify with qualified professionals in
   Botswana before relying on it.
