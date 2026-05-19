import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Zap, Calendar, Heart, Sun, Moon, Send, ChevronLeft, ChevronRight, Star, Shield, Award, Quote, Sparkles } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GRADIENT } from '../types/mockData';
import logoImg from '../assets/logo_nuevo_patricia.png';
import mascotImg from '../assets/mascota_cta.png';
import slide1 from '../assets/imagen_1_u.jpg';
import slide2 from '../assets/imagen_2_u.jpg';
import slide3 from '../assets/imagen_3_u.jpg';
import slide4 from '../assets/foto 1 u.jpg';
import slide6 from '../assets/foto 3 u.jpg';
import slideNuevo1 from '../assets/slide_nuevo_1.jpg';
import slideNuevo2 from '../assets/slide_nuevo_2.jpg';
import { EmojiIcon } from '../components/ui/EmojiIcon';

const slides = [
  { title: 'Conecta con tu', highlight: 'tribu universitaria', description: 'Encuentra personas con tus mismos intereses y arma el parche perfecto en el campus.', image: slide1, color: '#3B82F6', position: 'center' },
  { title: 'El mejor campus', highlight: 'a tu disposición', description: 'Disfruta de instalaciones modernas para estudiar y relajarte con la mejor compañía.', image: slide4, color: '#10B981', position: 'center' },
  { title: 'Momentos', highlight: 'inolvidables', description: 'Crea recuerdos que durarán toda la vida con tu grupo de amigos.', image: slideNuevo2, color: '#F43F5E', position: 'top' },
  { title: 'Descubre', highlight: 'parches increíbles', description: 'Desde sesiones de estudio hasta conciertos. Siempre hay algo para ti.', image: slide3, color: '#8B5CF6', position: 'center 20%' },
  { title: 'Experiencias', highlight: 'que transforman', description: 'Aprovecha cada rincón de la universidad para crecer personal y académicamente.', image: slide6, color: '#EC4899', position: 'center' },
  { title: 'Comunidad', highlight: 'siempre activa', description: 'Nunca te perderás de lo que está pasando gracias a nuestra red integrada.', image: slide2, color: '#06B6D4', position: 'top' },
];

