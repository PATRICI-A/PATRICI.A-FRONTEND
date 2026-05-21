import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, ChevronRight, Edit2, Star, Zap, Users, Heart, TrendingUp, LogOut, QrCode, Share2, X, Trophy, Bell, ChevronLeft, CalendarDays } from 'lucide-react';
import patyImg from '../assets/patyProfile.png';
import { useApp } from '../store/AppContext';
import { GRADIENT, GOLD_GRADIENT, GOLD_LIGHT, PINK, ORANGE, TEAL } from '../types/mockData';

import { profileService } from '../profileService';
import type { UserProfileData } from '../profileService';

export function ProfilePage() {
  const navigate = useNavigate();
  const { logout, isDark } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Estados limpios y únicos para la sincronización
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string>('');

  const TARGET_USER_ID = '66a76eca-e405-4e31-8bb0-801d3b06e2de';

  useEffect(() => {
    setIsLoadingApi(true);
    setApiError('');

    profileService.getUserById(TARGET_USER_ID)
        .then((data) => {
          setUser(data);
          setIsLoadingApi(false);
        })
        .catch((err) => {
          console.error("Error en la petición:", err);
          setApiError(err.response?.status
              ? `HTTP ${err.response.status}: ${err.response.statusText}`
              : `${err.message || 'Error de red'}`);
          setIsLoadingApi(false);
        });
  }, []);

  if (isLoadingApi) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0A192F]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold text-sm">Sincronizando perfil universitario...</p>
          </div>
        </div>
    );
  }

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0A192F] px-5 text-center">
          <p className="text-red-500 font-bold text-lg mb-2">Error de Sincronización</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm mb-2">
            No se encontraron registros activos para el ID asignado en el entorno de desarrollo.
          </p>
          {apiError && (
              <p className="text-amber-500 font-mono text-[11px] bg-amber-500/10 px-3 py-1 rounded-lg mb-4">
                Detalle técnico: {apiError}
              </p>
          )}
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-md">
            Reintentar Conexión
          </button>
        </div>
    );
  }

  // Variables calculadas de manera segura (Solución al error TS2339 de user.level)
  const userXp = user.xp ?? 0;
  const userLevel = Math.max(1, Math.floor(userXp / 1000)) || 1;
  const xpForNextLevel = 5000;
  const xpPercent = Math.min((userXp / xpForNextLevel) * 100, 100);
  const activeParches = user.activeParches ?? 0;
  const streak = user.streak ?? 0;
  const rankFaculty = user.rankFaculty ? `#${user.rankFaculty}` : 'N/A';

  const handleLogout = () => { logout(); navigate('/'); };

  const handleShareQR = async () => {
    const url = `${window.location.origin}/profile?user=${user.id}`;
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title: `${user.name} en patrici.a`, url }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(url); } catch {}
    setShowQRModal(false);
  };

  return (
      <div className="flex flex-col min-h-screen pb-4">
        {/* Navbar Superior */}
        <div className="max-w-2xl mx-auto w-full px-5 pt-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400" style={{ background: 'rgba(10,25,47,0.07)' }}>
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-gray-900 dark:text-white text-2xl font-black">Mi Perfil</h1>
            <img src={patyImg} alt="Paty" className="h-24 w-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/notifications')} className="relative w-10 h-10 rounded-full bg-white dark:bg-[#112240] flex items-center justify-center text-gray-500 dark:text-gray-400">
              <Bell size={18} />
            </button>
            <button onClick={() => setShowQRModal(true)} className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: GOLD_GRADIENT }}>
              <QrCode size={17} />
            </button>
            <button onClick={() => navigate('/settings')} className="w-10 h-10 rounded-full bg-white dark:bg-[#112240] flex items-center justify-center text-gray-500 dark:text-gray-400">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Cuerpo Principal */}
        <div className="max-w-2xl mx-auto w-full">
          {/* Tarjeta del Estudiante */}
          <div className="px-5 mb-4">
            <div className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden" style={{ boxShadow: `0 0 0 3px transparent, 0 0 0 4px ${PINK}` }}>
                    <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md" style={{ background: GRADIENT }}>
                    {userLevel}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-gray-900 dark:text-white font-bold truncate">{user.name}</h2>
                    <button onClick={() => navigate('/edit-profile')}><Edit2 size={14} className="text-gray-400" /></button>
                  </div>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: PINK }}>
                    NIVEL {userLevel} · {(user.faculty || 'INGENIERÍA').toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.semester || 1}º Semestre</p>

                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-gray-400">{userXp} XP</span>
                      <span className="text-[10px] text-gray-400">Siguiente: {xpForNextLevel} XP</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-[#172A45] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ background: GRADIENT, width: `${xpPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Intereses / Tags (Solución al error TS7006 tipando con : string) */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {user.interests && user.interests.length > 0 ? (
                    user.interests.map((interest: string) => (
                        <span key={interest} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ color: PINK, background: 'rgba(29,78,216,0.08)' }}>
                          {interest}
                        </span>
                    ))
                ) : (
                    <span className="text-xs text-gray-400 italic">Sin intereses asignados</span>
                )}
              </div>
            </div>
          </div>

          {/* Horario */}
          <div className="px-5 mb-4">
            <button onClick={() => navigate('/schedule')} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left bg-[#112240] border border-cyan-500/20">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-cyan-500/10">
                <CalendarDays size={20} color={TEAL} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">Mi Horario</p>
                <p className="text-xs text-gray-400 mt-0.5">Configura tus franjas libres en el campus</p>
              </div>
              <ChevronRight size={16} style={{ color: TEAL }} />
            </button>
          </div>

          {/* Grid de Estadísticas */}
          <div className="px-5 mb-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Zap, value: `${userXp.toLocaleString()} XP`, label: 'Puntos', color: ORANGE },
                { icon: Users, value: activeParches, label: 'Parches', color: '#3B82F6' },
                { icon: TrendingUp, value: `${streak} días`, label: 'Racha', color: '#10B981' },
              ].map(stat => (
                  <div key={stat.label} className="bg-white dark:bg-[#112240] rounded-2xl p-3 shadow-sm flex flex-col items-center text-center">
                    <stat.icon size={16} style={{ color: stat.color }} className="mb-1" />
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{stat.value}</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide mt-0.5">{stat.label}</p>
                  </div>
              ))}
            </div>
          </div>

          {/* Ranking Facultad */}
          <div className="px-5 mb-4">
            <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: GRADIENT }}>
                <Star size={22} color="white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">Ranking Facultad</p>
                <p className="text-xs text-gray-400">Rendimiento académico global</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl" style={{ color: ORANGE }}>{rankFaculty}</p>
                <p className="text-xs text-gray-400">carrera</p>
              </div>
            </div>
          </div>

          {/* Banner Ranking Campus */}
          <div className="px-5 mb-4">
            <button onClick={() => navigate('/ranking')} className="w-full rounded-2xl p-4 text-left bg-gradient-to-r from-[#0A192F] to-[#0D2847] border border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GOLD_GRADIENT }}>
                  <Trophy size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-white text-sm">Ranking Campus</p>
                  <p className="text-[10px]" style={{ color: GOLD_LIGHT }}>Tabla de posiciones general</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ color: GOLD_LIGHT, background: 'rgba(245,158,11,0.12)' }}>
                  Ver Tabla →
                </span>
              </div>
            </button>
          </div>

          {/* Soporte Bienestar */}
          <div className="px-5 mb-4">
            <div className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer" style={{ background: GRADIENT }} onClick={() => navigate('/wellness')}>
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Heart size={20} color="#EF4444" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Soporte y Bienestar 24/7</p>
                <p className="text-white/70 text-xs">Atención y acompañamiento permanente</p>
              </div>
              <ChevronRight size={18} color="white" />
            </div>
          </div>

          {/* Opciones */}
          <div className="px-5 mb-4">
            <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm overflow-hidden">
              {[
                { icon: Edit2, label: 'Editar Perfil', action: () => navigate('/edit-profile') },
                { icon: Settings, label: 'Configuración de la Cuenta', action: () => navigate('/settings') },
              ].map((item, i) => (
                  <button key={item.label} onClick={item.action} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-[#172A45]" style={{ borderBottom: i < 1 ? '1px solid #F3F4F6' : 'none' }}>
                    <item.icon size={18} className="text-gray-400" />
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </button>
              ))}
            </div>
          </div>

          {/* Cierre de Sesión (Solución estricta al error de Parseo 398) */}
          <div className="px-5">
            {showLogoutConfirm ? (
                <div className="bg-blue-950/40 rounded-2xl p-4 border border-blue-900/30">
                  <p className="text-sm text-blue-400 font-medium mb-3 text-center">¿Deseas cerrar tu sesión académica?</p>
                  <div className="flex gap-3">
                    <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-blue-800 text-xs text-blue-400 bg-transparent">
                      Cancelar
                    </button>
                    <button onClick={handleLogout} className="flex-1 py-2.5 rounded-xl text-white text-xs font-semibold" style={{ background: GRADIENT }}>
                      Confirmar
                    </button>
                  </div>
                </div>
            ) : (
                <button onClick={() => setShowLogoutConfirm(true)} className="w-full py-3.5 rounded-2xl border border-blue-900/40 text-blue-400 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-blue-950/10 transition-colors">
                  <LogOut size={15} /> Cerrar Sesión
                </button>
            )}
          </div>
        </div>

        {/* Modal QR de Perfil */}
        <AnimatePresence>
          {showQRModal && (
              <>
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setShowQRModal(false)} />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 rounded-3xl overflow-hidden bg-[#0A1628] p-6 flex flex-col items-center border border-white/5">
                  <div className="w-full flex justify-between items-center mb-5">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">patrici.a</p>
                      <h3 className="text-white font-black text-lg">Tu QR de Perfil</h3>
                    </div>
                    <button onClick={() => setShowQRModal(false)} className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10">
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                  <div className="p-4 rounded-2xl mb-4 bg-white shadow-lg">
                    <div className="w-[190px] h-[190px] bg-gray-100 flex items-center justify-center text-xs text-black">QR Code</div>
                  </div>
                  <div className="text-center mb-5">
                    <p className="text-white font-black text-base">{user.name}</p>
                    <p className="text-blue-400 text-xs">{user.faculty} · Niv. {userLevel}</p>
                  </div>
                  <button onClick={handleShareQR} className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2" style={{ background: GOLD_GRADIENT }}>
                    <Share2 size={16} /> Compartir mi perfil
                  </button>
                </motion.div>
              </>
          )}
        </AnimatePresence>
      </div>
  );
}