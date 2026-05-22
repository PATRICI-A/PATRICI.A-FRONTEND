import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, ChevronRight, Edit2, Star, Zap, Users, Heart, TrendingUp, Shield, LogOut, Lock, ScanLine, QrCode, Share2, X, Trophy, Bell, ChevronLeft, CalendarDays } from 'lucide-react';
import patyImg from '../assets/patyProfile.png';
import { useApp } from '../store/AppContext';
import { monas, rankingUsers, notifications, GRADIENT, GOLD_GRADIENT, GOLD_LIGHT, PINK, ORANGE, TEAL } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';

function MockQRCode({ seed, size = 180 }: { seed: string; size?: number }) {
  const N = 21;
  const cell = size / N;
  const drawFinder = (mat: boolean[][], res: boolean[][], r0: number, c0: number) => {
    for (let dr = 0; dr < 7; dr++) {
      for (let dc = 0; dc < 7; dc++) {
        if (r0 + dr >= N || c0 + dc >= N) continue;
        mat[r0 + dr][c0 + dc] =
          dr === 0 || dr === 6 || dc === 0 || dc === 6 ||
          (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4);
        res[r0 + dr][c0 + dc] = true;
      }
    }
  };
  const mat = Array.from({ length: N }, () => Array(N).fill(false) as boolean[]);
  const res = Array.from({ length: N }, () => Array(N).fill(false) as boolean[]);
  drawFinder(mat, res, 0, 0);
  drawFinder(mat, res, 0, 14);
  drawFinder(mat, res, 14, 0);
  for (let i = 0; i < 8; i++) {
    [7, 13].forEach(row => { if (i < N) { mat[row][i] = false; res[row][i] = true; } });
    [7, 13].forEach(col => { if (i < N) { mat[i][col] = false; res[i][col] = true; } });
  }
  for (let i = 8; i <= 12; i++) {
    mat[6][i] = i % 2 === 0; res[6][i] = true;
    mat[i][6] = i % 2 === 0; res[i][6] = true;
  }
  let h = seed.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0x7fffffff, 7);
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!res[r][c]) {
        h = (h * 1664525 + 1013904223) & 0x7fffffff;
        mat[r][c] = (h >>> 30) === 1;
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx={8} />
      {mat.map((row, r) =>
        row.map((dark, c) =>
          dark ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell + cell * 0.05}
              y={r * cell + cell * 0.05}
              width={cell * 0.9}
              height={cell * 0.9}
              fill="#0A192F"
              rx={cell * 0.15}
            />
          ) : null
        )
      )}
    </svg>
  );
}

const RARITY_CFG = {
  común:      { bg: 'linear-gradient(160deg, #0F2450 0%, #1D4ED8 100%)', border: '#3B82F6', glow: 'rgba(59,130,246,0.5)',   textColor: '#BFDBFE', stars: 1 },
  'poco común': { bg: 'linear-gradient(160deg, #064E3B 0%, #059669 100%)', border: '#10B981', glow: 'rgba(16,185,129,0.45)', textColor: '#D1FAE5', stars: 1 },
  raro:       { bg: 'linear-gradient(160deg, #0C2340 0%, #0369A1 100%)', border: '#06B6D4', glow: 'rgba(6,182,212,0.55)',  textColor: '#A5F3FC', stars: 2 },
  épico:      { bg: 'linear-gradient(160deg, #1E1B4B 0%, #6D28D9 100%)', border: '#8B5CF6', glow: 'rgba(139,92,246,0.6)', textColor: '#DDD6FE', stars: 3 },
  legendario: { bg: 'linear-gradient(160deg, #1C1107 0%, #92400E 100%)', border: '#F59E0B', glow: 'rgba(245,158,11,0.7)', textColor: '#FDE68A', stars: 4 },
} as const;

