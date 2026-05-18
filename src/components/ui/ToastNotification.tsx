import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Info, CheckCircle2, AlertTriangle, AlertCircle,
  Heart, Users, MessageSquare,
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useApp } from '../../store/AppContext';
import type { NotificationVariant } from '../../types/notification';

interface VariantStyle {
  icon: React.ElementType;
  color: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
}

const VARIANT_STYLES: Record<NotificationVariant, VariantStyle> = {
  info: {
    icon: Info,
    color: '#3B82F6',
    bgLight: 'rgba(59,130,246,0.08)',
    bgDark: 'rgba(59,130,246,0.12)',
    borderLight: 'rgba(59,130,246,0.20)',
    borderDark: 'rgba(59,130,246,0.25)',
  },
  success: {
    icon: CheckCircle2,
    color: '#10B981',
    bgLight: 'rgba(16,185,129,0.08)',
    bgDark: 'rgba(16,185,129,0.12)',
    borderLight: 'rgba(16,185,129,0.20)',
    borderDark: 'rgba(16,185,129,0.25)',
  },
  warning: {
    icon: AlertTriangle,
    color: '#F59E0B',
    bgLight: 'rgba(245,158,11,0.08)',
    bgDark: 'rgba(245,158,11,0.12)',
    borderLight: 'rgba(245,158,11,0.20)',
    borderDark: 'rgba(245,158,11,0.25)',
  },
  error: {
    icon: AlertCircle,
    color: '#EF4444',
    bgLight: 'rgba(239,68,68,0.08)',
    bgDark: 'rgba(239,68,68,0.12)',
    borderLight: 'rgba(239,68,68,0.20)',
    borderDark: 'rgba(239,68,68,0.25)',
  },
  match: {
    icon: Heart,
    color: '#EC4899',
    bgLight: 'rgba(236,72,153,0.08)',
    bgDark: 'rgba(236,72,153,0.12)',
    borderLight: 'rgba(236,72,153,0.20)',
    borderDark: 'rgba(236,72,153,0.25)',
  },
  parche: {
    icon: Users,
    color: '#8B5CF6',
    bgLight: 'rgba(139,92,246,0.08)',
    bgDark: 'rgba(139,92,246,0.12)',
    borderLight: 'rgba(139,92,246,0.20)',
    borderDark: 'rgba(139,92,246,0.25)',
  },
  message: {
    icon: MessageSquare,
    color: '#06B6D4',
    bgLight: 'rgba(6,182,212,0.08)',
    bgDark: 'rgba(6,182,212,0.12)',
    borderLight: 'rgba(6,182,212,0.20)',
    borderDark: 'rgba(6,182,212,0.25)',
  },
};

export function ToastNotification() {
  const { notifications, dismiss } = useNotifications();
  const { isDark } = useApp();

  const handleClick = (id: string, actionRoute?: string) => {
    if (actionRoute) {
      window.location.href = actionRoute;
    }
    dismiss(id);
  };

  return createPortal(
    <div
      aria-live="polite"
      aria-label="Notificaciones"
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        width: '100%',
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
        padding: '0 16px',
      }}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => {
          const style = VARIANT_STYLES[notif.variant];
          const Icon = style.icon;

          return (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: -40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              onClick={() => handleClick(notif.id, notif.actionRoute)}
              role="alert"
              style={{
                pointerEvents: 'auto',
                cursor: notif.actionRoute ? 'pointer' : 'default',
                background: isDark
                  ? 'rgba(13,27,46,0.92)'
                  : 'rgba(253,252,248,0.95)',
                backdropFilter: 'blur(20px) saturate(1.6)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
                border: `1px solid ${isDark ? style.borderDark : style.borderLight}`,
                borderRadius: 16,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                boxShadow: isDark
                  ? '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)'
                  : '0 8px 32px rgba(10,25,47,0.12), 0 2px 8px rgba(10,25,47,0.06)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Barra de progreso (tiempo restante) */}
              {notif.duration > 0 && (
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: notif.duration / 1000, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${style.color}, ${style.color}88)`,
                    transformOrigin: 'left',
                    borderRadius: '0 0 16px 16px',
                  }}
                />
              )}

              {/* Avatar o icono */}
              {notif.avatar ? (
                <img
                  src={notif.avatar}
                  alt=""
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: `2px solid ${style.color}40`,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: isDark ? style.bgDark : style.bgLight,
                  }}
                >
                  <Icon size={20} style={{ color: style.color }} />
                </div>
              )}

              {/* Contenido*/}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: 13,
                    lineHeight: '18px',
                    color: isDark ? '#F1F5F9' : '#111827',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {notif.title}
                </p>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: 12,
                    lineHeight: '16px',
                    color: isDark ? '#94A3B8' : '#6B7280',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {notif.message}
                </p>
              </div>

              {/* Boton de cerrar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismiss(notif.id);
                }}
                aria-label="Cerrar notificación"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 4,
                  cursor: 'pointer',
                  color: isDark ? '#64748B' : '#9CA3AF',
                  flexShrink: 0,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = isDark ? '#CBD5E1' : '#374151')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? '#64748B' : '#9CA3AF')}
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
