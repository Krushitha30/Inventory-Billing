import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';

const guides = [
  {
    icon: '🚀',
    title: 'Getting Started',
    color: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/30',
    steps: [
      'Login with your user credentials',
      'Navigate to Dashboard to see an overview',
      'Add products in the Products section',
      'Set cost price and selling price for each product',
      'Use Billing to create customer invoices',
    ],
  },
  {
    icon: '🧾',
    title: 'Billing & Checkout',
    color: 'from-green-500/20 to-teal-500/20',
    border: 'border-green-500/30',
    steps: [
      'Go to the Billing page from the sidebar',
      'Enter the customer name',
      'Select a product from the dropdown',
      'Enter the quantity needed',
      'Click "Add Item", then "Checkout & Print Invoice"',
    ],
  },
  {
    icon: '📦',
    title: 'Inventory Management',
    color: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    steps: [
      'Go to Products from the sidebar',
      'Click Add to create a new product',
      'Set name, category, cost price, selling price, and qty',
      'Red rows indicate low stock (< 5 units)',
      'Use Edit to update product details anytime',
    ],
  },
  {
    icon: '👥',
    title: 'Customers & Suppliers',
    color: 'from-orange-500/20 to-yellow-500/20',
    border: 'border-orange-500/30',
    steps: [
      'Add customers in the Customers section',
      'Track customer contact details',
      'Add suppliers in the Suppliers section',
      'Manage supplier products and contacts',
      'View Sales Ledger for all transaction history',
    ],
  },
];

const faqs = [
  {
    q: 'How do I reset my password?',
    a: 'Contact your admin to reset your password. Admins can update credentials from the user management panel.',
  },
  {
    q: 'Can I print an invoice without completing checkout?',
    a: 'No. You must click "Checkout & Print Invoice" to generate the PDF. The invoice is auto-saved to the sales ledger.',
  },
  {
    q: 'What does "Low Stock" mean?',
    a: 'Any product with fewer than 5 units in stock is flagged red. The Dashboard also shows low stock alerts.',
  },
  {
    q: 'How is GST calculated?',
    a: 'GST is calculated at 18% on the subtotal. It is shown separately on the invoice.',
  },
  {
    q: 'Can I edit a completed sale?',
    a: 'No. Once a sale is processed and stock is deducted, it is recorded in the Sales Ledger permanently.',
  },
  {
    q: 'How do I view my sales history?',
    a: 'Go to Sales Ledger from the sidebar. All invoices are stored chronologically.',
  },
];

const StarPicker = ({ rating, setRating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        onClick={() => setRating(star)}
        className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'
          }`}
      >
        ★
      </button>
    ))}
  </div>
);

const Assistance = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitReview = async () => {
    if (!rating) return setError('Please select a star rating.');
    if (!comment.trim()) return setError('Please write a comment.');
    setSubmitting(true);
    setError('');
    try {
      await axios.post(`${API_URL}/api/reviews`, { rating, comment });
      setSubmitted(true);
      setRating(0);
      setComment('');
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Support Center</h1>
        <p className="text-slate-500 dark:text-gray-400 mt-2 text-lg">
          Everything you need to master your InventoryPro station.
        </p>
      </div>

      {/* Quick Guide Cards */}
      <section>
        <h2 className="text-xl font-bold mb-6 dark:text-gray-100">📖 Quick Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((g) => (
            <div
              key={g.title}
              className={`bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{g.icon}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{g.title}</h3>
              </div>
              <ol className="space-y-2">
                {g.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-gray-300">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 text-slate-500 dark:text-white/70">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-gray-100">❓ Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center p-5 text-left font-semibold dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <span className={`text-xl transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-gradient-to-br from-blue-500/10 to-purple-500/20 border border-blue-500/20 dark:border-blue-500/10 rounded-[2.5rem] p-8">
        <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-gray-100">📞 Contact Support</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          Still stuck? Reach out to your admin or our support team.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-2xl">📧</span>
            <p className="font-bold text-sm dark:text-white">Email Support</p>
            <a href="mailto:support@inventorypro.com" className="text-blue-600 dark:text-indigo-400 text-xs hover:underline">
              support@inventorypro.com
            </a>
          </div>
          <div 
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-support'))}
            className="bg-white/50 dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer hover:bg-white/70 dark:hover:bg-white/10 transition-all border border-transparent hover:border-blue-500/20"
          >
            <span className="text-2xl">💬</span>
            <p className="font-bold text-sm dark:text-white">Live Chat</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Available Mon–Fri, 9am–6pm IST</p>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-2xl">📱</span>
            <p className="font-bold text-sm dark:text-white">Phone Support</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">+91 98765 43210</p>
          </div>
        </div>
      </section>

      {/* Leave a Review */}
      <section className="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-10">
        <h2 className="text-2xl font-black mb-2 text-white">⭐ Community Review</h2>
        <p className="text-gray-500 text-sm mb-8">
          Help us refine the Precision Inventory experience.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <span className="text-5xl">🎉</span>
            <p className="text-xl font-bold dark:text-white">Thank you for your review!</p>
            <p className="text-gray-500 text-sm">Your feedback has been shared with the admin team.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Submit Another
            </button>
          </div>
        ) : (
          <div className="space-y-5 max-w-xl">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-300">Your Rating</label>
              <StarPicker rating={rating} setRating={setRating} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-300">Your Feedback</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Tell us what you love or what we can improve..."
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={submitReview}
              disabled={submitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Assistance;
