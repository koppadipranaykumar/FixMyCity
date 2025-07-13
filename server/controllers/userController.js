const User = require('../models/user');
const Issue = require('../models/Issue'); // Create this later if not already

exports.getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const issues = await Issue.find({ user: req.user.id }); // Optional for dashboard listing

    res.status(200).json({ user, issues });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ msg: 'Failed to load dashboard' });
  }
};
