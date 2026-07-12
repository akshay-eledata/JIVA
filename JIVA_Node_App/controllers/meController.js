/**
 * /api/me/* — the authenticated patient's Vitality Map feed.
 * All handlers operate on req.user (set by the `protect` middleware).
 */
const {
  PatientProfile, Questionnaire, LabReport, TestResult, FunctionalSystem, Biomarker,
  Diagnosis, FoodRecommendation, ExerciseRecommendation, SupplementRecommendation, SystemSummary,
} = require('../models');

// Latest processed report for a user, with a DEMO fallback.
//
// If the logged-in user has no LabReport of their own, we serve the most recent
// report in the system (the seeded female_29 demo) so the Vitality Map renders
// for ANY login during development. Remove this fallback once reports are
// generated per real user.
async function resolveReport(userId, options = {}) {
  let report = await LabReport.findOne({ where: { userId }, order: [['createdAt', 'DESC']], ...options });
  if (!report) {
    report = await LabReport.findOne({ order: [['createdAt', 'DESC']], ...options }); // demo fallback
  }
  return report;
}

// Continuous heat-map position (D14): 0 = all in range (green), 1 = none (red).
// Borderline counts as half in range.
function spectrumP({ total, inRange, borderline }) {
  if (!total) return 0;
  return +(1 - (inRange + 0.5 * borderline) / total).toFixed(4);
}

// GET /api/me/profile
async function getProfile(req, res) {
  try {
    const profile = await PatientProfile.findOne({ where: { userId: req.user.id } });
    const questionnaire = await Questionnaire.findOne({
      where: { userId: req.user.id }, order: [['createdAt', 'DESC']],
    });
    res.json({ profile, questionnaire: questionnaire ? questionnaire.data : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/me/report/latest — the primary Vitality Map payload.
async function getLatestReport(req, res) {
  try {
    const report = await resolveReport(req.user.id, {
      include: [
        { model: Diagnosis },
        { model: FoodRecommendation },
        { model: ExerciseRecommendation },
        { model: SupplementRecommendation },
        { model: SystemSummary },
      ],
    });
    if (!report) return res.status(404).json({ message: 'No report found for this user' });

    const foods = report.FoodRecommendations || [];
    const byRank = (a, b) => (a.rank || 0) - (b.rank || 0);

    res.json({
      patient: {
        externalPatientId: report.externalPatientId,
        name: report.patientName,
        age: report.age,
        sex: report.sex,
        dateProcessed: report.dateProcessed,
      },
      lab_analysis: {
        totalLabsReviewed: report.totalLabsReviewed,
        inRangeCount: report.inRangeCount,
        borderlineCount: report.borderlineCount,
        outOfRangeCount: report.outOfRangeCount,
        criticalCount: report.criticalCount,
        criticalAlert: report.criticalAlert,
        panelsPresent: report.panelsPresent,
      },
      patient_summary: report.patientSummary,
      diagnoses: (report.Diagnoses || []).sort(byRank),
      foods_to_eat: foods.filter((f) => f.kind === 'eat').sort(byRank),
      foods_to_avoid: foods.filter((f) => f.kind === 'avoid').sort(byRank),
      exercise_recommendations: (report.ExerciseRecommendations || []).sort(byRank),
      supplement_recommendations: (report.SupplementRecommendations || []).sort(byRank),
      system_summaries: report.SystemSummaries || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/me/biomarkers?groupBy=system — 10-system tiles + roll-up counts (D14).
async function getBiomarkersBySystem(req, res) {
  try {
    const report = await resolveReport(req.user.id);
    if (!report) return res.status(404).json({ message: 'No report found for this user' });

    const [systems, results] = await Promise.all([
      FunctionalSystem.findAll({ order: [['sortOrder', 'ASC']] }),
      TestResult.findAll({
        where: { labReportId: report.id },
        include: [{ model: Biomarker }, { model: FunctionalSystem }],
      }),
    ]);

    const bucket = {};
    for (const s of systems) {
      bucket[s.id] = {
        name: s.name, slug: s.slug, displayName: s.displayName || s.name, sortOrder: s.sortOrder,
        counts: { total: 0, inRange: 0, borderline: 0, outOfRange: 0, critical: 0, unknown: 0 },
        biomarkers: [],
      };
    }

    const STATUS_KEY = {
      in_range: 'inRange', borderline: 'borderline', out_of_range: 'outOfRange',
      critical: 'critical', unknown: 'unknown', abnormal: 'outOfRange',
    };

    for (const r of results) {
      const sysId = r.functionalSystemId;
      if (!sysId || !bucket[sysId]) continue; // unmapped labs skipped from tiles
      const b = bucket[sysId];
      b.counts.total++;
      b.counts[STATUS_KEY[r.status] || 'unknown']++;
      b.biomarkers.push({
        testName: r.testName,
        biomarkerName: r.Biomarker ? r.Biomarker.name : r.testName,
        value: r.value,
        numericValue: r.numericValue,
        unit: r.unit,
        refLow: r.refLow,
        refHigh: r.refHigh,
        status: r.status,
        isNormal: r.isNormal,
        panel: r.panel,
      });
    }

    const out = Object.values(bucket)
      .filter((s) => s.counts.total > 0)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({ ...s, spectrumP: spectrumP(s.counts) }));

    res.json({ systems: out });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/me/recommendations?type=food|supplement|exercise&kind=eat|avoid&diagnosis=<text>
async function getRecommendations(req, res) {
  try {
    const report = await resolveReport(req.user.id);
    if (!report) return res.status(404).json({ message: 'No report found for this user' });

    const { type, kind, diagnosis } = req.query;
    const where = { labReportId: report.id };
    const byRank = [['rank', 'ASC']];
    const filterDx = (rows) =>
      diagnosis ? rows.filter((r) => (r.targetDiagnosis || '').includes(diagnosis)) : rows;

    const result = {};
    if (!type || type === 'food') {
      const foods = await FoodRecommendation.findAll({ where, order: byRank });
      const f = filterDx(foods).filter((r) => !kind || r.kind === kind);
      result.foods_to_eat = f.filter((r) => r.kind === 'eat');
      result.foods_to_avoid = f.filter((r) => r.kind === 'avoid');
    }
    if (!type || type === 'exercise') {
      result.exercise_recommendations = filterDx(await ExerciseRecommendation.findAll({ where, order: byRank }));
    }
    if (!type || type === 'supplement') {
      result.supplement_recommendations = filterDx(await SupplementRecommendation.findAll({ where, order: byRank }));
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getProfile, getLatestReport, getBiomarkersBySystem, getRecommendations };
