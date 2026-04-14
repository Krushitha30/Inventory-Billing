const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "fallback_secret_local_only";

// Register
router.post('/register', async (req, res) => {
  try {
    const count = await User.countDocuments();
    const role = count === 0 ? 'admin' : 'user';

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({ name: req.body.name, email: req.body.email, password: hash, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, SECRET);
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed: " + err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.json("Wrong password");

  const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, SECRET);
  res.json({ token, role: user.role });
});

const { verifyToken } = require('../middleware/authMiddleware');

// Update Profile
router.put('/profile', verifyToken, async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ error: "User not found" });

  if (name) user.name = name;
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
  }

  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, SECRET);
  res.json({ token, role: user.role, name: user.name });
});

module.exports = router;