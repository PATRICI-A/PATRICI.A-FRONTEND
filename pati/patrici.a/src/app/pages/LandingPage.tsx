import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Users, Zap, Calendar, Heart, ChevronRight, Sun, Moon, MessageSquare, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GRADIENT, PINK, ORANGE } from '../data/mockData';
import logoImg from '../../imports/logo_nuevo_patricia.png';
import slide1 from '../../imports/imagen_1_u.jpg';
import slide2 from '../../imports/imagen_2_u.jpg';
import slide3 from '../../imports/imagen_3_u.jpg';
import { EmojiIcon } from '../components/ui/EmojiIcon';

const features = [
  {
    icon: Zap,
    title: 'Match por Intereses',
    description: 'Conecta con personas que comparten tus pasiones y estilo de vida en el campus.',
    gradient: GRADIENT,
  },
  {
    icon: Users,
    title: 'Crea tu Parche',
    description: 'Arma planes públicos o privados, invita amigos y vive la universidad al máximo.',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
  },
  {
    icon: Calendar,
    title: 'Eventos del Campus',
    description: 'Descubre y participa en todos los eventos universitarios en un solo lugar.',
    gradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
  },
  {
    icon: Heart,
    title: 'Bienestar y Soporte',
    description: 'Tu salud mental importa. Accede a soporte emocional y recursos de bienestar 24/7.',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
  },
];

const slides = [
  {
    title: 'Conecta con tu',
    highlight: 'tribu universitaria',
    description: 'Encuentra personas con tus mismos intereses y arma el parche perfecto en el campus.',
    image: slide1,
  },
  {
    title: 'Descubre',
    highlight: 'parches increíbles',
    description: 'Desde sesiones de estudio hasta conciertos. Siempre hay algo para ti.',
    image: slide2,
  },
  {
    title: 'Colecciona',
    highlight: 'patricias únicas',
    description: 'Gana patricias coleccionables y sube de nivel mientras construyes tu red social.',
    image: slide3,
  },
];

