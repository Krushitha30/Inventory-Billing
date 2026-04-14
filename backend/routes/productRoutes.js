const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Get all products for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const data = await Product.find({ userId: req.user.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create a new product
router.post('/', verifyToken, async (req, res) => {
  try {
    const data = new Product({
      ...req.body,
      userId: req.user.id
    });
    await data.save();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Reduce stock (during billing) - only for products owned by user
router.put('/reduce/:id', verifyToken, async (req, res) => {
  try {
    const { qty } = req.body;
    const product = await Product.findOne({ _id: req.params.id, userId: req.user.id });

    if (!product) return res.status(404).json({ error: "Product not found or unauthorized" });

    if (product.quantity < qty) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    product.quantity -= qty;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to update stock" });
  }
});

// Update product
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Product not found or unauthorized" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product - user can delete their own, or admin can delete any
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? { _id: req.params.id } 
      : { _id: req.params.id, userId: req.user.id };
      
    const deletedProduct = await Product.findOneAndDelete(query);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found or unauthorized" });
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;