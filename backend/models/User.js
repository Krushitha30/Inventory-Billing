const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  status: { type: String, default: 'active' },
  subscription: { type: String, default: 'Free' }
});

module.exports = mongoose.model('User', userSchema);