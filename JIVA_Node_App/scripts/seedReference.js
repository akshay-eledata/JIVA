/**
 * Phase 2 — seed reference/catalog data from the source-of-truth JSONs:
 *   Data/Tests/packages.json         (10 functional systems + 10 panels)
 *   Data/Tests/reference_ranges.json (112 biomarkers + ranges/units + composites)
 *
 * Seeds: FunctionalSystem, Biomarker (+ primary system), ReferenceRange,
 *        Panel, PanelBiomarker.
 *
 * Idempotent (findOrCreate). Exports `seedReference()`; also runnable directly:
 *   node scripts/seedReference.js
 */
require('dotenv').config();
const path = require('path');

const {
  sequelize, FunctionalSystem, Biomarker, ReferenceRange, Panel, PanelBiomarker,
} = require('../models');
const { canonicalKey } = require('./lib/classify');

const TESTS_DIR = path.resolve(__dirname, '..', '..', 'Data', 'Tests');
const packages = require(path.join(TESTS_DIR, 'packages.json'));
const ranges = require(path.join(TESTS_DIR, 'reference_ranges.json'));

async function seedReference() {
  // 1) Functional systems ---------------------------------------------------
  const systemByName = {};
  for (let i = 0; i < packages.functionalSystems.length; i++) {
    const s = packages.functionalSystems[i];
    const [row] = await FunctionalSystem.findOrCreate({
      where: { name: s.name },
      defaults: { slug: s.slug, displayName: s.name, sortOrder: i },
    });
    systemByName[s.name] = row;
  }

  // 2) Biomarkers (+ primary system) + reference ranges ---------------------
  const biomarkerByKey = {};
  for (const b of ranges.biomarkers) {
    const key = canonicalKey(b.name);
    const system = systemByName[b.system];
    const [bm] = await Biomarker.findOrCreate({
      where: { canonicalName: key },
      defaults: {
        name: b.name,
        description: b.note || null,
        defaultUnit: b.unit || null,
        functionalSystemId: system ? system.id : null,
      },
    });
    biomarkerByKey[key] = bm;

    // Reference ranges: sex-specific => male + female rows; else one general row.
    const rows = [];
    if (b.type === 'qualitative') {
      // Qualitative markers have no numeric range; skip (status handled at ingest).
    } else if (b.sexSpecific && b.ranges) {
      rows.push({ condition: 'male', ...b.ranges.male });
      rows.push({ condition: 'female', ...b.ranges.female });
    } else if (b.ranges && b.ranges.general) {
      rows.push({ condition: 'general', ...b.ranges.general });
    }
    for (const r of rows) {
      await ReferenceRange.findOrCreate({
        where: { biomarkerId: bm.id, condition: r.condition },
        defaults: {
          minRange: r.low != null ? r.low : null,
          maxRange: r.high != null ? r.high : null,
          unit: b.unit || 'n/a',
        },
      });
    }
  }

  // 3) Panels ---------------------------------------------------------------
  const panelByName = {};
  for (const p of packages.panels) {
    const [panel] = await Panel.findOrCreate({
      where: { name: p.name },
      defaults: { type: p.type, price: p.price, testCount: p.testCount, description: p.description || null },
    });
    panelByName[p.name] = panel;
  }

  // 4) Panel ↔ Biomarker links (expanding composite line items) -------------
  const composites = ranges.compositeExpansions || {};
  let linkCount = 0;
  for (const p of packages.panels) {
    const panel = panelByName[p.name];
    for (const line of p.biomarkers) {
      const targets = composites[line.name] || [line.name];
      for (const t of targets) {
        const bm = biomarkerByKey[canonicalKey(t)];
        if (!bm) {
          console.warn(`  ⚠ panel "${p.name}" line "${t}" has no biomarker record — skipped`);
          continue;
        }
        const [, created] = await PanelBiomarker.findOrCreate({
          where: { panelId: panel.id, biomarkerId: bm.id },
        });
        if (created) linkCount++;
      }
    }
  }

  return {
    systems: Object.keys(systemByName).length,
    biomarkers: Object.keys(biomarkerByKey).length,
    panels: Object.keys(panelByName).length,
    panelLinks: linkCount,
    systemByName,
    biomarkerByKey,
    panelByName,
  };
}

module.exports = { seedReference };

if (require.main === module) {
  (async () => {
    try {
      await sequelize.sync(); // non-destructive when run standalone
      const r = await seedReference();
      console.log(`✅ Seeded ${r.systems} systems, ${r.biomarkers} biomarkers, ${r.panels} panels, ${r.panelLinks} panel-biomarker links.`);
      process.exit(0);
    } catch (err) {
      console.error('✗ seedReference failed:', err);
      process.exit(1);
    }
  })();
}
