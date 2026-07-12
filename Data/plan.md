# JIVA Buildout Plan — Vitality Map & Full-Stack Foundation

> Status: **DEMO COMPLETE (2026-07-10).** Three-way taxonomy mismatch resolved (§3.6); D9–D15 locked. **Phases A, B, 1, 2, 3, 4 all DONE and verified.** End-to-end pipeline works: xlsx → `packages.json`/`reference_ranges.json` → engine v5 → female_29 input+output → seeded DB → `/api/me/*` API → wired Vitality Map (10-system tiles on a continuous D14 spectrum, real summaries + recommendations, Biological Age placeholder). Demo user `test@jiva.com`/`password123` (run `JIVA_Node_App/scripts/seedDemo.js`). Remaining: live browser eyeball; then expand beyond one patient + swap in the JIVA team's authoritative ranges file.
>
> **UNBLOCKED (2026-07-10):** provisional reference ranges + units researched and generated → `Data/Tests/reference_ranges.json` (+ `.md`, 112 biomarkers, all `packages.json` entries covered). "Close enough" to execute Phases A/B now; the JIVA team's authoritative file supersedes it later (D10).
>
> **Canonical taxonomy = 10 Functional Systems:** `Blood, Metabolic, Heart, Liver, Kidney, Electrolytes, Thyroid, Nutrients` (from the spreadsheet) **+ `Immune/Inflammatory` + `Hormonal/Reproductive`** (added). Digestive markers stay under `Liver`.

---

## 1. Goal

Turn JIVA into a working full-stack application, starting with a **correct Vitality Map** page.

Business premise:
1. A user signs up and always takes the **Basic Panel**, optionally adding any of the 9 add-on panels.
2. Their blood is drawn; the lab returns biomarker values.
3. Those values + the intake questionnaire are fed into the **engine** (inputs = `Data/Sample Patients`, outputs = `Data/Sample Output`).
4. The engine emits diagnoses + food / supplement / exercise (incl. yoga) recommendations + per-system summaries.
5. The web app renders all of this on the **Vitality Map**.

This plan covers: (a) completing the package spreadsheet, (b) redesigning the backend so it truly reflects patients, packages, labs, and engine output, and (c) wiring the Vitality Map to real data.

---

## 2. Current State

### 2.1 Backend (`JIVA_Node_App`, Express + Sequelize + Postgres)
- **Models:** `User`, `Package`, `Order`, `Subscription`, `Biomarker`, `Category`, `ReferenceRange`, `TestResult`.
- **Categories** are free-form strings (seeded ad-hoc as `AutoImmunity`, `Cardio`, `Metabolic`, or from the Excel "Functional Category").
- **`TestResult`** links `User` ↔ `Biomarker` with a `value` + `isNormal` boolean.
- **Routes:** `POST /api/auth/register|login`, `GET /api/packages`, `POST /api/orders`, `GET /api/orders/myorders`, `GET /api/test-results` (grouped by category).
- **No models exist** for: patient profile / questionnaire, panels↔biomarker composition, diagnoses, food/supplement/exercise recommendations, per-system summaries, or lab-analysis rollups.

### 2.2 Frontend (`JIVA_React_App`, React + Vite + MUI)
`VitalityMap.tsx` is the main page. Detailed state as of 2026-07-10 (verified by reading the component):
- **Top three cards** (`gridTemplateColumns: repeat(3,1fr)`):
  1. **Biological Age card** — a `react-apexcharts` radial gauge hardcoded to `series={[75]}`, copy "is 7.2 years younger than your calendar age," "based on the lab test from January 2025," and a hover tooltip. **Fully static.**
  2. **"What is the Range" card** — a hand-drawn `<svg>` of three bars (values 88 / 88 / 16, labels IN RANGE / OUT OF RANGE / ABNORMAL). **Fully static illustration.**
  3. **Clinical Notes card** — hardcoded "Autoimmunity is when your immune system attacks…" paragraph + Read More. **Fully static.**
- **Compare Biomarkers section** with a **Heat Map ⇄ Compare** toggle (`isCompareMode`):
  - **Heat Map** (default): a 4-column grid of **category tiles** from `activeCategories`, derived from `GET /api/test-results` (grouped by free-form category) with a **16-tile hardcoded fallback**. Tile shows `name` + `"{inRange}/{total} in Range"`; **tile color is a 4-bucket step function** of the in-range ratio (`≥.75 → #D2F2E2`, `≥.5 → #E1F2E2`, `≥.25 → #F9E2C2`, else `#FF8A65`). A legend renders the spectrum `linear-gradient(90deg,#A6E4D0 0%,#FFB073 100%)` labeled **IN … OUT OF RANGE**. Clicking a tile (`selectedBiomarker` index) drives a right-hand details panel listing that group's tests with In Range/Out of range + value/unit (Read More expands).
  - **Compare** (`<BiomarkerCompare />`): **entirely hardcoded** `inRangeData`/`outOfRangeData` (fake names "Auto Immunity"/"Liver"/"Pancreas", fake widths and "Difference" arrows). Not wired at all.
