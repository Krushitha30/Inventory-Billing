const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  costPrice: { type: Number, default: 0 },
  quantity: Number,
  category: { type: String, default: 'General' },
  imageUrl: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Product', productSchema);