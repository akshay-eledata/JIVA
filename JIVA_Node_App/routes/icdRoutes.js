const express = require('express');
const router = express.Router();
const { searchIcd } = require('../controllers/icdController');

// Public: the intake questionnaire is filled in before the account exists.
router.get('/search', searchIcd);

module.exports = router;
