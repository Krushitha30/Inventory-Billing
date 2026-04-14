const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, default: "Walk-in Customer" },
  items: Array,
  subtotal: Number,
  gst: Number,
  total: Number,
  invoiceNumber: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
