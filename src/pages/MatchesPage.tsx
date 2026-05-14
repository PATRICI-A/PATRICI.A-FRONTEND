import * as React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, X, MapPin, Filter, ChevronDown, Sparkles, Users,
  Star, Clock, LocateFixed, CheckCircle2, Navigation, Send,
  UserPlus, UserCheck, Zap,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { matchUsers, GRADIENT, TEAL, TEAL_GRADIENT, PINK } from '../types/mockData';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { Avatar } from '../components/ui/Avatar';
const getCardGradient = (pct: number) => {
  if (pct >= 80) return 'linear-gradient(145deg, #064E3B 0%, #065F46 45%, #0D9488 100%)';
  if (pct >= 65) return 'linear-gradient(145deg, #0C4A6E 0%, #0E7490 55%, #06B6D4 100%)';
  if (pct >= 50) return 'linear-gradient(145deg, #312E81 0%, #4338CA 55%, #6366F1 100%)';
  return   'linear-gradient(145deg, #3B0764 0%, #6D28D9 55%, #8B5CF6 100%)';
};
const getBadgeStyle = (pct: number): React.CSSProperties => {
  if (pct >= 80) return { background: 'rgba(16,185,129,0.88)', backdropFilter: 'blur(6px)' };
  if (pct >= 65) return { background: 'rgba(6,182,212,0.88)',  backdropFilter: 'blur(6px)' };
  if (pct >= 50) return { background: 'rgba(99,102,241,0.88)', backdropFilter: 'blur(6px)' };
  return               { background: 'rgba(139,92,246,0.88)', backdropFilter: 'blur(6px)' };
};
const getBarColor = (pct: number) => {
  if (pct >= 80) return 'linear-gradient(90deg,#10B981,#06B6D4)';
  if (pct >= 65) return 'linear-gradient(90deg,#06B6D4,#3B82F6)';
  if (pct >= 50) return 'linear-gradient(90deg,#6366F1,#8B5CF6)';
  return               'linear-gradient(90deg,#8B5CF6,#EC4899)';
};
export function MatchesPage() {
  const navigate = useNavigate();
  const { currentUser, isDark, geo } = useApp();
  const [selectedUser, setSelectedUser] = useState<typeof matchUsers[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'explore' | 'sent' | 'received' | 'friends'>('explore');
  const [filters, setFilters] = useState({ program: '', semester: '', interest: '' });
  const [showUnfriendModal, setShowUnfriendModal] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [connectionStates, setConnectionStates] = useState<Record<string, 'none' | 'pending' | 'connected'>>({});
  const [incomingRequests, setIncomingRequests] = useState<string[]>(['u4', 'u6', 'u18']);
  const uniquePrograms = Array.from(new Set(matchUsers.map(u => u.program)));
  const uniqueSemesters = Array.from(new Set(matchUsers.map(u => u.semester))).sort((a, b) => a - b);
  const calculateCompatibility = (user: typeof matchUsers[0]) => {
    let score = 50;
    const userInterests = currentUser?.interests || [];
    const commonInterests = user.interests.filter(i => userInterests.includes(i));
    score += commonInterests.length * 10;
    if (user.program === currentUser?.program) score += 15;
    const semesterDiff = Math.abs((user.semester || 0) - (currentUser?.semester || 0));
    score += Math.max(10 - semesterDiff * 2, 0);
    if (user.online) score += 5;
    return Math.min(Math.max(score, 0), 100);
  };
  const getConnectionStatus = (userId: string, originalStatus?: 'none' | 'pending' | 'connected') =>
    connectionStates[userId] || originalStatus || 'none';
  const filteredUsers = useMemo(() => {
    let filtered = matchUsers.map(u => ({ ...u, matchPercent: calculateCompatibility(u) }));
    if (activeTab === 'sent') {
      filtered = filtered.filter(u =>
        getConnectionStatus(u.id, u.connectionStatus) === 'pending' && !incomingRequests.includes(u.id)
      );
    } else if (activeTab === 'received') {
      filtered = filtered.filter(u => incomingRequests.includes(u.id));
    } else if (activeTab === 'friends') {
      filtered = filtered.filter(u => getConnectionStatus(u.id, u.connectionStatus) === 'connected');
    } else {
      filtered = filtered.filter(u =>
        getConnectionStatus(u.id, u.connectionStatus) === 'none' && !incomingRequests.includes(u.id)
      );
    }
    if (activeTab === 'explore') {
      if (filters.program) filtered = filtered.filter(u => u.program.toLowerCase().includes(filters.program.toLowerCase()));
      if (filters.semester) filtered = filtered.filter(u => u.semester.toString() === filters.semester);
      if (filters.interest) filtered = filtered.filter(u => u.interests.some(i => i.toLowerCase().includes(filters.interest.toLowerCase())));
    }
    return filtered.sort((a, b) => b.matchPercent - a.matchPercent);
  }, [filters, activeTab, connectionStates, incomingRequests]);
  const handleConnect = (userId: string, currentStatus?: 'none' | 'pending' | 'connected') => {
    const status = connectionStates[userId] || currentStatus || 'none';
    if (status === 'none') setConnectionStates(prev => ({ ...prev, [userId]: 'pending' }));
    else if (status === 'pending') setConnectionStates(prev => ({ ...prev, [userId]: 'none' }));
  };
  const handleAcceptRequest = (userId: string) => {
    setConnectionStates(prev => ({ ...prev, [userId]: 'connected' }));
    setIncomingRequests(prev => prev.filter(id => id !== userId));
  };
  const handleRejectRequest = (userId: string) => {
    setConnectionStates(prev => ({ ...prev, [userId]: 'none' }));
    setIncomingRequests(prev => prev.filter(id => id !== userId));
  };
  const handleUnfriend = (userId: string) => {
    setConnectionStates(prev => ({ ...prev, [userId]: 'none' }));
    setShowUnfriendModal(null);
  };
  const clearFilters = () => setFilters({ program: '', semester: '', interest: '' });
  const activeFiltersCount = [filters.program, filters.semester, filters.interest].filter(Boolean).length;
  const nearbySuggestions = useMemo(() => {
    if (!geo.enabled || !geo.onCampus) return [];
    return matchUsers.slice(0, 3).map(u => ({ ...u, matchPercent: Math.max(u.matchPercent, 72) }));
  }, [geo.enabled, geo.onCampus]);
  const avgMatch = filteredUsers.length
    ? Math.round(filteredUsers.reduce((s, u) => s + u.matchPercent, 0) / filteredUsers.length)
    : 0;
  const connectedCount = matchUsers.filter(u => getConnectionStatus(u.id, u.connectionStatus) === 'connected').length;
  const tabs = [
    { id: 'explore'  as const, label: 'Explorar',  icon: Sparkles,   badge: 0 },
    { id: 'sent'     as const, label: 'Enviadas',  icon: Send,       badge: 0 },
    { id: 'received' as const, label: 'Recibidas', icon: UserPlus,   badge: incomingRequests.length },
    { id: 'friends'  as const, label: 'Amigos',    icon: UserCheck,  badge: 0 },
  ];
  return (
    <div className="min-h-screen relative" style={{ background: 'transparent' }}>
      <DoodleBackground isDark={isDark} />
      {}
      <div
        className="backdrop-blur-xl border-b"
        style={isDark
          ? { background: 'rgba(10,25,47,0.97)', borderColor: '#1E3A5F' }
          : { background: 'rgba(253,252,248,0.92)', borderColor: 'rgba(10,25,47,0.07)', boxShadow: '0 2px 16px rgba(10,25,47,0.07)' }
        }
      >
        {}
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {geo.enabled && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate('/campus-map')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold"
                  style={{
                    background: geo.onCampus ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                    color: geo.onCampus ? '#10B981' : '#F59E0B',
                    border: `1px solid ${geo.onCampus ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                  }}
                >
                  <LocateFixed size={12} />
                  {geo.onCampus ? geo.detectedZone?.replace('Cerca de ', '') ?? 'En campus' : 'GPS activo'}
                </motion.button>
              )}
            </div>
          </div>
          {}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ background: TEAL_GRADIENT }}
            >
              <Sparkles size={20} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-gray-900 dark:text-white font-black" style={{ fontSize: '1.3rem', lineHeight: 1.2 }}>
                🎯 Perfect Match
              </h1>
              <p className="text-xs" style={{ color: isDark ? '#4A6080' : '#9CA3AF' }}>
                {activeTab === 'explore' && 'Encuentra tu tribu universitaria'}
                {activeTab === 'sent'    && `${filteredUsers.length} solicitudes enviadas`}
                {activeTab === 'received' && `${filteredUsers.length} solicitudes pendientes`}
                {activeTab === 'friends' && `${connectedCount} conexiones activas`}
              </p>
            </div>
          </div>
          {}
          {activeTab === 'explore' && (
            <div className="flex gap-2">
              {[
                { icon: Users,    label: 'Compatibles', value: matchUsers.length, color: TEAL },
                { icon: Heart,    label: 'Amigos',       value: connectedCount,   color: '#EC4899' },
                { icon: Zap,      label: 'Match prom.',  value: `${avgMatch}%`,  color: '#F59E0B' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="flex-1 rounded-2xl px-2.5 py-2"
                  style={{
                    background: isDark ? 'rgba(17,34,64,0.8)' : 'rgba(255,255,255,0.8)',
                    border: `1px solid ${isDark ? '#1E3A5F' : 'rgba(10,25,47,0.06)'}`,
                  }}
                >
                  <stat.icon size={12} style={{ color: stat.color }} />
                  <p className="font-black text-sm mt-0.5" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[9px]" style={{ color: isDark ? '#4A6080' : '#9CA3AF' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {}
        <div className="border-t overflow-x-auto scrollbar-hide" style={{ borderColor: isDark ? '#1E3A5F' : 'rgba(10,25,47,0.07)' }}>
          <div className="flex gap-1.5 px-5 py-2.5">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0"
                  style={isActive
                    ? { background: TEAL_GRADIENT, color: 'white', boxShadow: '0 4px 12px rgba(6,182,212,0.3)' }
                    : { background: isDark ? 'rgba(17,34,64,0.6)' : 'rgba(10,25,47,0.06)', color: isDark ? '#6B8AAA' : '#6B7280' }
                  }
                >
                  <Icon size={13} />
                  {tab.label}
                  {tab.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-red-500 text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {}
        {activeTab === 'explore' && (
          <div
            className="border-t px-5 py-2 flex items-center gap-2"
            style={{ borderColor: isDark ? '#1E3A5F' : 'rgba(10,25,47,0.07)' }}
          >
            <button
              onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: showFilters || activeFiltersCount > 0 ? TEAL_GRADIENT : (isDark ? '#112240' : 'rgba(10,25,47,0.06)'),
                color: showFilters || activeFiltersCount > 0 ? 'white' : (isDark ? '#8A9BB0' : '#4A5568'),
              }}
            >
              <Filter size={12} />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-[9px] font-black flex items-center justify-center" style={{ color: '#0D9488' }}>
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown size={12} style={{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium"
                style={{ background: isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)', color: '#EF4444' }}
              >
                <X size={11} /> Limpiar
              </button>
            )}
            <span className="ml-auto text-xs" style={{ color: isDark ? '#4A6080' : '#9CA3AF' }}>
              {filteredUsers.length} resultados
            </span>
          </div>
        )}
        {}
        <AnimatePresence>
          {activeTab === 'explore' && showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t"
              style={{ borderColor: isDark ? '#1E3A5F' : 'rgba(10,25,47,0.07)' }}
            >
              <div className="px-5 py-4 space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: isDark ? '#4A6080' : '#9CA3AF' }}>
                    Programa
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {['', ...uniquePrograms].map(prog => (
                      <button
                        key={prog || 'all'}
                        onClick={() => setFilters({ ...filters, program: prog })}
                        className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                        style={filters.program === prog
                          ? { background: TEAL_GRADIENT, color: 'white' }
                          : { background: isDark ? '#112240' : 'rgba(10,25,47,0.06)', color: isDark ? '#8A9BB0' : '#4A5568' }
                        }
                      >
                        {prog ? prog.replace('Ingeniería de ', '').replace('Ingeniería ', '') : 'Todos'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: isDark ? '#4A6080' : '#9CA3AF' }}>
                    Semestre
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {['', ...uniqueSemesters.map(String)].map(sem => (
                      <button
                        key={sem || 'all'}
                        onClick={() => setFilters({ ...filters, semester: sem })}
                        className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                        style={filters.semester === sem
                          ? { background: TEAL_GRADIENT, color: 'white' }
                          : { background: isDark ? '#112240' : 'rgba(10,25,47,0.06)', color: isDark ? '#8A9BB0' : '#4A5568' }
                        }
                      >
                        {sem ? `${sem}° sem` : 'Todos'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {}
      <div className="px-4 py-5 pb-28">
        {}
        <AnimatePresence>
          {activeTab === 'explore' && nearbySuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl overflow-hidden mb-4"
              style={{ border: '1.5px solid rgba(16,185,129,0.3)', background: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)' }}
            >
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                    <Navigation size={12} color="#10B981" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 dark:text-white">Cerca de ti ahora</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{geo.detectedZone ?? 'Campus ECI'} · {nearbySuggestions.length} personas</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                  <CheckCircle2 size={9} /> En campus
                </span>
              </div>
              <div className="flex gap-3 px-4 pb-3 overflow-x-auto scrollbar-hide">
                {nearbySuggestions.map(user => (
                  <motion.button key={user.id} whileTap={{ scale: 0.95 }} onClick={() => navigate(`/user/${user.id}`)} className="flex-shrink-0 flex flex-col items-center gap-1.5" style={{ width: 68 }}>
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#10B981,#06B6D4)' }}>
                        {user.avatar
                          ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          : <Avatar name={user.name} size={56} className="rounded-2xl" gradient="linear-gradient(135deg,#10B981,#06B6D4)" />
                        }
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white shadow" style={{ background: 'linear-gradient(135deg,#10B981,#06B6D4)' }}>
                        {user.matchPercent}%
                      </div>
                      {user.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0A192F]" style={{ background: '#10B981' }} />}
                    </div>
                    <p className="text-[10px] font-bold text-gray-800 dark:text-white text-center leading-tight truncate w-full">{user.name.split(' ')[0]}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {}
        {activeTab === 'explore' && !geo.enabled && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate('/campus-map')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left mb-4 active:scale-[0.98] transition-all"
            style={{ background: isDark ? 'rgba(6,182,212,0.06)' : 'rgba(6,182,212,0.04)', border: '1px dashed rgba(6,182,212,0.3)' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(6,182,212,0.12)' }}>
              <LocateFixed size={17} color="#06B6D4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 dark:text-white">Activa la geolocalización</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Descubre personas cerca de ti en el campus</p>
            </div>
            <span className="text-[10px] font-bold text-cyan-500">Ir al mapa →</span>
          </motion.button>
        )}
        {}
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5 shadow-xl"
              style={{ background: TEAL_GRADIENT }}
            >
              {activeTab === 'explore'  ? <Sparkles  size={36} color="white" /> :
               activeTab === 'sent'     ? <Send      size={36} color="white" /> :
               activeTab === 'received' ? <UserPlus  size={36} color="white" /> :
                                          <UserCheck size={36} color="white" />}
            </motion.div>
            <h3 className="text-gray-800 dark:text-white font-black text-lg mb-2">
              {activeTab === 'explore'  && 'Sin resultados'}
              {activeTab === 'sent'     && 'Sin solicitudes enviadas'}
              {activeTab === 'received' && 'Sin solicitudes pendientes'}
              {activeTab === 'friends'  && 'Aún sin conexiones'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              {activeTab === 'explore'  && 'Ajusta los filtros o vuelve más tarde para ver nuevas sugerencias'}
              {activeTab === 'sent'     && 'Explora personas y envía solicitudes de conexión'}
              {activeTab === 'received' && 'Las solicitudes que recibas aparecerán aquí'}
              {activeTab === 'friends'  && 'Acepta solicitudes o conecta con nuevas personas'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {filteredUsers.map((user, i) => {
              const status = getConnectionStatus(user.id, user.connectionStatus);
              const grad = getCardGradient(user.matchPercent);
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, type: 'spring', damping: 18 }}
                  onClick={() => navigate(`/user/${user.id}`)}
                  className="rounded-2xl overflow-hidden cursor-pointer group"
                  style={{
                    boxShadow: isDark
                      ? '0 4px 16px rgba(0,0,0,0.35)'
                      : '0 3px 12px rgba(10,25,47,0.10)',
                    border: isDark ? '1px solid rgba(30,58,95,0.6)' : '1px solid rgba(10,25,47,0.06)',
                  }}
                >
                  {}
                  <div className="relative" style={{ aspectRatio: '1/1' }}>
                    {}
                    <div className="absolute inset-0" style={{ background: grad }} />
                    {}
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    )}
                    {}
                    <div
                      className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black text-white shadow-lg"
                      style={getBadgeStyle(user.matchPercent)}
                    >
                      {user.matchPercent}%
                    </div>
                    {}
                    {user.online && (
                      <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full border border-white/50"
                        style={{ background: '#10B981' }} />
                    )}
                    {}
                    <div
                      className="absolute bottom-0 inset-x-0 h-1/2"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }}
                    />
                    {}
                    <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
                      <h3 className="text-white font-black text-[11px] leading-tight truncate">
                        {user.name.split(' ')[0]}, {user.age}
                      </h3>
                      <p className="text-white/70 text-[9px] truncate">
                        {user.semester}° sem.
                      </p>
                    </div>
                  </div>
                  {}
                  <div
                    className="p-2"
                    style={{ background: isDark ? '#112240' : 'white' }}
                  >
                    {}
                    <div className="h-1 rounded-full overflow-hidden mb-1.5" style={{ background: isDark ? '#1A2F4A' : '#E5E7EB' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${user.matchPercent}%` }}
                        transition={{ delay: i * 0.04 + 0.3, duration: 0.7, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: getBarColor(user.matchPercent) }}
                      />
                    </div>
                    {}
                    {activeTab === 'received' ? (
                      <div className="flex gap-1.5">
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={e => { e.stopPropagation(); handleRejectRequest(user.id); }}
                          className="flex-1 py-1.5 rounded-xl flex items-center justify-center gap-0.5 text-white text-[10px] font-bold"
                          style={{ background: 'linear-gradient(135deg,#EF4444,#DC2626)' }}
                        >
                          <X size={11} /> No
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={e => { e.stopPropagation(); handleAcceptRequest(user.id); }}
                          className="flex-1 py-1.5 rounded-xl flex items-center justify-center gap-0.5 text-white text-[10px] font-bold"
                          style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}
                        >
                          <CheckCircle2 size={11} /> Sí
                        </motion.button>
                      </div>
                    ) : activeTab === 'sent' ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={e => { e.stopPropagation(); handleConnect(user.id, user.connectionStatus); }}
                        className="w-full py-1.5 rounded-xl flex items-center justify-center gap-1 text-white text-[10px] font-bold"
                        style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}
                      >
                        <Clock size={11} /> Pendiente · Cancelar
                      </motion.button>
                    ) : activeTab === 'friends' ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={e => { e.stopPropagation(); setShowUnfriendModal(user.id); }}
                        className="w-full py-1.5 rounded-xl flex items-center justify-center gap-1 text-[10px] font-bold"
                        style={{ color: '#EF4444', background: isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}
                      >
                        <Heart size={11} fill="currentColor" /> Conectados · Eliminar
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={e => { e.stopPropagation(); handleConnect(user.id, user.connectionStatus); }}
                        key={`${user.id}-${status}`}
                        className="w-full py-1.5 rounded-xl flex items-center justify-center gap-1 text-white text-[10px] font-bold transition-all"
                        style={{
                          background: status === 'connected' ? 'linear-gradient(135deg,#10B981,#059669)' :
                                       status === 'pending'   ? 'linear-gradient(135deg,#F59E0B,#D97706)' :
                                       GRADIENT,
                          boxShadow: status === 'none' ? '0 3px 10px rgba(6,182,212,0.3)' : 'none',
                        }}
                      >
                        {status === 'connected' ? <><Heart size={11} fill="white" /> Conectados</> :
                         status === 'pending'   ? <><Clock  size={11} /> Pendiente</> :
                                                  <><Heart  size={11} /> Conectar</>}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      {}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl"
              style={{ background: isDark ? '#0D1B2E' : 'rgba(253,252,248,0.99)' }}
            >
              <div>
                <div className="sticky top-0 z-10 backdrop-blur-xl border-b px-5 py-4 rounded-t-3xl"
                  style={isDark ? { background: 'rgba(13,27,46,0.97)', borderColor: '#1E3A5F' } : { background: 'rgba(253,252,248,0.96)', borderColor: 'rgba(10,25,47,0.07)' }}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-gray-900 dark:text-white font-bold text-lg">Perfil de {selectedUser.name}</h2>
                    <button onClick={() => setSelectedUser(null)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300">
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      {selectedUser.avatar
                        ? <img src={selectedUser.avatar} alt={selectedUser.name} className="w-24 h-24 rounded-2xl object-cover" />
                        : <Avatar name={selectedUser.name} size={96} className="rounded-2xl" gradient={TEAL_GRADIENT} fontSize="32px" />
                      }
                      {selectedUser.online && <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-[#0A192F]" style={{ background: TEAL }} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-1">{selectedUser.name}, {selectedUser.age}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedUser.program}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-[#112240] overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${selectedUser.matchPercent}%` }} transition={{ duration: 1 }}
                            className="h-full rounded-full" style={{ background: TEAL_GRADIENT }} />
                        </div>
                        <span className="text-sm font-bold" style={{ color: TEAL }}>{selectedUser.matchPercent}%</span>
                      </div>
                    </div>
                  </div>
                  {selectedUser.bio && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">ACERCA DE</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedUser.bio}</p>
                    </div>
                  )}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">INTERESES</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedUser.interests.map(interest => (
                        <span key={interest} className="px-3 py-1.5 rounded-xl text-sm font-medium"
                          style={{ background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(10,25,47,0.06)', color: isDark ? '#67D2E8' : '#4A5568' }}>
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  {getConnectionStatus(selectedUser.id, selectedUser.connectionStatus) === 'connected' ? (
                    <div className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2" style={{ background: '#10B981' }}>
                      <CheckCircle2 size={18} /> ✓ Conectados
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => handleConnect(selectedUser.id, selectedUser.connectionStatus)}
                      whileTap={{ scale: 0.97 }}
                      key={`modal-${selectedUser.id}-${getConnectionStatus(selectedUser.id, selectedUser.connectionStatus)}`}
                      className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg"
                      style={{ background: getConnectionStatus(selectedUser.id, selectedUser.connectionStatus) === 'pending' ? '#F59E0B' : GRADIENT }}
                    >
                      {getConnectionStatus(selectedUser.id, selectedUser.connectionStatus) === 'pending'
                        ? '⏱ Solicitud enviada (toca para cancelar)'
                        : 'Enviar solicitud de conexión'}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showUnfriendModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowUnfriendModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
              style={{ background: isDark ? '#112240' : 'rgba(253,252,248,0.99)', border: `1px solid ${isDark ? '#1E3A5F' : 'rgba(10,25,47,0.07)'}` }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                  <Heart size={32} className="text-red-600 dark:text-red-400" fill="currentColor" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">¿Anular conexión?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Esta acción eliminará la conexión con esta persona. Podrás volver a conectar más tarde.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUnfriendModal(null)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#1A2F4A] text-gray-700 dark:text-gray-300 font-semibold">
                  Cancelar
                </button>
                <button onClick={() => handleUnfriend(showUnfriendModal)} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold">
                  Sí, anular
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}