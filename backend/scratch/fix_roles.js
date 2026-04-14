const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('../models/User');
  await User.deleteMany({ email: { $in: ['test1@example.com', 'test2@example.com'] } });
  await User.updateOne({ email: 'krushitha@gmail.com' }, { role: 'admin' });
  console.log('✅ Database fixed: krushitha is now Admin.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
