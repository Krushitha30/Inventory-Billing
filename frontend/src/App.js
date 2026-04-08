import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import Invoice from "./components/Invoice";
import { jwtDecode } from "jwt-decode";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Profile from "./pages/Profile";
import SalesLedger from "./pages/SalesLedger";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

// Setup Axios Interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function Dashboard() {
  const [data, setData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then(res => setData(res.data));
    axios.get("http://localhost:5000/api/sales").then(res => setSalesData(res.data));
  }, []);

  const totalProducts = data.length;

  const totalStock = data.reduce(
    (sum, p) => sum + Number(p.quantity),
    0
  );

  const totalValue = data.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const totalProfit = data.reduce(
    (sum, p) => sum + (p.price - (p.costPrice || 0)) * p.quantity,
    0
  );

  const lowStockItems = data.filter(p => p.quantity < 5);

  const categoryCounts = data.reduce((acc, p) => {
    const cat = p.category || 'General';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [{
      data: Object.values(categoryCounts),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
      borderWidth: 0,
    }]
  };

  const actualRevenue = salesData.reduce((sum, s) => sum + s.total, 0);

  const recentSales = salesData.slice(0, 7).reverse();
  const barChartData = {
    labels: recentSales.map(s => s.customerName.slice(0, 10)),
    datasets: [{
      label: 'Invoice Total (₹)',
      data: recentSales.map(s => s.total),
      backgroundColor: '#10b981'
    }]
  };

  const sortedSales = [...salesData].sort((a,b) => new Date(a.date) - new Date(b.date));
  const sortedSalesByDate = {};
  sortedSales.forEach(sale => {
    const dateString = new Date(sale.date).toLocaleDateString({ month: 'short', day: 'numeric' });
    if (!sortedSalesByDate[dateString]) sortedSalesByDate[dateString] = 0;
    sortedSalesByDate[dateString] += sale.total;
  });

  const lineChartData = {
    labels: Object.keys(sortedSalesByDate),
    datasets: [{
      label: 'Daily Revenue (₹)',
      data: Object.values(sortedSalesByDate),
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#8b5cf6'
    }]
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Dashboard</h1>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-6 rounded-2xl shadow transition-colors">
          <h3 className="dark:text-gray-300">Total Products</h3>
          <p className="text-xl font-bold">{totalProducts}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-6 rounded-2xl shadow transition-colors">
          <h3 className="dark:text-gray-300">Total Stock</h3>
          <p className="text-xl font-bold">{totalStock}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-6 rounded-2xl shadow transition-colors">
          <h3 className="dark:text-gray-300">Stock Value</h3>
          <p className="text-xl font-bold">₹{totalValue.toFixed(2)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-6 rounded-2xl shadow border-l-4 border-yellow-500 transition-colors">
          <h3 className="dark:text-gray-300">Potential Profit</h3>
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">₹{totalProfit.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-2xl shadow text-white border-l-4 border-green-800 transition-colors">
          <h3>Actual Rev</h3>
          <p className="text-2xl font-extrabold">₹{actualRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow transition-colors">
          <h3 className="w-full text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">Recent Sales Revenue</h3>
          <div className="w-full h-64">
            {recentSales.length > 0 ? (
              <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="text-gray-400 mt-20 text-center">No Sales yet</p>
            )}
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex flex-col items-center transition-colors">
          <h3 className="w-full text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">Inventory Categories</h3>
          <div className="w-64 h-64">
            {Object.keys(categoryCounts).length > 0 ? (
              <Doughnut data={chartData} />
            ) : (
              <p className="text-gray-400 mt-20 text-center">No Data yet</p>
            )}
          </div>
        </div>

        {/* Time-Series Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow lg:col-span-2 transition-colors">
          <h3 className="w-full text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">Revenue Growth Over Time</h3>
          <div className="w-full h-72">
            {Object.keys(sortedSalesByDate).length > 0 ? (
              <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="text-gray-400 mt-20 text-center">Not enough data to plot timeline.</p>
            )}
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-l-4 border-red-500 lg:col-span-2 transition-colors">
          <h3 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">⚠️ Low Stock Alerts</h3>
          {lowStockItems.length > 0 ? (
            <ul className="space-y-3">
              {lowStockItems.map(p => (
                <li key={p._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-semibold text-gray-800">{p.name}</span>
                  <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full font-bold text-sm">
                    Only {p.quantity} left
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-600 font-semibold p-4 bg-green-50 rounded-lg text-center">
              All inventory is safely stocked! 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


function Products({ role }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    costPrice: "",
    quantity: "",
    category: "General",
    imageUrl: ""
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setData(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addOrUpdate = async () => {
    if (!form.name || !form.price || !form.costPrice || !form.quantity) return;

    if (editId) {
      await axios.put(
        `http://localhost:5000/api/products/${editId}`,
        form
      );
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/api/products", form);
    }

    setForm({ name: "", price: "", costPrice: "", quantity: "", category: "General", imageUrl: "" });
    fetchProducts();
  };

  const editProduct = (p) => {
    setForm(p);
    setEditId(p._id);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  const filtered = data.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Products</h2>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-3 rounded w-full md:w-1/3"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
        />
        <input
          placeholder="Cost Price"
          value={form.costPrice}
          onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded w-full"
        />
        <input
          placeholder="Selling Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded w-full"
        />
        <input
          placeholder="Qty"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded w-full"
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded w-full"
        />
        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded w-full"
        />

        <button
          onClick={addOrUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded font-semibold w-full"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="overflow-x-auto w-full">
      <table className="w-full border min-w-[700px] text-gray-800 dark:text-gray-200">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="py-2">Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Cost Price</th>
            <th>Selling Price</th>
            <th>Profit/Item</th>
            <th>Qty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr
              key={p._id}
              className={`text-center border-t dark:border-gray-600 ${
                p.quantity < 5 ? "bg-red-50 dark:bg-red-900" : "hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              }`}
            >
              <td className="py-2">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="h-10 w-10 object-cover rounded-md mx-auto shadow-sm" />
                ) : (
                  <div className="h-10 w-10 bg-gray-100 dark:bg-gray-600 rounded-md flex items-center justify-center text-[10px] text-gray-400 mx-auto">N/A</div>
                )}
              </td>
              <td className="font-semibold">{p.name}</td>
              <td><span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-bold">{p.category || 'General'}</span></td>
              <td>₹{p.costPrice || 0}</td>
              <td>₹{p.price}</td>
              <td className="text-green-600 dark:text-green-400 font-bold">₹{((p.price || 0) - (p.costPrice || 0))}</td>
              <td className="font-bold">{p.quantity}</td>
              <td className="space-x-2">
                <button
                  onClick={() => editProduct(p)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Edit
                </button>

                {role === 'admin' && (
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}



function Billing() {
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("");
  const [qty, setQty] = useState(1);
  const invoiceRef = useRef();

  const triggerPrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice_${customer || "Customer"}`,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data));
  }, []);

  const addItem = async () => {
    const product = products.find(p => p._id === selected);
    if (!product) return;

    const requestedQty = Number(qty);
    if (requestedQty <= 0) return alert("Please enter a valid quantity.");
    
    if (requestedQty > product.quantity) {
      return alert(`Not enough stock! Only ${product.quantity} left.`);
    }

    const newItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      qty: requestedQty,
      imageUrl: product.imageUrl
    };

    setItems([...items, newItem]);

    // Update local products state so we don't oversell in the same session
    const updatedProducts = products.map(p => 
      p._id === product._id ? { ...p, quantity: p.quantity - requestedQty } : p
    );
    setProducts(updatedProducts);

    await axios.put(
      `http://localhost:5000/api/products/reduce/${product._id}`,
      { qty: requestedQty }
    );

    setQty(1);
    setSelected("");
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const completeCheckout = async () => {
    // Save transaction to Ledger
    await axios.post("http://localhost:5000/api/sales", {
      customerName: customer || "Walk-in Customer",
      items,
      subtotal,
      gst,
      total,
      invoiceNumber: Math.floor(Math.random() * 90000) + 10000
    });

    // Fire PDF popup
    triggerPrint();

    // Reset Billing Station
    setTimeout(() => {
      setItems([]);
      setCustomer("");
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors">
      <h2 className="text-xl font-bold mb-4">Billing Checkout</h2>
      <h3 className="dark:text-blue-400">Total: ₹{total.toFixed(2)}</h3>

      <input
        placeholder="Customer Name"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        className="border p-2 rounded w-full mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Select Product...</option>
          {products.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} (₹{p.price})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4 mt-6">
        <button
          onClick={addItem}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md w-full sm:w-auto"
        >
          Add Item
        </button>
        <button
          onClick={completeCheckout}
          disabled={items.length === 0}
          className={`px-4 py-2 rounded shadow-md font-bold w-full sm:w-auto ${items.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white animate-pulse'}`}
        >
          Checkout & Print Invoice
        </button>
      </div>

      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <Invoice 
          ref={invoiceRef}
          customerName={customer} 
          items={items} 
          subtotal={subtotal} 
          gst={gst} 
          total={total} 
          invoiceNumber={Math.floor(Math.random() * 90000) + 10000} 
        />
      </div>

      <div className="overflow-x-auto w-full">
      <table className="w-full border min-w-[500px] text-gray-800 dark:text-gray-200">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="py-2">Image</th>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="text-center border-t dark:border-gray-600">
              <td className="py-2">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-10 w-10 object-cover rounded-md mx-auto shadow-sm" />
                ) : (
                  <div className="h-10 w-10 bg-gray-100 dark:bg-gray-600 rounded-md flex items-center justify-center text-[10px] text-gray-400 mx-auto">N/A</div>
                )}
              </td>
              <td className="font-semibold">{item.name}</td>
              <td>₹{item.price}</td>
              <td>{item.qty}</td>
              <td className="font-bold">₹{item.price * item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="mt-4 font-bold">
        <p>Subtotal: ₹{subtotal}</p>
        <p>GST (18%): ₹{(subtotal * 0.18).toFixed(2)}</p>
        <p>Total: ₹{(subtotal * 1.18).toFixed(2)}</p>
      </div>
    </div>
  );
}

function App() {
  const token = localStorage.getItem("token");
  const [darkMode, setDarkMode] = useState(false);
  let role = "staff";
  let name = "";
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      name = decoded.name || "User";
    } catch(err) {}
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/*" element={
          token ? (
            <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 dark:text-gray-200 transition-colors duration-300">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-xl p-6 flex flex-col justify-between transition-colors duration-300 border-r dark:border-gray-700">
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      Inventory
                    </h2>
                    <button onClick={() => setDarkMode(!darkMode)} className="text-xl bg-gray-100 dark:bg-gray-700 p-2 rounded-full cursor-pointer hover:scale-110 transition">
                      {darkMode ? '☀️' : '🌙'}
                    </button>
                  </div>

                  <ul className="space-y-4 flex flex-row flex-wrap md:flex-col gap-x-4 md:gap-x-0">
                    <li>
                      <Link to="/" className="hover:text-blue-500 font-semibold">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/products" className="hover:text-blue-500 font-semibold">Products</Link>
                    </li>
                    <li>
                      <Link to="/customers" className="hover:text-blue-500 font-semibold">Customers</Link>
                    </li>
                    <li>
                      <Link to="/suppliers" className="hover:text-blue-500 font-semibold">Suppliers</Link>
                    </li>
                    <li>
                      <Link to="/ledger" className="hover:text-blue-500 font-semibold">Sales Ledger</Link>
                    </li>
                    <li>
                      <Link to="/billing" className="hover:text-blue-500 font-semibold">Billing</Link>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-8 md:mt-0 p-4 border-t md:border-t-0 border-gray-200 dark:border-gray-700">
                  <div className="mb-4 text-center md:pb-4 md:border-b dark:border-gray-700">
                    <p className="font-semibold text-gray-700">Hi, {name}!</p>
                    <p className="text-sm text-gray-500 capitalize mb-3">Role: {role}</p>
                    <Link to="/profile" className="text-blue-500 text-sm font-semibold hover:underline block mb-2">⚙️ My Profile Settings</Link>
                  </div>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded w-full transition duration-200">
                    Logout
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 h-screen overflow-y-auto w-full transition-colors duration-300">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products role={role} />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/ledger" element={<SalesLedger />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/profile" element={<Profile />} />
                  {/* Redirect unmatched nested routes to dashboard */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;