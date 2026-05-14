import * as React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Bell, BellRing, Calendar, MapPin, Clock, Users, Filter, X,
  ChevronLeft, QrCode, Plus, History, AlertCircle, CheckCircle2, Lock,
} from 'lucide-react';
import { events, GRADIENT, PINK, ORANGE } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import type { Event } from '../types/mockData';
const CATEGORIES = ['Todos', 'Música', 'Tecnología', 'Bienestar', 'Social', 'Arte', 'Emprendimiento'];
const DATE_MONTHS = ['Todos', 'Abril', 'Mayo'];
const getEventMonth = (dateStr: string) => {
  if (dateStr.includes('Abril')) return 'Abril';
  if (dateStr.includes('Mayo')) return 'Mayo';
  return '';
};
const CharCounter = ({ value, max, className = '' }: { value: string; max: number; className?: string }) => {
  const over = value.length > max;
  return (
    <span className={`text-[10px] ${over ? 'text-red-500' : 'text-gray-400'} ${className}`}>
      {value.length}/{max}
    </span>
  );
};
export function EventsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery]       = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [dateFilter, setDateFilter]         = useState('Todos');
  const [showOfficialOnly, setShowOfficialOnly] = useState(false);
  const [showFilterPanel, setShowFilterPanel]   = useState(false);
  const [eventStates, setEventStates] = useState<Record<string, { registered: boolean; reminder: boolean }>>(
    Object.fromEntries(events.map(e => [e.id, { registered: e.registered, reminder: e.reminder }]))
  );
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>(
    Object.fromEntries(events.map(e => [e.id, e.attendees]))
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showQRFor, setShowQRFor]         = useState<string | null>(null); // event ID
  const [cancelModal, setCancelModal]     = useState<{ eventId: string; reason: string } | null>(null);
  const [showCreate, setShowCreate]       = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '', description: '', capacity: '', date: '', time: '', location: '', organizer: '',
  });
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [createSuccess, setCreateSuccess] = useState(false);
  const isPast = (event: Event) => !!event.isPast;
  const spotsLeft = (event: Event) => {
    if (!event.maxAttendees) return null;
    return event.maxAttendees - (attendeeCounts[event.id] ?? event.attendees);
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
    if (selectedEvent?.id === eventId) setSelectedEvent(null);
  };
  const toggleReminder = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEventStates(prev => ({ ...prev, [id]: { ...prev[id], reminder: !prev[id].reminder } }));
  };
  const validateCreate = () => {
    const errs: Record<string, string> = {};
    if (!createForm.title.trim()) errs.title = 'El título es requerido';
    else if (createForm.title.length > 100) errs.title = `Máximo 100 caracteres (tienes ${createForm.title.length})`;
    if (!createForm.description.trim()) errs.description = 'La descripción es requerida';
    else if (createForm.description.length > 500) errs.description = `Máximo 500 caracteres (tienes ${createForm.description.length})`;
    if (createForm.capacity && (isNaN(Number(createForm.capacity)) || Number(createForm.capacity) < 1))
      errs.capacity = 'La capacidad debe ser un número mayor a 0';
    if (!createForm.date) errs.date = 'La fecha es requerida';
    if (!createForm.location.trim()) errs.location = 'La ubicación es requerida';
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleCreateSubmit = () => {
    if (!validateCreate()) return;
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setShowCreate(false);
      setCreateForm({ title: '', description: '', capacity: '', date: '', time: '', location: '', organizer: '' });
      setCreateErrors({});
    }, 1800);
  };
  const allFiltered = useMemo(() => events.filter(e => {
    const matchesCategory = activeCategory === 'Todos' || e.category === activeCategory;
    const matchesSearch   = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOfficial = !showOfficialOnly || e.official;
    const matchesDate     = dateFilter === 'Todos' || getEventMonth(e.date) === dateFilter;
    return matchesCategory && matchesSearch && matchesOfficial && matchesDate;
  }), [activeCategory, searchQuery, showOfficialOnly, dateFilter]);
  const upcomingEvents = allFiltered.filter(e => !isPast(e));
  const pastEvents     = allFiltered.filter(e => isPast(e));
  const featuredEvent  = upcomingEvents.find(e => e.official && e.coverImage);
  const ActionButton = ({ event, compact = false }: { event: Event; compact?: boolean }) => {
    const registered = eventStates[event.id]?.registered;
    const past = isPast(event);
    const spots = spotsLeft(event);
    const canJoin = hasCapacity(event) && !registered;
    if (past) {
      return (
        <div className={`flex items-center gap-1 ${compact ? 'px-2.5 py-1 text-[10px]' : 'px-4 py-1.5 text-xs'} rounded-full font-semibold text-gray-400 dark:text-gray-500`}
          style={{ background: 'rgba(156,163,175,0.1)', border: '1px solid rgba(156,163,175,0.2)' }}>
          <Lock size={10} /> Finalizado
        </div>
      );
    }
    if (registered) {
      return (
        <button
          onClick={e => handleStartCancel(event.id, e)}
          className={`${compact ? 'px-2.5 py-1 text-[10px]' : 'px-4 py-1.5 text-xs'} rounded-full font-semibold transition-all active:scale-95`}
          style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          Cancelar asistencia
        </button>
      );
    }
    if (!canJoin) {
      return (
        <div className={`${compact ? 'px-2.5 py-1 text-[10px]' : 'px-4 py-1.5 text-xs'} rounded-full font-semibold`}
          style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
          Sin cupos
        </div>
      );
    }
    return (
      <button
        onClick={e => handleConfirmAttendance(event.id, e)}
        className={`${compact ? 'px-2.5 py-1 text-[10px]' : 'px-4 py-1.5 text-xs'} rounded-full font-semibold transition-all active:scale-95`}
        style={{ background: GRADIENT, color: 'white' }}
      >
        Confirmar asistencia
      </button>
    );
  };
  const EventCard = ({ event, index }: { event: Event; index: number }) => {
    const state  = eventStates[event.id];
    const past   = isPast(event);
    const spots  = spotsLeft(event);
    const count  = attendeeCounts[event.id] ?? event.attendees;
    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => setSelectedEvent(event)}
        className="bg-white dark:bg-[#112240] rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
        style={{ opacity: past ? 0.7 : 1 }}
      >
        <div className="flex">
          <div className="w-1.5 flex-shrink-0" style={{ background: event.coverGradient }} />
          <div className="flex-1 p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: event.coverGradient }}>
                <EmojiIcon emoji={event.emoji} size={22} color="white" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{event.title}</h3>
                      {event.official && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: ORANGE, background: 'rgba(6,182,212,0.12)' }}>OFICIAL</span>}
                      {past && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-[#172A45] text-gray-400">PASADO</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{event.description}</p>
                  </div>
                  {!past && (
                    <button onClick={e => toggleReminder(event.id, e)} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-[#172A45]">
                      {state?.reminder ? <BellRing size={14} color="#60A5FA" /> : <Bell size={14} className="text-gray-400" />}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={10} />{event.date}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{event.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} />{event.location}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-xs">
                    <Users size={12} style={{ color: PINK }} />
                    <span className="text-gray-500 dark:text-gray-400">
                      {count} van
                      {event.maxAttendees && (
                        <span className={spots === 0 ? ' text-red-400 font-medium' : spots! <= 5 ? ' text-amber-500 font-medium' : ''}>
                          {` · `}{spots === 0 ? 'Sin cupos' : `${spots} cupos`}
                        </span>
                      )}
                    </span>
                  </div>
                  <ActionButton event={event} compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
  return (
    <div className="flex flex-col min-h-screen pb-20">
      {}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-600 dark:text-gray-400" style={{ background: 'rgba(10,25,47,0.07)' }}>
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-gray-900 dark:text-white">📅 Eventos</h1>
              <p className="text-sm text-gray-400">Lo que está pasando en el campus</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#112240] shadow-sm flex items-center justify-center transition-colors active:scale-90"
            style={showFilterPanel ? { background: GRADIENT, color: 'white' } : { color: '#6B7280' }}
          >
            <Filter size={18} />
          </button>
        </div>
        {}
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Buscar eventos..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#112240] border border-gray-100 dark:border-[#233554] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none text-sm shadow-sm" />
        </div>
        {}
        <AnimatePresence>
          {showFilterPanel && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-3 p-4 bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-gray-100 dark:border-[#233554]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">Filtros</p>
                <button onClick={() => setShowFilterPanel(false)}><X size={16} className="text-gray-400" /></button>
              </div>
              {}
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Mes</p>
              <div className="flex gap-2 mb-3">
                {DATE_MONTHS.map(m => (
                  <button key={m} onClick={() => setDateFilter(m)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={dateFilter === m ? { background: GRADIENT, color: 'white' } : { background: '#EFF6FF', color: '#1D4ED8' }}>
                    {m}
                  </button>
                ))}
              </div>
              {}
              <button onClick={() => setShowOfficialOnly(!showOfficialOnly)} className="flex items-center gap-3 w-full">
                <div className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all" style={showOfficialOnly ? { borderColor: '#1D4ED8', background: GRADIENT } : { borderColor: '#D1D5DB' }}>
                  {showOfficialOnly && <span className="text-white text-[10px]">✓</span>}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Solo eventos oficiales</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all"
              style={activeCategory === cat ? { background: GRADIENT, color: 'white' } : { background: '#EFF6FF', color: '#1D4ED8' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      {}
      {featuredEvent && activeCategory === 'Todos' && !searchQuery && (
        <div className="px-5 mb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedEvent(featuredEvent)}
            className="relative rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            style={{ height: '220px' }}>
            <img src={featuredEvent.coverImage} alt={featuredEvent.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.0) 20%, rgba(0,0,0,0.85) 100%)' }} />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: GRADIENT }}>⭐ EVENTO OFICIAL</span>
            </div>
            <div className="absolute top-3 right-3">
              <button onClick={e => toggleReminder(featuredEvent.id, e)} className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                {eventStates[featuredEvent.id]?.reminder ? <BellRing size={14} color="#60A5FA" /> : <Bell size={14} color="white" />}
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg mb-1">{featuredEvent.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white/70 text-xs">
                  <span className="flex items-center gap-1"><Calendar size={10} />{featuredEvent.date}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{featuredEvent.time}</span>
                  <span>👥 {attendeeCounts[featuredEvent.id] ?? featuredEvent.attendees}+ van</span>
                </div>
                <div onClick={e => e.stopPropagation()}>
                  <ActionButton event={featuredEvent} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} style={{ color: PINK }} />
          <h2 className="font-bold text-gray-800 dark:text-white">Eventos Próximos</h2>
          <span className="ml-auto text-xs text-gray-400">{upcomingEvents.length} eventos</span>
        </div>
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-10">
            <Calendar size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="font-semibold text-gray-500 dark:text-gray-400 mb-1">No hay eventos próximos</p>
            <p className="text-xs text-gray-400">Prueba cambiando los filtros o la categoría</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event, i) => (
              event.id !== featuredEvent?.id || activeCategory !== 'Todos' || searchQuery
                ? <EventCard key={event.id} event={event} index={i} />
                : null
            ))}
          </div>
        )}
      </div>
      {}
      {pastEvents.length > 0 && (
        <div className="px-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <History size={16} className="text-gray-400" />
            <h2 className="font-bold text-gray-500 dark:text-gray-400">Historial</h2>
            <span className="ml-auto text-xs text-gray-400">{pastEvents.length} eventos</span>
          </div>
          <div className="space-y-3">
            {pastEvents.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
          </div>
        </div>
      )}
      {}
      {Object.values(eventStates).some(s => s.reminder) && (
        <div className="px-5 mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Tus Recordatorios</h3>
          <div className="space-y-2">
            {events.filter(e => eventStates[e.id]?.reminder).map(event => (
              <div key={event.id} className="flex items-center gap-3 bg-white dark:bg-[#112240] rounded-xl p-3 shadow-sm">
                <BellRing size={16} color="#60A5FA" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{event.title}</p>
                  <p className="text-xs text-gray-400">{event.date} · {event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl z-30 active:scale-95 transition-transform"
        style={{ background: GRADIENT, boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}
      >
        <Plus size={24} />
      </button>
      {}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
              style={{ background: 'linear-gradient(to bottom, rgba(17,34,64,0.98) 0%, rgba(10,25,47,0.98) 100%)', border: '1.5px solid rgba(255,255,255,0.1)' }}
            >
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                <X size={18} />
              </button>
              {selectedEvent.coverImage ? (
                <div className="relative h-48 overflow-hidden">
                  <img src={selectedEvent.coverImage} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(10,25,47,0.95) 100%)' }} />
                </div>
              ) : (
                <div className="h-32" style={{ background: selectedEvent.coverGradient }} />
              )}
              <div className="p-6 -mt-8 relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg" style={{ background: selectedEvent.coverGradient }}>
                  <EmojiIcon emoji={selectedEvent.emoji} size={32} color="white" strokeWidth={2} />
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <h2 className="text-white font-bold text-xl flex-1">{selectedEvent.title}</h2>
                  {selectedEvent.official && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex-shrink-0" style={{ background: GRADIENT }}>OFICIAL</span>}
                  {isPast(selectedEvent) && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-400 bg-white/10 flex-shrink-0 flex items-center gap-1"><Lock size={10} /> PASADO</span>}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">{selectedEvent.description}</p>
                {}
                <div className="space-y-3 mb-5">
                  {[
                    { icon: Calendar, color: '#60A5FA', label: 'Fecha y hora', value: `${selectedEvent.date} · ${selectedEvent.time}` },
                    { icon: MapPin,   color: '#34D399', label: 'Ubicación',   value: selectedEvent.location },
                    { icon: Users,    color: '#F472B6', label: 'Organiza',    value: selectedEvent.organizer },
                  ].map(({ icon: Icon, color, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        <p className="text-white text-sm font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                  {}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Users size={18} style={{ color: PINK }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Asistentes</p>
                      <p className="text-white text-sm font-medium">
                        {attendeeCounts[selectedEvent.id] ?? selectedEvent.attendees} confirmados
                      </p>
                      {selectedEvent.maxAttendees && (
                        <>
                          <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(((attendeeCounts[selectedEvent.id] ?? selectedEvent.attendees) / selectedEvent.maxAttendees) * 100, 100)}%` }}
                              transition={{ duration: 0.6 }}
                              className="h-full rounded-full"
                              style={{ background: spotsLeft(selectedEvent) === 0 ? '#EF4444' : spotsLeft(selectedEvent)! <= 5 ? '#F59E0B' : '#10B981' }}
                            />
                          </div>
                          <p className="text-xs mt-1" style={{ color: spotsLeft(selectedEvent) === 0 ? '#EF4444' : spotsLeft(selectedEvent)! <= 5 ? '#F59E0B' : '#6EE7B7' }}>
                            {spotsLeft(selectedEvent) === 0 ? 'Evento lleno' : `${spotsLeft(selectedEvent)} cupos disponibles de ${selectedEvent.maxAttendees}`}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {}
                <div className="flex gap-3">
                  {}
                  {!isPast(selectedEvent) && (
                    <button
                      onClick={() => toggleReminder(selectedEvent.id)}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                      style={{
                        background: eventStates[selectedEvent.id]?.reminder ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.1)',
                        border: eventStates[selectedEvent.id]?.reminder ? '2px solid rgba(96,165,250,0.5)' : '2px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {eventStates[selectedEvent.id]?.reminder ? <BellRing size={22} color="#60A5FA" /> : <Bell size={22} className="text-white" />}
                    </button>
                  )}
                  {}
                  {eventStates[selectedEvent.id]?.registered && (
                    <button
                      onClick={() => setShowQRFor(selectedEvent.id)}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                      style={{ background: 'rgba(16,185,129,0.18)', border: '2px solid rgba(16,185,129,0.4)' }}
                    >
                      <QrCode size={22} color="#34D399" />
                    </button>
                  )}
                  {}
                  <div className="flex-1">
                    <ActionButton event={selectedEvent} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showQRFor && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowQRFor(null)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]" />
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-72 rounded-3xl shadow-2xl overflow-hidden"
              style={{ background: 'linear-gradient(145deg,#0A192F,#112240)', border: '1.5px solid rgba(255,255,255,0.1)' }}
            >
              <div className="p-5 text-center">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Tu código QR</h3>
                  <button onClick={() => setShowQRFor(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="bg-white rounded-2xl p-3 mb-4 inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PATRICI.A-EVENT-${showQRFor}`}
                    alt="QR de asistencia"
                    className="w-48 h-48 block"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <p className="text-gray-300 text-xs mb-1">Muestra este código en la entrada</p>
                <p className="text-gray-500 text-[10px]">ID: PATRICI.A-{showQRFor?.toUpperCase()}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {cancelModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCancelModal(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-full max-w-sm mx-4 rounded-3xl shadow-2xl p-6"
              style={{ background: '#0D1B2E', border: '1.5px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={20} className="text-red-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Cancelar asistencia</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">¿Por qué no podrás asistir? (Opcional)</p>
              <div className="relative mb-1">
                <textarea
                  value={cancelModal.reason}
                  onChange={e => e.target.value.length <= 300 && setCancelModal({ ...cancelModal, reason: e.target.value })}
                  placeholder="Ej: Tengo un examen ese día..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
              <div className="flex justify-end mb-4">
                <CharCounter value={cancelModal.reason} max={300} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCancelModal(null)} className="flex-1 py-3 rounded-2xl text-gray-300 font-semibold text-sm" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  Volver
                </button>
                <button onClick={handleConfirmCancel} className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm bg-red-500 active:scale-95">
                  Confirmar cancelación
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[80] rounded-3xl shadow-2xl max-h-[88vh] overflow-y-auto"
              style={{ background: '#0D1B2E', border: '1.5px solid rgba(255,255,255,0.08)' }}
            >
              <div className="sticky top-0 flex items-center justify-between px-6 py-4" style={{ background: '#0D1B2E', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="text-white font-bold text-lg">Crear evento</h3>
                <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"><X size={16} /></button>
              </div>
              {createSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                    className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} className="text-green-400" />
                  </motion.div>
                  <h3 className="text-white font-bold text-xl mb-2">¡Evento creado!</h3>
                  <p className="text-gray-400 text-sm text-center">Tu evento ha sido enviado para revisión.</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-300">Título *</label>
                      <CharCounter value={createForm.title} max={100} />
                    </div>
                    <input
                      value={createForm.title}
                      onChange={e => e.target.value.length <= 100 && setCreateForm({ ...createForm, title: e.target.value })}
                      placeholder="Nombre del evento"
                      className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${createErrors.title ? '#EF4444' : 'rgba(255,255,255,0.1)'}` }}
                    />
                    {createErrors.title && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} />{createErrors.title}</p>}
                  </div>
                  {}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-300">Descripción *</label>
                      <CharCounter value={createForm.description} max={500} />
                    </div>
                    <textarea
                      value={createForm.description}
                      onChange={e => e.target.value.length <= 500 && setCreateForm({ ...createForm, description: e.target.value })}
                      placeholder="Describe el evento..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none resize-none"
                      style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${createErrors.description ? '#EF4444' : 'rgba(255,255,255,0.1)'}` }}
                    />
                    {createErrors.description && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} />{createErrors.description}</p>}
                  </div>
                  {}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Fecha *</label>
                      <input type="date" value={createForm.date}
                        onChange={e => setCreateForm({ ...createForm, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl text-sm text-white focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${createErrors.date ? '#EF4444' : 'rgba(255,255,255,0.1)'}` }}
                      />
                      {createErrors.date && <p className="text-xs text-red-400 mt-1">{createErrors.date}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Hora</label>
                      <input type="time" value={createForm.time}
                        onChange={e => setCreateForm({ ...createForm, time: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl text-sm text-white focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    </div>
                  </div>
                  {}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Ubicación *</label>
                    <input value={createForm.location}
                      onChange={e => setCreateForm({ ...createForm, location: e.target.value })}
                      placeholder="Auditorio, Sala..."
                      className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${createErrors.location ? '#EF4444' : 'rgba(255,255,255,0.1)'}` }}
                    />
                    {createErrors.location && <p className="text-xs text-red-400 mt-1">{createErrors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Capacidad máxima</label>
                    <input value={createForm.capacity} inputMode="numeric"
                      onChange={e => setCreateForm({ ...createForm, capacity: e.target.value.replace(/\D/, '') })}
                      placeholder="Número de cupos (opcional)"
                      className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${createErrors.capacity ? '#EF4444' : 'rgba(255,255,255,0.1)'}` }}
                    />
                    {createErrors.capacity && <p className="text-xs text-red-400 mt-1">{createErrors.capacity}</p>}
                  </div>
                  <button onClick={handleCreateSubmit}
                    className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    style={{ background: GRADIENT }}>
                    <Plus size={18} /> Publicar evento
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}