import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Trophy, Mail, Lock, User, Eye, EyeOff, Heart, ArrowRight, Star, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
function Ball({ style }) {
  return (
    <div style={{
      width: 14, height: 14, borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 32%, rgba(255,255,255,0.9) 0%, rgba(220,240,228,0.7) 55%, rgba(180,220,200,0.5) 100%)',
      boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.1)',
      position: 'absolute', pointerEvents: 'none',
      ...style,
    }} />
  );
}

function Step({ num, title, desc, delay }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      animation: `fadeUp 0.5s ease ${delay}s both`,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 10, color: '#fff',
      }}>{num}</div>
      <div>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: 12, marginBottom: 1 }}>{title}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, lineHeight: 1.4 }}>{desc}</div>
      </div>
    </div>
  );
}
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', charity_id: '', charity_percentage: 10 });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charities, setCharities] = useState([]);
  const [focused, setFocused] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    api.get('/charities').then(r => setCharities(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
      @keyframes fadeUp {
        from { opacity:0; transform:translateY(20px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes floatBall {
        0%,100% { transform:translateY(0) rotate(0deg); }
        50%      { transform:translateY(-16px) rotate(8deg); }
      }
      @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      @keyframes spinBtn { to { transform:rotate(360deg); } }
      @keyframes grassSway {
        0%,100% { transform:rotate(-3deg); }
        50%      { transform:rotate(3deg); }
      }
      @keyframes shimmerLine {
        0%   { transform:translateX(-100%); }
        100% { transform:translateX(400%); }
      }
      @keyframes trackFill {
        from { width: 0%; }
        to   { width: var(--pct); }
      }
      .reg-input:focus {
        outline: none;
        border-color: #006B3A !important;
        box-shadow: 0 0 0 3px rgba(0,107,58,0.12) !important;
      }
      .reg-input::placeholder { color: #b0c4b8; }
      .reg-input { transition: border-color 0.2s, box-shadow 0.2s; }
      .reg-select:focus {
        outline: none;
        border-color: #006B3A !important;
        box-shadow: 0 0 0 3px rgba(0,107,58,0.12) !important;
      }
      .reg-select { transition: border-color 0.2s, box-shadow 0.2s; }
      .reg-range {
        -webkit-appearance: none; appearance: none;
        height: 4px; border-radius: 4px; cursor: pointer;
        background: linear-gradient(to right, #006B3A var(--pct, 10%), #dde8e2 var(--pct, 10%));
      }
      .reg-range::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none;
        width: 18px; height: 18px; border-radius: 50%;
        background: #006B3A; cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,107,58,0.35);
        border: 2px solid #fff;
        transition: transform 0.15s;
      }
      .reg-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
      .reg-range::-moz-range-thumb {
        width: 18px; height: 18px; border-radius: 50%;
        background: #006B3A; cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,107,58,0.35);
        border: 2px solid #fff;
      }
      @media (max-width: 680px) {
        .reg-left-panel { display: none !important; }
        .reg-mobile-logo { display: flex !important; }
      }
    `;
    document.head.appendChild(style);
    setTimeout(() => setMounted(true), 60);
    return () => document.head.removeChild(style);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const payload = { ...form, charity_id: form.charity_id || undefined };
      const user = await register(payload);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/subscribe');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  const pct = form.charity_percentage;
  return (
    <div style={{
      height: '100vh', display: 'flex', overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
      background: '#f7faf8',
    }}>
      <div
        className="reg-left-panel"
        style={{
          width: '40%', minWidth: 300,
          background: 'linear-gradient(160deg, #003d21 0%, #006B3A 55%, #00874a 100%)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          padding: '32px 36px',
          flexShrink: 0,
        }}
      >
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }} preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="rp-topo" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
              <ellipse cx="80" cy="80" rx="72" ry="40" fill="none" stroke="#fff" strokeWidth="1"/>
              <ellipse cx="80" cy="80" rx="52" ry="28" fill="none" stroke="#fff" strokeWidth="1"/>
              <ellipse cx="80" cy="80" rx="32" ry="16" fill="none" stroke="#fff" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rp-topo)"/>
        </svg>
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.08)',
          animation: 'spin 40s linear infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, left: -60,
          width: 260, height: 260, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
        }} />
        <Ball style={{ top: '22%', right: '10%', width: 18, height: 18, animation: 'floatBall 6s ease-in-out infinite' }} />
        <Ball style={{ top: '48%', right: '24%', width: 11, height: 11, animation: 'floatBall 9s ease-in-out 1.5s infinite' }} />
        <Ball style={{ top: '70%', right: '7%',  width: 15, height: 15, animation: 'floatBall 7.5s ease-in-out 0.8s infinite' }} />
        <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, opacity: 0.3, pointerEvents: 'none' }} viewBox="0 0 400 56" preserveAspectRatio="none">
          {Array.from({ length: 28 }, (_, i) => {
            const x = (i / 27) * 390 + 5;
            const h = 18 + Math.sin(i * 1.9) * 9;
            const lean = Math.sin(i * 1.1) * 7;
            return (
              <path key={i}
                d={`M${x},56 Q${x + lean},${56 - h * 0.5} ${x + lean * 0.4},${56 - h}`}
                stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round"
                style={{ animation: `grassSway ${2.5 + (i % 5) * 0.3}s ease-in-out ${(i * 0.07) % 1}s infinite alternate` }}
              />
            );
          })}
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, animation: 'fadeUp 0.5s ease both' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trophy size={15} color="#fff" />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>PlayForGood</span>
        </div>
        <div style={{ marginBottom: 20, flex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: 600,
            marginBottom: 12, letterSpacing: 1,
            animation: 'fadeUp 0.5s ease 0.1s both',
          }}>
            <Star size={9} fill="currentColor" /> JOIN THE COMMUNITY
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 900,
            color: '#fff', lineHeight: 1.2, marginBottom: 10,
            animation: 'fadeUp 0.5s ease 0.2s both',
          }}>
            Start your<br />journey today.
          </h2>

          <p style={{
            color: 'rgba(255,255,255,0.62)', fontSize: 12.5, lineHeight: 1.6,
            maxWidth: 280, marginBottom: 20,
            animation: 'fadeUp 0.5s ease 0.3s both',
          }}>
            Create your account in seconds and join thousands of golfers making a real difference.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Step num="1" title="Create your account"   desc="Fill in your details — it only takes a minute."   delay={0.35} />
            <Step num="2" title="Choose a charity"      desc="Pick a cause close to your heart to support."     delay={0.40} />
            <Step num="3" title="Subscribe & compete"   desc="Enter monthly draws with your Stableford scores." delay={0.45} />
            <Step num="4" title="Win & give back"        desc="Match numbers to win prizes while funding good."  delay={0.50} />
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
          animation: 'fadeUp 0.5s ease 0.55s both',
        }}>
          <Heart size={13} fill="rgba(255,255,255,0.7)" color="transparent" />
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 11, lineHeight: 1.4, margin: 0 }}>
            Over <strong style={{ color: '#fff' }}>£200,000</strong> raised for UK charities through PlayForGood
          </p>
        </div>
      </div>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 24px', position: 'relative', overflow: 'hidden',
        overflowY: 'auto',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'radial-gradient(circle, rgba(0,107,58,0.10) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          width: '100%', maxWidth: 380,
          position: 'relative', zIndex: 1,
          animation: mounted ? 'fadeUp 0.55s ease 0.15s both' : 'none',
          padding: '4px 0',
        }}>
          <Link to="/" style={{
            display: 'none', alignItems: 'center', gap: 8,
            justifyContent: 'center', marginBottom: 20,
            textDecoration: 'none',
          }} className="reg-mobile-logo">
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: '#006B3A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trophy size={14} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#0d1f14' }}>PlayForGood</span>
          </Link>
          <div style={{ marginBottom: 18 }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 24, fontWeight: 900, color: '#0d1f14',
              marginBottom: 4, lineHeight: 1.2,
            }}>Create your account</h1>
            <p style={{ color: '#7a9585', fontSize: 13, lineHeight: 1.5 }}>
              Join and start playing with purpose
            </p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2d4a38', marginBottom: 5 }}>
                Full Name <span style={{ color: '#006B3A' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={13} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'name' ? '#006B3A' : '#a0b8a9', transition: 'color 0.2s',
                }} />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused('')}
                  className="reg-input"
                  placeholder="John Smith"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: 36, paddingRight: 12,
                    paddingTop: 9, paddingBottom: 9,
                    border: '1.5px solid #dde8e2', borderRadius: 10,
                    fontSize: 13, color: '#0d1f14', background: '#fff',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2d4a38', marginBottom: 5 }}>
                Email address <span style={{ color: '#006B3A' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={13} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'email' ? '#006B3A' : '#a0b8a9', transition: 'color 0.2s',
                }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  className="reg-input"
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: 36, paddingRight: 12,
                    paddingTop: 9, paddingBottom: 9,
                    border: '1.5px solid #dde8e2', borderRadius: 10,
                    fontSize: 13, color: '#0d1f14', background: '#fff',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2d4a38', marginBottom: 5 }}>
                Password <span style={{ color: '#006B3A' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={13} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'password' ? '#006B3A' : '#a0b8a9', transition: 'color 0.2s',
                }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  className="reg-input"
                  placeholder="Min 6 characters"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: 36, paddingRight: 40,
                    paddingTop: 9, paddingBottom: 9,
                    border: '1.5px solid #dde8e2', borderRadius: 10,
                    fontSize: 13, color: '#0d1f14', background: '#fff',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#a0b8a9', padding: 2,
                    display: 'flex', alignItems: 'center',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#006B3A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#a0b8a9'}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 2.5, borderRadius: 3,
                      background: form.password.length < 6
                        ? (i === 1 ? '#ef4444' : '#e8f0eb')
                        : form.password.length < 10
                        ? (i <= 2 ? '#f59e0b' : '#e8f0eb')
                        : '#006B3A',
                      transition: 'background 0.3s',
                    }}/>
                  ))}
                </div>
              )}
              {form.password.length > 0 && (
                <p style={{ fontSize: 10, marginTop: 3, color: form.password.length < 6 ? '#ef4444' : form.password.length < 10 ? '#b45309' : '#006B3A' }}>
                  {form.password.length < 6 ? 'Too short' : form.password.length < 10 ? 'Good password' : 'Strong password'}
                </p>
              )}
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#2d4a38', marginBottom: 5 }}>
                <Heart size={11} color="#006B3A" fill="rgba(0,107,58,0.2)" />
                Choose a Charity
                <span style={{ color: '#a0b8a9', fontWeight: 400, fontSize: 11 }}>(optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.charity_id}
                  onChange={e => setForm({ ...form, charity_id: e.target.value })}
                  onFocus={() => setFocused('charity')}
                  onBlur={() => setFocused('')}
                  className="reg-select"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '9px 36px 9px 12px',
                    border: '1.5px solid #dde8e2', borderRadius: 10,
                    fontSize: 13, color: form.charity_id ? '#0d1f14' : '#b0c4b8',
                    background: '#fff', appearance: 'none', WebkitAppearance: 'none',
                    fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                  }}
                >
                  <option value="">Select a charity...</option>
                  {charities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={13} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: '#a0b8a9', pointerEvents: 'none',
                }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#2d4a38' }}>
                  Charity Contribution
                </label>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 17, fontWeight: 900, color: '#006B3A', lineHeight: 1,
                }}>{pct}%</span>
              </div>
              <input
                type="range" min="10" max="100"
                value={pct}
                onChange={e => setForm({ ...form, charity_percentage: parseInt(e.target.value) })}
                className="reg-range"
                style={{ width: '100%', '--pct': `${pct}%` }}
              />
              <div style={{
                marginTop: 7, padding: '7px 12px',
                background: 'linear-gradient(135deg,#f0f7f3,#e8f5ef)',
                border: '1px solid #c8e6d4', borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Heart size={11} color="#006B3A" fill="rgba(0,107,58,0.2)" />
                <p style={{ fontSize: 11, color: '#2d4a38', margin: 0, lineHeight: 1.4 }}>
                  <strong style={{ color: '#006B3A' }}>{pct}%</strong> of your subscription goes directly to your chosen charity
                </p>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px 24px',
                borderRadius: 10, border: 'none',
                background: loading ? '#4a9d6e' : '#006B3A',
                color: '#fff', fontWeight: 600, fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: loading ? 'none' : '0 6px 20px rgba(0,107,58,0.30)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.2s',
                marginTop: 2, position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,107,58,0.38)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,107,58,0.30)'; }}
            >
              {!loading && (
                <span style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 10, pointerEvents: 'none' }}>
                  <span style={{
                    position: 'absolute', top: 0, bottom: 0, width: '40%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    animation: 'shimmerLine 3s ease-in-out infinite',
                  }} />
                </span>
              )}
              {loading ? (
                <span style={{
                  width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spinBtn 0.7s linear infinite',
                  display: 'inline-block',
                }} />
              ) : (
                <>Create Account <ArrowRight size={14} /></>
              )}
            </button>
          </form>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e8f0eb' }} />
            <span style={{ fontSize: 11, color: '#a0b8a9', fontWeight: 500 }}>Already a member?</span>
            <div style={{ flex: 1, height: 1, background: '#e8f0eb' }} />
          </div>
          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            width: '100%', padding: '10px 24px', borderRadius: 10,
            border: '1.5px solid #dde8e2', background: '#fff',
            color: '#006B3A', fontWeight: 600, fontSize: 13,
            textDecoration: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#006B3A'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,107,58,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#dde8e2'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Log in to existing account <ArrowRight size={13} />
          </Link>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#a0b8a9', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Star size={9} fill="#a0b8a9" color="#a0b8a9" />
            Trusted by 5,000+ golfers across the UK
            <Star size={9} fill="#a0b8a9" color="#a0b8a9" />
          </p>
        </div>
      </div>
    </div>
  );
}