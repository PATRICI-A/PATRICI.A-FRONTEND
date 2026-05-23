import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Sparkles, CheckCircle2, MapPin, ChevronLeft, ChevronRight, Clock, Mail,
  Shield, Dumbbell, Palette, Brain, ToggleLeft, ToggleRight,
  FileText, AlertTriangle, X, Search,
} from 'lucide-react';
import { GRADIENT, TEAL, TEAL_GRADIENT, wellnessResources } from '../types/mockData';
import type { WellnessResource } from '../types/mockData';
import mascotImg from '../assets/PATYPSICO.png';
import energiaCampusImg from '../assets/EnergiaCampus-removebg-preview.png';
import saludImg from '../assets/Salud-removebg-preview.png';
import enfermeriaImg from '../assets/Enfermeria-removebg-preview.png';
import nutricionImg from '../assets/Nutricion-removebg-preview.png';
import futbolImg from '../assets/Futbol-removebg-preview.png';
import yogaImg from '../assets/Yoga-removebg-preview.png';
import natacionImg from '../assets/Natacion-removebg-preview.png';
import teatroImg from '../assets/Teatro-removebg-preview.png';
import fotografiaImg from '../assets/Fotografia-removebg-preview.png';
import cineImg from '../assets/Cine-removebg-preview.png';
import psicologiaImg from '../assets/Psicologia-removebg-preview.png';
import apoyoImg from '../assets/Apoyo-removebg-preview.png';
import proyectoVidaImg from '../assets/ProyectoVida-removebg-preview.png';
import { useApp } from '../store/AppContext';

const RESOURCE_IMAGES: Record<string, string> = {
  w1: saludImg,
  w2: enfermeriaImg,
  w3: nutricionImg,
  w4: futbolImg,
  w5: yogaImg,
  w6: natacionImg,
  w7: teatroImg,
  w8: fotografiaImg,
  w9: cineImg,
  w10: psicologiaImg,
  w11: apoyoImg,
  w12: proyectoVidaImg,
};

type CategoryKey = 'ALL' | 'RECOMMENDATIONS' | 'SALUD' | 'DEPORTE' | 'CULTURA' | 'MENTAL_HEALTH';
type LucideIcon = React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string; strokeWidth?: number }>;

const TABS: { key: CategoryKey; label: string; Icon: LucideIcon; color: string; bg: string }[] = [
  { key: 'ALL',            label: 'Todos',        Icon: Sparkles, color: '#6366F1', bg: 'rgba(99,102,241,0.12)'  },
  { key: 'RECOMMENDATIONS',label: 'Para ti',      Icon: Heart,    color: '#EC4899', bg: 'rgba(236,72,153,0.12)'  },
  { key: 'SALUD',          label: 'Salud',        Icon: Shield,   color: '#10B981', bg: 'rgba(16,185,129,0.12)'  },
  { key: 'DEPORTE',        label: 'Deporte',      Icon: Dumbbell, color: '#3B82F6', bg: 'rgba(59,130,246,0.12)'  },
  { key: 'CULTURA',        label: 'Cultura',      Icon: Palette,  color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)'  },
  { key: 'MENTAL_HEALTH',  label: 'Apoyo',        Icon: Brain,    color: '#F59E0B', bg: 'rgba(245,158,11,0.12)'  },
];

const CATEGORY_META: Record<string, { label: string; color: string; bg: string; Icon: LucideIcon }> = {
  RECOMMENDATIONS: { label: 'Para ti',         color: '#EC4899', bg: 'rgba(236,72,153,0.12)',  Icon: Heart    },
  SALUD:           { label: 'Salud',            color: '#10B981', bg: 'rgba(16,185,129,0.12)',  Icon: Shield   },
  DEPORTE:         { label: 'Deporte',          color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  Icon: Dumbbell },
  CULTURA:         { label: 'Cultura',          color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)',  Icon: Palette  },
  MENTAL_HEALTH:   { label: 'Apoyo Emocional',  color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  Icon: Brain    },
};

interface QuestionOption { text: string; score: number; }
interface Question { id: string; dimension: string; dimensionLabel: string; text: string; options: QuestionOption[]; }

