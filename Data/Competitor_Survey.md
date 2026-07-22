# JIVA Competitor Survey

> Compiled 2026-07-21. Companion document: `Data/Additional_Functionality.md`, which turns these findings into a yes/no decision list.
>
> **Scope note.** JIVA can order blood panels through partner labs. JIVA currently cannot sell supplements, offer MRI or other imaging, prescribe medication, or fulfil any physical product. Every feature below is therefore tagged as **software-only** (buildable now) or **partner-gated** (needs a capability JIVA does not yet have). Prices are USD and reflect the US market unless stated.

---

## 1. Executive summary

### 1.1 The category has split in two

| Tier | Price band | Who | What you get |
| --- | --- | --- | --- |
| Software-led lab membership | $149 to $499/year | Function $365, Superpower $199, InsideTracker $149 + per-test, Everlywell 360 $399 | Labs plus a dashboard. Little or no human time. |
| Service-led clinic | $2,995 to $21,500/year | Fountain Life, Lifeforce, Marek | Labs plus physicians, coaches, prescriptions, imaging. |

There is effectively **no viable middle** for a software-only product priced above roughly $500/year in the US. Function cut its membership from $499 to $365 in November 2025; Superpower launched nationwide at $199 in August 2025. The direction of travel is down.

This matters more in Costa Rica, where private care runs 50 to 70% below US prices and a private specialist consult is $60 to $120. JIVA's absolute price ceiling is lower than the US comparables, which makes **installment payments and a free acquisition tier more important levers than headline pricing**.

### 1.2 The three findings that should shape JIVA's roadmap

**a) The retest loop is the business model, not a feature.** Every serious player structurally forces a return visit: Function bundles a mid-year 60+ biomarker retest into membership, Lifeforce runs quarterly draws plus consults, Marek *requires* retesting at least every 6 months, Fountain Life CORE is quarterly, Superpower sells $199 retests and offers a 6-month recheck to communities. JIVA already orders blood labs, so this is available today and requires no new capability. JIVA's current flow ends at a single appointment, which is the single biggest structural gap versus the field.

**b) Between-draw engagement is entirely software, and JIVA has the raw material.** The two mechanics that keep users opening the app are (i) an AI assistant grounded in the user's own results, and (ii) wearable-derived daily signals. Function shipped Private AI Chat and Protocols in November 2025 alongside a $298M Series B at a $2.5B valuation. Superpower ships an "AI Doctor." InsideTracker shipped Terra in 2026, closing its chatbot gap. InsideTracker's daily wearable ProTips are the only true *daily* return mechanism in the set. JIVA's engine already produces diagnoses plus food, supplement, and exercise recommendations per system, which is exactly the substrate an assistant needs.

**c) Panel breadth is not the only axis, and JIVA should not assume it is losing.** Function and Superpower both market 100+ biomarkers. InsideTracker deliberately tests only about 48 to 54 and competes on DNA plus wearable fusion. Notably, **Function does not integrate with Oura, Fitbit, or Apple Health at all**, and Superpower does not advertise wearable sync on its membership page. Wearable integration is a live, unclaimed differentiation opportunity at the top of this market.

### 1.3 What JIVA can do that no US competitor has built

None of the US players have built for LatAm. The specific unclaimed ground is WhatsApp-native scheduling and results delivery, installments and SINPE Movil at checkout, native LatAm Spanish rather than translated English, family and gift bundles in place of the US-only HSA/FSA construct, and the Nicoya Blue Zone as a brand asset no US company can credibly claim. Details in section 4.

---

## 2. Direct comparables

### 2.1 Function Health

The breadth and brand leader. Raised roughly $298M Series B at a $2.5B valuation, November 2025.

**Model and pricing.** Membership billed annually. Official price $365/year, framed as "$1/day," cut from a $499 launch price. Some 2026 trackers still report $499 for renewals, and the company took reputational damage when existing members were held at $499 while new members got $365. HSA/FSA eligible, no insurance. Referral program pays $25 credit to the referrer after the referred member stays 60 days, plus $25 off the new member's first year. No family plan.

