// import React, { useEffect, useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Trophy, Heart, Zap, Target, Award, ArrowRight, Star, ChevronDown } from 'lucide-react';
// import Navbar from '../components/layout/Navbar';
// import Footer from '../components/layout/Footer';
// import api from '../lib/api';
// import Firework from '../components/FireWork';

// function CursorOrb() {
//   const orbRef = useRef(null);
//   useEffect(() => {
//     const move = (e) => {
//       if (!orbRef.current) return;
//       orbRef.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
//     };
//     window.addEventListener('mousemove', move);
//     return () => window.removeEventListener('mousemove', move);
//   }, []);
//   return (
//     <div
//       ref={orbRef}
//       style={{
//         position: 'fixed', top: 0, left: 0,
//         width: 600, height: 600, borderRadius: '50%',
//         background: 'radial-gradient(circle, rgba(0,153,79,0.07) 0%, rgba(0,107,58,0.04) 40%, transparent 70%)',
//         pointerEvents: 'none', zIndex: 0,
//         transition: 'transform 0.6s cubic-bezier(.25,.46,.45,.94)',
//         willChange: 'transform',
//       }}
//     />
//   );
// }

// function CountUp({ end, suffix = '' }) {
//   const [count, setCount] = useState(0);
//   const ref = useRef(null);
//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (!entry.isIntersecting) return;
//       observer.disconnect();
//       const num = parseInt(end.replace(/\D/g, ''));
//       let start = 0;
//       const step = Math.ceil(num / 60);
//       const timer = setInterval(() => {
//         start += step;
//         if (start >= num) { setCount(num); clearInterval(timer); }
//         else setCount(start);
//       }, 20);
//     });
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [end]);
//   return <span ref={ref}>{end.replace(/[\d,]+/, count.toLocaleString())}{suffix}</span>;
// }

// function DrawBall({ n, delay = 0 }) {
//   return (
//     <div style={{
//       width: 56, height: 56, borderRadius: '50%',
//       background: 'linear-gradient(135deg, #006B3A 0%, #00c060 100%)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       color: '#fff', fontWeight: 800, fontSize: 19,
//       boxShadow: '0 8px 24px rgba(0,107,58,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
//       animation: `ballPop 0.6s cubic-bezier(.34,1.56,.64,1) ${delay}s both`,
//       position: 'relative',
//       overflow: 'hidden',
//     }}>
//       <div style={{
//         position: 'absolute', top: 6, left: 10,
//         width: 16, height: 8,
//         background: 'rgba(255,255,255,0.25)',
//         borderRadius: '50%',
//         transform: 'rotate(-30deg)',
//       }} />
//       {n}
//     </div>
//   );
// }

// function StepCard({ icon: Icon, title, desc, index }) {
//   const [hover, setHover] = useState(false);
//   return (
//     <div
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//       style={{
//         background: hover ? '#006B3A' : '#fff',
//         border: '1.5px solid',
//         borderColor: hover ? '#006B3A' : 'rgba(0,107,58,0.12)',
//         borderRadius: 24,
//         padding: '36px 28px',
//         position: 'relative',
//         overflow: 'hidden',
//         transition: 'transform 0.35s cubic-bezier(.34,1.4,.64,1), box-shadow 0.35s ease, background 0.35s ease, border-color 0.35s ease',
//         transform: hover ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
//         boxShadow: hover
//           ? '0 32px 64px rgba(0,107,58,0.25), 0 8px 16px rgba(0,107,58,0.15)'
//           : '0 4px 20px rgba(0,0,0,0.05)',
//         cursor: 'default',
//         animation: `fadeSlideUp 0.6s ease ${index * 0.12}s both`,
//       }}
//     >
//       {/* Step number watermark */}
//       <div style={{
//         position: 'absolute', bottom: -12, right: 12,
//         fontSize: 88, fontWeight: 900,
//         color: hover ? 'rgba(255,255,255,0.07)' : 'rgba(0,107,58,0.05)',
//         fontFamily: "'Playfair Display', Georgia, serif",
//         lineHeight: 1, userSelect: 'none',
//         transition: 'color 0.35s ease',
//       }}>0{index + 1}</div>

//       {/* Shimmer line top */}
//       <div style={{
//         position: 'absolute', top: 0, left: 0, right: 0, height: 3,
//         background: hover
//           ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
//           : 'linear-gradient(90deg, transparent, rgba(0,107,58,0.2), transparent)',
//         borderRadius: '24px 24px 0 0',
//         transition: 'background 0.35s ease',
//       }} />

//       <div style={{
//         width: 52, height: 52,
//         background: hover ? 'rgba(255,255,255,0.15)' : '#f0f9f4',
//         borderRadius: 16,
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         marginBottom: 20,
//         transition: 'background 0.35s ease',
//         border: hover ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,107,58,0.1)',
//       }}>
//         <Icon size={22} color={hover ? '#fff' : '#006B3A'} strokeWidth={1.8} />
//       </div>
//       <h3 style={{
//         fontFamily: "'Playfair Display', Georgia, serif",
//         fontSize: 19, fontWeight: 700,
//         color: hover ? '#fff' : '#0d1f14',
//         marginBottom: 8,
//         transition: 'color 0.35s ease',
//       }}>{title}</h3>
//       <p style={{
//         fontSize: 14, lineHeight: 1.7,
//         color: hover ? 'rgba(255,255,255,0.75)' : '#5a7a68',
//         transition: 'color 0.35s ease',
//       }}>{desc}</p>
//     </div>
//   );
// }

// /* ─── DECORATIVE MESH BACKGROUND ─── */
// function MeshBg({ style }) {
//   return (
//     <svg
//       style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, ...style }}
//       xmlns="http://www.w3.org/2000/svg"
//       preserveAspectRatio="xMidYMid slice"
//     >
//       <defs>
//         <radialGradient id="mg1" cx="20%" cy="30%" r="60%">
//           <stop offset="0%" stopColor="#006B3A" stopOpacity="0.06" />
//           <stop offset="100%" stopColor="transparent" stopOpacity="0" />
//         </radialGradient>
//         <radialGradient id="mg2" cx="80%" cy="70%" r="50%">
//           <stop offset="0%" stopColor="#00994f" stopOpacity="0.05" />
//           <stop offset="100%" stopColor="transparent" stopOpacity="0" />
//         </radialGradient>
//         <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
//           <circle cx="2" cy="2" r="1" fill="#006B3A" fillOpacity="0.07" />
//         </pattern>
//       </defs>
//       <rect width="100%" height="100%" fill="url(#dots)" />
//       <rect width="100%" height="100%" fill="url(#mg1)" />
//       <rect width="100%" height="100%" fill="url(#mg2)" />
//     </svg>
//   );
// }

// export default function HomePage() {
//   const [charities, setCharities] = useState([]);
//   const [latestDraw, setLatestDraw] = useState(null);
//   const [position, setPosition] = useState(null);
//   const [heroVisible, setHeroVisible] = useState(false);

//   useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cabinet+Grotesk:wght@400;500;700;800&display=swap');

