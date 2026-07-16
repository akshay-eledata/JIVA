const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile, getLatestReport, getBiomarkersBySystem, getCompare, getBiomarkerHistory, getRecommendations,
} = require('../controllers/meController');

// All /api/me/* routes require a valid token.
router.get('/profile', protect, getProfile);
router.get('/report/latest', protect, getLatestReport);
router.get('/biomarkers', protect, getBiomarkersBySystem);
router.get('/compare', protect, getCompare);
router.get('/biomarker/history', protect, getBiomarkerHistory);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;
