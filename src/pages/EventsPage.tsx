import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Bell, BellRing, Calendar, MapPin, Clock, Users, X,
  ChevronLeft, ChevronRight, ChevronDown, QrCode, History, AlertCircle, Lock, SlidersHorizontal,
} from 'lucide-react';
import { events, GRADIENT, PINK } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import type { Event } from '../types/mockData';
import mascotRockstar from '../assets/mascota_rockstar.png';


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

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const parseEventDateStr = (dateStr: string, timeStr: string) => {
  const parts = dateStr.split(' ');
  const day = parseInt(parts[0], 10);
  const monthName = parts[1];
  const year = parseInt(parts[2], 10) || 2025;
  const monthIndex = monthName === 'Abril' ? 3 : monthName === 'Mayo' ? 4 : 0;
  
  let hours = 0;
  let minutes = 0;
  if (timeStr) {
    const startTime = timeStr.split('-')[0].trim();
    const timeParts = startTime.split(':');
    hours = parseInt(timeParts[0], 10) || 0;
    minutes = parseInt(timeParts[1], 10) || 0;
  }
  return new Date(year, monthIndex, day, hours, minutes);
};

export function EventsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'feed' | 'agenda'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [dateFilter, setDateFilter] = useState('Todos');
  const [showOfficialOnly, setShowOfficialOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  const [eventStates, setEventStates] = useState<Record<string, { registered: boolean; reminder: boolean }>>(
    Object.fromEntries(events.map(e => [e.id, { registered: e.registered, reminder: e.reminder }]))
  );
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>(
    Object.fromEntries(events.map(e => [e.id, e.attendees]))
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showQRFor, setShowQRFor] = useState<string | null>(null);
  const [cancelModal, setCancelModal] = useState<{ eventId: string; reason: string } | null>(null);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [upcomingDirection, setUpcomingDirection] = useState(1);
  const [pastIndex, setPastIndex] = useState(0);
  const [pastDirection, setPastDirection] = useState(1);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [expandedQRId, setExpandedQRId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isPast = (event: Event) => !!event.isPast;

  const carouselEvents = useMemo(() => {
    return events.filter(e => !isPast(e));
  }, []);

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

  const currentMonthName = dateFilter === 'Todos' ? 'Mayo' : dateFilter;

  const formatEventDate = (d: Date) => {
    const day = d.getDate();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const calendarDays = useMemo(() => {
    const year = 2025;
    const monthIndex = currentMonthName === 'Abril' ? 3 : 4;
    const date = new Date(year, monthIndex, 1);
    const days = [];
    while (date.getMonth() === monthIndex) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonthName]);

  const hasEventOnDate = (d: Date) => {
    const formatted = formatEventDate(d);
    return events.some(e => e.date === formatted);
  };

  const allFiltered = useMemo(() => events.filter(e => {
    const matchesCategory = activeCategory === 'Todos' || e.category === activeCategory;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOfficial = !showOfficialOnly || e.official;
    const matchesDate = dateFilter === 'Todos' || getEventMonth(e.date) === dateFilter;
    const matchesSelectedDate = !selectedDate || e.date === formatEventDate(selectedDate);
    return matchesCategory && matchesSearch && matchesOfficial && matchesDate && matchesSelectedDate;
  }), [activeCategory, searchQuery, showOfficialOnly, dateFilter, selectedDate]);

  const upcomingEvents = allFiltered.filter(e => !isPast(e));
  const pastEvents = allFiltered.filter(e => isPast(e));

  const upcomingCarouselEvents = useMemo(() => {
    return upcomingEvents.filter(event =>
      event.id !== carouselEvents[carouselIndex]?.id || activeCategory !== 'Todos' || searchQuery || selectedDate
    );
  }, [upcomingEvents, carouselEvents, carouselIndex, activeCategory, searchQuery, selectedDate]);

  const agendaEvents = useMemo(() => {
    return events.filter(e => eventStates[e.id]?.registered);
  }, [eventStates]);

  const nextAgendaEvent = useMemo(() => {
    const activeUpcoming = agendaEvents.filter(e => !isPast(e));
    if (activeUpcoming.length === 0) return null;
    return activeUpcoming.map(e => ({
      event: e,
      dateObj: parseEventDateStr(e.date, e.time)
    })).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())[0]?.event;
  }, [agendaEvents]);

  const getCountdownString = (ev: Event) => {
    const target = parseEventDateStr(ev.date, ev.time);
    const diff = target.getTime() - now;
    if (diff <= 0) return "¡Está ocurriendo ahora!";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    if (days > 0) return `${days}d ${hours}h ${mins}m ${secs}s`;
    if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== 'Todos') count++;
    if (dateFilter !== 'Todos') count++;
    if (showOfficialOnly) count++;
    return count;
  }, [activeCategory, dateFilter, showOfficialOnly]);

  const nextSlide = () => {
    setDirection(1);
    setCarouselIndex(prev => (prev + 1) % carouselEvents.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCarouselIndex(prev => (prev === 0 ? carouselEvents.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (carouselEvents.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [carouselEvents]);

  const nextUpcoming = () => {
    if (upcomingCarouselEvents.length <= 1) return;
    setUpcomingDirection(1);
    setUpcomingIndex(prev => (prev + 1) % upcomingCarouselEvents.length);
  };

  const prevUpcoming = () => {
    if (upcomingCarouselEvents.length <= 1) return;
    setUpcomingDirection(-1);
    setUpcomingIndex(prev => (prev === 0 ? upcomingCarouselEvents.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (upcomingIndex >= upcomingCarouselEvents.length && upcomingCarouselEvents.length > 0) {
      setUpcomingIndex(upcomingCarouselEvents.length - 1);
    }
  }, [upcomingCarouselEvents.length, upcomingIndex]);

  useEffect(() => {
    if (upcomingCarouselEvents.length <= 1) return;
    const timer = setInterval(() => {
      nextUpcoming();
    }, 9000);
    return () => clearInterval(timer);
  }, [upcomingCarouselEvents.length]);

  const nextPast = () => {
    if (pastEvents.length <= 1) return;
    setPastDirection(1);
    setPastIndex(prev => (prev + 1) % pastEvents.length);
  };

  const prevPast = () => {
    if (pastEvents.length <= 1) return;
    setPastDirection(-1);
    setPastIndex(prev => (prev === 0 ? pastEvents.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (pastIndex >= pastEvents.length && pastEvents.length > 0) {
      setPastIndex(pastEvents.length - 1);
    }
  }, [pastEvents.length, pastIndex]);

  useEffect(() => {
    if (pastEvents.length <= 1) return;
    const timer = setInterval(() => {
      nextPast();
    }, 10000);
    return () => clearInterval(timer);
  }, [pastEvents.length]);

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
          {compact ? 'Cancelar' : 'Cancelar asistencia y liberar cupo'}
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

  const EventCard = ({ event, index, isCarouselItem = false }: { event: Event; index: number; isCarouselItem?: boolean }) => {
    const state = eventStates[event.id];
    const past = isPast(event);
    const spots = spotsLeft(event);
    const count = attendeeCounts[event.id] ?? event.attendees;
    const isDark = document.documentElement.classList.contains('dark');

    return (
      <motion.div
        key={event.id}
        initial={isCarouselItem ? undefined : { opacity: 0, y: 10 }}
        animate={isCarouselItem ? undefined : { opacity: 1, y: 0 }}
        transition={isCarouselItem ? undefined : { delay: index * 0.05 }}
        onClick={() => setSelectedEvent(event)}
        className={`rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all flex flex-col relative ${
          isCarouselItem ? 'w-full h-full' : 'flex-shrink-0 w-[290px] md:w-[340px] snap-start'
        }`}
        style={{
          opacity: past ? 0.7 : 1,
          background: isDark ? '#112240' : 'rgba(253,252,248,0.95)',
          boxShadow: isCarouselItem ? 'none' : (isDark ? '0 2px 16px rgba(0,0,0,0.2)' : '0 2px 16px rgba(10,25,47,0.07)'),
          border: isCarouselItem ? 'none' : (isDark ? '1px solid rgba(30,58,95,0.3)' : '1px solid rgba(10,25,47,0.06)'),
        }}
      >
        <div className="flex p-3 gap-3">
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
            style={{ background: event.coverGradient }}
          >
            <EmojiIcon emoji={event.emoji} size={32} color="white" strokeWidth={2} />
            {event.official && (
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white bg-black/30">
                OFICIAL
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 flex-1">{event.title}</h3>
                {!past && (
                  <button onClick={e => toggleReminder(event.id, e)} className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#172A45]">
                    {state?.reminder ? <BellRing size={12} color="#60A5FA" /> : <Bell size={12} className="text-gray-400" />}
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{event.description}</p>
            </div>

            <div className="flex flex-col gap-1 mt-1.5">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Calendar size={9} />{event.date}</span>
                <span className="flex items-center gap-1"><Clock size={9} />{event.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 truncate pr-2">
                  <MapPin size={9} />{event.location}
                </span>
                <div className="flex items-center gap-1 text-[10px] flex-shrink-0">
                  <Users size={10} style={{ color: PINK }} />
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">
                    {count}
                    {event.maxAttendees && (
                      <span className={spots === 0 ? ' text-red-400' : spots! <= 5 ? ' text-amber-500' : ''}>
                        {` / `}{event.maxAttendees}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full md:w-[76%] md:mx-auto flex flex-col min-h-screen pb-20 px-4 md:px-0">
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-800 dark:text-white transition-all active:scale-90">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-gray-900 dark:text-white font-semibold text-lg md:text-xl">📅 Campus Pulse</h1>
              <p className="text-xs text-gray-400">Lo que está pasando en el campus</p>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-4">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-3 text-center text-xs font-bold transition-all relative ${
              activeTab === 'feed' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            Feed de Eventos
            {activeTab === 'feed' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('agenda')}
            className={`flex-1 py-3 text-center text-xs font-bold transition-all relative flex items-center justify-center gap-1.5 ${
              activeTab === 'agenda' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            Mi Agenda Personal
            {agendaEvents.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-blue-500 text-white font-bold">
                {agendaEvents.length}
              </span>
            )}
            {activeTab === 'agenda' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>

        {activeTab === 'feed' && (
          <>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar eventos..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none transition-all text-sm"
                  style={{
                    background: document.documentElement.classList.contains('dark') ? 'rgba(17,34,64,0.9)' : 'rgba(253,252,248,0.9)',
                    boxShadow: document.documentElement.classList.contains('dark') ? '0 2px 12px rgba(0,0,0,0.25), inset 0 1px 2px rgba(0,0,0,0.2)' : '0 2px 12px rgba(10,25,47,0.08)',
                    border: document.documentElement.classList.contains('dark') ? '1px solid rgba(30,58,95,0.5)' : '1px solid rgba(10,25,47,0.07)',
                  }}
                />
              </div>
              <button
                onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
                className="px-4 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm transition-all active:scale-95 border"
                style={{
                  background: showFiltersDropdown || activeFiltersCount > 0
                    ? 'rgba(59,130,246,0.15)'
                    : document.documentElement.classList.contains('dark') ? 'rgba(17,34,64,0.9)' : 'rgba(253,252,248,0.9)',
                  borderColor: showFiltersDropdown || activeFiltersCount > 0
                    ? 'rgba(59,130,246,0.4)'
                    : document.documentElement.classList.contains('dark') ? 'rgba(30,58,95,0.5)' : 'rgba(10,25,47,0.07)',
                  color: showFiltersDropdown || activeFiltersCount > 0
                    ? '#3B82F6'
                    : document.documentElement.classList.contains('dark') ? '#94A3B8' : '#64748B',
                }}
              >
                <SlidersHorizontal size={16} />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-500 text-white font-black">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            <AnimatePresence>
              {showFiltersDropdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  className="overflow-hidden mb-4 p-4 rounded-3xl"
                  style={{
                    background: document.documentElement.classList.contains('dark') ? 'rgba(17,34,64,0.95)' : 'rgba(253,252,248,0.95)',
                    border: document.documentElement.classList.contains('dark') ? '1px solid rgba(30,58,95,0.4)' : '1px solid rgba(10,25,47,0.08)',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/50 dark:border-gray-800/50">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filtros Avanzados</span>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={() => {
                          setActiveCategory('Todos');
                          setDateFilter('Todos');
                          setShowOfficialOnly(false);
                        }}
                        className="text-[10px] font-extrabold text-red-500 hover:underline"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Categorías</span>
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORIES.map(cat => {
                          const isSel = activeCategory === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className="px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all active:scale-95"
                              style={isSel
                                ? { background: GRADIENT, color: 'white' }
                                : {
                                  background: document.documentElement.classList.contains('dark') ? 'rgba(30,58,95,0.3)' : 'rgba(10,25,47,0.05)',
                                  color: document.documentElement.classList.contains('dark') ? '#E2E8F0' : '#475569'
                                }
                              }
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Meses</span>
                        <div className="flex gap-1.5">
                          {DATE_MONTHS.map(m => {
                            const isSel = dateFilter === m;
                            return (
                              <button
                                key={m}
                                onClick={() => {
                                  setDateFilter(m);
                                  setSelectedDate(null);
                                }}
                                className="flex-grow px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all active:scale-95 border text-center"
                                style={isSel
                                  ? { background: document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(10,25,47,0.08)', borderColor: document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.2)' : 'rgba(10,25,47,0.15)', color: document.documentElement.classList.contains('dark') ? 'white' : '#0F172A' }
                                  : { background: 'transparent', borderColor: document.documentElement.classList.contains('dark') ? 'rgba(30,58,95,0.5)' : 'rgba(10,25,47,0.1)', color: document.documentElement.classList.contains('dark') ? '#94A3B8' : '#64748B' }
                                }
                              >
                                {m}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Opciones</span>
                        <button
                          onClick={() => setShowOfficialOnly(!showOfficialOnly)}
                          className="w-full px-3 py-2 rounded-xl text-[10px] font-semibold transition-all active:scale-95 border flex items-center justify-center gap-1.5"
                          style={showOfficialOnly
                            ? { background: 'rgba(6,182,212,0.15)', borderColor: 'rgba(6,182,212,0.4)', color: '#06B6D4' }
                            : { background: 'transparent', borderColor: document.documentElement.classList.contains('dark') ? 'rgba(30,58,95,0.5)' : 'rgba(10,25,47,0.1)', color: document.documentElement.classList.contains('dark') ? '#94A3B8' : '#64748B' }
                          }
                        >
                          {showOfficialOnly && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />}
                          ⭐ Solo oficiales
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-4 mb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Calendar size={12} className="text-blue-500" />
                <span>Filtrar por calendario ({currentMonthName})</span>
              </div>
              <button
                onClick={() => setShowFullCalendar(!showFullCalendar)}
                className="text-[10px] font-bold text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                {showFullCalendar ? 'Ver tira' : 'Ver mes completo'}
                <ChevronDown size={11} className={`transition-transform duration-200 ${showFullCalendar ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <AnimatePresence>
              {showFullCalendar && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4 p-3 rounded-2xl"
                  style={{
                    background: document.documentElement.classList.contains('dark') ? 'rgba(17,34,64,0.4)' : 'rgba(10,25,47,0.02)',
                    border: document.documentElement.classList.contains('dark') ? '1px solid rgba(30,58,95,0.3)' : '1px solid rgba(10,25,47,0.05)',
                  }}
                >
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-gray-400 mb-2">
                    {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((wd, i) => (
                      <div key={i}>{wd}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {(() => {
                      const firstDayIndex = new Date(2025, currentMonthName === 'Abril' ? 3 : 4, 1).getDay();
                      const gridItems = [];
                      for (let i = 0; i < firstDayIndex; i++) {
                        gridItems.push(<div key={`empty-${i}`} />);
                      }
                      calendarDays.forEach((day, i) => {
                        const isSelected = selectedDate && day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth();
                        const hasEvents = hasEventOnDate(day);
                        gridItems.push(
                          <button
                            key={`day-${i}`}
                            onClick={() => {
                              if (isSelected) setSelectedDate(null);
                              else setSelectedDate(day);
                            }}
                            className={`aspect-square w-full rounded-lg text-xs font-bold transition-all relative flex flex-col items-center justify-center ${
                              isSelected
                                ? 'text-white'
                                : document.documentElement.classList.contains('dark') ? 'text-gray-300 hover:bg-[#1e3a5f]/40' : 'text-gray-700 hover:bg-gray-200/50'
                            }`}
                            style={isSelected ? { background: GRADIENT, boxShadow: '0 4px 8px rgba(30,58,138,0.25)' } : {}}
                          >
                            <span>{day.getDate()}</span>
                            {hasEvents && (
                              <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                            )}
                          </button>
                        );
                      });
                      return gridItems;
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Horizontal Calendar Strip */}
            {!showFullCalendar && (
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-5 px-5">
                {calendarDays.map((day, idx) => {
                  const dayNum = day.getDate();
                  const dayName = WEEKDAYS[day.getDay()];
                  const isSelected = selectedDate && dayNum === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth();
                  const hasEvents = hasEventOnDate(day);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (isSelected) setSelectedDate(null);
                        else setSelectedDate(day);
                      }}
                      className="flex-shrink-0 w-11 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 border"
                      style={isSelected
                        ? { background: GRADIENT, borderColor: 'transparent', color: 'white', boxShadow: '0 4px 10px rgba(30,58,138,0.2)' }
                        : {
                          background: document.documentElement.classList.contains('dark') ? 'rgba(30,58,95,0.2)' : 'rgba(10,25,47,0.03)',
                          borderColor: document.documentElement.classList.contains('dark') ? 'rgba(30,58,95,0.3)' : 'rgba(10,25,47,0.05)',
                          color: document.documentElement.classList.contains('dark') ? '#E2E8F0' : '#475569'
                        }
                      }
                    >
                      <span className="text-[9px] font-medium opacity-70 uppercase mb-0.5">{dayName}</span>
                      <span className="text-sm font-black">{dayNum}</span>
                      {hasEvents && (
                        <span className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {activeTab === 'feed' ? (
        <>
          {carouselEvents.length > 0 && activeCategory === 'Todos' && !searchQuery && !selectedDate && (
            <div className="px-5 mb-6 relative group">
              <div className="relative h-[250px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  {(() => {
                    const event = carouselEvents[carouselIndex];
                    if (!event) return null;
                    return (
                      <motion.div
                        key={carouselIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: 'spring', stiffness: 100, damping: 22 },
                          opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.8}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -50) {
                            nextSlide();
                          } else if (info.offset.x > 50) {
                            prevSlide();
                          }
                        }}
                        onClick={() => setSelectedEvent(event)}
                        className="absolute inset-0 cursor-pointer select-none"
                      >
                        {/* Contenedor interno de la tarjeta para aplicar overflow-hidden, borde y sombra sin cortar al pato rockstar */}
                        <div 
                          className="absolute inset-x-0 top-3 h-[220px] rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
                          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          {event.coverImage ? (
                            <img src={event.coverImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                          ) : (
                            <div className="absolute inset-0" style={{ background: event.coverGradient }} />
                          )}
                          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.85) 100%)' }} />

                          <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                            <span className="px-2.5 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-wider" style={{ background: GRADIENT }}>
                              ⭐ Destacado
                            </span>
                            {event.official && (
                              <span className="px-2.5 py-1 rounded-full text-[9px] font-bold text-cyan-400 bg-cyan-950/40 backdrop-blur-sm border border-cyan-800/40 uppercase tracking-wider">
                                Oficial
                              </span>
                            )}
                          </div>

                          <div className="absolute top-3 right-3 z-10">
                            <button 
                              onClick={e => { e.stopPropagation(); toggleReminder(event.id, e); }}
                              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all active:scale-90"
                            >
                              {eventStates[event.id]?.reminder ? <BellRing size={14} color="#60A5FA" /> : <Bell size={14} color="white" />}
                            </button>
                          </div>

                          <div className="mt-auto p-5 relative z-10">
                            <h3 className="text-white font-extrabold text-base md:text-lg mb-1 leading-tight max-w-[55%]">{event.title}</h3>
                            <p className="text-white/70 text-xs line-clamp-1 mb-3 max-w-[55%]">{event.description}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-white/80 text-[10px] font-semibold">
                                <span className="flex items-center gap-1"><Calendar size={11} />{event.date}</span>
                                <span className="flex items-center gap-1"><Clock size={11} />{event.time}</span>
                              </div>
                              <div onClick={e => e.stopPropagation()}>
                                <ActionButton event={event} compact={true} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pato rockstar animado e interactivo dentro del motion.div para desplazarse con el carrusel */}
                        <div 
                          className="hidden md:block absolute right-32 -bottom-2 h-[250px] w-[250px] z-30 pointer-events-auto"
                          onClick={e => e.stopPropagation()}
                          onPointerDown={e => e.stopPropagation()}
                        >
                          <motion.img 
                            src={mascotRockstar} 
                            alt="Patricia Rockstar" 
                            className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            whileHover={{ scale: 1.08, rotate: 3 }}
                            whileTap={{ scale: 0.95, rotate: -3 }}
                            drag
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            dragElastic={0.2}
                          />
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>


                <button
                  onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex justify-center gap-1.5 mt-3">
                {carouselEvents.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      carouselIndex === idx ? 'w-4 bg-blue-500' : 'w-1.5 bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="px-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} style={{ color: PINK }} />
              <h2 className="font-semibold text-gray-800 dark:text-white">Eventos Próximos</h2>
              {selectedDate && (
                <span className="px-2 py-0.5 rounded-md text-[9px] bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20">
                  Filtrado: {selectedDate.getDate()} {currentMonthName}
                </span>
              )}
              <span className="ml-auto text-[10px] font-medium text-gray-400">{upcomingCarouselEvents.length} eventos</span>
            </div>
            {upcomingCarouselEvents.length === 0 ? (
              <div className="text-center py-10">
                <Calendar size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="font-semibold text-gray-500 dark:text-gray-400 mb-1">No hay eventos próximos</p>
                <p className="text-xs text-gray-400">Prueba cambiando los filtros o la categoría</p>
              </div>
            ) : (
              <div className="relative group px-1">
                <div className="relative h-[106px] rounded-2xl overflow-hidden shadow-md"
                  style={{
                    background: document.documentElement.classList.contains('dark') ? '#112240' : 'rgba(253,252,248,0.95)',
                    border: document.documentElement.classList.contains('dark') ? '1px solid rgba(30,58,95,0.3)' : '1px solid rgba(10,25,47,0.06)',
                  }}
                >
                  <AnimatePresence initial={false} custom={upcomingDirection}>
                    {(() => {
                      const event = upcomingCarouselEvents[upcomingIndex];
                      if (!event) return null;
                      return (
                        <motion.div
                          key={upcomingIndex}
                          custom={upcomingDirection}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: 'spring', stiffness: 100, damping: 22 },
                            opacity: { duration: 0.2 }
                          }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.8}
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -50) {
                              nextUpcoming();
                            } else if (info.offset.x > 50) {
                              prevUpcoming();
                            }
                          }}
                          className="absolute inset-0 select-none"
                        >
                          <EventCard event={event} index={upcomingIndex} isCarouselItem={true} />
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>

                  {upcomingCarouselEvents.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevUpcoming(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextUpcoming(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                </div>

                {upcomingCarouselEvents.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-3">
                    {upcomingCarouselEvents.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setUpcomingDirection(idx > upcomingIndex ? 1 : -1);
                          setUpcomingIndex(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          upcomingIndex === idx ? 'w-4 bg-blue-500' : 'w-1.5 bg-gray-300 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {pastEvents.length > 0 && (
            <div className="px-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <History size={14} className="text-gray-400" />
                <h2 className="font-semibold text-gray-500 dark:text-gray-400">Historial</h2>
                <span className="ml-auto text-[10px] font-medium text-gray-400">{pastEvents.length} eventos</span>
              </div>
              <div className="relative group px-1">
                <div className="relative h-[106px] rounded-2xl overflow-hidden shadow-md"
                  style={{
                    background: document.documentElement.classList.contains('dark') ? '#112240' : 'rgba(253,252,248,0.95)',
                    border: document.documentElement.classList.contains('dark') ? '1px solid rgba(30,58,95,0.3)' : '1px solid rgba(10,25,47,0.06)',
                  }}
                >
                  <AnimatePresence initial={false} custom={pastDirection}>
                    {(() => {
                      const event = pastEvents[pastIndex];
                      if (!event) return null;
                      return (
                        <motion.div
                          key={pastIndex}
                          custom={pastDirection}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: 'spring', stiffness: 100, damping: 22 },
                            opacity: { duration: 0.2 }
                          }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.8}
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -50) {
                              nextPast();
                            } else if (info.offset.x > 50) {
                              prevPast();
                            }
                          }}
                          className="absolute inset-0 select-none"
                        >
                          <EventCard event={event} index={pastIndex} isCarouselItem={true} />
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>

                  {pastEvents.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevPast(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextPast(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                </div>

                {pastEvents.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-3">
                    {pastEvents.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPastDirection(idx > pastIndex ? 1 : -1);
                          setPastIndex(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          pastIndex === idx ? 'w-4 bg-blue-500' : 'w-1.5 bg-gray-300 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="px-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={15} className="text-blue-500" />
            <h2 className="font-extrabold text-gray-800 dark:text-white text-base">Mi Agenda Personal</h2>
            <span className="ml-auto text-[10px] font-bold text-blue-500 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              {agendaEvents.length} Inscritos
            </span>
          </div>

          {nextAgendaEvent && (
            <div className="relative overflow-hidden rounded-3xl p-5 mb-6 border animate-fade-in"
              style={{
                background: document.documentElement.classList.contains('dark')
                  ? 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(59,130,246,0.06) 100%)',
                borderColor: document.documentElement.classList.contains('dark') ? 'rgba(6,182,212,0.35)' : 'rgba(6,182,212,0.2)',
                boxShadow: document.documentElement.classList.contains('dark')
                  ? '0 8px 32px 0 rgba(6,182,212,0.1), inset 0 1px 1px rgba(255,255,255,0.05)'
                  : '0 8px 24px 0 rgba(6,182,212,0.04)',
              }}
            >
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Próximo Evento en tu Agenda</span>
                  </div>
                  <h3 className="text-sm md:text-base font-black text-gray-900 dark:text-white line-clamp-1">{nextAgendaEvent.title}</h3>
                  <p className="text-[10px] text-gray-500 dark:text-cyan-300/80 font-semibold mt-0.5">{nextAgendaEvent.date} · {nextAgendaEvent.time}</p>
                </div>
                
                <div className="flex flex-col items-start md:items-end justify-center">
                  <span className="text-[9px] font-extrabold text-gray-400 dark:text-cyan-300/60 uppercase tracking-widest mb-0.5">CUENTA REGRESIVA</span>
                  <div className="text-xl md:text-2xl font-black tracking-wider text-cyan-600 dark:text-cyan-400">
                    {getCountdownString(nextAgendaEvent)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {agendaEvents.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-3xl"
              style={{
                background: document.documentElement.classList.contains('dark') ? 'rgba(17,34,64,0.3)' : 'rgba(10,25,47,0.01)',
                border: '1.5px dashed rgba(156,163,175,0.15)'
              }}>
              <Calendar size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-700 animate-pulse" />
              <p className="font-extrabold text-gray-700 dark:text-gray-300 text-sm mb-1">Tu agenda está vacía</p>
              <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto">No estás inscrito a ningún evento aún. ¡Explora el feed para inscribirte y agendar tus actividades!</p>
              <button
                onClick={() => setActiveTab('feed')}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold text-white transition-all active:scale-95"
                style={{ background: GRADIENT }}
              >
                Descubrir Eventos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {agendaEvents.map((event, i) => {
                const isDark = document.documentElement.classList.contains('dark');
                const isQRActive = expandedQRId === event.id;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-3xl p-4 flex flex-col relative transition-all"
                    style={{
                      background: isDark ? '#112240' : 'rgba(253,252,248,0.95)',
                      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 4px 20px rgba(10,25,47,0.06)',
                      border: isDark ? '1px solid rgba(30,58,95,0.4)' : '1px solid rgba(10,25,47,0.07)',
                    }}
                  >
                    <div className="flex gap-3" onClick={() => setSelectedEvent(event)}>
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                        style={{ background: event.coverGradient }}
                      >
                        <EmojiIcon emoji={event.emoji} size={28} color="white" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white truncate">{event.title}</h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedQRId(isQRActive ? null : event.id);
                              }}
                              className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all border ${
                                isQRActive
                                  ? 'bg-green-500 text-white border-transparent'
                                  : 'bg-green-500/10 text-green-500 border-green-500/20 active:scale-90'
                              }`}
                            >
                              <QrCode size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{event.description}</p>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] text-gray-400 mt-1 font-semibold">
                          <span className="flex items-center gap-1"><Calendar size={9} />{event.date}</span>
                          <span className="flex items-center gap-1"><Clock size={9} />{event.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative my-3.5 -mx-4 h-px">
                      <div className="absolute inset-0 border-t border-dashed border-gray-200 dark:border-gray-800" />
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f7f5f0] dark:bg-[#060f22] border-r border-gray-200/50 dark:border-blue-900/30" />
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f7f5f0] dark:bg-[#060f22] border-l border-gray-200/50 dark:border-blue-900/30" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 truncate pr-2">
                        <MapPin size={9} />{event.location}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStartCancel(event.id); }}
                        className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-red-500 bg-red-500/10 active:scale-95 transition-all border border-red-500/20"
                      >
                        Cancelar Asistencia
                      </button>
                    </div>

                    <AnimatePresence>
                      {isQRActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col items-center justify-center py-4 border-t border-dashed border-gray-200 dark:border-gray-800 mt-3.5">
                            <div className="bg-white p-3 rounded-2xl shadow-inner border border-gray-100 dark:border-gray-200">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PATRICI.A-EVENT-${event.id}`}
                                alt="Código QR de Acceso"
                                className="w-40 h-40 object-contain block"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2.5 font-bold tracking-wider">
                              MUESTRA ESTE PASE EN LA ENTRADA
                            </p>
                            <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-0.5 uppercase">
                              ID: PATRICI.A-{event.id.toUpperCase()}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'feed' && Object.values(eventStates).some(s => s.reminder) && (
        <div className="px-5 mb-4">
          <h3 className="font-semibold text-sm text-gray-800 dark:text-white mb-3">Tus Recordatorios</h3>
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

                <div className="space-y-3 mb-5">
                  {[
                    { icon: Calendar, color: '#60A5FA', label: 'Fecha y hora', value: `${selectedEvent.date} · ${selectedEvent.time}` },
                    { icon: MapPin, color: '#34D399', label: 'Ubicación', value: selectedEvent.location },
                    { icon: Users, color: '#F472B6', label: 'Organiza', value: selectedEvent.organizer },
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

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Users size={18} style={{ color: '#F472B6' }} />
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

                <div className="flex gap-3">
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
                  {eventStates[selectedEvent.id]?.registered && (
                    <button
                      onClick={() => setShowQRFor(selectedEvent.id)}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                      style={{ background: 'rgba(16,185,129,0.18)', border: '2px solid rgba(16,185,129,0.4)' }}
                    >
                      <QrCode size={22} color="#34D399" />
                    </button>
                  )}
                  <div className="flex-1">
                    <ActionButton event={selectedEvent} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                <button onClick={handleConfirmCancel} className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm bg-red-500 active:scale-95 animate-pulse">
                  Confirmar cancelación
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}