import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Calendar, Users, Activity, TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { GRADIENT, TEAL } from '../types/mockData';
import { format, subDays } from 'date-fns';
type TipoEstadistica = 'EVENTOS' | 'PARTICIPACION' | 'ACTIVIDAD_SOCIAL' | 'TODAS';
type TendenciaSemanal = 'SUBIENDO' | 'ESTABLE' | 'BAJANDO';
export function WellnessStatsPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 90), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tipoEstadistica, setTipoEstadistica] = useState<TipoEstadistica>('TODAS');
  const eventosCreados = 24;
  const eventosActivos = 18;
  const eventosCancelados = 3;
  const eventosFinalizados = 3;
  const estudiantesActivos = 2847;
  const indiceActividadSocial = 76; // 0-100
  const participacionPorFacultad = [
    { facultad: 'Ingeniería de Sistemas', participacion: 92 },
    { facultad: 'Ingeniería Civil', participacion: 78 },
    { facultad: 'Ingeniería Industrial', participacion: 85 },
    { facultad: 'Administración', participacion: 65 },
    { facultad: 'Matemáticas', participacion: 58 },
  ];
  const tendenciaSemanal: TendenciaSemanal = 'SUBIENDO';
  const tendenciaData = {
    SUBIENDO: { label: 'Subiendo', color: '#10B981', icon: TrendingUp },
    ESTABLE: { label: 'Estable', color: '#3B82F6', icon: Minus },
    BAJANDO: { label: 'Bajando', color: '#EF4444', icon: TrendingDown },
  };
  const currentTendencia = tendenciaData[tendenciaSemanal];
  const TendenciaIcon = currentTendencia.icon;
  const tiposEstadistica: { id: TipoEstadistica; label: string }[] = [
    { id: 'EVENTOS', label: 'Eventos' },
    { id: 'PARTICIPACION', label: 'Participación' },
    { id: 'ACTIVIDAD_SOCIAL', label: 'Actividad Social' },
    { id: 'TODAS', label: 'Todas' },
  ];
  const showEventos = tipoEstadistica === 'EVENTOS' || tipoEstadistica === 'TODAS';
  const showParticipacion = tipoEstadistica === 'PARTICIPACION' || tipoEstadistica === 'TODAS';
  const showActividadSocial = tipoEstadistica === 'ACTIVIDAD_SOCIAL' || tipoEstadistica === 'TODAS';
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
            <h1 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Estadísticas Institucionales</h1>
            <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Panel de Bienestar Universitario</p>
          </div>
        </div>
      </header>
      {}
      <div className="p-4 max-w-3xl mx-auto space-y-4 relative z-10">
        {}
        <div className="p-5 rounded-3xl" style={isDark
          ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' }
          : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }
        }>
          <label className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
            <Calendar size={16} />
            Rango de fechas (opcional, default semestre completo)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Desde</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm" style={isDark ? { background: '#112240', border: '1px solid #1E3A5F', color: '#F9FAFB' } : { background: '#EDE9E0', border: '1px solid transparent', color: '#111827' }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Hasta</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm" style={isDark ? { background: '#112240', border: '1px solid #1E3A5F', color: '#F9FAFB' } : { background: '#EDE9E0', border: '1px solid transparent', color: '#111827' }} />
            </div>
          </div>
        </div>
        {}
        <div className="p-5 rounded-3xl" style={isDark
          ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' }
          : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }
        }>
          <label className="text-sm font-semibold mb-3 block" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Tipo de estadística</label>
          <div className="grid grid-cols-2 gap-2">
            {tiposEstadistica.map((tipo) => {
              const selected = tipoEstadistica === tipo.id;
              return (
                <button
                  key={tipo.id}
                  onClick={() => setTipoEstadistica(tipo.id)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={selected
                    ? { background: GRADIENT, color: '#FFF' }
                    : isDark
                      ? { background: '#112240', border: '1px solid #1E3A5F', color: '#9CA3AF' }
                      : { background: '#EDE9E0', border: '1px solid transparent', color: '#4A5568' }
                  }
                >
                  {tipo.label}
                </button>
              );
            })}
          </div>
        </div>
        {}
        {showEventos && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <Calendar size={20} style={{ color: '#3B82F6' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Eventos Creados</h3>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Del período seleccionado</p>
              </div>
            </div>
            <div className="text-center py-4 mb-4">
              <div className="text-5xl font-black mb-2" style={{ color: '#3B82F6' }}>{eventosCreados}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl text-center" style={{ background: isDark ? '#112240' : '#EDE9E0' }}>
                <p className="text-lg font-bold" style={{ color: '#10B981' }}>{eventosActivos}</p>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Activos</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: isDark ? '#112240' : '#EDE9E0' }}>
                <p className="text-lg font-bold" style={{ color: '#EF4444' }}>{eventosCancelados}</p>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Cancelados</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: isDark ? '#112240' : '#EDE9E0' }}>
                <p className="text-lg font-bold" style={{ color: '#9CA3AF' }}>{eventosFinalizados}</p>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Finalizados</p>
              </div>
            </div>
          </motion.div>
        )}
        {}
        {showParticipacion && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                <Users size={20} style={{ color: '#10B981' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Participación Estudiantil</h3>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Estudiantes activos en el período</p>
              </div>
            </div>
            <div className="text-center py-4">
              <div className="text-5xl font-black mb-2" style={{ color: '#10B981' }}>{estudiantesActivos.toLocaleString()}</div>
              <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Estudiantes con actividad registrada</p>
            </div>
          </motion.div>
        )}
        {}
        {showActividadSocial && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                <Activity size={20} style={{ color: '#8B5CF6' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Índice de Actividad Social</h3>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Indicador compuesto</p>
              </div>
            </div>
            <div className="text-center py-4 mb-4">
              <div className="text-5xl font-black mb-3" style={{ color: '#8B5CF6' }}>{indiceActividadSocial}%</div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: isDark ? '#112240' : '#E5E2D8' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${indiceActividadSocial}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }} />
              </div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: isDark ? '#112240' : '#EDE9E0' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Composición del índice:</p>
              <div className="space-y-1 text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                <div className="flex justify-between">
                  <span>Conexiones</span>
                  <span className="font-bold">35%</span>
                </div>
                <div className="flex justify-between">
                  <span>Parches</span>
                  <span className="font-bold">40%</span>
                </div>
                <div className="flex justify-between">
                  <span>Eventos</span>
                  <span className="font-bold">25%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {}
        {showParticipacion && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <h3 className="font-bold mb-4" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Participación por Facultad</h3>
            <p className="text-xs mb-4" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Identifica facultades con baja integración social</p>
            <div className="space-y-3">
              {participacionPorFacultad.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>{item.facultad}</span>
                    <span className="text-sm font-bold" style={{ color: item.participacion >= 75 ? '#10B981' : item.participacion >= 50 ? '#F59E0B' : '#EF4444' }}>{item.participacion}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? '#112240' : '#E5E2D8' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.participacion}%` }}
                      transition={{ delay: idx * 0.1 + 0.4, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ background: item.participacion >= 75 ? '#10B981' : item.participacion >= 50 ? '#F59E0B' : '#EF4444' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {}
        {showActividadSocial && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${currentTendencia.color}15` }}>
                <TendenciaIcon size={20} style={{ color: currentTendencia.color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Tendencia Semanal</h3>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Análisis de comportamiento</p>
              </div>
            </div>
            <div className="text-center py-4">
              <div className="text-3xl font-black mb-1" style={{ color: currentTendencia.color }}>{currentTendencia.label}</div>
              <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                {(tendenciaSemanal as string) === 'SUBIENDO' && 'La actividad estudiantil está en aumento'}
                {(tendenciaSemanal as string) === 'ESTABLE' && 'La actividad se mantiene estable'}
                {(tendenciaSemanal as string) === 'BAJANDO' && 'Se detecta una disminución en la actividad'}
              </p>
            </div>
          </motion.div>
        )}
        {}
        <div className="p-4 rounded-2xl text-center" style={{ background: isDark ? 'rgba(59,130,246,0.05)' : 'rgba(59,130,246,0.05)', border: isDark ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(59,130,246,0.15)' }}>
          <p className="text-xs font-medium" style={{ color: '#3B82F6' }}>Datos anonimizados · No se expone información personal de estudiantes</p>
        </div>
      </div>
    </div>
  );
}