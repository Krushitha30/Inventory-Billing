const mongoose = require('mongoose');
require('dotenv').config();

// Load Models
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Sale = require('../models/Sale');

const TARGET_USER_ID = '69d549f4069dc9ece622bcfa';

async function migrate() {
  try {
    console.log('🚀 Starting Data Migration to Multi-Tenancy...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database.');

    const models = [
      { name: 'Products', model: Product },
      { name: 'Customers', model: Customer },
      { name: 'Suppliers', model: Supplier },
      { name: 'Sales', model: Sale }
    ];

    for (const item of models) {
      console.log(`Checking ${item.name}...`);
      const result = await item.model.updateMany(
        { userId: { $exists: false } },
        { $set: { userId: TARGET_USER_ID } }
      );
      console.log(`✅ ${item.name}: Updated ${result.modifiedCount} orphaned records.`);
    }

    console.log('\n✨ Migration Complete! All data is now isolated to your primary account.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Failed:', err);
    process.exit(1);
  }
}

migrate();
