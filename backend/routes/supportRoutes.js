const express = require('express');
const router = express.Router();
const SupportMessage = require('../models/SupportMessage');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/support/send - Submit a support request (Public or Private)
router.post('/send', async (req, res) => {
  const { name, email, message, userId } = req.body;
  
  if (!message || !name || !email) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const newMessage = new SupportMessage({
      userId: userId || null,
      name,
      email,
      message,
      status: 'Open'
    });
    await newMessage.save();
    res.status(201).json({ message: "Support request sent successfully!", data: newMessage });
  } catch (err) {
    console.error("Support send error:", err);
    res.status(500).json({ error: "Failed to send message." });
  }
});

// GET /api/admin/support - Get all support messages (Admin Only)
router.get('/admin/all', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied." });
  }

  try {
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/admin/support/:id - Update message status (Admin Only)
router.put('/admin/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied." });
  }

  try {
    const message = await SupportMessage.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
