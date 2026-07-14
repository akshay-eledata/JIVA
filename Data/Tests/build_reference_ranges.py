#!/usr/bin/env python3
"""
Builds the JIVA reference-ranges dataset (plan.md decision D10).

Output:
  - reference_ranges.json  -> machine-readable, consumed by the v5 engine reference tables
  - reference_ranges.md    -> human-readable review table

Source: standard clinical reference intervals + targeted web research for the
specialty markers (8-OHdG, Omega-3 index, NT-proBNP, sdLDL, TNF-a, C3/C4,
fecal calprotectin, AMH, Zn/Cu/Se, Vit A/E/K2, IGF-1, intact PTH, IL-6, ESR,
fibrinogen, D-dimer, active B12/holoTC, RBC folate). See plan.md §Phase A.

This is a "close enough" set to UNBLOCK execution — NOT lab-validated.
Ranges are assay/lab dependent; the JIVA team's authoritative file supersedes this.

Tier rule (matches engine):
  IN RANGE     = value within [low, high]
  BORDERLINE   = within 10% of a boundary
  OUT OF RANGE = >10% beyond a boundary
  CRITICAL     = beyond critical.low / critical.high
Re-runnable / idempotent. Run: python3 build_reference_ranges.py
"""

import json
import os

GENERATED_AT = "2026-07-10"

# Helpers to keep the table below terse.
def q(name, unit, low, high, system, crit_low=None, crit_high=None, note=None, panels=None):
    """General (non-sex-specific) quantitative marker."""
    return {
        "name": name, "unit": unit, "type": "quantitative", "sexSpecific": False,
        "ranges": {"general": {"low": low, "high": high}},
        "critical": {"low": crit_low, "high": crit_high} if (crit_low is not None or crit_high is not None) else None,
        "system": system, "panels": panels or [], "note": note,
    }

def qs(name, unit, m_low, m_high, f_low, f_high, system, crit_low=None, crit_high=None, note=None, panels=None):
    """Sex-specific quantitative marker."""
    return {
        "name": name, "unit": unit, "type": "quantitative", "sexSpecific": True,
        "ranges": {"male": {"low": m_low, "high": m_high}, "female": {"low": f_low, "high": f_high}},
        "critical": {"low": crit_low, "high": crit_high} if (crit_low is not None or crit_high is not None) else None,
        "system": system, "panels": panels or [], "note": note,
    }

def ql(name, unit, normal, system, note=None, panels=None):
    """Qualitative marker."""
    return {
        "name": name, "unit": unit, "type": "qualitative", "sexSpecific": False,
        "ranges": None, "critical": None, "normal": normal,
        "system": system, "panels": panels or [], "note": note,
    }

BIOMARKERS = [
    # ---------- CBC (Blood) — expansion of "Complete blood count (CBC)" ----------
    q("WBC", "K/µL", 4.5, 11.0, "Blood", 2.0, 30.0),
    qs("RBC", "M/µL", 4.5, 5.9, 4.0, 5.2, "Blood"),
    qs("Hemoglobin", "g/dL", 13.5, 17.5, 12.0, 15.5, "Blood", 7.0, 20.0),
    qs("Hematocrit", "%", 41, 53, 36, 46, "Blood"),
    q("MCV", "fL", 80, 100, "Blood"),
    q("MCH", "pg", 27, 33, "Blood"),
    q("MCHC", "g/dL", 32, 36, "Blood"),
    q("RDW", "%", 11.5, 14.5, "Blood"),
    q("Platelets", "K/µL", 150, 400, "Blood", 50, 1000),
    q("Neutrophils", "%", 40, 70, "Blood"),
    q("Lymphocytes", "%", 20, 40, "Blood"),
    q("Monocytes", "%", 2, 10, "Blood"),
    q("Eosinophils", "%", 1, 4, "Blood"),
    q("Basophils", "%", 0, 1, "Blood"),
    q("Ferritin", "ng/mL", None, None, "Blood",
      note="Sex-specific handled below"),  # placeholder, replaced right after
]
# Fix Ferritin to sex-specific properly (removing placeholder)
BIOMARKERS.pop()
BIOMARKERS.append(qs("Ferritin", "ng/mL", 30, 400, 13, 150, "Blood"))

