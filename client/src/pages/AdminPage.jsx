import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Users, Trophy, Heart, TrendingUp, Shield, Play, Eye,
  Check, X, ChevronDown, RefreshCw, Trash2, Edit2, DollarSign,
  BarChart2, Star, ArrowRight, Calendar, ExternalLink, Plus, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { format } from 'date-fns';
import Navbar from '../components/layout/Navbar';
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
      @keyframes shimmer {
        0%   { transform:translateX(-100%); }
        100% { transform:translateX(400%); }
      }
      @keyframes ballPop {
        from { opacity:0; transform:scale(0.3); }
        70%  { transform:scale(1.08); }
        to   { opacity:1; transform:scale(1); }
      }
      @keyframes pulseGlow {
        0%,100%{box-shadow:0 0 0 0 rgba(0,107,58,0.25)}
        50%    {box-shadow:0 0 0 8px rgba(0,107,58,0)}
      }
      @keyframes skeletonPulse {
        0%,100%{opacity:0.4} 50%{opacity:0.85}
      }
      @keyframes gradientShift {
        0%,100%{background-position:0% 50%}
        50%    {background-position:100% 50%}
      }

      /* Tabs */
      .adm-tab {
        padding:8px 16px; border-radius:10px; border:none;
        cursor:pointer; font-family:'DM Sans',sans-serif;
        font-size:13px; font-weight:600;
        transition:all 0.2s ease;
        display:flex; align-items:center; gap:6px;
        white-space:nowrap; background:transparent; color:#7a9585;
      }
      .adm-tab:hover { color:#006B3A; background:#f0f7f3; }
      .adm-tab.active {
        background:linear-gradient(135deg,#006B3A,#00874a);
        color:#fff;
        box-shadow:0 4px 14px rgba(0,107,58,0.28);
      }

      /* Cards */
      .adm-card {
        background:#fff; border:1.5px solid #e8f0eb;
        border-radius:18px; padding:24px;
      }
      .adm-stat {
        background:#fff; border:1.5px solid #e8f0eb;
        border-radius:18px; padding:18px 16px;
        position:relative; overflow:hidden;
        transition:transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
      }
      .adm-stat:hover {
        transform:translateY(-3px);
        box-shadow:0 12px 32px rgba(0,107,58,0.09);
        border-color:#006B3A;
      }

      /* Inputs */
      .adm-input {
        width:100%; box-sizing:border-box;
        padding:9px 13px;
        border:1.5px solid #dde8e2; border-radius:10px;
        font-size:13px; color:#0d1f14;
        background:#fff; font-family:'DM Sans',sans-serif;
        transition:border-color 0.2s, box-shadow 0.2s;
      }
      .adm-input:focus {
        outline:none;
        border-color:#006B3A !important;
        box-shadow:0 0 0 3px rgba(0,107,58,0.12) !important;
      }
      .adm-input::placeholder { color:#b0c4b8; }
      .adm-input:disabled { opacity:0.5; cursor:not-allowed; }

      .adm-select {
        width:100%; box-sizing:border-box;
        padding:9px 34px 9px 13px;
        border:1.5px solid #dde8e2; border-radius:10px;
        font-size:13px; color:#0d1f14; background:#fff;
        font-family:'DM Sans',sans-serif;
        appearance:none; -webkit-appearance:none; cursor:pointer;
        transition:border-color 0.2s, box-shadow 0.2s;
      }
      .adm-select:focus {
        outline:none;
        border-color:#006B3A !important;
        box-shadow:0 0 0 3px rgba(0,107,58,0.12) !important;
      }

      .adm-textarea {
        width:100%; box-sizing:border-box;
        padding:9px 13px;
        border:1.5px solid #dde8e2; border-radius:10px;
        font-size:13px; color:#0d1f14; background:#fff;
        font-family:'DM Sans',sans-serif; resize:vertical;
        transition:border-color 0.2s, box-shadow 0.2s;
      }
      .adm-textarea:focus {
        outline:none;
        border-color:#006B3A !important;
        box-shadow:0 0 0 3px rgba(0,107,58,0.12) !important;
      }

      /* Buttons */
      .adm-btn-primary {
        display:inline-flex; align-items:center; gap:6px;
        padding:9px 18px; border-radius:10px; border:none;
        background:#006B3A; color:#fff;
        font-weight:600; font-size:13px; cursor:pointer;
        font-family:'DM Sans',sans-serif;
        box-shadow:0 4px 14px rgba(0,107,58,0.25);
        transition:transform 0.15s ease, box-shadow 0.15s ease;
        position:relative; overflow:hidden;
      }
      .adm-btn-primary:hover { transform:translateY(-1px); box-shadow:0 8px 22px rgba(0,107,58,0.35); }
      .adm-btn-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

      .adm-btn-secondary {
        display:inline-flex; align-items:center; gap:6px;
        padding:8px 16px; border-radius:10px;
        border:1.5px solid #dde8e2; background:#fff;
        color:#006B3A; font-weight:600; font-size:13px;
        cursor:pointer; font-family:'DM Sans',sans-serif;
        transition:border-color 0.2s, box-shadow 0.2s;
      }
      .adm-btn-secondary:hover { border-color:#006B3A; box-shadow:0 4px 14px rgba(0,107,58,0.10); }

      .adm-btn-ghost {
        display:inline-flex; align-items:center; gap:6px;
        padding:8px 16px; border-radius:10px;
        border:1.5px solid #e5e7eb; background:#fff;
        color:#6b7280; font-weight:600; font-size:13px;
        cursor:pointer; font-family:'DM Sans',sans-serif;
        transition:background 0.2s;
      }
      .adm-btn-ghost:hover { background:#f3f4f6; }

      .adm-btn-danger {
        display:inline-flex; align-items:center; gap:4px;
        padding:6px 11px; border-radius:8px; border:none;
        background:#fef2f2; color:#ef4444; font-size:12px; font-weight:600;
        cursor:pointer; font-family:'DM Sans',sans-serif;
        transition:background 0.2s;
      }
      .adm-btn-danger:hover { background:#fee2e2; }

      /* Icon action buttons */
      .adm-icon-btn {
        width:30px; height:30px; border-radius:8px; border:none;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer; transition:all 0.18s ease;
        background:transparent; color:#a0b8a9;
      }
      .adm-icon-btn:hover { transform:scale(1.1); }
      .adm-icon-btn.blue:hover  { background:#eff6ff; color:#1d4ed8; }
      .adm-icon-btn.green:hover { background:#f0f7f3; color:#006B3A; }
      .adm-icon-btn.red:hover   { background:#fef2f2; color:#ef4444; }

      /* Table */
      .adm-table { width:100%; border-collapse:collapse; }
      .adm-table thead tr { border-bottom:1.5px solid #e8f0eb; }
      .adm-table thead th {
        text-align:left; padding:10px 12px;
        font-size:10px; font-weight:800; color:#7a9585;
        letter-spacing:1px; text-transform:uppercase;
      }
      .adm-table tbody tr {
        border-bottom:1px solid #f0f7f3;
        transition:background 0.15s;
      }
      .adm-table tbody tr:hover { background:#fafffe; }
      .adm-table tbody td { padding:12px 12px; font-size:13px; color:#0d1f14; }

      /* Row items */
      .adm-row {
        display:flex; align-items:center; justify-content:space-between;
        padding:13px 16px; border-radius:12px;
        border:1.5px solid #e8f0eb; background:#fcfffe;
        margin-bottom:8px;
        transition:border-color 0.2s, box-shadow 0.2s;
      }
      .adm-row:hover { border-color:#c8e6d4; box-shadow:0 4px 14px rgba(0,107,58,0.06); }

      /* Modal backdrop */
      .adm-modal-bg {
        position:fixed; inset:0;
        background:rgba(13,31,20,0.45);
        backdrop-filter:blur(4px);
        display:flex; align-items:center; justify-content:center;
        z-index:50; padding:20px;
        animation:fadeIn 0.2s ease both;
      }
      .adm-modal {
        background:#fff; border:1.5px solid #e8f0eb;
        border-radius:20px; padding:28px;
        width:100%; max-width:440px;
        box-shadow:0 24px 64px rgba(0,107,58,0.18);
        animation:fadeSlideUp 0.3s ease both;
      }

      .skeleton { animation: skeletonPulse 1.4s ease-in-out infinite; }
    `;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
}
function SectionHeading({ children, action }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:'#0d1f14' }}>
        {children}
      </h2>
      {action}
    </div>
  );
}

function Label({ children }) {
  return (
    <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#2d4a38', marginBottom:6 }}>
      {children}
    </label>
  );
}

function StatusPill({ status }) {
  const map = {
    active:     { bg:'#f0fdf4', border:'#bbf7d0', color:'#15803d', dot:'#22c55e', label:'Active' },
    inactive:   { bg:'#f3f4f6', border:'#e5e7eb', color:'#6b7280', dot:'#9ca3af', label:'Inactive' },
    cancelling: { bg:'#fffbeb', border:'#fde68a', color:'#b45309', dot:'#f59e0b', label:'Cancelling' },
    published:  { bg:'#f0f7f3', border:'#a7f3d0', color:'#006B3A', dot:'#22c55e', label:'Published' },
    draft:      { bg:'#fffbeb', border:'#fde68a', color:'#b45309', dot:'#f59e0b', label:'Draft' },
    paid:       { bg:'#eff6ff', border:'#bfdbfe', color:'#1d4ed8', dot:'#3b82f6', label:'Paid' },
    pending:    { bg:'#fffbeb', border:'#fde68a', color:'#b45309', dot:'#f59e0b', label:'Pending' },
    approved:   { bg:'#f0fdf4', border:'#bbf7d0', color:'#15803d', dot:'#22c55e', label:'Approved' },
    rejected:   { bg:'#fef2f2', border:'#fecaca', color:'#ef4444', dot:'#ef4444', label:'Rejected' },
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 9px', borderRadius:999,
      background:s.bg, border:`1px solid ${s.border}`, color:s.color,
      fontSize:11, fontWeight:700,
    }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:s.dot }}/>
      {s.label}
    </span>
  );
}
function MatchPill({ type }) {
  const map = {
    five_match:  { label:'🏆 5 Match', bg:'#fffbeb', border:'#fde68a',  color:'#b45309' },
    four_match:  { label:'⭐ 4 Match', bg:'#eff6ff', border:'#bfdbfe',  color:'#1d4ed8' },
    three_match: { label:'✓ 3 Match',  bg:'#f0f7f3', border:'#a7f3d0',  color:'#006B3A' },
  };
  const m = map[type] || { label:type, bg:'#f3f4f6', border:'#e5e7eb', color:'#6b7280' };
  return (
    <span style={{
      padding:'2px 8px', borderRadius:999, fontSize:11, fontWeight:700,
      background:m.bg, border:`1px solid ${m.border}`, color:m.color,
    }}>{m.label}</span>
  );
}
function DrawBall({ n, delay = 0 }) {
  return (
    <div style={{
      width:32, height:32, borderRadius:'50%', flexShrink:0,
      background:'linear-gradient(145deg,#00994f,#006B3A,#004d28)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontWeight:800, fontSize:13,
      fontFamily:"'Playfair Display',serif",
      animation:`ballPop 0.4s cubic-bezier(.34,1.56,.64,1) ${delay}s both`,
      position:'relative',
    }}>
      <div style={{ position:'absolute', top:5, left:8, width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,0.38)' }}/>
      {n}
    </div>
  );
}
export default function AdminPage() {
  useStyles();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats]         = useState(null);
  const [users, setUsers]         = useState([]);
  const [winners, setWinners]     = useState([]);
  const [draws, setDraws]         = useState([]);
  const [charities, setCharities] = useState([]);

  const loadStats     = useCallback(async () => { try { const r = await api.get('/admin/stats');        setStats(r.data);        } catch {} }, []);
  const loadUsers     = useCallback(async () => { try { const r = await api.get('/admin/users?limit=50'); setUsers(r.data.users); } catch {} }, []);
  const loadWinners   = useCallback(async () => { try { const r = await api.get('/admin/winners');       setWinners(r.data);      } catch {} }, []);
  const loadDraws     = useCallback(async () => { try { const r = await api.get('/draws');               setDraws(r.data);        } catch {} }, []);
  const loadCharities = useCallback(async () => { try { const r = await api.get('/charities');           setCharities(r.data);    } catch {} }, []);

  useEffect(() => {
    loadStats(); loadUsers(); loadWinners(); loadDraws(); loadCharities();
  }, [loadStats, loadUsers, loadWinners, loadDraws, loadCharities]);

  const tabs = [
    { id:'overview',  label:'Overview',  icon:BarChart2 },
    { id:'users',     label:'Users',     icon:Users },
    { id:'draws',     label:'Draws',     icon:Trophy },
    { id:'charities', label:'Charities', icon:Heart },
    { id:'winners',   label:'Winners',   icon:DollarSign },
  ];

  const handleRefresh = () => {
    loadStats(); loadUsers(); loadWinners(); loadDraws();
    toast.success('Data refreshed');
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f8fdf9', fontFamily:"'DM Sans',sans-serif" }}>
      <Navbar />
      <section style={{
        position:'relative', overflow:'hidden',
        background:'linear-gradient(135deg,#003d21 0%,#006B3A 55%,#00874a 100%)',
        padding:'100px 24px 48px',
      }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.07, pointerEvents:'none' }} preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="adm-topo" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
              <ellipse cx="70" cy="70" rx="65" ry="36" fill="none" stroke="#fff" strokeWidth="1"/>
              <ellipse cx="70" cy="70" rx="45" ry="24" fill="none" stroke="#fff" strokeWidth="1"/>
              <ellipse cx="70" cy="70" rx="24" ry="13" fill="none" stroke="#fff" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#adm-topo)"/>
        </svg>
        <div style={{
          position:'absolute', top:-70, right:-70, width:300, height:300,
          border:'1.5px solid rgba(255,255,255,0.08)', borderRadius:'50%',
          animation:'spinRing 38s linear infinite',
        }}/>
        <div style={{
          position:'absolute', bottom:-60, left:-60, width:240, height:240,
          border:'1px solid rgba(255,255,255,0.06)', borderRadius:'50%',
        }}/>

        <div style={{ maxWidth:1240, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div style={{ animation:'fadeSlideUp 0.5s ease both' }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:7,
                padding:'5px 14px', borderRadius:999,
                background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.20)',
                color:'rgba(255,255,255,0.80)', fontSize:11, fontWeight:700,
                marginBottom:14, letterSpacing:1,
              }}>
                <Shield size={11}/> ADMIN PANEL
              </div>
              <h1 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:'clamp(26px,4vw,40px)', fontWeight:900,
                color:'#fff', lineHeight:1.15, marginBottom:6,
              }}>
                Control Centre
              </h1>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13 }}>
                Logged in as <strong style={{ color:'rgba(255,255,255,0.80)' }}>{user?.email}</strong>
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="adm-btn-secondary"
              style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.20)', color:'#fff', animation:'fadeSlideUp 0.5s ease 0.1s both' }}
            >
              <RefreshCw size={13}/> Refresh
            </button>
          </div>
        </div>
      </section>
      <div style={{ maxWidth:1240, margin:'0 auto', padding:'0 24px 80px' }}>
        <div style={{
          display:'flex', gap:6,
          background:'#fff', border:'1.5px solid #e8f0eb',
          borderRadius:14, padding:6,
          marginTop:24, marginBottom:24,
          overflowX:'auto',
          animation:'fadeSlideUp 0.5s ease 0.2s both',
          boxShadow:'0 2px 12px rgba(0,0,0,0.04)',
        }}>
          {tabs.map(({ id, label, icon:Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`adm-tab ${activeTab===id?'active':''}`}>
              <Icon size={13}/> {label}
            </button>
          ))}
        </div>
        {activeTab === 'overview' && stats && (
          <div style={{ animation:'fadeIn 0.35s ease both' }}>
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',
              gap:14, marginBottom:24,
            }}>
              {[
                { label:'Total Users',    value:stats.total_users,                              icon:Users,      iconBg:'#eff6ff', iconColor:'#1d4ed8', bar:'#1d4ed8', delay:0    },
                { label:'Active Subs',    value:stats.active_subscribers,                       icon:Check,      iconBg:'#f0f7f3', iconColor:'#006B3A', bar:'#006B3A', delay:0.05 },
                { label:'Total Draws',    value:stats.total_draws,                              icon:Trophy,     iconBg:'#fffbeb', iconColor:'#b45309', bar:'#b45309', delay:0.10 },
                { label:'Prize Pool',     value:`£${(stats.prize_pool/100).toFixed(0)}`,        icon:DollarSign, iconBg:'#fdf4ff', iconColor:'#7c3aed', bar:'#7c3aed', delay:0.15 },
                { label:'Charity Total',  value:`£${(stats.charity_total/100).toFixed(0)}`,     icon:Heart,      iconBg:'#fdf2f8', iconColor:'#be185d', bar:'#be185d', delay:0.20 },
                { label:'Pending Payout', value:`£${(stats.pending_payout/100).toFixed(0)}`,   icon:TrendingUp, iconBg:'#fff7ed', iconColor:'#ea580c', bar:'#ea580c', delay:0.25 },
              ].map(({ label, value, icon:Icon, iconBg, iconColor, bar, delay }) => (
                <div key={label} className="adm-stat" style={{ animation:`fadeSlideUp 0.5s ease ${delay}s both` }}>
                  <div style={{
                    width:36, height:36, borderRadius:10, background:iconBg,
                    display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12,
                  }}>
                    <Icon size={16} color={iconColor}/>
                  </div>
                  <div style={{
                    fontFamily:"'Playfair Display',serif",
                    fontSize:24, fontWeight:900, color:'#0d1f14', lineHeight:1, marginBottom:4,
                  }}>{value}</div>
                  <p style={{ fontSize:11, color:'#7a9585', fontWeight:500 }}>{label}</p>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, borderRadius:'0 0 16px 16px', background:bar }}/>
                </div>
              ))}
            </div>
            <div className="adm-card" style={{ animation:'fadeSlideUp 0.5s ease 0.28s both' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                <div style={{
                  width:34, height:34, borderRadius:10,
                  background:'linear-gradient(135deg,#006B3A,#00874a)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <Zap size={15} color="#fff"/>
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:'#0d1f14' }}>
                  Quick Actions
                </h3>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { label:'Run Draw',       desc:'Execute the monthly prize draw',        icon:Play,       tab:'draws',     iconBg:'#f0f7f3', iconColor:'#006B3A', tag:'Draw Engine',  tagBg:'#f0f7f3', tagColor:'#006B3A' },
                  { label:'Manage Users',   desc:'View and edit subscriber accounts',     icon:Users,      tab:'users',     iconBg:'#eff6ff', iconColor:'#1d4ed8', tag:'User Admin',   tagBg:'#eff6ff', tagColor:'#1d4ed8' },
                  { label:'Verify Winners', desc:'Approve payouts and mark winners paid', icon:DollarSign, tab:'winners',   iconBg:'#fffbeb', iconColor:'#b45309', tag:'Payouts',      tagBg:'#fffbeb', tagColor:'#b45309' },
                  { label:'Charities',      desc:'Add, edit or deactivate charities',     icon:Heart,      tab:'charities', iconBg:'#fdf2f8', iconColor:'#be185d', tag:'Charity Mgmt', tagBg:'#fdf2f8', tagColor:'#be185d' },
                ].map(({ label, desc, icon:Icon, tab, iconBg, iconColor, tag, tagBg, tagColor }) => (
                  <button key={label} onClick={() => setActiveTab(tab)} style={{
                    width:'100%', display:'flex', alignItems:'center', gap:14,
                    padding:'14px 16px', borderRadius:14, border:'1.5px solid #e8f0eb',
                    background:'#fff', cursor:'pointer', textAlign:'left',
                    fontFamily:"'DM Sans',sans-serif",
                    transition:'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.18s ease',
                    position:'relative', overflow:'hidden',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = iconColor;
                      e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.07)`;
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e8f0eb';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{
                      position:'absolute', left:0, top:10, bottom:10,
                      width:3, borderRadius:'0 3px 3px 0',
                      background: iconColor, opacity:0.5,
                    }}/>
                    <div style={{
                      width:40, height:40, borderRadius:12, background:iconBg,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      flexShrink:0,
                    }}>
                      <Icon size={18} color={iconColor}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:700, fontSize:13.5, color:'#0d1f14', marginBottom:2 }}>{label}</p>
                      <p style={{ fontSize:12, color:'#7a9585', lineHeight:1.4 }}>{desc}</p>
                    </div>
                    <span style={{
                      padding:'3px 9px', borderRadius:999, fontSize:10, fontWeight:700,
                      background:tagBg, color:tagColor,
                      border:`1px solid ${tagColor}22`,
                      flexShrink:0,
                    }}>{tag}</span>
                    <ArrowRight size={14} style={{ color:'#c4d4ca', flexShrink:0 }}/>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'users' && (
          <AdminUsers users={users} onRefresh={loadUsers}/>
        )}
        {activeTab === 'draws' && (
          <AdminDraws draws={draws} onRefresh={loadDraws}/>
        )}
        {activeTab === 'charities' && (
          <AdminCharities charities={charities} onRefresh={loadCharities}/>
        )}
        {activeTab === 'winners' && (
          <AdminWinners winners={winners} onRefresh={loadWinners}/>
        )}
      </div>
    </div>
  );
}
function AdminUsers({ users, onRefresh }) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const filtered = users.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const updateUser = async (id, updates) => {
    try {
      await api.put(`/admin/users/${id}`, updates);
      toast.success('User updated');
      onRefresh(); setEditing(null);
    } catch { toast.error('Update failed'); }
  };
  return (
    <div className="adm-card" style={{ animation:'fadeIn 0.35s ease both' }}>
      <SectionHeading action={
        <div style={{ position:'relative' }}>
          <input
            type="text" placeholder="Search users…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="adm-input" style={{ width:220, paddingLeft:36 }}
          />
          <Users size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#a0b8a9', pointerEvents:'none' }}/>
        </div>
      }>
        Users <span style={{ fontSize:14, color:'#7a9585', fontWeight:500 }}>({users.length})</span>
      </SectionHeading>
      <div style={{ overflowX:'auto' }}>
        <table className="adm-table">
          <thead>
            <tr>
              {['Name / Email','Plan','Status','Charity %','Joined','Actions'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ animation:`fadeSlideUp 0.4s ease ${i*0.04}s both` }}>
                <td>
                  <p style={{ fontWeight:600, color:'#0d1f14', marginBottom:2 }}>{u.name}</p>
                  <p style={{ fontSize:11, color:'#7a9585' }}>{u.email}</p>
                </td>
                <td>
                  <span style={{
                    padding:'2px 8px', borderRadius:6,
                    background:'#f0f7f3', color:'#006B3A',
                    fontSize:11, fontWeight:700, textTransform:'capitalize',
                  }}>{u.subscription_plan || '—'}</span>
                </td>
                <td><StatusPill status={u.subscription_status}/></td>
                <td>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:900, color:'#006B3A' }}>
                    {u.charity_percentage}%
                  </span>
                </td>
                <td style={{ color:'#7a9585', fontSize:12 }}>
                  {u.created_at ? format(new Date(u.created_at), 'dd MMM yy') : '—'}
                </td>
                <td>
                  <div style={{ display:'flex', gap:4 }}>
                    <button className="adm-icon-btn blue" onClick={() => setEditing(u)}>
                      <Edit2 size={13}/>
                    </button>
                    <button
                      className="adm-icon-btn green"
                      onClick={() => {
                        const ns = u.subscription_status === 'active' ? 'inactive' : 'active';
                        if (confirm(`Set subscription to ${ns}?`)) updateUser(u.id, { subscription_status: ns });
                      }}
                    >
                      <Check size={13}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="adm-modal-bg" onClick={() => setEditing(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:'#0d1f14' }}>
                Edit User
              </h3>
              <button className="adm-icon-btn" onClick={() => setEditing(null)} style={{ color:'#7a9585' }}>
                <X size={16}/>
              </button>
            </div>
            <EditUserForm user={editing} onSave={u => updateUser(editing.id, u)} onClose={() => setEditing(null)}/>
          </div>
        </div>
      )}
    </div>
  );
}

function EditUserForm({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    name: user.name,
    subscription_status: user.subscription_status,
    charity_percentage: user.charity_percentage,
  });
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div>
        <Label>Full Name</Label>
        <input className="adm-input" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/>
      </div>
      <div>
        <Label>Subscription Status</Label>
        <div style={{ position:'relative' }}>
          <select className="adm-select" value={form.subscription_status} onChange={e => setForm({...form, subscription_status:e.target.value})}>
            {['active','inactive','cancelling'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', color:'#a0b8a9', pointerEvents:'none' }}/>
        </div>
      </div>
      <div>
        <Label>Charity Contribution %</Label>
        <input
          type="number" min="10" max="100" className="adm-input"
          value={form.charity_percentage}
          onChange={e => setForm({...form, charity_percentage:parseInt(e.target.value)})}
        />
      </div>
      <div style={{ display:'flex', gap:10, marginTop:4 }}>
        <button className="adm-btn-primary" style={{ flex:1 }} onClick={() => onSave(form)}>
          <Check size={13}/> Save Changes
        </button>
        <button className="adm-btn-ghost" style={{ flex:1 }} onClick={onClose}>
          <X size={13}/> Cancel
        </button>
      </div>
    </div>
  );
}
function AdminDraws({ draws, onRefresh }) {
  const [method, setMethod]       = useState('random');
  const [simResult, setSimResult] = useState(null);
  const [running, setRunning]     = useState(false);

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
      onRefresh(); setSimResult(null);
    } catch (err) { toast.error(err.response?.data?.error || 'Draw failed'); }
    finally { setRunning(false); }
  };

  const publishDraw = async (id) => {
    try {
      await api.post(`/draws/${id}/publish`);
      toast.success('Draw published!'); onRefresh();
    } catch { toast.error('Publish failed'); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18, animation:'fadeIn 0.35s ease both' }}>
      <div className="adm-card">
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:'linear-gradient(135deg,#006B3A,#00874a)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Play size={16} color="#fff"/>
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:'#0d1f14' }}>
            Run Monthly Draw
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          {[
            { id:'random',      label:'Random Draw',      desc:'5 numbers drawn uniformly at random from 1–45.' },
            { id:'algorithmic', label:'Algorithmic Draw',  desc:'Weighted by score frequency for fairer distribution.' },
          ].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{
              padding:'14px 16px', borderRadius:12, cursor:'pointer', textAlign:'left',
              border: `1.5px solid ${method===m.id ? '#006B3A' : '#dde8e2'}`,
              background: method===m.id ? 'linear-gradient(135deg,#f0f7f3,#e8f5ef)' : '#fff',
              transition:'all 0.2s',
              fontFamily:"'DM Sans',sans-serif",
            }}>
              <p style={{ fontWeight:700, fontSize:13, color: method===m.id ? '#006B3A' : '#0d1f14', marginBottom:4 }}>{m.label}</p>
              <p style={{ fontSize:11.5, color:'#7a9585', lineHeight:1.5 }}>{m.desc}</p>
            </button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <button className="adm-btn-secondary" onClick={simulate} disabled={running} style={{ justifyContent:'center', padding:'11px' }}>
            {running
              ? <span style={{ width:16, height:16, border:'2px solid #c8e6d4', borderTopColor:'#006B3A', borderRadius:'50%', animation:'spinRing 0.7s linear infinite', display:'inline-block' }}/>
              : <><Eye size={14}/> Simulate</>
            }
          </button>
          <button className="adm-btn-primary" onClick={runDraw} disabled={running} style={{ justifyContent:'center', padding:'11px' }}>
            {running
              ? <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spinRing 0.7s linear infinite', display:'inline-block' }}/>
              : <><Play size={14}/> Run Draw</>
            }
          </button>
        </div>
        {simResult && (
          <div style={{
            marginTop:18, padding:18,
            background:'linear-gradient(135deg,#f0f7f3,#e8f5ef)',
            border:'1.5px solid #c8e6d4', borderRadius:14,
            animation:'fadeSlideUp 0.35s ease both',
          }}>
            <p style={{ fontSize:11, fontWeight:800, color:'#006B3A', letterSpacing:1.5, textTransform:'uppercase', marginBottom:14 }}>
              Simulation Result
            </p>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
              {simResult.drawn_numbers.map((n, i) => <DrawBall key={n} n={n} delay={i*0.07}/>)}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { label:'Jackpot Winners', val:simResult.winner_counts.five_match,  bg:'linear-gradient(135deg,#fffbeb,#fef3c7)', border:'#fde68a', color:'#b45309' },
                { label:'4 Match',         val:simResult.winner_counts.four_match,  bg:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'#bfdbfe', color:'#1d4ed8' },
                { label:'3 Match',         val:simResult.winner_counts.three_match, bg:'linear-gradient(135deg,#f0f7f3,#d1fae5)', border:'#a7f3d0', color:'#006B3A' },
              ].map(({ label, val, bg, border, color }) => (
                <div key={label} style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:'12px 10px', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:900, color }}>{val}</div>
                  <div style={{ fontSize:10, color, fontWeight:600, opacity:0.7, marginTop:3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="adm-card">
        <SectionHeading>
          All Draws <span style={{ fontSize:14, color:'#7a9585', fontWeight:500 }}>({draws.length})</span>
        </SectionHeading>

        {draws.length === 0 ? (
          <p style={{ textAlign:'center', color:'#7a9585', padding:'40px 0', fontSize:14 }}>No draws yet</p>
        ) : (
          draws.map((d, i) => (
            <div key={d.id} className="adm-row" style={{ animation:`fadeSlideUp 0.4s ease ${i*0.05}s both` }}>
              <div>
                <p style={{ fontWeight:700, fontSize:13.5, color:'#0d1f14', marginBottom:6 }}>
                  {format(new Date(d.draw_date), 'MMMM yyyy')}
                </p>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {d.drawn_numbers?.map(n => <DrawBall key={n} n={n}/>)}
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <StatusPill status={d.status}/>
                {d.status === 'draft' && (
                  <button className="adm-btn-primary" style={{ padding:'6px 14px', fontSize:12 }} onClick={() => publishDraw(d.id)}>
                    Publish
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
function AdminCharities({ charities, onRefresh }) {
  const [form, setForm]   = useState({ name:'', description:'', website:'', logo_url:'', featured:false });
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const saveCharity = async () => {
    if (!form.name) return toast.error('Name required');
    try {
      if (editing) { await api.put(`/charities/${editing.id}`, form); toast.success('Charity updated'); }
      else         { await api.post('/charities', form); toast.success('Charity added'); }
      setForm({ name:'', description:'', website:'', logo_url:'', featured:false });
      setEditing(null); setShowAdd(false); onRefresh();
    } catch { toast.error('Save failed'); }
  };

  const deleteCharity = async (id) => {
    if (!confirm('Deactivate this charity?')) return;
    try { await api.delete(`/charities/${id}`); toast.success('Charity deactivated'); onRefresh(); }
    catch { toast.error('Failed'); }
  };

  const startEdit = (c) => {
    setEditing(c);
    setForm({ name:c.name, description:c.description||'', website:c.website||'', logo_url:c.logo_url||'', featured:c.featured||false });
    setShowAdd(true);
  };

  return (
    <div className="adm-card" style={{ animation:'fadeIn 0.35s ease both' }}>
      <SectionHeading action={
        <button className="adm-btn-primary" onClick={() => { setEditing(null); setForm({ name:'', description:'', website:'', logo_url:'', featured:false }); setShowAdd(v=>!v); }}>
          <Plus size={13}/> {showAdd ? 'Cancel' : 'Add Charity'}
        </button>
      }>
        Charities <span style={{ fontSize:14, color:'#7a9585', fontWeight:500 }}>({charities.length})</span>
      </SectionHeading>
      {showAdd && (
        <div style={{
          marginBottom:20, padding:20,
          background:'linear-gradient(135deg,#f8fdf9,#f0f7f3)',
          border:'1.5px solid #c8e6d4', borderRadius:16,
          animation:'fadeSlideUp 0.3s ease both',
        }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#0d1f14', marginBottom:16 }}>
            {editing ? 'Edit Charity' : 'Add New Charity'}
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
            <div><Label>Name *</Label><input className="adm-input" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Charity name"/></div>
            <div><Label>Website</Label><input className="adm-input" value={form.website} onChange={e => setForm({...form, website:e.target.value})} placeholder="https://..."/></div>
            <div><Label>Logo URL</Label><input className="adm-input" value={form.logo_url} onChange={e => setForm({...form, logo_url:e.target.value})} placeholder="https://..."/></div>
            <div style={{ display:'flex', alignItems:'center', gap:8, paddingTop:22 }}>
              <input type="checkbox" id="feat" checked={form.featured} onChange={e => setForm({...form, featured:e.target.checked})} style={{ width:16, height:16, accentColor:'#006B3A' }}/>
              <label htmlFor="feat" style={{ fontSize:13, fontWeight:600, color:'#2d4a38', cursor:'pointer' }}>Featured on homepage</label>
            </div>
          </div>
          <div style={{ marginTop:12 }}>
            <Label>Description</Label>
            <textarea className="adm-textarea" rows={3} value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Brief description of the charity..."/>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:14 }}>
            <button className="adm-btn-primary" onClick={saveCharity}><Check size={13}/> Save Charity</button>
            <button className="adm-btn-ghost" onClick={() => setShowAdd(false)}><X size={13}/> Cancel</button>
          </div>
        </div>
      )}

      {charities.map((c, i) => (
        <div key={c.id} className="adm-row" style={{ animation:`fadeSlideUp 0.4s ease ${i*0.05}s both` }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {c.logo_url ? (
              <img src={c.logo_url} alt={c.name} style={{ width:40, height:40, objectFit:'contain', borderRadius:10, background:'#f8fdf9', padding:4 }}/>
            ) : (
              <div style={{ width:40, height:40, borderRadius:12, background:'#f0f7f3', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Heart size={16} color="#006B3A"/>
              </div>
            )}
            <div>
              <p style={{ fontWeight:700, fontSize:13.5, color:'#0d1f14', marginBottom:4 }}>{c.name}</p>
              <div style={{ display:'flex', gap:8 }}>
                {c.featured && <span style={{ fontSize:10, color:'#b45309', fontWeight:700 }}>★ Featured</span>}
                <StatusPill status={c.active ? 'active' : 'inactive'}/>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button className="adm-icon-btn blue" onClick={() => startEdit(c)}><Edit2 size={13}/></button>
            <button className="adm-icon-btn red" onClick={() => deleteCharity(c.id)}><Trash2 size={13}/></button>
          </div>
        </div>
      ))}
    </div>
  );
}
function AdminWinners({ winners, onRefresh }) {
  const verifyWinner = async (id, status) => {
    try { await api.put(`/admin/winners/${id}/verify`, { status }); toast.success(`Winner ${status}`); onRefresh(); }
    catch { toast.error('Failed'); }
  };
  const markPaid = async (id) => {
    try { await api.put(`/admin/winners/${id}/payout`); toast.success('Marked as paid'); onRefresh(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="adm-card" style={{ animation:'fadeIn 0.35s ease both' }}>
      <SectionHeading>
        Winners & Payouts <span style={{ fontSize:14, color:'#7a9585', fontWeight:500 }}>({winners.length})</span>
      </SectionHeading>

      {winners.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 24px' }}>
          <div style={{
            width:64, height:64, borderRadius:'50%',
            background:'linear-gradient(135deg,#f0f7f3,#e8f5ef)',
            border:'1.5px solid #c8e6d4',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 14px',
          }}>
            <DollarSign size={28} color="#006B3A" opacity={0.45}/>
          </div>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0d1f14', marginBottom:6 }}>No winners yet</h3>
          <p style={{ color:'#7a9585', fontSize:13 }}>Winners will appear here after draws are run</p>
        </div>
      ) : (
        <div style={{ overflowX:'auto' }}>
          <table className="adm-table">
            <thead>
              <tr>
                {['Player','Draw','Match Type','Prize','Payout','Verification','Actions'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {winners.map((w, i) => (
                <tr key={w.id} style={{ animation:`fadeSlideUp 0.4s ease ${i*0.04}s both` }}>
                  <td>
                    <p style={{ fontWeight:600, color:'#0d1f14' }}>{w.users?.name || '—'}</p>
                    <p style={{ fontSize:11, color:'#7a9585' }}>{w.users?.email}</p>
                  </td>
                  <td style={{ color:'#7a9585', fontSize:12 }}>
                    {w.draws?.draw_date ? format(new Date(w.draws.draw_date), 'MMM yyyy') : '—'}
                  </td>
                  <td><MatchPill type={w.match_type}/></td>
                  <td>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:900, color:'#006B3A' }}>
                      £{((w.prize_amount||0)/100).toFixed(2)}
                    </span>
                  </td>
                  <td><StatusPill status={w.status || 'pending'}/></td>
                  <td><StatusPill status={w.verification_status || 'pending'}/></td>
                  <td>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {(!w.verification_status || w.verification_status === 'pending') && (
                        <>
                          <button className="adm-icon-btn green" onClick={() => verifyWinner(w.id,'approved')} title="Approve"><Check size={13}/></button>
                          <button className="adm-icon-btn red" onClick={() => verifyWinner(w.id,'rejected')} title="Reject"><X size={13}/></button>
                        </>
                      )}
                      {w.verification_status === 'approved' && w.status !== 'paid' && (
                        <button className="adm-btn-primary" style={{ padding:'5px 12px', fontSize:12 }} onClick={() => markPaid(w.id)}>
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