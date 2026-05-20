import { useState, useId, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Sun, Moon, Menu } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { useNotifications } from '../../hooks/useNotifications';
import { LuxuryDrawer } from './LuxuryDrawer';
import { GRADIENT, GOLD_GRADIENT } from '../../types/mockData';
import { DoodleBackground } from '../ui/DoodleBackground';
import { MascotNotificationBubble } from '../ui/MascotNotificationBubble';
import logoImg from '../../assets/logo_nuevo_patricia.png';

const DEMO_NOTIFICATIONS = [
  { title: '¡Nuevo Match! 💖', message: 'Ana García tiene intereses similares a los tuyos', variant: 'match' as const },
  { title: '¡Parche creado! 🎉', message: 'El parche "Estudio de Cálculo" empieza en 30 min', variant: 'parche' as const },
  { title: 'Nuevo mensaje 💬', message: 'Carlos te envió un mensaje en el chat', variant: 'message' as const },
  { title: '¡Logro desbloqueado! 🏆', message: 'Has ganado la mona "Explorador del Campus"', variant: 'success' as const },
  { title: '¡Evento próximo! 📅', message: 'Hackathon ECI comienza mañana a las 9:00 AM', variant: 'info' as const },
];

export function Layout() {
  const { isDark, toggleTheme, currentUser, notifications } = useApp();
  const { push: pushNotification } = useNotifications();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const xpInLevel = (currentUser?.xp ?? 0) % 500;
  const xpPercent = xpInLevel / 500;
  const ringR = 16;
  const ringCircumference = 2 * Math.PI * ringR;
  const ringDashOffset = ringCircumference * (1 - xpPercent);
  const uid = useId().replace(/:/g, '');
  const gradId = `xpRing-${uid}`;

  // Press 'x' to trigger a demo push notification
  useEffect(() => {
    let demoIndex = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'x' || e.key === 'X') {
        // Don't fire when typing in inputs
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
        const demo = DEMO_NOTIFICATIONS[demoIndex % DEMO_NOTIFICATIONS.length];
        pushNotification({
          title: demo.title,
          message: demo.message,
          variant: demo.variant,
          duration: 6000,
        });
        demoIndex++;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pushNotification]);

  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ isolation: 'isolate', background: 'transparent' }}>
      <DoodleBackground isDark={isDark} opacity={1} />
      {}
      <LuxuryDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={isDark
          ? { background: 'rgba(3,13,31,0.96)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(30,58,95,0.5)', boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }
          : { background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(10,25,47,0.06)', boxShadow: '0 2px 20px rgba(10,25,47,0.07)' }
        }
      >
        <div className="flex items-center justify-between px-4 py-3">
          {}
          <button
            className="flex items-center gap-2.5 active:opacity-70 transition-opacity"
            onClick={() => setDrawerOpen(true)}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
              <img src={logoImg} alt="patrici.a" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start">
              <span
                className="font-bold tracking-tight leading-none"
                style={{
                  background: GOLD_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1.05rem',
                }}
              >
                PATRICI.A
              </span>
              <span className="text-[10px] tracking-wide" style={{ color: isDark ? '#4A6080' : '#9CA3AF' }}>
                Campus Social
              </span>
            </div>
            <Menu
              size={15}
              style={{ color: isDark ? '#4A6080' : '#9CA3AF', marginLeft: 2 }}
            />
          </button>
          {}
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
            <MascotNotificationBubble />
            <button
              onClick={() => navigate('/profile')}
              className="active:scale-90 transition-transform relative flex-shrink-0"
              title={`Nivel ${currentUser?.level} — ${xpInLevel}/500 XP`}
            >
              <svg width="38" height="38" viewBox="0 0 38 38" className="absolute inset-0" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="19" cy="19" r={ringR} fill="none" stroke={isDark ? 'rgba(30,58,95,0.6)' : 'rgba(10,25,47,0.1)'} strokeWidth="2.5" />
                <circle cx="19" cy="19" r={ringR} fill="none" stroke={`url(#${gradId})`} strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={ringCircumference} strokeDashoffset={ringDashOffset} />
                <defs>
                  <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D97706" />
                    <stop offset="60%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#FDE68A" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="w-[38px] h-[38px] rounded-full overflow-hidden p-[3px]">
                {currentUser?.avatar
                  ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                  : <div className="w-full h-full rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ background: GRADIENT }}>
                      {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                }
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-black shadow"
                style={{ background: GOLD_GRADIENT, border: `1.5px solid ${isDark ? '#030D1F' : '#F7F5F0'}` }}>
                {currentUser?.level}
              </div>
            </button>
          </div>
        </div>
      </header>
      {}
      <main className="pt-[57px] pb-6 min-h-screen relative z-[1]">
        <Outlet />
      </main>
    </div>
  );
}