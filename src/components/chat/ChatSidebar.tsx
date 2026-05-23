import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Search, MessageSquare, Users, User } from 'lucide-react';
import { directChats, matchUsers, TEAL } from '../../types/mockData';
import { EmojiIcon } from '../ui/EmojiIcon';
import { Avatar } from '../ui/Avatar';
import { useApp } from '../../store/AppContext';
import { chatService, type ConnectionResponse } from '../../services/chat.service';
import { getMyParches, type ParcheResponse } from '../../services/parches.service';

const CATEGORY_EMOJI: Record<string, string> = {
  MUSIC: '🎵', SPORT: '⚽', TECHNOLOGY: '💻', STUDY: '📚',
  CULTURE: '🎨', SOCIAL: '🤝', FOOD: '🍕', WELLNESS: '🧘',
};
const categoryEmoji = (cat: string) => CATEGORY_EMOJI[cat?.toUpperCase()] ?? '🤝';

const CATEGORY_COLOR: Record<string, string> = {
  MUSIC: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
  SPORT: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)',
  TECHNOLOGY: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
  STUDY: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
  CULTURE: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
  SOCIAL: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
  FOOD: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
  WELLNESS: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
};
const categoryColor = (cat: string) => CATEGORY_COLOR[cat?.toUpperCase()] ?? 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)';

const formatTime = (isoString?: string) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `${diffDays} días`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

export interface ChatSidebarProps {
  activeId?: string;
}