export function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, logout, isDark } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  if (!currentUser) return null;

  const unlockedMonas = monas.filter(m => m.unlocked);
  const xpForNextLevel = 5000;
  const xpPercent = (currentUser.xp / xpForNextLevel) * 100;
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const campusRank = rankingUsers.findIndex(u => u.isCurrentUser) + 1;
  const topThree = rankingUsers.slice(0, 3);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleShareQR = async () => {
    const url = `${window.location.origin}/profile?user=${currentUser.id}`;
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title: `${currentUser.name} en patrici.a`, url }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(url); } catch {}
    setShowQRModal(false);
    setTimeout(() => alert('¡Enlace copiado al portapapeles!'), 100);
  };

  return (
    <div className="flex flex-col min-h-screen pb-4">
      <div className="w-full md:w-4/6 md:mx-auto px-5 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-600 dark:text-gray-400"
            style={{ background: 'rgba(10,25,47,0.07)' }}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-gray-900 dark:text-white text-2xl font-black">Mi Perfil</h1>
          <img src={patyImg} alt="Paty" className="h-24 w-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 rounded-full bg-white dark:bg-[#112240] shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#172A45] transition-all active:scale-90"
          >
            <Bell size={18} />
            {unreadNotifications > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: GRADIENT }}
              >
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </motion.div>
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowQRModal(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
            style={{ background: GOLD_GRADIENT, boxShadow: '0 4px 12px rgba(217,119,6,0.4)' }}
          >
            <QrCode size={17} />
          </motion.button>
          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#112240] shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#172A45] transition-all active:scale-90"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="w-full md:w-4/6 md:mx-auto">
      <div className="px-5 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden ring-3"
                style={{ boxShadow: `0 0 0 3px transparent, 0 0 0 4px ${PINK}` }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                style={{ background: GRADIENT }}
              >
                {currentUser.level}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-gray-900 dark:text-white font-bold">{currentUser.name}</h2>
                <button onClick={() => navigate('/edit-profile')}>
                  <Edit2 size={14} className="text-gray-400" />
                </button>
              </div>
              <p className="text-xs font-semibold mt-0.5" style={{ color: PINK }}>
                NIVEL {currentUser.level} · {currentUser.faculty.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {currentUser.semester}º Semestre
              </p>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400">{currentUser.xp} XP</span>
                  <span className="text-[10px] text-gray-400">Siguiente: {xpForNextLevel} XP</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-[#172A45] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: GRADIENT }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {currentUser.interests.map(interest => (
              <span
                key={interest}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ color: PINK, background: 'rgba(29,78,216,0.1)' }}
              >
                {interest}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="px-5 mb-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/schedule')}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left shadow-sm"
          style={{ background: 'linear-gradient(135deg, #0A192F 0%, #112240 100%)', border: '1.5px solid rgba(6,182,212,0.25)' }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(6,182,212,0.15)' }}
          >
            <CalendarDays size={20} color={TEAL} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">Mi Horario</p>
            <p className="text-xs mt-0.5" style={{ color: '#4A6080' }}>Gestiona tu disponibilidad semanal</p>
          </div>
          <ChevronRight size={16} style={{ color: TEAL }} />
        </motion.button>
      </div>

      <div className="px-5 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Zap, value: `${currentUser.xp.toLocaleString()} XP`, label: 'Puntos XP', color: ORANGE },
            { icon: Users, value: currentUser.activeParches, label: 'Parches Activos', color: '#3B82F6' },
            { icon: TrendingUp, value: `${currentUser.streak} días`, label: 'Racha Activa', color: '#10B981' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-white dark:bg-[#112240] rounded-2xl p-3 shadow-sm flex flex-col items-center text-center"
            >
              <stat.icon size={16} style={{ color: stat.color }} className="mb-1" />
              <p className="font-bold text-gray-900 dark:text-white text-sm">{stat.value}</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-wide leading-tight mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: GRADIENT }}
          >
            <Star size={22} color="white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Ranking Facultad</p>
            <p className="text-xs text-gray-400">Top estudiante de la semana</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl" style={{ color: ORANGE }}>#{currentUser.rankFaculty}</p>
            <p className="text-xs text-gray-400">de tu facultad</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-4">
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => navigate('/ranking')}
          className="w-full rounded-2xl p-4 text-left relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0A192F 0%, #1A3A5C 40%, #0D2847 100%)',
            border: '1.5px solid rgba(245,158,11,0.3)',
            boxShadow: '0 4px 20px rgba(217,119,6,0.2)',
          }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.1), transparent)', width: '60%' }}
          />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GOLD_GRADIENT }}>
              <Trophy size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-black text-white text-sm">Ranking Campus</p>
              <p className="text-[10px]" style={{ color: GOLD_LIGHT }}>ECI 2025 · Tu posición global</p>
            </div>
            <div className="text-right">
              <p className="font-black text-2xl" style={{ color: GOLD_LIGHT }}>#{campusRank}</p>
              <p className="text-[10px] text-white/40">de {rankingUsers.length} estudiantes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {topThree.map((u) => (
                <img key={u.id} src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover border-2 border-[#0A192F]" />
              ))}
            </div>
            <p className="text-[10px] text-white/50 flex-1">Top 3: {topThree.map(u => u.name.split(' ')[0]).join(', ')}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: GOLD_LIGHT, background: 'rgba(245,158,11,0.15)' }}>
              Ver ranking →
            </span>
          </div>
        </motion.button>
      </div>

      <div className="px-5 mb-4">
        <div
          className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, #F9A8D4 0%, #EC4899 60%, #BE185D 100%)' }}
          onClick={() => navigate('/wellness')}
        >
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
            <Heart size={20} color="#EC4899" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Soporte y Bienestar 24/7</p>
            <p className="text-white/80 text-xs">Estamos aquí para escucharte siempre</p>
          </div>
          <ChevronRight size={18} color="white" />
        </div>
      </div>

      <div className="px-5 mb-4 hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Álbum de Patricias</h3>
            <p className="text-xs text-gray-400">{unlockedMonas.length}/{monas.length} desbloqueadas</p>
          </div>
          <button
            onClick={() => navigate('/monas')}
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: PINK }}
          >
            Ver Álbum <ChevronRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-10 gap-1">
          {monas.slice(0, 10).map((mona) => {
            const cfg = RARITY_CFG[mona.rarity];
            const isLegendary = mona.rarity === 'legendario';
            return (
              <motion.button
                key={mona.id}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/monas')}
                className="relative rounded-lg overflow-hidden flex flex-col items-center"
                style={mona.unlocked
                  ? { background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: `0 2px 8px ${cfg.glow}`, aspectRatio: '3/4' }
                  : { background: 'linear-gradient(160deg, #0A1628 0%, #0D1F3C 100%)', border: '1px solid rgba(255,255,255,0.07)', aspectRatio: '3/4' }}
              >
                {mona.unlocked && isLegendary && (
                  <motion.div className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.8, repeat: Infinity }}
                    style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(252,211,77,0.35) 50%, transparent 70%)' }}
                  />
                )}
                {!mona.unlocked && (
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #3B82F6 0px, #3B82F6 1px, transparent 0px, transparent 50%)', backgroundSize: '6px 6px' }}
                  />
                )}
                {mona.unlocked && (
                  <div className="absolute top-0.5 left-0 right-0 flex justify-center gap-0.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <svg key={i} width="3" height="3" viewBox="0 0 10 10">
                        <polygon points="5,0 6.5,3.5 10,4 7.5,7 8,10 5,8.5 2,10 2.5,7 0,4 3.5,3.5"
                          fill={i < cfg.stars ? cfg.textColor : 'none'} stroke={i < cfg.stars ? cfg.textColor : `${cfg.textColor}30`} strokeWidth="1" />
                      </svg>
                    ))}
                  </div>
                )}
                <div className="flex-1 flex items-center justify-center mt-1.5">
                  {mona.unlocked ? (
                    <EmojiIcon emoji={mona.emoji} size={12} color="white" strokeWidth={2} />
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <EmojiIcon emoji={mona.emoji} size={12} color="white" strokeWidth={2} className="opacity-10" />
                      <div className="absolute w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <Lock size={6} className="text-white/40" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-full text-center px-0.5 py-0.5" style={{ background: mona.unlocked ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.3)' }}>
                  <p className="text-[6px] font-bold truncate leading-tight" style={{ color: mona.unlocked ? cfg.textColor : 'rgba(255,255,255,0.2)' }}>
                    {mona.unlocked ? mona.name : '???'}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/monas')}
          className="w-full mt-3 py-2.5 rounded-xl flex items-center justify-center gap-2 text-white text-xs font-bold"
          style={{ background: GOLD_GRADIENT, boxShadow: '0 4px 16px rgba(217,119,6,0.35)' }}
        >
          <ScanLine size={13} />
          Escanear QR para desbloquear más patricias
        </motion.button>
      </div>

      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 dark:text-white">Hitos Recientes</h3>
          <button
            onClick={() => navigate('/stats')}
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: PINK }}
          >
            Ver Stats <ChevronRight size={12} />
          </button>
        </div>
        <div className="space-y-3">
          {achievements.slice(0, 3).map((achievement, i) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#112240] rounded-2xl p-4 flex items-center gap-3 shadow-sm"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: i === 0 ? GRADIENT : i === 1 ? 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)' : 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)' }}
              >
                <EmojiIcon emoji={achievement.emoji} size={20} color="white" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 dark:text-white text-sm">{achievement.title}</p>
                <p className="text-xs text-gray-400 line-clamp-1">{achievement.description}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">{achievement.date}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="text-xs font-bold" style={{ color: ORANGE }}>+{achievement.xp}</span>
                <p className="text-[10px] text-gray-400">XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm overflow-hidden">
          {[
            { icon: Edit2, label: 'Editar Perfil', action: () => navigate('/edit-profile') },
            { icon: Settings, label: 'Configuración', action: () => navigate('/settings') },
          ].map((item, i) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-[#172A45] transition-colors"
              style={{ borderBottom: i < 1 ? '1px solid #F3F4F6' : 'none' }}
            >
              <item.icon size={18} className="text-gray-400" />
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        {showLogoutConfirm ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-3 text-center">¿Cerrar sesión?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-blue-200 dark:border-blue-800 text-sm text-blue-600 dark:text-blue-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl text-white text-sm font-medium"
                style={{ background: GRADIENT }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-3.5 rounded-2xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/10"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        )}
      </div>
      </div>

      <AnimatePresence>
        {showQRModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setShowQRModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 rounded-3xl overflow-hidden max-h-[88vh] overflow-y-auto"
              style={{ background: '#0A1628', border: '1.5px solid rgba(255,255,255,0.08)' }}
            >
              <div className="h-1 w-full" style={{ background: GOLD_GRADIENT }} />
              <div className="p-6 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-5">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">patrici.a</p>
                    <h3 className="text-white font-black text-lg">Tu QR de Perfil</h3>
                  </div>
                  <button onClick={() => setShowQRModal(false)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <X size={16} className="text-white" />
                  </button>
                </div>
                <div
                  className="p-4 rounded-2xl mb-4"
                  style={{ background: 'white', boxShadow: `0 0 40px rgba(245,158,11,0.3)` }}
                >
                  <MockQRCode seed={currentUser.id} size={190} />
                </div>
                <div className="text-center mb-5">
                  <p className="text-white font-black text-base">{currentUser.name}</p>
                  <p className="text-blue-400 text-xs">{currentUser.faculty} · Niv. {currentUser.level}</p>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <span className="text-[10px] text-white/50">{currentUser.xp.toLocaleString()} XP</span>
                    <span className="text-[10px] text-white/30">·</span>
                    <span className="text-[10px] text-white/50">{unlockedMonas.length} patricias</span>
                    <span className="text-[10px] text-white/30">·</span>
                    <span className="text-[10px] text-white/50">#{campusRank} campus</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleShareQR}
                  className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2"
                  style={{ background: GOLD_GRADIENT, boxShadow: '0 8px 24px rgba(217,119,6,0.4)' }}
                >
                  <Share2 size={16} />
                  Compartir mi perfil
                </motion.button>
                <p className="text-white/30 text-xs mt-3 text-center">Otros estudiantes pueden escanear este código para conectar contigo</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