- **Recommendation section** (`RecommendationSection`): Food to Eat / Food to Avoid / Exercise / Supplements — **all hardcoded** to "Auto Immunity" / "Spinach"; the **Select Biomarker** dropdown has only `Auto Immunity` / `Others`.
- **Wiring gaps:** only the Heat-Map tiles are partially wired (to the old category endpoint, not the 10 systems). Biological Age, What-is-the-Range, Clinical Notes, Compare view, and every recommendation are static. API base `http://localhost:5001` is hardcoded (≈4 files). Tiles are **not** grouped by the canonical 10 systems and use a coarse 4-step color, not a continuous spectrum.

### 2.3 Data folder
- `Data/Tests/JIVA PACKAGE.xlsx` — one sheet `JIVA Packages`. Basic Panel rows have the **Functional System** column filled; the 9 add-on panels do **not**.
- `Data/Sample Patients/*.json` — engine **inputs** (patient + questionnaire + `labs[]` with `panel` per lab).
- `Data/Sample Output/*.json` — engine **outputs** (see schema in §5).

---

## 3. Key Findings / Decisions Needed

1. **Taxonomy — RESOLVED (D1 + D2).** Canonical = the spreadsheet's 8 systems (`Blood, Metabolic, Heart, Liver, Kidney, Electrolytes, Thyroid, Nutrients`) **plus 2 added systems** → **10 total**: `Immune/Inflammatory` and `Hormonal/Reproductive`.
   - Rationale for the two additions: they absorb the two largest/most clinically-distinct misfit groups (Panel 8 immune markers; the Male/Female sex-hormone markers) and they mirror the engine's own `system_summaries` names, simplifying engine-output ingestion later.
   - The engine's other taxonomy quirks (it merges Kidney+Electrolyte, has no Thyroid, folds digestive into Liver) will be handled by a name-mapping table at ingestion → our 10 systems.
   - **Digestive markers stay under `Liver`** (no separate Digestive system added).

2. **"Yoga" is not a separate engine section** — it appears inside `exercise_recommendations` (e.g., "Yoga and strength training"). The UI's yoga content should be sourced from exercise recommendations, not a separate field.

3. **The Vitality Map's real content is the engine output**, not the raw `TestResult` grouping. To make the page "correct", the backend must persist engine output and expose it.

4. **Panels ↔ biomarkers are not modeled.** We need this to know which biomarkers a user's chosen packages produce, and to render per-panel/per-system status.

5. **Reference ranges are per-lab in the inputs** (each lab row carries `reference_range_low/high` and `unit`), and can be **sex-specific**. The current `ReferenceRange` model supports a `condition` (male/female/general) — good, but seeding must populate it.

6. **⚠ THREE-WAY TAXONOMY MISMATCH (root problem, discovered 2026-07-10).** The xlsx/`packages.json`, the engine prompt, and the sample-patient inputs use **three different panel/biomarker taxonomies**:
   - **xlsx / `packages.json`** (declared source of truth): Basic, Heart (Cardiometabolic), Male Health, Female Health, Thyroid, Nutrition & Micronutrients, Stress & Aging, Inflammation & Immunity, **Cognitive & Neurological**, **Digestive & Hepatic**.
   - **Engine prompt v4** (`Data/Engine/jiva_engine_prompt_v4.md`): Basic, Cardio-Metabolic, Thyroid Function, Autoimmune Screening, Female/Male Hormonal Balance, Extended Autoimmune, Liver Extended, Nutritional & Vitamin, Inflammation, **Metabolic & Diabetes Risk**.
   - **Sample patients**: use the **engine's** taxonomy (not the xlsx's).
   - Patients + engine agree with each other but **neither matches the xlsx.** The xlsx has no "Metabolic & Diabetes Risk" panel (engine + patients do); the engine has never heard of the xlsx's "Cognitive & Neurological" or "Digestive & Hepatic" panels. Even corresponding panels carry different markers (xlsx Heart has NT-proBNP/Direct HDL/sdLDL/VLDL/TG-HDL ratio; engine Cardio-Metabolic is NMR-based). Even **Basic** differs (xlsx Basic has TSH, Ferritin, Vit D, Uric acid; engine Basic does not; xlsx lists CBC as one line, patients expand it to 14 sub-components).
   - **Consequence:** Engine Prime Directive #8 forbids classifying labs not listed in the prompt. So patients cannot simply be "made to match packages" and rerun — **the engine itself must be rewritten to the xlsx taxonomy first** (D9). The earlier D8 "normalize at ingestion" idea only fixes website grouping, not the engine that produces the outputs.

