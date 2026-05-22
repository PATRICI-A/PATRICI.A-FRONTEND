import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Users, Calendar, MessageCircle, Zap, Star, Award } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { useApp } from '../store/AppContext';
import { GRADIENT, PINK, ORANGE } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
const activityData = [
  { day: 'L', value: 3 },
  { day: 'M', value: 5 },
  { day: 'X', value: 2 },
  { day: 'J', value: 8 },
  { day: 'V', value: 6 },
  { day: 'S', value: 9 },
  { day: 'D', value: 4 },
];
const weeklyGrowth = [
  { week: 'S1', parches: 2, conexiones: 5 },
  { week: 'S2', parches: 4, conexiones: 8 },
  { week: 'S3', parches: 3, conexiones: 12 },
  { week: 'S4', parches: 6, conexiones: 15 },
  { week: 'S5', parches: 8, conexiones: 20 },
  { week: 'S6', parches: 7, conexiones: 25 },
];
const radarData = [
  { subject: 'Social', value: 85 },
  { subject: 'Académico', value: 70 },
  { subject: 'Deportivo', value: 55 },
  { subject: 'Cultural', value: 90 },
  { subject: 'Bienestar', value: 75 },
  { subject: 'Tecnología', value: 95 },
];
const categoryData = [
  { name: 'Tecnología', count: 5, color: '#3B82F6' },
  { name: 'Música', count: 4, color: PINK },
  { name: 'Estudio', count: 3, color: '#10B981' },
  { name: 'Social', count: 3, color: ORANGE },
  { name: 'Deporte', count: 2, color: '#8B5CF6' },
];
export function StatsPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [period, setPeriod] = useState<'semana' | 'mes' | 'semestre'>('mes');
  if (!currentUser) return null;
  return (
    <div className="min-h-screen pb-8">
      {}
      <div className="bg-white dark:bg-[#151729] px-4 py-4 flex items-center gap-3 shadow-sm sticky top-[57px] z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#1E2038] text-gray-500 dark:text-gray-400"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-gray-900 dark:text-white text-base">🏆 Estadísticas</h1>
          <p className="text-xs text-gray-400">Tu impacto en la comunidad</p>
        </div>
      </div>
      <div className="px-4 pt-5">
        {}
        <div className="flex bg-white dark:bg-[#151729] rounded-xl p-1 mb-5 shadow-sm">
          {(['semana', 'mes', 'semestre'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all"
              style={period === p ? { background: GRADIENT, color: 'white' } : { color: '#9CA3AF' }}
            >
              {p}
            </button>
          ))}
        </div>
        {}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: Users, value: '25', label: 'Nuevas conexiones', delta: '+5', positive: true, color: PINK },
            { icon: Calendar, value: '8', label: 'Parches activos', delta: '+2', positive: true, color: '#3B82F6' },
            { icon: MessageCircle, value: '142', label: 'Mensajes enviados', delta: '+18%', positive: true, color: '#10B981' },
            { icon: Star, value: '#4', label: 'Ranking facultad', delta: '↑2', positive: true, color: ORANGE },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-[#151729] rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <stat.icon size={18} style={{ color: stat.color }} />
                <span className="text-[11px] font-bold text-green-500">{stat.delta}</span>
              </div>
              <p className="font-bold text-xl text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
        {}
        <div className="bg-white dark:bg-[#151729] rounded-2xl p-4 mb-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Actividad esta semana</h3>
          <div className="flex items-end gap-2 h-20">
            {activityData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${(d.value / 9) * 100}%`,
                    background: i === 5 ? GRADIENT : '#E5E7EB',
                    minHeight: '4px',
                  }}
                />
                <span className="text-[10px] text-gray-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
        {}
        <div className="bg-white dark:bg-[#151729] rounded-2xl p-4 mb-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Crecimiento de red</h3>
          <p className="text-xs text-gray-400 mb-4">Parches y conexiones por semana</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={weeklyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="conexiones" stroke={PINK} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="parches" stroke={ORANGE} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full" style={{ background: PINK }} />
              <span className="text-[11px] text-gray-400">Conexiones</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full" style={{ background: ORANGE }} />
              <span className="text-[11px] text-gray-400">Parches</span>
            </div>
          </div>
        </div>
        {}
        <div className="bg-white dark:bg-[#151729] rounded-2xl p-4 mb-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Perfil Social</h3>
          <p className="text-xs text-gray-400 mb-2">Tus dimensiones universitarias</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#F3F4F6" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Radar name="Perfil" dataKey="value" stroke={PINK} fill={PINK} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        {}
        <div className="bg-white dark:bg-[#151729] rounded-2xl p-4 mb-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Parches por categoría</h3>
          <div className="space-y-3">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">{cat.name}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-[#1E2038] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(cat.count / 5) * 100}%`, background: cat.color }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 w-4 flex-shrink-0">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
        {}
        <div className="bg-white dark:bg-[#151729] rounded-2xl p-4 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Nivel {currentUser.level}</h3>
              <p className="text-xs text-gray-400">{currentUser.xp.toLocaleString()} / 5,000 XP</p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md"
              style={{ background: GRADIENT }}
            >
              {currentUser.level}
            </div>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-[#1E2038] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentUser.xp / 5000) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: GRADIENT }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-gray-400">
            <span>Nivel {currentUser.level}</span>
            <span>{5000 - currentUser.xp} XP para nivel {currentUser.level + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
}