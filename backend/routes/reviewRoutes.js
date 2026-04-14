const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/reviews — Submit a review (authenticated users only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required.' });
    }
    const review = new Review({
      userId: req.user.id,
      userName: req.user.name || 'Anonymous',
      rating,
      comment,
      role: req.user.role || 'user'
    });
    await review.save();
    res.status(201).json({ message: 'Review submitted successfully!', review });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reviews — Public: get all reviews (for landing page testimonials)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(12);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
