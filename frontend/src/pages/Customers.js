import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../apiConfig";

function Customers() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    const res = await axios.get(`${API_URL}/api/customers`);
    setData(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addOrUpdate = async () => {
    if (!form.name) return;

    if (editId) {
      await axios.put(`${API_URL}/api/customers/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(`${API_URL}/api/customers`, form);
    }

    setForm({ name: "", email: "", phone: "", address: "" });
    fetchCustomers();
  };

  const editCustomer = (c) => {
    setForm(c);
    setEditId(c._id);
  };

  const deleteCustomer = async (id) => {
    await axios.delete(`${API_URL}/api/customers/${id}`);
    fetchCustomers();
  };

  const filtered = data.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="dark:text-gray-200 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Customer CRM</h2>

      <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-6 rounded-2xl shadow mb-8 transition-colors">
        <h3 className="font-semibold text-lg mb-4">{editId ? "Update Customer" : "Add New Customer"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input placeholder="Billing Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <button onClick={addOrUpdate} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition duration-200">
          {editId ? "Update Customer" : "Save Customer"}
        </button>
      </div>

      <input placeholder="Search Customers..." value={search} onChange={e => setSearch(e.target.value)} className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 mb-6 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Phone</th>
              <th className="py-3 px-6">Total Spent</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
            {filtered.map(c => (
              <tr key={c._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="py-3 px-6 font-bold text-gray-900 dark:text-white">{c.name}</td>
                <td className="py-3 px-6">{c.email || "N/A"}</td>
                <td className="py-3 px-6">{c.phone || "N/A"}</td>
                <td className="py-3 px-6 font-bold text-green-600">₹{c.totalSpent}</td>
                <td className="py-3 px-6 text-center space-x-2">
                  <button onClick={() => editCustomer(c)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow-sm transition">Edit</button>
                  <button onClick={() => deleteCustomer(c._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
