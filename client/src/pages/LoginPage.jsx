import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Trophy, Mail, Lock, Eye, EyeOff, ArrowRight, Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';

/* ── floating golf ball ── */
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

/* ── left panel decorative stat ── */
function Stat({ value, label, delay }) {
  return (
    <div style={{
      textAlign: 'center',
      animation: `fadeUp 0.6s ease ${delay}s both`,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4, letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [mounted, setMounted] = useState(false);

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
      @keyframes spin {
        from { transform:rotate(0deg); }
        to   { transform:rotate(360deg); }
      }
      @keyframes spinBtn {
        to { transform:rotate(360deg); }
      }
      @keyframes grassSway {
        0%,100% { transform:rotate(-3deg); }
        50%      { transform:rotate(3deg); }
      }
      @keyframes shimmerLine {
        0%   { transform:translateX(-100%); }
        100% { transform:translateX(400%); }
      }
      .login-input:focus {
        outline: none;
        border-color: #006B3A !important;
        box-shadow: 0 0 0 3px rgba(0,107,58,0.12) !important;
      }
      .login-input::placeholder { color: #b0c4b8; }
      .login-input { transition: border-color 0.2s, box-shadow 0.2s; }
    `;
    document.head.appendChild(style);
    setTimeout(() => setMounted(true), 60);
    return () => document.head.removeChild(style);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      fontFamily: "'DM Sans', sans-serif",
      background: '#f7faf8',
    }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: '42%', minWidth: 340,
        background: 'linear-gradient(160deg, #003d21 0%, #006B3A 55%, #00874a 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        padding: '52px 44px',
        flexShrink: 0,
      }}
        className="login-left-panel"
      >
        {/* hide on mobile via inline media query workaround — handled by wrapping div below */}

        {/* topo contour lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }} preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="lp-topo" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
              <ellipse cx="80" cy="80" rx="72" ry="40" fill="none" stroke="#fff" strokeWidth="1"/>
              <ellipse cx="80" cy="80" rx="52" ry="28" fill="none" stroke="#fff" strokeWidth="1"/>
              <ellipse cx="80" cy="80" rx="32" ry="16" fill="none" stroke="#fff" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lp-topo)"/>
        </svg>

        {/* spinning decorative ring */}
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

        {/* floating balls */}
        <Ball style={{ top: '18%', right: '12%', width: 18, height: 18, animation: 'floatBall 6s ease-in-out infinite' }} />
        <Ball style={{ top: '55%', right: '22%', width: 11, height: 11, animation: 'floatBall 8s ease-in-out 1s infinite' }} />
        <Ball style={{ top: '75%', right: '8%',  width: 14, height: 14, animation: 'floatBall 7s ease-in-out 2s infinite' }} />

        {/* grass blades at bottom */}
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

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto', animation: 'fadeUp 0.5s ease both' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trophy size={18} color="#fff" />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>GolfGives</span>
        </div>

        {/* Main copy */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 999,
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 600,
            marginBottom: 20, letterSpacing: 1,
            animation: 'fadeUp 0.5s ease 0.1s both',
          }}>
            <Heart size={10} fill="currentColor" /> GOLF THAT GIVES BACK
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px,3vw,40px)', fontWeight: 900,
            color: '#fff', lineHeight: 1.18, marginBottom: 16,
            animation: 'fadeUp 0.5s ease 0.2s both',
          }}>
            Play with<br />purpose.<br />Win big.
          </h2>

          <p style={{
            color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7,
            maxWidth: 280,
            animation: 'fadeUp 0.5s ease 0.3s both',
          }}>
            Your Stableford scores enter monthly prize draws — while every subscription supports a charity you love.
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 28,
          padding: '20px 24px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          animation: 'fadeUp 0.5s ease 0.4s both',
        }}>
          <Stat value="£50K+" label="Prize Pool"  delay={0.5} />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.12)', alignSelf: 'stretch' }} />
          <Stat value="120+"  label="Charities"   delay={0.55} />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.12)', alignSelf: 'stretch' }} />
          <Stat value="5K+"   label="Players"     delay={0.6} />
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle dot grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'radial-gradient(circle, rgba(0,107,58,0.10) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          width: '100%', maxWidth: 400,
          position: 'relative', zIndex: 1,
          animation: mounted ? 'fadeUp 0.55s ease 0.15s both' : 'none',
        }}>

          {/* Mobile logo (shown only on small screens via style tag below) */}
          <Link to="/" style={{
            display: 'none', alignItems: 'center', gap: 8,
            justifyContent: 'center', marginBottom: 32,
            textDecoration: 'none',
          }} className="login-mobile-logo">
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#006B3A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trophy size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#0d1f14' }}>GolfGives</span>
          </Link>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 30, fontWeight: 900, color: '#0d1f14',
              marginBottom: 6, lineHeight: 1.2,
            }}>Welcome back</h1>
            <p style={{ color: '#7a9585', fontSize: 14, lineHeight: 1.6 }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2d4a38', marginBottom: 7 }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'email' ? '#006B3A' : '#a0b8a9',
                  transition: 'color 0.2s',
                }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  className="login-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: 42, paddingRight: 14,
                    paddingTop: 12, paddingBottom: 12,
                    border: '1.5px solid #dde8e2',
                    borderRadius: 12, fontSize: 14,
                    color: '#0d1f14', background: '#fff',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#2d4a38' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{
                  fontSize: 12, color: '#006B3A', textDecoration: 'none', fontWeight: 500,
                }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'password' ? '#006B3A' : '#a0b8a9',
                  transition: 'color 0.2s',
                }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  className="login-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: 42, paddingRight: 44,
                    paddingTop: 12, paddingBottom: 12,
                    border: '1.5px solid #dde8e2',
                    borderRadius: 12, fontSize: 14,
                    color: '#0d1f14', background: '#fff',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#a0b8a9', padding: 2,
                    transition: 'color 0.2s',
                    display: 'flex', alignItems: 'center',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#006B3A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#a0b8a9'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px 24px',
                borderRadius: 12, border: 'none',
                background: loading ? '#4a9d6e' : '#006B3A',
                color: '#fff', fontWeight: 600, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: loading ? 'none' : '0 6px 20px rgba(0,107,58,0.30)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.2s',
                marginTop: 4, position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,107,58,0.38)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,107,58,0.30)'; }}
            >
              {/* shimmer on hover */}
              {!loading && (
                <span style={{
                  position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 12, pointerEvents: 'none',
                }}>
                  <span style={{
                    position: 'absolute', top: 0, bottom: 0, width: '40%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    animation: 'shimmerLine 3s ease-in-out infinite',
                  }} />
                </span>
              )}
              {loading ? (
                <span style={{
                  width: 18, height: 18,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spinBtn 0.7s linear infinite',
                  display: 'inline-block',
                }} />
              ) : (
                <>Log In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '24px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: '#e8f0eb' }} />
            <span style={{ fontSize: 12, color: '#a0b8a9', fontWeight: 500 }}>New to GolfGives?</span>
            <div style={{ flex: 1, height: 1, background: '#e8f0eb' }} />
          </div>

          {/* Sign up link */}
          <Link to="/register" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '12px 24px',
            borderRadius: 12,
            border: '1.5px solid #dde8e2',
            background: '#fff',
            color: '#006B3A', fontWeight: 600, fontSize: 14,
            textDecoration: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#006B3A'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,107,58,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#dde8e2'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Create a free account <ArrowRight size={15} />
          </Link>

          {/* Trust line */}
          <p style={{ textAlign: 'center', fontSize: 11, color: '#a0b8a9', marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Star size={10} fill="#a0b8a9" color="#a0b8a9" />
            Trusted by 5,000+ golfers across the UK
            <Star size={10} fill="#a0b8a9" color="#a0b8a9" />
          </p>
        </div>
      </div>

      {/* responsive: hide left panel on small screens */}
      <style>{`
        @media (max-width: 680px) {
          .login-left-panel { display: none !important; }
          .login-mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}