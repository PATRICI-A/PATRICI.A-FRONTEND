import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, MessageCircle, Phone, BookOpen, Send, Sparkles, Clock, AlertCircle, CheckCircle, TrendingUp, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { GRADIENT, GOLD_GRADIENT, GOLD_LIGHT, TEAL } from '../data/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';

const resources = [
  {
    id: 'r1',
    title: 'Mindfulness para universitarios',
    description: 'Técnicas de respiración y meditación en 5 minutos',
    emoji: '🧘',
    color: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
    duration: '5 min',
  },
  {
    id: 'r2',
    title: 'Manejo del estrés académico',
    description: 'Estrategias efectivas para enfrentar parciales y entregas',
    emoji: '📚',
    color: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    duration: '10 min',
  },
  {
    id: 'r3',
    title: 'Conexiones saludables',
    description: 'Cómo construir relaciones auténticas en la universidad',
    emoji: '🤝',
    color: GRADIENT,
    duration: '8 min',
  },
  {
    id: 'r4',
    title: 'Rutinas de autocuidado',
    description: 'Pequeños hábitos que transforman tu día',
    emoji: '💆',
    color: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
    duration: '6 min',
  },
];

const moodOptions = [
  { emoji: '😄', label: 'Excelente', value: 5, color: '#10B981' },
  { emoji: '😊', label: 'Bien', value: 4, color: '#3B82F6' },
  { emoji: '😐', label: 'Regular', value: 3, color: '#60A5FA' },
  { emoji: '😔', label: 'Mal', value: 2, color: '#D97706' },
  { emoji: '😢', label: 'Muy mal', value: 1, color: '#EF4444' },
];

const moodHistory = [
  { id: 'mon', day: 'L',  value: 3, label: 'Regular'   },
  { id: 'tue', day: 'M',  value: 4, label: 'Bien'       },
  { id: 'wed', day: 'X',  value: 2, label: 'Mal'        },
  { id: 'thu', day: 'J',  value: 5, label: 'Excelente'  },
  { id: 'fri', day: 'V',  value: 4, label: 'Bien'       },
  { id: 'sat', day: 'S',  value: 3, label: 'Regular'    },
  { id: 'sun', day: 'D',  value: 4, label: 'Bien'       },
];

const MOOD_COLORS: Record<number, string> = {
  1: '#EF4444',
  2: '#D97706',
  3: '#60A5FA',
  4: '#3B82F6',
  5: '#10B981',
};

