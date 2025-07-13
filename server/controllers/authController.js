const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpStore = require('../utils/otpStore'); 
const Issue = require('../models/Issue'); 

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Send OTP for Password Reset
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    await transporter.sendMail({
      from: `"FixMyCity" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'FixMyCity - Password Reset OTP',
      text: `Your OTP is: ${otp}`,
    });

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // OTP valid for 5 mins
    };

    res.status(200).json({ msg: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err.message);
    res.status(500).json({ msg: 'Failed to send OTP' });
  }
};

// Verify OTP and Reset Password
exports.verifyOTPAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const stored = otpStore[email];
  if (!stored) return res.status(400).json({ msg: 'No OTP found for this email' });
  if (Date.now() > stored.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ msg: 'OTP expired' });
  }
  if (stored.otp != otp) return res.status(400).json({ msg: 'Invalid OTP' });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    delete otpStore[email];

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Reset error:', err.message);
    res.status(500).json({ msg: 'Server error while resetting password' });
  }
};
exports.getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const issues = await Issue.find({ user: req.user.id });

    res.json({ user, issues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
