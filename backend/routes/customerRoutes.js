const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, async (req, res) => {
  const data = new Customer({ ...req.body, userId: req.user.id });
  await data.save();
  res.json(data);
});

router.get('/', verifyToken, async (req, res) => {
  const data = await Customer.find({ userId: req.user.id });
  res.json(data);
});

router.put('/:id', verifyToken, async (req, res) => {
  const updated = await Customer.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

router.delete('/:id', verifyToken, async (req, res) => {
  await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ msg: "Deleted" });
});

module.exports = router;
