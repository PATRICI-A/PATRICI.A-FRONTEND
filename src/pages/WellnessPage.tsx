import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Phone, Sparkles, CheckCircle2, MapPin, ChevronLeft, Clock, Mail, 
  Calendar, Shield, Dumbbell, Palette, Brain, ToggleLeft, ToggleRight, 
  FileText, AlertTriangle, X, Search 
} from 'lucide-react';
import { GRADIENT, wellnessResources } from '../types/mockData';
import type { WellnessResource } from '../types/mockData';
import { useApp } from '../store/AppContext';

type CategoryKey = 'ALL' | 'HEALTH' | 'SPORTS' | 'CULTURE' | 'EMOTIONAL_SUPPORT';
type LucideIcon = React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string; strokeWidth?: number }>;

const TABS: { key: CategoryKey; label: string; Icon: LucideIcon; color: string; bgColor: string }[] = [
  { key: 'ALL',              label: 'Todos',   Icon: Sparkles, color: '#6366F1', bgColor: 'rgba(99,102,241,0.12)' },
  { key: 'HEALTH',           label: 'Salud',   Icon: Shield,   color: '#10B981', bgColor: 'rgba(16,185,129,0.12)' },
  { key: 'SPORTS',           label: 'Deporte', Icon: Dumbbell, color: '#3B82F6', bgColor: 'rgba(59,130,246,0.12)' },
  { key: 'CULTURE',          label: 'Cultura', Icon: Palette,  color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.12)' },
  { key: 'EMOTIONAL_SUPPORT',label: 'Apoyo',   Icon: Brain,    color: '#F59E0B', bgColor: 'rgba(245,158,11,0.12)' },
];

const CATEGORY_META: Record<string, { label: string; color: string; bgColor: string; Icon: LucideIcon }> = {
  HEALTH:           { label: 'Salud',            color: '#10B981', bgColor: 'rgba(16,185,129,0.1)',  Icon: Shield   },
  SPORTS:           { label: 'Deporte',          color: '#3B82F6', bgColor: 'rgba(59,130,246,0.1)',  Icon: Dumbbell },
  CULTURE:          { label: 'Cultura',          color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.1)',  Icon: Palette  },
  EMOTIONAL_SUPPORT:{ label: 'Apoyo Emocional', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.1)',  Icon: Brain    },
};

