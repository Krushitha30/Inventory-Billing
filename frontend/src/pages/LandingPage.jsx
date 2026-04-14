import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../apiConfig';

const faqData = [
  {
    q: 'What features are included in the Free plan?',
    a: 'The Free plan includes basic inventory tracking, customer management, and up to 50 invoices per month. Perfect for getting started.',
  },
  {
    q: 'How does the billing and invoicing work?',
    a: 'InventoryPro generates GST-compliant invoices instantly. You can print or download them as PDF with one click.',
  },
  {
    q: 'Can multiple users log in to the same account?',
    a: 'Yes! The Pro and Enterprise plans support multiple user logins. Each user gets their own credentials.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. All data is encrypted at rest and in transit. We use JWT-based authentication and role-based access control.',
  },
  {
    q: 'Can I upgrade or downgrade my subscription anytime?',
    a: 'Yes, you can change your subscription plan at any time. Changes take effect at the start of the next billing cycle.',
  },
  {
    q: 'Is there a mobile app available?',
    a: 'InventoryPro is fully responsive and works on all screen sizes. A dedicated mobile app is on our roadmap.',
  },
  {
    q: 'How do I track inventory levels?',
    a: 'The Dashboard provides real-time stock levels. You get automatic low-stock alerts when any item drops below 5 units.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards, UPI, net banking, and corporate invoicing for Enterprise plans.',
  },
];

