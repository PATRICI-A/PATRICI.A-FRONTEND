import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bell, Check, Trash2, MessageCircle, Users, Calendar, PartyPopper, AlertCircle, Zap, Shield } from 'lucide-react';
import { notifications as initialNotifications, type Notification } from '../types/mockData';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';

// Mascot Assets
import mascotChateando from '../assets/mascota_chateando.png';

// Categories Types
type CategoryType = 'all' | 'chat' | 'match' | 'event' | 'parches';

interface CategoryConfig {
  id: CategoryType;
  label: string;
  icon: any;
  color: string;
  activeBg: string;
  activeText: string;
}

const CATEGORIES: CategoryConfig[] = [
  { 
    id: 'all', 
    label: 'Todas', 
    icon: Bell, 
    color: '#3B82F6', 
    activeBg: 'rgba(59, 130, 246, 0.15)', 
    activeText: 'text-blue-600 dark:text-blue-400' 
  },
  { 
    id: 'chat', 
    label: 'Chats', 
    icon: MessageCircle, 
    color: '#3B82F6', 
    activeBg: 'rgba(59, 130, 246, 0.15)', 
    activeText: 'text-blue-600 dark:text-blue-400' 
  },
  { 
    id: 'match', 
    label: 'Matching', 
    icon: Users, 
    color: '#EC4899', 
    activeBg: 'rgba(236, 72, 153, 0.15)', 
    activeText: 'text-pink-600 dark:text-pink-400' 
  },
  { 
    id: 'event', 
    label: 'Eventos', 
    icon: Calendar, 
    color: '#F59E0B', 
    activeBg: 'rgba(245, 158, 11, 0.15)', 
    activeText: 'text-amber-600 dark:text-amber-400' 
  },
  { 
    id: 'parches', 
    label: 'Parches', 
    icon: PartyPopper, 
    color: '#8B5CF6', 
    activeBg: 'rgba(139, 92, 246, 0.15)', 
    activeText: 'text-purple-600 dark:text-purple-400' 
  },
];

const NOTIFICATION_ICONS = {
  chat: MessageCircle,
  match: Users,
  high_match: Zap,
  event: Calendar,
  parche_invitation: PartyPopper,
  event_reminder: AlertCircle,
} as const;

