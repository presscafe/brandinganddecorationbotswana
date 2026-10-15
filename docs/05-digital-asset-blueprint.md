# DIGITAL ASSET BLUEPRINT

**Guiding question:** *what can we own rather than rent?*
**Progression:** borrowed attention → owned audience → owned platform → owned data → recurring revenue.

---

## 1. The compounding chain (this enterprise's version)

```
Research (this package)
   → SEO page (product × town × compliance)
      → Social post (Facebook/Instagram/WhatsApp status)
         → Lead (quote request via engine)
            → Order (transactional revenue)
               → Client Brand Vault (sticky data asset)
                  → Client Brand Store (recurring platform fee + order margin)
                     → Programmable data: product master, price index, tender radar
                        → Network partner subscriptions (platform take rate)
                           → Licensing: white-label store + catalogue data to other resellers
```

Each step is an asset. Nothing is a "campaign".

---

## 2. Asset register (owned properties to build, in order)

| # | Asset | Type | Demand evidence | Audience | Distribution | Monetisation | Recurring? | Cost | Difficulty | Durability | Strategic value | Next move |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Storefront + instant quote engine** (`store/` in this repo) | PWA/site | Buyers expect instant pricing; local competitors have none [S3][S50] | Gaborone corporates, SMEs | SEO, WhatsApp, GBP | Order margin | No | Free | Low | Evergreen | **Critical** | Deploy to Cloudflare Pages this week |
| 2 | **Keyword-led content library** (40–80 pages) | SEO property | Local intent searches for embroidery, printing, PPE, corporate gifts, uniforms | Procurement + SME buyers | Organic search, LinkedIn, Facebook | Lead generation | Compounding | Time only | Low | Evergreen | **Critical** | Publish 12 pages in 30 days |
| 3 | **Client Brand Vault** (per client) | Data asset | Client logos, pantones, size matrices, approvals | Existing clients | Delivered as a service | Embedded in order margin + store fees | Yes | Low | Medium | Evergreen | **Critical (moat)** | Template + first 3 clients |
| 4 | **Client Brand Stores** | Platform (multi-tenant) | Global analogue proven (company stores) [S40][S41] | Corporates, mines, banks, schools | Direct sales, references | Setup + monthly fee + margin | **Yes** | Free tier → low | Medium | Evergreen | **Critical** | Launch single-tenant v1, then multi-tenant |
| 5 | **Product & price master** (structured catalogue) | Dataset | Nobody in Botswana has machine-readable product/pricing data [S40] | Internal + partners + future API users | Internal, later API | Efficiency; enables partner platform | Yes | Free | Medium | Evergreen | High | 60 SKUs at launch, 400–800 by Y1 |
| 6 | **Botswana Branded-Supply Price Index** (quarterly note) | Newsletter/PR asset | No public price data exists in-market; buyers lack benchmarks | Procurement managers, media | LinkedIn, email, press | Authority → inbound leads | Yes | Free | Low | Evergreen | High | Publish Q1 edition in 60 days |
| 7 | **PPRA Tender Radar** (curated tender + award watchlist) | Data + newsletter | IPMS publishes tenders; nobody curates them for this sector [S24] | Suppliers, partners, SMEs | Newsletter, WhatsApp broadcast | Sponsorship / partner subscription | Yes | Free | Medium | Evergreen | High | Manual curation for 90 days; automate later |
| 8 | **Network Partner Portal** (job routing + invoicing + QC) | Platform | Fragmented micro-decorators need work and admin help [S49] | 15–25 decorators | Direct recruitment | Subscription + take rate | **Yes** | Free tier | High | Evergreen | High | Recruit 5 partners with spreadsheets first |
| 9 | **Google Business Profile + review engine** | Owned audience | Local pack drives calls for "near me" queries | Local buyers | Google | Leads | No | Free | Low | Evergreen | High | Claim, verify, request reviews on every delivery |
| 10 | **WhatsApp Business catalogue + broadcast list** | Owned audience | WhatsApp is the default business channel in Botswana | All buyers | Direct | Leads, repeat orders | Yes | Free | Low | Evergreen | High | Set up catalogue + quick replies now |
| 11 | **Certificate & compliance register** (per SKU) | Dataset | BOBS CoC and safety-file requirements [S28][S29][S33] | Mines, government, corporates | Supplied with quotes | Win-rate uplift | Yes | Low | Medium | Evergreen | High | Collect certificates with first 20 SKUs |
| 12 | **Case-study library** | Content asset | Buyers require references | All segments | Site, proposals, tenders | Conversion uplift | No | Low | Low | Evergreen | Medium | 1 case study per month from month 2 |
| 13 | **SOP library** (`docs/sops/`) | Knowledge asset | Talent scarcity, quality consistency | Internal + partner network | Internal | Enables scale without hiring stars | Yes | Free | Medium | Evergreen | High | Write 10 SOPs in 90 days |
| 14 | **Open-source repo** (this GitHub project, cleaned up) | Repo asset | Demonstrates capability; supports partner tooling | Staff, partners, clients, hires | GitHub | Credibility; recruiting; licensing optional | No | Free | Low | Evergreen | Medium | README, licence, remove template cruft, add CI |