//       *, *::before, *::after { box-sizing: border-box; }

//       @keyframes fadeSlideUp {
//         from { opacity:0; transform:translateY(32px); }
//         to   { opacity:1; transform:translateY(0); }
//       }
//       @keyframes fadeSlideLeft {
//         from { opacity:0; transform:translateX(32px); }
//         to   { opacity:1; transform:translateX(0); }
//       }
//       @keyframes ballPop {
//         from { opacity:0; transform:scale(0.3) rotate(-20deg); }
//         to   { opacity:1; transform:scale(1) rotate(0deg); }
//       }
//       @keyframes spin-slow {
//         from { transform:rotate(0deg); }
//         to   { transform:rotate(360deg); }
//       }
//       @keyframes floatY {
//         0%,100% { transform:translateY(0px) translateX(-50%); }
//         50%      { transform:translateY(-10px) translateX(-50%); }
//       }
//       @keyframes floatCard {
//         0%,100% { transform:translateY(0px); }
//         50%      { transform:translateY(-14px); }
//       }
//       @keyframes pulseRing {
//         0%   { box-shadow: 0 8px 28px rgba(0,107,58,0.4), 0 0 0 0 rgba(0,107,58,0.3); }
//         70%  { box-shadow: 0 8px 28px rgba(0,107,58,0.4), 0 0 0 16px rgba(0,107,58,0); }
//         100% { box-shadow: 0 8px 28px rgba(0,107,58,0.4), 0 0 0 0 rgba(0,107,58,0); }
//       }
//       @keyframes shimmerSlide {
//         0%   { background-position: -600px 0; }
//         100% { background-position: 600px 0; }
//       }
//       @keyframes gradientShift {
//         0%,100% { background-position: 0% 50%; }
//         50%      { background-position: 100% 50%; }
//       }
//       @keyframes tickerScroll {
//         0%   { transform: translateX(0); }
//         100% { transform: translateX(-50%); }
//       }
//       @keyframes orbPulse {
//         0%,100% { opacity: 0.6; transform: scale(1); }
//         50%      { opacity: 1; transform: scale(1.05); }
//       }
//       @keyframes lineGrow {
//         from { width: 0; }
//         to   { width: 48px; }
//       }

//       .stat-card:hover {
//         transform: translateY(-6px) !important;
//         box-shadow: 0 20px 48px rgba(0,107,58,0.15) !important;
//         border-color: rgba(0,107,58,0.25) !important;
//       }
//       .charity-card:hover {
//         transform: translateY(-6px) !important;
//         box-shadow: 0 20px 48px rgba(0,107,58,0.14) !important;
//         border-color: #006B3A !important;
//       }
//       .prize-row:hover {
//         transform: translateX(4px) !important;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   useEffect(() => { setTimeout(() => setHeroVisible(true), 80); }, []);

//   useEffect(() => {
//     const handleClick = (e) => { setPosition({ x: e.clientX, y: e.clientY }); };
//     window.addEventListener('click', handleClick);
//     const t = setTimeout(() => setPosition(null), 800);
//     return () => { window.removeEventListener('click', handleClick); clearTimeout(t); };
//   }, []);

//   useEffect(() => {
//     api.get('/charities?featured=true').then(r => setCharities(r.data.slice(0, 3))).catch(() => {});
//     api.get('/draws/latest').then(r => setLatestDraw(r.data)).catch(() => {});
//   }, []);

//   const steps = [
//     { icon: Zap,    title: 'Subscribe',     desc: 'Join monthly or yearly. Cancel anytime.' },
//     { icon: Target, title: 'Enter Scores',  desc: 'Log your last 5 Stableford scores.' },
//     { icon: Trophy, title: 'Win Prizes',    desc: 'Match drawn numbers to win from the pool.' },
//     { icon: Heart,  title: 'Give Back',     desc: 'A portion of your sub goes to your chosen charity.' },
//   ];

//   const tickerItems = [' Prize Draw', 'Stableford Scores', ' Charity Impact', 'Golf Community', ' Monthly Draws', ' Real Impact', 'Win Big'];

//   return (
//     <div style={{ minHeight: '100vh', background: '#fafffe', fontFamily: "'Cabinet Grotesk', 'DM Sans', sans-serif", overflowX: 'hidden' }}>
//       {position && <Firework x={position.x} y={position.y} onFinish={() => setPosition(null)} />}
//       <CursorOrb />
//       <Navbar />
//       <section style={{
//         position: 'relative',
//         padding: '120px 24px 80px',
//         textAlign: 'center',
//         overflow: 'hidden',
//         minHeight: '95vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}>
//         <MeshBg />
//         <div style={{
//           position: 'absolute', top: '5%', left: '50%', marginLeft: -400,
//           width: 800, height: 800,
//           border: '1px solid rgba(0,107,58,0.06)',
//           borderRadius: '50%', zIndex: 0,
//           animation: 'spin-slow 60s linear infinite',
//         }} />
//         <div style={{
//           position: 'absolute', top: '10%', left: '50%', marginLeft: -280,
//           width: 560, height: 560,
//           border: '1px solid rgba(0,107,58,0.09)',
//           borderRadius: '50%', zIndex: 0,
//           animation: 'spin-slow 40s linear infinite reverse',
//         }} />
//         <div style={{
//           position: 'absolute', top: '15%', left: '8%',
//           width: 180, height: 180,
//           background: 'radial-gradient(circle, rgba(0,153,79,0.12), transparent 70%)',
//           borderRadius: '50%', zIndex: 0,
//           animation: 'orbPulse 6s ease-in-out infinite',
//         }} />
//         <div style={{
//           position: 'absolute', bottom: '20%', right: '6%',
//           width: 240, height: 240,
//           background: 'radial-gradient(circle, rgba(0,107,58,0.10), transparent 70%)',
//           borderRadius: '50%', zIndex: 0,
//           animation: 'orbPulse 8s ease-in-out infinite 2s',
//         }} />

//         <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
//           <div style={{
//             display: 'inline-flex', alignItems: 'center', gap: 8,
//             padding: '8px 20px', borderRadius: 999,
//             background: 'rgba(0,107,58,0.06)',
//             border: '1px solid rgba(0,107,58,0.18)',
//             color: '#006B3A', fontSize: 13, fontWeight: 700,
//             marginBottom: 32, letterSpacing: 0.5,
//             animation: heroVisible ? 'fadeSlideUp 0.5s ease both' : 'none',
//           }}>
//             <Heart size={13} fill="#006B3A" />
//             Golf that gives back
//           </div>
//           <h1 style={{
//             fontFamily: "'Playfair Display', Georgia, serif",
//             fontSize: 'clamp(52px, 8vw, 96px)',
//             fontWeight: 900, color: '#0a1a10', lineHeight: 1.05,
//             marginBottom: 28, letterSpacing: -2,
//             animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.1s both' : 'none',
//           }}>
//             Play Golf.{' '}
//             <span style={{
//               display: 'block',
//               background: 'linear-gradient(135deg, #006B3A 0%, #00994f 45%, #00d46a 100%)',
//               backgroundSize: '200% 200%',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               animation: 'gradientShift 4s ease infinite',
//               fontStyle: 'italic',
//             }}>Win Prizes.</span>
//             Change Lives.
//           </h1>

