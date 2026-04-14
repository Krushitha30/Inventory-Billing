const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/inventoryDB';

const runMigration = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for re-restoration...");

    const UserSchema = new mongoose.Schema({ role: String }, { strict: false });
    const ReviewSchema = new mongoose.Schema({ role: String }, { strict: false });

    const User = mongoose.model('User', UserSchema);
    const Review = mongoose.model('Review', ReviewSchema);

    // Update Users: staff -> user
    const userResult = await User.updateMany({ role: 'staff' }, { $set: { role: 'user' } });
    console.log(`Restoration: Updated ${userResult.modifiedCount} users back to 'user'.`);

    // Update Reviews: staff -> user
    const reviewResult = await Review.updateMany({ role: 'staff' }, { $set: { role: 'user' } });
    console.log(`Restoration: Updated ${reviewResult.modifiedCount} reviews back to 'user'.`);

    console.log("Re-restoration complete.");
    process.exit(0);
  } catch (err) {
    console.error("Restoration failed:", err);
    process.exit(1);
  }
};

runMigration();