const SURVEY_QUESTIONS: Question[] = [
  { id: 'q1', dimension: 'PHYSICAL', dimensionLabel: 'Estado Físico', text: '¿Cómo calificarías tu calidad y cantidad de sueño esta semana?', options: [
    { text: 'Duermo menos de 5 horas o con muchas interrupciones', score: 1 },
    { text: 'Duermo entre 5 y 6 horas y me despierto cansado', score: 2 },
    { text: 'Duermo entre 7 y 8 horas y descanso aceptablemente', score: 3 },
    { text: 'Duermo más de 8 horas y despierto con total energía', score: 4 },
  ]},
  { id: 'q2', dimension: 'PHYSICAL', dimensionLabel: 'Estado Físico', text: '¿Con qué frecuencia has realizado actividad física esta semana?', options: [
    { text: 'Ninguna vez (Sedentarismo completo)', score: 1 },
    { text: '1 a 2 veces (Actividad ligera o caminatas)', score: 2 },
    { text: '3 a 4 veces (Entrenamiento moderado)', score: 3 },
    { text: '5 o más veces (Entrenamiento de alta intensidad)', score: 4 },
  ]},
  { id: 'q3', dimension: 'PHYSICAL', dimensionLabel: 'Estado Físico', text: '¿Cómo calificarías tu nivel de energía general para tus tareas?', options: [
    { text: 'Muy bajo (Me siento exhausto y sin fuerzas)', score: 1 },
    { text: 'Bajo (Tengo desgano y fatiga en varias partes del día)', score: 2 },
    { text: 'Normal (Tengo energía suficiente para lo necesario)', score: 3 },
    { text: 'Excelente (Me siento activo, fuerte y vital todo el día)', score: 4 },
  ]},
  { id: 'q4', dimension: 'EMOTIONAL', dimensionLabel: 'Estado Emocional', text: '¿Con qué frecuencia te has sentido abrumado, ansioso o estresado?', options: [
    { text: 'Todo el tiempo (Siento que no puedo manejarlo)', score: 1 },
    { text: 'Frecuentemente (Varios días de alta tensión)', score: 2 },
    { text: 'A veces (Momentos puntuales de tensión pero manejables)', score: 3 },
    { text: 'Casi nunca o nunca (Me he sentido en completa calma)', score: 4 },
  ]},
  { id: 'q5', dimension: 'EMOTIONAL', dimensionLabel: 'Estado Emocional', text: '¿Cómo definirías tu estado de ánimo predominante en los últimos días?', options: [
    { text: 'Triste, apático, desmotivado o con sensación de vacío', score: 1 },
    { text: 'Ansioso, irritable, tenso o inestable', score: 2 },
    { text: 'Estable, tranquilo y con actitud neutra', score: 3 },
    { text: 'Feliz, entusiasmado, motivado y optimista', score: 4 },
  ]},
  { id: 'q6', dimension: 'ACADEMIC', dimensionLabel: 'Estado Académico', text: '¿Cómo valoras tu desempeño académico y tu comprensión en clases?', options: [
    { text: 'Muy deficiente (No entiendo temas y temo perder materias)', score: 1 },
    { text: 'Con dificultades (Me cuesta seguir el ritmo y tengo dudas)', score: 2 },
    { text: 'Aceptable (Entiendo la mayoría y voy aprobando)', score: 3 },
    { text: 'Excelente (Comprendo perfectamente y tengo buenas notas)', score: 4 },
  ]},
  { id: 'q7', dimension: 'ACADEMIC', dimensionLabel: 'Estado Académico', text: '¿Cuál es el estado de tus entregas de tareas y preparación de exámenes?', options: [
    { text: 'Muy atrasado (Se me acumularon muchas cosas)', score: 1 },
    { text: 'Con algunos retrasos que me generan preocupación', score: 2 },
    { text: 'Al día (Tengo todo organizado y entrego a tiempo)', score: 3 },
    { text: 'Adelantado (Planifico mis tareas y las termino antes)', score: 4 },
  ]},
  { id: 'q8', dimension: 'ACADEMIC', dimensionLabel: 'Estado Académico', text: '¿Qué tanto te preocupa el volumen de carga académica actual?', options: [
    { text: 'Preocupación extrema (Me paraliza y afecta mi salud)', score: 1 },
    { text: 'Preocupación alta (Siento demasiada presión constantemente)', score: 2 },
    { text: 'Preocupación moderada (Es pesado pero sé que puedo con ello)', score: 3 },
    { text: 'Poca o ninguna preocupación (Tengo control absoluto)', score: 4 },
  ]},
  { id: 'q9', dimension: 'SOCIAL', dimensionLabel: 'Estado Social', text: '¿Cómo calificarías tu relación con compañeros y docentes en el campus?', options: [
    { text: 'Muy aislada (No hablo con nadie y me siento solo/a)', score: 1 },
    { text: 'Poco integrada (Tengo interacciones mínimas o superficiales)', score: 2 },
    { text: 'Satisfactoria (Tengo mi grupo de amigos y me llevo bien)', score: 3 },
    { text: 'Excelente (Participo en comunidades y soy muy sociable)', score: 4 },
  ]},
  { id: 'q10', dimension: 'SOCIAL', dimensionLabel: 'Estado Social', text: '¿Sentís que contás con una red de apoyo confiable ante cualquier problema?', options: [
    { text: 'Para nada (No tengo a quién recurrir)', score: 1 },
    { text: 'Muy poco (Dudo que alguien pueda o quiera ayudarme)', score: 2 },
    { text: 'Sí, cuento con un par de personas cercanas', score: 3 },
    { text: 'Definitivamente sí (Tengo familiares/amigos incondicionales)', score: 4 },
  ]},
];

