#!/usr/bin/env python3
"""
Generates the STEP 1A "valid JIVA tests" panel tables + system-mapping tables
for the v5 engine prompt, from packages.json + reference_ranges.json.

Keeps the engine's lab universe in lockstep with the xlsx source of truth.
Run: python3 build_engine_tables.py  -> prints markdown to stdout / engine_tables.generated.md
"""

import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
TESTS = os.path.normpath(os.path.join(HERE, "..", "Tests"))

packages = json.load(open(os.path.join(TESTS, "packages.json")))
rr = json.load(open(os.path.join(TESTS, "reference_ranges.json")))

BY_NAME = {b["name"]: b for b in rr["biomarkers"]}
COMPOSITES = rr["compositeExpansions"]


def ref_str(b):
    if b["type"] == "qualitative":
        return f"Qualitative — normal: {b.get('normal')}"
    r = b["ranges"]
    if b["sexSpecific"]:
        m, f = r["male"], r["female"]
        return f"M {m['low']}–{m['high']} · F {f['low']}–{f['high']}"
    g = r["general"]
    return f"{g['low']}–{g['high']}"


def crit_str(b):
    c = b.get("critical")
    if not c:
        return "—"
    parts = []
    if c.get("low") is not None:
        parts.append(f"<{c['low']}")
    if c.get("high") is not None:
        parts.append(f">{c['high']}")
    return " / ".join(parts) if parts else "—"


def resolve(name):
    """Expand a packages.json line item into its concrete biomarker dicts."""
    targets = COMPOSITES.get(name, [name])
    out = []
    for t in targets:
        if t in BY_NAME:
            out.append(BY_NAME[t])
    return out


lines = []
seen_for_system = {}

for panel in packages["panels"]:
    header = f"#### {panel['name']}"
    meta = f"*Type: {panel['type']} · Price: ${panel['price']} · {panel['testCount']} tests (as sold)*"
    lines += ["", header, "", meta, ""]
    lines += ["| Test Name | Unit | System | Reference Range | Critical |",
              "|-----------|------|--------|-----------------|----------|"]
    for bm in panel["biomarkers"]:
        for b in resolve(bm["name"]):
            note = f" <br><sub>{b['note']}</sub>" if b.get("note") else ""
            lines.append(
                f"| {b['name']}{note} | {b['unit']} | {b['system']} | {ref_str(b)} | {crit_str(b)} |"
            )
            seen_for_system.setdefault(b["system"], []).append(b["name"])
    lines.append("")

# System -> biomarkers reference (dedup, preserve order)
SYSTEM_ORDER = ["Blood", "Metabolic", "Heart", "Liver", "Kidney", "Electrolytes",
                "Thyroid", "Nutrients", "Immune/Inflammatory", "Hormonal/Reproductive"]
lines += ["", "### BODY SYSTEM MAPPING (10 canonical systems)", "",
          "| Body System | Biomarkers |", "|-------------|------------|"]
for sys in SYSTEM_ORDER:
    names = []
    for n in seen_for_system.get(sys, []):
        if n not in names:
            names.append(n)
    lines.append(f"| **{sys}** | {', '.join(names)} |")
lines.append("")

out = "\n".join(lines)
with open(os.path.join(HERE, "engine_tables.generated.md"), "w") as f:
    f.write(out + "\n")
print(out)