const features = [
  { icon: Zap, title: 'Match por Intereses', description: 'Conecta con personas que comparten tus pasiones y estilo de vida en el campus.', gradient: GRADIENT, glow: 'rgba(59, 130, 246, 0.5)' },
  { icon: Users, title: 'Crea tu Parche', description: 'Arma planes públicos o privados, invita amigos y vive la universidad al máximo.', gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', glow: 'rgba(139, 92, 246, 0.5)' },
  { icon: Calendar, title: 'Eventos del Campus', description: 'Descubre y participa en todos los eventos universitarios en un solo lugar.', gradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)', glow: 'rgba(16, 185, 129, 0.5)' },
  { icon: Heart, title: 'Bienestar y Soporte', description: 'Tu salud mental importa. Accede a soporte emocional y recursos de bienestar 24/7.', gradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)', glow: 'rgba(2, 132, 199, 0.5)' },
];

const patriciaRarities = [
  { name: 'Tech Puppy', rarity: 'COMÚN', emoji: '🐾', description: 'Las patricias iniciales que te acompañan. Gánalas participando en parches de estudio y eventos.', border: '#06B6D4', bg: 'linear-gradient(160deg, #0C2340 0%, #0369A1 70%, #0284C7 100%)', textColor: '#A5F3FC', stars: 1, perks: ['Otorga 50 XP', 'Ayuda a subir de nivel'] },
  { name: 'Honors', rarity: 'RARO', emoji: '🎓', description: 'Destaca por tu ayuda a la comunidad o resolviendo dudas para desbloquear estas monas.', border: '#8B5CF6', bg: 'linear-gradient(160deg, #1E1B4B 0%, #4338CA 80%, #6D28D9 100%)', textColor: '#DDD6FE', stars: 2, perks: ['Otorga 200 XP', 'Acelera tu progreso'] },
  { name: 'Cerebrito', rarity: 'ÉPICO', emoji: '💡', description: 'Reconocimiento a la dedicación. Solo para los estudiantes más participativos en tutorías.', border: '#3B82F6', bg: 'linear-gradient(160deg, #0F2450 0%, #1E3A8A 60%, #1D4ED8 100%)', textColor: '#BFDBFE', stars: 3, perks: ['Otorga 500 XP', 'Impulso grande de nivel'] },
  { name: 'Leyenda ECI', rarity: 'LEGENDARIO', emoji: '👑', description: 'El nivel máximo. Monas extremadamente raras que te dan un impulso masivo de experiencia.', border: '#F59E0B', bg: 'linear-gradient(160deg, #1C1107 0%, #78350F 50%, #92400E 100%)', textColor: '#FDE68A', stars: 4, shimmer: true, perks: ['Otorga 2000 XP', 'Alcanza el nivel máximo'] }
];

const testimonials = [
  { id: 't1', name: 'Carlos M.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100', program: 'Ingeniería de Sistemas · 5to semestre', comment: 'La mejor plataforma para conectar con estudiantes de mi facultad. Encontré mi grupo de estudio y ahora compartimos recursos y nos ayudamos mutuamente.', date: 'Hace 2 días', rating: 5 },
  { id: 't2', name: 'María S.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100', program: 'Diseño Industrial · 3er semestre', comment: 'Increíble cómo patrici.a facilita la organización de eventos y parches. Ya he asistido a 5 eventos este mes.', date: 'Hace 1 semana', rating: 5 },
  { id: 't3', name: 'Andrés L.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100', program: 'Administración · 7mo semestre', comment: 'El sistema de patricias es adictivo! Me encanta desbloquear nuevas y ver mi progreso en el campus.', date: 'Hace 3 días', rating: 4 },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [currentRarityIndex, setCurrentRarityIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const isAuthenticated = false;

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    
    const featureTimer = setInterval(() => {
      setCurrentFeatureIndex(prev => (prev + 1) % features.length);
    }, 5000);
    
    const rarityTimer = setInterval(() => {
      setCurrentRarityIndex(prev => (prev + 1) % patriciaRarities.length);
    }, 7000);
    
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 8000);

    return () => {
      clearInterval(slideTimer);
      clearInterval(featureTimer);
      clearInterval(rarityTimer);
      clearInterval(testimonialTimer);
    };
  }, []);

  const nextFeature = () => setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
  const prevFeature = () => setCurrentFeatureIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));

  const nextRarity = () => setCurrentRarityIndex((prev) => (prev + 1) % patriciaRarities.length);
  const prevRarity = () => setCurrentRarityIndex((prev) => (prev === 0 ? patriciaRarities.length - 1 : prev - 1));

  const nextTestimonial = () => setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  return (
    <div className="min-h-screen transition-colors duration-500 overflow-x-hidden selection:bg-blue-500/30">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-[#0A192F]/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-sm transition-colors duration-500">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <motion.div 
            whileHover={{ rotate: 180 }} 
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 bg-white shadow-md"
          >
            <img src={logoImg} alt="patrici.a" className="w-full h-full object-cover" />
          </motion.div>
          <span className="font-bold text-xl tracking-tight transition-transform group-hover:scale-105" style={{ background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            PATRICI.A
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100/80 dark:bg-[#112240]/80 backdrop-blur-md shadow-sm text-gray-600 dark:text-gray-300 hover:scale-110 hover:shadow-md transition-all active:scale-95"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>
      
      <div className="pt-0">
        <section className="relative overflow-hidden w-full">
          <div className="relative h-[90vh] w-full">
            
            {slides.map((slide, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
                style={{ opacity: i === currentSlide ? 1 : 0 }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transform transition-transform duration-[15000ms] ease-out"
                  style={{ 
                    transform: i === currentSlide ? 'scale(1.08)' : 'scale(1)',
                    objectPosition: slide.position || 'center'
                  }}
                />
              </div>
            ))}

            <motion.div 
              className="absolute inset-0 z-0 pointer-events-none"
              animate={{
                background: `linear-gradient(to top, rgba(10,25,47,0.98) 0%, ${slides[currentSlide].color}40 40%, rgba(10,25,47,0.1) 100%)`
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden mix-blend-screen opacity-50">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full blur-[2px]"
                  style={{
                    width: Math.random() * 8 + 4 + 'px',
                    height: Math.random() * 8 + 4 + 'px',
                    background: slides[currentSlide].color,
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                  }}
                  animate={{
                    y: [0, -150, 0],
                    x: [0, Math.random() * 100 - 50, 0],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{
                    duration: Math.random() * 8 + 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 5
                  }}
                />
              ))}
            </div>
            
            <div className="absolute inset-0 px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col z-20">
              <div className="flex-1 flex flex-col justify-center mt-24 mb-4">
                <div className="max-w-5xl relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`content-${currentSlide}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-colors cursor-default">
                        <Sparkles size={14} className="text-white animate-pulse" />
                        <span className="text-white text-xs md:text-sm font-bold tracking-wide uppercase">Para estudiantes ECI</span>
                      </div>
                      
                      <h1 className="text-white mb-4 font-extrabold drop-shadow-2xl text-4xl sm:text-5xl lg:text-6xl leading-[1.1] max-w-4xl tracking-tight">
                        {slides[currentSlide].title}{' '}
                        <br className="hidden md:block" />
                        <span style={{ background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', paddingBottom: '0.1em' }}>
                          {slides[currentSlide].highlight}
                        </span>
                      </h1>
                      
                      <p className="text-white/90 mb-8 max-w-xl text-lg md:text-xl leading-relaxed font-medium drop-shadow-lg">
                        {slides[currentSlide].description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                        <button
                          onClick={() => navigate('/register')}
                          className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 flex-1 shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_10px_40px_rgba(59,130,246,0.5)] border border-white/10"
                          style={{ background: GRADIENT }}
                        >
                          Empezar ahora
                        </button>
                        <button
                          onClick={() => navigate('/login')}
                          className="px-8 py-4 rounded-2xl font-bold text-lg bg-white/5 backdrop-blur-lg text-white border border-white/30 transition-all hover:bg-white/10 active:scale-95 flex-1 shadow-lg"
                        >
                          Iniciar Sesión
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="flex gap-3 pb-2 md:pb-4">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className="h-2 rounded-full transition-all duration-700 ease-in-out hover:scale-y-150"
                    style={{
                      width: i === currentSlide ? '48px' : '12px',
                      background: i === currentSlide ? slides[currentSlide].color : 'rgba(255,255,255,0.3)',
                      boxShadow: i === currentSlide ? `0 0 10px ${slides[currentSlide].color}` : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 relative overflow-hidden bg-transparent">
          <div className="text-center mb-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-gray-900 dark:text-white mb-3 text-4xl md:text-5xl font-black tracking-tight">Todo lo que necesitas</h2>
              <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">Una plataforma diseñada para el bienestar universitario</p>
            </motion.div>
          </div>
          
          <div className="relative w-full max-w-6xl mx-auto h-[350px] md:h-[280px] z-10 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeatureIndex}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="w-full"
              >
                <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-2xl w-full rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/50 dark:border-white/10 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden group">
                  
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${features[currentFeatureIndex].glow}, transparent 70%)` }} />

                  <div className="relative">
                    <div className="absolute inset-0 rounded-3xl blur-2xl opacity-50" style={{ background: features[currentFeatureIndex].gradient }} />
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-3xl flex items-center justify-center shadow-xl border border-white/20"
                      style={{ background: features[currentFeatureIndex].gradient }}
                    >
                      {(() => {
                        const Icon = features[currentFeatureIndex].icon;
                        return <Icon size={48} color="white" className="drop-shadow-lg" />;
                      })()}
                    </motion.div>
                  </div>

                  <div className="flex-1 text-center md:text-left z-10">
                    <h3 className="text-2xl md:text-3xl text-gray-900 dark:text-white mb-4 font-bold tracking-tight">{features[currentFeatureIndex].title}</h3>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{features[currentFeatureIndex].description}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <button onClick={prevFeature} className="absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white dark:bg-[#1A2C4E] rounded-full shadow-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-800 dark:text-white z-20 hover:scale-110 hover:bg-gray-50 transition-all">
              <ChevronLeft size={28} />
            </button>
            <button onClick={nextFeature} className="absolute right-0 md:-right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white dark:bg-[#1A2C4E] rounded-full shadow-2xl border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-800 dark:text-white z-20 hover:scale-110 hover:bg-gray-50 transition-all">
              <ChevronRight size={28} />
            </button>
          </div>

          <div className="flex justify-center gap-3 mt-10 relative z-10">
             {features.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentFeatureIndex(idx)}
                  className="h-2 rounded-full transition-all duration-500 hover:scale-y-150"
                  style={{
                    width: idx === currentFeatureIndex ? '32px' : '10px',
                    background: idx === currentFeatureIndex ? GRADIENT : 'rgba(156, 163, 175, 0.4)',
                  }}
                />
             ))}
          </div>
        </section>

        <section className="px-6 py-24 bg-[#050B14] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)' }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          <div className="text-center mb-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-white mb-3 text-4xl md:text-5xl font-black tracking-tight">Colecciona Patricias</h2>
              <p className="text-lg text-blue-400 font-medium">Mientras más patricias consigas, más XP sumas para subir de nivel</p>
            </motion.div>
          </div>
          
          <div className="relative w-full max-w-6xl mx-auto h-[450px] md:h-[350px] z-10 flex items-center">
             <AnimatePresence mode="wait">
                <motion.div
                  key={currentRarityIndex}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  className="w-full"
                >
                  <div className="flex flex-col md:flex-row items-center justify-center gap-12 bg-white/5 backdrop-blur-xl w-full rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    
                    <motion.div
                        whileHover={{ scale: 1.05, rotateX: 10, rotateY: -10 }}
                        className="relative rounded-3xl overflow-hidden flex flex-col items-center flex-shrink-0 cursor-pointer"
                        style={{
                          width: 180,
                          height: 260,
                          background: patriciaRarities[currentRarityIndex].bg,
                          border: `2px solid ${patriciaRarities[currentRarityIndex].border}`,
                          boxShadow: `0 15px 40px ${patriciaRarities[currentRarityIndex].border}50, inset 0 0 20px rgba(255,255,255,0.1)`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-60" />
                        {patriciaRarities[currentRarityIndex].shimmer && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                              animation: 'shimmer 2s ease-in-out infinite',
                            }}
                          />
                        )}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                           <span className="text-[10px] font-black px-3 py-1 rounded-full shadow-lg" style={{ background: `${patriciaRarities[currentRarityIndex].border}80`, color: patriciaRarities[currentRarityIndex].textColor }}>
                             {patriciaRarities[currentRarityIndex].rarity}
                           </span>
                           <div className="flex gap-1">
                             {Array.from({ length: 4 }).map((_, idx) => (
                               <Star 
                                 key={idx} 
                                 size={12} 
                                 fill={idx < patriciaRarities[currentRarityIndex].stars ? patriciaRarities[currentRarityIndex].textColor : 'transparent'} 
                                 color={idx < patriciaRarities[currentRarityIndex].stars ? patriciaRarities[currentRarityIndex].textColor : 'rgba(255,255,255,0.4)'}
                               />
                             ))}
                           </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center w-full mt-6 z-10">
                          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                            <EmojiIcon emoji={patriciaRarities[currentRarityIndex].emoji} size={70} color="white" strokeWidth={1} />
                          </motion.div>
                        </div>
                        <div className="w-full text-center py-3 backdrop-blur-md z-10 border-t border-white/20" style={{ background: 'rgba(0,0,0,0.4)' }}>
                           <p className="text-sm font-black tracking-widest uppercase" style={{ color: patriciaRarities[currentRarityIndex].textColor }}>
                             {patriciaRarities[currentRarityIndex].name}
                           </p>
                        </div>
                    </motion.div>
                    
                    <div className="flex-1 text-center md:text-left z-10">
                      <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border shadow-inner" style={{ background: `${patriciaRarities[currentRarityIndex].border}15`, color: patriciaRarities[currentRarityIndex].textColor, borderColor: `${patriciaRarities[currentRarityIndex].border}40` }}>
                        <Award size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{patriciaRarities[currentRarityIndex].rarity} TIER</span>
                      </div>
                      <p className="text-gray-300 text-lg md:text-xl mb-6 leading-relaxed font-light">"{patriciaRarities[currentRarityIndex].description}"</p>
                      
                      <div className="space-y-3 flex flex-col items-center md:items-start">
                        {patriciaRarities[currentRarityIndex].perks.map((perk, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 w-full max-w-md bg-white/5 shadow-sm hover:bg-white/10 transition-colors cursor-default">
                            <div className="p-1.5 rounded-full" style={{ background: `${patriciaRarities[currentRarityIndex].border}30` }}>
                                <Shield size={16} color={patriciaRarities[currentRarityIndex].textColor} />
                            </div>
                            <span className="text-base text-white font-medium">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
             </AnimatePresence>
             
             <button onClick={prevRarity} className="absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 flex items-center justify-center text-white z-20 hover:scale-110 hover:bg-white/20 transition-all">
                <ChevronLeft size={28} />
             </button>
             <button onClick={nextRarity} className="absolute right-0 md:-right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 flex items-center justify-center text-white z-20 hover:scale-110 hover:bg-white/20 transition-all">
                <ChevronRight size={28} />
             </button>
          </div>
        </section>

        <section className="px-6 py-24 bg-transparent relative">
          <div className="text-center mb-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-gray-900 dark:text-white mb-3 text-4xl md:text-5xl font-black tracking-tight">Voces de la comunidad</h2>
              <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">Experiencias reales de estudiantes ECI</p>
            </motion.div>
          </div>
          
          <div className="relative w-full max-w-5xl mx-auto h-[300px] md:h-[260px] mb-16 z-10">
             <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-white dark:bg-[#112240] w-full rounded-[3rem] p-10 md:p-14 border border-gray-100 dark:border-[#233554] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                    <Quote size={120} className="absolute -top-4 -right-4 text-blue-500/5 dark:text-blue-400/5 rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110" />
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                      <div className="relative">
                        <img
                          src={testimonials[currentTestimonialIndex].avatar}
                          alt={testimonials[currentTestimonialIndex].name}
                          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-xl border-4 border-white dark:border-[#1A2C4E]"
                        />
                      </div>
                      
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                          {[...Array(testimonials[currentTestimonialIndex].rating)].map((_, i) => (
                            <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic mb-6">
                          "{testimonials[currentTestimonialIndex].comment}"
                        </p>
                        <div>
                          <p className="font-bold text-lg text-gray-900 dark:text-white">{testimonials[currentTestimonialIndex].name}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{testimonials[currentTestimonialIndex].program}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
             </AnimatePresence>
             
             <button onClick={prevTestimonial} className="absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white dark:bg-[#1A2C4E] rounded-full shadow-xl border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-800 dark:text-white z-20 hover:scale-110 transition-transform">
                <ChevronLeft size={28} />
             </button>
             <button onClick={nextTestimonial} className="absolute right-0 md:-right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white dark:bg-[#1A2C4E] rounded-full shadow-xl border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-800 dark:text-white z-20 hover:scale-110 transition-transform">
                <ChevronRight size={28} />
             </button>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            {isAuthenticated ? (
              <div className="bg-white dark:bg-[#112240] rounded-[2.5rem] p-8 border border-gray-100 dark:border-[#233554] shadow-xl">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="¡Comparte tu experiencia con patrici.a y gana patricias extra!"
                  className="w-full px-6 py-5 rounded-2xl bg-gray-50 dark:bg-[#0A192F] border-2 border-transparent focus:border-blue-500 text-gray-800 dark:text-white text-lg placeholder-gray-400 transition-all resize-none shadow-inner outline-none"
                  rows={3}
                />
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setNewComment('')}
                    disabled={!newComment.trim()}
                    className="px-8 py-4 rounded-2xl text-white text-lg font-bold flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    style={{ background: GRADIENT }}
                  >
                    <Send size={20} />
                    Publicar testimonio
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-[3rem] p-12 text-center md:text-left shadow-2xl relative overflow-visible group flex flex-col md:flex-row items-center justify-between min-h-[350px]">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 rounded-[3rem]" />
                
                <div className="relative z-10 md:w-2/3 pr-0 md:pr-12 flex flex-col items-center md:items-start">
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">¿Quieres ser parte de la historia?</h3>
                  <p className="text-lg md:text-xl text-blue-100 font-medium mb-8 max-w-xl text-center md:text-left">
                    Únete a la comunidad de patrici.a, comparte tus experiencias, crea parches y cambia la forma de vivir el campus.
                  </p>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-10 py-5 rounded-2xl bg-white text-blue-600 text-xl font-black transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] relative z-10"
                  >
                    Crear mi cuenta gratis
                  </button>
                </div>
                
                <div className="hidden md:block absolute right-0 bottom-0 w-[420px] translate-x-16 translate-y-10 z-20">
                  <motion.img 
                    src={mascotImg} 
                    alt="Mascota patrici.a" 
                    className="w-full h-auto drop-shadow-[0_30px_50px_rgba(0,0,0,0.4)] cursor-grab active:cursor-grabbing"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.05, rotate: -3 }}
                    whileTap={{ scale: 0.95, rotate: 5 }}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.2}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}