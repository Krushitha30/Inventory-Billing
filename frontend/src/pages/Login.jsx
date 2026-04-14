import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-950 p-4 font-sans selection:bg-blue-500/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        
        {/* User Card */}
        <Link to="/login/user" className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] overflow-hidden transition-all hover:scale-[1.02] hover:bg-gray-900/60 hover:shadow-2xl hover:shadow-blue-500/10">
          <div className="absolute top-0 right-0 p-8 text-8xl opacity-5 group-hover:scale-110 transition-transform">📋</div>
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
            <span className="text-2xl">👤</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">User Portal</h2>
          <p className="text-gray-400 leading-relaxed mb-6">Manage inventory, create invoices, and handle daily billing operations.</p>
          <div className="inline-flex items-center gap-2 text-blue-400 font-bold group-hover:gap-4 transition-all">
            Start Working <span>→</span>
          </div>
        </Link>

        {/* Admin Card */}
        <Link to="/login/admin" className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] overflow-hidden transition-all hover:scale-[1.02] hover:bg-gray-900/60 hover:shadow-2xl hover:shadow-purple-500/10">
          <div className="absolute top-0 right-0 p-8 text-8xl opacity-5 group-hover:scale-110 transition-transform">⚡</div>
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
            <span className="text-2xl">🛡️</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Console</h2>
          <p className="text-gray-400 leading-relaxed mb-6">Access enterprise analytics, manage users, and configure system settings.</p>
          <div className="inline-flex items-center gap-2 text-purple-400 font-bold group-hover:gap-4 transition-all">
            Enter Dashboard <span>→</span>
          </div>
        </Link>

      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
        <Link to="/" className="text-gray-600 text-sm hover:text-gray-400 transition-colors flex items-center gap-2">
          <span>←</span> Back to Main Site
        </Link>
      </div>
    </div>
  );
}

export default Login;