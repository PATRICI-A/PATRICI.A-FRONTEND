import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Compass, Users, MessageCircle, Calendar, User, Bell, Sun, Moon, MapPin, ArrowLeft, Heart, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BottomNav } from './BottomNav';
import { GRADIENT, GOLD_GRADIENT, GOLD_LIGHT, PINK } from '../../data/mockData';
import { DoodleBackground } from '../ui/DoodleBackground';
import logoImg from '../../assets/logo_nuevo_patricia.png';

const navItems = [
  { path: '/home',        icon: Compass,        label: 'Descubrir' },
  { path: '/matches',     icon: Heart,          label: 'Matching'  },
  { path: '/parches',     icon: Users,          label: 'Parches'   },
  { path: '/chat',        icon: MessageCircle,  label: 'Chat'      },
  { path: '/campus-map',  icon: MapPin,         label: 'Campus'    },
  { path: '/events',      icon: Calendar,       label: 'Eventos'   },
  { path: '/bienestar',   icon: HeartHandshake, label: 'Bienestar' },
];

export function Layout() {
  const { isDark, toggleTheme, currentUser, notifications } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ isolation: 'isolate', background: isDark ? '#030D1F' : '#FFFFFF' }}>

      {/*
        ── Doodle background: z-index -1, behind ALL content ──
        isolation:isolate on the parent creates a stacking context so z-index:-1
        sits above the container's own background but below every child element.
      */}
      <DoodleBackground isDark={isDark} opacity={1} />

      {/* Desktop Sidebar — z-index 40 (above doodle) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#0D1B2E] border-r border-gray-100 dark:border-[#1E3A5F]/60 flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 dark:border-[#1E3A5F]/60">
          <button
            className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity active:scale-95"
            onClick={() => navigate('/home')}
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
              <img src={logoImg} alt="patrici.a" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <h1
                className="font-bold tracking-tight"
                style={{
                  background: GOLD_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                }}
              >
                patrici.a
              </h1>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 tracking-wide">Campus Social</p>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* ── Back button ── */}
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all mb-3 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-[#172A45] hover:text-gray-700 dark:hover:text-gray-300 active:scale-95 group"
          >
            <ArrowLeft size={17} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="h-px bg-gray-100 dark:bg-[#1E3A5F]/60 mb-3" />

          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive =
              location.pathname === path ||
              (path === '/parches' && location.pathname.startsWith('/parches'));
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group relative overflow-hidden"
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, rgba(217,119,6,0.15) 0%, rgba(245,158,11,0.08) 100%)',
                        color: GOLD_LIGHT,
                      }
                    : { color: isDark ? '#9CA3AF' : '#6B7280' }
                }
              >
                {/* Gold left border accent when active */}
                {isActive && (
                  <div
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
                    style={{ background: GOLD_GRADIENT }}
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={isActive ? { color: GOLD_LIGHT } : {}}
                />
                <span className={`font-medium text-sm ${isActive ? '' : 'group-hover:text-gray-800 dark:group-hover:text-white transition-colors'}`}>
                  {label}
                </span>
                {path === '/chat' && notifications > 0 && (
                  <span
                    className="ml-auto w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                    style={{ background: GRADIENT }}
                  >
                    {notifications}
                  </span>
                )}
                {isActive && !notifications && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: GOLD_LIGHT }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="p-4 border-t border-gray-100 dark:border-[#1E3A5F]/60">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#172A45] hover:text-gray-800 dark:hover:text-white active:scale-95"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#112240]/95 backdrop-blur-md border-b border-gray-100/80 dark:border-[#233554]/80 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <button
            className="flex items-center gap-2.5 active:opacity-70 transition-opacity"
            onClick={() => navigate('/home')}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
              <img src={logoImg} alt="patrici.a" className="w-full h-full object-cover" />
            </div>
            <span
              className="font-bold tracking-tight"
              style={{
                background: GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.05rem',
                lineHeight: 1,
              }}
            >
              patrici.a
            </span>
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#172A45] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1A3057] transition-all active:scale-90"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#172A45] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1A3057] transition-all active:scale-90 relative"
            >
              <Bell size={15} />
              {notifications > 0 && (
                <span
                  className="absolute top-1 right-1 w-[14px] h-[14px] rounded-full text-white flex items-center justify-center font-bold"
                  style={{ background: GRADIENT, fontSize: '8px' }}
                >
                  {notifications}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="active:scale-90 transition-transform"
            >
              <div
                className="w-9 h-9 rounded-full overflow-hidden"
                style={{ boxShadow: `0 0 0 2px ${PINK}` }}
              >
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="md:ml-64 pt-[57px] md:pt-0 pb-20 md:pb-0 min-h-screen relative z-[1]">
        <div className="max-w-2xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}