import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';

const StarPicker = ({ rating, setRating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        onClick={() => setRating(star)}
        className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
          star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={`text-base ${s <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
        ★
      </span>
    ))}
  </div>
);

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
      fetchReviews(); // refresh the list
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = filter === 'all'
    ? reviews
    : reviews.filter((r) => r.rating === Number(filter));

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-950 dark:text-white tracking-tight">Community Feedback</h1>
        <p className="text-slate-500 dark:text-gray-400 mt-2 text-lg">
          See what others think and share your own Precision Inventory experience.
        </p>
      </div>

      {/* Summary Card */}
      {reviews.length > 0 && (
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/5 dark:to-blue-600/5 border border-blue-500/20 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
            <div className="text-center bg-white dark:bg-gray-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-inner">
              <p className="text-6xl font-black text-yellow-500 leading-none">{avgRating}</p>
              <div className="my-2"><StarDisplay rating={Math.round(Number(avgRating))} /></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">{reviews.length} Verified Entries</p>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-6">{star}★</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-6">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Submit a Review */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-lg">
        <h2 className="text-2xl font-black mb-1 text-slate-900 dark:text-white">⭐ File a Report</h2>
        <p className="text-slate-500 dark:text-gray-400 text-sm mb-8">
          Help us document the platform's performance.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <span className="text-5xl">🎉</span>
            <p className="text-xl font-bold dark:text-white">Thank you!</p>
            <p className="text-gray-500 text-sm">Your review has been posted.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Write Another
            </button>
          </div>
        ) : (
          <div className="space-y-5 max-w-xl">
            <div>
              <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">Your Rating</label>
              <StarPicker rating={rating} setRating={setRating} />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="What do you love about InventoryPro? What can be improved?"
                className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={submitReview}
              disabled={submitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : 'Post Review'}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Filter:</span>
        {['all', '5', '4', '3', '2', '1'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              filter === f
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f === 'all' ? 'All' : `${f} ★`}
          </button>
        ))}
        <span className="text-sm text-gray-400 ml-auto">{filteredReviews.length} result{filteredReviews.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-3xl h-40 animate-pulse"></div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-gray-900/50 rounded-[2.5rem] p-16 text-center border border-white/5">
          <span className="text-5xl mb-4 block">💬</span>
          <p className="text-gray-500">
            {reviews.length === 0
              ? 'No activity recorded yet. Be the first to file a review.'
              : 'No reviews match selected filters.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredReviews.map((r, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-blue-500/5 hover:border-slate-200 dark:hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                    {r.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-sm dark:text-gray-200">{r.userName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <StarDisplay rating={r.rating} />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">"{r.comment}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews;