const testimonialsFallback = [
  { userName: 'Ravi Shankar', rating: 5, comment: 'InventoryPro transformed how we manage stock. The billing is lightning fast!', role: 'user' },
  { userName: 'Priya Menon', rating: 5, comment: 'Incredibly intuitive. Our team was up and running in minutes. The invoice feature is brilliant.', role: 'user' },
  { userName: 'Arjun Nair', rating: 4, comment: 'Best inventory tool on the market. The analytics dashboard gives me exactly what I need.', role: 'user' },
  { userName: 'Deepika Reddy', rating: 5, comment: 'The GST-ready invoices save us hours every week. Highly recommended!', role: 'user' },
  { userName: 'Suresh Kumar', rating: 4, comment: 'Clean UI, fast performance. The low stock alerts are a lifesaver.', role: 'user' },
  { userName: 'Ananya Singh', rating: 5, comment: 'Switched from spreadsheets to this — haven\'t looked back. Game changer.', role: 'user' },
];

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={`text-lg ${s <= rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
    ))}
  </div>
);

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/reviews`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setReviews(res.data);
        } else {
          setReviews(testimonialsFallback);
        }
      })
      .catch(() => setReviews(testimonialsFallback));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-gray-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xl font-bold italic">i</span>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">InventoryPro</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#faq" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">FAQ</a>
            <a href="#reviews" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Reviews</a>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-support'))}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Help
            </button>
            <Link to="/login/user" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">User Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Enterprise-ready Inventory Solution
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 leading-tight">
            Manage Inventory &amp; Billing <br /> With Unmatched Precision.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-12">
            The ultimate platform for businesses to track stock, generate professional invoices, and analyze sales performance in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login/admin" className="px-8 py-4 bg-white text-gray-950 font-bold rounded-2xl hover:bg-slate-200 transition-all shadow-xl shadow-white/10 w-full sm:w-auto">
              Admin Portal
            </Link>
            <Link to="/login/user" className="px-8 py-4 bg-slate-900 border border-white/10 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all w-full sm:w-auto">
              User Access
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-20 border-y border-white/5 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { value: '10k+', label: 'Active Users' },
            { value: '₹5Cr+', label: 'Processed' },
            { value: '99.9%', label: 'Uptime' },
            { value: '24/7', label: 'Support' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-slate-400">Streamlined tools for modern commerce.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📦', color: 'bg-blue-500/20', title: 'Stock Management', desc: 'Real-time tracking of product levels with automated low-stock alerts.' },
              { icon: '🧾', color: 'bg-purple-500/20', title: 'Instant Billing', desc: 'Generate professional GST-ready invoices and print them instantly.' },
              { icon: '📊', color: 'bg-teal-500/20', title: 'Advanced Analytics', desc: 'Visualize revenue growth and inventory health with interactive charts.' },
              { icon: '👥', color: 'bg-pink-500/20', title: 'Customer Management', desc: 'Maintain a complete CRM with customer contacts, history, and notes.' },
              { icon: '🏭', color: 'bg-orange-500/20', title: 'Supplier Tracking', desc: 'Track all supplier contacts, products, and procurement in one place.' },
              { icon: '📋', color: 'bg-green-500/20', title: 'Sales Ledger', desc: 'Full chronological record of every transaction and invoice generated.' },
            ].map((feat) => (
              <div key={feat.title} className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all group">
                <div className={`w-12 h-12 ${feat.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews / Testimonials */}
      <section id="reviews" className="py-32 bg-slate-900/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Loved by Teams Everywhere</h2>
            <p className="text-slate-400">Real feedback from real users of InventoryPro.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((r, i) => (
              <div key={i} className="bg-slate-800/60 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 hover:bg-slate-800 transition-all">
                <StarDisplay rating={r.rating} />
                <p className="text-slate-300 leading-relaxed text-sm">"{r.comment}"</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                    {r.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{r.userName}</p>
                    <p className="text-xs text-slate-500 capitalize">{r.role === 'staff' ? 'User' : (r.role || 'User')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/login/user" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl text-sm font-semibold transition-all">
              Join thousands of happy users →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know about InventoryPro.</p>
          </div>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-white hover:bg-white/5 transition-colors"
                >
                  {faq.q}
                  <span className={`text-2xl font-light text-slate-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assistance / Help Section */}
      <section id="assistance" className="py-32 bg-slate-900/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Help &amp; Assistance</h2>
            <p className="text-slate-400">We're here to help you get the most out of InventoryPro.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🚀', title: 'Getting Started', desc: 'New to InventoryPro? Our quickstart guide will have you up and running in minutes.', link: '#' },
              { icon: '🧾', title: 'Billing Help', desc: 'Learn how to create GST invoices, process checkouts, and manage payment records.', link: '#' },
              { icon: '📦', title: 'Inventory Guide', desc: 'Master stock tracking, low-stock alerts, categories, and product management.', link: '#' },
              { icon: '📧', title: 'Contact Support', desc: 'Reach our team at support@inventorypro.com. We respond within 24 hours.', link: 'mailto:support@inventorypro.com' },
            ].map((card) => (
              <a
                key={card.title}
                href={card.link}
                className="p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-blue-500/30 transition-all group flex flex-col gap-4"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="font-bold text-lg">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                <span className="text-blue-400 text-sm font-semibold mt-auto">Learn more →</span>
              </a>
            ))}
          </div>
          <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-r from-blue-600/20 to-blue-600/20 border border-blue-500/20">
            <p className="text-2xl font-bold mb-2">Ready to get started?</p>
            <p className="text-slate-400 mb-6">Login now and access your full inventory management suite.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login/user" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all">
                User Login →
              </Link>
              <Link to="/login/admin" className="px-8 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold rounded-2xl transition-all">
                Admin Portal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold italic">i</span>
            </div>
            <span className="text-xl font-bold tracking-tight">InventoryPro</span>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Platform</span>
              <Link to="/login/admin" className="text-sm text-slate-400 hover:text-white transition-colors">Admin Portal</Link>
              <Link to="/login/user" className="text-sm text-slate-400 hover:text-white transition-colors">User Access</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Navigate</span>
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#faq" className="text-sm text-slate-400 hover:text-white transition-colors">FAQ</a>
              <a href="#reviews" className="text-sm text-slate-400 hover:text-white transition-colors">Reviews</a>
              <a href="#assistance" className="text-sm text-slate-400 hover:text-white transition-colors">Help</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Support</span>
              <a href="mailto:support@inventorypro.com" className="text-sm text-slate-400 hover:text-white transition-colors">Email Us</a>
              <a href="#assistance" className="text-sm text-slate-400 hover:text-white transition-colors">API Docs</a>
            </div>
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 InventoryPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
