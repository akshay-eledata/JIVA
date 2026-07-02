const TestResult = require('../models/TestResult');
const Biomarker = require('../models/Biomarker');
const Category = require('../models/Category');

// @desc    Get user's test results grouped by category buckets
// @route   GET /api/test-results
// @access  Private
const getTestResultsGroupedByCategory = async (req, res) => {
  try {
    // 1. Fetch all test results belonging to the logged-in user,
    // including their Biomarker and the associated Categories (Many-to-Many).
    const results = await TestResult.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Biomarker,
          include: [
            {
              model: Category,
              through: { attributes: [] } // Exclude the junction table meta attributes
            }
          ]
        }
      ]
    });

    // 2. Initialize a dictionary to group the results
    const groupedResults = {};

    // 3. Loop through results and place them in their respective category buckets
    results.forEach(result => {
      const biomarker = result.Biomarker;
      if (!biomarker) return;

      const categories = biomarker.Categories || [];

      // If this biomarker has categories, push this test result into EACH category bucket.
      // This enforces the rule that a single test can show up in multiple categories (e.g. Cardio and Metabolic).
      if (categories.length > 0) {
        categories.forEach(cat => {
          const categoryName = cat.name;
          if (!groupedResults[categoryName]) {
            groupedResults[categoryName] = [];
          }
          groupedResults[categoryName].push({
            id: result.id,
            value: result.value,
            dateTested: result.dateTested,
            isNormal: result.isNormal,
            biomarker: {
              id: biomarker.id,
              name: biomarker.name,
              description: biomarker.description
            }
          });
        });
      } else {
        // Fallback for uncategorized biomarkers
        const fallbackKey = 'Uncategorized';
        if (!groupedResults[fallbackKey]) {
          groupedResults[fallbackKey] = [];
        }
        groupedResults[fallbackKey].push({
          id: result.id,
          value: result.value,
          dateTested: result.dateTested,
          isNormal: result.isNormal,
          biomarker: {
            id: biomarker.id,
            name: biomarker.name,
            description: biomarker.description
          }
        });
      }
    });

    res.json(groupedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching test results' });
  }
};

module.exports = { getTestResultsGroupedByCategory };