const testimonials = [
  {
    id: 't1',
    name: 'Carlos M.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    program: 'Ingeniería de Sistemas · 5to semestre',
    comment: 'La mejor plataforma para conectar con estudiantes de mi facultad. Encontré mi grupo de estudio y ahora compartimos recursos y nos ayudamos mutuamente.',
    date: 'Hace 2 días',
  },
  {
    id: 't2',
    name: 'María S.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    program: 'Diseño Industrial · 3er semestre',
    comment: 'Increíble cómo patrici.a facilita la organización de eventos y parches. Ya he asistido a 5 eventos este mes.',
    date: 'Hace 1 semana',
  },
  {
    id: 't3',
    name: 'Andrés L.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    program: 'Administración · 7mo semestre',
    comment: 'El sistema de patricias es adictivo! Me encanta desbloquear nuevas y ver mi progreso en el campus.',
    date: 'Hace 3 días',
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newComment, setNewComment] = useState('');
  const isAuthenticated = false; // Simula que el usuario NO está autenticado en landing

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F7FF] dark:bg-[#0A192F] transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-[#0A192F]/90 backdrop-blur-md border-b border-blue-100/80 dark:border-[#233554]/60 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 bg-white shadow-md">
            <img src={logoImg} alt="patrici.a" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg" style={{ background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            patrici.a
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#112240] shadow-sm text-gray-500 dark:text-gray-400"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Hero Image Carousel */}
          <div className="relative h-[70vh] md:h-[80vh]">
            {slides.map((slide, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: i === currentSlide ? 1 : 0 }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)' }} />
              </div>
            ))}

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: GRADIENT }} />
                  <span className="text-white text-xs font-medium">Para estudiantes ECI</span>
                </div>
                <h1 className="text-white mb-2" style={{ fontSize: '2rem', lineHeight: '1.2' }}>
                  {slides[currentSlide].title}{' '}
                  <span style={{ background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {slides[currentSlide].highlight}
                  </span>
                </h1>
                <p className="text-white/90 text-base font-medium mb-3" style={{ letterSpacing: '0.01em' }}>
                  Momentos que inspiran, parches que unen.
                </p>
                <p className="text-gray-200 text-sm mb-8 max-w-xs leading-relaxed">
                  {slides[currentSlide].description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/register')}
                    className="flex-1 py-4 rounded-2xl text-white font-semibold text-base transition-transform active:scale-95 shadow-lg"
                    style={{ background: GRADIENT }}
                  >
                    Regístrate
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="flex-1 py-4 rounded-2xl font-semibold text-base bg-white/20 backdrop-blur-sm text-white border border-white/30 transition-transform active:scale-95"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </motion.div>

              {/* Slide indicators */}
              <div className="flex gap-2 mt-6">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === currentSlide ? '24px' : '8px',
                      background: i === currentSlide ? GRADIENT : 'rgba(255,255,255,0.4)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-10">
          <div className="text-center mb-8">
            <h2 className="text-gray-800 dark:text-white mb-2">Todo lo que necesitas</h2>
            <p className="text-sm text-blue-400 dark:text-gray-400">Una plataforma diseñada para el bienestar universitario</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm border border-blue-100 dark:border-[#233554]"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: feature.gradient }}
                >
                  <feature.icon size={22} color="white" />
                </div>
                <h3 className="text-gray-800 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Patricias Preview */}
        <section className="px-6 py-8 bg-white dark:bg-[#112240] mx-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-800 dark:text-white">Colecciona Patricias</h2>
              <p className="text-sm text-blue-400 dark:text-gray-400">Mientras más patricias consigas, mejores recompensas: cafés, puntos extras y mucho más</p>
            </div>
          </div>
          <div className="flex md:grid md:grid-cols-7 gap-3 md:gap-4 overflow-x-auto md:overflow-visible pb-3 scrollbar-hide md:justify-items-center">
            {[
              {
                emoji: '🎵', name: 'Melómano', rarity: 'ÉPICO', stars: 3, xp: 260,
                bg: 'linear-gradient(160deg, #1E1B4B 0%, #4338CA 80%, #6D28D9 100%)',
                border: '#8B5CF6', glow: 'rgba(139,92,246,0.55)',
                shimmer: false, textColor: '#DDD6FE',
              },
              {
                emoji: '💡', name: 'Genio', rarity: 'ÉPICO', stars: 3, xp: 280,
                bg: 'linear-gradient(160deg, #0F2450 0%, #1E3A8A 60%, #1D4ED8 100%)',
                border: '#3B82F6', glow: 'rgba(59,130,246,0.55)',
                shimmer: false, textColor: '#BFDBFE',
              },
              {
                emoji: '🤝', name: 'Social', rarity: 'COMÚN', stars: 1, xp: 50,
                bg: 'linear-gradient(160deg, #0C2340 0%, #0369A1 70%, #0284C7 100%)',
                border: '#06B6D4', glow: 'rgba(6,182,212,0.45)',
                shimmer: false, textColor: '#A5F3FC',
              },
              {
                emoji: '🐾', name: 'Tech Puppy', rarity: 'COMÚN', stars: 1, xp: 50,
                bg: 'linear-gradient(160deg, #0F2450 0%, #1E3A8A 60%, #2563EB 100%)',
                border: '#3B82F6', glow: 'rgba(59,130,246,0.45)',
                shimmer: false, textColor: '#BFDBFE',
              },
              {
                emoji: '🎓', name: 'Honors', rarity: 'RARO', stars: 2, xp: 150,
                bg: 'linear-gradient(160deg, #0C2340 0%, #0369A1 50%, #0891B2 100%)',
                border: '#06B6D4', glow: 'rgba(6,182,212,0.5)',
                shimmer: false, textColor: '#A5F3FC',
              },
              {
                emoji: '👑', name: 'Líder Nato', rarity: 'LEGENDARIO', stars: 4, xp: 600,
                bg: 'linear-gradient(160deg, #1C1107 0%, #78350F 50%, #92400E 100%)',
                border: '#F59E0B', glow: 'rgba(245,158,11,0.7)',
                shimmer: true, textColor: '#FDE68A',
              },
            ].map((mona, idx) => (
              <div
                key={mona.name}
                className="flex-shrink-0 md:flex-shrink flex flex-col items-center justify-self-center"
                style={{ width: 76 }}
              >
                {/* Card */}
                <div
                  className="relative rounded-2xl overflow-hidden flex flex-col items-center"
                  style={{
                    width: 76,
                    height: 100,
                    background: mona.bg,
                    border: `2px solid ${mona.border}`,
                    boxShadow: `0 4px 18px ${mona.glow}, 0 0 0 1px ${mona.border}33`,
                  }}
                >
                  {/* Gold shimmer for legendary */}
                  {mona.shimmer && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, transparent 30%, rgba(252,211,77,0.3) 50%, transparent 70%)',
                        animation: 'shimmer 2s ease-in-out infinite',
                      }}
                    />
                  )}
                  {/* Gold top bar for legendary */}
                  {mona.rarity === 'LEGENDARIO' && (
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5"
                      style={{ background: 'linear-gradient(90deg, #92400E, #F59E0B, #92400E)' }}
                    />
                  )}

                  {/* Rarity + stars row */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between">
                    <span
                      className="text-[6px] font-black px-1 py-0.5 rounded-full"
                      style={{ background: `${mona.border}30`, color: mona.textColor }}
                    >
                      {mona.rarity}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <svg key={i} width="5" height="5" viewBox="0 0 10 10">
                          <polygon
                            points="5,0 6.5,3.5 10,4 7.5,7 8,10 5,8.5 2,10 2.5,7 0,4 3.5,3.5"
                            fill={i < mona.stars ? mona.textColor : 'none'}
                            stroke={i < mona.stars ? mona.textColor : `${mona.textColor}40`}
                            strokeWidth="1"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Emoji */}
                  <div className="flex-1 flex items-center justify-center mt-3">
                    <EmojiIcon emoji={mona.emoji} size={26} color="white" strokeWidth={1.8} />
                  </div>

                  {/* Name footer */}
                  <div
                    className="w-full text-center px-1 py-1.5"
                    style={{ background: 'rgba(0,0,0,0.45)' }}
                  >
                    <p className="text-[9px] font-black truncate" style={{ color: mona.textColor }}>
                      {mona.name}
                    </p>
                    <p className="text-[7px] mt-0.5" style={{ color: `${mona.textColor}80` }}>
                      +{mona.xp} XP
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* +7 más card */}
            <div className="flex-shrink-0 md:flex-shrink flex flex-col items-center justify-self-center" style={{ width: 76 }}>
              <div
                className="rounded-2xl flex items-center justify-center"
                style={{
                  width: 76,
                  height: 100,
                  background: 'linear-gradient(160deg, #0A1628 0%, #112240 100%)',
                  border: '2px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="text-center">
                  <p
                    className="font-black"
                    style={{
                      fontSize: 18,
                      background: 'linear-gradient(135deg, #92400E, #F59E0B)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    +7
                  </p>
                  <p className="text-[8px] text-white/40 mt-0.5">más</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comments / Reviews Section */}
        <section className="px-6 py-10 bg-white dark:bg-[#0D1B2E]">
          <div className="text-center mb-6">
            <h2 className="text-gray-800 dark:text-white mb-2">Lo que dicen nuestros estudiantes</h2>
            <p className="text-sm text-blue-400 dark:text-gray-400">Experiencias reales de la comunidad</p>
          </div>

          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 dark:bg-[#112240] rounded-2xl p-4 border-2 border-[#1D4ED8] dark:border-[#3B82F6]"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-gray-800 dark:text-white">{testimonial.name}</p>
                      <span className="text-xs text-gray-400">{testimonial.date}</span>
                    </div>
                    <p className="text-xs text-blue-400 dark:text-gray-400 mb-2">{testimonial.program}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{testimonial.comment}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Write Comment Section - Only for authenticated users */}
          {isAuthenticated ? (
            <div className="bg-gray-50 dark:bg-[#112240] rounded-2xl p-4 border border-gray-100 dark:border-[#233554]">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Comparte tu experiencia con patrici.a..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A192F] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#1D4ED8] transition-all resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => {
                    // Aquí iría la lógica para enviar el comentario
                    setNewComment('');
                  }}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: GRADIENT }}
                >
                  <Send size={14} />
                  Publicar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                ¿Quieres compartir tu experiencia? Únete a la comunidad
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
                style={{ background: GRADIENT }}
              >
                Crear cuenta gratis
              </button>
            </div>
          )}
        </section>

        {/* Final CTA */}
        <section className="px-6 pb-12">
          <div className="text-center mb-6">
            <h2 className="text-gray-800 dark:text-white mb-2">¿Lista para conectar?</h2>
            <p className="text-sm text-blue-400 dark:text-gray-400">Únete a miles de estudiantes que ya están construyendo su red</p>
          </div>
        </section>
      </div>
    </div>
  );
}