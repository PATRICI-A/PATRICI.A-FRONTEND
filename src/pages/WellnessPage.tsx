import * as React from 'react';
import { useState, useRef, useEffect, useId, memo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Phone, Send, Sparkles, CheckCircle, MapPin, Activity, ChevronLeft, Clock, Mail, Calendar, Shield, Dumbbell, Palette, Brain, ToggleLeft, ToggleRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { GRADIENT, GOLD_GRADIENT, GOLD_LIGHT, TEAL, wellnessResources } from '../types/mockData';
import type { WellnessResource } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import { useApp } from '../store/AppContext';
const moodOptions = [
  { emoji: '😄', label: 'Excelente', value: 5, color: '#10B981' },
  { emoji: '😊', label: 'Bien',      value: 4, color: '#3B82F6' },
  { emoji: '😐', label: 'Regular',   value: 3, color: '#60A5FA' },
  { emoji: '😔', label: 'Mal',       value: 2, color: '#D97706' },
  { emoji: '😢', label: 'Muy mal',   value: 1, color: '#EF4444' },
];
const moodHistory = [
  { id: 'L', day: 'L', value: 3 },
  { id: 'M', day: 'M', value: 4 },
  { id: 'X', day: 'X', value: 2 },
  { id: 'J', day: 'J', value: 5 },
  { id: 'V', day: 'V', value: 4 },
  { id: 'S', day: 'S', value: 3 },
  { id: 'D', day: 'D', value: 4 },
];
type CategoryKey = 'ALL' | 'SALUD' | 'DEPORTE' | 'CULTURA' | 'MENTAL_HEALTH';
type LucideIcon = React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
const TABS: { key: CategoryKey; label: string; Icon: LucideIcon; color: string; bgColor: string }[] = [
  { key: 'ALL',          label: 'Todos',   Icon: Sparkles, color: '#6366F1', bgColor: 'rgba(99,102,241,0.12)' },
  { key: 'SALUD',        label: 'Salud',   Icon: Shield,   color: '#10B981', bgColor: 'rgba(16,185,129,0.12)' },
  { key: 'DEPORTE',      label: 'Deporte', Icon: Dumbbell, color: '#3B82F6', bgColor: 'rgba(59,130,246,0.12)' },
  { key: 'CULTURA',      label: 'Cultura', Icon: Palette,  color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.12)' },
  { key: 'MENTAL_HEALTH',label: 'Apoyo',   Icon: Brain,    color: '#F59E0B', bgColor: 'rgba(245,158,11,0.12)' },
];
const CATEGORY_META: Record<string, { label: string; color: string; bgColor: string; Icon: LucideIcon }> = {
  SALUD:        { label: 'Salud',            color: '#10B981', bgColor: 'rgba(16,185,129,0.1)',  Icon: Shield   },
  DEPORTE:      { label: 'Deporte',          color: '#3B82F6', bgColor: 'rgba(59,130,246,0.1)',  Icon: Dumbbell },
  CULTURA:      { label: 'Cultura',          color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.1)',  Icon: Palette  },
  MENTAL_HEALTH:{ label: 'Apoyo Emocional', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.1)',  Icon: Brain    },
};
const MoodChart = memo(({ isDark }: { isDark: boolean }) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `mood-grad-${uid}`;
  return (
    <ResponsiveContainer width="100%" height={90}>
      <AreaChart data={moodHistory} margin={{ top: 8, right: 0, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: isDark ? '#64748B' : '#9CA3AF', fontSize: 11 }} />
        <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickLine={false} axisLine={false} tick={{ fill: isDark ? '#64748B' : '#9CA3AF', fontSize: 10 }} />
        <Tooltip contentStyle={{ background: isDark ? '#0D1B2E' : '#FDFCF8', border: isDark ? '1px solid #1E3A5F' : '1px solid rgba(10,25,47,0.1)', borderRadius: 12, color: isDark ? '#E2E8F0' : '#1A202C' }} />
        <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill={`url(#${gradId})`} dot={false} activeDot={{ r: 4, fill: '#10B981' }} />
      </AreaChart>
    </ResponsiveContainer>
  );
});
function ResourceCard({ resource, isDark }: { resource: WellnessResource; isDark: boolean }) {
  const meta = CATEGORY_META[resource.category];
  const cardBg = isDark
    ? { background: '#0D1B2E', border: '1px solid rgba(30,58,95,0.55)', boxShadow: '0 2px 16px rgba(0,0,0,0.3)' }
    : { background: 'rgba(253,252,248,0.95)', border: '1px solid rgba(10,25,47,0.06)', boxShadow: '0 2px 16px rgba(10,25,47,0.07)' };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 mb-3"
      style={cardBg}
    >
      {}
      <div className="flex items-start gap-3 mb-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bgColor, color: meta.color }}>
          <meta.Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm truncate" style={{ color: isDark ? '#E2E8F0' : '#1A202C' }}>{resource.name}</p>
            {resource.active ? (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>Activo</span>
            ) : (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', color: isDark ? '#64748B' : '#9CA3AF' }}>Inactivo</span>
            )}
          </div>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: isDark ? '#64748B' : '#6B7280' }}>{resource.description}</p>
        </div>
      </div>
      {}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5">
          <Clock size={12} style={{ color: isDark ? '#64748B' : '#9CA3AF', flexShrink: 0 }} />
          <span className="text-xs" style={{ color: isDark ? '#94A3B8' : '#374151' }}>{resource.schedule}</span>
        </div>
        {resource.location && (
          <div className="flex items-center gap-1.5">
            <MapPin size={12} style={{ color: isDark ? '#64748B' : '#9CA3AF', flexShrink: 0 }} />
            <span className="text-xs" style={{ color: isDark ? '#94A3B8' : '#374151' }}>{resource.location}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Mail size={12} style={{ color: isDark ? '#64748B' : '#9CA3AF', flexShrink: 0 }} />
          <a
            href={`mailto:${resource.contact}`}
            className="text-xs underline"
            style={{ color: meta.color }}
          >
            {resource.contact}
          </a>
        </div>
      </div>
      {}
      {resource.category === 'MENTAL_HEALTH' && (
        <a
          href={`mailto:${resource.contact}?subject=Solicitud de cita — ${encodeURIComponent(resource.name)}&body=Hola,%0A%0AMe%20gustaría%20solicitar%20una%20cita%20para%20el%20servicio%20de%20${encodeURIComponent(resource.name)}.%0A%0AMi%20nombre%20es:%0ASemestre:%0AMotivo:%0A%0AGracias.`}
          className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{ background: meta.bgColor, color: meta.color, border: `1px solid ${meta.color}30` }}
        >
          <Calendar size={13} /> Solicitar cita
        </a>
      )}
    </motion.div>
  );
}
export function WellnessPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', message: '¡Hola! 💚 Soy tu asistente de bienestar. ¿Cómo te encuentras hoy?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<CategoryKey>('ALL');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  const card = isDark
    ? { background: '#0D1B2E', border: '1px solid rgba(30,58,95,0.55)', boxShadow: '0 2px 16px rgba(0,0,0,0.3)' }
    : { background: 'rgba(253,252,248,0.95)', border: '1px solid rgba(10,25,47,0.06)', boxShadow: '0 2px 16px rgba(10,25,47,0.07)' };
  const handleSaveMood = () => {
    if (!selectedMood) return;
    setMoodSaved(true);
    setTimeout(() => setMoodSaved(false), 2500);
  };
  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatHistory(prev => [...prev, { sender: 'user', message: userMsg }]);
    setChatInput('');
    setTimeout(() => {
      const replies = [
        'Gracias por compartir eso conmigo. Es importante reconocer cómo nos sentimos. 💙',
        'Entiendo cómo te sientes. ¿Has considerado hablar con alguien del área de bienestar?',
        'Recuerda respirar profundo. Estás haciendo un gran trabajo al buscar apoyo. ✨',
        '¿Hay algo específico que te esté preocupando? Cuéntame más si quieres.',
      ];
      setChatHistory(prev => [...prev, { sender: 'bot', message: replies[Math.floor(Math.random() * replies.length)] }]);
    }, 1400);
  };
  const filtered = wellnessResources.filter(r => {
    if (showActiveOnly && !r.active) return false;
    if (activeTab !== 'ALL' && r.category !== activeTab) return false;
    return true;
  });
  const groupedByCategory = (activeTab === 'ALL')
    ? (['SALUD', 'DEPORTE', 'CULTURA', 'MENTAL_HEALTH'] as const).map(cat => ({
        cat,
        resources: filtered.filter(r => r.category === cat),
      })).filter(g => g.resources.length > 0)
    : null;
  const activeTabMeta = TABS.find(t => t.key === activeTab)!;
  return (
    <div className="min-h-screen pb-10 px-4">
      {}
      <div className="pt-5 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: isDark ? 'rgba(17,34,64,0.8)' : 'rgba(10,25,47,0.07)', color: isDark ? '#9CA3AF' : '#6E7A8A' }}
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 style={{ color: isDark ? '#E2E8F0' : '#1A202C' }}>💙 Bienestar</h1>
          <p className="text-xs mt-0.5" style={{ color: isDark ? '#64748B' : '#9CA3AF' }}>
            Tu salud mental importa
          </p>
        </div>
      </div>
      {}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5 mb-4 text-white relative overflow-hidden mt-4"
        style={{ background: GRADIENT, boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(245,158,11,0.25) 60%, transparent 80%)' }} />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <Heart size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Soporte Vital · 24/7</p>
            <p className="text-white/70 text-xs">No estás solo/a. Estamos aquí ahora.</p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <a
            href="tel:106"
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            <Phone size={13} /> Llamar
          </a>
          <button
            onClick={() => document.getElementById('support-chat')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.95)', color: '#3730A3' }}
          >
            <MessageCircle size={13} /> Chat
          </button>
        </div>
      </motion.div>
      {}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07 }}
        className="rounded-3xl p-5 mb-4"
        style={card}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold" style={{ color: isDark ? '#E2E8F0' : '#1A202C' }}>¿Cómo estás hoy?</h2>
            <p className="text-xs mt-0.5" style={{ color: isDark ? '#64748B' : '#9CA3AF' }}>Registra tu estado de ánimo</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(217,119,6,0.13)', color: GOLD_LIGHT }}>+10 XP</span>
        </div>
        <div className="flex justify-between mb-4">
          {moodOptions.map(mood => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className="flex flex-col items-center gap-1.5 transition-all"
              style={{ transform: selectedMood === mood.value ? 'scale(1.2)' : 'scale(1)' }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: selectedMood === mood.value ? mood.color : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                  border: `2px solid ${selectedMood === mood.value ? mood.color : 'transparent'}`,
                  boxShadow: selectedMood === mood.value ? `0 4px 12px ${mood.color}55` : 'none',
                }}
              >
                <EmojiIcon emoji={mood.emoji} size={18} color={selectedMood === mood.value ? 'white' : mood.color} strokeWidth={2} />
              </div>
              <span className="text-[10px]" style={{ color: isDark ? '#64748B' : '#9CA3AF' }}>{mood.label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence>
          {selectedMood && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSaveMood}
              className="w-full py-3 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: moodSaved ? '#10B981' : GOLD_GRADIENT, boxShadow: moodSaved ? '0 4px 14px rgba(16,185,129,0.4)' : '0 4px 14px rgba(217,119,6,0.35)' }}
            >
              {moodSaved ? <><CheckCircle size={14} /> ¡Registrado! +10 XP</> : <><Sparkles size={14} /> Guardar estado</>}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
      {}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-3xl p-5 mb-4"
        style={card}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold" style={{ color: isDark ? '#E2E8F0' : '#1A202C' }}>Historial semanal</h2>
            <p className="text-xs mt-0.5" style={{ color: isDark ? '#64748B' : '#9CA3AF' }}>Tu tendencia de bienestar</p>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)' }}>
            <Activity size={15} color="#10B981" />
          </div>
        </div>
        <MoodChart isDark={isDark} />
      </motion.div>
      {}
      <motion.div
        id="support-chat"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.17 }}
        className="rounded-3xl overflow-hidden mb-4"
        style={card}
      >
        {}
        <div
          className="px-5 py-4 flex items-center gap-3 border-b"
          style={{ borderColor: isDark ? 'rgba(30,58,95,0.5)' : 'rgba(10,25,47,0.06)' }}
        >
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: GRADIENT }}>
            <Heart size={14} color="white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="font-bold" style={{ color: isDark ? '#E2E8F0' : '#1A202C' }}>Asistente de Bienestar</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
              <span className="text-[10px] font-medium" style={{ color: TEAL }}>En línea</span>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: GOLD_GRADIENT }}>
            <Sparkles size={11} className="text-white" />
          </div>
        </div>
        {}
        <div className="p-4 max-h-52 overflow-y-auto space-y-2.5">
          {chatHistory.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={msg.sender === 'user'
                  ? { background: GRADIENT, color: 'white', borderBottomRightRadius: 6 }
                  : { background: isDark ? '#152238' : 'rgba(10,25,47,0.06)', color: isDark ? '#D1D9E6' : '#374151', borderBottomLeftRadius: 6 }
                }
              >
                {msg.message}
              </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {}
        <div className="px-4 pb-4 flex gap-2">
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Cuéntame cómo te sientes..."
            className="flex-1 px-4 py-2.5 rounded-2xl text-sm focus:outline-none placeholder-gray-400"
            style={{ background: isDark ? '#152238' : 'rgba(10,25,47,0.06)', color: isDark ? '#E2E8F0' : '#1A202C' }}
          />
          <button
            onClick={handleSend}
            disabled={!chatInput.trim()}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white disabled:opacity-40 transition-all active:scale-90"
            style={{ background: GRADIENT }}
          >
            <Send size={14} />
          </button>
        </div>
      </motion.div>
      {}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="rounded-3xl p-5 mb-6"
        style={{
          background: isDark ? 'rgba(16,185,129,0.07)' : 'rgba(16,185,129,0.05)',
          border: isDark ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(16,185,129,0.18)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <MapPin size={15} color="#10B981" />
          </div>
          <h2 className="font-bold" style={{ color: isDark ? '#D1FAE5' : '#065F46' }}>Atención Presencial</h2>
        </div>
        <p className="text-xs mb-3" style={{ color: isDark ? '#6EE7B7' : '#047857' }}>
          Bloque A — Oficina de Bienestar · Lun–Vie 8:00 AM – 5:00 PM
        </p>
        <button
          onClick={() => navigate('/campus-map')}
          className="w-full py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform text-white"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 14px rgba(16,185,129,0.35)' }}
        >
          <MapPin size={14} /> Ver en el mapa
        </button>
      </motion.div>
      {}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        {}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold" style={{ color: isDark ? '#E2E8F0' : '#1A202C' }}>Recursos de Bienestar</h2>
            <p className="text-xs mt-0.5" style={{ color: isDark ? '#64748B' : '#9CA3AF' }}>Servicios disponibles para ti</p>
          </div>
          {}
          <button
            onClick={() => setShowActiveOnly(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
            style={{
              background: showActiveOnly ? 'rgba(16,185,129,0.12)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
              color: showActiveOnly ? '#10B981' : (isDark ? '#64748B' : '#9CA3AF'),
              border: showActiveOnly ? '1px solid rgba(16,185,129,0.25)' : '1px solid transparent',
            }}
          >
            {showActiveOnly ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
            Solo activos
          </button>
        </div>
        {}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all active:scale-95"
              style={{
                background: activeTab === tab.key ? tab.bgColor : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                color: activeTab === tab.key ? tab.color : (isDark ? '#64748B' : '#9CA3AF'),
                border: activeTab === tab.key ? `1px solid ${tab.color}30` : '1px solid transparent',
              }}
            >
              <tab.Icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>
        {}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm font-semibold" style={{ color: isDark ? '#E2E8F0' : '#1A202C' }}>Sin recursos disponibles</p>
              <p className="text-xs mt-1" style={{ color: isDark ? '#64748B' : '#9CA3AF' }}>
                {showActiveOnly ? 'No hay recursos activos en esta categoría.' : 'No hay recursos en esta categoría.'}
              </p>
            </motion.div>
          ) : groupedByCategory ? (
            <motion.div key="grouped" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {groupedByCategory.map(({ cat, resources }) => {
                const meta = CATEGORY_META[cat];
                return (
                  <div key={cat} className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.bgColor, color: meta.color }}>
                        <meta.Icon size={14} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: meta.color }}>{meta.label}</span>
                      <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(30,58,95,0.5)' : 'rgba(10,25,47,0.06)' }} />
                      <span className="text-xs" style={{ color: isDark ? '#64748B' : '#9CA3AF' }}>{resources.length}</span>
                    </div>
                    {resources.map(r => <ResourceCard key={r.id} resource={r} isDark={isDark} />)}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
              {filtered.map(r => <ResourceCard key={r.id} resource={r} isDark={isDark} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}