const SECTION_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  chat: { label: 'Chat', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  match: { label: 'Matching', color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
  high_match: { label: 'Alta compatibilidad', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  event: { label: 'Eventos', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  event_reminder: { label: 'Eventos', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  parche_invitation: { label: 'Parches', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
};

// Fun mascot speech bubble quotes
const SPEECH_BUBBLES = [
  "¡Hola! Estoy buscando nuevos parches y chismes en el campus...",
  "Chateando con el servidor... ¡Todo en orden por aquí!",
  "Parece que no tienes notificaciones en esta categoría.",
  "¡Pssst! Si pulsas la tecla 'X' de tu teclado te enviaré una sorpresa...",
  "¡Escríbele a alguien! Estaré aquí cuidando tu buzón de entrada.",
  "¡Me encantan las pantallas táctiles! Chatear con amigos del campus es lo mejor."
];

// Generator template lists
const DEMO_NOTIFICATIONS = [
  {
    type: 'chat' as const,
    title: 'Nuevo mensaje de Mariana 💬',
    message: 'Oye, ¿vamos a almorzar hoy en el bloque G? Confírmame por fa!',
    color: '#3B82F6',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    actionUrl: '/chat',
  },
  {
    type: 'match' as const,
    title: '¡Nuevo Match Encontrado! 🔥',
    message: '¡Tienes un 92% de compatibilidad con Santiago de Ingeniería de Sistemas!',
    color: '#EC4899',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    actionUrl: '/matches',
  },
  {
    type: 'high_match' as const,
    title: '¡Compatibilidad del 98%! ⚡',
    message: '¡Atención! Alguien de tu misma carrera acaba de unirse y es súper compatible contigo.',
    color: '#F59E0B',
    icon: '⚡',
    actionUrl: '/matches',
  },
  {
    type: 'parche_invitation' as const,
    title: 'Invitación a "Polas & Codificación" 🍻',
    message: 'Mateo te ha invitado a unirte a su parche para estudiar este viernes.',
    color: '#8B5CF6',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    actionUrl: '/parches',
  },
  {
    type: 'event' as const,
    title: 'Torneo de Ultimate Frisbee 🥏',
    message: 'El torneo inter-bloques inicia mañana a las 2:00 PM. ¡Inscríbete hoy!',
    color: '#F59E0B',
    icon: '🥏',
    actionUrl: '/eventos',
  }
];

export function NotificationsPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [bubbleText, setBubbleText] = useState(SPEECH_BUBBLES[0]);

  // Handle Dynamic Speech Bubble quotes on category switch
  useEffect(() => {
    let text = "";
    switch (activeCategory) {
      case 'all':
        text = "¡Aquí controlo todo! Si te llega algún parche o mensaje, te avisaré de inmediato.";
        break;
      case 'chat':
        text = "¡Esperando chismes! En cuanto te envíen un mensaje, aparecerá justo aquí.";
        break;
      case 'match':
        text = "Buscando tu media naranja... ¡O a tu próximo mejor amigo en el campus! ♥";
        break;
      case 'event':
        text = "¡No te quedes por fuera! Agenda los mejores planes, parches y talleres.";
        break;
      case 'parches':
        text = "¡Los parches más locos se cocinan aquí! Esperando invitaciones de tus amigos.";
        break;
    }
    setBubbleText(text);
  }, [activeCategory]);

  // Total unread notifications count (global badge)
  const totalUnreadCount = notifications.filter(n => !n.read).length;

  // Mark a single notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Delete a single notification
  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Mark all notifications in current category as read
  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => {
        const belongsToCat = 
          activeCategory === 'all' ||
          (activeCategory === 'chat' && n.type === 'chat') ||
          (activeCategory === 'match' && (n.type === 'match' || n.type === 'high_match')) ||
          (activeCategory === 'event' && (n.type === 'event' || n.type === 'event_reminder')) ||
          (activeCategory === 'parches' && n.type === 'parche_invitation');
        
        return belongsToCat ? { ...n, read: true } : n;
      })
    );
  };

  // Click on a notification triggers navigation/read action
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  // Simulate pushing a new mock notification
  const triggerDemoNotification = () => {
    const randomIndex = Math.floor(Math.random() * DEMO_NOTIFICATIONS.length);
    const template = DEMO_NOTIFICATIONS[randomIndex];
    const newNotif: Notification = {
      id: `demo_${Date.now()}`,
      type: template.type,
      title: template.title,
      message: template.message,
      color: template.color,
      avatar: template.avatar,
      icon: template.icon,
      timestamp: 'Hace un momento',
      read: false,
      actionUrl: template.actionUrl,
    };
    
    setNotifications(prev => [newNotif, ...prev]);

    // Show temporary feedback in mascot speech bubble
    setBubbleText("¡Bip bip! Te acabo de mandar una notificación de prueba en tiempo real 🚀");
    setTimeout(() => {
      // Re-trigger category-based quote
      let text = "¡Alerta recibida! Mira cómo brilla y se posiciona al principio de tu lista.";
      setBubbleText(text);
    }, 4500);
  };

  // Listen to the keyboard key 'X' to generate mockup notifications
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'x' || e.key === 'X') {
        const activeEl = document.activeElement;
        if (
          activeEl && 
          (activeEl.tagName === 'INPUT' || 
           activeEl.tagName === 'TEXTAREA' || 
           activeEl.getAttribute('contenteditable') === 'true')
        ) {
          return;
        }
        triggerDemoNotification();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter notifications belonging to the selected category
  const filteredNotifications = notifications.filter(n => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'chat') return n.type === 'chat';
    if (activeCategory === 'match') return n.type === 'match' || n.type === 'high_match';
    if (activeCategory === 'event') return n.type === 'event' || n.type === 'event_reminder';
    if (activeCategory === 'parches') return n.type === 'parche_invitation';
    return true;
  });

  // Calculate unread count for badges on each category
  const getUnreadCountForCategory = (cat: CategoryType) => {
    return notifications.filter(n => {
      if (n.read) return false;
      if (cat === 'all') return true;
      if (cat === 'chat') return n.type === 'chat';
      if (cat === 'match') return n.type === 'match' || n.type === 'high_match';
      if (cat === 'event') return n.type === 'event' || n.type === 'event_reminder';
      if (cat === 'parches') return n.type === 'parche_invitation';
      return false;
    }).length;
  };

  // Check if current category has any unread notifications
  const currentCategoryUnreadCount = getUnreadCountForCategory(activeCategory);

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex items-center justify-center py-6 px-4">
      {/* Background wallpaper */}
      <DoodleBackground isDark={isDark} opacity={isDark ? 0.95 : 0.8} />

      {/* Centered Dashboard Wrapper at exactly 4/6 width on Desktop */}
      <div 
        className="relative z-10 w-full md:w-4/6 lg:w-4/6 xl:w-4/6 h-[calc(100vh-120px)] min-h-[580px] rounded-3xl overflow-hidden shadow-2xl border backdrop-blur-md flex flex-col transition-all"
        style={isDark ? {
          background: 'rgba(6, 13, 26, 0.75)',
          borderColor: 'rgba(30, 58, 95, 0.45)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        } : {
          background: 'rgba(255, 255, 255, 0.85)',
          borderColor: 'rgba(10, 25, 47, 0.08)',
          boxShadow: '0 20px 50px rgba(10, 25, 47, 0.1)',
        }}
      >
        {/* Header bar */}
        <div
          className="px-5 py-4 border-b flex flex-row items-center justify-between flex-shrink-0"
          style={isDark ? {
            background: 'rgba(13, 27, 46, 0.98)',
            borderColor: 'rgba(30, 58, 95, 0.45)',
          } : {
            background: 'rgba(253, 252, 248, 0.97)',
            borderColor: 'rgba(10, 25, 47, 0.08)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2F4A] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-gray-900 dark:text-white font-extrabold text-base m-0 leading-tight tracking-tight flex items-center gap-2">
                Notificaciones 
                {totalUnreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white animate-pulse">
                    {totalUnreadCount}
                  </span>
                )}
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 m-0 mt-0.5 leading-none">
                Buzón Inteligente de Paty • {notifications.length} totales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Simulation Trigger */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={triggerDemoNotification}
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-500 hover:bg-blue-500/10 transition-colors"
            >
              <Zap size={12} />
              Simular [X]
            </motion.button>

            {currentCategoryUnreadCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
              >
                Marcar leídas
              </motion.button>
            )}
          </div>
        </div>

        {/* Dashboard Split-pane Container */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* LEFT SIDEBAR - Desktop Filter Categories */}
          <div 
            className="hidden md:flex flex-col w-[260px] border-r flex-shrink-0 py-4 px-3 space-y-1.5"
            style={{
              borderColor: isDark ? 'rgba(30, 58, 95, 0.45)' : 'rgba(10, 25, 47, 0.08)',
              background: isDark ? 'rgba(9, 20, 36, 0.45)' : 'rgba(247, 248, 250, 0.45)',
            }}
          >
            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2">
              Categorías
            </div>
            
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const unread = getUnreadCountForCategory(cat.id);
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative overflow-hidden group`}
                  style={{
                    color: isActive ? undefined : (isDark ? '#94A3B8' : '#475569'),
                    background: isActive ? cat.activeBg : 'transparent',
                    borderLeft: isActive ? `3px solid ${cat.color}` : '3px solid transparent',
                  }}
                >
                  <div className="flex items-center gap-3.5 z-10">
                    <Icon 
                      size={16} 
                      style={{ 
                        color: isActive ? cat.color : (isDark ? '#64748B' : '#64748B') 
                      }}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className={isActive ? cat.activeText : ''}>{cat.label}</span>
                  </div>

                  {unread > 0 && (
                    <span 
                      className="z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white shadow-sm flex items-center justify-center min-w-5 h-5"
                      style={{ background: cat.color }}
                    >
                      {unread}
                    </span>
                  )}

                  {/* Glassmorphic hover overlay */}
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 dark:group-hover:bg-white/5 transition-colors pointer-events-none" />
                </button>
              );
            })}
          </div>

          {/* MOBILE NAVIGATION - Horizontal Tab Pills */}
          <div 
            className="flex md:hidden items-center gap-2 overflow-x-auto px-4 py-3 flex-shrink-0 border-b custom-scrollbar scrollbar-none"
            style={{
              borderColor: isDark ? 'rgba(30, 58, 95, 0.45)' : 'rgba(10, 25, 47, 0.08)',
              background: isDark ? 'rgba(9, 20, 36, 0.2)' : 'rgba(247, 248, 250, 0.2)',
            }}
          >
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              const unread = getUnreadCountForCategory(cat.id);
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0`}
                  style={{
                    background: isActive ? cat.color : (isDark ? 'rgba(17, 34, 64, 0.7)' : 'rgba(241, 245, 249, 0.9)'),
                    color: isActive ? '#FFFFFF' : (isDark ? '#94A3B8' : '#475569'),
                    border: isActive ? `1px solid ${cat.color}` : `1px solid ${isDark ? 'rgba(30, 58, 95, 0.4)' : 'rgba(10, 25, 47, 0.08)'}`,
                  }}
                >
                  <span>{cat.label}</span>
                  {unread > 0 && (
                    <span 
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white text-gray-900' : 'text-white'
                      }`}
                      style={{ background: isActive ? undefined : cat.color }}
                    >
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT VIEWPORT - Notifications list / Empty State */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-transparent">
            
            {/* Active section header info */}
            <div 
              className="px-5 py-2 flex items-center justify-between border-b flex-shrink-0 text-[11px] font-bold"
              style={{
                borderColor: isDark ? 'rgba(30, 58, 95, 0.2)' : 'rgba(10, 25, 47, 0.04)',
                color: isDark ? '#64748B' : '#64748B',
                background: isDark ? 'rgba(13, 27, 46, 0.2)' : 'rgba(253, 252, 248, 0.2)',
              }}
            >
              <span>
                Filtrado por: <span className="text-blue-500 dark:text-blue-400 capitalize">{CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
              </span>
              <span>
                {filteredNotifications.length} coincidentes
              </span>
            </div>

            {/* Main scrollable list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5 custom-scrollbar min-h-0">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length === 0 ? (
                  /* GORGEOUS MINECRAFT-STYLE HIGH-FIDELITY MASCOT EMPTY STATE */
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-10 px-4 text-center h-full min-h-[380px]"
                  >
                    {/* Mascot & Speech Bubble container */}
                    <div className="relative flex flex-col items-center max-w-sm mb-5">
                      
                      {/* Premium Speech Bubble */}
                      <motion.div
                        key={bubbleText} // trigger animations when speech text changes!
                        initial={{ opacity: 0, y: 12, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.9 }}
                        className="relative mb-5 p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-lg border backdrop-blur-md"
                        style={isDark ? {
                          background: 'rgba(13, 27, 46, 0.9)',
                          borderColor: 'rgba(59, 130, 246, 0.25)',
                          color: '#E2E8F0',
                          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                        } : {
                          background: 'rgba(255, 255, 255, 0.95)',
                          borderColor: 'rgba(10, 25, 47, 0.08)',
                          color: '#1E293B',
                          boxShadow: '0 8px 32px 0 rgba(10, 25, 47, 0.05)'
                        }}
                      >
                        <span className="relative z-10">{bubbleText}</span>
                        {/* Triangle arrow */}
                        <div 
                          className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px]"
                          style={{
                            borderTopColor: isDark ? 'rgba(13, 27, 46, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                          }}
                        />
                      </motion.div>

                      {/* Mascot Texting Animation */}
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="relative w-40 h-40 flex items-center justify-center select-none"
                      >
                        <img 
                          src={mascotaChateando} 
                          alt="Paty chateando" 
                          className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(59,130,246,0.3)]" 
                        />
                        
                        {/* Glowing phone light effect */}
                        <div className="absolute top-[52%] left-[62%] w-6 h-6 rounded-full bg-cyan-400/40 blur-md animate-pulse pointer-events-none" />
                        <div className="absolute top-[53%] left-[63%] w-2 h-2 rounded-full bg-cyan-200/70 blur-xs animate-ping pointer-events-none" />
                      </motion.div>
                    </div>

                    <h3 className="text-gray-900 dark:text-white font-extrabold text-base mb-1.5 tracking-tight">
                      {activeCategory === 'all' 
                        ? 'Tu buzón está limpio' 
                        : `Sin notificaciones en "${CATEGORIES.find(c => c.id === activeCategory)?.label}"`}
                    </h3>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-[11px] text-center max-w-xs mb-6 leading-relaxed">
                      Parece que todo está al día. ¡Prueba a simular alertas pulsando la tecla <kbd className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[10px] font-bold font-mono border dark:border-white/10 mx-0.5">X</kbd> de tu teclado!
                    </p>

                    {/* Simulation trigger button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={triggerDemoNotification}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all border"
                      style={isDark ? {
                        background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                        borderColor: 'rgba(59, 130, 246, 0.4)',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                      } : {
                        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                        borderColor: 'rgba(37, 99, 235, 0.2)',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)'
                      }}
                    >
                      <Zap size={14} className="animate-bounce" />
                      Simular Notificación [X]
                    </motion.button>
                  </motion.div>
                ) : (
                  filteredNotifications.map((notification, index) => {
                    const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: Math.min(index * 0.04, 0.2) }}
                        className="relative rounded-2xl p-4 transition-all"
                        style={{
                          background: notification.read
                            ? (isDark ? '#112240' : 'rgba(253,252,248,0.95)')
                            : (isDark ? 'rgba(59,130,246,0.07)' : 'rgba(239,246,255,0.95)'),
                          boxShadow: isDark 
                            ? '0 2px 12px rgba(0,0,0,0.2)' 
                            : '0 2px 12px rgba(10,25,47,0.07), 0 1px 4px rgba(10,25,47,0.04)',
                          border: notification.read
                            ? (isDark ? '1px solid #1E3A5F' : '1px solid rgba(10,25,47,0.06)')
                            : `1px solid ${isDark ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.2)'}`,
                          borderLeft: notification.read ? undefined : `4px solid ${notification.color}`,
                        }}
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Avatar or Icon Bubble */}
                          <div
                            className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm"
                            style={{
                              background: notification.avatar
                                ? 'transparent'
                                : `${notification.color}20`,
                            }}
                          >
                            {notification.avatar ? (
                              <img
                                src={notification.avatar}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : notification.icon ? (
                              <span className="text-xl leading-none">{notification.icon}</span>
                            ) : (
                              <Icon size={20} style={{ color: notification.color }} />
                            )}
                          </div>

                          {/* Content Detail */}
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start justify-between gap-2 mb-0.5">
                              <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-1">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div
                                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 animate-pulse"
                                  style={{ background: notification.color }}
                                />
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                {notification.timestamp}
                              </span>
                              
                              {SECTION_BADGES[notification.type] && (
                                <span
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                                  style={{
                                    background: SECTION_BADGES[notification.type].bg,
                                    color: SECTION_BADGES[notification.type].color,
                                  }}
                                >
                                  → {SECTION_BADGES[notification.type].label}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 self-center sm:self-start">
                            {!notification.read && (
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="w-7.5 h-7.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors p-1.5"
                                title="Marcar como leída"
                              >
                                <Check size={14} />
                              </motion.button>
                            )}
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              className="w-7.5 h-7.5 rounded-lg bg-gray-100 dark:bg-[#1A2F4A] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1.5"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}