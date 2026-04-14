const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('../models/User');
  const Sale = require('../models/Sale');
  const Supplier = require('../models/Supplier');

  // Find the primary admin (krushitha)
  const admin = await User.findOne({ email: 'krushitha@gmail.com' });
  if (!admin) {
    console.error('Admin not found!');
    process.exit(1);
  }

  // Update any sales that have NO userId
  const salesResult = await Sale.updateMany(
    { userId: { $exists: false } },
    { $set: { userId: admin._id } }
  );

  // Update any suppliers that have NO userId
  const suppliersResult = await Supplier.updateMany(
    { userId: { $exists: false } },
    { $set: { userId: admin._id } }
  );

  console.log(`✅ Fixed ${salesResult.modifiedCount} orphaned sales and ${suppliersResult.modifiedCount} orphaned suppliers.`);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
