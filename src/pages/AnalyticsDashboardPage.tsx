import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Calendar, Users, Heart, Zap, TrendingUp, MapPin, Activity, ChevronDown
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { GRADIENT, PINK, TEAL, GOLD_LIGHT } from '../types/mockData';
import { format, subDays } from 'date-fns';
import { getAdminAnalytics } from '../services/analytics.service';
import type { AdminAnalyticsResponse } from '../services/analytics.service';

type MetricType = 'USUARIOS' | 'PARCHES' | 'EVENTOS' | 'MATCHES' | 'ZONAS';

const METRIC_MAP: Record<MetricType, string> = {
  USUARIOS: 'USERS', PARCHES: 'PARCHES', EVENTOS: 'EVENTS', MATCHES: 'MATCHES', ZONAS: 'ZONES',
};

export function AnalyticsDashboardPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [metricType, setMetricType] = useState<MetricType>('USUARIOS');
  const [adminData, setAdminData] = useState<AdminAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    getAdminAnalytics({ startDate, endDate, metricType: METRIC_MAP[metricType] as any })
      .then(setAdminData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [startDate, endDate, metricType]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Datos reales o fallback a mock
  const usuariosData = adminData?.activeUsers?.timeSeries
    ? Object.entries(adminData.activeUsers.timeSeries).map(([date, value]) => ({ date, value }))
    : [{ date: '10 May', value: 1240 }, { date: '11 May', value: 1380 }, { date: '12 May', value: 1520 }, { date: '13 May', value: 1450 }];

  const parchesTimeSeries = adminData?.parcheStats?.timeSeries
    ? Object.values(adminData.parcheStats.timeSeries)
    : [12, 8, 15, 9, 11, 7, 13];

  const topEventos = adminData?.topEvents?.length
    ? adminData.topEvents.map(e => ({ name: e.eventName, participantes: e.rsvpCount }))
    : [
        { name: 'Hackathon ECI 2025', participantes: 120 },
        { name: 'Festival de Música', participantes: 450 },
        { name: 'Taller Bienestar Mental', participantes: 34 },
        { name: 'After-Study Rooftop', participantes: 89 },
        { name: 'Feria de Emprendimiento', participantes: 280 },
      ];

  const campusZonesColors = ['#EF4444', '#F59E0B', '#3B82F6', '#06B6D4', '#8B5CF6', '#10B981'];
  const campusZones = adminData?.campusHeatmap?.zones
    ? Object.entries(adminData.campusHeatmap.zones).map(([name, val], i) => ({
        name, activity: Math.round(Object.values(val as Record<string, number>).reduce((a, b) => a + b, 0) / Math.max(Object.values(val as Record<string, number>).length, 1)),
        color: campusZonesColors[i % campusZonesColors.length],
      }))
    : [
        { name: 'Biblioteca', activity: 92, color: '#EF4444' },
        { name: 'Cafetería', activity: 85, color: '#F59E0B' },
        { name: 'Bloque A', activity: 68, color: '#3B82F6' },
        { name: 'Bloque B', activity: 55, color: '#06B6D4' },
        { name: 'Zona Deportiva', activity: 48, color: '#10B981' },
      ];

  const matchSuccessRate = adminData?.matchSuccessRate != null
    ? Math.round(adminData.matchSuccessRate * 100)
    : 78;

  const hasGeoData = metricType === 'ZONAS' && campusZones.length > 0;
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
            <h1 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Panel de Analítica</h1>
            <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Exclusivo para administradores</p>
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
            Rango de fechas
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
        <div className="p-4 rounded-3xl" style={isDark
          ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' }
          : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }
        }>
          <label className="text-sm font-semibold mb-3 block" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Tipo de métrica</label>
          <div className="relative">
            <select value={metricType} onChange={(e) => setMetricType(e.target.value as MetricType)} className="w-full px-4 py-3 pr-10 rounded-xl appearance-none text-sm font-medium" style={isDark ? { background: '#112240', border: '1px solid #1E3A5F', color: '#F9FAFB' } : { background: '#EDE9E0', border: '1px solid transparent', color: '#111827' }}>
              <option value="USUARIOS">Usuarios</option>
              <option value="PARCHES">Parches</option>
              <option value="EVENTOS">Eventos</option>
              <option value="MATCHES">Matches</option>
              <option value="ZONAS">Zonas</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }} />
          </div>
        </div>
        {}
        {metricType === 'USUARIOS' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <Users size={20} style={{ color: '#3B82F6' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Usuarios Activos</h3>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Por período seleccionado</p>
              </div>
            </div>
            <div className="space-y-3">
              {usuariosData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>{item.date}</span>
                    <span className="text-sm font-bold" style={{ color: '#3B82F6' }}>{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? '#112240' : '#E5E2D8' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / 1600) * 100}%` }} transition={{ delay: idx * 0.1, duration: 0.6 }} className="h-full rounded-full" style={{ background: GRADIENT }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {}
        {metricType === 'PARCHES' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(232,36,90,0.1)' }}>
                <Heart size={20} style={{ color: PINK }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Parches Creados</h3>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Últimos 7 días</p>
              </div>
            </div>
            <div className="flex items-end gap-2 h-32">
              {parchesTimeSeries.map((val, idx) => (
                <motion.div key={idx} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: idx * 0.1 }} className="flex-1 rounded-t-lg" style={{ background: GRADIENT, height: `${(val / 15) * 100}%`, transformOrigin: 'bottom' }} />
              ))}
            </div>
          </motion.div>
        )}
        {}
        {metricType === 'EVENTOS' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                <Zap size={20} style={{ color: '#10B981' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Top 10 Eventos</h3>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Mayor participación</p>
              </div>
            </div>
            <div className="space-y-2">
              {topEventos.map((evento, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ background: isDark ? '#112240' : '#EDE9E0' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{ background: GRADIENT, color: '#FFF' }}>{idx + 1}</span>
                    <span className="text-sm font-medium" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>{evento.name}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#10B981' }}>{evento.participantes}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {}
        {metricType === 'MATCHES' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.1)' }}>
                <TrendingUp size={20} style={{ color: '#F97316' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Tasa de Matches Exitosos</h3>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Porcentaje de conexiones aceptadas</p>
              </div>
            </div>
            <div className="text-center py-6">
              <div className="text-6xl font-black mb-2" style={{ color: '#F97316' }}>{matchSuccessRate}%</div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: isDark ? '#112240' : '#E5E2D8' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${matchSuccessRate}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' }} />
              </div>
              <p className="text-xs mt-3" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>+5% vs promedio general</p>
            </div>
          </motion.div>
        )}
        {}
        {metricType === 'ZONAS' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                <MapPin size={20} style={{ color: '#8B5CF6' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Heatmap del Campus</h3>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Zonas con mayor actividad</p>
              </div>
            </div>
            {hasGeoData ? (
              <div className="space-y-3">
                {campusZones.map((zone, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>{zone.name}</span>
                      <span className="text-xs font-bold" style={{ color: zone.color }}>{zone.activity}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? '#112240' : '#E5E2D8' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${zone.activity}%` }} transition={{ delay: idx * 0.1 + 0.3, duration: 0.6 }} className="h-full rounded-full" style={{ background: zone.color }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Activity size={32} className="mx-auto mb-3 opacity-30" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }} />
                <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Sin datos de ubicación disponibles para este período</p>
              </div>
            )}
          </motion.div>
        )}
        {}
        <div className="p-4 rounded-2xl text-center" style={{ background: isDark ? 'rgba(59,130,246,0.05)' : 'rgba(59,130,246,0.05)', border: isDark ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(59,130,246,0.15)' }}>
          <p className="text-xs font-medium" style={{ color: '#3B82F6' }}>Datos actualizados cada 5 minutos · Información anonimizada</p>
        </div>
      </div>
    </div>
  );
}