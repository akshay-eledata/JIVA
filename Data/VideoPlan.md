# JIVA Demo Video Plan

Purpose: produce a video demonstration of the JIVA application for use in a PowerPoint presentation, showing both product functionality and business value.

Delivery format: **8-10 short scene clips (10-30 seconds each), one per PowerPoint slide**, rather than one long continuous video. The presenter narrates live over looping clips. This avoids voiceover production, lets any scene be re-recorded independently as the UI evolves, and matches how the deck will actually be presented.

---

## 1. Technology stack

| Tool | Role | Status |
|---|---|---|
| **TestReel** (`github.com/greentfrapp/testreel`) | Primary capture tool. Define each scene as a JSON recording; TestReel drives the browser via Playwright and outputs polished MP4/WebM/GIF with animated cursor, click ripples, zoom animations, macOS window chrome, and background styling. | `npm install testreel playwright && npx playwright install chromium` |
| **ffmpeg** | Trimming clip heads/tails, GIF extraction if needed. TestReel outputs MP4 natively, so this is glue only. | `brew install ffmpeg` |
| **Screen Studio** (or Tella) | Fallback for the one animation-heavy homepage hero scene if TestReel's capture framerate makes GSAP/framer-motion scroll animations look choppy. Manual capture, ~$89. | Optional, evaluate after first TestReel pass |
| **Remotion** | Optional later phase: assemble the same clips into a standalone shareable video (website, WhatsApp, investor email) with branded title cards in exact brand tokens. Not needed for the PowerPoint deliverable, since slides provide titles and sequencing. | Deferred |

### Why TestReel over hand-rolled Playwright

TestReel packages everything a hand-built capture rig would need:

- **15 step actions**, including `type` with per-keystroke `delay` (default 80ms) for human-paced typing, `scroll` with eased animation, `hover`, `click` with optional pre-click `zoom`, standalone `zoom`/pan with `scale` and `duration` for money-shot close-ups, `hideCursor`/`showCursor` for clean pauses, `navigate` with variable substitution, and `waitForNetwork`.
- **Auth support** via localStorage/cookie injection and storage state files. JIVA stores its JWT in `localStorage.token`, so a setup block can log the demo user in without showing credentials on screen.
- Per-step `pauseAfter` and `speed` multipliers for pacing, and native **MP4 output**, which PowerPoint embeds reliably.

Caveat: TestReel is young (v0.2.0, ~72 stars, actively maintained). If a scene needs choreography its step vocabulary cannot express, fall back to raw Playwright for that scene; `playwright-core` is already a devDependency of the React app.

---

## 2. Demo environment and data

The app is unusually demo-friendly. All of this already exists:

- **Full stack via Docker:** `docker compose up` from the repo root. Frontend at `http://localhost:5174`, backend at `:5001`, Postgres at `:5433`, ICD-11 lookup at `:8382`.
- **Deterministic seed data:** the backend re-seeds on every start (`scripts/seedDemo.js`), loading the **female_29** sample patient across **two lab visits** (baseline + 6-month retest). Vitality Map, Vitality Map 2, and all recommendations render identical real data on every take.
- **Demo login:** `test@jiva.com` / `password123` (pre-seeded).
- **No route guards:** any page loads directly by URL (e.g. `/vitality-map`, `/welcome?option=11`), so recordings can jump straight to a scene.
- **DemoSkip pills** on every onboarding screen for fast-forwarding flows.

### Demo subject: female_29

The strongest and safest choice:

- The **only patient wired end-to-end** through the seeded pipeline; guaranteed to render.
- Relatable positive-arc story: 29-year-old with PCOS, insulin resistance, dyslipidemia, low vitamin D. 69 labs, 22 out of range across **all 10 body systems**, so the Vitality Map heatmap shows real color variation.
- Biological age **30.8 vs calendar 29**, with a plain-language explanation.
- Vivid, specific recommendations (spearmint tea, myo-inositol, magnesium glycinate, resistance training) including **Spanish food names** ("chía, linaza, té de hierbabuena"), which directly evidences the LatAm personalization value prop.
- **female_29_visit2** provides the "after" dataset ("PCOS responding to treatment") for the before/after retest scene.

---

## 3. Shot list

Each scene maps to one business-value claim, which becomes the slide title.

| # | Scene (route) | Business value demonstrated | Capture notes |
|---|---|---|---|
| 1 | Homepage hero + scroll (`/welcome`) | Brand promise: "Precision Wellness, Personalized to You"; medical-but-human design | Eased `scroll` steps through hero, services, footer. Candidate for Screen Studio if animations look choppy |
| 1b (optional) | Design range flourish (`/welcome?option=11` GSAP scroll-film, or `?option=12` anime.js dot grid) | Design ambition / brand energy | Only if the deck has room; these are the most cinematic pages in the app |
| 2 | Intake wizard (`/intake`), 2-3 sections | Personalization starts before the blood draw: lifestyle, diet, family history, goals | Paced `type` + `click` through questions; show a conditional question appearing; show the progress bar advancing |
| 3 | Packages → payment → scheduling (`/select-packages`, `/payment`, `/schedule-labs`) | The commerce engine: $299 base + add-on panels, frictionless booking | Toggle one add-on to show the running total change; `zoom` on total; keep payment brief (it is mocked) |
| 4 | Dashboard (`/dashboard`) | The member's home: "from draw to report" journey and promised deliverables | Auth via localStorage injection; slow scroll through the 6-card deliverables grid |
| 5 | **Vitality Map** (`/vitality-map`) — hero scene | 100+ raw biomarkers become 10 color-coded body systems; biological age 30.8 vs 29 | Longest clip. `zoom` on the bio-age callout, then the heatmap; click one out-of-range system tile to reveal its biomarker tiles |
| 6 | Biomarker drill-down (`/biomarker/:name`) | Transparency: every number on a spectrum with its reference range, explained in plain language | Pick a visibly out-of-range marker from scene 5's system (e.g. an androgen or insulin marker); `zoom` on the spectrum bar |
| 7 | Action Plan (`/action-plan`) | Recommendations anchored to *her* numbers, not generic AI advice | Open one food card dialog showing how much / why it helps; make sure a Spanish-named food is visible |
| 8 | **Vitality Map 2** (`/vitality-map-2`) | The retention story: retest loop, trend tracking, "PCOS responding to treatment" | Show the visit 1 vs visit 2 system comparison, then a biomarker trend chart (`/biomarker/:name?trend=1`) |
| 9 | Roadmap (static slide, no video) | Coming next: WhatsApp-first scheduling, JIVA Score, wearables, SINPE Móvil / installments, Spanish localization | Pull from `Additional_Functionality.md` (F1 retest loop, F3 JIVA Score, F4 PhenoAge, F9 AI assistant, F16 WhatsApp, F18 payments) |

