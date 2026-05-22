import * as React from 'react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
const CHROME: Record<string, string> = {
  común:      'linear-gradient(135deg, #93C5FD 0%, #1E40AF 25%, #BFDBFE 50%, #3B82F6 75%, #93C5FD 100%)',
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
  Home, Rocket, Crown,
} from 'lucide-react';
import {
  monas as initialMonas, GRADIENT, GOLD_GRADIENT, GOLD_LIGHT, GOLD,
  TEAL, QR_ENVELOPES, type Mona, type QREnvelope,
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
const R = {
  común: {
    stars: 1, label: 'Común',
    border: '#3B82F6', glow: 'rgba(59,130,246,0.45)',
    cardBg: 'linear-gradient(160deg, #0F2450 0%, #1D4ED8 100%)',
    shimmer: 'rgba(96,165,250,0.25)', textColor: '#BFDBFE', tagBg: 'rgba(59,130,246,0.2)',
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
  { id: 'live-music', label: 'Live Music', emoji: '🎵', color: '#8B5CF6' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌲', color: '#10B981' },
  { id: 'study', label: 'Study', emoji: '📚', color: '#3B82F6' },
  { id: 'foodie', label: 'Foodie', emoji: '🍕', color: '#F59E0B' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮', color: '#6366F1' },
  { id: 'arte', label: 'Arte', emoji: '🎨', color: '#EC4899' },
];
interface Badge {
  id: string;
  name: string;
  description: string;
  Icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
  unlocked: boolean;
  category: 'conexiones' | 'parches' | 'campus' | 'especiales';
  rarity: 'común' | 'poco común' | 'raro' | 'épico' | 'legendario';
  xp: number;
  imgSrc?: string;
}
const BADGES: Badge[] = [
  { id: 'primer-choque', name: 'Primer Choque', description: 'Realiza tu primera conexión con otro usuario', Icon: Handshake, color: '#9CA3AF', unlocked: true, category: 'conexiones', rarity: 'común', xp: 50, imgSrc: imgPrimerChoque },
  { id: 'conocido-campus', name: 'Conocido del Campus', description: 'Acumula 5 conexiones activas', Icon: UsersIcon, color: '#10B981', unlocked: true, category: 'conexiones', rarity: 'poco común', xp: 150, imgSrc: imgConocidoDelCampus },
  { id: 'alma-social', name: 'Alma Social', description: 'Acumula 10 conexiones activas', Icon: Network, color: '#3B82F6', unlocked: false, category: 'conexiones', rarity: 'raro', xp: 350, imgSrc: imgAlmaSocial },
  { id: 'parche-iniciado', name: 'Parche Iniciado', description: 'Únete o crea tu primer parche', Icon: Zap, color: '#9CA3AF', unlocked: true, category: 'parches', rarity: 'común', xp: 75, imgSrc: imgParcheIniciado },
  { id: 'capitan-nato', name: 'Capitán Nato', description: 'Crea 2 parches como capitán', Icon: Award, color: '#10B981', unlocked: false, category: 'parches', rarity: 'poco común', xp: 200, imgSrc: imgCapitanNato },
  { id: 'el-previsor', name: 'El Previsor', description: 'Crea un parche con más de 3 días de anticipación', Icon: Calendar, color: '#9CA3AF', unlocked: true, category: 'parches', rarity: 'común', xp: 75, imgSrc: imgElPrevisor },
  { id: 'rompe-hielos', name: 'El Rompe Hielos', description: 'Envía el primer mensaje en un parche recién creado', Icon: MessageCircle, color: '#9CA3AF', unlocked: true, category: 'parches', rarity: 'común', xp: 100, imgSrc: imgElRompeHielos },
  { id: 'anfitrion', name: 'Anfitrión', description: 'Consigue que alguien se una a un parche que tú creaste', Icon: Home, color: '#9CA3AF', unlocked: false, category: 'parches', rarity: 'común', xp: 75, imgSrc: imgAnfitrion },
  { id: 'explorador', name: 'Explorador', description: 'Visita 3 zonas distintas del campus', Icon: Map, color: '#9CA3AF', unlocked: true, category: 'campus', rarity: 'común', xp: 75, imgSrc: imgExplorador },
  { id: 'nomada-eci', name: 'Nómada ECI', description: 'Visita 5 zonas distintas del campus', Icon: MapPin, color: '#10B981', unlocked: false, category: 'campus', rarity: 'poco común', xp: 175, imgSrc: imgNomada },
  { id: 'espiritu-eci', name: 'Espíritu ECI', description: 'Asiste a un evento universitario institucional', Icon: Building2, color: '#3B82F6', unlocked: true, category: 'campus', rarity: 'raro', xp: 300, imgSrc: imgEspirituECI },
  { id: 'viral-eci', name: 'Viral ECI', description: 'Pasa de 0 a 10 conexiones en menos de 30 días desde tu registro', Icon: Rocket, color: '#8B5CF6', unlocked: false, category: 'especiales', rarity: 'épico', xp: 850, imgSrc: imgViral },
  { id: 'leyenda-patricia', name: 'La Leyenda Patrici.a', description: 'Desbloquea las 12 medallas anteriores', Icon: Crown, color: '#F59E0B', unlocked: false, category: 'especiales', rarity: 'legendario', xp: 1500, imgSrc: imgLaLeyenda },
];
const DEMO_CODES = [
  { code: 'PATRICIA-TECH-001', label: 'Tech', color: '#3B82F6', emoji: '⚡' },
  { code: 'PATRICIA-SOCIAL-002', label: 'Social', color: '#06B6D4', emoji: '👑' },
  { code: 'PATRICIA-CULTURA-003', label: 'Cultura', color: '#8B5CF6', emoji: '🎨' },
  { code: 'PATRICIA-WELLNESS-004', label: 'Bienestar', color: '#10B981', emoji: '💚' },
  { code: 'PATRICIA-ACADEMIA-005', label: 'Academia', color: '#6366F1', emoji: '🎓' },
  { code: 'PATRICIA-LEGEND-006', label: '★ Legendario', color: '#F59E0B', emoji: '🌟' },
];
function BadgeCard({ badge, i, onClick, legendaryGlow, isDark }: {
  badge: Badge;
  i: number;
  onClick: () => void;
  legendaryGlow?: boolean;
  isDark: boolean;
}) {
  const cardBg = isDark
    ? badge.unlocked ? `linear-gradient(135deg, ${badge.color}22 0%, ${badge.color}0c 100%)` : 'rgba(255,255,255,0.05)'
    : '#ffffff';
  const cardBorder = isDark
    ? `1.5px solid ${badge.unlocked ? `${badge.color}45` : 'rgba(255,255,255,0.1)'}`
    : `1.5px solid ${badge.unlocked ? `${badge.color}55` : 'rgba(0,0,0,0.09)'}`;
  const cardShadow = badge.unlocked
    ? legendaryGlow
      ? `0 0 22px ${badge.color}55, 0 0 8px ${badge.color}70`
      : isDark ? `0 0 12px ${badge.color}30` : `0 2px 10px ${badge.color}22, 0 1px 4px rgba(0,0,0,0.06)`
    : isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)';
  const imgFilter = !badge.unlocked
    ? 'grayscale(100%) opacity(0.35)'
    : isDark
      ? 'none'
      : 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))';
  const nameColor = badge.unlocked
    ? isDark ? 'rgba(255,255,255,0.92)' : '#1e293b'
    : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  return (
    <motion.button
      key={badge.id}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ delay: i * 0.05 }}
      className="relative rounded-xl flex flex-col items-center"
      style={{
        aspectRatio: '3 / 4',
        padding: '8px 6px 6px',
        gap: 4,
        background: cardBg,
        border: cardBorder,
        boxShadow: cardShadow,
      }}
    >
      {legendaryGlow && badge.unlocked && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: `linear-gradient(135deg, transparent 30%, ${badge.color}22 50%, transparent 70%)` }}
        />
      )}
      {}
      <div className="relative flex-1 w-full flex items-center justify-center min-h-0">
        {badge.imgSrc ? (
          <>
            <img
              src={badge.imgSrc}
              alt={badge.name}
              style={{
                maxWidth: '72%',
                maxHeight: '100%',
                objectFit: 'contain',
                filter: imgFilter,
                display: 'block',
              }}
            />
            {}
            {!badge.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Lock size={16} style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }} />
              </div>
            )}
          </>
        ) : (
          <>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: badge.unlocked ? `${badge.color}20` : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
            >
              <badge.Icon
                size={22}
                style={{
                  color: badge.unlocked ? badge.color : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  filter: !badge.unlocked ? 'grayscale(100%)' : 'none',
                }}
              />
            </div>
            {!badge.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Lock size={16} style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }} />
              </div>
            )}
          </>
        )}
      </div>
      {}
      <p
        style={{
          fontSize: '8.5px',
          fontWeight: 700,
          lineHeight: 1.2,
          textAlign: 'center',
          width: '100%',
          color: nameColor,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {badge.name}
      </p>
    </motion.button>
  );
}
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
          <div className="absolute top-0.5 left-0.5 right-0.5 flex justify-between items-center z-10">
            <span className="text-[6px] font-black px-1 py-0.5 rounded-full" style={{ background: cfg.tagBg, color: cfg.textColor }}>
              {cfg.label.toUpperCase()}
            </span>
            <RarityStars count={cfg.stars} color={cfg.textColor} />
          </div>
          {}
          <div
            className="flex-1 flex items-center justify-center relative z-10"
            style={{ marginTop: '14px', marginBottom: '2px' }}
          >
            <EmojiIcon emoji={mona.emoji} size={24} color="white" strokeWidth={1.8} />
          </div>
          {}
          <div className="w-full px-1 pb-1 pt-0.5 text-center z-10" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <p className="text-[7px] font-black leading-tight truncate" style={{ color: cfg.textColor }}>
              {mona.name}
            </p>
            <p className="text-[6px] mt-0.5" style={{ color: `${cfg.textColor}99` }}>+{mona.xp} XP</p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