**Test scope.** 160+ lab tests per year: 100+ biomarkers at the initial draw, then a **60+ biomarker retest mid-year** to track change. Roughly 18 categories including heart (ApoB, Lp(a)), metabolic, thyroid, sex hormones and fertility, nutrients, liver, kidney, inflammation, autoimmunity, heavy metals, mold reactivity, Alzheimer's and brain health. Add-ons run roughly $50 to $950: Galleri multi-cancer detection (about $749 to $949), MTHFR and ApoE genotyping, omega and extended panels. Draws at 2,000+ Quest locations, with GetLabs at-home concierge draws in select areas.

**Imaging.** Acquired Ezra in May 2025 and now sells a 22-minute full-body MRI at $499 to members, down from Ezra's $1,495, at about 100 US locations with plans for 1,000+.

**Features.**

| Feature | Type |
| --- | --- |
| Results dashboard, web plus iOS and Android, per-biomarker detail pages | Software-only |
| Trend tracking across testing rounds | Software-only |
| Biological age score, tracked over time | Software-only |
| Personalized action protocols, food and supplement guides | Software-only |
| **Medical Intelligence Lab**: Private AI Chat over your own data, Protocols (data to step-by-step actions), Upload Health Records vault | Software-only |
| App inside ChatGPT for sharing lab summaries | Software-only |
| Data export and sharing with anyone | Software-only |
| Referral program | Software-only |
| Clinician review of every result set, included in both annual rounds | Partner-gated (clinician network) |
| Blood draws | Partner-gated (Quest, GetLabs) |
| Full-body MRI | Partner-gated (owns Ezra) |

**Not offered:** prescriptions, supplement sales, telehealth visits, **wearable integrations**, family plans.

**Reviewer sentiment.** Praised for a clean dashboard and for surfacing markers normally gatekept by doctors. Criticized because AI-written clinician reports "feel essentially written by ChatGPT," with reviewers questioning actionability. **Lesson for JIVA: generic AI output is a known failure mode in this category. Grounding output in the user's specific values and citing the biomarkers behind each claim is what separates the good implementations from the criticized ones.**

### 2.2 Superpower

The low-price disruptor. $30M Series A April 2025, 150,000+ waitlist.

**Model and pricing.** $199/year, marketed as $17/month billed annually, $399 in New York and New Jersey. Cancel anytime, no refunds, HSA/FSA eligible, no insurance. Positioned explicitly as democratized concierge care versus $10k to $100k concierge clinics. Available in 41 US states, and the gap is instructive: the missing states are a *licensing* constraint from offering prescriptions and a care team, not a software constraint. Gift memberships from $199. No family plan.

**Test scope.** 100+ biomarkers per annual panel, one comprehensive draw per year included, additional full panels $199 each on demand. Add-ons: gut microbiome, environmental toxins, heavy metals, CGM, Galleri. Draws at 2,000 to 3,000+ Quest locations or at-home for $119. Results in about 8 to 10 days.

**Features.**

| Feature | Type |
| --- | --- |
| **Digital Twin**: a visual body model built from biomarker data instead of a raw report | Software-only |
| **17 health scores plus one overall Superpower Health Score** | Software-only |
| Biological age plus a "Pace of Aging" test | Software-only |
| Personalized action plan across diet, lifestyle, supplements, Rx; downloadable PDF; updates as health changes | Software-only |
| **AI Doctor**: 24/7 chat trained on your results, holds users accountable to their history | Software-only |
| Medical records aggregation: connect EHRs, upload past labs | Software-only |
| Wearable sync: Apple Health, Whoop, Oura | Software-only |
| Data download and delete | Software-only |
| 24/7 human care team reachable **by SMS**, about 1 business day response | Partner-gated (clinicians) |
| Supplement marketplace, 20% member discount, price match | Partner-gated (fulfilment) |
| Prescriptions via care team | Partner-gated (licensed clinicians per state) |

