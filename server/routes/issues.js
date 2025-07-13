const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Issue = require('../models/issue');


// POST - submit issue
router.post('/', upload.single('photo'), async (req, res) => {
  const { title, description, location, lat, lng } = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    const newIssue = new Issue({ title, description, location, lat, lng, photo });
    await newIssue.save();
    res.status(201).json(newIssue);
  } catch (err) {
    console.error('❌ Error saving issue:', err);
    res.status(500).json({ message: 'Failed to save issue' });
  }
});

// GET - fetch all issues
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch issues' });
  }
});
// DELETE /api/issues/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Issue.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Issue not found' });
    res.json({ message: 'Issue deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router; 
