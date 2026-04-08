const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  costPrice: { type: Number, default: 0 },
  quantity: Number,
  category: { type: String, default: 'General' },
  imageUrl: { type: String, default: "" }
});

module.exports = mongoose.model('Product', productSchema);