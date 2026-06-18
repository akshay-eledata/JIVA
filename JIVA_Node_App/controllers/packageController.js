const Package = require('../models/Package');

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
const getPackages = async (req, res) => {
  console.log('API HIT: GET /api/packages');
  try {
    const packages = await Package.findAll({ raw: true });
    console.log(`Fetched ${packages.length} packages successfully`);
    res.json(packages);
  } catch (error) {
    console.error('CRITICAL ERROR in getPackages:', error);
    res.status(500).json({ message: 'Server Error', details: error.message });
  }
};

module.exports = { getPackages };
