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
  const myParches = parches.filter(p => {
    if (!isParcheJoined(p.id)) return false;
    if (!searchQuery) return true;
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const exploreParches = parches.filter(p => !isParcheJoined(p.id) && !invitedParches.includes(p.id));
  const invitationParches = parches.filter(p => {
    if (!invitedParches.includes(p.id)) return false;
    if (!searchQuery) return true;
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
  });
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
    <div className="flex flex-col min-h-screen pb-4">
      {}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-600 dark:text-gray-400"
              style={{ background: 'rgba(10,25,47,0.07)' }}
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-gray-900 dark:text-white">🤝 Parches</h1>
              <p className="text-sm text-blue-400 dark:text-gray-400">Tus planes y comunidades</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/parches/create')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all active:scale-95"
            style={{ background: GRADIENT }}
          >
            <Plus size={20} />
          </button>
        </div>
        {}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/campus-map')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-4 text-left"
          style={{
            background: 'linear-gradient(135deg, rgba(217,119,6,0.15) 0%, rgba(245,158,11,0.08) 100%)',
            border: `1.5px solid rgba(245,158,11,0.3)`,
            boxShadow: '0 4px 16px rgba(217,119,6,0.15)',
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: GOLD_GRADIENT, boxShadow: '0 4px 12px rgba(217,119,6,0.4)' }}
          >
            <MapPin size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm flex items-center gap-1.5" style={{ color: GOLD_LIGHT }}><MapPin size={13} /> Ver Mapa Campus ECI</p>
            <p className="text-xs text-gray-400">Parches activos · Distancias · Puntos de interés</p>
          </div>
          <Navigation size={16} style={{ color: GOLD_LIGHT }} className="flex-shrink-0" />
        </motion.button>
        {}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar parches..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#112240] border border-blue-100 dark:border-[#233554] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1D4ED8] text-sm shadow-sm transition-all"
          />
        </div>
        {}
        <div className="flex bg-blue-50 dark:bg-[#112240] rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('mis-parches')}
            className="flex-1 py-2.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={
              activeTab === 'mis-parches'
                ? { background: GRADIENT, color: 'white' }
                : { color: '#9CA3AF' }
            }
          >
            Mis Parches ({myParches.length})
          </button>
          <button
            onClick={() => setActiveTab('invitaciones')}
            className="flex-1 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 relative"
            style={
              activeTab === 'invitaciones'
                ? { background: GRADIENT, color: 'white' }
                : { color: '#9CA3AF' }
            }
          >
            <span className="flex items-center justify-center gap-1">
              <Mail size={12} />
              Invitaciones
              {invitedParches.length > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[9px] font-black"
                  style={{ background: 'rgba(239,68,68,1)', color: 'white' }}
                >
                  {invitedParches.length}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('explorar')}
            className="flex-1 py-2.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={
              activeTab === 'explorar'
                ? { background: GRADIENT, color: 'white' }
                : { color: '#9CA3AF' }
            }
          >
            Explorar
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {}
        {activeTab === 'mis-parches' && (
          <motion.div
            key="mis-parches"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="px-5 space-y-3"
          >
            {myParches.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-3">
                  <Users size={52} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">Aún no te has unido a ningún parche</p>
                <button
                  onClick={() => setActiveTab('explorar')}
                  className="mt-4 px-6 py-2 rounded-full text-white text-sm font-medium"
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
                  className="bg-white dark:bg-[#112240] rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                >
                  {}
                  <div className="h-1.5" style={{ background: parche.coverColor }} />
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: parche.coverColor }}
                      >
                        <EmojiIcon emoji={parche.emoji} size={22} color="white" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-gray-800 dark:text-white">{parche.name}</h3>
                          {parche.type === 'private' ? (
                            <Lock size={12} className="text-gray-400" />
                          ) : (
                            <Globe size={12} className="text-gray-400" />
                          )}
                          {parche.trending && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: ORANGE }}>
                              <Flame size={10} /> Trending
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-1">{parche.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <MapPin size={10} /> {parche.location}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Clock size={10} /> {parche.date}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/chat/${parche.id}`); }}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: GRADIENT }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                        </svg>
                      </button>
                    </div>
                    {}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-50 dark:border-[#233554]">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {parche.memberAvatars.slice(0, 3).map((av, j) => (
                            <img key={j} src={av} alt="" className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-[#112240]" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{parche.members}/{parche.maxMembers} miembros</span>
                      </div>
                      <div className="flex gap-1">
                        {parche.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 dark:bg-[#172A45] text-blue-500 dark:text-gray-400">
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
        {}
        {activeTab === 'invitaciones' && (
          <motion.div
            key="invitaciones"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="px-5 space-y-3"
          >
            {invitationParches.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-3">
                  <Mail size={52} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No tienes invitaciones pendientes</p>
                <button
                  onClick={() => setActiveTab('explorar')}
                  className="mt-4 px-6 py-2 rounded-full text-white text-sm font-medium"
                  style={{ background: GRADIENT }}
                >
                  Explorar Parches
                </button>
              </div>
            ) : (
              invitationParches.map((parche, i) => (
                <motion.div
                  key={parche.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/parches/${parche.id}`)}
                  className="bg-white dark:bg-[#112240] rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-all border-2"
                  style={{ borderColor: 'rgba(59,130,246,0.3)' }}
                >
                  {}
                  <div className="h-1.5" style={{ background: parche.coverColor }} />
                  <div className="p-4">
                    {}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"
                        style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
                      >
                        <Mail size={10} /> Invitación
                      </div>
                      <span className="text-[10px] text-gray-400">
                        de {parche.admin}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: parche.coverColor }}
                      >
                        <EmojiIcon emoji={parche.emoji} size={22} color="white" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-gray-800 dark:text-white">{parche.name}</h3>
                          {parche.type === 'private' ? (
                            <Lock size={12} className="text-gray-400" />
                          ) : (
                            <Globe size={12} className="text-gray-400" />
                          )}
                          {parche.trending && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: ORANGE }}>
                              <Flame size={10} /> Trending
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2">{parche.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <MapPin size={10} /> {parche.location}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Clock size={10} /> {parche.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    {}
                    <div className="flex items-center justify-between pb-3 border-b border-blue-50 dark:border-[#233554]">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {parche.memberAvatars.slice(0, 3).map((av, j) => (
                            <img key={j} src={av} alt="" className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-[#112240]" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{parche.members}/{parche.maxMembers} miembros</span>
                      </div>
                      <div className="flex gap-1">
                        {parche.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 dark:bg-[#172A45] text-blue-500 dark:text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleRejectInvitation(parche.id);
                        }}
                        className="flex-1 py-2.5 rounded-xl text-white text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        style={{ background: '#EF4444' }}
                      >
                        <X size={14} />
                        Rechazar
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleAcceptInvitation(parche.id);
                        }}
                        className="flex-1 py-2.5 rounded-xl text-white text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        style={{ background: '#10B981' }}
                      >
                        <CheckCircle2 size={14} />
                        Aceptar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
        {}
        {activeTab === 'explorar' && (
          <motion.div
            key="explorar"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {}
            <div className="px-5 mb-4">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {uniqueCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all"
                    style={
                      activeCategory === cat
                        ? { background: GRADIENT, color: 'white' }
                        : { background: '#EFF6FF', color: '#1D4ED8' }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-5 space-y-3">
              {filteredExplore.map((parche, i) => (
                <motion.div
                  key={parche.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/parches/${parche.id}`)}
                  className="bg-white dark:bg-[#112240] rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ background: parche.coverColor }}
                      >
                        <EmojiIcon emoji={parche.emoji} size={24} color="white" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800 dark:text-white">{parche.name}</h3>
                          {parche.type === 'private' && <Lock size={11} className="text-gray-400" />}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{parche.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Users size={10} /> {parche.members}/{parche.maxMembers}
                          </span>
                          <span className="text-gray-300 dark:text-gray-600">·</span>
                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <MapPin size={10} /> {parche.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5">
                        {parche.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 dark:bg-[#172A45] text-blue-500 dark:text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        className="px-4 py-1.5 rounded-full text-white text-xs font-semibold transition-all active:scale-95"
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
                <div className="text-center py-12">
                  <div className="flex justify-center mb-3">
                    <Search size={52} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No encontramos parches para esta búsqueda</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
    </div>
  );
}