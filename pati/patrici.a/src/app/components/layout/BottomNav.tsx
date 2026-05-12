import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from "motion/react";
import { Compass, Users, MessageCircle, MapPin, User, Heart } from 'lucide-react';
import { GRADIENT, GOLD_GRADIENT, GOLD_LIGHT } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const navItems = [
  { path: '/home',        icon: Compass,       label: 'Descubrir' },
  { path: '/matches',     icon: Heart,         label: 'Matching'  },
  { path: '/parches',     icon: Users,         label: 'Parches'   },
  { path: '/campus-map',  icon: MapPin,        label: 'Campus'    },
  { path: '/chat',        icon: MessageCircle, label: 'Chat'      },
  { path: '/profile',     icon: User,          label: 'Perfil'    },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0A192F]/97 backdrop-blur-md border-t border-gray-100/80 dark:border-[#233554]/80">
      <div className="max-w-lg mx-auto flex items-center justify-around px-1 py-2 safe-area-pb">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive =
            location.pathname === path ||
            (path === '/parches' && location.pathname.startsWith('/parches')) ||
            (path === '/campus-map' && location.pathname === '/campus-map');
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 active:scale-90 min-w-[48px]"
            >
              <div className="relative">
                {/* Gold glow pill for active item */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-[-8px] rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.18), rgba(245,158,11,0.12))' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={isActive ? { color: GOLD_LIGHT } : { color: '#9CA3AF' }}
                  />
                  {path === '/chat' && notifications > 0 && (
                    <span
                      className="absolute -top-1 -right-1.5 w-[14px] h-[14px] rounded-full text-white flex items-center justify-center font-bold"
                      style={{ background: GRADIENT, fontSize: '8px' }}
                    >
                      {notifications}
                    </span>
                  )}
                </div>
              </div>
              <span
                className="text-[10px] font-medium transition-colors"
                style={isActive ? { color: GOLD_LIGHT, fontWeight: 700 } : { color: '#9CA3AF' }}
              >
                {label}
              </span>
              {/* Gold dot indicator under active */}
              {isActive && (
                <motion.div
                  layoutId="activeNavDot"
                  className="w-1 h-1 rounded-full"
                  style={{ background: GOLD_LIGHT }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}