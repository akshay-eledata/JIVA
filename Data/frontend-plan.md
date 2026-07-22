# JIVA Homepage Overhaul — Frontend Plan

## What the app is (context for the redesign)

JIVA is a patient-facing precision-wellness product. A member fills out an intake
questionnaire, buys a Basic lab panel (plus optional add-on panels), gets blood drawn,
and a physician-led clinical engine turns their biomarker results into a Vitality Map:
biological age, ten functional body systems, and personalized food, supplement,
movement, and yoga plans, with a follow-up test to track change over time.

The homepage has one job: make a first-time visitor trust the product ("medical")
and want it ("human"), then push them to **Get Started** (`/intake`) or **Sign in**.

## Brand system (from Data/Brand_Guidelines.pdf)

| Token | Value | Use |
|---|---|---|
| Jiva Green | `#2A6130` | Primary. Health, growth, trust. Logo on light backgrounds. |
| Jiva Lime | `#D5E274` | Accent. Brightness and optimism. Highlights, underlines, glows. |
| Whispering Saga | `#DDEEDE` | Warm section tint, cards. |
| Dewdrop Glow | `#F3F9F3` | Soft page background. |

- **Headlines:** Mustachio (licensed display face — not currently in the repo).
  Until it is licensed, options below use loaded fallbacks with similar weight and
  personality (Alegreya Sans 800, Lexend, Plus Jakarta Sans — all already installed).
- **Body:** Inter (already the MUI theme default).
- **Logo:** green version on light backgrounds, white version on dark; clear space of
  half the "J" height; never tint, tilt, gradient, or shadow the mark.
- **Icons:** minimal, geometric, single line weight.
- Note: the codebase currently uses two unofficial greens (`#256111` homepage,
  `#006045` constants.ts). The redesign standardizes on brand `#2A6130`.

## Modern UX/UI component ideas (the menu we drew from)

Graphics, movement, and animation patterns that fit a health/longevity product:

1. **Scroll-triggered reveals** — sections fade/slide in as they enter the viewport.
2. **Animated hero orbit** — biomarker chips floating/orbiting a central visual.
3. **Radial biological-age gauge** — an animated score dial as the hero centerpiece.
4. **Animated number counters** — "100+ biomarkers", "10 body systems" counting up on scroll.
5. **Kinetic typography** — headlines that reveal word-by-word or letter-by-letter.
6. **Scroll-linked storytelling (pin + progress)** — a section that pins while steps of
   the journey (Test → Analyze → Plan → Retest) advance with scroll.
7. **Marquee / ticker** — an infinite horizontal scroll of biomarkers or testimonials.
8. **Bento grid** — mixed-size feature tiles, the modern replacement for uniform card grids.
9. **Glassmorphism cards** — frosted, blurred cards floating over imagery or gradients.
10. **Aurora / gradient mesh backgrounds** — slow-moving color fields behind dark heros.
11. **Magnetic / lift micro-interactions** — buttons and cards that respond to hover.
12. **Animated line/spark charts** — a biomarker trend drawing itself in.
13. **Curved and wave section dividers** — soft organic transitions between sections.
14. **Sticky side-by-side** — text scrolls while a visual stays pinned.
15. **Accordion FAQ with smooth height animation.**
16. **Parallax layers** — background art moving slower than foreground content.
17. **Before/after comparison** — first test vs follow-up test visual.
18. **Testimonial carousel with drag/swipe.**

## Library shortlist

### Installed and used by the three options

| Library | Why |
|---|---|
| **framer-motion (`framer-motion`)** | The workhorse. Scroll reveals, `useScroll`/`useTransform` parallax and pinned storytelling, layout animation, marquees, counters, kinetic text, micro-interactions. One dependency covers ~90% of the motion menu above. |
| **MUI v7** (already installed) | Layout, buttons, accordions, responsive `sx` system. Keeps the new pages consistent with the rest of the app. |
| **ApexCharts / react-apexcharts** (already installed) | Radial biological-age gauge and self-drawing biomarker trend lines. Matches the charts used inside the product, so the homepage previews the real thing. |

