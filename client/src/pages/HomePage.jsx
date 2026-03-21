import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Heart, Zap, Target, Award, ArrowRight, Star, ChevronDown } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../lib/api';
import Firework from '../components/FireWork';

/* ─────────────────────────────────────────
   Floating orb that follows the cursor
───────────────────────────────────────── */
function CursorOrb() {
  const orbRef = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (!orbRef.current) return;
      orbRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div
      ref={orbRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,107,58,0.10) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
        transition: 'transform 0.18s cubic-bezier(.25,.46,.45,.94)',
      }}
    />
  );
}

/* ─────────────────────────────────────────
   Animated counter
───────────────────────────────────────── */
function CountUp({ end, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const num = parseInt(end.replace(/\D/g, ''));
      let start = 0;
      const step = Math.ceil(num / 60);
      const timer = setInterval(() => {
        start += step;
        if (start >= num) { setCount(num); clearInterval(timer); }
        else setCount(start);
      }, 20);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{end.replace(/[\d,]+/, count.toLocaleString())}{suffix}</span>;
}

/* ─────────────────────────────────────────
   Number ball
───────────────────────────────────────── */
function DrawBall({ n, delay = 0 }) {
  return (
    <div style={{
      width: 52, height: 52, borderRadius: '50%',
      background: 'linear-gradient(135deg,#006B3A 0%,#00994f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: 18,
      boxShadow: '0 8px 24px rgba(0,107,58,0.35)',
      animation: `ballPop 0.5s cubic-bezier(.34,1.56,.64,1) ${delay}s both`,
    }}>{n}</div>
  );
}

/* ─────────────────────────────────────────
   Step card
───────────────────────────────────────── */
function StepCard({ icon: Icon, title, desc, index }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff',
        border: hover ? '1.5px solid #006B3A' : '1.5px solid #e8f0eb',
        borderRadius: 18,
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        transform: hover ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hover ? '0 16px 40px rgba(0,107,58,0.13)' : '0 2px 12px rgba(0,0,0,0.05)',
        cursor: 'default',
        animation: `fadeSlideUp 0.5s ease ${index * 0.1}s both`,
      }}
    >
      <div style={{
        position: 'absolute', top: 16, right: 18,
        fontSize: 52, fontWeight: 900, color: '#f0f7f3',
        fontFamily: 'Georgia, serif', lineHeight: 1, userSelect: 'none',
      }}>0{index + 1}</div>
      <div style={{
        width: 44, height: 44,
        background: hover ? '#006B3A' : '#f0f7f3',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
        transition: 'background 0.25s ease',
      }}>
        <Icon size={20} color={hover ? '#fff' : '#006B3A'} />
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: '#1a2e22', marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 14, color: '#64786b', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function HomePage() {
  const [charities, setCharities] = useState([]);
  const [latestDraw, setLatestDraw] = useState(null);
  const [position, setPosition] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // inject keyframes
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

      @keyframes fadeSlideUp {
        from { opacity:0; transform:translateY(28px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes ballPop {
        from { opacity:0; transform:scale(0.4); }
        to   { opacity:1; transform:scale(1); }
      }
      @keyframes spin-slow {
        from { transform:rotate(0deg); }
        to   { transform:rotate(360deg); }
      }
      @keyframes floatY {
        0%,100% { transform:translateY(0); }
        50%      { transform:translateY(-12px); }
      }
      @keyframes shimmer {
        0%   { background-position:-400px 0; }
        100% { background-position:400px 0; }
      }
      @keyframes pulseRing {
        0%   { box-shadow:0 0 0 0 rgba(0,107,58,0.35); }
        70%  { box-shadow:0 0 0 14px rgba(0,107,58,0); }
        100% { box-shadow:0 0 0 0 rgba(0,107,58,0); }
      }
      @keyframes rotateBadge {
        from { transform:rotate(0deg); }
        to   { transform:rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 80);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    setTimeout(() => setPosition(null), 800);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    api.get('/charities?featured=true').then(r => setCharities(r.data.slice(0, 3))).catch(() => {});
    api.get('/draws/latest').then(r => setLatestDraw(r.data)).catch(() => {});
  }, []);

  const steps = [
    { icon: Zap, title: 'Subscribe', desc: 'Join monthly or yearly. Cancel anytime.' },
    { icon: Target, title: 'Enter Scores', desc: 'Log your last 5 Stableford scores.' },
    { icon: Trophy, title: 'Win Prizes', desc: 'Match drawn numbers to win from the pool.' },
    { icon: Heart, title: 'Give Back', desc: 'A portion of your sub goes to your chosen charity.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fcfffe', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      {position && <Firework x={position.x} y={position.y} onFinish={() => setPosition(null)} />}
      <CursorOrb />
      <Navbar />

      {/* ── HERO ─────────────────────────────── */}
      <section style={{
        position: 'relative', paddingTop: 112, paddingBottom: 96,
        padding: '112px 24px 96px', textAlign: 'center', overflow: 'hidden',
      }}>
        {/* mesh bg */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,107,58,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* decorative rings */}
        <div style={{
          position: 'absolute', top: '10%', left: '-120px', width: 360, height: 360,
          border: '1.5px solid rgba(0,107,58,0.08)', borderRadius: '50%', zIndex: 0,
          animation: 'spin-slow 30s linear infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-80px', width: 280, height: 280,
          border: '1.5px solid rgba(0,107,58,0.07)', borderRadius: '50%', zIndex: 0,
        }} />

        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 18px', borderRadius: 999,
            background: '#f0f7f3', border: '1px solid rgba(0,107,58,0.2)',
            color: '#006B3A', fontSize: 13, fontWeight: 600,
            marginBottom: 28, letterSpacing: 0.3,
            animation: heroVisible ? 'fadeSlideUp 0.5s ease both' : 'none',
          }}>
            <Heart size={13} fill="#006B3A" />
            Golf that gives back
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(44px, 7vw, 80px)',
            fontWeight: 900, color: '#0d1f14', lineHeight: 1.1,
            marginBottom: 24, letterSpacing: -1,
            animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.1s both' : 'none',
          }}>
            Play Golf.<br />
            <span style={{
              color: '#006B3A',
              background: 'linear-gradient(135deg, #006B3A 0%, #00994f 60%, #00c060 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Win Prizes.</span><br />
            Change Lives.
          </h1>

          <p style={{
            color: '#4a6655', fontSize: 18, maxWidth: 560, margin: '0 auto 40px',
            lineHeight: 1.75,
            animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.2s both' : 'none',
          }}>
            The subscription platform where your Stableford scores enter monthly prize draws —
            and every subscription drives real charitable impact.
          </p>

          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14,
            animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.3s both' : 'none',
          }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 999,
              background: '#006B3A', color: '#fff',
              fontWeight: 600, fontSize: 16, textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(0,107,58,0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              animation: 'pulseRing 2.5s infinite 1s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,107,58,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,107,58,0.35)'; }}
            >
              Start Playing <ArrowRight size={17} />
            </Link>
            <Link to="/charities" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 999,
              background: 'transparent', color: '#006B3A',
              border: '1.5px solid #006B3A',
              fontWeight: 600, fontSize: 16, textDecoration: 'none',
              transition: 'background 0.2s ease, color 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#006B3A'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#006B3A'; }}
            >
              Browse Charities
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: 16, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto',
            animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.4s both' : 'none',
          }}>
            {[['£50K+', 'Prize Pool'], ['120+', 'Charities'], ['5K+', 'Players']].map(([val, label], i) => (
              <div key={label} style={{
                padding: '18px 12px',
                background: '#fff',
                border: '1.5px solid #e8f0eb',
                borderRadius: 14,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 26, fontWeight: 900, color: '#006B3A',
                }}>
                  <CountUp end={val} />
                </div>
                <div style={{ fontSize: 12, color: '#7a9585', marginTop: 2, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* scroll hint */}
        <div style={{
          position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
          animation: 'floatY 2s ease-in-out infinite', color: '#a0b8a9',
        }}>
          <ChevronDown size={22} />
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────── */}
      <section style={{ padding: '96px 24px', background: '#f8fdf9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#006B3A', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
              Simple Process
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900,
              color: '#0d1f14', lineHeight: 1.2,
            }}>
              Four steps to play,<br />win &amp; give
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
            {steps.map((s, i) => <StepCard key={s.title} {...s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── PRIZE POOL ───────────────────────── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 56, alignItems: 'center' }}>

          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 999,
              background: '#fffbeb', border: '1px solid #fde68a',
              color: '#b45309', fontSize: 12, fontWeight: 600,
              marginBottom: 18, letterSpacing: 0.3,
            }}>
              <Award size={11} /> Monthly Prize Draw
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900,
              color: '#0d1f14', marginBottom: 16,
            }}>Win Big.<br />Give More.</h2>
            <p style={{ color: '#4a6655', lineHeight: 1.7, marginBottom: 32, fontSize: 15 }}>
              Every month, five numbers are drawn from the Stableford range. Match more to win more.
            </p>

            {[
              { label: '5 Numbers Matched', pct: '40%', color: '#b45309', bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '#fde68a' },
              { label: '4 Numbers Matched', pct: '35%', color: '#1d4ed8', bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#bfdbfe' },
              { label: '3 Numbers Matched', pct: '25%', color: '#006B3A', bg: 'linear-gradient(135deg,#f0f7f3,#d1fae5)', border: '#a7f3d0' },
            ].map(({ label, pct, color, bg, border }, i) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px', borderRadius: 14,
                background: bg, border: `1.5px solid ${border}`,
                marginBottom: 10,
                animation: `fadeSlideUp 0.5s ease ${i * 0.1}s both`,
              }}>
                <span style={{ color, fontWeight: 600, fontSize: 15 }}>{label}</span>
                <span style={{
                  color, fontWeight: 800, fontSize: 22,
                  fontFamily: "'Playfair Display', serif",
                }}>{pct}</span>
              </div>
            ))}
          </div>

          {/* Draw card */}
          <div style={{
            background: '#fff',
            border: '1.5px solid #e8f0eb',
            borderRadius: 20,
            padding: 0,
            overflow: 'hidden',
            boxShadow: '0 12px 48px rgba(0,107,58,0.08)',
            animation: 'floatY 5s ease-in-out infinite',
          }}>
            <div style={{
              background: 'linear-gradient(135deg,#006B3A 0%,#00994f 100%)',
              padding: '28px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 48, height: 48,
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Trophy size={22} color="#fff" />
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: "'Playfair Display', serif" }}>Latest Draw</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  {latestDraw ? new Date(latestDraw.draw_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Coming soon'}
                </p>
              </div>
            </div>

            <div style={{ padding: '32px 24px', textAlign: 'center' }}>
              {latestDraw ? (
                <>
                  <p style={{ color: '#7a9585', fontSize: 13, marginBottom: 20, fontWeight: 500 }}>Winning Numbers</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                    {latestDraw.drawn_numbers?.map((n, i) => <DrawBall key={n} n={n} delay={i * 0.08} />)}
                  </div>
                </>
              ) : (
                <div style={{ padding: '24px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
                  <p style={{ color: '#4a6655', fontWeight: 600 }}>Next draw coming soon</p>
                  <p style={{ color: '#a0b8a9', fontSize: 13, marginTop: 4 }}>Subscribe to be entered automatically</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED CHARITIES ───────────────── */}
      {charities.length > 0 && (
        <section style={{ padding: '96px 24px', background: '#f8fdf9' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
              <div>
                <p style={{ color: '#006B3A', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Making a Difference</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 900, color: '#0d1f14' }}>
                  Featured Charities
                </h2>
              </div>
              <Link to="/charities" style={{ color: '#006B3A', fontWeight: 600, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
              {charities.map((c, i) => (
                <div key={c.id}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #e8f0eb',
                    borderRadius: 18, padding: '28px 24px',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    animation: `fadeSlideUp 0.5s ease ${i * 0.1}s both`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,107,58,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: '#f0f7f3',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <Heart size={18} color="#006B3A" />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#0d1f14', marginBottom: 8 }}>{c.name}</h3>
                  <p style={{ color: '#64786b', fontSize: 14, lineHeight: 1.6 }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────── */}
      <section style={{
        padding: '80px 24px 100px',
        background: 'linear-gradient(135deg,#003d21 0%,#006B3A 50%,#00873f 100%)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80, width: 320, height: 320,
          border: '1.5px solid rgba(255,255,255,0.06)', borderRadius: '50%',
          animation: 'spin-slow 25s linear infinite reverse',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, left: -60, width: 280, height: 280,
          border: '1.5px solid rgba(255,255,255,0.05)', borderRadius: '50%',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 16px', borderRadius: 999,
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#a3e6bc', fontSize: 12, fontWeight: 600,
            marginBottom: 24, letterSpacing: 1,
          }}>
            <Star size={11} fill="currentColor" /> JOIN THE COMMUNITY
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900,
            color: '#fff', lineHeight: 1.15, marginBottom: 16,
          }}>
            Ready to play<br />with purpose?
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>
            Join thousands of golfers making a real difference — one round at a time.
          </p>

          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 40px', borderRadius: 999,
            background: '#fff', color: '#006B3A',
            fontWeight: 700, fontSize: 16, textDecoration: 'none',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 18px 50px rgba(0,0,0,0.28)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)'; }}
          >
            Join Now <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}