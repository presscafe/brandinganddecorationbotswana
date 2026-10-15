# DECISION — Retire the Gatsby e-commerce theme

**Date:** 15 October 2026 · **Status:** Decided and executed · **Owner:** Director

## Decision

Remove the unmodified Netlify/Matter "Gatsby Sydney Ecommerce Theme" from this repository. The storefront of
record is the zero-build static PWA in `store/`.

## Context

The repository was created from a public Gatsby e-commerce theme and never customised: mock product data
(`src/helpers/mock`), a demo `siteUrl` pointing at `jamm.matter.design`, template copy ("Sydney — A British brand
since 1860"), Cypress scaffolding, a Renovate config, and a `netlify.toml` expecting `gatsby build`. The plan's
Storefront-and-Quote-Engine asset (`docs/05`, asset #1) needed to ship immediately, and it has: `store/`
deploys to Cloudflare Pages with no build command and no dependencies.

## Options considered

| Option | Verdict |
|---|---|
| Keep the theme alongside `store/` | Rejected — two front doors, no shared data model, confusion for partners and hires |
| Modernise Gatsby in place (Gatsby 4 → current), then migrate | Rejected — days of dependency work for zero commercial gain |
| **Remove the theme; adopt Astro when the content library justifies a build step** | **Chosen** |

## Rationale

1. Commercial speed beats framework preference. The quote engine earns money this month; a Gatsby upgrade does not.
2. No build step = no dependency drift, no CI maintenance, no supply-chain surface, and hosting on a free tier.
3. The product data model is `store/data/catalogue.json` — portable to Astro, Workers or any future stack.
4. Portfolio discipline: no dormant duplicate assets (see the portfolio register in `docs/05`).

## What was removed

`src/`, `static/`, `cypress/`, `cypress.config.js`, `gatsby-browser.js`, `gatsby-config.js`, `gatsby-node.js`,
`netlify.toml`, `package.json`, `package-lock.json`, `renovate.json`, `.prettierrc`.
`.gitignore` was retained (still correct for any future Node tooling).

## Reversal path

Everything removed is recoverable from Git history. The last commit containing the theme source is
`8c51e43 (the pre-retirement tip of this branch)`. To restore a file:

```bash
git checkout 8c51e43 (the pre-retirement tip of this branch) -- path/to/file
# or restore the whole theme into a scratch branch:
git checkout -b scratch/restore-gatsby 8c51e43 (the pre-retirement tip of this branch)
```

No external systems depended on the theme. Nothing was pushed to a hosting provider.

## Trigger to revisit (Astro migration)

Migrate `store/` to Astro when **any two** of the following are true:

- The public content library passes 25 published pages (SEO plan, `docs/05` §3).
- Quote requests exceed 60 per month and need server-side persistence, accounts or payments.
- A Client Brand Store needs multi-tenant builds generated from the Brand Vault data model.
- Two or more network partners need to consume the product master via API.

Until then, adding a build step would be structure for its own sake.
