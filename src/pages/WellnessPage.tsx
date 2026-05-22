import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Sparkles, CheckCircle2, MapPin, ChevronLeft, Clock, Mail,
  Calendar, Shield, Dumbbell, Palette, Brain, ToggleLeft, ToggleRight,
  FileText, AlertTriangle, X, Search, ChevronRight
} from 'lucide-react';
import { GRADIENT, wellnessResources } from '../types/mockData';
import type { WellnessResource } from '../types/mockData';
import mascotImg from '../assets/pato_mascota.png';
import { useApp } from '../store/AppContext';

type CategoryKey = 'ALL' | 'RECOMMENDATIONS' | 'HEALTH' | 'SPORTS' | 'CULTURE' | 'EMOTIONAL_SUPPORT';
type LucideIcon = React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string; strokeWidth?: number }>;

const TABS: { key: CategoryKey; label: string; Icon: LucideIcon; color: string; bgColor: string }[] = [
  { key: 'ALL', label: 'Todos', Icon: Sparkles, color: '#6366F1', bgColor: 'rgba(99,102,241,0.12)' },
  { key: 'RECOMMENDATIONS', label: 'Recomendados', Icon: Heart, color: '#EC4899', bgColor: 'rgba(236,72,153,0.12)' },
  { key: 'HEALTH', label: 'Salud', Icon: Shield, color: '#10B981', bgColor: 'rgba(16,185,129,0.12)' },
  { key: 'SPORTS', label: 'Deporte', Icon: Dumbbell, color: '#3B82F6', bgColor: 'rgba(59,130,246,0.12)' },
  { key: 'CULTURE', label: 'Cultura', Icon: Palette, color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.12)' },
  { key: 'EMOTIONAL_SUPPORT', label: 'Apoyo', Icon: Brain, color: '#F59E0B', bgColor: 'rgba(245,158,11,0.12)' },
];

const CATEGORY_META: Record<string, { label: string; color: string; bgColor: string; Icon: LucideIcon }> = {
  RECOMMENDATIONS: { label: 'Recomendados', color: '#EC4899', bgColor: 'rgba(236,72,153,0.1)', Icon: Heart },
  HEALTH: { label: 'Salud', color: '#10B981', bgColor: 'rgba(16,185,129,0.1)', Icon: Shield },
  SPORTS: { label: 'Deporte', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.1)', Icon: Dumbbell },
  CULTURE: { label: 'Cultura', color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.1)', Icon: Palette },
  EMOTIONAL_SUPPORT: { label: 'Apoyo Emocional', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.1)', Icon: Brain },
};

interface QuestionOption {
  text: string;
  score: number;
}
interface Question {
  id: string;
  dimension: 'PHYSICAL' | 'EMOTIONAL' | 'ACADEMIC' | 'SOCIAL';
  dimensionLabel: string;
  text: string;
  options: QuestionOption[];
}

