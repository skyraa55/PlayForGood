import React, { useState, useRef, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, Trophy, Heart, Home, LayoutDashboard, Shield, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false); setMobileOpen(false); };
  const isActive = (path) => location.pathname === path;
  const navLinks = [
    { to: '/',          label: 'Home',      icon: Home   },
    { to: '/charities', label: 'Charities', icon: Heart  },
    { to: '/draws',     label: 'Draws',     icon: Trophy },
  ];
  const navRef   = useRef(null);
  const linkRefs = useRef([]);
  const [pill, setPill]       = useState({ left: 0, width: 0, opacity: 0 });
  const [pillReady, setPillReady] = useState(false);
  useLayoutEffect(() => {
    const activeIdx = navLinks.findIndex(({ to }) => isActive(to));
    const idx = activeIdx === -1 ? 0 : activeIdx;
    const el  = linkRefs.current[idx];
    const box = navRef.current;
    if (!el || !box) return;
    const cr = box.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    setPill({ left: er.left - cr.left, width: er.width, opacity: 1 });
    const t = setTimeout(() => setPillReady(true), 30);
    return () => clearTimeout(t);
  }, [location.pathname]);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .nb-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          font-family: 'DM Sans', sans-serif;
        }
        .nb-bar {
          background: #fff;
          border-bottom: 1.5px solid #e8f0eb;
          box-shadow: 0 2px 16px rgba(0,107,58,0.06);
        }
        .nb-inner {
          max-width: 1140px; margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
        }

        /* Logo */
        .nb-logo {
          display: flex; align-items: center; gap: 9px;
          text-decoration: none; flex-shrink: 0;
        }
        .nb-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: #006B3A;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(0,107,58,0.28);
          flex-shrink: 0;
        }
        .nb-logo-text {
          font-size: 17px; font-weight: 700; color: #0d1f14; letter-spacing: -0.3px;
        }

        /* Nav links */
        .nb-links {
          display: flex; align-items: center; gap: 2px;
          position: relative;
          padding: 4px;
          background: #f8fdf9;
          border: 1.5px solid #e8f0eb;
          border-radius: 12px;
        }
        .nb-pill {
          position: absolute;
          top: 4px; bottom: 4px;
          border-radius: 8px;
          background: #006B3A;
          box-shadow: 0 3px 10px rgba(0,107,58,0.28);
          pointer-events: none; z-index: 0;
        }
        .nb-link {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 5px;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13px; font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .nb-link.active { color: #fff; }
        .nb-link:not(.active) { color: #64786b; }
        .nb-link:not(.active):hover { color: #006B3A; }

        /* Right side */
        .nb-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        .nb-login {
          font-size: 13px; font-weight: 600; color: #4a6655;
          text-decoration: none; padding: 7px 14px; border-radius: 9px;
          transition: background 0.2s, color 0.2s;
        }
        .nb-login:hover { background: #f0f7f3; color: #006B3A; }

        .nb-cta {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 8px 18px; border-radius: 10px; border: none;
          background: #006B3A; color: #fff;
          font-size: 13px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0,107,58,0.28);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .nb-cta:hover { transform: translateY(-1px); box-shadow: 0 7px 20px rgba(0,107,58,0.36); }

        /* User button */
        .nb-user-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 12px 5px 5px;
          border-radius: 10px; border: 1.5px solid #e8f0eb;
          background: #fff; cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .nb-user-btn:hover { border-color: #006B3A; box-shadow: 0 3px 12px rgba(0,107,58,0.10); }

        .nb-avatar {
          width: 28px; height: 28px; border-radius: 8px;
          background: linear-gradient(135deg,#006B3A,#00874a);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 12px; font-weight: 700;
          flex-shrink: 0;
        }
        .nb-username {
          font-size: 13px; font-weight: 600; color: #0d1f14;
          max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        /* Dropdown */
        .nb-dropdown {
          position: absolute; right: 0; top: calc(100% + 8px);
          width: 220px;
          background: #fff; border: 1.5px solid #e8f0eb;
          border-radius: 16px;
          box-shadow: 0 16px 48px rgba(0,107,58,0.12);
          overflow: hidden; z-index: 60;
          animation: nbDropIn 0.2s ease both;
        }
        @keyframes nbDropIn {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .nb-dropdown-head {
          padding: 14px 16px 12px;
          border-bottom: 1px solid #f0f7f3;
          background: linear-gradient(135deg,#f8fdf9,#f0f7f3);
        }
        .nb-drop-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px;
          font-size: 13px; font-weight: 600; color: #2d4a38;
          text-decoration: none; cursor: pointer; border: none;
          background: transparent; width: 100%;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, color 0.15s;
        }
        .nb-drop-item:hover { background: #f0f7f3; color: #006B3A; }
        .nb-drop-item.danger { color: #ef4444; }
        .nb-drop-item.danger:hover { background: #fef2f2; color: #ef4444; }
        .nb-drop-divider { height: 1px; background: #f0f7f3; }

        /* Mobile toggle */
        .nb-mob-toggle {
          display: none; padding: 7px; border-radius: 9px; border: none;
          background: transparent; cursor: pointer; color: #4a6655;
          transition: background 0.2s;
        }
        .nb-mob-toggle:hover { background: #f0f7f3; color: #006B3A; }

        /* Mobile drawer */
        .nb-mob-drawer {
          background: #fff; border-top: 1.5px solid #e8f0eb;
          padding: 16px 20px 20px;
          animation: nbMobIn 0.2s ease both;
        }
        @keyframes nbMobIn {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .nb-mob-link {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          text-decoration: none; color: #2d4a38;
          transition: background 0.15s, color 0.15s;
          margin-bottom: 4px;
        }
        .nb-mob-link:hover, .nb-mob-link.active { background: #f0f7f3; color: #006B3A; }
        .nb-mob-link.active { color: #006B3A; }
        .nb-mob-divider { height: 1px; background: #e8f0eb; margin: 10px 0; }
        .nb-mob-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }

        @media (max-width: 767px) {
          .nb-links { display: none; }
          .nb-right  { display: none; }
          .nb-mob-toggle { display: flex; align-items: center; justify-content: center; }
        }
        @media (min-width: 768px) {
          .nb-mob-toggle { display: none; }
        }
      `}</style>
      <nav className="nb-root">
        <div className="nb-bar">
          <div className="nb-inner">
            <Link to="/" className="nb-logo">
              <div className="nb-logo-icon">
                <Trophy size={17} color="#fff" />
              </div>
              <span className="nb-logo-text">PlayForGood</span>
            </Link>
            <div className="nb-links" ref={navRef}>
              <span
                aria-hidden="true"
                className="nb-pill"
                style={{
                  left: pill.left + 4,
                  width: pill.width,
                  opacity: pill.opacity,
                  transition: pillReady
                    ? 'left 0.32s cubic-bezier(0.4,0,0.2,1), width 0.32s cubic-bezier(0.4,0,0.2,1)'
                    : 'none',
                }}
              />
              {navLinks.map(({ to, label, icon: Icon }, i) => (
                <Link
                  key={to}
                  to={to}
                  ref={el => (linkRefs.current[i] = el)}
                  className={`nb-link ${isActive(to) ? 'active' : ''}`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </div>
            <div className="nb-right">
              {user ? (
                <div style={{ position: 'relative' }}>
                  <button className="nb-user-btn" onClick={() => setDropdownOpen(v => !v)}>
                    <div className="nb-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                    <span className="nb-username">{user.name}</span>
                    <ChevronDown
                      size={13}
                      color="#7a9585"
                      style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                    />
                  </button>
                  {dropdownOpen && (
                    <>
                      <div
                        style={{ position: 'fixed', inset: 0, zIndex: 55 }}
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="nb-dropdown">
                        <div className="nb-dropdown-head">
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#0d1f14', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.name}
                          </p>
                          <p style={{ fontSize: 11, color: '#7a9585', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.email}
                          </p>
                        </div>
                        <Link to="/dashboard" className="nb-drop-item" onClick={() => setDropdownOpen(false)}>
                          <LayoutDashboard size={14} color="#006B3A" /> Dashboard
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" className="nb-drop-item" onClick={() => setDropdownOpen(false)}>
                            <Shield size={14} color="#7c3aed" /> Admin Panel
                          </Link>
                        )}
                        <div className="nb-drop-divider" />
                        <button className="nb-drop-item danger" onClick={handleLogout}>
                          <LogOut size={14} /> Log out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="nb-login">Log in</Link>
                  <Link to="/register" className="nb-cta">Get Started</Link>
                </>
              )}
            </div>
            <button className="nb-mob-toggle" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
        {mobileOpen && (
          <div className="nb-mob-drawer">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to} to={to}
                className={`nb-mob-link ${isActive(to) ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
            <div className="nb-mob-divider" />
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 8 }}>
                  <div className="nb-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0d1f14' }}>{user.name}</p>
                    <p style={{ fontSize: 11, color: '#7a9585' }}>{user.email}</p>
                  </div>
                </div>
                <Link to="/dashboard" className="nb-mob-link" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="nb-mob-link" onClick={() => setMobileOpen(false)}>
                    <Shield size={16} /> Admin Panel
                  </Link>
                )}
                <div className="nb-mob-divider" />
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', borderRadius: 10, border: 'none',
                    background: '#fef2f2', color: '#ef4444', cursor: 'pointer',
                    width: '100%', fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14, fontWeight: 600,
                  }}
                >
                  <LogOut size={16} /> Log out
                </button>
              </>
            ) : (
              <div className="nb-mob-actions">
                <Link
                  to="/login"
                  className="nb-mob-link"
                  onClick={() => setMobileOpen(false)}
                  style={{ justifyContent: 'center', border: '1.5px solid #e8f0eb' }}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="nb-cta"
                  onClick={() => setMobileOpen(false)}
                  style={{ justifyContent: 'center', textAlign: 'center' }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}