export function ChatSidebar({ activeId }: ChatSidebarProps) {
  const navigate = useNavigate();
  const { currentUser, isDark } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'groups'>('all');
  const [connections, setConnections] = useState<ConnectionResponse[]>([]);
  const [myParches, setMyParches] = useState<ParcheResponse[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, { content: string; sentAt: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [connectionsData, parchesData] = await Promise.all([
          chatService.getActiveConnections().catch(() => []),
          getMyParches().catch(() => [])
        ]);
        setConnections(connectionsData);
        setMyParches(parchesData);

        // Fetch last messages in background for each channel
        const currentUserId = currentUser?.id || 'u1';
        const msgPromises: Promise<any>[] = [];

        const safeConnections = Array.isArray(connectionsData) ? connectionsData : [];
        safeConnections.forEach(conn => {
          if (conn && (conn.requesterId || conn.addresseeId)) {
            const friendId = conn.requesterId === currentUserId ? conn.addresseeId : conn.requesterId;
            msgPromises.push(
              chatService.fetchFriendMessages(friendId, 0, 1)
                .then(res => ({
                  id: friendId,
                  message: res.content && res.content.length > 0 ? res.content[0] : null
                }))
                .catch(() => ({ id: friendId, message: null }))
            );
          }
        });

        const safeParches = Array.isArray(parchesData) ? parchesData : [];
        safeParches.forEach(p => {
          msgPromises.push(
            chatService.fetchParcheMessages(p.id, 0, 1)
              .then(res => ({
                id: p.id,
                message: res.content && res.content.length > 0 ? res.content[0] : null
              }))
              .catch(() => ({ id: p.id, message: null }))
          );
        });

        const results = await Promise.all(msgPromises);
        const newLastMessages: Record<string, { content: string; sentAt: string }> = {};
        results.forEach(res => {
          if (res && res.message) {
            newLastMessages[res.id] = {
              content: res.message.content,
              sentAt: res.message.sentAt
            };
          }
        });
        setLastMessages(newLastMessages);
      } catch (error) {
        console.error('Error al cargar datos en la barra lateral:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  // Compute the live messages data dynamically
  const groupChatList = useMemo(() => {
    return myParches.map(p => {
      const lm = lastMessages[p.id];
      return {
        id: p.id,
        name: p.name,
        emoji: categoryEmoji(p.category),
        coverColor: categoryColor(p.category),
        members: p.actualMembers,
        chatType: 'group' as const,
        lastMessage: lm ? lm.content : 'No hay mensajes aún',
        lastTime: lm ? formatTime(lm.sentAt) : '',
        unread: 0,
        online: false,
      };
    });
  }, [myParches, lastMessages]);

  const directChatList = useMemo(() => {
    const currentUserId = currentUser?.id || 'u1';
    const safeConnections = Array.isArray(connections) ? connections : [];

    return safeConnections
      .filter(conn => conn && (conn.requesterId || conn.addresseeId))
      .map(conn => {
        const friendId = conn.requesterId === currentUserId ? conn.addresseeId : conn.requesterId;
        const matchedProfile = matchUsers.find(u => u.id === friendId) || 
                               directChats.find(c => c.userId === friendId);
        const lm = lastMessages[friendId];

        return {
          id: friendId || '',
          userId: friendId || '',
          name: matchedProfile?.name || `Estudiante ${(friendId || '').slice(0, 4)}`,
          avatar: matchedProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          faculty: matchedProfile?.faculty || 'Facultad de Ingeniería',
          lastMessage: lm ? lm.content : 'Conexión aceptada 🤝',
          lastTime: lm ? formatTime(lm.sentAt) : '',
          unread: 0,
          online: matchedProfile?.online || false,
          accentColor: matchedProfile?.accentColor || '#06B6D4',
          chatType: 'direct' as const,
        };
      });
  }, [connections, currentUser, lastMessages]);

  const allChats = useMemo(() => {
    const combined = [...directChatList, ...groupChatList];
    
    // Sort so that chats with newer activity go up
    // Simple custom ordering mapping for clean sorting of times
    const parseTimeToScore = (timeStr: string) => {
      if (timeStr.includes('AM') || timeStr.includes('PM')) {
        // Mock score: newer PM/AM goes higher
        const [time, modifier] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour = hours;
        if (modifier === 'PM' && hour < 12) hour += 12;
        if (modifier === 'AM' && hour === 12) hour = 0;
        return hour * 60 + minutes;
      }
      if (timeStr === 'Ahora') return 9999;
      if (timeStr.includes('min')) return 9990 - parseInt(timeStr);
      if (timeStr.includes('h')) return 9000 - parseInt(timeStr) * 60;
      if (timeStr === 'Ayer') return 1000;
      if (timeStr.includes('días')) return 500;
      return 0;
    };

    return combined.sort((a, b) => parseTimeToScore(b.lastTime) - parseTimeToScore(a.lastTime));
  }, [directChatList, groupChatList]);

  const filtered = useMemo(() => {
    const baseFiltered = allChats.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return baseFiltered.filter(c => {
      if (activeTab === 'direct') return c.chatType === 'direct';
      if (activeTab === 'groups') return c.chatType === 'group';
      return true;
    });
  }, [allChats, searchQuery, activeTab]);

  return (
    <div className="w-full flex flex-col h-full bg-white dark:bg-[#060D1A] border-r border-gray-200/80 dark:border-[#1E3A5F]/40">
      <div className="px-5 pt-5 pb-4">
        {/* Search */}
        <div className="relative mb-3.5">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar o iniciar un chat..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl placeholder-gray-400 focus:outline-none text-xs transition-all border"
            style={isDark ? {
              background: '#0D1B2E',
              color: '#E2E8F0',
              borderColor: 'rgba(30,58,95,0.4)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            } : {
              background: 'rgba(253,252,248,0.95)',
              color: '#1F2937',
              borderColor: 'rgba(10,25,47,0.08)',
              boxShadow: '0 2px 8px rgba(10,25,47,0.04)',
            }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-gray-100/70 dark:bg-[#0D1B2E]/50">
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
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                style={{
                  background: isActive ? TEAL : 'transparent',
                  color: isActive ? 'white' : (isDark ? '#94A3B8' : '#4B5563'),
                  boxShadow: isActive ? '0 2px 8px rgba(6,182,212,0.2)' : 'none',
                }}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 m-0">No se encontraron chats</p>
          </div>
        ) : (
          filtered.map((chat, i) => {
            const isDirect = chat.chatType === 'direct';
            const accentColor = isDirect
              ? chat.accentColor
              : (chat.coverColor.match(/#[0-9A-Fa-f]{6}/g) || ['#06B6D4']).slice(-1)[0];
            const isSelected = activeId === chat.id;

            return (
              <button
                key={chat.id}
                onClick={() => navigate(isDirect ? `/direct-chat/${chat.id}` : `/chat/${chat.id}`)}
                className="w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-gray-100/50 dark:hover:bg-[#112240]/40"
                style={isDark ? {
                  background: isSelected ? 'rgba(30,58,95,0.4)' : '#0D1B2E',
                  border: isSelected ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(30,58,95,0.3)',
                  boxShadow: isSelected ? '0 4px 12px rgba(6,182,212,0.06)' : '0 2px 6px rgba(0,0,0,0.1)',
                } : {
                  background: isSelected ? 'rgba(6,182,212,0.08)' : 'rgba(253,252,248,0.95)',
                  border: isSelected ? '1px solid rgba(6,182,212,0.2)' : '1px solid rgba(10,25,47,0.05)',
                  boxShadow: isSelected ? '0 4px 12px rgba(6,182,212,0.05)' : '0 2px 8px rgba(10,25,47,0.02)',
                }}
              >
                {/* Avatar area */}
                <div className="relative flex-shrink-0">
                  {isDirect ? (
                    <Avatar
                      name={chat.name}
                      size={42}
                      className="rounded-lg"
                      gradient={accentColor}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                      style={{ background: chat.coverColor }}
                    >
                      <EmojiIcon emoji={chat.emoji} size={18} color="white" strokeWidth={2} />
                    </div>
                  )}
                  {chat.online && (
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                      style={{
                        background: accentColor,
                        borderColor: isDark ? '#0D1B2E' : '#FFF',
                      }}
                    />
                  )}
                </div>

                {/* Info area */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 dark:text-white text-xs truncate m-0">
                      {chat.name}
                    </h4>
                    <span className="text-[9px] text-gray-400 font-medium flex-shrink-0 ml-1.5">
                      {chat.lastTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate m-0 flex-1 leading-snug">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span
                        className="ml-1.5 flex-shrink-0 min-w-[15px] h-[15px] rounded-full text-white text-[9px] font-bold flex items-center justify-center px-1"
                        style={{
                          background: TEAL,
                          boxShadow: '0 2px 6px rgba(6,182,212,0.3)',
                        }}
                      >
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  
                  {isDirect ? (
                    <span className="text-[9px] text-gray-400 mt-1 block font-medium truncate">
                      {chat.faculty}
                    </span>
                  ) : (
                    <span className="text-[9px] text-gray-400 mt-1 block font-medium">
                      {chat.members} miembros
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
