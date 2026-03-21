import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, ExternalLink, Calendar, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../lib/api';
function useStyles() {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
      @keyframes fadeSlideUp {
        from { opacity:0; transform:translateY(24px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity:0; } to { opacity:1; }
      }
      @keyframes spin-slow {
        from { transform:rotate(0deg); } to { transform:rotate(360deg); }
      }
      @keyframes floatY {
        0%,100% { transform:translateY(0); }
        50%      { transform:translateY(-10px); }
      }
      @keyframes shimmerSweep {
        0%   { transform:translateX(-100%); }
        100% { transform:translateX(300%); }
      }
      @keyframes pulseHeart {
        0%,100% { transform:scale(1); }
        50%      { transform:scale(1.18); }
      }
      @keyframes skeletonPulse {
        0%,100% { opacity:0.5; }
        50%      { opacity:1; }
      }
      @keyframes cardIn {
        from { opacity:0; transform:translateY(20px) scale(0.97); }
        to   { opacity:1; transform:translateY(0) scale(1); }
      }

      .charity-card {
        background: #fff;
        border: 1.5px solid #e8f0eb;
        border-radius: 18px;
        padding: 22px;
        display: flex;
        flex-direction: column;
        cursor: default;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        position: relative;
        overflow: hidden;
      }
      .charity-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 48px rgba(0,107,58,0.12);
        border-color: #006B3A;
      }
      .charity-card:hover .card-shimmer {
        animation: shimmerSweep 0.7s ease forwards;
      }
      .charity-card:hover .card-icon {
        background: #006B3A !important;
      }
      .charity-card:hover .card-icon svg {
        color: #fff !important;
      }
      .charity-card:hover .card-heart {
        animation: pulseHeart 0.6s ease;
      }

      .search-box:focus {
        outline: none;
        border-color: #006B3A !important;
        box-shadow: 0 0 0 3px rgba(0,107,58,0.12) !important;
      }
      .search-box { transition: border-color 0.2s, box-shadow 0.2s; }
      .search-box::placeholder { color: #b0c4b8; }

      .visit-link {
        display: inline-flex; align-items: center; gap: 5px;
        font-size: 12px; font-weight: 600; color: #006B3A;
        text-decoration: none;
        transition: gap 0.2s ease, opacity 0.2s;
      }
      .visit-link:hover { gap: 8px; opacity: 0.8; }

      .skeleton { animation: skeletonPulse 1.4s ease-in-out infinite; }
    `;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
}
function CountUp({ to, suffix = '' }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let cur = 0;
      const step = Math.ceil(to / 50);
      const t = setInterval(() => {
        cur += step;
        if (cur >= to) { setN(to); clearInterval(t); } else setN(cur);
      }, 20);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}
function CharityCard({ c, index }) {
  return (
    <div
      className="charity-card"
      style={{ animation: `cardIn 0.45s ease ${(index % 9) * 0.06}s both` }}
    >
      <div className="card-shimmer" style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '35%',
        background: 'linear-gradient(90deg, transparent, rgba(0,107,58,0.04), transparent)',
        transform: 'translateX(-100%)', pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        {c.logo_url ? (
          <img
            src={c.logo_url} alt={c.name}
            style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 12, background: '#f8fdf9', padding: 6 }}
          />
        ) : (
          <div className="card-icon" style={{
            width: 52, height: 52, borderRadius: 14,
            background: '#f0f7f3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.25s ease', flexShrink: 0,
          }}>
            <Heart className="card-heart" size={22} color="#006B3A" />
          </div>
        )}
        {c.featured && (
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
            background: 'linear-gradient(135deg,#fffbeb,#fef3c7)',
            border: '1px solid #fde68a', color: '#b45309',
            padding: '3px 10px', borderRadius: 999,
          }}>
            ★ Featured
          </span>
        )}
      </div>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 16, fontWeight: 700, color: '#0d1f14',
        marginBottom: 8, lineHeight: 1.3,
      }}>{c.name}</h3>
      <p style={{
        color: '#64786b', fontSize: 13, lineHeight: 1.65,
        flex: 1, marginBottom: 14,
      }}>
        {c.description || 'Supporting communities through charitable giving.'}
      </p>

      {c.events?.length > 0 && (
        <div style={{
          borderTop: '1px solid #f0f7f3', paddingTop: 12, marginBottom: 12,
        }}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: '#006B3A',
            marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5,
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            <Calendar size={10} /> Upcoming Events
          </p>
          {c.events.slice(0, 2).map((ev, i) => (
            <p key={i} style={{
              fontSize: 12, color: '#4a6655', marginBottom: 2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>· {ev}</p>
          ))}
        </div>
      )}

      {c.website && (
        <a href={c.website} target="_blank" rel="noopener noreferrer" className="visit-link">
          Visit website <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}
function SkeletonCard() {
  return (
    <div className="skeleton" style={{
      background: '#fff', border: '1.5px solid #e8f0eb',
      borderRadius: 18, padding: 22,
    }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f0f0ee', marginBottom: 16 }} />
      <div style={{ height: 14, background: '#f0f0ee', borderRadius: 6, width: '65%', marginBottom: 10 }} />
      <div style={{ height: 12, background: '#f0f0ee', borderRadius: 6, marginBottom: 6 }} />
      <div style={{ height: 12, background: '#f0f0ee', borderRadius: 6, width: '80%', marginBottom: 6 }} />
      <div style={{ height: 12, background: '#f0f0ee', borderRadius: 6, width: '55%' }} />
    </div>
  );
}
export default function CharitiesPage() {
  useStyles();
  const [charities, setCharities] = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/charities${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then(r => setCharities(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  const featured  = charities.filter(c => c.featured).length;
  const withSites = charities.filter(c => c.website).length;
  return (
    <div style={{ minHeight: '100vh', background: '#f8fdf9', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '100px 24px 60px', textAlign: 'center',
        background: 'linear-gradient(180deg, #fff 0%, #f8fdf9 100%)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'radial-gradient(circle, rgba(0,107,58,0.10) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '5%', left: '-80px', width: 300, height: 300,
          border: '1px solid rgba(0,107,58,0.07)', borderRadius: '50%', zIndex: 0,
          animation: 'spin-slow 35s linear infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', right: '-60px', width: 240, height: 240,
          border: '1px solid rgba(0,107,58,0.06)', borderRadius: '50%', zIndex: 0,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 16px', borderRadius: 999,
            background: '#f0f7f3', border: '1px solid rgba(0,107,58,0.18)',
            color: '#006B3A', fontSize: 12, fontWeight: 700,
            marginBottom: 20, letterSpacing: 0.5,
            animation: 'fadeSlideUp 0.5s ease both',
          }}>
            <Heart size={12} fill="#006B3A" /> Your Impact
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(34px,5vw,58px)', fontWeight: 900,
            color: '#0d1f14', lineHeight: 1.1,
            marginBottom: 18, letterSpacing: -1,
            animation: 'fadeSlideUp 0.5s ease 0.1s both',
          }}>
            Charities We<br />
            <span style={{
              background: 'linear-gradient(135deg,#006B3A,#00994f,#00c060)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Support</span>
          </h1>

          <p style={{
            color: '#4a6655', fontSize: 16, lineHeight: 1.75,
            maxWidth: 520, margin: '0 auto 36px',
            animation: 'fadeSlideUp 0.5s ease 0.2s both',
          }}>
            Choose a charity at signup and a portion of your subscription goes directly to them every month.
          </p>
          {!loading && charities.length > 0 && (
            <div style={{
              display: 'inline-flex', gap: 0,
              background: '#fff', border: '1.5px solid #e8f0eb',
              borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,107,58,0.07)',
              animation: 'fadeSlideUp 0.5s ease 0.3s both',
            }}>
              {[
                { val: charities.length, suffix: '', label: 'Charities' },
                { val: featured,         suffix: '',  label: 'Featured' },
                { val: withSites,        suffix: '',  label: 'With Websites' },
              ].map(({ val, suffix, label }, i) => (
                <div key={label} style={{
                  padding: '14px 24px', textAlign: 'center',
                  borderRight: i < 2 ? '1px solid #e8f0eb' : 'none',
                }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22, fontWeight: 900, color: '#006B3A',
                  }}>
                    <CountUp to={val} suffix={suffix} />
                  </div>
                  <div style={{ fontSize: 11, color: '#7a9585', fontWeight: 500, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          position: 'relative', maxWidth: 440,
          margin: '0 auto 40px',
          animation: 'fadeSlideUp 0.5s ease 0.35s both',
        }}>
          <Search size={15} style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: '#a0b8a9', pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Search charities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-box"
            style={{
              width: '100%', boxSizing: 'border-box',
              paddingLeft: 42, paddingRight: search ? 40 : 16,
              paddingTop: 12, paddingBottom: 12,
              border: '1.5px solid #dde8e2', borderRadius: 999,
              fontSize: 14, color: '#0d1f14', background: '#fff',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: '#f0f7f3', border: 'none', borderRadius: '50%',
              width: 22, height: 22, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#006B3A',
            }}>
              <X size={12} />
            </button>
          )}
        </div>
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))',
            gap: 20,
          }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : charities.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            animation: 'fadeIn 0.4s ease both',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#f0f7f3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'floatY 3s ease-in-out infinite',
            }}>
              <Heart size={30} color="#006B3A" opacity={0.4} />
            </div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22, fontWeight: 700, color: '#0d1f14', marginBottom: 8,
            }}>No charities found</h3>
            <p style={{ color: '#7a9585', fontSize: 14 }}>
              Try a different search term
            </p>
            {search && (
              <button onClick={() => setSearch('')} style={{
                marginTop: 16, padding: '9px 22px', borderRadius: 999,
                background: '#006B3A', color: '#fff',
                border: 'none', fontWeight: 600, fontSize: 13,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {search && (
              <p style={{
                textAlign: 'center', fontSize: 13, color: '#7a9585',
                marginBottom: 24, animation: 'fadeIn 0.3s ease both',
              }}>
                Showing <strong style={{ color: '#006B3A' }}>{charities.length}</strong> result{charities.length !== 1 ? 's' : ''} for "<strong style={{ color: '#0d1f14' }}>{search}</strong>"
              </p>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))',
              gap: 20,
            }}>
              {charities.map((c, i) => (
                <CharityCard key={c.id} c={c} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}