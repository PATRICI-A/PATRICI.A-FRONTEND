import { useNavigate, useParams, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Sparkles, Star, Users, Heart, Clock, CheckCircle2 } from 'lucide-react';
import { matchUsers, GRADIENT, TEAL, TEAL_GRADIENT, PINK, GOLD_LIGHT, GOLD_GRADIENT, GOLD } from '../types/mockData';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { SLOTS, DAYS } from './SchedulePage';
function seedAvailability(userId: string): string[] {
  let h = userId.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0x7fffffff, 7);
  const result: string[] = [];
  DAYS.forEach(({ key }) => {
    SLOTS.forEach((_, si) => {
      h = (h * 1664525 + 1013904223) & 0x7fffffff;
      if ((h >>> 28) > 6) result.push(`${key}-${si}`); // ~37% density
    });
  });
  return result;
}
export function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const { isDark, currentUser } = useApp();
  const user = matchUsers.find(u => u.id === userId);
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Usuario no encontrado</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 rounded-xl text-white font-medium"
            style={{ background: GRADIENT }}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }
  const calculateCompatibility = () => {
    let score = 50;
    const userInterests = currentUser?.interests || [];
    const commonInterests = user.interests.filter(i => userInterests.includes(i));
    score += commonInterests.length * 10;
    if (user.program === currentUser?.program) score += 15;
    const semesterDiff = Math.abs((user.semester || 0) - (currentUser?.semester || 0));
    score += Math.max(10 - semesterDiff * 2, 0);
    if (user.online) score += 5;
    return Math.min(Math.max(score, 0), 100);
  };
  const matchPercent = calculateCompatibility();
  const commonInterests = user.interests.filter(i => currentUser?.interests.includes(i));
  const commonPatchesCount = Math.floor(Math.random() * 3) + 1; // Mock
  const userAvailability = seedAvailability(userId ?? '');
  const isAvailable = (day: string, si: number) => userAvailability.includes(`${day}-${si}`);
  const gridLine = isDark ? '#1E3A5F' : '#F0F0F0';
  const cardBg   = isDark ? '#112240' : '#FFFFFF';
  const timeTxt  = isDark ? '#4A6080' : '#9CA3AF';
  const dayTxt   = isDark ? '#6B8AAA' : '#6B7280';
  const SLOT_H   = 52;
  return (
    <div className="min-h-screen relative pb-20">
      <DoodleBackground isDark={isDark} />
      {}
      <div className="sticky top-[57px] z-40 bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-lg border-b border-gray-200 dark:border-[#1E3A5F]">
        <div className="px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2F4A] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-gray-900 dark:text-white font-bold text-lg">Perfil</h1>
          <div className="w-9" /> {}
        </div>
      </div>
      {}
      <div className="px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#112240] rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover"
              />
              {user.online && (
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-[#112240]"
                  style={{ background: TEAL }}
                />
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-xl mb-1" style={{ color: GOLD_LIGHT }}>
                {user.name}, {user.age}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {user.program}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Sparkles size={14} style={{ color: GOLD_LIGHT }} />
                {user.semester}° semestre
              </p>
            </div>
          </div>
          {}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">COMPATIBILIDAD</span>
              <span className="text-sm font-bold" style={{ color: GOLD_LIGHT }}>
                {matchPercent}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-[#172A45] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${matchPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: GOLD_GRADIENT }}
              />
            </div>
          </div>
          {user.bio && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">ACERCA DE</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{user.bio}</p>
            </div>
          )}
        </motion.div>
      </div>
      {}
      <div className="px-5 space-y-4">
        {}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4">INFORMACIÓN ACADÉMICA</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-[#1C1107] flex items-center justify-center">
                <Star size={16} style={{ color: GOLD_LIGHT }} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Programa</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.program}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-[#1C1107] flex items-center justify-center">
                <Sparkles size={16} style={{ color: GOLD_LIGHT }} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Semestre</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.semester}° semestre</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-[#1C1107] flex items-center justify-center">
                <MapPin size={16} style={{ color: GOLD_LIGHT }} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Te pueden conocer en</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.commonPlace}</p>
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">INTERESES</h3>
          <div className="flex gap-2 flex-wrap">
            {user.interests.map(interest => {
              const isCommon = commonInterests.includes(interest);
              return (
                <span
                  key={interest}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                    isCommon
                      ? 'text-white'
                      : 'bg-orange-50 dark:bg-[#1C1107] text-gray-600 dark:text-gray-300'
                  }`}
                  style={isCommon ? { background: GOLD_GRADIENT, color: 'white' } : {}}
                >
                  {interest}
                  {isCommon && ' ✓'}
                </span>
              );
            })}
          </div>
        </div>
        {}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">PARCHES EN COMÚN</h3>
            <span className="text-xs font-bold" style={{ color: GOLD_LIGHT }}>
              {commonPatchesCount}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users size={16} style={{ color: GOLD_LIGHT }} />
            <span>
              {commonPatchesCount === 0
                ? 'No tienen parches en común aún'
                : `Comparten ${commonPatchesCount} parche${commonPatchesCount > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
        {}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: cardBg }}>
          <div className="px-5 pt-4 pb-3 flex items-center gap-2">
            <Clock size={14} style={{ color: GOLD_LIGHT }} />
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">DISPONIBILIDAD SEMANAL</h3>
          </div>
          <div className="overflow-x-auto pb-4">
            <div style={{ minWidth: 380 }}>
              {}
              <div className="flex border-b mx-4 mb-0" style={{ borderColor: gridLine }}>
                <div className="flex-shrink-0 w-[64px]" />
                {DAYS.map(({ label, key }, i) => (
                  <div key={key} className="flex-1 py-1.5 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: dayTxt }}>{label}</span>
                  </div>
                ))}
              </div>
              {}
              <div className="mx-4">
                {SLOTS.map((slot, si) => (
                  <div key={si} className="flex" style={{ borderBottom: si < SLOTS.length - 1 ? `1px solid ${gridLine}` : 'none' }}>
                    {}
                    <div
                      className="flex-shrink-0 w-[64px] flex flex-col items-end justify-center pr-2 gap-0.5"
                      style={{ height: SLOT_H, borderRight: `1px solid ${gridLine}` }}
                    >
                      <span className="text-[8px] font-bold leading-none" style={{ color: timeTxt }}>
                        {slot.start}<span className="opacity-50"> {slot.startP}</span>
                      </span>
                      <div className="w-5 border-t" style={{ borderColor: isDark ? '#2A4A6A' : '#E5E7EB' }} />
                      <span className="text-[8px] font-bold leading-none" style={{ color: timeTxt }}>
                        {slot.end}<span className="opacity-50"> {slot.endP}</span>
                      </span>
                    </div>
                    {}
                    {DAYS.map(({ key }, di) => {
                      const avail = isAvailable(key, si);
                      return (
                        <div
                          key={key}
                          className="flex-1 flex items-center justify-center"
                          style={{
                            height: SLOT_H,
                            borderRight: di < DAYS.length - 1 ? `1px solid ${gridLine}` : 'none',
                            background: avail ? (isDark ? 'rgba(217,119,6,0.18)' : 'rgba(245,158,11,0.12)') : 'transparent',
                          }}
                        >
                          {avail && (
                            <div
                              className="w-4/5 h-4/5 rounded-md flex items-center justify-center"
                              style={{ background: GOLD_GRADIENT, boxShadow: '0 1px 4px rgba(217,119,6,0.3)' }}
                            >
                              <CheckCircle2 size={11} color="white" strokeWidth={2.5} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 pb-4">
            <div className="w-3 h-3 rounded-sm" style={{ background: GOLD_GRADIENT }} />
            <p className="text-[10px]" style={{ color: timeTxt }}>Franja disponible</p>
          </div>
        </div>
        {}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            navigate(-1);
          }}
          className="w-full py-4 rounded-2xl text-white font-bold shadow-lg flex items-center justify-center gap-2"
          style={{ background: GOLD_GRADIENT }}
        >
          <Heart size={18} />
          Enviar solicitud de conexión
        </motion.button>
      </div>
    </div>
  );
}