const express = require('express');
const router = express.Router();
const { getAllUsers, createUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/users')
  .get(protect, admin, getAllUsers)
  .post(protect, admin, createUser);

module.exports = router;
