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

// @desc    Add-on panels ranked by how many flagged markers they cover.
// @route   GET /api/me/recommended-panels?visit=1&biomarker=Vitamin%20D
// @access  Private
const getRecommendedPanels = async (req, res) => {
  const visit = req.query.visit != null ? Number(req.query.visit) : undefined;
  // Optional: spotlight the panels covering one specific marker, used when the
  // patient arrives from a biomarker detail page.
  const focus = (req.query.biomarker || '').trim().toLowerCase();

  try {
    const report = await resolveReport(req.user.id, visit);
    if (!report) {
      return res.json({ flaggedCount: 0, flaggedSystems: [], focusMatched: false, panels: [] });
    }

    const flaggedResults = await TestResult.findAll({
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
      let coversFocus = false;
      for (const id of biomarkerIds) {
        const hit = flaggedById.get(id);
        if (hit) {
          matched.push(hit);
          if (focus && hit.name.toLowerCase() === focus) coversFocus = true;
        }
      }
      if (coversFocus) focusMatched = true;
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        testCount: p.testCount,
        matchCount: matched.length,
        // Cap the explanation: a card has room for a few names, not twenty.
        matchedBiomarkers: matched.slice(0, 4).map((m) => m.name),
        coversFocus,
      };
    });

    // Best coverage first; panels covering the focused marker jump the queue.
    panels.sort((a, b) => (b.coversFocus ? 1 : 0) - (a.coversFocus ? 1 : 0) || b.matchCount - a.matchCount);

    const flaggedSystems = [...systemCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    res.json({
      visit: report.visit,
      flaggedCount: flaggedResults.length,
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
