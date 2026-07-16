/**
 * Phase 2 verification: read back the seeded demo and print the per-system
 * roll-up (the shape Phase 3's /api/me/biomarkers?groupBy=system will serve),
 * confirming counts reconcile with the LabReport rollup.
 * Run: node scripts/verifyDemo.js
 */
require('dotenv').config();
const {
  User, LabReport, TestResult, FunctionalSystem, Diagnosis,
  FoodRecommendation, ExerciseRecommendation, SupplementRecommendation, SystemSummary,
} = require('../models');

(async () => {
  const user = await User.findOne({ where: { email: 'test@jiva.com' } });
  if (!user) { console.error('no demo user'); process.exit(1); }
  const report = await LabReport.findOne({ where: { userId: user.id }, order: [['createdAt', 'DESC']] });

  console.log(`LabReport rollup: total=${report.totalLabsReviewed} in=${report.inRangeCount} borderline=${report.borderlineCount} out=${report.outOfRangeCount} critical=${report.criticalCount}`);
  console.log(`panels_present: ${report.panelsPresent.join(', ')}`);

  const results = await TestResult.findAll({
    where: { labReportId: report.id },
    include: [{ model: FunctionalSystem }],
  });

  const bySystem = {};
  const tally = { in_range: 0, borderline: 0, out_of_range: 0, critical: 0, unknown: 0 };
  for (const r of results) {
    const sys = r.FunctionalSystem ? r.FunctionalSystem.name : '(unmapped)';
    bySystem[sys] = bySystem[sys] || { total: 0, in_range: 0, borderline: 0, out_of_range: 0, critical: 0, unknown: 0 };
    bySystem[sys].total++;
    bySystem[sys][r.status]++;
    tally[r.status]++;
  }

  console.log('\nPer-system roll-up (Phase 3 tile feed):');
  const order = ['Blood','Metabolic','Heart','Liver','Kidney','Electrolytes','Thyroid','Nutrients','Immune/Inflammatory','Hormonal/Reproductive'];
  for (const s of order) {
    const c = bySystem[s]; if (!c) continue;
    const p = (1 - (c.in_range + 0.5 * c.borderline) / c.total).toFixed(2);
    console.log(`  ${s.padEnd(22)} total=${c.total}  in=${c.in_range} borderline=${c.borderline} out=${c.out_of_range} crit=${c.critical}  → spectrum p=${p}`);
  }

  const sum = tally.in_range + tally.borderline + tally.out_of_range + tally.critical + tally.unknown;
  console.log(`\nComputed totals: in=${tally.in_range} borderline=${tally.borderline} out=${tally.out_of_range} critical=${tally.critical} (sum=${sum})`);
  const ok = tally.in_range === report.inRangeCount && tally.borderline === report.borderlineCount &&
             tally.out_of_range === report.outOfRangeCount && tally.critical === report.criticalCount;
  console.log(ok ? '✅ TestResult statuses reconcile with LabReport rollup.' : '⚠ mismatch vs LabReport rollup.');

  const [dx, fe, ex, su, ss] = await Promise.all([
    Diagnosis.count({ where: { labReportId: report.id } }),
    FoodRecommendation.count({ where: { labReportId: report.id } }),
    ExerciseRecommendation.count({ where: { labReportId: report.id } }),
    SupplementRecommendation.count({ where: { labReportId: report.id } }),
    SystemSummary.count({ where: { labReportId: report.id } }),
  ]);
  console.log(`\nEngine children: diagnoses=${dx} foods=${fe} exercise=${ex} supplements=${su} systemSummaries=${ss}`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
