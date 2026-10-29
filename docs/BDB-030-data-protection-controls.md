# BDB-030 — Data protection controls & privacy notice (Data Protection Act 18 of 2024)

**Status:** controls draft 29-Oct-2026 (In progress → Done when: DPO named, residency backup tested, privacy page live ✓ already, breach drill logged).
**Owner:** Director + Finance (DPO to be named before processing exceeds SME scale).

## Why this is Tier-0 (not nice-to-have)
BW DPA 18/2024: 72-hour breach notification, data minimisation, consent where required, and a **copy of personal data must remain in Botswana** [S25-S27]. Corporate/gov buyers will ask for this before signing a programme contract. Tender packs increasingly require it.

## Controls (privacy-by-design)

| Control | How we do it | Evidence where |
|---------|--------------|----------------|
| **Minimise PII** | CRM Sheet + admin store only: name, org, phone/WA, email, delivery address. No ID numbers, no biometrics. Retain 5y for tax, then archive/delete. | `docs/BDB-012-crm-pipeline.md` + Sheet retention tab |
| **Consent** | WA opt-in recorded (WA Playbook broadcast consent); quote form: checkbox “I consent to B&D storing my contact to fulfil this quote” (unchecked by default). Unsubscribe = delete from broadcast within 24h. | `docs/BDB-015-whatsapp-business-playbook.md` + `store/index.html` form |
| **Access control** | Admin ERP (`admin.html`) behind lightweight PIN (v1) → Cloudflare Access (v2). CRM Sheet: share only director + finance editor; partners see only their jobs via filtered view. | `docs/BDB-010-deployment-checklist.md` |
| **Encryption** | Site HTTPS (Cloudflare). Sheet + Drive at rest encrypted by Google. Local backups encrypted (7z AES-256) if any. No plain CSV of PII on USB. | infra |
| **Botswana-resident copy** | Primary: Google Sheet (region not guaranteed BW). **Mitigation:** weekly JSON export of CRM (no attachments) stored on BW-resident Drive + local encrypted copy in Gaborone office. Tested monthly. | procedure below |
| **Breach procedure** | Detect → contain (revoke share) → assess → notify Authority + affected subjects **within 72h** → log. Owner: Director. Template email in Annex. | this doc Annex A |
| **DPO** | Appoint before processing > SME scale or on buyer request. DPO = Director until qualified hire. Contact on privacy page. | `store/privacy.html` |
| **Processor discipline** | Partners receive only job-necessary data (delivery contact, artwork). Subcontract annexure §7: partner must delete job data within 30d of completion. | `docs/BDB-017-partner-subcontract-annexure.md` |

## Weekly residency backup — 5-minute procedure (every Friday 16:30)

1. Open CRM Sheet → File → Download → CSV (or run Apps Script export to Drive/BW folder).
2. Save as `CRM-YYYY-MM-DD.json` via `admin.html → Export` (already builds JSON).
3. Store in Drive folder **“B&D Botswana customer data (BW copy)”** + local encrypted folder `G:\BDB-CRM-BW\`.
4. Log date + file hash in Sheet tab `Backups`.

## Annex A — 72h breach notice template

> Subject: Data breach notification — Branding & Decoration Botswana
> To: Information Regulator (BW DPA) + affected data subjects
> 1) What happened, 2) categories & approx. subjects affected, 3) likely consequences, 4) measures taken/proposed, 5) DPO contact.

## Privacy notice

Live at `/privacy.html` (pledge + controls summary + DPO contact + retention + rights + 72h language). Update date on each material change.
