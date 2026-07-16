/**
 * /api/me/* — the authenticated patient's Vitality Map feed.
 * All handlers operate on req.user (set by the `protect` middleware).
 */
const {
  PatientProfile, Questionnaire, LabReport, TestResult, FunctionalSystem, Biomarker,
  Diagnosis, FoodRecommendation, ExerciseRecommendation, SupplementRecommendation, SystemSummary,
} = require('../models');

// Resolve a report for a user, optionally pinned to a specific `visit`.
//
// Default (no visit): the FIRST visit (lowest visit number) so the original
// Vitality Map keeps rendering visit 1 unchanged even after a retest is added.
// Vitality Map 2 asks for `?visit=2` explicitly.
//
// DEMO fallback: if the logged-in user has no report of their own, we serve the
// most recent seeded report (the female_29 demo) so any login renders during
// development. Remove this fallback once reports are generated per real user.
async function resolveReport(userId, options = {}) {
  const { visit, ...findOptions } = options;
  const order = visit != null ? [['createdAt', 'ASC']] : [['visit', 'ASC']];
  const ownWhere = visit != null ? { userId, visit } : { userId };

  let report = await LabReport.findOne({ where: ownWhere, order, ...findOptions });
  if (!report) {
    // Demo fallback keyed off whichever user's data was seeded.
    const demoWhere = visit != null ? { visit } : {};
    report = await LabReport.findOne({
      where: demoWhere,
      order: visit != null ? [['createdAt', 'ASC']] : [['visit', 'ASC']],
      ...findOptions,
    });
  }
  return report;
}

// Continuous heat-map position (D14): 0 = all in range (green), 1 = none (red).
// Borderline counts as half in range.
function spectrumP({ total, inRange, borderline }) {
  if (!total) return 0;
  return +(1 - (inRange + 0.5 * borderline) / total).toFixed(4);
}

const STATUS_KEY = {
  in_range: 'inRange', borderline: 'borderline', out_of_range: 'outOfRange',
  critical: 'critical', unknown: 'unknown', abnormal: 'outOfRange',
};

