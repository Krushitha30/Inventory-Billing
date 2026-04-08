const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', async (req, res) => {
  const data = new Product(req.body);
  await data.save();
  res.json(data);
});

router.get('/', async (req, res) => {
  const data = await Product.find();
  res.json(data);
});

router.put('/reduce/:id', async (req, res) => {
  const { qty } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) return res.json({ error: "Not found" });

  if (product.quantity < qty) {
    return res.json({ error: "Not enough stock" });
  }

  product.quantity -= qty;
  await product.save();

  res.json(product);
});

router.put('/:id', async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;