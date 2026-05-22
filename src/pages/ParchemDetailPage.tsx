import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MessageCircle, MapPin, Clock, Calendar, Users, Lock, Globe, Share2, Bell, UserPlus, LogOut, Sparkles, AlertCircle, Link2, Sun, Moon, MoreVertical, Flag, CheckCircle, Edit, Trash2, X, Plus, Check, Crown } from 'lucide-react';
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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const isOwner = currentUser?.id === parche.adminId || currentUser?.name === parche.admin;

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
  
  const handleLeave = () => {
    if (isOwner && parche.members > 1) {
      setShowTransferModal(true);
    } else if (isOwner && parche.members <= 1) {
      setShowDeleteConfirm(true);
    } else {
      setJoined(false);
    }
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
      {/* Background Cover */}
      <div className="relative h-56 mt-[57px]" style={{ background: parche.coverImage ? `url(${parche.coverImage}) center/cover no-repeat` : parche.coverColor }}>
        {/* Overlay gradient so text is readable over image */}
        {parche.coverImage && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />}
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
                  {isOwner && (
                    <>
                      <div className="h-px bg-gray-100 dark:bg-white/5 my-1" />
                      <button
                        onClick={() => { setShowReportMenu(false); navigate(`/parches/${parche.id}/edit`); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                      >
                        <Edit size={15} />
                        Editar parche
                      </button>
                      <button
                        onClick={() => { setShowReportMenu(false); setShowDeleteConfirm(true); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                      >
                        <Trash2 size={15} />
                        Eliminar parche
                      </button>
                    </>
                  )}
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
              <h1 className="text-white text-xl font-bold flex items-center gap-2">
                {parche.name}
                {isOwner && <Crown size={20} className="text-yellow-400 drop-shadow-md fill-yellow-400" />}
              </h1>
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
      <div className="w-full px-4 md:w-[90%] md:px-0 max-w-[1400px] mx-auto py-8 flex flex-col gap-6 relative z-10">
        {/* Info Chips */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: MapPin, text: parche.location },
            { icon: Calendar, text: parche.date },
            { icon: Clock, text: parche.time },
            { icon: Users, text: `${parche.members}/${parche.maxMembers} miembros` },
          ].map(chip => (
            <div
              key={chip.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5 font-bold text-xs text-gray-600 dark:text-gray-300 uppercase tracking-widest"
            >
              <chip.icon size={14} style={{ color: PINK }} />
              {chip.text}
            </div>
          ))}
        </div>

        {/* Sobre este parche */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">Sobre este parche</h3>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{parche.description}</p>
          <div className="flex gap-2 mt-5 flex-wrap">
            {parche.tags.map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ color: PINK, background: 'rgba(29,78,216,0.1)' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Organizado por */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-5">Organizado por</h3>
          <div className="flex items-center gap-4">
            <img src={parche.memberAvatars[0]} alt={parche.admin} className="w-14 h-14 rounded-full object-cover shadow-sm" />
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-base">{parche.admin}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">ADMIN DEL PARCHE</p>
            </div>
            <button
              onClick={() => navigate(`/user/${parche.adminId}`)}
              className="ml-auto px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-900/10 active:scale-95"
              style={{ color: PINK, borderColor: PINK }}
            >
              Ver perfil
            </button>
          </div>
        </div>

        {/* Miembros */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Miembros ({parche.members})</h3>
            </div>
            {joined && (
              <button onClick={() => navigate(`/chat/${parche.id}`)} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20" style={{ color: PINK }}>
                <MessageCircle size={14} /> Chat
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {members.map(member => (
              <button
                key={member.id}
                onClick={() => navigate(`/user/${member.id}`)}
                className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 text-left hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-2xl p-3 transition-colors active:scale-[0.99] border border-transparent hover:border-gray-100 dark:hover:border-white/5"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative">
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                    {member.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900" style={{ background: ORANGE }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{member.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 truncate mt-0.5">{member.faculty}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-[4.5rem] md:ml-auto">
                  {member.interests.slice(0, 2).map(interest => (
                    <span key={interest} className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {interest}
                    </span>
                  ))}
                </div>
              </button>
            ))}
            {parche.members > 4 && (
              <button className="w-full py-4 mt-2 text-[10px] font-black uppercase tracking-widest text-center hover:opacity-80 active:scale-95 transition-opacity" style={{ color: PINK }}>
                Ver todos los {parche.members} miembros
              </button>
            )}
          </div>
        </div>

        {/* Capacidad */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Capacidad</h3>
            <span className="font-black text-2xl text-gray-900 dark:text-white leading-none">{parche.members}<span className="text-sm text-gray-400">/{parche.maxMembers}</span></span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full"
              style={{ background: isFull ? GOLD_GRADIENT : GRADIENT }}
              initial={{ width: 0 }}
              animate={{ width: `${(parche.members / parche.maxMembers) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3 text-right">
            {isFull ? '⚠️ Parche lleno' : `${parche.maxMembers - parche.members} ESPACIOS DISPONIBLES`}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex gap-4">
          {joined ? (
            <>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowInviteModal(true)}
                className="flex-1 py-4.5 rounded-[1.5rem] text-white text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(59,130,246,0.3)] transition-all"
                style={{ background: GRADIENT }}
              >
                <UserPlus size={20} strokeWidth={2.5} />
                Invitar Amigos
              </motion.button>
              <button
                onClick={handleLeave}
                className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:border dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors active:scale-95"
              >
                <LogOut size={22} />
              </button>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => !isFull && setJoined(true)}
              disabled={isFull}
              className="flex-1 py-4.5 rounded-[1.5rem] text-white text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{
                background: isFull ? 'rgba(156,163,175,0.4)' : GOLD_GRADIENT,
                boxShadow: isFull ? 'none' : '0 8px 30px rgba(217,119,6,0.4)',
              }}
            >
              {isFull ? (
                <><AlertCircle size={20} strokeWidth={2.5} /> Parche lleno</>
              ) : (
                <><Sparkles size={20} strokeWidth={2.5} /> Unirme al Parche</>
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
      
      {/* Modals for Invite, Transfer, Delete */}
      <AnimatePresence>
        {/* Invite Modal */}
        {showInviteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-[#0D1B2E] rounded-3xl p-6 shadow-2xl" style={{ border: `1px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}` }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Invitar amigos</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={20} /></button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-4">
                {matchUsers.slice(0, 5).map(friend => {
                  const isInvited = invitedFriends.includes(friend.id);
                  return (
                    <button key={friend.id} onClick={() => setInvitedFriends(prev => isInvited ? prev.filter(id => id !== friend.id) : [...prev, friend.id])} className="w-full flex items-center gap-3 p-2 rounded-xl transition-all" style={{ background: isInvited ? 'rgba(29,78,216,0.1)' : 'transparent' }}>
                      <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="flex-1 text-sm font-medium text-left text-gray-800 dark:text-gray-200">{friend.name}</span>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: isInvited ? GRADIENT : (isDark ? '#1E293B' : '#E5E7EB') }}>
                        {isInvited ? <Check size={12} color="white" /> : <Plus size={12} color={isDark ? '#9CA3AF' : '#6B7280'} />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => { setShowInviteModal(false); setInvitedFriends([]); }} className="w-full py-3 rounded-2xl text-white font-bold" style={{ background: GRADIENT }}>
                Enviar Invitaciones ({invitedFriends.length})
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Transfer Ownership Modal */}
        {showTransferModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-[#0D1B2E] rounded-3xl p-6 shadow-2xl" style={{ border: `1px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}` }}>
              <div className="mb-4 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                  <Users size={28} className="text-blue-500" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Transferir Liderazgo</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Antes de salir, debes transferir el liderazgo del parche a otro miembro.</p>
              </div>
              <div className="space-y-2 mb-5 max-h-48 overflow-y-auto">
                {matchUsers.slice(0, Math.min(4, parche.members)).filter(m => m.id !== currentUser?.id).map(member => (
                  <button key={member.id} onClick={() => { setJoined(false); setShowTransferModal(false); navigate('/parches'); }} className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-colors">
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Hacer capitán</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowTransferModal(false)} className="w-full py-3 rounded-2xl font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirm Modal */}
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-sm bg-white dark:bg-[#0D1B2E] rounded-3xl p-6 shadow-2xl text-center" style={{ border: `1px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}` }}>
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">¿Eliminar parche?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Esta acción no se puede deshacer. Todos los miembros serán notificados.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-2xl font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                  Cancelar
                </button>
                <button onClick={() => navigate('/parches')} className="flex-1 py-3 rounded-2xl font-semibold text-white bg-red-500 hover:bg-red-600">
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}