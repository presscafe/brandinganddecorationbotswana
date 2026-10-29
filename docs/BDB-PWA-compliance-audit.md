# PWA Compliance Audit — International Best Practice (2026-10-29)

**Scope:** store/ as deployed to Cloudflare Pages (free). **Baseline:** MDN PWA + W3C WCAG 2.2 AA + Google Lighthouse + OWASP.

## What passes today (v3)

| Standard | Evidence | Gap |
|---|---|---|
| **PWA installable** | `manifest.webmanifest` (name/short_name/icons 192+512 maskable, start_url ./, display standalone, theme #0f3d2e, shortcuts) + `sw.js` (install/activate/fetch, CACHE_VERSION bdb-v3, stale-while-revalidate for data) — Lighthouse PWA ≥90 expected | `shortcuts` now 4 (quote/catalogue/admin/BOBS CoC) — OK |
| **Offline-first** | App shell cache-first, data stale-while-revalidate, IndexedDB via `db.js` (ERP). `store/_headers` has `Cache-Control: public,max-age=31536000,immutable` for assets, `no-cache` for sw.js | Test offline badge (`store/assets/app.js#offlineBadge`) — needs real device test before BDB-010 Done |
| **Security headers (free)** | `store/_headers`: HSTS 1y, XFO DENY, nosniff, Referrer strict-origin-when-cross-origin, Permissions-Policy, **CSP: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'** — strict, correct | CSP `unsafe-inline` for styles needed by ERP inline styles — acceptable but log; no inline scripts |
| **SEO** | canonical, og:image, JSON-LD LocalBusiness + FAQPage, sitemap 16 URLs, robots.txt, 12 seo/ leaves unique | Add og:image actual file check |
| **Privacy** | `privacy.html` DPA 18/2024 + 72h breach, `BDB-030` controls, minimal PII | Needs DPO email real |

## Gaps fixed tonight

1. **WCAG 2.2 AA — colour + focus:** audit `assets/styles.css` for contrast #0f3d2e on #fff (pass), add `:focus-visible` outline, ensure `topnav` is keyboard reachable, add `skip link`.
2. **GitHub Actions:** added `.github/workflows/validate.yml` (free) + `cloudflare-pages.yml` (Pages Git integration, no secret). Zero paid steps.
3. **Ethical charter:** `docs/ethical-charter.md` — secular wording of riba/gharar/halal/zakat for tender scoring.

## Competitive / disruptive hooks (how PWA beats the print shop)

- **Speed as weapon:** instant quote engine (no form wait) — quote renders on every keystroke, WhatsApp/Copy in one tap. Traditional competitors make you email a form.
- **Offline in the field:** mine site with no signal still builds quote + shows catalogue — competitors' sites are dead without data. IndexedDB sync queue flushes on `sync` event.
- **ERP without SaaS cost:** `admin.html` is full CMS+ERP (CRUD catalogue/suppliers/vendors/quotes/customers) — competitors pay Shopify/HubSpot monthly. We pay 0 (Pages free + IndexedDB).
- **Programme moat:** Brand Vault per client (logo/Pantone/size matrix) — reordering in 3 taps tomorrow, competitors re-quote from scratch.
- **Transparency:** cost+margin visible in ERP (ethical charter) — mine procurement can audit the 28%+ margin logic, not guess.

## Next (owner)

- [ ] Run `npx @lhci/cli autorun --staticDistDir=./store` locally — capture desktop+mobile JSON, fix any <90.
- [ ] Device test: Android Chrome → Add to Home Screen → offline → quote still works.
- [ ] Replace WHATSAPP_NUMBER + EMAIL before Lighthouse outreach step (deploy gate).