---

## 4. Phase 0 — Complete the Package Spreadsheet — ✅ DONE

> **Done (2026-07-09):** `scripts/buildPackages.js` filled all **86** add-on biomarker rows in `JIVA PACKAGE.xlsx` col D and emitted `Data/Tests/packages.json` (10 systems + 10 panels). Verified 0 rows left unmapped. Generator is idempotent/re-runnable.

**Objective:** fill the **Functional System** column for all 9 add-on panels, mapping every biomarker to one of the **10 canonical systems** (`Blood, Metabolic, Heart, Liver, Kidney, Electrolytes, Thyroid, Nutrients, Immune/Inflammatory, Hormonal/Reproductive`).

Rules used:
- Map each biomarker to the same system its "sibling" uses in the Basic Panel (e.g. Ferritin→Blood, so iron studies→Blood; hs-CRP→Heart; Vit D→Nutrients; glucose/HbA1c→Metabolic).
- Sex, reproductive & other endocrine markers (incl. cortisol, DHEA-S, IGF-1, GH, PSA) → **Hormonal/Reproductive**.
- Panel 8 immune/inflammatory markers → **Immune/Inflammatory**.
- Digestive/hepatic markers → **Liver** (no separate Digestive system).

### Proposed mapping

**Panel 2 — Heart (Cardiometabolic)**
| Biomarker | System |
|---|---|
| ApoB, Lp(a), Direct LDL, Small dense LDL (sdLDL), LDL particle number, Direct HDL, Large HDL, VLDL cholesterol, NT-proBNP, TG/HDL ratio | Heart |
| Homocysteine | Heart (cardiovascular risk; also appears in Stress & Cognitive panels — mapped globally to Heart) |

**Panel 3 — Male Health**
| Biomarker | System |
|---|---|
| Total testosterone, Free testosterone, Estradiol (E2), FSH, LH, Prolactin, SHBG, Total PSA, Free PSA | Hormonal/Reproductive |

**Panel 4 — Female Health**
| Biomarker | System |
|---|---|
| Estradiol (E2), Progesterone, FSH, LH, Prolactin, SHBG, DHEA-S, Total testosterone, AMH, Morning cortisol | Hormonal/Reproductive |

**Panel 5 — Thyroid**
| Biomarker | System |
|---|---|
| TSH, Free T3 (fT3), Free T4 (fT4), Anti-TPO antibodies, Anti-thyroglobulin (Anti-Tg) | Thyroid |

**Panel 6 — Nutrition & Micronutrients**
| Biomarker | System |
|---|---|
| Vitamin B12, Folate/B9, Vitamin B6, Zinc, Copper, Selenium, Omega-3 index (EPA+DHA), Vitamin A, Vitamin E, Vitamin K2 | Nutrients |
| Serum iron, TIBC, Transferrin saturation | Blood ⚠ (iron studies — matches Ferritin→Blood; alt: Nutrients) |

**Panel 7 — Stress & Aging**
| Biomarker | System |
|---|---|
| Morning cortisol, DHEA-S, IGF-1, GH (fasting) | Hormonal/Reproductive |
| Fasting insulin | Metabolic |
| 8-OHdG (oxidative DNA damage) | Immune/Inflammatory (oxidative stress marker) |
| Homocysteine | Heart |
| hs-CRP | Heart |
| Vitamin D (25-OH) + intact PTH | Nutrients |

**Panel 8 — Inflammation & Immunity**
| Biomarker | System |
|---|---|
| IL-6, TNF-alpha, Fibrinogen, ESR, ANA screen, Rheumatoid factor, Complement C3, Complement C4, Lymphocyte differential, D-dimer | Immune/Inflammatory |

**Panel 9 — Cognitive & Neurological**
| Biomarker | System |
|---|---|
| Homocysteine | Heart |
| Active B12 (holotranscobalamin), RBC folate, Vitamin D (25-OH) | Nutrients |
| TSH + fT3 + fT4 | Thyroid |
| Morning & evening cortisol | Hormonal/Reproductive |
| Fasting glucose + insulin | Metabolic |
| ApoE genotype | Heart (lipid genetics) |
| hs-CRP | Heart |

**Panel 10 — Digestive & Hepatic** (all → Liver; no separate Digestive system per D2)
| Biomarker | System |
|---|---|
| GGT, LDH, Amylase, Lipase, H. pylori IgG, Anti-gliadin IgA, Anti-transglutaminase IgA, Fecal calprotectin, PT/INR, Direct & indirect bilirubin | Liver |

**Deliverable:** (1) update `JIVA PACKAGE.xlsx` column D for all add-on rows per the table above; (2) emit a machine-readable `Data/Tests/packages.json` (per D7) so the backend seeds from JSON instead of parsing Excel at runtime.

---

## 5. Engine Output Schema (target for the data model)

