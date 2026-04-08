import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const token = localStorage.getItem("token");
  let currentName = "User";
  let currentRole = "Staff";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentName = decoded.name || "User";
      currentRole = decoded.role || "staff";
    } catch(err) {}
  }

  const [form, setForm] = useState({ name: currentName, password: "" });
  const [msg, setMsg] = useState("");

  const handleUpdate = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/auth/profile", form);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setMsg("Profile updated successfully!");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      setMsg("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 transition-colors">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">My Profile</h2>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="flex items-center space-x-4 mb-8 pb-8 border-b dark:border-gray-700">
          <div className="h-20 w-20 bg-blue-500 rounded-full flex items-center justify-center text-3xl text-white font-bold uppercase shadow-inner">
            {currentName.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{currentName}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Account Role: <span className="uppercase font-bold tracking-wider text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">{currentRole}</span></p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200">Account Settings</h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
            <input 
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password (Optional)</label>
            <input 
              type="password"
              placeholder="Leave blank to keep current password"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>

          <button 
            onClick={handleUpdate} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition duration-200 mt-4"
          >
            Save Changes
          </button>
          
          {msg && (
            <p className="text-center font-semibold mt-4 text-green-600">{msg}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