**Reviewer sentiment.** Praised for an easy-to-understand visual picture and for contextual AI reads, one reviewer citing the AI correctly tracing high folate to fortified foods. Criticized by already-optimized users for recommendations that felt simplistic ("Zone 2 cardio, Mediterranean diet, magnesium").

**Most transferable idea:** the Digital Twin plus 17-score structure. One headline number, plus 10 to 20 domain sub-scores, plus a trend line. JIVA's existing 10-system Vitality Map is already 80% of this shape.

### 2.3 InsideTracker

The science and wearable niche. The most relevant competitor for JIVA precisely because it relies least on physical partnerships.

**Model and pricing.** Hybrid: pay-per-test plus an optional $149/year membership that discounts tests. Ultimate blood plan about $699 standalone or $340 for members. Blood results upload $119, DNA kit $249, DNA upload $29, InnerAge 2.0 $179 standalone or $99 with Ultimate, mobile draw +$99. Bundles up to about $2,681 for four Ultimates plus four InnerAge. HSA/FSA via Truemed. Also runs **InsideTracker Pro**, a coach dashboard for practitioners to order and interpret client tests, and sells **Terra**, a white-label AI platform, to wellness brands.

**Test scope.** Ultimate panel is only about 48 to 54 biomarkers across roughly 10 healthspan categories, deliberately far fewer than Function or Superpower. Differentiation is the **fusion of blood, DNA, and wearable data**, not raw breadth. DNA via its own kit or free upload of 23andMe and Ancestry raw data. Recommends retesting **every 3 months**, which reviewers note approaches $3,000/year at full price.

**Features.**

| Feature | Type |
| --- | --- |
| **InnerAge 2.0**: biological age from 14 biomarkers (women) or 18 (men), benchmarked against other users | Software-only |
| **Action Plan**: goal-based engine drawing on 7,500+ possible actions, every recommendation linked to a backing study | Software-only |
| **Optimal zones** personalized by goal or athlete type rather than standard reference ranges | Software-only |
| Food Basket recipes curated by registered dietitians | Software-only |
| **Wearables: Oura, Apple Watch, Garmin, Fitbit, Whoop, Strava** (one at a time) | Software-only |
| **ProTips**: daily and post-activity recommendations from wearable data | Software-only |
| Terra conversational AI health guide, 2026 | Software-only |
| Accountability nudges by app, text, or email | Software-only |
| External bloodwork and DNA upload | Software-only |
| Coach dashboard for practitioners | Software-only |
| Blood draws, DNA sequencing | Partner-gated (Quest, mobile phlebotomy, sequencing lab) |

**Not offered:** prescriptions, supplement sales, consumer telehealth, imaging.

**Reviewer sentiment.** Praised as heavily science-backed with study links on nearly every claim, and for combining DNA with blood. Criticized as expensive at the recommended cadence, and its DNA reference population skews about 85% white, which limits accuracy for other groups. **That last point is directly relevant to JIVA: reference ranges and any benchmarking cohort built on US or European populations will misfire in Latin America.**

---

## 3. Adjacent and secondary players

### 3.1 Viome

At-home kits only, no lab visits. Gut Intelligence $249, Health Intelligence $299, Full Body Intelligence $399 to $499, CancerDetect $599. Uses metatranscriptomics rather than standard blood chemistry.

The real business is the **supplement subscription**: about $49/month for Gut customers, $79/month for Full Body, including free annual retesting. Software features worth noting: **70+ hierarchical health scores** (Integrative, Functional, Pathway levels), and a **370 to 400+ food list sorted into Superfoods / Enjoy / Minimize / Avoid with a per-food explanation of why it helps or harms your specific biology**. Also an AI meal-plan and shopping-list generator. Apple HealthKit sync. No telehealth, no clinicians.