Each `Data/Sample Output/*.json` contains:
- `patient_id, patient_name, age, sex, date_processed`
- `lab_analysis`: `{ total_labs_reviewed, in_range_count, borderline_count, out_of_range_count, critical_count, critical_alert, panels_present[] }`
- `diagnoses[]`: `{ rank, diagnosis, confidence, supporting_labs[], clinical_rationale }`
- `foods_to_eat[]`: `{ rank, food, quantity_frequency, target_diagnosis, why_it_helps }`
- `foods_to_avoid[]`: `{ rank, food, avoidance_level, reduction_target, target_diagnosis, why_to_avoid }`
- `exercise_recommendations[]`: `{ rank, exercise_type, frequency, duration, intensity, target_diagnosis, why_it_helps, safety_notes }`
- `supplement_recommendations[]`: `{ rank, supplement_name, dosage_range, timing, target_diagnosis, why_it_helps, safety_note, local_availability_note, start_tier }`
- `patient_summary`: string
- `system_summaries[]`: `{ system_name, biomarkers_included[], summary }`

---

## 5A. Phase A — Reconcile the Engine to the xlsx (v5) — NEW (D9)

**Objective:** produce `Data/Engine/jiva_engine_prompt_v5.md` whose lab universe **is** the xlsx's 10 panels.

Steps:
1. **Rebuild the "valid JIVA tests" section** (Step 1A) from `packages.json`: 10 panels, exact biomarker names, each tagged to one of the 10 functional systems.
2. **Populate reference ranges + units** from the D10 file (sex-specific + critical where available). Mark any biomarker still missing a range as `TBD`.
3. **Rewrite the System Mapping tables** (Steps 1A & 8) to the 10 canonical systems instead of the v4 system names (Cardiovascular→Heart, Renal/Electrolyte→split Kidney/Electrolytes, Nutritional→Nutrients, etc.).
4. **Update the diagnosis reference framework** (Step 2B) only where marker names changed; the clinical logic is preserved.
5. **Keep the output JSON schema identical** to v4 (so the backend model plan in §6 is unaffected) — only the input lab universe and system names change. `system_summaries[].system_name` now emits the 10 canonical systems directly.
6. Verify: every biomarker the demo patient carries exists in v5's valid-test tables (no Prime-Directive-#8 rejections).

**Deliverable:** `jiva_engine_prompt_v5.md`. (v4 retained for history.)

---

## 5B. Phase B — Rebuild Demo Patient & Rerun Engine — NEW (D11, D12)