BIOMARKERS += [
    # Iron studies (Nutrition panel) — mapped to Blood per packages.json
    q("Serum iron", "µg/dL", 60, 170, "Blood"),
    q("TIBC", "µg/dL", 250, 370, "Blood"),
    q("Transferrin saturation", "%", 15, 50, "Blood"),

    # ---------- Metabolic ----------
    q("Fasting glucose", "mg/dL", 70, 99, "Metabolic", 50, 500),
    q("Glycated Hemoglobin (HbA1c)", "%", 4.0, 5.6, "Metabolic"),
    qs("Uric acid", "mg/dL", 3.4, 7.0, 2.4, 6.0, "Metabolic"),
    q("Fasting insulin", "µIU/mL", 2.6, 24.9, "Metabolic", note="Optimal <10; insulin-resistant pattern >15."),

    # ---------- Heart / Lipids ----------
    q("Total cholesterol", "mg/dL", 0, 199, "Heart"),
    q("LDL cholesterol (calculated)", "mg/dL", 0, 99, "Heart"),
    qs("HDL cholesterol", "mg/dL", 40, 999, 50, 999, "Heart", note="Lower bound is the risk threshold; higher is protective."),
    q("Triglycerides", "mg/dL", 0, 149, "Heart", crit_high=1000),
    q("hs-CRP", "mg/L", 0, 1.0, "Heart", note="Cardiac risk: <1 low, 1-3 average, >3 high."),
    q("ApoB", "mg/dL", 0, 90, "Heart"),
    q("Lp(a)", "mg/dL", 0, 30, "Heart", note="~<75 nmol/L equivalent."),
    q("Direct LDL", "mg/dL", 0, 99, "Heart"),
    q("Small dense LDL (sdLDL)", "mg/dL", 0, 35, "Heart", note="Optimal <20; borderline 20-40; high >40 (web research)."),
    q("LDL particle number", "nmol/L", 0, 1000, "Heart", note="Optimal <1000; high >1600."),
    qs("Direct HDL", "mg/dL", 40, 999, 50, 999, "Heart"),
    q("Large HDL (functional)", "mg/dL", 10, 30, "Heart", note="NMR subfraction; higher = more protective. Range approximate/assay-dependent."),
    q("VLDL cholesterol", "mg/dL", 5, 40, "Heart"),
    q("Homocysteine", "µmol/L", 0, 15, "Heart", note="Optimal <10."),
    q("NT-proBNP", "pg/mL", 0, 125, "Heart", note="Outpatient cutoff <125 (<75 yr); age-adjusted acute HF cutoffs higher."),
    q("TG/HDL ratio (calculated)", "ratio", 0, 3.0, "Heart", note="Optimal <2.0; insulin-resistance surrogate."),

    # ---------- Liver ----------
    q("Albumin", "g/dL", 3.5, 5.0, "Liver"),
    q("Total protein", "g/dL", 6.0, 8.5, "Liver"),
    q("Alkaline phosphatase", "U/L", 44, 147, "Liver"),
    q("ALT", "U/L", 7, 56, "Liver", crit_high=500),
    q("AST", "U/L", 10, 40, "Liver", crit_high=500),
    q("Total bilirubin", "mg/dL", 0.1, 1.2, "Liver", crit_high=15.0),
    q("Direct bilirubin", "mg/dL", 0.0, 0.3, "Liver"),
    q("Indirect bilirubin", "mg/dL", 0.1, 0.9, "Liver"),
    q("GGT", "U/L", 8, 61, "Liver", note="Female upper ~36."),
    q("LDH", "U/L", 140, 280, "Liver"),
    q("Amylase", "U/L", 30, 110, "Liver"),
    q("Lipase", "U/L", 10, 140, "Liver"),
    q("PT/INR", "ratio", 0.8, 1.1, "Liver", crit_high=5.0),
    ql("H. pylori IgG", "Qualitative", "Negative", "Liver", note="Index <0.9 negative."),
    q("Anti-gliadin IgA", "U/mL", 0, 20, "Liver", note="<20 negative (assay-dependent)."),
    q("Anti-transglutaminase IgA", "U/mL", 0, 4, "Liver", note="<4 negative; 4-10 weak positive; >10 positive."),
    q("Fecal calprotectin", "µg/g", 0, 50, "Liver", note="50-120 borderline; >120 active GI inflammation (web research)."),

    # ---------- Kidney ----------
    qs("Serum creatinine", "mg/dL", 0.74, 1.35, 0.59, 1.04, "Kidney", crit_high=10.0),
    q("BUN", "mg/dL", 7, 20, "Kidney", crit_high=100),
    ql("Urinalysis (EGO)", "Qualitative", "Normal", "Kidney"),

    # ---------- Electrolytes ----------
    q("Calcium", "mg/dL", 8.5, 10.5, "Electrolytes", 6.5, 13.0),
    q("Magnesium", "mg/dL", 1.7, 2.2, "Electrolytes", 0.5, 3.0),
    q("Potassium", "mmol/L", 3.5, 5.1, "Electrolytes", 2.5, 6.5),
    q("Sodium", "mmol/L", 136, 145, "Electrolytes", 120, 160),
    q("Chloride", "mmol/L", 98, 107, "Electrolytes", 80, 115),
    q("Phosphorus", "mg/dL", 2.5, 4.5, "Electrolytes"),
    q("CO2", "mmol/L", 22, 29, "Electrolytes", 10, 40),

    # ---------- Thyroid ----------
    q("TSH", "mIU/mL", 0.45, 4.50, "Thyroid", 0.01, 100),
    q("Free T3 (fT3)", "pg/mL", 2.0, 4.4, "Thyroid"),
    q("Free T4 (fT4)", "ng/dL", 0.82, 1.77, "Thyroid"),
    q("Anti-TPO antibodies", "IU/mL", 0, 34, "Thyroid"),
    q("Anti-thyroglobulin (Anti-Tg)", "IU/mL", 0, 4.0, "Thyroid", note="Assay-dependent (some report <115)."),

    # ---------- Nutrients ----------
    q("Vitamin D (25-OH)", "ng/mL", 30, 100, "Nutrients", note="Deficient <20; insufficient 20-29; optimal 40-80."),
    q("Vitamin B12", "pg/mL", 200, 900, "Nutrients", note="Optimal >500."),
    q("Folate / B9", "ng/mL", 3.0, 17.0, "Nutrients"),
    q("Vitamin B6", "ng/mL", 5, 50, "Nutrients", note="As pyridoxal-5-phosphate (P5P)."),
    q("Zinc", "µg/dL", 70, 120, "Nutrients"),
    q("Copper", "µg/dL", 80, 155, "Nutrients"),
    q("Selenium", "µg/L", 70, 150, "Nutrients"),
    q("Omega-3 index (EPA+DHA)", "%", 8, 12, "Nutrients", note="Target >=8% (higher = lower CV risk); <4% high risk."),
    q("Vitamin A", "µg/dL", 20, 60, "Nutrients"),
    q("Vitamin E", "mg/L", 5.5, 17.0, "Nutrients", note="Alpha-tocopherol."),
    q("Vitamin K2", "ng/mL", 0.17, 1.01, "Nutrients", note="MK-7; highly assay-dependent (web research)."),
    q("Active B12 (holotranscobalamin)", "pmol/L", 35, 171, "Nutrients", note="Deficiency <40; investigate <70."),
    q("RBC folate", "ng/mL", 280, 903, "Nutrients"),
    q("Intact PTH", "pg/mL", 15, 65, "Nutrients", note="Interpret with calcium, phosphorus, vitamin D."),

    # ---------- Hormonal / Reproductive ----------
    qs("Total testosterone", "ng/dL", 264, 916, 15, 70, "Hormonal/Reproductive"),
    qs("Free testosterone", "pg/mL", 9.3, 26.5, 0.6, 6.8, "Hormonal/Reproductive"),
    qs("Estradiol (E2)", "pg/mL", 7.6, 42.6, 12.5, 166, "Hormonal/Reproductive", note="Female varies by menstrual phase."),
    qs("FSH", "mIU/mL", 1.5, 12.4, 3.0, 20.0, "Hormonal/Reproductive"),
    qs("LH", "mIU/mL", 1.7, 8.6, 1.0, 18.0, "Hormonal/Reproductive"),
    qs("Prolactin", "ng/mL", 2.0, 18.0, 2.8, 29.2, "Hormonal/Reproductive"),
    qs("SHBG", "nmol/L", 10, 57, 18, 144, "Hormonal/Reproductive"),
    q("Total PSA", "ng/mL", 0, 4.0, "Hormonal/Reproductive", note="Male; age-adjusted upper limits exist."),
    q("Free PSA", "%", 25, 100, "Hormonal/Reproductive", note="% free of total PSA; >25% favorable, <10% higher risk."),
    q("Progesterone", "ng/mL", 0.1, 25.0, "Hormonal/Reproductive", note="Female; follicular <1.5, luteal 2-25 (phase-dependent)."),
    qs("DHEA-S", "µg/dL", 110, 510, 45, 320, "Hormonal/Reproductive", note="Declines ~2%/yr after age 25."),
    q("AMH", "ng/mL", 1.0, 3.5, "Hormonal/Reproductive", note="Female; age-dependent, declines with age (<1.0 = low reserve)."),
    q("Morning cortisol", "µg/dL", 6.2, 19.4, "Hormonal/Reproductive", note="AM sample (7-9am)."),
    q("Evening cortisol", "µg/dL", 2.3, 11.9, "Hormonal/Reproductive", note="PM sample; ~half of AM."),
    q("IGF-1", "ng/mL", 90, 360, "Hormonal/Reproductive", note="Age-adjusted: 16-24 ~182-780; 25-39 ~114-492; 40-54 ~90-360; 55+ ~71-290."),
    q("GH (fasting)", "ng/mL", 0, 5.0, "Hormonal/Reproductive", note="Pulsatile; random/fasting typically low."),

    # ---------- Immune / Inflammatory ----------
    q("IL-6", "pg/mL", 0, 7.0, "Immune/Inflammatory", note="High-sensitivity assays ULN ~1.8."),
    q("TNF-alpha", "pg/mL", 0, 8.1, "Immune/Inflammatory"),
    q("Fibrinogen", "mg/dL", 200, 400, "Immune/Inflammatory"),
    qs("ESR", "mm/hr", 0, 15, 0, 20, "Immune/Inflammatory"),
    ql("ANA screen", "Titer", "Negative", "Immune/Inflammatory", note="Positive >=1:40; clinically significant >=1:160."),
    q("Rheumatoid factor", "IU/mL", 0, 14, "Immune/Inflammatory"),
    q("Complement C3", "mg/dL", 90, 180, "Immune/Inflammatory"),
    q("Complement C4", "mg/dL", 14, 45, "Immune/Inflammatory"),
    q("Lymphocyte differential", "K/µL", 1.0, 4.8, "Immune/Inflammatory", note="Absolute lymphocyte count."),
    q("D-dimer", "ng/mL", 0, 500, "Immune/Inflammatory", note="FEU; >500 suggests active clotting."),
    q("8-OHdG (oxidative DNA damage)", "ng/mL", 0, 0.5, "Immune/Inflammatory", note="Oxidative stress; higher = more damage. Highly method/assay-dependent."),

    # ---------- Cognitive / Neurological (unique markers only) ----------
    ql("ApoE genotype", "Genotype", "e3/e3", "Heart", note="Genotype, not a range. e4 allele = higher risk; e2 protective."),
]


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    doc = {
        "generatedAt": GENERATED_AT,
        "source": ("Compiled from standard clinical reference intervals + targeted web research "
                   "for specialty markers. 'Close enough' set to unblock execution (plan.md D10); "
                   "NOT lab-validated. Ranges are assay/lab dependent."),
        "tierRule": ("IN RANGE = value within [low,high]; BORDERLINE = within 10% of a boundary; "
                     "OUT OF RANGE = >10% beyond a boundary; CRITICAL = beyond critical.low/high."),
        "biomarkerCount": len(BIOMARKERS),
        "biomarkers": BIOMARKERS,
        # How each composite line in packages.json expands into the biomarkers above.
        "compositeExpansions": {
            "Complete blood count (CBC)": [
                "WBC", "RBC", "Hemoglobin", "Hematocrit", "MCV", "MCH", "MCHC", "RDW",
                "Platelets", "Neutrophils", "Lymphocytes", "Monocytes", "Eosinophils", "Basophils",
            ],
            "Total & fractionated bilirubin": ["Total bilirubin", "Direct bilirubin", "Indirect bilirubin"],
            "Albumin + total protein": ["Albumin", "Total protein"],
            "Vitamin D (25-OH) + intact PTH": ["Vitamin D (25-OH)", "Intact PTH"],
            "TSH + fT3 + fT4": ["TSH", "Free T3 (fT3)", "Free T4 (fT4)"],
            "Morning & evening cortisol": ["Morning cortisol", "Evening cortisol"],
            "Fasting glucose + insulin": ["Fasting glucose", "Fasting insulin"],
            "Direct & indirect bilirubin": ["Direct bilirubin", "Indirect bilirubin"],
            "Folate / B9": ["Folate / B9"],
        },
    }

    json_path = os.path.join(here, "reference_ranges.json")
    with open(json_path, "w") as f:
        json.dump(doc, f, indent=2, ensure_ascii=False)

    # ---- Human-readable markdown ----
    def fmt_range(b):
        if b["type"] == "qualitative":
            return f"Normal: {b.get('normal')}"
        r = b["ranges"]
        if b["sexSpecific"]:
            m, fm = r["male"], r["female"]
            return f"M {m['low']}–{m['high']} / F {fm['low']}–{fm['high']}"
        g = r["general"]
        return f"{g['low']}–{g['high']}"

    def fmt_crit(b):
        c = b.get("critical")
        if not c:
            return "—"
        lo = c.get("low"); hi = c.get("high")
        parts = []
        if lo is not None:
            parts.append(f"<{lo}")
        if hi is not None:
            parts.append(f">{hi}")
        return " or ".join(parts) if parts else "—"

    lines = [
        "# JIVA Reference Ranges (D10 — provisional)",
        "",
        f"> Generated {GENERATED_AT} by `build_reference_ranges.py`. "
        "**Provisional / 'close enough' to unblock execution — NOT lab-validated.** "
        "Superseded by the JIVA team's authoritative file when available.",
        "",
        f"**Tier rule:** {doc['tierRule']}",
        "",
        f"**{len(BIOMARKERS)} biomarkers.** Sex-specific shown as `M … / F …`.",
        "",
        "| Biomarker | Unit | System | In-range (normal) | Critical | Notes |",
        "|---|---|---|---|---|---|",
    ]
    for b in BIOMARKERS:
        note = (b.get("note") or "").replace("|", "\\|")
        lines.append(
            f"| {b['name']} | {b['unit']} | {b['system']} | {fmt_range(b)} | {fmt_crit(b)} | {note} |"
        )
    md_path = os.path.join(here, "reference_ranges.md")
    with open(md_path, "w") as f:
        f.write("\n".join(lines) + "\n")

    print(f"Wrote {json_path} ({len(BIOMARKERS)} biomarkers)")
    print(f"Wrote {md_path}")


if __name__ == "__main__":
    main()
