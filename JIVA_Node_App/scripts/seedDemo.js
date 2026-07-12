/**
 * Phase 2 — one-command demo bootstrap.
 *
 * Resets the DB, seeds reference data, creates the demo user, and ingests the
 * rebuilt female_29 patient (input + v5 engine output) end-to-end so the
 * Vitality Map can render a real report.
 *
 * ⚠ Runs sequelize.sync({ force: true }) — DROPS AND RECREATES ALL TABLES.
 * Run: node scripts/seedDemo.js
 *
 * Demo credentials: test@jiva.com / password123
 */
require('dotenv').config();
const path = require('path');
const bcrypt = require('bcryptjs');

const db = require('../models');
const {
  sequelize, User, PatientProfile, Questionnaire, LabReport, TestResult,
  Diagnosis, FoodRecommendation, ExerciseRecommendation, SupplementRecommendation, SystemSummary,
} = db;
const XLSX = require('xlsx');
const { seedReference } = require('./seedReference');
const { canonicalKey, classify, classifyExplicit } = require('./lib/classify');

const TESTS_DIR = path.resolve(__dirname, '..', '..', 'Data', 'Tests');
const DATA_DIR = path.resolve(__dirname, '..', '..', 'Data');
const ranges = require(path.join(TESTS_DIR, 'reference_ranges.json'));
const patientInput = require(path.join(DATA_DIR, 'Sample Patients', 'female_29.json'));
const engineOutput = require(path.join(DATA_DIR, 'Sample Output', 'female_29_output.json'));

const DEMO_EMAIL = 'test@jiva.com';
const DEMO_PASSWORD = 'password123';

// critical thresholds keyed by canonical biomarker name (fallback)
const critByKey = {};
for (const b of ranges.biomarkers) critByKey[canonicalKey(b.name)] = b.critical || null;

// 4-tier boundaries from Data/Lab_Ranges.xlsx, keyed by "<biomarker>|<sex>".
const num = (x) => (x === '' || x == null ? null : Number(x));
const rangeByKey = {};
{
  const wb = XLSX.readFile(path.join(DATA_DIR, 'Lab_Ranges.xlsx'));
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  for (const r of rows) {
    rangeByKey[`${canonicalKey(r.Biomarker)}|${String(r.Sex).toLowerCase()}`] = {
      inLow: num(r['In-Range Low']), inHigh: num(r['In-Range High']),
      bLow: num(r['Borderline Low']), bHigh: num(r['Borderline High']),
      critLow: num(r['Critical Low']), critHigh: num(r['Critical High']),
    };
  }
}
// Pick the sex-specific band, else the general band.
const rangeFor = (testName, sex) =>
  rangeByKey[`${canonicalKey(testName)}|${String(sex || '').toLowerCase()}`] ||
  rangeByKey[`${canonicalKey(testName)}|general`] || null;

