import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import patyAdminImg from '../../assets/PATY_ADMIN.png';

interface ServiceUnavailableModalProps {
  show: boolean;
  onClose: () => void;
}

export function ServiceUnavailableModal({ show, onClose }: ServiceUnavailableModalProps) {
  const { isDark } = useApp();

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[88%] max-w-sm"
          >
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: isDark ? '#0A1628' : '#FFFFFF',
                border: isDark ? '1.5px solid rgba(59,130,246,0.25)' : '1.5px solid rgba(59,130,246,0.15)',
                boxShadow: isDark
                  ? '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(59,130,246,0.08)'
                  : '0 20px 60px rgba(0,0,0,0.12)',
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                }}
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center px-7 pt-10 pb-8 text-center">
                <div className="relative mb-5">
                  <div
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{
                      background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                      transform: 'scale(1.8)',
                    }}
                  />
                  <img
                    src={patyAdminImg}
                    alt="PATY ADMIN"
                    className="w-28 h-28 object-contain relative z-10 drop-shadow-xl"
                  />
                </div>

                <h3
                  className="text-lg font-black mb-2 tracking-tight"
                  style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}
                >
                  Servicio no disponible
                </h3>

                <p
                  className="text-sm leading-relaxed mb-7"
                  style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)' }}
                >
                  El servicio no se encuentra disponible en el momento, se está trabajando para solucionarlo, por favor intente más tarde.
                </p>

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  }}
                >
                  Entendido
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