**Transferable:** the four-tier personalized food list with per-food reasoning is a strong, purely advisory pattern that needs no fulfilment. JIVA's engine already emits food recommendations; this is a presentation upgrade rather than new science.

### 3.2 Everlywell

Hybrid a la carte kits ($49 to $299) plus two subscriptions: **Everlywell+** at $39/month on a bankable credit system (1 credit/month, tests cost 1 to 4 credits, all telehealth visits 1 credit), and **Everlywell 360** at $399/year for one 83-biomarker annual test. Weight Care+ GLP-1 program at $99 to $139/month.

Software features: results dashboard with a proprietary **WellScore** and biological age across six categories, clinician-reviewed **Care Plan** explaining out-of-range markers, collection tips and reminders per test, and **live webinars led by a healthcare professional to explain results**. Notable operational feature: **Spotwell**, camera-based blood-spot verification that validates a sample before the user mails it, reducing invalid samples.

**Transferable:** the credit system is a clever retention device (a monthly credit that banks but nags to be used). The webinar format is a very cheap substitute for one-to-one clinician time. Spotwell is only relevant if JIVA ever does at-home kits.

### 3.3 Lifeforce

Subscription longevity clinic. About $149/month plus a $349 onboarding fee, roughly $3,500/year all-in with therapies. One-time non-member diagnostic about $599. Add-on panels about $200 each. Co-founded by Tony Robbins and Peter Diamandis.

50+ biomarkers via **at-home phlebotomist draw**, **quarterly**. Proprietary **Lifescore** single-metric summary plus quality-of-life, early-mortality-risk, and biological-aging-rate assessments. 45-minute clinician consult every 3 months. Dedicated unlimited 1:1 health coach. Claims wearable sync with Oura, Apple Watch, Garmin. Markets that "80% of members improve their Lifescore within 12 months."

**Transferable:** almost nothing operationally, this is the most partnership-heavy model in the set. But the **"80% improve their score in 12 months"** marketing claim is exactly what a retest loop plus a headline score buys you, and it is a purely software-derived asset.

### 3.4 Hone Health

Telehealth clinic focused on hormones and TRT, restructured into tiers in 2025: Basic $25/month (tracking only, kits every 6 months, no prescription), Plus about $129/month, Premium about $149 to $155/month (full TRT, consults included, testing every 3 months, unlimited care-team messaging). Medications billed separately, testosterone injections from $28/month.

40 to 50+ biomarkers across 8 categories. Finger-prick at-home kit or venous draw at 2,000+ Quest/LabCorp locations, though about **15% of users report insufficient-blood invalid finger-prick samples**. Widely praised as the best digital onboarding among TRT clinics. Runs **"The Edge,"** a large medically-reviewed content operation that is a major top-of-funnel and SEO engine. No wearables, no AI features surfaced.

**Transferable:** two things. The **$25 tracking-only tier as a funnel into treatment tiers** is a proven low-price entry pattern. "The Edge" demonstrates that a content library is an acquisition channel, not just a retention feature.

### 3.5 Marek Health

Guided Optimization from $299, panels sold separately at $495 / $895 / $1,950. All-in typical spend $1,000 to $3,000 low end, $3,500 to $7,000+ for heavy protocol users. 50 to 100+ biomarkers, and clients are **required to retest at least every 6 months**. Coaching is priced as a separate SKU layered on the panel, not bundled.

**Software is thin.** No documented dashboard of note, no biological age engine, no wearable integration. Differentiation is human expertise plus prescribing rights.

**This is the clearest strategic gap in the market: Marek-grade panel depth with Function-grade software.** It is also the shape of the existing Costa Rican longevity clinics (section 4.5).

### 3.6 Blueprint (Bryan Johnson)

Three businesses, only one of which JIVA can copy.

- **Supplements and food**: Blueprint Stack about $361/month. Not available to JIVA.
- **Testing**: Advanced Panel of **108 biomarkers across blood and urine**, subscription includes 2 panels/year. Separately, a **"Speed of Aging"** DNA methylation test reporting biological age for **11 organ systems**. The methylation assay is not feasible for JIVA near term, but **organ-system-level aging scores derived from standard blood chemistry are**, and they map directly onto JIVA's existing Vitality Map.
- **The "Don't Die" app**: free on iOS and Android. A daily **Don't Die Score** auto-calculated from connected wearables, a **social leaderboard** where you compare against friends, family, and Johnson himself, gamified "leveling up," local community groups and events, and curated content.

**The free social score layer is arguably the highest-leverage borrowable feature in the entire competitive set for JIVA specifically**: zero marginal cost per user, no labs required, and it lands in a market with 96% WhatsApp penetration and strong social and family dynamics.

### 3.7 Imaging-first players (context only)

JIVA cannot do imaging, and notably **none of Viome, Everlywell, Lifeforce, or Hone lead with it either**, so its absence is not a competitive gap against most of the field. Function is the exception via Ezra.

- **Neko Health.** Founded by Spotify's Daniel Ek. A one-hour sensor-based body scan at GBP 299. Raised $260M in January 2025 and a $700M Series C in July 2026 at roughly $7B, opening its first US clinic in New York. **Borrowable:** in June 2026 Neko began **pulling Apple Health data so steps, sleep, and HRV appear in the consultation room alongside results**. That "wearable data surfaces inside the clinical conversation" pattern applies directly to JIVA's results review. Neko is also consistently praised for report design and a same-day in-person results walkthrough.
- **Prenuvo.** Whole-body MRI $1,199 to $3,999. Its tiering is instructive: each step up adds a **data domain** rather than just more tests. Core $1,199 (focused scan plus lab panel), Comprehensive $2,499, Executive about $5,000 (adds brain health, body composition, expanded labs). Prenuvo attached an 80+ biomarker blood panel to an imaging product, which is the mirror image of JIVA's position.
- **Fountain Life.** CORE $2,995/year, APEX $19,500, full subscription $21,500. **CORE is essentially a JIVA-shaped product built by a clinic company**: quarterly blood panels across cardiovascular, metabolic, hormonal, inflammatory and nutritional markers, a televisit with a longevity physician, and real-time access to **"Zori AI."** Quarterly cadence plus televisit plus AI assistant is a package JIVA could ship with zero imaging.

### 3.8 Whoop Advanced Labs (September 2025)

Worth calling out separately because it is the clearest signal of where the category is heading. Whoop launched blood testing with Quest: a 65-biomarker panel, in-app purchase and scheduling, **clinician-reviewed results**, past-bloodwork upload, and **results auto-synced with wearable data**. Pricing: 1 test $199, 2/year $349, 4/year $599. The waitlist was **350,000+ people**.

A wearable company moving into blood is the exact inverse of JIVA's opportunity to move from blood into wearables, and the tiered "how many draws per year" pricing model is the cleanest expression of the retest loop in the market.

---

## 4. Cross-cutting feature analysis

### 4.1 Biological age: three algorithm families

| Family | Inputs | Used by | Feasible for JIVA |
| --- | --- | --- | --- |
| **PhenoAge (Levine)** | **9 routine blood values** plus chronological age: albumin, creatinine, glucose, CRP, lymphocyte percent, mean cell volume, red cell distribution width, alkaline phosphatase, white blood cell count | Offered free by Thrivous, AgelessRx, Longevity Advantage. Explicitly designed to prioritize accessibility over precision | **Yes, immediately.** Pure arithmetic over values JIVA already collects |
| **Klemera-Doubal (KDM)** | 17 biomarkers for men, 13 for women, benchmarked against a peer cohort | InsideTracker InnerAge 2.0 ($99 to $249) | Yes, but needs a peer cohort. A LatAm cohort would be a genuine differentiator; a US cohort would misfire |
| **Epigenetic clocks** (DunedinPACE, TruAge, Blueprint Speed of Aging) | DNA methylation assay | Blueprint, TruDiagnostic | **No.** Needs a specialty lab, separate assay, weeks of turnaround |

