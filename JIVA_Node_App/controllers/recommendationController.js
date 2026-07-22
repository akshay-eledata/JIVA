/**
 * /api/me/recommended-panels — which add-on panels are worth buying next.
 *
 * A patient can top up their next draw at any time, not just after a retest, so
 * this ranks add-on panels by how many of the patient's currently flagged
 * markers each one actually covers. That makes "recommended for you" a fact
 * about their results rather than a marketing label.
 */
const { Op } = require('sequelize');
const {
  LabReport, TestResult, Panel, PanelBiomarker, Biomarker, FunctionalSystem,
} = require('../models');

// Statuses worth re-testing. In-range markers do not justify an upsell.
const FLAGGED = ['borderline', 'out_of_range', 'critical', 'abnormal'];

// Ordering used to decide whether a marker moved the wrong way between draws.
const STATUS_SCORE = { in_range: 0, borderline: 1, out_of_range: 2, critical: 3, unknown: 1, abnormal: 2 };

// Same resolution rule as the Vitality Map: default to the first visit so the
// recommendations line up with the report the patient is looking at.
async function resolveReport(userId, visit) {
  const where = visit != null ? { userId, visit } : { userId };
  const order = visit != null ? [['createdAt', 'ASC']] : [['visit', 'ASC']];
  let report = await LabReport.findOne({ where, order });
  if (!report) {
    // Demo fallback, mirroring meController: serve seeded data to any login.
    report = await LabReport.findOne({
      where: visit != null ? { visit } : {},
      order,
    });
  }
  return report;
}

/**
 * Markers that moved the wrong way between two draws.
 *
 * This is deliberately broader than "currently flagged": a marker that slid
 * from in-range to borderline is still technically fine but is exactly what a
 * follow-up panel should watch. Mirrors the statusChange logic in
 * meController.getCompare so both screens agree on what "declined" means.
 */
async function declinedSince(userId, fromVisit, toVisit) {
  const [fromReport, toReport] = await Promise.all([
    resolveReport(userId, fromVisit),
    resolveReport(userId, toVisit),
  ]);
  if (!fromReport || !toReport) return null;

  const [fromResults, toResults] = await Promise.all([
    TestResult.findAll({ where: { labReportId: fromReport.id } }),
    TestResult.findAll({
      where: { labReportId: toReport.id },
      include: [{ model: Biomarker }, { model: FunctionalSystem }],
    }),
  ]);

  const prevByTest = new Map();
  for (const r of fromResults) prevByTest.set(r.testName, r);

  const declined = [];
  for (const r of toResults) {
    const prev = prevByTest.get(r.testName);
    if (!prev) continue;
    const prevScore = STATUS_SCORE[prev.status] ?? 1;
    const curScore = STATUS_SCORE[r.status] ?? 1;
    if (curScore > prevScore) declined.push(r);
  }
  return { report: toReport, results: declined };
}

