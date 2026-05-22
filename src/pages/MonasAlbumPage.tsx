import * as React from 'react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
const CHROME: Record<string, string> = {
  común:      'linear-gradient(135deg, #93C5FD 0%, #1E40AF 25%, #BFDBFE 50%, #3B82F6 75%, #93C5FD 100%)',
  'poco común': 'linear-gradient(135deg, #A7F3D0 0%, #047857 25%, #D1FAE5 50%, #10B981 75%, #A7F3D0 100%)',
  raro:       'linear-gradient(135deg, #67E8F9 0%, #0E7490 25%, #A5F3FC 50%, #0891B2 75%, #67E8F9 100%)',
  épico:      'linear-gradient(135deg, #C4B5FD 0%, #5B21B6 25%, #DDD6FE 50%, #7C3AED 75%, #C4B5FD 100%)',
  legendario: 'linear-gradient(135deg, #FDE68A 0%, #92400E 15%, #FCD34D 40%, #B45309 60%, #FBBF24 80%, #78350F 100%)',
};
const GLITTER = Array.from({ length: 8 }, (_, i) => ({
  top:   `${((i * 41 + 7)  % 80) + 5}%`,
  left:  `${((i * 67 + 13) % 85) + 5}%`,
  size:  ((i % 3) * 0.8 + 1),
  dur:   ((i % 4) * 0.4 + 0.8),
  delay: ((i * 0.17) % 1.2),
}));
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Lock, Trophy, X, Sparkles, Star, Zap, CheckCircle,
  QrCode, ScanLine, Gift, Scan, AlertCircle,
  ChevronLeft, ChevronRight, Library, Smartphone,
  Music, Mountain, BookOpen, Pizza, Gamepad2, Palette,
  Calendar, Tent, Code2, Smile, Users as UsersIcon, PartyPopper,
  Info, Handshake, Network, Award, Map, MapPin, Building2, MessageCircle,
  Home, Rocket, Crown, Shield,
} from 'lucide-react';
import {
  monas as initialMonas, GRADIENT, GOLD_GRADIENT, GOLD_LIGHT, GOLD,
  TEAL, EVENT_ENVELOPES, type Mona, type EventEnvelope, CAFETERIA_PRIZES
} from '../types/mockData';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import imgPrimerChoque from '../assets/PrimerChoque-1.png';
import imgParcheIniciado from '../assets/ParcheIniciado-1.png';
import imgCapitanNato from '../assets/CapitanNato.png';
import imgViral from '../assets/Viral-1.png';
import imgConocidoDelCampus from '../assets/ConocidoDelCampus.png';
import imgElPrevisor from '../assets/ElPrevisor.png';
import imgElRompeHielos from '../assets/ElRompeHielos-1.png';
import imgEspirituECI from '../assets/EspirituECI-1.png';
import imgExplorador from '../assets/Explorador.png';
import imgLaLeyenda from '../assets/LaLeyendaPatric.ia-2.png';
import imgNomada from '../assets/Nomada-1.png';
import imgAlmaSocial from '../assets/AlmaSocial.png';
import imgAnfitrion from '../assets/Anfitrion.png';
import imgMascota from '../../MASCOTA-MONAS.png';
import imgMascotaQr from '../../MASCOTA-QR.png';
import imgLogoBloqueadas from '../assets/LOGO BLOQUEADAS.png';
const R = {
  común: {
    stars: 1, label: 'Común',
    border: '#3B82F6', glow: 'rgba(59,130,246,0.45)',
    cardBg: 'linear-gradient(160deg, #0F2450 0%, #1D4ED8 100%)',
    shimmer: 'rgba(96,165,250,0.25)', textColor: '#BFDBFE', tagBg: 'rgba(59,130,246,0.2)',
  },
  'poco común': {
    stars: 1, label: 'Poco Común',
    border: '#10B981', glow: 'rgba(16,185,129,0.45)',
    cardBg: 'linear-gradient(160deg, #064E3B 0%, #059669 100%)',
    shimmer: 'rgba(52,211,153,0.25)', textColor: '#D1FAE5', tagBg: 'rgba(16,185,129,0.2)',
  },
  raro: {
    stars: 2, label: 'Raro',
    border: '#06B6D4', glow: 'rgba(6,182,212,0.55)',
    cardBg: 'linear-gradient(160deg, #0C2340 0%, #0369A1 100%)',
    shimmer: 'rgba(6,182,212,0.3)', textColor: '#A5F3FC', tagBg: 'rgba(6,182,212,0.2)',
  },
  épico: {
    stars: 3, label: 'Épico',
    border: '#8B5CF6', glow: 'rgba(139,92,246,0.6)',
    cardBg: 'linear-gradient(160deg, #1E1B4B 0%, #6D28D9 100%)',
    shimmer: 'rgba(167,139,250,0.35)', textColor: '#DDD6FE', tagBg: 'rgba(139,92,246,0.25)',
  },
  legendario: {
    stars: 4, label: 'Legendario',
    border: '#F59E0B', glow: 'rgba(245,158,11,0.8)',
    cardBg: 'linear-gradient(160deg, #1C1107 0%, #92400E 60%, #B45309 100%)',
    shimmer: 'rgba(252,211,77,0.5)', textColor: '#FDE68A', tagBg: 'rgba(245,158,11,0.3)',
  },
} as const;
const REWARDS = [
  { id: 'r1', pct: 25, emoji: '📝', title: '+0.2 en un parcial', subtitle: 'Décimas extra', color: '#06B6D4', bg: 'rgba(6,182,212,0.15)', description: 'Agrega 0.2 décimas a la nota de un parcial de tu elección.' },
  { id: 'r2', pct: 50, emoji: '📚', title: '+0.3 en un trabajo', subtitle: 'Décimas extra', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', description: 'Agrega 0.3 décimas a la nota de un trabajo de tu elección.' },
  { id: 'r3', pct: 75, emoji: '⭐', title: '+0.5 en una materia', subtitle: 'Décimas extra', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', description: 'Agrega 0.5 décimas a la nota final de una materia de tu elección.' },
  { id: 'r4', pct: 100, emoji: '👑', title: 'Punto libre', subtitle: 'Materia a tu elección', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', description: '¡El gran premio! Un punto completo en cualquier materia.' },
];
const CATEGORIES = [
  { id: 'todas', label: 'Todas', emoji: '✨', color: '#3B82F6' },
  { id: 'networking', label: 'Networking', emoji: '🤝', color: '#3B82F6' },
  { id: 'cafeterias', label: 'Cafeterías', emoji: '☕', color: '#F59E0B' },
  { id: 'edificios', label: 'Edificios', emoji: '🏛️', color: '#6366F1' },
  { id: 'actividad', label: 'Zonas y Actividad', emoji: '🌿', color: '#10B981' },
  { id: 'eventos', label: 'Eventos', emoji: '🎉', color: '#EC4899' },
  { id: 'legendarias', label: 'Legendarias', emoji: '👑', color: '#F59E0B' },
];
// Removed BADGES array as per refactoring
const DEMO_CODES = [
  { code: 'PATRICIA-TECH-001', label: 'Red Rápida', color: '#3B82F6', emoji: '⚡' },
  { code: 'PATRICIA-SOCIAL-002', label: 'Conexiones Pro', color: '#06B6D4', emoji: '👥' },
  { code: 'PATRICIA-CULTURA-003', label: 'Organizador', color: '#8B5CF6', emoji: '🔥' },
  { code: 'PATRICIA-WELLNESS-004', label: 'Exploración', color: '#10B981', emoji: '🧘' },
  { code: 'PATRICIA-ACADEMIA-005', label: 'Esfuerzo', color: '#6366F1', emoji: '🌅' },
  { code: 'PATRICIA-LEGEND-006', label: '★ Legendario', color: '#F59E0B', emoji: '🌟' },
];
// Removed BadgeCard component
function RarityStars({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <Star key={i} size={6} fill={i < count ? color : 'transparent'} stroke={i < count ? color : 'rgba(255,255,255,0.3)'} />
      ))}
    </div>
  );
}
function MonaCardUnlocked({ mona, onClick }: { mona: Mona; onClick: () => void }) {
  const cfg = R[mona.rarity];
  const isLegendary = mona.rarity === 'legendario';
  const isEpic = mona.rarity === 'épico';
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.07, y: -5, rotateZ: 0.6 }}
      whileTap={{ scale: 0.93 }}
      className="relative w-full"
      style={{ aspectRatio: '3/4' }}
    >
      {}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: CHROME[mona.rarity],
          padding: '2px',
          boxShadow: [
            `0 4px 16px ${cfg.glow}`,
            '0 1px 6px rgba(0,0,0,0.75)',
            'inset 0 1px 0 rgba(255,255,255,0.35)',
            'inset 0 -1px 0 rgba(0,0,0,0.4)',
          ].join(', '),
        }}
      >
        {}
        <div
          className="relative w-full h-full rounded-[9px] overflow-hidden flex flex-col"
          style={{ background: cfg.cardBg }}
        >
          {}
          {(isEpic || isLegendary) && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(105deg, transparent 20%, ${cfg.shimmer} 50%, transparent 80%)`, zIndex: 2 }}
              animate={{ x: ['-110%', '110%'] }}
              transition={{ duration: isLegendary ? 1.8 : 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
            />
          )}
          {}
          {isLegendary && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
              {GLITTER.map((g, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: g.size, height: g.size,
                    top: g.top, left: g.left,
                    background: 'radial-gradient(circle, #FDE68A 40%, #F59E0B)',
                    boxShadow: '0 0 3px rgba(253,230,138,0.95)',
                  }}
                  animate={{ opacity: [0, 1, 0], scale: [0.2, 1.6, 0.2] }}
                  transition={{ duration: g.dur, repeat: Infinity, delay: g.delay, ease: 'easeInOut' }}
                />
              ))}
            </div>
          )}
          {}
          {isLegendary && (
            <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: CHROME.legendario }} />
          )}
          {}
          <div className="absolute top-1 left-1 right-1 flex justify-between items-center z-10">
            <span className="text-[7px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm" style={{ background: cfg.tagBg, color: cfg.textColor }}>
              {cfg.label.toUpperCase()}
            </span>
            <RarityStars count={cfg.stars} color={cfg.textColor} />
          </div>
          {}
          <div
            className="flex-1 flex items-center justify-center relative z-10"
            style={{ marginTop: '12px', marginBottom: '2px' }}
          >
            {mona.image ? (
              <div className="w-[85%] h-[85%] flex items-center justify-center relative">
                <img src={mona.image} alt={mona.name} className="w-full h-full object-contain drop-shadow-lg" style={mona.imgScale ? { transform: `scale(${mona.imgScale})` } : {}} />
              </div>
            ) : (
              <EmojiIcon emoji={mona.emoji} size={32} color="white" strokeWidth={1.8} />
            )}
          </div>
          {}
          <div className="w-full px-2 pb-2 pt-1.5 text-center z-10" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <p className="text-[10px] sm:text-[11px] font-black leading-tight line-clamp-2 drop-shadow-md" style={{ color: cfg.textColor, minHeight: '24px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {mona.name}
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold mt-0.5 drop-shadow-sm" style={{ color: `${cfg.textColor}99` }}>+{mona.xp} XP</p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
function MonaCardLocked({ mona, index, onClick }: { mona: Mona; index: number; onClick: () => void }) {
  const slotNumber = String(index + 1).padStart(2, '0');
  const cfg = R[mona.rarity];
  const isLegendary = mona.rarity === 'legendario';
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className="relative w-full group"
      style={{ aspectRatio: '3/4' }}
    >
      {/* Marco Exterior Metálico oscurecido */}
      <div
        className="absolute inset-0 rounded-xl transition-all"
        style={{
          background: CHROME[mona.rarity],
          padding: '2px',
          boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
          filter: 'brightness(0.6) grayscale(0.4)',
        }}
      >
        <div
          className="relative w-full h-full rounded-[9px] overflow-hidden flex flex-col"
          style={{ background: cfg.cardBg }}
        >
          {isLegendary && (
            <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: CHROME.legendario }} />
          )}

          <div className="absolute top-1 left-1 right-1 flex justify-between items-center z-10 opacity-70">
            <span className="text-[7px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm" style={{ background: cfg.tagBg, color: cfg.textColor }}>
              {cfg.label.toUpperCase()}
            </span>
            <RarityStars count={cfg.stars} color={cfg.textColor} />
          </div>

          <div
            className="flex-1 flex items-center justify-center relative z-10"
            style={{ marginTop: '12px', marginBottom: '2px' }}
          >
            <div className="w-[85%] h-[85%] flex items-center justify-center relative">
              {/* LOGO BLOQUEADAS superpuesto */}
              <img 
                src={imgLogoBloqueadas} 
                alt="Bloqueada" 
                className="absolute inset-0 w-full h-full object-contain opacity-90 drop-shadow-xl" 
              />

              {/* Candado / Cadenas encima */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="bg-black/50 p-2.5 rounded-full backdrop-blur-sm border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform">
                  <Lock size={20} className="text-white/70" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>

          {/* Información inferior */}
          <div className="w-full px-2 pb-2 pt-1.5 text-center z-10 opacity-80" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <p className="text-[10px] sm:text-[11px] font-black leading-tight line-clamp-2 drop-shadow-md text-white/50" style={{ minHeight: '24px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {mona.name}
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold mt-0.5 drop-shadow-sm text-white/40">Nº {slotNumber}</p>
          </div>
        </div>
      </div>
      
      {/* Indicador de acción (+) sutil */}
      <motion.div
        className="absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-30 bg-white/10 border border-white/20 text-white/60 opacity-0 group-hover:opacity-100 backdrop-blur-md"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-sm font-bold leading-none mb-[1px]">+</span>
      </motion.div>
    </motion.button>
  );
}

function MonaSlotRender({ mona, i, albumPage, monasPerPage, setPastingMonaId, pastingMonaId, setCollection, setSelectedMona }: any) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 200, damping: 22 }}>
      {mona.unlocked ? (
        <MonaCardUnlocked mona={mona} onClick={() => setSelectedMona(mona)} />
      ) : pastingMonaId === mona.id ? (
        <motion.div
          className="relative w-full"
          style={{ aspectRatio: '3/4', transformOrigin: 'center center' }}
          initial={{ scale: 2.5, y: -200, opacity: 0, rotateZ: 25 }}
          animate={{ scale: 1, y: 0, opacity: 1, rotateZ: (Math.random() * 4 - 2) }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          onAnimationComplete={() => {
            setCollection((prev: any) =>
              prev.map((m: any) => m.id === mona.id ? { ...m, unlocked: true, unlockedAt: 'Pegado ahora' } : m)
            );
            setPastingMonaId(null);
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-black/40 rounded-xl blur-md" 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 0.3, y: 4 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          />
          <div className="relative z-10 w-full h-full">
            <MonaCardUnlocked mona={{ ...mona, unlocked: true }} onClick={() => {}} />
          </div>
        </motion.div>
      ) : (
        <MonaCardLocked
          mona={mona}
          index={albumPage * monasPerPage + i}
          onClick={() => setPastingMonaId(mona.id)}
        />
      )}
    </motion.div>
  );
}

function EmptySlotRender({ index }: { index: number }) {
  const slotNumber = String(index + 1).padStart(2, '0');
  return (
    <div className="rounded-xl overflow-hidden relative" style={{ aspectRatio: '3/4' }}>
      <div className="absolute inset-0 border-[2.5px] border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col items-center justify-center">
        <span className="text-4xl sm:text-5xl font-black text-slate-200 dark:text-slate-700/50 select-none">
          {slotNumber}
        </span>
      </div>
    </div>
  );
}
function EventCodeModal({
  onClose,
  onSuccess,
  usedCodes,
}: {
  onClose: () => void;
  onSuccess: (envelope: EventEnvelope, monas: Mona[]) => void;
  usedCodes: string[];
}) {
  const { isDark } = useApp();
  const [step, setStep] = useState<'enter' | 'validating' | 'success' | 'error'>('enter');
  const [codeInput, setCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [foundEnvelope, setFoundEnvelope] = useState<EventEnvelope | null>(null);
  const [collection] = useState<Mona[]>([...initialMonas]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleValidate = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    setStep('validating');
    setTimeout(() => {
      const envelope = EVENT_ENVELOPES.find(e => e.code.toUpperCase() === normalized);
      if (!envelope) {
        setErrorMsg('Código de evento inválido. Intenta con otro código.');
        setStep('error');
        return;
      }
      if (usedCodes.includes(normalized)) {
        setErrorMsg('Este código ya fue ingresado anteriormente. Cada código es de un solo uso.');
        setStep('error');
        return;
      }
      const monas = envelope.monaIds
        .map(id => collection.find(m => m.id === id))
        .filter((m): m is Mona => m !== undefined);
      setFoundEnvelope(envelope);
      setStep('success');
      setTimeout(() => onSuccess(envelope, monas), 800);
    }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-[24px] pointer-events-auto transition-colors duration-300 ${
        isDark ? 'bg-black/75' : 'bg-black/40'
      }`}
    >
      <div 
        className="relative w-full max-w-[420px] h-[50vh] max-h-[50vh] flex flex-col items-center p-6 rounded-[32px] shadow-2xl transition-all duration-300 overflow-y-auto custom-scrollbar"
        style={{ 
          background: isDark ? 'linear-gradient(160deg, #0A1628, #112240)' : 'linear-gradient(160deg, #FDFCF8, #EDE9E0)', 
          border: isDark ? '2px solid rgba(59,130,246,0.4)' : '2px solid rgba(59,130,246,0.25)',
          boxShadow: isDark ? '0 12px 48px rgba(59,130,246,0.2)' : '0 12px 48px rgba(59,130,246,0.12)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isDark 
              ? 'bg-white/10 hover:bg-white/20 text-white' 
              : 'bg-black/5 hover:bg-black/10 text-gray-800'
          }`}
        >
          <X size={20} />
        </button>

        <div className="flex-1 w-full flex flex-col items-center justify-center min-h-0 mt-2">
          {/* Patricia branding */}
          <div className="mb-2 text-center flex-shrink-0">
            <h2 className={`font-black text-2xl tracking-tight transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Ingresar Código</h2>
          </div>

          {/* Mascot Image (MASCOTA-QR.png) */}
          <div className="relative w-[180px] md:w-[220px] flex-1 min-h-0 flex items-center justify-center mb-4">
            <img 
              src={imgMascotaQr} 
              alt="Mascota QR" 
              className={`w-full h-full object-contain transition-all ${
                isDark 
                  ? 'drop-shadow-[0_15px_40px_rgba(59,130,246,0.25)]' 
                  : 'drop-shadow-[0_15px_30px_rgba(59,130,246,0.12)]'
              }`}
            />
            {/* Overlay indicators (validating, success, error) */}
            {step === 'validating' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`p-4 rounded-[24px] border flex flex-col items-center gap-3 shadow-xl backdrop-blur-md ${
                  isDark 
                    ? 'bg-slate-950/90 border-white/10 text-white' 
                    : 'bg-white/95 border-gray-200 text-gray-800'
                }`}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 rounded-full border-4 border-t-transparent"
                    style={{ borderColor: `${GOLD_LIGHT} transparent transparent transparent` }}
                  />
                  <p className="text-[10px] font-black tracking-widest uppercase">Validando...</p>
                </div>
              </div>
            )}
            {step === 'success' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-4 rounded-[24px] border backdrop-blur-md flex flex-col items-center gap-2 shadow-xl ${
                    isDark 
                      ? 'bg-green-950/95 border-green-500/30 text-green-400' 
                      : 'bg-green-50/95 border-green-200 text-green-700'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    isDark 
                      ? 'bg-green-500/20 border-green-400 text-green-400' 
                      : 'bg-green-100 border-green-500 text-green-600'
                  }`}>
                    <CheckCircle size={24} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest">¡Código Válido!</p>
                </motion.div>
              </div>
            )}
            {step === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-4 rounded-[24px] border backdrop-blur-md flex flex-col items-center gap-2 shadow-xl ${
                    isDark 
                      ? 'bg-red-950/95 border-red-500/30 text-red-400' 
                      : 'bg-red-50/95 border-red-200 text-red-700'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    isDark 
                      ? 'bg-red-500/20 border-red-400 text-red-400' 
                      : 'bg-red-100 border-red-500 text-red-600'
                  }`}>
                    <AlertCircle size={24} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest">Código Inválido</p>
                </motion.div>
              </div>
            )}
          </div>

          {/* Validation input & button */}
          <div className="w-full flex-shrink-0">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                value={codeInput}
                onChange={e => setCodeInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleValidate(codeInput)}
                placeholder="Ej: PATRICIA-XXXX-000"
                className={`flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none transition-all ${
                  isDark 
                    ? 'text-white placeholder-white/20' 
                    : 'text-gray-900 placeholder-gray-400'
                }`}
                style={{ 
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)', 
                  border: isDark ? '2px solid rgba(255,255,255,0.08)' : '2px solid rgba(0,0,0,0.08)' 
                }}
              />
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleValidate(codeInput)}
                disabled={!codeInput.trim() || step === 'validating'}
                className="px-6 py-3 rounded-xl text-white font-black text-[11px] uppercase tracking-widest disabled:opacity-40 flex items-center gap-1.5 shadow-xl transition-all"
                style={{ background: GOLD_GRADIENT }}
              >
                <Scan size={14} />
                Validar
              </motion.button>
            </div>

            {/* Error Message */}
            {step === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center pb-2"
              >
                <p className={`text-xs px-2 leading-relaxed ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errorMsg}</p>
                <button
                  onClick={() => { setStep('enter'); setCodeInput(''); setErrorMsg(''); }}
                  className={`mt-3 text-[10px] uppercase tracking-widest font-bold border px-6 py-2 rounded-xl transition-all ${
                    isDark 
                      ? 'text-white/50 border-white/10 hover:bg-white/5' 
                      : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Intentar de nuevo
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
function EnvelopeModal({
  envelope,
  cards,
  onStick,
}: {
  envelope: EventEnvelope;
  cards: Mona[];
  onStick: () => void;
}) {
  const [envelopeStep, setEnvelopeStep] = useState<'closed' | 'shaking' | 'opening' | 'revealed'>('closed');
  const handleOpen = () => {
    if (envelopeStep !== 'closed') return;
    setEnvelopeStep('shaking');
    setTimeout(() => setEnvelopeStep('opening'), 900);
    setTimeout(() => setEnvelopeStep('revealed'), 1700);
  };
  const isLegendary = envelope.theme === 'especial';
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm z-40"
        onClick={envelopeStep === 'revealed' ? undefined : handleOpen}
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-3xl overflow-hidden"
        style={{
          background: '#050D1A',
          border: `1.5px solid ${envelope.color}33`,
          maxHeight: '85vh',
          maxWidth: '90vw',
          width: '100%',
          overflowY: 'auto',
        }}
      >
        {}
        <div
          className="h-1.5 w-full"
          style={{ background: envelope.gradient }}
        />
        <div className="p-5">
          {}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: envelope.color }}
            >
              <EmojiIcon emoji={envelope.emoji} size={22} color="white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-white font-black text-base">{envelope.label}</h3>
              <p className="text-white/50 text-xs">{envelope.description}</p>
            </div>
            {isLegendary && (
              <div
                className="ml-auto px-2.5 py-1 rounded-full text-white text-[10px] font-black flex items-center gap-1"
                style={{ background: GOLD_GRADIENT }}
              >
                <Sparkles size={10} />
                LEGENDARIO
              </div>
            )}
          </div>
          {envelopeStep !== 'revealed' ? (
            <div className="flex flex-col items-center py-6">
              {}
              <motion.div
                animate={
                  envelopeStep === 'shaking'
                    ? { rotate: [-8, 8, -8, 8, -5, 5, 0], scale: [1, 1.05, 1.05, 1.08, 1.05, 1] }
                    : envelopeStep === 'opening'
                    ? {
                        scale: [1.08, 1.3, 0.6],
                        opacity: [1, 1, 0],
                        y: [0, -30, -50],
                        rotateX: [0, 15, 45],
                      }
                    : {}
                }
                transition={{
                  duration: envelopeStep === 'shaking' ? 0.8 : 1.2,
                  ease: envelopeStep === 'opening' ? [0.4, 0, 0.2, 1] : 'easeInOut',
                }}
                className="relative cursor-pointer"
                onClick={handleOpen}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className="w-36 h-28 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: envelope.gradient,
                    boxShadow: `0 8px 40px ${envelope.color}66`,
                    border: `2px solid ${envelope.color}88`,
                  }}
                >
                  {}
                  {isLegendary && (
                    <motion.div
                      className="absolute inset-0"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(252,211,77,0.3) 50%, transparent 70%)' }}
                    />
                  )}
                  <div className="flex flex-col items-center gap-2 z-10">
                    <EmojiIcon emoji={envelope.emoji} size={44} color="white" strokeWidth={1.5} />
                    <Gift size={18} className="text-white/60" />
                  </div>
                  {}
                  <div
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: 'rgba(0,0,0,0.4)' }}
                  >
                    {cards.length}
                  </div>
                </div>
              </motion.div>
              <p className="text-white/50 text-sm mt-5 text-center">
                {envelopeStep === 'closed' ? 'Toca el sobre para abrirlo' :
                  envelopeStep === 'shaking' ? '¡Agitando el sobre...!' :
                  '¡Abriendo...!'}
              </p>
              <p className="text-white/30 text-xs mt-1">Contiene {cards.length} mona{cards.length !== 1 ? 's' : ''}</p>
            </div>
          ) : (
            <div>
              {}
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} style={{ color: envelope.color }} />
                <h4 className="text-white font-black text-sm">¡Monas desbloqueadas!</h4>
              </div>
              <div className="flex gap-3 mb-5 justify-center flex-wrap">
                {cards.map((card, i) => {
                  const cfg = R[card.rarity];
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ scale: 0, rotate: (i % 2 === 0 ? -25 : 25), y: -60, opacity: 0 }}
                      animate={{
                        scale: 1,
                        rotate: 0,
                        y: 0,
                        opacity: 1,
                      }}
                      transition={{
                        delay: i * 0.15,
                        type: 'spring',
                        stiffness: 180,
                        damping: 12,
                      }}
                      className="relative rounded-lg overflow-hidden flex flex-col items-center py-3 px-2"
                      style={{
                        background: cfg.cardBg,
                        border: `1.5px solid ${cfg.border}`,
                        boxShadow: `0 6px 24px ${cfg.glow}`,
                        aspectRatio: '3/4',
                        width: '110px',
                      }}
                    >
                      {card.rarity === 'legendario' && (
                        <motion.div
                          className="absolute inset-0"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ background: `linear-gradient(135deg, transparent, ${cfg.shimmer}, transparent)` }}
                        />
                      )}
                      <div className="absolute top-1 left-1 right-1 flex justify-between">
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full" style={{ background: cfg.tagBg, color: cfg.textColor }}>
                          {cfg.label.toUpperCase()}
                        </span>
                        <RarityStars count={cfg.stars} color={cfg.textColor} />
                      </div>
                      <div className="flex-1 flex items-center justify-center mt-3">
                        {card.image ? (
                          <div className="w-24 h-24 flex items-center justify-center relative">
                            <img src={card.image} alt={card.name} className="w-full h-full object-contain drop-shadow-xl" style={card.imgScale ? { transform: `scale(${card.imgScale})` } : {}} />
                          </div>
                        ) : (
                          <EmojiIcon emoji={card.emoji} size={32} color="white" strokeWidth={1.8} />
                        )}
                      </div>
                      <div className="w-full text-center mt-1 px-1">
                        <p className="text-sm font-black leading-tight line-clamp-2" style={{ color: cfg.textColor }}>{card.name}</p>
                        <p className="text-xs font-bold mt-1" style={{ color: cfg.textColor }}>+{card.xp} XP</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onStick}
                className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2"
                style={{
                  background: isLegendary ? GOLD_GRADIENT : envelope.gradient,
                  boxShadow: `0 8px 24px ${envelope.color}44`,
                }}
              >
                {isLegendary && <Sparkles size={16} />}
                ¡Pegar monas al álbum!
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
function RouletteModal({ onClose, prizes, onFinish }: { onClose: () => void, prizes: any[], onFinish: (prize: any) => void }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && !spinning) onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, spinning]);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const segmentAngle = 360 / prizes.length;
    const randomOffset = (Math.random() * 0.6 + 0.2) * segmentAngle;
    const finalRotation = rotation + 360 * 6 + (360 - (prizeIndex * segmentAngle)) - randomOffset;
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setSpinning(false);
      onFinish(prizes[prizeIndex]);
    }, 5500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-lg">
       <button onClick={onClose} disabled={spinning} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center disabled:opacity-50"><X size={24} className="text-white" /></button>
       
       <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Ruleta de Premios</h2>
       
       <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] mb-12">
         {/* Indicator */}
         <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[35px] border-t-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
         
         <motion.div 
           className="w-full h-full rounded-full border-[10px] border-slate-800 overflow-hidden shadow-[0_0_80px_rgba(249,115,22,0.4)]"
           animate={{ rotate: rotation }}
           transition={{ duration: 5.5, ease: [0.15, 0.9, 0.1, 1] }}
           style={{ transformOrigin: 'center' }}
         >
           <div className="w-full h-full rounded-full relative" style={{
             background: `conic-gradient(${prizes.map((p, i) => `${i % 2 === 0 ? '#F97316' : '#EA580C'} ${i * (360/prizes.length)}deg ${(i+1) * (360/prizes.length)}deg`).join(', ')})`
           }}>
             {prizes.map((p, i) => (
                <div key={i} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${i * (360/prizes.length) + (360/prizes.length)/2}deg)` }}>
                   <div className="pt-8 text-white font-black text-xs md:text-xl drop-shadow-md" style={{ writingMode: 'vertical-rl' }}>{(p?.name || '').toUpperCase()}</div>
                </div>
             ))}
           </div>
         </motion.div>
         {/* Center dot */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900 border-4 border-slate-700 rounded-full shadow-xl flex items-center justify-center">
           <Star size={24} className="text-orange-500" />
         </div>
       </div>
       
       <motion.button 
         onClick={handleSpin}
         disabled={spinning}
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         className="px-12 py-5 rounded-full text-xl md:text-2xl font-black text-white disabled:opacity-50"
         style={{ background: 'linear-gradient(135deg, #F59E0B, #EA580C)', boxShadow: '0 8px 30px rgba(245, 158, 11, 0.4)' }}
       >
         {spinning ? 'GIRANDO...' : '¡GIRAR AHORA!'}
       </motion.button>
    </motion.div>
  );
}

export function MonasAlbumPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [collection, setCollection] = useState<Mona[]>([...initialMonas]);
  const [activeCategory, setActiveCategory] = useState('todas');
  const [selectedMona, setSelectedMona] = useState<Mona | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showEventCodeModal, setShowEventCodeModal] = useState(false);
  const [pendingEnvelope, setPendingEnvelope] = useState<{ envelope: EventEnvelope; cards: Mona[] } | null>(null);
  const [usedEventCodes, setUsedEventCodes] = useState<string[]>([]);
  const [showRewardModal, setShowRewardModal] = useState<typeof CAFETERIA_PRIZES[0] | null>(null);
  const [claimedRewards, setClaimedRewards] = useState<(typeof CAFETERIA_PRIZES[0])[]>([]);
  
  useEffect(() => {
    if (selectedMona) setIsFlipped(false);
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMona(null);
    };
    if (selectedMona) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedMona]);

  const [pastingMonaId, setPastingMonaId] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [monasPerPage, setMonasPerPage] = useState(18);
  useEffect(() => {
    const handleResize = () => setMonasPerPage(window.innerWidth < 768 ? 12 : 18);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [albumPage, setAlbumPage] = useState(0);
  const [flipDir, setFlipDir] = useState(1);
  const totalMonas = collection.length;
  const unlockedMonas = collection.filter(m => m.unlocked);
  const unlockedCount = unlockedMonas.length;
  const completionPct = Math.round((unlockedCount / totalMonas) * 100);
  const totalXP = unlockedMonas.reduce((sum, m) => sum + m.xp, 0);
  const scannedCount = usedEventCodes.length;
  
  // Nivel calculation (1 nivel por cada 500 XP)
  const currentLevel = Math.floor(totalXP / 500) + 1;
  const availableSpins = currentLevel - 1 - claimedRewards.length;
  const swipeStartX = useRef(0);
  const swipeActive = useRef(false);
  const handlePointerDown = (e: React.PointerEvent) => {
    swipeStartX.current = e.clientX;
    swipeActive.current = true;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!swipeActive.current) return;
    swipeActive.current = false;
    const delta = e.clientX - swipeStartX.current;
    if (delta < -55 && albumPage < totalAlbumPages - 1) goToPage(1);
    else if (delta > 55 && albumPage > 0) goToPage(-1);
  };
  const stars = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: (i % 3) * 0.7 + 1,
    top: ((i * 37 + 13) % 80),
    left: ((i * 53 + 7) % 100),
    opacity: ((i * 17 + 5) % 5) * 0.1 + 0.1,
    duration: ((i * 11 + 3) % 3) + 2,
    delay: ((i * 7 + 2) % 20) * 0.1,
  })), []);
  const filteredMonas = activeCategory === 'todas'
    ? collection
    : collection.filter(m => m.category === activeCategory);
  const totalAlbumPages = Math.ceil(filteredMonas.length / monasPerPage);
  const pageMonas = filteredMonas.slice(albumPage * monasPerPage, (albumPage + 1) * monasPerPage);
  const goToPage = (dir: 1 | -1) => {
    const next = albumPage + dir;
    if (next < 0 || next >= totalAlbumPages) return;
    setFlipDir(dir);
    setAlbumPage(next);
  };
  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setAlbumPage(0);
    setFlipDir(1);
  };
  const flipVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60, rotateY: dir > 0 ? 12 : -12, scale: 0.94 }),
    center: { opacity: 1, x: 0, rotateY: 0, scale: 1, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] } },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, rotateY: dir > 0 ? -12 : 12, scale: 0.94, transition: { duration: 0.26 } }),
  };
  const catProgress = (catId: string) => {
    if (catId === 'todas') return { done: unlockedCount, total: totalMonas };
    const cat = collection.filter(m => m.category === catId);
    return { done: cat.filter(m => m.unlocked).length, total: cat.length };
  };
  const RADIUS = 52;
  const CIRC = 2 * Math.PI * RADIUS;
  const handleEventCodeSuccess = (envelope: EventEnvelope, monas: Mona[]) => {
    setUsedEventCodes(prev => [...prev, envelope.code.toUpperCase()]);
    setShowEventCodeModal(false);
    setTimeout(() => {
      setPendingEnvelope({ envelope, cards: monas });
    }, 300);
  };
  const handleStickCards = () => {
    if (!pendingEnvelope) return;
    setCollection(prev =>
      prev.map(m =>
        pendingEnvelope.cards.find(pc => pc.id === m.id)
          ? { ...m, unlocked: true, unlockedAt: 'Escaneado ahora' }
          : m
      )
    );
    setPendingEnvelope(null);
  };
  const claimReward = (reward: typeof CAFETERIA_PRIZES[0]) => {
    setClaimedRewards(prev => [...prev, reward]);
    setShowRewardModal(reward);
  };
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [showRouletteModal, setShowRouletteModal] = useState(false);

  const handleSpinRoulette = () => {
    if (availableSpins <= 0 || isSpinning) return;
    setShowRouletteModal(true);
  };
  const handleCloseWelcome = () => {
    setShowWelcomeModal(false);
  };
  const handleOpenWelcomeFromInfo = () => {
    setShowWelcomeModal(true);
  };
  const availableEventCodes = EVENT_ENVELOPES.filter(e => !usedEventCodes.includes(e.code.toUpperCase())).length;
  return (
    <div className="min-h-screen pb-32 relative overflow-x-hidden">
      {}
      <div className="sticky top-0 z-40 px-5 pt-4 pb-4 mb-4 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-white/10 transition-all overflow-hidden shadow-sm">
        {}
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 20%, rgba(59,130,246,0.15) 0%, transparent 40%),
              radial-gradient(circle at 85% 30%, rgba(139,92,246,0.12) 0%, transparent 35%),
              radial-gradient(circle at 45% 70%, rgba(6,182,212,0.1) 0%, transparent 30%),
              radial-gradient(circle at 70% 85%, rgba(245,158,11,0.08) 0%, transparent 25%)
            `
          }}
        />
        {}
        <div className="w-[90%] max-w-[1400px] mx-auto flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)' }}>
            <ArrowLeft size={18} style={{ color: isDark ? '#fff' : '#1e293b' }} />
          </button>
          <div className="text-center flex-1">
            <p className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">patrici.a</p>
            <h2 className="font-black text-lg leading-none" style={{ color: isDark ? '#fff' : '#1e293b' }}>Álbum de Patricias</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Espacio reservado si se requiere otro botón en el header futuro */}
          </div>
        </div>
        
        {/* Pagination Info for Monas Grid */}
        {albumPage > 0 && (
          <div className="flex justify-center mt-2">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}>Página {albumPage + 1} / {totalAlbumPages}</span>
          </div>
        )}
      </div>
      <div className="w-full px-4 md:w-[90%] md:px-0 max-w-[1400px] mx-auto flex flex-col gap-6 relative z-10">
            {/* ROW 1: Stats, Mascot & QR */}
            <div className="flex flex-col md:flex-row w-full justify-between items-center gap-10 md:gap-6 xl:gap-12 relative z-20 mt-4 md:mt-12 mb-8 md:mb-12">
              
              {/* Bloque 1: Estadísticas (Cuadrado 2x2) */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 grid grid-cols-2 gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/5 w-full md:flex-1 md:max-w-[400px] aspect-square content-center justify-items-center relative z-20 order-2 md:order-1">
                
                {/* 1. Porcentaje */}
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="relative mx-auto flex justify-center" style={{ width: 130, height: 130 }}>
                    <svg width={130} height={130} viewBox="0 0 130 130" className="drop-shadow-lg">
                      <circle cx={65} cy={65} r={RADIUS} fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9"} strokeWidth={10} />
                      <motion.circle
                        cx={65} cy={65} r={RADIUS}
                        fill="none"
                        stroke="url(#ringGrad)"
                        strokeWidth={10}
                        strokeLinecap="round"
                        strokeDasharray={CIRC}
                        initial={{ strokeDashoffset: CIRC }}
                        animate={{ strokeDashoffset: CIRC - (completionPct / 100) * CIRC }}
                        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '65px 65px' }}
                      />
                      <defs>
                        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#1E3A8A" />
                          <stop offset="50%" stopColor="#3B82F6" />
                          <stop offset="85%" stopColor="#06B6D4" />
                          <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        className="text-3xl font-black text-slate-800 dark:text-white"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        {completionPct}%
                      </motion.span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">completado</span>
                    </div>
                  </div>
                </div>

                {/* 2. Monas */}
                <div className="flex flex-col items-center justify-center w-full">
                  <Library size={36} className="text-blue-500 mb-3" />
                  <span className="text-3xl xl:text-4xl font-black text-slate-800 dark:text-white leading-none">{unlockedCount}/{totalMonas}</span>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-2">Monas</span>
                </div>

                {/* 3. XP Total */}
                <div className="flex flex-col items-center justify-center w-full mt-2 md:mt-0">
                  <Star size={36} className="text-blue-500 mb-3" />
                  <span className="text-3xl xl:text-4xl font-black text-slate-800 dark:text-white leading-none">{totalXP.toLocaleString()}</span>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-2">XP Total</span>
                </div>

                {/* 4. Códigos */}
                <div className="flex flex-col items-center justify-center w-full mt-2 md:mt-0">
                  <Gift size={36} className="text-blue-500 mb-3" />
                  <span className="text-3xl xl:text-4xl font-black text-slate-800 dark:text-white leading-none">{scannedCount}</span>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-2">Códigos</span>
                </div>
              </div>

              {/* Bloque 2: Mascota (Centro) */}
              <div className="flex w-full md:flex-1 items-center justify-center relative aspect-square order-1 md:order-2 mt-8 md:mt-0">
                <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl scale-[1.5] animate-pulse pointer-events-none" />
                <img 
                  src={imgMascota} 
                  alt="Mascota Patricia" 
                  className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] scale-[1.3] md:scale-[1.6] lg:scale-[1.8] hover:scale-[1.4] md:hover:scale-[1.7] lg:hover:scale-[1.9] transition-transform duration-500 ease-out relative z-30 md:-translate-y-6 pointer-events-auto" 
                />
              </div>

              {/* Bloque 3: Botón Flotante (Cuadrado igual al primero) */}
              <div 
                className="w-full md:flex-1 md:max-w-[400px] aspect-square flex flex-col items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-slate-200/50 dark:border-white/5 hover:bg-white dark:hover:bg-slate-900/80 transition-all duration-300 group cursor-pointer z-20 order-3"
                onClick={() => setShowEventCodeModal(true)}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] flex items-center justify-center bg-gradient-to-tr from-orange-600 to-orange-400 shadow-[0_8px_30px_rgba(249,115,22,0.4)] transition-shadow mb-6 group-hover:shadow-[0_12px_40px_rgba(249,115,22,0.6)]"
                >
                  <Gift size={48} className="text-white" />
                </motion.div>
                <span className="text-xl md:text-2xl font-black text-orange-500 text-center leading-tight group-hover:scale-105 transition-transform">Ingresar<br/>Código</span>
              </div>
            </div>

            {/* ROW 2: Recompensas y Ruleta */}
            <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-black flex items-center gap-2 text-slate-800 dark:text-white mb-2">
                  <Trophy size={24} className="text-orange-500" /> Ruleta de Recompensas
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  Sube de nivel obteniendo monas y gana recompensas en las cafeterías. <strong>Nivel actual: {currentLevel}</strong>
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="h-full bg-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((totalXP % 500) / 500) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500">{totalXP % 500} / 500 XP</span>
                </div>
                {availableSpins > 0 ? (
                  <motion.button
                    onClick={handleSpinRoulette}
                    disabled={isSpinning}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full md:w-auto px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <PartyPopper size={24} />
                    {`¡Girar Ruleta! (${availableSpins} disp.)`}
                  </motion.button>
                ) : (
                  <div className="w-full md:w-auto inline-block px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 font-bold text-sm">
                    Consigue {500 - (totalXP % 500)} XP más para el próximo giro.
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/3 flex flex-col gap-3">
                <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Tus premios</h4>
                {claimedRewards.length === 0 ? (
                  <div className="text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-600 text-sm font-medium">
                    Aún no tienes premios.<br/>¡Sube al nivel 2 para tu primer giro!
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2">
                    {claimedRewards.map((prize, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${prize.color}20` }}>
                          <EmojiIcon emoji={prize.emoji} size={20} color={prize.color} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{prize.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Nivel {idx + 2}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

      </div>
      <div className="mt-5 w-full px-4 md:w-[90%] md:px-0 max-w-[1400px] mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
          {CATEGORIES.map(cat => {
            const prog = catProgress(cat.id);
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all"
                style={{
                  background: isActive ? `linear-gradient(135deg, ${cat.color}33, ${cat.color}22)` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  border: `1.5px solid ${isActive ? cat.color : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: isActive ? `0 0 12px ${cat.color}44` : 'none',
                }}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <EmojiIcon emoji={cat.emoji} size={16} color={isActive ? cat.color : isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)'} strokeWidth={2} />
                </div>
                <span className="text-[9px] font-bold" style={{ color: isActive ? cat.color : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>{cat.label}</span>
                <span className="text-[8px]" style={{ color: isActive ? cat.color : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)' }}>{prog.done}/{prog.total}</span>
              </button>
            );
          })}
        </div>
      </div>
      {}
      <div
        className="mt-6 relative select-none w-full md:w-[95%] max-w-[1500px] mx-auto px-4 md:px-0"
        style={{ perspective: '1500px' }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { swipeActive.current = false; }}
      >
        <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-slate-50 dark:bg-[#0B1324] shadow-[0_20px_60px_rgb(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgb(0,0,0,0.5)] border border-slate-200 dark:border-white/5 transition-colors">
          
          {/* Lomo lateral (Mobile) */}
          <div
            className="md:hidden absolute left-0 top-0 bottom-0 w-6 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)',
              borderRight: '1px solid rgba(255,255,255,0.05)'
            }}
          />

          {/* Lomo central (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-16 -ml-8 z-20 pointer-events-none" style={{
            background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 70%, transparent 100%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
          }} />

          {/* Sombreado de páginas (Desktop) */}
          <div className="hidden md:block absolute inset-0 z-0 pointer-events-none" style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 48%, rgba(0,0,0,0.08) 50%, rgba(255,255,255,0.02) 52%, rgba(255,255,255,0) 100%)'
          }} />

          <div className="relative z-10 w-full min-h-[500px] p-6 pb-12 md:p-12 flex flex-col items-center">
            
            {/* Encabezado Impreso */}
            {activeCategory !== 'todas' && albumPage === 0 && (
              <motion.div key={activeCategory} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-center mb-8 md:mb-12">
                <div className="px-6 md:px-12 py-3 md:py-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 flex items-center gap-3 md:gap-4 shadow-sm backdrop-blur-sm z-30 relative">
                  <EmojiIcon emoji={CATEGORIES.find(c => c.id === activeCategory)?.emoji ?? '✨'} size={28} color={CATEGORIES.find(c => c.id === activeCategory)?.color ?? '#3B82F6'} strokeWidth={1.5} />
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-[0.2em]">{CATEGORIES.find(c => c.id === activeCategory)?.label}</h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest">{catProgress(activeCategory).done} DE {catProgress(activeCategory).total} MONAS</p>
                  </div>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait" custom={flipDir}>
              <motion.div
                key={`page-${albumPage}-${activeCategory}`}
                custom={flipDir}
                variants={{
                  enter: (dir) => ({ opacity: 0, rotateY: dir > 0 ? 90 : -90, z: -200 }),
                  center: { opacity: 1, rotateY: 0, z: 0, transition: { duration: 0.5, type: 'spring', stiffness: 80, damping: 15 } },
                  exit: (dir) => ({ opacity: 0, rotateY: dir > 0 ? -90 : 90, z: -200, transition: { duration: 0.3 } })
                }}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex flex-col md:flex-row gap-8 md:gap-0 cursor-grab active:cursor-grabbing"
                style={{ transformStyle: 'preserve-3d', transformOrigin: 'center' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset }) => {
                  const threshold = 50;
                  if (offset.x < -threshold && albumPage < totalAlbumPages - 1) {
                    goToPage(1);
                  } else if (offset.x > threshold && albumPage > 0) {
                    goToPage(-1);
                  }
                }}
              >
                
                {/* === MOBILE GRID (1 column wrapper) === */}
                <div className="md:hidden w-full grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {pageMonas.map((mona, i) => (
                    <MonaSlotRender key={mona.id} mona={mona} i={i} albumPage={albumPage} monasPerPage={monasPerPage} setPastingMonaId={setPastingMonaId} pastingMonaId={pastingMonaId} setCollection={setCollection} setSelectedMona={setSelectedMona} />
                  ))}
                  {pageMonas.length < monasPerPage && albumPage === totalAlbumPages - 1 &&
                    Array.from({ length: monasPerPage - pageMonas.length }).map((_, i) => (
                      <EmptySlotRender key={`e-${i}`} index={pageMonas.length + i + (albumPage * monasPerPage)} />
                    ))
                  }
                </div>

                {/* === DESKTOP SPREAD (2 columns wrapper) === */}
                {/* Left Page */}
                <div className="hidden md:grid w-1/2 pr-12 grid-cols-3 gap-6 auto-rows-max">
                  {pageMonas.slice(0, 9).map((mona, i) => (
                    <MonaSlotRender key={mona.id} mona={mona} i={i} albumPage={albumPage} monasPerPage={monasPerPage} setPastingMonaId={setPastingMonaId} pastingMonaId={pastingMonaId} setCollection={setCollection} setSelectedMona={setSelectedMona} />
                  ))}
                  {pageMonas.length < 9 && albumPage === totalAlbumPages - 1 &&
                    Array.from({ length: 9 - pageMonas.length }).map((_, i) => (
                      <EmptySlotRender key={`el-${i}`} index={pageMonas.length + i + (albumPage * monasPerPage)} />
                    ))
                  }
                </div>

                {/* Right Page */}
                <div className="hidden md:grid w-1/2 pl-12 grid-cols-3 gap-6 auto-rows-max">
                  {pageMonas.slice(9, 18).map((mona, i) => (
                    <MonaSlotRender key={mona.id} mona={mona} i={i + 9} albumPage={albumPage} monasPerPage={monasPerPage} setPastingMonaId={setPastingMonaId} pastingMonaId={pastingMonaId} setCollection={setCollection} setSelectedMona={setSelectedMona} />
                  ))}
                  {pageMonas.length >= 9 && pageMonas.length < 18 && albumPage === totalAlbumPages - 1 &&
                    Array.from({ length: 18 - pageMonas.length }).map((_, i) => (
                      <EmptySlotRender key={`er-${i}`} index={pageMonas.length + i + (albumPage * monasPerPage)} />
                    ))
                  }
                  {pageMonas.length < 9 && albumPage === totalAlbumPages - 1 &&
                    Array.from({ length: 9 }).map((_, i) => (
                      <EmptySlotRender key={`er-all-${i}`} index={9 + i + (albumPage * monasPerPage)} />
                    ))
                  }
                </div>

              </motion.div>
            </AnimatePresence>

            {filteredMonas.length === 0 && (
              <div className="text-center py-20 w-full relative z-30">
                <Library size={56} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-sm">Página en blanco</p>
              </div>
            )}
          </div>
        </div>{}
        {}
        {albumPage < totalAlbumPages - 1 && (
          <motion.div
            className="absolute bottom-1 right-1 pointer-events-none"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div style={{
              width: 28, height: 28,
              background: 'linear-gradient(135deg, transparent 50%, rgba(245,158,11,0.35) 50%)',
              borderRadius: '0 0 8px 0',
            }} />
            <div
              className="absolute bottom-0 right-0"
              style={{
                width: 14, height: 14,
                background: 'linear-gradient(135deg, rgba(245,158,11,0.6), rgba(217,119,6,0.4))',
                borderRadius: '0 0 6px 0',
                boxShadow: '-2px -2px 6px rgba(0,0,0,0.5)',
              }}
            />
          </motion.div>
        )}
        {}
        {totalAlbumPages > 1 && albumPage === 0 && (
          <motion.p
            className="text-center text-white/30 text-[10px] mt-3 pointer-events-none"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ← desliza para pasar la página →
          </motion.p>
        )}
      </div>{}
      {}
      {totalAlbumPages > 1 && (
        <div className="px-4 mt-6 flex items-center justify-between w-full md:w-[90%] max-w-[1400px] mx-auto">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => goToPage(-1)} disabled={albumPage === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-white disabled:opacity-30"
            style={{ background: albumPage > 0 ? GOLD_GRADIENT : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ChevronLeft size={16} /> Anterior
          </motion.button>
          <div className="flex gap-1.5 items-center">
            {Array.from({ length: totalAlbumPages }).map((_, i) => (
              <button key={i} onClick={() => { setFlipDir(i > albumPage ? 1 : -1); setAlbumPage(i); }}
                className="rounded-full transition-all"
                style={{ width: i === albumPage ? 20 : 6, height: 6, background: i === albumPage ? GOLD_LIGHT : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => goToPage(1)} disabled={albumPage >= totalAlbumPages - 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-white disabled:opacity-30"
            style={{ background: albumPage < totalAlbumPages - 1 ? GOLD_GRADIENT : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Siguiente <ChevronRight size={16} />
          </motion.button>
        </div>
      )}
      {}
      <AnimatePresence>
        {showEventCodeModal && (
          <EventCodeModal
            onClose={() => setShowEventCodeModal(false)}
            onSuccess={handleEventCodeSuccess}
            usedCodes={usedEventCodes}
          />
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {pendingEnvelope && (
          <EnvelopeModal
            envelope={pendingEnvelope.envelope}
            cards={pendingEnvelope.cards}
            onStick={handleStickCards}
          />
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {selectedMona && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
              onClick={() => setSelectedMona(null)}
            />
            {/* Botón X fuera de la carta */}
            <button
              onClick={() => setSelectedMona(null)}
              className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/20"
            >
              <X size={20} className="text-white" />
            </button>
            <div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              style={{ perspective: '1200px' }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotateY: isFlipped ? 180 : 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative w-[320px] sm:w-[360px] cursor-pointer pointer-events-auto"
                style={{ aspectRatio: '3/4', transformStyle: 'preserve-3d' }}
              >
                {/* CARA FRONTAL (FRONT FACE) */}
                <div
                  className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col items-center justify-between py-8 px-6"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    background: selectedMona.unlocked ? R[selectedMona.rarity].cardBg : 'linear-gradient(160deg, #0A1628, #112240)',
                    border: `2px solid ${selectedMona.unlocked ? R[selectedMona.rarity].border : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: selectedMona.unlocked ? `0 12px 48px ${R[selectedMona.rarity].glow}` : '0 12px 48px rgba(0,0,0,0.5)',
                  }}
                >
                  {selectedMona.unlocked ? (
                    <>
                      {selectedMona.rarity === 'legendario' && (
                        <motion.div
                          className="absolute inset-0"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ background: `linear-gradient(135deg, transparent, ${R[selectedMona.rarity].shimmer}, transparent)` }}
                        />
                      )}
                      <div className="flex justify-between w-full z-10">
                        <span className="text-[10px] font-black tracking-widest" style={{ color: R[selectedMona.rarity].textColor }}>
                          {R[selectedMona.rarity].label.toUpperCase()}
                        </span>
                        <RarityStars count={R[selectedMona.rarity].stars} color={R[selectedMona.rarity].textColor} />
                      </div>
                      <div className="flex-1 flex items-center justify-center z-10 w-full">
                        {selectedMona.image ? (
                          <div className="w-48 h-48 flex items-center justify-center relative drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                            <img src={selectedMona.image} alt={selectedMona.name} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-40 h-40 flex items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.05)', boxShadow: `inset 0 0 40px ${R[selectedMona.rarity].glow}40` }}>
                            <EmojiIcon emoji={selectedMona.emoji} size={80} color="white" strokeWidth={1.2} />
                          </div>
                        )}
                      </div>
                      <div className="w-full text-center z-10 bg-black/40 backdrop-blur-sm rounded-2xl py-4 px-3 border border-white/10">
                        <p className="text-xl font-black mb-1" style={{ color: R[selectedMona.rarity].textColor }}>{selectedMona.name}</p>
                        <p className="text-xs uppercase tracking-widest" style={{ color: `${R[selectedMona.rarity].textColor}99` }}>
                          {selectedMona.category}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between w-full z-10 opacity-30">
                        <span className="text-[10px] font-black tracking-widest text-white">BLOQUEADA</span>
                        <Lock size={14} className="text-white" />
                      </div>
                      <div className="flex-1 flex items-center justify-center z-10">
                        <div className="w-32 h-32 flex items-center justify-center rounded-full bg-white/5">
                          <Lock size={48} className="text-white/20" />
                        </div>
                      </div>
                      <div className="w-full text-center z-10 bg-black/40 rounded-2xl py-4 px-3 border border-white/5">
                        <p className="text-xl font-black mb-1 text-white/40">???</p>
                        <p className="text-xs uppercase tracking-widest text-white/20">{selectedMona.category}</p>
                      </div>
                    </>
                  )}
                  {/* Hint to flip */}
                  <div className="absolute bottom-3 left-0 right-0 text-center z-10">
                    <p className="text-[9px] text-white/30 uppercase tracking-widest animate-pulse">Toca para girar</p>
                  </div>
                </div>

                {/* CARA TRASERA (BACK FACE) */}
                <div
                  className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col px-6 py-8"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: '#0A1628',
                    border: `2px solid ${selectedMona.unlocked ? R[selectedMona.rarity].border : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: selectedMona.unlocked ? `0 12px 48px ${R[selectedMona.rarity].glow}` : '0 12px 48px rgba(0,0,0,0.5)',
                  }}
                >
                  {selectedMona.unlocked ? (
                    <div className="flex flex-col h-full">
                      <div className="text-center mb-6">
                        <h3 className="text-white font-black text-2xl leading-tight">{selectedMona.name}</h3>
                        <p className="text-blue-400 text-xs uppercase tracking-widest mt-1">{selectedMona.category}</p>
                      </div>
                      
                      <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10 overflow-y-auto">
                        <p className="text-white/80 text-sm leading-relaxed text-center">"{selectedMona.description}"</p>
                      </div>

                      <div className="mt-6 flex flex-col items-center justify-center">
                        {selectedMona.unlockedAt ? (
                          <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 w-full">
                            <span className="text-[10px] uppercase tracking-widest text-white/40">Fecha de obtención</span>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-green-400" />
                              <span className="text-sm text-green-400 font-black tracking-wide">{selectedMona.unlockedAt}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 w-full">
                            <span className="text-[10px] uppercase tracking-widest text-white/40">Fecha de obtención</span>
                            <span className="text-sm text-white/70 font-black tracking-wide">Desconocida</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <Lock size={24} className="text-white/30" />
                      </div>
                      <h3 className="text-white/70 font-black text-xl mb-2">Mona Bloqueada</h3>
                      <p className="text-white/40 text-sm leading-relaxed px-4 mb-8">
                        Para revelar esta lámina, necesitas ingresar un código de evento válido.
                      </p>
                      
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={(e) => { e.stopPropagation(); setSelectedMona(null); setTimeout(() => setShowEventCodeModal(true), 200); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-white text-sm font-bold shadow-lg"
                        style={{ background: GOLD_GRADIENT }}
                      >
                        <Gift size={16} />
                        Ingresar Código de Evento
                      </motion.button>
                    </div>
                  )}
                  {/* Hint to flip back */}
                  <div className="absolute bottom-3 left-0 right-0 text-center z-10 pointer-events-none">
                    <p className="text-[9px] text-white/30 uppercase tracking-widest">Toca para regresar</p>
                  </div>
                </div>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showRouletteModal && (
          <RouletteModal 
            prizes={CAFETERIA_PRIZES} 
            onClose={() => setShowRouletteModal(false)}
            onFinish={(prize) => {
              setShowRouletteModal(false);
              claimReward(prize);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRewardModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
              onClick={() => setShowRewardModal(null)}
            />
            {/* Botón X fuera de la carta */}
            <button
              onClick={() => setShowRewardModal(null)}
              className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/20"
            >
              <X size={20} className="text-white" />
            </button>
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                className="relative w-[320px] sm:w-[360px] rounded-3xl overflow-hidden flex flex-col items-center justify-between py-8 px-6 pointer-events-auto"
                style={{
                  aspectRatio: '3/4',
                  background: `linear-gradient(135deg, ${showRewardModal.color}40 0%, ${showRewardModal.color}10 100%)`,
                  border: `2px solid ${showRewardModal.color}`,
                  boxShadow: `0 12px 48px ${showRewardModal.color}60`,
                }}
              >
                {showRewardModal.pct === 100 && (
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ background: `linear-gradient(135deg, transparent, ${showRewardModal.color}40, transparent)` }}
                  />
                )}
                
                <div className="flex justify-between w-full z-10">
                  <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: showRewardModal.color }}>
                    RECOMPENSA
                  </span>
                  <Trophy size={16} style={{ color: showRewardModal.color }} />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center z-10 w-full gap-6">
                  <div className="w-32 h-32 flex items-center justify-center rounded-full relative" style={{ background: 'rgba(255,255,255,0.05)', boxShadow: `inset 0 0 40px ${showRewardModal.color}40` }}>
                    <EmojiIcon emoji={showRewardModal.emoji} size={64} color={showRewardModal.color} strokeWidth={1.5} />
                  </div>
                  
                  <div className="w-full text-center bg-black/40 backdrop-blur-sm rounded-2xl py-4 px-3 border border-white/10">
                    <h3 className="text-xl font-black mb-1" style={{ color: showRewardModal.color }}>{showRewardModal.name}</h3>
                    <p className="text-xs uppercase tracking-widest text-white/50">¡Premio de la Ruleta!</p>
                    <p className="text-white/80 text-sm mt-3 leading-relaxed">"Muestra esta pantalla en la caja de cualquier cafetería del campus para reclamar tu premio."</p>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowRewardModal(null)}
                  className="w-full mt-4 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest z-10 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${showRewardModal.color}, ${showRewardModal.color}CC)`,
                    boxShadow: `0 8px 24px ${showRewardModal.color}40`
                  }}
                >
                  <Gift size={18} />
                  ¡Entendido!
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showWelcomeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={`fixed inset-0 backdrop-blur-[24px] z-40 transition-colors duration-300 ${
                isDark ? 'bg-black/75' : 'bg-black/40'
              }`}
            />
            {/* Botón X fuera de la carta */}
            <button
              onClick={handleCloseWelcome}
              className={`fixed top-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors backdrop-blur-md border ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                  : 'bg-black/5 hover:bg-black/10 border-black/10 text-gray-800'
              }`}
            >
              <X size={20} />
            </button>
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-5">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                className="relative w-full max-w-[420px] rounded-[32px] p-6 h-[62.5vh] max-h-[62.5vh] flex flex-col justify-between pointer-events-auto custom-scrollbar transition-all duration-300 overflow-y-auto"
                style={{ 
                  background: isDark ? 'linear-gradient(160deg, #0A1628, #112240)' : 'linear-gradient(160deg, #FDFCF8, #EDE9E0)', 
                  border: isDark ? '2px solid rgba(59,130,246,0.4)' : '2px solid rgba(59,130,246,0.25)',
                  boxShadow: isDark ? '0 12px 48px rgba(59,130,246,0.2)' : '0 12px 48px rgba(59,130,246,0.12)'
                }}
              >
                <div>
                  <div className="text-center mb-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-bounce" style={{ background: GOLD_GRADIENT, animationDuration: '3s' }}>
                      <Library size={28} className="text-white" />
                    </div>
                    <h2 className={`font-black text-2xl tracking-tight transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>¡Bienvenido al Álbum!</h2>
                    <p className={`text-sm mt-1 font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Colecciona Patricias y gana recompensas</p>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)' }}>
                        <Library size={20} className={isDark ? "text-blue-400" : "text-blue-600"} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-sm transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Patricias (Láminas)</h3>
                        <p className={`text-xs mt-1 leading-relaxed transition-colors ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                          Son coleccionables que obtienes al asistir a parches o escaneando códigos QR ocultos en el campus.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)' }}>
                        <Trophy size={20} className={isDark ? "text-amber-400" : "text-amber-600"} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-sm transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>El Gran Objetivo</h3>
                        <p className={`text-xs mt-1 leading-relaxed transition-colors ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                          Coleccionar patricias suma <strong className={isDark ? "text-white font-black" : "text-gray-900 font-black"}>XP</strong>. Por cada 500 XP, subirás de nivel y obtendrás giros en la ruleta para ganar premios reales en las cafeterías.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCloseWelcome}
                  className="w-full py-3 rounded-xl text-white font-black text-xs uppercase tracking-widest shadow-lg"
                  style={{ background: GRADIENT }}
                >
                  ¡Entendido!
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}