import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, X, MapPin, Filter, ChevronDown, Sparkles, Users, Star, Sun, Moon, Clock, LocateFixed, CheckCircle2, Navigation, Send, UserPlus, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { matchUsers, GRADIENT, TEAL, TEAL_GRADIENT, PINK } from '../data/mockData';
import { DoodleBackground } from '../components/ui/DoodleBackground';

export function MatchesPage() {
  const navigate = useNavigate();
  const { currentUser, isDark, toggleTheme, geo } = useApp();
  const [selectedUser, setSelectedUser] = useState<typeof matchUsers[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'explore' | 'sent' | 'received' | 'friends'>('explore');
  const [filters, setFilters] = useState({
    program: '',
    semester: '',
    interest: '',
  });
  const [showUnfriendModal, setShowUnfriendModal] = useState<string | null>(null);

  // Estado local para manejar conexiones
  const [connectionStates, setConnectionStates] = useState<Record<string, 'none' | 'pending' | 'connected'>>({});

  // Mock: IDs de usuarios que enviaron solicitud al usuario actual
  const [incomingRequests, setIncomingRequests] = useState<string[]>(['u4', 'u6', 'u18']);

  // Programas y semestres únicos para filtros
  const uniquePrograms = Array.from(new Set(matchUsers.map(u => u.program)));
  const uniqueSemesters = Array.from(new Set(matchUsers.map(u => u.semester))).sort((a, b) => a - b);

  // Calcular compatibilidad dinámica
  const calculateCompatibility = (user: typeof matchUsers[0]) => {
    let score = 50; // Base score

    // Intereses en común (+30 puntos)
    const userInterests = currentUser?.interests || [];
    const commonInterests = user.interests.filter(i => userInterests.includes(i));
    score += commonInterests.length * 10;

    // Mismo programa (+15 puntos)
    if (user.program === currentUser?.program) score += 15;

    // Semestre cercano (+5 puntos por cada semestre de diferencia, max 10)
    const semesterDiff = Math.abs((user.semester || 0) - (currentUser?.semester || 0));
    score += Math.max(10 - semesterDiff * 2, 0);

    // Online boost (+5 puntos)
    if (user.online) score += 5;

    return Math.min(Math.max(score, 0), 100);
  };

  // Función para obtener estado de conexión
  const getConnectionStatus = (userId: string, originalStatus?: 'none' | 'pending' | 'connected') => {
    return connectionStates[userId] || originalStatus || 'none';
  };

  // Filtrar y ordenar usuarios
  const filteredUsers = useMemo(() => {
    let filtered = matchUsers.map(u => ({
      ...u,
      matchPercent: calculateCompatibility(u),
    }));

    // Filtrar por tab activo
    if (activeTab === 'sent') {
      // Solo mostrar usuarios con solicitud pendiente enviada por mí
      filtered = filtered.filter(u =>
        getConnectionStatus(u.id, u.connectionStatus) === 'pending' && !incomingRequests.includes(u.id)
      );
    } else if (activeTab === 'received') {
      // Solo mostrar usuarios con solicitud pendiente recibida
      filtered = filtered.filter(u => incomingRequests.includes(u.id));
    } else if (activeTab === 'friends') {
      // Solo mostrar usuarios conectados
      filtered = filtered.filter(u => getConnectionStatus(u.id, u.connectionStatus) === 'connected');
    } else {
      // Tab 'explore': mostrar solo usuarios sin conexión o que no están en solicitudes entrantes
      filtered = filtered.filter(u =>
        getConnectionStatus(u.id, u.connectionStatus) === 'none' && !incomingRequests.includes(u.id)
      );
    }

    // Aplicar filtros adicionales solo en tab explorar
    if (activeTab === 'explore') {
      if (filters.program) {
        filtered = filtered.filter(u => u.program.toLowerCase().includes(filters.program.toLowerCase()));
      }
      if (filters.semester) {
        filtered = filtered.filter(u => u.semester.toString() === filters.semester);
      }
      if (filters.interest) {
        filtered = filtered.filter(u =>
          u.interests.some(i => i.toLowerCase().includes(filters.interest.toLowerCase()))
        );
      }
    }

    return filtered.sort((a, b) => b.matchPercent - a.matchPercent);
  }, [filters, activeTab, connectionStates, incomingRequests]);

  const handleConnect = (userId: string, currentStatus?: 'none' | 'pending' | 'connected') => {
    const status = connectionStates[userId] || currentStatus || 'none';

    if (status === 'none') {
      // Enviar solicitud
      setConnectionStates(prev => ({ ...prev, [userId]: 'pending' }));
    } else if (status === 'pending') {
      // Cancelar solicitud pendiente (toggle like Instagram)
      setConnectionStates(prev => ({ ...prev, [userId]: 'none' }));
    }
    // Si status === 'connected', no hacer nada (no se puede deshacer)
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

  const clearFilters = () => {
    setFilters({ program: '', semester: '', interest: '' });
  };

  const activeFiltersCount = [filters.program, filters.semester, filters.interest].filter(Boolean).length;

  // Nearby suggestions (when GPS is on campus)
  const nearbySuggestions = useMemo(() => {
    if (!geo.enabled || !geo.onCampus) return [];
    // Mock: return top 3 matches as "nearby" persons
    return matchUsers.slice(0, 3).map(u => ({ ...u, matchPercent: Math.max(u.matchPercent, 72) }));
  }, [geo.enabled, geo.onCampus]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A192F] relative">
      <DoodleBackground isDark={isDark} />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-lg border-b border-gray-200 dark:border-[#1E3A5F]">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2F4A] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {/* Geo status badge */}
              {geo.enabled && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate('/campus-map')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
                  style={{
                    background: geo.onCampus ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                    color: geo.onCampus ? '#10B981' : '#F59E0B',
                    border: `1px solid ${geo.onCampus ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                  }}
                >
                  <LocateFixed size={12} />
                  {geo.onCampus
                    ? geo.detectedZone?.replace('Cerca de ', '') ?? 'En campus'
                    : 'GPS activo'}
                </motion.button>
              )}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2F4A] transition-colors"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 dark:border-[#1E3A5F] shadow-sm active:scale-95 transition-transform"
              >
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white font-black text-xl">Perfect Match</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'explore' && `${filteredUsers.length} personas con tu misma sintonía`}
              {activeTab === 'sent' && `${filteredUsers.length} solicitudes enviadas`}
              {activeTab === 'received' && `${filteredUsers.length} solicitudes recibidas`}
              {activeTab === 'friends' && `${filteredUsers.length} amigos`}
            </p>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="border-t border-gray-200 dark:border-[#1E3A5F] overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-5 py-3">
            <button
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0"
              style={
                activeTab === 'explore'
                  ? { background: TEAL_GRADIENT, color: 'white' }
                  : { background: isDark ? '#112240' : '#EFF6FF', color: isDark ? '#9CA3AF' : '#1D4ED8' }
              }
            >
              <Sparkles size={14} />
              Explorar
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0"
              style={
                activeTab === 'sent'
                  ? { background: TEAL_GRADIENT, color: 'white' }
                  : { background: isDark ? '#112240' : '#EFF6FF', color: isDark ? '#9CA3AF' : '#1D4ED8' }
              }
            >
              <Send size={14} />
              Enviadas
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0"
              style={
                activeTab === 'received'
                  ? { background: TEAL_GRADIENT, color: 'white' }
                  : { background: isDark ? '#112240' : '#EFF6FF', color: isDark ? '#9CA3AF' : '#1D4ED8' }
              }
            >
              <UserPlus size={14} />
              Recibidas
              {incomingRequests.length > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[9px] font-black"
                  style={{ background: 'rgba(239,68,68,1)', color: 'white' }}
                >
                  {incomingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0"
              style={
                activeTab === 'friends'
                  ? { background: TEAL_GRADIENT, color: 'white' }
                  : { background: isDark ? '#112240' : '#EFF6FF', color: isDark ? '#9CA3AF' : '#1D4ED8' }
              }
            >
              <UserCheck size={14} />
              Amigos
            </button>
          </div>
        </div>

        {/* Filtros panel estilo Parches - Solo visible en explorar */}
        {activeTab === 'explore' && (
        <div className="border-t border-gray-200 dark:border-[#1E3A5F]">
          <div className="px-5 py-4 space-y-4">
                {/* Programa filter */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Programa
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                      onClick={() => setFilters({ ...filters, program: '' })}
                      className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all"
                      style={
                        !filters.program
                          ? { background: TEAL_GRADIENT, color: 'white' }
                          : { background: '#EFF6FF', color: '#1D4ED8' }
                      }
                    >
                      Todos
                    </button>
                    {uniquePrograms.map(prog => (
                      <button
                        key={prog}
                        onClick={() => setFilters({ ...filters, program: prog })}
                        className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all"
                        style={
                          filters.program === prog
                            ? { background: TEAL_GRADIENT, color: 'white' }
                            : { background: '#EFF6FF', color: '#1D4ED8' }
                        }
                      >
                        {prog.replace('Ingeniería de ', '').replace('Ingeniería ', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Semestre filter */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Semestre
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                      onClick={() => setFilters({ ...filters, semester: '' })}
                      className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all"
                      style={
                        !filters.semester
                          ? { background: TEAL_GRADIENT, color: 'white' }
                          : { background: '#EFF6FF', color: '#1D4ED8' }
                      }
                    >
                      Todos
                    </button>
                    {uniqueSemesters.map(sem => (
                      <button
                        key={sem}
                        onClick={() => setFilters({ ...filters, semester: sem.toString() })}
                        className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all"
                        style={
                          filters.semester === sem.toString()
                            ? { background: TEAL_GRADIENT, color: 'white' }
                            : { background: '#EFF6FF', color: '#1D4ED8' }
                        }
                      >
                        {sem}° sem
                      </button>
                    ))}
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 text-sm font-semibold rounded-xl bg-gray-100 dark:bg-[#112240] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2F4A] transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
          </div>
        </div>
        )}
      </div>

      {/* Feed de matches */}
      <div className="px-5 py-6 space-y-3 pb-20">

        {/* ── Nearby suggestions (GPS on campus) - Solo en explorar ── */}
        <AnimatePresence>
          {activeTab === 'explore' && nearbySuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden mb-2"
              style={{
                border: '1.5px solid rgba(16,185,129,0.3)',
                background: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)',
              }}
            >
              {/* Section header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                    <Navigation size={12} color="#10B981" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 dark:text-white">
                      Cerca de ti ahora
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {geo.detectedZone ?? 'Campus ECI'} · {nearbySuggestions.length} personas
                    </p>
                  </div>
                </div>
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
                >
                  <CheckCircle2 size={9} /> En campus
                </span>
              </div>

              {/* Nearby avatars horizontal scroll */}
              <div className="flex gap-3 px-4 pb-3 overflow-x-auto scrollbar-hide">
                {nearbySuggestions.map(user => (
                  <motion.button
                    key={user.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5"
                    style={{ width: 68 }}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-14 h-14 rounded-2xl object-cover"
                        style={{ border: '2px solid rgba(16,185,129,0.4)' }}
                      />
                      {/* Match badge */}
                      <div
                        className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white shadow"
                        style={{ background: 'linear-gradient(135deg,#10B981,#06B6D4)' }}
                      >
                        {user.matchPercent}%
                      </div>
                      {user.online && (
                        <div
                          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0A192F]"
                          style={{ background: '#10B981' }}
                        />
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-gray-800 dark:text-white text-center leading-tight truncate w-full">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[9px] text-gray-400 text-center leading-tight truncate w-full">
                      {user.semester}° sem
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── GPS CTA when disabled - Solo en explorar ── */}
        {activeTab === 'explore' && !geo.enabled && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate('/campus-map')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all active:scale-[0.98] mb-1"
            style={{
              background: isDark ? 'rgba(6,182,212,0.06)' : 'rgba(6,182,212,0.04)',
              border: '1px dashed rgba(6,182,212,0.3)',
            }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(6,182,212,0.12)' }}>
              <LocateFixed size={17} color="#06B6D4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 dark:text-white">
                Activa la geolocalización
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Descubre personas cerca de ti en el campus
              </p>
            </div>
            <span className="text-[10px] font-bold text-cyan-500">Ir al mapa →</span>
          </motion.button>
        )}

        {filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: `${TEAL}22` }}
            >
              {activeTab === 'explore' ? <Sparkles size={28} style={{ color: TEAL }} /> :
               activeTab === 'sent' ? <Send size={28} style={{ color: TEAL }} /> :
               activeTab === 'received' ? <UserPlus size={28} style={{ color: TEAL }} /> :
               <UserCheck size={28} style={{ color: TEAL }} />}
            </div>
            <h3 className="text-gray-800 dark:text-white font-bold mb-1">
              {activeTab === 'explore' && 'No hay resultados'}
              {activeTab === 'sent' && 'No tienes solicitudes enviadas'}
              {activeTab === 'received' && 'No tienes solicitudes pendientes'}
              {activeTab === 'friends' && 'Aún no tienes amigos'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'explore' && 'Intenta ajustar los filtros para ver más sugerencias'}
              {activeTab === 'sent' && 'Empieza a conectar con personas en la sección Explorar'}
              {activeTab === 'received' && 'Las solicitudes que recibas aparecerán aquí'}
              {activeTab === 'friends' && 'Acepta solicitudes o conecta con nuevas personas'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filteredUsers.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/user/${user.id}`)}
                className="bg-white dark:bg-[#112240] rounded-lg p-2 shadow-sm border border-gray-100 dark:border-[#1E3A5F] cursor-pointer hover:shadow-md transition-all active:scale-[0.98] flex flex-col"
              >
                {/* Avatar */}
                <div className="relative mb-1.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full aspect-square rounded-md object-cover"
                  />
                  <div
                    className="absolute -top-1 -right-1 px-1 py-0.5 rounded-full text-[8px] font-bold text-white shadow-md"
                    style={{ background: TEAL_GRADIENT }}
                  >
                    {user.matchPercent}%
                  </div>
                  {user.online && (
                    <div
                      className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#112240]"
                      style={{ background: TEAL }}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-white font-bold text-[11px] truncate mb-0.5">
                    {user.name.split(' ')[0]}, {user.age}
                  </h3>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate mb-1">
                    {user.program.replace('Ingeniería de ', '').replace('Ingeniería ', '')} · {user.semester}°
                  </p>

                  <div className="flex gap-0.5 flex-wrap mb-1">
                    {user.interests.slice(0, 1).map(interest => (
                      <span
                        key={interest}
                        className="px-1.5 py-0.5 rounded-full text-[7px] font-medium bg-blue-50 dark:bg-[#172A45] text-blue-600 dark:text-cyan-400 truncate max-w-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  <p className="text-[8px] text-gray-400 flex items-center gap-0.5 truncate">
                    <MapPin size={7} /> {user.commonPlace}
                  </p>
                </div>

                {/* Action buttons según tab */}
                {activeTab === 'received' ? (
                  // Solicitudes entrantes: mostrar aceptar/rechazar
                  <div className="mt-1.5 w-full flex gap-1">
                    <motion.button
                      onClick={e => {
                        e.stopPropagation();
                        handleRejectRequest(user.id);
                      }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-1 py-1 rounded-md flex items-center justify-center gap-0.5 transition-all text-white text-[9px] font-semibold"
                      style={{ background: '#EF4444' }}
                    >
                      <X size={10} />
                      <span>Rechazar</span>
                    </motion.button>
                    <motion.button
                      onClick={e => {
                        e.stopPropagation();
                        handleAcceptRequest(user.id);
                      }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-1 py-1 rounded-md flex items-center justify-center gap-0.5 transition-all text-white text-[9px] font-semibold"
                      style={{ background: '#10B981' }}
                    >
                      <CheckCircle2 size={10} />
                      <span>Aceptar</span>
                    </motion.button>
                  </div>
                ) : activeTab === 'sent' ? (
                  // Solicitudes enviadas: mostrar cancelar
                  <motion.button
                    onClick={e => {
                      e.stopPropagation();
                      handleConnect(user.id, user.connectionStatus);
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="mt-1.5 w-full py-1 rounded-md flex items-center justify-center gap-0.5 transition-all text-white text-[9px] font-semibold"
                    style={{ background: '#F59E0B' }}
                  >
                    <X size={10} />
                    <span>Cancelar</span>
                  </motion.button>
                ) : activeTab === 'friends' ? (
                  // Amigos: mostrar eliminar (requiere confirmación)
                  <motion.button
                    onClick={e => {
                      e.stopPropagation();
                      setShowUnfriendModal(user.id);
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="mt-1.5 w-full py-1 rounded-md flex items-center justify-center gap-0.5 transition-all text-white text-[9px] font-semibold"
                    style={{ background: '#EF4444' }}
                  >
                    <X size={10} />
                    <span>Eliminar</span>
                  </motion.button>
                ) : (
                  // Explorar: botón normal de conectar
                  <motion.button
                    onClick={e => {
                      e.stopPropagation();
                      handleConnect(user.id, user.connectionStatus);
                    }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 0.3,
                      ease: 'easeInOut',
                    }}
                    key={`${user.id}-${getConnectionStatus(user.id, user.connectionStatus)}`}
                    className="mt-1.5 w-full py-1 rounded-md flex items-center justify-center gap-0.5 transition-colors text-white text-[9px] font-semibold"
                    style={{
                      background: getConnectionStatus(user.id, user.connectionStatus) === 'connected' ? '#10B981' :
                                  getConnectionStatus(user.id, user.connectionStatus) === 'pending' ? '#F59E0B' :
                                  GRADIENT
                    }}
                  >
                    {getConnectionStatus(user.id, user.connectionStatus) === 'connected' ? (
                      <>
                        <Heart size={10} className="text-white" fill="white" />
                        <span>Conectado</span>
                      </>
                    ) : getConnectionStatus(user.id, user.connectionStatus) === 'pending' ? (
                      <>
                        <Clock size={10} className="text-white" />
                        <span>Pendiente</span>
                      </>
                    ) : (
                      <>
                        <Heart size={10} className="text-white" />
                        <span>Conectar</span>
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de perfil detallado */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="bg-white dark:bg-[#0A192F] rounded-t-3xl shadow-2xl">
                <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-lg border-b border-gray-200 dark:border-[#1E3A5F] px-5 py-4 rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-gray-900 dark:text-white font-bold text-lg">
                      Perfil de {selectedUser.name}
                    </h2>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-24 h-24 rounded-2xl object-cover"
                      />
                      {selectedUser.online && (
                        <div
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-[#0A192F]"
                          style={{ background: TEAL }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-1">
                        {selectedUser.name}, {selectedUser.age}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {selectedUser.program}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-[#112240] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedUser.matchPercent}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: TEAL_GRADIENT }}
                          />
                        </div>
                        <span className="text-sm font-bold" style={{ color: TEAL }}>
                          {selectedUser.matchPercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedUser.bio && (
                    <div className="mb-6">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">ACERCA DE</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedUser.bio}</p>
                    </div>
                  )}

                  <div className="mb-6 space-y-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">DETALLES</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-[#112240] flex items-center justify-center">
                        <Star size={16} style={{ color: TEAL }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Programa</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedUser.program}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-[#112240] flex items-center justify-center">
                        <Sparkles size={16} style={{ color: TEAL }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Semestre</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedUser.semester}° semestre</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-[#112240] flex items-center justify-center">
                        <MapPin size={16} style={{ color: TEAL }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Te pueden conocer en</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedUser.commonPlace}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">INTERESES</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedUser.interests.map(interest => (
                        <span
                          key={interest}
                          className="px-3 py-1.5 rounded-xl text-sm font-medium bg-blue-50 dark:bg-[#112240] text-blue-600 dark:text-cyan-400"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {getConnectionStatus(selectedUser.id, selectedUser.connectionStatus) === 'connected' ? (
                    <div
                      className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2"
                      style={{ background: '#10B981' }}
                    >
                      <CheckCircle2 size={18} />
                      ✓ Conectados
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => handleConnect(selectedUser.id, selectedUser.connectionStatus)}
                      whileTap={{ scale: 0.97 }}
                      animate={{
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 0.3,
                        ease: 'easeInOut',
                      }}
                      key={`${selectedUser.id}-${getConnectionStatus(selectedUser.id, selectedUser.connectionStatus)}`}
                      className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-colors"
                      style={{
                        background: getConnectionStatus(selectedUser.id, selectedUser.connectionStatus) === 'pending' ? '#F59E0B' : GRADIENT
                      }}
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

      {/* Modal de confirmación para anular amistad */}
      <AnimatePresence>
        {showUnfriendModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUnfriendModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-[#112240] rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                  <Heart size={32} className="text-red-600 dark:text-red-400" fill="currentColor" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">
                  ¿Anular conexión?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Esta acción eliminará la conexión con esta persona. Podrás volver a conectar más tarde.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUnfriendModal(null)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#1A2F4A] text-gray-700 dark:text-gray-300 font-semibold transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleUnfriend(showUnfriendModal)}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold transition-all active:scale-95 hover:bg-red-700"
                >
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