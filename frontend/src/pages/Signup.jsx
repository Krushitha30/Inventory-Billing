import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", data);
      if (res.data._id) { // Successful registration returns user
        navigate("/login");
      } else {
        setError("Registration failed, please try again.");
      }
    } catch (err) {
      setError("An error occurred during registration.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Sign Up</h2>

        {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>}

        <input placeholder="Name"
          onChange={e=>setData({...data,name:e.target.value})}
          className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <input placeholder="Email"
          onChange={e=>setData({...data,email:e.target.value})}
          className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <input placeholder="Password" type="password"
          onChange={e=>setData({...data,password:e.target.value})}
          className="border border-gray-300 p-3 rounded w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <button onClick={signup}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full p-3 rounded transition duration-200 shadow-md">
          Sign Up
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
