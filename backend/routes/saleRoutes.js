const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');

router.get('/', async (req, res) => {
  const data = await Sale.find().sort({ date: -1 });
  res.json(data);
});

router.post('/', async (req, res) => {
  const data = new Sale(req.body);
  await data.save();
  res.json(data);
});

module.exports = router;
