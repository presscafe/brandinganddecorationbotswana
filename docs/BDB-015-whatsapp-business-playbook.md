# BDB-015 — WhatsApp Business Catalogue + Quick Replies + Broadcast (Opt-In)

**Tool:** WhatsApp Business (free, same number as `WHATSAPP_NUMBER`). **DPA 2024:** consent required for broadcast.

## 1. Setup (Day 1)
- Convert number to WhatsApp Business. Profile: logo 192×192, description from GBP, hours, address, website `brandinganddecoration.co.bw`, email.
- Verify business (Meta Business Manager) if possible — not required to start.

## 2. Catalogue (Day 1 — 20 items)
Add 20 fast moves from `admin.html → Catalogue`:
- Golf shirt (c01) — 3 colours, P128 landed → sell band shown, note “price per tier, instant quote on site”
- Conti suit (w01), hi-vis vest (w03), cap (c09), bottle (m04), notebook (m01), boot (w06), gazebo (e02)… each with: photo, description (1 line + “certificate available”), price band (e.g. “From P… blank, branding quoted”), link to `/#builder`.
- Enable cart: allow inquiry, not checkout (you quote before selling).

## 3. Quick replies (8 — cover 80% of chats)
- `/price` → “Thanks! Build an instant indicative price at brandinganddecoration.co.bw/#builder (pick product→qty→branding). I’ll confirm with a firm quote + certificate pack in 4h.”
- `/moq` → “MOQ shown per SKU in quote builder; small runs we consolidate or collect.”
- `/lead` → “Gabs 3–7d stocked, 5–7d SA trade, 14d local CMT, 6–10w import. Rush 72h subject to capacity (+20%).”
- `/art` → “Please send vector (AI/EPS/SVG/PDF) + Pantone if brand-critical. We confirm thread match in writing (Brand Vault).”
- `/vat` → “Prices ex VAT 14%; SACU duty embedded per channel (import duty shown). Firm quote states validity 14/30d.”
- `/pod` → “Every drop photographed + signed POD. Disputes resolved by evidence.”
- `/cert` → “Certificate pack per SKU attachable in <4 min — BOBS CoC + EN ISO per line.”
- `/store` → “Client Brand Store: your approved catalogue + budgets + approvals + reorders in 3 taps. Setup P9.5k + P2.2k/mo.”

## 4. Labels (auto-sort)
`New inquiry` → `Quoted` → `Approved` → `Production` → `Delivered` → `Repeat`. Use WhatsApp Business labels (free).

## 5. Broadcast (opt-in only, 2×/month max)
- Source: customers who replied “YES broadcast” + ticked consent in `admin.html → Customers`. Store consent date.
- Content: Price Index note, tender deadline reminder, new stock. No spam. Unsubscribe = “STOP” → remove immediately.
- Log: broadcast date, list size, opt-outs, inbound leads. Track in `SOP-10`.

## 6. Hand-off to ERP
Every quote sent → create/update `admin.html → Quotes` + `Customers`. Daily sweep ensures no inquiry sits without status.

