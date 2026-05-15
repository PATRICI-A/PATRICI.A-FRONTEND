import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, MapPin, Calendar as CalendarIcon, Activity, Heart, Users
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { GRADIENT, PINK, TEAL } from '../types/mockData';
export function StudentInteractionPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const zonaMasActiva = 'Biblioteca Central';
  const diaMasActivo = 'Miércoles';
  const totalInteracciones = 23;
  const interaccionesPorCategoria = [
    { categoria: 'Parches', valor: 8, color: PINK },
    { categoria: 'Conexiones', valor: 10, color: TEAL },
    { categoria: 'Eventos', valor: 5, color: '#10B981' },
  ];
  const hasInteractions = totalInteracciones > 0;
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
            <h1 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Analítica de Interacción</h1>
            <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Detalles de tu actividad</p>
          </div>
        </div>
      </header>
      {}
      <div className="p-4 max-w-3xl mx-auto space-y-4 relative z-10">
        {hasInteractions ? (
          <>
            {}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                  <MapPin size={20} style={{ color: '#8B5CF6' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Zona Más Activa</h3>
                  <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Donde tienes más actividad</p>
                </div>
              </div>
              <div className="text-center py-4">
                <div className="text-3xl font-black mb-1" style={{ color: '#8B5CF6' }}>{zonaMasActiva}</div>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Esta es tu zona favorita del campus</p>
              </div>
            </motion.div>
            {}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <CalendarIcon size={20} style={{ color: '#3B82F6' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Día Más Activo</h3>
                  <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Cuando más participas</p>
                </div>
              </div>
              <div className="text-center py-4">
                <div className="text-3xl font-black mb-1" style={{ color: '#3B82F6' }}>{diaMasActivo}</div>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Tu día con mayor actividad registrada</p>
              </div>
            </motion.div>
            {}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <Activity size={20} style={{ color: '#10B981' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Total de Interacciones</h3>
                  <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Del período actual</p>
                </div>
              </div>
              <div className="text-center py-4">
                <div className="text-5xl font-black mb-1" style={{ color: '#10B981' }}>{totalInteracciones}</div>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Parches + Conexiones + Eventos</p>
              </div>
            </motion.div>
            {}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                Interacciones por Categoría
              </h3>
              {}
              <div className="space-y-4 mb-6">
                {interaccionesPorCategoria.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>{item.categoria}</span>
                      <span className="text-sm font-bold" style={{ color: item.color }}>{item.valor}</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ background: isDark ? '#112240' : '#E5E2D8' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.valor / totalInteracciones) * 100}%` }}
                        transition={{ delay: idx * 0.1 + 0.4, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {}
              <div className="flex items-center justify-center gap-4">
                {interaccionesPorCategoria.map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-2 font-black"
                      style={{ background: `${item.color}15`, color: item.color }}
                    >
                      {item.valor}
                    </div>
                    <p className="text-xs font-medium" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>{item.categoria}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <div className="p-8 rounded-3xl text-center" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <Activity size={48} className="mx-auto mb-4 opacity-30" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }} />
            <h3 className="font-bold mb-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Sin Interacciones Registradas</h3>
            <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Aún no tienes interacciones registradas. Comienza conectando con otros estudiantes.</p>
          </div>
        )}
      </div>
    </div>
  );
}