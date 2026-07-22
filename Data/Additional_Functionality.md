# JIVA: Additional Functionality, Decision List

> Created 2026-07-21. Companion to `Data/Competitor_Survey.md`, which contains the research these candidates are drawn from.
>
> **How to use this document.** Every item has a **Decision** field set to `PENDING`. Walk the list and change each to `YES`, `NO`, or `LATER`. Once the list is settled, the `YES` items become the build backlog and get sequenced into `Data/plan.md`.
>
> **Constraint filter applied.** JIVA can order blood panels through partner labs. It cannot currently sell supplements, offer imaging, prescribe medication, or fulfil physical products. Sections 1 through 6 are all buildable within those constraints. Section 7 lists partner-gated items separately so they are recorded rather than lost, but they cannot be built now.
>
> **Effort scale.** S = 1 to 3 days. M = 1 to 2 weeks. L = 3 to 6 weeks. XL = more than 6 weeks or needs a third party.

---

## Recommendation summary

If you want a shortlist rather than the full walkthrough, these eight are the ones I would argue hardest for, in order:


| #   | Feature                               | Why it leads                                                                                                                    |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Retest loop and cadence               | Every competitor's economics depend on it. JIVA's flow currently ends at one draw.                                              |
| F4  | PhenoAge biological age               | Pure math over 9 values you already collect. Replaces a hardcoded placeholder with the category's signature metric.             |
| F2  | Longitudinal trend tracking           | The payoff that makes the second draw worth buying.                                                                             |
| F3  | JIVA Score, one headline number       | What every competitor markets on. Your Vitality Map is already 80% of the shape.                                                |
| F16 | WhatsApp notifications and scheduling | 98% open rate versus 20 to 30% for email. The highest-impact LatAm-specific gap.                                                |
| F18 | Installments and SINPE Movil          | Likely a bigger conversion lever than any price change in-region.                                                               |
| F9  | AI assistant grounded in your results | Table stakes by 2026. Your engine output is unusually good grounding material.                                                  |
| F12 | Wearable integration via aggregator   | Function does not do this at all. Cheapest available differentiation, roughly 3 weeks via an aggregator versus 6 months direct. |


---

## 1. Retention core

The single largest structural gap. JIVA's onboarding terminates at one lab appointment; every competitor forces a return.

### F1. Retest loop and cadence