const getRecommendations = (answers: Record<string, { score: number; text: string }>) => {
  const scores = {
    PHYSICAL:  ((answers['q1']?.score || 3) + (answers['q2']?.score || 3) + (answers['q3']?.score || 3)) / 3,
    EMOTIONAL: ((answers['q4']?.score || 3) + (answers['q5']?.score || 3)) / 2,
    ACADEMIC:  ((answers['q6']?.score || 3) + (answers['q7']?.score || 3) + (answers['q8']?.score || 3)) / 3,
    SOCIAL:    ((answers['q9']?.score || 3) + (answers['q10']?.score || 3)) / 2,
  };
  const recIds = new Set<string>();
  if (scores.PHYSICAL  < 2.5) { recIds.add('w3'); recIds.add('w5'); recIds.add('w6'); }
  if (scores.EMOTIONAL < 2.5) { recIds.add('w10'); recIds.add('w11'); recIds.add('w5'); }
  if (scores.ACADEMIC  < 2.5) { recIds.add('w11'); recIds.add('w12'); }
  if (scores.SOCIAL    < 2.5) { recIds.add('w4'); recIds.add('w7'); recIds.add('w8'); recIds.add('w9'); }
  if (recIds.size === 0)       { recIds.add('w5'); recIds.add('w8'); recIds.add('w4'); }
  return Array.from(recIds);
};

