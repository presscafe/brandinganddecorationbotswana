# SOP-05 — DTF / Screen Production, Curing and Wash Test

**Purpose:** print adhesion and durability verified, not assumed.  
**Trigger:** any DTF or screen job.  
**Owner:** Production lead. **Rev:** 29 Oct 2026. **Status:** Active (BDB-019 #5)

## Trigger
Order intake marks decoration = DTF_A4/A5 or screen_×_colours. Auto-creates job card in `admin.html → Quotes` with first-article gate enforced (SOP-03).

## Steps
1. **Artwork check:** 300dpi, mirrored for screen, colour-separated (CMYK/Pantone), trapped 0.25pt. If vector missing, halt + request.
2. **DTF:** powder evenly melted (160°C, 90s), cold peel, 2nd press 10s. Screen: mesh 43–77T, emulsion 2+2, exposure per step wedge, washout crisp.
3. **Press:** temp by substrate (cotton 160°C 15s, poly 150°C 12s, softshell 140°C 10s). Pressure medium-heavy. Teflon sheet on every press.
4. **Cure:** DTF — stretch test immediately (no cracking). Screen — cure to 160°C core for 60s (temp strip on platen). Under-cure = wash failure.
5. **Wash test (mandatory for new blank/ink combo):** 1 unit washed 40°C, air-dried, inspected. Pass = no cracking, no fading >10% (Pantone swatch), edge adhesion 100%.

## Quality gate — PROCEED only if:
- [ ] First press peels clean, stretches without crack
- [ ] Screen cure temp strip shows 160°C+
- [ ] Wash test passes (or previous identical blank/ink on file within 90d)
- [ ] Size + placement ±3mm

## Records
Job card → press log (temp/pressure/time) → photo (close-up) → wash test result (if done). Stored `admin.html → Certificates` + Drive `/Production/YYYY-MM-DD/`.

## Owner
Production lead signs first-article. Operator may run bulk only after that signature.
