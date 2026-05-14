import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Trophy, Crown, Zap, BookOpen, Users,
  Flame, TrendingUp, Award, Sparkles,
} from 'lucide-react';
import {
  rankingUsers, GRADIENT, GOLD_GRADIENT, GOLD_LIGHT, GOLD, TEAL,
  type RankingUser,
} from '../types/mockData';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { useApp } from '../store/AppContext';
const TIER = {
  1: { bg: GOLD_GRADIENT,                                    border: GOLD_LIGHT, label: 'ORO',   height: 130 },
  2: { bg: 'linear-gradient(135deg, #94A3B8 0%, #CBD5E1 100%)', border: '#CBD5E1', label: 'PLATA', height: 100 },
  3: { bg: 'linear-gradient(135deg, #92400E 0%, #B45309 100%)', border: '#D97706', label: 'BRONCE', height: 80 },
} as const;
type RankTab = 'xp' | 'monas' | 'parches';
type Period  = 'semana' | 'mes' | 'semestre';
const TABS: { key: RankTab; label: string; Icon: typeof Zap; color: string }[] = [
  { key: 'xp',      label: 'XP',     Icon: Zap,     color: GOLD_LIGHT },
  { key: 'monas',   label: 'Monas',  Icon: BookOpen, color: '#06B6D4'  },
  { key: 'parches', label: 'Parches',Icon: Users,    color: '#3B82F6'  },
];
const PERIODS: { key: Period; label: string }[] = [
  { key: 'semana',    label: 'Semana'    },
  { key: 'mes',       label: 'Mes'       },
  { key: 'semestre',  label: 'Semestre'  },
];
function getValue(user: RankingUser, tab: RankTab): string {
  if (tab === 'xp')      return `${user.xp.toLocaleString('es-CO')} XP`;
  if (tab === 'monas')   return `${user.monasCount} monas`;
  return `${user.parchesCount} parches`;
}
function getRaw(user: RankingUser, tab: RankTab): number {
  if (tab === 'xp')      return user.xp;
  if (tab === 'monas')   return user.monasCount;
  return user.parchesCount;
}
function PodiumSlot({
  user, rank, tab, delay,
}: {
  user: RankingUser; rank: 1 | 2 | 3; tab: RankTab; delay: number;
}) {
  const tier = TIER[rank];
  const isFirst = rank === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center gap-1.5"
      style={{ flex: isFirst ? '0 0 38%' : '0 0 28%' }}
    >
      {}
      {isFirst && (
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Crown size={22} style={{ color: GOLD_LIGHT, filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.7))' }} />
        </motion.div>
      )}
      {}
      <div className="relative">
        <div
          className="rounded-full overflow-hidden"
          style={{
            width: isFirst ? 64 : 52,
            height: isFirst ? 64 : 52,
            border: `3px solid ${tier.border}`,
            boxShadow: isFirst ? `0 0 20px rgba(245,158,11,0.6)` : `0 0 8px rgba(0,0,0,0.5)`,
          }}
        >
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        </div>
        {}
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
          style={{ background: tier.bg, boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}
        >
          {rank}
        </div>
        {user.isCurrentUser && (
          <div
            className="absolute -top-1 -left-1 px-1 py-0.5 rounded-full text-[7px] font-black text-white"
            style={{ background: GOLD_GRADIENT }}
          >
            TÚ
          </div>
        )}
      </div>
      {}
      <p
        className="text-center font-bold leading-tight"
        style={{
          color: 'white',
          fontSize: isFirst ? '12px' : '10px',
          textShadow: isFirst ? `0 0 12px rgba(245,158,11,0.5)` : 'none',
          maxWidth: isFirst ? 90 : 72,
        }}
      >
        {user.name.split(' ')[0]}
      </p>
      {}
      <div
        className="px-2 py-0.5 rounded-full text-[9px] font-black"
        style={{ background: `${tier.border}22`, color: tier.border, border: `1px solid ${tier.border}44` }}
      >
        {getValue(user, tab)}
      </div>
      {}
      <div
        className="w-full rounded-t-xl flex items-center justify-center"
        style={{
          height: tier.height,
          background: `${tier.bg}`,
          boxShadow: `0 -4px 20px rgba(0,0,0,0.3)`,
          minWidth: isFirst ? 90 : 68,
        }}
      >
        <Award size={isFirst ? 28 : 20} color="rgba(255,255,255,0.5)" />
      </div>
    </motion.div>
  );
}
function RankRow({
  user, rank, tab, delay,
}: {
  user: RankingUser; rank: number; tab: RankTab; delay: number;
}) {
  const isMe = user.isCurrentUser;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-2"
      style={{
        background: isMe
          ? 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.08) 100%)'
          : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${isMe ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      {}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
        style={{
          background: isMe ? GOLD_GRADIENT : 'rgba(255,255,255,0.08)',
          color: isMe ? 'white' : 'rgba(255,255,255,0.5)',
          boxShadow: isMe ? '0 2px 8px rgba(217,119,6,0.4)' : 'none',
        }}
      >
        {rank}
      </div>
      {}
      <div className="relative flex-shrink-0">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-xl object-cover"
          style={{ border: isMe ? `2px solid ${GOLD_LIGHT}` : '2px solid rgba(255,255,255,0.1)' }}
        />
        {isMe && (
          <div
            className="absolute -top-1 -right-1 px-1 rounded-full text-[7px] font-black text-white"
            style={{ background: GOLD_GRADIENT }}
          >
            TÚ
          </div>
        )}
      </div>
      {}
      <div className="flex-1 min-w-0">
        <p
          className="font-bold text-sm truncate"
          style={{ color: isMe ? GOLD_LIGHT : 'white' }}
        >
          {user.name}
        </p>
        <p className="text-[10px] text-white/40 truncate">{user.faculty} · Niv. {user.level}</p>
      </div>
      {}
      <div className="text-right flex-shrink-0">
        <p className="font-black text-sm" style={{ color: isMe ? GOLD_LIGHT : 'rgba(255,255,255,0.8)' }}>
          {getValue(user, tab)}
        </p>
        <p className="text-[9px] flex items-center justify-end gap-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <Flame size={9} style={{ color: '#F59E0B' }} /> {user.streak}d
        </p>
      </div>
    </motion.div>
  );
}
export function RankingPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();
  const [tab, setTab]       = useState<RankTab>('xp');
  const [period, setPeriod] = useState<Period>('mes');
  const sorted = useMemo(() => (
    [...rankingUsers].sort((a, b) => getRaw(b, tab) - getRaw(a, tab))
  ), [tab]);
  const top3   = sorted.slice(0, 3);
  const rest   = sorted.slice(3);
  const meRank = sorted.findIndex(u => u.isCurrentUser) + 1;
  const meData = sorted.find(u => u.isCurrentUser);
  const podiumOrder: [RankingUser, 1 | 2 | 3][] = top3.length >= 3
    ? [[top3[1], 2], [top3[0], 1], [top3[2], 3]]
    : top3.map((u, i) => [u, (i + 1) as 1 | 2 | 3]);
  return (
    <div
      className="min-h-screen pb-36 relative overflow-x-hidden"
      style={{ background: isDark ? 'linear-gradient(180deg, #050D1A 0%, #071525 100%)' : 'transparent', isolation: 'isolate' }}
    >
      <DoodleBackground isDark opacity={0.65} />
      {}
      <div className="relative px-5 pt-12 pb-6">
        {}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">patrici.a</p>
            <h2 className="text-white font-black text-lg leading-none flex items-center gap-2">
              <Trophy size={18} style={{ color: GOLD_LIGHT }} />
              Ranking Campus
            </h2>
          </div>
          <div className="w-9" />
        </div>
        {}
        <div className="flex gap-2 justify-center mb-5">
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: period === p.key ? GOLD_GRADIENT : 'rgba(255,255,255,0.06)',
                color: period === p.key ? 'white' : 'rgba(255,255,255,0.45)',
                border: period === p.key ? 'none' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: period === p.key ? '0 4px 12px rgba(217,119,6,0.35)' : 'none',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        {}
        <div className="flex gap-2 bg-white/5 rounded-2xl p-1">
          {TABS.map(({ key, label, Icon, color }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: tab === key ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: tab === key ? color : 'rgba(255,255,255,0.4)',
                border: tab === key ? `1px solid ${color}44` : '1px solid transparent',
              }}
            >
              <Icon size={13} style={tab === key ? { color } : {}} />
              {label}
            </button>
          ))}
        </div>
      </div>
      {}
      <AnimatePresence mode="wait">
        <div
          key={tab}
          className="px-4 flex items-end justify-center gap-2 mb-6"
          style={{ minHeight: 260 }}
        >
          {podiumOrder.map(([user, rank], i) => (
            <PodiumSlot
              key={user.id}
              user={user}
              rank={rank}
              tab={tab}
              delay={i * 0.08}
            />
          ))}
        </div>
      </AnimatePresence>
      {}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={13} style={{ color: GOLD_LIGHT }} />
          <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Posiciones</span>
        </div>
        <AnimatePresence mode="wait">
          <div key={tab}>
            {rest.map((user, i) => (
              <RankRow
                key={user.id}
                user={user}
                rank={i + 4}
                tab={tab}
                delay={i * 0.05}
              />
            ))}
          </div>
        </AnimatePresence>
      </div>
      {}
      {meData && (
        <div
          className="fixed bottom-0 left-0 right-0 px-4 pb-safe z-30"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
            className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{
              background: 'rgba(5, 13, 26, 0.97)',
              border: `1.5px solid ${GOLD_LIGHT}55`,
              boxShadow: `0 -8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${GOLD_LIGHT}22`,
              backdropFilter: 'blur(20px)',
            }}
          >
            {}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-black text-white"
              style={{ background: GOLD_GRADIENT, boxShadow: '0 4px 12px rgba(217,119,6,0.5)' }}
            >
              #{meRank}
            </div>
            <img
              src={meData.avatar}
              alt={meData.name}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              style={{ border: `2px solid ${GOLD_LIGHT}` }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm" style={{ color: GOLD_LIGHT }}>Tu posición</p>
              <p className="text-[10px] text-white/50">{meData.faculty} · {getValue(meData, tab)}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Flame size={13} style={{ color: GOLD_LIGHT }} />
              <span className="text-white/70 text-xs font-bold">{meData.streak}d racha</span>
            </div>
            {}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(245,158,11,0.08) 50%, transparent 70%)' }}
            />
          </motion.div>
        </div>
      )}
      {}
      <div className="fixed top-8 right-8 pointer-events-none z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles size={32} style={{ color: `${GOLD_LIGHT}25` }} />
        </motion.div>
      </div>
    </div>
  );
}