const mongoose = require('mongoose');
// const Issue = require('../models/issue');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' } // or 'admin'
});

module.exports = mongoose.model('User', userSchema);
