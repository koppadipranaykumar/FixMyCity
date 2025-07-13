const express = require('express');
const router = express.Router();
// const Issue = require('../models/issue');
const {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTPAndResetPassword
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOTP); 
router.post('/verify-otp', verifyOTPAndResetPassword); 

module.exports = router;
