import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass, Heart, Users, MessageCircle, MapPin, Calendar,
  HeartHandshake, User, X, Sun, Moon, Star, Zap, LogOut,
  Settings, Bell, Trophy, BookOpen, BarChart2,
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { GOLD_GRADIENT, GOLD_LIGHT, GRADIENT, TEAL } from '../../types/mockData';
import logoImg from '../../assets/logo_nuevo_patricia.png';
const navItems = [
  { path: '/home',       icon: Compass,       label: 'Descubrir',  color: '#06B6D4' },
  { path: '/matches',    icon: Heart,         label: 'Matching',   color: '#EC4899' },
  { path: '/parches',    icon: Users,         label: 'Parches',    color: '#8B5CF6' },
  { path: '/chat',       icon: MessageCircle, label: 'Chat',       color: '#3B82F6' },
  { path: '/campus-map', icon: MapPin,        label: 'Campus',     color: '#10B981' },
  { path: '/events',     icon: Calendar,      label: 'Eventos',    color: GOLD_LIGHT },
  { path: '/bienestar',  icon: HeartHandshake,label: 'Bienestar',  color: '#F59E0B' },
  { path: '/monas',      icon: BookOpen,      label: 'Álbum',      color: '#F59E0B' },
  { path: '/stats',      icon: BarChart2,     label: 'Mis Estadísticas', color: '#10B981' },
];
const secondaryItems = [
  { path: '/notifications', icon: Bell,     label: 'Notificaciones' },
  { path: '/ranking',       icon: Trophy,   label: 'Ranking'        },
  { path: '/settings',      icon: Settings, label: 'Ajustes'        },
];
interface LuxuryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
export function LuxuryDrawer({ isOpen, onClose }: LuxuryDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme, currentUser, logout, notifications } = useApp();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };
  const xpInLevel = (currentUser?.xp ?? 0) % 500;
  const xpPercent = xpInLevel / 500;
  const circumference = 2 * Math.PI * 22;
  const dashOffset = circumference * (1 - xpPercent);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[200]"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          />
          {}
          <motion.div
            key="drawer"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
            className="fixed left-0 top-0 bottom-0 z-[201] flex flex-col overflow-hidden"
            style={{
              width: 'min(320px, 85vw)',
              background: isDark
                ? 'rgba(8, 16, 36, 0.96)'
                : 'rgba(253, 252, 248, 0.94)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderRight: isDark
                ? '1px solid rgba(30,58,95,0.5)'
                : '1px solid rgba(10,25,47,0.08)',
              boxShadow: isDark
                ? '8px 0 60px rgba(0,0,0,0.7)'
                : '8px 0 60px rgba(10,25,47,0.18)',
            }}
          >
            {}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{
                borderBottom: isDark
                  ? '1px solid rgba(30,58,95,0.4)'
                  : '1px solid rgba(10,25,47,0.06)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
                  <img src={logoImg} alt="patrici.a" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span
                    className="font-black tracking-tight"
                    style={{
                      background: GOLD_GRADIENT,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: '1.15rem',
                    }}
                  >
                    patrici.a
                  </span>
                  <p className="text-[10px] text-gray-400 tracking-wide -mt-0.5">Campus Social · ECI</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(10,25,47,0.06)',
                  color: isDark ? '#9CA3AF' : '#6E7A8A',
                }}
              >
                <X size={16} />
              </button>
            </div>
            {}
            <button
              onClick={() => handleNav('/profile')}
              className="mx-4 mt-4 mb-2 rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.98]"
              style={{
                background: isDark
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(10,25,47,0.04)',
                border: isDark
                  ? '1px solid rgba(30,58,95,0.5)'
                  : '1px solid rgba(10,25,47,0.07)',
              }}
            >
              {}
              <div className="relative flex-shrink-0">
                <svg width="52" height="52" viewBox="0 0 52 52" className="absolute inset-0">
                  <circle cx="26" cy="26" r="22" fill="none" stroke={isDark ? '#1E3A5F' : 'rgba(10,25,47,0.08)'} strokeWidth="3" />
                  <circle
                    cx="26" cy="26" r="22"
                    fill="none"
                    stroke="url(#drawerRing)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 26 26)"
                  />
                  <defs>
                    <linearGradient id="drawerRing" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D97706" />
                      <stop offset="100%" stopColor="#FBBF24" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="w-[52px] h-[52px] rounded-full overflow-hidden p-[5px]">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{currentUser?.program}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${GOLD_LIGHT}22`, color: GOLD_LIGHT }}
                  >
                    <Star size={9} />
                    Nv. {currentUser?.level}
                  </span>
                  <span
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(6,182,212,0.12)', color: TEAL }}
                  >
                    <Zap size={9} />
                    {currentUser?.xp?.toLocaleString()} XP
                  </span>
                </div>
              </div>
              <User size={14} className="text-gray-400 flex-shrink-0" />
            </button>
            {}
            <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
              {navItems.map(({ path, icon: Icon, label, color }, i) => {
                const isActive = location.pathname === path ||
                  (path === '/parches' && location.pathname.startsWith('/parches'));
                return (
                  <motion.button
                    key={path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.035, type: 'spring', stiffness: 400, damping: 30 }}
                    onClick={() => handleNav(path)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all active:scale-[0.97] relative overflow-hidden group"
                    style={
                      isActive
                        ? {
                            background: isDark
                              ? 'rgba(255,255,255,0.06)'
                              : 'rgba(10,25,47,0.05)',
                          }
                        : {}
                    }
                  >
                    {}
                    {isActive && (
                      <div
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
                        style={{ background: GOLD_GRADIENT }}
                      />
                    )}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{
                        background: isActive ? `${color}22` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(10,25,47,0.05)',
                      }}
                    >
                      <Icon
                        size={17}
                        style={{ color: isActive ? color : isDark ? '#9CA3AF' : '#6E7A8A' }}
                        strokeWidth={isActive ? 2.5 : 1.8}
                      />
                    </div>
                    <span
                      className="font-medium text-sm"
                      style={{
                        color: isActive
                          ? isDark ? '#F3F4F6' : '#111827'
                          : isDark ? '#9CA3AF' : '#6E7A8A',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {label}
                    </span>
                    {path === '/chat' && notifications > 0 && (
                      <span
                        className="ml-auto min-w-[20px] h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1"
                        style={{ background: GRADIENT }}
                      >
                        {notifications}
                      </span>
                    )}
                    {isActive && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: GOLD_LIGHT }}
                      />
                    )}
                  </motion.button>
                );
              })}
              {}
              <div
                className="my-3 mx-2 h-px"
                style={{ background: isDark ? 'rgba(30,58,95,0.4)' : 'rgba(10,25,47,0.06)' }}
              />
              {}
              {secondaryItems.map(({ path, icon: Icon, label }, i) => (
                <motion.button
                  key={path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.32 + i * 0.03, type: 'spring', stiffness: 400, damping: 30 }}
                  onClick={() => handleNav(path)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-left transition-all active:scale-[0.97]"
                >
                  <Icon
                    size={16}
                    style={{ color: isDark ? '#64748B' : '#94A3B8' }}
                    strokeWidth={1.8}
                  />
                  <span
                    className="text-sm"
                    style={{ color: isDark ? '#64748B' : '#94A3B8' }}
                  >
                    {label}
                  </span>
                </motion.button>
              ))}
            </nav>
            {}
            <div
              className="px-3 py-4 flex-shrink-0 space-y-1"
              style={{
                borderTop: isDark
                  ? '1px solid rgba(30,58,95,0.4)'
                  : '1px solid rgba(10,25,47,0.06)',
              }}
            >
              {}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all active:scale-[0.97]"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(10,25,47,0.04)',
                  color: isDark ? '#9CA3AF' : '#6E7A8A',
                }}
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
                <span className="text-sm font-medium">
                  {isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
                </span>
              </button>
              {}
              <button
                onClick={() => { logout?.(); onClose(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all active:scale-[0.97] text-red-400"
                style={{
                  background: isDark ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.04)',
                }}
              >
                <LogOut size={17} />
                <span className="text-sm font-medium">Cerrar sesión</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}