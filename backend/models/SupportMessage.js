const mongoose = require('mongoose');

const SupportMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'Open' }, // Open, Closed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportMessage', SupportMessageSchema);
