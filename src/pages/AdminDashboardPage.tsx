import * as React from 'react';
import { useState } from 'react';
import lightBg from '../assets/image-3.png';
import darkBg from '../assets/image-2.png';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Calendar, Heart, TrendingUp, Download, ShieldCheck,
  BarChart3, MapPin, MessageCircle, AlertTriangle, LogOut,
  Menu, X, ChevronRight, Activity, Zap, Eye, Ban, CheckCircle,
  XCircle, Edit3, Trash2, Flag, Settings, Sun, Moon, UserCheck,
  Search, Filter, MoreVertical, Lock, Unlock, Sliders, Bell,
  Clock, ChevronDown
} from 'lucide-react';
import { GRADIENT, PINK, ORANGE, TEAL, GOLD_LIGHT, GOLD_GRADIENT } from '../types/mockData';
import logoImg from '../assets/logo_nuevo_patricia.png';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { useApp } from '../store/AppContext';
interface Metric {
  label: string;
  value: string | number;
  change: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bg: string;
}
interface UserReport {
  id: string;
  category: 'comportamiento' | 'spam' | 'acoso' | 'contenido' | 'otro';
  message: string;
  reporter: string;
  date: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  faculty: string;
  status: 'active' | 'suspended' | 'banned';
  verified: boolean;
  xp: number;
  level: number;
  reports: number;
  reportDetails?: UserReport[];
}
interface Parche {
  id: string;
  name: string;
  creator: string;
  members: number;
  reports: number;
  location: string;
  status: 'active' | 'flagged' | 'deleted';
}
interface Event {
  id: string;
  title: string;
  organizer: string;
  date: string;
  attendees: number;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
}
interface Patricia {
  id: string;
  name: string;
  description: string;
  rarity: 'comun' | 'rara' | 'epica' | 'legendaria';
  category: string;
  xpValue: number;
  unlockCondition: string;
  obtainedCount: number;
  active: boolean;
}
export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParche, setSelectedParche] = useState<Parche | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [scheduleEmailError, setScheduleEmailError] = useState('');
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const showError = (msg: string) => { setErrorMessage(msg); setShowErrorModal(true); };
  const showSuccess = (msg: string) => { setSuccessMessage(msg); setShowSuccessModal(true); };
  const showConfirm = (title: string, message: string, onConfirm: () => void) => setConfirmModal({ title, message, onConfirm });
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-05-31');
  const [metricType, setMetricType] = useState<'all' | 'users' | 'parches' | 'events' | 'matches' | 'zones'>('all');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [reportStartDate, setReportStartDate] = useState('2025-01-01');
  const [reportEndDate, setReportEndDate] = useState('2025-05-31');
  const [showPreview, setShowPreview] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [scheduleEmail, setScheduleEmail] = useState('');
  const [statsStartDate, setStatsStartDate] = useState('2025-01-01');
  const [statsEndDate, setStatsEndDate] = useState('2025-05-31');
  const [statsType, setStatsType] = useState<'all' | 'events' | 'participation' | 'social'>('all');

  // Nuevo estado para Creación de Eventos
  const [newEvent, setNewEvent] = useState({
    title: '', date: '', time: '', location: '', description: '', coverImage: ''
  });
  const [includePatricia, setIncludePatricia] = useState(false);
  const [newPatricia, setNewPatricia] = useState({
    image: '', description: '', xpValue: 50, rarity: 'comun'
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      showError('Por favor completa los campos obligatorios (Título, Fecha, Ubicación).');
      return;
    }
    const createdEvent: Event = {
      id: `e${Date.now()}`,
      title: newEvent.title,
      organizer: 'Administrador',
      date: newEvent.date,
      attendees: 0,
      status: 'approved',
      category: 'Evento Oficial'
    };
    setEvents(prev => [createdEvent, ...prev]);
    showSuccess(`Evento "${newEvent.title}" publicado exitosamente${includePatricia ? ' con Patricia asociada' : ''}.`);
    setNewEvent({ title: '', date: '', time: '', location: '', description: '', coverImage: '' });
    setIncludePatricia(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin/login');
  };
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', name: 'María González', email: 'maria.g@mail.escuelaing.edu.co', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', faculty: 'Sistemas', status: 'active', verified: true, xp: 3200, level: 12, reports: 0 },
    { id: 'u2', name: 'Carlos Mendoza', email: 'carlos.m@mail.escuelaing.edu.co', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', faculty: 'Civil', status: 'active', verified: true, xp: 2800, level: 10, reports: 0 },
    { id: 'u3', name: 'Ana Torres', email: 'ana.t@mail.escuelaing.edu.co', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', faculty: 'Industrial', status: 'flagged', verified: true, xp: 1500, level: 7, reports: 3, reportDetails: [
      { id: 'r1', category: 'comportamiento', message: 'Esta usuaria publicó comentarios ofensivos en el parche de Cálculo 3, insultando a otros miembros del grupo por no entender los ejercicios.', reporter: 'carlos.m@mail.escuelaing.edu.co', date: '2025-05-10' },
      { id: 'r2', category: 'acoso', message: 'Me envió mensajes privados reiterados después de que le pedí que parara. Siento que me está acosando dentro de la plataforma.', reporter: 'juan.p@mail.escuelaing.edu.co', date: '2025-05-08' },
      { id: 'r3', category: 'contenido', message: 'Compartió imágenes inapropiadas en el chat del parche "Café y Conversa" sin ningún aviso previo.', reporter: 'maria.g@mail.escuelaing.edu.co', date: '2025-05-06' },
    ]},
    { id: 'u4', name: 'Juan Pérez', email: 'juan.p@mail.escuelaing.edu.co', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', faculty: 'Mecánica', status: 'suspended', verified: false, xp: 900, level: 5, reports: 5, reportDetails: [
      { id: 'r4', category: 'spam', message: 'Está spameando el feed con publicaciones repetidas sobre un negocio personal, varias veces al día durante semanas.', reporter: 'maria.g@mail.escuelaing.edu.co', date: '2025-05-12' },
      { id: 'r5', category: 'comportamiento', message: 'En el parche de Fútbol Campus empezó a insultar a los otros jugadores cuando perdieron el partido. El lenguaje fue muy agresivo.', reporter: 'ana.t@mail.escuelaing.edu.co', date: '2025-05-11' },
      { id: 'r6', category: 'spam', message: 'Envía mensajes masivos con links externos a todos los usuarios del parche sin que nadie se lo haya pedido.', reporter: 'carlos.m@mail.escuelaing.edu.co', date: '2025-05-09' },
      { id: 'r7', category: 'acoso', message: 'Me bloqueó y creó una cuenta nueva solo para seguir enviándome mensajes. Esto ya es acoso sistemático.', reporter: 'maria.g@mail.escuelaing.edu.co', date: '2025-05-07' },
      { id: 'r8', category: 'contenido', message: 'Publicó capturas de pantalla privadas de conversaciones de otros usuarios sin su consentimiento.', reporter: 'ana.t@mail.escuelaing.edu.co', date: '2025-05-05' },
    ]},
  ]);
  const [parches, setParches] = useState<Parche[]>([
    { id: 'p1', name: 'Gaming Night ECI', creator: 'Carlos M.', members: 24, reports: 0, location: 'Bloque A', status: 'active' },
    { id: 'p2', name: 'Estudio Cálculo 3', creator: 'María G.', members: 15, reports: 0, location: 'Biblioteca', status: 'active' },
    { id: 'p3', name: 'Futbol Campus', creator: 'Juan P.', members: 32, reports: 2, location: 'Zona Deportiva', status: 'flagged' },
    { id: 'p4', name: 'Cafe y Conversa', creator: 'Ana T.', members: 18, reports: 0, location: 'Cafetería', status: 'active' },
  ]);
  const [events, setEvents] = useState<Event[]>([
    { id: 'e1', title: 'Hackathon ECI 2025', organizer: 'Decanatura Sistemas', date: '2025-05-15', attendees: 120, status: 'approved', category: 'Tecnología' },
    { id: 'e2', title: 'Festival de Música Campus', organizer: 'Bienestar Universitario', date: '2025-05-20', attendees: 0, status: 'pending', category: 'Cultural' },
    { id: 'e3', title: 'Feria de Semestre', organizer: 'Admin', date: '2025-05-25', attendees: 85, status: 'approved', category: 'Académico' },
    { id: 'e4', title: 'Torneo Interuniversitario', organizer: 'Club Deportivo', date: '2025-06-01', attendees: 0, status: 'pending', category: 'Deportivo' },
  ]);
  const [patricias, setPatricias] = useState<Patricia[]>([
    { id: 'pat1', name: 'Mona Lisa Ingeniera', description: 'Una patricia de nivel común que celebra la creatividad', rarity: 'comun', category: 'Arte', xpValue: 50, unlockCondition: 'Completar primer parche', obtainedCount: 1247, active: true },
    { id: 'pat2', name: 'La Gioconda Matemática', description: 'Patricia rara para amantes de las ciencias exactas', rarity: 'rara', category: 'Ciencias', xpValue: 100, unlockCondition: 'Obtener 500 XP', obtainedCount: 543, active: true },
    { id: 'pat3', name: 'Mona Tech', description: 'Patricia épica con poderes tecnológicos', rarity: 'epica', category: 'Tecnología', xpValue: 250, unlockCondition: 'Ganar un hackathon', obtainedCount: 89, active: true },
    { id: 'pat4', name: 'La Gran Patricia', description: 'La patricia más legendaria de todas', rarity: 'legendaria', category: 'Especial', xpValue: 500, unlockCondition: 'Alcanzar nivel 50', obtainedCount: 12, active: true },
    { id: 'pat5', name: 'Patricia Deportista', description: 'Para los más activos del campus', rarity: 'comun', category: 'Deportes', xpValue: 50, unlockCondition: 'Asistir a 3 eventos deportivos', obtainedCount: 821, active: true },
    { id: 'pat6', name: 'Patricia Cultural', description: 'Celebra las artes y la cultura', rarity: 'rara', category: 'Cultura', xpValue: 100, unlockCondition: 'Asistir a evento cultural', obtainedCount: 392, active: false },
  ]);
  const handleExportCSV = () => {
    const csvData = `data:text/csv;charset=utf-8,Usuario,Email,Facultad,XP,Nivel,Estado\n${users.map(u => `${u.name},${u.email},${u.faculty},${u.xp},${u.level},${u.status}`).join('\n')}`;
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvData));
    link.setAttribute('download', 'patrici_a_users_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleSuspendUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    const nextStatus = user?.status === 'suspended' ? 'active' : 'suspended';
    const action = nextStatus === 'suspended' ? 'suspendido' : 'reactivado';
    showConfirm(
      nextStatus === 'suspended' ? 'Suspender usuario' : 'Reactivar usuario',
      `¿Confirmas que deseas ${nextStatus === 'suspended' ? 'suspender' : 'reactivar'} a ${user?.name}?`,
      () => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus as User['status'] } : u));
        showSuccess(`Usuario ${user?.name} ${action} correctamente.`);
      }
    );
  };
  const handleBanUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    showConfirm(
      'Banear usuario',
      `¿Estás seguro de que deseas banear a ${user?.name}? Esta acción bloqueará permanentemente su acceso.`,
      () => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'banned' } : u));
        showSuccess(`Usuario ${user?.name} baneado correctamente.`);
      }
    );
  };
  const handleVerifyUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    const nextVerified = !user?.verified;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: nextVerified } : u));
    showSuccess(`Usuario ${user?.name} ${nextVerified ? 'verificado' : 'desverificado'} correctamente.`);
  };
  const handleDeleteParche = (parcheId: string) => {
    const parche = parches.find(p => p.id === parcheId);
    showConfirm(
      'Eliminar parche',
      `¿Confirmas la eliminación del parche "${parche?.name}"? Esta acción no se puede deshacer.`,
      () => {
        setParches(prev => prev.map(p => p.id === parcheId ? { ...p, status: 'deleted' } : p));
        showSuccess(`Parche "${parche?.name}" eliminado correctamente.`);
      }
    );
  };
  const handleApproveEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'approved' } : e));
    showSuccess(`Evento "${event?.title}" aprobado correctamente.`);
  };
  const handleRejectEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    showConfirm(
      'Rechazar evento',
      `¿Confirmas el rechazo del evento "${event?.title}"?`,
      () => {
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'rejected' } : e));
        showSuccess(`Evento "${event?.title}" rechazado.`);
      }
    );
  };
  const handleTogglePatricia = (patriciaId: string) => {
    const patricia = patricias.find(p => p.id === patriciaId);
    const nextActive = !patricia?.active;
    setPatricias(prev => prev.map(p => p.id === patriciaId ? { ...p, active: nextActive } : p));
    showSuccess(`Patricia "${patricia?.name}" ${nextActive ? 'activada' : 'desactivada'} correctamente.`);
  };
  const handleEditPatricia = (_patriciaId: string) => {
    showError('La edición de patricias estará disponible próximamente.');
  };
  const handleToggleMetric = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric) ? prev.filter(m => m !== metric) : [...prev, metric]
    );
  };
  const handleGenerateReport = () => {
    const totalRecords = Math.floor(Math.random() * 15000) + 1000;
    if (totalRecords > 10000) {
      showSuccess('El reporte se está generando. Recibirás una notificación cuando esté listo.');
    } else {
      const csvData = `data:text/csv;charset=utf-8,Tipo,Fecha,Detalles\n${selectedMetrics.map(m => `${m},${new Date().toISOString()},Datos de ${m}`).join('\n')}`;
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvData));
      link.setAttribute('download', `reporte_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess('Reporte generado y descargado correctamente.');
    }
  };
  const handleScheduleReport = () => {
    if (!scheduleEmail.trim()) {
      setScheduleEmailError('Por favor ingresa un correo de entrega.');
      return;
    }
    setScheduleEmailError('');
    const labels: Record<string, string> = { daily: 'diario', weekly: 'semanal', monthly: 'mensual' };
    showSuccess(`Reporte ${labels[scheduleFrequency]} programado correctamente para: ${scheduleEmail}`);
    setScheduleEmail('');
  };
  const metrics: Metric[] = [
    {
      label: 'Usuarios Activos',
      value: '2,847',
      change: '+12.5% vs mes anterior',
      icon: Users,
      color: '#3B82F6',
      bg: 'rgba(59,130,246,0.1)',
    },
    {
      label: 'Parches Creados',
      value: '486',
      change: '+8.3% esta semana',
      icon: Heart,
      color: PINK,
      bg: 'rgba(232,36,90,0.1)',
    },
    {
      label: 'Eventos Vigentes',
      value: '24',
      change: '6 próximos en 48h',
      icon: Calendar,
      color: '#10B981',
      bg: 'rgba(16,185,129,0.1)',
    },
    {
      label: 'Tasa de Matching',
      value: '78%',
      change: '+5% vs promedio',
      icon: TrendingUp,
      color: ORANGE,
      bg: 'rgba(249,115,22,0.1)',
    },
  ];
  const activityData = [
    { day: 'Lun', value: 65 },
    { day: 'Mar', value: 78 },
    { day: 'Mié', value: 85 },
    { day: 'Jue', value: 72 },
    { day: 'Vie', value: 92 },
    { day: 'Sáb', value: 45 },
    { day: 'Dom', value: 38 },
  ];
  const campusZones = [
    { name: 'Biblioteca', activity: 92, color: '#EF4444' },
    { name: 'Cafetería', activity: 85, color: '#F59E0B' },
    { name: 'Bloque A', activity: 68, color: '#3B82F6' },
    { name: 'Bloque B', activity: 55, color: '#06B6D4' },
    { name: 'Bloque C', activity: 72, color: '#8B5CF6' },
    { name: 'Zona Deportiva', activity: 48, color: '#10B981' },
  ];
  const sidebarItems = [
    { id: 'analytics', label: 'Análisis', icon: BarChart3 },
    { id: 'reports', label: 'Reportes', icon: Download },
    { id: 'institutional-stats', label: 'Estadísticas Institucionales', icon: TrendingUp },
    { id: 'users', label: 'Gestión de Usuarios', icon: Users },
    { id: 'parches', label: 'Moderación de Parches', icon: Heart },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'patricias', label: 'Gestión de Patricias', icon: Zap },
    { id: 'config', label: 'Configuración Sistema', icon: Settings },
  ];
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
                Admin Panel
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
                3
              </span>
            </button>
            <div className="relative flex-shrink-0">
              <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ background: GRADIENT }}>
                A
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2" style={{ background: '#10B981', borderColor: isDark ? '#030D1F' : '#F7F5F0' }} />
            </div>
          </div>
        </div>
      </header>
      {}
      <aside
        className={`fixed left-0 top-0 h-screen w-[280px] max-w-[80vw] bg-white dark:bg-[#112240] border-r border-gray-200 dark:border-[#1E3A5F] z-[60] shadow-xl transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-[#1E3A5F]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: GRADIENT }}
              >
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-black text-gray-900 dark:text-white text-sm">patrici.a</h2>
                <p className="text-xs" style={{ color: PINK }}>Admin Panel</p>
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
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white">Administrador</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">admin@admin.com</p>
            </div>
          </div>
        </div>
        {}
        <nav className="p-3 flex-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all relative overflow-hidden ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1A2F4A]'
                }`}
              >
                {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full" style={{ background: GOLD_GRADIENT }} />}
                <Icon size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight size={16} className="flex-shrink-0" />}
              </button>
            );
          })}
        </nav>
        {}
        <div className="p-3 border-t border-gray-200 dark:border-[#1E3A5F]">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1A2F4A] transition-all mb-2"
          >
            {isDark ? <Sun size={18} className="flex-shrink-0" /> : <Moon size={18} className="flex-shrink-0" />}
            <span className="text-sm font-medium flex-1 text-left">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="text-sm font-medium flex-1 text-left">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      {}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[55]" onClick={() => setSidebarOpen(false)} />
      )}
      {}
      <div className="flex-1 pt-[57px]">
        {}
        <div className="p-4 sm:p-5 max-w-7xl mx-auto relative z-10">
          {}
          {activeSection === 'analytics' && (
            <>
              {}
              <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                      Tipo de Métrica
                    </label>
                    <select
                      value={metricType}
                      onChange={(e) => setMetricType(e.target.value as typeof metricType)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                      style={{ backgroundImage: 'none' }}
                    >
                      <option value="all">Todas</option>
                      <option value="users">Usuarios</option>
                      <option value="parches">Parches</option>
                      <option value="events">Eventos</option>
                      <option value="matches">Matches</option>
                      <option value="zones">Zonas</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Mostrando datos del semestre activo: {startDate} hasta {endDate}
                  {metricType !== 'all' && ` · Filtrado por: ${
                    metricType === 'users' ? 'Usuarios' :
                    metricType === 'parches' ? 'Parches' :
                    metricType === 'events' ? 'Eventos' :
                    metricType === 'matches' ? 'Matches' :
                    metricType === 'zones' ? 'Zonas' : ''
                  }`}
                </p>
              </div>
              {}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const isHighlighted = metricType === 'all' ||
                (metricType === 'users' && metric.label === 'Usuarios Activos') ||
                (metricType === 'parches' && metric.label === 'Parches Creados') ||
                (metricType === 'events' && metric.label === 'Eventos Vigentes') ||
                (metricType === 'matches' && metric.label === 'Tasa de Matching');
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isHighlighted ? 1 : 0.4,
                    y: 0,
                    scale: isHighlighted ? 1 : 0.97
                  }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1"
                  style={{
                    filter: isHighlighted ? 'none' : 'grayscale(0.3)',
                    pointerEvents: isHighlighted ? 'auto' : 'none'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                      style={{ background: metric.bg }}
                    >
                      <Icon size={20} className="sm:w-6 sm:h-6" style={{ color: metric.color }} />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-1">
                    {metric.value}
                  </p>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {metric.label}
                  </p>
                  <p className="text-xs" style={{ color: metric.color }}>
                    {metric.change}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {}
            <motion.div
              animate={{
                opacity: metricType === 'zones' ? 0.4 : 1,
                scale: metricType === 'zones' ? 0.97 : 1
              }}
              className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1"
              style={{
                filter: metricType === 'zones' ? 'grayscale(0.3)' : 'none',
                pointerEvents: metricType === 'zones' ? 'none' : 'auto'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {metricType === 'users' ? 'Actividad de Usuarios' :
                     metricType === 'parches' ? 'Actividad de Parches' :
                     metricType === 'events' ? 'Actividad de Eventos' :
                     metricType === 'matches' ? 'Actividad de Matching' :
                     'Actividad General'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Últimos 7 días
                  </p>
                </div>
                <Activity size={20} className="text-gray-400" />
              </div>
              {}
              <div className="space-y-3">
                {activityData.map((day, index) => (
                  <div key={day.day}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {day.day}
                      </span>
                      <span className="text-xs font-bold" style={{ color: PINK }}>
                        {day.value}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-[#1A2F4A] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${day.value}%` }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: GRADIENT }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            {}
            <motion.div
              animate={{
                opacity: metricType === 'all' || metricType === 'zones' ? 1 : 0.4,
                scale: metricType === 'all' || metricType === 'zones' ? 1 : 0.97
              }}
              className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1"
              style={{
                filter: metricType === 'all' || metricType === 'zones' ? 'none' : 'grayscale(0.3)',
                pointerEvents: metricType === 'all' || metricType === 'zones' ? 'auto' : 'none'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Mapa de Calor del Campus
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Zonas con mayor actividad
                  </p>
                </div>
                <MapPin size={20} className="text-gray-400" />
              </div>
              <div className="space-y-3">
                {campusZones.map((zone, index) => (
                  <motion.div
                    key={zone.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {zone.name}
                        </span>
                        <span className="text-xs font-bold" style={{ color: zone.color }}>
                          {zone.activity}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-[#1A2F4A] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${zone.activity}%` }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                          className="h-full rounded-full"
                          style={{ background: zone.color }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          {}
          <div className="mt-4 sm:mt-6 bg-white dark:bg-[#112240] rounded-2xl p-4 sm:p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              {[
                { icon: Users, text: 'Nuevo usuario registrado: María González', time: 'Hace 5 min', color: '#3B82F6' },
                { icon: Heart, text: 'Parche "Gaming Night" creado por Carlos M.', time: 'Hace 15 min', color: PINK },
                { icon: Calendar, text: 'Evento "Hackathon ECI" alcanzó 100 registros', time: 'Hace 1 hora', color: '#10B981' },
                { icon: MessageCircle, text: '24 nuevos mensajes en parches activos', time: 'Hace 2 horas', color: ORANGE },
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1A2F4A] transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${activity.color}15` }}
                    >
                      <Icon size={18} style={{ color: activity.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {activity.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
            </>
          )}
          {}
          {activeSection === 'reports' && (
            <div className="space-y-6">
              {}
              <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Generar Reporte Personalizado
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 block">
                      Selecciona las métricas a exportar
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {['USUARIOS', 'PARCHES', 'EVENTOS', 'MATCHES', 'ZONAS'].map((metric) => (
                        <button
                          key={metric}
                          onClick={() => handleToggleMetric(metric)}
                          className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                            selectedMetrics.includes(metric)
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-[#1A2F4A] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#233554]'
                          }`}
                        >
                          {metric}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                        Fecha Inicio
                      </label>
                      <input
                        type="date"
                        value={reportStartDate}
                        onChange={(e) => setReportStartDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                        Fecha Fin
                      </label>
                      <input
                        type="date"
                        value={reportEndDate}
                        onChange={(e) => setReportEndDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPreview(!showPreview)}
                      disabled={selectedMetrics.length === 0}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-[#1A2F4A] text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-[#233554] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Eye size={18} />
                      {showPreview ? 'Ocultar Vista Previa' : 'Vista Previa (10 filas)'}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGenerateReport}
                      disabled={selectedMetrics.length === 0}
                      className="flex-1 px-4 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      style={{ background: GRADIENT }}
                    >
                      <Download size={18} />
                      Generar Reporte CSV
                    </motion.button>
                  </div>
                </div>
              </div>
              {}
              <AnimatePresence>
                {showPreview && selectedMetrics.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm overflow-x-auto"
                  >
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                      Vista Previa (Primeras 10 filas)
                    </h4>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-[#1E3A5F]">
                          <th className="text-left p-2 text-gray-600 dark:text-gray-400 font-semibold">ID</th>
                          <th className="text-left p-2 text-gray-600 dark:text-gray-400 font-semibold">Tipo</th>
                          <th className="text-left p-2 text-gray-600 dark:text-gray-400 font-semibold">Fecha</th>
                          <th className="text-left p-2 text-gray-600 dark:text-gray-400 font-semibold">Detalles</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i} className="border-b border-gray-100 dark:border-[#1A2F4A]">
                            <td className="p-2 text-gray-900 dark:text-white">#{i + 1}</td>
                            <td className="p-2 text-gray-700 dark:text-gray-300">
                              {selectedMetrics[i % selectedMetrics.length]}
                            </td>
                            <td className="p-2 text-gray-600 dark:text-gray-400">2025-05-{10 + i}</td>
                            <td className="p-2 text-gray-600 dark:text-gray-400">Datos de ejemplo {i + 1}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
              {}
              <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Programar Reporte Automático
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                        Frecuencia
                      </label>
                      <select
                        value={scheduleFrequency}
                        onChange={(e) => setScheduleFrequency(e.target.value as typeof scheduleFrequency)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                        Correo de entrega
                      </label>
                      <input
                        type="email"
                        value={scheduleEmail}
                        onChange={(e) => { setScheduleEmail(e.target.value); if (scheduleEmailError) setScheduleEmailError(''); }}
                        placeholder="admin@escuelaing.edu.co"
                        className={`w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border text-gray-900 dark:text-white focus:outline-none transition-colors ${scheduleEmailError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-[#233554] focus:border-blue-500'}`}
                      />
                      {scheduleEmailError && (
                        <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                          <AlertTriangle size={11} />
                          {scheduleEmailError}
                        </p>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleScheduleReport}
                    className="px-4 py-3 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-all"
                  >
                    <Calendar size={18} />
                    Programar Reporte {scheduleFrequency === 'daily' ? 'Diario' : scheduleFrequency === 'weekly' ? 'Semanal' : 'Mensual'}
                  </motion.button>
                </div>
              </div>
              {}
              <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Historial de Reportes
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Reportes disponibles por 30 días
                </p>
                <div className="space-y-3">
                  {[
                    { id: 'r1', date: '2025-05-12', metrics: ['USUARIOS', 'PARCHES'], size: '2.4 MB' },
                    { id: 'r2', date: '2025-05-10', metrics: ['EVENTOS', 'MATCHES'], size: '1.8 MB' },
                    { id: 'r3', date: '2025-05-08', metrics: ['ZONAS'], size: '890 KB' },
                  ].map((report) => (
                    <div
                      key={report.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 dark:border-[#1E3A5F]"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          Reporte del {report.date}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {report.metrics.map((m) => (
                            <span
                              key={m}
                              className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{report.size}</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-semibold text-sm flex items-center gap-2"
                      >
                        <Download size={16} />
                        Descargar
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {}
          {activeSection === 'institutional-stats' && (
            <div className="space-y-6">
              {}
              <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Filtros de Estadísticas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={statsStartDate}
                      onChange={(e) => setStatsStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={statsEndDate}
                      onChange={(e) => setStatsEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                      Tipo de Estadística
                    </label>
                    <select
                      value={statsType}
                      onChange={(e) => setStatsType(e.target.value as typeof statsType)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">Todas</option>
                      <option value="events">Eventos</option>
                      <option value="participation">Participación</option>
                      <option value="social">Actividad Social</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Período seleccionado: Semestre activo completo ({statsStartDate} - {statsEndDate})
                </p>
              </div>
              {}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {}
                {(statsType === 'all' || statsType === 'events') && (
                  <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 dark:text-white">Eventos Creados</h4>
                      <Calendar size={20} style={{ color: '#10B981' }} />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mb-4">147</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Activos</span>
                        <span className="font-bold text-green-600 dark:text-green-400">89 (60.5%)</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Finalizados</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">52 (35.4%)</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Cancelados</span>
                        <span className="font-bold text-red-600 dark:text-red-400">6 (4.1%)</span>
                      </div>
                    </div>
                  </div>
                )}
                {}
                {(statsType === 'all' || statsType === 'participation') && (
                  <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 dark:text-white">Participación Estudiantil</h4>
                      <Users size={20} style={{ color: '#3B82F6' }} />
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mb-2">2,847</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Estudiantes activos en el período
                    </p>
                    <div className="h-2 bg-gray-100 dark:bg-[#1A2F4A] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '71.2%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: '#3B82F6' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      71.2% del total de estudiantes matriculados
                    </p>
                  </div>
                )}
                {}
                {(statsType === 'all' || statsType === 'social') && (
                  <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 dark:text-white">Índice de Actividad Social</h4>
                      <TrendingUp size={20} style={{ color: PINK }} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1">
                        <p className="text-3xl font-black text-gray-900 dark:text-white">78.5</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">de 100</p>
                      </div>
                      <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#10B981 0deg, #10B981 282deg, #E5E7EB 282deg)' }}>
                        <div className="w-16 h-16 rounded-full bg-white dark:bg-[#112240] flex items-center justify-center">
                          <span className="text-lg font-black text-green-600 dark:text-green-400">Alto</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Conexiones (35%)</span>
                        <span className="font-bold text-gray-900 dark:text-white">82/100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Parches (40%)</span>
                        <span className="font-bold text-gray-900 dark:text-white">76/100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Eventos (25%)</span>
                        <span className="font-bold text-gray-900 dark:text-white">78/100</span>
                      </div>
                    </div>
                  </div>
                )}
                {}
                {statsType === 'all' && (
                  <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 dark:text-white">Tendencia Semanal</h4>
                      <Activity size={20} style={{ color: ORANGE }} />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-2xl font-black text-green-600 dark:text-green-400">SUBIENDO</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          +12.5% vs semana anterior
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Esta semana</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">3,204</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">interacciones</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {}
              {(statsType === 'all' || statsType === 'social') && (
                <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Participación por Facultad</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Identificación de facultades con baja integración social
                      </p>
                    </div>
                    <BarChart3 size={20} className="text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    {[
                      { faculty: 'Ingeniería de Sistemas', value: 92, color: '#10B981' },
                      { faculty: 'Ingeniería Industrial', value: 85, color: '#3B82F6' },
                      { faculty: 'Ingeniería Civil', value: 78, color: '#8B5CF6' },
                      { faculty: 'Ingeniería Mecánica', value: 65, color: '#F59E0B' },
                      { faculty: 'Ingeniería Eléctrica', value: 52, color: '#EF4444' },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {item.faculty}
                          </span>
                          <span className="text-sm font-bold" style={{ color: item.color }}>
                            {item.value}%
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-[#1A2F4A] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ background: item.color }}
                          />
                        </div>
                        {item.value < 70 && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Baja integración - requiere atención
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {}
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                <p className="text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
                  <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Datos anonimizados</strong> · No se expone información personal de estudiantes.
                    Todos los datos se presentan de forma agregada para proteger la privacidad.
                  </span>
                </p>
              </div>
            </div>
          )}
          {}
          {activeSection === 'users' && (
            <div className="space-y-4">
              {}
              <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 shadow-sm">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar usuarios por nombre o email..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              {}
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#112240] rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-bold text-gray-900 dark:text-white">{user.name}</h4>
                          {user.verified && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
                          {user.status === 'suspended' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                              Suspendido
                            </span>
                          )}
                          {user.status === 'banned' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                              Baneado
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                        <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                          <span>{user.faculty}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Nivel {user.level}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{user.xp} XP</span>
                          {user.reports > 0 && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-red-500 font-bold">{user.reports} reportes</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedUser(user)}
                          className="w-9 h-9 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-[#1A2F4A] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#233554]"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVerifyUser(user.id)}
                          className="w-9 h-9 flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                          title={user.verified ? 'Desverificar' : 'Verificar'}
                        >
                          <UserCheck size={16} />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSuspendUser(user.id)}
                          className="w-9 h-9 flex-shrink-0 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                          title={user.status === 'suspended' ? 'Reactivar' : 'Suspender'}
                        >
                          {user.status === 'suspended' ? <Unlock size={16} /> : <Lock size={16} />}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleBanUser(user.id)}
                          className="w-9 h-9 flex-shrink-0 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                          title="Banear usuario"
                        >
                          <Ban size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          {}
          {activeSection === 'parches' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Parches Activos y Reportados</h3>
                <div className="space-y-3">
                  {parches.filter(p => p.status !== 'deleted').map((parche) => (
                    <div key={parche.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 dark:border-[#1E3A5F]">
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 dark:text-white">{parche.name}</h4>
                          {parche.status === 'flagged' && (
                            <Flag size={14} className="text-red-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {parche.creator} • {parche.members} miembros
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {parche.location}
                        </p>
                        {parche.reports > 0 && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-bold">
                            {parche.reports} reportes recibidos
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedParche(parche)}
                          className="w-9 h-9 flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteParche(parche.id)}
                          className="w-9 h-9 flex-shrink-0 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400"
                          title="Eliminar parche"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {}
          {activeSection === 'events' && (
            <div className="space-y-6">
              {/* Formulario de Creación de Eventos */}
              <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: GRADIENT }} />
                <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-xl flex items-center gap-3">
                  <Calendar size={26} className="text-blue-500" />
                  Crear Nuevo Evento
                </h3>
                
                <form onSubmit={handleCreateEvent} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 block uppercase tracking-wider">Nombre del Evento *</label>
                      <input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} type="text" className="w-full px-4 py-3.5 rounded-xl bg-gray-50/80 dark:bg-[#1A2F4A]/80 border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Ej. Torneo de Ping Pong" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 block uppercase tracking-wider">Ubicación *</label>
                      <input value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} type="text" className="w-full px-4 py-3.5 rounded-xl bg-gray-50/80 dark:bg-[#1A2F4A]/80 border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Ej. Plazoleta Principal" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 block uppercase tracking-wider">Fecha *</label>
                      <input value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} type="date" className="w-full px-4 py-3.5 rounded-xl bg-gray-50/80 dark:bg-[#1A2F4A]/80 border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 block uppercase tracking-wider">Hora *</label>
                      <input value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} type="time" className="w-full px-4 py-3.5 rounded-xl bg-gray-50/80 dark:bg-[#1A2F4A]/80 border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 block uppercase tracking-wider">Descripción del Evento</label>
                    <textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} rows={3} className="w-full px-4 py-3.5 rounded-xl bg-gray-50/80 dark:bg-[#1A2F4A]/80 border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none font-medium" placeholder="Escribe los detalles del evento..." />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 block uppercase tracking-wider">Foto del Evento (Opcional)</label>
                    <div className="w-full px-4 py-8 rounded-2xl border-2 border-dashed border-gray-300 dark:border-[#384c6e] bg-gray-50/50 dark:bg-[#1A2F4A]/30 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1A2F4A]/80 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Download size={24} className="text-blue-500" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Arrastra una imagen o haz clic para subir</span>
                      <span className="text-xs mt-1 opacity-70">JPG, PNG o WEBP (Max 5MB)</span>
                    </div>
                  </div>

                  {/* Toggle Patricia */}
                  <div className="pt-6 border-t border-gray-200/50 dark:border-[#1E3A5F]/50">
                    <label className="flex items-center gap-4 cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/10 border border-purple-100/50 dark:border-purple-800/30">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={includePatricia} onChange={e => setIncludePatricia(e.target.checked)} />
                        <div className={`block w-14 h-8 rounded-full transition-colors ${includePatricia ? 'bg-purple-500 shadow-inner' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform shadow-md ${includePatricia ? 'transform translate-x-6' : ''}`}></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                          <Zap size={18} className="text-purple-500" /> Asociar Patricia (Mona) Exclusiva
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Los asistentes podrán reclamar esta Mona escaneando un código QR.</span>
                      </div>
                    </label>
                  </div>

                  {/* Patricia Fields */}
                  <AnimatePresence>
                    {includePatricia && (
                      <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} className="overflow-hidden">
                        <div className="bg-purple-50/60 dark:bg-purple-900/10 p-6 rounded-3xl border border-purple-200/50 dark:border-purple-800/50 space-y-5 mt-2 shadow-inner">
                          <h4 className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2 mb-2">
                            ✨ Detalles de la Patricia
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                              <label className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-2 block uppercase tracking-wider">Rareza</label>
                              <div className="relative">
                                <select value={newPatricia.rarity} onChange={e => setNewPatricia({...newPatricia, rarity: e.target.value})} className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-[#112240]/80 border border-purple-200 dark:border-purple-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none font-bold">
                                  <option value="comun">⚪ Común</option>
                                  <option value="rara">🔵 Rara</option>
                                  <option value="epica">🟣 Épica</option>
                                  <option value="legendaria">🟡 Legendaria</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-2 block uppercase tracking-wider flex justify-between">
                                Puntos XP <span className="text-purple-600 bg-purple-100 dark:bg-purple-900/50 px-2 rounded">{newPatricia.xpValue} XP</span>
                              </label>
                              <input type="range" min="10" max="500" step="10" value={newPatricia.xpValue} onChange={e => setNewPatricia({...newPatricia, xpValue: parseInt(e.target.value)})} className="w-full mt-3 accent-purple-500" />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-2 block uppercase tracking-wider">Descripción de la Patricia</label>
                            <input value={newPatricia.description} onChange={e => setNewPatricia({...newPatricia, description: e.target.value})} type="text" className="w-full px-4 py-3.5 rounded-xl bg-white/80 dark:bg-[#112240]/80 border border-purple-200 dark:border-purple-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium" placeholder="Ej. Medalla otorgada por asistir al taller de liderazgo..." />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-2 block uppercase tracking-wider">Arte de la Patricia</label>
                            <div className="w-full px-4 py-6 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-700/50 bg-white/50 dark:bg-[#112240]/50 flex flex-col items-center justify-center text-purple-500 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
                              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Zap size={20} className="text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="text-sm font-bold text-purple-700 dark:text-purple-400">Subir imagen exclusiva de la Patricia</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-6 flex justify-end border-t border-gray-200/50 dark:border-[#1E3A5F]/50">
                    <motion.button whileTap={{ scale: 0.95 }} type="submit" className="w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all" style={{ background: GRADIENT }}>
                      <CheckCircle size={22} /> Publicar Evento Oficial
                    </motion.button>
                  </div>
                </form>
              </div>

              {/* Lista de Eventos */}
              <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 dark:text-white text-xl flex items-center gap-3">
                    <Activity size={24} className="text-green-500" />
                    Eventos Publicados
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400">
                    {events.length} Activos
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {events.map((event, index) => (
                      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: index * 0.05 }} key={event.id} className="flex flex-col p-5 rounded-3xl border border-gray-200/80 dark:border-[#1E3A5F] bg-gray-50/50 dark:bg-[#1A2F4A]/30 hover:bg-white dark:hover:bg-[#112240] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
                        
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border border-white dark:border-white/5">
                            <Calendar size={22} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            Activo
                          </span>
                        </div>
                        
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{event.title}</h4>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                          {event.category} • {event.organizer}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200/60 dark:border-[#1E3A5F]/60">
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-500" /> {event.date}
                          </span>
                          
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDeleteParche(event.id) /* Usando logica similar para demo */} className="w-9 h-9 rounded-xl bg-red-50/0 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 text-gray-300 dark:text-gray-600 group-hover:text-red-500 flex items-center justify-center transition-all duration-300">
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {events.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50/50 dark:bg-[#1A2F4A]/30 rounded-3xl border border-dashed border-gray-300 dark:border-[#384c6e]">
                      <Calendar size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No hay eventos activos.</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Usa el formulario de arriba para publicar uno nuevo.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {}
          {activeSection === 'patricias' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Gestión de Patricias</h3>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2"
                    style={{ background: GRADIENT }}
                  >
                    <Zap size={16} />
                    Nueva Patricia
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {patricias.map((patricia) => {
                    const rarityColors = {
                      comun: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600' },
                      rara: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-400 dark:border-blue-600' },
                      epica: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-400 dark:border-purple-600' },
                      legendaria: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-400 dark:border-amber-600' },
                    };
                    const colors = rarityColors[patricia.rarity];
                    return (
                      <div
                        key={patricia.id}
                        className={`p-3 sm:p-4 rounded-xl border-2 ${colors.border} ${colors.bg} transition-all`}
                      >
                        <div className="flex flex-col sm:flex-row items-start gap-3">
                          <div className="flex-1 min-w-0 w-full sm:w-auto">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{patricia.name}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${colors.bg} ${colors.text}`}>
                                {patricia.rarity}
                              </span>
                              {!patricia.active && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                  Inactiva
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {patricia.description}
                            </p>
                            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Zap size={12} className="text-yellow-500 flex-shrink-0" />
                                {patricia.xpValue} XP
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={12} className="flex-shrink-0" />
                                {patricia.obtainedCount}
                              </span>
                              <span className="flex items-center gap-1 flex-1 min-w-0">
                                <Lock size={12} className="flex-shrink-0" />
                                <span className="truncate">{patricia.unlockCondition}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleTogglePatricia(patricia.id)}
                              className={`flex-1 sm:flex-none w-auto sm:w-9 h-9 rounded-lg flex items-center justify-center gap-2 sm:gap-0 px-3 sm:px-0 ${
                                patricia.active
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                              }`}
                              title={patricia.active ? 'Desactivar' : 'Activar'}
                            >
                              {patricia.active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                              <span className="text-xs font-semibold sm:hidden">
                                {patricia.active ? 'Activa' : 'Inactiva'}
                              </span>
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditPatricia(patricia.id)}
                              className="flex-1 sm:flex-none w-auto sm:w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center gap-2 sm:gap-0 px-3 sm:px-0 text-blue-600 dark:text-blue-400"
                              title="Editar"
                            >
                              <Edit3 size={16} />
                              <span className="text-xs font-semibold sm:hidden">Editar</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-[#1E3A5F]">
                  <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-[#1A2F4A]">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {patricias.length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-[#1A2F4A]">
                    <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                      {patricias.filter(p => p.active).length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Activas</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-[#1A2F4A]">
                    <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {patricias.filter(p => p.rarity === 'legendaria').length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Legendarias</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-[#1A2F4A]">
                    <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {patricias.reduce((sum, p) => sum + p.obtainedCount, 0)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Obtenidas</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {}
          {activeSection === 'config' && (
            <div className="space-y-4">
              <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-gray-200/50 dark:border-[#1E3A5F]/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Configuración del Sistema</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <Sliders size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Algoritmo de Matching</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                          Ajusta los parámetros de compatibilidad entre usuarios
                        </p>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1 block">
                              Peso de Intereses Comunes: 50%
                            </label>
                            <input type="range" min="0" max="100" defaultValue="50" className="w-full" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1 block">
                              Peso de Proximidad Campus: 30%
                            </label>
                            <input type="range" min="0" max="100" defaultValue="30" className="w-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start gap-3">
                      <Zap size={20} className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">Sistema de Gamificación</h4>
                        <p className="text-sm text-purple-700 dark:text-purple-400 mb-2">
                          Gestión de Patricias coleccionables y recompensas
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveSection('patricias')}
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
                          >
                            Gestionar Patricias
                          </button>
                          <button className="px-4 py-2 rounded-lg border border-purple-600 text-purple-600 dark:text-purple-400 text-sm font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
                            Ver Retos
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-green-900 dark:text-green-300 mb-2">Seguridad y Privacidad</h4>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Configuración de políticas de moderación y privacidad
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {}
      <AnimatePresence>
        {selectedParche && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedParche(null)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#112240] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {}
                <div className="sticky top-0 bg-white dark:bg-[#112240] border-b border-gray-200 dark:border-[#1E3A5F] p-4 sm:p-6 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{selectedParche.name}</h2>
                      {selectedParche.status === 'flagged' && (
                        <Flag size={18} className="text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Detalles de moderación del parche
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedParche(null)}
                    className="w-10 h-10 flex-shrink-0 rounded-xl bg-gray-100 dark:bg-[#1A2F4A] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#233554] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                {}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-1">Creador</p>
                      <p className="font-bold text-gray-900 dark:text-white">{selectedParche.creator}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800">
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase mb-1">Miembros</p>
                      <p className="font-bold text-gray-900 dark:text-white">{selectedParche.members}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase mb-1">Ubicación</p>
                      <p className="font-bold text-gray-900 dark:text-white">{selectedParche.location}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${
                      selectedParche.reports > 0
                        ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
                        : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}>
                      <p className={`text-xs font-semibold uppercase mb-1 ${
                        selectedParche.reports > 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>Reportes</p>
                      <p className="font-bold text-gray-900 dark:text-white">{selectedParche.reports}</p>
                    </div>
                  </div>
                  {}
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-[#1E3A5F]">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Estado</p>
                    <div className="flex items-center gap-2">
                      {selectedParche.status === 'active' && (
                        <span className="px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-sm">
                          ✓ Activo
                        </span>
                      )}
                      {selectedParche.status === 'flagged' && (
                        <span className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold text-sm">
                          ⚠ Reportado
                        </span>
                      )}
                      {selectedParche.status === 'deleted' && (
                        <span className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm">
                          ✗ Eliminado
                        </span>
                      )}
                    </div>
                  </div>
                  {}
                  {selectedParche.reports > 0 && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                      <h4 className="font-bold text-red-900 dark:text-red-300 mb-3 flex items-center gap-2">
                        <AlertTriangle size={18} />
                        Razones de reporte
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-[#112240]">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Contenido inapropiado</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold">
                            {Math.floor(selectedParche.reports * 0.6)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-[#112240]">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Spam o publicidad</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold">
                            {Math.floor(selectedParche.reports * 0.4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {}
                  <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-4 border-t border-gray-200 dark:border-[#1E3A5F]">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleDeleteParche(selectedParche.id);
                        setSelectedParche(null);
                      }}
                      className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors text-sm sm:text-base"
                    >
                      <Trash2 size={18} />
                      Eliminar Parche
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedParche(null)}
                      className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#1A2F4A] text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-[#233554] transition-colors text-sm sm:text-base"
                    >
                      Cerrar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#112240] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {}
                <div className="sticky top-0 bg-white dark:bg-[#112240] border-b border-gray-200 dark:border-[#1E3A5F] p-4 sm:p-6 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{selectedUser.name}</h2>
                        {selectedUser.verified && <CheckCircle size={20} className="text-green-500 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {selectedUser.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {selectedUser.status === 'active' && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            Activo
                          </span>
                        )}
                        {selectedUser.status === 'suspended' && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                            Suspendido
                          </span>
                        )}
                        {selectedUser.status === 'banned' && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                            Baneado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="w-10 h-10 flex-shrink-0 rounded-xl bg-gray-100 dark:bg-[#1A2F4A] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#233554] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                {}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={16} className="text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Nivel</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUser.level}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={16} className="text-purple-600 dark:text-purple-400" />
                        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">XP</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUser.xp}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 col-span-2 sm:col-span-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Users size={16} className="text-green-600 dark:text-green-400" />
                        <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Facultad</p>
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white">{selectedUser.faculty}</p>
                    </div>
                  </div>
                  {}
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-[#1E3A5F]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck size={20} className={selectedUser.verified ? 'text-green-500' : 'text-gray-400'} />
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">Estado de Verificación</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {selectedUser.verified ? 'Usuario verificado' : 'Usuario no verificado'}
                          </p>
                        </div>
                      </div>
                      {selectedUser.verified ? (
                        <CheckCircle size={24} className="text-green-500" />
                      ) : (
                        <XCircle size={24} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  {}
                  {selectedUser.reports > 0 && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 overflow-hidden">
                      <div className="px-4 py-3 border-b border-red-200 dark:border-red-800 flex items-center justify-between">
                        <h4 className="font-bold text-red-900 dark:text-red-300 flex items-center gap-2 text-sm">
                          <AlertTriangle size={16} />
                          Reportes recibidos
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-black">
                          {selectedUser.reports}
                        </span>
                      </div>
                      <div className="divide-y divide-red-100 dark:divide-red-900/30">
                        {(selectedUser.reportDetails ?? []).map((report) => {
                          const categoryLabels: Record<string, string> = {
                            comportamiento: 'Comportamiento inapropiado',
                            spam: 'Spam',
                            acoso: 'Acoso',
                            contenido: 'Contenido inapropiado',
                            otro: 'Otro',
                          };
                          const categoryColors: Record<string, string> = {
                            comportamiento: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
                            spam: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
                            acoso: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
                            contenido: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
                            otro: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
                          };
                          return (
                            <div key={report.id} className="p-4 bg-white dark:bg-[#0D1E35]">
                              <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${categoryColors[report.category]}`}>
                                  {categoryLabels[report.category]}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{report.date}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                                "{report.message}"
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                Reportado por: {report.reporter}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {}
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554]">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Activity size={18} />
                      Resumen de Actividad
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Heart size={14} className="text-pink-500" />
                          Parches activos
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {Math.floor(Math.random() * 5) + 1}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Calendar size={14} className="text-blue-500" />
                          Eventos asistidos
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {Math.floor(Math.random() * 10) + 5}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <MessageCircle size={14} className="text-orange-500" />
                          Mensajes enviados
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {Math.floor(Math.random() * 100) + 50}
                        </span>
                      </div>
                    </div>
                  </div>
                  {}
                  <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-4 border-t border-gray-200 dark:border-[#1E3A5F]">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleVerifyUser(selectedUser.id);
                        setSelectedUser({ ...selectedUser, verified: !selectedUser.verified });
                      }}
                      className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      <UserCheck size={18} />
                      {selectedUser.verified ? 'Desverificar' : 'Verificar'}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleSuspendUser(selectedUser.id);
                        setSelectedUser(null);
                      }}
                      className="flex-1 py-3 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors text-sm sm:text-base"
                    >
                      {selectedUser.status === 'suspended' ? <Unlock size={18} /> : <Lock size={18} />}
                      {selectedUser.status === 'suspended' ? 'Reactivar' : 'Suspender'}
                    </motion.button>
                    {selectedUser.status !== 'banned' && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          handleBanUser(selectedUser.id);
                          setSelectedUser(null);
                        }}
                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors text-sm sm:text-base"
                      >
                        <Ban size={18} />
                        Banear Usuario
                      </motion.button>
                    )}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedUser(null)}
                    className="w-full py-3 rounded-xl bg-gray-100 dark:bg-[#1A2F4A] text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-[#233554] transition-colors text-sm sm:text-base"
                  >
                    Cerrar
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-5"
            onClick={() => setShowErrorModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#112240] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <XCircle size={20} className="text-red-500" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Atención</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">{errorMessage}</p>
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-5"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#112240] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={20} className="text-green-500" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">¡Listo!</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors"
                style={{ background: GRADIENT }}
              >
                Aceptar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-5"
            onClick={() => setConfirmModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#112240] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={20} className="text-orange-500" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{confirmModal.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">{confirmModal.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#1A2F4A] text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-[#233554] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
                  className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}