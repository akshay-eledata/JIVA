/**
 * Phase 0 generator.
 *
 * 1. Fills the "Functional System" column (col D) in `Data/Tests/JIVA PACKAGE.xlsx`
 *    for every add-on panel biomarker, using the locked 10-system taxonomy
 *    (see Data/plan.md §4).
 * 2. Emits a machine-readable `Data/Tests/packages.json` for deterministic seeding.
 *
 * Re-runnable / idempotent. Run: `node scripts/buildPackages.js`
 */

const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

const DATA_DIR = path.resolve(__dirname, '..', '..', 'Data', 'Tests');
const XLSX_PATH = path.join(DATA_DIR, 'JIVA PACKAGE.xlsx');
const JSON_PATH = path.join(DATA_DIR, 'packages.json');
const SHEET_NAME = 'JIVA Packages';

// The canonical 10 functional systems.
const FUNCTIONAL_SYSTEMS = [
  { name: 'Blood', slug: 'blood' },
  { name: 'Metabolic', slug: 'metabolic' },
  { name: 'Heart', slug: 'heart' },
  { name: 'Liver', slug: 'liver' },
  { name: 'Kidney', slug: 'kidney' },
  { name: 'Electrolytes', slug: 'electrolytes' },
  { name: 'Thyroid', slug: 'thyroid' },
  { name: 'Nutrients', slug: 'nutrients' },
  { name: 'Immune/Inflammatory', slug: 'immune-inflammatory' },
  { name: 'Hormonal/Reproductive', slug: 'hormonal-reproductive' }
];

// Short aliases used below.
const HR = 'Hormonal/Reproductive';
const II = 'Immune/Inflammatory';

// Per-panel functional-system assignment, in biomarker serial order.
// Keys are the leading panel number in the spreadsheet (panel 1 is the
// Basic Panel, which is already filled in the sheet, so it is omitted here).
const PANEL_SYSTEMS = {
  2: ['Heart', 'Heart', 'Heart', 'Heart', 'Heart', 'Heart', 'Heart', 'Heart', 'Heart', 'Heart', 'Heart'],
  3: [HR, HR, HR, HR, HR, HR, HR, HR, HR],
  4: [HR, HR, HR, HR, HR, HR, HR, HR, HR, HR],
  5: ['Thyroid', 'Thyroid', 'Thyroid', 'Thyroid', 'Thyroid'],
  6: ['Nutrients', 'Nutrients', 'Nutrients', 'Nutrients', 'Nutrients', 'Nutrients', 'Blood', 'Blood', 'Blood', 'Nutrients', 'Nutrients', 'Nutrients', 'Nutrients'],
  7: [HR, HR, HR, 'Heart', II, 'Heart', 'Metabolic', HR, 'Nutrients'],
  8: [II, II, II, II, II, II, II, II, II, II],
  9: ['Heart', 'Nutrients', 'Nutrients', 'Thyroid', HR, 'Metabolic', 'Nutrients', 'Heart', 'Heart'],
  10: ['Liver', 'Liver', 'Liver', 'Liver', 'Liver', 'Liver', 'Liver', 'Liver', 'Liver', 'Liver']
};

const PANEL_PRICES = { base: 299.0, addon: 99.0 };

// Regexes to classify rows by column A.
const HEADER_RE = /^\s*(\d+)\.\s+\S/;      // e.g. "2. Heart (Cardiometabolic)  (11 tests)"
const ITEM_RE = /^\s*\d+\.\s*$/;            // e.g. "  1."

function cleanPanelName(headerText, panelNum) {
  // Strip leading "N." and trailing "(N tests)".
  let name = headerText.replace(/^\s*\d+\.\s*/, '').replace(/\s*\(\d+\s*tests?\)\s*$/i, '').trim();
  if (panelNum === 1) name = 'JIVA Basic Panel';
  return name;
}

function parseTestCount(headerText) {
  const m = headerText.match(/\((\d+)\s*tests?\)/i);
  return m ? parseInt(m[1], 10) : null;
}