function ResourceCard({ resource, isDark, image }: { resource: WellnessResource; isDark: boolean; image?: string }) {
  const meta = CATEGORY_META[resource.category];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className="rounded-2xl p-4 mb-3 relative overflow-hidden"
      style={isDark
        ? { background: '#112240', border: '1px solid rgba(30,58,95,0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }
        : { background: 'rgba(253,252,248,0.95)', border: '1px solid rgba(10,25,47,0.07)', boxShadow: '0 4px 20px rgba(10,25,47,0.08)' }
      }
    >
      {image && (
        <img
          src={image}
          alt=""
          className="hidden sm:block absolute bottom-0 right-0 sm:h-28 md:h-36 object-contain object-bottom pointer-events-none select-none"
          style={{ opacity: 0.9 }}
        />
      )}
      {/* Header row */}
      <div className="flex items-center gap-3 mb-3 sm:pr-32 md:pr-40">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg, color: meta.color }}>
          <meta.Icon size={22} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm sm:text-base text-gray-800 dark:text-white leading-tight">{resource.name}</p>
            {resource.active
              ? <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>Activo</span>
              : <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: isDark ? '#64748B' : '#9CA3AF' }}>Inactivo</span>
            }
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: meta.color }}>{meta.label}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed sm:pl-[60px] sm:pr-32 md:pr-40">{resource.description}</p>

      {/* Info row */}
      <div className="sm:pl-[60px] sm:pr-32 md:pr-40 flex flex-wrap gap-x-3 gap-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <Clock size={12} className="flex-shrink-0" /> {resource.schedule}
        </div>
        {resource.location && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <MapPin size={12} className="flex-shrink-0" /> {resource.location}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs">
          <Mail size={12} className="flex-shrink-0 text-gray-400" />
          <a href={`mailto:${resource.contact}`} className="underline decoration-dotted underline-offset-2 truncate" style={{ color: meta.color }}>
            {resource.contact}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function WellnessPage() {
  const navigate = useNavigate();
  const { isDark, addXP } = useApp();
  const [activeTab, setActiveTab] = useState<CategoryKey>('ALL');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [surveyCompleted, setSurveyCompleted] = useState<boolean>(() =>
    localStorage.getItem('patricia_survey_completed') === 'true'
  );
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, { score: number; text: string }>>(() => {
    try { const s = localStorage.getItem('patricia_survey_answers'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [recommendations, setRecommendations] = useState<string[]>(() => {
    try { const s = localStorage.getItem('patricia_survey_recommendations'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [surveyStep, setSurveyStep] = useState<'WELCOME' | 'QUESTIONS' | 'CONFIRMATION'>('WELCOME');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [incidentType, setIncidentType] = useState('infraestructura');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [studentId, setStudentId] = useState('');

  const handleResetSurvey = () => {
    setSurveyAnswers({});
    setCurrentQuestionIndex(0);
    setSurveyStep('WELCOME');
    setShowSurveyModal(true);
  };

  const XP_REWARD = 100;

  const handleConfirmAndSendSurvey = () => {
    const recs = getRecommendations(surveyAnswers);
    setRecommendations(recs);
    setSurveyCompleted(true);
    localStorage.setItem('patricia_survey_completed', 'true');
    localStorage.setItem('patricia_survey_answers', JSON.stringify(surveyAnswers));
    localStorage.setItem('patricia_survey_recommendations', JSON.stringify(recs));
    addXP(XP_REWARD);
    setSuccessMessage(`¡+${XP_REWARD} XP! Encuesta enviada con éxito.`);
    setTimeout(() => { setSuccessMessage(''); setShowSurveyModal(false); setActiveTab('RECOMMENDATIONS'); }, 2500);
  };

  const handleIncidentSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!incidentDescription.trim()) return;
    setSuccessMessage('Incidente reportado con éxito de manera confidencial.');
    setIncidentDescription(''); setIncidentLocation(''); setStudentId(''); setIsAnonymous(false);
    setTimeout(() => { setSuccessMessage(''); setShowIncidentModal(false); }, 2500);
  };

  const filtered = wellnessResources.filter(r => {
    if (showActiveOnly && !r.active) return false;
    if (activeTab === 'RECOMMENDATIONS') return recommendations.includes(r.id);
    if (activeTab !== 'ALL' && r.category !== activeTab) return false;
    return true;
  });

  const groupedByCategory = (activeTab === 'ALL')
    ? (['SALUD', 'DEPORTE', 'CULTURA', 'MENTAL_HEALTH'] as const).map(cat => ({
        cat,
        resources: filtered.filter(r => r.category === cat),
      })).filter(g => g.resources.length > 0)
    : null;

  const cardStyle = isDark
    ? { background: '#112240', border: '1px solid rgba(30,58,95,0.3)', boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }
    : { background: 'rgba(253,252,248,0.95)', border: '1px solid rgba(10,25,47,0.06)', boxShadow: '0 2px 16px rgba(10,25,47,0.07)' };

  return (
    <div className="w-full md:w-4/6 md:mx-auto flex flex-col min-h-screen pb-4">

      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: isDark ? 'rgba(23,42,69,0.8)' : 'rgba(10,25,47,0.07)', color: isDark ? '#9CA3AF' : '#6E7A8A' }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">💙 Bienestar</h1>
            <p className="text-base text-gray-400">Tu salud y bienestar en el campus</p>
          </div>
        </div>
      </div>

      {/* Banner encuesta / mascot */}
      <section className="px-5 mb-6">
        <AnimatePresence mode="wait">
          {!surveyCompleted ? (
            <motion.button
              key="survey-cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => { setSurveyStep('WELCOME'); setShowSurveyModal(true); }}
              className="w-full rounded-3xl overflow-hidden text-left relative"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 60%, #047857 100%)',
                boxShadow: '0 8px 32px rgba(16,185,129,0.3), 0 2px 8px rgba(0,0,0,0.15)',
                border: '1.5px solid rgba(16,185,129,0.4)',
              }}
            >
              <img
                src={mascotImg}
                alt=""
                className="absolute h-40 sm:h-52 md:h-60 object-contain object-bottom pointer-events-none"
                style={{
                  bottom: '-20px',
                  right: '-70px',
                  opacity: 0.88,
                  filter: 'blur(0.6px) drop-shadow(0 8px 24px rgba(0,0,0,0.25))',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 55%, rgba(0,0,0,0.85) 80%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 55%, rgba(0,0,0,0.85) 80%, transparent 100%)',
                }}
              />
              <div className="relative p-4 sm:p-6 pr-32 sm:pr-44">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-black text-white text-sm leading-tight">Encuesta Semanal</p>
                    <p className="text-white/70 text-xs">patrici.a · Bienestar</p>
                  </div>
                </div>
                <h2 className="text-white font-bold text-lg mb-1">¿Cómo te sientes hoy?</h2>
                <p className="text-white/75 text-sm mb-4">Completa 10 preguntas y recibe recursos personalizados para ti.</p>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-emerald-700 text-sm font-bold shadow">
                  Comenzar test <ChevronRight size={14} />
                </span>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="survey-done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 flex items-center justify-between"
              style={cardStyle}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800 dark:text-white">Encuesta completada</p>
                  <p className="text-xs text-gray-400">Tus recomendaciones están listas</p>
                </div>
              </div>
              <button
                onClick={handleResetSurvey}
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: '#10B981' }}
              >
                Repetir <ChevronRight size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Action + Info cards */}
      <section className="px-5 mb-6 flex flex-col gap-3">

        {/* Reportar incidente */}
        <motion.button
          whileHover={{ scale: 1.015, translateY: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => setShowIncidentModal(true)}
          className="w-full rounded-[2rem] p-5 flex items-center gap-4 text-left transition-all duration-300"
          style={isDark ? {
            background: 'linear-gradient(135deg, #0A192F 0%, #1C1200 60%, #0A192F 100%)',
            border: '1.5px solid rgba(245,158,11,0.3)',
            boxShadow: '0 12px 32px rgba(245,158,11,0.12), 0 4px 12px rgba(0,0,0,0.4)',
          } : {
            background: 'linear-gradient(135deg, #FFFDF5 0%, #FEF9EC 60%, #FEF3C7 100%)',
            border: '1.5px solid rgba(245,158,11,0.2)',
            boxShadow: '0 8px 24px rgba(245,158,11,0.1), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
            <AlertTriangle size={22} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-800 dark:text-white">Reportar incidente</p>
            <p className="text-xs text-gray-400 mt-0.5">Confidencial · Campus ECI</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
            <span className="hidden sm:inline">Reportar </span><ChevronRight size={13} />
          </span>
        </motion.button>

        {/* Energía del campus */}
        <div
          className="rounded-[2rem] p-5 relative"
          style={isDark ? {
            background: 'linear-gradient(135deg, #0A192F 0%, #0D2C54 60%, #081B33 100%)',
            border: '1.5px solid rgba(6,182,212,0.3)',
            boxShadow: '0 12px 32px rgba(6,182,212,0.12), 0 4px 12px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            transform: 'translateZ(0)',
          } : {
            background: 'linear-gradient(135deg, #F0FDFA 0%, #E0F2FE 60%, #E0E7FF 100%)',
            border: '1.5px solid rgba(14,165,233,0.22)',
            boxShadow: '0 8px 24px rgba(6,182,212,0.1), 0 2px 8px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            transform: 'translateZ(0)',
          }}
        >
          <img
            src={energiaCampusImg}
            alt=""
            className="absolute bottom-0 right-0 h-20 sm:h-24 object-contain object-bottom pointer-events-none select-none"
            style={{ opacity: 0.9 }}
          />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(6,182,212,0.15)', color: TEAL }}>
              <Brain size={22} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-800 dark:text-white">Energía del Campus</p>
              <p className="text-xs text-gray-400 mt-0.5">Nivel semanal de la comunidad</p>
              <div className="mt-2 w-2/3">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(10,25,47,0.08)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: surveyCompleted ? '85%' : '15%' }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: TEAL_GRADIENT }}
                  />
                </div>
              </div>
            </div>
            <span className="font-black text-xl flex-shrink-0" style={{ color: TEAL }}>{surveyCompleted ? '85%' : '—'}</span>
          </div>
          {!surveyCompleted && (
            <p className="text-xs text-gray-400 mt-3 pl-16">Completa tu encuesta para ver el nivel.</p>
          )}
        </div>

        {/* Atención presencial */}
        <motion.button
          whileHover={{ scale: 1.015, translateY: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => navigate('/campus-map')}
          className="w-full rounded-[2rem] p-5 flex items-center gap-4 text-left transition-all duration-300"
          style={isDark ? {
            background: 'linear-gradient(135deg, #0A192F 0%, #052010 60%, #0A192F 100%)',
            border: '1.5px solid rgba(16,185,129,0.3)',
            boxShadow: '0 12px 32px rgba(16,185,129,0.12), 0 4px 12px rgba(0,0,0,0.4)',
          } : {
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 60%, #D1FAE5 100%)',
            border: '1.5px solid rgba(16,185,129,0.22)',
            boxShadow: '0 8px 24px rgba(16,185,129,0.1), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
            <MapPin size={22} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-800 dark:text-white">Atención Presencial</p>
            <p className="text-xs text-gray-400 mt-0.5">Bloque A, Piso 1 · Lun–Vie 8–5 PM</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
            <span className="hidden sm:inline">Ver mapa </span><ChevronRight size={13} />
          </span>
        </motion.button>

      </section>

      {/* Recursos */}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-gray-800 dark:text-white font-bold text-xl sm:text-2xl">📚 Recursos</h2>
            <p className="text-sm text-gray-400 mt-0.5">Servicios disponibles en el campus</p>
          </div>
          <button
            onClick={() => setShowActiveOnly(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              showActiveOnly
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                : (isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500')
            }`}
          >
            {showActiveOnly ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
            Activos
          </button>
        </div>

        {/* Category tabs */}
        <div
          className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-5 px-5 scrollbar-hide"
          style={{ WebkitMaskImage: 'linear-gradient(to right, black 92%, transparent 100%)', maskImage: 'linear-gradient(to right, black 92%, transparent 100%)' }}
        >
          {TABS.map(tab => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap flex-shrink-0 transition-all"
              style={activeTab === tab.key
                ? { background: tab.bg, color: tab.color, border: `1.5px solid ${tab.color}40` }
                : { background: isDark ? 'rgba(17,34,64,0.8)' : 'rgba(255,255,255,0.9)', color: isDark ? '#9CA3AF' : '#64748B', border: `1.5px solid ${isDark ? 'rgba(30,58,95,0.4)' : 'rgba(10,25,47,0.08)'}` }
              }
            >
              <tab.Icon size={15} strokeWidth={2.5} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Resources list */}
        <AnimatePresence mode="wait">
          {activeTab === 'RECOMMENDATIONS' && !surveyCompleted ? (
            <motion.div
              key="no-survey"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl p-6 text-center"
              style={cardStyle}
            >
              <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366F1' }}>
                <Heart size={26} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-base text-gray-800 dark:text-white mb-2">Recomendaciones personalizadas</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Completa la encuesta semanal para ver los recursos del campus que más te convienen.
              </p>
              <button
                onClick={() => { setSurveyStep('WELCOME'); setShowSurveyModal(true); }}
                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-white active:scale-95 transition-transform"
                style={{ background: GRADIENT }}
              >
                Completar encuesta
              </button>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
              <Search size={28} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="font-bold text-gray-500 dark:text-gray-400 text-sm">
                {showActiveOnly ? 'No hay recursos activos aquí.' : 'Sin recursos en esta categoría.'}
              </p>
            </motion.div>
          ) : groupedByCategory ? (
            <motion.div key="grouped" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {groupedByCategory.map(({ cat, resources }) => {
                const meta = CATEGORY_META[cat];
                return (
                  <div key={cat} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.bg, color: meta.color }}>
                        <meta.Icon size={14} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider" style={{ color: meta.color }}>{meta.label}</span>
                      <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(10,25,47,0.06)' }} />
                      <span className="text-[10px] font-bold text-gray-400">{resources.length}</span>
                    </div>
                    {resources.map(r => <ResourceCard key={r.id} resource={r} isDark={isDark} image={RESOURCE_IMAGES[r.id]} />)}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
              {activeTab === 'RECOMMENDATIONS' && surveyCompleted && (
                <div className="rounded-2xl p-4 mb-4 flex items-center justify-between" style={cardStyle}>
                  <div>
                    <p className="font-bold text-sm text-gray-800 dark:text-white mb-0.5">🎯 Para ti</p>
                    <p className="text-xs text-gray-400">Basado en tu encuesta semanal</p>
                  </div>
                  <button onClick={handleResetSurvey} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#EC4899' }}>
                    Actualizar <ChevronRight size={13} />
                  </button>
                </div>
              )}
              {filtered.map(r => <ResourceCard key={r.id} resource={r} isDark={isDark} image={RESOURCE_IMAGES[r.id]} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* SURVEY MODAL */}
      <AnimatePresence>
        {showSurveyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowSurveyModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.75 }}
              className="w-full max-w-md max-h-[82vh] overflow-hidden rounded-3xl flex flex-col pointer-events-auto"
              style={isDark
                ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.6)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }
                : { background: '#FDFCF8', border: '1px solid rgba(10,25,47,0.08)', boxShadow: '0 24px 60px rgba(10,25,47,0.18)' }}
            >
              {/* Compact header */}
              <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0 border-b" style={{ borderColor: isDark ? 'rgba(30,58,95,0.4)' : 'rgba(10,25,47,0.07)', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20">
                  <FileText size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-white leading-tight">Encuesta Semanal</h3>
                  <p className="text-white/70 text-xs">Ayúdanos a entender cómo te sientes.</p>
                </div>
                <button onClick={() => setShowSurveyModal(false)}
                  className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white active:scale-90 transition-transform flex-shrink-0">
                  <X size={16} />
                </button>
              </div>

              <div className="px-5 pt-4 pb-5 overflow-y-auto scrollbar-hide flex-1">

                {successMessage ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                      className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 size={40} className="text-emerald-500" />
                    </motion.div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white text-center">¡Encuesta completada!</h3>
                    <motion.div
                      initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="px-5 py-2.5 rounded-full font-black text-white text-base"
                      style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
                    >
                      +{XP_REWARD} XP ✨
                    </motion.div>
                    <p className="text-sm text-gray-400 text-center">Tus recomendaciones personalizadas están listas.</p>
                  </div>

                ) : surveyStep === 'WELCOME' ? (
                  <div className="space-y-3 pb-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      <strong className="text-gray-800 dark:text-white">10 preguntas</strong> en 4 dimensiones de bienestar universitario.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { color: '#6366F1', Icon: Shield,   label: 'Físico',    desc: 'Sueño, ejercicio y energía.' },
                        { color: '#F59E0B', Icon: Brain,    label: 'Emocional', desc: 'Estrés y estado de ánimo.'   },
                        { color: '#10B981', Icon: FileText, label: 'Académico', desc: 'Entregas y carga académica.' },
                        { color: '#EC4899', Icon: Heart,    label: 'Social',    desc: 'Relaciones y red de apoyo.' },
                      ].map(({ color, Icon, label, desc }) => (
                        <div key={label} className="p-3 rounded-xl" style={cardStyle}>
                          <div className="flex items-center gap-1.5 mb-1" style={{ color }}>
                            <Icon size={13} strokeWidth={2.5} />
                            <span className="text-xs font-bold">{label}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 leading-snug">{desc}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { setSurveyAnswers({}); setCurrentQuestionIndex(0); setSurveyStep('QUESTIONS'); }}
                      className="w-full py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      style={{ background: GRADIENT, boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
                    >
                      Iniciar encuesta
                    </button>
                  </div>

                ) : surveyStep === 'QUESTIONS' ? (
                  <div className="space-y-4 pb-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">
                          {currentQuestionIndex + 1} / {SURVEY_QUESTIONS.length}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: SURVEY_QUESTIONS[currentQuestionIndex].dimension === 'PHYSICAL'  ? 'rgba(99,102,241,0.12)'  :
                                        SURVEY_QUESTIONS[currentQuestionIndex].dimension === 'EMOTIONAL' ? 'rgba(245,158,11,0.12)'  :
                                        SURVEY_QUESTIONS[currentQuestionIndex].dimension === 'ACADEMIC'  ? 'rgba(16,185,129,0.12)'  : 'rgba(236,72,153,0.12)',
                            color: SURVEY_QUESTIONS[currentQuestionIndex].dimension === 'PHYSICAL'  ? '#6366F1' :
                                   SURVEY_QUESTIONS[currentQuestionIndex].dimension === 'EMOTIONAL' ? '#F59E0B' :
                                   SURVEY_QUESTIONS[currentQuestionIndex].dimension === 'ACADEMIC'  ? '#10B981' : '#EC4899',
                          }}
                        >
                          {SURVEY_QUESTIONS[currentQuestionIndex].dimensionLabel}
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(10,25,47,0.08)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: GRADIENT }}
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQuestionIndex + 1) / SURVEY_QUESTIONS.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    <h4 className="font-bold text-base text-gray-900 dark:text-white leading-snug">
                      {SURVEY_QUESTIONS[currentQuestionIndex].text}
                    </h4>

                    <div className="space-y-2.5">
                      {SURVEY_QUESTIONS[currentQuestionIndex].options.map((opt, i) => {
                        const qId = SURVEY_QUESTIONS[currentQuestionIndex].id;
                        const isSelected = surveyAnswers[qId]?.score === opt.score;
                        return (
                          <button key={i}
                            onClick={() => setSurveyAnswers(prev => ({ ...prev, [qId]: { score: opt.score, text: opt.text } }))}
                            className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                              isSelected
                                ? (isDark ? 'bg-indigo-500/15 border-indigo-500' : 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-400')
                                : (isDark ? 'bg-white/4 border-white/8 hover:bg-white/8' : 'bg-white border-gray-100 hover:bg-gray-50')
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0 ${
                              isSelected ? 'bg-indigo-500 text-white' : (isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500')
                            }`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className={`flex-1 text-sm leading-relaxed ${isSelected ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                              {opt.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(i => i - 1); else setSurveyStep('WELCOME'); }}
                        className="flex-1 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                        style={isDark ? { background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' } : { background: 'rgba(10,25,47,0.06)', color: '#6B7280' }}
                      >
                        <ChevronLeft size={15} /> Anterior
                      </button>
                      <button
                        disabled={!surveyAnswers[SURVEY_QUESTIONS[currentQuestionIndex].id]}
                        onClick={() => { if (currentQuestionIndex < SURVEY_QUESTIONS.length - 1) setCurrentQuestionIndex(i => i + 1); else setSurveyStep('CONFIRMATION'); }}
                        className="flex-1 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5 text-white active:scale-95 transition-transform disabled:opacity-40"
                        style={{ background: GRADIENT }}
                      >
                        {currentQuestionIndex < SURVEY_QUESTIONS.length - 1 ? 'Siguiente' : 'Finalizar'}
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>

                ) : (
                  <div className="space-y-3 pb-3">
                    <div className="p-4 rounded-2xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        ✅ Respondiste las {SURVEY_QUESTIONS.length} preguntas. Al confirmar, analizaremos tus respuestas y mostraremos recursos personalizados.
                      </p>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {SURVEY_QUESTIONS.map((q, i) => (
                        <div key={q.id} className="p-3 rounded-xl" style={cardStyle}>
                          <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-0.5">P{i + 1}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">{surveyAnswers[q.id]?.text ?? '—'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSurveyStep('QUESTIONS')}
                        className="flex-1 py-3 rounded-2xl text-sm font-bold active:scale-95 transition-transform"
                        style={isDark ? { background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' } : { background: 'rgba(10,25,47,0.06)', color: '#6B7280' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={handleConfirmAndSendSurvey}
                        className="flex-1 py-3 rounded-2xl text-sm font-bold text-white active:scale-95 transition-transform"
                        style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                      >
                        Confirmar y Enviar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* INCIDENT MODAL */}
      <AnimatePresence>
        {showIncidentModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowIncidentModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.75 }}
              className="w-full max-w-md max-h-[82vh] overflow-hidden rounded-3xl flex flex-col pointer-events-auto"
              style={isDark
                ? { background: '#0A192F', border: '1px solid rgba(30,58,95,0.6)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }
                : { background: '#FDFCF8', border: '1px solid rgba(10,25,47,0.08)', boxShadow: '0 24px 60px rgba(10,25,47,0.18)' }}
            >
              {/* Compact header */}
              <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20">
                  <AlertTriangle size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-white leading-tight">Reportar Incidente</h3>
                  <p className="text-white/70 text-xs">Tu reporte es confidencial.</p>
                </div>
                <button onClick={() => setShowIncidentModal(false)}
                  className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white active:scale-90 transition-transform flex-shrink-0">
                  <X size={16} />
                </button>
              </div>

              <div className="px-5 pt-4 pb-5 overflow-y-auto scrollbar-hide flex-1">

                {successMessage ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                      className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
                      <CheckCircle2 size={40} className="text-emerald-500" />
                    </motion.div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white text-center">{successMessage}</h3>
                  </div>
                ) : (
                  <form onSubmit={handleIncidentSubmit} className="space-y-3 pb-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Tipo de incidente</label>
                      <select value={incidentType} onChange={e => setIncidentType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-sm border appearance-none"
                        style={isDark ? { background: '#112240', border: '1px solid rgba(30,58,95,0.5)', color: 'white' } : { background: 'white', border: '1px solid rgba(10,25,47,0.1)', color: '#111' }}
                      >
                        <option value="infraestructura">Infraestructura</option>
                        <option value="seguridad">Seguridad</option>
                        <option value="acoso">Acoso o discriminación</option>
                        <option value="salud">Emergencia de salud</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Ubicación</label>
                      <input value={incidentLocation} onChange={e => setIncidentLocation(e.target.value)}
                        placeholder="Ej. Bloque B, Baños 2do piso"
                        className="w-full px-3 py-2.5 rounded-xl text-sm border"
                        style={isDark ? { background: '#112240', border: '1px solid rgba(30,58,95,0.5)', color: 'white' } : { background: 'white', border: '1px solid rgba(10,25,47,0.1)', color: '#111' }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Descripción *</label>
                      <textarea value={incidentDescription} onChange={e => setIncidentDescription(e.target.value)}
                        placeholder="Describe brevemente lo que ocurrió..."
                        rows={2}
                        className="w-full px-3 py-2.5 rounded-xl text-sm border resize-none"
                        style={isDark ? { background: '#112240', border: '1px solid rgba(30,58,95,0.5)', color: 'white' } : { background: 'white', border: '1px solid rgba(10,25,47,0.1)', color: '#111' }}
                      />
                    </div>
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={cardStyle}>
                      <div>
                        <p className="font-semibold text-sm text-gray-800 dark:text-white">Reporte anónimo</p>
                        <p className="text-xs text-gray-400">No se mostrará tu nombre</p>
                      </div>
                      <button type="button" onClick={() => setIsAnonymous(v => !v)} className="active:scale-90 transition-transform">
                        {isAnonymous
                          ? <ToggleRight size={28} className="text-amber-500" />
                          : <ToggleLeft size={28} className="text-gray-400" />}
                      </button>
                    </div>
                    {!isAnonymous && (
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Código estudiantil (opcional)</label>
                        <input value={studentId} onChange={e => setStudentId(e.target.value)}
                          placeholder="Ej. 20231234"
                          className="w-full px-3 py-2.5 rounded-xl text-sm border"
                          style={isDark ? { background: '#112240', border: '1px solid rgba(30,58,95,0.5)', color: 'white' } : { background: 'white', border: '1px solid rgba(10,25,47,0.1)', color: '#111' }}
                        />
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={!incidentDescription.trim()}
                      className="w-full py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}
                    >
                      <AlertTriangle size={15} /> Enviar Reporte
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
