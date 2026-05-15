import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Search, ScanLine, MessageSquare, Users, User, ArrowLeft } from 'lucide-react';
import { parches, directChats, GRADIENT, GOLD_GRADIENT, GOLD_LIGHT, TEAL } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import { Avatar } from '../components/ui/Avatar';
import { useApp } from '../store/AppContext';
const groupChatList = parches.filter(p => p.joined).map((p, i) => ({
  ...p,
  chatType: 'group' as const,
  lastMessage: [
    '¡Ya estoy en la mesa del fondo! 🔌',
    'Coffee & Python esta noche? ☕',
    'Alguien ya terminó los ejercicios?',
  ][i % 3],
  lastTime: ['Ahora', '15 min', '1h'][i % 3],
  unread: [3, 0, 1][i % 3],
  online: [true, false, true][i % 3],
}));
const directChatList = directChats.map(dc => ({
  ...dc,
  chatType: 'direct' as const,
}));
const allChats = [...directChatList, ...groupChatList].sort((a, b) => {
  const timeOrder = { 'Ahora': 0, '10 min': 1, '15 min': 2, '1h': 3, '2h': 4, '1d': 5 };
  return (timeOrder[a.lastTime as keyof typeof timeOrder] ?? 999) - (timeOrder[b.lastTime as keyof typeof timeOrder] ?? 999);
});
export function ChatListPage() {
  const navigate = useNavigate();
  const { currentUser, isDark } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'groups'>('all');
  const baseFiltered = allChats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filtered = baseFiltered.filter(c => {
    if (activeTab === 'direct') return c.chatType === 'direct';
    if (activeTab === 'groups') return c.chatType === 'group';
    return true;
  });
  return (
    <div className="flex flex-col min-h-screen">
      {}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2F4A] transition-colors active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-gray-900 dark:text-white">💬 Chats</h1>
              <p className="text-sm text-gray-400">{allChats.length} conversaciones activas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/monas')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold"
              style={{ background: GOLD_GRADIENT }}
            >
              <ScanLine size={13} />
              QR Patricias
            </motion.button>
            {}
            <button
              onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 dark:border-[#1E3A5F] shadow-sm active:scale-95 transition-transform"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar chats..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl placeholder-gray-400 focus:outline-none text-sm"
            style={isDark ? {
              background: '#0D1B2E',
              color: '#E2E8F0',
              border: '1px solid rgba(30,58,95,0.6)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            } : {
              background: 'rgba(253,252,248,0.95)',
              color: '#1F2937',
              boxShadow: '0 2px 10px rgba(10,25,47,0.07)',
              border: '1px solid rgba(10,25,47,0.07)',
            }}
          />
        </div>
        {}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Todos', icon: MessageSquare },
            { id: 'direct', label: 'Directos', icon: User },
            { id: 'groups', label: 'Parches', icon: Users },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: isActive ? TEAL : 'transparent',
                  color: isActive ? 'white' : 'inherit',
                  border: isActive ? 'none' : '1px solid rgba(156, 163, 175, 0.2)',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      {}
      <div className="flex-1 px-5">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#172A45] flex items-center justify-center mb-3 mx-auto">
              <MessageSquare size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No tienes chats activos</p>
            <button
              onClick={() => navigate('/parches')}
              className="mt-4 px-6 py-2 rounded-full text-white text-sm font-medium"
              style={{ background: GRADIENT }}
            >
              Únete a un Parche
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((chat, i) => {
              const isDirect = chat.chatType === 'direct';
              const accentColor = isDirect
                ? chat.accentColor
                : (chat.coverColor.match(/#[0-9A-Fa-f]{6}/g) || ['#06B6D4']).slice(-1)[0];
              return (
                <motion.button
                  key={chat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(isDirect ? `/direct-chat/${chat.id}` : `/chat/${chat.id}`)}
                  className="w-full flex items-center gap-3 rounded-2xl p-4 text-left active:scale-[0.98] transition-all"
                  style={isDark ? {
                    background: '#0D1B2E',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                    border: '1px solid rgba(30,58,95,0.6)',
                  } : {
                    background: 'rgba(253,252,248,0.95)',
                    boxShadow: '0 2px 14px rgba(10,25,47,0.07)',
                    border: '1px solid rgba(10,25,47,0.06)',
                  }}
                >
                  {}
                  <div className="relative flex-shrink-0">
                    {isDirect ? (
                      <Avatar
                        name={chat.name}
                        size={48}
                        className="rounded-xl"
                        gradient={accentColor}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: chat.coverColor }}
                      >
                        <EmojiIcon emoji={chat.emoji} size={22} color="white" strokeWidth={2} />
                      </div>
                    )}
                    {chat.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2" style={{ background: accentColor, borderColor: isDark ? '#0D1B2E' : 'rgba(253,252,248,0.95)' }} />
                    )}
                  </div>
                  {}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate">{chat.name}</h3>
                      <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{chat.lastTime}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span
                          className="ml-2 flex-shrink-0 min-w-[18px] h-[18px] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1"
                          style={{ background: accentColor }}
                        >
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    {!isDirect && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex -space-x-1">
                          {chat.memberAvatars.slice(0, 2).map((av, j) => (
                            <img key={j} src={av} alt="" className="w-4 h-4 rounded-full object-cover" style={{ border: `1px solid ${isDark ? '#0D1B2E' : 'rgba(253,252,248,0.95)'}` }} />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400">{chat.members} miembros</span>
                      </div>
                    )}
                    {isDirect && (
                      <span className="text-[10px] text-gray-400 mt-0.5">{chat.faculty}</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}