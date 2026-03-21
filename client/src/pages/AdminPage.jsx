import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Users, Trophy, Heart, TrendingUp, Shield, Play, Eye, Check, X, ChevronDown, RefreshCw, Trash2, Edit2, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { format } from 'date-fns';
import Navbar from '../components/layout/Navbar';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [winners, setWinners] = useState([]);
  const [draws, setDraws] = useState([]);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch {}
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.get('/admin/users?limit=50');
      setUsers(res.data.users);
    } catch {}
  }, []);

  const loadWinners = useCallback(async () => {
    try {
      const res = await api.get('/admin/winners');
      setWinners(res.data);
    } catch {}
  }, []);

  const loadDraws = useCallback(async () => {
    try {
      const res = await api.get('/draws');
      setDraws(res.data);
    } catch {}
  }, []);

  const loadCharities = useCallback(async () => {
    try {
      const res = await api.get('/charities');
      setCharities(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    loadStats();
    loadUsers();
    loadWinners();
    loadDraws();
    loadCharities();
  }, [loadStats, loadUsers, loadWinners, loadDraws, loadCharities]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'draws', label: 'Draws', icon: Trophy },
    { id: 'charities', label: 'Charities', icon: Heart },
    { id: 'winners', label: 'Winners', icon: DollarSign },
  ];

  return (
  <div className="min-h-screen bg-gray-50">
    <Navbar />

    <div className="pt-20 pb-16 px-4 sm:px-6 page-fade">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between py-6 border-b border-gray-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center border border-green-200">
              <Shield size={18} className="text-green-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Panel
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">
                Logged in as {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              loadStats();
              loadUsers();
              loadWinners();
              loadDraws();
              toast.success('Refreshed');
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                { label: 'Total Users', value: stats.total_users, color: 'text-blue-500', icon: Users },
                { label: 'Active Subs', value: stats.active_subscribers, color: 'text-green-500', icon: Check },
                { label: 'Total Draws', value: stats.total_draws, color: 'text-yellow-500', icon: Trophy },
                { label: 'Prize Pool', value: `£${(stats.prize_pool / 100).toFixed(0)}`, color: 'text-purple-500', icon: DollarSign },
                { label: 'Charity Total', value: `£${(stats.charity_total / 100).toFixed(0)}`, color: 'text-pink-500', icon: Heart },
                { label: 'Pending Payout', value: `£${(stats.pending_payout / 100).toFixed(0)}`, color: 'text-orange-500', icon: TrendingUp },
              ].map(({ label, value, color, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <Icon size={16} className={color} />
                  <div className={`text-2xl font-bold mt-2 ${color}`}>
                    {value}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-gray-900 font-bold mb-4">
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                <button
                  onClick={() => setActiveTab('draws')}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm py-3 rounded-lg flex flex-col items-center gap-1 transition-all"
                >
                  <Play size={18} />
                  <span>Run Draw</span>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm py-3 rounded-lg flex flex-col items-center gap-1 transition-all"
                >
                  <Users size={18} />
                  <span>Manage Users</span>
                </button>

                <button
                  onClick={() => setActiveTab('winners')}
                  className="border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm py-3 rounded-lg flex flex-col items-center gap-1 transition-all"
                >
                  <DollarSign size={18} />
                  <span>Verify Winners</span>
                </button>

                <button
                  onClick={() => setActiveTab('charities')}
                  className="border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm py-3 rounded-lg flex flex-col items-center gap-1 transition-all"
                >
                  <Heart size={18} />
                  <span>Charities</span>
                </button>

              </div>
            </div>

          </div>
        )}

        {/* Tabs Content */}
        {activeTab === 'users' && (
          <AdminUsers users={users} onRefresh={loadUsers} />
        )}

        {activeTab === 'draws' && (
          <AdminDraws draws={draws} onRefresh={loadDraws} />
        )}

        {activeTab === 'charities' && (
          <AdminCharities charities={charities} onRefresh={loadCharities} />
        )}

        {activeTab === 'winners' && (
          <AdminWinners winners={winners} onRefresh={loadWinners} />
        )}

      </div>
    </div>
  </div>
);
}

// ──────────────────────────── Sub-components ────────────────────────────

function AdminUsers({ users, onRefresh }) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const filtered = users.filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const updateUser = async (id, updates) => {
    try {
      await api.put(`/admin/users/${id}`, updates);
      toast.success('User updated');
      onRefresh();
      setEditing(null);
    } catch { toast.error('Update failed'); }
  };

  return (
  <div className="card bg-white border border-gray-200">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-bold text-gray-900">
        Users ({users.length})
      </h2>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input w-56 py-2 text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400"
      />
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {['Name', 'Email', 'Plan', 'Status', 'Charity %', 'Joined', 'Actions'].map(h => (
              <th
                key={h}
                className="text-left py-3 px-2 text-gray-500 font-medium text-xs"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filtered.map(u => (
            <tr
              key={u.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-all"
            >
              <td className="py-3 px-2 text-gray-900 font-medium">
                {u.name}
              </td>
              <td className="py-3 px-2 text-gray-600">
                {u.email}
              </td>
              <td className="py-3 px-2 text-gray-600 capitalize">
                {u.subscription_plan || '—'}
              </td>

              <td className="py-3 px-2">
                {u.subscription_status === 'active' ? (
                  <span className="badge-active">Active</span>
                ) : (
                  <span className="badge-inactive capitalize">
                    {u.subscription_status}
                  </span>
                )}
              </td>

              <td className="py-3 px-2 text-gray-600">
                {u.charity_percentage}%
              </td>

              <td className="py-3 px-2 text-gray-500 text-xs">
                {u.created_at
                  ? format(new Date(u.created_at), 'dd MMM yy')
                  : '—'}
              </td>

              <td className="py-3 px-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(u)}
                    className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 size={13} />
                  </button>

                  <button
                    onClick={() => {
                      const newStatus =
                        u.subscription_status === 'active'
                          ? 'inactive'
                          : 'active';
                      if (confirm(`Set subscription to ${newStatus}?`))
                        updateUser(u.id, { subscription_status: newStatus });
                    }}
                    className="p-1.5 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
                  >
                    <Check size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {editing && (
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={() => setEditing(null)}
      >
        <div
          className="card bg-white border border-gray-200 w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-gray-900 font-bold mb-4">
            Edit User: {editing.name}
          </h3>

          <EditUserForm
            user={editing}
            onSave={(updates) => updateUser(editing.id, updates)}
            onClose={() => setEditing(null)}
          />
        </div>
      </div>
    )}
  </div>
);
}

function EditUserForm({ user, onSave, onClose }) {
  const [form, setForm] = useState({ name: user.name, subscription_status: user.subscription_status, charity_percentage: user.charity_percentage });
  return (
  <div className="space-y-4">
    
    <div>
      <label className="label text-gray-700">Name</label>
      <input
        className="input bg-white border border-gray-200 text-gray-900 placeholder-gray-400"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
    </div>

    <div>
      <label className="label text-gray-700">Subscription Status</label>
      <select
        className="input bg-white border border-gray-200 text-gray-900"
        value={form.subscription_status}
        onChange={e => setForm({ ...form, subscription_status: e.target.value })}
      >
        {['active', 'inactive', 'cancelling'].map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="label text-gray-700">Charity %</label>
      <input
        type="number"
        min="10"
        max="100"
        className="input bg-white border border-gray-200 text-gray-900"
        value={form.charity_percentage}
        onChange={e =>
          setForm({ ...form, charity_percentage: parseInt(e.target.value) })
        }
      />
    </div>

    <div className="flex gap-3">
      <button
        onClick={() => onSave(form)}
        className="btn-primary flex-1 text-sm py-2.5"
      >
        Save
      </button>

      <button
        onClick={onClose}
        className="btn-ghost border border-gray-200 text-gray-700 hover:bg-gray-100 flex-1 text-sm py-2.5"
      >
        Cancel
      </button>
    </div>

  </div>
);
}

function AdminDraws({ draws, onRefresh }) {
  const [method, setMethod] = useState('random');
  const [simResult, setSimResult] = useState(null);
  const [running, setRunning] = useState(false);

  const simulate = async () => {
    setRunning(true);
    try {
      const res = await api.post('/draws/simulate', { method });
      setSimResult(res.data);
      toast.success('Simulation complete!');
    } catch (err) { toast.error(err.response?.data?.error || 'Simulation failed'); }
    finally { setRunning(false); }
  };

  const runDraw = async () => {
    if (!confirm('Run and save this draw? This cannot be undone.')) return;
    setRunning(true);
    try {
      const res = await api.post('/draws/run', { method, draw_date: new Date().toISOString() });
      toast.success(`Draw complete! ${res.data.winner_counts.five_match} jackpot winners`);
      onRefresh();
      setSimResult(null);
    } catch (err) { toast.error(err.response?.data?.error || 'Draw failed'); }
    finally { setRunning(false); }
  };

  const publishDraw = async (id) => {
    try {
      await api.post(`/draws/${id}/publish`);
      toast.success('Draw published!');
      onRefresh();
    } catch { toast.error('Publish failed'); }
  };

  return (
  <div className="space-y-5">
    
    {/* Run Draw */}
    <div className="card bg-white border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        Run Monthly Draw
      </h2>

      <div className="flex gap-3 mb-5">
        {['random', 'algorithmic'].map(m => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex-1 py-3 rounded-xl text-sm font-medium capitalize border transition-all ${
              method === m
                ? 'bg-green-50 border-green-300 text-green-600'
                : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-xs mb-4">
        {method === 'random'
          ? 'Standard lottery: 5 numbers drawn uniformly at random from 1–45.'
          : 'Weighted by score frequency: less frequent scores are more likely to be drawn.'}
      </p>

      <div className="flex gap-3">
        <button
          onClick={simulate}
          disabled={running}
          className="btn-secondary flex-1"
        >
          {running ? (
            <span className="w-4 h-4 border-2 border-green-300 border-t-green-500 rounded-full animate-spin" />
          ) : (
            <>
              <Eye size={15} />Simulate
            </>
          )}
        </button>

        <button
          onClick={runDraw}
          disabled={running}
          className="btn-primary flex-1"
        >
          {running ? (
            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Play size={15} />Run Draw
            </>
          )}
        </button>
      </div>

      {simResult && (
        <div className="mt-5 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-gray-900 font-semibold mb-3">
            Simulation Result
          </p>

          <div className="flex gap-3 mb-4 flex-wrap">
            {simResult.drawn_numbers.map(n => (
              <div
                key={n}
                className="w-12 h-12 bg-green-50 border border-green-300 rounded-xl flex items-center justify-center text-green-600 font-bold"
              >
                {n}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
              <p className="text-yellow-600 font-bold">
                {simResult.winner_counts.five_match}
              </p>
              <p className="text-gray-500 text-xs">Jackpot</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
              <p className="text-blue-600 font-bold">
                {simResult.winner_counts.four_match}
              </p>
              <p className="text-gray-500 text-xs">4 Match</p>
            </div>

            <div className="bg-green-50 rounded-lg p-2 border border-green-200">
              <p className="text-green-600 font-bold">
                {simResult.winner_counts.three_match}
              </p>
              <p className="text-gray-500 text-xs">3 Match</p>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* All Draws */}
    <div className="card bg-white border border-gray-200">
      <h3 className="text-gray-900 font-bold mb-4">
        All Draws ({draws.length})
      </h3>

      {draws.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">
          No draws yet
        </p>
      ) : (
        <div className="space-y-3">
          {draws.map(d => (
            <div
              key={d.id}
              className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl"
            >
              <div>
                <p className="text-gray-900 font-medium text-sm">
                  {format(new Date(d.draw_date), 'MMMM yyyy')}
                </p>

                <div className="flex gap-2 mt-1 flex-wrap">
                  {d.drawn_numbers?.map(n => (
                    <span
                      key={n}
                      className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    d.status === 'published'
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                  }`}
                >
                  {d.status}
                </span>

                {d.status === 'draft' && (
                  <button
                    onClick={() => publishDraw(d.id)}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  </div>
);
}

function AdminCharities({ charities, onRefresh }) {
  const [form, setForm] = useState({ name: '', description: '', website: '', logo_url: '', featured: false });
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const saveCharity = async () => {
    if (!form.name) return toast.error('Name required');
    try {
      if (editing) {
        await api.put(`/charities/${editing.id}`, form);
        toast.success('Charity updated');
      } else {
        await api.post('/charities', form);
        toast.success('Charity added');
      }
      setForm({ name: '', description: '', website: '', logo_url: '', featured: false });
      setEditing(null);
      setShowAdd(false);
      onRefresh();
    } catch { toast.error('Save failed'); }
  };

  const deleteCharity = async (id) => {
    if (!confirm('Deactivate this charity?')) return;
    try { await api.delete(`/charities/${id}`); toast.success('Charity deactivated'); onRefresh(); }
    catch { toast.error('Failed'); }
  };

  const startEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || '', website: c.website || '', logo_url: c.logo_url || '', featured: c.featured || false });
    setShowAdd(true);
  };

  return (
  <div className="card bg-white border border-gray-200">
    
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-bold text-gray-900">
        Charities ({charities.length})
      </h2>

      <button
        onClick={() => {
          setEditing(null);
          setForm({ name: '', description: '', website: '', logo_url: '', featured: false });
          setShowAdd(!showAdd);
        }}
        className="btn-primary text-sm py-2"
      >
        Add Charity
      </button>
    </div>

    {showAdd && (
      <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
        
        <h3 className="text-gray-900 font-semibold">
          {editing ? 'Edit Charity' : 'Add New Charity'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="label text-gray-700">Name *</label>
            <input
              className="input bg-white border border-gray-200 text-gray-900"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="label text-gray-700">Website</label>
            <input
              className="input bg-white border border-gray-200 text-gray-900"
              value={form.website}
              onChange={e => setForm({ ...form, website: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="label text-gray-700">Logo URL</label>
            <input
              className="input bg-white border border-gray-200 text-gray-900"
              value={form.logo_url}
              onChange={e => setForm({ ...form, logo_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={e => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 accent-green-500"
            />
            <label htmlFor="featured" className="text-gray-700 text-sm">
              Featured on homepage
            </label>
          </div>
        </div>

        <div>
          <label className="label text-gray-700">Description</label>
          <textarea
            className="input resize-none bg-white border border-gray-200 text-gray-900"
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button onClick={saveCharity} className="btn-primary text-sm py-2.5">
            Save Charity
          </button>

          <button
            onClick={() => setShowAdd(false)}
            className="btn-ghost border border-gray-200 text-gray-700 hover:bg-gray-100 text-sm py-2.5"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    <div className="space-y-3">
      {charities.map(c => (
        <div
          key={c.id}
          className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl"
        >
          
          <div className="flex items-center gap-3">
            {c.logo_url ? (
              <img
                src={c.logo_url}
                alt={c.name}
                className="w-10 h-10 object-contain rounded-lg bg-gray-100 p-1"
              />
            ) : (
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Heart size={16} className="text-green-500" />
              </div>
            )}

            <div>
              <p className="text-gray-900 font-medium text-sm">
                {c.name}
              </p>

              <div className="flex gap-2 mt-0.5">
                {c.featured && (
                  <span className="text-xs text-yellow-500">
                    ⭐ Featured
                  </span>
                )}

                <span
                  className={`text-xs ${
                    c.active ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {c.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => startEdit(c)}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
            >
              <Edit2 size={14} />
            </button>

            <button
              onClick={() => deleteCharity(c.id)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>

  </div>
);
}

function AdminWinners({ winners, onRefresh }) {
  const verifyWinner = async (id, status) => {
    try {
      await api.put(`/admin/winners/${id}/verify`, { status });
      toast.success(`Winner ${status}`);
      onRefresh();
    } catch { toast.error('Failed'); }
  };

  const markPaid = async (id) => {
    try {
      await api.put(`/admin/winners/${id}/payout`);
      toast.success('Marked as paid');
      onRefresh();
    } catch { toast.error('Failed'); }
  };

  return (
  <div className="card bg-white border border-gray-200">
    <h2 className="text-xl font-bold text-gray-900 mb-5">
      Winners & Payouts ({winners.length})
    </h2>

    {winners.length === 0 ? (
      <p className="text-gray-500 text-center py-8">No winners yet</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {['Player', 'Draw', 'Match', 'Prize', 'Status', 'Verification', 'Actions'].map(h => (
                <th
                  key={h}
                  className="text-left py-3 px-2 text-gray-500 font-medium text-xs"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {winners.map(w => (
              <tr key={w.id} className="border-b border-gray-100">
                <td className="py-3 px-2">
                  <p className="text-gray-900 text-sm font-medium">
                    {w.users?.name || '—'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {w.users?.email}
                  </p>
                </td>

                <td className="py-3 px-2 text-gray-500 text-xs">
                  {w.draws?.draw_date
                    ? format(new Date(w.draws.draw_date), 'MMM yyyy')
                    : '—'}
                </td>

                <td className="py-3 px-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      w.match_type === 'five_match'
                        ? 'bg-yellow-50 text-yellow-600'
                        : w.match_type === 'four_match'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-green-50 text-green-600'
                    }`}
                  >
                    {w.match_type?.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-3 px-2 text-green-600 font-bold">
                  £{((w.prize_amount || 0) / 100).toFixed(2)}
                </td>

                <td className="py-3 px-2">
                  <span
                    className={`text-xs capitalize px-2 py-0.5 rounded-full border ${
                      w.status === 'paid'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                    }`}
                  >
                    {w.status}
                  </span>
                </td>

                <td className="py-3 px-2">
                  <span
                    className={`text-xs capitalize ${
                      w.verification_status === 'approved'
                        ? 'text-green-600'
                        : w.verification_status === 'rejected'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {w.verification_status || 'pending'}
                  </span>
                </td>

                <td className="py-3 px-2">
                  <div className="flex gap-1">
                    {(!w.verification_status ||
                      w.verification_status === 'pending') && (
                      <>
                        <button
                          onClick={() => verifyWinner(w.id, 'approved')}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title="Approve"
                        >
                          <Check size={13} />
                        </button>

                        <button
                          onClick={() => verifyWinner(w.id, 'rejected')}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Reject"
                        >
                          <X size={13} />
                        </button>
                      </>
                    )}

                    {w.verification_status === 'approved' &&
                      w.status !== 'paid' && (
                        <button
                          onClick={() => markPaid(w.id)}
                          className="btn-primary text-xs py-1.5 px-3"
                        >
                          Mark Paid
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
}
