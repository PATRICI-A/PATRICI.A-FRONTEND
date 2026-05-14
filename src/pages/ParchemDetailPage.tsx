import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MessageCircle, MapPin, Clock, Calendar, Users, Lock, Globe, Share2, Bell, UserPlus, LogOut, Sparkles, AlertCircle, Link2, Sun, Moon, MoreVertical, Flag, CheckCircle } from 'lucide-react';
import { parches, matchUsers, GRADIENT, GOLD_GRADIENT, GOLD_LIGHT, PINK, ORANGE } from '../types/mockData';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import { LuxuryDrawer } from '../components/layout/LuxuryDrawer';
import logoImg from '../assets/logo_nuevo_patricia.png';
function ParcheDetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
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
  const { isDark, toggleTheme, currentUser, notifications } = useApp();
  const parche = parches.find(p => p.id === id);
  const [joined, setJoined] = useState(parche?.joined ?? false);
  const [reminder, setReminder] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [reportStep, setReportStep] = useState<0 | 1 | 2 | 3>(0); // 0=closed 1=category 2=desc 3=success
  const [reportCategory, setReportCategory] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportDescriptionError, setReportDescriptionError] = useState('');
  const [reportCaseNumber, setReportCaseNumber] = useState('');
  const reportReasons = ['Contenido inapropiado', 'Acoso', 'Spam', 'Información falsa', 'Otro'];
  const handleNextStep = () => {
    if (!reportCategory) return;
    setReportStep(2);
  };
  const handleSubmitReport = () => {
    if (!reportDescription.trim()) { setReportDescriptionError('La descripción del incidente es obligatoria.'); return; }
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    setReportCaseNumber(`RPT-${date}-${rand}`);
    setReportStep(3);
  };
  const closeReportModal = () => {
    setReportStep(0);
    setReportCategory('');
    setReportDescription('');
    setReportDescriptionError('');
    setReportCaseNumber('');
  };
  const members = matchUsers.slice(0, Math.min(4, parche?.members ?? 0));
  const isFull = (parche?.members ?? 0) >= (parche?.maxMembers ?? 1);
  if (!id || !parche) return <ParcheDetailSkeleton />;
  const handleShare = async () => {
    const url = window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: parche.name, text: parche.description, url });
        return;
      } catch {
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };
  return (
    <div className="min-h-screen relative" style={{ isolation: 'isolate' }}>
      <DoodleBackground isDark={isDark} opacity={isDark ? 0.72 : 0.55} />
      {}
      <LuxuryDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={isDark
          ? { background: 'rgba(3,13,31,0.96)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(30,58,95,0.5)', boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }
          : { background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(10,25,47,0.06)', boxShadow: '0 2px 20px rgba(10,25,47,0.07)' }
        }
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button className="flex items-center gap-2.5 active:opacity-70 transition-opacity" onClick={() => setDrawerOpen(true)}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
              <img src={logoImg} alt="patrici.a" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold tracking-tight leading-none" style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.05rem' }}>
                PATRICI.A
              </span>
              <span className="text-[10px] tracking-wide" style={{ color: isDark ? '#4A6080' : '#9CA3AF' }}>Campus Social</span>
            </div>
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={isDark ? { background: 'rgba(23,42,69,0.8)', color: '#9CA3AF' } : { background: 'rgba(253,252,248,0.80)', color: '#4A5568', boxShadow: '0 1px 8px rgba(10,25,47,0.09)', border: '1px solid rgba(10,25,47,0.07)' }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 relative"
              style={isDark ? { background: 'rgba(23,42,69,0.8)', color: '#9CA3AF' } : { background: 'rgba(253,252,248,0.80)', color: '#4A5568', boxShadow: '0 1px 8px rgba(10,25,47,0.09)', border: '1px solid rgba(10,25,47,0.07)' }}
            >
              <Bell size={15} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-[14px] h-[14px] rounded-full text-white flex items-center justify-center font-bold" style={{ background: GRADIENT, fontSize: '8px' }}>
                  {notifications}
                </span>
              )}
            </button>
            <div className="w-[38px] h-[38px] rounded-full overflow-hidden p-[3px]">
              {currentUser?.avatar
                ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                : <div className="w-full h-full rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ background: GRADIENT }}>
                    {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
              }
            </div>
          </div>
        </div>
      </header>
      {}
      <div className="relative h-56 mt-[57px]" style={{ background: parche.coverColor }}>
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
          <div className="relative">
            <button
              onClick={() => setShowReportMenu(prev => !prev)}
              className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <MoreVertical size={16} />
            </button>
            <AnimatePresence>
              {showReportMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  className="absolute top-11 right-0 rounded-2xl shadow-2xl overflow-hidden z-20"
                  style={{ background: isDark ? '#112240' : 'white', border: `1px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}`, minWidth: 180 }}
                >
                  <button
                    onClick={() => { setShowReportMenu(false); setReportStep(1); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                  >
                    <Flag size={15} />
                    Reportar parche
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {}
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
      {}
      {showReportMenu && <div className="fixed inset-0 z-10" onClick={() => setShowReportMenu(false)} />}
      {}
      <div className="px-4 py-4">
        {}
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
        {}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 mb-4 shadow-sm">
          <h3 className="text-gray-800 dark:text-white font-semibold mb-2">Sobre este parche</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{parche.description}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {parche.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ color: PINK, background: 'rgba(29,78,216,0.1)' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
        {}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 mb-4 shadow-sm">
          <h3 className="text-gray-800 dark:text-white font-semibold mb-3">Organizado por</h3>
          <div className="flex items-center gap-3">
            <img src={parche.memberAvatars[0]} alt={parche.admin} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-medium text-gray-800 dark:text-white text-sm">{parche.admin}</p>
              <p className="text-xs text-gray-400">Admin del parche</p>
            </div>
            <button
              onClick={() => navigate(`/user/${parche.adminId}`)}
              className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:bg-blue-50 active:scale-95"
              style={{ color: PINK, borderColor: PINK }}
            >
              Ver perfil
            </button>
          </div>
        </div>
        {}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-800 dark:text-white font-semibold">Miembros ({parche.members})</h3>
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
        {}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 dark:text-white">Capacidad</h3>
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
        {}
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
      {}
      <AnimatePresence>
        {reportStep === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-5"
            onClick={closeReportModal}
          >
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ background: isDark ? '#0D1B2E' : 'white', border: `1.5px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}` }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <Flag size={18} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Reportar parche</h3>
                    <p className="text-xs text-gray-400">Paso 1 de 2 · Tu reporte es anónimo</p>
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-4 mb-3">¿Cuál es el motivo del reporte?</p>
                <div className="space-y-2 mb-5">
                  {reportReasons.map(reason => (
                    <button key={reason}
                      onClick={() => setReportCategory(reason)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-left transition-all"
                      style={{
                        background: reportCategory === reason ? isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)' : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        border: `1.5px solid ${reportCategory === reason ? '#EF4444' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                        color: reportCategory === reason ? '#EF4444' : isDark ? '#E5E7EB' : '#1F2937',
                      }}
                    >
                      <span className="font-medium">{reason}</span>
                      {reportCategory === reason && (
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                            <path d="M1 4.5L3.5 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={closeReportModal} className="flex-1 py-3 rounded-2xl font-semibold text-sm"
                    style={{ background: isDark ? '#172A45' : '#F3F4F6', color: isDark ? '#9CA3AF' : '#6B7280' }}>
                    Cancelar
                  </button>
                  <button onClick={handleNextStep} disabled={!reportCategory}
                    className="flex-1 py-3 rounded-2xl font-semibold text-sm text-white transition-all disabled:opacity-40"
                    style={{ background: '#EF4444' }}>
                    Siguiente →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {reportStep === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-5"
            onClick={closeReportModal}
          >
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ background: isDark ? '#0D1B2E' : 'white', border: `1.5px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}` }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <Flag size={18} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Reportar parche</h3>
                    <p className="text-xs text-gray-400">Paso 2 de 2 · {reportCategory}</p>
                  </div>
                </div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Describe el incidente <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={reportDescription}
                  onChange={e => { setReportDescription(e.target.value.slice(0, 1000)); setReportDescriptionError(''); }}
                  placeholder="Describe con detalle qué ocurrió y por qué reportas este parche..."
                  rows={5}
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-xl text-sm resize-none focus:outline-none transition-all mb-1"
                  style={{
                    background: isDark ? '#172A45' : '#F3F4F6',
                    color: isDark ? '#E5E7EB' : '#1F2937',
                    border: `1.5px solid ${reportDescriptionError ? '#EF4444' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  }}
                />
                <div className="flex items-center justify-between mb-5">
                  {reportDescriptionError
                    ? <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{reportDescriptionError}</p>
                    : <span />}
                  <p className="text-[10px] text-gray-400 ml-auto">{reportDescription.length}/1000</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setReportStep(1)} className="flex-1 py-3 rounded-2xl font-semibold text-sm"
                    style={{ background: isDark ? '#172A45' : '#F3F4F6', color: isDark ? '#9CA3AF' : '#6B7280' }}>
                    ← Atrás
                  </button>
                  <button onClick={handleSubmitReport}
                    className="flex-1 py-3 rounded-2xl font-semibold text-sm text-white"
                    style={{ background: '#EF4444' }}>
                    Enviar reporte
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {reportStep === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-5"
          >
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
              style={{ background: isDark ? '#0D1B2E' : 'white', border: `1.5px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}` }}
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">✅ Reporte enviado exitosamente</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                  Nuestro equipo lo revisará pronto. Tu identidad permanece anónima frente al creador del parche.
                </p>
                <div className="px-4 py-3 rounded-2xl mb-6 w-full" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
                  <p className="text-xs text-gray-400 mb-1">Número de caso</p>
                  <p className="font-black text-gray-900 dark:text-white tracking-widest">{reportCaseNumber}</p>
                </div>
                <button onClick={closeReportModal} className="w-full py-3 rounded-2xl text-white font-semibold" style={{ background: GRADIENT }}>
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}