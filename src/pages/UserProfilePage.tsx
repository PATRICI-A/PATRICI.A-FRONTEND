import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Sparkles, Star, Users, Heart, Clock, CheckCircle2 } from 'lucide-react';
import { GRADIENT, TEAL, GOLD_LIGHT, GOLD_GRADIENT } from '../types/mockData';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { Avatar } from '../components/ui/Avatar';
import { SLOTS, DAYS } from './SchedulePage';
import { profileService } from '../services/profileService';
import type { EnrichedMatchUser } from '../store/matchingStore';

function seedAvailability(userId: string): string[] {
  let h = userId.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0x7fffffff, 7);
  const result: string[] = [];
  DAYS.forEach(({ key }) => {
    SLOTS.forEach((_, si) => {
      h = (h * 1664525 + 1013904223) & 0x7fffffff;
      if ((h >>> 28) > 6) result.push(`${key}-${si}`);
    });
  });
  return result;
}

export function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { state } = useLocation();
  const { isDark, currentUser } = useApp();

  const matchUser = (state as { matchUser?: EnrichedMatchUser } | null)?.matchUser;

  const [apiName, setApiName] = useState<string | null>(matchUser?.name ?? null);
  const [apiBio, setApiBio] = useState<string | null>(matchUser?.bio ?? null);
  const [apiPhoto, setApiPhoto] = useState<string | null>(matchUser?.photoUrl ?? null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) { setLoading(false); setNotFound(true); return; }
    profileService.getBatchProfiles([userId])
      .then(profiles => {
        if (profiles.length > 0) {
          setApiName(profiles[0].name);
          setApiBio(profiles[0].biography ?? matchUser?.bio ?? null);
          setApiPhoto(profiles[0].photoUrl ?? matchUser?.photoUrl ?? null);
        } else if (!matchUser) {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (!matchUser) setNotFound(true);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const gridLine = isDark ? '#1E3A5F' : '#F0F0F0';
  const cardBg   = isDark ? '#112240' : '#FFFFFF';
  const timeTxt  = isDark ? '#4A6080' : '#9CA3AF';
  const dayTxt   = isDark ? '#6B8AAA' : '#6B7280';
  const SLOT_H   = 52;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: TEAL }} />
      </div>
    );
  }

  if (notFound) {
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

  const name = apiName ?? 'Usuario';
  const bio = apiBio ?? '';
  const photoUrl = apiPhoto ?? '';
  const career = matchUser?.career ?? '';
  const semester = matchUser?.semester ?? 0;
  const tags = matchUser?.tags ?? [];
  const isActive = matchUser?.active ?? false;
  const matchPercent = matchUser?.matchPercent ?? 50;

  const commonInterests = tags.filter(t => currentUser?.interests?.includes(t));
  const userAvailability = seedAvailability(userId ?? '');
  const isAvailable = (day: string, si: number) => userAvailability.includes(`${day}-${si}`);

  return (
    <div className="min-h-screen relative pb-20">
      <DoodleBackground isDark={isDark} />
      <div className="sticky top-[57px] z-40 bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-lg border-b border-gray-200 dark:border-[#1E3A5F]">
        <div className="px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2F4A] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-gray-900 dark:text-white font-bold text-lg">Perfil</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#112240] rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              {photoUrl ? (
                <img src={photoUrl} alt={name} className="w-24 h-24 rounded-2xl object-cover" />
              ) : (
                <Avatar name={name} size={96} className="rounded-2xl" gradient={GOLD_GRADIENT} fontSize="32px" />
              )}
              {isActive && (
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-[#112240]"
                  style={{ background: TEAL }}
                />
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-xl mb-1" style={{ color: GOLD_LIGHT }}>
                {name}
              </h2>
              {career && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{career}</p>
              )}
              {semester > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Sparkles size={14} style={{ color: GOLD_LIGHT }} />
                  {semester}° semestre
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">COMPATIBILIDAD</span>
              <span className="text-sm font-bold" style={{ color: GOLD_LIGHT }}>{matchPercent}%</span>
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

          {bio && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">ACERCA DE</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{bio}</p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="px-5 space-y-4">
        {(career || semester > 0) && (
          <div className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4">INFORMACIÓN ACADÉMICA</h3>
            <div className="space-y-3">
              {career && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-[#1C1107] flex items-center justify-center">
                    <Star size={16} style={{ color: GOLD_LIGHT }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Programa</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{career}</p>
                  </div>
                </div>
              )}
              {semester > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-[#1C1107] flex items-center justify-center">
                    <Sparkles size={16} style={{ color: GOLD_LIGHT }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Semestre</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{semester}° semestre</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-[#1C1107] flex items-center justify-center">
                  <MapPin size={16} style={{ color: GOLD_LIGHT }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Estado</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {isActive ? 'Activo en campus' : 'Fuera de campus'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">INTERESES</h3>
            <div className="flex gap-2 flex-wrap">
              {tags.map(tag => {
                const isCommon = commonInterests.includes(tag);
                return (
                  <span
                    key={tag}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                      isCommon ? 'text-white' : 'bg-orange-50 dark:bg-[#1C1107] text-gray-600 dark:text-gray-300'
                    }`}
                    style={isCommon ? { background: GOLD_GRADIENT, color: 'white' } : {}}
                  >
                    {tag}{isCommon && ' ✓'}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} style={{ color: GOLD_LIGHT }} />
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">PARCHES EN COMÚN</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Explora parches para conectar</p>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: cardBg }}>
          <div className="px-5 pt-4 pb-3 flex items-center gap-2">
            <Clock size={14} style={{ color: GOLD_LIGHT }} />
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">DISPONIBILIDAD SEMANAL</h3>
          </div>
          <div className="overflow-x-auto pb-4">
            <div style={{ minWidth: 380 }}>
              <div className="flex border-b mx-4 mb-0" style={{ borderColor: gridLine }}>
                <div className="flex-shrink-0 w-[64px]" />
                {DAYS.map(({ label, key }) => (
                  <div key={key} className="flex-1 py-1.5 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: dayTxt }}>{label}</span>
                  </div>
                ))}
              </div>
              <div className="mx-4">
                {SLOTS.map((slot, si) => (
                  <div key={si} className="flex" style={{ borderBottom: si < SLOTS.length - 1 ? `1px solid ${gridLine}` : 'none' }}>
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

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(-1)}
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
