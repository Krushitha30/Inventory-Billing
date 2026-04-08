const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
  totalSpent: { type: Number, default: 0 },
});

module.exports = mongoose.model('Customer', customerSchema);
