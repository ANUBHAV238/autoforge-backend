const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { getDashboardStats } = require('../controllers/quotation.controller');

// Admin dashboard stats
router.get('/dashboard', protect, adminOnly, getDashboardStats);

// Admin user list
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const User = require('../models/User.model');
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments();
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.json({ success: true, total, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