//           <p style={{
//             color: '#4a6a58', fontSize: 19, maxWidth: 580, margin: '0 auto 44px',
//             lineHeight: 1.8, fontWeight: 400,
//             animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.2s both' : 'none',
//           }}>
//             The subscription platform where your Stableford scores enter monthly prize draws —
//             and every subscription drives real charitable impact.
//           </p>
//           <div style={{
//             display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16,
//             animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.3s both' : 'none',
//           }}>
//             <Link to="/register" style={{
//               display: 'inline-flex', alignItems: 'center', gap: 10,
//               padding: '16px 36px', borderRadius: 999,
//               background: 'linear-gradient(135deg, #006B3A 0%, #009450 100%)',
//               color: '#fff', fontWeight: 700, fontSize: 16,
//               textDecoration: 'none',
//               boxShadow: '0 8px 32px rgba(0,107,58,0.38)',
//               animation: 'pulseRing 2.5s infinite 1.5s',
//               transition: 'transform 0.2s ease, box-shadow 0.2s ease',
//             }}
//               onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,107,58,0.48)'; }}
//               onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,107,58,0.38)'; }}
//             >
//               Start Playing <ArrowRight size={17} />
//             </Link>
//             <Link to="/charities" style={{
//               display: 'inline-flex', alignItems: 'center', gap: 10,
//               padding: '16px 36px', borderRadius: 999,
//               background: '#fff', color: '#006B3A',
//               border: '2px solid rgba(0,107,58,0.2)',
//               fontWeight: 700, fontSize: 16, textDecoration: 'none',
//               boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
//               transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
//             }}
//               onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; e.currentTarget.style.borderColor = '#006B3A'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,107,58,0.15)'; }}
//               onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,107,58,0.2)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
//             >
//               Browse Charities
//             </Link>
//           </div>
//           <div style={{
//             marginTop: 72,
//             display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
//             gap: 16, maxWidth: 520,
//             marginLeft: 'auto', marginRight: 'auto',
//             animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.45s both' : 'none',
//           }}>
//             {[
//               { val: '£50K+', label: 'Prize Pool'},
//               { val: '120+',  label: 'Charities'},
//               { val: '5K+',   label: 'Players'},
//             ].map(({ val, label, icon }) => (
//               <div key={label} className="stat-card" style={{
//                 padding: '22px 14px',
//                 background: '#fff',
//                 border: '1.5px solid rgba(0,107,58,0.1)',
//                 borderRadius: 18,
//                 boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
//                 transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
//                 cursor: 'default',
//               }}>
//                 <div style={{
//                   fontFamily: "'Playfair Display', serif",
//                   fontSize: 28, fontWeight: 900, color: '#006B3A', lineHeight: 1,
//                 }}>
//                   <CountUp end={val} />
//                 </div>
//                 <div style={{ fontSize: 12, color: '#7a9585', marginTop: 4, fontWeight: 600, letterSpacing: 0.3 }}>{label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div style={{
//           position: 'absolute', bottom: 24, left: '50%',
//           animation: 'floatY 2.5s ease-in-out infinite',
//           color: '#9ab8a8',
//         }}>
//           <ChevronDown size={24} />
//         </div>
//       </section>
//       <div style={{
//         background: '#006B3A',
//         padding: '14px 0',
//         overflow: 'hidden',
//         position: 'relative',
//       }}>
//         <div style={{
//           display: 'flex',
//           width: 'max-content',
//           animation: 'tickerScroll 20s linear infinite',
//         }}>
//           {[...tickerItems, ...tickerItems].map((item, i) => (
//             <span key={i} style={{
//               color: 'rgba(255,255,255,0.9)',
//               fontSize: 13, fontWeight: 700,
//               letterSpacing: 0.8,
//               padding: '0 32px',
//               whiteSpace: 'nowrap',
//             }}>{item}</span>
//           ))}
//         </div>
//       </div>
//       <section style={{ padding: '110px 24px', background: '#f5fcf7', position: 'relative', overflow: 'hidden' }}>
//         <MeshBg />
//         <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
//           <div style={{ textAlign: 'center', marginBottom: 64 }}>
//             <p style={{
//               color: '#006B3A', fontSize: 12, fontWeight: 800,
//               letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12,
//             }}>
//               Simple Process
//             </p>
//             <h2 style={{
//               fontFamily: "'Playfair Display', serif",
//               fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 900,
//               color: '#0a1a10', lineHeight: 1.15, marginBottom: 0,
//             }}>
//               Four steps to play,<br />
//               <em style={{ color: '#006B3A' }}>win &amp; give</em>
//             </h2>
//             <div style={{
//               width: 48, height: 3,
//               background: 'linear-gradient(90deg, #006B3A, #00c060)',
//               borderRadius: 2, margin: '20px auto 0',
//               animation: 'lineGrow 0.8s ease 0.5s both',
//             }} />
//           </div>

//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
//             {steps.map((s, i) => <StepCard key={s.title} {...s} index={i} />)}
//           </div>
//         </div>
//       </section>
//       <section style={{ padding: '110px 24px', background: '#fafffe', position: 'relative', overflow: 'hidden' }}>
//         <MeshBg />
//         <div style={{
//           maxWidth: 1120, margin: '0 auto',
//           display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
//           gap: 64, alignItems: 'center', position: 'relative', zIndex: 1,
//         }}>
//           <div>
//             <div style={{
//               display: 'inline-flex', alignItems: 'center', gap: 7,
//               padding: '6px 16px', borderRadius: 999,
//               background: '#fffbeb', border: '1.5px solid #fde68a',
//               color: '#b45309', fontSize: 12, fontWeight: 700,
//               marginBottom: 20, letterSpacing: 0.5,
//             }}>
//               <Award size={12} /> Monthly Prize Draw
//             </div>
//             <h2 style={{
//               fontFamily: "'Playfair Display', serif",
//               fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 900,
//               color: '#0a1a10', marginBottom: 12, lineHeight: 1.1,
//             }}>Win Big.<br /><em style={{ color: '#006B3A' }}>Give More.</em></h2>
//             <p style={{ color: '#4a6a58', lineHeight: 1.8, marginBottom: 36, fontSize: 16 }}>
//               Every month, five numbers are drawn from the Stableford range. Match more to win more.
//             </p>

