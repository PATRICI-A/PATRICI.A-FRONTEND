import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Calendar, Heart, TrendingUp, Download, ShieldCheck,
  BarChart3, MapPin, MessageCircle, AlertTriangle, LogOut,
  Menu, X, ChevronRight, Activity, Zap, Eye, Ban, CheckCircle,
  XCircle, Edit3, Trash2, Flag, Settings, Sun, Moon, UserCheck,
  Search, Filter, MoreVertical, Lock, Unlock, Sliders
} from 'lucide-react';
import { GRADIENT, PINK, ORANGE, TEAL, GOLD_LIGHT } from '../data/mockData';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { useApp } from '../context/AppContext';

interface Metric {
  label: string;
  value: string | number;
  change: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bg: string;
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

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin/login');
  };

  // Mock Data States
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', name: 'María González', email: 'maria.g@mail.escuelaing.edu.co', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', faculty: 'Sistemas', status: 'active', verified: true, xp: 3200, level: 12, reports: 0 },
    { id: 'u2', name: 'Carlos Mendoza', email: 'carlos.m@mail.escuelaing.edu.co', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', faculty: 'Civil', status: 'active', verified: true, xp: 2800, level: 10, reports: 0 },
    { id: 'u3', name: 'Ana Torres', email: 'ana.t@mail.escuelaing.edu.co', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', faculty: 'Industrial', status: 'flagged', verified: true, xp: 1500, level: 7, reports: 3 },
    { id: 'u4', name: 'Juan Pérez', email: 'juan.p@mail.escuelaing.edu.co', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', faculty: 'Mecánica', status: 'suspended', verified: false, xp: 900, level: 5, reports: 5 },
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
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u));
  };

  const handleBanUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'banned' } : u));
  };

  const handleVerifyUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: !u.verified } : u));
  };

  const handleDeleteParche = (parcheId: string) => {
    setParches(prev => prev.map(p => p.id === parcheId ? { ...p, status: 'deleted' } : p));
  };

  const handleApproveEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'approved' } : e));
  };

  const handleRejectEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'rejected' } : e));
  };

  const handleTogglePatricia = (patriciaId: string) => {
    setPatricias(prev => prev.map(p => p.id === patriciaId ? { ...p, active: !p.active } : p));
  };

  const handleEditPatricia = (patriciaId: string) => {
    // In a real app, this would open an edit modal
    console.log('Edit patricia:', patriciaId);
  };

  // Mock Metrics Data
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

  // Mock Activity Data (simulated chart)
  const activityData = [
    { day: 'Lun', value: 65 },
    { day: 'Mar', value: 78 },
    { day: 'Mié', value: 85 },
    { day: 'Jue', value: 72 },
    { day: 'Vie', value: 92 },
    { day: 'Sáb', value: 45 },
    { day: 'Dom', value: 38 },
  ];

  // Mock Campus Zones Heatmap
  const campusZones = [
    { name: 'Biblioteca', activity: 92, color: '#EF4444' },
    { name: 'Cafetería', activity: 85, color: '#F59E0B' },
    { name: 'Bloque A', activity: 68, color: '#3B82F6' },
    { name: 'Bloque B', activity: 55, color: '#06B6D4' },
    { name: 'Bloque C', activity: 72, color: '#8B5CF6' },
    { name: 'Zona Deportiva', activity: 48, color: '#10B981' },
  ];

  const sidebarItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A192F] flex relative overflow-hidden">
      <DoodleBackground isDark={isDark} opacity={0.3} />

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative left-0 top-0 h-screen w-[280px] max-w-[80vw] bg-white dark:bg-[#112240] border-r border-gray-200 dark:border-[#1E3A5F] z-50 shadow-xl transition-transform duration-300 lg:flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
              className="lg:hidden w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A2F4A] flex items-center justify-center text-gray-500 dark:text-gray-400"
            >
              <X size={18} />
            </button>
          </div>

          {/* Admin Info */}
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

        {/* Navigation */}
        <nav className="p-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1A2F4A]'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-gray-200 dark:border-[#1E3A5F] space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1A2F4A] transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm font-medium">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-lg border-b border-gray-200 dark:border-[#1E3A5F]">
          <div className="px-4 md:px-5 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-9 h-9 flex-shrink-0 rounded-xl bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300"
              >
                <Menu size={20} />
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  Dashboard Admin
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  Gestión y analytics de patrici.a
                </p>
              </div>
            </div>

            {/* Export Button */}
            {(activeSection === 'analytics' || activeSection === 'users') && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg flex-shrink-0"
                style={{ background: GRADIENT }}
              >
                <Download size={16} />
                <span className="hidden sm:inline">Exportar</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 max-w-7xl mx-auto relative z-10">
          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-[#112240] rounded-2xl p-4 sm:p-5 shadow-sm"
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
            {/* Activity Chart */}
            <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Actividad de Usuarios
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Últimos 7 días
                  </p>
                </div>
                <Activity size={20} className="text-gray-400" />
              </div>

              {/* Simple Bar Chart */}
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
            </div>

            {/* Campus Heatmap */}
            <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 sm:p-5 shadow-sm">
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
            </div>
          </div>

          {/* Recent Activity */}
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

          {/* Users Section */}
          {activeSection === 'users' && (
            <div className="space-y-4">
              {/* Search */}
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

              {/* Users List */}
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

          {/* Parches Section */}
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

          {/* Events Section */}
          {activeSection === 'events' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Gestión de Eventos</h3>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 dark:border-[#1E3A5F]">
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-bold text-gray-900 dark:text-white">{event.title}</h4>
                          {event.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                              Pendiente
                            </span>
                          )}
                          {event.status === 'approved' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                              Aprobado
                            </span>
                          )}
                          {event.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                              Rechazado
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.organizer} • {event.category}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {event.date} • {event.attendees} asistentes
                        </p>
                      </div>
                      {event.status === 'pending' && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleApproveEvent(event.id)}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-semibold text-sm"
                          >
                            Aprobar
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRejectEvent(event.id)}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold text-sm"
                          >
                            Rechazar
                          </motion.button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Patricias Section */}
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

                {/* Summary Stats */}
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

          {/* Config Section */}
          {activeSection === 'config' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm">
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

      {/* Parche Detail Modal */}
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
                {/* Modal Header */}
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

                {/* Modal Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Basic Info */}
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

                  {/* Status */}
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

                  {/* Report Details (if flagged) */}
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

                  {/* Actions */}
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

      {/* User Detail Modal */}
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
                {/* Modal Header */}
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

                {/* Modal Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Stats Grid */}
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

                  {/* Verification Status */}
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

                  {/* Reports Section */}
                  {selectedUser.reports > 0 && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                      <h4 className="font-bold text-red-900 dark:text-red-300 mb-3 flex items-center gap-2">
                        <AlertTriangle size={18} />
                        Reportes recibidos
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-[#112240]">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Comportamiento inapropiado</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold">
                            {Math.floor(selectedUser.reports * 0.6)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-[#112240]">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Spam</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold">
                            {Math.floor(selectedUser.reports * 0.4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity Summary */}
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

                  {/* Admin Actions */}
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

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}
    </div>
  );
}