JIVA's Vitality Map already has a Biological Age card, currently hardcoded to a static gauge. PhenoAge would make it real at essentially zero marginal cost, and it is the category's signature metric.

One caution: Function updated its bio-age calculation in 2025 and produced small shifts in members' scores. **Version the algorithm publicly and explain changes, or trust erodes.**

### 4.2 AI assistants: now table stakes, with a known failure mode

Function (Private AI Chat), Superpower (AI Doctor), InsideTracker (Terra), Fountain Life (Zori) all shipped by 2026. But **56% of people who use AI are not confident chatbot health information is accurate** (KFF, 2024), while a study of 70 participants showed 90% positive ratings for a carefully designed lab-interpretation model.

The design implications are concrete: **cite the specific biomarkers behind every claim, frame explicitly as not-a-diagnosis, and ground answers in the user's own values.** Function was criticized precisely for output that read as generic. JIVA's engine output (per-system diagnoses, summaries, and food/exercise/supplement recommendations) is unusually good grounding material for this.

### 4.3 Wearables: a live gap at the top of the market

Standard target set is Apple Health, Google Health Connect, Garmin, Fitbit, Oura, Whoop, plus CGMs.

**Cost reality:** building each integration directly takes 4 to 8 weeks of developer time per device because of fragmented APIs, inconsistent formats, and separate OAuth flows. Unified aggregator APIs (Terra API, Open Wearables, Vora) cut this from roughly 6 months to roughly 3 weeks. **Use an aggregator, do not build direct integrations.**

The opportunity: **Function does not integrate wearables at all.** Superpower does not advertise it on its membership page. InsideTracker's wearable ProTips are the only daily engagement loop in the category. This is the cheapest available differentiation against the two biggest competitors.

### 4.4 Scores, retention, and the shapes that recur

The dominant presentation pattern is **one headline number, plus 10 to 20 domain sub-scores, plus a trend line**: Superpower 17 scores plus overall, Viome 70+ hierarchical scores, Everlywell WellScore, Lifeforce Lifescore, Blueprint 11 organ-system ages. JIVA's 10-system Vitality Map is already this shape and mainly needs a headline score and real trend data.

Retention cadences observed: Lifeforce quarterly, Fountain Life quarterly, InsideTracker recommends 3 months, Marek requires 6 months, Hone 3 to 6 months, Function 6 months (bundled), Everlywell 360 annual, Viome annual.

Underbuilt across the whole category: **community and social** (only Blueprint), **referral programs** (only Function, modestly), and **family or gift bundles** (only Superpower gifting). All three map unusually well to LatAm purchasing dynamics.

### 4.5 Latin America and Costa Rica

**This is where JIVA has ground no US competitor is contesting.**

**WhatsApp is the single most important product decision.** Roughly 96% smartphone penetration in Latin America and the default healthcare communication channel in the region. 98% message open rate versus 20 to 30% for email. Practitioners in Argentina, Guatemala, and Mexico report it is already essential to doctor-patient communication. Proven use cases include appointment booking, confirmations, and 24-hour and 2-hour reminders with documented no-show reduction. **Lab scheduling, fasting instructions, results-ready notification, retest reminders, and the AI assistant itself should all have a WhatsApp surface. Email-first notification, the US default, will materially underperform here.** Note that even Superpower chose SMS over app push for clinical support in the US.

**Payments.** SINPE Movil is Costa Rica's dominant rail: operated by the Central Bank, 2.5M+ users, over 80% of the population aged 15+ active as of 2025, 65M+ transactions per month, volume up 200% since 2020. **Installments ("cuotas") are heavily used across LatAm; for a several-hundred-dollar panel, offering 3, 6, or 12 cuotas is likely a larger conversion lever than any pricing change.** Cash remains strong outside San Jose. Local gateways include Kushki and Banco Nacional. Regional equivalents for later expansion: Pix (Brazil), SPEI and CoDi (Mexico), Nequi and Daviplata (Colombia), Yape and PLIN (Peru), MODO (Argentina).

