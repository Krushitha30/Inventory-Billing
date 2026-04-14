import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import API_URL from '../apiConfig';

const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-support', handleToggle);
    return () => window.removeEventListener('toggle-support', handleToggle);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFormData(prev => ({ 
          ...prev, 
          name: decoded.name || '', 
          email: decoded.email || '' 
        }));
      } catch (e) {}
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', msg: '' });

    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        userId = decoded.id;
      } catch (e) {}
    }

    try {
      await axios.post(`${API_URL}/api/support/send`, { ...formData, userId });
      setStatus({ type: 'success', msg: 'Message sent! We\'ll get back to you soon.' });
      setFormData({ ...formData, message: '' });
      setTimeout(() => setIsOpen(false), 3000);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 w-80 md:w-96 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 mb-4 overflow-hidden animate-slide-up">
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Support Center</h3>
              <p className="text-xs text-blue-100">Usually responds in under 2 hours</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-2xl">×</button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {status.msg && (
              <div className={`p-3 rounded-xl text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {status.msg}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Your Name</label>
              <input 
                type="text" 
                required 
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">How can we help?</label>
              <textarea 
                required 
                rows="4"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="Describe your issue..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 transition-transform hover:scale-110 active:scale-90 animate-bounce-subtle"
      >
        {isOpen ? (
          <span className="text-3xl">↓</span>
        ) : (
          <div className="relative">
            <span className="text-3xl">💬</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </div>
        )}
      </button>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default SupportWidget;