function MonaCardLocked({ mona, index, onClick }: { mona: Mona; index: number; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className="relative w-full"
      style={{ aspectRatio: '3/4' }}
    >
      {}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
          padding: '2px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.7)',
        }}
      >
        {}
        <div
          className="relative w-full h-full rounded-[9px] overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(160deg, #030810 0%, #050d1a 100%)',
            boxShadow: [
              'inset 0 3px 10px rgba(0,0,0,0.97)',
              'inset 0 -1px 3px rgba(255,255,255,0.025)',
              'inset 3px 0 8px rgba(0,0,0,0.85)',
              'inset -3px 0 8px rgba(0,0,0,0.85)',
              'inset 0 0 20px rgba(0,0,0,0.6)',
            ].join(', '),
          }}
        >
          {}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(59,130,246,0.04) 0px, rgba(59,130,246,0.04) 1px, transparent 0px, transparent 6px)',
              backgroundSize: '6px 6px',
            }}
          />
          {}
          <div className="absolute top-0 left-0 w-3 h-3" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 50%, transparent 50%)',
          }} />
          {}
          <div className="absolute top-1 left-1 z-10">
            <span className="text-[6px] font-black text-white/15">#{String(index + 1).padStart(2, '0')}</span>
          </div>
          {}
          <div className="flex-1 flex items-center justify-center relative z-10" style={{ marginTop: '12px', marginBottom: '2px' }}>
            <EmojiIcon emoji={mona.emoji} size={24} color="white" strokeWidth={1.5} className="opacity-[0.05]" />
          </div>
          {}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: GOLD_GRADIENT,
                boxShadow: `0 0 16px ${GOLD_LIGHT}40`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  `0 0 16px ${GOLD_LIGHT}40`,
                  `0 0 24px ${GOLD_LIGHT}60`,
                  `0 0 16px ${GOLD_LIGHT}40`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span className="text-white font-black text-lg">+</span>
            </motion.div>
          </div>
          {}
          <div className="w-full py-1 text-center z-10" style={{ background: 'rgba(0,0,0,0.55)' }}>
            <p className="text-[6px] font-black tracking-widest text-white/15">???</p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
