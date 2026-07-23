/**
 * /api/me/report-status — what the JIVA engine has produced, or will produce.
 *
 * The dashboard is the screen people land on straight after booking a draw,
 * when there is nothing to show yet. Rather than filling that gap with generic
 * marketing cards, this endpoint reports the shape of the report they are
 * waiting for: which panels they bought, how many markers those panels carry,
 * and how many systems get scored. Once a report exists the same endpoint
 * switches to the real figures, so the dashboard can stop promising and start
 * summarising without the client having to guess which state it is in.
 */
const {
  LabReport, Order, Panel, FunctionalSystem, Diagnosis,
  FoodRecommendation, ExerciseRecommendation, SupplementRecommendation,
  PatientProfile,
} = require('../models');

// Mirrors meController.resolveReport: fall back to seeded data so the demo
// login sees a populated dashboard.
async function resolveReport(userId) {
  let report = await LabReport.findOne({ where: { userId }, order: [['visit', 'DESC']] });
  if (!report) report = await LabReport.findOne({ order: [['visit', 'DESC']] });
  return report;
}

/**
 * The panels this patient has paid for, with the marker count each one carries.
 *
 * Falls back to the base panel: somebody who has paid but whose order has not
 * settled yet is still getting the base draw, and quoting zero markers while
 * they wait would read as though nothing had been bought.
 */
async function purchasedPanels(userId) {
  const orders = await Order.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
  const paid = orders.filter((o) => o.status !== 'cancelled');
  const ids = [...new Set(paid.flatMap((o) => o.packageIds || []))];

  let panels = ids.length ? await Panel.findAll({ where: { id: ids } }) : [];
  if (!panels.length) panels = await Panel.findAll({ where: { type: 'base' } });

  return panels.map((p) => ({ name: p.name, testCount: p.testCount, type: p.type }));
}

// @desc    Report progress and contents, whether pending or delivered.
// @route   GET /api/me/report-status
// @access  Private
const getReportStatus = async (req, res) => {
  try {
    const [report, panels, systemCount, profile] = await Promise.all([
      resolveReport(req.user.id),
      purchasedPanels(req.user.id),
      FunctionalSystem.count(),
      PatientProfile.findOne({ where: { userId: req.user.id } }),
    ]);

    const base = {
      panels,
      // What the draw covers. Real once a report lands, projected until then.
      expectedBiomarkers: panels.reduce((n, p) => n + (p.testCount || 0), 0),
      systemCount,
    };

    if (!report) {
      return res.json({ ...base, hasReport: false });
    }

    const [findings, foods, exercises, supplements] = await Promise.all([
      Diagnosis.findAll({ where: { labReportId: report.id }, order: [['rank', 'ASC']] }),
      FoodRecommendation.findAll({ where: { labReportId: report.id } }),
      ExerciseRecommendation.count({ where: { labReportId: report.id } }),
      SupplementRecommendation.count({ where: { labReportId: report.id } }),
    ]);

    const top = findings[0];

    res.json({
      ...base,
      hasReport: true,
      visit: report.visit,
      dateProcessed: report.dateProcessed,
      biologicalAge: report.biologicalAge,
      chronologicalAge: profile ? profile.age : null,
      totalLabsReviewed: report.totalLabsReviewed,
      inRangeCount: report.inRangeCount,
      borderlineCount: report.borderlineCount,
      outOfRangeCount: report.outOfRangeCount,
      criticalCount: report.criticalCount,
      findingCount: findings.length,
      topFinding: top ? { diagnosis: top.diagnosis, confidence: top.confidence } : null,
      foodsToEat: foods.filter((f) => f.kind === 'eat').length,
      foodsToAvoid: foods.filter((f) => f.kind === 'avoid').length,
      exerciseCount: exercises,
      supplementCount: supplements,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReportStatus };
