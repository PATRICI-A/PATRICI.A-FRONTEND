import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Download, Eye, Calendar, FileText, Clock, Mail
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { GRADIENT } from '../types/mockData';
import { format, subDays } from 'date-fns';
type MetricaReporte = 'USUARIOS' | 'PARCHES' | 'EVENTOS' | 'MATCHES' | 'ZONAS';
interface Reporte {
  id: string;
  metricas: string[];
  fecha: string;
  registros: number;
}
export function ReportsPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [metricasSeleccionadas, setMetricasSeleccionadas] = useState<MetricaReporte[]>([]);
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showPreview, setShowPreview] = useState(false);
  const [frecuencia, setFrecuencia] = useState<'DIARIO' | 'SEMANAL' | 'MENSUAL'>('SEMANAL');
  const [email, setEmail] = useState('admin@admin.com');
  const reportesHistorico: Reporte[] = [
    { id: 'r1', metricas: ['USUARIOS', 'PARCHES'], fecha: '2026-05-10', registros: 2847 },
    { id: 'r2', metricas: ['EVENTOS', 'MATCHES'], fecha: '2026-05-03', registros: 512 },
    { id: 'r3', metricas: ['ZONAS'], fecha: '2026-04-26', registros: 6 },
  ];
  const previewData = [
    { usuario: 'María G.', email: 'maria.g@mail.escuelaing.edu.co', facultad: 'Sistemas', xp: 3200, nivel: 12 },
    { usuario: 'Carlos M.', email: 'carlos.m@mail.escuelaing.edu.co', facultad: 'Civil', xp: 2800, nivel: 10 },
    { usuario: 'Ana T.', email: 'ana.t@mail.escuelaing.edu.co', facultad: 'Industrial', xp: 1500, nivel: 7 },
  ];
  const toggleMetrica = (m: MetricaReporte) => {
    setMetricasSeleccionadas(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    );
  };
  const totalRegistros = metricasSeleccionadas.length > 0 ? 8450 : 0;
  const handleGenerarReporte = () => {
    if (totalRegistros > 10000) {
      alert('El reporte se está generando, recibirás una notificación cuando esté listo');
    } else {
      alert('Descargando reporte CSV...');
    }
  };
  const metricas: { id: MetricaReporte; label: string }[] = [
    { id: 'USUARIOS', label: 'Usuarios' },
    { id: 'PARCHES', label: 'Parches' },
    { id: 'EVENTOS', label: 'Eventos' },
    { id: 'MATCHES', label: 'Matches' },
    { id: 'ZONAS', label: 'Zonas' },
  ];
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
            <h1 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Reportes Exportables</h1>
            <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Genera reportes CSV personalizados</p>
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
          <label className="text-sm font-semibold mb-3 block" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Selecciona métricas a exportar</label>
          <div className="grid grid-cols-2 gap-2">
            {metricas.map((m) => {
              const selected = metricasSeleccionadas.includes(m.id);
              return (
                <button key={m.id} onClick={() => toggleMetrica(m.id)} className="px-4 py-3 rounded-xl text-sm font-semibold transition-all" style={selected
                  ? { background: GRADIENT, color: '#FFF' }
                  : isDark
                    ? { background: '#112240', border: '1px solid #1E3A5F', color: '#9CA3AF' }
                    : { background: '#EDE9E0', border: '1px solid transparent', color: '#4A5568' }
                }>
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
        {}
        <div className="p-5 rounded-3xl" style={isDark
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
        <button onClick={() => setShowPreview(!showPreview)} className="w-full p-4 rounded-3xl font-semibold flex items-center justify-center gap-2" style={isDark ? { background: '#112240', border: '1px solid #1E3A5F', color: '#F9FAFB' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', color: '#111827' }}>
          <Eye size={18} />
          {showPreview ? 'Ocultar Vista Previa' : 'Vista Previa'}
        </button>
        {showPreview && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl overflow-x-auto" style={isDark ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' } : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }}>
            <p className="text-xs mb-3 font-semibold" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Primeras 10 filas del reporte</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: isDark ? '#1E3A5F' : 'rgba(10,25,47,0.1)' }}>
                  <th className="text-left py-2 font-semibold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Usuario</th>
                  <th className="text-left py-2 font-semibold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Email</th>
                  <th className="text-left py-2 font-semibold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Facultad</th>
                  <th className="text-left py-2 font-semibold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>XP</th>
                  <th className="text-left py-2 font-semibold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Nivel</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx} className="border-b" style={{ borderColor: isDark ? '#1E3A5F' : 'rgba(10,25,47,0.05)' }}>
                    <td className="py-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>{row.usuario}</td>
                    <td className="py-2 text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>{row.email}</td>
                    <td className="py-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>{row.facultad}</td>
                    <td className="py-2 font-bold" style={{ color: '#3B82F6' }}>{row.xp}</td>
                    <td className="py-2 font-bold" style={{ color: '#10B981' }}>{row.nivel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
        {}
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleGenerarReporte} disabled={metricasSeleccionadas.length === 0} className="w-full p-4 rounded-3xl font-bold flex items-center justify-center gap-2 transition-opacity" style={metricasSeleccionadas.length === 0 ? { background: isDark ? '#112240' : '#E5E2D8', color: isDark ? '#4A5568' : '#9CA3AF', cursor: 'not-allowed' } : { background: GRADIENT, color: '#FFF' }}>
          <Download size={18} />
          Generar reporte CSV
          {totalRegistros > 0 && <span className="text-xs opacity-80">({totalRegistros.toLocaleString()} registros)</span>}
        </motion.button>
        {totalRegistros > 10000 && (
          <div className="p-4 rounded-2xl text-center" style={{ background: isDark ? 'rgba(249,115,22,0.05)' : 'rgba(249,115,22,0.05)', border: isDark ? '1px solid rgba(249,115,22,0.2)' : '1px solid rgba(249,115,22,0.15)' }}>
            <p className="text-xs font-medium" style={{ color: '#F97316' }}>El reporte se está generando, recibirás una notificación cuando esté listo</p>
          </div>
        )}
        {}
        <div className="p-5 rounded-3xl space-y-4" style={isDark
          ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' }
          : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }
        }>
          <h3 className="font-bold flex items-center gap-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
            <Clock size={18} />
            Programar reporte automático
          </h3>
          <div>
            <label className="text-xs mb-2 block font-semibold" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Frecuencia</label>
            <div className="grid grid-cols-3 gap-2">
              {['DIARIO', 'SEMANAL', 'MENSUAL'].map((f) => {
                const selected = frecuencia === f;
                return (
                  <button key={f} onClick={() => setFrecuencia(f as any)} className="px-3 py-2 rounded-xl text-xs font-semibold" style={selected ? { background: GRADIENT, color: '#FFF' } : isDark ? { background: '#112240', border: '1px solid #1E3A5F', color: '#9CA3AF' } : { background: '#EDE9E0', border: '1px solid transparent', color: '#4A5568' }}>
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-xs mb-2 block font-semibold" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Correo de entrega</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={isDark ? { background: '#112240', border: '1px solid #1E3A5F' } : { background: '#EDE9E0' }}>
              <Mail size={16} style={{ color: isDark ? '#9CA3AF' : '#6B7280' }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@admin.com" className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#F9FAFB' : '#111827' }} />
            </div>
          </div>
        </div>
        {}
        <div className="p-5 rounded-3xl space-y-3" style={isDark
          ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' }
          : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }
        }>
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
              <FileText size={18} />
              Historial de reportes
            </h3>
            <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Disponibles 30 días</p>
          </div>
          {reportesHistorico.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: isDark ? '#112240' : '#EDE9E0' }}>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>{r.metricas.join(', ')}</p>
                <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>{r.fecha} · {r.registros.toLocaleString()} registros</p>
              </div>
              <button className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: GRADIENT, color: '#FFF' }}>
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}