function main() {
  if (!fs.existsSync(XLSX_PATH)) {
    throw new Error(`Spreadsheet not found: ${XLSX_PATH}`);
  }

  const wb = xlsx.readFile(XLSX_PATH);
  const sheet = wb.Sheets[SHEET_NAME];
  if (!sheet) throw new Error(`Sheet "${SHEET_NAME}" not found`);

  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  const packages = [];
  let currentPanel = null;   // { num, name, type, testCount, biomarkers: [] }
  let itemIdx = 0;
  let filledCount = 0;

  for (let r = 0; r < rows.length; r++) {
    const colA = String(rows[r][0] || '');
    const colC = String(rows[r][2] || '').trim();

    const headerMatch = colA.match(HEADER_RE);
    if (headerMatch) {
      const num = parseInt(headerMatch[1], 10);
      currentPanel = {
        num,
        name: cleanPanelName(colA, num),
        type: num === 1 ? 'base' : 'addon',
        price: num === 1 ? PANEL_PRICES.base : PANEL_PRICES.addon,
        testCount: parseTestCount(colA),
        biomarkers: []
      };
      packages.push(currentPanel);
      itemIdx = 0;
      continue;
    }

    if (currentPanel && ITEM_RE.test(colA) && colC) {
      let system;
      if (currentPanel.num === 1) {
        // Basic panel already has its system filled in column D.
        system = String(rows[r][3] || '').trim();
      } else {
        const assign = PANEL_SYSTEMS[currentPanel.num];
        if (!assign) throw new Error(`No system mapping for panel ${currentPanel.num}`);
        system = assign[itemIdx];
        if (!system) {
          throw new Error(`Missing system for panel ${currentPanel.num} item #${itemIdx + 1} (${colC})`);
        }
        // Write it into the sheet (column D === column index 3).
        const addr = xlsx.utils.encode_cell({ r, c: 3 });
        sheet[addr] = { t: 's', v: system };
        filledCount++;
      }
      currentPanel.biomarkers.push({ name: colC, system });
      itemIdx++;
    }
  }

  // Validate the assignment arrays matched the actual biomarker counts.
  for (const pkg of packages) {
    if (pkg.num === 1) continue;
    const expected = PANEL_SYSTEMS[pkg.num].length;
    if (pkg.biomarkers.length !== expected) {
      throw new Error(
        `Panel ${pkg.num} (${pkg.name}): parsed ${pkg.biomarkers.length} biomarkers but mapping has ${expected}`
      );
    }
    if (pkg.testCount && pkg.testCount !== pkg.biomarkers.length) {
      console.warn(`  ! Panel ${pkg.num} header says ${pkg.testCount} tests but ${pkg.biomarkers.length} rows parsed`);
    }
  }

  // Persist the updated spreadsheet (column D now complete for all panels).
  xlsx.writeFile(wb, XLSX_PATH);

  // Emit packages.json.
  const output = {
    generatedAt: new Date().toISOString(),
    functionalSystems: FUNCTIONAL_SYSTEMS,
    panels: packages.map(p => ({
      name: p.name,
      type: p.type,
      price: p.price,
      testCount: p.biomarkers.length,
      biomarkers: p.biomarkers
    }))
  };
  fs.writeFileSync(JSON_PATH, JSON.stringify(output, null, 2) + '\n');

  // Report.
  console.log(`Filled ${filledCount} add-on biomarker rows in the spreadsheet.`);
  console.log(`Wrote ${JSON_PATH}`);
  console.log('');
  console.log('Panels:');
  packages.forEach(p => {
    const bySystem = {};
    p.biomarkers.forEach(b => { bySystem[b.system] = (bySystem[b.system] || 0) + 1; });
    const breakdown = Object.entries(bySystem).map(([s, n]) => `${s}:${n}`).join(', ');
    console.log(`  [${p.type}] ${p.name} (${p.biomarkers.length}) -> ${breakdown}`);
  });
}

main();
