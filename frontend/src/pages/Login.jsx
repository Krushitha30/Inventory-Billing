import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/";
      } else {
        setError(res.data); // Display exact error from backend like "User not found"
      }
    } catch (err) {
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>

        {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>}

        <input placeholder="Email"
          onChange={e=>setData({...data,email:e.target.value})}
          className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <input placeholder="Password" type="password"
          onChange={e=>setData({...data,password:e.target.value})}
          className="border border-gray-300 p-3 rounded w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <button onClick={login}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full p-3 rounded transition duration-200 shadow-md">
          Login
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;