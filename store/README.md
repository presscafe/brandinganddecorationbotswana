# store/ — Responsive Offline-First PWA + CMS + ERP (free stack)

A **zero-dependency, zero-build** static PWA that is three things at once:

1. **Ecommerce front-end** — instant quote builder (pick → brand → fine-tune) with live answer panel
2. **CMS** — vendor content, supplier lanes, certificates, Brand Vaults
3. **ERP** — quotes/orders, customers, stock, partners, pricing rules, fulfillment

All client-side, offline-first, installable. No paid backend. Deploys to **Cloudflare Pages free** with one `git push`.

> v2 (29 Oct 2026): supplier-orchestrated catalogue + full ERP at `admin.html`.

---

## Why this exists

The original Gatsby theme was retired 15 Oct 2026 (see `../docs/decisions/2026-10-15-retire-gatsby-theme.md`). This PWA ships a **commercial-grade front door + back-office** today — on free infrastructure, without framework lock-in. The data model (`data/*.json`) is portable to Astro/Workers later.

---

## Run it locally

```bash
cd store
python3 -m http.server 8080
# open http://localhost:8080        — storefront
# open http://localhost:8080/admin.html — CMS/ERP (PIN default 2026)
```

Do **not** open `index.html` via `file://` — `fetch` for JSON is blocked there. The ERP also uses `IndexedDB` which requires http.

---

## Deploy it (free)

**Cloudflare Pages (recommended, free, no lock-in):**

1. Push to GitHub (this repo).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: *(leave empty)* · Output directory: `store`
4. Deploy. Add domain `brandinganddecoration.co.bw` in Pages → Custom domains.

**Netlify** is identical: publish dir `store`, no build command.

**Free stack audit:**

| Layer | Service | Free limit | What it does here |
|---|---|---|---|
| Hosting + CDN + SSL | Cloudflare Pages | Unlimited bandwidth | Serves PWA globally |
| Functions (later) | Pages Functions / Workers | 100k req/day | Quote persistence when >60/mo |
| DB (later, optional) | D1 (SQLite) | 5 GB | Only when IndexedDB is outgrown |
| KV | Workers KV | 1 GB | Price-sheet cache |
| Repo + CMS | GitHub | Free | Durable JSON + audit trail |
| Offline DB | Browser IndexedDB | ~60% of disk | Full ERP offline (mine-gate, 2G) |
| Auth | Cloudflare Access | 50 users free | SSO for `/admin.html` team |
| Analytics | Cloudflare Web Analytics | Free, no cookies | DPA-friendly |

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Ecommerce front-end: three-step builder, live answer, catalogue, supplier strip, programmes, partners |
| `admin.html` | **CMS + ERP** — Dashboard, Catalogue, Suppliers, Vendor Content, Quotes/Orders, Customers/Vaults, Partners, Certificates, Pricing, Buffer Stock, Import/Export, System |
| `assets/app.js` | Quote engine + storefront wiring (duty-aware, margin-tiered, VAT, delivery) + offline DB fallback |
| `assets/admin.js` | ERP logic: IndexedDB CRUD, supplier orchestration, vendor content, stock, import/export |
| `assets/db.js` | IndexedDB helper (`bdb-erp`): the free offline backend; export → JSON → GitHub |
| `assets/styles.css` | Storefront styles — responsive, mobile sticky total, print stylesheet |
| `assets/admin.css` | ERP styles — collapsible sidebar, mobile overlay |
| `data/catalogue.json` | **Product master** — 46 SKUs, each mapped to 1–3 supplier lanes, decoration methods, pricing rules |
| `data/suppliers.json` | **Supplier registry** — 12 lanes: Amrod BW, Barron, Jonsson, Industrial Clothing, TwentyFour, Jasani.ae, China agent, local CMT, buffer + overflow |
| `data/vendors.json` | **Vendor content registry** — vendor-supplied descriptions, images, size charts, test reports |
| `manifest.webmanifest` | Installable PWA: shortcuts (Quote, Catalogue, Admin), share_target, screenshots |
| `sw.js` | Offline-first SW v2: app shell cache-first, `data/*.json` stale-while-revalidate, admin cached |
| `privacy.html`, `terms.html`, `404.html` | Legal + UX (DPA 2024, 14/30-day validity, ethics) |
| `robots.txt`, `sitemap.xml`, `_headers` | SEO + security (HSTS, CSP, cache) |

---

## The supplier orchestration layer (what outcompetes everyone)

**You do not own stock — you orchestrate lanes.** Each SKU carries a `suppliers[]` array:

- **Primary:** Amrod Botswana (`amrod_bw`) — 14k SKUs, trade-only ally, breadth + tier price — BDB-001
- **Second source / brand:** Barron (`barron_sa`) — size consistency, mining spec — BDB-002
- **Workwear/PPE benchmark:** Jonsson (`jonsson_sa`), Industrial Clothing (`industrial_clothing_sa`)
- **Price benchmark:** TwentyFour (`twentyfour_sa`) — visible SA pricing
- **Gifts import:** Jasani.ae (`jasani_ae`) — Dubai FOB — BDB-003 lane
- **Volume import:** China agent (`china_agent`) — MOQ 500+, duty-aware landed calc
- **Local content:** Botswana CMT (`local_ctm_bw`) — 10–15% PPRA preference — BDB-004
- **Speed:** Gaborone buffer (`local_stock_bw`) — 0-day issue
- **Overflow:** ProBrand/Brandability, Hadida, Sondor, etc.

The **storefront** shows lane chips per product and a supplier filter in the catalogue. The **ERP** lets you edit trade status, MOQ, lead time, duty, and mapped SKUs per lane — then export to `suppliers.json` and redeploy.

