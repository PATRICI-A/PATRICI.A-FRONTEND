import { useState } from 'react';
import lightBg from '../assets/image-3.png';
import darkBg from '../assets/image-2.png';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Plus, LogOut, Sun, Moon, Menu, X, Edit3, XCircle,
  MapPin, Clock, Users, Tag, CheckCircle, AlertCircle, Trash2, Bell
} from 'lucide-react';
import { GRADIENT, PINK, ORANGE, TEAL, GOLD_GRADIENT } from '../types/mockData';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { useApp } from '../store/AppContext';
import logoImg from '../assets/logo_nuevo_patricia.png';
type EventStatus = 'ACTIVE' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED';
type EventCategory = 'ACADEMIC' | 'CULTURAL' | 'SPORTS' | 'WELLNESS';
type EventType = 'OPEN' | 'WITH_CAPACITY';
interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  category: EventCategory;
  type: EventType;
  maxCapacity?: number;
  confirmedAttendees: number;
  status: EventStatus;
  qrCode: string;
  createdAt: string;
}
export function OrganizerDashboardPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<'my-events' | 'create-event'>('my-events');
  const organizerSession = JSON.parse(localStorage.getItem('organizerSession') || '{}');
  const organizerName = organizerSession.name || 'Organizador';
  const organizerEmail = organizerSession.email || '';
  const [events, setEvents] = useState<Event[]>([
    {
      id: 'e1',
      name: 'Hackathon ECI 2025',
      description: 'Competencia de programación de 24 horas para estudiantes',
      date: '2025-06-15',
      time: '09:00',
      duration: 1440,
      location: 'Auditorio Principal',
      category: 'ACADEMIC',
      type: 'WITH_CAPACITY',
      maxCapacity: 100,
      confirmedAttendees: 78,
      status: 'ACTIVE',
      qrCode: 'QR_e1_12345',
      createdAt: '2025-05-01T10:00:00Z'
    },
    {
      id: 'e2',
      name: 'Festival de Música Campus',
      description: 'Concierto al aire libre con bandas estudiantiles',
      date: '2025-05-20',
      time: '18:00',
      duration: 180,
      location: 'Plazoleta Central',
      category: 'CULTURAL',
      type: 'OPEN',
      confirmedAttendees: 234,
      status: 'IN_PROGRESS',
      qrCode: 'QR_e2_67890',
      createdAt: '2025-04-15T14:30:00Z'
    },
    {
      id: 'e3',
      name: 'Torneo de Fútbol',
      description: 'Campeonato interuniversitario de fútbol',
      date: '2025-04-10',
      time: '15:00',
      duration: 240,
      location: 'Cancha Deportiva',
      category: 'SPORTS',
      type: 'WITH_CAPACITY',
      maxCapacity: 50,
      confirmedAttendees: 48,
      status: 'FINISHED',
      qrCode: 'QR_e3_11223',
      createdAt: '2025-03-20T09:00:00Z'
    }
  ]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    location: '',
    category: 'ACADEMIC' as EventCategory,
    type: 'OPEN' as EventType,
    maxCapacity: 2
  });
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelEventId, setCancelEventId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonError, setCancelReasonError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successButtonLabel, setSuccessButtonLabel] = useState('Ver mis eventos');
  const handleLogout = () => {
    localStorage.removeItem('organizerSession');
    navigate('/login');
  };
  const showError = (msg: string) => { setErrorMessage(msg); setShowErrorModal(true); };
  const showSuccess = (msg: string, btnLabel = 'Ver mis eventos') => { setSuccessMessage(msg); setSuccessButtonLabel(btnLabel); setShowSuccessModal(true); };
  const handleCreateEvent = () => {
    if (!formData.name || !formData.description || !formData.date || !formData.time || !formData.location) {
      showError('Por favor completa todos los campos obligatorios antes de publicar el evento.');
      return;
    }
    if (formData.name.length > 100) {
      showError('El nombre del evento no puede exceder 100 caracteres.');
      return;
    }
    if (formData.description.length > 500) {
      showError('La descripción no puede exceder 500 caracteres.');
      return;
    }
    if (formData.duration < 15) {
      showError('La duración mínima del evento es 15 minutos.');
      return;
    }
    if (formData.type === 'WITH_CAPACITY' && formData.maxCapacity < 2) {
      showError('El cupo mínimo es 2 personas.');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.date);
    if (selectedDate < today) {
      showError('La fecha del evento no puede ser anterior a hoy.');
      return;
    }
    const isToday = selectedDate.toDateString() === today.toDateString();
    if (isToday && !formData.time) {
      showError('Debes especificar la hora de inicio cuando el evento es hoy.');
      return;
    }
    const newEvent: Event = {
      id: `e${Date.now()}`,
      name: formData.name,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      location: formData.location,
      category: formData.category,
      type: formData.type,
      maxCapacity: formData.type === 'WITH_CAPACITY' ? formData.maxCapacity : undefined,
      confirmedAttendees: 0,
      status: 'ACTIVE',
      qrCode: `QR_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setEvents([...events, newEvent]);
    setFormData({
      name: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      location: '',
      category: 'ACADEMIC',
      type: 'OPEN',
      maxCapacity: 2
    });
    showSuccess('¡Evento publicado exitosamente! Ya está visible para los estudiantes.');
  };
  const handleEditEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    setFormData({
      name: event.name,
      description: event.description,
      date: event.date,
      time: event.time,
      duration: event.duration,
      location: event.location,
      category: event.category,
      type: event.type,
      maxCapacity: event.maxCapacity || 2
    });
    setEditingEventId(eventId);
    setActiveSection('create-event');
  };
  const handleUpdateEvent = () => {
    if (!editingEventId) return;
    if (!formData.name || !formData.description || !formData.date || !formData.time || !formData.location) {
      showError('Por favor completa todos los campos obligatorios antes de guardar los cambios.');
      return;
    }
    setEvents(events.map(e => {
      if (e.id === editingEventId) {
        return {
          ...e,
          name: formData.name,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          location: formData.location,
          category: formData.category,
          type: formData.type,
          maxCapacity: formData.type === 'WITH_CAPACITY' ? formData.maxCapacity : undefined
        };
      }
      return e;
    }));
    setEditingEventId(null);
    setFormData({
      name: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      location: '',
      category: 'ACADEMIC',
      type: 'OPEN',
      maxCapacity: 2
    });
    showSuccess('¡Evento actualizado exitosamente! Los cambios ya están aplicados.');
  };
  const handleCancelEventClick = (eventId: string) => {
    setCancelEventId(eventId);
    setShowCancelModal(true);
  };
  const handleConfirmCancel = () => {
    if (!cancelEventId) return;
    if (!cancelReason.trim()) {
      setCancelReasonError('El motivo de cancelación no puede quedar vacío.');
      return;
    }
    if (cancelReason.length > 300) {
      setCancelReasonError('El motivo no puede exceder 300 caracteres.');
      return;
    }
    setCancelReasonError('');
    const event = events.find(e => e.id === cancelEventId);
    const attendeesCount = event?.confirmedAttendees || 0;
    setEvents(events.map(e => {
      if (e.id === cancelEventId) {
        return { ...e, status: 'CANCELLED' as EventStatus };
      }
      return e;
    }));
    setShowCancelModal(false);
    setCancelEventId(null);
    setCancelReason('');
    setCancelReasonError('');
    showSuccess(`Evento cancelado correctamente. Se notificó a ${attendeesCount} estudiante${attendeesCount !== 1 ? 's' : ''} inscrito${attendeesCount !== 1 ? 's' : ''}.`, 'Aceptar');
  };
  const getStatusBadge = (status: EventStatus) => {
    const badges = {
      ACTIVE: { label: 'Activo', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
      IN_PROGRESS: { label: 'En Progreso', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
      FINISHED: { label: 'Finalizado', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
      CANCELLED: { label: 'Cancelado', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' }
    };
    const badge = badges[status];
    return (
      <span
        className="px-2 py-1 rounded-lg text-xs font-bold"
        style={{ background: badge.bg, color: badge.color }}
      >
        {badge.label}
      </span>
    );
  };
  const getCategoryLabel = (category: EventCategory) => {
    const labels = {
      ACADEMIC: 'Académico',
      CULTURAL: 'Cultural',
      SPORTS: 'Deportivo',
      WELLNESS: 'Bienestar'
    };
    return labels[category];
  };
  return (
    <div
      className="min-h-screen flex relative"
      style={{
        backgroundImage: `url(${isDark ? darkBg : lightBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <DoodleBackground isDark={isDark} opacity={0.3} />
      {}
      <header
        className="fixed top-0 left-0 right-0 z-[70]"
        style={isDark
          ? { background: 'rgba(3,13,31,0.96)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(30,58,95,0.5)', boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }
          : { background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(10,25,47,0.06)', boxShadow: '0 2px 20px rgba(10,25,47,0.07)' }
        }
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="flex items-center gap-2.5 active:opacity-70 transition-opacity"
            onClick={() => setSidebarOpen(prev => !prev)}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
              <img src={logoImg} alt="patrici.a" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start">
              <span
                className="font-bold tracking-tight leading-none"
                style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.05rem' }}
              >
                PATRICI.A
              </span>
              <span className="text-[10px] tracking-wide" style={{ color: isDark ? '#4A6080' : '#9CA3AF' }}>
                Panel Organizador
              </span>
            </div>
            <Menu size={15} style={{ color: isDark ? '#4A6080' : '#9CA3AF', marginLeft: 2 }} />
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={isDark
                ? { background: 'rgba(23,42,69,0.8)', color: '#9CA3AF' }
                : { background: 'rgba(253,252,248,0.80)', color: '#4A5568', boxShadow: '0 1px 8px rgba(10,25,47,0.09)', border: '1px solid rgba(10,25,47,0.07)' }
              }
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 relative"
              style={isDark
                ? { background: 'rgba(23,42,69,0.8)', color: '#9CA3AF' }
                : { background: 'rgba(253,252,248,0.80)', color: '#4A5568', boxShadow: '0 1px 8px rgba(10,25,47,0.09)', border: '1px solid rgba(10,25,47,0.07)' }
              }
            >
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-[14px] h-[14px] rounded-full text-white flex items-center justify-center font-bold" style={{ background: GRADIENT, fontSize: '8px' }}>
                2
              </span>
            </button>
            <div className="relative flex-shrink-0">
              <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ background: GRADIENT }}>
                {organizerName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2" style={{ background: '#10B981', borderColor: isDark ? '#030D1F' : '#F7F5F0' }} />
            </div>
          </div>
        </div>
      </header>
      {}
      <aside
        className={`fixed left-0 top-0 h-screen w-[280px] max-w-[80vw] bg-white dark:bg-[#112240] border-r border-gray-200 dark:border-[#1E3A5F] z-[60] shadow-xl transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-gray-200 dark:border-[#1E3A5F]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white">
                <img src={logoImg} alt="patrici.a" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-black text-gray-900 dark:text-white text-sm">patrici.a</h2>
                <p className="text-xs" style={{ color: PINK }}>Panel Organizador</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A2F4A] flex items-center justify-center text-gray-500 dark:text-gray-400"
            >
              <X size={18} />
            </button>
          </div>
          {}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A]">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: GRADIENT }}>
              <Calendar size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{organizerName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{organizerEmail}</p>
            </div>
          </div>
        </div>
        {}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => { setActiveSection('my-events'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all relative overflow-hidden ${
              activeSection === 'my-events'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A2F4A]'
            }`}
          >
            {activeSection === 'my-events' && <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full" style={{ background: GOLD_GRADIENT }} />}
            <Calendar size={18} className="flex-shrink-0" />
            <span className="flex-1 text-left text-sm font-semibold">Mis Eventos</span>
          </button>
          <button
            onClick={() => {
              setEditingEventId(null);
              setFormData({
                name: '',
                description: '',
                date: '',
                time: '',
                duration: 60,
                location: '',
                category: 'ACADEMIC',
                type: 'OPEN',
                maxCapacity: 2
              });
              setActiveSection('create-event');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all relative overflow-hidden ${
              activeSection === 'create-event'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A2F4A]'
            }`}
          >
            {activeSection === 'create-event' && <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full" style={{ background: GOLD_GRADIENT }} />}
            <Plus size={18} className="flex-shrink-0" />
            <span className="flex-1 text-left text-sm font-semibold">Crear Evento</span>
          </button>
        </nav>
        {}
        <div className="p-4 border-t border-gray-200 dark:border-[#1E3A5F] space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A2F4A] transition-all"
          >
            {isDark ? <Sun size={18} className="flex-shrink-0" /> : <Moon size={18} className="flex-shrink-0" />}
            <span className="flex-1 text-left text-sm font-semibold">
              {isDark ? 'Modo Claro' : 'Modo Oscuro'}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="flex-1 text-left text-sm font-semibold">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      {}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55]"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {}
      <div className="flex-1 pt-[57px]">
        {}
        <div className="p-5 max-w-7xl mx-auto relative z-10">
          {}
          {activeSection === 'my-events' && (
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{ background: GRADIENT }}
                  >
                    <Calendar size={32} className="text-white" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">
                    Sin eventos
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-xs mb-4">
                    Aún no has creado ningún evento. ¡Crea el primero!
                  </p>
                  <button
                    onClick={() => setActiveSection('create-event')}
                    className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg"
                    style={{ background: GRADIENT }}
                  >
                    Crear Evento
                  </button>
                </div>
              ) : (
                events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-[#1E3A5F]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">
                          {event.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {event.description}
                        </p>
                      </div>
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar size={16} style={{ color: PINK }} />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock size={16} style={{ color: PINK }} />
                        <span>{event.time} ({event.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin size={16} style={{ color: PINK }} />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Tag size={16} style={{ color: PINK }} />
                        <span>{getCategoryLabel(event.category)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} style={{ color: TEAL }} />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {event.confirmedAttendees} confirmados
                          {event.maxCapacity && ` / ${event.maxCapacity} cupos`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.status === 'ACTIVE' ? (
                        <>
                          <button
                            onClick={() => handleEditEvent(event.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            <Edit3 size={16} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleCancelEventClick(event.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <XCircle size={16} />
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1A2F4A] text-gray-400 dark:text-gray-500 font-semibold text-sm cursor-not-allowed"
                          title="Solo se pueden modificar eventos activos"
                        >
                          <AlertCircle size={16} />
                          Solo se pueden modificar eventos activos
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
          {}
          {activeSection === 'create-event' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-[#112240] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-[#1E3A5F]">
                <div className="space-y-4">
                  {}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nombre del Evento
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Hackathon ECI 2025"
                      maxLength={100}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.name.length}/100 caracteres
                    </p>
                  </div>
                  {}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe el evento..."
                      maxLength={500}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.description.length}/500 caracteres
                    </p>
                  </div>
                  {}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Fecha
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Hora de Inicio
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  {}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Duración (minutos)
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                        min={15}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Ej: Auditorio Principal"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  {}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="ACADEMIC">Académico</option>
                      <option value="CULTURAL">Cultural</option>
                      <option value="SPORTS">Deportivo</option>
                      <option value="WELLNESS">Bienestar</option>
                    </select>
                  </div>
                  {}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de Evento
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="OPEN">Abierto (cualquiera puede inscribirse)</option>
                      <option value="WITH_CAPACITY">Con Cupo Limitado</option>
                    </select>
                  </div>
                  {}
                  {formData.type === 'WITH_CAPACITY' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Cupo Máximo
                      </label>
                      <input
                        type="number"
                        value={formData.maxCapacity}
                        onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 2 })}
                        min={2}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                  {}
                  <button
                    onClick={editingEventId ? handleUpdateEvent : handleCreateEvent}
                    className="w-full py-4 rounded-xl text-white font-semibold shadow-lg flex items-center justify-center gap-2"
                    style={{ background: GRADIENT }}
                  >
                    {editingEventId ? (
                      <>
                        <CheckCircle size={20} />
                        Actualizar Evento
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Publicar Evento
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-5"
            onClick={() => setShowErrorModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#112240] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={20} className="text-red-500" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Campos incompletos</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                {errorMessage}
              </p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-5"
            onClick={() => { setShowSuccessModal(false); setActiveSection('my-events'); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#112240] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={20} className="text-green-500" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">¡Listo!</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                {successMessage}
              </p>
              <button
                onClick={() => { setShowSuccessModal(false); setActiveSection('my-events'); }}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors"
                style={{ background: GRADIENT }}
              >
                {successButtonLabel}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#112240] rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Cancelar Evento
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Ingresa el motivo de la cancelación. Los estudiantes inscritos recibirán una notificación automática.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => { setCancelReason(e.target.value); if (cancelReasonError) setCancelReasonError(''); }}
                placeholder="Motivo de cancelación..."
                maxLength={300}
                rows={4}
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border text-gray-900 dark:text-white focus:outline-none resize-none mb-1 transition-colors ${
                  cancelReasonError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 dark:border-[#233554] focus:border-blue-500'
                }`}
              />
              {cancelReasonError ? (
                <p className="text-xs text-red-500 font-medium mb-3 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {cancelReasonError}
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {cancelReason.length}/300 caracteres
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                    setCancelReasonError('');
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-[#1A2F4A] text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-[#233554] transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Confirmar Cancelación
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}