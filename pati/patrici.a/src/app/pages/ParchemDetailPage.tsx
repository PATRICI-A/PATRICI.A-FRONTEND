import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, MessageCircle, MapPin, Clock, Calendar, Users, Lock, Globe, Share2, Bell, UserPlus, LogOut, Sparkles, AlertCircle, Link2 } from 'lucide-react';
import { parches, matchUsers, GRADIENT, GOLD_GRADIENT, GOLD_LIGHT, PINK, ORANGE } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { EmojiIcon } from '../components/ui/EmojiIcon';

// ── Skeleton loader ──────────────────────────────────────────────────────────
function ParcheDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A192F] animate-pulse">
      <div className="h-56 bg-gray-200 dark:bg-[#112240]" />
      <div className="px-5 py-4 max-w-lg mx-auto space-y-4">
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-8 w-24 rounded-full bg-gray-200 dark:bg-[#172A45]" />
          ))}
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-[#112240] rounded-2xl p-4 shadow-sm">
            <div className="h-4 w-32 bg-gray-200 dark:bg-[#172A45] rounded mb-3" />
            <div className="h-3 w-full bg-gray-100 dark:bg-[#1E2038] rounded mb-2" />
            <div className="h-3 w-4/5 bg-gray-100 dark:bg-[#1E2038] rounded" />
          </div>
        ))}
        <div className="h-14 w-full rounded-2xl bg-gray-200 dark:bg-[#172A45]" />
      </div>
    </div>
  );
}

