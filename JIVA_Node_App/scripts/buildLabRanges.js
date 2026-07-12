/**
 * Generates Data/Lab_Ranges.xlsx — the 4-tier range table used to classify labs:
 *   Package | Biomarker | Unit | Sex | In-Range Low | In-Range High |
 *   Borderline Low | Borderline High | Critical Low | Critical High | Notes
 *
 * Sources:
 *  - In-range + some criticals: Data/Tests/reference_ranges.json (provisional).
 *  - Borderline bands: clinical categories where they exist (pre-diabetes,
 *    borderline-high lipids, subclinical thyroid, vitamin-D insufficiency, hs-CRP
 *    risk tiers, …); otherwise a ±10% buffer beyond the reference range.
 *  - Criticals refined from published critical/panic-value lists (ARUP, Mayo).
 *
 * The tier ladder (low → high):
 *   Critical Low | out-of-range | Borderline Low | borderline | In-Range Low
 *   … In-Range High | borderline | Borderline High | out-of-range | Critical High
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

// Clinically-defined borderline bands / critical refinements (absolute values).
// Sex-specific markers keep the ±10% default unless listed here.
const OVERRIDE = {
    fastingglucose: { bLow: 60, bHigh: 125, critLow: 50, critHigh: 400 }, // pre-diabetes 100–125
    'glycatedhemoglobinhba1c': { bHigh: 6.4 },                            // pre-diabetes 5.7–6.4
    uricacid: { bHigh: 8 },                                               // gout risk
    totalcholesterol: { bHigh: 239 },                                     // borderline high 200–239
    'ldlcholesterolcalculated': { bHigh: 159 },                          // borderline high 130–159
    directldl: { bHigh: 159 },
    triglycerides: { bHigh: 199, critHigh: 1000 },                        // borderline 150–199; >1000 pancreatitis
    hscrp: { bHigh: 3 },                                                  // 1–3 average CV risk
    homocysteine: { bHigh: 20 },                                          // 15–20 borderline
    tsh: { bLow: 0.1, bHigh: 10, critLow: 0.01, critHigh: 100 },          // subclinical to 10
    'vitamind25oh': { bLow: 20, bHigh: 150 },                            // insufficient 20–29; toxicity >150
    ferritin: {},
    potassium: { critLow: 2.5, critHigh: 6 },
    calcium: { critLow: 6, critHigh: 13 },
    magnesium: { critLow: 1, critHigh: 4.9 },
    platelets: { critLow: 20, critHigh: 1000 },
};

// Boundaries for one biomarker + one reference band {low, high}.
function boundaries(b, low, high) {
    const crit = b.critical || {};
    let critLow = crit.low != null ? crit.low : null;
    let critHigh = crit.high != null ? crit.high : null;
    // default borderline = ±10% buffer just outside the reference range
    let bLow = low != null && low > 0 ? round(low * 0.9) : null;
    let bHigh = high != null && high < 999 ? round(high * 1.1) : null;

    const ov = OVERRIDE[key(b.name)];
    if (ov) {
        if (ov.bLow !== undefined) bLow = ov.bLow;
        if (ov.bHigh !== undefined) bHigh = ov.bHigh;
        if (ov.critLow !== undefined) critLow = ov.critLow;
        if (ov.critHigh !== undefined) critHigh = ov.critHigh;
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