// Build the per-system rollup (tiles + biomarker lists) for one report.
async function systemRollup(report) {
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

  return Object.values(bucket)
    .filter((s) => s.counts.total > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => ({ ...s, spectrumP: spectrumP(s.counts) }));
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

// GET /api/me/report/latest[?visit=N] — the primary Vitality Map payload.
async function getLatestReport(req, res) {
  try {
    const visit = req.query.visit != null ? Number(req.query.visit) : undefined;
    const report = await resolveReport(req.user.id, {
      visit,
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
      visit: report.visit,
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
      overall_summary: report.overallSummary,
      biological_age: report.biologicalAge,
      biological_age_explanation: report.biologicalAgeExplanation,
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

// GET /api/me/biomarkers?groupBy=system[&visit=N] — 10-system tiles + roll-up counts (D14).
async function getBiomarkersBySystem(req, res) {
  try {
    const visit = req.query.visit != null ? Number(req.query.visit) : undefined;
    const report = await resolveReport(req.user.id, { visit });
    if (!report) return res.status(404).json({ message: 'No report found for this user' });

    const out = await systemRollup(report);
    res.json({ visit: report.visit, systems: out });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/me/compare?from=1&to=2 — before/after diff between two visits.
// Powers the Vitality Map 2 "Compare Biomarkers" view. Returns per-system and
// per-biomarker deltas plus the headline metrics (biological age, roll-up counts).
async function getCompare(req, res) {
  try {
    const fromVisit = req.query.from != null ? Number(req.query.from) : 1;
    const toVisit = req.query.to != null ? Number(req.query.to) : 2;

    const [fromReport, toReport] = await Promise.all([
      resolveReport(req.user.id, { visit: fromVisit }),
      resolveReport(req.user.id, { visit: toVisit }),
    ]);
    if (!fromReport || !toReport) {
      return res.status(404).json({ message: 'Both visits are required to compare' });
    }

    const [fromSystems, toSystems, toSummaries] = await Promise.all([
      systemRollup(fromReport),
      systemRollup(toReport),
      SystemSummary.findAll({ where: { labReportId: toReport.id } }),
    ]);

    // Lower spectrumP is healthier; a marker moving toward in-range is "improved".
    const STATUS_SCORE = { in_range: 0, borderline: 1, out_of_range: 2, critical: 3, unknown: 1 };
    const summaryByName = {};
    for (const s of toSummaries) summaryByName[s.systemName] = s.summary;

    const fromByName = {};
    for (const s of fromSystems) fromByName[s.name] = s;

    const systemDeltas = toSystems.map((to) => {
      const from = fromByName[to.name];
      const bmFrom = {};
      if (from) for (const b of from.biomarkers) bmFrom[b.testName] = b;

      // Per-biomarker before/after within this system.
      const biomarkers = to.biomarkers.map((b) => {
        const prev = bmFrom[b.testName];
        const prevScore = prev ? STATUS_SCORE[prev.status] : null;
        const curScore = STATUS_SCORE[b.status];
        let statusChange = 'same';
        if (prevScore != null) {
          if (curScore < prevScore) statusChange = 'improved';
          else if (curScore > prevScore) statusChange = 'worsened';
        }
        const prevNum = prev ? prev.numericValue : null;
        const curNum = b.numericValue;
        const numericDelta = prevNum != null && curNum != null ? +(curNum - prevNum).toFixed(2) : null;
        return {
          testName: b.testName,
          biomarkerName: b.biomarkerName,
          unit: b.unit,
          from: prev ? { value: prev.value, numericValue: prevNum, status: prev.status } : null,
          to: { value: b.value, numericValue: curNum, status: b.status },
          numericDelta,
          statusChange,
          enteredRange: prev && prev.status !== 'in_range' && b.status === 'in_range',
          leftRange: prev && prev.status === 'in_range' && b.status !== 'in_range',
        };
      });

      const improved = biomarkers.filter((b) => b.statusChange === 'improved').length;
      const worsened = biomarkers.filter((b) => b.statusChange === 'worsened').length;
      const deltaSpectrum = from ? +(to.spectrumP - from.spectrumP).toFixed(4) : 0;

      return {
        name: to.name,
        displayName: to.displayName,
        summary: summaryByName[to.name] || '',
        from: from ? { spectrumP: from.spectrumP, counts: from.counts } : null,
        to: { spectrumP: to.spectrumP, counts: to.counts },
        deltaSpectrum,               // negative = improved (moved toward in-range)
        improvedCount: improved,
        worsenedCount: worsened,
        biomarkers,
      };
    });

    const allBm = systemDeltas.flatMap((s) => s.biomarkers);
    const headline = {
      improved: allBm.filter((b) => b.statusChange === 'improved').length,
      worsened: allBm.filter((b) => b.statusChange === 'worsened').length,
      enteredRange: allBm.filter((b) => b.enteredRange).length,
      leftRange: allBm.filter((b) => b.leftRange).length,
    };

    const meta = (r) => ({
      visit: r.visit,
      dateProcessed: r.dateProcessed,
      biologicalAge: r.biologicalAge,
      biologicalAgeExplanation: r.biologicalAgeExplanation,
      age: r.age,
      counts: {
        total: r.totalLabsReviewed,
        inRange: r.inRangeCount,
        borderline: r.borderlineCount,
        outOfRange: r.outOfRangeCount,
        critical: r.criticalCount,
      },
    });

    res.json({
      from: meta(fromReport),
      to: meta(toReport),
      headline,
      systemDeltas,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Normalize a test/biomarker name into a stable lookup key (matches ingest).
const canon = (s) => String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, '');

// GET /api/me/biomarker/history?name=<testName>
// All values for one biomarker across every draw (visits + historical), ordered
// by date — powers the per-biomarker trend graph. Includes the 4-tier band so
// the graph can shade in-range / borderline / out-of-range / critical zones.
async function getBiomarkerHistory(req, res) {
  try {
    const name = req.query.name;
    if (!name) return res.status(400).json({ message: 'Query param "name" is required' });
    const key = canon(name);

    // The user's reports, or the demo patient's as a fallback (dev only).
    let reports = await LabReport.findAll({ where: { userId: req.user.id } });
    if (!reports.length) reports = await LabReport.findAll();
    if (!reports.length) return res.status(404).json({ message: 'No reports found' });
    const reportById = {};
    for (const r of reports) reportById[r.id] = r;

    const results = await TestResult.findAll({
      where: { labReportId: reports.map((r) => r.id) },
      include: [{ model: Biomarker }],
    });

    const points = results
      .filter((r) => canon(r.testName) === key)
      .map((r) => {
        const rep = reportById[r.labReportId];
        return {
          date: rep ? rep.dateProcessed : null,
          visit: rep ? rep.visit : null,
          value: r.value,
          numericValue: r.numericValue,
          status: r.status,
          unit: r.unit,
          refLow: r.refLow,
          refHigh: r.refHigh,
          band: r.tierBand || null,
          biomarkerName: r.Biomarker ? r.Biomarker.name : r.testName,
        };
      })
      .filter((p) => p.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (!points.length) return res.status(404).json({ message: 'No history for this biomarker' });

    const band = points.map((p) => p.band).find(Boolean) || null;
    res.json({
      testName: name,
      biomarkerName: points[0].biomarkerName,
      unit: points.find((p) => p.unit)?.unit || null,
      refLow: points.find((p) => p.refLow != null)?.refLow ?? null,
      refHigh: points.find((p) => p.refHigh != null)?.refHigh ?? null,
      band,
      points,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/me/recommendations?type=food|supplement|exercise&kind=eat|avoid&diagnosis=<text>[&visit=N]
async function getRecommendations(req, res) {
  try {
    const visit = req.query.visit != null ? Number(req.query.visit) : undefined;
    const report = await resolveReport(req.user.id, { visit });
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

module.exports = { getProfile, getLatestReport, getBiomarkersBySystem, getCompare, getBiomarkerHistory, getRecommendations };
