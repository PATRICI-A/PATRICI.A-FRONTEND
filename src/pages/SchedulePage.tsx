import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Trash2, CheckCircle2, CalendarDays } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useScheduleStore } from '../store/scheduleStore';
import { GOLD_LIGHT, GOLD_GRADIENT } from '../types/mockData';
import patyHorario from '../assets/patyHorario.png';
export const SLOTS = [
  { start: '7:00',  startP: 'AM', end: '8:30',  endP: 'AM' },
  { start: '8:30',  startP: 'AM', end: '10:00', endP: 'AM' },
  { start: '10:00', startP: 'AM', end: '11:30', endP: 'AM' },
  { start: '11:30', startP: 'AM', end: '1:00',  endP: 'PM' },
  { start: '1:00',  startP: 'PM', end: '2:30',  endP: 'PM' },
  { start: '2:30',  startP: 'PM', end: '4:00',  endP: 'PM' },
  { start: '4:00',  startP: 'PM', end: '5:30',  endP: 'PM' },
  { start: '5:30',  startP: 'PM', end: '7:00',  endP: 'PM' },
];
export const DAYS = [
  { label: 'Lun', key: 'LUNES'     },
  { label: 'Mar', key: 'MARTES'    },
  { label: 'Mié', key: 'MIERCOLES' },
  { label: 'Jue', key: 'JUEVES'    },
  { label: 'Vie', key: 'VIERNES'   },
  { label: 'Sáb', key: 'SABADO'    },
];
const SLOT_H = 60;
export function SchedulePage() {
  const navigate  = useNavigate();
  const { isDark } = useApp();
  const { slots, toggle, clear } = useScheduleStore();
  const isSelected  = (day: string, i: number) => slots.includes(`${day}-${i}`);
  const totalSlots  = slots.length;
  const gridLine = isDark ? '#1E3A5F' : '#E2E8F0';
  const headerBg = isDark ? 'rgba(10,25,47,0.97)' : 'rgba(253,252,248,0.95)';
  const cardBg   = isDark ? '#112240' : '#FFFFFF';
  const timeTxt  = isDark ? '#4A6080' : '#64748B';
  const dayTxt   = isDark ? '#6B8AAA' : '#374151';
  return (
    <div className="min-h-screen w-full md:w-4/6 md:mx-auto" style={{ background: 'transparent' }}>
      <div
        className="sticky top-[57px] z-30 px-4 py-2 flex items-center justify-between border-b"
        style={{ background: headerBg, borderColor: gridLine, backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: isDark ? '#0A192F' : 'rgba(10,25,47,0.07)', color: timeTxt }}
          >
            <ChevronLeft size={20} />
          </button>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: GOLD_GRADIENT }}
          >
            <CalendarDays size={17} color="white" />
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white" style={{ fontSize: '1rem', lineHeight: 1.2 }}>
              Mi Disponibilidad
            </h1>
            <p className="text-xs" style={{ color: timeTxt }}>
              {totalSlots === 0
                ? 'Toca una franja para marcarla'
                : `${totalSlots} franja${totalSlots !== 1 ? 's' : ''} · ${totalSlots * 1.5}h disponibles`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img src={patyHorario} alt="Paty" className="h-24 w-auto drop-shadow-md" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          {totalSlots > 0 && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={clear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
            >
              <Trash2 size={12} /> Limpiar
            </motion.button>
          )}
        </div>
      </div>
      {}
      <div className="px-4 pt-3 pb-1">
        <p className="text-[11px] text-center" style={{ color: timeTxt }}>
          Toca cualquier celda para marcarla · Toca de nuevo para quitarla
        </p>
      </div>
      <div className="px-3 py-3 pb-10">
        {totalSlots > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: isDark ? 'rgba(217,119,6,0.08)' : 'rgba(245,158,11,0.10)', border: `1px solid ${GOLD_LIGHT}44` }}
          >
            <CheckCircle2 size={18} style={{ color: GOLD_LIGHT }} />
            <div>
              <p className="text-sm font-bold" style={{ color: GOLD_LIGHT }}>
                {totalSlots} franja{totalSlots !== 1 ? 's' : ''} marcada{totalSlots !== 1 ? 's' : ''}
              </p>
              <p className="text-[11px]" style={{ color: timeTxt }}>
                {totalSlots * 1.5} horas de disponibilidad en la semana
              </p>
            </div>
          </motion.div>
        )}
        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ background: cardBg, border: `1px solid ${gridLine}` }}
        >
          <div className="overflow-x-auto">
            <div style={{ minWidth: 420 }}>
              {}
              <div className="flex border-b" style={{ borderColor: gridLine }}>
                <div className="flex-shrink-0 w-[72px]" style={{ borderRight: `1px solid ${gridLine}` }} />
                {DAYS.map(({ label, key }, i) => (
                  <div
                    key={key}
                    className="flex-1 py-2.5 text-center"
                    style={{ borderRight: i < DAYS.length - 1 ? `1px solid ${gridLine}` : 'none' }}
                  >
                    <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: dayTxt }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              {}
              {SLOTS.map((slot, si) => (
                <div
                  key={si}
                  className="flex"
                  style={{ borderBottom: si < SLOTS.length - 1 ? `1px solid ${gridLine}` : 'none' }}
                >
                  {}
                  <div
                    className="flex-shrink-0 w-[72px] flex flex-col items-end justify-center pr-2.5 gap-0.5"
                    style={{ height: SLOT_H, borderRight: `1px solid ${gridLine}` }}
                  >
                    <span className="text-[9px] font-bold leading-none" style={{ color: timeTxt }}>
                      {slot.start} <span style={{ color: isDark ? '#2A4A6A' : '#94A3B8' }}>{slot.startP}</span>
                    </span>
                    <div className="w-6 border-t" style={{ borderColor: isDark ? '#2A4A6A' : '#CBD5E1' }} />
                    <span className="text-[9px] font-bold leading-none" style={{ color: timeTxt }}>
                      {slot.end} <span style={{ color: isDark ? '#2A4A6A' : '#94A3B8' }}>{slot.endP}</span>
                    </span>
                  </div>
                  {}
                  {DAYS.map(({ key }, di) => {
                    const selected = isSelected(key, si);
                    return (
                      <motion.button
                        key={key}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => toggle(key, si)}
                        className="flex-1 relative flex items-center justify-center"
                        style={{
                          height: SLOT_H,
                          borderRight: di < DAYS.length - 1 ? `1px solid ${gridLine}` : 'none',
                          background: selected
                            ? (isDark ? 'rgba(217,119,6,0.22)' : 'rgba(245,158,11,0.18)')
                            : 'transparent',
                        }}
                      >
                        {selected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-1 rounded-lg flex items-center justify-center"
                            style={{ background: GOLD_GRADIENT, boxShadow: '0 2px 8px rgba(217,119,6,0.35)' }}
                          >
                            <CheckCircle2 size={15} color="white" strokeWidth={2.5} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}