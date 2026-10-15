# store/ — Storefront & Instant Quote Engine (working prototype)

A **zero-dependency, zero-build** static PWA: storefront, curated catalogue, and a duty-aware indicative quote
engine. It runs from any static host, works offline once loaded, and stores nothing on any server.

## Why this exists

The original Gatsby/Netlify e-commerce theme was **retired on 15 October 2026** (see
`../docs/decisions/2026-10-15-retire-gatsby-theme.md`). It could not be launched without a build toolchain and
contained no Botswana content. This prototype ships a usable commercial front door **today**, on free
infrastructure, without locking the business into a framework. When the content library justifies a build step,
migrate this design to Astro — the data model here (`data/catalogue.json`) is portable.

## Run it locally

```bash
cd store
python3 -m http.server 8080
# open http://localhost:8080
```

Do **not** open `index.html` directly from the filesystem — the catalogue is loaded with `fetch`, which browsers
block on `file://` URLs.

## Deploy it (free tier)

**Cloudflare Pages** (recommended — no lock-in, free SSL, global CDN):

1. Push the repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: *(leave empty)* · Build output directory: `store`
4. Deploy. Add the custom domain (e.g. `brandinganddecoration.co.bw`) in Pages → Custom domains.

Netlify is equally viable: set the publish directory to `store` and no build command.

## Files

| File | Purpose |
|---|---|
| `index.html` | Three-step builder (pick → brand → fine-tune), live answer panel, catalogue, programmes, partners |
| `assets/app.js` | Quote engine + interface wiring (all calculation is client-side) |
| `assets/styles.css` | Card-based interface, mobile sticky total, print stylesheet for client-facing quotations |
| `data/catalogue.json` | **Product master** — products, decoration methods, delivery zones, pricing rules |
| `sw.js` | Offline caching (registered only over HTTPS) |
| `manifest.webmanifest` | Installable PWA |

## How the interface is designed

Two ideas, deliberately mixed:

- **Card-step flow (Gamma-style).** One job per card, big touch targets, nothing disabled, progressive
  disclosure — embroidery and print settings only appear when you choose those methods; delivery, terms and
  turnaround sit behind one "Fine-tune" disclosure.
- **Live answer panel (Napkin-style).** The price is always on screen and recalculates on every change — no
  submit button anywhere in the flow. The headline is a plain sentence, not a table: *"P234.29 per each —
  Embroidery (8,000 stitches) · delivered to Gaborone · prepayment · ready in about 5 working days."*

Two behaviours worth knowing:

- **Volume tips.** When the next quantity tier is close, the panel says exactly what it would save per unit —
  e.g. *"at 500 units the unit price falls from P286.77 to P275.83."* Guidance, never a hard block.
- **Guidance instead of blocking.** Minimum-quantity and economical-minimum warnings are shown as notes; the
  customer can always see the number rather than being stopped by a disabled control.

On mobile the steps come first and a sticky bar carries the running total; **Breakdown** scrolls to the full
panel. Staff margin figures stay behind a collapsed "Internal margin view" disclosure.

## The pricing model in `data/catalogue.json`

```
Sell price = (Landed product cost × (1 + volume-tier margin))
           + (Decoration unit price × quantity)
           + One-off setup charges (digitising, screen setup, artwork jig)
           + Payment-terms surcharge (0% prepay · +2% 30 days · +4% 60 days)
           + Rush surcharge (+20% for ≤72 hours)
           + Delivery (free above P25,000)
           + VAT @ 14%
```

- **Volume tiers:** <25 units → 48% margin · 25–99 → 40% · 100–499 → 34% · 500+ → 28%.
- **Margin floor:** decorated work is never quoted below a 28% gross margin; the "Internal margin view" panel
  in the quote output flags any job that breaches it.
- **Duty is structural, not cosmetic:** `channel` marks whether a product comes from a SACU trade account
  (duty embedded), direct import (40–45% MFN duty on clothing applies), or local manufacture. Landed costs in
  the file must therefore already be duty-inclusive for their channel.

## Before this goes anywhere near a customer

1. **Replace every cost in `data/catalogue.json` with a verified supplier quotation.** Current figures are
   modelling placeholders — a mix of SA trade pricing, indicative import landed cost and local fabrication.
2. **Set `WHATSAPP_NUMBER` and `EMAIL` in `assets/app.js`.**
3. **Verify VAT treatment and current corporate tax rate** with an auditor, and confirm BOBS Certificate of
   Conformity requirements for each imported garment line (see `../docs/06-compliance-risk-register.md`).
4. **Add real photography, a logo, and proper PWA icons** — `assets/icon-192.png` and `assets/icon-512.png`
   exist as flat-colour placeholders and are safe to overwrite.
5. **Add a privacy notice and terms** before collecting any client data; keep personal data minimal and
   Botswana-resident per the Data Protection Act.
6. **Lock or remove the internal margin view** (`<details class="margin">`) before showing the store on a
   client's screen.

## Roadmap for this asset

| Phase | Milestone |
|---|---|
| v1 (now) | Static storefront + live quote builder, deployed free |
| v2 | Persist quote requests (Cloudflare Workers + D1), CRM export, automated follow-up |
| v3 | Multi-tenant Client Brand Stores: per-client catalogue, budgets, approval workflow, order history |
| v4 | Product data API in the spirit of PromoStandards, so other resellers and partners can pull live pricing |
| v5 | Partner portal: job routing, capacity board, scorecards, invoicing |
