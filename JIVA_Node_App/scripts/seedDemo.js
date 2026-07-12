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
const { seedReference } = require('./seedReference');
const { canonicalKey, classify } = require('./lib/classify');

const TESTS_DIR = path.resolve(__dirname, '..', '..', 'Data', 'Tests');
const DATA_DIR = path.resolve(__dirname, '..', '..', 'Data');
const ranges = require(path.join(TESTS_DIR, 'reference_ranges.json'));
const patientInput = require(path.join(DATA_DIR, 'Sample Patients', 'female_29.json'));
const engineOutput = require(path.join(DATA_DIR, 'Sample Output', 'female_29_output.json'));

const DEMO_EMAIL = 'test@jiva.com';
const DEMO_PASSWORD = 'password123';

// critical thresholds keyed by canonical biomarker name
const critByKey = {};
for (const b of ranges.biomarkers) critByKey[canonicalKey(b.name)] = b.critical || null;

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
  });

  // Test results (from input labs, classified) ------------------------------
  let matched = 0, unmatched = 0;
  for (const lab of patientInput.labs) {
    const key = canonicalKey(lab.test_name);
    const bm = ref.biomarkerByKey[key];
    if (bm) matched++; else { unmatched++; console.warn(`  ⚠ no biomarker for lab "${lab.test_name}"`); }
    const cls = classify(lab.value, lab.reference_range_low, lab.reference_range_high, critByKey[key]);
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
