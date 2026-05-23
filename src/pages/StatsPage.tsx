import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { TrendingUp, Users, Calendar, MessageCircle, Star, Zap, Award, ChevronUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '../store/AppContext';
import { GRADIENT, GOLD_GRADIENT, PINK, ORANGE, TEAL } from '../types/mockData';
import { usePageHeader } from '../store/PageHeaderContext';
import { getStudentDashboard, getSocialIndicators, getInteractionAnalytics } from '../services/analytics.service';
import type { StudentDashboardResponse, SocialIndicatorsResponse, InteractionAnalyticsResponse } from '../services/analytics.service';

const DATA_BY_PERIOD = {
  semana: {
    stats: [
      { icon: Users, value: '4', label: 'Conexiones', delta: '+1', color: PINK, bg: 'rgba(236,72,153,0.12)' },
      { icon: Calendar, value: '2', label: 'Parches activos', delta: '+1', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
      { icon: MessageCircle, value: '31', label: 'Mensajes', delta: '+8%', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
      { icon: Star, value: '#6', label: 'Ranking facultad', delta: '↑1', color: ORANGE, bg: 'rgba(251,146,60,0.12)' },
    ],
    activity: [
      { day: 'L', value: 3 }, { day: 'M', value: 5 }, { day: 'X', value: 2 },
      { day: 'J', value: 8 }, { day: 'V', value: 6 }, { day: 'S', value: 9 }, { day: 'D', value: 4 },
    ],
    growth: [
      { label: 'L', parches: 0, conexiones: 1 }, { label: 'M', parches: 1, conexiones: 0 },
      { label: 'X', parches: 0, conexiones: 1 }, { label: 'J', parches: 1, conexiones: 2 },
      { label: 'V', parches: 0, conexiones: 0 }, { label: 'S', parches: 2, conexiones: 1 },
      { label: 'D', parches: 1, conexiones: 0 },
    ],
    radar: [
      { subject: 'Social', value: 60 }, { subject: 'Académico', value: 50 },
      { subject: 'Deportivo', value: 30 }, { subject: 'Cultural', value: 70 },
      { subject: 'Bienestar', value: 55 }, { subject: 'Tecnología', value: 80 },
    ],
    categories: [
      { name: 'Tecnología', count: 2, color: '#3B82F6' }, { name: 'Música', count: 1, color: PINK },
      { name: 'Estudio', count: 1, color: '#10B981' }, { name: 'Social', count: 2, color: ORANGE },
      { name: 'Deporte', count: 0, color: '#8B5CF6' },
    ],
  },
  mes: {
    stats: [
      { icon: Users, value: '25', label: 'Conexiones', delta: '+5', color: PINK, bg: 'rgba(236,72,153,0.12)' },
      { icon: Calendar, value: '8', label: 'Parches activos', delta: '+2', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
      { icon: MessageCircle, value: '142', label: 'Mensajes', delta: '+18%', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
      { icon: Star, value: '#4', label: 'Ranking facultad', delta: '↑2', color: ORANGE, bg: 'rgba(251,146,60,0.12)' },
    ],
    activity: [
      { day: 'S1', value: 12 }, { day: 'S2', value: 18 }, { day: 'S3', value: 9 }, { day: 'S4', value: 22 },
    ],
    growth: [
      { label: 'S1', parches: 2, conexiones: 5 }, { label: 'S2', parches: 4, conexiones: 8 },
      { label: 'S3', parches: 3, conexiones: 12 }, { label: 'S4', parches: 6, conexiones: 15 },
    ],
    radar: [
      { subject: 'Social', value: 85 }, { subject: 'Académico', value: 70 },
      { subject: 'Deportivo', value: 55 }, { subject: 'Cultural', value: 90 },
      { subject: 'Bienestar', value: 75 }, { subject: 'Tecnología', value: 95 },
    ],
    categories: [
      { name: 'Tecnología', count: 5, color: '#3B82F6' }, { name: 'Música', count: 4, color: PINK },
      { name: 'Estudio', count: 3, color: '#10B981' }, { name: 'Social', count: 3, color: ORANGE },
      { name: 'Deporte', count: 2, color: '#8B5CF6' },
    ],
  },
  semestre: {
    stats: [
      { icon: Users, value: '87', label: 'Conexiones', delta: '+22', color: PINK, bg: 'rgba(236,72,153,0.12)' },
      { icon: Calendar, value: '34', label: 'Parches activos', delta: '+9', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
      { icon: MessageCircle, value: '620', label: 'Mensajes', delta: '+74%', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
      { icon: Star, value: '#2', label: 'Ranking facultad', delta: '↑4', color: ORANGE, bg: 'rgba(251,146,60,0.12)' },
    ],
    activity: [
      { day: 'Feb', value: 8 }, { day: 'Mar', value: 15 }, { day: 'Abr', value: 22 },
      { day: 'May', value: 31 }, { day: 'Jun', value: 28 }, { day: 'Jul', value: 40 },
    ],
    growth: [
      { label: 'Feb', parches: 3, conexiones: 10 }, { label: 'Mar', parches: 6, conexiones: 18 },
      { label: 'Abr', parches: 8, conexiones: 30 }, { label: 'May', parches: 12, conexiones: 45 },
      { label: 'Jun', parches: 10, conexiones: 55 }, { label: 'Jul', parches: 15, conexiones: 70 },
    ],
    radar: [
      { subject: 'Social', value: 95 }, { subject: 'Académico', value: 88 },
      { subject: 'Deportivo', value: 72 }, { subject: 'Cultural', value: 96 },
      { subject: 'Bienestar', value: 84 }, { subject: 'Tecnología', value: 100 },
    ],
    categories: [
      { name: 'Tecnología', count: 14, color: '#3B82F6' }, { name: 'Música', count: 11, color: PINK },
      { name: 'Estudio', count: 9, color: '#10B981' }, { name: 'Social', count: 8, color: ORANGE },
      { name: 'Deporte', count: 5, color: '#8B5CF6' },
    ],
  },
} as const;

const PERIODS = ['semana', 'mes', 'semestre'] as const;

const WEEK_RANGE: Record<'semana' | 'mes' | 'semestre', number> = { semana: 0, mes: 4, semestre: 16 };

const DAY_LABELS: Record<string, string> = {
  MONDAY: 'L', TUESDAY: 'M', WEDNESDAY: 'X', THURSDAY: 'J',
  FRIDAY: 'V', SATURDAY: 'S', SUNDAY: 'D',
};

export function StatsPage() {
  const navigate = useNavigate();
  const { currentUser, isDark } = useApp();
  const { setHeader } = usePageHeader();
  const [period, setPeriod] = useState<'semana' | 'mes' | 'semestre'>('mes');

  const [dashboard, setDashboard] = useState<StudentDashboardResponse | null>(null);
  const [social, setSocial] = useState<SocialIndicatorsResponse | null>(null);
  const [interactions, setInteractions] = useState<InteractionAnalyticsResponse | null>(null);

  useEffect(() => {
    setHeader({ title: '🏆 Estadísticas', subtitle: 'Tu impacto en la comunidad', showBack: true });
    return () => setHeader(null);
  }, [setHeader]);

  useEffect(() => {
    getStudentDashboard().then(setDashboard).catch(() => {});
    getInteractionAnalytics().then(setInteractions).catch(() => {});
  }, []);

  useEffect(() => {
    getSocialIndicators(WEEK_RANGE[period]).then(setSocial).catch(() => {});
  }, [period]);

  if (!currentUser) return null;

  // Datos reales si están disponibles, de lo contrario mock
  const d = DATA_BY_PERIOD[period];

  const activityData = dashboard?.weeklyActivity
    ? Object.entries(dashboard.weeklyActivity).map(([day, value]) => ({ day: DAY_LABELS[day] ?? day, value: value ?? 0 }))
    : d.activity;

  const categoryData = interactions?.interactionSummary
    ? Object.entries(interactions.interactionSummary).map(([name, count], i) => ({
        name, count, color: ['#3B82F6', PINK, '#10B981', ORANGE, '#8B5CF6'][i % 5],
      }))
    : d.categories;

  const radarData = social?.socialAffinity
    ? Object.entries(social.socialAffinity).map(([subject, value]) => ({ subject, value: Math.round(value * 100) }))
    : d.radar;

  const achievements = dashboard?.recentAchievements?.length
    ? dashboard.recentAchievements.map(a => ({
        emoji: '🏆', title: a.name, desc: a.description, xp: a.xpReward, color: ORANGE,
      }))
    : [
        { emoji: '🏆', title: 'Primer Parche', desc: 'Creaste tu primer parche', xp: 50, color: ORANGE },
        { emoji: '🤝', title: 'Networker', desc: 'Conectaste con 10 compañeros', xp: 75, color: PINK },
        { emoji: '⭐', title: 'Explorador', desc: 'Visitaste 5 zonas del campus', xp: 60, color: TEAL },
      ];

  const statsGrid = [
    { icon: Users,         value: String(dashboard?.patchesAttended ?? d.stats[1].value), label: 'Parches asistidos', delta: '', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
    { icon: Calendar,      value: String(dashboard?.achievementsEarned ?? d.stats[0].value), label: 'Logros obtenidos', delta: '', color: PINK, bg: 'rgba(236,72,153,0.12)' },
    { icon: MessageCircle, value: String(interactions?.totalInteractions ?? d.stats[2].value), label: 'Interacciones', delta: '', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    { icon: Star,          value: dashboard?.participationLevel ?? d.stats[3].value, label: 'Nivel de participación', delta: '', color: ORANGE, bg: 'rgba(251,146,60,0.12)' },
  ];

  const maxActivity = Math.max(...activityData.map(a => a.value), 1);
  const maxCategory = Math.max(...categoryData.map(c => c.count), 1);

  const cardBg = isDark
    ? { background: '#112240', border: '1px solid rgba(30,58,95,0.4)', boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }
    : { background: 'rgba(253,252,248,0.95)', border: '1px solid rgba(10,25,47,0.07)', boxShadow: '0 4px 24px rgba(10,25,47,0.08)' };

  const xpPercent = Math.min((currentUser.xp / 5000) * 100, 100);

  return (
    <div className="w-full md:w-4/6 md:mx-auto min-h-screen pb-10">
      <div className="px-4 pt-6 space-y-4">

          {/* Period selector */}
          <div
            className="flex rounded-2xl p-1"
            style={isDark
              ? { background: 'rgba(17,34,64,0.8)', border: '1px solid rgba(30,58,95,0.4)' }
              : { background: 'rgba(247,245,240,0.95)', border: '1px solid rgba(10,25,47,0.08)' }}
          >
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all"
                style={period === p
                  ? { background: GRADIENT, color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }
                  : { color: isDark ? '#4A6080' : '#9CA3AF' }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {statsGrid.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-4"
                style={cardBg}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                    <stat.icon size={18} style={{ color: stat.color }} />
                  </div>
                  <div className="flex items-center gap-0.5 text-emerald-400 text-xs font-bold">
                    <ChevronUp size={12} />
                    {stat.delta}
                  </div>
                </div>
                <p className="font-black text-2xl text-gray-900 dark:text-white leading-none mb-1">{stat.value}</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* XP / Level card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="rounded-2xl p-5"
            style={cardBg}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: isDark ? '#4A6080' : '#9CA3AF' }}>Nivel actual</p>
                <p className="font-black text-3xl text-gray-900 dark:text-white leading-none">Nivel {currentUser.level}</p>
                <p className="text-xs text-gray-400 mt-1">{currentUser.xp.toLocaleString()} / 5,000 XP</p>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg"
                style={{ background: GOLD_GRADIENT }}
              >
                {currentUser.level}
              </div>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(30,58,95,0.5)' : 'rgba(10,25,47,0.08)' }}>
              <motion.div
                key={xpPercent}
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: GOLD_GRADIENT }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[11px] text-gray-400">Nivel {currentUser.level}</span>
              <span className="text-[11px] font-bold" style={{ color: isDark ? '#FBBF24' : '#D97706' }}>
                {5000 - currentUser.xp} XP para subir
              </span>
            </div>
          </motion.div>

          {/* Activity bars */}
          <motion.div
            key={`activity-${period}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-5"
            style={cardBg}
          >
            <p className="font-bold text-gray-900 dark:text-white mb-1">Actividad</p>
            <p className="text-xs text-gray-400 mb-4">Interacciones por {period === 'semana' ? 'día' : period === 'mes' ? 'semana' : 'mes'}</p>
            <div className="flex items-end gap-2 h-24">
              {activityData.map((item, i) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.div
                    className="w-full rounded-lg"
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.value / maxActivity) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                    style={{
                      background: i === d.activity.length - 2 ? GRADIENT : isDark ? 'rgba(30,58,95,0.6)' : '#E5E7EB',
                      minHeight: '4px',
                    }}
                  />
                  <span className="text-[10px] text-gray-400 font-medium">{item.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Line chart */}
          <motion.div
            key={`growth-${period}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-5"
            style={cardBg}
          >
            <p className="font-bold text-gray-900 dark:text-white mb-1">Crecimiento de red</p>
            <p className="text-xs text-gray-400 mb-4">Parches y conexiones</p>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={d.growth /* social indicators growth — mismo shape */}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(30,58,95,0.4)' : '#F3F4F6'} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#112240' : 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    fontSize: '12px',
                    color: isDark ? 'white' : '#111',
                  }}
                />
                <Line type="monotone" dataKey="conexiones" stroke={PINK} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="parches" stroke={ORANGE} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-5 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-1.5 rounded-full" style={{ background: PINK }} />
                <span className="text-[11px] text-gray-400">Conexiones</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-1.5 rounded-full" style={{ background: ORANGE }} />
                <span className="text-[11px] text-gray-400">Parches</span>
              </div>
            </div>
          </motion.div>

          {/* Radar chart */}
          <motion.div
            key={`radar-${period}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-5"
            style={cardBg}
          >
            <p className="font-bold text-gray-900 dark:text-white mb-1">Perfil Social</p>
            <p className="text-xs text-gray-400 mb-2">Tus dimensiones universitarias</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={[...radarData]}>
                <PolarGrid stroke={isDark ? 'rgba(30,58,95,0.5)' : '#F3F4F6'} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: isDark ? '#4A6080' : '#9CA3AF' }} />
                <Radar name="Perfil" dataKey="value" stroke={PINK} fill={PINK} fillOpacity={0.18} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category bars */}
          <motion.div
            key={`cats-${period}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-5"
            style={cardBg}
          >
            <p className="font-bold text-gray-900 dark:text-white mb-4">Parches por categoría</p>
            <div className="space-y-3.5">
              {categoryData.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-24 flex-shrink-0">{cat.name}</span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(30,58,95,0.5)' : '#F3F4F6' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.count / maxCategory) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                      style={{ background: cat.color }}
                    />
                  </div>
                  <span className="text-xs font-black text-gray-600 dark:text-gray-300 w-5 text-right flex-shrink-0">{cat.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.63 }}
            className="rounded-2xl p-5"
            style={cardBg}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award size={18} style={{ color: '#FBBF24' }} />
              <p className="font-bold text-gray-900 dark:text-white">Logros recientes</p>
            </div>
            <div className="space-y-3">
              {achievements.map((a, i) => (
                <div key={a.title} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: isDark ? 'rgba(30,58,95,0.6)' : 'rgba(10,25,47,0.06)' }}
                  >
                    {a.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{a.title}</p>
                    <p className="text-xs text-gray-400 leading-tight">{a.desc}</p>
                  </div>
                  <span className="text-sm font-black flex-shrink-0" style={{ color: a.color }}>+{a.xp} XP</span>
                </div>
              ))}
            </div>
          </motion.div>

      </div>
    </div>
  );
}