---

## 3. SEO and content plan (intent-matched, no tricks)

**Technical foundation:** static PWA, fast, mobile-first, offline-capable, HTTPS, `LocalBusiness` + `Product` + `FAQPage` structured data, sitemap, clean URLs, no keyword stuffing. Target: every page loads in <1.5s on a 3G connection.

**Page architecture:**

1. **Money pages (buying intent):** branded workwear Botswana · corporate gifts Botswana · PPE supplier Gaborone · embroidery Gaborone · shirt printing Botswana · uniforms supplier Botswana · branded caps and headwear · gazebos and banners Botswana · promotional products Botswana · safety boots and workwear Botswana · school uniforms Botswana · corporate clothing tenders Botswana.
2. **Location pages (one per town, genuinely differentiated):** Gaborone, Francistown, Maun, Palapye, Selebi-Phikwe, Jwaneng, Orapa/Letlhakane, Kasane, Serowe, Mochudi. Each must contain real, specific content (delivery times, local clients, local partner coverage) — templated duplicates will not rank and look cheap.
3. **Compliance/expertise pages (differentiators, low competition):** what BOBS Certificate of Conformity means for garment imports · how local-content preference works in Botswana tenders · how to specify FR workwear for a mine · PPE issue-set management · uniform programme budgeting.
4. **Data assets:** quarterly price index (asset #6), tender radar archive (asset #7).
5. **Conversion pages:** instant quote, WhatsApp click-to-chat, request a sample, book a site visit.

**Publishing cadence (realistic for a constrained team):** 3 pages/week for 12 weeks = 36 pages, plus the data asset each quarter. 40–80 substantive pages is the realistic rank-in-Botswana threshold for a niche this shallow.

**Explicit bans (non-negotiable):** no fake reviews, no purchased links, no scraped competitor content, no keyword-stuffed doorway pages, no impersonation of suppliers, no AI-generated pages published without human review and real local specifics.

---

## 4. Content distribution that actually reaches Botswana buyers

| Channel | Use | Cadence |
|---|---|---|
| Google Business Profile posts + photos | Local pack presence; proof of work | 2×/week |
| Facebook page (dominant consumer/social platform in Botswana) + relevant groups | Case studies, offers, tender wins | 4×/week |
| LinkedIn | Mining, corporate, procurement decision-makers | 3×/week |
| WhatsApp Business broadcast (opt-in only) | New stock, tender deadlines, price index | 2×/month |
| Email newsletter (price index + tender radar) | Owned audience — the asset that survives algorithm changes | Monthly |
| Trade events / mining supplier days / business expos | Relationship velocity, samples | 4–6×/year |

---

## 5. Technology architecture (default stack, ownership-first)

| Layer | Recommendation | Why |
|---|---|---|
| Hosting | **Cloudflare Pages** (free tier) | No lock-in, global CDN, free SSL, instant deploys from Git; Netlify also viable if already configured |
| Front-end | Static HTML/CSS/JS PWA (`store/`) now; **Astro** static site when content grows | Zero build cost, portable, offline-capable |
| Backend / APIs | Cloudflare Workers + D1/KV when needed | Free tier, serverless, no servers to patch |
| Forms and quotes | Client-side quote engine + email/WhatsApp hand-off; upgrade to Workers + D1 for persistence | No data-hosting obligations until volume demands it |
| CRM | Spreadsheet/Notion-grade first; then a paid tool with Botswana-friendly billing | Avoid tool cost before 150 accounts |
| Analytics | Cloudflare Web Analytics or Plausible-style privacy-first analytics | Free, GDPR/DPA-friendly, no cookie banner needed |
| Data protection | Botswana-resident copy of customer PII; minimise PII collected; encrypt backups | Data Protection Act 2024 requirements [S25][S26][S27] |
| Store platform (multi-tenant) | Static per-tenant build generated from one product master + Brand Vault data | Cheap, fast, secure, easy to licence to other resellers later |

**On the existing Gatsby repo:** it is currently an **unmodified Netlify "Gatsby Sydney Ecommerce Theme"** with mock data, a demo `siteUrl` (`jamm.matter.design`), template README, Cypress scaffolding and placeholder Netlify config — **no Botswana content, no products, no brand, no licence**. Verdict: **REPURPOSE.** Keep it for the eventual content-heavy site, but do not let Gatsby 4 + dated tooling gate your launch. Ship the zero-build static PWA now; migrate to Astro/Gatsby only when the content library justifies a build step. Adding a `LICENSE`, an accurate `README.md`, and CI (link check + Lighthouse check) is a two-hour job worth doing.

---

## 6. Data assets worth owning (the part competitors cannot copy)

1. **Landed-cost database:** every SKU, source channel, duty rate, MOQ, lead time, certificate. Improves with every quote. Enables instant, accurate quoting — the operational moat.
2. **Size and consumption matrices:** per client, per department, per site, per year. Predicts demand and enables proactive replenishment (the highest-value service in programme supply).
3. **Tender intelligence:** what government and mines buy, when, at what award values, and from whom [S24]. Over 24 months this becomes the most valuable dataset in the sector — and a subscription product for SMEs who cannot monitor IPMS themselves.
4. **Price index:** quarterly observed market prices by product family. A public good that builds authority and inbound demand; selectively gated deeper data for partners.
5. **Artwork and digitising library:** each logo digitised once, reused forever. Marginal cost falls to zero on reorders.
6. **Defect and rework log:** the empirical basis for improving QC — and for choosing partners.

---

## 7. Portfolio register (per the operating standard)

| Asset | Type | Enterprise | Location | Status | Revenue stream | Recurring? | Owner | Last activity | Verdict | Next action |
|---|---|---|---|---|---|---|---|---|---|---|
| `brandinganddecorationbotswana` repo | Repo | B&D Botswana | GitHub | Dormant template | None | No | You | 2022-era dependency updates | **REPURPOSE** | Ship static store from it; clean README + licence |
| Static storefront + quote engine | PWA | B&D Botswana | `store/` | New | Order margin | No | You | Today | **INVEST** | Deploy this week |
| This research package | Knowledge | B&D Botswana | `docs/` | New | Indirect (decision quality) | No | You | Today | **INVEST** | Execute the 90-day plan |
| Product & price master | Dataset | B&D Botswana | Repo/Notion | Not started | Efficiency | Yes | You | — | **INVEST** | 60 SKUs |
| Client Brand Store platform | Platform | B&D Botswana | Repo/Cloudflare | Not started | Subscription + margin | **Yes** | You | — | **INVEST (priority)** | Single-tenant v1 |
| Price index / Tender Radar | Newsletter + data | B&D Botswana | Repo/email | Not started | Authority + sponsorship | Yes | You | — | **INVEST (Q1)** | Q1 edition in 60 days |
| Partner network portal | Platform | B&D Botswana | Not started | Not started | Take rate | Yes | You | — | **BUILD LATER** | Recruit 5 partners first, manual routing |
| Netlify site config / Cypress tests | Config | B&D Botswana | Repo | Template default | None | No | — | — | **MAINTAIN** | Fix `siteUrl`; keep tests only if CI is added |
| Dormant: none identified | — | — | — | — | — | — | — | — | — | — |

*No dormant or duplicate revenue-bearing assets exist yet — this is a pre-revenue enterprise. The register's job now is to prevent asset sprawl as the store, portal, index and tender radar are added. Rule: every new asset must name its revenue stream, owner and next action, or it does not get built.*

---

## 8. Opportunity radar (adjacent value, ranked)

| # | Opportunity | Why it matters | Effort | Revenue model |
|---|---|---|---|---|
| 1 | **PPE/uniform "programme" with laundering, repair and replacement guarantees** | Mining and industrial clients face real pain (loss, damage, hygiene, PPE compliance under Mines Regs Reg 77 [S33]); nobody in Botswana packages it | High | Per-worker-per-month recurring fee |
| 2 | **White-label store + catalogue licensing to other resellers** | Regional distributors lack software; you will have built it anyway | Medium | Licence fee + transaction fee |
| 3 | **Corporate gifting subscriptions (quarterly drops)** | Budget smoothing for clients; predictable revenue for you | Low | Retainer |
| 4 | **School uniform supply contracts (direct to parents) with school partnership** | Education is the leading end-buyer category in SA data [S2]; Botswana has thousands of schools; parents want convenience | Medium | Per-item margin + delivery fee |
| 5 | **PPE take-back and recycling for ESG reporting** | Mining ESG obligations; sustainability is 14% of global promo sales and growing [S3] | Medium | Service fee + resale |
| 6 | **Zambia/Namibia expansion via partner network + instant cross-border payments** | Zambia's new OHS Act (Dec 2025) creates compliance-driven PPE demand [S36]; TCIB instant payments live into Botswana (Mar 2026) [S48] | High | Export revenue |
| 7 | **Botswana "Made in Botswana" merch line (tourism, national pride, corporate gifting)** | Local brand preference trending [S23]; manufacturing tax rate 15% for approved manufacturers [S18] | Medium | Product margin + licensing |

**Risk flags worth monitoring (radar, not panic):** rising corporate tax and VAT base broadening compress margins [S16][S17][S20]; government payment delays during fiscal consolidation [S12][S13]; FX and duty volatility on imports [S30][S31]; availability of skilled machinists; and the possibility that a large SA player opens local decoration capacity.

---

## 9. Digital asset block (summary)

| Asset | Demand evidence | Audience | Distribution | Monetisation | Recurring | Cost | Difficulty | Durability | Strategic value | Next move |
|---|---|---|---|---|---|---|---|---|---|---|
| Storefront + quote engine | Competitors have none; buyers expect instant price [S50] | Gaborone corporates, SMEs | SEO, WhatsApp, GBP | Order margin | No | Free | Low | Evergreen | Critical | Deploy this week |
| Client Brand Stores | Proven globally; absent locally [S40][S41] | Corporates, mines, schools | Direct sales | Subscription + margin | **Yes** | Free→low | Medium | Evergreen | Critical | Single-tenant v1 |
| Price Index + Tender Radar | No public market data or curated tender service [S24] | Procurement, SMEs, media | Email, LinkedIn, WhatsApp | Sponsorship/subscription | Yes | Free | Medium | Evergreen | High | First editions in 60 days |
| Product & price master | Enables instant quoting and partner portal [S40] | Internal, partners | Internal/API | Efficiency | Yes | Free | Medium | Evergreen | High | 60 SKUs |
