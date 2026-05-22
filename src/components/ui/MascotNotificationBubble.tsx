import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { useApp } from '../../store/AppContext';
import mascotImg from '../../assets/mascota_sticker.png';

export function MascotNotificationBubble() {
  const { notifications, isDark } = useApp();
  const navigate = useNavigate();
  const [showBubble, setShowBubble] = useState(false);

  const handleClick = () => {
    if (notifications > 0) {
      setShowBubble(prev => !prev);
    } else {
      navigate('/notifications');
    }
  };

  const handleBubbleClick = () => {
    setShowBubble(false);
    navigate('/notifications');
  };

  return (
    <div className="relative">
      {/* Mascot button */}
      <motion.button
        onClick={handleClick}
        className="relative flex items-center justify-center"
        whileTap={{ scale: 0.9 }}
        style={{ width: 40, height: 40 }}
        title="Notificaciones"
      >
        {/* Glow ring when notifications exist */}
        {notifications > 0 && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 0px 0px rgba(251,191,36,0)',
                '0 0 10px 3px rgba(251,191,36,0.4)',
                '0 0 0px 0px rgba(251,191,36,0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Mascot image */}
        <motion.img
          src={mascotImg}
          alt="Mascota PATRICI.A"
          className="w-full h-full object-contain rounded-full"
          style={{
            filter: notifications > 0 ? 'none' : 'grayscale(0.4) opacity(0.7)',
          }}
          animate={
            notifications > 0
              ? {
                  rotate: [0, -6, 6, -4, 4, 0],
                  scale: [1, 1.05, 1],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        />

        {/* Notification count badge */}
        {notifications > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full text-white flex items-center justify-center font-black"
            style={{
              background: 'linear-gradient(135deg, #EF4444, #F97316)',
              fontSize: '9px',
              padding: '0 3px',
              boxShadow: '0 2px 6px rgba(239,68,68,0.4)',
              border: `1.5px solid ${isDark ? '#030D1F' : '#F7F5F0'}`,
            }}
          >
            {notifications}
          </motion.span>
        )}
      </motion.button>

      {/* Speech bubble */}
      <AnimatePresence>
        {showBubble && notifications > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            onClick={handleBubbleClick}
            style={{
              position: 'absolute',
              top: '100%',
              right: -8,
              marginTop: 8,
              cursor: 'pointer',
              zIndex: 100,
              width: 'max-content',
              maxWidth: 220,
            }}
          >
            {/* Bubble arrow */}
            <div
              style={{
                position: 'absolute',
                top: -6,
                right: 16,
                width: 12,
                height: 12,
                transform: 'rotate(45deg)',
                background: isDark ? 'rgba(13,27,46,0.95)' : 'rgba(255,255,255,0.97)',
                border: isDark
                  ? '1px solid rgba(251,191,36,0.3)'
                  : '1px solid rgba(251,191,36,0.4)',
                borderRight: 'none',
                borderBottom: 'none',
              }}
            />

            {/* Bubble content */}
            <div
              style={{
                position: 'relative',
                background: isDark
                  ? 'rgba(13,27,46,0.95)'
                  : 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 14,
                padding: '10px 14px',
                border: isDark
                  ? '1px solid rgba(251,191,36,0.3)'
                  : '1px solid rgba(251,191,36,0.4)',
                boxShadow: isDark
                  ? '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.08)'
                  : '0 8px 32px rgba(0,0,0,0.12), 0 0 20px rgba(251,191,36,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {/* Mini mascot in bubble */}
              <img
                src={mascotImg}
                alt=""
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  objectFit: 'contain',
                  flexShrink: 0,
                }}
              />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    color: isDark ? '#FBBF24' : '#D97706',
                    lineHeight: '16px',
                  }}
                >
                  ¡Hey!
                </p>
                <p
                  style={{
                    margin: '1px 0 0',
                    fontSize: 11,
                    fontWeight: 500,
                    color: isDark ? '#CBD5E1' : '#374151',
                    lineHeight: '15px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Tienes{' '}
                  <span style={{ fontWeight: 800, color: isDark ? '#FBBF24' : '#D97706' }}>
                    {notifications}
                  </span>{' '}
                  {notifications === 1 ? 'notificación nueva' : 'notificaciones nuevas'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
