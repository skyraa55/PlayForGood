import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Trophy, Heart, Target, Plus, Edit2, Trash2, Check, X, Calendar, CreditCard, TrendingUp, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { format } from 'date-fns';

function StatusBadge({ status }) {
  if (status === 'active') return <span className="badge-active"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" />Active</span>;
  if (status === 'cancelling') return <span className="badge-pending">Cancelling</span>;
  return <span className="badge-inactive">Inactive</span>;
}

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [scores, setScores] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [charities, setCharities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editingScore, setEditingScore] = useState(null);
  const [newScore, setNewScore] = useState({ score: '', score_date: new Date().toISOString().split('T')[0] });
  const [showAddScore, setShowAddScore] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = useCallback(async () => {
    try {
      const [scoresRes, profileRes, charitiesRes] = await Promise.all([
        api.get('/scores'),
        api.get('/users/profile'),
        api.get('/charities'),
      ]);
      setScores(scoresRes.data);
      setProfile(profileRes.data);
      setCharities(charitiesRes.data);
      if (user?.subscription_status === 'active') {
        api.get('/draws/my-results').then(r => setMyResults(r.data)).catch(() => {});
      }
    } catch {}
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (searchParams.get('subscription') === 'success') {
      toast.success('Subscription activated! Welcome to GolfGives 🎉');
      refreshUser();
    }
  }, [searchParams, refreshUser]);

  const addScore = async () => {
    if (!newScore.score || !newScore.score_date) return toast.error('Score and date required');
    setLoadingScore(true);
    try {
      const res = await api.post('/scores', newScore);
      setScores(prev => [res.data, ...prev].slice(0, 5));
      setNewScore({ score: '', score_date: new Date().toISOString().split('T')[0] });
      setShowAddScore(false);
      toast.success('Score added!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add score');
    } finally {
      setLoadingScore(false);
    }
  };

  const saveEditScore = async (id) => {
    if (!editingScore) return;
    setLoadingScore(true);
    try {
      const res = await api.put(`/scores/${id}`, editingScore);
      setScores(prev => prev.map(s => s.id === id ? res.data : s));
      setEditingScore(null);
      toast.success('Score updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    } finally {
      setLoadingScore(false);
    }
  };

  const deleteScore = async (id) => {
    try {
      await api.delete(`/scores/${id}`);
      setScores(prev => prev.filter(s => s.id !== id));
      toast.success('Score removed');
    } catch {
      toast.error('Failed to delete score');
    }
  };

  const updateProfile = async (updates) => {
    try {
      await api.put('/users/profile', updates);
      setProfile(prev => ({ ...prev, ...updates }));
      refreshUser();
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const openBillingPortal = async () => {
    try {
      const res = await api.post('/subscriptions/portal');
      window.location.href = res.data.url;
    } catch {
      toast.error('Could not open billing portal');
    }
  };

  const cancelSubscription = async () => {
    if (!confirm('Cancel subscription? You will retain access until the billing period ends.')) return;
    try {
      await api.post('/subscriptions/cancel');
      refreshUser();
      toast.success('Subscription will cancel at period end');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not cancel');
    }
  };

  const tabs = ['overview', 'scores', 'draws', 'charity', 'settings'];

  return (
  <div className="min-h-screen bg-gray-50">
    <Navbar />

    <div className="pt-20 pb-16 px-4 sm:px-6 page-fade">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between py-6 border-b border-gray-200 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Welcome back, {user?.name}
            </p>
          </div>
          <StatusBadge status={user?.subscription_status} />
        </div>

        {/* Subscribe CTA */}
        {user?.subscription_status !== 'active' && (
          <div className="mb-6 p-5 bg-green-50 border border-green-200 rounded-2xl flex justify-between gap-4">
            <div>
              <p className="text-green-600 font-semibold">No active subscription</p>
              <p className="text-gray-600 text-sm">
                Subscribe to enter monthly draws and track your scores
              </p>
            </div>
            <Link to="/subscribe" className="btn-primary">Subscribe</Link>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'bg-gray-100 text-gray-900 border'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ---------------- OVERVIEW ---------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Subscription', value: user?.subscription_plan || 'None', icon: CreditCard, color: 'text-blue-500' },
                { label: 'Scores', value: `${scores.length}/5`, icon: Target, color: 'text-green-500' },
                { label: 'Draws', value: myResults.length, icon: Trophy, color: 'text-yellow-500' },
                { label: 'Charity', value: `${profile?.charity_percentage || 10}%`, icon: Heart, color: 'text-pink-500' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
                  <Icon size={18} className={color} />
                  <div className="text-xl font-bold text-gray-900 mt-2">{value}</div>
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
              ))}
            </div>

            {/* Cards */}
            <div className="grid lg:grid-cols-2 gap-5">

              {/* Scores */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Recent Scores</h3>
                {scores.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No scores</p>
                ) : (
                  scores.slice(0, 3).map(s => (
                    <div key={s.id} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-500 text-sm">
                        {format(new Date(s.score_date), 'dd MMM')}
                      </span>
                      <span className="text-gray-900 font-bold">{s.score}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Charity */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Charity</h3>
                {profile?.charities ? (
                  <div>
                    <p className="text-gray-900">{profile.charities.name}</p>
                    <p className="text-green-600 text-sm">
                      {profile.charity_percentage}%
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No charity selected</p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ---------------- SCORES ---------------- */}
        {activeTab === 'scores' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">

            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Scores</h2>

              {scores.length < 5 && user?.subscription_status === 'active' && (
                <button onClick={() => setShowAddScore(!showAddScore)} className="btn-primary">
                  Add Score
                </button>
              )}
            </div>

            {showAddScore && (
              <div className="mb-4 flex gap-3">
                <input type="number" className="input" placeholder="Score" />
                <input type="date" className="input" />
                <button className="btn-primary"><Check size={14} /></button>
              </div>
            )}

            {scores.map(s => (
              <div key={s.id} className="flex justify-between p-3 border border-gray-200 rounded-lg mb-2">
                <span>{s.score}</span>
                <button onClick={() => deleteScore(s.id)} className="text-red-500">
                  Delete
                </button>
              </div>
            ))}

          </div>
        )}

        {/* ---------------- DRAWS ---------------- */}
        {activeTab === 'draws' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Draw Results</h2>

            {myResults.length === 0 ? (
              <p className="text-gray-500">No results</p>
            ) : (
              myResults.map(r => (
                <div key={r.id} className="flex justify-between p-3 border border-gray-200 rounded-lg mb-2">
                  <span>{r.status}</span>
                  <span className="text-green-600">
                    £{((r.prize_amount || 0) / 100).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ---------------- CHARITY ---------------- */}
        {activeTab === 'charity' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Charity Settings</h2>

            <select className="input">
              <option>Select charity</option>
            </select>

            <input type="range" className="w-full accent-green-500" />

          </div>
        )}

        {/* ---------------- SETTINGS ---------------- */}
        {activeTab === 'settings' && (
          <div className="space-y-4">

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 mb-3">Subscription</h2>
              <button className="btn-secondary">Manage</button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 mb-3">Profile</h2>
              <ProfileSettings profile={profile} onUpdate={updateProfile} />
            </div>

          </div>
        )}

      </div>
    </div>

    <Footer />
  </div>
);
}

function ProfileSettings({ profile, onUpdate }) {
  const [form, setForm] = useState({ name: profile?.name || '' });
  useEffect(() => { if (profile) setForm({ name: profile.name }); }, [profile]);
  const handleSave = () => { if (form.name.trim()) onUpdate({ name: form.name }); };
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Full Name</label>
        <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" />
      </div>
      <div>
        <label className="label">Email</label>
        <input type="email" value={profile?.email || ''} disabled className="input opacity-50 cursor-not-allowed" />
      </div>
      <button onClick={handleSave} className="btn-primary text-sm py-2.5"><Check size={15} />Save Changes</button>
    </div>
  );
}
