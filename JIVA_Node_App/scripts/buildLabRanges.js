/**
 * Generates Data/Lab_Ranges.xlsx — the 4-tier range table used to classify labs:
 *   Package | Biomarker | Unit | Sex | In-Range Low | In-Range High |
 *   Borderline Low | Borderline High | Critical Low | Critical High | Notes
 *
 * BORDERLINE SEMANTICS (reworked): "borderline" means the patient is on the
 * CUSP of leaving the in-range zone — i.e. the value is still INSIDE the
 * reference range but within the outer margin of a boundary. It is NOT a band
 * outside the range. Anything outside the reference range is out-of-range (or
 * critical). "Borderline Low/High" columns are therefore the INNER edges of the
 * comfortable core: below Borderline Low (but ≥ In-Range Low) = borderline-low;
 * above Borderline High (but ≤ In-Range High) = borderline-high.
 *
 * Sources:
 *  - In-range + some criticals: Data/Tests/reference_ranges.json (provisional).
 *  - Borderline cusp: the outer CUSP_FRACTION of the in-range span at each
 *    clinically-meaningful edge (skipped where a boundary is a nominal 0 floor
 *    or an open-ended upper limit). Overridable per biomarker via coreLow/coreHigh.
 *  - Criticals refined from published critical/panic-value lists (ARUP, Mayo).
 *
 * The tier ladder (low → high):
 *   Critical Low | out-of-range | In-Range Low | borderline | Borderline Low
 *   … [comfortable core] … Borderline High | borderline | In-Range High
 *   | out-of-range | Critical High
 *
 * Re-runnable. Run: node scripts/buildLabRanges.js
 */
const path = require('path');
const XLSX = require('xlsx');

const DATA = path.resolve(__dirname, '..', '..', 'Data');
const TESTS = path.join(DATA, 'Tests');
const packages = require(path.join(TESTS, 'packages.json'));
const ranges = require(path.join(TESTS, 'reference_ranges.json'));

const BY_NAME = {};
ranges.biomarkers.forEach((b) => (BY_NAME[b.name] = b));
const COMPOSITES = ranges.compositeExpansions || {};
const key = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const round = (x) => (x == null ? null : Math.round(x * 1000) / 1000);

// Fraction of the in-range span that counts as the borderline "cusp" at each
// meaningful boundary. 0.15 => the outer 15% just inside each edge.
const CUSP_FRACTION = 0.15;

// Per-biomarker refinements (absolute values):
//   coreLow / coreHigh  — explicit inner (comfortable-core) thresholds, i.e. the
//                         Borderline Low / Borderline High values.
//   critLow / critHigh  — critical/panic thresholds.
const OVERRIDE = {
    fastingglucose: { critLow: 50, critHigh: 400 },
    triglycerides: { critHigh: 1000 },                    // >1000 pancreatitis risk
    tsh: { critLow: 0.01, critHigh: 100 },                // myxedema / thyroid storm
    'vitamind25oh': { critHigh: 150 },                   // toxicity >150
    potassium: { critLow: 2.5, critHigh: 6 },
    calcium: { critLow: 6, critHigh: 13 },
    magnesium: { critLow: 1, critHigh: 4.9 },
    platelets: { critLow: 20, critHigh: 1000 },
};

// Boundaries for one biomarker + one reference band {low, high}.
// bLow / bHigh are the INNER cusp thresholds (see file header): a value inside
// [inLow, bLow) or (bHigh, inHigh] is borderline; [bLow, bHigh] is the core.
function boundaries(b, low, high) {
    const crit = b.critical || {};
    let critLow = crit.low != null ? crit.low : null;
    let critHigh = crit.high != null ? crit.high : null;

    const hasLow = low != null && low > 0;      // meaningful lower boundary
    const hasHigh = high != null && high < 999; // meaningful upper boundary
    const span = hasLow && hasHigh ? high - low : null;

    // Borderline cusp sits INSIDE the reference range near each meaningful edge.
    let bLow = hasLow ? round(low + CUSP_FRACTION * (span != null ? span : low)) : null;
    let bHigh = hasHigh ? round(high - CUSP_FRACTION * (span != null ? span : high)) : null;

    const ov = OVERRIDE[key(b.name)];
    if (ov) {
        if (ov.coreLow !== undefined) bLow = ov.coreLow;
        if (ov.coreHigh !== undefined) bHigh = ov.coreHigh;
        if (ov.critLow !== undefined) critLow = ov.critLow;
        if (ov.critHigh !== undefined) critHigh = ov.critHigh;
    }
    // Keep the core non-empty and inside the range: inLow < bLow ≤ bHigh < inHigh.
    if (bLow != null && bHigh != null && bLow > bHigh) {
        const mid = round((bLow + bHigh) / 2);
        bLow = mid; bHigh = mid;
    }
    return { critLow, bLow, inLow: low, inHigh: high, bHigh, critHigh };
}

function rowsForBiomarker(pkgName, b) {
    const out = [];
    if (b.type === 'qualitative') {
        out.push([pkgName, b.name, b.unit, 'general', '', '', '', '', '', '', `Qualitative — normal: ${b.normal || 'Negative'}`]);
        return out;
    }
    const conds = b.sexSpecific
        ? [['male', b.ranges.male], ['female', b.ranges.female]]
        : [['general', b.ranges.general]];
    for (const [cond, r] of conds) {
        const bd = boundaries(b, r.low != null ? r.low : null, r.high != null ? r.high : null);
        const note = b.note || '';
        out.push([
            pkgName, b.name, b.unit, cond,
            bd.inLow, bd.inHigh, bd.bLow, bd.bHigh, bd.critLow, bd.critHigh, note,
        ]);
    }
    return out;
}

function main() {
    const header = [
        'Package', 'Biomarker', 'Unit', 'Sex',
        'In-Range Low', 'In-Range High', 'Borderline Low', 'Borderline High',
        'Critical Low', 'Critical High', 'Notes',
    ];
    const rows = [header];
    let missing = 0;
    for (const panel of packages.panels) {
        for (const line of panel.biomarkers) {
            const targets = COMPOSITES[line.name] || [line.name];
            for (const t of targets) {
                const b = BY_NAME[t];
                if (!b) { console.warn(`  ⚠ no reference range for "${t}" (${panel.name})`); missing++; continue; }
                rows.push(...rowsForBiomarker(panel.name, b));
            }
        }
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 26 }, { wch: 34 }, { wch: 10 }, { wch: 9 }, { wch: 12 }, { wch: 13 }, { wch: 13 }, { wch: 14 }, { wch: 12 }, { wch: 13 }, { wch: 50 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lab Ranges');
    const outPath = path.join(DATA, 'Lab_Ranges.xlsx');
    XLSX.writeFile(wb, outPath);
    console.log(`✅ Wrote ${outPath} — ${rows.length - 1} rows (${missing} missing).`);
}

main();
