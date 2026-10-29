# SOP-02 — Artwork intake and Brand Vault update

**Purpose:** every client logo is ingested once, correctly, version-controlled, and reusable forever. Reorders become effortless; errors become impossible.

**Trigger:** new client, new logo, or artwork revision.

**Owner:** Production lead. **Revision:** 2026-10-29 v1.

---

## 1. Receive

1. Request: vector file (AI, EPS, SVG, or press-ready PDF) + high-res PNG/JPG preview + Pantone/CMYK/RAL reference if brand-critical.
2. If client has only a raster (JPG/PNG), note “vector required — redrawing quoted separately (P___)”. Do not promise exact colour match from a low-res file.
3. Save to `Drive: Clients/{Client}/Brand Vault/01 - Raw/{date} - {filename}`. Never overwrite raw files.

## 2. Inspect (5-point check)

- [ ] Vector is truly vector (zoom to 600% — edges stay sharp).
- [ ] Text is outlined/embedded; if not, request outlined version or confirm font licence.
- [ ] Clear-space and minimum-size rules captured if client has brand guidelines.
- [ ] Colour refs: Pantone C/U, CMYK, or thread match noted. If no ref, propose closest Madeira/Isacord thread numbers and get written confirmation.
- [ ] Variants: full-colour, mono white, mono black, reversed — collect all that exist.

## 3. Digitise / prepare

1. Create working files: embroidery digitising (DST/EXP + source), DTF/sublimation print-ready, screen separations as needed.
2. Record in `Brand Vault index` (sheet or Notion): file name, format, stitch count (embroidery), dimensions, Pantone → thread map, digitiser name, date, version (v1, v2...).
3. Save to `Drive: Clients/{Client}/Brand Vault/02 - Production Ready/{method}/`.

## 4. Approval loop

1. Generate a proof: actual-size placement on garment silhouette, thread colours shown, dimensions labelled.
2. Send proof to client with: “Please confirm colours, size and placement in writing. Production starts on written approval.”
3. Store written approval (email/WhatsApp PDF) in `03 - Approvals/`. No bulk run starts without it.

## 5. Size matrix and delivery matrix

1. On first order, capture per-department/per-site size matrix (S/M/L/XL/XXL counts) in `Brand Vault/04 - Size Matrices/`.
2. Capture delivery addresses and recipient lists where relevant (kitting — see SOP-07). Minimise PII: name + size + site only; no IDs, no bank details.

## 6. Change control

- Any logo revision increments the version and archives the old production file — never delete. Note reason (“client rebrand 2026-10”) in the index.
- If a partner does the digitising, they deliver the source file, not just the DST — paid for, owned by us.

## 7. Quality gate

A Brand Vault is “complete” when: vector on file, thread/Pantone map confirmed in writing, size matrix for at least one department, and one written proof approval stored. Reorders against a complete Vault skip intake entirely.

---

**Metric:** time from raw-file receipt to written proof approval — target ≤24 hours.
