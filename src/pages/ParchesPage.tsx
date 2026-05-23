import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, MapPin, Clock, Users, Lock, Globe, ChevronRight, Flame, Navigation, Mail, CheckCircle2, X, ChevronLeft, Crown, Loader2, AlertCircle } from 'lucide-react';
import { GRADIENT, PINK, ORANGE, GOLD_GRADIENT, GOLD_LIGHT, TEAL_GRADIENT } from '../types/mockData';
import { useApp } from '../store/AppContext';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import patyParcheImg from '../assets/PATY PARCHE2.png';
import patySelfieImg from '../assets/PATY SELFIE.png';
import {
  type ParcheResponse,
  type InvitationResponse,
  searchParches,
  getMyParches,
  joinParche,
  acceptInvitation,
  rejectInvitation,
} from '../services/parches.service';

// Helper: map API category string to an emoji for display
const CATEGORY_EMOJI: Record<string, string> = {
  MUSIC: '🎵', SPORT: '⚽', TECHNOLOGY: '💻', STUDY: '📚',
  CULTURE: '🎨', SOCIAL: '🤝', FOOD: '🍕', WELLNESS: '🧘',
};
const categoryEmoji = (cat: string) => CATEGORY_EMOJI[cat?.toUpperCase()] ?? '🤝';

// Helper: map category to a gradient
const CATEGORY_COLOR: Record<string, string> = {
  MUSIC: GRADIENT,
  SPORT: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)',
  TECHNOLOGY: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
  STUDY: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
  CULTURE: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
  SOCIAL: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
  FOOD: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
  WELLNESS: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
};
const categoryColor = (cat: string) => CATEGORY_COLOR[cat?.toUpperCase()] ?? GRADIENT;


