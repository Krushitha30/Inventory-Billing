const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String },
  phone: { type: String },
  suppliedCategory: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', supplierSchema);