const SURVEY_QUESTIONS: Question[] = [
  // Físico
  {
    id: 'q1',
    dimension: 'PHYSICAL',
    dimensionLabel: 'Estado Físico',
    text: '¿Cómo calificarías tu calidad y cantidad de sueño esta semana?',
    options: [
      { text: 'Duermo menos de 5 horas o con muchas interrupciones', score: 1 },
      { text: 'Duermo entre 5 y 6 horas y me despierto cansado', score: 2 },
      { text: 'Duermo entre 7 y 8 horas y descanso aceptablemente', score: 3 },
      { text: 'Duermo más de 8 horas y despierto con total energía', score: 4 }
    ]
  },
  {
    id: 'q2',
    dimension: 'PHYSICAL',
    dimensionLabel: 'Estado Físico',
    text: '¿Con qué frecuencia has realizado actividad física esta semana?',
    options: [
      { text: 'Ninguna vez (Sedentarismo completo)', score: 1 },
      { text: '1 a 2 veces (Actividad ligera o caminatas)', score: 2 },
      { text: '3 a 4 veces (Entrenamiento moderado)', score: 3 },
      { text: '5 o más veces (Entrenamiento de alta intensidad)', score: 4 }
    ]
  },
  {
    id: 'q3',
    dimension: 'PHYSICAL',
    dimensionLabel: 'Estado Físico',
    text: '¿Cómo calificarías tu nivel de energía general para tus tareas?',
    options: [
      { text: 'Muy bajo (Me siento exhausto y sin fuerzas)', score: 1 },
      { text: 'Bajo (Tengo desgano y fatiga en varias partes del día)', score: 2 },
      { text: 'Normal (Tengo energía suficiente para lo necesario)', score: 3 },
      { text: 'Excelente (Me siento activo, fuerte y vital todo el día)', score: 4 }
    ]
  },
  // Emocional
  {
    id: 'q4',
    dimension: 'EMOCIONAL',
    dimensionLabel: 'Estado Emocional',
    text: '¿Con qué frecuencia te has sentido abrumado, ansioso o estresado?',
    options: [
      { text: 'Todo el tiempo (Siento que no puedo manejarlo)', score: 1 },
      { text: 'Frecuentemente (Varios días de alta tensión)', score: 2 },
      { text: 'A veces (Momentos puntuales de tensión pero manejables)', score: 3 },
      { text: 'Casi nunca o nunca (Me he sentido en completa calma)', score: 4 }
    ]
  },
  {
    id: 'q5',
    dimension: 'EMOCIONAL',
    dimensionLabel: 'Estado Emocional',
    text: '¿Cómo definirías tu estado de ánimo predominante en los últimos días?',
    options: [
      { text: 'Triste, apático, desmotivado o con sensación de vacío', score: 1 },
      { text: 'Ansioso, irritable, tenso o inestable', score: 2 },
      { text: 'Estable, tranquilo y con actitud neutra', score: 3 },
      { text: 'Feliz, entusiasmado, motivado y optimista', score: 4 }
    ]
  },
  // Académico
  {
    id: 'q6',
    dimension: 'ACADEMIC',
    dimensionLabel: 'Estado Académico',
    text: '¿Cómo valoras tu desempeño académico y tu comprensión en clases?',
    options: [
      { text: 'Muy deficiente (No entiendo temas y temo perder materias)', score: 1 },
      { text: 'Con dificultades (Me cuesta seguir el ritmo y tengo dudas)', score: 2 },
      { text: 'Aceptable (Entiendo la mayoría y voy aprobando)', score: 3 },
      { text: 'Excelente (Comprendo perfectamente y tengo buenas notas)', score: 4 }
    ]
  },
  {
    id: 'q7',
    dimension: 'ACADEMIC',
    dimensionLabel: 'Estado Académico',
    text: '¿Cuál es el estado de tus entregas de tareas y preparación de exámenes?',
    options: [
      { text: 'Muy atrasado (Se me acumularon muchas cosas)', score: 1 },
      { text: 'Con algunos retrasos que me generan preocupación', score: 2 },
      { text: 'Al día (Tengo todo organizado y entrego a tiempo)', score: 3 },
      { text: 'Adelantado (Planifico mis tareas y las termino antes)', score: 4 }
    ]
  },
  {
    id: 'q8',
    dimension: 'ACADEMIC',
    dimensionLabel: 'Estado Académico',
    text: '¿Qué tanto te preocupa el volumen de carga académica actual?',
    options: [
      { text: 'Preocupación extrema (Me paraliza y afecta mi salud)', score: 1 },
      { text: 'Preocupación alta (Siento demasiada presión constantemente)', score: 2 },
      { text: 'Preocupación moderada (Es pesado pero sé que puedo con ello)', score: 3 },
      { text: 'Poca o ninguna preocupación (Tengo control absoluto)', score: 4 }
    ]
  },
  // Social
  {
    id: 'q9',
    dimension: 'SOCIAL',
    dimensionLabel: 'Estado Social',
    text: '¿Cómo calificarías tu relación con compañeros y docentes en el campus?',
    options: [
      { text: 'Muy aislada (No hablo con nadie y me siento solo/a)', score: 1 },
      { text: 'Poco integrada (Tengo interacciones mínimas o superficiales)', score: 2 },
      { text: 'Satisfactoria (Tengo mi grupo de amigos y me llevo bien)', score: 3 },
      { text: 'Excelente (Participo en comunidades y soy muy sociable)', score: 4 }
    ]
  },
  {
    id: 'q10',
    dimension: 'SOCIAL',
    dimensionLabel: 'Estado Social',
    text: '¿Sentís que contás con una red de apoyo confiable ante cualquier problema?',
    options: [
      { text: 'Para nada (No tengo a quién recurrir)', score: 1 },
      { text: 'Muy poco (Dudo que alguien pueda o quiera ayudarme)', score: 2 },
      { text: 'Sí, cuento con un par de personas cercanas', score: 3 },
      { text: 'Definitivamente sí (Tengo familiares/amigos incondicionales)', score: 4 }
    ]
  }
];

const getRecommendations = (answers: Record<string, { score: number; text: string }>) => {
  const scores = {
    PHYSICAL: ((answers['q1']?.score || 3) + (answers['q2']?.score || 3) + (answers['q3']?.score || 3)) / 3,
    EMOTIONAL: ((answers['q4']?.score || 3) + (answers['q5']?.score || 3)) / 2,
    ACADEMIC: ((answers['q6']?.score || 3) + (answers['q7']?.score || 3) + (answers['q8']?.score || 3)) / 3,
    SOCIAL: ((answers['q9']?.score || 3) + (answers['q10']?.score || 3)) / 2,
  };

  const recIds = new Set<string>();

  if (scores.PHYSICAL < 2.5) {
    recIds.add('w3'); // Nutrición
    recIds.add('w5'); // Yoga
    recIds.add('w6'); // Natación
  }
  if (scores.EMOTIONAL < 2.5) {
    recIds.add('w10'); // Psicología
    recIds.add('w11'); // Grupo de estrés
    recIds.add('w5');  // Yoga
  }
  if (scores.ACADEMIC < 2.5) {
    recIds.add('w11'); // Grupo de estrés
    recIds.add('w12'); // Orientación vocacional
  }
  if (scores.SOCIAL < 2.5) {
    recIds.add('w4'); // Fútbol
    recIds.add('w7'); // Teatro
    recIds.add('w8'); // Fotografía
    recIds.add('w9'); // Cine Club
  }

  // Fallback if no low scores
  if (recIds.size === 0) {
    recIds.add('w5');
    recIds.add('w8');
    recIds.add('w4');
  }

  return Array.from(recIds);
};