**What.** Make a second draw a first-class part of the product: a scheduled retest date, a countdown or "next draw" card on the dashboard, reminders as the date approaches, and a one-tap rebooking flow that reuses the saved lab and address.
**Who does it.** Function bundles a mid-year 60+ marker retest into membership. Marek *requires* retesting every 6 months. Lifeforce and Fountain Life are quarterly. InsideTracker recommends 3 months. Whoop sells tiered packages by draws per year ($199 for 1,$349 for 2, $599 for 4).
**Why for JIVA.** This is the retention engine of the entire category and it needs no new capability, only lab orders you already place. It also converts JIVA from a one-off purchase into recurring revenue.
**Effort.** M. Needs an appointment history model (today's appointment is localStorage only), a retest scheduling flow reusing `ScheduleLabs`, and reminder triggers.
**Depends on.** Nothing. Pairs naturally with F2 and F17.
**Decision:** YES

### F2. Longitudinal trend tracking

**What.** Per-biomarker history charts, per-system trend arrows, and a draw-over-draw comparison view showing what moved and by how much.
**Who does it.** Universal. Function, Superpower, InsideTracker, Everlywell 360, Lifeforce all lead with it.
**Why for JIVA.** This is the payoff that justifies buying a second draw. Without it, F1 has nothing to show for itself. The existing "Compare Biomarkers" view on the Vitality Map is currently hardcoded fake data and is the natural home for this.
**Effort.** M. `TestResult` already links user to biomarker with a value; needs a draw or panel-run identifier and time series queries.
**Depends on.** F1 is what generates the second data point, but the model work can land first.
**Decision:** PENDING

### F3. JIVA Score: one headline number

**What.** A single 0 to 100 composite health score on the dashboard, decomposing into the 10 existing functional-system sub-scores, trended over time.
**Who does it.** Superpower ships 17 scores plus one overall. Everlywell has WellScore. Lifeforce has Lifescore and markets that "80% of members improve it within 12 months." Viome has 70+ hierarchical scores. Blueprint reports 11 organ-system ages.
**Why for JIVA.** The recurring pattern across the whole category is one headline number, 10 to 20 sub-scores, and a trend line. The Vitality Map is already the sub-score layer. Adding the headline number gives users something to improve and gives marketing a claim to make.
**Effort.** M. Scoring methodology is the real work, not the UI. Needs a defensible, documented weighting from reference ranges.
**Depends on.** Best shipped with F2 so the score has a trend.
**Decision:** PENDING

### F4. Biological age via PhenoAge

**What.** Replace the hardcoded Biological Age gauge on the Vitality Map with a real PhenoAge (Levine) calculation, plus an explainer of which markers drove it and a trend across draws.
**Who does it.** Function, Superpower, InsideTracker (InnerAge 2.0, $99 to$249 as a paid add-on), Everlywell 360, Blueprint.
**Why for JIVA.** PhenoAge needs exactly **9 routine blood values** plus age: albumin, creatinine, glucose, CRP, lymphocyte percent, mean cell volume, red cell distribution width, alkaline phosphatase, white blood cell count. It was explicitly designed to prioritize accessibility. This is pure arithmetic over data you already collect, and it replaces a static placeholder with the category's signature metric. Highest value-to-effort ratio on the list.
**Effort.** S to M. Verify all 9 markers are in the Basic Panel first.
**Caution.** Function shifted members' bio-age scores with a 2025 algorithm update and took trust damage. Version the algorithm and disclose changes.
**Decision:** PENDING

### F5. Organ-system aging ages

**What.** Extend F4 to report a separate biological age per functional system rather than one number.
**Who does it.** Blueprint's Speed of Aging reports 11 organ-system ages, though via DNA methylation which JIVA cannot do.
**Why for JIVA.** A blood-derived approximation maps directly onto the existing 10-system Vitality Map and is more differentiated than a single number. The scientific basis is weaker than PhenoAge, so it needs careful framing.
**Effort.** M, on top of F4.
**Decision:** PENDING

### F6. Goal-driven recommendation prioritization

**What.** Let the user pick a primary goal at intake (energy, sleep, heart health, fat loss, strength, cognition, fertility, longevity) and have the action plan reprioritize around it.
**Who does it.** InsideTracker's Action Plan is the mature example: a goal selector driving prioritization across 7,500+ possible actions.
**Why for JIVA.** The intake questionnaire already collects goal-adjacent information and the engine already emits recommendations. This is a prioritization and presentation layer over work already done, and it directly answers the "recommendations felt generic" criticism levelled at Superpower and Function.
**Effort.** M.
**Decision:** PENDING

### F7. Optimal zones instead of standard reference ranges

**What.** Show a personalized optimal target band per biomarker based on age, sex, and stated goal, rather than only the lab's normal range.
**Who does it.** InsideTracker, as a core differentiator.
**Why for JIVA.** "Normal" is a population range, not a healthy target, and this reframing is much of what customers pay these companies for. `Data/Tests/reference_ranges.json` is the foundation.
**Effort.** M to L. The clinical work of defining optimal bands is the hard part and needs JIVA's medical input.
**Caution.** InsideTracker's DNA reference population skews about 85% white. Any cohort or optimal band imported from US or European data will misfire in Latin America. This is both a risk and, if done properly, a real differentiator.
**Decision:** PENDING

---

## 2. Between-draw engagement

Nothing currently brings a user back between appointments.

### F8. Action plan as trackable protocol

**What.** Turn the static Action Plan page into checkable items with streaks, completion state, and progress that persists.
**Who does it.** Function's Protocols, Superpower's updating action plan, Blueprint's gamified habit mastery.
**Why for JIVA.** The engine already emits food, supplement, and exercise recommendations per system. Making them trackable converts a document into a habit loop at modest cost.
**Effort.** M.
**Decision:** PENDING

### F9. AI assistant grounded in the user's own results

**What.** A chat interface answering questions against the user's biomarkers, engine output, and questionnaire, with every claim citing the specific markers behind it and explicit not-a-diagnosis framing.
**Who does it.** Function (Private AI Chat), Superpower (AI Doctor), InsideTracker (Terra), Fountain Life (Zori). Table stakes by 2026.
**Why for JIVA.** Your engine already produces per-system diagnoses, summaries, and recommendations, which is unusually strong grounding material. The known failure mode is genericness: Function was criticized for reports that read as "essentially written by ChatGPT."
**Caution.** 56% of AI users are not confident in chatbot health information (KFF 2024), but a carefully designed lab-interpretation model scored 90% positive with study participants. Citation and scoping are what separate the two outcomes. Also a regulated-advice risk area worth a legal read in Costa Rica.
**Effort.** L.
**Decision:** PENDING

### F10. Results-ready and re-test notifications

**What.** Transactional messaging for results ready, appointment reminders at 24 hours and 2 hours, fasting instructions the night before, and retest nudges.
**Who does it.** All of them. InsideTracker sends daily and weekly accountability nudges by app, text, or email.
**Why for JIVA.** Documented no-show reduction, and it is the delivery mechanism that makes F1 work. **In LatAm this should be WhatsApp-first, see F16.**
**Effort.** S to M for the trigger infrastructure, plus the channel work in F16.
**Decision:** PENDING

### F11. Personalized food list with per-food reasoning

**What.** A tiered food list (Superfoods / Enjoy / Minimize / Avoid) with an explanation of why each food helps or harms based on the user's specific markers.
**Who does it.** Viome, with 370 to 400+ foods across four tiers. InsideTracker's Food Basket recipes are curated by registered dietitians.
**Why for JIVA.** Purely advisory, so it needs no fulfilment, and the engine already emits food recommendations. This is largely a presentation and content-depth upgrade on existing output. Optionally extendable to AI meal plans and shopping lists, which Viome does.
**Effort.** M for the tiering and UI, L if the per-food reasoning content has to be authored from scratch.
**Decision:** PENDING

### F12. Wearable integration via an aggregator API

**What.** Connect Apple Health, Google Health Connect, Oura, Whoop, Garmin, and Fitbit through an aggregator (Terra API, Open Wearables, Vora) rather than building each integration directly. Surface sleep, HRV, steps, and resting heart rate alongside blood results.
**Who does it.** InsideTracker (the deepest: Oura, Apple Watch, Garmin, Fitbit, Whoop, Strava), Superpower (Apple Health, Whoop, Oura), Lifeforce, Viome (HealthKit only). **Function does not integrate wearables at all.**
**Why for JIVA.** This is the clearest unclaimed differentiation against the two largest competitors, and it is the only mechanism in the category that produces genuine daily engagement. Neko began surfacing Apple Health data inside the clinical consultation in June 2026, which is a pattern worth copying for results review.
**Effort.** L via an aggregator (roughly 3 weeks of integration work). Direct integrations are 4 to 8 weeks *per device* and should be avoided.
**Decision:** PENDING

### F13. Daily tips from wearable data

**What.** Daily and post-activity recommendations derived from wearable signals combined with blood results.
**Who does it.** InsideTracker ProTips, the only true daily-return mechanism in the competitive set. Blueprint's Don't Die Score is the social variant.
**Why for JIVA.** Blood draws are episodic; wearables are continuous. This is what turns a twice-a-year product into a daily one.
**Effort.** M, on top of F12.
**Depends on.** F12.
**Decision:** PENDING

### F14. Education and content library

**What.** A biomarker and health content library, medically reviewed, in Spanish.
**Who does it.** Hone's "The Edge" is a major top-of-funnel and SEO engine. Function publishes a biomarker category library. InsideTracker's InsideGuide links a study to nearly every recommendation.
**Why for JIVA.** This is an acquisition channel as much as a retention feature, and there is very little quality Spanish-language longevity content in the market. Slow to compound, so starting early matters.
**Effort.** M for the platform, ongoing for content.
**Decision:** PENDING

### F15. Live results webinars

**What.** Group sessions where a clinician explains what results mean, as a cheap substitute for one-to-one time.
**Who does it.** Everlywell.
**Why for JIVA.** Delivers much of the perceived value of clinician access at a fraction of the cost, and group formats suit the region.
**Effort.** S technically. The real cost is clinician time and scheduling.
**Decision:** PENDING

---

## 3. Latin America specific

No US competitor has built any of this. This is the most defensible section of the list.

### F16. WhatsApp as a first-class channel

**What.** WhatsApp Business API for appointment booking and confirmation, 24-hour and 2-hour reminders, fasting instructions, results-ready alerts, retest nudges, and optionally the AI assistant from F9.
**Why for JIVA.** WhatsApp has roughly 96% smartphone penetration in Latin America and is the default healthcare communication channel. **98% message open rate versus 20 to 30% for email.** Practitioners across Argentina, Guatemala, and Mexico already treat it as essential to doctor-patient communication. Documented no-show reduction. Email-first notification, which is the US default, will materially underperform here. Even Superpower chose SMS over app push for clinical support in the US.
**Effort.** M to L. WhatsApp Business API requires business verification and approved message templates, so start the account process early.
**Decision:** PENDING

### F17. Retest reminders over WhatsApp

**What.** The specific F1 retest nudge sequence delivered over WhatsApp with one-tap rebooking.
**Why for JIVA.** F1 is the retention engine and F16 is the channel with a 98% open rate. Combining them is where the compounding is.
**Effort.** S, given F1 and F16.
**Depends on.** F1, F16.
**Decision:** PENDING

### F18. Installments and local payment rails

**What.** Cuotas (3, 6, 12 months) at checkout, SINPE Movil, and local card acquiring via a regional gateway such as Kushki or a local bank.
**Why for JIVA.** SINPE Movil has 2.5M+ users with over 80% of Costa Ricans aged 15+ active as of 2025 and 65M+ transactions monthly, up 200% since 2020. Installments are heavily used across LatAm. **For a several-hundred-dollar panel, offering cuotas is likely a larger conversion lever than any pricing change.** Cash remains strong outside San Jose, which may argue for a pay-at-lab option too.
**Effort.** L. Payment integration plus a regional PSP relationship.
**Decision:** PENDING

### F19. Native LatAm Spanish localization

**What.** Full i18n with neutral LatAm Spanish (es-CR primary) as the **source** locale rather than a translation of English, including localized units (mg/dL versus mmol/L), date formats, and reference ranges.
**Why for JIVA.** Of Spanish-language medical apps studied, 58.8% were originally developed in Spanish; the 41.2% that were English translations are the ones that read as foreign. Spanish is not one market: US Hispanic, Latin American, and Iberian Spanish differ in regulatory framework, healthcare financing, and patient behavior. Medical vocabulary in particular must be accurate and consistent across every string.
**Why now.** The current codebase already centralizes copy in per-page `labels.ts` files, which is most of the hard work of i18n already done. **The longer this waits, the more strings accumulate.**
**Effort.** M for the framework given the existing labels structure, plus translation cost.
**Decision:** PENDING

### F20. PRODHAB and Law 8968 compliance

**What.** Informed express consent capture in the intake questionnaire, documented security measures, a privacy policy meeting Costa Rican requirements, and likely registration of the database with PRODHAB.
**Why for JIVA.** Costa Rica's Personal Data Protection Law No. 8968 treats health data as sensitive and requires registration for entities that distribute, commercialize, or publicly share personal data. This is a pre-launch legal requirement, not a feature.
**Effort.** S to M in code (consent capture, audit trail, export and delete). The legal work sits outside engineering.
**Decision:** PENDING

### F21. Family and gift bundles

**What.** Multi-person plans and giftable panels, in place of the US HSA/FSA construct every competitor leans on.
**Who does it.** Superpower sells gift memberships from $199 and community memberships. Family plans are absent across the field, including at Function.
**Why for JIVA.** HSA/FSA is US-only and irrelevant here, so its equivalent conversion lever has to be built differently. Family purchasing dynamics are strong in the region and this is genuinely underbuilt everywhere.
**Effort.** M.
**Decision:** PENDING

### F22. Blue Zone brand positioning

**What.** Product and content positioning around the Nicoya Peninsula, one of only five global Blue Zones.
**Why for JIVA.** A longevity company headquartered in Costa Rica has a claim here that no US competitor can credibly make. Also relevant to the medical tourism segment: over 40,000 Americans travel to Costa Rica for treatment annually, and Hospital Metropolitano's satellite labs in Quepos, Liberia, and Huacas sit directly in the expat and tourist corridors.
**Effort.** S in product. Mostly a brand and content decision.
**Decision:** PENDING

---

## 4. Data and trust

### F23. Past records upload and vault

**What.** Let users upload historical lab PDFs and prior results into a vault that feeds the dashboard, trends, and the AI assistant.
**Who does it.** Function's Upload Health Records (shipped November 2025 after a long-standing gap), Superpower's EHR aggregation, InsideTracker's blood results upload ($119 as a paid product), Whoop's past-bloodwork upload.
**Why for JIVA.** Especially valuable in Costa Rica, where users hold years of paper results from CAJA and private hospitals. It also solves the cold-start problem: a new user can have a trend line before their second draw.
**Effort.** L. PDF extraction is the hard part; manual entry is a viable v1.
**Decision:** PENDING

### F24. Data export and sharing

**What.** Download results as a clean PDF and share with an outside doctor.
**Who does it.** Function (share with anyone), Superpower (download and delete), universal.
**Why for JIVA.** Users overwhelmingly want to take results to their own physician, and reviewers cite this as a key benefit. Also part of F20 compliance.
**Effort.** S to M.
**Decision:** PENDING

### F25. Clinician-reviewed results

**What.** A clinician reviews results and adds context before the user sees them, or attaches a note to the release.
**Who does it.** Function (included in both annual rounds), Everlywell (independent board-certified physician per state), Whoop Advanced Labs (a deliberate positioning choice).
**Why for JIVA.** Substantially raises trust, and in some jurisdictions physician involvement in result interpretation is a regulatory expectation rather than a nicety. Worth checking the Costa Rican position before deciding.
**Effort.** M in software (review queue, notes, release gating). The clinician relationship is the real dependency, which is why this sits at the edge of the constraint filter.
**Decision:** PENDING

### F26. Async messaging with a care team

**What.** Text-based support rather than scheduled video visits.
**Who does it.** Superpower (SMS, about 1 business day response), Hone (unlimited messaging on Premium), Marek.
**Why for JIVA.** Low-friction async messaging is beating scheduled appointments across the category, and it pairs naturally with F16. Needs staffing, but not necessarily licensed clinicians if scoped to navigation and support rather than medical advice.
**Effort.** M in software. Ongoing staffing cost.
**Decision:** PENDING

---

## 5. Growth

### F27. Referral program

**What.** Credit for the referrer and a discount for the referred user.
**Who does it.** Function pays $25 to the referrer after the referred member stays 60 days, plus$25 off the first year. Otherwise underexploited across the category.
**Why for JIVA.** Cheap, and it suits a market where WhatsApp sharing is the dominant social behavior.
**Effort.** M.
**Decision:** PENDING

### F28. Free tier with a social score

**What.** A free, wearable-only daily score with leaderboards among friends and family, local groups, and gamified progression. No labs required.
**Who does it.** Blueprint's Don't Die app, free on iOS and Android, with a wearable-derived daily score, a leaderboard including Bryan Johnson himself, and local community groups. Hone runs a $25/month tracking-only tier as a funnel into treatment tiers.
**Why for JIVA.** Zero marginal cost per user and no labs needed, which makes it a pure acquisition engine. Community and social are the most underbuilt areas in the entire competitive set, and they map unusually well onto a 96%-WhatsApp market with strong family dynamics. **Potentially the highest-leverage growth item on this list, and also the largest scope.**
**Effort.** XL.
**Depends on.** F12.
**Decision:** PENDING

### F29. Corporate and group memberships

**What.** Employer-paid panels for teams, with an admin dashboard and aggregate anonymized reporting.
**Who does it.** Superpower for Communities sells group memberships with two panels per year, a baseline and a six-month recheck. Everlywell's EverlyCare sells diagnostics-led virtual care to employers.
**Why for JIVA.** With no HSA/FSA in the region, employer-paid wellness is the natural substitute route to volume. Salud Digna in Mexico is precedent that volume-priced preventive testing works at LatAm price points.
**Effort.** L.
**Decision:** PENDING

### F30. Practitioner and clinic dashboard

**What.** Let coaches, clinics, and physicians order panels for clients and view interpreted results.
**Who does it.** InsideTracker Pro, and InsideTracker separately white-labels its Terra AI platform to wellness brands.
**Why for JIVA.** The existing Costa Rican longevity clinics, Rejuvilife and the Anti-Aging and Wellness Clinic, are **clinic-first and software-poor**. They are partnership targets rather than competitors, and this is the product that serves them. It is also a route to B2B revenue without JIVA needing its own clinicians.
**Effort.** L.
**Decision:** PENDING

### F31. Add-on test catalog

**What.** Sell additional panels on demand beyond the chosen package.
**Who does it.** Function ($50 to$950 add-ons), Superpower ($199 retests plus gut, toxins, CGM), Lifeforce (about$200 per add-on panel).
**Why for JIVA.** Pure upside within the existing lab relationship, using the package infrastructure that already exists. Limited to whatever the partner labs can actually run.
**Effort.** M.
**Decision:** PENDING

### F32. Tiered membership pricing

**What.** Restructure from one-off panel purchases to annual memberships with tiers differentiated by draws per year.
**Who does it.** The whole category. Whoop's structure is the cleanest expression: $199 for 1 draw,$349 for 2, $599 for 4. Prenuvo tiers by adding a data domain per step rather than just more tests.
**Why for JIVA.** Converts to recurring revenue and makes the retest loop the default rather than an upsell. Note the price context: US software-led memberships have collapsed to$199 to $365, and Costa Rican private care runs 50 to 70% below US prices, so JIVA's ceiling is lower still.
**Effort.** L. Touches payment, packages, and the entire onboarding flow.
**Depends on.** F1, and probably F18.
**Decision:** PENDING

---

## 6. Smaller items worth a quick yes or no

### F33. Demo and onboarding polish

**What.** Keep and extend the demo skip mechanism, add progress indication across onboarding steps.
**Why.** Hone's onboarding is widely cited as best in class among its peers and it is a real conversion asset. JIVA already has `src/onboarding/steps.ts` as the single source of flow order.
**Effort.** S.
**Decision:** PENDING

### F34. Appointment persistence in the backend

**What.** Move the lab appointment out of localStorage and into a real model with history.
**Why.** Currently `jiva_lab_appointment` is browser-only, so it is lost on device change and cannot support F1 or F2. This is a prerequisite masquerading as a feature.
**Effort.** S.
**Decision:** PENDING

### F35. Fasting and prep instructions in-flow

**What.** Explicit prep guidance at booking and again the night before.
**Why.** Superpower tells users to fast 10 hours. Failed or invalid draws are pure cost, and Hone reports about 15% invalid finger-prick samples as an object lesson in what poor prep guidance costs.
**Effort.** S.
**Decision:** PENDING

### F36. Benchmarking against peers

**What.** Show how a user's markers compare to others of the same age and sex.
**Who does it.** InsideTracker's InnerAge benchmarks against other users.
**Why for JIVA.** Engaging, and a **LatAm-specific reference cohort would be a genuine scientific differentiator** given that InsideTracker's own reference population skews about 85% white. Requires user volume before it means anything.
**Effort.** M, but gated on having a user base.
**Decision:** PENDING

---

## 7. Partner-gated, recorded but not buildable now

Listed so they are not lost. Each needs a capability JIVA does not currently have. **Decisions here should be `LATER` or `NO`, not `YES`.**


| #   | Feature                        | Blocker                                                                                                              | Who does it                                                                                                                                                                  |
| --- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1  | Supplement sales               | Formulation and fulfilment                                                                                           | Viome (about $49 to$79/month, their main revenue), Superpower marketplace, Lifeforce                                                                                         |
| P2  | Prescriptions, hormones, GLP-1 | Licensed prescribers and pharmacy                                                                                    | Hone, Lifeforce, Superpower, Everlywell Weight Care+                                                                                                                         |
| P3  | Imaging and MRI                | Imaging partner or acquisition                                                                                       | Function via Ezra ($499 member price), Prenuvo, Fountain Life. **Note: none of Viome, Everlywell, Lifeforce, or Hone offer imaging, so this is not a broad competitive gap** |
| P4  | Telehealth video consults      | Clinician network, licensed per jurisdiction                                                                         | Lifeforce (45 min quarterly), Hone, Everlywell, Fountain Life                                                                                                                |
| P5  | At-home phlebotomy             | Mobile draw network. **Laboratorio San Jose already offers this in Costa Rica, so this may be closer than it looks** | Lifeforce, Function via GetLabs, Superpower ($119)                                                                                                                           |
| P6  | DNA and genetic testing        | Sequencing lab. A cheaper path is free upload of existing 23andMe or Ancestry raw data, which InsideTracker does     | InsideTracker, Genetria in LatAm                                                                                                                                             |
| P7  | Gut microbiome testing         | Specialist lab                                                                                                       | Viome, Superpower add-on, Function "coming soon"                                                                                                                             |
| P8  | Epigenetic aging clocks        | Methylation assay, weeks of turnaround                                                                               | Blueprint Speed of Aging, TruDiagnostic                                                                                                                                      |
| P9  | CGM and glucose monitoring     | Device supply and prescription                                                                                       | Superpower add-on                                                                                                                                                            |
| P10 | Cancer screening (Galleri)     | GRAIL relationship, about $749 to$949                                                                                | Function, Superpower                                                                                                                                                         |
| P11 | 1:1 health coaching            | Coaching staff                                                                                                       | Lifeforce (unlimited), Marek (priced as a separate SKU on top of panels)                                                                                                     |


---

## 8. Suggested sequencing, if the shortlist is approved

Not a commitment, just the dependency-aware order. Revisit once decisions are made.

**Phase 1, foundations.** F34 (appointment persistence) and F4 (PhenoAge) first, since F34 unblocks the retention work and F4 is the highest value-to-effort item standing alone. F20 consent capture belongs here too, because retrofitting consent is painful.

**Phase 2, the retention loop.** F1, F2, F3 together. These three are one feature wearing three hats: the second draw, the trend that justifies it, and the number that summarizes it.

**Phase 3, the region.** F19 (localization) and F16 (WhatsApp), then F18 (payments). F19 should arguably move earlier, because every week of new UI adds strings to translate later.

**Phase 4, engagement.** F12 (wearables via aggregator) and F9 (AI assistant). Both are large, both are what the category currently competes on.

**Phase 5, growth.** F27, F31, F32, and a decision on F28.