**HSA/FSA is a US-only construct and is irrelevant here.** Every US competitor leans on it. The functional equivalents to build instead are installments, employer-paid corporate wellness, and itemized receipts for private insurance reimbursement.

**Localization.** Of Spanish-language medical apps studied, 58.8% were originally developed in Spanish while 41.2% were English translations. Spanish is not one market: US Hispanic, Latin American, and Iberian Spanish differ in regulatory framework, healthcare financing, and patient behavior. **Treat neutral LatAm Spanish (es-CR primary) as the source locale, not a translation of an English original,** and localize units (mg/dL versus mmol/L), date formats, and reference ranges.

**Lab partners in Costa Rica.** Labin (independent chain, many San Jose locations). **Laboratorio San Jose, which already offers at-home phlebotomy.** Hospital CIMA in Escazu, which runs 98% of its tests in its own labs, unusual for the region. Clinica Biblica, Hospital La Catolica, and **Hospital Metropolitano, whose satellite footprint in Quepos, Liberia, and Huacas maps almost exactly onto the expat and tourist corridors** that are likely JIVA's earliest-adopting segment.

**Regional labs for expansion.** DASA (Brazil) is the largest diagnostics company in Latin America and fifth largest globally: 321 branches, 55,000 patients daily, 10M+ tests monthly. Grupo Fleury, Hermes Pardini, and Grupo Sabin are actively integrating digital tools, which means partnership receptivity but also future competition. **Salud Digna (Mexico)**, 300+ centers built around low-cost preventive diagnostics, is precedent that volume-priced preventive testing works at LatAm mass-market price points.

**Market size.** LatAm telemedicine was $2.95B in 2025, projected to reach $12.34B by 2034 at 17.23% CAGR. Incumbent consumer players include Doctoralia (dominant appointment booking across LatAm and Spain), Teladoc, and Clinicas del Azucar.

**Existing longevity presence in Costa Rica.** **Rejuvilife** in Escazu and the **Anti-Aging and Wellness Clinic** (Costa Rica, Mexico, Panama), which describes itself as the most experienced age management clinic in Latin America. Regionally: Lonvida (Mexico City), Longevity Medical Institute (San Jose del Cabo), Wellness Care (Medellin), Longevity Link (Bogota, Medellin, Cartagena). **These are clinic-first and software-poor, which makes them partnership targets rather than pure competitors.** In March 2025 Lifenome and Optimo Life launched "Genetria" targeting an $11B regional precision health market, which is the closest thing to a direct regional competitor.

**Brand asset.** Over 40,000 Americans travel to Costa Rica for medical treatment annually. The **Nicoya Peninsula is one of only five global Blue Zones**, a uniquely ownable positioning for a longevity product headquartered in Costa Rica that no US competitor can credibly claim.

**Regulatory.** Costa Rica's **Personal Data Protection Law No. 8968**, enforced by **PRODHAB**, treats health data as sensitive, requires informed express consent for processing, and requires **registration of databases with PRODHAB** for entities that distribute, commercialize, or publicly share personal data. Concrete pre-launch items: consent capture in the intake questionnaire, and likely a PRODHAB registration.

---

## 5. Where JIVA stands today

Current capability, for grounding the recommendations in `Additional_Functionality.md`:

**Built:** account signup with optional 2FA, intake questionnaire, package selection, payment, lab visit scheduling with date and location choice, results dashboard, biomarker detail pages, Vitality Map with 10 functional-system tiles on a continuous spectrum, action plan page, and an engine producing per-system diagnoses, summaries, and food, supplement, and exercise recommendations.

