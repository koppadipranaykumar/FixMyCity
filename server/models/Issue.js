const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  lat: Number,
  lng: Number,
  photo: String
}, {
  timestamps: true 
});

// ✅ Prevent OverwriteModelError by reusing the model if it already exists
module.exports = mongoose.models.Issue || mongoose.model('Issue', issueSchema);