export function ParchesPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'mis-parches' | 'explorar' | 'invitaciones'>('mis-parches');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // ── data states ──
  const [myParches, setMyParches] = useState<ParcheResponse[]>([]);
  const [exploreParches, setExploreParches] = useState<ParcheResponse[]>([]);
  // Invitations: stored locally after accepting/rejecting (API for invitations TBD)
  const [pendingInvitations, setPendingInvitations] = useState<InvitationResponse[]>([]);

  const [loadingMine, setLoadingMine] = useState(false);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [errorMine, setErrorMine] = useState<string | null>(null);
  const [errorExplore, setErrorExplore] = useState<string | null>(null);

  // Derive unique categories from explore list
  const uniqueCategories = ['Todos', ...Array.from(new Set(exploreParches.map(p => p.category)))];

  // ── fetch helpers ──
  const fetchMyParches = useCallback(async () => {
    setLoadingMine(true);
    setErrorMine(null);
    try {
      const data = await getMyParches();
      setMyParches(data);
    } catch {
      setErrorMine('No pudimos cargar tus parches. Intenta de nuevo.');
    } finally {
      setLoadingMine(false);
    }
  }, []);

  const fetchExploreParches = useCallback(async () => {
    setLoadingExplore(true);
    setErrorExplore(null);
    try {
      const params: Record<string, string | boolean> = {};
      if (searchQuery) params.nombre = searchQuery;
      if (activeCategory !== 'Todos') params.categoria = activeCategory;
      const data = await searchParches(params as never);
      setExploreParches(data);
    } catch {
      setErrorExplore('No pudimos cargar los parches. Intenta de nuevo.');
    } finally {
      setLoadingExplore(false);
    }
  }, [searchQuery, activeCategory]);

  // ── effects ──
  useEffect(() => {
    const tab = searchParams.get('tab');
    const category = searchParams.get('category');
    if (tab === 'explorar') setActiveTab('explorar');
    else if (tab === 'invitaciones') setActiveTab('invitaciones');
    if (category) setActiveCategory(category);
    if (tab || category) setSearchParams({});
  }, [searchParams, setSearchParams]);

  useEffect(() => { fetchMyParches(); }, [fetchMyParches]);
  useEffect(() => { fetchExploreParches(); }, [fetchExploreParches]);

  // ── actions ──
  const handleJoin = async (e: React.MouseEvent, parcheId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    setJoiningId(parcheId);
    try {
      await joinParche(parcheId);
      await Promise.all([fetchMyParches(), fetchExploreParches()]);
      setActiveTab('mis-parches');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data ?? 'No pudimos unirte al parche.';
      alert(msg);
    } finally {
      setJoiningId(null);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await acceptInvitation(invitationId);
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      fetchMyParches();
    } catch { /* ignore */ }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      await rejectInvitation(invitationId);
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch { /* ignore */ }
  };

  // Filtered my parches by search
  const filteredMine = myParches.filter(p =>
    !searchQuery ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ── render helpers ──
  const ParcheCard = ({
    parche,
    isJoined = false,
  }: {
    parche: ParcheResponse;
    isJoined?: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/parches/${parche.id}`)}
      className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5 cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all group"
    >
      <div className="h-2 w-full" style={{ background: categoryColor(parche.category) }} />
      <div className="p-6">
        <div className="flex items-center gap-4">
          {parche.imageUrl ? (
            <img
              src={parche.imageUrl}
              alt={parche.name}
              className="w-16 h-16 rounded-[1.2rem] object-cover flex-shrink-0 shadow-md group-hover:scale-105 transition-transform"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-[1.2rem] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform text-3xl"
              style={{ background: categoryColor(parche.category) }}
            >
              {categoryEmoji(parche.category)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none">
                {parche.name}
              </h3>
              {parche.type === 'PRIVATE' ? (
                <Lock size={14} className="text-gray-400" />
              ) : (
                <Globe size={14} className="text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{parche.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Users size={14} /> {parche.actualMembers}/{parche.maximumQuota}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <MapPin size={14} /> {parche.lugar}
              </span>
              {parche.date && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Clock size={14} /> {parche.date}
                </span>
              )}
            </div>
          </div>
          {isJoined ? (
            <button
              onClick={e => { e.stopPropagation(); navigate(`/chat/${parche.id}`); }}
              className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-white flex-shrink-0 shadow-md hover:scale-105 transition-all"
              style={{ background: GRADIENT }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
            </button>
          ) : (
            <div className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-800/40 flex-shrink-0 group-hover:translate-x-1 transition-transform">
              <ChevronRight size={20} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full px-4 md:w-4/6 md:px-0 max-w-[1200px] mx-auto flex flex-col min-h-screen pb-8">
      {/* Header & Controls */}
      <div className="pt-6 pb-6 flex flex-col gap-6">
        {/* Superior Row */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Title Area */}
          <div className="flex items-center justify-between w-full md:w-auto md:flex-1">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/home')}
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
              border: '1.5px solid rgba(245,158,11,0.3)',
              boxShadow: '0 8px 30px rgba(217,119,6,0.15)',
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GOLD_GRADIENT, boxShadow: '0 4px 12px rgba(217,119,6,0.4)' }}>
              <MapPin size={20} className="text-white" />
            </div>
            <div className="flex-1 md:min-w-[150px]">
              <p className="font-black text-sm flex items-center gap-1.5 leading-none mb-1.5" style={{ color: GOLD_LIGHT }}>MAPA CAMPUS</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80">Puntos y distancias</p>
            </div>
            <Navigation size={20} style={{ color: GOLD_LIGHT }} className="flex-shrink-0 ml-2" />
          </motion.button>
        </div>

        {/* Mascot Banner */}
        <div className="relative w-full bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:px-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5 overflow-hidden flex items-center justify-between">
          <div className="z-10 relative md:max-w-[55%]">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
              ¡La vida es mejor <span style={{ color: PINK }}>en parche!</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
              Descubre grupos, asiste a eventos y colecciona momentos únicos con tus amigos.
            </p>
          </div>
          <div className="absolute right-[-10px] sm:right-4 bottom-[-15px] flex items-end opacity-95">
            <img src={patyParcheImg} alt="Paty Parche" className="w-32 h-32 sm:w-44 sm:h-44 object-contain drop-shadow-xl" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-slate-900 rounded-[2rem] p-2 gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
          <button
            onClick={() => setActiveTab('mis-parches')}
            className="flex-1 py-4 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 transition-all duration-200"
            style={activeTab === 'mis-parches' ? { background: GRADIENT, color: 'white', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' } : { color: '#9CA3AF' }}
          >
            <span className="font-black text-xl leading-none">{loadingMine ? '…' : filteredMine.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Mis Parches</span>
          </button>
          <button
            onClick={() => setActiveTab('invitaciones')}
            className="flex-1 py-4 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 transition-all duration-200"
            style={activeTab === 'invitaciones' ? { background: GRADIENT, color: 'white', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' } : { color: '#9CA3AF' }}
          >
            <span className="font-black text-xl leading-none flex items-center gap-1">
              {pendingInvitations.length > 0 ? pendingInvitations.length : <Mail size={18} />}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Invitaciones</span>
          </button>
          <button
            onClick={() => setActiveTab('explorar')}
            className="flex-1 py-4 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 transition-all duration-200"
            style={activeTab === 'explorar' ? { background: GRADIENT, color: 'white', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' } : { color: '#9CA3AF' }}
          >
            <Search size={18} className={activeTab === 'explorar' ? '' : 'mb-0.5 md:mb-0'} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Explorar</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* === MIS PARCHES === */}
        {activeTab === 'mis-parches' && (
          <motion.div key="mis-parches" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex flex-col gap-6">
            {loadingMine ? (
              <div className="flex justify-center py-20">
                <Loader2 size={40} className="animate-spin text-blue-500" />
              </div>
            ) : errorMine ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
                <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">{errorMine}</p>
                <button onClick={fetchMyParches} className="mt-4 px-6 py-2.5 rounded-full text-white text-sm font-bold" style={{ background: GRADIENT }}>Reintentar</button>
              </div>
            ) : filteredMine.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
                <div className="flex justify-center mb-4">
                  <img src={patyParcheImg} alt="No parches" className="w-32 h-32 object-contain opacity-90 drop-shadow-md" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Aún no te has unido a ningún parche</p>
                <button onClick={() => setActiveTab('explorar')} className="mt-6 px-8 py-3 rounded-full text-white text-sm font-bold shadow-lg" style={{ background: GRADIENT }}>Explorar Parches</button>
              </div>
            ) : (
              filteredMine.map(parche => <ParcheCard key={parche.id} parche={parche} isJoined={true} />)
            )}
          </motion.div>
        )}

        {/* === INVITACIONES === */}
        {activeTab === 'invitaciones' && (
          <motion.div key="invitaciones" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex flex-col gap-6">
            {pendingInvitations.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
                <div className="flex justify-center mb-4">
                  <img src={patySelfieImg} alt="No invitaciones" className="w-32 h-32 object-contain opacity-90 drop-shadow-md" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No tienes invitaciones pendientes</p>
              </div>
            ) : (
              pendingInvitations.map((inv, i) => (
                <motion.div key={inv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] border-2 border-blue-400/30">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5" style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>
                        <Mail size={12} /> INVITACIÓN
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Parche ID: {inv.parcheId}</p>
                    <div className="flex gap-4">
                      <button onClick={() => handleRejectInvitation(inv.id)} className="flex-1 py-3.5 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2" style={{ background: '#EF4444' }}>
                        <X size={16} strokeWidth={3} /> Rechazar
                      </button>
                      <button onClick={() => handleAcceptInvitation(inv.id)} className="flex-1 py-3.5 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2" style={{ background: '#10B981' }}>
                        <CheckCircle2 size={16} strokeWidth={3} /> Aceptar
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
          <motion.div key="explorar" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col gap-6">
            {/* Category Filter Chips */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
              {uniqueCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
                  style={activeCategory === cat ? { background: GRADIENT, color: 'white' } : { background: '#EFF6FF', color: '#64748B' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loadingExplore ? (
              <div className="flex justify-center py-20">
                <Loader2 size={40} className="animate-spin text-blue-500" />
              </div>
            ) : errorExplore ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem]">
                <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">{errorExplore}</p>
                <button onClick={fetchExploreParches} className="mt-4 px-6 py-2.5 rounded-full text-white text-sm font-bold" style={{ background: GRADIENT }}>Reintentar</button>
              </div>
            ) : exploreParches.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
                <div className="flex justify-center mb-4">
                  <img src={patyParcheImg} alt="No parches encontrados" className="w-32 h-32 object-contain opacity-90 drop-shadow-md" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No encontramos parches para esta búsqueda</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {exploreParches.map(parche => {
                  const isJoined = myParches.some(p => p.id === parche.id);
                  return <ParcheCard key={parche.id} parche={parche} isJoined={isJoined} />;
                })}
              </div>
            )}
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