function ResourceCard({ resource, isDark }: { resource: WellnessResource; isDark: boolean }) {
  const [requested, setRequested] = useState(false);
  const meta = CATEGORY_META[resource.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-[2rem] p-5 mb-4 shadow-sm border transition-all ${isDark ? 'bg-[#112240] border-white/5 hover:bg-[#1A2F50]' : 'bg-white border-gray-100 hover:shadow-xl'
        }`}
    >
      <div className="absolute top-0 right-0 p-4">
        {resource.active ? (
          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            Activo
          </span>
        ) : (
          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400">
            Inactivo
          </span>
        )}
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center flex-shrink-0 shadow-inner" style={{ background: meta.bgColor, color: meta.color }}>
          <meta.Icon size={24} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0 pr-16 py-1">
          <p className={`text-[9px] font-bold uppercase tracking-widest mb-1`} style={{ color: meta.color }}>{meta.label}</p>
          <h3 className={`font-black text-lg leading-tight truncate mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{resource.name}</h3>
          <p className={`text-sm font-medium leading-relaxed line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{resource.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mb-4">
        <div className={`flex items-center gap-2.5 text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <Clock size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} /> {resource.schedule}
        </div>
        {resource.location && (
          <div className={`flex items-center gap-2.5 text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <MapPin size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} /> {resource.location}
          </div>
        )}
        <div className={`flex items-center gap-2.5 text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <Mail size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
          <a href={`mailto:${resource.contact}`} className="underline decoration-dotted underline-offset-2" style={{ color: meta.color }}>
            {resource.contact}
          </a>
        </div>
      </div>

      {resource.category === 'EMOTIONAL_SUPPORT' && (
        <button
          onClick={() => {
            setRequested(true);
            setTimeout(() => setRequested(false), 2500);
          }}
          className={`w-full mt-2 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm ${requested ? 'text-white' : ''
            }`}
          style={{
            background: requested ? meta.color : (isDark ? 'rgba(255,255,255,0.05)' : meta.bgColor),
            color: requested ? 'white' : meta.color,
          }}
        >
          {requested ? (
            <><CheckCircle2 size={16} /> ¡Solicitud Enviada!</>
          ) : (
            <><Calendar size={16} /> Solicitar Cita Privada</>
          )}
        </button>
      )}
    </motion.div>
  );
}

export function WellnessPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [activeTab, setActiveTab] = useState<CategoryKey>('ALL');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Encuesta semanal states
  const [surveyCompleted, setSurveyCompleted] = useState<boolean>(() => {
    return localStorage.getItem('patricia_survey_completed') === 'true';
  });
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, { score: number; text: string }>>(() => {
    try {
      const saved = localStorage.getItem('patricia_survey_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [recommendations, setRecommendations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('patricia_survey_recommendations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [surveyStep, setSurveyStep] = useState<'WELCOME' | 'QUESTIONS' | 'CONFIRMATION'>('WELCOME');

  // Reporte de incidentes states
  const [incidentType, setIncidentType] = useState('infraestructura');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [studentId, setStudentId] = useState('');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleResetSurvey = () => {
    setSurveyAnswers({});
    setCurrentQuestionIndex(0);
    setSurveyStep('WELCOME');
    setShowSurveyModal(true);
  };

  const handleConfirmAndSendSurvey = () => {
    const recs = getRecommendations(surveyAnswers);
    setRecommendations(recs);
    setSurveyCompleted(true);
    localStorage.setItem('patricia_survey_completed', 'true');
    localStorage.setItem('patricia_survey_answers', JSON.stringify(surveyAnswers));
    localStorage.setItem('patricia_survey_recommendations', JSON.stringify(recs));

    setSuccessMessage('Encuesta enviada con éxito. ¡Gracias!');
    setTimeout(() => {
      setSuccessMessage('');
      setShowSurveyModal(false);
      setActiveTab('RECOMMENDATIONS');
    }, 2000);
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDescription.trim()) return;

    setSuccessMessage('Incidente reportado con éxito de manera confidencial.');

    // Clear state
    setIncidentDescription('');
    setIncidentLocation('');
    setStudentId('');
    setIsAnonymous(false);

    setTimeout(() => {
      setSuccessMessage('');
      setShowIncidentModal(false);
    }, 2500);
  };

  const filtered = wellnessResources.filter(r => {
    if (showActiveOnly && !r.active) return false;
    if (activeTab === 'RECOMMENDATIONS') {
      return recommendations.includes(r.id);
    }
    if (activeTab !== 'ALL' && r.category !== activeTab) return false;
    return true;
  });

  const groupedByCategory = (activeTab === 'ALL')
    ? (['HEALTH', 'SPORTS', 'CULTURE', 'EMOTIONAL_SUPPORT'] as const).map(cat => ({
      cat,
      resources: filtered.filter(r => r.category === cat),
    })).filter(g => g.resources.length > 0)
    : null;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      
      {/* Orbes locos animados en el fondo */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15], rotate: [0, 90, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[120px] pointer-events-none" 
        style={{ zIndex: 0 }} 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.25, 0.1], rotate: [0, -90, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" 
        style={{ zIndex: 0 }} 
      />

      {/* Main Container - Ancho completo con padding elegante para reducir espacio en laterales */}
      <div className="relative flex-1 w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 pb-24 pt-8" style={{ zIndex: 1 }}>
        
        {/* Premium Header interactivo */}
        <div className="relative overflow-visible mb-12">
          
          {/* El Pato Mascot - Animación loca y flotante */}
          <div className="absolute top-0 right-0 md:right-8 z-20 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-indigo-500/20 rounded-full blur-2xl"
            />
            <motion.img 
              initial={{ opacity: 0, scale: 0, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: [0, 5, -5, 0], y: [0, -20, 0] }}
              transition={{ 
                opacity: { duration: 0.8, type: "spring" },
                scale: { duration: 0.8, type: "spring", bounce: 0.5 },
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" }
              }}
              src={mascotImg} 
              alt="Pato Mascot"
              className="relative w-40 h-40 md:w-64 md:h-64 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] z-10"
              style={{ filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))' }}
            />
          </div>

          <div className="flex items-center gap-4 relative z-10 max-w-[70%]">
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-xl border ${
                isDark ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white/80 border-gray-200 text-gray-800 hover:bg-white'
              } transition-colors`}
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </motion.button>
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 ${
                  isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <Sparkles size={12} /> Espacio Vital
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                Bienestar <span className="animate-pulse">🩺</span>
              </motion.h1>
            </div>
          </div>
        </div>

      <div className="space-y-8">
        {/* Quick Actions con Hover loco */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSurveyStep('WELCOME');
              setShowSurveyModal(true);
            }}
            className={`p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden text-left shadow-2xl group ${
                isDark ? 'bg-gradient-to-br from-[#112240] to-[#0A192F] border border-indigo-500/30' : 'bg-gradient-to-br from-white to-indigo-50/50 border border-indigo-200'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 group-hover:bg-indigo-500/30 transition-transform duration-500 -translate-y-1/2 translate-x-1/2" />
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center mb-5 bg-indigo-500/10 text-indigo-500 backdrop-blur-md border border-indigo-500/20"
            >
              <FileText size={28} strokeWidth={2} />
            </motion.div>
            <h3 className={`font-black text-2xl mb-2 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Tu estado hoy</h3>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completa tu encuesta semanal y desbloquea recomendaciones cósmicas.</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowIncidentModal(true)}
            className={`p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden text-left shadow-2xl group ${
                isDark ? 'bg-gradient-to-br from-[#112240] to-[#0A192F] border border-amber-500/30' : 'bg-gradient-to-br from-white to-amber-50/50 border border-amber-200'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:scale-150 group-hover:bg-amber-500/30 transition-transform duration-500 -translate-y-1/2 translate-x-1/2" />
            <motion.div 
              whileHover={{ rotate: -15, scale: 1.1 }}
              className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center mb-5 bg-amber-500/10 text-amber-500 backdrop-blur-md border border-amber-500/20"
            >
              <AlertTriangle size={28} strokeWidth={2} />
            </motion.div>
            <h3 className={`font-black text-2xl mb-2 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Reportar incidente</h3>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>¿Pasó algo? Avísanos rápido, fácil y de forma segura.</p>
          </motion.button>
        </div>

        {/* Banner de Invitación a Encuesta con Carrusel loco */}
        <AnimatePresence>
          {!surveyCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="relative overflow-hidden rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] mb-8 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-700 opacity-90 z-0" />
              {/* Animación loca de ondas en el fondo */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[50%] -right-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.2)_360deg)] z-0"
              />
              
              <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-6">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0"
                >
                  <Sparkles size={32} className="text-white drop-shadow-md" />
                </motion.div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-white font-black text-2xl mb-2 drop-shadow-md">¿Cómo te sientes hoy?</h3>
                  <p className="text-emerald-50 text-sm md:text-base opacity-90 mb-4 max-w-lg mx-auto md:mx-0">
                    Completa la encuesta para que podamos recomendarte los mejores recursos, eventos y parches para ti.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSurveyStep('WELCOME');
                      setShowSurveyModal(true);
                    }}
                    className="px-6 py-3 bg-white text-emerald-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all inline-block"
                  >
                    Comenzar Test Cósmico 🚀
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Didactic Metrics & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* Energy Meter Cósmico */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-[2rem] p-6 shadow-xl relative overflow-hidden group ${
              isDark ? 'bg-gradient-to-br from-[#112240] to-[#0a192f] border border-cyan-500/30' : 'bg-gradient-to-br from-white to-cyan-50/50 border border-cyan-200'
            }`}
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-cyan-500/20 text-cyan-500 backdrop-blur-md border border-cyan-500/30">
                  <Brain size={24} className="animate-pulse" />
                </div>
                <div>
                  <h2 className={`font-black text-lg leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Energía del Campus</h2>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    Nivel Semanal
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {surveyCompleted ? '85%' : '???'}
                </span>
              </div>
            </div>
            
            {/* Animated Progress Bar */}
            <div className="h-4 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 relative z-10 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: surveyCompleted ? '85%' : '20%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full rounded-full relative overflow-hidden"
                style={{ background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd0cmFuc3BhcmVudCcvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yIE0wLDEwIGwxMCwtMTAgTTksMTEgbDIsLTInIHN0cm9rZT0ncmdiYSgyNTUsMjU1LDI1NSwwLjIpJyBzdHJva2Utd2lkdGg9JzInLz4KPC9zdmc+')] opacity-50" />
              </motion.div>
            </div>
            <p className={`mt-4 text-xs font-medium text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {surveyCompleted ? '¡La comunidad está vibrando alto esta semana!' : 'Completa tu encuesta para revelar la energía del campus.'}
            </p>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-[2rem] p-6 shadow-xl relative overflow-hidden group ${
              isDark ? 'bg-gradient-to-br from-[#112240] to-[#0a192f] border border-emerald-500/30' : 'bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200'
            }`}
          >
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-500/20 text-emerald-500 backdrop-blur-md border border-emerald-500/30">
                <MapPin size={24} />
              </div>
              <div>
                <h2 className={`font-black text-lg leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Atención Presencial</h2>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Oficina de Bienestar
                </p>
              </div>
            </div>
            <p className={`text-sm font-medium mb-6 relative z-10 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Encuéntranos en el <strong className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>Bloque A, Primer Piso</strong> <br />
              <span className="opacity-80">Lun–Vie 8:00 AM – 5:00 PM</span>
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/campus-map?highlight=bloque-a')}
              className="w-full py-3 rounded-[1rem] text-sm font-black flex items-center justify-center gap-2 text-white shadow-lg relative z-10"
              style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 8px 25px -5px rgba(16,185,129,0.4)' }}
            >
              <MapPin size={16} /> Ver en el mapa interactivo
            </motion.button>
          </motion.div>

        </div>

        {/* Resources Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`font-black text-xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Recursos 📚</h2>
          </div>
          <button
            onClick={() => setShowActiveOnly(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${showActiveOnly
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                : (isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-200 text-gray-500')
              }`}
          >
            {showActiveOnly ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            Activos
          </button>
        </div>

        {/* Horizontal Category Tabs con animación loca */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-6 mb-4 pt-4 px-2 -mx-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.key)}
              className="snap-start flex items-center gap-2 px-5 py-3 rounded-[1.5rem] text-sm font-bold whitespace-nowrap flex-shrink-0 transition-all shadow-lg border-2"
              style={{
                background: activeTab === tab.key ? tab.bgColor : (isDark ? 'rgba(17, 34, 64, 0.8)' : 'rgba(255, 255, 255, 0.9)'),
                color: activeTab === tab.key ? tab.color : (isDark ? '#9CA3AF' : '#64748B'),
                borderColor: activeTab === tab.key ? 'transparent' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                boxShadow: activeTab === tab.key ? `0 10px 20px -5px ${tab.bgColor}80` : undefined
              }}
            >
              <tab.Icon size={18} strokeWidth={2.5} className={activeTab === tab.key ? 'animate-bounce' : ''} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Resources List */}
        <AnimatePresence mode="wait">
          {activeTab === 'RECOMMENDATIONS' && !surveyCompleted ? (
            <motion.div
              key="no-survey"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-[2rem] p-8 text-center border shadow-lg ${isDark ? 'bg-[#112240] border-indigo-500/20' : 'bg-white border-indigo-100'
                }`}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-5 animate-pulse">
                <Heart size={32} strokeWidth={2} />
              </div>
              <h3 className={`font-black text-xl mb-2.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recomendaciones Personalizadas
              </h3>
              <p className={`text-sm font-medium leading-relaxed mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Completá tu encuesta semanal de bienestar para analizar tus niveles físico, emocional, académico y social. Así podremos sugerirte los recursos específicos del campus que más te pueden servir hoy.
              </p>
              <button
                onClick={() => {
                  setSurveyStep('WELCOME');
                  setShowSurveyModal(true);
                }}
                className="px-6 py-3.5 rounded-2xl text-sm font-black text-white shadow-lg transition-all active:scale-95 hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}
              >
                Completar Encuesta Semanal
              </button>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <div className={`w-20 h-20 mx-auto rounded-[2rem] flex items-center justify-center mb-4 shadow-inner ${isDark ? 'bg-[#112240]' : 'bg-white'}`}>
                <Search size={32} className={isDark ? 'text-gray-600' : 'text-gray-300'} />
              </div>
              <p className={`font-black text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Nada por aquí</p>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {showActiveOnly ? 'No hay recursos activos.' : 'Categoría sin contenido.'}
              </p>
            </motion.div>
          ) : groupedByCategory ? (
            <motion.div key="grouped" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {groupedByCategory.map(({ cat, resources }) => {
                const meta = CATEGORY_META[cat];
                return (
                  <div key={cat} className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: meta.bgColor, color: meta.color }}>
                        <meta.Icon size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>{meta.label}</span>
                      <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-[#112240] text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                        {resources.length}
                      </span>
                    </div>
                    {resources.map(r => <ResourceCard key={r.id} resource={r} isDark={isDark} />)}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
              {activeTab === 'RECOMMENDATIONS' && surveyCompleted && (
                <div className={`p-5 rounded-[2rem] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border shadow-sm ${isDark ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50/55 border-indigo-100'
                  }`}>
                  <div>
                    <h4 className={`font-black text-sm mb-1 ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
                      🎯 Recomendaciones Personalizadas
                    </h4>
                    <p className={`text-xs font-medium leading-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Sugerencias basadas en tus respuestas físicas, emocionales, académicas y sociales.
                    </p>
                  </div>
                  <button
                    onClick={handleResetSurvey}
                    className="flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black text-white active:scale-95 transition-transform hover:brightness-110 shadow-md"
                    style={{ background: 'linear-gradient(135deg, #EC4899 0%, #D946EF 100%)' }}
                  >
                    Actualizar Encuesta
                  </button>
                </div>
              )}
              {filtered.map(r => <ResourceCard key={r.id} resource={r} isDark={isDark} />)}
            </motion.div>
          )}
        </AnimatePresence>


      </div>

      {/* SURVEY MODAL (BOTTOM SHEET) */}
      <AnimatePresence>
        {showSurveyModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSurveyModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.8 }}
              className={`fixed bottom-0 left-0 right-0 z-[70] w-full max-h-[92vh] overflow-hidden rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col ${isDark ? 'bg-[#0B1526]' : 'bg-white'}`}
            >
              {/* Dynamic Header */}
              <div className="relative w-full h-40 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600">
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
                  <div className="w-12 h-1.5 rounded-full bg-white/40 mx-auto mt-2 absolute left-1/2 -translate-x-1/2 backdrop-blur-md" />
                  <div />
                  <button onClick={() => setShowSurveyModal(false)} className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
                    <X size={18} />
                  </button>
                </div>
                <div className="absolute -bottom-8 left-8 w-20 h-20 rounded-[1.5rem] shadow-xl flex items-center justify-center z-20 border-4 border-white dark:border-[#0B1526] bg-white dark:bg-[#112240]">
                  <FileText size={36} className="text-indigo-500" />
                </div>
              </div>

              <div className="px-8 pt-14 pb-8 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                <h3 className={`font-black text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Encuesta Semanal</h3>
                <p className={`text-sm font-medium mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ayúdanos a entender cómo te sientes para ofrecerte el mejor apoyo.</p>

                {successMessage ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                      className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-6">
                      <CheckCircle2 size={48} className="text-emerald-500" />
                    </motion.div>
                    <h3 className={`font-black text-xl mb-2 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>{successMessage}</h3>
                  </div>
                ) : surveyStep === 'WELCOME' ? (
                  <div className="space-y-6 pb-6">
                    <p className={`text-sm font-semibold leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Esta autoevaluación consta de <strong>10 preguntas breves</strong> divididas en 4 dimensiones esenciales para tu bienestar universitario.
                      Nos permitirá sugerirte de manera personalizada los programas, grupos y servicios de apoyo adecuados.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="text-indigo-500 mb-2 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <Shield size={16} /> Físico
                        </div>
                        <p className={`text-[11px] font-medium leading-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Sueño, ejercicio y vitalidad general.
                        </p>
                      </div>

                      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="text-amber-500 mb-2 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <Brain size={16} /> Emocional
                        </div>
                        <p className={`text-[11px] font-medium leading-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Estrés, ansiedad y estado de ánimo.
                        </p>
                      </div>

                      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="text-emerald-500 mb-2 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <FileText size={16} /> Académico
                        </div>
                        <p className={`text-[11px] font-medium leading-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Comprensión, entregas y volumen de carga.
                        </p>
                      </div>

                      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="text-pink-500 mb-2 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <Heart size={16} /> Social
                        </div>
                        <p className={`text-[11px] font-medium leading-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Relaciones en el campus y red de apoyo.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSurveyAnswers({});
                        setCurrentQuestionIndex(0);
                        setSurveyStep('QUESTIONS');
                      }}
                      className="w-full py-4 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                      style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', boxShadow: '0 8px 25px -5px rgba(99,102,241,0.4)' }}
                    >
                      Iniciar Encuesta
                    </button>
                  </div>
                ) : surveyStep === 'QUESTIONS' ? (
                  <div className="space-y-6 pb-6">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-600'
                          }`}>
                          Pregunta {currentQuestionIndex + 1} de 10
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${SURVEY_QUESTIONS[currentQuestionIndex].dimension === 'PHYSICAL' ? 'bg-indigo-500/10 text-indigo-500' :
                            SURVEY_QUESTIONS[currentQuestionIndex].dimension === 'EMOTIONAL' || SURVEY_QUESTIONS[currentQuestionIndex].dimension === 'EMOCIONAL' ? 'bg-amber-500/10 text-amber-500' :
                              SURVEY_QUESTIONS[currentQuestionIndex].dimension === 'ACADEMIC' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-pink-500/10 text-pink-500'
                          }`}>
                          {SURVEY_QUESTIONS[currentQuestionIndex].dimensionLabel}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-indigo-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Question text */}
                    <h4 className={`font-black text-lg leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {SURVEY_QUESTIONS[currentQuestionIndex].text}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-3">
                      {SURVEY_QUESTIONS[currentQuestionIndex].options.map((opt, i) => {
                        const questionId = SURVEY_QUESTIONS[currentQuestionIndex].id;
                        const isSelected = surveyAnswers[questionId]?.score === opt.score;
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setSurveyAnswers(prev => ({
                                ...prev,
                                [questionId]: { score: opt.score, text: opt.text }
                              }));
                            }}
                            className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${isSelected
                                ? (isDark ? 'bg-indigo-500/20 border-indigo-500 text-white font-bold' : 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-1 ring-indigo-500')
                                : (isDark ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100')
                              }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${isSelected ? 'bg-indigo-500 text-white' : (isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500')
                              }`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="flex-1 text-sm font-medium leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          if (currentQuestionIndex > 0) {
                            setCurrentQuestionIndex(idx => idx - 1);
                          } else {
                            setSurveyStep('WELCOME');
                          }
                        }}
                        className={`flex-1 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-1.5 border active:scale-95 transition-transform ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-700'
                          }`}
                      >
                        <ChevronLeft size={16} /> Atrás
                      </button>

                      <button
                        disabled={!surveyAnswers[SURVEY_QUESTIONS[currentQuestionIndex].id]}
                        onClick={() => {
                          if (currentQuestionIndex < 9) {
                            setCurrentQuestionIndex(idx => idx + 1);
                          } else {
                            setSurveyStep('CONFIRMATION');
                          }
                        }}
                        className={`flex-1 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-1.5 text-white active:scale-95 transition-transform ${surveyAnswers[SURVEY_QUESTIONS[currentQuestionIndex].id]
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md hover:brightness-110'
                            : 'bg-gray-300 dark:bg-white/10 cursor-not-allowed opacity-50'
                          }`}
                      >
                        {currentQuestionIndex === 9 ? 'Ver Resumen' : 'Siguiente'} <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 pb-6">
                    <p className={`text-sm font-semibold leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Revisá tus respuestas antes de enviar. Podés hacer clic en <strong>Editar</strong> para modificar cualquiera de ellas.
                    </p>

                    <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                      {SURVEY_QUESTIONS.map((q, idx) => {
                        const ans = surveyAnswers[q.id];
                        return (
                          <div
                            key={q.id}
                            className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'
                              }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${q.dimension === 'PHYSICAL' ? 'bg-indigo-500/10 text-indigo-500' :
                                    q.dimension === 'EMOTIONAL' || q.dimension === 'EMOCIONAL' ? 'bg-amber-500/10 text-amber-500' :
                                      q.dimension === 'ACADEMIC' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-pink-500/10 text-pink-500'
                                  }`}>
                                  {q.dimensionLabel}
                                </span>
                                <span className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  Pregunta {idx + 1}
                                </span>
                              </div>
                              <p className={`text-xs font-bold leading-snug mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {q.text}
                              </p>
                              <p className={`text-[11px] font-medium leading-relaxed ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                                {ans ? ans.text : 'No respondido'}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setCurrentQuestionIndex(idx);
                                setSurveyStep('QUESTIONS');
                              }}
                              className={`flex-shrink-0 text-xs font-black px-3 py-1.5 rounded-xl border transition-all active:scale-95 ${isDark ? 'border-white/10 text-gray-300 bg-white/5 hover:bg-white/10' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                            >
                              Editar
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          setCurrentQuestionIndex(9);
                          setSurveyStep('QUESTIONS');
                        }}
                        className={`flex-1 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-1.5 border active:scale-95 transition-transform ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-700'
                          }`}
                      >
                        Atrás
                      </button>

                      <button
                        onClick={handleConfirmAndSendSurvey}
                        className="flex-1 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-1.5 text-white shadow-md active:scale-95 transition-transform"
                        style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 8px 25px -5px rgba(16,185,129,0.4)' }}
                      >
                        <CheckCircle2 size={16} /> Confirmar y Enviar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* INCIDENT MODAL (BOTTOM SHEET) */}
      <AnimatePresence>
        {showIncidentModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowIncidentModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.8 }}
              className={`fixed bottom-0 left-0 right-0 z-[70] w-full max-h-[92vh] overflow-hidden rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col ${isDark ? 'bg-[#0B1526]' : 'bg-white'}`}
            >
              <div className="relative w-full h-40 flex-shrink-0 bg-gradient-to-br from-amber-500 to-orange-600">
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
                  <div className="w-12 h-1.5 rounded-full bg-white/40 mx-auto mt-2 absolute left-1/2 -translate-x-1/2 backdrop-blur-md" />
                  <div />
                  <button onClick={() => setShowIncidentModal(false)} className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
                    <X size={18} />
                  </button>
                </div>
                <div className="absolute -bottom-8 left-8 w-20 h-20 rounded-[1.5rem] shadow-xl flex items-center justify-center z-20 border-4 border-white dark:border-[#0B1526] bg-white dark:bg-[#112240]">
                  <AlertTriangle size={36} className="text-amber-500" />
                </div>
              </div>

              <div className="px-8 pt-14 pb-8 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                <h3 className={`font-black text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Reportar Incidente</h3>
                <p className={`text-sm font-medium mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Toda la información es confidencial. Te ayudaremos lo más pronto posible.</p>

                {successMessage ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                      className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-6">
                      <CheckCircle2 size={48} className="text-emerald-500" />
                    </motion.div>
                    <h3 className={`font-black text-xl mb-2 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>{successMessage}</h3>
                  </div>
                ) : (
                  <form onSubmit={handleIncidentSubmit} className="space-y-5 pb-6">
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Tipo de Incidente</label>
                      <div className="relative">
                        <select
                          value={incidentType}
                          onChange={e => setIncidentType(e.target.value)}
                          className={`w-full pl-5 pr-10 py-4 rounded-[1.25rem] font-medium text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'
                            }`}
                        >
                          <option value="infraestructura" className="text-gray-900">Infraestructura</option>
                          <option value="convivencia" className="text-gray-900">Convivencia</option>
                          <option value="seguridad" className="text-gray-900">Seguridad</option>
                          <option value="otro" className="text-gray-900">Otro</option>
                        </select>
                        <ChevronRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Ubicación</label>
                      <input
                        placeholder="Bloque, piso, salón..."
                        value={incidentLocation}
                        onChange={e => setIncidentLocation(e.target.value)}
                        className={`w-full px-5 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${isDark ? 'bg-white/5 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                          }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Descripción</label>
                      <textarea
                        placeholder="Detalla lo sucedido..."
                        rows={4}
                        value={incidentDescription}
                        onChange={e => setIncidentDescription(e.target.value)}
                        className={`w-full px-5 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none transition-all ${isDark ? 'bg-white/5 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                          }`}
                      />
                    </div>

                    {!isAnonymous && (
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>ID de Estudiante (Opcional)</label>
                        <input
                          placeholder="Tu ID..."
                          value={studentId}
                          onChange={e => setStudentId(e.target.value)}
                          className={`w-full px-5 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${isDark ? 'bg-white/5 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                            }`}
                        />
                      </div>
                    )}

                    <label className="flex items-center gap-3 pt-2 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isDark ? 'border-gray-500 group-hover:border-amber-400' : 'border-gray-300 group-hover:border-amber-500'
                        } ${isAnonymous ? 'border-amber-500 bg-amber-500/10' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={e => {
                            setIsAnonymous(e.target.checked);
                            if (e.target.checked) {
                              setStudentId('');
                            }
                          }}
                          className="opacity-0 absolute"
                        />
                        {isAnonymous && <CheckCircle2 size={16} className="text-amber-500" />}
                      </div>
                      <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Reportar anónimamente</span>
                    </label>
                    <button type="submit" className="w-full py-4 mt-2 rounded-2xl text-white font-black text-base flex items-center justify-center shadow-lg active:scale-95 transition-transform bg-gradient-to-r from-amber-500 to-orange-600" style={{ boxShadow: '0 8px 25px -5px rgba(245,158,11,0.4)' }}>
                      Enviar Reporte Confidencial
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}