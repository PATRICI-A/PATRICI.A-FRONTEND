import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Search, Plus, TrendingUp, MapPin, Clock, ChevronRight, Heart, Users, BookOpen, Sparkles, Lock, Flame, LocateFixed, Navigation } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { parches, matchUsers, vibraCategories, events, monas, GRADIENT, PINK, ORANGE, TEAL, TEAL_GRADIENT, GOLD_GRADIENT, GOLD_LIGHT } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
export function HomePage() {
  const navigate = useNavigate();
  const { currentUser, isDark, geo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [connectionStates, setConnectionStates] = useState<Record<string, 'none' | 'pending' | 'connected'>>({});
  const handleQuickConnect = (userId: string, currentStatus?: 'none' | 'pending' | 'connected') => {
    const status = connectionStates[userId] || currentStatus || 'none';
    if (status === 'none') {
      setConnectionStates(prev => ({ ...prev, [userId]: 'pending' }));
    }
  };
  const getConnectionStatus = (userId: string, originalStatus?: 'none' | 'pending' | 'connected') => {
    return connectionStates[userId] || originalStatus || 'none';
  };
  const featuredEvent = events[0];
  const topParches = parches.slice(0, 3);
  const topMatches = matchUsers.slice(0, 4);
  const unlockedMonas = monas.filter(m => m.unlocked);
  const totalMonas = monas.length;
  const albumPercent = Math.round((unlockedMonas.length / totalMonas) * 100);
  const recentMonas = unlockedMonas.slice(-4);
  const nextMona = monas.find(m => !m.unlocked);
  return (
    <div className="flex flex-col min-h-screen pb-4">
      {}
      <div className="px-5 pt-5 pb-4">
        <div className="mb-4">
          <p className="text-base text-gray-400 dark:text-gray-500 mb-0.5">
            {new Date().getHours() < 12 ? 'Buenos días' : new Date().getHours() < 18 ? 'Buenas tardes' : 'Buenas noches'} 👋
          </p>
          <h1 className="text-gray-900 dark:text-white">¿Qué vibra hoy?</h1>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="¿Qué parche buscas hoy?"
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none transition-all text-sm"
            style={{
              background: isDark ? 'rgba(17,34,64,0.9)' : 'rgba(253,252,248,0.9)',
              boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.25), inset 0 1px 2px rgba(0,0,0,0.2)' : '0 2px 12px rgba(10,25,47,0.08)',
              border: isDark ? '1px solid rgba(30,58,95,0.5)' : '1px solid rgba(10,25,47,0.07)',
            }}
          />
        </div>
      </div>
      {}
      <section className="px-5 mb-6">
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => navigate('/monas')}
          className="w-full rounded-3xl overflow-hidden text-left relative"
          style={isDark ? {
            background: 'linear-gradient(135deg, #0F1923 0%, #1C2E3E 40%, #0D1F30 100%)',
            boxShadow: '0 8px 32px rgba(245,158,11,0.22), 0 2px 8px rgba(0,0,0,0.5)',
            border: '1.5px solid rgba(245,158,11,0.28)',
          } : {
            background: 'linear-gradient(135deg, #FDFCF8 0%, #F7F4ED 50%, #F0EAD8 100%)',
            boxShadow: '0 8px 40px rgba(212,137,10,0.18), 0 2px 12px rgba(10,25,47,0.08)',
            border: '1.5px solid rgba(212,137,10,0.22)',
          }}
        >
          {}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: isDark
                ? 'repeating-linear-gradient(60deg, transparent, transparent 20px, rgba(245,158,11,0.06) 20px, rgba(245,158,11,0.06) 22px)'
                : 'repeating-linear-gradient(60deg, transparent, transparent 24px, rgba(212,137,10,0.05) 24px, rgba(212,137,10,0.05) 26px)',
            }}
          />
          <div className="relative p-4">
            {}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: GOLD_GRADIENT, boxShadow: '0 4px 12px rgba(217,119,6,0.5)' }}
                >
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-sm leading-tight" style={{ color: isDark ? '#FFFFFF' : '#0A192F' }}>⭐ Álbum de Patricias</p>
                  <p className="text-[10px]" style={{ color: GOLD_LIGHT }}>patrici.a · Colección exclusiva</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] font-black px-2 py-1 rounded-full"
                  style={{ background: `${GOLD_LIGHT}22`, color: GOLD_LIGHT, border: `1px solid ${GOLD_LIGHT}44` }}
                >
                  {unlockedMonas.length}/{totalMonas}
                </span>
                <ChevronRight size={16} style={{ color: GOLD_LIGHT }} />
              </div>
            </div>
            {}
            <div className="flex items-center gap-1.5 mb-4">
              {recentMonas.map((mona, i) => (
                <motion.div
                  key={mona.id}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center relative flex-shrink-0"
                  style={{
                    background: mona.color,
                    boxShadow: `0 3px 10px ${mona.color}55`,
                  }}
                >
                  <EmojiIcon emoji={mona.emoji} size={16} color="white" strokeWidth={2} />
                  {}
                  <div
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#0A192F]"
                    style={{
                      background: mona.rarity === 'legendario' ? GOLD_LIGHT :
                                  mona.rarity === 'épico' ? '#8B5CF6' :
                                  mona.rarity === 'raro' ? '#06B6D4' : '#6B7280',
                    }}
                  />
                </motion.div>
              ))}
              {}
              {nextMona && (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px dashed rgba(245,158,11,0.3)' }}
                >
                  <Lock size={14} style={{ color: GOLD_LIGHT, opacity: 0.5 }} />
                </div>
              )}
              {}
              {totalMonas - recentMonas.length - 1 > 0 && (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1.5px solid rgba(245,158,11,0.3)' }}
                >
                  <span className="text-[9px] font-black" style={{ color: GOLD_LIGHT }}>
                    +{totalMonas - recentMonas.length - 1}
                  </span>
                </div>
              )}
            </div>
            {}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px]" style={{ color: isDark ? '#9CA3AF' : 'rgba(10,25,47,0.5)' }}>Progreso del álbum</span>
                <span className="text-[10px] font-black" style={{ color: GOLD_LIGHT }}>{albumPercent}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(10,25,47,0.1)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${albumPercent}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: GOLD_GRADIENT }}
                />
              </div>
              {nextMona && (
                <p className="text-[9px] mt-1.5" style={{ color: isDark ? '#6B7280' : 'rgba(10,25,47,0.45)' }}>
                  Próxima: <span style={{ color: GOLD_LIGHT }}>{nextMona.name}</span> — {nextMona.condition}
                </p>
              )}
            </div>
          </div>
          {}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{
              background: isDark ? 'rgba(245,158,11,0.10)' : 'rgba(212,137,10,0.07)',
              borderTop: isDark ? '1px solid rgba(245,158,11,0.18)' : '1px solid rgba(212,137,10,0.15)',
            }}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={13} style={{ color: GOLD_LIGHT }} />
              <span className="text-[11px] font-bold" style={{ color: isDark ? GOLD_LIGHT : '#92600A' }}>
                Escanea sobres QR para desbloquear patricias
              </span>
            </div>
            <Sparkles size={14} style={{ color: GOLD_LIGHT }} />
          </div>
        </motion.button>
      </section>
      {}
      <section className="px-5 mb-6">
        {!geo.enabled ? (
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => navigate('/campus-map')}
            className="w-full rounded-2xl overflow-hidden text-left relative"
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(59,130,246,0.08) 100%)',
              border: '1.5px solid rgba(6,182,212,0.3)',
              boxShadow: '0 4px 16px rgba(6,182,212,0.15)',
            }}
          >
            <div className="p-4 flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: TEAL_GRADIENT, boxShadow: '0 4px 12px rgba(6,182,212,0.4)' }}
              >
                <MapPin size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm" style={{ color: TEAL }}>
                  Descubre lo que tu campus tiene en tiempo real para ti
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Toca aquí para explorar el mapa del campus
                </p>
              </div>
              <ChevronRight size={16} style={{ color: TEAL }} className="flex-shrink-0" />
            </div>
          </motion.button>
        ) : geo.onCampus ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.15)' }}
                  >
                    <Navigation size={12} color="#10B981" />
                  </div>
                  <h2 className="text-gray-800 dark:text-white font-semibold">Cerca de ti ahora</h2>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <LocateFixed size={10} className="text-green-500" />
                  {geo.detectedZone ?? 'Campus ECI'} · {topParches.length} parches activos
                </p>
              </div>
              <button
                onClick={() => navigate('/campus-map')}
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: TEAL }}
              >
                Ver mapa <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {topParches.slice(0, 2).map((parche, i) => (
                <motion.div
                  key={parche.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/parches/${parche.id}`)}
                  className="rounded-2xl p-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-all"
                  style={{
                    background: isDark ? '#112240' : 'rgba(253,252,248,0.95)',
                    boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 16px rgba(10,25,47,0.07)',
                    border: '1px solid rgba(16,185,129,0.2)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: parche.coverColor }}
                  >
                    <EmojiIcon emoji={parche.emoji} size={20} color="white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-800 dark:text-white text-xs truncate">{parche.name}</h3>
                      {parche.trending && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold" style={{ color: ORANGE }}>
                          <Flame size={9} />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={9} className="text-green-500" /> {parche.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Users size={9} /> {parche.members}/{parche.maxMembers}
                      </span>
                    </div>
                  </div>
                  <div
                    className="px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
                  >
                    <LocateFixed size={8} />
                    <span>Cerca</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(251,146,60,0.08) 100%)',
              border: '1.5px solid rgba(245,158,11,0.3)',
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2"
              style={{ background: 'rgba(245,158,11,0.15)' }}
            >
              <MapPin size={20} className="text-orange-500" />
            </div>
            <p className="text-xs font-bold text-gray-800 dark:text-white mb-1">
              Estás fuera del campus
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              Ven al campus para descubrir parches y personas cerca de ti
            </p>
          </motion.div>
        )}
      </section>
      {}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-800 dark:text-white font-semibold">🌈 Explora por Vibras</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {vibraCategories.map(vibra => {
            const categoryMap: Record<string, string> = {
              'Live Music': 'Música',
              'Outdoor': 'Deporte',
              'Study': 'Estudio',
              'Foodie': 'Social',
              'Gaming': 'Tecnología',
              'Arte': 'Arte',
            };
            return (
              <button
                key={vibra.id}
                onClick={() => {
                  const category = categoryMap[vibra.name] || vibra.name;
                  navigate(`/parches?tab=explorar&category=${encodeURIComponent(category)}`);
                }}
                className="flex-shrink-0 relative overflow-hidden rounded-2xl transition-all active:scale-95"
                style={{ width: '100px', height: '80px' }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: vibra.gradient,
                    opacity: 0.85,
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <span style={{ fontSize: '22px', lineHeight: 1 }}>{vibra.emoji}</span>
                  <span className="text-white text-[11px] font-semibold">{vibra.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
      {}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-gray-800 dark:text-white font-semibold">🎯 Perfect Match</h2>
            <p className="text-xs text-gray-400">Personas con tu misma sintonía</p>
          </div>
          <button
            onClick={() => navigate('/matches')}
            className="text-xs font-semibold flex items-center gap-1 text-[#E91E63] dark:text-cyan-400 transition-colors"
          >
            Ver todos <ChevronRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {topMatches.slice(0, 4).map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/user/${user.id}`)}
              className="rounded-2xl p-3 flex flex-col items-center cursor-pointer active:scale-[0.98] transition-all"
              style={{
                background: isDark ? '#112240' : 'rgba(253,252,248,0.95)',
                boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.2)' : '0 2px 16px rgba(10,25,47,0.07)',
                border: isDark ? '1px solid rgba(30,58,95,0.3)' : '1px solid rgba(10,25,47,0.06)',
              }}
            >
              <div className="relative mb-2">
                <div
                  className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0A192F 0%, #1E3A5F 100%)' }}
                >
                  <span className="text-white font-bold text-2xl select-none">
                    {user.name.charAt(0)}
                  </span>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div
                  className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white shadow"
                  style={{ background: TEAL_GRADIENT }}
                >
                  {user.matchPercent}%
                </div>
                {user.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#112240]" style={{ background: TEAL }} />
                )}
              </div>
              <div className="w-full text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <h3 className="text-gray-800 dark:text-white font-semibold text-sm truncate">{user.name.split(' ')[0]}</h3>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
                </div>
                <div className="flex gap-1 justify-center flex-wrap mb-2">
                  {user.interests.slice(0, 2).map(interest => (
                    <span key={interest} className="px-2 py-0.5 rounded-full text-[9px] bg-gray-100 dark:bg-[#172A45] text-gray-600 dark:text-gray-400">
                      {interest}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 truncate flex items-center justify-center gap-1"><MapPin size={9} /> {user.commonPlace}</p>
              </div>
              <button
                className="w-full mt-2 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all active:scale-95 text-white text-xs font-semibold"
                style={{
                  background: getConnectionStatus(user.id, user.connectionStatus) === 'connected' ? '#10B981' :
                              getConnectionStatus(user.id, user.connectionStatus) === 'pending' ? '#F59E0B' :
                              GRADIENT
                }}
                onClick={e => {
                  e.stopPropagation();
                  handleQuickConnect(user.id, user.connectionStatus);
                }}
              >
                {getConnectionStatus(user.id, user.connectionStatus) === 'connected' ? (
                  <>
                    <Heart size={14} className="text-white" fill="white" />
                    <span>Conectado</span>
                  </>
                ) : getConnectionStatus(user.id, user.connectionStatus) === 'pending' ? (
                  <>
                    <Clock size={14} className="text-white" />
                    <span>Pendiente</span>
                  </>
                ) : (
                  <>
                    <Heart size={14} className="text-white" />
                    <span>Conectar</span>
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </section>
      {}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-gray-800 dark:text-white font-semibold">📅 Eventos</h2>
            <p className="text-xs text-gray-400">Lo que está pasando en el campus</p>
          </div>
          <button onClick={() => navigate('/events')} className="text-xs font-semibold flex items-center gap-1" style={{ color: PINK }}>
            Ver más <ChevronRight size={12} />
          </button>
        </div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(`/events`)}
          className="relative rounded-2xl overflow-hidden mb-4 cursor-pointer active:scale-[0.98] transition-all"
          style={{ height: '180px' }}
        >
          <img
            src={featuredEvent.coverImage}
            alt={featuredEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)' }} />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: GRADIENT }}>
              EVENTO OFICIAL
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold mb-1">{featuredEvent.title}</h3>
            <p className="text-white/70 text-xs mb-2 line-clamp-1">{featuredEvent.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/70 text-xs">
                <span className="flex items-center gap-1"><Clock size={10} />{featuredEvent.time}</span>
                <span className="flex items-center gap-1"><Users size={10} /> {featuredEvent.attendees}+ van</span>
              </div>
              <button
                className="px-3 py-1.5 rounded-full text-white text-xs font-semibold"
                style={{ background: GRADIENT }}
                onClick={e => { e.stopPropagation(); }}
              >
                Inscribirme
              </button>
            </div>
          </div>
        </motion.div>
        {}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {}
          {events.slice(1).map(event => (
            <motion.button
              key={event.id}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/events')}
              className="flex-shrink-0 rounded-2xl overflow-hidden text-left flex flex-col"
              style={{
                width: 155,
                height: 180,
                background: isDark ? '#112240' : 'white',
                border: `1.5px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {}
              <div className="h-16 flex items-center justify-center relative" style={{ background: event.coverGradient }}>
                <EmojiIcon emoji={event.emoji} size={26} color="white" strokeWidth={2} />
                {event.official && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.35)' }}>
                    OFICIAL
                  </div>
                )}
                <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.35)' }}>
                  <Users size={7} /> {event.attendees}
                </div>
              </div>
              {}
              <div className="p-2.5">
                <p className="text-[11px] font-black text-gray-900 dark:text-white leading-tight line-clamp-1 mb-1">{event.title}</p>
                <p className="text-[9px] text-gray-400 flex items-center gap-1 mb-1.5">
                  <Clock size={8} /> {event.date} · {event.time}
                </p>
                <p className="text-[9px] text-gray-400 flex items-center gap-1 line-clamp-1">
                  <MapPin size={8} /> {event.location}
                </p>
                <div className="mt-2">
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: GRADIENT }}
                  >
                    Inscribirme
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
          {}
          {parches.slice(0, 5).map(parche => (
            <motion.button
              key={`p-${parche.id}`}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/parches/${parche.id}`)}
              className="flex-shrink-0 rounded-2xl overflow-hidden text-left flex flex-col"
              style={{
                width: 155,
                height: 180,
                background: isDark ? '#112240' : 'white',
                border: `1.5px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {}
              <div className="h-16 flex items-center justify-center relative" style={{ background: parche.coverColor }}>
                <EmojiIcon emoji={parche.emoji} size={26} color="white" strokeWidth={2} />
                {parche.trending && (
                  <div className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <TrendingUp size={7} /> HOT
                  </div>
                )}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold" style={{ background: 'rgba(0,0,0,0.35)', color: 'white' }}>
                  {parche.type === 'public' ? '🌐' : '🔒'}
                </div>
              </div>
              {}
              <div className="p-2.5">
                <p className="text-[11px] font-black text-gray-900 dark:text-white leading-tight line-clamp-1 mb-1">{parche.name}</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-tight mb-1.5">{parche.description.slice(0, 52)}...</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {parche.memberAvatars.slice(0, 3).map((av, i) => (
                      <img key={i} src={av} alt="" className="w-5 h-5 rounded-full object-cover border border-white dark:border-[#112240]" />
                    ))}
                  </div>
                  <span className="text-[9px] text-gray-400">{parche.members}/{parche.maxMembers}</span>
                </div>
              </div>
            </motion.button>
          ))}
          {}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/events')}
            className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center gap-2 flex-shrink-0"
            style={{
              width: 100,
              background: isDark ? '#112240' : '#F0F7FF',
              border: `1.5px dashed ${isDark ? '#1E3A5F' : '#BFDBFE'}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: GRADIENT }}
            >
              <ChevronRight size={18} color="white" />
            </div>
            <span className="text-[10px] font-bold text-center px-2" style={{ color: PINK }}>Ver todos los eventos</span>
          </motion.button>
        </div>
      </section>
      {}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-gray-800 dark:text-white font-semibold">🤝 Parches Sugeridos</h2>
            <p className="text-xs text-gray-400">Basados en tus intereses</p>
          </div>
          <button onClick={() => navigate('/parches')} className="text-xs font-semibold flex items-center gap-1" style={{ color: PINK }}>
            Ver todos <ChevronRight size={12} />
          </button>
        </div>
        {}
        {topParches[0] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/parches/${topParches[0].id}`)}
            className="rounded-2xl p-4 mb-3 cursor-pointer active:scale-[0.98] transition-all"
            style={{ background: topParches[0].coverColor }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)' }}
                >
                  <EmojiIcon emoji={topParches[0].emoji} size={20} color="white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-white font-bold">{topParches[0].name}</h3>
                  <p className="text-white/70 text-xs">{topParches[0].description}</p>
                </div>
              </div>
              {topParches[0].trending && (
                <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center gap-1">
                  <Flame size={9} /> TRENDING
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {topParches[0].memberAvatars.slice(0, 3).map((av, i) => (
                    <img key={i} src={av} alt="" className="w-6 h-6 rounded-full object-cover border-2 border-white/50" />
                  ))}
                </div>
                <span className="text-white/80 text-xs">+{topParches[0].members - 3} más</span>
              </div>
              <button
                className="px-4 py-1.5 rounded-full bg-white text-xs font-bold"
                style={{ color: PINK }}
                onClick={e => { e.stopPropagation(); navigate(`/parches/${topParches[0].id}`); }}
              >
                Unirme
              </button>
            </div>
          </motion.div>
        )}
        {}
        <div className="grid grid-cols-2 gap-3">
          {topParches.slice(1, 3).map(parche => (
            <button
              key={parche.id}
              onClick={() => navigate(`/parches/${parche.id}`)}
              className="rounded-2xl p-4 text-left active:scale-[0.98] transition-all"
              style={{
                background: isDark ? '#112240' : 'rgba(253,252,248,0.95)',
                boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.2)' : '0 2px 16px rgba(10,25,47,0.07)',
                border: isDark ? '1px solid rgba(30,58,95,0.3)' : '1px solid rgba(10,25,47,0.06)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2"
                style={{ background: parche.coverColor }}
              >
                <EmojiIcon emoji={parche.emoji} size={18} color="white" strokeWidth={2} />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white mb-0.5">{parche.name}</p>
              <p className="text-[11px] text-gray-400">{parche.description.slice(0, 40)}...</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
                <span className="text-[10px] text-gray-400">{parche.members} miembros</span>
              </div>
            </button>
          ))}
        </div>
      </section>
      {}
      <section className="px-5 mb-4">
        {parches.slice(4, 5).map(parche => (
          <button
            key={parche.id}
            onClick={() => navigate(`/parches/${parche.id}`)}
            className="w-full rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-all"
            style={{
              background: isDark ? '#112240' : 'rgba(253,252,248,0.95)',
              boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.2)' : '0 2px 16px rgba(10,25,47,0.07)',
              border: isDark ? '1px solid rgba(30,58,95,0.3)' : '1px solid rgba(10,25,47,0.06)',
            }}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1763890965393-1cea435581ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100"
                alt={parche.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: GRADIENT }}>
                NUEVO
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><MapPin size={10} /> A 500m en el campus</p>
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{parche.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{parche.description.slice(0, 50)}...</p>
              <p className="text-xs font-medium mt-1" style={{ color: PINK }}>{parche.members} miembros activos</p>
            </div>
          </button>
        ))}
      </section>
      {}
      <button
        onClick={() => navigate('/parches/create')}
        className="fixed bottom-24 right-5 md:bottom-8 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all active:scale-95 z-30"
        style={{ background: GRADIENT }}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}