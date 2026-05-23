import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Calendar, Heart, Users, TrendingUp, TrendingDown, Activity
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { GRADIENT, PINK, TEAL } from '../types/mockData';
import { format, subWeeks } from 'date-fns';
type AffinityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
export function StudentActivityPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [weekOffset, setWeekOffset] = useState(0);
  const selectedWeek = subWeeks(new Date(), weekOffset);
  const weekLabel = weekOffset === 0 ? 'Semana actual' : `Hace ${weekOffset} semana${weekOffset > 1 ? 's' : ''}`;
  const parchesAsistidos = weekOffset === 0 ? 4 : 2;
  const eventosRSVP = weekOffset === 0 ? 2 : 1;
  const conexionesActivas = weekOffset === 0 ? 8 : 5;
  const conexionesNuevasSemanaActual = 3;
  const conexionesNuevasSemanaAnterior = 2;
  const crecimiento = conexionesNuevasSemanaActual - conexionesNuevasSemanaAnterior;
  const affinityLevel: AffinityLevel = 'HIGH';
  const affinityData = {
    LOW: { label: 'Baja', color: '#9CA3AF', desc: 'Aumenta tu participación para mejorar tu afinidad social' },
    MEDIUM: { label: 'Media', color: '#3B82F6', desc: 'Estás en buen camino, sigue conectando con otros estudiantes' },
    HIGH: { label: 'Alta', color: '#10B981', desc: 'Excelente nivel de integración social en el campus' },
    VERY_HIGH: { label: 'Muy Alta', color: '#F59E0B', desc: '¡Eres un líder social del campus!' },
  };
  const currentAffinity = affinityData[affinityLevel];
  const hasActivity = parchesAsistidos > 0 || eventosRSVP > 0 || conexionesActivas > 0;
  return (
    <div className="min-h-screen relative" style={{ background: 'transparent' }}>
      <DoodleBackground isDark={isDark} opacity={1} />
      {}
      <header className="sticky top-0 z-50 px-4 py-3" style={isDark
        ? { background: 'rgba(3,13,31,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(30,58,95,0.5)', boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }
        : { background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(10,25,47,0.06)', boxShadow: '0 2px 20px rgba(10,25,47,0.07)' }
      }>
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={isDark ? { background: 'rgba(23,42,69,0.8)', color: '#9CA3AF' } : { background: 'rgba(253,252,248,0.80)', color: '#4A5568', boxShadow: '0 1px 8px rgba(10,25,47,0.09)', border: '1px solid rgba(10,25,47,0.07)' }}>
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 ml-3">
            <h1 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Actividad Social</h1>
            <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Tus indicadores semanales</p>
          </div>
        </div>
      </header>
      {}
      <div className="p-4 max-w-3xl mx-auto space-y-4 relative z-10">
        {}
        <div className="p-4 rounded-3xl" style={isDark
          ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' }
          : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }
        }>
          <label className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
            <Calendar size={16} />
            Semana a consultar
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((offset) => {
              const selected = weekOffset === offset;
              const label = offset === 0 ? 'Actual' : `-${offset}`;
              return (
                <button
                  key={offset}
                  onClick={() => setWeekOffset(offset)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap"
                  style={selected
                    ? { background: GRADIENT, color: '#FFF' }
                    : isDark
                      ? { background: '#112240', border: '1px solid #1E3A5F', color: '#9CA3AF' }
                      : { background: '#EDE9E0', border: '1px solid transparent', color: '#4A5568' }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-xs mt-2" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>{weekLabel}</p>
        </div>
        {}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(232,36,90,0.1)' }}>
              <Activity size={20} style={{ color: PINK }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Participación Semanal</h3>
              <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>{weekLabel}</p>
            </div>
          </div>
          {hasActivity ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: isDark ? '#112240' : '#EDE9E0' }}>
                <div className="flex items-center gap-3">
                  <Heart size={16} style={{ color: PINK }} />
                  <span className="text-sm font-medium" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Parches asistidos</span>
                </div>
                <span className="text-lg font-bold" style={{ color: PINK }}>{parchesAsistidos}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: isDark ? '#112240' : '#EDE9E0' }}>
                <div className="flex items-center gap-3">
                  <Calendar size={16} style={{ color: '#10B981' }} />
                  <span className="text-sm font-medium" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Eventos con RSVP</span>
                </div>
                <span className="text-lg font-bold" style={{ color: '#10B981' }}>{eventosRSVP}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: isDark ? '#112240' : '#EDE9E0' }}>
                <div className="flex items-center gap-3">
                  <Users size={16} style={{ color: TEAL }} />
                  <span className="text-sm font-medium" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Conexiones activas</span>
                </div>
                <span className="text-lg font-bold" style={{ color: TEAL }}>{conexionesActivas}</span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <Activity size={32} className="mx-auto mb-3 opacity-30" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }} />
              <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Aún no tienes actividad esta semana. ¡Únete a un parche!</p>
            </div>
          )}
        </motion.div>
        {}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Users size={20} style={{ color: '#3B82F6' }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Crecimiento de Red</h3>
              <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Comparativa semanal</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: isDark ? '#112240' : '#EDE9E0' }}>
            <div>
              <p className="text-sm mb-1" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Conexiones nuevas</p>
              <p className="text-2xl font-black" style={{ color: '#3B82F6' }}>{conexionesNuevasSemanaActual}</p>
            </div>
            <div className="flex items-center gap-2">
              {crecimiento > 0 ? (
                <>
                  <TrendingUp size={20} style={{ color: '#10B981' }} />
                  <span className="text-lg font-bold" style={{ color: '#10B981' }}>+{crecimiento}</span>
                </>
              ) : crecimiento < 0 ? (
                <>
                  <TrendingDown size={20} style={{ color: '#EF4444' }} />
                  <span className="text-lg font-bold" style={{ color: '#EF4444' }}>{crecimiento}</span>
                </>
              ) : (
                <span className="text-sm font-medium" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Sin cambios</span>
              )}
            </div>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>vs semana anterior</p>
        </motion.div>
        {}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${currentAffinity.color}15` }}>
              <Activity size={20} style={{ color: currentAffinity.color }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Afinidad Social</h3>
              <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Nivel calculado</p>
            </div>
          </div>
          <div className="text-center py-4">
            <div className="text-4xl font-black mb-2" style={{ color: currentAffinity.color }}>{currentAffinity.label}</div>
            <div className="w-full h-3 rounded-full overflow-hidden mb-3" style={{ background: isDark ? '#112240' : '#E5E2D8' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: (affinityLevel as string) === 'LOW' ? '25%' : (affinityLevel as string) === 'MEDIUM' ? '50%' : (affinityLevel as string) === 'HIGH' ? '75%' : '100%' }}
                transition={{ duration: 1 }}
                className="h-full rounded-full"
                style={{ background: currentAffinity.color }}
              />
            </div>
            <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>{currentAffinity.desc}</p>
          </div>
          <div className="mt-4 p-3 rounded-xl" style={{ background: isDark ? '#112240' : '#EDE9E0' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Cálculo de afinidad:</p>
            <div className="space-y-1 text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
              <div className="flex justify-between">
                <span>Intereses compartidos</span>
                <span className="font-bold">40%</span>
              </div>
              <div className="flex justify-between">
                <span>Parches en común</span>
                <span className="font-bold">35%</span>
              </div>
              <div className="flex justify-between">
                <span>Conexiones mutuas</span>
                <span className="font-bold">25%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}