const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const { verifyToken } = require('../middleware/authMiddleware');

// Get only sales belonging to the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const data = await Sale.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

// Create a new sale tagged with the user's ID
router.post('/', verifyToken, async (req, res) => {
  try {
    const data = new Sale({
      ...req.body,
      userId: req.user.id
    });
    await data.save();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to record sale" });
  }
});

module.exports = router;
