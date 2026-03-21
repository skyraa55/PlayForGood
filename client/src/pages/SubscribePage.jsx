import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Check, Zap, Calendar, ArrowRight, Trophy, Shield, Star, Heart, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

function useStyles() {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

      @keyframes fadeSlideUp {
        from { opacity:0; transform:translateY(24px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes spinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes floatY {
        0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)}
      }
      @keyframes shimmerSweep {
        0%   { transform:translateX(-100%); }
        100% { transform:translateX(300%); }
      }
      @keyframes pulseRing {
        0%  { box-shadow:0 0 0 0 rgba(0,107,58,0.30); }
        70% { box-shadow:0 0 0 10px rgba(0,107,58,0); }
        100%{ box-shadow:0 0 0 0 rgba(0,107,58,0); }
      }
      @keyframes gradientShift {
        0%,100%{background-position:0% 50%}
        50%    {background-position:100% 50%}
      }
      @keyframes spinBtn { to{transform:rotate(360deg)} }

      .plan-card {
        background:#fff; border:1.5px solid #e8f0eb;
        border-radius:22px; padding:28px;
        display:flex; flex-direction:column;
        position:relative; overflow:hidden;
        transition:transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
        cursor:default;
      }
      .plan-card:hover {
        transform:translateY(-6px);
        box-shadow:0 24px 56px rgba(0,107,58,0.12);
        border-color:#006B3A;
      }
      .plan-card.featured {
        border-color:#006B3A;
        box-shadow:0 16px 48px rgba(0,107,58,0.16);
        background:linear-gradient(160deg,#fff 60%,#f0f7f3 100%);
      }
      .plan-card.featured:hover {
        transform:translateY(-8px);
        box-shadow:0 28px 64px rgba(0,107,58,0.20);
      }
      .plan-card .card-shimmer {
        position:absolute; top:0; bottom:0; left:0; width:35%;
        background:linear-gradient(90deg,transparent,rgba(0,107,58,0.04),transparent);
        transform:translateX(-100%); pointer-events:none;
      }
      .plan-card:hover .card-shimmer { animation:shimmerSweep 0.7s ease forwards; }

      .feat-item {
        display:flex; align-items:flex-start; gap:10px;
        padding:8px 0;
        border-bottom:1px solid #f0f7f3;
        transition:padding-left 0.2s ease;
      }
      .feat-item:last-child { border-bottom:none; }
      .plan-card:hover .feat-item { padding-left:4px; }

      .sub-btn {
        width:100%; padding:13px 24px; border-radius:12px; border:none;
        font-weight:700; font-size:15px; cursor:pointer;
        display:flex; align-items:center; justify-content:center; gap:8px;
        font-family:'DM Sans',sans-serif;
        transition:transform 0.15s ease, box-shadow 0.15s ease;
        position:relative; overflow:hidden;
      }
      .sub-btn.primary {
        background:#006B3A; color:#fff;
        box-shadow:0 6px 22px rgba(0,107,58,0.30);
        animation:pulseRing 2.8s ease-in-out infinite 1s;
      }
      .sub-btn.primary:hover {
        transform:translateY(-2px);
        box-shadow:0 10px 32px rgba(0,107,58,0.42);
        animation:none;
      }
      .sub-btn.secondary {
        background:#f8fdf9; color:#006B3A;
        border:1.5px solid #dde8e2;
      }
      .sub-btn.secondary:hover {
        border-color:#006B3A;
        transform:translateY(-1px);
        box-shadow:0 6px 18px rgba(0,107,58,0.10);
      }
      .sub-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; animation:none; }

      .trust-pill {
        display:inline-flex; align-items:center; gap:6px;
        padding:7px 14px; border-radius:999px;
        background:#fff; border:1.5px solid #e8f0eb;
        font-size:12px; font-weight:600; color:#4a6655;
        box-shadow:0 2px 8px rgba(0,0,0,0.04);
      }
    `;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
}

export default function SubscribePage() {
  useStyles();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [loading, setLoading] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);
  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '£9.99',
      period: '/month',
      icon: Zap,
      badge: null,
      featured: false,
      desc: 'Perfect for trying out GolfGives',
      color: '#1d4ed8',
      iconBg: '#eff6ff',
      features: [
        { text: 'Monthly prize draw entry',    icon: Trophy  },
        { text: 'Score tracking (5 scores)',   icon: Target  },
        { text: 'Charity contribution',        icon: Heart   },
        { text: 'Cancel anytime',              icon: Check   },
      ],
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '£89.99',
      period: '/year',
      icon: Calendar,
      badge: 'Best Value — Save 25%',
      featured: true,
      desc: 'Most popular — best long-term value',
      color: '#006B3A',
      iconBg: '#f0f7f3',
      features: [
        { text: 'Everything in Monthly',       icon: Check   },
        { text: '25% annual discount',         icon: Star    },
        { text: 'Priority support',            icon: Shield  },
        { text: 'Bonus draw entries',          icon: Trophy  },
        { text: 'Annual highlights report',    icon: Calendar },
      ],
    },
  ];

  const handleSubscribe = async (plan) => {
    if (user?.subscription_status === 'active') {
      toast('You already have an active subscription!');
      navigate('/dashboard');
      return;
    }
    setLoading(plan);
    try {
      const res = await api.post('/subscriptions/checkout', { plan });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start checkout');
      setLoading('');
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f8fdf9', fontFamily:"'DM Sans',sans-serif" }}>
      <Navbar />
      <section style={{
        position:'relative', overflow:'hidden',
        padding:'104px 24px 60px', textAlign:'center',
        background:'linear-gradient(180deg,#fff 0%,#f8fdf9 100%)',
      }}>
        <div style={{
          position:'absolute', inset:0, zIndex:0, pointerEvents:'none',
          backgroundImage:'radial-gradient(circle, rgba(0,107,58,0.10) 1px, transparent 1px)',
          backgroundSize:'28px 28px',
          maskImage:'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage:'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
        }}/>
        <div style={{
          position:'absolute', top:'5%', left:'-80px', width:300, height:300,
          border:'1px solid rgba(0,107,58,0.07)', borderRadius:'50%',
          animation:'spinRing 38s linear infinite', zIndex:0,
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
            animation: mounted ? 'fadeSlideUp 0.5s ease both' : 'none',
          }}>
            <Trophy size={12} fill="#b45309"/> Choose Your Plan
          </div>

          <h1 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:'clamp(34px,5vw,58px)', fontWeight:900,
            color:'#0d1f14', lineHeight:1.1,
            marginBottom:18, letterSpacing:-1,
            animation: mounted ? 'fadeSlideUp 0.5s ease 0.1s both' : 'none',
          }}>
            Play with Purpose.<br/>
            <span style={{
              background:'linear-gradient(135deg,#006B3A 0%,#00994f 50%,#00c060 100%)',
              backgroundSize:'200% 200%',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              animation:'gradientShift 4s ease infinite',
            }}>Win Big. Give More.</span>
          </h1>

          <p style={{
            color:'#4a6655', fontSize:16, lineHeight:1.75,
            maxWidth:500, margin:'0 auto',
            animation: mounted ? 'fadeSlideUp 0.5s ease 0.2s both' : 'none',
          }}>
            Every subscription enters you into monthly prize draws and drives real charitable impact.
          </p>
        </div>
      </section>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 24px 80px' }}>
        {user?.subscription_status === 'active' && (
          <div style={{
            marginBottom:28, padding:'16px 20px',
            background:'linear-gradient(135deg,#f0f7f3,#e8f5ef)',
            border:'1.5px solid #a7f3d0', borderRadius:16,
            display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:12,
            animation:'fadeSlideUp 0.4s ease both',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width:36, height:36, borderRadius:10,
                background:'#006B3A',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Check size={16} color="#fff"/>
              </div>
              <p style={{ fontWeight:700, fontSize:14, color:'#006B3A' }}>You already have an active subscription!</p>
            </div>
            <Link to="/dashboard" style={{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'8px 16px', borderRadius:10,
              background:'#006B3A', color:'#fff',
              fontSize:13, fontWeight:600, textDecoration:'none',
            }}>
              Go to Dashboard <ArrowRight size={13}/>
            </Link>
          </div>
        )}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',
          gap:20, marginBottom:32,
        }}>
          {plans.map(({ id, name, price, period, icon:Icon, badge, featured, desc, color, iconBg, features }, pi) => (
            <div
              key={id}
              className={`plan-card ${featured ? 'featured' : ''}`}
              style={{ animation: mounted ? `fadeSlideUp 0.5s ease ${0.25 + pi*0.1}s both` : 'none' }}
            >
              <div className="card-shimmer"/>
              {badge && (
                <div style={{
                  position:'absolute', top:-1, left:'50%', transform:'translateX(-50%)',
                  display:'inline-flex', alignItems:'center', gap:5,
                  padding:'5px 16px', borderRadius:'0 0 12px 12px',
                  background:'linear-gradient(135deg,#006B3A,#00874a)',
                  color:'#fff', fontSize:11, fontWeight:800,
                  letterSpacing:0.3, boxShadow:'0 4px 14px rgba(0,107,58,0.28)',
                  whiteSpace:'nowrap',
                }}>
                  <Star size={10} fill="#fff" color="#fff"/> {badge}
                </div>
              )}
              <div style={{ marginTop: badge ? 18 : 0, marginBottom:22 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <div style={{
                    width:46, height:46, borderRadius:14,
                    background: featured ? '#006B3A' : iconBg,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow: featured ? '0 6px 18px rgba(0,107,58,0.28)' : 'none',
                    animation: featured ? 'floatY 4s ease-in-out infinite' : 'none',
                  }}>
                    <Icon size={20} color={featured ? '#fff' : color}/>
                  </div>
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, color:'#7a9585', letterSpacing:1, textTransform:'uppercase', marginBottom:2 }}>
                      {name}
                    </p>
                    <p style={{ fontSize:11.5, color:'#a0b8a9' }}>{desc}</p>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:4 }}>
                  <span style={{
                    fontFamily:"'Playfair Display',serif",
                    fontSize:44, fontWeight:900, lineHeight:1,
                    color: featured ? '#006B3A' : '#0d1f14',
                  }}>{price}</span>
                  <span style={{ fontSize:14, color:'#7a9585', fontWeight:500, paddingBottom:6 }}>{period}</span>
                </div>
                <div style={{
                  height:2, borderRadius:2, marginTop:18,
                  background: featured
                    ? 'linear-gradient(90deg,#006B3A,#00994f,transparent)'
                    : 'linear-gradient(90deg,#e8f0eb,transparent)',
                }}/>
              </div>
              <div style={{ flex:1, marginBottom:24 }}>
                {features.map(({ text, icon:FIcon }) => (
                  <div key={text} className="feat-item">
                    <div style={{
                      width:26, height:26, borderRadius:8, flexShrink:0,
                      background: featured ? '#f0f7f3' : '#f8fdf9',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <FIcon size={13} color="#006B3A"/>
                    </div>
                    <span style={{ fontSize:13.5, color:'#2d4a38', fontWeight:500, lineHeight:1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSubscribe(id)}
                disabled={!!loading || user?.subscription_status === 'active'}
                className={`sub-btn ${featured ? 'primary' : 'secondary'}`}
              >
                {featured && !loading && (
                  <span style={{
                    position:'absolute', inset:0, overflow:'hidden', borderRadius:12, pointerEvents:'none',
                  }}>
                    <span style={{
                      position:'absolute', top:0, bottom:0, width:'40%',
                      background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',
                      animation:'shimmerSweep 3s ease-in-out infinite',
                    }}/>
                  </span>
                )}
                {loading === id ? (
                  <span style={{
                    width:18, height:18,
                    border:`2px solid ${featured ? 'rgba(255,255,255,0.3)' : 'rgba(0,107,58,0.3)'}`,
                    borderTopColor: featured ? '#fff' : '#006B3A',
                    borderRadius:'50%', animation:'spinBtn 0.7s linear infinite',
                    display:'inline-block',
                  }}/>
                ) : (
                  <>
                    {user?.subscription_status === 'active' ? 'Already Active' : `Get ${name} Plan`}
                    <ArrowRight size={15}/>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'center',
          gap:12, flexWrap:'wrap',
          animation: mounted ? 'fadeSlideUp 0.5s ease 0.45s both' : 'none',
        }}>
          <div className="trust-pill">
            <Shield size={13} color="#006B3A"/> Secure Stripe payments
          </div>
          <div className="trust-pill">
            <Check size={13} color="#006B3A"/> Cancel anytime
          </div>
          <div className="trust-pill">
            <Heart size={13} color="#be185d" fill="rgba(190,24,93,0.2)"/> Charity-first platform
          </div>
          <div className="trust-pill">
            <Star size={13} color="#b45309" fill="rgba(180,83,9,0.2)"/> Trusted by 5,000+ golfers
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}