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
| `index.html` | Storefront: hero, quote engine, catalogue, programme services, partner recruitment |
| `assets/app.js` | Quote engine + catalogue rendering (all calculation is client-side) |
| `assets/styles.css` | Mobile-first styles with a print stylesheet for client-facing quotations |
| `data/catalogue.json` | **Product master** — products, decoration methods, delivery zones, pricing rules |
| `sw.js` | Offline caching (registered only over HTTPS) |
| `manifest.webmanifest` | Installable PWA |

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
4. **Add real photography, a logo, and PWA icons** (`assets/icon-192.png`, `assets/icon-512.png` are referenced
   but not yet created).
5. **Add a privacy notice and terms** before collecting any client data; keep personal data minimal and
   Botswana-resident per the Data Protection Act.
6. **Remove or lock the internal margin panel** if the storefront will ever be shown to a client on-screen.

## Roadmap for this asset

| Phase | Milestone |
|---|---|
| v1 (now) | Static storefront + indicative quote engine, deployed free |
| v2 | Persist quote requests (Cloudflare Workers + D1), CRM export, automated follow-up |
| v3 | Multi-tenant Client Brand Stores: per-client catalogue, budgets, approval workflow, order history |
| v4 | Product data API in the spirit of PromoStandards, so other resellers and partners can pull live pricing |
| v5 | Partner portal: job routing, capacity board, scorecards, invoicing |
