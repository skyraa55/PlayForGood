import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Trophy, Heart, Target, Plus, Edit2, Trash2, Check, X,
  CreditCard, TrendingUp, Award, User, ChevronDown, Settings,
  BarChart2, Star, ArrowRight, Calendar, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { format } from 'date-fns';

/* ─────────────────────────────────────────
   Styles
───────────────────────────────────────── */
function useStyles() {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

      @keyframes fadeSlideUp {
        from { opacity:0; transform:translateY(20px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes spinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes floatY {
        0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)}
      }
      @keyframes shimmer {
        0%   { transform:translateX(-100%); }
        100% { transform:translateX(400%); }
      }
      @keyframes ballPop {
        from { opacity:0; transform:scale(0.3) rotate(-10deg); }
        70%  { transform:scale(1.08) rotate(2deg); }
        to   { opacity:1; transform:scale(1) rotate(0deg); }
      }
      @keyframes ballGlow {
        0%,100%{box-shadow:0 4px 16px rgba(0,107,58,0.28)}
        50%    {box-shadow:0 6px 28px rgba(0,107,58,0.55)}
      }
      @keyframes pulseRing {
        0%  {box-shadow:0 0 0 0 rgba(0,107,58,0.30)}
        70% {box-shadow:0 0 0 10px rgba(0,107,58,0)}
        100%{box-shadow:0 0 0 0 rgba(0,107,58,0)}
      }
      @keyframes progressFill {
        from { width:0%; }
      }
      @keyframes gradientShift {
        0%,100%{background-position:0% 50%}
        50%    {background-position:100% 50%}
      }

      .db-tab {
        padding:9px 18px; border-radius:10px; border:none;
        cursor:pointer; font-family:'DM Sans',sans-serif;
        font-size:13px; font-weight:600;
        transition:all 0.2s ease;
        display:flex; align-items:center; gap:6px;
        white-space:nowrap;
        background:transparent; color:#7a9585;
      }
      .db-tab:hover { color:#006B3A; background:#f0f7f3; }
      .db-tab.active {
        background:linear-gradient(135deg,#006B3A,#00874a);
        color:#fff;
        box-shadow:0 4px 14px rgba(0,107,58,0.28);
      }

      .db-stat-card {
        background:#fff; border:1.5px solid #e8f0eb;
        border-radius:18px; padding:20px;
        transition:transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        position:relative; overflow:hidden;
      }
      .db-stat-card:hover {
        transform:translateY(-4px);
        box-shadow:0 14px 36px rgba(0,107,58,0.10);
        border-color:#006B3A;
      }

      .db-card {
        background:#fff; border:1.5px solid #e8f0eb;
        border-radius:18px; padding:24px;
        transition:box-shadow 0.22s ease;
      }

      .db-input {
        width:100%; box-sizing:border-box;
        padding:10px 14px;
        border:1.5px solid #dde8e2; border-radius:10px;
        font-size:13px; color:#0d1f14;
        background:#fff; font-family:'DM Sans',sans-serif;
        transition:border-color 0.2s, box-shadow 0.2s;
      }
      .db-input:focus {
        outline:none;
        border-color:#006B3A !important;
        box-shadow:0 0 0 3px rgba(0,107,58,0.12) !important;
      }
      .db-input::placeholder { color:#b0c4b8; }
      .db-input:disabled { opacity:0.5; cursor:not-allowed; background:#f8fdf9; }

      .db-select {
        width:100%; box-sizing:border-box;
        padding:10px 36px 10px 14px;
        border:1.5px solid #dde8e2; border-radius:10px;
        font-size:13px; color:#0d1f14;
        background:#fff; font-family:'DM Sans',sans-serif;
        appearance:none; -webkit-appearance:none; cursor:pointer;
        transition:border-color 0.2s, box-shadow 0.2s;
      }
      .db-select:focus {
        outline:none;
        border-color:#006B3A !important;
        box-shadow:0 0 0 3px rgba(0,107,58,0.12) !important;
      }

      .db-btn-primary {
        display:inline-flex; align-items:center; gap:6px;
        padding:10px 20px; border-radius:10px; border:none;
        background:#006B3A; color:#fff;
        font-weight:600; font-size:13px;
        cursor:pointer; font-family:'DM Sans',sans-serif;
        box-shadow:0 4px 14px rgba(0,107,58,0.28);
        transition:transform 0.15s ease, box-shadow 0.15s ease;
        position:relative; overflow:hidden;
      }
      .db-btn-primary:hover {
        transform:translateY(-1px);
        box-shadow:0 8px 22px rgba(0,107,58,0.38);
      }
      .db-btn-primary:disabled { opacity:0.6; cursor:not-allowed; }

      .db-btn-secondary {
        display:inline-flex; align-items:center; gap:6px;
        padding:9px 18px; border-radius:10px;
        border:1.5px solid #dde8e2; background:#fff;
        color:#006B3A; font-weight:600; font-size:13px;
        cursor:pointer; font-family:'DM Sans',sans-serif;
        transition:border-color 0.2s, box-shadow 0.2s;
      }
      .db-btn-secondary:hover {
        border-color:#006B3A;
        box-shadow:0 4px 14px rgba(0,107,58,0.10);
      }

      .db-btn-danger {
        display:inline-flex; align-items:center; gap:4px;
        padding:6px 12px; border-radius:8px; border:none;
        background:#fef2f2; color:#ef4444; font-size:12px; font-weight:600;
        cursor:pointer; font-family:'DM Sans',sans-serif;
        transition:background 0.2s;
      }
      .db-btn-danger:hover { background:#fee2e2; }

      .score-row {
        display:flex; align-items:center; justify-content:space-between;
        padding:12px 16px; border-radius:12px;
        border:1.5px solid #e8f0eb; background:#fcfffe;
        transition:border-color 0.2s, box-shadow 0.2s;
        margin-bottom:8px;
      }
      .score-row:hover { border-color:#006B3A; box-shadow:0 4px 14px rgba(0,107,58,0.07); }

      .result-row {
        display:flex; align-items:center; justify-content:space-between;
        padding:14px 16px; border-radius:12px;
        border:1.5px solid #e8f0eb; margin-bottom:8px;
        transition:border-color 0.2s;
      }
      .result-row:hover { border-color:#c8e6d4; }

      .db-range {
        -webkit-appearance:none; appearance:none;
        height:4px; border-radius:4px; cursor:pointer;
        background:linear-gradient(to right, #006B3A var(--pct,10%), #dde8e2 var(--pct,10%));
        width:100%;
      }
      .db-range::-webkit-slider-thumb {
        -webkit-appearance:none; appearance:none;
        width:18px; height:18px; border-radius:50%;
        background:#006B3A; cursor:pointer;
        box-shadow:0 2px 8px rgba(0,107,58,0.35);
        border:2px solid #fff; transition:transform 0.15s;
      }
      .db-range::-webkit-slider-thumb:hover { transform:scale(1.2); }
    `;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
}

/* ─────────────────────────────────────────
   Status Badge
───────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    active:     { label:'Active',     bg:'#f0fdf4', border:'#bbf7d0', color:'#15803d', dot:'#22c55e' },
    cancelling: { label:'Cancelling', bg:'#fffbeb', border:'#fde68a', color:'#b45309', dot:'#f59e0b' },
  };
  const s = map[status] || { label:'Inactive', bg:'#f3f4f6', border:'#e5e7eb', color:'#6b7280', dot:'#9ca3af' };
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'5px 12px', borderRadius:999,
      background:s.bg, border:`1px solid ${s.border}`, color:s.color,
      fontSize:12, fontWeight:700,
    }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background:s.dot, display:'inline-block' }}/>
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────
   Match Badge
───────────────────────────────────────── */
function MatchBadge({ type }) {
  const map = {
    five_match:  { label:'🏆 5 Match', bg:'#fffbeb', border:'#fde68a', color:'#b45309' },
    four_match:  { label:'⭐ 4 Match', bg:'#eff6ff', border:'#bfdbfe', color:'#1d4ed8' },
    three_match: { label:'✓ 3 Match',  bg:'#f0f7f3', border:'#a7f3d0', color:'#006B3A' },
  };
  const m = map[type] || { label:type, bg:'#f3f4f6', border:'#e5e7eb', color:'#6b7280' };
  return (
    <span style={{
      padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700,
      background:m.bg, border:`1px solid ${m.border}`, color:m.color,
    }}>{m.label}</span>
  );
}

/* ─────────────────────────────────────────
   Small draw ball
───────────────────────────────────────── */
function MiniDrawBall({ n, delay = 0 }) {
  return (
    <div style={{
      width:36, height:36, borderRadius:'50%', flexShrink:0,
      background:'linear-gradient(145deg,#00994f,#006B3A,#004d28)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontWeight:800, fontSize:14,
      fontFamily:"'Playfair Display',serif",
      animation:`ballPop 0.45s cubic-bezier(.34,1.56,.64,1) ${delay}s both,
                 ballGlow 2.5s ease-in-out ${delay+0.5}s infinite`,
      position:'relative',
    }}>
      <div style={{
        position:'absolute', top:6, left:9, width:6, height:6,
        borderRadius:'50%', background:'rgba(255,255,255,0.38)',
      }}/>
      {n}
    </div>
  );
}

/* ─────────────────────────────────────────
   Stat Card
───────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, iconBg, iconColor, accent, delay = 0 }) {
  return (
    <div className="db-stat-card" style={{ animation:`fadeSlideUp 0.5s ease ${delay}s both` }}>
      {/* shimmer */}
      <div style={{
        position:'absolute', inset:0, width:'40%',
        background:'linear-gradient(90deg,transparent,rgba(0,107,58,0.03),transparent)',
        transform:'translateX(-100%)',
      }}/>
      <div style={{
        width:40, height:40, borderRadius:12, background:iconBg,
        display:'flex', alignItems:'center', justifyContent:'center',
        marginBottom:14,
      }}>
        <Icon size={18} color={iconColor}/>
      </div>
      <div style={{
        fontFamily:"'Playfair Display',serif",
        fontSize:26, fontWeight:900, color:'#0d1f14', lineHeight:1,
        marginBottom:4,
      }}>{value}</div>
      <p style={{ fontSize:12, color:'#7a9585', fontWeight:500 }}>{label}</p>
      {accent && (
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:3,
          borderRadius:'0 0 16px 16px', background:accent,
        }}/>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Section heading
───────────────────────────────────────── */
function SectionHeading({ children, action }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
      <h2 style={{
        fontFamily:"'Playfair Display',serif",
        fontSize:18, fontWeight:900, color:'#0d1f14',
      }}>{children}</h2>
      {action}
    </div>
  );
}

/* ─────────────────────────────────────────
   ProfileSettings sub-component
───────────────────────────────────────── */
function ProfileSettings({ profile, onUpdate }) {
  const [form, setForm] = useState({ name: profile?.name || '' });
  useEffect(() => { if (profile) setForm({ name: profile.name }); }, [profile]);
  const handleSave = () => { if (form.name.trim()) onUpdate({ name: form.name }); };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div>
        <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#2d4a38', marginBottom:6 }}>
          Full Name
        </label>
        <input
          type="text" value={form.name}
          onChange={e => setForm({...form, name:e.target.value})}
          className="db-input"
        />
      </div>
      <div>
        <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#2d4a38', marginBottom:6 }}>
          Email address
        </label>
        <input type="email" value={profile?.email||''} disabled className="db-input"/>
      </div>
      <button onClick={handleSave} className="db-btn-primary" style={{ alignSelf:'flex-start' }}>
        <Check size={14}/> Save Changes
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────── */
export default function DashboardPage() {
  useStyles();
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [scores, setScores]         = useState([]);
  const [myResults, setMyResults]   = useState([]);
  const [charities, setCharities]   = useState([]);
  const [profile, setProfile]       = useState(null);
  const [editingScore, setEditingScore] = useState(null);
  const [newScore, setNewScore]     = useState({ score:'', score_date: new Date().toISOString().split('T')[0] });
  const [showAddScore, setShowAddScore] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);
  const [activeTab, setActiveTab]   = useState('overview');
  const [charityPct, setCharityPct] = useState(10);
  const [selectedCharity, setSelectedCharity] = useState('');

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
      setCharityPct(profileRes.data?.charity_percentage || 10);
      setSelectedCharity(profileRes.data?.charity_id || '');
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
      setNewScore({ score:'', score_date: new Date().toISOString().split('T')[0] });
      setShowAddScore(false);
      toast.success('Score added!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add score');
    } finally { setLoadingScore(false); }
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
    } finally { setLoadingScore(false); }
  };

  const deleteScore = async (id) => {
    try {
      await api.delete(`/scores/${id}`);
      setScores(prev => prev.filter(s => s.id !== id));
      toast.success('Score removed');
    } catch { toast.error('Failed to delete score'); }
  };

  const updateProfile = async (updates) => {
    try {
      await api.put('/users/profile', updates);
      setProfile(prev => ({ ...prev, ...updates }));
      refreshUser();
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
  };

  const openBillingPortal = async () => {
    try {
      const res = await api.post('/subscriptions/portal');
      window.location.href = res.data.url;
    } catch { toast.error('Could not open billing portal'); }
  };

  const cancelSubscription = async () => {
    if (!confirm('Cancel subscription? You will retain access until the billing period ends.')) return;
    try {
      await api.post('/subscriptions/cancel');
      refreshUser();
      toast.success('Subscription will cancel at period end');
    } catch (err) { toast.error(err.response?.data?.error || 'Could not cancel'); }
  };

  const tabs = [
    { id:'overview',  label:'Overview',  icon:BarChart2 },
    { id:'scores',    label:'Scores',    icon:Target },
    { id:'draws',     label:'Draws',     icon:Trophy },
    { id:'charity',   label:'Charity',   icon:Heart },
    { id:'settings',  label:'Settings',  icon:Settings },
  ];

  const isActive = user?.subscription_status === 'active';

  return (
    <div style={{ minHeight:'100vh', background:'#f8fdf9', fontFamily:"'DM Sans',sans-serif" }}>
      <Navbar />

      {/* ── HERO HEADER ── */}
      <section style={{
        position:'relative', overflow:'hidden',
        background:'linear-gradient(135deg,#006B3A 0%,#00874a 55%,#009e52 100%)',
        padding:'100px 24px 52px',
      }}>
        {/* topo pattern */}
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.07, pointerEvents:'none' }} preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="dash-topo" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
              <ellipse cx="70" cy="70" rx="65" ry="36" fill="none" stroke="#fff" strokeWidth="1"/>
              <ellipse cx="70" cy="70" rx="45" ry="24" fill="none" stroke="#fff" strokeWidth="1"/>
              <ellipse cx="70" cy="70" rx="24" ry="13" fill="none" stroke="#fff" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dash-topo)"/>
        </svg>
        {/* rings */}
        <div style={{
          position:'absolute', top:-80, right:-80, width:320, height:320,
          border:'1.5px solid rgba(255,255,255,0.08)', borderRadius:'50%',
          animation:'spinRing 40s linear infinite',
        }}/>
        <div style={{
          position:'absolute', bottom:-60, left:-60, width:240, height:240,
          border:'1px solid rgba(255,255,255,0.06)', borderRadius:'50%',
        }}/>

        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div style={{ animation:'fadeSlideUp 0.5s ease both' }}>
              <p style={{
                fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.60)',
                letterSpacing:1.5, textTransform:'uppercase', marginBottom:8,
              }}>Your Dashboard</p>
              <h1 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:'clamp(28px,4vw,44px)', fontWeight:900,
                color:'#fff', lineHeight:1.15, marginBottom:6,
              }}>
                Welcome back,<br/>
                <span style={{ color:'rgba(255,255,255,0.85)' }}>{user?.name}</span>
              </h1>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:14 }}>
                {isActive ? 'You\'re entered into the next draw ' : 'Subscribe to enter monthly draws'}
              </p>
            </div>
            <div style={{ animation:'fadeSlideUp 0.5s ease 0.1s both' }}>
              <StatusBadge status={user?.subscription_status}/>
            </div>
          </div>
        </div>
      </section>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px 80px' }}>
        {!isActive && (
          <div style={{
            margin:'24px 0 0',
            padding:'18px 22px',
            background:'linear-gradient(135deg,#fffbeb,#fef9e7)',
            border:'1.5px solid #fde68a', borderRadius:16,
            display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:14,
            animation:'fadeSlideUp 0.5s ease 0.15s both',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{
                width:40, height:40, borderRadius:12,
                background:'linear-gradient(135deg,#fef3c7,#fde68a)',
                border:'1px solid #fbbf24',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Trophy size={18} color="#b45309"/>
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:14, color:'#b45309', marginBottom:2 }}>No active subscription</p>
                <p style={{ fontSize:13, color:'#92400e' }}>Subscribe to enter monthly draws and track your scores</p>
              </div>
            </div>
            <Link to="/subscribe" className="db-btn-primary" style={{ background:'#b45309', boxShadow:'0 4px 14px rgba(180,83,9,0.28)' }}>
              Subscribe Now <ArrowRight size={14}/>
            </Link>
          </div>
        )}
        <div style={{
          display:'flex', gap:6,
          background:'#fff', border:'1.5px solid #e8f0eb',
          borderRadius:14, padding:6, marginTop:24, marginBottom:28,
          overflowX:'auto',
          animation:'fadeSlideUp 0.5s ease 0.2s both',
          boxShadow:'0 2px 12px rgba(0,0,0,0.04)',
        }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`db-tab ${activeTab === id ? 'active' : ''}`}
            >
              <Icon size={14}/> {label}
            </button>
          ))}
        </div>
        {activeTab === 'overview' && (
          <div style={{ animation:'fadeIn 0.35s ease both' }}>
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
              gap:16, marginBottom:24,
            }}>
              <StatCard label="Subscription"  value={user?.subscription_plan || 'None'}  icon={CreditCard}  iconBg="#eff6ff"  iconColor="#1d4ed8" accent="linear-gradient(90deg,#1d4ed8,#3b82f6)" delay={0}/>
              <StatCard label="Scores logged" value={`${scores.length}/5`}               icon={Target}      iconBg="#f0f7f3"  iconColor="#006B3A" accent="linear-gradient(90deg,#006B3A,#00994f)" delay={0.06}/>
              <StatCard label="Draw entries"  value={myResults.length || '—'}            icon={Trophy}      iconBg="#fffbeb"  iconColor="#b45309" accent="linear-gradient(90deg,#b45309,#f59e0b)" delay={0.12}/>
              <StatCard label="Charity share" value={`${profile?.charity_percentage||10}%`} icon={Heart}  iconBg="#fdf2f8"  iconColor="#be185d" accent="linear-gradient(90deg,#be185d,#ec4899)" delay={0.18}/>
            </div>
            <div className="db-card" style={{ marginBottom:20, animation:'fadeSlideUp 0.5s ease 0.22s both' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <div>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#0d1f14', marginBottom:3 }}>
                    Draw Entry Progress
                  </p>
                  <p style={{ fontSize:12, color:'#7a9585' }}>
                    {scores.length < 5 ? `${5 - scores.length} more score${5-scores.length!==1?'s':''} needed to enter the draw` : 'You\'re entered in the next draw!'}
                  </p>
                </div>
                <span style={{
                  fontFamily:"'Playfair Display',serif",
                  fontSize:22, fontWeight:900,
                  color: scores.length === 5 ? '#006B3A' : '#0d1f14',
                }}>{scores.length}/5</span>
              </div>
              <div style={{ height:8, background:'#f0f7f3', borderRadius:8, overflow:'hidden' }}>
                <div style={{
                  height:'100%',
                  width:`${(scores.length/5)*100}%`,
                  background: scores.length === 5
                    ? 'linear-gradient(90deg,#006B3A,#00994f)'
                    : 'linear-gradient(90deg,#006B3A,#00994f)',
                  borderRadius:8,
                  transition:'width 0.8s cubic-bezier(.25,.46,.45,.94)',
                  animation:'progressFill 1s ease both',
                }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                {[1,2,3,4,5].map(n => (
                  <div key={n} style={{
                    width:24, height:24, borderRadius:'50%', fontSize:11, fontWeight:700,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background: scores.length >= n ? '#006B3A' : '#e8f0eb',
                    color: scores.length >= n ? '#fff' : '#a0b8a9',
                    transition:'all 0.3s ease',
                  }}>{n}</div>
                ))}
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:18 }}>
              <div className="db-card" style={{ animation:'fadeSlideUp 0.5s ease 0.26s both' }}>
                <SectionHeading action={
                  <button className="db-btn-secondary" style={{ padding:'6px 12px', fontSize:12 }} onClick={() => setActiveTab('scores')}>
                    View all
                  </button>
                }>Recent Scores</SectionHeading>
                {scores.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'24px 0' }}>
                    <div style={{
                      width:48, height:48, borderRadius:'50%', background:'#f0f7f3',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      margin:'0 auto 10px', animation:'floatY 3s ease-in-out infinite',
                    }}>
                      <Target size={22} color="#006B3A" opacity={0.5}/>
                    </div>
                    <p style={{ fontSize:13, color:'#7a9585' }}>No scores logged yet</p>
                  </div>
                ) : (
                  scores.slice(0,3).map((s, i) => (
                    <div key={s.id} className="score-row" style={{ animationDelay:`${i*0.05}s` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{
                          width:32, height:32, borderRadius:9, background:'#f0f7f3',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          <Calendar size={13} color="#006B3A"/>
                        </div>
                        <span style={{ fontSize:13, color:'#4a6655', fontWeight:500 }}>
                          {format(new Date(s.score_date), 'dd MMM yyyy')}
                        </span>
                      </div>
                      <span style={{
                        fontFamily:"'Playfair Display',serif",
                        fontSize:20, fontWeight:900, color:'#006B3A',
                      }}>{s.score}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="db-card" style={{ animation:'fadeSlideUp 0.5s ease 0.3s both' }}>
                <SectionHeading action={
                  <button className="db-btn-secondary" style={{ padding:'6px 12px', fontSize:12 }} onClick={() => setActiveTab('charity')}>
                    Change
                  </button>
                }>Your Charity</SectionHeading>
                {profile?.charities ? (
                  <div>
                    <div style={{
                      display:'flex', alignItems:'center', gap:12,
                      padding:'14px 16px', borderRadius:12,
                      background:'linear-gradient(135deg,#f0f7f3,#e8f5ef)',
                      border:'1px solid #c8e6d4', marginBottom:14,
                    }}>
                      <div style={{
                        width:40, height:40, borderRadius:12, background:'#006B3A',
                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                      }}>
                        <Heart size={18} color="#fff"/>
                      </div>
                      <div>
                        <p style={{ fontWeight:700, fontSize:14, color:'#0d1f14', marginBottom:2 }}>{profile.charities.name}</p>
                        <p style={{ fontSize:12, color:'#006B3A', fontWeight:600 }}>{profile.charity_percentage}% of subscription</p>
                      </div>
                    </div>
                    <div style={{ height:6, background:'#f0f7f3', borderRadius:6, overflow:'hidden' }}>
                      <div style={{
                        height:'100%', width:`${profile.charity_percentage}%`,
                        background:'linear-gradient(90deg,#006B3A,#00994f)',
                        borderRadius:6, transition:'width 0.8s ease',
                      }}/>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign:'center', padding:'24px 0' }}>
                    <div style={{
                      width:48, height:48, borderRadius:'50%', background:'#fdf2f8',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      margin:'0 auto 10px', animation:'floatY 3s ease-in-out 0.5s infinite',
                    }}>
                      <Heart size={22} color="#be185d" opacity={0.5}/>
                    </div>
                    <p style={{ fontSize:13, color:'#7a9585', marginBottom:12 }}>No charity selected yet</p>
                    <button className="db-btn-primary" style={{ fontSize:12, padding:'8px 16px' }} onClick={() => setActiveTab('charity')}>
                      Choose a Charity
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'scores' && (
          <div className="db-card" style={{ animation:'fadeIn 0.35s ease both' }}>
            <SectionHeading action={
              scores.length < 5 && isActive ? (
                <button className="db-btn-primary" onClick={() => setShowAddScore(v => !v)}>
                  <Plus size={14}/> Add Score
                </button>
              ) : null
            }>
              Stableford Scores
            </SectionHeading>

            <p style={{ fontSize:13, color:'#7a9585', marginBottom:20 }}>
              Log your last 5 Stableford scores to be entered into the monthly draw.
            </p>
            {showAddScore && (
              <div style={{
                display:'flex', gap:10, flexWrap:'wrap',
                padding:'16px', background:'#f8fdf9',
                border:'1.5px solid #c8e6d4', borderRadius:14,
                marginBottom:20,
                animation:'fadeSlideUp 0.3s ease both',
              }}>
                <input
                  type="number"
                  placeholder="Score (e.g. 36)"
                  value={newScore.score}
                  onChange={e => setNewScore(p => ({...p, score:e.target.value}))}
                  className="db-input"
                  style={{ flex:'1', minWidth:140 }}
                />
                <input
                  type="date"
                  value={newScore.score_date}
                  onChange={e => setNewScore(p => ({...p, score_date:e.target.value}))}
                  className="db-input"
                  style={{ flex:'1', minWidth:160 }}
                />
                <div style={{ display:'flex', gap:8 }}>
                  <button className="db-btn-primary" onClick={addScore} disabled={loadingScore}>
                    <Check size={14}/> Save
                  </button>
                  <button className="db-btn-secondary" onClick={() => setShowAddScore(false)}>
                    <X size={14}/>
                  </button>
                </div>
              </div>
            )}
            {scores.length === 0 ? (
              <div style={{ textAlign:'center', padding:'48px 24px' }}>
                <div style={{
                  width:64, height:64, borderRadius:'50%', background:'#f0f7f3',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 16px', animation:'floatY 3s ease-in-out infinite',
                }}>
                  <Target size={28} color="#006B3A" opacity={0.45}/>
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0d1f14', marginBottom:6 }}>
                  No scores yet
                </h3>
                <p style={{ fontSize:13, color:'#7a9585' }}>Add your Stableford scores to enter the next draw</p>
              </div>
            ) : (
              scores.map((s, i) => (
                <div key={s.id} className="score-row" style={{ animation:`fadeSlideUp 0.4s ease ${i*0.06}s both` }}>
                  {editingScore?.id === s.id ? (
                    <div style={{ display:'flex', gap:10, flex:1, flexWrap:'wrap' }}>
                      <input
                        type="number"
                        value={editingScore.score}
                        onChange={e => setEditingScore(p => ({...p, score:e.target.value}))}
                        className="db-input" style={{ width:100 }}
                      />
                      <input
                        type="date"
                        value={editingScore.score_date}
                        onChange={e => setEditingScore(p => ({...p, score_date:e.target.value}))}
                        className="db-input" style={{ width:160 }}
                      />
                      <button className="db-btn-primary" style={{ padding:'8px 14px' }} onClick={() => saveEditScore(s.id)}>
                        <Check size={13}/>
                      </button>
                      <button className="db-btn-secondary" style={{ padding:'8px 12px' }} onClick={() => setEditingScore(null)}>
                        <X size={13}/>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{
                          width:34, height:34, borderRadius:10, background:'#f0f7f3',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          <Calendar size={14} color="#006B3A"/>
                        </div>
                        <div>
                          <p style={{ fontSize:13, fontWeight:500, color:'#0d1f14' }}>
                            {format(new Date(s.score_date), 'dd MMMM yyyy')}
                          </p>
                          <p style={{ fontSize:11, color:'#a0b8a9' }}>Stableford score</p>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <span style={{
                          fontFamily:"'Playfair Display',serif",
                          fontSize:24, fontWeight:900, color:'#006B3A',
                        }}>{s.score}</span>
                        <button
                          className="db-btn-secondary"
                          style={{ padding:'6px 10px' }}
                          onClick={() => setEditingScore(s)}
                        >
                          <Edit2 size={12}/>
                        </button>
                        <button className="db-btn-danger" onClick={() => deleteScore(s.id)}>
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'draws' && (
          <div className="db-card" style={{ animation:'fadeIn 0.35s ease both' }}>
            <SectionHeading>My Draw Results</SectionHeading>

            {myResults.length === 0 ? (
              <div style={{ textAlign:'center', padding:'48px 24px' }}>
                <div style={{
                  width:64, height:64, borderRadius:'50%',
                  background:'linear-gradient(135deg,#f0f7f3,#e8f5ef)',
                  border:'1.5px solid #c8e6d4',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 16px', animation:'floatY 3s ease-in-out infinite',
                }}>
                  <Trophy size={28} color="#006B3A" opacity={0.45}/>
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0d1f14', marginBottom:6 }}>
                  No draw results yet
                </h3>
                <p style={{ fontSize:13, color:'#7a9585', marginBottom:16 }}>
                  {isActive ? 'Your results will appear here after the next draw' : 'Subscribe to enter draws'}
                </p>
                {!isActive && (
                  <Link to="/subscribe" className="db-btn-primary">Subscribe Now <ArrowRight size={13}/></Link>
                )}
              </div>
            ) : (
              myResults.map((r, i) => (
                <div key={r.id} className="result-row" style={{ animation:`fadeSlideUp 0.4s ease ${i*0.06}s both` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{
                      width:38, height:38, borderRadius:11,
                      background:'linear-gradient(135deg,#f0f7f3,#e8f5ef)',
                      border:'1px solid #c8e6d4',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <Trophy size={16} color="#006B3A"/>
                    </div>
                    <div>
                      <MatchBadge type={r.status}/>
                      {r.drawn_numbers?.length > 0 && (
                        <div style={{ display:'flex', gap:6, marginTop:6 }}>
                          {r.drawn_numbers.map((n, j) => <MiniDrawBall key={n} n={n} delay={j*0.06}/>)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{
                      fontFamily:"'Playfair Display',serif",
                      fontSize:22, fontWeight:900,
                      color: r.prize_amount ? '#006B3A' : '#a0b8a9',
                    }}>
                      £{((r.prize_amount||0)/100).toFixed(2)}
                    </p>
                    <p style={{ fontSize:11, color:'#a0b8a9' }}>Prize won</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'charity' && (
          <div className="db-card" style={{ animation:'fadeIn 0.35s ease both', maxWidth:560 }}>
            <SectionHeading>Charity Settings</SectionHeading>
            <p style={{ fontSize:13, color:'#7a9585', marginBottom:24 }}>
              Choose a charity and set how much of your subscription goes to them each month.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
              <div>
                <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600, color:'#2d4a38', marginBottom:7 }}>
                  <Heart size={12} color="#006B3A" fill="rgba(0,107,58,0.2)"/> Choose a Charity
                </label>
                <div style={{ position:'relative' }}>
                  <select
                    value={selectedCharity}
                    onChange={e => setSelectedCharity(e.target.value)}
                    className="db-select"
                  >
                    <option value="">Select a charity...</option>
                    {charities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={13} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#a0b8a9', pointerEvents:'none' }}/>
                </div>
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:'#2d4a38' }}>Contribution %</label>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:'#006B3A' }}>
                    {charityPct}%
                  </span>
                </div>
                <input
                  type="range" min="10" max="100"
                  value={charityPct}
                  onChange={e => setCharityPct(parseInt(e.target.value))}
                  className="db-range"
                  style={{ '--pct':`${charityPct}%` }}
                />
                <div style={{
                  marginTop:10, padding:'10px 14px',
                  background:'linear-gradient(135deg,#f0f7f3,#e8f5ef)',
                  border:'1px solid #c8e6d4', borderRadius:10,
                  display:'flex', alignItems:'center', gap:8,
                }}>
                  <Heart size={12} color="#006B3A" fill="rgba(0,107,58,0.2)"/>
                  <p style={{ fontSize:12, color:'#2d4a38', margin:0 }}>
                    <strong style={{ color:'#006B3A' }}>{charityPct}%</strong> of your subscription goes directly to your chosen charity
                  </p>
                </div>
              </div>

              <button
                className="db-btn-primary"
                style={{ alignSelf:'flex-start' }}
                onClick={() => updateProfile({ charity_id: selectedCharity||undefined, charity_percentage: charityPct })}
              >
                <Check size={14}/> Save Changes
              </button>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div style={{ display:'flex', flexDirection:'column', gap:18, animation:'fadeIn 0.35s ease both' }}>
            <div className="db-card">
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                <div style={{
                  width:36, height:36, borderRadius:10,
                  background:'linear-gradient(135deg,#006B3A,#00874a)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <User size={16} color="#fff"/>
                </div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:'#0d1f14' }}>
                  Profile
                </h2>
              </div>
              <ProfileSettings profile={profile} onUpdate={updateProfile}/>
            </div>
            <div className="db-card">
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                <div style={{
                  width:36, height:36, borderRadius:10,
                  background:'linear-gradient(135deg,#1d4ed8,#3b82f6)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <CreditCard size={16} color="#fff"/>
                </div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:'#0d1f14' }}>
                  Subscription
                </h2>
              </div>

              <div style={{
                padding:'14px 18px', borderRadius:12,
                background:'#f8fdf9', border:'1.5px solid #e8f0eb',
                marginBottom:16,
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                  <div>
                    <p style={{ fontWeight:600, fontSize:14, color:'#0d1f14', marginBottom:3 }}>
                      {user?.subscription_plan || 'No active plan'}
                    </p>
                    <StatusBadge status={user?.subscription_status}/>
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <button className="db-btn-secondary" onClick={openBillingPortal}>
                      <ExternalLink size={13}/> Manage Billing
                    </button>
                    {isActive && (
                      <button className="db-btn-danger" style={{ padding:'8px 14px' }} onClick={cancelSubscription}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!isActive && (
                <Link to="/subscribe" className="db-btn-primary">
                  Subscribe Now <ArrowRight size={14}/>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}