import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bell, Check, Trash2, MessageCircle, Users, Calendar, PartyPopper, AlertCircle, Zap } from 'lucide-react';
import { notifications as initialNotifications, type Notification } from '../types/mockData';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
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
  event: { label: 'Eventos', color: '#D97706', bg: 'rgba(217,119,6,0.12)' },
  event_reminder: { label: 'Eventos', color: '#D97706', bg: 'rgba(217,119,6,0.12)' },
  parche_invitation: { label: 'Parches', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
};
export function NotificationsPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };
  return (
    <div className="min-h-screen relative pb-10" style={{ background: 'transparent' }}>
      <DoodleBackground isDark={isDark} />
      {}
      <div
        className="sticky top-[57px] z-40 backdrop-blur-xl border-b"
        style={isDark
          ? { background: 'rgba(10,25,47,0.97)', borderColor: '#1E3A5F' }
          : { background: 'rgba(253,252,248,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderColor: 'rgba(10,25,47,0.07)', boxShadow: '0 2px 16px rgba(10,25,47,0.07)' }
        }
      >
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2F4A] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-gray-900 dark:text-white font-bold text-lg">Notificaciones</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {unreadCount} sin leer
                </p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAllAsRead}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            >
              Marcar todas leídas
            </motion.button>
          )}
        </div>
      </div>
      {}
      <div className="px-5 py-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)' }}
              >
                <Bell size={32} className="text-white" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">
                Sin notificaciones
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-xs">
                Cuando recibas notificaciones, aparecerán aquí
              </p>
            </motion.div>
          ) : (
            notifications.map((notification, index) => {
              const Icon = NOTIFICATION_ICONS[notification.type];
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative rounded-2xl p-4 transition-all"
                  style={{
                    background: notification.read
                      ? (isDark ? '#112240' : 'rgba(253,252,248,0.95)')
                      : (isDark ? 'rgba(59,130,246,0.07)' : 'rgba(239,246,255,0.95)'),
                    boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(10,25,47,0.07), 0 1px 4px rgba(10,25,47,0.04)',
                    border: notification.read
                      ? (isDark ? '1px solid #1E3A5F' : '1px solid rgba(10,25,47,0.06)')
                      : `1px solid ${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.2)'}`,
                    borderLeft: notification.read ? undefined : '4px solid #3B82F6',
                  }}
                >
                  <div className="flex items-start gap-3">
                    {}
                    <div
                      className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
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
                        <span className="text-2xl">{notification.icon}</span>
                      ) : (
                        <Icon size={24} style={{ color: notification.color }} />
                      )}
                    </div>
                    {}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                            style={{ background: notification.color }}
                          />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {notification.timestamp}
                      </p>
                      {SECTION_BADGES[notification.type] && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{
                              background: SECTION_BADGES[notification.type].bg,
                              color: SECTION_BADGES[notification.type].color,
                            }}
                          >
                            → {SECTION_BADGES[notification.type].label}
                          </span>
                        </div>
                      )}
                    </div>
                    {}
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title="Marcar como leída"
                        >
                          <Check size={16} />
                        </motion.button>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A2F4A] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
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
  );
}