import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bell, Check, Trash2, MessageCircle, Users, Calendar, PartyPopper, AlertCircle, Zap } from 'lucide-react';
import { type Notification } from '../types/mockData';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { notificationsService, mapApiNotification } from '../services/notifications.service';

// Mascot Assets
import mascotaDurmiendo from '../assets/mascota_durmiendo.png';

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

const SLEEPY_SPEECH_BUBBLES: Record<CategoryType, string> = {
  all: "Zzz... Qué paz... No tienes ninguna notificación. ¡Déjame dormir un ratito más! 😴",
  chat: "Zzz... Por ahora no hay chismes ni mensajes. Qué silencio tan arrullador... 💤",
  match: "Zzz... Cupido también está tomando una siesta... No hay nuevos matches por hoy. ♥",
  event: "Zzz... Todo tranquilo en el campus... Ningún evento nuevo por agendar... 📅",
  parches: "Zzz... Los parches están en pausa por hoy... Esperando invitaciones de tus amigos. 🍻"
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const { isDark, notificationsList: notifications, setNotificationsList: setNotifications } = useApp();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  useEffect(() => {
    notificationsService.getNotifications().then(apiNotifs => {
      if (apiNotifs.length > 0) {
        setNotifications(apiNotifs.map(mapApiNotification) as Notification[]);
      }
    });
  }, []);

  // Total unread notifications count (global badge)
  const totalUnreadCount = notifications.filter(n => !n.read).length;

  // Mark a single notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    notificationsService.markAsRead(id);
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
    if (activeCategory === 'all') notificationsService.markAllAsRead();
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
    <div className="relative min-h-screen w-full flex flex-col pb-8">
      {/* Background wallpaper */}
      <DoodleBackground isDark={isDark} opacity={isDark ? 0.95 : 0.8} />

      {/* Independent Header (Sticky Sub-header) */}
      <div className="sticky top-[57px] md:top-[73px] z-40 bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-lg border-b border-gray-200 dark:border-[#1E3A5F] w-full">
        <div className="px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2F4A] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-gray-900 dark:text-white font-bold text-lg flex items-center gap-2">
            Notificaciones
            {totalUnreadCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white animate-pulse">
                {totalUnreadCount}
              </span>
            )}
          </h1>
          <div className="w-9" /> {/* Spacer to align title centered */}
        </div>
      </div>

      {/* Centered Dashboard Content Container */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center py-6 px-4">
        {/* Centered Dashboard Wrapper at exactly 4/6 width on Desktop */}
        <div 
          className="relative w-full md:w-4/6 lg:w-4/6 xl:w-4/6 h-[calc(100vh-180px)] min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border backdrop-blur-md flex flex-col transition-all"
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
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 m-0 leading-tight">
                Buzón Inteligente de Paty • {notifications.length} totales
              </p>
            </div>

            <div className="flex items-center gap-2">
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

        {/* Dashboard Content Container */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          
          {/* TOP FILTER BAR - Horizontal scrollable tab pills for all screens */}
          <div 
            className="flex items-center gap-2 overflow-x-auto px-5 py-3 flex-shrink-0 border-b custom-scrollbar scrollbar-none"
            style={{
              borderColor: isDark ? 'rgba(30, 58, 95, 0.45)' : 'rgba(10, 25, 47, 0.08)',
              background: isDark ? 'rgba(9, 20, 36, 0.45)' : 'rgba(247, 248, 250, 0.45)',
            }}
          >
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const unread = getUnreadCountForCategory(cat.id);
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 relative overflow-hidden group border`}
                  style={{
                    borderColor: isActive ? cat.color : (isDark ? 'rgba(30, 58, 95, 0.3)' : 'rgba(10, 25, 47, 0.08)'),
                    background: isActive ? cat.activeBg : (isDark ? 'rgba(17, 34, 64, 0.3)' : 'rgba(255, 255, 255, 0.6)'),
                    color: isActive ? undefined : (isDark ? '#94A3B8' : '#475569'),
                  }}
                >
                  <Icon 
                    size={14} 
                    style={{ color: isActive ? cat.color : (isDark ? '#64748B' : '#64748B') }}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                  <span className={isActive ? cat.activeText : ''}>{cat.label}</span>
                  
                  {unread > 0 && (
                    <span 
                      className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md text-white shadow-sm flex items-center justify-center min-w-4 h-4 ml-0.5"
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
                  /* GORGEOUS HIGH-FIDELITY MASCOT SLEEPING EMPTY STATE */
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
                        key={activeCategory + "_sleep"}
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
                        <span className="relative z-10">
                          {SLEEPY_SPEECH_BUBBLES[activeCategory] || SLEEPY_SPEECH_BUBBLES.all}
                        </span>
                        {/* Triangle arrow */}
                        <div 
                          className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px]"
                          style={{
                            borderTopColor: isDark ? 'rgba(13, 27, 46, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                          }}
                        />
                      </motion.div>

                      {/* Mascot Sleeping Animation */}
                      <motion.div
                        animate={{ 
                          y: [0, -6, 0],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{ 
                          duration: 5, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="relative w-40 h-40 flex items-center justify-center select-none"
                      >
                        <img 
                          src={mascotaDurmiendo} 
                          alt="Paty durmiendo" 
                          className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(30,58,95,0.25)]" 
                        />
                        
                        {/* Soft night/sleeping glow effect */}
                        <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-indigo-500/10 dark:bg-purple-500/15 blur-xl pointer-events-none animate-pulse" />
                      </motion.div>
                    </div>

                    <h3 className="text-gray-900 dark:text-white font-extrabold text-base mb-1.5 tracking-tight">
                      {activeCategory === 'all' 
                        ? 'Tu buzón está limpio' 
                        : `Sin notificaciones en "${CATEGORIES.find(c => c.id === activeCategory)?.label}"`}
                    </h3>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-[11px] text-center max-w-xs leading-relaxed">
                      Parece que todo está al día. Te avisaremos cuando ocurra algo interesante.
                    </p>
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
  </div>
  );
}