### Worth adopting later (not needed for these prototypes)

| Library | What it adds |
|---|---|
| **GSAP + ScrollTrigger** | Heavier-duty scroll choreography (scrubbed timelines, horizontal scroll scenes). Overlaps framer-motion; adopt only if a scene outgrows it. |
| **Lenis** | Buttery smooth-scrolling that makes scroll-linked animation feel premium. Tiny, drop-in. |
| **Lottie (`lottie-react`)** | Designer-authored vector animations (e.g. an animated blood-draw or body illustration) once brand illustrations exist. |
| **Rive** | Interactive state-machine animations (a body map that reacts to hover). |
| **Swiper** | Full-featured touch carousels if testimonials grow beyond a marquee. |
| **tsparticles** | Particle fields for dark heros. Use sparingly. |
| **react-fast-marquee** | Simplest possible ticker if we drop the hand-rolled one. |

## The three homepage options

All three live behind a fixed switcher bar (Option 1 / Option 2 / Option 3) rendered
at the top of `/`, driven by a `?option=` query param so a specific option can be
shared by URL. Copy follows the repo convention: strings in `labels.ts` per option.

### Option 1 — "Vitality in Motion" (brand-faithful, light and airy)

The safest evolution of today's page: keeps the light mint feel but rebuilds it on the
official palette with real motion and a data-forward hero.

- **Palette:** Dewdrop Glow `#F3F9F3` page, Whispering Saga `#DDEEDE` alternate
  sections, Jiva Green headings, Lime accents. Green logo.
