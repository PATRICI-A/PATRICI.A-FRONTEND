import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, BellRing, Calendar, MapPin, Clock, Users, ChevronRight, Filter, X } from 'lucide-react';
import { events, GRADIENT, PINK, ORANGE } from '../data/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import type { Event } from '../data/mockData';

const categories = ['Todos', 'Música', 'Tecnología', 'Bienestar', 'Social', 'Arte', 'Emprendimiento'];

export function EventsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showOfficialOnly, setShowOfficialOnly] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [eventStates, setEventStates] = useState<Record<string, { registered: boolean; reminder: boolean }>>(
    Object.fromEntries(events.map(e => [e.id, { registered: e.registered, reminder: e.reminder }]))
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const toggleRegistration = (id: string) => {
    setEventStates(prev => ({
      ...prev,
      [id]: { ...prev[id], registered: !prev[id].registered },
    }));
  };

  const toggleReminder = (id: string) => {
    setEventStates(prev => ({
      ...prev,
      [id]: { ...prev[id], reminder: !prev[id].reminder },
    }));
  };

  const filtered = events.filter(e => {
    const matchesCategory = activeCategory === 'Todos' || e.category === activeCategory;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOfficial = !showOfficialOnly || e.official;
    return matchesCategory && matchesSearch && matchesOfficial;
  });

  const featuredEvent = events[0];

  return (
    <div className="flex flex-col min-h-screen pb-4">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-gray-900 dark:text-white">Eventos</h1>
            <p className="text-sm text-gray-400">Lo que está pasando en el campus</p>
          </div>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#112240] shadow-sm flex items-center justify-center transition-colors active:scale-90"
            style={showFilterPanel ? { background: GRADIENT, color: 'white' } : { color: '#6B7280' }}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar eventos..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#112240] border border-gray-100 dark:border-[#233554] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none text-sm shadow-sm"
          />
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="mb-4 p-4 bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-gray-100 dark:border-[#233554]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Filtros</p>
              <button onClick={() => setShowFilterPanel(false)}>
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <button
              onClick={() => setShowOfficialOnly(!showOfficialOnly)}
              className="flex items-center gap-3 w-full"
            >
              <div
                className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                style={showOfficialOnly ? { borderColor: '#1D4ED8', background: GRADIENT } : { borderColor: '#D1D5DB' }}
              >
                {showOfficialOnly && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Solo eventos oficiales</span>
            </button>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
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

      {/* Featured Event */}
      {activeCategory === 'Todos' && !searchQuery && (
        <div className="px-5 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedEvent(featuredEvent)}
            className="relative rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            style={{ height: '220px' }}
          >
            <img
              src={featuredEvent.coverImage}
              alt={featuredEvent.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.0) 20%, rgba(0,0,0,0.85) 100%)' }} />

            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: GRADIENT }}>
                ⭐ EVENTO OFICIAL
              </span>
            </div>

            <div className="absolute top-3 right-3">
              <button
                onClick={e => { e.stopPropagation(); toggleReminder(featuredEvent.id); }}
                className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
              >
                {eventStates[featuredEvent.id]?.reminder ? (
                  <BellRing size={14} color="#60A5FA" />
                ) : (
                  <Bell size={14} color="white" />
                )}
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg mb-1">{featuredEvent.title}</h3>
              <p className="text-white/70 text-xs mb-3 line-clamp-2">{featuredEvent.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white/70 text-xs">
                  <span className="flex items-center gap-1"><Calendar size={10} />{featuredEvent.date}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{featuredEvent.time}</span>
                  <span>👥 {featuredEvent.attendees}+ van</span>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); toggleRegistration(featuredEvent.id); }}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={
                    eventStates[featuredEvent.id]?.registered
                      ? { background: 'rgba(255,255,255,0.9)', color: PINK }
                      : { background: GRADIENT, color: 'white' }
                  }
                >
                  {eventStates[featuredEvent.id]?.registered ? '✓ Inscrito' : 'Inscribirme'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Event List */}
      <div className="px-5 space-y-3">
        {filtered.map((event, i) => {
          const state = eventStates[event.id];
          if (event.id === featuredEvent.id && activeCategory === 'Todos' && !searchQuery) return null;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedEvent(event)}
              className="bg-white dark:bg-[#112240] rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex">
                {/* Color bar */}
                <div className="w-1.5 flex-shrink-0" style={{ background: event.coverGradient }} />

                <div className="flex-1 p-4">
                  <div className="flex items-start gap-3">
                    {/* Emoji icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: event.coverGradient }}
                    >
                      <EmojiIcon emoji={event.emoji} size={22} color="white" strokeWidth={2} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{event.title}</h3>
                            {event.official && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: ORANGE, background: 'rgba(6,182,212,0.12)' }}>
                                OFICIAL
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{event.description}</p>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); toggleReminder(event.id); }}
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-[#172A45]"
                        >
                          {state?.reminder ? (
                            <BellRing size={14} color="#60A5FA" />
                          ) : (
                            <Bell size={14} className="text-gray-400" />
                          )}
                        </button>
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
                            {event.attendees} van
                            {event.maxAttendees && ` · ${event.maxAttendees - event.attendees} cupos`}
                          </span>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); toggleRegistration(event.id); }}
                          className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
                          style={
                            state?.registered
                              ? { color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }
                              : { background: GRADIENT, color: 'white' }
                          }
                        >
                          {state?.registered ? '✓ Inscrito' : 'Unirme'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={52} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No encontramos eventos para esta búsqueda</p>
          </div>
        )}
      </div>

      {/* Upcoming Reminders */}
      {Object.values(eventStates).some(s => s.reminder) && (
        <div className="px-5 mt-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Tus Recordatorios</h3>
          <div className="space-y-2">
            {events.filter(e => eventStates[e.id]?.reminder).map(event => (
              <div
                key={event.id}
                className="flex items-center gap-3 bg-white dark:bg-[#112240] rounded-xl p-3 shadow-sm"
              >
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

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
              style={{
                background: 'linear-gradient(to bottom, rgba(17,34,64,0.98) 0%, rgba(10,25,47,0.98) 100%)',
                border: '1.5px solid rgba(255,255,255,0.1)',
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <X size={18} />
              </button>

              {/* Cover Image or Gradient */}
              {selectedEvent.coverImage ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={selectedEvent.coverImage}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(10,25,47,0.95) 100%)' }} />
                </div>
              ) : (
                <div className="h-32" style={{ background: selectedEvent.coverGradient }} />
              )}

              {/* Content */}
              <div className="p-6 -mt-8 relative">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                  style={{ background: selectedEvent.coverGradient }}
                >
                  <EmojiIcon emoji={selectedEvent.emoji} size={32} color="white" strokeWidth={2} />
                </div>

                {/* Title and Badge */}
                <div className="flex items-start gap-2 mb-3">
                  <h2 className="text-white font-bold text-xl flex-1">{selectedEvent.title}</h2>
                  {selectedEvent.official && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex-shrink-0" style={{ background: GRADIENT }}>
                      OFICIAL
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {selectedEvent.description}
                </p>

                {/* Details Grid */}
                <div className="space-y-3 mb-6">
                  {/* Date and Time */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Calendar size={18} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-0.5">Fecha y hora</p>
                      <p className="text-white text-sm font-medium">{selectedEvent.date}</p>
                      <p className="text-gray-300 text-sm">{selectedEvent.time}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-0.5">Ubicación</p>
                      <p className="text-white text-sm font-medium">{selectedEvent.location}</p>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Users size={18} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-0.5">Organiza</p>
                      <p className="text-white text-sm font-medium">{selectedEvent.organizer}</p>
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Users size={18} style={{ color: PINK }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-0.5">Asistentes</p>
                      <p className="text-white text-sm font-medium">
                        {selectedEvent.attendees} confirmados
                        {selectedEvent.maxAttendees && (
                          <span className="text-gray-300"> · {selectedEvent.maxAttendees - selectedEvent.attendees} cupos disponibles</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {/* Reminder Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReminder(selectedEvent.id);
                    }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                    style={{
                      background: eventStates[selectedEvent.id]?.reminder
                        ? 'rgba(96,165,250,0.2)'
                        : 'rgba(255,255,255,0.1)',
                      border: eventStates[selectedEvent.id]?.reminder
                        ? '2px solid rgba(96,165,250,0.5)'
                        : '2px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {eventStates[selectedEvent.id]?.reminder ? (
                      <BellRing size={22} color="#60A5FA" />
                    ) : (
                      <Bell size={22} className="text-white" />
                    )}
                  </button>

                  {/* Join/Registered Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRegistration(selectedEvent.id);
                    }}
                    className="flex-1 h-14 rounded-2xl font-bold text-base transition-all active:scale-95 flex items-center justify-center gap-2"
                    style={
                      eventStates[selectedEvent.id]?.registered
                        ? {
                            background: 'rgba(16,185,129,0.2)',
                            color: '#10B981',
                            border: '2px solid rgba(16,185,129,0.5)',
                          }
                        : {
                            background: GRADIENT,
                            color: 'white',
                          }
                    }
                  >
                    {eventStates[selectedEvent.id]?.registered ? (
                      <>
                        <span>✓</span>
                        <span>Ya estoy inscrito</span>
                      </>
                    ) : (
                      <span>Unirme</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}