> Why this wins: competitors are single-sheet or single-machine. You are multi-source, duty-aware, and quote-transparent. Once a client’s Brand Vault + programme spec lives in your ERP, switching cost is brutal (see `docs/03`).

---

## PWA — responsive, offline-first, installable

- **Responsive:** mobile-first grid, card flow, sticky quote total via `mobile-bar`, collapsible admin sidebar, `env(safe-area-inset-bottom)` for notched screens, `prefers-reduced-motion` respected.
- **Offline-first:** `sw.js` v2 caches shell (`index.html`, `admin.html`, CSS/JS, data) and uses stale-while-revalidate for `data/*.json`. Quotes queue to IndexedDB (`syncQueue`) when offline and export when back online. Tested on 3G via Lighthouse.
- **Installable:** `manifest` with `standalone`, `maskable` icons, `shortcuts` (Quote/Catalogue/Admin), `share_target`, `launch_handler`.
- **Verification:** Cloudflare Pages deploy → Chrome DevTools → Application → offline checkbox → reload → quote builder still works. Lighthouse PWA ≥90 when served over HTTPS.

---

## CMS + ERP — how the backend works (free)

**No server. The browser *is* the backend.**

- **Storage:** `IndexedDB` database `bdb-erp` (stores: `products`, `suppliers`, `vendors`, `quotes`, `orders`, `customers`, `partners`, `certificates`, `vaults`, `settings`, `syncQueue`). Created/seeded from `data/*.json` on first load, then diverges as you edit.
- **CMS:** Products, suppliers, vendor content (descriptions, images, size charts, test reports that feed SEO + certificate register), pricing rules, delivery zones.
- **ERP:** Quotes → Orders → Production → Delivery → Invoiced workflow; customer/Customer Vaults (logo, Pantone→thread, size matrix, delivery addresses); partner network with scorecards; buffer stock with reorder flags; receivables minded via `settings.config.credit_surcharge`.
- **Offline:** every edit writes to IndexedDB instantly. When online, Export → copy JSON → commit to `store/data/*.json` → push → Cloudflare Pages redeploys. That is the durable, audited, free CMS pipeline.
- **Auth:** local PIN (default `2026`, stored `localStorage` on this device). For a team, protect `/admin.html*` with **Cloudflare Access** (Zero Trust, free 50 seats): Pages → Settings → Access → Add application → path `admin.html*` → allow your emails. Now SSO, still free.
- **Import/Export:** ERP → Import/Export panel → paste supplier sheet CSV (`id,name,landed_cost,moq,lead_days,channel`) or JSON → merge/replace → Export → download or copy → commit.

**Typical admin flow:**

1. Open `admin.html` → enter PIN `2026` → Dashboard → Seed / Re-sync
2. Catalogue → search `vest` → Edit landed cost (duty-paid) + suppliers → Save
3. Suppliers → Amrod BW → set Trade Account `open`, lead `3d` → Save
4. Vendor Content → add Barron size chart → attach to vault
5. Quotes → review offline-captured quotes → approve → export `quotes.json`
6. Import/Export → Export ALL → download → commit to `store/data/` → push

---

## The storefront — how buying works

- **Card-step flow** (one job per card): pick → brand → fine-tune. Big touch targets, progressive disclosure.
- **Live answer panel** — the price is always visible, recalculates on every change. Headline: *“P234.29 per each — Embroidery (8,000 stitches) · delivered to Gaborone · prepayment · ready in 5 days.”*
- **Guidance not blocking:** MOQ/minimums shown as notes, never disabled controls. Volume tip: *“at 500 units P275.83, save P10.94 each.”*
- **Pricing model:** `(landed × (1+margin)) + decoration + setup + credit + rush + delivery` then `+14% VAT`. Margins: <25→48%, 25–99→40%, 100–499→34%, 500+→28%. Floor 28% decorated + 50% decoration. Duty embedded per `channel`.
- **Offline:** quotes generate in-browser; no data leaves device until you click WhatsApp/email. Offline captures queue locally.

---

## Before this goes near a customer

1. **Replace modelled costs** in `catalogue.json` with verified quotations (BDB-005). That is the #1 gate.
2. **Set `WHATSAPP_NUMBER` + `EMAIL`** in `assets/app.js` (full international, no +/spaces).
3. **Verify VAT/corporate tax + BOBS CoC** per line with auditor/clearing agent (`docs/06`).
4. **Protect `admin.html`** with Cloudflare Access before adding staff.
5. **Lock or remove internal margin view** before screenshare — it is behind `<details class="margin">`.

---

## Roadmap

| Phase | Milestone |
|---|---|
| v1 ✅ | Static storefront + live quote builder (free) |
| **v2 ✅ (now)** | **Offline-first PWA + supplier-orchestrated catalogue + CMS/ERP at `admin.html` (IndexedDB, Import/Export, vendor content)** |
| v3 | Quote persistence via Pages Functions + D1, automated follow-up, per-client Brand Store (single-tenant static export) |
| v4 | PromoStandards-style product API for resellers/partners |
| v5 | Partner portal — job routing, capacity board, scorecards, invoicing (currently manual via ERP) |

---

## Editing

- Catalogue: `admin.html` → Catalogue or edit `data/catalogue.json` directly (run `python3 -m json.tool` to validate).
- Suppliers: `admin.html` → Suppliers or edit `data/suppliers.json`.
- Vendor content: `admin.html` → Vendor Content or edit `data/vendors.json`.
- All JSON is portable — the ratio of “what we source where” is the moat, not the framework.