**Structural gaps versus the field, in rough priority order:**

1. **No second draw.** The onboarding flow terminates at one appointment. Every competitor's economics depend on the retest loop.
2. **No trend view.** With one draw there is nothing to trend, but the data model and UI need to be ready for the second.
3. **Biological Age is a static placeholder.** PhenoAge would make it real using values already collected.
4. **No headline score.** The Vitality Map has 10 system tiles but no single number to improve, which is what every competitor markets on.
5. **No between-draw engagement.** Nothing brings a user back between appointments.
6. **No wearable data**, which is the live gap at the top of the market and the cheapest available differentiation.
7. **No WhatsApp surface**, which is the highest-impact LatAm-specific gap.
8. **No installments or local payment rails**, likely the single largest conversion lever in-region.

**Not gaps, despite appearances:** imaging (only Function has it, and it needed an acquisition), supplement sales (Viome and Lifeforce revenue engines, but advisory-only recommendations are what the software players ship), and raw panel breadth (InsideTracker competes successfully at about a third of Function's marker count).

---

## 6. Sources

Function Health: functionhealth.com (pricing, how-it-works, biomarker categories, FAQs), bloodtestcomparison.com, medicalnewstoday.us, healnourishgrow.com, cnbc.com (Ezra acquisition), prnewswire.com, fiercehealthcare.com (Series B, Medical Intelligence Lab), hitconsultant.net, clpmag.com (ChatGPT app).

Superpower: superpower.com (baseline membership, FAQs, vs-others, gift, communities), wellworthy.com, crowncounseling.com, medium.com/@andrew_fu, nutraceuticalsworld.com, prnewswire.com, productpep.com.

InsideTracker: innerbody.com, info.insidetracker.com, blog.insidetracker.com, support.insidetracker.com, enterprise.insidetracker.com, mitohealth.com, insider.fitt.co, morningstar.com (Terra), truemed.com, cbinsights.com.

Viome: viome.com, innerbody.com, healthrx.com, athletechnews.com, leafsnap.com, blog.generationlab.com, apps.apple.com, forbes.com.

Everlywell: everlywell.com (360, membership, virtual care), try.everlywell.com, support.everlywell.com, vitalityscout.com, usebetterproducts.com, apps.apple.com.

Lifeforce: mylifeforce.com, lifeforce.com, garagegymreviews.com, mitohealth.com, finvsfin.com.

Hone Health: honehealth.com, help.honehealth.com, newswire.com, telehealthally.com, bestmedshub.com, finvsfin.com.

Marek Health: marekhealth.com, marekdiagnostics.com, peakedlabs.com, peptidesexplorer.com, mynucleus.com, activegearreview.com.

Blueprint: blueprint.bryanjohnson.com, apps.apple.com, play.google.com, honehealth.com/edge, lolahealth.com, hollywoodreporter.com.

Imaging and clinics: fortune.com, pymnts.com, medicaldevice-network.com, axios.com (Neko); auntminnie.com, cnbc.com (Prenuvo); fountainlife.com, longevity.technology, techcrunch.com (Fountain Life); techcrunch.com, newsroom.questdiagnostics.com (Whoop Advanced Labs).

Biological age: longevity-tools.com, thrivous.com, agelessrx.com, blog.insidetracker.com.

AI and wearables: kffhealthnews.org, themomentum.ai, tryterra.co.

LatAm: marketdataforecast.com, helo.ai, restofworld.org, transfi.com, sciencedirect.com, paymentscmi.com, cartdna.com, mhealth.jmir.org, alconost.com, gtelocalize.net, iadb.org, us.elgalabwater.com, liveandinvestoverseas.com, expatlife.ai, inmanclinic.com, antiagewellness.com, ticosland.com, markets.financialcontent.com, parsmedtravel.com, dlapiperdataprotection.com, globalprivacylaws.com.

Costa Rica labs: laboratoriosanjose.com, hospitalcima.com.