//             {[
//               { label: '5 Numbers Matched', pct: '40%', color: '#b45309', bg: '#fffbeb', border: '#fde68a', bar: '#f59e0b' },
//               { label: '4 Numbers Matched', pct: '35%', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', bar: '#3b82f6' },
//               { label: '3 Numbers Matched', pct: '25%', color: '#006B3A', bg: '#f0f9f4', border: '#a7f3d0', bar: '#006B3A' },
//             ].map(({ label, pct, color, bg, border, bar }, i) => (
//               <div key={label} className="prize-row" style={{
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                 padding: '18px 22px', borderRadius: 16,
//                 background: bg, border: `1.5px solid ${border}`,
//                 marginBottom: 12,
//                 transition: 'transform 0.25s ease',
//                 position: 'relative',
//                 overflow: 'hidden',
//               }}>
//                 <div style={{
//                   position: 'absolute', left: 0, top: 0, bottom: 0,
//                   width: pct, background: `${bar}18`,
//                   borderRadius: '16px 0 0 16px',
//                   transition: 'width 1s ease',
//                 }} />
//                 <span style={{ color, fontWeight: 700, fontSize: 15, position: 'relative', zIndex: 1 }}>{label}</span>
//                 <span style={{
//                   color, fontWeight: 900, fontSize: 26,
//                   fontFamily: "'Playfair Display', serif",
//                   position: 'relative', zIndex: 1,
//                 }}>{pct}</span>
//               </div>
//             ))}
//           </div>
//           <div style={{
//             background: '#fff',
//             border: '1.5px solid rgba(0,107,58,0.12)',
//             borderRadius: 28,
//             overflow: 'hidden',
//             boxShadow: '0 24px 80px rgba(0,107,58,0.1), 0 8px 24px rgba(0,0,0,0.05)',
//             animation: 'floatCard 6s ease-in-out infinite',
//           }}>
//             <div style={{
//               background: 'linear-gradient(135deg, #004d28 0%, #006B3A 50%, #009450 100%)',
//               padding: '32px 28px',
//               display: 'flex', alignItems: 'center', gap: 18,
//               position: 'relative', overflow: 'hidden',
//             }}>
//               <div style={{
//                 position: 'absolute', inset: 0,
//                 background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
//                 backgroundSize: '400px 100%',
//                 animation: 'shimmerSlide 3s ease infinite',
//               }} />
//               <div style={{
//                 width: 52, height: 52,
//                 background: 'rgba(255,255,255,0.15)',
//                 borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 position: 'relative',
//               }}>
//                 <Trophy size={24} color="#fff" />
//               </div>
//               <div style={{ position: 'relative' }}>
//                 <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: "'Playfair Display', serif", marginBottom: 2 }}>
//                   Latest Draw
//                 </p>
//                 <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
//                   {latestDraw
//                     ? new Date(latestDraw.draw_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
//                     : 'Coming soon'}
//                 </p>
//               </div>
//             </div>
//             <div style={{ padding: '40px 28px', textAlign: 'center' }}>
//               {latestDraw ? (
//                 <>
//                   <p style={{ color: '#7a9585', fontSize: 13, marginBottom: 24, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
//                     Winning Numbers
//                   </p>
//                   <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
//                     {latestDraw.drawn_numbers?.map((n, i) => <DrawBall key={n} n={n} delay={i * 0.1} />)}
//                   </div>
//                 </>
//               ) : (
//                 <div style={{ padding: '28px 0' }}>
//                   <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
//                   <p style={{ color: '#0d1f14', fontWeight: 700, fontSize: 17 }}>Next draw coming soon</p>
//                   <p style={{ color: '#9ab8a8', fontSize: 14, marginTop: 6 }}>Subscribe to be entered automatically</p>
//                 </div>
//               )}
//             </div>
//             <div style={{
//               borderTop: '1.5px solid rgba(0,107,58,0.08)',
//               padding: '20px 28px',
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               background: '#fafffe',
//             }}>
//               <span style={{ color: '#5a7a68', fontSize: 14, fontWeight: 500 }}>Want to be next?</span>
//               <Link to="/register" style={{
//                 display: 'inline-flex', alignItems: 'center', gap: 6,
//                 padding: '10px 20px', borderRadius: 999,
//                 background: '#006B3A', color: '#fff',
//                 fontWeight: 700, fontSize: 14, textDecoration: 'none',
//                 transition: 'transform 0.2s ease, box-shadow 0.2s ease',
//               }}
//                 onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,107,58,0.4)'; }}
//                 onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
//               >
//                 Join <ArrowRight size={14} />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//       {charities.length > 0 && (
//         <section style={{ padding: '110px 24px', background: '#f5fcf7', position: 'relative', overflow: 'hidden' }}>
//           <MeshBg />
//           <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 48 }}>
//               <div>
//                 <p style={{ color: '#006B3A', fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>
//                   Making a Difference
//                 </p>
//                 <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: '#0a1a10', lineHeight: 1.1 }}>
//                   Featured <em>Charities</em>
//                 </h2>
//               </div>
//               <Link to="/charities" style={{
//                 color: '#006B3A', fontWeight: 700, fontSize: 14, textDecoration: 'none',
//                 display: 'flex', alignItems: 'center', gap: 6,
//                 padding: '10px 20px', borderRadius: 999,
//                 border: '1.5px solid rgba(0,107,58,0.2)',
//                 transition: 'background 0.2s ease, border-color 0.2s ease',
//               }}
//                 onMouseEnter={e => { e.currentTarget.style.background = '#006B3A'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#006B3A'; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#006B3A'; e.currentTarget.style.borderColor = 'rgba(0,107,58,0.2)'; }}
//               >
//                 View all <ArrowRight size={14} />
//               </Link>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22 }}>
//               {charities.map((c, i) => (
//                 <div key={c.id} className="charity-card"
//                   style={{
//                     background: '#fff',
//                     border: '1.5px solid rgba(0,107,58,0.1)',
//                     borderRadius: 22, padding: '32px 28px',
//                     transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
//                     animation: `fadeSlideUp 0.6s ease ${i * 0.12}s both`,
//                     position: 'relative', overflow: 'hidden',
//                   }}
//                 >
//                   <div style={{
//                     position: 'absolute', top: 0, left: 0, right: 0, height: 3,
//                     background: 'linear-gradient(90deg, #006B3A, #00c060)',
//                     borderRadius: '22px 22px 0 0',
//                   }} />
//                   <div style={{
//                     width: 48, height: 48, borderRadius: 14,
//                     background: '#f0f9f4',
//                     border: '1.5px solid rgba(0,107,58,0.12)',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     marginBottom: 20,
//                   }}>
//                     <Heart size={20} color="#006B3A" fill="rgba(0,107,58,0.1)" />
//                   </div>
//                   <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#0a1a10', marginBottom: 10 }}>
//                     {c.name}
//                   </h3>
//                   <p style={{ color: '#5a7a68', fontSize: 14, lineHeight: 1.7 }}>{c.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}
//       <section style={{
//         padding: '100px 24px 120px',
//         background: 'linear-gradient(150deg, #002d17 0%, #005530 40%, #006B3A 70%, #008a46 100%)',
//         textAlign: 'center', position: 'relative', overflow: 'hidden',
//       }}>
//         <div style={{
//           position: 'absolute', top: -120, right: -120, width: 440, height: 440,
//           border: '1px solid rgba(255,255,255,0.05)',
//           borderRadius: '50%', animation: 'spin-slow 30s linear infinite reverse',
//         }} />
//         <div style={{
//           position: 'absolute', top: -60, right: -60, width: 280, height: 280,
//           border: '1px solid rgba(255,255,255,0.08)',
//           borderRadius: '50%', animation: 'spin-slow 20s linear infinite',
//         }} />
//         <div style={{
//           position: 'absolute', bottom: -100, left: -80, width: 360, height: 360,
//           border: '1px solid rgba(255,255,255,0.05)',
//           borderRadius: '50%',
//         }} />
//         <div style={{
//           position: 'absolute', inset: 0,
//           background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)',
//           backgroundSize: '600px 100%',
//           animation: 'shimmerSlide 4s ease infinite',
//         }} />

