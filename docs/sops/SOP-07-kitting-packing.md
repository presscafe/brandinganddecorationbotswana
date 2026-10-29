# SOP-07 — Kitting, Packing and Packing-List Generation

**Purpose:** correct items, correct sizes, correct count, labelled per recipient or site. Kitting is where enterprise value beats commodity distributors.  
**Trigger:** job reaches "production complete" in ERP.  
**Owner:** Operations. **Rev:** 29 Oct 2026.

## Trigger
Spec sheet shows: quantity × size × recipient × site. If size matrix missing, halt → request Brand Vault update (SOP-02).

## Steps
1. **Pick:** lay out by site → by recipient → by category. Count against spec sheet, not memory.
2. **Check:** 100% count by size (tally sheet). Random pull 1 in 20 for size label + decoration placement.
3. **Kit:** per-recipient bag (or per-site carton) with: item, size, name label (if personalization), packing slip. PPE issue sets: kitted per worker with certificate copy.
4. **Pack:** polybag per item → tissue if premium gift → carton with fill → tape with branded tape if available. Weight ≤22kg per carton for courier.
5. **List:** generate packing list in `admin.html → Stock` or manually: `Site | Recipient | Item | Size | Qty | Notes | Check ✓`. Two copies: inside top carton + emailed PDF to client contact.

## Quality gate
- [ ] Tally sheet total = sales order total
- [ ] No size mix across recipients
- [ ] Packing list total matches carton count
- [ ] Photo of packed cartons (shows labels) uploaded to job card

## Records
Tally sheet + packing list + carton photo → `admin.html → Quotes` (status → ready for delivery) + Drive `/Jobs/{Ref}/Packing`.

