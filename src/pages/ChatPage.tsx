import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Send, Smile, Plus, Phone, Video, MoreVertical,
  Image as ImageIcon, Users, X, Bell, BellOff, Trash2,
  UserCheck, Film, ChevronRight, Search, AlertCircle, Eraser,
  MapPin, Clock, User, Flag, ShieldAlert, ThumbsDown, Megaphone, TriangleAlert, MessageSquare,
} from 'lucide-react';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import { parches, chatMessages, GRADIENT, GOLD_LIGHT, PINK, ORANGE } from '../types/mockData';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
const EMOJIS = ['😊', '👍', '🔥', '❤️', '😂', '🙌', '✨', '💯'];
function extractGradientColors(coverColor: string) {
  const hexes = coverColor.match(/#[0-9A-Fa-f]{6}/g);
  const accentColor = hexes ? hexes[hexes.length - 1] : '#3B82F6';
  const bubbleBg = coverColor.includes('gradient') ? coverColor : `linear-gradient(135deg, ${accentColor}, ${accentColor})`;
  return { bubbleBg, accentColor };
}
const chatList = parches.filter(p => p.joined).map((p, i) => ({
  ...p,
  lastMessage: ['¡Ya estoy en la mesa del fondo! 🔌', 'Coffee & Python esta noche? ☕', 'Alguien ya terminó los ejercicios?'][i % 3],
  lastTime: ['Ahora', '15 min', '1h'][i % 3],
  unread: [3, 0, 1][i % 3],
}));
const CONTEXT_ACTIONS = [
  { icon: UserCheck, label: 'Ver perfil del parche',    color: '#3B82F6', action: 'profile' },
  { icon: Search,    label: 'Buscar en el chat',        color: '#06B6D4', action: 'search' },
  { icon: BellOff,   label: 'Silenciar notificaciones', color: '#F59E0B', action: 'mute' },
  { icon: Eraser,    label: 'Vaciar chat',              color: '#EF4444', action: 'clear' },
  { icon: AlertCircle, label: 'Reportar parche',        color: '#DC2626', action: 'report' },
];
export function ChatPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, isDark } = useApp();
  const parche = parches.find(p => p.id === id) || parches[0];
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [mutedChats, setMutedChats] = useState<string[]>([]);
  const [reportingMessage, setReportingMessage] = useState<typeof messages[0] | null>(null);
  const [reportReason, setReportReason] = useState<string>('');
  const [reportDescription, setReportDescription] = useState<string>('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuAnchor, setMenuAnchor] = useState({ top: 60, right: 16 });
  const { bubbleBg, accentColor } = extractGradientColors(parche.coverColor);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: `m${Date.now()}`,
      sender: 'Tú',
      senderId: 'u1',
      avatar: currentUser?.avatar || '',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      type: 'text' as const,
      isMe: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setShowEmojis(false);
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const replies = ['¡Genial! 🙌', 'Sí, ya voy para allá', '¿A qué hora llegas?', '👍👍', '¡Perfecto!', 'Ok, nos vemos 😊'];
        setMessages(prev => [...prev, {
          id: `m${Date.now()}`,
          sender: 'Diego Fabian',
          senderId: 'u3',
          avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
          content: replies[Math.floor(Math.random() * replies.length)],
          timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
          type: 'text' as const,
        }]);
      }, 2000 + Math.random() * 2000);
    }
  };
  const handleContextAction = (action: string) => {
    setShowContextMenu(false);
    switch (action) {
      case 'profile': navigate(`/parches/${parche.id}`); break;
      case 'mute':
        setMutedChats(prev =>
          prev.includes(parche.id) ? prev.filter(x => x !== parche.id) : [...prev, parche.id]
        );
        break;
      case 'clear':
        if (window.confirm('¿Vaciar todos los mensajes de este chat?')) setMessages([]);
        break;
      case 'report':
        alert('¡Reporte enviado! El equipo de patrici.a revisará este parche. 🛡️');
        break;
      default:
        alert(`Función "${action}" próximamente ✨`);
    }
  };
  const isMuted = mutedChats.includes(parche.id);
  const handleReportMessage = () => {
    if (!reportingMessage || !reportReason) return;
    if (!reportDescription.trim()) return;
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportingMessage(null);
      setReportReason('');
      setReportDescription('');
    }, 3000);
  };
  const chatView = (
    <div className="flex flex-col h-screen">
      {}
      <div
        className="px-4 py-3 flex items-center gap-3 shadow-sm border-b"
        style={{
          background: isDark ? 'rgba(13,27,46,0.98)' : 'rgba(253,252,248,0.97)',
          borderColor: isDark ? '#233554' : '#F3F4F6',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate('/chat')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#172A45] transition-colors active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: parche.coverColor }}>
              <EmojiIcon emoji={parche.emoji} size={18} color="white" strokeWidth={2} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#112240]" style={{ background: accentColor }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{parche.name}</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
              <span className="text-xs font-medium" style={{ color: accentColor }}>ACTIVO AHORA</span>
              <span className="text-xs text-gray-400">· {parche.members} miembros</span>
              {isMuted && <BellOff size={10} className="text-gray-400" />}
            </div>
          </div>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => alert('Videollamada grupal próximamente 📹')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-[#172A45] transition-colors"
          >
            <Video size={18} />
          </button>
          {}
          <div className="relative">
            <button
              ref={menuButtonRef}
              onClick={() => {
                if (menuButtonRef.current) {
                  const rect = menuButtonRef.current.getBoundingClientRect();
                  setMenuAnchor({
                    top: rect.bottom + 8,
                    right: Math.max(window.innerWidth - rect.right, 12),
                  });
                }
                setShowContextMenu(v => !v);
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-90"
              style={{
                background: showContextMenu
                  ? `${GOLD_LIGHT}22`
                  : 'transparent',
                color: showContextMenu ? GOLD_LIGHT : (isDark ? '#9CA3AF' : '#6B7280'),
              }}
            >
              <MoreVertical size={18} />
            </button>
            {}
            {showContextMenu && createPortal(
              <>
                {}
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                  onClick={() => setShowContextMenu(false)}
                />
                {}
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  className="w-64 rounded-2xl overflow-hidden"
                  style={{
                    position: 'fixed',
                    top: menuAnchor.top,
                    right: menuAnchor.right,
                    zIndex: 9999,
                    background: isDark ? '#0D1B2E' : 'rgba(253,252,248,0.98)',
                    border: `1px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}`,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
                  }}
                >
                  {}
                  <div className="absolute -top-2 right-4 w-4 h-2 overflow-hidden" style={{ zIndex: 10000 }}>
                    <div
                      className="w-3 h-3 rotate-45 mx-auto"
                      style={{
                        marginTop: '4px',
                        background: isDark ? '#0D1B2E' : 'rgba(253,252,248,0.98)',
                        border: `1px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}`,
                      }}
                    />
                  </div>
                  {CONTEXT_ACTIONS.map((item, i) => (
                    <button
                      key={item.action}
                      onClick={() => handleContextAction(item.action)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-[#172A45]"
                      style={{
                        borderBottom: i < CONTEXT_ACTIONS.length - 1
                          ? `1px solid ${isDark ? 'rgba(30,58,95,0.4)' : 'rgba(243,244,246,0.8)'}`
                          : 'none',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${item.color}1A` }}
                      >
                        <item.icon size={15} style={{ color: item.color }} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {item.label}
                      </span>
                      {}
                      {item.action === 'mute' && isMuted && (
                        <div className="ml-auto w-2 h-2 rounded-full" style={{ background: GOLD_LIGHT }} />
                      )}
                    </button>
                  ))}
                </motion.div>
              </>,
              document.body
            )}
          </div>
          {}
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 dark:border-[#1E3A5F] shadow-sm active:scale-95 transition-transform ml-1"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
      {}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b overflow-hidden"
            style={{
              background: isDark ? '#112240' : 'white',
              borderColor: isDark ? '#233554' : '#F3F4F6',
            }}
          >
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="flex -space-x-1.5">
                {parche.memberAvatars.map((av, i) => (
                  <img key={i} src={av} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-[#112240]" />
                ))}
              </div>
              <div className="flex-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={10} /> {parche.location}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {parche.time}</span>
              </div>
              <button
                onClick={() => navigate(`/parches/${parche.id}`)}
                className="text-xs font-medium px-3 py-1.5 rounded-full text-white"
                style={{ background: bubbleBg }}
              >
                Ver parche
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 relative" style={{
        background: isDark ? '#0A192F' : '#EDE9E0',
        isolation: 'isolate',
      }}>
        {}
        <DoodleBackground isDark={isDark} opacity={isDark ? 1 : 0.8} />
        <div className="relative z-10">
          {}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(10,25,47,0.12)' }} />
            <span
              className="text-xs px-3 py-0.5 rounded-full"
              style={{
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(10,25,47,0.5)',
                background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(253,252,248,0.85)',
                backdropFilter: 'blur(8px)',
              }}
            >Hoy</span>
            <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(10,25,47,0.12)' }} />
          </div>
          <div className="space-y-3">
            {messages.map((msg, i) => {
              if (msg.type === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span
                      className="text-xs backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5"
                      style={{
                        color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(10,25,47,0.45)',
                        background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(253,252,248,0.8)',
                        border: isDark ? 'none' : '1px solid rgba(10,25,47,0.08)',
                      }}
                    >
                      <User size={10} /> {msg.content}
                    </span>
                  </div>
                );
              }
              const isMe = msg.isMe || msg.senderId === 'u1';
              const showAvatar = !isMe && (i === 0 || messages[i - 1].senderId !== msg.senderId || messages[i - 1].type === 'system');
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'} relative group`}
                  onMouseEnter={() => setHoveredMessageId(msg.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  {!isMe && (
                    <div className="w-8 flex-shrink-0 mt-auto">
                      {showAvatar && <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20" />}
                    </div>
                  )}
                  <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col relative`}>
                    {showAvatar && !isMe && (
                      <span className="text-[11px] text-white/60 mb-1 ml-1">{msg.sender}</span>
                    )}
                    {}
                    {!isMe && msg.senderId !== 'u1' && hoveredMessageId === msg.id && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setReportingMessage(msg);
                          setReportSuccess(false);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-lg"
                        style={{
                          background: '#EF4444',
                          border: '2px solid white',
                        }}
                      >
                        <Flag size={12} className="text-white" />
                      </motion.button>
                    )}
                    {msg.type === 'image' ? (
                      <div className={`rounded-2xl overflow-hidden ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                        <img src={msg.imageUrl} alt="Imagen" className="w-56 h-36 object-cover" />
                        {msg.content && (
                          <div className="px-3 py-2 text-sm" style={isMe ? { background: bubbleBg, color: 'white' } : { background: isDark ? '#152238' : 'rgba(253,252,248,0.9)', color: isDark ? '#D1D9E6' : '#111827' }}>
                            {msg.content}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-sm ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                        style={
                          isMe
                            ? { background: bubbleBg, color: 'white' }
                            : { background: isDark ? '#152238' : 'rgba(253,252,248,0.97)', color: isDark ? '#D1D9E6' : '#111827', boxShadow: isDark ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(10,25,47,0.08)' }
                        }
                      >
                        {msg.content}
                      </div>
                    )}
                    {isMe && (
                      <div className="flex items-center gap-1 mt-0.5 mr-1">
                        <span className="text-[10px] text-white/50">{msg.timestamp}</span>
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4 8L8 2M6 5L9 8L13 2" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>
      {}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t px-4 py-3"
            style={{ background: isDark ? '#112240' : 'white', borderColor: isDark ? '#233554' : '#F3F4F6' }}
          >
            <div className="flex gap-3">
              {EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => setInput(prev => prev + emoji)} className="text-2xl hover:scale-125 transition-transform">
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showAttachments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t px-4 py-3 overflow-hidden"
            style={{ background: isDark ? '#112240' : 'white', borderColor: isDark ? '#233554' : '#F3F4F6' }}
          >
            <div className="flex gap-4">
              {[
                { icon: ImageIcon, label: 'Foto', color: '#3B82F6' },
                { icon: Users, label: 'Invitar', color: '#10B981' },
                { icon: Phone, label: 'Llamar', color: accentColor },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => setShowAttachments(false)}
                  className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${item.color}18` }}>
                    <item.icon size={20} style={{ color: item.color }} />
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <div
        className="px-4 py-3 border-t"
        style={{ background: isDark ? '#112240' : 'white', borderColor: isDark ? '#233554' : '#F3F4F6' }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowAttachments(v => !v); setShowEmojis(false); }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-[#172A45] transition-colors"
          >
            <Plus size={20} />
          </button>
          <div className="flex-1 flex items-center gap-2 rounded-2xl px-4 py-2" style={{ background: isDark ? '#172A45' : '#F3F4F6' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Escribe algo en el parche..."
              className="flex-1 bg-transparent text-gray-800 dark:text-white placeholder-gray-400 text-sm focus:outline-none"
            />
            <button onClick={() => setShowEmojis(v => !v)} className="text-gray-400 hover:text-yellow-400 transition-colors">
              <Smile size={18} />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all active:scale-90 disabled:opacity-50"
            style={{ background: bubbleBg }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
  const reportReasons = [
    { id: 'offensive', label: 'Contenido ofensivo', Icon: ShieldAlert, color: '#DC2626' },
    { id: 'harassment', label: 'Me molestó o incomodó', Icon: ThumbsDown, color: '#EA580C' },
    { id: 'spam', label: 'Spam o irrelevante', Icon: Megaphone, color: '#CA8A04' },
    { id: 'inappropriate', label: 'Inapropiado para el grupo', Icon: TriangleAlert, color: '#D97706' },
    { id: 'other', label: 'Otro motivo', Icon: MessageSquare, color: '#6B7280' },
  ];
  const reportModal = (
    <AnimatePresence>
      {reportingMessage && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setReportingMessage(null);
              setReportReason('');
              setReportDescription('');
              setReportSuccess(false);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] rounded-3xl shadow-2xl p-6 max-w-sm w-full mx-4 max-h-[85vh] overflow-y-auto"
            style={{
              background: isDark ? '#0D1B2E' : 'rgba(253,252,248,0.98)',
              border: `1.5px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}`,
            }}
          >
            <div className="text-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(239,68,68,0.15)' }}
              >
                <Flag size={32} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">
                Reportar mensaje
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                El equipo de Bienestar revisará este mensaje. Tu reporte es completamente anónimo.
              </p>
              <div
                className="p-3 rounded-xl text-left text-sm mb-4"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  De: {reportingMessage.sender}
                </p>
                <p className="text-gray-800 dark:text-white">
                  "{reportingMessage.content}"
                </p>
              </div>
            </div>
            {}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">
                ¿Por qué reportas este mensaje?
              </p>
              <div className="space-y-2">
                {reportReasons.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setReportReason(reason.label)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: reportReason === reason.label
                        ? isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)'
                        : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      border: `1.5px solid ${reportReason === reason.label
                        ? '#EF4444'
                        : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: reportReason === reason.label
                          ? `${reason.color}20`
                          : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      }}
                    >
                      <reason.Icon
                        size={18}
                        style={{
                          color: reportReason === reason.label ? reason.color : isDark ? '#9CA3AF' : '#6B7280',
                        }}
                      />
                    </div>
                    <span
                      className="text-sm font-medium flex-1"
                      style={{
                        color: reportReason === reason.label
                          ? '#EF4444'
                          : isDark ? '#E5E7EB' : '#1F2937',
                      }}
                    >
                      {reason.label}
                    </span>
                    {reportReason === reason.label && (
                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                          <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {}
              {reportReason && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3"
                >
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Cuéntanos qué pasó y por qué te hizo sentir mal
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value.slice(0, 500))}
                    placeholder="Describe con tus palabras lo que ocurrió..."
                    className="w-full px-3 py-2.5 rounded-xl text-sm resize-none focus:outline-none transition-all"
                    rows={4}
                    maxLength={500}
                    style={{
                      background: isDark ? '#172A45' : '#F3F4F6',
                      color: isDark ? '#E5E7EB' : '#1F2937',
                      border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    }}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    {reportDescription.length}/500 caracteres
                  </p>
                </motion.div>
              )}
            </div>
            {!reportSuccess ? (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setReportingMessage(null);
                    setReportReason('');
                    setReportDescription('');
                  }}
                  className="flex-1 py-3 rounded-xl font-semibold transition-all active:scale-95"
                  style={{
                    background: isDark ? '#172A45' : '#F3F4F6',
                    color: isDark ? '#9CA3AF' : '#6B7280',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReportMessage}
                  disabled={!reportReason || (reportReason === 'Otro motivo' && !reportDescription.trim())}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold transition-all active:scale-95 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar reporte
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-4"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(16,185,129,0.15)' }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" stroke="#10B981" strokeWidth="2" />
                    <path d="M9 16L14 21L23 11" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">
                  ¡Reporte enviado con éxito!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  El equipo de Bienestar y Soporte revisará este mensaje. Tu reporte es completamente anónimo.
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  return (
    <div className="flex h-screen overflow-hidden">
      {}
      <aside
        className="hidden md:flex flex-col w-80 flex-shrink-0 border-r overflow-hidden"
        style={{
          background: isDark ? '#0D1B2E' : 'rgba(253,252,248,0.98)',
          borderColor: isDark ? '#1E3A5F' : '#F3F4F6',
        }}
      >
        <div className="px-4 pt-5 pb-3 border-b" style={{ borderColor: isDark ? '#1E3A5F44' : '#F3F4F6' }}>
          <h2 className="text-gray-900 dark:text-white font-semibold mb-3">Chats</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Buscar..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none"
              style={{ background: isDark ? '#172A45' : '#F3F4F6', color: isDark ? 'white' : '#1F2937' }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {chatList.map(chat => {
            const isSelected = chat.id === parche.id;
            const hex = chat.coverColor.match(/#[0-9A-Fa-f]{6}/g);
            const chatAccent = hex ? hex[hex.length - 1] : '#3B82F6';
            return (
              <button
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                style={{
                  background: isSelected ? `${chatAccent}18` : 'transparent',
                  borderLeft: isSelected ? `3px solid ${chatAccent}` : '3px solid transparent',
                }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: chat.coverColor }}>
                    <EmojiIcon emoji={chat.emoji} size={20} color="white" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{chat.name}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">{chat.lastTime}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="ml-1 flex-shrink-0 min-w-[18px] h-[18px] rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                        style={{ background: chatAccent }}>
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
      {}
      <div className="flex-1 overflow-hidden">
        {chatView}
      </div>
      {}
      {reportModal}
    </div>
  );
}