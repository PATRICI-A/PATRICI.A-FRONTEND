import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, MapPin, Clock, Users, Lock, Globe, ChevronRight, Flame, Navigation, Mail, CheckCircle2, X, ChevronLeft } from 'lucide-react';
import { parches, GRADIENT, PINK, ORANGE, GOLD_GRADIENT, GOLD_LIGHT, TEAL_GRADIENT } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
const uniqueCategories = ['Todos', ...Array.from(new Set(parches.map(p => p.category)))];
export function ParchesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'mis-parches' | 'explorar' | 'invitaciones'>('mis-parches');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedParches, setInvitedParches] = useState<string[]>(['p2', 'p5']);
  const [joinedParches, setJoinedParches] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const tab = searchParams.get('tab');
    const category = searchParams.get('category');
    if (tab === 'explorar') {
      setActiveTab('explorar');
    } else if (tab === 'invitaciones') {
      setActiveTab('invitaciones');
    }
    if (category && uniqueCategories.includes(category)) {
      setActiveCategory(category);
    }
    if (tab || category) {
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);
  const isParcheJoined = (parcheId: string) => {
    return joinedParches[parcheId] !== undefined ? joinedParches[parcheId] : parches.find(p => p.id === parcheId)?.joined || false;
  };
  const myParches = parches.filter(p => isParcheJoined(p.id));
  const exploreParches = parches.filter(p => !isParcheJoined(p.id) && !invitedParches.includes(p.id));
  const invitationParches = parches.filter(p => invitedParches.includes(p.id));
  const handleAcceptInvitation = (parcheId: string) => {
    setJoinedParches(prev => ({ ...prev, [parcheId]: true }));
    setInvitedParches(prev => prev.filter(id => id !== parcheId));
  };
  const handleRejectInvitation = (parcheId: string) => {
    setInvitedParches(prev => prev.filter(id => id !== parcheId));
  };
  const filteredExplore = exploreParches.filter(p => {
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  return (
    <div className="w-full px-4 md:w-[90%] md:px-0 max-w-[1400px] mx-auto flex flex-col min-h-screen pb-8">
      {/* Header & Controls */}
      <div className="pt-6 pb-6 flex flex-col gap-6">
        
        {/* Superior Row */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          
          {/* Title Area */}
          <div className="flex items-center justify-between w-full md:w-auto md:flex-1">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5 hover:scale-105 active:scale-95 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1.5">🤝 Parches</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 dark:text-gray-400">Tus planes y comunidades</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/parches/create')}
              className="md:hidden w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all active:scale-95"
              style={{ background: GRADIENT }}
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-[400px]">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar parches..."
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-white/5 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all font-semibold"
            />
          </div>

          {/* Map Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/campus-map')}
            className="w-full md:w-auto flex items-center gap-4 px-6 py-3.5 rounded-2xl text-left"
            style={{
              background: 'linear-gradient(135deg, rgba(217,119,6,0.15) 0%, rgba(245,158,11,0.08) 100%)',
              border: `1.5px solid rgba(245,158,11,0.3)`,
              boxShadow: '0 8px 30px rgba(217,119,6,0.15)',
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: GOLD_GRADIENT, boxShadow: '0 4px 12px rgba(217,119,6,0.4)' }}
            >
              <MapPin size={20} className="text-white" />
            </div>
            <div className="flex-1 md:min-w-[150px]">
              <p className="font-black text-sm flex items-center gap-1.5 leading-none mb-1.5" style={{ color: GOLD_LIGHT }}>MAPA CAMPUS</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80">Puntos y distancias</p>
            </div>
            <Navigation size={20} style={{ color: GOLD_LIGHT }} className="flex-shrink-0 ml-2" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-slate-900 rounded-[2rem] p-2 gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
          <button
            onClick={() => setActiveTab('mis-parches')}
            className="flex-1 py-4 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 transition-all duration-200"
            style={
              activeTab === 'mis-parches'
                ? { background: GRADIENT, color: 'white', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }
                : { color: '#9CA3AF' }
            }
          >
            <span className="font-black text-xl leading-none">{myParches.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Mis Parches</span>
          </button>
          <button
            onClick={() => setActiveTab('invitaciones')}
            className="flex-1 py-4 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 transition-all duration-200"
            style={
              activeTab === 'invitaciones'
                ? { background: GRADIENT, color: 'white', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }
                : { color: '#9CA3AF' }
            }
          >
            <span className="font-black text-xl leading-none flex items-center gap-1">
              {invitedParches.length > 0 ? invitedParches.length : <Mail size={18} />}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Invitaciones</span>
          </button>
          <button
            onClick={() => setActiveTab('explorar')}
            className="flex-1 py-4 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 transition-all duration-200"
            style={
              activeTab === 'explorar'
                ? { background: GRADIENT, color: 'white', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }
                : { color: '#9CA3AF' }
            }
          >
            <Search size={18} className={activeTab === 'explorar' ? '' : 'mb-0.5 md:mb-0'} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Explorar</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* === MIS PARCHES === */}
        {activeTab === 'mis-parches' && (
          <motion.div
            key="mis-parches"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-6"
          >
            {myParches.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
                <div className="flex justify-center mb-4">
                  <Users size={64} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Aún no te has unido a ningún parche</p>
                <button
                  onClick={() => setActiveTab('explorar')}
                  className="mt-6 px-8 py-3 rounded-full text-white text-sm font-bold shadow-lg"
                  style={{ background: GRADIENT }}
                >
                  Explorar Parches
                </button>
              </div>
            ) : (
              myParches.map((parche, i) => (
                <motion.div
                  key={parche.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/parches/${parche.id}`)}
                  className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5 cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all group"
                >
                  <div className="h-2 w-full transition-colors" style={{ background: parche.coverColor }} />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-[1.2rem] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform"
                        style={{ background: parche.coverColor }}
                      >
                        <EmojiIcon emoji={parche.emoji} size={32} color="white" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none">{parche.name}</h3>
                          {parche.type === 'private' ? (
                            <Lock size={14} className="text-gray-400" />
                          ) : (
                            <Globe size={14} className="text-gray-400" />
                          )}
                          {parche.trending && (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(249,115,22,0.1)', color: ORANGE }}>
                              <Flame size={12} /> Trending
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{parche.description}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <MapPin size={14} /> {parche.location}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <Clock size={14} /> {parche.date}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/chat/${parche.id}`); }}
                        className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-white flex-shrink-0 shadow-md hover:scale-105 transition-all"
                        style={{ background: GRADIENT }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Members & Tags Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 pt-5 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {parche.memberAvatars.slice(0, 3).map((av, j) => (
                            <img key={j} src={av} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm" />
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-2xl leading-none text-slate-800 dark:text-white">
                            {parche.members} <span className="text-slate-400 text-sm">/ {parche.maxMembers}</span>
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">MIEMBROS</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {parche.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
        {/* === INVITACIONES === */}
        {activeTab === 'invitaciones' && (
          <motion.div
            key="invitaciones"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-6"
          >
            {invitationParches.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
                <div className="flex justify-center mb-4">
                  <Mail size={64} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No tienes invitaciones pendientes</p>
              </div>
            ) : (
              invitationParches.map((parche, i) => (
                <motion.div
                  key={parche.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/parches/${parche.id}`)}
                  className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] border-2 border-blue-400/30 cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all group"
                >
                  <div className="h-2 w-full transition-colors" style={{ background: parche.coverColor }} />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
                        style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
                      >
                        <Mail size={12} /> INVITACIÓN
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        DE: {parche.admin}
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-[1.2rem] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform"
                        style={{ background: parche.coverColor }}
                      >
                        <EmojiIcon emoji={parche.emoji} size={32} color="white" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none">{parche.name}</h3>
                          {parche.type === 'private' ? (
                            <Lock size={14} className="text-gray-400" />
                          ) : (
                            <Globe size={14} className="text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{parche.description}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <MapPin size={14} /> {parche.location}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <Clock size={14} /> {parche.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 pb-5 border-b border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {parche.memberAvatars.slice(0, 3).map((av, j) => (
                            <img key={j} src={av} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm" />
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-2xl leading-none text-slate-800 dark:text-white">
                            {parche.members} <span className="text-slate-400 text-sm">/ {parche.maxMembers}</span>
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">MIEMBROS</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {parche.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-5">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleRejectInvitation(parche.id);
                        }}
                        className="flex-1 py-3.5 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                        style={{ background: '#EF4444' }}
                      >
                        <X size={16} strokeWidth={3} />
                        Rechazar
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleAcceptInvitation(parche.id);
                        }}
                        className="flex-1 py-3.5 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                        style={{ background: '#10B981' }}
                      >
                        <CheckCircle2 size={16} strokeWidth={3} />
                        Aceptar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
        {/* === EXPLORAR === */}
        {activeTab === 'explorar' && (
          <motion.div
            key="explorar"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col gap-6"
          >
            {/* Category Filter Chips */}
            <div className="w-full">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                {uniqueCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
                    style={
                      activeCategory === cat
                        ? { background: GRADIENT, color: 'white' }
                        : { background: 'var(--tw-colors-slate-100)', color: 'var(--tw-colors-slate-600)', className: 'dark:bg-slate-800 dark:text-slate-300' }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {filteredExplore.map((parche, i) => (
                <motion.div
                  key={parche.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/parches/${parche.id}`)}
                  className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5 cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all group"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-[1.2rem] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform"
                        style={{ background: parche.coverColor }}
                      >
                        <EmojiIcon emoji={parche.emoji} size={32} color="white" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none">{parche.name}</h3>
                          {parche.type === 'private' && <Lock size={14} className="text-gray-400" />}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{parche.description}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <Users size={14} /> {parche.members}/{parche.maxMembers}
                          </span>
                          <span className="text-gray-300 dark:text-gray-600">·</span>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <MapPin size={14} /> {parche.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        {parche.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        className="px-6 py-2.5 rounded-full text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-md hover:scale-105"
                        style={{ background: GRADIENT }}
                        onClick={e => { e.stopPropagation(); navigate(`/parches/${parche.id}`); }}
                      >
                        Unirme
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredExplore.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
                  <div className="flex justify-center mb-4">
                    <Search size={64} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No encontramos parches para esta búsqueda</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/parches/create')}
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 w-16 h-16 rounded-[1.5rem] shadow-[0_8px_30px_rgba(59,130,246,0.3)] flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 z-30"
        style={{ background: GRADIENT }}
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>
    </div>
  );
}