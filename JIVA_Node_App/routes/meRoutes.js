const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile, getLatestReport, getBiomarkersBySystem, getCompare, getBiomarkerHistory,
  getRecommendations, saveQuestionnaire,
} = require('../controllers/meController');
const {
  createAppointment, listAppointments, getRetestStatus, cancelAppointment,
} = require('../controllers/appointmentController');
const { getRecommendedPanels } = require('../controllers/recommendationController');

// All /api/me/* routes require a valid token.
router.get('/profile', protect, getProfile);
router.get('/report/latest', protect, getLatestReport);
router.get('/biomarkers', protect, getBiomarkersBySystem);
router.get('/compare', protect, getCompare);
router.get('/biomarker/history', protect, getBiomarkerHistory);
router.get('/recommendations', protect, getRecommendations);
router.post('/questionnaire', protect, saveQuestionnaire);

// Blood draws and the retest loop (F1). The static retest-status path is
// declared before any parameterised appointment route so it is not shadowed.
router.get('/appointments/retest-status', protect, getRetestStatus);
router.get('/appointments', protect, listAppointments);
router.post('/appointments', protect, createAppointment);
router.patch('/appointments/:id/cancel', protect, cancelAppointment);

// Targeted add-on panels for whatever is currently flagged.
router.get('/recommended-panels', protect, getRecommendedPanels);

module.exports = router;