async function run() {
  console.log('Resetting database (force sync)…');
  await sequelize.sync({ force: true });

  console.log('Seeding reference data…');
  const ref = await seedReference();
  console.log(`  systems=${ref.systems} biomarkers=${ref.biomarkers} panels=${ref.panels} links=${ref.panelLinks}`);

  // Demo user ---------------------------------------------------------------
  const hashed = await bcrypt.hash(DEMO_PASSWORD, await bcrypt.genSalt(10));
  const user = await User.create({ name: 'Demo Patient', email: DEMO_EMAIL, password: hashed });

  // Patient profile + questionnaire (from input) ----------------------------
  const p = patientInput.patient;
  const profile = await PatientProfile.create({
    userId: user.id,
    externalPatientId: p.id,
    name: p.name,
    age: p.age,
    sex: p.sex,
    dateOfCollection: p.date_of_collection,
  });
  await Questionnaire.create({
    userId: user.id,
    patientProfileId: profile.id,
    data: patientInput.questionnaire || {},
  });

  // Lab report (rollup from engine output) ----------------------------------
  const la = engineOutput.lab_analysis;
  const report = await LabReport.create({
    userId: user.id,
    externalPatientId: engineOutput.patient_id,
    patientName: engineOutput.patient_name,
    age: engineOutput.age,
    sex: engineOutput.sex,
    dateProcessed: engineOutput.date_processed,
    totalLabsReviewed: la.total_labs_reviewed,
    inRangeCount: la.in_range_count,
    borderlineCount: la.borderline_count,
    outOfRangeCount: la.out_of_range_count,
    criticalCount: la.critical_count,
    criticalAlert: la.critical_alert,
    panelsPresent: la.panels_present || [],
    patientSummary: engineOutput.patient_summary,
    overallSummary: engineOutput.overall_summary,
  });

  // Test results (from input labs, classified with 4-tier Lab_Ranges) --------
  const patientSex = patientInput.patient.sex;
  const tierTally = { in_range: 0, borderline: 0, out_of_range: 0, critical: 0, unknown: 0 };
  let matched = 0, unmatched = 0;
  for (const lab of patientInput.labs) {
    const key = canonicalKey(lab.test_name);
    const bm = ref.biomarkerByKey[key];
    if (bm) matched++; else { unmatched++; console.warn(`  ⚠ no biomarker for lab "${lab.test_name}"`); }
    const band = rangeFor(lab.test_name, patientSex);
    const cls = band
      ? classifyExplicit(lab.value, band)
      : classify(lab.value, lab.reference_range_low, lab.reference_range_high, critByKey[key]);
    tierTally[cls.status] = (tierTally[cls.status] || 0) + 1;
    await TestResult.create({
      labReportId: report.id,
      userId: user.id,
      biomarkerId: bm ? bm.id : null,
      functionalSystemId: bm ? bm.functionalSystemId : null,
      testName: lab.test_name,
      value: lab.value != null ? String(lab.value) : null,
      numericValue: cls.numericValue,
      unit: lab.unit || null,
      refLow: lab.reference_range_low,
      refHigh: lab.reference_range_high,
      status: cls.status,
      isNormal: cls.isNormal,
      panel: lab.panel || null,
    });
  }

  // Re-sync the report rollup to the 4-tier classification (Lab_Ranges).
  await report.update({
    totalLabsReviewed: patientInput.labs.length,
    inRangeCount: tierTally.in_range,
    borderlineCount: tierTally.borderline,
    outOfRangeCount: tierTally.out_of_range,
    criticalCount: tierTally.critical,
  });

  // Diagnoses ---------------------------------------------------------------
  for (const d of engineOutput.diagnoses || []) {
    await Diagnosis.create({
      labReportId: report.id,
      rank: d.rank,
      diagnosis: d.diagnosis,
      confidence: d.confidence,
      supportingLabs: d.supporting_labs || [],
      clinicalRationale: d.clinical_rationale,
    });
  }

  // Foods (eat + avoid) -----------------------------------------------------
  for (const f of engineOutput.foods_to_eat || []) {
    await FoodRecommendation.create({
      labReportId: report.id, kind: 'eat', rank: f.rank, food: f.food,
      quantityFrequency: f.quantity_frequency, targetDiagnosis: f.target_diagnosis, rationale: f.why_it_helps,
    });
  }
  for (const f of engineOutput.foods_to_avoid || []) {
    await FoodRecommendation.create({
      labReportId: report.id, kind: 'avoid', rank: f.rank, food: f.food,
      avoidanceLevel: f.avoidance_level, reductionTarget: f.reduction_target,
      targetDiagnosis: f.target_diagnosis, rationale: f.why_to_avoid,
    });
  }

  // Exercise ----------------------------------------------------------------
  for (const e of engineOutput.exercise_recommendations || []) {
    await ExerciseRecommendation.create({
      labReportId: report.id, rank: e.rank, exerciseType: e.exercise_type,
      frequency: e.frequency, duration: e.duration, intensity: e.intensity,
      targetDiagnosis: e.target_diagnosis, whyItHelps: e.why_it_helps, safetyNotes: e.safety_notes,
    });
  }

  // Supplements -------------------------------------------------------------
  for (const s of engineOutput.supplement_recommendations || []) {
    await SupplementRecommendation.create({
      labReportId: report.id, rank: s.rank, supplementName: s.supplement_name,
      dosageRange: s.dosage_range, timing: s.timing, targetDiagnosis: s.target_diagnosis,
      whyItHelps: s.why_it_helps, safetyNote: s.safety_note,
      localAvailabilityNote: s.local_availability_note, startTier: s.start_tier,
    });
  }

  // System summaries (linked to canonical FunctionalSystem by name) ---------
  for (const s of engineOutput.system_summaries || []) {
    const sys = ref.systemByName[s.system_name];
    await SystemSummary.create({
      labReportId: report.id,
      systemName: s.system_name,
      functionalSystemId: sys ? sys.id : null,
      biomarkersIncluded: s.biomarkers_included || [],
      summary: s.summary,
    });
  }

  console.log('\n✅ Demo seeded.');
  console.log(`   user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  console.log(`   labs: ${matched} matched, ${unmatched} unmatched | report ${report.id}`);
  console.log(`   diagnoses=${(engineOutput.diagnoses||[]).length} foods_eat=${(engineOutput.foods_to_eat||[]).length} foods_avoid=${(engineOutput.foods_to_avoid||[]).length} exercise=${(engineOutput.exercise_recommendations||[]).length} supplements=${(engineOutput.supplement_recommendations||[]).length} systemSummaries=${(engineOutput.system_summaries||[]).length}`);
}

run()
  .then(() => process.exit(0))
  .catch((err) => { console.error('✗ seedDemo failed:', err); process.exit(1); });