//         <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
//           <div style={{
//             display: 'inline-flex', alignItems: 'center', gap: 7,
//             padding: '7px 18px', borderRadius: 999,
//             background: 'rgba(255,255,255,0.1)',
//             border: '1px solid rgba(255,255,255,0.18)',
//             color: '#a3e6bc', fontSize: 12, fontWeight: 700,
//             marginBottom: 28, letterSpacing: 1.5, textTransform: 'uppercase',
//           }}>
//             <Star size={11} fill="currentColor" /> Join the Community
//           </div>
//           <h2 style={{
//             fontFamily: "'Playfair Display', serif",
//             fontSize: 'clamp(32px, 5.5vw, 60px)', fontWeight: 900,
//             color: '#fff', lineHeight: 1.1, marginBottom: 18,
//           }}>
//             Ready to play<br />
//             <em>with purpose?</em>
//           </h2>
//           <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, marginBottom: 44, lineHeight: 1.8 }}>
//             Join thousands of golfers making a real difference — one round at a time.
//           </p>
//           <Link to="/register" style={{
//             display: 'inline-flex', alignItems: 'center', gap: 10,
//             padding: '18px 48px', borderRadius: 999,
//             background: '#fff', color: '#006B3A',
//             fontWeight: 800, fontSize: 17, textDecoration: 'none',
//             boxShadow: '0 16px 56px rgba(0,0,0,0.25)',
//             transition: 'transform 0.25s ease, box-shadow 0.25s ease',
//           }}
//             onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06) translateY(-3px)'; e.currentTarget.style.boxShadow = '0 24px 64px rgba(0,0,0,0.32)'; }}
//             onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 16px 56px rgba(0,0,0,0.25)'; }}
//           >
//             Join Now <ArrowRight size={18} />
//           </Link>
//           <div style={{
//             marginTop: 48, display: 'flex', justifyContent: 'center',
//             gap: 32, flexWrap: 'wrap',
//           }}>
//             {['No hidden fees', 'Cancel anytime', '120+ charities'].map(t => (
//               <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 500 }}>
//                 <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
//                 {t}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }








import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Heart, Zap, Target, Award, ArrowRight, Star, ChevronDown } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../lib/api';
import Firework from '../components/FireWork';

function CursorOrb() {
  const orbRef = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (!orbRef.current) return;
      orbRef.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div
      ref={orbRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,153,79,0.07) 0%, rgba(0,107,58,0.04) 40%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
        transition: 'transform 0.6s cubic-bezier(.25,.46,.45,.94)',
        willChange: 'transform',
      }}
    />
  );
}

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

function DrawBall({ n, delay = 0 }) {
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%',
      background: 'linear-gradient(135deg, #006B3A 0%, #00c060 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: 19,
      boxShadow: '0 8px 24px rgba(0,107,58,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
      animation: `ballPop 0.6s cubic-bezier(.34,1.56,.64,1) ${delay}s both`,
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 6, left: 10,
        width: 16, height: 8,
        background: 'rgba(255,255,255,0.25)',
        borderRadius: '50%', transform: 'rotate(-30deg)',
      }} />
      {n}
    </div>
  );
}

function StepCard({ icon: Icon, title, desc, index }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#006B3A' : '#fff',
        border: '1.5px solid',
        borderColor: hover ? '#006B3A' : 'rgba(0,107,58,0.12)',
        borderRadius: 24, padding: '36px 28px',
        position: 'relative', overflow: 'hidden',
        transition: 'transform 0.35s cubic-bezier(.34,1.4,.64,1), box-shadow 0.35s ease, background 0.35s ease, border-color 0.35s ease',
        transform: hover ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hover
          ? '0 32px 64px rgba(0,107,58,0.25), 0 8px 16px rgba(0,107,58,0.15)'
          : '0 4px 20px rgba(0,0,0,0.05)',
        cursor: 'default',
        animation: `fadeSlideUp 0.6s ease ${index * 0.12}s both`,
      }}
    >
      <div style={{
        position: 'absolute', bottom: -12, right: 12,
        fontSize: 88, fontWeight: 900,
        color: hover ? 'rgba(255,255,255,0.07)' : 'rgba(0,107,58,0.05)',
        fontFamily: "'Playfair Display', Georgia, serif",
        lineHeight: 1, userSelect: 'none', transition: 'color 0.35s ease',
      }}>0{index + 1}</div>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: hover
          ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(0,107,58,0.2), transparent)',
        borderRadius: '24px 24px 0 0', transition: 'background 0.35s ease',
      }} />
      <div style={{
        width: 52, height: 52,
        background: hover ? 'rgba(255,255,255,0.15)' : '#f0f9f4',
        borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20, transition: 'background 0.35s ease',
        border: hover ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,107,58,0.1)',
      }}>
        <Icon size={22} color={hover ? '#fff' : '#006B3A'} strokeWidth={1.8} />
      </div>
      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 19, fontWeight: 700,
        color: hover ? '#fff' : '#0d1f14',
        marginBottom: 8, transition: 'color 0.35s ease',
      }}>{title}</h3>
      <p style={{
        fontSize: 14, lineHeight: 1.7,
        color: hover ? 'rgba(255,255,255,0.75)' : '#5a7a68',
        transition: 'color 0.35s ease',
      }}>{desc}</p>
    </div>
  );
}

function MeshBg({ style }) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, ...style }}
      xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="mg1" cx="20%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#006B3A" stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mg2" cx="80%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#00994f" stopOpacity="0.05" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#006B3A" fillOpacity="0.07" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
      <rect width="100%" height="100%" fill="url(#mg1)" />
      <rect width="100%" height="100%" fill="url(#mg2)" />
    </svg>
  );
}

