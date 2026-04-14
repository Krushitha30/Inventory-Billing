import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import API_URL from '../apiConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={`text-base ${s <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>★</span>
    ))}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, reviewsRes, messagesRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/user-stats`),
          axios.get(`${API_URL}/api/admin/reviews`),
          axios.get(`${API_URL}/api/support/admin/all`),
        ]);
        setStats(statsRes.data);
        setReviews(reviewsRes.data);
        setMessages(messagesRes.data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-500/30 animate-spin border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-400">Loading admin metrics...</p>
        </div>
      </div>
    );

  if (!stats)
    return <div className="p-10 text-center text-red-500">Failed to load analytics.</div>;

  const subData = {
    labels: stats.subscriptionStats.map((s) => s._id || 'Unknown'),
    datasets: [
      {
        data: stats.subscriptionStats.map((s) => s.count),
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'],
        hoverOffset: 6,
        borderWidth: 0,
      },
    ],
  };

  const premiumCount = stats.subscriptionStats
    .filter((s) => s._id !== 'Free')
    .reduce((a, b) => a + b.count, 0);

  const premiumConversion = stats.totalUsers
    ? ((premiumCount / stats.totalUsers) * 100).toFixed(1)
    : 0;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : 'N/A';

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'subscriptions', label: '💳 Subscriptions' },
    { id: 'users', label: '👥 Users' },
    { id: 'reviews', label: `⭐ Reviews (${reviews.length})` },
    { id: 'support', label: `🆘 Support (${messages.filter(m => m.status === 'Open').length})` },
  ];

  const updateMessageStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/support/admin/${id}`, { status });
      setMessages(messages.map(m => m._id === id ? { ...m, status } : m));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="pb-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Enterprise Analytics</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Real-time overview of users, subscriptions &amp; reviews</p>
        </div>
        <div className="text-sm bg-blue-500/10 text-blue-500 px-4 py-2 rounded-full font-bold border border-blue-500/20 self-start md:self-auto">
          Admin Portal Active
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
            <span className="text-6xl">👥</span>
          </div>
          <h3 className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1 text-[10px]">Total Registered</h3>
          <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{stats.totalUsers}</p>
          <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-1">All platform users</p>
        </div>

        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
            <span className="text-6xl">⚡</span>
          </div>
          <h3 className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1 text-[10px]">Actively Using</h3>
          <p className="text-4xl font-black text-green-500">{stats.activeUsers}</p>
          <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-1">Active status accounts</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2.5rem] shadow-2xl shadow-blue-500/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <span className="text-6xl">💎</span>
          </div>
          <h3 className="text-blue-100/70 font-bold uppercase tracking-widest mb-1 text-[10px]">Premium Users</h3>
          <p className="text-4xl font-black">{premiumCount}</p>
          <p className="text-[10px] text-blue-200 mt-1">{premiumConversion}% conversion rate</p>
        </div>

        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
            <span className="text-6xl">⭐</span>
          </div>
          <h3 className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1 text-[10px]">Avg. Review</h3>
          <p className="text-4xl font-black text-yellow-500">{avgRating}</p>
          <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-1">{reviews.length} total reviews</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-6 dark:text-gray-100">Subscription Breakdown</h3>
            <div className="w-full h-72 flex items-center justify-center">
              {stats.subscriptionStats.length > 0 ? (
                <Doughnut
                  data={subData}
                  options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
                />
              ) : (
                <p className="text-gray-400">No subscription data yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-6 dark:text-gray-100">Recently Joined</h3>
            <div className="space-y-3">
              {stats.recentUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600 dark:text-blue-300 text-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{u.name}</h4>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.subscription === 'Free' ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'}`}>
                    {u.subscription}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Subscriptions */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold dark:text-gray-100">Subscription Plans</h3>
            <p className="text-gray-500 text-sm mt-1">Breakdown of all subscription tiers</p>
          </div>
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
              <div className="h-80 flex items-center justify-center">
                {stats.subscriptionStats.length > 0 ? (
                  <Doughnut data={subData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                ) : (
                  <p className="text-gray-400">No data yet.</p>
                )}
              </div>
            </div>
            <div className="p-8 space-y-4">
              {stats.subscriptionStats.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subData.datasets[0].backgroundColor[i] }}></div>
                    <span className="font-semibold dark:text-gray-200">{s._id || 'Unknown'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black dark:text-white">{s.count}</span>
                    <p className="text-xs text-gray-400">{stats.totalUsers ? ((s.count / stats.totalUsers) * 100).toFixed(1) : 0}% of users</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-indigo-50 dark:bg-blue-900/30 rounded-2xl">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  💡 {premiumConversion}% of users have upgraded to a paid plan
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold dark:text-gray-100">All Users — {stats.totalUsers} registered</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {stats.recentUsers.map((u) => (
              <div key={u._id} className="flex items-center justify-between px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-gray-200">{u.name}</h4>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${u.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-200 text-gray-500'}`}>
                    {u.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${u.subscription === 'Free' ? 'bg-gray-100 dark:bg-gray-700 text-gray-500' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'}`}>
                    {u.subscription}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-700">
              <span className="text-5xl mb-4 block">⭐</span>
              <p className="text-gray-500">No reviews yet. Reviews submitted by users will appear here.</p>
            </div>
          ) : (
            <>
              {/* Rating Summary */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-black text-yellow-500">{avgRating}</p>
                    <StarDisplay rating={Math.round(Number(avgRating))} />
                    <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-4">{star}★</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-500 w-6">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="grid md:grid-cols-2 gap-4">
                {reviews.map((r, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                          {r.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-sm dark:text-gray-200">{r.userName}</p>
                          <p className="text-xs text-gray-500 capitalize">{r.role === 'staff' ? 'User' : r.role}</p>
                        </div>
                      </div>
                      <StarDisplay rating={r.rating} />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">"{r.comment}"</p>
                    <p className="text-xs text-gray-400 mt-3">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {/* Tab: Support */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-700">
              <span className="text-5xl mb-4 block">🆘</span>
              <p className="text-gray-500">No support messages yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {messages.map((m) => (
                <div key={m._id} className={`bg-white dark:bg-gray-800 rounded-3xl p-6 border ${m.status === 'Open' ? 'border-blue-500/30' : 'border-gray-100 dark:border-gray-700'} shadow-sm transition-all hover:shadow-md`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ${m.status === 'Open' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-gray-400'}`}>
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold dark:text-gray-100">{m.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${m.status === 'Open' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{m.email} • {new Date(m.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    {m.status === 'Open' && (
                      <button 
                        onClick={() => updateMessageStatus(m._id, 'Closed')}
                        className="bg-gray-100 hover:bg-green-500 hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-green-600 text-gray-600 text-sm font-bold px-6 py-2 rounded-xl transition-all self-start md:self-auto"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{m.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
