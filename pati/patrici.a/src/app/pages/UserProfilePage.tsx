import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Sparkles, Star, Users, Heart, Clock } from 'lucide-react';
import { matchUsers, GRADIENT, TEAL, TEAL_GRADIENT, PINK, GOLD_LIGHT, GOLD_GRADIENT } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';

export function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const { isDark, currentUser } = useApp();

  // Buscar el usuario por ID
  const user = matchUsers.find(u => u.id === userId);

  // Si no se encuentra el usuario, redirigir
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A192F] flex items-center justify-center">
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

  // Calcular compatibilidad
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A192F] relative pb-20">
      <DoodleBackground isDark={isDark} />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-lg border-b border-gray-200 dark:border-[#1E3A5F]">
        <div className="px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2F4A] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-gray-900 dark:text-white font-bold text-lg">Perfil</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      {/* Profile Hero */}
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

          {/* Match percentage */}
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

      {/* Details sections */}
      <div className="px-5 space-y-4">
        {/* Academic Info */}
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

        {/* Interests */}
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

        {/* Common Parches */}
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

        {/* Connection CTA */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            // Aquí iría la lógica de conexión
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