/*
  ─── RIPPLE RINGS ───
  ALL 6 circles are now filled. Fill opacity steps down by 0.025 each ring
  as you move outward — so the gradient is smooth and every ring is clearly visible.

  Center (innermost):  fill 0.13  border 0.28   ← darkest
  Ring 2:              fill 0.105 border 0.24
  Ring 3:              fill 0.08  border 0.20
  Ring 4:              fill 0.055 border 0.16
  Ring 5:              fill 0.03  border 0.13
  Ring 6 (outermost):  fill 0.015 border 0.10   ← lightest

  Sizes: 380 → 460 → 540 → 620 → 700 → 780 (80px steps)
  Animation: outermost fires first, wave appears to travel outward from center.
*/
function RippleRings() {
  const rings = [
    // outermost first so inner circles paint on top
    { size: 780, delay: '0s',    fillOpacity: 0.015, borderOpacity: 0.10, borderWidth: 1.5 },
    { size: 700, delay: '0.45s', fillOpacity: 0.030, borderOpacity: 0.13, borderWidth: 1.5 },
    { size: 620, delay: '0.9s',  fillOpacity: 0.055, borderOpacity: 0.16, borderWidth: 2   },
    { size: 540, delay: '1.35s', fillOpacity: 0.080, borderOpacity: 0.20, borderWidth: 2   },
    { size: 460, delay: '1.8s',  fillOpacity: 0.105, borderOpacity: 0.24, borderWidth: 2   },
    { size: 380, delay: '2.25s', fillOpacity: 0.130, borderOpacity: 0.28, borderWidth: 2   },
  ];

  return (
    <>
      {rings.map((ring, i) => (
        <div
          key={i}
          className={`ripple-ring ripple-ring-${i}`}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: ring.size,
            height: ring.size,
            marginLeft: -ring.size / 2,
            marginTop: -ring.size / 2,
            borderRadius: '50%',
            /* Every circle now has a fill — darkest at center, fading outward */
            background: `rgba(0,107,58,${ring.fillOpacity})`,
            border: `${ring.borderWidth}px solid rgba(0,107,58,${ring.borderOpacity})`,
            animation: `rippleExpand 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${ring.delay} infinite`,
            pointerEvents: 'none',
            zIndex: 0,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  );
}

export default function HomePage() {
  const [charities, setCharities] = useState([]);
  const [latestDraw, setLatestDraw] = useState(null);
  const [position, setPosition] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cabinet+Grotesk:wght@400;500;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; }

      @keyframes fadeSlideUp {
        from { opacity:0; transform:translateY(32px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes ballPop {
        from { opacity:0; transform:scale(0.3) rotate(-20deg); }
        to   { opacity:1; transform:scale(1) rotate(0deg); }
      }
      @keyframes spin-slow {
        from { transform:rotate(0deg); }
        to   { transform:rotate(360deg); }
      }
      @keyframes floatY {
        0%,100% { transform:translateY(0px) translateX(-50%); }
        50%      { transform:translateY(-10px) translateX(-50%); }
      }
      @keyframes floatCard {
        0%,100% { transform:translateY(0px); }
        50%      { transform:translateY(-14px); }
      }
      @keyframes pulseRing {
        0%   { box-shadow: 0 8px 28px rgba(0,107,58,0.4), 0 0 0 0 rgba(0,107,58,0.3); }
        70%  { box-shadow: 0 8px 28px rgba(0,107,58,0.4), 0 0 0 16px rgba(0,107,58,0); }
        100% { box-shadow: 0 8px 28px rgba(0,107,58,0.4), 0 0 0 0 rgba(0,107,58,0); }
      }
      @keyframes shimmerSlide {
        0%   { background-position: -600px 0; }
        100% { background-position: 600px 0; }
      }
      @keyframes gradientShift {
        0%,100% { background-position: 0% 50%; }
        50%      { background-position: 100% 50%; }
      }
      @keyframes tickerScroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes lineGrow {
        from { width: 0; }
        to   { width: 48px; }
      }
      @keyframes rippleExpand {
        0%   { transform: scale(0.90); opacity: 0; }
        10%  { opacity: 1; }
        60%  { opacity: 0.70; }
        100% { transform: scale(1.12); opacity: 0; }
      }

      .stat-card:hover {
        transform: translateY(-6px) !important;
        box-shadow: 0 20px 48px rgba(0,107,58,0.15) !important;
        border-color: rgba(0,107,58,0.25) !important;
      }
      .charity-card:hover {
        transform: translateY(-6px) !important;
        box-shadow: 0 20px 48px rgba(0,107,58,0.14) !important;
        border-color: #006B3A !important;
      }
      .prize-row:hover { transform: translateX(4px) !important; }

      /* ── RESPONSIVE RIPPLE RING SCALING ── */
      @media (max-width: 768px) {
        .ripple-ring-0 { width: 507px !important; height: 507px !important; margin-left: -253px !important; margin-top: -253px !important; }
        .ripple-ring-1 { width: 455px !important; height: 455px !important; margin-left: -227px !important; margin-top: -227px !important; }
        .ripple-ring-2 { width: 403px !important; height: 403px !important; margin-left: -201px !important; margin-top: -201px !important; }
        .ripple-ring-3 { width: 351px !important; height: 351px !important; margin-left: -175px !important; margin-top: -175px !important; }
        .ripple-ring-4 { width: 299px !important; height: 299px !important; margin-left: -149px !important; margin-top: -149px !important; }
        .ripple-ring-5 { width: 247px !important; height: 247px !important; margin-left: -123px !important; margin-top: -123px !important; }
      }
      @media (max-width: 480px) {
        .ripple-ring-0 { width: 328px !important; height: 328px !important; margin-left: -164px !important; margin-top: -164px !important; }
        .ripple-ring-1 { width: 294px !important; height: 294px !important; margin-left: -147px !important; margin-top: -147px !important; }
        .ripple-ring-2 { width: 261px !important; height: 261px !important; margin-left: -130px !important; margin-top: -130px !important; }
        .ripple-ring-3 { width: 227px !important; height: 227px !important; margin-left: -113px !important; margin-top: -113px !important; }
        .ripple-ring-4 { width: 193px !important; height: 193px !important; margin-left: -96px  !important; margin-top: -96px  !important; }
        .ripple-ring-5 { width: 160px !important; height: 160px !important; margin-left: -80px  !important; margin-top: -80px  !important; }
      }

      /* ── GENERAL RESPONSIVE ── */
      @media (max-width: 768px) {
        .hero-buttons { flex-direction: column !important; align-items: center !important; }
        .hero-buttons a { width: 100% !important; max-width: 320px !important; justify-content: center !important; }
        .prize-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .charities-grid { grid-template-columns: 1fr !important; }
        .section-header-row { flex-direction: column !important; align-items: flex-start !important; }
      }
      @media (max-width: 480px) {
        .steps-grid { grid-template-columns: 1fr !important; }
        .hero-section { padding: 100px 16px 60px !important; }
        .ticker-item { padding: 0 20px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => { setTimeout(() => setHeroVisible(true), 80); }, []);

  useEffect(() => {
    const handleClick = (e) => { setPosition({ x: e.clientX, y: e.clientY }); };
    window.addEventListener('click', handleClick);
    const t = setTimeout(() => setPosition(null), 800);
    return () => { window.removeEventListener('click', handleClick); clearTimeout(t); };
  }, []);

  useEffect(() => {
    api.get('/charities?featured=true').then(r => setCharities(r.data.slice(0, 3))).catch(() => {});
    api.get('/draws/latest').then(r => setLatestDraw(r.data)).catch(() => {});
  }, []);

  const steps = [
    { icon: Zap,    title: 'Subscribe',    desc: 'Join monthly or yearly. Cancel anytime.' },
    { icon: Target, title: 'Enter Scores', desc: 'Log your last 5 Stableford scores.' },
    { icon: Trophy, title: 'Win Prizes',   desc: 'Match drawn numbers to win from the pool.' },
    { icon: Heart,  title: 'Give Back',    desc: 'A portion of your sub goes to your chosen charity.' },
  ];

  const tickerItems = [' Prize Draw', 'Stableford Scores', ' Charity Impact', 'Golf Community', ' Monthly Draws', ' Real Impact', 'Win Big'];

  return (
    <div style={{ minHeight: '100vh', background: '#fafffe', fontFamily: "'Cabinet Grotesk', 'DM Sans', sans-serif", overflowX: 'hidden' }}>
      {position && <Firework x={position.x} y={position.y} onFinish={() => setPosition(null)} />}
      <CursorOrb />
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="hero-section"
        style={{
          position: 'relative',
          padding: '120px 24px 80px',
          textAlign: 'center',
          overflow: 'hidden',
          minHeight: '95vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse 90% 80% at 50% 48%, rgba(0,107,58,0.06) 0%, rgba(0,107,58,0.025) 45%, #fafffe 75%)',
        }}
      >
        <MeshBg />
        <RippleRings />

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 999,
            background: 'rgba(0,107,58,0.06)',
            border: '1px solid rgba(0,107,58,0.18)',
            color: '#006B3A', fontSize: 13, fontWeight: 700,
            marginBottom: 32, letterSpacing: 0.5,
            animation: heroVisible ? 'fadeSlideUp 0.5s ease both' : 'none',
          }}>
            <Heart size={13} fill="#006B3A" />
            Golf that gives back
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(40px, 8vw, 96px)',
            fontWeight: 900, color: '#0a1a10', lineHeight: 1.05,
            marginBottom: 28, letterSpacing: -2,
            animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.1s both' : 'none',
          }}>
            Play Golf.{' '}
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #006B3A 0%, #00994f 45%, #00d46a 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 4s ease infinite',
              fontStyle: 'italic',
            }}>Win Prizes.</span>
            Change Lives.
          </h1>

          <p style={{
            color: '#4a6a58', fontSize: 'clamp(15px, 2.5vw, 19px)',
            maxWidth: 580, margin: '0 auto 44px',
            lineHeight: 1.8, fontWeight: 400,
            animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.2s both' : 'none',
          }}>
            The subscription platform where your Stableford scores enter monthly prize draws —
            and every subscription drives real charitable impact.
          </p>

          <div
            className="hero-buttons"
            style={{
              display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16,
              animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.3s both' : 'none',
            }}
          >
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 36px', borderRadius: 999,
              background: 'linear-gradient(135deg, #006B3A 0%, #009450 100%)',
              color: '#fff', fontWeight: 700, fontSize: 16,
              textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(0,107,58,0.38)',
              animation: 'pulseRing 2.5s infinite 1.5s',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,107,58,0.48)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,107,58,0.38)'; }}
            >
              Start Playing <ArrowRight size={17} />
            </Link>
            <Link to="/charities" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 36px', borderRadius: 999,
              background: '#fff', color: '#006B3A',
              border: '2px solid rgba(0,107,58,0.2)',
              fontWeight: 700, fontSize: 16, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; e.currentTarget.style.borderColor = '#006B3A'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,107,58,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,107,58,0.2)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
            >
              Browse Charities
            </Link>
          </div>

          <div
            className="stat-grid"
            style={{
              marginTop: 72,
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16, maxWidth: 520,
              marginLeft: 'auto', marginRight: 'auto',
              animation: heroVisible ? 'fadeSlideUp 0.6s ease 0.45s both' : 'none',
            }}
          >
            {[
              { val: '£50K+', label: 'Prize Pool' },
              { val: '120+',  label: 'Charities' },
              { val: '5K+',   label: 'Players' },
            ].map(({ val, label }) => (
              <div key={label} className="stat-card" style={{
                padding: '22px 14px', background: '#fff',
                border: '1.5px solid rgba(0,107,58,0.1)',
                borderRadius: 18, boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                cursor: 'default',
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, color: '#006B3A', lineHeight: 1,
                }}>
                  <CountUp end={val} />
                </div>
                <div style={{ fontSize: 11, color: '#7a9585', marginTop: 4, fontWeight: 600, letterSpacing: 0.3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 24, left: '50%',
          animation: 'floatY 2.5s ease-in-out infinite', color: '#9ab8a8',
        }}>
          <ChevronDown size={24} />
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background: '#006B3A', padding: '14px 0', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'tickerScroll 20s linear infinite' }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ticker-item" style={{
              color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 700,
              letterSpacing: 0.8, padding: '0 32px', whiteSpace: 'nowrap',
            }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section style={{ padding: 'clamp(64px,8vw,110px) clamp(16px,4vw,24px)', background: '#f5fcf7', position: 'relative', overflow: 'hidden' }}>
        <MeshBg />
        <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ color: '#006B3A', fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>
              Simple Process
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px,4.5vw,52px)', fontWeight: 900,
              color: '#0a1a10', lineHeight: 1.15, marginBottom: 0,
            }}>
              Four steps to play,<br /><em style={{ color: '#006B3A' }}>win &amp; give</em>
            </h2>
            <div style={{
              width: 48, height: 3,
              background: 'linear-gradient(90deg, #006B3A, #00c060)',
              borderRadius: 2, margin: '20px auto 0',
              animation: 'lineGrow 0.8s ease 0.5s both',
            }} />
          </div>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
            {steps.map((s, i) => <StepCard key={s.title} {...s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRIZE DRAW ═══════════════ */}
      <section style={{ padding: 'clamp(64px,8vw,110px) clamp(16px,4vw,24px)', background: '#fafffe', position: 'relative', overflow: 'hidden' }}>
        <MeshBg />
        <div
          className="prize-grid"
          style={{
            maxWidth: 1120, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: 64, alignItems: 'center', position: 'relative', zIndex: 1,
          }}
        >
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '6px 16px', borderRadius: 999,
              background: '#fffbeb', border: '1.5px solid #fde68a',
              color: '#b45309', fontSize: 12, fontWeight: 700,
              marginBottom: 20, letterSpacing: 0.5,
            }}>
              <Award size={12} /> Monthly Prize Draw
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(26px,4vw,48px)', fontWeight: 900,
              color: '#0a1a10', marginBottom: 12, lineHeight: 1.1,
            }}>Win Big.<br /><em style={{ color: '#006B3A' }}>Give More.</em></h2>
            <p style={{ color: '#4a6a58', lineHeight: 1.8, marginBottom: 36, fontSize: 16 }}>
              Every month, five numbers are drawn from the Stableford range. Match more to win more.
            </p>
            {[
              { label: '5 Numbers Matched', pct: '40%', color: '#b45309', bg: '#fffbeb', border: '#fde68a', bar: '#f59e0b' },
              { label: '4 Numbers Matched', pct: '35%', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', bar: '#3b82f6' },
              { label: '3 Numbers Matched', pct: '25%', color: '#006B3A', bg: '#f0f9f4', border: '#a7f3d0', bar: '#006B3A' },
            ].map(({ label, pct, color, bg, border, bar }) => (
              <div key={label} className="prize-row" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '18px 22px', borderRadius: 16,
                background: bg, border: `1.5px solid ${border}`,
                marginBottom: 12, transition: 'transform 0.25s ease',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: pct, background: `${bar}18`, borderRadius: '16px 0 0 16px',
                }} />
                <span style={{ color, fontWeight: 700, fontSize: 'clamp(13px,2vw,15px)', position: 'relative', zIndex: 1 }}>{label}</span>
                <span style={{ color, fontWeight: 900, fontSize: 'clamp(20px,3vw,26px)', fontFamily: "'Playfair Display', serif", position: 'relative', zIndex: 1 }}>{pct}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: '#fff', border: '1.5px solid rgba(0,107,58,0.12)',
            borderRadius: 28, overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,107,58,0.1), 0 8px 24px rgba(0,0,0,0.05)',
            animation: 'floatCard 6s ease-in-out infinite',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #004d28 0%, #006B3A 50%, #009450 100%)',
              padding: '32px 28px', display: 'flex', alignItems: 'center', gap: 18,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                backgroundSize: '400px 100%', animation: 'shimmerSlide 3s ease infinite',
              }} />
              <div style={{
                width: 52, height: 52, background: 'rgba(255,255,255,0.15)',
                borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', flexShrink: 0,
              }}>
                <Trophy size={24} color="#fff" />
              </div>
              <div style={{ position: 'relative' }}>
                <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: "'Playfair Display', serif", marginBottom: 2 }}>Latest Draw</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
                  {latestDraw
                    ? new Date(latestDraw.draw_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Coming soon'}
                </p>
              </div>
            </div>
            <div style={{ padding: 'clamp(24px,4vw,40px) clamp(16px,4vw,28px)', textAlign: 'center' }}>
              {latestDraw ? (
                <>
                  <p style={{ color: '#7a9585', fontSize: 13, marginBottom: 24, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                    Winning Numbers
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {latestDraw.drawn_numbers?.map((n, i) => <DrawBall key={n} n={n} delay={i * 0.1} />)}
                  </div>
                </>
              ) : (
                <div style={{ padding: '28px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                  <p style={{ color: '#0d1f14', fontWeight: 700, fontSize: 17 }}>Next draw coming soon</p>
                  <p style={{ color: '#9ab8a8', fontSize: 14, marginTop: 6 }}>Subscribe to be entered automatically</p>
                </div>
              )}
            </div>
            <div style={{
              borderTop: '1.5px solid rgba(0,107,58,0.08)',
              padding: '20px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#fafffe', flexWrap: 'wrap', gap: 12,
            }}>
              <span style={{ color: '#5a7a68', fontSize: 14, fontWeight: 500 }}>Want to be next?</span>
              <Link to="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', borderRadius: 999,
                background: '#006B3A', color: '#fff',
                fontWeight: 700, fontSize: 14, textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,107,58,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                Join <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CHARITIES ═══════════════ */}
      {charities.length > 0 && (
        <section style={{ padding: 'clamp(64px,8vw,110px) clamp(16px,4vw,24px)', background: '#f5fcf7', position: 'relative', overflow: 'hidden' }}>
          <MeshBg />
          <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div className="section-header-row" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              flexWrap: 'wrap', gap: 16, marginBottom: 48,
            }}>
              <div>
                <p style={{ color: '#006B3A', fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>Making a Difference</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,4vw,44px)', fontWeight: 900, color: '#0a1a10', lineHeight: 1.1 }}>
                  Featured <em>Charities</em>
                </h2>
              </div>
              <Link to="/charities" style={{
                color: '#006B3A', fontWeight: 700, fontSize: 14, textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', borderRadius: 999,
                border: '1.5px solid rgba(0,107,58,0.2)',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#006B3A'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#006B3A'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#006B3A'; e.currentTarget.style.borderColor = 'rgba(0,107,58,0.2)'; }}
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="charities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 22 }}>
              {charities.map((c, i) => (
                <div key={c.id} className="charity-card" style={{
                  background: '#fff', border: '1.5px solid rgba(0,107,58,0.1)',
                  borderRadius: 22, padding: 'clamp(20px,3vw,32px) clamp(16px,3vw,28px)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  animation: `fadeSlideUp 0.6s ease ${i * 0.12}s both`,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: 'linear-gradient(90deg, #006B3A, #00c060)',
                    borderRadius: '22px 22px 0 0',
                  }} />
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: '#f0f9f4', border: '1.5px solid rgba(0,107,58,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                  }}>
                    <Heart size={20} color="#006B3A" fill="rgba(0,107,58,0.1)" />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#0a1a10', marginBottom: 10 }}>{c.name}</h3>
                  <p style={{ color: '#5a7a68', fontSize: 14, lineHeight: 1.7 }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA ═══════════════ */}
      <section style={{
        padding: 'clamp(64px,8vw,100px) clamp(16px,4vw,24px) clamp(80px,10vw,120px)',
        background: 'linear-gradient(150deg, #002d17 0%, #005530 40%, #006B3A 70%, #008a46 100%)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 440, height: 440, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%', animation: 'spin-slow 30s linear infinite reverse' }} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', animation: 'spin-slow 20s linear infinite' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -80, width: 360, height: 360, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)',
          backgroundSize: '600px 100%', animation: 'shimmerSlide 4s ease infinite',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '7px 18px', borderRadius: 999,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
            color: '#a3e6bc', fontSize: 12, fontWeight: 700,
            marginBottom: 28, letterSpacing: 1.5, textTransform: 'uppercase',
          }}>
            <Star size={11} fill="currentColor" /> Join the Community
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px,5.5vw,60px)', fontWeight: 900,
            color: '#fff', lineHeight: 1.1, marginBottom: 18,
          }}>
            Ready to play<br /><em>with purpose?</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(15px,2.5vw,18px)', marginBottom: 44, lineHeight: 1.8 }}>
            Join thousands of golfers making a real difference — one round at a time.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: 'clamp(14px,2vw,18px) clamp(28px,5vw,48px)', borderRadius: 999,
            background: '#fff', color: '#006B3A',
            fontWeight: 800, fontSize: 'clamp(15px,2vw,17px)', textDecoration: 'none',
            boxShadow: '0 16px 56px rgba(0,0,0,0.25)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06) translateY(-3px)'; e.currentTarget.style.boxShadow = '0 24px 64px rgba(0,0,0,0.32)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 16px 56px rgba(0,0,0,0.25)'; }}
          >
            Join Now <ArrowRight size={18} />
          </Link>
          <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center', gap: 'clamp(16px,3vw,32px)', flexWrap: 'wrap' }}>
            {['No hidden fees', 'Cancel anytime', '120+ charities'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 500 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}