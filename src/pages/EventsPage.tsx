import * as React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Calendar, MapPin, Clock, Filter, X,
  ChevronLeft, QrCode, Plus, History, AlertCircle, CheckCircle2, Lock,
  Sparkles, Navigation, Ticket, Users, ChevronRight
} from 'lucide-react';
import { events, GRADIENT } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import type { Event } from '../types/mockData';

const CATEGORIES = ['Todos', 'ACADEMIC', 'CULTURAL', 'SPORTS', 'WELLNESS'];
const DATE_MONTHS = ['Todos', 'Abril', 'Mayo'];

const getEventMonth = (dateStr: string) => {
  if (dateStr.includes('-04-')) return 'Abril';
  if (dateStr.includes('-05-')) return 'Mayo';
  return '';
};

const CharCounter = ({ value, max, className = '' }: { value: string; max: number; className?: string }) => {
  const over = value.length > max;
  return (
    <span className={`text-[10px] font-bold ${over ? 'text-red-500' : 'text-gray-400'} ${className}`}>
      {value.length}/{max}
    </span>
  );
};

export function EventsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [dateFilter, setDateFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState<'ALL' | 'AGENDA'>('ALL');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [eventStates, setEventStates] = useState<Record<string, { registered: boolean }>>(
    Object.fromEntries(events.map(e => [e.id, { registered: e.registered }]))
  );
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>(
    Object.fromEntries(events.map(e => [e.id, e.attendees]))
  );

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showQRFor, setShowQRFor] = useState<string | null>(null);
  const [cancelModal, setCancelModal] = useState<{ eventId: string; reason: string } | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [createForm, setCreateForm] = useState({
    title: '', description: '', type: 'OPEN' as 'OPEN' | 'WITH_CAPACITY', capacity: '', date: '', time: '', duration: '', location: '', organizer: '',
  });
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [createSuccess, setCreateSuccess] = useState(false);

  const isDark = document.documentElement.classList.contains('dark');

  const isPast = (event: Event) => !!event.isPast;
  const spotsLeft = (event: Event) => {
    if (event.type === 'OPEN') return null;
    return (event.maxAttendees || 0) - (attendeeCounts[event.id] ?? event.attendees);
  };
  const hasCapacity = (event: Event) => {
    const left = spotsLeft(event);
    return left === null || left > 0;
  };

  const handleConfirmAttendance = (eventId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const event = events.find(ev => ev.id === eventId);
    if (!event || isPast(event) || !hasCapacity(event)) return;
    setEventStates(prev => ({ ...prev, [eventId]: { ...prev[eventId], registered: true } }));
    setAttendeeCounts(prev => ({ ...prev, [eventId]: (prev[eventId] ?? 0) + 1 }));
  };

  const handleStartCancel = (eventId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCancelModal({ eventId, reason: '' });
  };

  const handleConfirmCancel = () => {
    if (!cancelModal) return;
    const { eventId } = cancelModal;
    setEventStates(prev => ({ ...prev, [eventId]: { ...prev[eventId], registered: false } }));
    setAttendeeCounts(prev => ({ ...prev, [eventId]: Math.max((prev[eventId] ?? 0) - 1, 0) }));
    setCancelModal(null);
  };

  const validateCreate = () => {
    const errs: Record<string, string> = {};
    if (!createForm.title.trim()) errs.title = 'Requerido';
    if (!createForm.description.trim()) errs.description = 'Requerida';
    if (createForm.type === 'WITH_CAPACITY' && (!createForm.capacity || isNaN(Number(createForm.capacity)) || Number(createForm.capacity) < 1))
      errs.capacity = 'Inválido';
    if (!createForm.date) errs.date = 'Requerida';
    if (!createForm.location.trim()) errs.location = 'Requerida';
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = () => {
    if (!validateCreate()) return;
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setShowCreate(false);
      setCreateForm({ title: '', description: '', type: 'OPEN', capacity: '', date: '', time: '', duration: '', location: '', organizer: '' });
      setCreateErrors({});
    }, 2000);
  };

  const allFiltered = useMemo(() => events.filter(e => {
    const matchesCategory = activeCategory === 'Todos' || e.category === activeCategory;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = dateFilter === 'Todos' || getEventMonth(e.date) === dateFilter;
    const matchesAgenda = viewMode === 'ALL' || eventStates[e.id]?.registered;
    return matchesCategory && matchesSearch && matchesDate && matchesAgenda;
  }), [activeCategory, searchQuery, dateFilter, viewMode, eventStates]);

  const upcomingEvents = allFiltered.filter(e => !isPast(e));
  const pastEvents = allFiltered.filter(e => isPast(e));

  // Destacados: Carrusel Horizontal para la exploración inicial
  const featuredEvents = viewMode === 'ALL' && searchQuery === '' && activeCategory === 'Todos' && dateFilter === 'Todos' 
    ? upcomingEvents.slice(0, 3) 
    : [];
  
  const regularEvents = featuredEvents.length > 0 ? upcomingEvents.slice(3) : upcomingEvents;

  const renderActionButton = (event: Event, compact = false) => {
    const registered = eventStates[event.id]?.registered;
    const past = isPast(event);
    const canJoin = hasCapacity(event) && !registered;

    if (past) {
      return (
        <div className={`flex items-center justify-center gap-1.5 ${compact ? 'px-3 py-2 text-[10px]' : 'w-full py-4 text-sm'} rounded-2xl font-bold transition-all`}
          style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6', color: isDark ? '#9CA3AF' : '#6B7280' }}>
          <Lock size={16} /> Finalizado
        </div>
      );
    }
    if (registered) {
      return (
        <button
          onClick={e => handleStartCancel(event.id, e)}
          className={`flex items-center justify-center ${compact ? 'px-3 py-2 text-[10px]' : 'w-full py-4 text-sm'} rounded-2xl font-black transition-all active:scale-95`}
          style={{ color: '#EF4444', background: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2' }}
        >
          Cancelar Asistencia
        </button>
      );
    }
    if (!canJoin) {
      return (
        <div className={`flex items-center justify-center ${compact ? 'px-3 py-2 text-[10px]' : 'w-full py-4 text-sm'} rounded-2xl font-bold`}
          style={{ color: '#F59E0B', background: isDark ? 'rgba(245,158,11,0.1)' : '#FFFBEB' }}>
          Sin Cupos Libres
        </div>
      );
    }
    return (
      <button
        onClick={e => handleConfirmAttendance(event.id, e)}
        className={`flex items-center justify-center gap-2 ${compact ? 'px-3 py-2 text-[10px]' : 'w-full py-4 text-sm'} rounded-2xl font-black transition-all shadow-lg active:scale-95`}
        style={{ background: GRADIENT, color: 'white', boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)' }}
      >
        <CheckCircle2 size={18} /> ¡Quiero Ir!
      </button>
    );
  };

  const renderFeaturedCard = (event: Event, index: number) => {
    return (
        <motion.div
            key={`feat-${event.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            onClick={() => setSelectedEvent(event)}
            className={`snap-center shrink-0 w-72 h-48 relative overflow-hidden rounded-[2rem] cursor-pointer shadow-lg active:scale-[0.98] transition-transform`}
            style={{ background: event.coverGradient }}
        >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Calendar size={12} className="text-white" />
                <span className="text-xs font-bold text-white">{event.date.split('-').reverse().join('/')}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 pt-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-sm border border-white/10">
                    <EmojiIcon emoji={event.emoji} size={20} color="white" />
                </div>
                <h3 className="text-white font-black text-lg leading-tight mb-1 truncate">{event.title}</h3>
                <div className="flex items-center gap-2 text-white/80 text-[11px] font-semibold">
                    <span className="flex items-center gap-1"><Clock size={10} /> {event.time}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate"><MapPin size={10} /> {event.location.split(',')[0]}</span>
                </div>
            </div>
        </motion.div>
    );
  };

  const renderEventCard = (event: Event, index: number) => {
    const past = isPast(event);
    const spots = spotsLeft(event);
    const count = attendeeCounts[event.id] ?? event.attendees;
    const registered = eventStates[event.id]?.registered;

    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, type: "spring" }}
        onClick={() => setSelectedEvent(event)}
        className={`group relative overflow-hidden rounded-[2rem] cursor-pointer active:scale-[0.98] transition-all duration-300 ${
          isDark ? 'bg-white/5 hover:bg-white/10 border border-white/5' : 'bg-white hover:shadow-xl shadow-sm border border-gray-100'
        }`}
        style={{ opacity: past ? 0.6 : 1 }}
      >
        <div className="flex p-4 gap-4 items-center">
            {/* Left Box (Icon) */}
            <div className="w-20 h-24 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 relative overflow-hidden shadow-inner" style={{ background: event.coverGradient }}>
                <EmojiIcon emoji={event.emoji} size={32} color="white" />
                {registered && !past && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md py-1 flex justify-center border-t border-white/10">
                        <CheckCircle2 size={12} className="text-emerald-400" />
                    </div>
                )}
            </div>

            {/* Right Content */}
            <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{event.category}</span>
                    {past && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pasado</span>}
                </div>
                <h3 className={`font-black text-base truncate mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                
                <div className="flex items-center gap-3 text-xs font-semibold mb-3">
                    <div className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Calendar size={14} className={isDark ? 'text-blue-400' : 'text-blue-500'} /> 
                        {event.date.split('-').reverse().join('/')}
                    </div>
                    <div className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Clock size={14} className={isDark ? 'text-amber-400' : 'text-amber-500'} /> 
                        {event.time}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                        {[...Array(Math.min(3, count))].map((_, i) => (
                            <div key={i} className={`w-6 h-6 rounded-full border-2 ${isDark ? 'border-[#0A192F] bg-gray-700' : 'border-white bg-gray-200'} overflow-hidden shadow-sm`}>
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.id}${i}`} alt="user" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        {count > 3 && (
                            <div className={`w-6 h-6 rounded-full border-2 ${isDark ? 'border-[#0A192F] bg-[#112240]' : 'border-white bg-gray-100'} flex items-center justify-center shadow-sm`}>
                                <span className={`text-[8px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>+{count - 3}</span>
                            </div>
                        )}
                    </div>
                    {event.maxAttendees && (
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                            spots === 0 ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' 
                            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                        }`}>
                            {spots === 0 ? 'Agotado' : `${spots} libres`}
                        </span>
                    )}
                </div>
            </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`flex flex-col min-h-screen pb-24 ${isDark ? 'bg-[#0A192F]' : 'bg-[#F8FAFC]'}`}>
      
      {/* App-like Header */}
      <div className="px-5 pt-8 pb-4 relative overflow-hidden">
          {/* Decorative background shapes */}
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-[20px] left-[-50px] w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                  <button 
                      onClick={() => navigate(-1)} 
                      className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                          isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                      }`}
                  >
                      <ChevronLeft size={24} />
                  </button>
                  <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Vida Universitaria</p>
                      <h1 className={`text-2xl font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Eventos <Sparkles size={18} className="text-amber-400" />
                      </h1>
                  </div>
              </div>
          </div>

          {/* Modern Pill Tabs */}
          <div className={`flex p-1.5 rounded-full mb-6 relative z-10 shadow-inner ${isDark ? 'bg-[#060D1A]' : 'bg-gray-200/50'}`}>
              <button
                  onClick={() => setViewMode('ALL')}
                  className={`flex-1 py-2 text-sm font-bold rounded-full transition-all relative ${viewMode === 'ALL' ? (isDark ? 'text-gray-900' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}
              >
                  <span className="relative z-10">Explorar</span>
                  {viewMode === 'ALL' && <motion.div layoutId="event-tab-bg" className="absolute inset-0 rounded-full z-0 shadow-sm" style={{ background: 'white' }} />}
              </button>
              <button
                  onClick={() => setViewMode('AGENDA')}
                  className={`flex-1 py-2 text-sm font-bold rounded-full transition-all relative ${viewMode === 'AGENDA' ? (isDark ? 'text-gray-900' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}
              >
                  <span className="relative z-10">Mi Agenda</span>
                  {viewMode === 'AGENDA' && <motion.div layoutId="event-tab-bg" className="absolute inset-0 rounded-full z-0 shadow-sm" style={{ background: 'white' }} />}
              </button>
          </div>

          {/* Search & Filter Unified */}
          <div className="flex gap-3 relative z-10">
              <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                      placeholder="Busca talleres, deportes..." 
                      className={`w-full pl-11 pr-4 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                          isDark ? 'bg-white/5 border border-white/5 text-white placeholder-gray-500' : 'bg-white shadow-sm border border-transparent text-gray-900 placeholder-gray-400'
                      }`} 
                  />
              </div>
              <button
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all active:scale-95 flex-shrink-0 ${
                      showFilterPanel ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : (isDark ? 'bg-white/5 border border-white/5 text-gray-300' : 'bg-white shadow-sm text-gray-600')
                  }`}
              >
                  <Filter size={20} />
              </button>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilterPanel && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 relative z-10"
              >
                <div className={`p-5 rounded-3xl ${isDark ? 'bg-[#112240]' : 'bg-white border border-gray-100 shadow-sm'}`}>
                  <div className="mb-5">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Categorías</p>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeCategory === cat 
                              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                              : (isDark ? 'bg-[#1A2F50] text-gray-300' : 'bg-gray-50 text-gray-600')
                          }`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Mes</p>
                    <div className="flex flex-wrap gap-2">
                      {DATE_MONTHS.map(m => (
                        <button key={m} onClick={() => setDateFilter(m)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            dateFilter === m 
                              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                              : (isDark ? 'bg-[#1A2F50] text-gray-300' : 'bg-gray-50 text-gray-600')
                          }`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div>
        {viewMode === 'ALL' && featuredEvents.length > 0 && (
            <div className="mb-8">
                <div className="px-5 flex items-center justify-between mb-4">
                    <h2 className={`font-black text-xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Destacados 🔥</h2>
                </div>
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-5 pb-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                    {featuredEvents.map((event, i) => renderFeaturedCard(event, i))}
                </div>
            </div>
        )}

        <div className="px-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className={`font-black text-xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {viewMode === 'AGENDA' ? 'Mis Eventos 📅' : 'Próximamente 🚀'}
                </h2>
            </div>
            
            {regularEvents.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <div className={`w-24 h-24 mx-auto rounded-[2rem] flex items-center justify-center mb-6 shadow-inner ${isDark ? 'bg-[#112240]' : 'bg-white'}`}>
                        <Calendar size={40} className={isDark ? 'text-gray-600' : 'text-gray-300'} />
                    </div>
                    <p className={`font-black text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No hay eventos</p>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Prueba cambiando los filtros de búsqueda.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {regularEvents.map((event, i) => renderEventCard(event, i))}
                </div>
            )}
        </div>

        {pastEvents.length > 0 && (
            <div className="px-5 mt-10">
                <div className="flex items-center gap-2 mb-6">
                    <History size={20} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
                    <h2 className={`font-black text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Historial de Eventos</h2>
                </div>
                <div className="space-y-4">
                    {pastEvents.map((event, i) => renderEventCard(event, i))}
                </div>
            </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl z-30 active:scale-90 transition-transform"
        style={{ background: GRADIENT, boxShadow: '0 8px 30px rgba(99,102,241,0.5)' }}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* EVENT DETAILS MODAL (PREMIUM BOTTOM SHEET) */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)} 
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[60]" 
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.8 }}
              className={`fixed bottom-0 left-0 right-0 z-[70] w-full max-h-[92vh] overflow-hidden rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col ${isDark ? 'bg-[#0B1526]' : 'bg-white'}`}
            >
              {/* Dynamic Header with Gradient */}
              <div className="relative w-full h-48 flex-shrink-0" style={{ background: selectedEvent.coverGradient }}>
                {/* Close Button & Drag Handle area */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/40 to-transparent">
                  <div className="w-12 h-1.5 rounded-full bg-white/40 mx-auto mt-2 absolute left-1/2 -translate-x-1/2 backdrop-blur-md" />
                  <div />
                  <button onClick={() => setSelectedEvent(null)} className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
                    <X size={18} />
                  </button>
                </div>
                
                {/* Emoji Float */}
                <div className="absolute -bottom-10 left-6 w-24 h-24 rounded-[2rem] shadow-xl flex items-center justify-center z-20 border-4 border-white dark:border-[#0B1526]" style={{ background: selectedEvent.coverGradient }}>
                  <EmojiIcon emoji={selectedEvent.emoji} size={48} color="white" />
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="px-6 pt-14 pb-32 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className={`font-black text-2xl leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedEvent.title}</h2>
                  {isPast(selectedEvent) && <span className="px-3 py-1.5 rounded-xl text-[10px] font-black text-white bg-gray-900 dark:bg-white/20 uppercase tracking-widest">Pasado</span>}
                </div>
                
                <p className={`text-sm font-medium leading-relaxed mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedEvent.description}
                </p>

                {/* Info Cards - Glassmorphic */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className={`p-4 rounded-[1.25rem] flex items-center gap-3 ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500 flex-shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Fecha</p>
                      <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedEvent.date.split('-').reverse().join('/')}</p>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-[1.25rem] flex items-center gap-3 ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-500 flex-shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Hora</p>
                      <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedEvent.time}</p>
                    </div>
                  </div>
                  
                  <div className={`col-span-2 p-4 rounded-[1.25rem] flex items-center gap-3 ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-500 flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Ubicación</p>
                      <p className={`font-black text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedEvent.location}</p>
                    </div>
                  </div>
                </div>

                {/* Attendees Section */}
                <div className={`p-5 rounded-3xl ${isDark ? 'bg-[#112240]' : 'bg-white shadow-sm border border-gray-100'}`}>
                  <h4 className={`font-bold text-sm mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Users size={18} className="text-indigo-500" /> Asistentes
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-3">
                       {[...Array(Math.min(5, attendeeCounts[selectedEvent.id] ?? selectedEvent.attendees))].map((_, i) => (
                         <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#112240] bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-sm">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedEvent.id}${i}`} alt="user" className="w-full h-full object-cover" />
                         </div>
                       ))}
                       {(attendeeCounts[selectedEvent.id] ?? selectedEvent.attendees) > 5 && (
                         <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#112240] bg-gray-100 dark:bg-[#1A2F50] flex items-center justify-center shadow-sm">
                           <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                             +{(attendeeCounts[selectedEvent.id] ?? selectedEvent.attendees) - 5}
                           </span>
                         </div>
                       )}
                    </div>
                    {selectedEvent.maxAttendees && (
                      <div className="text-right">
                        <p className={`text-2xl font-black ${spotsLeft(selectedEvent) === 0 ? 'text-red-500' : spotsLeft(selectedEvent)! <= 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {spotsLeft(selectedEvent)}
                        </p>
                        <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Cupos libres</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Action Bar */}
              <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t ${isDark ? 'from-[#0B1526] via-[#0B1526]' : 'from-white via-white'} to-transparent z-30 pt-12`}>
                <div className="flex gap-3 max-w-md mx-auto">
                  {eventStates[selectedEvent.id]?.registered && !isPast(selectedEvent) && (
                    <button
                      onClick={() => setShowQRFor(selectedEvent.id)}
                      className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xl flex-shrink-0"
                    >
                      <QrCode size={24} />
                    </button>
                  )}
                  <div className="flex-1">
                    {renderActionButton(selectedEvent, false)}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* QR MODAL (DIGITAL TICKET) */}
      <AnimatePresence>
        {showQRFor && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowQRFor(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-[85vw] max-w-sm"
            >
              <div className="relative rounded-[2rem] shadow-2xl overflow-hidden bg-white dark:bg-[#1A2F50]">
                {/* Ticket Header */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-center relative overflow-hidden">
                  <div className="absolute -left-4 -top-4 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-black/20 rounded-full blur-2xl" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2">
                      <Ticket size={20} className="text-white" />
                    </div>
                    <h3 className="text-white/80 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">Entrada Oficial</h3>
                    <h2 className="text-white font-black text-xl leading-tight tracking-tight">PATRICI.A EVENTOS</h2>
                  </div>
                </div>
                
                {/* Ticket Body */}
                <div className="p-8 text-center relative">
                  {/* Cutouts for ticket effect */}
                  <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-black/80 -translate-y-1/2 z-10" />
                  <div className="absolute -right-4 top-0 w-8 h-8 rounded-full bg-black/80 -translate-y-1/2 z-10" />
                  <div className="absolute left-6 right-6 top-0 border-t-[3px] border-dashed border-gray-300 dark:border-gray-600" />
                  
                  <div className="bg-white border-4 border-gray-100 rounded-[2rem] p-4 mb-6 shadow-sm mx-auto w-fit relative z-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PATRICI.A-EVENT-${showQRFor}&margin=10`}
                      alt="QR de asistencia"
                      className="w-48 h-48 block rounded-xl"
                    />
                  </div>
                  <p className={`font-bold text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Escanea en la puerta del evento</p>
                  <div className={`py-2 px-4 rounded-xl inline-block ${isDark ? 'bg-[#112240]' : 'bg-gray-100'}`}>
                    <p className={`font-bold tracking-widest text-xs font-mono ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      ID: PT-{showQRFor.substring(0,6).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
              
              <button onClick={() => setShowQRFor(null)} className="w-full mt-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold transition-colors border border-white/20 active:scale-95">
                Cerrar Boleto
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CANCEL MODAL */}
      <AnimatePresence>
        {cancelModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCancelModal(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-full max-w-sm mx-4 rounded-[2rem] shadow-2xl p-6 ${isDark ? 'bg-[#112240]' : 'bg-white'}`}
            >
              <div className="flex flex-col items-center text-center mb-6 mt-2">
                <div className="w-16 h-16 rounded-[1.5rem] bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className={`font-black text-xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>¿Cancelar Asistencia?</h3>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Liberarás tu cupo para otro estudiante.</p>
              </div>

              <div className="mb-6">
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Motivo (Opcional)</label>
                <textarea
                  value={cancelModal.reason}
                  onChange={e => e.target.value.length <= 300 && setCancelModal({ ...cancelModal, reason: e.target.value })}
                  placeholder="Escribe brevemente por qué no puedes asistir..."
                  rows={3}
                  className={`w-full px-4 py-3.5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none ${
                    isDark ? 'bg-[#0A192F] text-white border-none' : 'bg-gray-50 text-gray-900 border border-gray-200'
                  }`}
                />
                <div className="flex justify-end mt-1">
                  <CharCounter value={cancelModal.reason} max={300} />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => setCancelModal(null)} className={`flex-1 py-3.5 rounded-xl font-bold text-sm ${isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  Mejor no
                </button>
                <button onClick={handleConfirmCancel} className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm bg-red-500 shadow-lg shadow-red-500/30 active:scale-95 transition-transform">
                  Sí, Cancelar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CREATE EVENT MODAL */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed inset-x-0 bottom-0 z-[80] rounded-t-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col ${isDark ? 'bg-[#0D1B2E]' : 'bg-white'}`}
            >
              <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                <h3 className={`font-black text-xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Crear Evento</h3>
                <button onClick={() => setShowCreate(false)} className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                {createSuccess ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                      className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-6">
                      <CheckCircle2 size={48} className="text-emerald-500" />
                    </motion.div>
                    <h3 className={`font-black text-2xl tracking-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>¡Evento Creado!</h3>
                    <p className={`text-center max-w-[250px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tu evento ha sido enviado para revisión por moderación.</p>
                  </div>
                ) : (
                  <div className="space-y-5 pb-8">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Título del Evento *</label>
                        <CharCounter value={createForm.title} max={100} />
                      </div>
                      <input
                        value={createForm.title}
                        onChange={e => e.target.value.length <= 100 && setCreateForm({ ...createForm, title: e.target.value })}
                        placeholder="Ej: Torneo de Ajedrez..."
                        className={`w-full px-4 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                          isDark ? 'bg-white/5 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 border-none placeholder-gray-400'
                        } ${createErrors.title ? 'ring-2 ring-red-500/50' : ''}`}
                      />
                      {createErrors.title && <p className="text-[10px] font-bold text-red-500 mt-1.5 uppercase tracking-wider">{createErrors.title}</p>}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Descripción *</label>
                        <CharCounter value={createForm.description} max={500} />
                      </div>
                      <textarea
                        value={createForm.description}
                        onChange={e => e.target.value.length <= 500 && setCreateForm({ ...createForm, description: e.target.value })}
                        placeholder="Cuenta de qué trata tu evento..."
                        rows={4}
                        className={`w-full px-4 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none ${
                          isDark ? 'bg-white/5 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 border-none placeholder-gray-400'
                        } ${createErrors.description ? 'ring-2 ring-red-500/50' : ''}`}
                      />
                      {createErrors.description && <p className="text-[10px] font-bold text-red-500 mt-1.5 uppercase tracking-wider">{createErrors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Fecha *</label>
                        <input type="date" value={createForm.date}
                          onChange={e => setCreateForm({ ...createForm, date: e.target.value })}
                          className={`w-full px-4 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                            isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900 border-none'
                          } ${createErrors.date ? 'ring-2 ring-red-500/50' : ''}`}
                        />
                        {createErrors.date && <p className="text-[10px] font-bold text-red-500 mt-1.5 uppercase tracking-wider">{createErrors.date}</p>}
                      </div>
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Hora</label>
                        <input type="time" value={createForm.time}
                          onChange={e => setCreateForm({ ...createForm, time: e.target.value })}
                          className={`w-full px-4 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                            isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900 border-none'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Ubicación *</label>
                      <input value={createForm.location}
                        onChange={e => setCreateForm({ ...createForm, location: e.target.value })}
                        placeholder="Ej: Auditorio Principal..."
                        className={`w-full px-4 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                          isDark ? 'bg-white/5 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 border-none placeholder-gray-400'
                        } ${createErrors.location ? 'ring-2 ring-red-500/50' : ''}`}
                      />
                      {createErrors.location && <p className="text-[10px] font-bold text-red-500 mt-1.5 uppercase tracking-wider">{createErrors.location}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Modalidad *</label>
                        <div className="relative">
                          <select
                            value={createForm.type}
                            onChange={e => setCreateForm({ ...createForm, type: e.target.value as 'OPEN' | 'WITH_CAPACITY' })}
                            className={`w-full pl-4 pr-10 py-4 rounded-[1.25rem] font-medium text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                              isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900 border-none'
                            }`}
                          >
                            <option value="OPEN">Abierto</option>
                            <option value="WITH_CAPACITY">Cupos limitados</option>
                          </select>
                          <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {createForm.type === 'WITH_CAPACITY' && (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Capacidad *</label>
                            <input value={createForm.capacity} inputMode="numeric"
                              onChange={e => setCreateForm({ ...createForm, capacity: e.target.value.replace(/\D/, '') })}
                              placeholder="N° cupos"
                              className={`w-full px-4 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                                isDark ? 'bg-white/5 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 border-none placeholder-gray-400'
                              } ${createErrors.capacity ? 'ring-2 ring-red-500/50' : ''}`}
                            />
                            {createErrors.capacity && <p className="text-[10px] font-bold text-red-500 mt-1.5 uppercase tracking-wider">{createErrors.capacity}</p>}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button onClick={handleCreateSubmit}
                      className="w-full mt-4 py-4 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-indigo-500/30"
                      style={{ background: GRADIENT }}>
                      Publicar Evento <Navigation size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}