// @desc    Add-on panels ranked by how many relevant markers they cover.
// @route   GET /api/me/recommended-panels?visit=1&basis=change&biomarker=Vitamin%20D
// @access  Private
const getRecommendedPanels = async (req, res) => {
  const visit = req.query.visit != null ? Number(req.query.visit) : undefined;
  // basis=change ranks by markers that declined since the previous draw rather
  // than by whatever is currently out of range. Used from the retest view.
  const basis = req.query.basis === 'change' ? 'change' : 'flagged';
  // Optional: spotlight the panels covering one specific marker, used when the
  // patient arrives from a biomarker detail page.
  const focus = (req.query.biomarker || '').trim().toLowerCase();

  try {
    let report;
    let flaggedResults;
    let declinedResults = null;

    if (basis === 'change') {
      const toVisit = visit != null ? visit : 2;
      const changed = await declinedSince(req.user.id, toVisit - 1, toVisit);
      // With no prior draw to compare against there is no change to act on, so
      // fall back to the flagged view rather than returning nothing.
      if (changed) {
        report = changed.report;
        declinedResults = changed.results;
      }
    }

    report = report || (await resolveReport(req.user.id, visit));
    if (!report) {
      return res.json({ basis: 'flagged', flaggedCount: 0, declinedCount: 0, flaggedSystems: [], focusMatched: false, panels: [] });
    }

    // Currently-flagged markers are always loaded. In change mode they act as
    // the secondary ranking signal: declines lead, but a panel covering markers
    // that are still out of range beats one covering nothing at all. Most
    // declines tend to sit in basic-panel markers no add-on can re-test, so
    // ranking on declines alone would leave the list looking empty.
    flaggedResults = await TestResult.findAll({
      where: { labReportId: report.id, status: { [Op.in]: FLAGGED } },
      include: [{ model: Biomarker }, { model: FunctionalSystem }],
    });

    // Map flagged biomarkerIds to a display name so we can explain each match.
    const flaggedById = new Map();
    const systemCounts = new Map();
    for (const r of flaggedResults) {
      if (r.biomarkerId) {
        flaggedById.set(r.biomarkerId, {
          name: r.Biomarker ? r.Biomarker.name : r.testName,
          status: r.status,
        });
      }
      const sys = r.FunctionalSystem;
      if (sys) {
        const key = sys.displayName || sys.name;
        systemCounts.set(key, (systemCounts.get(key) || 0) + 1);
      }
    }

    // The declined set drives both the ranking and the headline in change mode.
    const declinedById = new Map();
    const declinedSystemCounts = new Map();
    for (const r of declinedResults || []) {
      if (r.biomarkerId) {
        declinedById.set(r.biomarkerId, {
          name: r.Biomarker ? r.Biomarker.name : r.testName,
          status: r.status,
        });
      }
      const sys = r.FunctionalSystem;
      if (sys) {
        const key = sys.displayName || sys.name;
        declinedSystemCounts.set(key, (declinedSystemCounts.get(key) || 0) + 1);
      }
    }

    const [addonPanels, links] = await Promise.all([
      Panel.findAll({ where: { type: 'addon' } }),
      PanelBiomarker.findAll({ raw: true }),
    ]);

    const linksByPanel = new Map();
    for (const l of links) {
      if (!linksByPanel.has(l.panelId)) linksByPanel.set(l.panelId, []);
      linksByPanel.get(l.panelId).push(l.biomarkerId);
    }

    let focusMatched = false;
    const panels = addonPanels.map((p) => {
      const biomarkerIds = linksByPanel.get(p.id) || [];
      const matched = [];
      const declinedMatched = [];
      let coversFocus = false;
      for (const id of biomarkerIds) {
        const hit = flaggedById.get(id);
        if (hit) {
          matched.push(hit);
          if (focus && hit.name.toLowerCase() === focus) coversFocus = true;
        }
        const dec = declinedById.get(id);
        if (dec) {
          declinedMatched.push(dec);
          if (focus && dec.name.toLowerCase() === focus) coversFocus = true;
        }
      }
      if (coversFocus) focusMatched = true;
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        testCount: p.testCount,
        matchCount: matched.length,
        declinedCount: declinedMatched.length,
        // Cap the explanation: a card has room for a few names, not twenty.
        matchedBiomarkers: matched.slice(0, 4).map((m) => m.name),
        declinedBiomarkers: declinedMatched.slice(0, 4).map((m) => m.name),
        coversFocus,
      };
    });

    // Focused marker first, then declines (change mode), then raw coverage.
    panels.sort((a, b) =>
      (b.coversFocus ? 1 : 0) - (a.coversFocus ? 1 : 0)
      || b.declinedCount - a.declinedCount
      || b.matchCount - a.matchCount);

    const flaggedSystems = [...systemCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    res.json({
      // Reported back so the UI can word the explanation correctly: markers
      // that declined read differently from markers that are out of range.
      basis: declinedResults ? basis : 'flagged',
      visit: report.visit,
      flaggedCount: flaggedResults.length,
      declinedCount: declinedResults ? declinedResults.length : 0,
      declinedSystems: [...declinedSystemCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
      outOfRangeCount: report.outOfRangeCount,
      borderlineCount: report.borderlineCount,
      flaggedSystems,
      focusMatched,
      panels,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendedPanels };
