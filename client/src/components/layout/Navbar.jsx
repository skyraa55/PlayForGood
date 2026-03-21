import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, Trophy, Heart, Home, LayoutDashboard, Shield, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false); };
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/charities', label: 'Charities', icon: Heart },
    { to: '/draws', label: 'Draws', icon: Trophy },
  ];

  // ─── Sliding pill state ───────────────────────────────────────────────────
  const navRef = useRef(null);
  const linkRefs = useRef([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [pillReady, setPillReady] = useState(false);

  // Re-measure whenever the active route changes or on first paint
  useLayoutEffect(() => {
    const activeIndex = navLinks.findIndex(({ to }) => isActive(to));
    const idx = activeIndex === -1 ? 0 : activeIndex;
    const el = linkRefs.current[idx];
    const container = navRef.current;

    if (!el || !container) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setPillStyle({
      left: elRect.left - containerRect.left,
      width: elRect.width,
      opacity: 1,
    });

    // Small delay so first render gets the transition (not a jump)
    const t = setTimeout(() => setPillReady(true), 30);
    return () => clearTimeout(t);
  }, [location.pathname]);
  // ─────────────────────────────────────────────────────────────────────────

  return (
  <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
    <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-md rounded-2xl px-4 sm:px-6">
      
      <div className="flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-lg">
          <div className="h-9 w-9 bg-[#006B3A] rounded-lg flex justify-center items-center shadow-inner">
            <Trophy size={18} className="text-white" />
          </div>
          <span className="text-gray-900 hidden sm:block">PlayForGood</span>
        </Link>

        {/* Center Nav (floating style) */}
        <div className="hidden md:flex justify-center flex-1">
          <div
            ref={navRef}
            className="relative flex items-center gap-1 bg-white px-2 py-1 rounded-xl"
          >
            {/* Sliding pill */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                transform: `translateX(${pillStyle.left}px) translateY(-50%)`,
                width: pillStyle.width,
                opacity: pillStyle.opacity,
                height: '34px',
                borderRadius: '10px',
                backgroundColor: '#22c55e20',
                transition: pillReady
                  ? 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
                  : 'none',
                pointerEvents: 'none',
                left: 0,
                zIndex: 0,
              }}
            />

            {navLinks.map(({ to, label, icon: Icon }, i) => (
              <Link
                key={to}
                to={to}
                ref={(el) => (linkRefs.current[i] = el)}
                className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(to)
                    ? 'text-green-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all text-sm font-medium text-gray-700"
              >
                <div className="w-7 h-7 bg-green-100 border border-green-200 rounded-full flex items-center justify-center text-green-600 text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-gray-900 font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-gray-500 text-xs truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Shield size={15} />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={15} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm px-3">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-[#006B3A] hover:bg-green-1000 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-sm transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>
    </div>

    {/* Mobile menu stays SAME */}
  </nav>
);
}