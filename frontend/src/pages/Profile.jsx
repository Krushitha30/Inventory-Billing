import { useState } from "react";
import axios from "axios";
import API_URL from "../apiConfig";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const token = localStorage.getItem("token");
  let currentName = "User";
  let currentRole = "User";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentName = decoded.name || "User";
      currentRole = (decoded.role === 'staff' || decoded.role === 'user') ? 'User' : (decoded.role || 'User');
    } catch (err) { }
  }

  const [form, setForm] = useState({ name: currentName, password: "" });
  const [msg, setMsg] = useState("");

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/auth/profile`, form);
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
    <div className="max-w-3xl mx-auto py-10 transition-colors">
      <h2 className="text-4xl font-black mb-8 text-slate-950 dark:text-white tracking-tight">Identity & Account</h2>

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/5 transition-all">
        <div className="flex items-center space-x-6 mb-10 pb-10 border-b border-slate-100 dark:border-white/5">
          <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center text-4xl text-white font-black uppercase shadow-lg shadow-blue-500/20">
            {currentName.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{currentName}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Security Clearance:</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                {currentRole}
              </span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-8 text-slate-800 dark:text-white/90">Station Settings</h3>

        <div className="space-y-6 max-w-xl">
          <div>
            <label className="block text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">Display Name</label>
            <input
              className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 dark:placeholder:text-gray-600 transition-all"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">Update Password</label>
            <input
              type="password"
              placeholder="Leave blank to keep encrypted"
              className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 dark:placeholder:text-gray-600 transition-all"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            onClick={handleUpdate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 mt-4"
          >
            Commit Changes
          </button>

          {msg && (
            <div className={`text-center font-bold mt-6 p-3 rounded-xl text-sm ${msg.includes('successfully') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
