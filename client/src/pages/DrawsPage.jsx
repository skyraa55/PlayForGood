import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Calendar, ChevronRight, Star, Zap, RotateCcw } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../lib/api';

/* ── inject styles ── */
function useStyles() {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

      @keyframes fadeSlideUp {
        from { opacity:0; transform:translateY(22px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes floatY {
        0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)}
      }
      @keyframes ballDrop {
        from { opacity:0; transform:translateY(-30px) scale(0.5); }
        to   { opacity:1; transform:translateY(0) scale(1); }
      }
      @keyframes ballGlow {
        0%,100% { box-shadow: 0 6px 20px rgba(0,107,58,0.25); }
        50%      { box-shadow: 0 8px 32px rgba(0,107,58,0.50); }
      }
      @keyframes shimmerSweep {
        0%   { transform:translateX(-100%); }
        100% { transform:translateX(300%); }
      }
      @keyframes rolloverPulse {
        0%,100% { box-shadow:0 0 0 0 rgba(180,83,9,0.25); }
        50%      { box-shadow:0 0 0 8px rgba(180,83,9,0); }
      }
      @keyframes skeletonPulse {
        0%,100%{opacity:0.45} 50%{opacity:0.9}
      }
      @keyframes counterUp {
        from { opacity:0; transform:translateY(8px); }
        to   { opacity:1; transform:translateY(0); }
      }

      .draw-list-btn {
        width:100%; text-align:left;
        background:#fff; border:1.5px solid #e8f0eb;
        border-radius:14px; padding:14px 16px;
        cursor:pointer; transition:all 0.22s ease;
        font-family:"DM Sans",sans-serif;
        position:relative; overflow:hidden;
      }
      .draw-list-btn:hover {
        border-color:#006B3A;
        box-shadow:0 6px 20px rgba(0,107,58,0.09);
        transform:translateX(3px);
      }
      .draw-list-btn.active {
        background:linear-gradient(135deg,#f0f7f3,#e8f5ef);
        border-color:#006B3A;
        box-shadow:0 6px 20px rgba(0,107,58,0.12);
      }
      .draw-list-btn .btn-shimmer {
        position:absolute; inset:0; width:35%;
        background:linear-gradient(90deg,transparent,rgba(0,107,58,0.05),transparent);
        transform:translateX(-100%);
      }
      .draw-list-btn:hover .btn-shimmer {
        animation: shimmerSweep 0.6s ease forwards;
      }

      .prize-tile {
        border-radius:14px; padding:16px 12px; text-align:center;
        transition:transform 0.2s ease, box-shadow 0.2s ease;
      }
      .prize-tile:hover {
        transform:translateY(-3px);
        box-shadow:0 10px 28px rgba(0,0,0,0.08);
      }

      .step-card {
        border-radius:16px; padding:20px 18px;
        transition:transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
      }
      .step-card:hover {
        transform:translateY(-4px);
        box-shadow:0 14px 36px rgba(0,107,58,0.11);
        border-color:#006B3A !important;
      }

      .skeleton { animation: skeletonPulse 1.4s ease-in-out infinite; }
    `;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
}

/* ── match badge ── */
function MatchBadge({ type }) {
  const map = {
    five_match:  { label: '5 Match', icon: '🏆', bg:'#fffbeb', border:'#fde68a', color:'#b45309' },
    four_match:  { label: '4 Match', icon: '⭐', bg:'#eff6ff', border:'#bfdbfe', color:'#1d4ed8' },
    three_match: { label: '3 Match', icon: '✓',  bg:'#f0f7f3', border:'#a7f3d0', color:'#006B3A' },
  };
  const m = map[type] || { label: type, icon:'·', bg:'#f3f4f6', border:'#e5e7eb', color:'#6b7280' };
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      padding:'3px 10px', borderRadius:999,
      background:m.bg, border:`1px solid ${m.border}`, color:m.color,
      fontSize:11, fontWeight:700,
    }}>
      {m.icon} {m.label}
    </span>
  );
}

/* ── animated draw ball ── */
function DrawBall({ n, delay = 0 }) {
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg,#006B3A 0%,#00994f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: 20,
      fontFamily: "'Playfair Display', serif",
      boxShadow: '0 6px 20px rgba(0,107,58,0.30)',
      animation: `ballDrop 0.45s cubic-bezier(.34,1.56,.64,1) ${delay}s both, ballGlow 2.5s ease-in-out ${delay + 0.5}s infinite`,
      position: 'relative',
    }}>
      {/* shine dot */}
      <div style={{
        position:'absolute', top:9, left:13,
        width:8, height:8, borderRadius:'50%',
        background:'rgba(255,255,255,0.35)',
      }}/>
      {n}
    </div>
  );
}

/* ── prize tile ── */
function PrizeTile({ label, amount, accent, icon }) {
  return (
    <div className="prize-tile" style={{
      background: accent.bg,
      border: `1.5px solid ${accent.border}`,
    }}>
      <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 20, fontWeight: 900, color: accent.color,
        lineHeight: 1,
      }}>
        £{((amount || 0) / 100).toFixed(2)}
      </div>
      <div style={{ fontSize: 11, color: accent.color, fontWeight: 600, marginTop: 4, opacity: 0.7 }}>{label}</div>
    </div>
  );
}

/* ── skeleton draw detail ── */
function SkeletonDetail() {
  return (
    <div className="skeleton" style={{ background:'#fff', border:'1.5px solid #e8f0eb', borderRadius:20, padding:28 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <div style={{ height:22, width:180, background:'#f0f0ee', borderRadius:6, marginBottom:8 }}/>
          <div style={{ height:14, width:110, background:'#f0f0ee', borderRadius:6 }}/>
        </div>
        <div style={{ height:32, width:90, background:'#f0f0ee', borderRadius:8 }}/>
      </div>
      <div style={{ display:'flex', gap:12, marginBottom:28 }}>
        {[...Array(5)].map((_,i) => <div key={i} style={{ width:56, height:56, borderRadius:'50%', background:'#f0f0ee' }}/>)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
        {[...Array(3)].map((_,i) => <div key={i} style={{ height:76, background:'#f0f0ee', borderRadius:14 }}/>)}
      </div>
    </div>
  );
}

/* ── main page ── */
export default function DrawsPage() {
  useStyles();
  const [draws, setDraws]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [prevId, setPrevId]   = useState(null);

  useEffect(() => {
    api.get('/draws')
      .then(r => {
        const published = r.data.filter(d => d.status === 'published');
        setDraws(published);
        if (published.length > 0) setSelected(published[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (d) => {
    setPrevId(selected?.id);
    setSelected(d);
  };

  const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div style={{ minHeight:'100vh', background:'#f8fdf9', fontFamily:"'DM Sans',sans-serif" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        position:'relative', overflow:'hidden',
        padding:'100px 24px 56px', textAlign:'center',
        background:'linear-gradient(180deg,#fff 0%,#f8fdf9 100%)',
      }}>
        {/* dot grid */}
        <div style={{
          position:'absolute', inset:0, zIndex:0,
          backgroundImage:'radial-gradient(circle, rgba(0,107,58,0.10) 1px, transparent 1px)',
          backgroundSize:'28px 28px',
          maskImage:'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage:'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
          pointerEvents:'none',
        }}/>
        <div style={{
          position:'absolute', top:'5%', left:'-80px', width:300, height:300,
          border:'1px solid rgba(0,107,58,0.07)', borderRadius:'50%',
          animation:'spin-slow 35s linear infinite', zIndex:0,
        }}/>
        <div style={{
          position:'absolute', bottom:'-40px', right:'-60px', width:240, height:240,
          border:'1px solid rgba(0,107,58,0.05)', borderRadius:'50%', zIndex:0,
        }}/>

        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:7,
            padding:'6px 16px', borderRadius:999,
            background:'#fffbeb', border:'1px solid #fde68a',
            color:'#b45309', fontSize:12, fontWeight:700,
            marginBottom:20, letterSpacing:0.5,
            animation:'fadeSlideUp 0.5s ease both',
          }}>
            <Trophy size={12} fill="#b45309" /> Monthly Draws
          </div>

          <h1 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:'clamp(34px,5vw,58px)', fontWeight:900,
            color:'#0d1f14', lineHeight:1.1,
            marginBottom:18, letterSpacing:-1,
            animation:'fadeSlideUp 0.5s ease 0.1s both',
          }}>
            Prize Draw<br/>
            <span style={{
              background:'linear-gradient(135deg,#006B3A,#00994f,#00c060)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>Results</span>
          </h1>

          <p style={{
            color:'#4a6655', fontSize:16, lineHeight:1.75,
            maxWidth:480, margin:'0 auto',
            animation:'fadeSlideUp 0.5s ease 0.2s both',
          }}>
            Five numbers drawn monthly. Match your Stableford scores and win.
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px 80px' }}>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
            <div style={{
              width:36, height:36, borderRadius:'50%',
              border:'3px solid #e8f0eb', borderTopColor:'#006B3A',
              animation:'spin-slow 0.7s linear infinite',
            }}/>
          </div>

        ) : draws.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 24px', animation:'fadeIn 0.4s ease both' }}>
            <div style={{
              width:72, height:72, borderRadius:'50%', background:'#f0f7f3',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 20px', animation:'floatY 3s ease-in-out infinite',
            }}>
              <Trophy size={30} color="#006B3A" opacity={0.4}/>
            </div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:'#0d1f14', marginBottom:8 }}>
              No draws yet
            </h3>
            <p style={{ color:'#7a9585', fontSize:14 }}>Check back soon — the first draw is coming!</p>
          </div>

        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:24, alignItems:'start' }}>

            {/* ── DRAW LIST ── */}
            <div style={{ animation:'fadeSlideUp 0.5s ease 0.25s both' }}>
              <p style={{
                fontSize:11, fontWeight:700, color:'#006B3A',
                letterSpacing:1.5, textTransform:'uppercase',
                marginBottom:14,
              }}>All Draws</p>

              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {draws.map((d, i) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect(d)}
                    className={`draw-list-btn ${selected?.id === d.id ? 'active' : ''}`}
                    style={{ animationDelay:`${i*0.05}s` }}
                  >
                    <div className="btn-shimmer"/>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div>
                        <p style={{
                          fontWeight:600, fontSize:14,
                          color: selected?.id === d.id ? '#006B3A' : '#0d1f14',
                          marginBottom:3,
                        }}>
                          {fmt(d.draw_date)}
                        </p>
                        <p style={{ fontSize:12, color:'#7a9585' }}>
                          £{((d.prize_pool_total || 0) / 100).toFixed(2)} pool
                        </p>
                      </div>
                      <ChevronRight size={15} style={{
                        color: selected?.id === d.id ? '#006B3A' : '#c4d4ca',
                        transition:'transform 0.2s',
                        transform: selected?.id === d.id ? 'translateX(2px)' : 'none',
                      }}/>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── SELECTED DRAW DETAIL ── */}
            {selected && (
              <div
                key={selected.id}
                style={{
                  background:'#fff', border:'1.5px solid #e8f0eb',
                  borderRadius:20, padding:28,
                  boxShadow:'0 8px 40px rgba(0,107,58,0.07)',
                  animation:'fadeSlideUp 0.4s ease both',
                }}
              >
                {/* header row */}
                <div style={{
                  display:'flex', alignItems:'flex-start',
                  justifyContent:'space-between', flexWrap:'wrap',
                  gap:12, marginBottom:28,
                  paddingBottom:22,
                  borderBottom:'1px solid #f0f7f3',
                }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <div style={{
                        width:36, height:36, borderRadius:10,
                        background:'linear-gradient(135deg,#006B3A,#00994f)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        <Trophy size={17} color="#fff"/>
                      </div>
                      <h2 style={{
                        fontFamily:"'Playfair Display',serif",
                        fontSize:22, fontWeight:900, color:'#0d1f14',
                      }}>
                        {fmt(selected.draw_date)} Draw
                      </h2>
                    </div>
                    <p style={{ fontSize:13, color:'#7a9585' }}>
                      {selected.active_subscribers} participants entered
                    </p>
                  </div>

                  <div style={{
                    textAlign:'right', padding:'10px 18px',
                    background:'linear-gradient(135deg,#f0f7f3,#e8f5ef)',
                    border:'1px solid #c8e6d4', borderRadius:12,
                  }}>
                    <div style={{
                      fontFamily:"'Playfair Display',serif",
                      fontSize:26, fontWeight:900, color:'#006B3A', lineHeight:1,
                    }}>
                      £{((selected.prize_pool_total || 0) / 100).toFixed(2)}
                    </div>
                    <div style={{ fontSize:11, color:'#7a9585', fontWeight:600, marginTop:3 }}>Total Pool</div>
                  </div>
                </div>

                {/* drawn numbers */}
                <div style={{ marginBottom:28 }}>
                  <p style={{
                    fontSize:11, fontWeight:700, color:'#006B3A',
                    letterSpacing:1.5, textTransform:'uppercase', marginBottom:16,
                  }}>Drawn Numbers</p>
                  <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                    {selected.drawn_numbers?.map((n, i) => (
                      <DrawBall key={n} n={n} delay={i * 0.08}/>
                    ))}
                  </div>
                </div>

                {/* prize breakdown */}
                <div style={{ marginBottom: selected.jackpot_won === false ? 16 : 0 }}>
                  <p style={{
                    fontSize:11, fontWeight:700, color:'#006B3A',
                    letterSpacing:1.5, textTransform:'uppercase', marginBottom:12,
                  }}>Prize Breakdown</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                    <PrizeTile
                      label="Jackpot (5 match)"
                      amount={selected.jackpot_amount}
                      icon="🏆"
                      accent={{ bg:'linear-gradient(135deg,#fffbeb,#fef3c7)', border:'#fde68a', color:'#b45309' }}
                    />
                    <PrizeTile
                      label="4 Match"
                      amount={selected.four_match_amount}
                      icon="⭐"
                      accent={{ bg:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'#bfdbfe', color:'#1d4ed8' }}
                    />
                    <PrizeTile
                      label="3 Match"
                      amount={selected.three_match_amount}
                      icon="✓"
                      accent={{ bg:'linear-gradient(135deg,#f0f7f3,#d1fae5)', border:'#a7f3d0', color:'#006B3A' }}
                    />
                  </div>
                </div>

                {/* rollover banner */}
                {!selected.jackpot_won && (
                  <div style={{
                    marginTop:16, padding:'14px 18px',
                    background:'linear-gradient(135deg,#fffbeb,#fef9ee)',
                    border:'1.5px solid #fde68a', borderRadius:12,
                    display:'flex', alignItems:'center', gap:10,
                    animation:'rolloverPulse 2.5s ease-in-out infinite',
                  }}>
                    <RotateCcw size={16} color="#b45309"/>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:'#b45309', marginBottom:1 }}>
                        Jackpot Rolled Over!
                      </p>
                      <p style={{ fontSize:12, color:'#92400e' }}>
                        £{((selected.jackpot_rollover || 0) / 100).toFixed(2)} added to next month's prize pool
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── HOW IT WORKS ── */}
        <div style={{
          marginTop:48,
          background:'#fff', border:'1.5px solid #e8f0eb',
          borderRadius:20, padding:'28px 28px 24px',
          animation:'fadeSlideUp 0.5s ease 0.4s both',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:22 }}>
            <div style={{
              width:34, height:34, borderRadius:10,
              background:'linear-gradient(135deg,#006B3A,#00994f)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Zap size={15} color="#fff"/>
            </div>
            <h3 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:18, fontWeight:900, color:'#0d1f14',
            }}>How the Draw Works</h3>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16 }}>
            {[
              { step:'01', title:'Enter Scores', desc:'Log your last 5 Stableford scores to be entered.', icon:'🏌️' },
              { step:'02', title:'Monthly Draw', desc:'Five numbers are drawn at the end of each month.', icon:'🎲' },
              { step:'03', title:'Match & Win', desc:'Match 3, 4 or all 5 numbers to claim your prize.', icon:'🏆' },
            ].map(({ step, title, desc, icon }, i) => (
              <div key={step} className="step-card" style={{
                border:'1.5px solid #e8f0eb', background:'#f8fdf9',
                animation:`fadeSlideUp 0.5s ease ${0.5 + i*0.1}s both`,
              }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{icon}</div>
                <div style={{
                  fontFamily:"'Playfair Display',serif",
                  fontSize:32, fontWeight:900,
                  color:'#e8f0eb', lineHeight:1, marginBottom:8,
                }}>{step}</div>
                <p style={{ fontWeight:700, fontSize:14, color:'#0d1f14', marginBottom:5 }}>{title}</p>
                <p style={{ fontSize:13, color:'#7a9585', lineHeight:1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}