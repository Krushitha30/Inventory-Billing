const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/Review');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Get User Statistics - Admin Only
router.get('/user-stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    
    // Get subscription breakdown
    const subscriptionStats = await User.aggregate([
      {
        $group: {
          _id: "$subscription",
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent users
    const recentUsers = await User.find({}, 'name email role status subscription')
      .sort({ _id: -1 })
      .limit(5);

    res.json({
      totalUsers,
      activeUsers,
      subscriptionStats,
      recentUsers
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/admin/reviews — All reviews (Admin only)
router.get('/reviews', verifyToken, isAdmin, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
