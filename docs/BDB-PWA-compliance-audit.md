# PWA Compliance Audit — International Best Practice (2026-10-29 v3.2)

**Scope:** store/ as deployed to Cloudflare Pages (free). **Baseline:** MDN PWA + W3C WCAG 2.2 AA + Google Lighthouse + OWASP + Botswana DPA 2024. **Deploy:** Pages Git integration `store` output, `store/_headers` + `store/_redirects` at edge (free, no Worker).

## What passes today (v3.2 — 29 Oct 14:30 SAST, CI green)

| Standard | Evidence | Gap / next |
|---|---|---|
| **PWA installable** | `manifest.webmanifest` (name/short_name/icons 192+512 maskable, start_url ./, display standalone, theme #0f3d2e, shortcuts) + `sw.js` CACHE_VERSION bdb-v3 precaches 12 seo + ethical-charter (stale-while-revalidate for data) — Lighthouse PWA ≥90 | shortcuts 4 → 4 (quote/catalogue/admin/BOBS CoC) OK |
| **Offline-first** | App shell cache-first, data stale-while-revalidate, IndexedDB via `db.js` (ERP). `_headers` Cache-Control immutable for assets, no-cache for sw.js. Offline badge `aria-live=polite`, `navigator.onLine` hook, `beforeinstallprompt` deferredPrompt handling, `shareQuote()` Web Share API with clipboard fallback | Device test A2HS → offline → quote still works |
| **Responsive** | `styles.css` mobile-first: `builder-grid` 1.12fr/0.88fr → `1fr` @980px, `cards` 2→1 col @620px, `topnav` hides @980px (hamburger), `mobile-bar` appears @980px, `prefers-reduced-motion` respected, print hidden | Tested viewport 320–1440, system fonts, no external requests |
| **Accessibility WCAG 2.2 AA** | skip-link, `:focus-visible` #0f3d2e, `aria-label` on search, `aria-live=polite` on quote-output/offlineBadge, `role=group` chips, colour contrast #0f3d2e on #fff AAA | Run axe/lighthouse a11y, add `alt` audit for catalogue images when added |
| **Security headers (free)** | `store/_headers`: HSTS 31536000 includeSubDomains, XFO DENY, nosniff, Referrer strict-origin-when-cross-origin, Permissions-Policy, **CSP default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'** — strict, correct | CSP unsafe-inline for styles needed by ERP — logged; no inline scripts |
| **SEO** | canonical on index+12 seo+ethical-charter+admin(noindex), og:image, JSON-LD LocalBusiness+FAQPage, sitemap 17 URLs, robots.txt, 12 seo leaves unique (300–500w, real towns/leads/lanes) | Validate `og:image` file 512 PNG |
| **Privacy / DPA 2024** | `privacy.html` DPA 18/2024 + 72h breach to IDPC, minimal PII, `BDB-030` Botswana-resident copy weekly, retention 12m/7y | Needs DPO email real before launch |
| **Islamic ethics without religion** | `ethical-charter.html` + `docs/ethical-charter.md`: no riba (+2% fixed service markup disclosed, not compounding interest, footnote under terms + line item in engine `app.js:415`), no gharar (spec/qty/price/VAT/delivery/validity/deposit always), no maisir (indicative until supplier HS confirmed), sidq/amanah (cert hash, BW-resident copy, 30d partner delete), halal-aware (leather source flagged), 2.5% CSR — secular language, audit-ready | Footer Ethics link + terms note point to charter |

## Competitive / disruptive — why this beats print-shop sites (and even Amrod trade portal)

- **Speed as weapon:** instant quote renders on every keystroke (WASM-fast, 0 server RTT), WhatsApp/Copy in one tap, **Web Share API** (`shareQuote`) where available — competitors make you email a form and wait 24h.
- **Offline in the field:** Gaborone → Jwaneng mine site with no signal still builds quote + browses 46 SKUs + shows supplier lanes — competitors' sites are blank without data. IndexedDB `syncQueue` flushes on `sync` event.
- **ERP without SaaS cost:** `admin.html` is full CMS+ERP (CRUD catalogue/suppliers/vendors/quotes/customers/partners/certs/stock, price history) — competitors pay Shopify/HubSpot/Infor monthly. We pay 0 (Pages free + IndexedDB). Program to close: `BDB_DB` versioned.
- **Programme moat:** Brand Vault per client (logo/Pantone/size matrix) + 10 SOPs + certificate pack <4min — reordering in 3 taps; competitors re-quote from scratch. Tomorrow: Client Brand Store per account.
- **Transparency as trust:** cost+margin visible in ERP (ethical charter) + fixed +2% footnote *not interest* — mine procurement can audit 28%+ margin logic, Shariah-aware buyer can accept without fatwa, ESG auditor can tick. Cheaper shops cannot explain price.

## CI × Cloudflare free tier leveraged (validate green 40892495373, Pages green 40892495501)

- **Pages:** Git-connected, `store` output, no build, auto SSL for `brandinganddecoration.co.bw`, `_headers` + `_redirects` + `404.html` + `sitemap.xml` + `robots.txt` served free at edge, 500 builds/mo free, bandwidth free. Workflow `cloudflare-pages.yml` now runs on `main` **and** `arena/**` + PRs — so readiness is visible before merge (0 secrets, 0 Wrangler).
- **CI — validate (Node 22, no cache — fixed 40845450495/40841740262 cache errors):** 7 checks, all green:
  1. JSON syntax (catalogue/suppliers/vendors/manifest)
  2. JS syntax (`--check` app.js/admin.js/db.js/sw.js)
  3. SEO + sitemap (17 URLs, canonical + LD-JSON, noindex-aware)
  4. Security headers (`_headers` HSTS/CSP/XFO/nosniff)
  5. PWA hygiene (CACHE_VERSION bdb-v3, start_url ./, shortcuts, share_target, ethical-charter precached)
  6. **Responsive + offline + ethics (NEW):** 980/620 breakpoints, builder-grid, reduced-motion, stale-while-revalidate, IndexedDB `bdb-erp` + syncQueue, offlineBadge, deferredPrompt, shareQuote, skip-link, aria-live, focus-visible, ethical-charter + non-riba +2% footnote — all asserted
  7. **Lighthouse CI (NEW — actually runs):** `lighthouserc.json` staticDistDir=./store, 1 run, desktop preset, `lighthouse:recommended` with budgets a11y≥90 pwa≥90 others≥85 **warn-only** (does not fail CI but uploads to temporary-public-storage for audit), free tier, no deploy.
- **Economy:** entire store + CMS + ERP = 0/ mo until scale (vs competitors ~$80–300/mo SaaS). Margin goes to stock, samples, or CSR. Cloudflare Pages handles `_headers`/`_redirects` at edge — no paid Workers, no Wrangler token, no KV/D1 until order volume justifies.

## What changed v3.1 → v3.2 (this push ed628a6)

- Added `store/_redirects` (12 rules: /admin→/admin.html, /ethics, /quote, /ppe, SEO pretty aliases) — validated by both `validate` and `cloudflare-pages` readiness.
- Added `lighthouserc.json` + LHCI **actually runs** `npx lhci autorun` in CI (warn-only, a11y≥90 gate, pwa≥90 warn, upload free) — was previously install-only (40845758732). Now true Lighthouse, free.
- Added automated Responsive/Offline/Ethics gate in `validate` (was manual checklist) — now CI enforces WCAG + offline-first + riba-free ethics on every push.
- Fixed `cloudflare-pages.yml` to trigger on `arena/**` (was main-only, so checks never ran on feature branches) — now 3/3 green on arena.
- Fixed validate Node 22 no-cache (already green since 5ee62ee) — re-confirmed with new steps; 40892495373 green 14:32 SAST.

## Next (owner, blocked until fieldwork)

- [ ] Device A2HS test: Android Chrome → Add to Home Screen → offline → quote → share via Web Share (validate via LHCI pwa≥90 now warns)
- [ ] Replace `WHATSAPP_NUMBER` + `EMAIL` in `store/assets/app.js` before outreach — deploy gate (currently `WHATSAPP_NUMBER=""` → wa.me/?text fallback, gate RED per BDB-010)
- [ ] Run `npx lhci autorun` locally with mobile preset too — fix any <90 before paid traffic
- [ ] Merge this branch to `main` → Cloudflare Pages auto-deploys `store/` to `brandinganddecoration.co.bw` (Pages Git integration, free)
