require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Explicit CORS for Multi-Tenancy Security
app.use(cors({
  origin: '*', // Allows all origins in development; tighten this for production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventoryDB';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected to Cloud Atlas'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customerRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const saleRoutes = require('./routes/saleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const supportRoutes = require('./routes/supportRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/support', supportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});