export function WellnessPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', message: '¡Hola! 💚 Soy tu asistente de bienestar. ¿Cómo te encuentras hoy?' }
  ]);
  const [moodSaved, setMoodSaved] = useState(false);

  const handleSaveMood = () => {
    if (!selectedMood) return;
    setMoodSaved(true);
    setTimeout(() => setMoodSaved(false), 2000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatHistory(prev => [...prev, { sender: 'user', message: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      const responses = [
        'Gracias por compartir eso conmigo. Es importante reconocer cómo nos sentimos. 💙',
        'Entiendo cómo te sientes. ¿Has considerado hablar con alguien del área de bienestar universitario?',
        'Recuerda respirar profundo. Estás haciendo un gran trabajo al buscar apoyo. ✨',
        'Si las cosas se ponen difíciles, el número de crisis universitaria es 316-123-4567.',
        '¿Hay algo específico que te esté preocupando? Cuéntame más si quieres.',
      ];
      setChatHistory(prev => [...prev, {
        sender: 'bot',
        message: responses[Math.floor(Math.random() * responses.length)]
      }]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0F1C] pb-8">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 bg-white dark:bg-[#151729] shadow-sm sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#1E2038] text-gray-500 dark:text-gray-400"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-gray-900 dark:text-white text-base">Bienestar y Soporte</h1>
          <p className="text-xs text-gray-400 flex items-center gap-1">Tu salud mental importa <Heart size={11} className="text-green-500" /></p>
        </div>
        {/* Gold premium badge */}
        <div
          className="ml-auto px-2.5 py-1 rounded-full text-white text-[10px] font-bold flex items-center gap-1"
          style={{ background: GOLD_GRADIENT }}
        >
          <Sparkles size={10} />
          Premium
        </div>
      </div>

      <div className="px-5 pt-5 max-w-lg mx-auto">
        {/* Hero Banner */}
        <div
          className="rounded-2xl p-5 mb-5 text-white relative overflow-hidden"
          style={{ background: GRADIENT }}
        >
          {/* Gold shimmer overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 30%, rgba(245,158,11,0.4) 50%, transparent 70%)',
            }}
          />
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.9)' }}
            >
              <Heart size={22} color="#EF4444" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-white font-bold">Soporte Vital</h2>
              <p className="text-white/80 text-xs">Estamos contigo 24/7</p>
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed mb-4">
            No estás solo/a. Si estás pasando por un momento difícil, tienes apoyo aquí y ahora mismo.
          </p>
          <div className="flex gap-3">
            <a
              href="tel:106"
              className="flex-1 py-2.5 rounded-xl bg-white/20 text-white text-sm font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Phone size={14} />
              Llamar ahora
            </a>
            <button
              onClick={() => {
                const chatSection = document.getElementById('support-chat');
                chatSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 py-2.5 rounded-xl bg-white text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ color: '#1D4ED8' }}
            >
              <MessageCircle size={14} />
              Chat ahora
            </button>
          </div>
        </div>

        {/* Daily Mood Tracker */}
        <div className="bg-white dark:bg-[#151729] rounded-2xl p-4 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">¿Cómo estás hoy?</h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(217,119,6,0.12)', color: GOLD_LIGHT }}
            >
              +10 XP
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4">Registra tu estado de ánimo diario</p>
          <div className="flex justify-between mb-4">
            {moodOptions.map(mood => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className="flex flex-col items-center gap-1 transition-all"
                style={{ transform: selectedMood === mood.value ? 'scale(1.2)' : 'scale(1)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: selectedMood === mood.value ? mood.color : 'rgba(0,0,0,0.08)',
                    border: `2px solid ${selectedMood === mood.value ? mood.color : 'transparent'}`,
                  }}
                >
                  <EmojiIcon emoji={mood.emoji} size={18} color={selectedMood === mood.value ? 'white' : mood.color} strokeWidth={2} />
                </div>
                <span className="text-[10px] text-gray-400">{mood.label}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSaveMood}
              className="w-full py-3 rounded-xl text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
              style={{ background: moodSaved ? '#10B981' : GOLD_GRADIENT }}
            >
              {moodSaved
                ? <><CheckCircle size={14} /> ¡Estado registrado! +10 XP</>
                : <><Sparkles size={14} /> Guardar estado de ánimo</>}
            </motion.button>
          )}
        </div>

        {/* Mood History Chart */}
        <div className="bg-white dark:bg-[#151729] rounded-2xl p-4 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Historial de estado de ánimo</h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(217,119,6,0.12)', color: GOLD_LIGHT }}
            >
              +5 XP
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4">Visualiza tu estado de ánimo a lo largo de la semana</p>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart
              data={moodHistory}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <XAxis key="x-axis" dataKey="day" tickLine={false} axisLine={false} />
              <YAxis key="y-axis" type="number" domain={[1, 5]} tickLine={false} axisLine={false} />
              <Tooltip key="tooltip" />
              <Area
                key="area"
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorMood)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Support Chat */}
        <div id="support-chat" className="bg-white dark:bg-[#151729] rounded-2xl overflow-hidden mb-5 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-[#2A2D4A]">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: GRADIENT }}
              >
                <Heart size={14} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Asistente de Bienestar</h3>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span className="text-[10px]" style={{ color: TEAL }}>En línea</span>
                </div>
              </div>
              {/* Gold premium indicator */}
              <div
                className="ml-auto w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: GOLD_GRADIENT }}
              >
                <Sparkles size={12} className="text-white" />
              </div>
            </div>
          </div>
          <div className="p-4 max-h-48 overflow-y-auto space-y-3">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[80%] px-3 py-2 rounded-2xl text-sm"
                  style={
                    msg.sender === 'user'
                      ? { background: GRADIENT, color: 'white', borderBottomRightRadius: '4px' }
                      : { background: '#F3F4F6', color: '#1F2937', borderBottomLeftRadius: '4px' }
                  }
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4 flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escríbeme cómo te sientes..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1E2038] text-gray-800 dark:text-white placeholder-gray-400 text-sm focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-50"
              style={{ background: GRADIENT }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Resources */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Recursos de Bienestar</h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(217,119,6,0.12)', color: GOLD_LIGHT }}
            >
              ✦ Curado para ti
            </span>
          </div>
          <div className="space-y-3">
            {resources.map(resource => (
              <motion.div
                key={resource.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert(`Abriendo: ${resource.title} 📖`)}
                className="bg-white dark:bg-[#151729] rounded-2xl p-4 flex items-center gap-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: resource.color }}
                >
                  <EmojiIcon emoji={resource.emoji} size={22} color="white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{resource.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{resource.description}</p>
                  <span className="text-[10px] text-gray-400 mt-0.5 inline-block flex items-center gap-1">
                    <Clock size={10} /> {resource.duration} de lectura
                  </span>
                </div>
                <BookOpen size={16} className="text-gray-300 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Atención Presencial */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
          <h3 className="font-semibold text-blue-700 dark:text-blue-400 text-sm mb-2 flex items-center gap-1.5">
            <MapPin size={14} /> Atención Presencial
          </h3>
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
            Si necesitas hablar con alguien de manera más personal, te esperamos en:
          </p>
          <div className="space-y-3">
            <div className="bg-white dark:bg-[#151729] rounded-xl p-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(59,130,246,0.15)' }}
                >
                  <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                    Bloque A - Oficina de Bienestar
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Nuestro equipo está disponible para escucharte y ayudarte en lo que necesites.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      Lun-Vie: 8:00 AM - 5:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/campus-map')}
              className="w-full py-3 rounded-xl bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors active:scale-95"
            >
              <MapPin size={16} />
              Ver ubicación en el mapa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}