export function ParchemDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDark } = useApp();

  // ── ALL hooks BEFORE any conditional return (React rules of hooks) ─────────
  const parche = parches.find(p => p.id === id);

  const [joined, setJoined] = useState(parche?.joined ?? false);
  const [reminder, setReminder] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const members = matchUsers.slice(0, Math.min(4, parche?.members ?? 0));
  const isFull = (parche?.members ?? 0) >= (parche?.maxMembers ?? 1);

  // ── Guard: parche not found (AFTER all hooks) ─────────────────────────────
  if (!id || !parche) return <ParcheDetailSkeleton />;

  // ── Share handler: robust with fallback and toast ─────────────────────────
  const handleShare = async () => {
    const url = window.location.href;
    // Try Web Share API first (mobile / modern browsers)
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: parche.name, text: parche.description, url });
        return;
      } catch {
        // User cancelled or API not supported → fall through
      }
    }
    // Fallback: clipboard
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard also failed — still show toast
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A192F] relative" style={{ isolation: 'isolate' }}>
      {/*
        Doodle at z-index 0, behind all content.
        The hero gradient div, cards and images are in normal DOM flow → painted on top.
      */}
      <DoodleBackground isDark={isDark} opacity={isDark ? 0.72 : 0.55} />

      {/* Hero */}
      <div className="relative h-56" style={{ background: parche.coverColor }}>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white z-10"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setReminder(!reminder)}
            className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center transition-colors active:scale-90"
            style={{ color: reminder ? GOLD_LIGHT : 'white' }}
          >
            <Bell size={16} />
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform relative"
          >
            <Share2 size={16} />
            {/* Toast feedback */}
            {shareToast && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-11 right-0 whitespace-nowrap text-[10px] font-bold text-white px-3 py-1.5 rounded-xl pointer-events-none flex items-center gap-1.5"
                style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
              >
                <Link2 size={9} /> Enlace copiado
              </motion.div>
            )}
          </button>
        </div>

        {/* Privacy badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5">
            {parche.type === 'private'
              ? <><Lock size={10} /> Privado</>
              : <><Globe size={10} /> Público</>}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)' }}
                >
                  <EmojiIcon emoji={parche.emoji} size={20} color="white" strokeWidth={2} />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                  {parche.category.toUpperCase()}
                </span>
                {parche.trending && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-black text-white flex items-center gap-0.5"
                    style={{ background: GOLD_GRADIENT }}
                  >
                    <Sparkles size={8} /> TOP
                  </span>
                )}
              </div>
              <h1 className="text-white text-xl font-bold">{parche.name}</h1>
            </div>
            <div className="flex -space-x-2">
              {parche.memberAvatars.slice(0, 3).map((av, i) => (
                <img key={i} src={av} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white/50" />
              ))}
              <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">+{parche.members - 3}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 max-w-lg mx-auto">
        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { icon: MapPin, text: parche.location },
            { icon: Calendar, text: parche.date },
            { icon: Clock, text: parche.time },
            { icon: Users, text: `${parche.members}/${parche.maxMembers} miembros` },
          ].map(chip => (
            <div
              key={chip.text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#112240] shadow-sm text-xs text-gray-600 dark:text-gray-300"
            >
              <chip.icon size={12} style={{ color: PINK }} />
              {chip.text}
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 mb-4 shadow-sm">
          <h3 className="text-gray-800 dark:text-white font-semibold text-sm mb-2">Sobre este parche</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{parche.description}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {parche.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ color: PINK, background: 'rgba(29,78,216,0.1)' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Organizer */}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 mb-4 shadow-sm">
          <h3 className="text-gray-800 dark:text-white font-semibold text-sm mb-3">Organizado por</h3>
          <div className="flex items-center gap-3">
            <img src={parche.memberAvatars[0]} alt={parche.admin} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-medium text-gray-800 dark:text-white text-sm">{parche.admin}</p>
              <p className="text-xs text-gray-400">Admin del parche</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:bg-blue-50 active:scale-95"
              style={{ color: PINK, borderColor: PINK }}
            >
              Ver perfil
            </button>
          </div>
        </div>

        {/* Members */}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-800 dark:text-white font-semibold text-sm">Miembros ({parche.members})</h3>
            <button className="text-xs font-medium flex items-center gap-1" style={{ color: PINK }}>
              <UserPlus size={12} /> Invitar
            </button>
          </div>
          <div className="space-y-3">
            {members.map(member => (
              <button
                key={member.id}
                onClick={() => navigate(`/user/${member.id}`)}
                className="w-full flex items-center gap-3 text-left hover:bg-gray-50 dark:hover:bg-[#172A45] rounded-xl p-2 -mx-2 transition-colors active:scale-[0.98]"
              >
                <div className="relative">
                  <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover" />
                  {member.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#112240]" style={{ background: ORANGE }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.faculty}</p>
                </div>
                <div className="flex gap-1">
                  {member.interests.slice(0, 2).map(interest => (
                    <span key={interest} className="text-xs px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-[#172A45] text-blue-500 dark:text-gray-400">
                      {interest}
                    </span>
                  ))}
                </div>
              </button>
            ))}
            {parche.members > 4 && (
              <button className="w-full py-2 text-xs font-medium text-center hover:opacity-80 active:scale-95" style={{ color: PINK }}>
                Ver todos los {parche.members} miembros
              </button>
            )}
          </div>
        </div>

        {/* Capacity bar */}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Capacidad</h3>
            <span className="text-xs text-gray-400">{parche.members}/{parche.maxMembers}</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-[#172A45] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: isFull ? GOLD_GRADIENT : GRADIENT }}
              initial={{ width: 0 }}
              animate={{ width: `${(parche.members / parche.maxMembers) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {isFull ? '⚠️ Parche lleno' : `${parche.maxMembers - parche.members} espacios disponibles`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {joined ? (
            <>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/chat/${parche.id}`)}
                className="flex-1 py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
                style={{ background: GRADIENT }}
              >
                <MessageCircle size={18} />
                Ir al Chat
              </motion.button>
              <button
                onClick={() => setJoined(false)}
                className="w-14 h-14 rounded-2xl bg-white dark:bg-[#112240] shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors active:scale-95"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => !isFull && setJoined(true)}
              disabled={isFull}
              className="flex-1 py-4 rounded-2xl text-white font-black flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-60"
              style={{
                background: isFull ? 'rgba(156,163,175,0.4)' : GOLD_GRADIENT,
                boxShadow: isFull ? 'none' : '0 8px 24px rgba(217,119,6,0.45)',
              }}
            >
              {isFull ? (
                <><AlertCircle size={18} /> Parche lleno</>
              ) : (
                <><Sparkles size={18} /> Unirme al Parche</>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}