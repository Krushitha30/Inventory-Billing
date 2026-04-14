import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../apiConfig";

function Suppliers() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: "", contactPerson: "", email: "", phone: "", suppliedCategory: "General" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchSuppliers = async () => {
    const res = await axios.get(`${API_URL}/api/suppliers`);
    setData(res.data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const addOrUpdate = async () => {
    if (!form.name) return;

    if (editId) {
      await axios.put(`${API_URL}/api/suppliers/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(`${API_URL}/api/suppliers`, form);
    }

    setForm({ name: "", contactPerson: "", email: "", phone: "", suppliedCategory: "General" });
    fetchSuppliers();
  };

  const editSupplier = (s) => {
    setForm(s);
    setEditId(s._id);
  };

  const deleteSupplier = async (id) => {
    await axios.delete(`${API_URL}/api/suppliers/${id}`);
    fetchSuppliers();
  };

  const filtered = data.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || (s.suppliedCategory && s.suppliedCategory.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="dark:text-gray-200 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Vendors & Suppliers</h2>

      <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-6 rounded-2xl shadow mb-8 transition-colors">
        <h3 className="font-semibold text-lg mb-4">{editId ? "Update Supplier" : "Add New Supplier"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <input placeholder="Company Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input placeholder="Contact Person" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input placeholder="Phone / Mobile" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input placeholder="Provides Category" value={form.suppliedCategory} onChange={e => setForm({ ...form, suppliedCategory: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <button onClick={addOrUpdate} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded shadow transition duration-200">
          {editId ? "Save Changes" : "Create Supplier"}
        </button>
      </div>

      <input placeholder="Search Suppliers or Categories..." value={search} onChange={e => setSearch(e.target.value)} className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 mb-6 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm" />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6">Company Name</th>
              <th className="py-3 px-6">Main Contact</th>
              <th className="py-3 px-6">Category Tag</th>
              <th className="py-3 px-6">Contact Info</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
            {filtered.map(s => (
              <tr key={s._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="py-3 px-6 font-bold text-gray-900 dark:text-white">{s.name}</td>
                <td className="py-3 px-6 text-gray-600 dark:text-gray-400">{s.contactPerson || "N/A"}</td>
                <td className="py-3 px-6">
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-orange-200">{s.suppliedCategory}</span>
                </td>
                <td className="py-3 px-6">
                  <div>{s.phone}</div>
                  <div className="text-gray-400 text-xs">{s.email}</div>
                </td>
                <td className="py-3 px-6 text-center space-x-2">
                  <button onClick={() => editSupplier(s)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow-sm transition">Edit</button>
                  <button onClick={() => deleteSupplier(s._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Suppliers;