function QRScannerModal({
  onClose,
  onSuccess,
  usedCodes,
}: {
  onClose: () => void;
  onSuccess: (envelope: QREnvelope, monas: Mona[]) => void;
  usedCodes: string[];
}) {
  const [step, setStep] = useState<'scan' | 'validating' | 'success' | 'error'>('scan');
  const [qrInput, setQrInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [foundEnvelope, setFoundEnvelope] = useState<QREnvelope | null>(null);
  const [collection] = useState<Mona[]>([...initialMonas]);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleValidate = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    setStep('validating');
    setTimeout(() => {
      const envelope = QR_ENVELOPES.find(e => e.code.toUpperCase() === normalized);
      if (!envelope) {
        setErrorMsg('Código QR inválido. Intenta con otro código.');
        setStep('error');
        return;
      }
      if (usedCodes.includes(normalized)) {
        setErrorMsg('Este código ya fue escaneado anteriormente. Cada código es de un solo uso.');
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto"
      style={{ background: 'rgba(2,8,20,0.97)' }}
    >
      {}
      <div className="w-full flex items-center justify-between px-5 pt-12 pb-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">patrici.a</p>
          <h2 className="text-white font-black text-lg leading-none">Escanear QR</h2>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <X size={18} className="text-white" />
        </button>
      </div>
      {}
      <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
        {}
        <div className="absolute inset-0 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }} />
        {}
        {[
          { top: 8, left: 8, rotate: 0 },
          { top: 8, right: 8, rotate: 90 },
          { bottom: 8, right: 8, rotate: 180 },
          { bottom: 8, left: 8, rotate: 270 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              ...(pos as unknown as React.CSSProperties),
              width: 28, height: 28,
              borderColor: step === 'success' ? '#10B981' : step === 'error' ? '#EF4444' : GOLD_LIGHT,
              borderStyle: 'solid',
              borderWidth: '3px 0 0 3px',
              borderTopLeftRadius: 6,
              transform: `rotate(${pos.rotate}deg)`,
            }}
          />
        ))}
        {}
        {step === 'scan' && (
          <motion.div
            className="absolute left-3 right-3 h-0.5 rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD_LIGHT}, transparent)`, top: 12 }}
            animate={{ top: [12, 220, 12] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {}
        {step === 'scan' && (
          <div className="flex flex-col items-center gap-3 z-10">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <QrCode size={32} className="text-white/40" />
            </div>
            <p className="text-white/40 text-xs text-center px-4">Apunta la cámara a un<br />código QR de patrici.a</p>
          </div>
        )}
        {step === 'validating' && (
          <div className="flex flex-col items-center gap-3 z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-4 border-t-transparent"
              style={{ borderColor: `${GOLD_LIGHT} transparent transparent transparent` }}
            />
            <p className="text-white/60 text-xs">Validando código...</p>
          </div>
        )}
        {step === 'success' && foundEnvelope && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-2 z-10"
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.2)', border: '2px solid #10B981' }}
              animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0.4)', '0 0 0 16px rgba(16,185,129,0)', '0 0 0 0 rgba(16,185,129,0)'] }}
              transition={{ duration: 1, repeat: 2 }}
            >
              <CheckCircle size={28} className="text-green-400" />
            </motion.div>
            <p className="text-green-400 text-xs font-bold">¡Código válido!</p>
          </motion.div>
        )}
        {step === 'error' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-2 z-10"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)', border: '2px solid #EF4444' }}>
              <AlertCircle size={28} className="text-red-400" />
            </div>
            <p className="text-red-400 text-xs font-bold">Código inválido</p>
          </motion.div>
        )}
      </div>
      {}
      {step === 'error' && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs text-center px-8 mt-4"
        >
          {errorMsg}
        </motion.p>
      )}
      {}
      <div className="w-full px-5 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">O ingresa el código</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={qrInput}
            onChange={e => setQrInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleValidate(qrInput)}
            placeholder="PATRICIA-XXXX-000"
            className="flex-1 px-4 py-3 rounded-2xl text-sm text-white placeholder-white/25 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)' }}
          />
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => handleValidate(qrInput)}
            disabled={!qrInput.trim() || step === 'validating'}
            className="px-4 py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-40 flex items-center gap-2"
            style={{ background: GOLD_GRADIENT }}
          >
            <Scan size={16} />
            Validar
          </motion.button>
        </div>
        {step === 'error' && (
          <button
            onClick={() => { setStep('scan'); setQrInput(''); setErrorMsg(''); }}
            className="w-full mt-3 py-2.5 rounded-xl text-white/70 text-sm border border-white/10 hover:border-white/20 transition-colors"
          >
            Intentar de nuevo
          </button>
        )}
      </div>
      {}
      <div className="w-full px-5 mt-6 pb-8">
        <p className="text-white/30 text-xs mb-3 text-center">✦ Códigos de demostración disponibles</p>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_CODES.map(demo => {
            const isUsed = usedCodes.includes(demo.code);
            return (
              <motion.button
                key={demo.code}
                whileHover={{ scale: isUsed ? 1 : 1.04 }}
                whileTap={{ scale: isUsed ? 1 : 0.95 }}
                onClick={() => {
                  if (isUsed) return;
                  setQrInput(demo.code);
                  handleValidate(demo.code);
                }}
                disabled={isUsed}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-2xl relative overflow-hidden"
                style={{
                  background: isUsed ? 'rgba(255,255,255,0.03)' : `${demo.color}18`,
                  border: `1.5px solid ${isUsed ? 'rgba(255,255,255,0.06)' : `${demo.color}44`}`,
                  opacity: isUsed ? 0.5 : 1,
                }}
              >
                {isUsed
                  ? <CheckCircle size={20} color="rgba(255,255,255,0.3)" />
                  : <EmojiIcon emoji={demo.emoji} size={20} color={demo.color} strokeWidth={2} />}
                <span className="text-[10px] font-bold text-center leading-tight" style={{ color: isUsed ? 'rgba(255,255,255,0.3)' : demo.color }}>
                  {demo.label}
                </span>
                {isUsed && (
                  <span className="text-[8px] text-white/25">Usado</span>
                )}
              </motion.button>
            );
          })}
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
  envelope: QREnvelope;
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
                        <EmojiIcon emoji={card.emoji} size={32} color="white" strokeWidth={1.8} />
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
export function MonasAlbumPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [collection, setCollection] = useState<Mona[]>([...initialMonas]);
  const [activeCategory, setActiveCategory] = useState('todas');
  const [selectedMona, setSelectedMona] = useState<Mona | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [pendingEnvelope, setPendingEnvelope] = useState<{ envelope: QREnvelope; cards: Mona[] } | null>(null);
  const [usedQRCodes, setUsedQRCodes] = useState<string[]>([]);
  const [showRewardModal, setShowRewardModal] = useState<typeof REWARDS[0] | null>(null);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [pastingMonaId, setPastingMonaId] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('patricias-album-welcome-seen');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);
  const MONAS_PER_PAGE = 18;
  const [albumPage, setAlbumPage] = useState(0);
  const [flipDir, setFlipDir] = useState(1);
  const totalMonas = collection.length;
  const unlockedMonas = collection.filter(m => m.unlocked);
  const unlockedCount = unlockedMonas.length;
  const completionPct = Math.round((unlockedCount / totalMonas) * 100);
  const totalXP = unlockedMonas.reduce((sum, m) => sum + m.xp, 0);
  const scannedCount = usedQRCodes.length;
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
  const categoryMap: Record<string, string[]> = {
    'live-music': ['cultura'],
    'outdoor': ['deporte'],
    'study': ['academia'],
    'foodie': ['social', 'especial'],
    'gaming': ['tecnología'],
    'arte': ['cultura'],
  };
  const filteredMonas = activeCategory === 'todas'
    ? collection
    : collection.filter(m => {
        const mappedCategories = categoryMap[activeCategory];
        return mappedCategories ? mappedCategories.includes(m.category) : false;
      });
  const totalAlbumPages = Math.ceil(filteredMonas.length / MONAS_PER_PAGE);
  const pageMonas = filteredMonas.slice(albumPage * MONAS_PER_PAGE, (albumPage + 1) * MONAS_PER_PAGE);
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
  const handleQRSuccess = (envelope: QREnvelope, monas: Mona[]) => {
    setUsedQRCodes(prev => [...prev, envelope.code.toUpperCase()]);
    setShowQRModal(false);
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
  const claimReward = (reward: typeof REWARDS[0]) => {
    setClaimedRewards(prev => [...prev, reward.id]);
    setShowRewardModal(null);
  };
  const handleCloseWelcome = () => {
    if (dontShowAgain) {
      localStorage.setItem('patricias-album-welcome-seen', 'true');
    }
    setShowWelcomeModal(false);
    setDontShowAgain(false);
  };
  const handleOpenWelcomeFromInfo = () => {
    setShowWelcomeModal(true);
  };
  const availableQRCodes = QR_ENVELOPES.filter(e => !usedQRCodes.includes(e.code.toUpperCase())).length;
  return (
    <div className="min-h-screen pb-32 relative overflow-x-hidden">
      {}
      <div className="relative px-5 pt-4 pb-8 overflow-hidden" style={{ background: 'transparent' }}>
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
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)' }}>
            <ArrowLeft size={18} style={{ color: isDark ? '#fff' : '#1e293b' }} />
          </button>
          <div className="text-center flex-1">
            <p className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">patrici.a</p>
            <h2 className="font-black text-lg leading-none" style={{ color: isDark ? '#fff' : '#1e293b' }}>Álbum de Patricias</h2>
          </div>
          <div className="flex items-center gap-2">
            {}
            <motion.button
              onClick={() => setShowQRModal(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="relative flex flex-col items-center"
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: availableQRCodes > 0 ? GOLD_GRADIENT : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
              >
                <QrCode size={20} style={{ color: availableQRCodes > 0 ? '#fff' : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }} />
              </div>
              <span className="text-[9px] font-bold mt-0.5" style={{ color: availableQRCodes > 0 ? GOLD_LIGHT : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                {availableQRCodes} QR
              </span>
              {availableQRCodes > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                  style={{ background: GOLD_LIGHT }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {availableQRCodes}
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>
        {}
        <AnimatePresence>
        {albumPage === 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width={130} height={130} viewBox="0 0 130 130">
              <circle cx={65} cy={65} r={RADIUS} fill="none" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'} strokeWidth={10} />
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
                className="text-3xl font-black"
                style={{ color: isDark ? '#fff' : '#1e293b' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {completionPct}%
              </motion.span>
              <span className="text-[9px] font-medium" style={{ color: isDark ? '#93c5fd' : '#3b82f6' }}>completado</span>
              <motion.button
                onClick={handleOpenWelcomeFromInfo}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="mt-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }}
              >
                <Info size={11} className="text-blue-400" />
              </motion.button>
            </div>
          </div>
          <div className="flex gap-6 mt-3">
            {[
              { label: 'Monas', value: `${unlockedCount}/${totalMonas}`, Icon: Library },
              { label: 'XP Total', value: `${totalXP.toLocaleString()}`, Icon: Zap },
              { label: 'Escaneados', value: `${scannedCount} QR`, Icon: Smartphone },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-xs font-black flex items-center justify-center gap-1" style={{ color: isDark ? '#fff' : '#1e293b' }}>
                  <stat.Icon size={11} className="opacity-70" /> {stat.value}
                </p>
                <p className="text-[9px]" style={{ color: isDark ? '#60a5fa' : '#3b82f6' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        </motion.div>
        )}
        </AnimatePresence>
        {albumPage > 0 && (
          <div className="flex justify-center mt-2">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}>Página {albumPage + 1} / {totalAlbumPages}</span>
          </div>
        )}
      </div>
      {}
      {albumPage === 0 && <div className="px-5 mt-5 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black flex items-center gap-1.5" style={{ color: isDark ? '#fff' : '#1e293b' }}>
            <Trophy size={14} style={{ color: GOLD_LIGHT }} /> Recompensas del Álbum
          </h3>
          <span className="text-[10px]" style={{ color: isDark ? '#60a5fa' : '#3b82f6' }}>Desbloquea completando</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {REWARDS.map((reward, i) => {
            const reached = completionPct >= reward.pct;
            const claimed = claimedRewards.includes(reward.id);
            const isGold = reward.pct === 100;
            return (
              <motion.button
                key={reward.id}
                onClick={() => reached && !claimed && setShowRewardModal(reward)}
                whileHover={{ scale: reached && !claimed ? 1.04 : 1 }}
                whileTap={{ scale: reached && !claimed ? 0.96 : 1 }}
                className="flex-shrink-0 rounded-2xl p-3 flex flex-col items-center gap-1.5 relative overflow-hidden"
                style={{
                  width: 110,
                  background: reached
                    ? reward.bg
                    : isDark ? 'rgba(255,255,255,0.04)' : '#EEEEEF',
                  border: `1.5px solid ${reached
                    ? (isGold ? GOLD_LIGHT : reward.color)
                    : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)'}`,
                  boxShadow: reached ? `0 4px 20px ${reward.color}33` : 'none',
                  opacity: claimed ? 0.6 : 1,
                }}
              >
                {}
                {isGold && reached && !claimed && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(245,158,11,0.25) 50%, transparent 70%)' }}
                  />
                )}
                {reached && !claimed && !isGold && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                    style={{ background: `linear-gradient(90deg, transparent, ${reward.color}25, transparent)`, width: '60%' }}
                  />
                )}
                {claimed
                  ? <CheckCircle size={22} color={GOLD_LIGHT} />
                  : <EmojiIcon
                      emoji={reward.emoji}
                      size={22}
                      color={reached ? reward.color : isDark ? 'rgba(255,255,255,0.25)' : '#6B7280'}
                      strokeWidth={2}
                    />}
                <div className="text-center">
                  <p
                    className="text-[10px] font-black leading-tight"
                    style={{ color: reached ? (isDark ? '#fff' : '#1e293b') : isDark ? '#fff' : '#2D2D2D' }}
                  >
                    {reward.title}
                  </p>
                  <p
                    className="text-[8px] mt-0.5"
                    style={{ color: reached ? (isGold ? GOLD_LIGHT : reward.color) : isDark ? 'rgba(255,255,255,0.3)' : '#5A5A5A' }}
                  >
                    {reward.subtitle}
                  </p>
                </div>
                <div
                  className="w-full h-1 rounded-full"
                  style={{ background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: isGold && reached ? GOLD_GRADIENT : reward.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((completionPct / reward.pct) * 100, 100)}%` }}
                    transition={{ duration: 1.2, delay: 0.5 + i * 0.1 }}
                  />
                </div>
                <p
                  className="text-[8px] font-bold"
                  style={{ color: reached ? (isGold ? GOLD_LIGHT : reward.color) : isDark ? 'rgba(255,255,255,0.3)' : '#4A4A4A' }}
                >
                  {claimed ? '¡Reclamado!' : reached ? '¡RECLAMAR!' : `${reward.pct}% necesario`}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>}
      {}
      {albumPage === 0 && <div className="px-5 mt-5 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black flex items-center gap-1.5" style={{ color: isDark ? '#fff' : '#1e293b' }}>
            <Trophy size={14} style={{ color: GOLD_LIGHT }} /> Medallas
          </h3>
          <span className="text-[10px]" style={{ color: isDark ? '#60a5fa' : '#3b82f6' }}>{BADGES.filter(b => b.unlocked).length}/{BADGES.length} desbloqueadas</span>
        </div>
        <div className="space-y-4">
          {}
          <div>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)' }}>Conexiones sociales</p>
            <div className="grid grid-cols-6 gap-1.5">
              {BADGES.filter(b => b.category === 'conexiones').map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} i={i} isDark={isDark} onClick={() => setSelectedBadge(badge)} />
              ))}
            </div>
          </div>
          {}
          <div>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)' }}>Parches</p>
            <div className="grid grid-cols-6 gap-1.5">
              {BADGES.filter(b => b.category === 'parches').map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} i={i} isDark={isDark} onClick={() => setSelectedBadge(badge)} />
              ))}
            </div>
          </div>
          {}
          <div>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)' }}>Campus</p>
            <div className="grid grid-cols-6 gap-1.5">
              {BADGES.filter(b => b.category === 'campus').map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} i={i} isDark={isDark} onClick={() => setSelectedBadge(badge)} />
              ))}
            </div>
          </div>
          {}
          <div>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)' }}>Especiales</p>
            <div className="grid grid-cols-6 gap-1.5">
              {BADGES.filter(b => b.category === 'especiales').map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} i={i} isDark={isDark} onClick={() => setSelectedBadge(badge)} legendaryGlow={badge.rarity === 'legendario'} />
              ))}
            </div>
          </div>
        </div>
      </div>}
      {}
      <div className="mt-5">
        <div className="flex gap-2 overflow-x-auto pb-2 px-5 scrollbar-hide">
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
        className="mt-4 relative select-none"
        style={{ perspective: '1200px' }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { swipeActive.current = false; }}
      >
        {}
        <div
          className="absolute left-0 top-0 bottom-0 w-5 rounded-l-sm flex items-center justify-center z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #1E3A5F 0%, #0A192F 40%, #1E3A5F 70%, #0A192F 100%)',
            boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.8), 2px 0 6px rgba(0,0,0,0.5)',
          }}
        >
          <p
            className="text-white/20 font-black tracking-widest"
            style={{ writingMode: 'vertical-rl', fontSize: '7px', letterSpacing: '0.15em' }}
          >
            patrici.a • ÁLBUM 2025
          </p>
        </div>
        {}
        <div
          className="absolute right-0 top-0 bottom-0 w-1 pointer-events-none"
          style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.4), transparent)' }}
        />
        <div className="px-7">
        {activeCategory !== 'todas' && albumPage === 0 && (
          <motion.div key={activeCategory} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-4 px-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${CATEGORIES.find(c => c.id === activeCategory)?.color ?? '#3B82F6'}33` }}>
              <EmojiIcon emoji={CATEGORIES.find(c => c.id === activeCategory)?.emoji ?? '✨'} size={18} color={CATEGORIES.find(c => c.id === activeCategory)?.color ?? '#3B82F6'} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-white font-black">{CATEGORIES.find(c => c.id === activeCategory)?.label}</h3>
              <p className="text-[10px] text-blue-400">{catProgress(activeCategory).done} de {catProgress(activeCategory).total} monas</p>
            </div>
            {catProgress(activeCategory).done === catProgress(activeCategory).total && (
              <span className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-black text-white flex items-center gap-1" style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}><CheckCircle size={10} /> COMPLETA</span>
            )}
          </motion.div>
        )}
        <AnimatePresence mode="wait" custom={flipDir}>
          <motion.div
            key={`page-${albumPage}-${activeCategory}`}
            custom={flipDir}
            variants={flipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-6 gap-1.5"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {pageMonas.map((mona, i) => (
              <motion.div key={mona.id} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 200, damping: 22 }}>
                {mona.unlocked ? (
                  <MonaCardUnlocked mona={mona} onClick={() => setSelectedMona(mona)} />
                ) : pastingMonaId === mona.id ? (
                  <motion.div
                    className="relative w-full"
                    style={{ aspectRatio: '3/4' }}
                    initial={{ scale: 1.8, y: -120, opacity: 0, rotateZ: 12 }}
                    animate={{ scale: 1, y: 0, opacity: 1, rotateZ: 0 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 16 }}
                    onAnimationComplete={() => {
                      setCollection(prev =>
                        prev.map(m => m.id === mona.id ? { ...m, unlocked: true, unlockedAt: 'Pegado ahora' } : m)
                      );
                      setPastingMonaId(null);
                    }}
                  >
                    <MonaCardUnlocked mona={{ ...mona, unlocked: true }} onClick={() => {}} />
                  </motion.div>
                ) : (
                  <MonaCardLocked
                    mona={mona}
                    index={albumPage * MONAS_PER_PAGE + i}
                    onClick={() => {
                      setPastingMonaId(mona.id);
                    }}
                  />
                )}
              </motion.div>
            ))}
            {pageMonas.length < MONAS_PER_PAGE && albumPage === totalAlbumPages - 1 &&
              Array.from({ length: MONAS_PER_PAGE - pageMonas.length }).map((_, i) => (
                <div key={`e-${i}`} className="rounded-2xl" style={{ aspectRatio: '3/4', background: 'rgba(255,255,255,0.02)', border: '1.5px dashed rgba(255,255,255,0.05)' }} />
              ))
            }
          </motion.div>
        </AnimatePresence>
        {filteredMonas.length === 0 && (
          <div className="text-center py-16">
            <Library size={48} className="mx-auto mb-3 text-white/20" />
            <p className="text-white/50">No hay monas en esta categoría</p>
          </div>
        )}
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
        <div className="px-4 mt-6 flex items-center justify-between">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => goToPage(-1)} disabled={albumPage === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-white disabled:opacity-30"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
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
        {showQRModal && (
          <QRScannerModal
            onClose={() => setShowQRModal(false)}
            onSuccess={handleQRSuccess}
            usedCodes={usedQRCodes}
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setSelectedMona(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto"
              style={{ background: '#0A1628', border: '1.5px solid rgba(255,255,255,0.1)' }}
            >
              {selectedMona.unlocked ? (
                <div>
                  <div className="p-5 flex gap-4">
                    <motion.div
                      initial={{ scale: 0.7, rotate: -5 }} animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-28 h-36 rounded-2xl flex flex-col items-center justify-between py-3 px-2 flex-shrink-0 relative overflow-hidden"
                      style={{
                        background: R[selectedMona.rarity].cardBg,
                        border: `2px solid ${R[selectedMona.rarity].border}`,
                        boxShadow: `0 8px 32px ${R[selectedMona.rarity].glow}`,
                      }}
                    >
                      {selectedMona.rarity === 'legendario' && (
                        <motion.div
                          className="absolute inset-0"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ background: `linear-gradient(135deg, transparent, ${R[selectedMona.rarity].shimmer}, transparent)` }}
                        />
                      )}
                      <div className="flex justify-between w-full z-10">
                        <span className="text-[7px] font-black" style={{ color: R[selectedMona.rarity].textColor }}>
                          {R[selectedMona.rarity].label.toUpperCase()}
                        </span>
                        <RarityStars count={R[selectedMona.rarity].stars} color={R[selectedMona.rarity].textColor} />
                      </div>
                      <div className="flex items-center justify-center z-10">
                        <EmojiIcon emoji={selectedMona.emoji} size={40} color="white" strokeWidth={1.5} />
                      </div>
                      <div className="w-full text-center z-10" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: '3px 4px' }}>
                        <p className="text-[9px] font-black" style={{ color: R[selectedMona.rarity].textColor }}>{selectedMona.name}</p>
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-white font-black text-lg">{selectedMona.name}</h3>
                      <p className="text-blue-400 text-xs mt-0.5">{selectedMona.category.charAt(0).toUpperCase() + selectedMona.category.slice(1)}</p>
                      <p className="text-white/70 text-xs mt-2 leading-relaxed">{selectedMona.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: R[selectedMona.rarity].tagBg }}>
                          <Zap size={10} style={{ color: R[selectedMona.rarity].textColor }} />
                          <span className="text-[10px] font-black" style={{ color: R[selectedMona.rarity].textColor }}>+{selectedMona.xp} XP</span>
                        </div>
                        {selectedMona.unlockedAt && (
                          <span className="text-[10px] text-green-400 flex items-center gap-1">
                            <CheckCircle size={10} /> {selectedMona.unlockedAt}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/50 mt-3 leading-relaxed">
                        <span className="text-white/30">Condición: </span>{selectedMona.condition}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 flex gap-4">
                  <div
                    className="w-28 h-36 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(160deg, #0A1628, #112240)', border: '2px solid rgba(255,255,255,0.08)' }}
                  >
                    <Lock size={24} className="text-white/30" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-black text-lg">Mona Bloqueada</h3>
                    <p className="text-blue-400 text-xs mt-0.5">{selectedMona.category}</p>
                    <p className="text-white/50 text-xs mt-2 leading-relaxed">Desbloquea esta mona escaneando un QR o cumpliendo la condición requerida.</p>
                    <p className="text-[11px] text-white/40 mt-3 leading-relaxed">
                      <span className="text-white/25">Condición: </span>{selectedMona.condition}
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => { setSelectedMona(null); setTimeout(() => setShowQRModal(true), 200); }}
                      className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold"
                      style={{ background: GOLD_GRADIENT }}
                    >
                      <QrCode size={14} />
                      Escanear QR para desbloquear
                    </motion.button>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSelectedMona(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <X size={16} className="text-white" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showRewardModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-40"
              onClick={() => setShowRewardModal(null)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed inset-x-5 top-1/2 -translate-y-1/2 z-50 rounded-3xl p-6"
              style={{ background: '#0A1628', border: `1.5px solid ${showRewardModal.color}44` }}
            >
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto" style={{ background: `${showRewardModal.color}22`, border: `2px solid ${showRewardModal.color}66` }}>
                  <EmojiIcon emoji={showRewardModal.emoji} size={40} color={showRewardModal.color} strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-black text-xl mt-3">{showRewardModal.title}</h3>
                <p className="text-blue-400 text-sm mt-1">{showRewardModal.subtitle}</p>
                <p className="text-white/60 text-xs mt-3 leading-relaxed">{showRewardModal.description}</p>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => claimReward(showRewardModal)}
                  className="w-full mt-5 py-3.5 rounded-2xl text-white font-black"
                  style={{ background: showRewardModal.pct === 100 ? GOLD_GRADIENT : `linear-gradient(135deg, ${showRewardModal.color}, ${showRewardModal.color}CC)` }}
                >
                  ¡Reclamar recompensa!
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {selectedBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-40"
              onClick={() => setSelectedBadge(null)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed inset-x-5 top-1/2 -translate-y-1/2 z-50 rounded-3xl p-6"
              style={{ background: '#0A1628', border: `1.5px solid ${selectedBadge.color}44` }}
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <X size={16} className="text-white" />
              </button>
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto relative"
                  style={{
                    background: selectedBadge.unlocked
                      ? `linear-gradient(135deg, ${selectedBadge.color}25 0%, ${selectedBadge.color}15 100%)`
                      : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${selectedBadge.unlocked ? `${selectedBadge.color}66` : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: selectedBadge.unlocked ? `0 0 24px ${selectedBadge.color}50` : 'none',
                  }}
                >
                  {!selectedBadge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-2xl">
                      <Lock size={20} className="text-white/40" />
                    </div>
                  )}
                  <selectedBadge.Icon
                    size={40}
                    style={{ color: selectedBadge.unlocked ? selectedBadge.color : 'rgba(255,255,255,0.3)' }}
                  />
                </div>
                <h3 className="text-white font-black text-xl mt-4">{selectedBadge.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: `${selectedBadge.color}20`,
                      color: selectedBadge.color,
                      textTransform: 'uppercase',
                    }}
                  >
                    {selectedBadge.rarity}
                  </span>
                  <span className="text-xs font-bold text-white/70">
                    +{selectedBadge.xp} XP
                  </span>
                </div>
                <p className="text-white/70 text-sm mt-4 leading-relaxed">{selectedBadge.description}</p>
                {selectedBadge.unlocked ? (
                  <div className="mt-4 px-4 py-2 rounded-xl" style={{ background: `${selectedBadge.color}15` }}>
                    <p className="text-xs font-bold flex items-center justify-center gap-1.5" style={{ color: selectedBadge.color }}>
                      <CheckCircle size={14} /> Medalla Desbloqueada
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <p className="text-xs font-bold flex items-center justify-center gap-1.5 text-white/40">
                      <Lock size={14} /> Medalla Bloqueada
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showWelcomeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-x-5 top-1/2 -translate-y-1/2 z-50 rounded-3xl p-6 max-h-[85vh] overflow-y-auto"
              style={{ background: '#0A1628', border: '1.5px solid rgba(59,130,246,0.3)' }}
            >
              <div className="text-center mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: GOLD_GRADIENT }}>
                  <Library size={32} className="text-white" />
                </div>
                <h2 className="text-white font-black text-2xl">¡Bienvenido al Álbum!</h2>
                <p className="text-blue-400 text-sm mt-1">Colecciona Patricias y gana recompensas</p>
              </div>
              <div className="space-y-4 mb-6">
                {}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.15)' }}>
                    <Sparkles size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm">¿Qué son las Patricias?</h3>
                    <p className="text-white/70 text-xs mt-1 leading-relaxed">
                      Láminas coleccionables que se ganan participando en parches, eventos y actividades del campus.
                    </p>
                  </div>
                </div>
                {}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(6,182,212,0.15)' }}>
                    <QrCode size={20} className="text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm">¿Cómo se obtienen?</h3>
                    <p className="text-white/70 text-xs mt-1 leading-relaxed">
                      Asistiendo a parches, escaneando sobres QR físicos distribuidos en el campus y completando logros.
                    </p>
                  </div>
                </div>
                {}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
                    <Trophy size={20} className="text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm">¿Para qué sirven?</h3>
                    <p className="text-white/70 text-xs mt-1 leading-relaxed">
                      Completar el álbum desbloquea recompensas académicas reales como décimas y puntos en tus materias.
                    </p>
                  </div>
                </div>
              </div>
              {}
              <div className="mb-5">
                <button
                  onClick={() => setDontShowAgain(!dontShowAgain)}
                  className="flex items-center gap-2 w-full justify-center"
                >
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: dontShowAgain ? '#3B82F6' : 'rgba(255,255,255,0.2)',
                      background: dontShowAgain ? '#3B82F6' : 'transparent',
                    }}
                  >
                    {dontShowAgain && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-white/60 text-xs">No volver a mostrar</span>
                </button>
              </div>
              {}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleCloseWelcome}
                className="w-full py-3.5 rounded-2xl text-white font-black text-sm"
                style={{ background: GRADIENT }}
              >
                ¡Entendido!
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}