Suggested slide-title register (brand voice, plain clinician tone, no filler): e.g. scene 5 → "One map of your health, from 69 lab values"; scene 7 → "Recommendations tied to your specific numbers"; scene 8 → "Six months later: measurably better".

---

## 4. Brand constraints for everything on screen

From `Brand_Guidelines.pdf` (tokens transcribed in `frontend-plan.md` / `brand.ts`):

- **Colors:** Jiva Green `#2A6130` (primary), Jiva Lime `#D5E274` (accent), Whispering Saga `#DDEEDE`, Dewdrop Glow `#F3F9F3`. Avoid legacy off-brand greens `#256111` / `#006045` that have historically drifted into the codebase.
- **Type:** Mustachio (or fallbacks Alegreya Sans 800 / Lexend) for headlines, Inter for body.
- **Logo:** green on light, white on dark; clear space of half the "J" height; never tint, tilt, gradient, or shadow.
- **Tone for any captions/titles:** factual, warm, plain-spoken clinician register. No AI filler words ("journey", "empower", "exciting"), no em/en dashes, no emojis, no arrows.
- **Motion:** supportive, calm. TestReel zoom durations at or above the 600ms default; avoid rapid cuts.

---

## 5. Production phases

**Phase 1 — Polish audit (half a day).** Record only after screens are on-brand. Finish the Vitality Map spectrum/watermark cleanup tracked in `frontend-plan.md`, and sweep the scene-list pages for legacy greens. The camera catches everything.

**Phase 2 — Scene definitions (1 day).** Create a `demo/` folder (in `JIVA_React_App` or repo root) with one TestReel recording JSON per scene plus a small runner script (`npm run demo:record`) that assumes a freshly seeded `docker compose up` stack. Shared config: viewport 1920x1080, localStorage JWT injection for authed scenes, brand-tinted background padding around the window chrome (Dewdrop Glow `#F3F9F3`).

**Phase 3 — Capture and trim (half a day).** Run all recordings, review, adjust pacing (`pauseAfter`, `speed`, `zoom` targets), re-run. Trim with ffmpeg if needed. Evaluate scene 1: if scroll animation smoothness disappoints, recapture that one scene manually with Screen Studio.

**Phase 4 — Assemble deck (half a day).** One clip per slide, autoplay + loop. Slide title carries the business-value claim; add a short presenter talking-point note per slide in the brand voice. Scene 9 is a static roadmap slide.

Total: roughly 2-3 working days. Phases 1 and 2 are reusable forever; future re-records after design changes are `npm run demo:record`, not an afternoon of screen capture.

---

## 6. Assumptions and open decisions

1. **Language: English** for this deck. The LatAm story is told via Spanish food names on screen and the roadmap slide. A Spanish variant is a separate pass if the audience is Costa Rican.
2. **Per-slide clips, presenter-narrated.** If a standalone 2-3 minute shareable video with music/VO is also wanted, add the Remotion assembly phase; the same clips feed it.
3. **Homepage scene uses the current default (Option 1)**, with Option 11/12 as an optional flourish. Client direction on the 13 homepage options is still settling, so scene 1's recording JSON should be trivially re-pointable.
4. **Demo subject: female_29** (see section 2). Secondary option for a male-skew or metabolic story: `male_44` or `james_whitfield`, but neither is seeded end-to-end today.

---

## Appendix: sample TestReel recording (scene 5, Vitality Map)

Illustrative only; selectors to be confirmed against the live DOM during Phase 2.

```json
{
  "url": "http://localhost:5174/vitality-map",
  "viewport": { "width": 1920, "height": 1080 },
  "setup": {
    "localStorage": { "token": "<JWT for test@jiva.com>" }
  },
  "steps": [
    { "action": "wait", "ms": 1500 },
    { "action": "zoom", "selector": "[data-demo='bio-age-callout']", "scale": 1.8, "duration": 800 },
    { "action": "wait", "ms": 2500 },
    { "action": "zoom", "scale": 1, "duration": 600 },
    { "action": "scroll", "y": 600 },
    { "action": "hover", "selector": "[data-demo='system-tile-hormonal']" },
    { "action": "click", "selector": "[data-demo='system-tile-hormonal']", "zoom": true },
    { "action": "wait", "ms": 2500 },
    { "action": "scroll", "y": 500 },
    { "action": "screenshot", "name": "vitality-map-hero" }
  ]
}
```

If stable selectors are missing, Phase 2 may add a few `data-demo` attributes to key elements; these are inert and safe to ship.