- **Type:** Alegreya Sans 800 display (Mustachio stand-in), Inter body.
- **Sections (7):**
  1. **Hero** — huge headline with a lime-underlined keyword, sub-copy, Get Started +
     Sign in. Right side: an animated **biological-age radial gauge** (ApexCharts)
     orbited by six floating glass biomarker chips (framer-motion float loops),
     over soft concentric rings.
  2. **Biomarker marquee** — infinite ticker of biomarker names ("ApoB · HbA1c ·
     hs-CRP · Ferritin…") separating hero from content.
  3. **How it works** — four steps (Test, Analyze, Plan, Retest) on an animated
     connector line; each step card reveals on scroll with a stagger.
  4. **Ten body systems** — chip grid of the ten functional systems with hover lift
     and stagger-in; sells the Vitality Map's breadth.
  5. **Stats band** — Whispering Saga strip with counters: 100+ biomarkers, 10 systems,
     2 tests/year, 1 plan.
  6. **Testimonials** — three cards, scroll reveal, lime rating pills.
  7. **CTA banner + footer** — Jiva Green banner (white logo) with a lime CTA;
     compact footer.
- **Motion language:** gentle. Everything eases in softly; floats are slow (4–6s);
  nothing moves unless it just entered the viewport.
- **Libraries:** framer-motion, react-apexcharts, MUI.

### Option 2 — "The Longevity Lab" (dark, premium, data-forward)

A confident, high-end longevity-brand look (in the spirit of modern diagnostics
brands): dark green-black canvas, white logo, lime glow, charts everywhere.

- **Palette:** near-black green `#0C1A10` / `#122417` canvas, white text, Jiva Lime
  as the single accent, Dewdrop Glow only inside cards. White logo per guidelines.
- **Type:** Lexend for display (clean, technical), Inter body, mono-style numerals
  for data.
- **Sections (6):**
  1. **Hero** — full-viewport dark hero with a slow-moving **aurora gradient** (green
     to lime mesh), kinetic headline that reveals word-by-word, and a **self-drawing
     biomarker trend chart** with a live-updating readout chip. Lime Get Started.
  2. **Scroll-pinned journey** — the signature scene: the section pins while the four
     journey steps advance as you scroll, with a lime progress rail
     (framer-motion `useScroll` + sticky).
  3. **Bento grid** — mixed-size glass tiles: big biological-age tile with radial
     gauge, panels tile, yoga/movement tile, physician-review tile, follow-up tile.
  4. **Numbers band** — oversized lime counters on black.
  5. **Testimonial marquee** — two counter-scrolling rows of quote cards.
  6. **CTA + footer** — lime block ("Your baseline is waiting"), dark footer.
- **Motion language:** cinematic. Scroll drives the page; the aurora never stops;
  hover states glow.
- **Libraries:** framer-motion (heavily: useScroll/useTransform), react-apexcharts, MUI.

### Option 3 — "The Human Practice" (editorial, warm, physician-led)

A magazine-like page that leads with people and care rather than data. Feels like a
modern clinic, not a dashboard.

- **Palette:** warm paper `#FAFBF7` and Whispering Saga `#DDEEDE` blocks, Jiva Green
  ink, lime used only as a highlighter stroke. Green logo.
- **Type:** Alegreya Sans (light 300 + black 900 contrast) for editorial headlines,
  Inter body, generous line-height, oversized pull-quotes.
- **Sections (8):**
  1. **Editorial hero** — asymmetric split: left, an oversized serif-feel headline
     with a hand-drawn-style lime underline (animated draw-on) and a short
     manifesto paragraph; right, the AI-doctor imagery in a tall arched
     (portrait-window) frame with slow parallax. CTAs beneath the manifesto.
  2. **Manifesto line** — one full-width kinetic sentence ("Prevention is the
     strongest form of care.") that reveals word-by-word as you scroll.
  3. **Sticky care chapters** — sticky left rail with chapter titles (Your tests,
     Your physician, Your plan) while the right column scrolls through each chapter's
     card; the active chapter highlights.
  4. **Bento of services** — soft-cornered tiles in Whispering Saga tones for the
     four services (tests, reports, thermal, yoga) with minimal geometric icons.
  5. **Pull-quote testimonial** — one big rotating quote with drag/swipe, not a grid.
  6. **FAQ accordion** — smooth-height MUI accordions restyled to the brand.
  7. **Arched CTA** — arch-shaped green panel echoing the hero frame ("Begin with a
     conversation about your health").
  8. **Footer** — editorial columns with a large wordmark.
- **Motion language:** quiet. Draw-on underlines, slow parallax on imagery, soft
  crossfades; motion supports reading rather than performing.
- **Libraries:** framer-motion, MUI (accordion, layout). No charts — imagery-led.

### Option 4 — "The Clear Signal" (light, scroll-driven)

Round-two request: Option 2's scroll energy translated into a bright, daylight
palette. The scroll itself is the show.

- **Palette:** Dewdrop Glow `#F3F9F3` canvas, Whispering Saga `#DDEEDE` gallery band,
  white cards, Jiva Green ink, lime blobs and progress accents. Green logo.
- **Type:** Manrope 700/800 display (crisp, geometric), Inter body.
- **Sections (7):**
  1. **Lime scroll progress bar** fixed to the top edge, springs along with the page.
  2. **Scrub-out hero** — centered kinetic headline over parallax lime/mint blobs;
     the whole hero fades and shrinks as you scroll past it; bobbing scroll hint.
  3. **Biomarker marquee** on white.
  4. **Sticky split chapters** — the signature scene: a visual card pins on the left
     and crossfades between three states (biological-age gauge → self-drawing
     ferritin area chart → plan checklist) while three chapters scroll by on the
     right. Mobile falls back to inline visuals.
  5. **Horizontal sweep** — a 280vh pinned section where vertical scroll drags the
     ten body-system cards sideways across the screen.
  6. **Count-up stats band.**
  7. **Green CTA banner + footer.**
- **Motion language:** scroll-scrubbed. Almost nothing loops; nearly every motion is
  driven by scroll position (progress bar, hero scale, gallery sweep).
- **Libraries:** framer-motion (useScroll/useTransform/useSpring, AnimatePresence),
  react-apexcharts, MUI.

### Option 5 — "Mission Control" (dark, graphics-rich)

Option 2's palette and confidence, with the graphic density turned all the way up:
every section carries a drawn, charted, or orbiting visual.

- **Palette:** same near-black greens as Option 2 (`#0C1A10` / `#122417`), Jiva Lime
  accents, white logo — plus a repeating blueprint grid (the existing `Vector.svg`
  asset) washed over the hero and CTA at low opacity.
- **Type:** Lexend display, Inter body (matches its sibling, Option 2).
- **Sections (8):**
  1. **Orbit hero** — the centerpiece: a biological-age radial gauge inside two
     counter-rotating dashed orbit rings carrying six biomarker chips, over aurora
     gradients, a 26-dot twinkling particle field, and the blueprint grid. Left side:
     kinetic headline plus two floating glass status cards (Inflammation, Metabolic).
  2. **ECG interlude** — a heartbeat line that draws itself across the screen,
     scrubbed by scroll position, with a soft lime glow.
  3. **Live systems board** — a 4-column dashboard bento: radial gauge tile,
     self-drawing area chart, count-up "8/10 systems in range" tile, per-system bar
     chart, and a next-best-actions card.
  4. **Systems ticker** — infinite marquee of the ten body systems, each with a mini
     progress meter.
  5. **Count-up stats band.**
  6. **Counter-scrolling quote marquees** (two rows).
  7. **Lime CTA block** with the blueprint grid washed over it.
  8. **Dark footer** with white logo.
- **Motion language:** cinematic and continuous like Option 2, but with more
  *things* moving: orbits rotate, particles twinkle, the ECG scrubs, and four
  different chart types animate in.
- **Libraries:** framer-motion (loops + scroll-scrubbed SVG pathLength),
  react-apexcharts (radialBar, area, bar), MUI.

### Option 6 — The original homepage (reference)

The pre-redesign production page, kept in the showcase so it can be compared
directly against the new candidates. Unchanged: mint hero with the hand-scan
collage, 2x2 services grid, doctors' clinical notes, testimonials, curved footer.
Uses the legacy `#256111`/`#61CC3E` greens and Source Sans Pro / Alegreya Sans.
No animation library, MUI only.

### Option 7 — "Mission Control, Daylight" (light, graphics-rich)

Option 5 restyled onto the light brand palette: same section structure and
graphic density, opposite mood.

- **Palette:** Dewdrop Glow `#F3F9F3` canvas, white cards with soft green
  shadows, Jiva Green as the working color, lime reserved for chips, glow strokes,
  and the CTA button. Blueprint grid at higher opacity (it reads naturally on
  light). Green logo.
- **Type:** Lexend display, Inter body (matches Options 2 and 5).
- **Sections:** identical skeleton to Option 5 — orbit hero (white chip pills and
  a white-backed gauge over saga/lime blobs, green particle field, grid), scroll-
  scrubbed ECG in green with a lime glow, live systems board bento on white
  cards, systems ticker, count-up stats, quote marquees, green CTA block with
  grid wash.
- **Motion language:** identical to Option 5; only the surfaces change.
- **Libraries:** framer-motion, react-apexcharts, MUI.

> Note (round 3): the client direction is Option 7's combination of light theme +
> heavy animation and graphics. Options 8-10 push that direction further, each with
> a distinct personality and a set of modern interaction patterns not yet used in
> the showcase. (Options 1 and 6 were swapped so the original page is Option 1,
> the default.)

### Option 8 — "The Glasshouse" (light, interactive depth)

The page responds to the cursor, not just the scroll. Everything has depth.

- **Palette:** Dewdrop canvas, frosted glass cards, Jiva Green ink, lime energy.
- **Type:** Plus Jakarta Sans display, Inter body.
- **Signature elements:**
  1. **Mouse-parallax hero** — layered lime/saga blobs, floating biomarker chips,
     and the central gauge card all drift at different rates as the cursor moves
     (spring-smoothed), over a shimmering gradient headline.
  2. **Magnetic CTA** — the Get Started button leans toward the cursor.
  3. **3D tilt cards** — the four service cards tilt in perspective under the
     pointer with a moving glare highlight.
  4. **Scan-beam systems section** — a sticky scroll scene where a lime beam
     sweeps down the list of ten systems, lighting each up with its marker count.
  5. Biomarker marquee, count-up stats, green CTA banner.
- **Libraries:** framer-motion (springs, pointer tracking), react-apexcharts, MUI.

### Option 9 — "Bloom" (light, organic, calm motion)

Health as a living thing: soft, breathing, continuous motion. The calmest of the
high-animation options — nothing snaps, everything breathes.

- **Palette:** warm Dewdrop + Saga washes, Jiva Green, lime blossoms.
- **Type:** Alegreya Sans display (300/800 contrast), Inter body.
- **Signature elements:**
  1. **Morphing blob hero** — an organic SVG blob continuously morphs behind the
     headline; breathing rings pulse around a floating vitality badge.
  2. **Activity rings** — three concentric rings (systems in range, plan
     adherence, retest progress) draw themselves on scroll, Apple-Watch style.
  3. **Draw-on timeline** — the four-step journey on a vertical line that draws
     with scroll while milestones bloom in.
  4. **Flip cards** — services flip in 3D on hover to reveal detail.
  5. **Auto-advancing pull-quote** with soft crossfade, breathing CTA button.
- **Libraries:** framer-motion (SVG path morph, scroll-linked strokeDashoffset,
  3D flips), MUI. No charts — rings and lines are hand-drawn SVG.

### Option 10 — "The Guided Tour" (light, product-led)

Show, don't tell: the homepage demos the actual product while you scroll.

- **Palette:** Dewdrop canvas, white app frames with green chrome, lime accents.
- **Type:** Lexend display (matches the product options), Inter body.
- **Signature elements:**
  1. **Typewriter headline** — "Know your **heart.**" where the last word types,
     deletes, and retypes through heart / thyroid / hormones / kidneys / future.
  2. **Product-tour scroll scene** — a sticky browser-style app frame on the
     right rebuilds itself three times (Vitality Map view → biomarker trend view
     → action-plan view) as tour steps scroll past on the left.
  3. **Cursor-spotlight grid** — six capability cards where a radial glow follows
     the pointer inside each card.
  4. **Animated tab switcher** — Heart / Metabolic / Hormones tabs with a sliding
     lime underline that swap a live-drawing chart.
  5. Count-up stats, quote marquee, green CTA banner.
- **Libraries:** framer-motion (layout animation for tabs, scroll-linked frame
  swaps, pointer tracking), react-apexcharts, MUI.

> Note (round 4): Options 11-13 are the boundary-pushers. Each is built around a
> different animation engine at full power: GSAP + ScrollTrigger, anime.js v4, and
> framer-motion. `gsap` and `animejs` are now real dependencies.

### Option 11 — "Sequence" (GSAP + ScrollTrigger, dark, cinematic)

The page is a film and the scrollbar is the timeline. Almost nothing animates on
its own clock; the scroll position drives everything, scrubbed and pinned.

- **Palette:** near-black greens (Options 2/5 lineage), lime highlights, white logo.
- **Type:** Lexend display, oversized.
- **Signature scenes (all ScrollTrigger):**
  1. **Title card** — "LISTEN" fills the viewport at 9x scale and scrubs down to
     size as you scroll, while the tagline's characters stagger in.
  2. **Four acts, sideways** — a pinned viewport translates a 4-panel horizontal
     strip (Test / Analyze / Plan / Retest) as vertical scroll continues.
  3. **The countdown** — a pinned scene where biological age scrubs 41 → 34 tied
     directly to scroll progress, with a conic progress ring filling behind it.
  4. **Card stack** — testimonial cards pin and stack, each scaling back as the
     next slides over it.
  5. **Magnetic CTA** — gsap.quickTo cursor-follow on the final button.
- **Library:** gsap (ScrollTrigger, quickTo). No framer-motion in this option.

### Option 12 — "Pulse Grid" (anime.js v4, light, playful precision)

Anime.js is the staggering engine: hundreds of tiny elements moving as one
organism. Light theme, toy-like, tactile.

- **Palette:** Dewdrop canvas, Saga surfaces, green ink, lime energy.
- **Type:** Manrope display.
- **Signature elements:**
  1. **Ripple dot grid hero** — a 220-dot grid ripples outward from the center
     on load (grid stagger, elastic ease) and re-ripples from wherever you click.
  2. **Letter cascade headline** — characters drop in with overshoot, per-letter.
  3. **One-line ECG draw** — an SVG pulse line draws itself via
     `svg.createDrawable` when it enters the viewport.
  4. **Elastic cards** — service cards squash and rebound (outElastic) on hover.
  5. **Staggered system chips** — the ten systems pop in as a wave; clicking a
     chip makes the whole row shiver outward from it.
- **Library:** animejs v4 (`animate`, `stagger`, `svg`) + IntersectionObserver
  triggers. No framer-motion in this option.

### Option 13 — "Chroma Flow" (framer-motion at full power)

One continuous surface whose color, skew, and depth all answer to scroll physics.

- **Palette:** the page itself morphs — Dewdrop → Saga → lime wash → deep green —
  as one scroll-linked background interpolation; content stays green-ink/white.
- **Type:** Plus Jakarta Sans display.
- **Signature elements:**
  1. **Scroll-morphing background** — the whole page's color interpolates through
     four brand hues via useScroll + useTransform.
  2. **Velocity-skewed marquee** — a giant outlined-text marquee that shears and
     accelerates with your scroll velocity, springing back at rest.
  3. **Draggable story deck** — a stack of member-story cards you throw aside;
     each flies off with your gesture's velocity and the stack springs forward.
  4. **Shared-element expansion** — capability chips that expand in place into
     full panels (layoutId shared-element transition with a scrim).
  5. **Center-zoom panels** — sections scale from 0.9 to 1 and un-blur as they
     cross the viewport center.
- **Library:** framer-motion only, pushed hard (useScroll, useVelocity, springs,
  drag with momentum, AnimatePresence + layoutId).

## Implementation notes

- Routes: `/` renders `Welcome` which now hosts the switcher + the three options at
  `src/pages/Welcome/options/{option1,option2,option3}/`.
- The switcher is a fixed pill bar (Option 1 · Option 2 · Option 3) synced to
  `?option=n`; the previous production homepage remains in git history.
- All motion respects `prefers-reduced-motion` via framer-motion's `useReducedMotion`.
- Fonts and colors defined per option in that option's `constants.ts`; brand tokens
  shared from `src/pages/Welcome/brand.ts`.

---

# In-App UX/UI Upgrade — Phase 1: Vitality Map

The homepage rounds covered the marketing surface; this phase starts on the
authenticated app. First target: the Vitality Map (`/vitality-map`), the primary
results dashboard. The layout stays — the upgrade is color, texture, and cohesion.

## Findings (July 2026 audit)

- **Two disconnected color systems.** The Welcome/marketing side uses the official
  brand palette (`brand.ts`: Jiva Green #2A6130, Lime #D5E274, Saga #DDEEDE,
  Dewdrop #F3F9F3). The in-app screens never reference it — they standardize on a
  separate teal-green `#006045` plus dozens of ad-hoc hexes (steel-blue borders
  #B1C2DC, slate panels #F1F5F9/#F7FAFD, arbitrary icon colors #4A3AFF/#2E90FA).
- **Heatmap spectrum** (`src/utils/spectrumColor.ts`): 3 stops
  #A6E4D0 → #FFD08A → #FF8A65 interpolated in raw RGB. The green end reads *teal*
  (hue 173, not brand green ~146), RGB interpolation collapses chroma mid-ramp so
  tiles around p≈0.25 come out muddy olive (visible on Liver/Electrolytes tiles),
  and the "bad" end is a loud salmon-orange that doesn't clearly read as red.
- **Recommendation cards**: each header has a 70px peach 8-point burst
  (`Star.svg`, opacity 0.7, rotated -15°, clipped by the header) that reads as a
  random symbol — the client complaint. Same watermark is reused in VitalityMap2
  plan cards. The section sits on cool blue-slate neutrals that clash with the
  warm-green brand, item icon circles are flat gray #F0F0F0, and the four
  category accent colors are arbitrary (incl. an off-brand purple and blue).

## Plan

### A. Rebuild the severity spectrum (brand-anchored, perceptually smooth)

Rewrite `spectrumColor.ts` to interpolate in **OKLCH** (small self-contained
conversion, no new deps) over 4 brand-anchored stops:

| p | OKLCH | hex | meaning |
|---|---|---|---|
| 0.0 | 0.90 / 0.076 / 150° | `#BBEDC4` | brand-green tint (all in range) |
| 0.35 | 0.884 / 0.095 / 108° | `#DFDE94` | brand-lime family |
| 0.7 | 0.865 / 0.095 / 75° | `#F8CA8B` | warm sand/amber |
| 1.0 | 0.78 / 0.104 / 35° | `#F29F8A` | soft terracotta (none in range) |

Why this works: hue travels green → lime → amber → terracotta while **chroma is
held** (no muddy midpoints) and **lightness falls monotonically** (0.90 → 0.78),
so severity is still readable in grayscale and under red-green color-vision
deficiency — the hue axis alone would be invisible to protanopes. Ink text
contrast verified 7.8:1–12.4:1 across the whole ramp (≥4.5:1 required for the
tile's 11–13px text). `SPECTRUM_GRADIENT` (the legend) samples the same stops, so
it updates automatically; `spectrumP` math is unchanged. Tile borders soften to a
warm ink tint (`rgba(23,48,27,0.10)`) instead of pure black alphas; the selected
tile gets a Jiva-green ring instead of the black one.

### B. Recommendations section restyle

1. **Delete the Star.svg watermark** from the four card headers (and from
   VitalityMap2's plan cards — same asset, same complaint).
2. **Warm the neutrals**: section panel #F1F5F9 → Dewdrop `#F3F9F3`; card/header
   fills #F7FAFD → white with a per-category tinted header; steel-blue borders
   #B1C2DC/#E2E8F0 → soft green-gray (`#DCE7DD`-family).
3. **On-brand category accents** replacing the arbitrary set: Eat = Jiva green,
   Avoid = terracotta (matches the spectrum's bad end), Exercise = deep
   teal-green, Supplements = amber. Applied consistently: tinted icon chip
   (10–14% tint bg + full-strength icon), a slim accent rule or tinted wash in
   the header, and the item icon circles lose the flat gray.
4. Header decoration, if any: the category's own icon at large size, very low
   opacity, properly masked inside the header — or nothing. No more asterisks.
5. Item pills and the detail dialog keep their layout/behavior.

### C. Cohesion pass on the same screen (small, optional-but-cheap)

- Range Breakdown bars and the biomarker status rails/text currently use yet
  another green/amber/red set (#81FDCA…, #BAEBD7/#FCE4B0/#FFD2C2) — re-derive
  them from the same four spectrum anchors so the whole screen tells one color
  story. Also drop the odd dot + diagonal hatch overlay on the bars.
- Normalize the three competing greens (#006045 button green, #256111 outlined
  buttons, brand #2A6130) to brand green + one hover shade, on this screen only.
- Radial bio-age gauge gradient re-tinted to the brand green family.

Out of scope for phase 1: layout changes, other screens (Dashboard, ActionPlan,
BiomarkerDetail get their own passes later), MUI theme-level refactor — though
the long-term fix is promoting `brand.ts` tokens into the shared theme.

### Verification

`npx tsc --noEmit` + `npm run build`, then headless-Chrome before/after
screenshots of the seeded demo account (test@jiva.com) at the heatmap and
recommendations sections; contrast re-checked programmatically for every ramp
sample and status color.
