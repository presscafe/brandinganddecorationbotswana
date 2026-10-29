# BDB-010 — Deployment Checklist (Cloudflare Pages, free tier, zero build)

**Output dir:** `store`  **Build command:** *(leave empty)*  **Domain:** `brandinganddecoration.co.bw` (or pending)

## Pre-flight (local, 2 min)
- [ ] `python3 -m json.tool store/data/catalogue.json` OK
- [ ] `python3 -m json.tool store/data/suppliers.json` OK
- [ ] `node --check store/assets/*.js` OK
- [ ] `WHATSAPP_NUMBER` + `EMAIL` in `store/assets/app.js` are real (not example/empty)
- [ ] `store/data/catalogue.json → config.vat_rate` matches auditor (BDB-007)
- [ ] Lighthouse local: `npx serve store` → Chrome → Lighthouse → PWA ≥90, Performance ≥90

## Push (1 min)
- [ ] `git push origin arena/...` (this branch)
- [ ] GitHub Actions (if any) green

## Cloudflare Pages (2 min)
1. dashboard.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → repo `presscafe/brandinganddecorationbotswana` → branch `arena/e920fd88-brandinganddecorationbotswana` (or `main` after merge)
2. Build: leave empty · Output: `store`
3. Env: none (static). Deploy.
4. Custom domain: Pages → Custom domains → Add `brandinganddecoration.co.bw` + `www.brandinganddecoration.co.bw` (CNAME as instructed) → wait SSL (auto).
5. Protect admin: Zero Trust → Access → Add app → Self-hosted → path `brandinganddecoration.co.bw/admin.html*` → Allow your emails (free 50) → Save.

## Verify (3 min)
- [ ] `https://brandinganddecoration.co.bw/` loads → quote builder works → offline badge shows
- [ ] `https://brandinganddecoration.co.bw/admin.html` → PIN 2026 → Dashboard counts = 46/12/0
- [ ] `https://brandinganddecoration.co.bw/sitemap.xml` → `https://…/privacy.html` crawls
- [ ] Chrome DevTools → Application → Service Workers → Offline → reload → still works
- [ ] GBP website field points to new domain

## Done = BDB-010 acceptance
Site live on HTTPS, Lighthouse >90, WhatsApp CTA routes to real number, `/admin.html` SSO-protected.
