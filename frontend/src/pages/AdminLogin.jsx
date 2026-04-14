import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../apiConfig";

function AdminLogin() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      } else {
        setError(res.data);
      }
    } catch (err) {
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-950 p-4 font-sans selection:bg-purple-500/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full -z-10" />
      
      <div className="bg-gray-900/50 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-purple-500/10 w-full max-w-md border border-white/10">

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
            <span className="text-2xl font-bold italic text-white text-shadow-glow">A</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="text-gray-400 mt-2">Enterprise Analytics Center</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 rounded-xl text-sm animate-shake">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Admin Email</label>
            <input
              type="email"
              placeholder="admin@inventorypro.com"
              onChange={e => setData({ ...data, email: e.target.value })}
              className="bg-gray-800/50 border border-white/10 text-white p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Secure Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={e => setData({ ...data, password: e.target.value })}
              className="bg-gray-800/50 border border-white/10 text-white p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600"
            />
          </div>

          <button
            onClick={login}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold w-full p-4 rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            Enter Portal
            <span className="text-lg">⚡</span>
          </button>
        </div>

        <div className="mt-8 text-center space-y-4">
          <div className="pt-4 border-t border-white/5">
            <Link to="/" className="text-gray-600 text-xs hover:text-gray-400 transition-colors inline-flex items-center gap-1">
              <span>←</span> Exit to Front Page
            </Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .text-shadow-glow { text-shadow: 0 0 10px rgba(255,255,255,0.5); }
      `}</style>
    </div>
  );
}

export default AdminLogin;