1. **Rewrite the chosen demo patient input** (`Data/Sample Patients/female_29.json` per D11) so every lab row uses xlsx panel names + xlsx biomarker names, with values/units/ranges from the D10 file. Keep the questionnaire (it's taxonomy-independent). CBC expanded per D13.
2. **Run it through v5** with Claude acting as the engine (D12) → new `Data/Sample Output/female_29_output.json` conforming to the unchanged schema.
3. **Sanity-check** counts (`total_labs_reviewed`, in/out-of-range), that `panels_present` uses xlsx names, that `system_summaries` use the 10 canonical systems, and that exactly 3 diagnoses / 15 eat / 10 avoid / 3 exercise / 5 supplements are present.
4. This single patient becomes the seed for the Vitality Map demo (feeds §7's `seedDemo.js`).

**Deliverable:** one xlsx-conformant patient input + its v5 output, ready to ingest.

---

## 6. Phase 1 — Backend Data Model Redesign

New / changed Sequelize models (all UUID PKs, timestamps):

- **`FunctionalSystem`** (replaces free-form `Category`): the canonical **10** systems. `{ name, slug, displayName, colorHint }`.
- **`Panel`** (per D6, consolidates the existing `Package` model): `{ name, type(base|addon), price, testCount, description }`. Migrate `Package` → `Panel`; keep `Order.packageIds` working (alias/rename field but preserve behavior).
- **`Biomarker`** (extend): `{ name, canonicalName, description, defaultUnit, functionalSystemId }` — **single primary** `functionalSystemId` per biomarker (per D3). Cross-references handled via the engine's `supporting_labs`, not a many-to-many.
- **`PanelBiomarker`** (join): which biomarkers belong to which panel (from the spreadsheet).
- **`ReferenceRange`** (keep/extend): `{ biomarkerId, minRange, maxRange, unit, condition(male|female|general) }`.
- **`PatientProfile`**: `{ userId, externalPatientId, name, age, sex, dateOfCollection }`.
- **`Questionnaire`**: `{ userId, ...intake fields... }` stored structured or as JSONB (mirrors `questionnaire` block in inputs).
- **`Order`** (keep): user's selected panels + total + status. Optionally add `OrderPanel` join to normalize `packageIds`.
- **`LabReport`**: one per processed draw — `{ userId, dateProcessed, ...lab_analysis rollup fields..., panelsPresent[] }`.
- **`TestResult`** (extend): `{ labReportId, userId, biomarkerId, value(string|float), unit, refLow, refHigh, status(in_range|borderline|out_of_range|critical|abnormal), panel }` — note some labs are qualitative ("Normal", "Negative", "B"), so `value` must accept strings.
- **`Diagnosis`**: `{ labReportId, rank, diagnosis, confidence, supportingLabs[], clinicalRationale }`.
- **`FoodRecommendation`**: `{ labReportId, kind(eat|avoid), rank, food, quantityFrequency|avoidanceLevel, reductionTarget, targetDiagnosis, rationale }`.
- **`ExerciseRecommendation`**: `{ labReportId, rank, exerciseType, frequency, duration, intensity, targetDiagnosis, whyItHelps, safetyNotes }`.
- **`SupplementRecommendation`**: `{ labReportId, rank, supplementName, dosageRange, timing, targetDiagnosis, whyItHelps, safetyNote, localAvailabilityNote, startTier }`.
- **`SystemSummary`**: `{ labReportId, functionalSystemId|systemName, biomarkersIncluded[], summary }`.

Add a `models/index.js` to centralize model registration + associations (so `sequelize.sync()` reliably creates all tables — today associations depend on which files a script imports).

---

## 7. Phase 2 — Seeding & Engine-Output Ingestion

1. **Seed reference data** from `packages.json`: 10 `FunctionalSystem`s, all `Panel`s, all `Biomarker`s with their primary system, and `PanelBiomarker` links.
2. **Patient ingestion script**: given a `Data/Sample Patients/<x>.json`, create/att­ach `PatientProfile` + `Questionnaire`, and create `TestResult`s + `ReferenceRange`s from `labs[]`.
3. **Normalization layer** (`scripts/lib/normalize.js`, per D8): maps engine `system_summaries` names → our 10 systems (Cardiovascular→Heart, Nutritional→Nutrients, Renal/Electrolyte→split Kidney/Electrolytes via an electrolyte name-set; Blood/Liver/Metabolic/Immune-Inflammatory/Hormonal-Reproductive/Thyroid 1:1), maps input panel names → our panel names, and assigns each lab a canonical system. Extra markers not in `packages.json` (C-Peptide, HOMA-IR, Leptin, …) still get a system via their `system_summaries` membership.
4. **Engine-output ingestion script**: given a `Data/Sample Output/<x>.json`, create a `LabReport` and all child diagnoses / foods / exercises / supplements / system summaries (normalized), linked to the user by `patient_id`.
5. Provide a `seedDemo.js` that wires the existing `test@jiva.com` user to one full sample (e.g. `female_29`) so the Vitality Map is populated end-to-end.
6. Decision D4: for now, ingest **pre-computed** sample outputs (no live engine). A real engine hook can be added later behind an `/api/reports/process` endpoint.

---

## 8. Phase 3 — API Endpoints

- `GET /api/me/profile` — patient profile + questionnaire.
- `GET /api/me/report/latest` — the full latest `LabReport` payload (lab_analysis, system summaries, diagnoses, recommendations) — **the primary Vitality Map feed**.
- `GET /api/me/biomarkers?groupBy=system` — biomarkers + values + status grouped by the canonical 10 systems (replaces/enhances `GET /api/test-results`). **Each system must include roll-up counts** `{ total, inRange, borderline, outOfRange, critical }` so the frontend can color tiles (D14) without recomputing — the response shape directly feeds the Heat-Map tiles and the selected-system detail panel.
- `GET /api/me/recommendations?type=food|supplement|exercise&system=<slug>` — filtered recommendations (drives the Recommendation section's biomarker/system selector). Recommendations are keyed by the backend `target_diagnosis`; expose a mapping (or `?diagnosis=`) so the selector can filter by system **or** diagnosis. For the demo it is acceptable to return all recommendations and filter client-side.
- Keep existing auth/orders/packages; align `packages` response with the new `Panel` model.
- All `/api/me/*` routes behind the existing `protect` middleware.

---

## 8A. Phase 4.1 — UI Parity Fixes (DONE 2026-07-10)

**Context:** Phase 4 wired real data but two cards drifted from the original design (confirmed identical on `Asvanthika_updates` and `akshay_dev` HEAD — same file). Goal: **keep the original look/feel, only swap the data source.** ✅ Both fixed and verified by headless re-render: Range card back to the 3-bar SVG (real 46/22/1); tiles equal width via `minmax(0,1fr)` with a reserved 2-line name height so ranges align.

- **P1 — "What is the Range" card:** revert my horizontal-progress-bar rewrite back to the **original 3-vertical-bar SVG** (gradients `rangeGrad1/2/3`, `preciseStripes` pattern, gridlines, value label + circle marker per bar, IN RANGE / OUT OF RANGE / ABNORMAL labels). Only change: bar **counts + heights are computed from `lab_analysis`** (IN RANGE = `inRangeCount`, OUT OF RANGE = `outOfRangeCount`, ABNORMAL = `borderlineCount + criticalCount`), heights scaled to the max with a small floor so tiny bars stay visible. No layout/aesthetic change otherwise.
- **P2 — Heat-map tiles:** the original tile Box is unchanged (borderRadius 16px, height 90px, 13px/11px fonts, icon) — keep it exactly. The only regression is **misalignment**: real system names vary in length (e.g. "Hormonal/Reproductive", "Immune/Inflammatory" wrap to 2 lines) so the "X/Y in Range" line no longer sits at a consistent baseline. Fix by **reserving a fixed 2-line height for the name** (line-clamp 2 + `minHeight`) so every tile's range label lines up; keep the D14 color. Confirm the 10-tile grid stays uniform (`repeat(4,1fr)`, fixed height).
- **Verify:** re-render headless and eyeball against the original aesthetic.

**Phase 4.2 — UI refinements (DONE 2026-07-10, verified headless):**
- Biological Age: provisional value = `age − 2` (shows "27 years, ~2 years younger than calendar age of 29") with the gauge arc restored.
- Tiles: added a slight black border on all tiles + stronger hover shadow; text **left-justified**; long system names shortened for the tile only (`Immune/Inflammatory`→**Immunity**, `Hormonal/Reproductive`→**Hormonal**) via `SHORT_SYSTEM_LABELS`; single-line names so nothing clips.
- "What's Recommended": removed the "Select Biomarker" dropdown + "View All" button. Now 3 columns — **Food to Eat (top 5)**, **Food to Avoid (top 5)**, and **Exercise (2) + Supplements (3)** stacked. Each pill shows the **name only**; clicking opens a **detail Dialog** with the Spanish name + full fields (how much / why / dosage / timing / safety, per kind).

---

## 9. Phase 4 — Wire the Vitality Map Frontend (full-stack, end-to-end for female_29 — D15)

Goal: `VitalityMap.tsx` renders the **rebuilt female_29** report entirely from the API, with **zero hardcoded medical content**. Work component-by-component:

**9.0 Plumbing**
- Centralize the API base URL into one `src/config.ts` (or `VITE_API_BASE_URL`); replace the ~4 hardcoded `http://localhost:5001` usages (incl. `VitalityMap.tsx:368`).
- On mount, fetch `GET /api/me/report/latest` (full payload) and `GET /api/me/biomarkers?groupBy=system`; hold in state with a loading skeleton. Remove the 16-tile and all other static fallbacks (keep an empty/loading state instead).

**9.1 Top three cards**
- **Biological Age card:** per **D5**, keep the gauge but render a **placeholder** — no invented "7.2 years younger"/"January 2025". Show calendar age from the profile and a clear "biological age coming soon" treatment, or freeze the gauge with a "—" value. Do not fabricate.
- **"What is the Range" card (the in-range card):** drive from the **selected system/biomarker** — plot the selected biomarker's value against its `refLow/refHigh` (and status color), instead of the static 88/88/16 bars. Minimum bar: show the currently selected system's in-range vs out-of-range split. (Illustrative card — keep it modest but real.)
- **Clinical Notes card:** populate from `system_summaries[]` — show the **selected system's** `summary` (fall back to `patient_summary` for the page-level view). Remove the "Autoimmunity is when…" static text.
- **Top-of-page summary:** surface `patient_summary` prominently (page header area).

**9.2 Compare Biomarkers section — Heat Map (10-system tiles)**
- Feed tiles from `GET /api/me/biomarkers?groupBy=system` → **exactly the 10 canonical systems** the patient has (female_29 has all 10). Tile shows `system.displayName` + `"{inRange}/{total} in Range"`.
- **Tile color = `spectrumColor(inRange, borderline, total)` per D14** (continuous green→red by fraction in range) — replace the 4-bucket step function. Use the same helper to color the legend marker.
- Clicking a tile selects that system and drives the right-hand **detail panel** (real biomarkers, value + unit + In Range/Out of range from the API). Keep Read More expand.

**9.3 Compare Biomarkers section — Compare view (`BiomarkerCompare.tsx`)**
- Replace the hardcoded `inRangeData`/`outOfRangeData` with real per-system (or per-biomarker) data: split into In-Range vs Out-of-Range columns, bar width ∝ how far the value sits within/outside its range. If a true prior-draw "Difference" is unavailable (only one report exists), **hide the Difference column** rather than fake it (no invented trend arrows). Note this limitation in code.

**9.4 Recommendation section**
- Replace static `recommendationData`. Map `foods_to_eat → Food to Eat`, `foods_to_avoid → Food to Avoid`, `exercise_recommendations → Exercise` (yoga lives here), `supplement_recommendations → Supplements`.
- Wire the **Select Biomarker** dropdown to the real systems/diagnoses; filter recommendation cards by the selected key (client-side filtering on `target_diagnosis` is fine for the demo). Remove "Auto Immunity"/"Spinach".

**9.5 Verify** (see §11) — log in as the demo user and confirm the whole page reflects female_29: 10 system tiles colored by real ratios, PCOS/insulin-resistance-driven foods/supplements/exercise, and system summaries — no placeholder copy except Biological Age.

---

## 10. Decisions — LOCKED

- **D1 — Canonical grouping taxonomy:** ✅ Use the **spreadsheet's systems** as the source of truth; map the engine's `system_summaries` names onto them at ingestion.
- **D2 — Poorly-fitting biomarkers:** ✅ **Extend to 10 systems** by adding **`Immune/Inflammatory`** and **`Hormonal/Reproductive`**. Digestive markers remain under **`Liver`**.
- **D3 — One system per biomarker:** ✅ **Single primary** `functionalSystemId` per biomarker; cross-references via the engine's `supporting_labs`.
- **D4 — Engine integration:** ✅ Ingest **pre-computed** sample outputs for now; live engine hook comes later.
- **D5 — Biological Age card:** ✅ Show a **placeholder** until we define how to calculate it.
- **D6 — `Package` → `Panel`:** ✅ Consolidate `Package` into `Panel` (keep `Order` working).
- **D7 — Spreadsheet output:** ✅ Also generate `Data/Tests/packages.json` for deterministic seeding.
- **D8 — Source of truth vs sample outputs:** ✅ `packages.json` (10 panels) + the 10 systems are authoritative. The `Data/Sample Output/*.json` files are **format examples only**; at ingestion, **normalize** them to our taxonomy (map engine system names → our 10 systems; map input panel/lab names → our canonical names). The Vitality Map groups by the **10 systems** (primary); panels are a secondary purchasing concept.

### 10.1 New Decisions — LOCKED (2026-07-10)

- **D9 — Reconcile engine to the xlsx (engine v5):** ✅ Rewrite the master system prompt so its valid-test tables, panel names, per-panel biomarker lists, system tags, and reference ranges **exactly match the xlsx's 10 panels** (Basic + 9 add-ons). Produce `Data/Engine/jiva_engine_prompt_v5.md`. After this, patients + engine + packages all speak one taxonomy — and D8's "normalize at ingestion" step becomes largely unnecessary (kept only for the legacy sample outputs).
- **D10 — Reference ranges & units source:** ✅ Two-stage. **(a) Now:** a **provisional** set was researched (standard clinical intervals + web research for specialty markers) and generated into `Data/Tests/reference_ranges.json` / `.md` via `build_reference_ranges.py` — 112 biomarkers, sex-specific where relevant, with critical thresholds and unit per marker; covers every `packages.json` entry (incl. CBC/bilirubin/composite expansions). Explicitly "close enough, not lab-validated" to unblock Phases A/B. **(b) Later:** the JIVA team's authoritative file supersedes it verbatim; re-run the generator or swap the JSON.
- **D11 — Coverage this pass:** ✅ **One demo patient, end-to-end first.** Rebuild a single patient to the xlsx taxonomy, run it through v5, ingest it, and get the Vitality Map rendering real data. Prove the pipeline, then expand to full add-on coverage in a later pass.
  - *Proposed demo patient (adjust if desired):* rebuild **female_29** — a compelling PCOS / insulin-resistance / dyslipidemia / Vit-D-insufficiency story — as **Basic + Heart (Cardiometabolic) + Female Health + Stress & Aging** (3 add-ons, rich narrative, exercises + supplements + hormonal findings all populated).
- **D12 — Engine runner:** ✅ For now **Claude acts as the engine** (executes the v5 prompt by hand to produce the demo output JSON). No LLM is wired into the app; a programmatic `/api/reports/process` hook is deferred.
- **D13 — CBC handling:** ✅ In patient **inputs**, CBC is expanded into its 14 reported sub-components (WBC, RBC, Hemoglobin, …) as real labs report it; in the **catalog** (`packages.json`/`PanelBiomarker`), "Complete blood count (CBC)" stays one purchasable line whose sub-components are modeled as child biomarkers under system `Blood`. (Proposed — confirm.)
- **D14 — Continuous heat-map tile color (NEW):** ✅ Each of the 10 system tiles is colored **continuously** by how many of its biomarkers are in range, not by the current 4-bucket step function. Define `p = 1 − (inRange / total)` (0 = all in range, 1 = none in range; **borderline counts as half-in-range** → `inRange + 0.5·borderline`). The tile background is the color sampled at position `p` along the **existing legend spectrum** `#A6E4D0 (green, left) → #FFB073 (orange/red, right)` via linear RGB interpolation. Example: 6/7 in range → `p≈0.14`, nearly full green (far left); 2/7 in range → `p≈0.71`, orange-red (right). Implement as one shared helper `spectrumColor(inRange, borderline, total)` used by both the tile and the legend marker. (Extend the spectrum to a deeper red endpoint if `#FFB073` reads too mild for "mostly out of range" — cosmetic.)
- **D15 — Frontend proves the demo end-to-end (NEW):** ✅ This pass must render the **rebuilt female_29** report on the Vitality Map from **live backend data, with all hardcoded content removed** — the 10-system tiles, the selected-system detail panel, Clinical Notes (from `system_summaries`), the top summary (from `patient_summary`), and every recommendation card (foods/exercise/supplements from the engine output). Biological Age stays a **placeholder** (D5). Success = logging in as the demo user shows female_29's real diagnoses-driven content, not "Auto Immunity"/"Spinach".

---

## 11. Execution Order

1. ✅ **Phase 0 (DONE):** Filled `JIVA PACKAGE.xlsx` functional systems + generated `packages.json` via `JIVA_Node_App/scripts/buildPackages.js`.
2. ✅ **D10 ranges (provisional, DONE):** `Data/Tests/reference_ranges.json` + `.md` generated (112 biomarkers).
3. ✅ **Phase A (DONE):** `jiva_engine_prompt_v5.md` built (10 packages, 10 systems, ranges wired from `reference_ranges.json`). Tables generated via `Data/Engine/build_engine_tables.py`. Output schema unchanged from v4.
4. ✅ **Phase B (DONE):** `female_29.json` rebuilt to the xlsx taxonomy (Basic + Heart (Cardiometabolic) + Female Health + Stress & Aging, 69 labs) and re-run through v5 → new `female_29_output.json`. Validated. Note: Female Health has no Free testosterone (Male-only), so the hyperandrogenism case rests on Total testosterone + SHBG + DHEA-S + AMH + LH:FSH.
5. ✅ **Phase 1 (DONE):** 17 models + `models/index.js` + all associations implemented and **verified** — `sequelize.sync()` creates every table cleanly (`scripts/verifyModels.js`). Legacy `Category`/`Package` tables remain unused (drop later). Matches §6 spec.
6. ✅ **Phase 2 (DONE):** `scripts/seedReference.js` (10 systems, 112 biomarkers, ranges, 10 panels, 135 panel-biomarker links) + `scripts/seedDemo.js` (one-command bootstrap: resets DB, seeds reference, creates `test@jiva.com`/`password123`, ingests female_29 input+output). Verified via `scripts/verifyDemo.js`: 69/69 labs matched, statuses reconcile with the LabReport rollup, and the per-system D14 spectrum computes correctly (Blood p=0.00 … Heart p=0.69). Shared `scripts/lib/classify.js` does tier classification.
7. ✅ **Phase 3 (DONE):** `controllers/meController.js` + `routes/meRoutes.js` (behind `protect`), wired in `server.js`. Endpoints verified over HTTP: `/api/me/profile`, `/api/me/report/latest` (full report payload), `/api/me/biomarkers?groupBy=system` (10 systems + `{total,inRange,borderline,outOfRange,critical}` + server-computed `spectrumP` for D14), `/api/me/recommendations`. 401 without token.
8. ✅ **Phase 4 (DONE):** `VitalityMap.tsx` wired to `/api/me/*`. New `src/config.ts` (centralized API base, replaces all 4 hardcoded `localhost:5001`) + `src/utils/spectrumColor.ts` (shared D14 helper matching the server's `spectrumP`). 10-system tiles colored continuously; detail panel, "What is the Range" (real lab_analysis distribution), Clinical Notes (per-system summaries), recommendations (foods/exercise/supplements keyed to a real diagnosis selector) all live; Biological Age is an honest placeholder (D5). All static "Auto Immunity"/"Spinach" removed. `tsc --noEmit` clean; `vite build` succeeds.
9. ◐ **Verify:** backend API verified end-to-end over HTTP (login → `/api/me/*` → correct female_29 data); frontend typechecks + builds. **Live browser click-through still to be eyeballed** — run backend on 5001 + `npm run dev`, log in `test@jiva.com`/`password123`.

---

*Re-scoped 2026-07-10 (three-way mismatch found; D9–D15 locked). **All phases (A, B, 1–4) complete and verified.** The female_29 demo flows end-to-end from the xlsx source of truth through the v5 engine, the normalized Postgres schema, the `/api/me/*` API, and the wired Vitality Map (D14 spectrum tiles + real recommendations). **Next actions:** (1) live browser eyeball of the running app; (2) expand beyond one patient; (3) swap in the JIVA team's authoritative ranges file (re-run `build_reference_ranges.py` / `seedDemo.js`); (4) drop legacy `Category`/`Package` tables.*
