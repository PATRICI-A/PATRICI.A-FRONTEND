import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Users, UserPlus, MessageSquarePlus, ChevronRight } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import mascotSticker from '../assets/mascota_sticker.png';

export function ChatListPage() {
  const navigate = useNavigate();
  const { isDark } = useApp();

  return (
    <div className="relative min-h-screen w-full flex flex-col pb-8">
      {/* Background wallpaper */}
      <DoodleBackground isDark={isDark} opacity={isDark ? 0.95 : 0.8} />

      {/* Independent Header (Sticky Sub-header) */}
      <div className="sticky top-[57px] md:top-[73px] z-40 bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-lg border-b border-gray-200 dark:border-[#1E3A5F] w-full">
        <div className="px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#112240] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2F4A] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-gray-900 dark:text-white font-bold text-lg">
            Chats
          </h1>
          <div className="w-9" /> {/* Spacer to center the title */}
        </div>
      </div>

      {/* Centered Dashboard Content Container */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center py-6 px-4">
        {/* Centered Dashboard Wrapper at exactly 4/6 width (approx. 66.6%) */}
        <div 
          className="relative w-full md:w-4/6 lg:w-4/6 xl:w-4/6 h-[calc(100vh-180px)] min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border backdrop-blur-md flex flex-row transition-all"
          style={isDark ? {
            background: 'rgba(6, 13, 26, 0.75)',
            borderColor: 'rgba(30, 58, 95, 0.45)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          } : {
            background: 'rgba(255, 255, 255, 0.85)',
            borderColor: 'rgba(10, 25, 47, 0.08)',
            boxShadow: '0 20px 50px rgba(10, 25, 47, 0.1)',
          }}
        >
          {/* Left Side: Chats Sidebar List */}
          <div className="w-full md:w-[340px] lg:w-[380px] h-full flex-shrink-0">
            <ChatSidebar />
          </div>

          {/* Right Side: Welcome Placeholder (hidden on mobile, visible from md:) */}
          <div className="hidden md:flex flex-1 flex-col h-full items-center justify-center p-8 bg-gray-50/20 dark:bg-black/10 relative overflow-hidden">
            {/* Subtle gradient background glow */}
            <div 
              className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20"
              style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
            />
            <div 
              className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-25"
              style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }}
            />

            <div className="max-w-md w-full text-center relative z-10 flex flex-col items-center">
              {/* Mascot Image & Speech bubble */}
              <div className="relative mb-6 group">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-44 h-44 drop-shadow-xl select-none"
                >
                  <img 
                    src={mascotSticker} 
                    alt="Patricia Mascot" 
                    className="w-full h-full object-contain filter hover:brightness-105 transition-all"
                  />
                </motion.div>

                {/* mascot speech bubble */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="absolute -top-8 -right-12 px-4 py-2 rounded-2xl text-[11px] font-bold shadow-md border flex items-center justify-center max-w-[150px] leading-snug rotate-[6deg]"
                  style={isDark ? {
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    borderColor: 'rgba(30,58,95,0.6)',
                    color: '#38BDF8',
                  } : {
                    background: 'white',
                    borderColor: 'rgba(10,25,47,0.1)',
                    color: '#0284C7',
                  }}
                >
                  ¡Hola! Selecciona un chat para comenzar... 💬
                </motion.div>
              </div>

              {/* Welcome Heading */}
              <h2 className="text-xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                Patricia Web
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 uppercase">
                  Beta
                </span>
              </h2>

              {/* Description */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
                Envía y recibe mensajes, comparte parches de estudio, colecciona monas y conéctate con tus compañeros de facultad en tiempo real.
              </p>

              {/* Quick Action Buttons */}
              <div className="w-full space-y-2.5">
                {[
                  { 
                    label: 'Añadir nuevo contacto', 
                    desc: 'Busca estudiantes de tu facultad', 
                    icon: UserPlus, 
                    color: '#3B82F6', 
                    action: () => navigate('/matches') 
                  },
                  { 
                    label: 'Explorar parches activos', 
                    desc: 'Únete a grupos de estudio o deporte', 
                    icon: Users, 
                    color: '#06B6D4', 
                    action: () => navigate('/parches') 
                  },
                  { 
                    label: 'Crear nuevo parche', 
                    desc: 'Organiza un evento o grupo', 
                    icon: MessageSquarePlus, 
                    color: '#D97706', 
                    action: () => navigate('/parches/create') 
                  },
                ].map((btn, index) => {
                  const Icon = btn.icon;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={btn.action}
                      className="w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all hover:bg-gray-100/50 dark:hover:bg-[#112240]/40"
                      style={isDark ? {
                        background: 'rgba(13, 27, 46, 0.4)',
                        borderColor: 'rgba(30, 58, 95, 0.3)',
                      } : {
                        background: 'white',
                        borderColor: 'rgba(10, 25, 47, 0.05)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
                          style={{ background: btn.color }}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-gray-800 dark:text-white m-0">
                            {btn.label}
                          </h4>
                          <p className="text-[9px] text-gray-400 m-0 mt-0.5">
                            {btn.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-400 dark:text-gray-500" />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Security notice */}
            <div className="absolute bottom-6 flex items-center gap-1.5 text-[9px] text-gray-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Cifrado de extremo a extremo de patrici.a
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
