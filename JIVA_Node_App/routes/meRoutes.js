const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile, getLatestReport, getBiomarkersBySystem, getRecommendations, saveQuestionnaire,
} = require('../controllers/meController');

// All /api/me/* routes require a valid token.
router.get('/profile', protect, getProfile);
router.get('/report/latest', protect, getLatestReport);
router.get('/biomarkers', protect, getBiomarkersBySystem);
router.get('/recommendations', protect, getRecommendations);
router.post('/questionnaire', protect, saveQuestionnaire);

module.exports = router;
