const path = require('path');
const { Panel } = require('../models');

// The purchasable "as sold" test list per panel comes from the source-of-truth
// packages.json (e.g. Basic lists "Complete blood count (CBC)" as one line, not
// its 14 expanded components). Keyed by panel name for a quick lookup.
const packagesData = require(path.resolve(__dirname, '..', '..', 'Data', 'Tests', 'packages.json'));
const testsByPanel = {};
for (const p of packagesData.panels) {
  testsByPanel[p.name] = (p.biomarkers || []).map((b) => b.name);
}

// @desc    Get all packages (panels) with their biomarker test lists
// @route   GET /api/packages
// @access  Public
const getPackages = async (req, res) => {
  console.log('API HIT: GET /api/packages');
  try {
    const panels = await Panel.findAll({ raw: true });
    const packages = panels.map((p) => ({
      ...p,
      tests: testsByPanel[p.name] || [],
    }));
    console.log(`Fetched ${packages.length} packages successfully`);
    res.json(packages);
  } catch (error) {
    console.error('CRITICAL ERROR in getPackages:', error);
    res.status(500).json({ message: 'Server Error', details: error.message });
  }
};

module.exports = { getPackages };
