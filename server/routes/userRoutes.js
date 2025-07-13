const express = require('express');
const router = express.Router();
// const Issue = require('../models/issue');
const { getUserDashboard } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/dashboard', authMiddleware, getUserDashboard);

module.exports = router;
