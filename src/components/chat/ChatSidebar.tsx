import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Search, MessageSquare, Users, User } from 'lucide-react';
import { parches, directChats, chatMessages, TEAL } from '../../types/mockData';
import { EmojiIcon } from '../ui/EmojiIcon';
import { Avatar } from '../ui/Avatar';
import { useApp } from '../../store/AppContext';

export interface ChatSidebarProps {
  activeId?: string;
}

export function ChatSidebar({ activeId }: ChatSidebarProps) {
  const navigate = useNavigate();
  const { currentUser, isDark } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'groups'>('all');

  // Compute the live messages data dynamically to fix "Reflejo de mensajes"
  const groupChatList = useMemo(() => {
    return parches
      .filter(p => p.joined)
      .map(p => {
        const msgs = chatMessages.filter(m => m.chatId === p.id);
        const hasMsgs = msgs.length > 0;
        const lastMsg = hasMsgs ? msgs[msgs.length - 1] : null;

        return {
          ...p,
          chatType: 'group' as const,
          lastMessage: lastMsg ? lastMsg.content : 'No hay mensajes aún',
          lastTime: lastMsg ? lastMsg.timestamp : '1h',
          unread: p.id === 'p4' ? 1 : 0, // Mock unread values
          online: p.id === 'p4' || p.id === 'p1',
        };
      });
  }, [chatMessages]);

  const directChatList = useMemo(() => {
    return directChats.map(dc => {
      const msgs = chatMessages.filter(m => m.chatId === dc.id);
      const hasMsgs = msgs.length > 0;
      const lastMsg = hasMsgs ? msgs[msgs.length - 1] : null;

      return {
        ...dc,
        chatType: 'direct' as const,
        lastMessage: lastMsg ? lastMsg.content : dc.lastMessage,
        lastTime: lastMsg ? lastMsg.timestamp : dc.lastTime,
        unread: dc.unread,
      };
    });
  }, [chatMessages]);

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
