import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Search, Plus, TrendingUp, MapPin, Clock, ChevronRight, ChevronLeft, Heart, Users, BookOpen, Sparkles, Lock, Flame, LocateFixed, Navigation } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { parches, matchUsers, vibraCategories, events, monas, GRADIENT, PINK, ORANGE, TEAL, TEAL_GRADIENT, GOLD_GRADIENT, GOLD_LIGHT } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import patySelfie from '../assets/PatySelfie.png';
import patyAlbum from '../assets/Album.png';
import mascotFutbol from '../assets/mascota_futbol.png';
import vibraMusica from '../assets/Musica-removebg-preview.png';
import vibraAireLibre from '../assets/AireLibre-removebg-preview.png';
import vibraEstudio from '../assets/Estudio-removebg-preview.png';
import vibraGastronomia from '../assets/Gastronomia-removebg-preview.png';
import vibraVideojuegos from '../assets/Videojuegos-removebg-preview.png';
import vibraPintura from '../assets/Pintura-removebg-preview.png';
export function HomePage() {
  const navigate = useNavigate();
  const { currentUser, isDark, geo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [connectionStates, setConnectionStates] = useState<Record<string, 'none' | 'pending' | 'connected'>>({});

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const autoplayTimerRef = useRef<any>(null);

  const startAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    autoplayTimerRef.current = setInterval(() => {
      setCurrentEventIndex(prev => (prev + 1) % events.length);
    }, 6000);
  };

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  const handleNextEvent = () => {
    setCurrentEventIndex(prev => (prev + 1) % events.length);
    startAutoplay();
  };

  const handlePrevEvent = () => {
    setCurrentEventIndex(prev => (prev === 0 ? events.length - 1 : prev - 1));
    startAutoplay();
  };

  const handleSelectEvent = (index: number) => {
    setCurrentEventIndex(index);
    startAutoplay();
  };

  const parchesCarouselRef = useRef<HTMLDivElement>(null);
  const [parchesAtEnd, setParchesAtEnd] = useState(false);
  const [parchesAtStart, setParchesAtStart] = useState(true);
  const scrollParchesCarousel = (dir: 'left' | 'right') => {
    if (!parchesCarouselRef.current) return;
    parchesCarouselRef.current.scrollBy({ left: dir === 'right' ? 440 : -440, behavior: 'smooth' });
  };
  const handleParchesCarouselScroll = () => {
    if (!parchesCarouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = parchesCarouselRef.current;
    setParchesAtStart(scrollLeft <= 10);
    setParchesAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
  };

  const vibraRef = useRef<HTMLDivElement>(null);
  const [vibraAtEnd, setVibraAtEnd] = useState(false);
  const [vibraAtStart, setVibraAtStart] = useState(true);
  const scrollVibra = (dir: 'left' | 'right') => {
    if (!vibraRef.current) return;
    vibraRef.current.scrollBy({ left: dir === 'right' ? 380 : -380, behavior: 'smooth' });
  };
  const handleVibraScroll = () => {
    if (!vibraRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = vibraRef.current;
    setVibraAtStart(scrollLeft <= 10);
    setVibraAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
  };
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
    <div className="w-full md:w-4/6 md:mx-auto flex flex-col min-h-screen pb-4">
      {}
      <div className="px-5 pt-5 pb-4">
        <div className="mb-4">
          <p className="text-lg text-gray-400 dark:text-gray-500 mb-0.5">
            {new Date().getHours() < 12 ? 'Buenos días' : new Date().getHours() < 18 ? 'Buenas tardes' : 'Buenas noches'} 👋
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">¿Qué vibra hoy?</h1>
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
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full z-10"
            style={{ background: `${GOLD_LIGHT}22`, border: `1px solid ${GOLD_LIGHT}44` }}
          >
            <span className="text-xs font-black" style={{ color: GOLD_LIGHT }}>{unlockedMonas.length}/{totalMonas}</span>
            <ChevronRight size={14} style={{ color: GOLD_LIGHT }} />
          </div>
          <div className="relative p-5 flex gap-4">
            {}
            <div className="flex flex-col justify-between min-w-0" style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}>
              <div className="flex items-center mb-5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: GOLD_GRADIENT, boxShadow: '0 4px 12px rgba(217,119,6,0.5)' }}
                  >
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-black text-base leading-tight" style={{ color: isDark ? '#FFFFFF' : '#0A192F' }}>⭐ Álbum de Patricias</p>
                    <p className="text-xs" style={{ color: GOLD_LIGHT }}>patrici.a · Colección exclusiva</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-6">
                {recentMonas.map((mona, i) => (
                  <motion.div
                    key={mona.id}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center relative flex-shrink-0"
                    style={{ background: mona.color, boxShadow: `0 3px 10px ${mona.color}55` }}
                  >
                    <EmojiIcon emoji={mona.emoji} size={20} color="white" strokeWidth={2} />
                    <div
                      className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border border-[#0A192F]"
                      style={{
                        background: mona.rarity === 'legendario' ? GOLD_LIGHT :
                                    mona.rarity === 'épico' ? '#8B5CF6' :
                                    mona.rarity === 'raro' ? '#06B6D4' : '#6B7280',
                      }}
                    />
                  </motion.div>
                ))}
                {nextMona && (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px dashed rgba(245,158,11,0.3)' }}
                  >
                    <Lock size={20} style={{ color: GOLD_LIGHT, opacity: 0.5 }} />
                  </div>
                )}
                {totalMonas - recentMonas.length - 1 > 0 && (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1.5px solid rgba(245,158,11,0.3)' }}
                  >
                    <span className="text-xs font-black" style={{ color: GOLD_LIGHT }}>
                      +{totalMonas - recentMonas.length - 1}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold" style={{ color: isDark ? '#9CA3AF' : 'rgba(10,25,47,0.5)' }}>Progreso del álbum</span>
                  <span className="text-sm font-black" style={{ color: GOLD_LIGHT }}>{albumPercent}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(10,25,47,0.1)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${albumPercent}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: GOLD_GRADIENT }}
                  />
                </div>
                {nextMona && (
                  <p className="text-xs mt-2" style={{ color: isDark ? '#6B7280' : 'rgba(10,25,47,0.45)' }}>
                    Próxima: <span style={{ color: GOLD_LIGHT }}>{nextMona.name}</span> — {nextMona.condition}
                  </p>
                )}
              </div>
            </div>
            {}
            <div className="hidden sm:flex flex-col items-center justify-center" style={{ flex: '0 0 33.333%' }}>
              <img
                src={patyAlbum}
                alt=""
                className="w-full h-full object-contain pointer-events-none"
                style={{ opacity: 0.65, maxHeight: '270px' }}
              />
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
              <BookOpen size={16} style={{ color: GOLD_LIGHT }} />
              <span className="text-[11px] font-bold" style={{ color: isDark ? GOLD_LIGHT : '#92600A' }}>
                Escanea sobres QR para desbloquear patricias
              </span>
            </div>
            <Sparkles size={18} style={{ color: GOLD_LIGHT }} />
          </div>
        </motion.button>
      </section>
      {}
      <section className="px-5 mb-6">
        {!geo.enabled ? (
          <motion.button
            whileHover={{ scale: 1.015, translateY: -2 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => navigate('/campus-map')}
            className="w-full rounded-[2rem] overflow-hidden text-left relative group transition-all duration-300"
            style={isDark ? {
              background: 'linear-gradient(135deg, #0A192F 0%, #0D2C54 60%, #081B33 100%)',
              border: '1.5px solid rgba(6,182,212,0.3)',
              boxShadow: '0 12px 32px rgba(6,182,212,0.18), 0 4px 12px rgba(0,0,0,0.4)',
            } : {
              background: 'linear-gradient(135deg, #F0FDFA 0%, #E0F2FE 60%, #E0E7FF 100%)',
              border: '1.5px solid rgba(14,165,233,0.22)',
              boxShadow: '0 12px 32px rgba(14,165,233,0.1), 0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            
            <div
              className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-10 mix-blend-overlay"
              style={{
                backgroundImage: 'radial-gradient(circle, #3B82F6 1.5px, transparent 1.5px)',
                backgroundSize: '20px 20px',
              }}
            />

            
            <div className="absolute top-0 right-1/4 w-36 h-36 rounded-full bg-cyan-400/20 dark:bg-cyan-500/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-0 right-0 w-44 h-44 rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

            <div className="relative z-20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 flex-1 min-w-0">
                
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative"
                  style={{ background: TEAL_GRADIENT, boxShadow: '0 8px 24px rgba(6,182,212,0.35)' }}
                >
                  <MapPin size={28} className="text-white" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  
                  <div 
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase mb-2"
                    style={isDark ? {
                      background: 'rgba(6,182,212,0.15)',
                      color: '#22D3EE',
                      border: '1px solid rgba(6,182,212,0.3)',
                    } : {
                      background: 'rgba(14,165,233,0.1)',
                      color: '#0284C7',
                      border: '1px solid rgba(14,165,233,0.2)',
                    }}
                  >
                    <span>MAPA EN VIVO</span>
                  </div>

                  <h3 
                    className="font-black text-lg md:text-xl tracking-tight mb-1"
                    style={{ color: isDark ? '#FFFFFF' : '#0A192F' }}
                  >
                    Descubre tu campus en tiempo real
                  </h3>
                  
                  <p 
                    className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl"
                  >
                    Encuentra parches activos, amigos libres y eventos especiales cerca de ti ahora mismo. ¡No te pierdas de nada!
                  </p>

                  
                  <div className="flex items-center gap-3.5 mt-2.5 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      12 Parches hoy
                    </span>
                    <span className="text-gray-300 dark:text-gray-700">·</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      5 Eventos activos
                    </span>
                  </div>
                </div>
              </div>

              
              <div className="flex-shrink-0 self-end md:self-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-5 py-3 rounded-2xl flex items-center gap-2 text-white font-black text-xs md:text-sm shadow-md cursor-pointer transition-all duration-300"
                  style={{ 
                    background: TEAL_GRADIENT,
                    boxShadow: '0 6px 20px rgba(6,182,212,0.3)'
                  }}
                >
                  <span>Explorar Campus</span>
                  <ChevronRight size={16} />
                </motion.div>
              </div>
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
                    <Navigation size={16} color="#10B981" />
                  </div>
                  <h2 className="text-gray-800 dark:text-white font-bold text-xl">Cerca de ti ahora</h2>
                </div>
                <p className="text-base text-gray-400 flex items-center gap-1">
                  <LocateFixed size={13} className="text-green-500" />
                  {geo.detectedZone ?? 'Campus ECI'} · {topParches.length} parches activos
                </p>
              </div>
              <button
                onClick={() => navigate('/campus-map')}
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: TEAL }}
              >
                Ver mapa <ChevronRight size={16} />
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
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform"
                    style={{ background: parche.coverColor }}
                  >
                    <EmojiIcon emoji={parche.emoji} size={20} color="white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-800 dark:text-white text-xs truncate">{parche.name}</h3>
                      {parche.type === 'public' && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold" style={{ color: ORANGE }}>
                          <Flame size={12} />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-green-500" /> {parche.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {parche.members}/{parche.maxMembers}
                      </span>
                    </div>
                  </div>
                  <div
                    className="px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
                  >
                    <LocateFixed size={11} />
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
              <MapPin size={24} className="text-orange-500" />
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
          <h2 className="text-gray-800 dark:text-white font-bold text-xl">🌈 Explora por Vibras</h2>
        </div>
        <div className="relative">
          <div
            ref={vibraRef}
            onScroll={handleVibraScroll}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, black 92%, transparent 100%)',
              maskImage: 'linear-gradient(to right, black 92%, transparent 100%)',
            }}
          >
            {vibraCategories.map(vibra => {
              const vibraImageMap: Record<string, string> = {
                'v1': vibraMusica,
                'v2': vibraAireLibre,
                'v3': vibraEstudio,
                'v4': vibraGastronomia,
                'v5': vibraVideojuegos,
                'v6': vibraPintura,
              };
              const categoryMap: Record<string, string> = {
                'Música en Vivo': 'Música',
                'Al Aire Libre': 'Deporte',
                'Estudio': 'Estudio',
                'Gastronomía': 'Social',
                'Videojuegos': 'Tecnología',
                'Arte y Cultura': 'Arte',
              };
              return (
                <motion.button
                  key={vibra.id}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const category = categoryMap[vibra.name] || vibra.name;
                    navigate(`/parches?tab=explorar&category=${encodeURIComponent(category)}`);
                  }}
                  className="flex-shrink-0 relative overflow-hidden rounded-2xl transition-all"
                  style={{ width: '175px', height: '150px' }}
                >
                  <div className="absolute inset-0" style={{ background: vibra.gradient, opacity: 0.9 }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <img
                      src={vibraImageMap[vibra.id]}
                      alt={vibra.name}
                      className="w-20 h-20 object-contain drop-shadow-lg"
                      style={{ opacity: 0.75 }}
                    />
                    <span className="text-white text-[13px] font-bold leading-tight drop-shadow text-center px-2">{vibra.name}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
          {!vibraAtStart && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scrollVibra('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10"
              style={{ background: GRADIENT }}
            >
              <ChevronRight size={20} color="white" className="rotate-180" />
            </motion.button>
          )}
          {!vibraAtEnd && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scrollVibra('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10"
              style={{ background: GRADIENT }}
            >
              <ChevronRight size={20} color="white" />
            </motion.button>
          )}
        </div>
      </section>
      {}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-gray-800 dark:text-white font-bold text-xl">🎯 Perfect Match</h2>
            <p className="text-base text-gray-400">Personas con tu misma sintonía</p>
          </div>
          <button
            onClick={() => navigate('/matches')}
            className="text-xs font-semibold flex items-center gap-1 text-[#E91E63] dark:text-cyan-400 transition-colors"
          >
            Ver todos <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topMatches.slice(0, 4).map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/user/${user.id}`)}
              className="rounded-2xl overflow-hidden flex flex-row cursor-pointer active:scale-[0.98] transition-all"
              style={{
                background: isDark ? '#112240' : 'rgba(253,252,248,0.95)',
                boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.2)' : '0 2px 16px rgba(10,25,47,0.07)',
                border: isDark ? '1px solid rgba(30,58,95,0.3)' : '1px solid rgba(10,25,47,0.06)',
                height: '160px',
              }}
            >
              
              <div className="relative flex-shrink-0" style={{ width: '50%' }}>
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A192F 0%, #1E3A5F 100%)' }}>
                  <span className="text-white font-bold text-4xl select-none">{user.name.charAt(0)}</span>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                
                <div className="absolute inset-y-0 right-0 w-8 pointer-events-none" style={{ background: isDark ? 'linear-gradient(to right, transparent, #112240)' : 'linear-gradient(to right, transparent, rgba(253,252,248,0.95))' }} />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow" style={{ background: TEAL_GRADIENT }}>
                  {user.matchPercent}%
                </div>

              </div>
              
              <div className="flex flex-col justify-between p-4" style={{ width: '50%' }}>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <h3 className="text-gray-800 dark:text-white font-bold text-base truncate">{user.name.split(' ')[0]}</h3>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: TEAL }} />
                  </div>
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {user.interests.slice(0, 2).map(interest => (
                      <span key={interest} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium" style={{ background: isDark ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.1)', color: TEAL }}>
                        {interest}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin size={11} /> {user.commonPlace}</p>
                </div>
                <div className="mt-2">
                <button
                  className="w-full py-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-95 text-white text-xs font-bold shadow-md"
                  style={{
                    background: getConnectionStatus(user.id, user.connectionStatus) === 'connected' ? '#10B981' :
                                getConnectionStatus(user.id, user.connectionStatus) === 'pending' ? '#F59E0B' :
                                GRADIENT,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                  onClick={e => { e.stopPropagation(); handleQuickConnect(user.id, user.connectionStatus); }}
                >
                  {getConnectionStatus(user.id, user.connectionStatus) === 'connected' ? (
                    <><Heart size={13} fill="white" /><span>Conectado</span></>
                  ) : getConnectionStatus(user.id, user.connectionStatus) === 'pending' ? (
                    <><Clock size={13} /><span>Pendiente</span></>
                  ) : (
                    <><Heart size={13} /><span>Conectar</span></>
                  )}
                </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      {}
      <section className="px-5 mb-8 relative">
        
        <div className="flex items-end justify-between mb-4 relative z-20">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-gray-800 dark:text-white font-bold text-2xl flex items-center gap-2">
                <span>📅 Campus Pulse</span>
              </h2>
            </div>
            <p className="text-sm text-gray-400 mt-1">Lo que está pasando hoy en la universidad</p>
          </div>
          <button onClick={() => navigate('/events')} className="text-xs font-bold flex items-center gap-1 transition-all hover:scale-105 active:scale-95 px-3 py-1.5 rounded-xl backdrop-blur-md" style={{ color: PINK, background: isDark ? 'rgba(244,63,94,0.1)' : 'rgba(244,63,94,0.05)', border: `1px solid ${isDark ? 'rgba(244,63,94,0.2)' : 'rgba(244,63,94,0.1)'}` }}>
            Ver todos <ChevronRight size={14} />
          </button>
        </div>

        
        <div className="relative group/events-slider">
          <div className="relative min-h-[460px] sm:min-h-[360px] w-full overflow-visible">
            <AnimatePresence mode="wait">
              {(() => {
                const event = events[currentEventIndex];
                return (
                  <motion.div
                    key={currentEventIndex}
                    initial={{ opacity: 0, x: 60, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -60, scale: 0.97 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full flex flex-col sm:flex-row rounded-[2.5rem] overflow-hidden border cursor-pointer group"
                    onClick={() => navigate('/events')}
                    style={{
                      background: isDark ? 'rgba(17, 34, 64, 0.55)' : 'rgba(255, 255, 255, 0.95)',
                      borderColor: isDark ? 'rgba(30, 58, 95, 0.7)' : 'rgba(229, 231, 235, 0.9)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      boxShadow: isDark 
                        ? '0 20px 40px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.05)' 
                        : '0 20px 40px rgba(0,0,0,0.06)',
                    }}
                  >
                    
                    <div className="flex-1 p-6 md:p-7 flex flex-col justify-between z-10 min-w-0 pr-6 sm:pr-10">
                      <div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span 
                            className="px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase text-white shadow-sm flex items-center gap-1"
                            style={{ background: event.official ? GRADIENT : 'rgba(156,163,175,0.8)' }}
                          >
                            {event.official ? '👑 OFICIAL' : '⭐ EVENTO'}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-gray-800/80 px-2 py-0.5 rounded-md">
                            {event.category}
                          </span>
                        </div>

                        
                        <div className="flex items-center gap-3 mb-2 min-w-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: event.coverGradient }}>
                            <EmojiIcon emoji={event.emoji} size={20} color="white" strokeWidth={2} />
                          </div>
                          <h3 className="text-gray-900 dark:text-white font-black text-xl md:text-2xl leading-tight tracking-tight truncate flex-1">
                            {event.title}
                          </h3>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4">
                          {event.description}
                        </p>
                      </div>

                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-450">
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center bg-orange-500/10 text-orange-500">
                            <Clock size={12} strokeWidth={2.5} />
                          </div>
                          <span className="font-semibold">{event.date} · {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-450">
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-500">
                            <MapPin size={12} strokeWidth={2.5} />
                          </div>
                          <span className="font-semibold truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-450">
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center bg-cyan-500/10 text-cyan-500">
                            <Users size={12} strokeWidth={2.5} />
                          </div>
                          <span className="font-semibold">{event.attendees}+ asistirán</span>
                        </div>
                      </div>

                      
                      <div className="w-fit">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success(`¡Te has inscrito al evento "${event.title}"! 🎉Te notificaremos pronto.`);
                          }}
                          className="px-5 py-2.5 rounded-2xl text-white font-black text-xs shadow-lg flex items-center gap-2 transition-transform"
                          style={{ background: GRADIENT, boxShadow: '0 6px 20px rgba(30, 58, 138, 0.3)' }}
                        >
                          <span>Inscribirme al evento</span>
                          <ChevronRight size={14} strokeWidth={3} />
                        </motion.button>
                      </div>
                    </div>

                    
                    <div 
                      className="w-full sm:w-[40%] relative min-h-[140px] sm:min-h-0 overflow-hidden flex items-center justify-center"
                      style={{ background: event.coverGradient }}
                    >
                      
                      <div 
                        className="absolute inset-0 opacity-10 mix-blend-overlay"
                        style={{
                          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                          backgroundSize: '16px 16px',
                        }}
                      />

                      
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0, rotate: -15 }}
                        animate={{ scale: 1, opacity: 0.9, rotate: 0 }}
                        exit={{ scale: 0.7, opacity: 0, rotate: 15 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 110, 
                          damping: 15,
                          delay: 0.1 
                        }}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl border"
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          borderColor: 'rgba(255, 255, 255, 0.25)',
                          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        <EmojiIcon 
                          emoji={event.emoji} 
                          size={54} 
                          color="white" 
                          strokeWidth={2.5} 
                          className="drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]" 
                        />
                      </motion.div>

                      
                      <motion.div
                        initial={{ y: 150, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 150, opacity: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 90, 
                          damping: 14, 
                          delay: 0.15 
                        }}
                        className="absolute right-4 bottom-2 z-20 pointer-events-auto"
                      >
                        <motion.img
                          src={mascotFutbol}
                          alt="Pato Futbolista"
                          className="w-[125px] h-[125px] sm:w-[145px] sm:h-[145px] object-contain cursor-grab active:cursor-grabbing drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
                          whileHover={{ scale: 1.08, rotate: 3 }}
                          whileTap={{ scale: 0.95, rotate: -3 }}
                          drag
                          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                          dragElastic={0.25}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevEvent}
            className="absolute left-[-15px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center shadow-2xl z-20 backdrop-blur-md transition-all border pointer-events-auto"
            style={{ 
              background: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0,0,0,0.1)',
              boxShadow: `0 4px 20px ${isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'}`
            }}
          >
            <ChevronLeft size={20} style={{ color: PINK }} strokeWidth={3} />
          </motion.button>

          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextEvent}
            className="absolute right-[-15px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center shadow-2xl z-20 backdrop-blur-md transition-all border pointer-events-auto"
            style={{ 
              background: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0,0,0,0.1)',
              boxShadow: `0 4px 20px ${isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'}`
            }}
          >
            <ChevronRight size={20} style={{ color: PINK }} strokeWidth={3} />
          </motion.button>

          
          <div className="flex justify-center gap-2 mt-4 relative z-20">
            {events.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectEvent(idx)}
                className="h-2.5 rounded-full transition-all duration-300 pointer-events-auto"
                style={{
                  width: idx === currentEventIndex ? '28px' : '10px',
                  background: idx === currentEventIndex 
                    ? 'linear-gradient(135deg, #1D4ED8, #06B6D4)' 
                    : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                  boxShadow: idx === currentEventIndex ? '0 0 8px rgba(6, 182, 212, 0.4)' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </section>
      {}
      <section className="px-5 mb-8 relative">
        
        <div className="flex items-end justify-between mb-4 relative z-20">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-gray-800 dark:text-white font-bold text-2xl flex items-center gap-2">
                <span>🤝 Parches Sugeridos</span>
              </h2>
            </div>
            <p className="text-sm text-gray-400 mt-1">Arma planes, comparte intereses y conecta en el campus</p>
          </div>
          <button onClick={() => navigate('/parches')} className="text-xs font-bold flex items-center gap-1 transition-all hover:scale-105 active:scale-95 px-3 py-1.5 rounded-xl backdrop-blur-md" style={{ color: PINK, background: isDark ? 'rgba(244,63,94,0.1)' : 'rgba(244,63,94,0.05)', border: `1px solid ${isDark ? 'rgba(244,63,94,0.2)' : 'rgba(244,63,94,0.1)'}` }}>
            Ver todos <ChevronRight size={14} />
          </button>
        </div>

        

        
        <div className="relative group/parches-carousel">
          <div
            ref={parchesCarouselRef}
            onScroll={handleParchesCarouselScroll}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5 scroll-smooth"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to right, black 94%, transparent 100%)', 
              maskImage: 'linear-gradient(to right, black 94%, transparent 100%)' 
            }}
          >
            
            <motion.button
              key="futbol-mascot-card"
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/create-parche')}
              className="flex-shrink-0 rounded-3xl overflow-hidden text-left flex flex-col relative"
              style={{
                width: 210,
                height: 255,
                background: isDark 
                  ? 'linear-gradient(135deg, #1E1B4B 0%, #311042 100%)' 
                  : 'linear-gradient(135deg, #EEF2FF 0%, #FAE8FF 100%)',
                border: `1.5px solid ${isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
                boxShadow: isDark 
                  ? '0 8px 24px rgba(139, 92, 246, 0.15), inset 0 1px 1px rgba(255,255,255,0.05)' 
                  : '0 8px 24px rgba(139, 92, 246, 0.08)',
              }}
            >
              
              <div 
                className="h-28 flex items-center justify-center relative overflow-hidden" 
                style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)' }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] animate-pulse" />
                <img
                  src={mascotFutbol}
                  alt="Mascota Futbolista Tarjeta"
                  className="w-20 h-20 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] transform -rotate-6 transition-transform hover:scale-110"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] font-black text-white tracking-widest" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  ⚽ DEPORTE
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-black text-white" style={{ background: 'rgba(0,0,0,0.25)' }}>
                  <Sparkles size={8} className="text-yellow-300 animate-spin" /> EXCLUSIVO
                </div>
              </div>
              
              
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[13px] font-black text-gray-900 dark:text-white leading-tight line-clamp-2">
                    ¿Falta 1 para el fútbol?
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-350 mt-1 leading-snug line-clamp-2">
                    Crea un parche deportivo al instante y reúne al equipo hoy mismo.
                  </p>
                </div>
                <div className="mt-2.5">
                  <span
                    className="text-[9px] font-black px-3 py-1.5 rounded-xl text-white inline-flex items-center gap-1 shadow-md w-full justify-center"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #9333EA)' }}
                  >
                    <Plus size={10} /> Organizar Parche
                  </span>
                </div>
              </div>
            </motion.button>

            
            {parches.slice(0, 6).map(parche => (
              <motion.button
                key={`p-${parche.id}`}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/parches/${parche.id}`)}
                className="flex-shrink-0 rounded-3xl overflow-hidden text-left flex flex-col relative transition-all"
                style={{
                  width: 210,
                  height: 255,
                  background: isDark ? 'rgba(17, 34, 64, 0.45)' : 'white',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1.5px solid ${isDark ? 'rgba(30, 58, 95, 0.6)' : 'rgba(229, 231, 235, 0.8)'}`,
                  boxShadow: isDark 
                    ? '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.03)' 
                    : '0 8px 24px rgba(0,0,0,0.04)',
                }}
              >
                
                <div className="h-28 flex items-center justify-center relative" style={{ background: parche.coverColor }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <EmojiIcon emoji={parche.emoji} size={38} color="white" strokeWidth={2} className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]" />
                  
                  {parche.trending && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-black text-white tracking-wider" style={{ background: 'rgba(220,38,38,0.85)', boxShadow: '0 2px 6px rgba(220,38,38,0.3)' }}>
                      <TrendingUp size={10} className="animate-bounce" /> HOT
                    </div>
                  )}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[8px] font-black" style={{ background: 'rgba(0,0,0,0.4)', color: 'white' }}>
                    {parche.type === 'public' ? '🌐 Público' : '🔒 Privado'}
                  </div>
                </div>

                
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[13px] font-black text-gray-900 dark:text-white leading-tight line-clamp-1 mb-1">{parche.name}</p>
                    <p className="text-[10px] text-gray-550 dark:text-gray-400 line-clamp-2 leading-snug mb-2">{parche.description.slice(0, 52)}...</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-1.5">
                      {parche.memberAvatars.slice(0, 3).map((av, i) => (
                        <img key={i} src={av} alt="" className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-[#112240] shadow" />
                      ))}
                    </div>
                    <span className="text-[10px] font-black bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-gray-500 dark:text-gray-400">
                      👥 {parche.members}/{parche.maxMembers}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}

            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/parches')}
              className="flex-shrink-0 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all"
              style={{
                width: 110,
                height: 255,
                background: isDark ? 'rgba(30, 58, 95, 0.2)' : 'rgba(240, 247, 255, 0.5)',
                border: `1.5px dashed ${isDark ? '#1E3A5F' : '#BFDBFE'}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform group-hover/parches-carousel:scale-115 transition-transform"
                style={{ background: GRADIENT }}
              >
                <ChevronRight size={24} color="white" />
              </div>
              <span className="text-[10px] font-black text-center px-2 leading-tight" style={{ color: PINK }}>Ver todos los parches</span>
            </motion.button>
          </div>

          
          {!parchesAtStart && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => scrollParchesCarousel('left')}
              className="absolute left-[-15px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center shadow-2xl z-20 backdrop-blur-md transition-all active:scale-90 border"
              style={{ 
                background: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0,0,0,0.1)',
                boxShadow: `0 4px 20px ${isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.12)'}`
              }}
              whileHover={{ scale: 1.1 }}
            >
              <ChevronLeft size={20} style={{ color: PINK }} strokeWidth={3} />
            </motion.button>
          )}
          {!parchesAtEnd && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => scrollParchesCarousel('right')}
              className="absolute right-[-15px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center shadow-2xl z-20 backdrop-blur-md transition-all active:scale-90 border"
              style={{ 
                background: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0,0,0,0.1)',
                boxShadow: `0 4px 20px ${isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.12)'}`
              }}
              whileHover={{ scale: 1.1 }}
            >
              <ChevronRight size={20} style={{ color: PINK }} strokeWidth={3} />
            </motion.button>
          )}
        </div>
      </section>
    </div>
  );
}