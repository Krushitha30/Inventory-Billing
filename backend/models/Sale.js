const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  customerName: { type: String, default: "Walk-in Customer" },
  items: Array,
  subtotal: Number,
  gst: Number,
  total: Number,
  invoiceNumber: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
