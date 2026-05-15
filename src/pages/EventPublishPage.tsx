import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Calendar, MapPin, Users, CheckCircle, Star
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { GRADIENT } from '../types/mockData';
export function EventPublishPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [cupo, setCupo] = useState('');
  const [oficial, setOficial] = useState(false);
  const charCount = nombre.length;
  const maxChars = 100;
  const handlePublicar = () => {
    if (!nombre || !descripcion || !fecha || !hora || !ubicacion || !cupo) {
      alert('Por favor completa todos los campos');
      return;
    }
    alert('✅ Evento publicado exitosamente en el feed de todos los estudiantes');
    navigate('/events');
  };
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
            <h1 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Publicar Evento</h1>
            <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Panel para organizadores</p>
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
          <label className="text-sm font-semibold mb-2 block" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Nombre del evento</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                setNombre(e.target.value);
              }
            }}
            placeholder="Ej: Hackathon ECI 2025"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={isDark
              ? { background: '#112240', border: '1px solid #1E3A5F', color: '#F9FAFB' }
              : { background: '#EDE9E0', border: '1px solid transparent', color: '#111827' }
            }
          />
          <p className="text-xs mt-2 text-right" style={{ color: charCount >= maxChars ? '#EF4444' : isDark ? '#9CA3AF' : '#6B7280' }}>
            {charCount}/{maxChars} caracteres
          </p>
        </div>
        {}
        <div className="p-5 rounded-3xl" style={isDark
          ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' }
          : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }
        }>
          <label className="text-sm font-semibold mb-2 block" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe los detalles del evento..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={isDark
              ? { background: '#112240', border: '1px solid #1E3A5F', color: '#F9FAFB' }
              : { background: '#EDE9E0', border: '1px solid transparent', color: '#111827' }
            }
          />
        </div>
        {}
        <div className="p-5 rounded-3xl space-y-4" style={isDark
          ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' }
          : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }
        }>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
              <Calendar size={16} />
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={isDark
                ? { background: '#112240', border: '1px solid #1E3A5F', color: '#F9FAFB' }
                : { background: '#EDE9E0', border: '1px solid transparent', color: '#111827' }
              }
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Hora</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={isDark
                ? { background: '#112240', border: '1px solid #1E3A5F', color: '#F9FAFB' }
                : { background: '#EDE9E0', border: '1px solid transparent', color: '#111827' }
              }
            />
          </div>
        </div>
        {}
        <div className="p-5 rounded-3xl" style={isDark
          ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' }
          : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }
        }>
          <label className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
            <MapPin size={16} />
            Ubicación dentro del campus
          </label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Ej: Auditorio Principal, Bloque A"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={isDark
              ? { background: '#112240', border: '1px solid #1E3A5F', color: '#F9FAFB' }
              : { background: '#EDE9E0', border: '1px solid transparent', color: '#111827' }
            }
          />
        </div>
        {}
        <div className="p-5 rounded-3xl" style={isDark
          ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' }
          : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }
        }>
          <label className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
            <Users size={16} />
            Cupo máximo de asistentes
          </label>
          <input
            type="number"
            value={cupo}
            onChange={(e) => setCupo(e.target.value)}
            placeholder="Ej: 150"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={isDark
              ? { background: '#112240', border: '1px solid #1E3A5F', color: '#F9FAFB' }
              : { background: '#EDE9E0', border: '1px solid transparent', color: '#111827' }
            }
          />
        </div>
        {}
        <div className="p-5 rounded-3xl flex items-center justify-between" style={isDark
          ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.5)' }
          : { background: '#FDFCF8', boxShadow: '0 2px 12px rgba(10,25,47,0.07)', border: '1px solid transparent' }
        }>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.1)' }}>
              <Star size={18} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>Evento Oficial</p>
              <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>Aparecerá destacado en el feed</p>
            </div>
          </div>
          <button
            onClick={() => setOficial(!oficial)}
            className="w-12 h-7 rounded-full transition-all"
            style={{
              background: oficial ? GRADIENT : isDark ? '#1E3A5F' : '#C3BFB5',
              position: 'relative',
            }}
          >
            <motion.div
              animate={{ x: oficial ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-5 h-5 rounded-full absolute top-1 left-1"
              style={{ background: '#FFF' }}
            />
          </button>
        </div>
        {}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePublicar}
          className="w-full p-4 rounded-3xl font-bold flex items-center justify-center gap-2"
          style={{ background: GRADIENT, color: '#FFF' }}
        >
          <CheckCircle size={18} />
          Publicar evento
        </motion.button>
        {}
        <div className="p-4 rounded-2xl text-center" style={{ background: isDark ? 'rgba(59,130,246,0.05)' : 'rgba(59,130,246,0.05)', border: isDark ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(59,130,246,0.15)' }}>
          <p className="text-xs font-medium" style={{ color: '#3B82F6' }}>Al publicar, el evento aparecerá en el feed de todos los estudiantes</p>
        </div>
      </div>
    </div>
  );
}