function ResourceCard({ resource, isDark }: { resource: WellnessResource; isDark: boolean }) {
  const [requested, setRequested] = useState(false);
  const meta = CATEGORY_META[resource.category];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-[2rem] p-5 mb-4 shadow-sm border transition-all ${
        isDark ? 'bg-[#112240] border-white/5 hover:bg-[#1A2F50]' : 'bg-white border-gray-100 hover:shadow-xl'
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
          className={`w-full mt-2 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm ${
              requested ? 'text-white' : ''
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

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Encuesta enviada con éxito. ¡Gracias!');
    setTimeout(() => { setSuccessMessage(''); setShowSurveyModal(false); }, 2500);
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Incidente reportado de manera confidencial.');
    setTimeout(() => { setSuccessMessage(''); setShowIncidentModal(false); }, 2500);
  };

  const filtered = wellnessResources.filter(r => {
    if (showActiveOnly && !r.active) return false;
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
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-[#0A192F]' : 'bg-[#F8FAFC]'}`}>
      
      {/* Premium Header */}
      <div className="px-5 pt-8 pb-4 relative overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[20px] left-[-50px] w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10 mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
              isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Salud y Mente
            </p>
            <h1 className={`text-2xl font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Bienestar 💙
            </h1>
          </div>
        </div>
      </div>

      <div className="px-5">
        {/* Quick Actions (Encuesta & Incidente) */}
        <div className="flex gap-3 mb-6 relative z-10">
          <button
            onClick={() => setShowSurveyModal(true)}
            className={`flex-1 p-5 rounded-[2rem] relative overflow-hidden active:scale-95 transition-transform shadow-lg ${
                isDark ? 'bg-[#112240] border border-indigo-500/20' : 'bg-white border border-indigo-100'
            }`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center mb-4 bg-indigo-500/10 text-indigo-500">
              <FileText size={24} strokeWidth={2} />
            </div>
            <h3 className={`font-black text-lg text-left mb-1 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Tu estado hoy</h3>
            <p className={`text-xs text-left font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Llenar encuesta</p>
          </button>

          <button
            onClick={() => setShowIncidentModal(true)}
            className={`flex-1 p-5 rounded-[2rem] relative overflow-hidden active:scale-95 transition-transform shadow-lg ${
                isDark ? 'bg-[#112240] border border-amber-500/20' : 'bg-white border border-amber-100'
            }`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center mb-4 bg-amber-500/10 text-amber-500">
              <AlertTriangle size={24} strokeWidth={2} />
            </div>
            <h3 className={`font-black text-lg text-left mb-1 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Atención y ayuda</h3>
            <p className={`text-xs text-left font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Reportar caso</p>
          </button>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-[2rem] p-5 mb-8 shadow-sm ${
            isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-[1.25rem] flex items-center justify-center bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <MapPin size={20} strokeWidth={2.5} />
            </div>
            <div>
                <h2 className={`font-black ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Atención Presencial</h2>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
                Oficina de Bienestar
                </p>
            </div>
          </div>
          <p className={`text-sm font-medium mb-4 ${isDark ? 'text-emerald-100/70' : 'text-emerald-800'}`}>
            Bloque A, Primer Piso <br/> Lun–Vie 8:00 AM – 5:00 PM
          </p>
          <button
            onClick={() => navigate('/campus-map')}
            className="w-full py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition-transform text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 8px 25px -5px rgba(16,185,129,0.4)' }}
          >
            <MapPin size={16} /> Ver en el mapa
          </button>
        </motion.div>

        {/* Resources Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`font-black text-xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Recursos 📚</h2>
          </div>
          <button
            onClick={() => setShowActiveOnly(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              showActiveOnly 
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 ring-2 ring-emerald-500/30' 
                : (isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-200 text-gray-500')
            }`}
          >
            {showActiveOnly ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            Activos
          </button>
        </div>

        {/* Horizontal Category Tabs */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-4 mb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActiveTab(tab.key)}
              className="snap-start flex items-center gap-2 px-4 py-2.5 rounded-[1rem] text-sm font-bold whitespace-nowrap flex-shrink-0 transition-colors shadow-sm"
              style={{
                background: activeTab === tab.key ? tab.bgColor : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,1)'),
                color: activeTab === tab.key ? tab.color : (isDark ? '#9CA3AF' : '#64748B'),
                border: activeTab === tab.key ? `1px solid ${tab.color}40` : (isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'),
              }}
            >
              <tab.Icon size={16} strokeWidth={2.5} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Resources List */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
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
              {filtered.map(r => <ResourceCard key={r.id} resource={r} isDark={isDark} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 24/7 Lifeline Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] p-6 text-white relative overflow-hidden mt-8"
          style={{ background: GRADIENT, boxShadow: '0 10px 30px -5px rgba(99,102,241,0.5)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, transparent 20%, rgba(245,158,11,0.3) 80%)' }} />
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20 shadow-inner" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Heart size={28} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-black text-white text-lg leading-tight mb-1">Soporte Vital 24/7</p>
              <p className="text-white/80 font-medium text-xs">No estás solo/a. Estamos aquí.</p>
            </div>
          </div>
          <a
            href="tel:106"
            className="w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition-transform relative z-10 shadow-lg"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <Phone size={18} /> Llamar Inmediatamente
          </a>
        </motion.div>
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
                ) : (
                  <form onSubmit={handleSurveySubmit} className="space-y-6 pb-6">
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Nivel de Estrés Actual</label>
                      <div className="flex justify-between px-2 mb-2">
                        <span className="text-xl">😌</span>
                        <span className="text-xl">🤯</span>
                      </div>
                      <input type="range" min="1" max="5" defaultValue="3" className="w-full accent-indigo-500" />
                      <div className="flex justify-between px-2 mt-2">
                        <span className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Relajado</span>
                        <span className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Estresado</span>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Comentarios (Opcional)</label>
                      <textarea placeholder="¿Hay algo en particular que te preocupe?" rows={4} 
                        className={`w-full px-5 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all ${
                          isDark ? 'bg-white/5 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                        }`} 
                      />
                    </div>
                    <button type="submit" className="w-full py-4 mt-4 rounded-2xl text-white font-black text-base flex items-center justify-center shadow-lg active:scale-95 transition-transform" style={{ background: GRADIENT, boxShadow: '0 8px 25px -5px rgba(99,102,241,0.4)' }}>
                      Guardar y Enviar
                    </button>
                  </form>
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
                          <select className={`w-full pl-5 pr-10 py-4 rounded-[1.25rem] font-medium text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                              isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'
                          }`}>
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
                      <input placeholder="Bloque, piso, salón..." className={`w-full px-5 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                          isDark ? 'bg-white/5 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                      }`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Descripción</label>
                      <textarea placeholder="Detalla lo sucedido..." rows={4} className={`w-full px-5 py-4 rounded-[1.25rem] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none transition-all ${
                          isDark ? 'bg-white/5 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                      }`} />
                    </div>
                    <label className="flex items-center gap-3 pt-2 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                          isDark ? 'border-gray-500 group-hover:border-amber-400' : 'border-gray-300 group-hover:border-amber-500'
                      }`}>
                          <input type="checkbox" className="opacity-0 absolute" />
                          <CheckCircle2 size={16} className="text-amber-500 opacity-0 group-has-[:checked]:opacity-100" />
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
  );
}