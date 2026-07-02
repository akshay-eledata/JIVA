const express = require('express');
const router = express.Router();
const { getTestResultsGroupedByCategory } = require('../controllers/testResultController');
const { protect } = require('../middleware/authMiddleware');

// Get all user test results grouped by category
router.get('/', protect, getTestResultsGroupedByCategory);

module.exports = router;
