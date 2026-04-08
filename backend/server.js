const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/inventoryDB')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customerRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const saleRoutes = require('./routes/saleRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/sales', saleRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});