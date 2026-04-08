const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

router.get('/', async (req, res) => {
  const data = await Supplier.find().sort({ createdAt: -1 });
  res.json(data);
});

router.post('/', async (req, res) => {
  const data = new Supplier(req.body);
  await data.save();
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
