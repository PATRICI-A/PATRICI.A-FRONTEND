import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, ArrowRight, User, Mail, Lock, Eye, EyeOff, Check,
  Sun, Moon, Calendar, ChevronDown, ShieldCheck, RefreshCw, Send,
  AlertCircle, IdCard, BookOpen, XCircle,
  Trophy, Palette, Compass, UtensilsCrossed, Leaf, Gamepad2,
  Music, Heart, ChevronRight,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GRADIENT, PINK } from '../types/mockData';
import logoImg from '../assets/logo_nuevo_patricia.png';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import fondoClaro from '../assets/fondoClaroPATRICIA.png';
import fondoOscuro from '../assets/fondoOscuroPATRICIA.png';
import patyRegistro from '../assets/patyRegistro.png';
const TEAL  = '#06B6D4';
const GOLD  = '#F59E0B';
const interestCategories = [
  {
    id: 'sports',
    label: 'Deportes',
    icon: Trophy,
    color: '#EF4444',
    gradient: 'linear-gradient(135deg,#EF4444,#F97316)',
    options: [
      'Tenis de campo','Ajedrez','Fútbol sala masculino','Fútbol sala femenino',
      'Fútbol masculino','Fútbol femenino','Fútbol empleados',
      'Baloncesto femenino y masculino','Voleibol femenino y masculino',
      'Disco volador (Ultimate) femenino y masculino',
      'Tenis de mesa femenino y masculino','Taekwondo',
    ],
  },
  {
    id: 'arts',
    label: 'Artes & Cultura',
    icon: Palette,
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg,#8B5CF6,#EC4899)',
    options: [
      'Música en vivo','Fotografía','Cine & películas','Teatro',
      'Danza','Arte contemporáneo','Museos','Literatura',
    ],
  },
  {
    id: 'travel',
    label: 'Viajes & Aventura',
    icon: Compass,
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg,#06B6D4,#3B82F6)',
    options: [
      'Senderismo','Viajes nacionales','Viajes internacionales','Acampada',
      'Buceo','Escalada','Mochileo','Turismo de aventura',
    ],
  },
  {
    id: 'food',
    label: 'Gastronomía',
    icon: UtensilsCrossed,
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    options: [
      'Cocina internacional','Cocina local','Café & bebidas','Repostería',
      'Comida saludable','Puestos de comida callejera','Vinos & cócteles',
    ],
  },
  {
    id: 'wellness',
    label: 'Bienestar & Estilo de vida',
    icon: Leaf,
    color: '#10B981',
    gradient: 'linear-gradient(135deg,#10B981,#06B6D4)',
    options: [
      'Yoga','Meditación','Ejercicio físico','Nutrición',
      'Moda & estilo','Cuidado de la piel & belleza','Sostenibilidad & medio ambiente',
    ],
  },
  {
    id: 'digital',
    label: 'Entretenimiento Digital',
    icon: Gamepad2,
    color: '#6366F1',
    gradient: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
    options: [
      'Videojuegos','Deportes electrónicos','Anime & manga','Series en línea',
      'Audioprogramas','Creación de contenido',
    ],
  },
  {
    id: 'music',
    label: 'Música & Sonido',
    icon: Music,
    color: '#EC4899',
    gradient: 'linear-gradient(135deg,#EC4899,#F59E0B)',
    options: [
      'Pop','Rock','Hip-hop & rap','Electrónica','Reggaeton',
      'Indie','Jazz & blues','Música latina',
    ],
  },
  {
    id: 'volunteer',
    label: 'Voluntariado & Impacto Social',
    icon: Heart,
    color: '#EF4444',
    gradient: 'linear-gradient(135deg,#EF4444,#8B5CF6)',
    options: [
      'Voluntariado comunitario','Educación','Protección animal',
      'Sostenibilidad ambiental','Derechos humanos','Emprendimiento social',
    ],
  },
];
const pregradoPrograms = [
  'Ingeniería Civil',
  'Ingeniería Eléctrica',
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Ingeniería Electrónica',
  'Economía',
  'Administración de Empresas',
  'Matemáticas',
  'Ingeniería Mecánica',
  'Ingeniería Biomédica',
  'Ingeniería Ambiental',
  'Ingeniería Estadística',
  'Ingeniería de Inteligencia Artificial',
  'Ingeniería de Ciberseguridad',
  'Ingeniería en Biotecnología',
];

const EXISTING_EMAILS = [
  'test@mail.escuelaing.edu.co',
  'patricia@mail.escuelaing.edu.co',
  'demo@mail.escuelaing.edu.co',
];
const maestriaPrograms = [
  'Maestría en Ingeniería Civil',
  'Maestría en Ingeniería de Sistemas',
  'Maestría en Ingeniería Industrial',
  'Maestría en Ingeniería Mecánica',
  'Maestría en Ingeniería Eléctrica',
  'Maestría en Ingeniería Electrónica',
  'Maestría en Ingeniería Biomédica',
  'Maestría en Ciencia de Datos',
  'Maestría en Gestión de Información',
  'Maestría en Desarrollo y Gerencia Integral de Proyectos',
  'Maestría en Ciencias Actuariales',
];
const genderOptions = [
  { id: 'MALE',              label: 'Masculino',         emoji: '♂️' },
  { id: 'FEMALE',            label: 'Femenino',          emoji: '♀️' },
  { id: 'OTHER',             label: 'Otro',              emoji: '⚧️' },
  { id: 'PREFER_NOT_TO_SAY', label: 'Prefiero no decir', emoji: '🤐' },
];
const OTP_DURATION    = 600;
const MAX_ATTEMPTS    = 3;
const RESEND_COOLDOWN = 30;
const MIN_INTERESTS   = 3;
function getPasswordStrength(p: string) {
  if (!p) return { label: '', color: '#E5E7EB', pct: 0, hint: '' };
  if (p.length < 8) return { label: 'Débil', color: '#EF4444', pct: 20, hint: 'Mínimo 8 caracteres' };
  let score = 0;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score === 0) return { label: 'Regular', color: GOLD, pct: 40, hint: 'Agrega mayúsculas y números' };
  if (score === 1) return { label: 'Regular', color: GOLD, pct: 55, hint: 'Agrega mayúsculas, números y símbolos' };
  if (score === 2) return { label: 'Buena',   color: TEAL,  pct: 75, hint: 'Agrega un símbolo (!@#$) para seguridad Alta' };
  return             { label: 'Alta',    color: '#10B981', pct: 100, hint: '' };
}
function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  return `${user.slice(0, 2)}${'*'.repeat(Math.max(user.length - 2, 3))}@${domain}`;
}
function InterestCategory({
  cat, selected, onToggle, isDark,
}: {
  cat: typeof interestCategories[0];
  selected: string[];
  onToggle: (opt: string) => void;
  isDark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const catSelected = cat.options.filter(o => selected.includes(`${cat.id}::${o}`));
  const Icon = cat.icon;
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isDark ? '#112240' : 'white',
        border: catSelected.length > 0
          ? `2px solid ${cat.color}44`
          : `2px solid ${isDark ? '#233554' : '#E5E7EB'}`,
        boxShadow: catSelected.length > 0 ? `0 4px 20px ${cat.color}20` : 'none',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left transition-all"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cat.gradient }}
        >
          <Icon size={18} color="white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{cat.label}</p>
          {catSelected.length > 0 && (
            <p className="text-[10px] mt-0.5" style={{ color: cat.color }}>
              {catSelected.length} seleccionado{catSelected.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {catSelected.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ background: cat.color }}
          >
            {catSelected.length}
          </motion.div>
        )}
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-3 pb-3 pt-1 flex flex-wrap gap-2"
              style={{ borderTop: `1px solid ${isDark ? '#1E3A5F' : '#F3F4F6'}` }}
            >
              {cat.options.map(opt => {
                const key = `${cat.id}::${opt}`;
                const isOn = selected.includes(key);
                return (
                  <motion.button
                    key={opt}
                    type="button"
                    onClick={() => onToggle(key)}
                    whileTap={{ scale: 0.93 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={
                      isOn
                        ? { background: cat.gradient, color: 'white', boxShadow: `0 2px 8px ${cat.color}40` }
                        : {
                            background: isDark ? '#172A45' : '#F8FAFC',
                            color: isDark ? '#94A3B8' : '#475569',
                            border: `1px solid ${isDark ? '#233554' : '#E2E8F0'}`,
                          }
                    }
                  >
                    {isOn && <Check size={10} strokeWidth={3} />}
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export function RegisterPage() {
  const navigate = useNavigate();
  const { login, isDark, toggleTheme } = useApp();
  useEffect(() => {
    document.documentElement.dataset.page = 'auth';
    return () => { delete document.documentElement.dataset.page; };
  }, []);
  const [step, setStep] = useState(1);
  const [firstName, setFirstName]               = useState('');
  const [lastName, setLastName]                 = useState('');
  const [email, setEmail]                       = useState('');
  const [birthDate, setBirthDate]               = useState('');
  const [gender, setGender]                     = useState('');
  const [password, setPassword]                 = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [touched, setTouched]                   = useState<Record<string, boolean>>({});
  const [focused, setFocused]                   = useState('');
  const [code, setCode]               = useState(['', '', '', '', '', '']);
  const [otpTimeLeft, setOtpTimeLeft] = useState(OTP_DURATION);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpStatus, setOtpStatus]     = useState<'idle' | 'invalid' | 'expired' | 'locked'>('idle');
  const [resendCooldown, setResendCooldown] = useState(0);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [program, setProgram]           = useState('');
  const [secondProgram, setSecondProgram] = useState('');
  const [semester, setSemester]         = useState('');
  const [studentId, setStudentId]       = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [showEmailExistsModal, setShowEmailExistsModal] = useState(false);
  const pwStrength  = getPasswordStrength(password);
  const today       = new Date().toISOString().split('T')[0];
  const minBirthDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0];
  const maxBirthDate = new Date(new Date().setFullYear(new Date().getFullYear() - 15)).toISOString().split('T')[0];
  const emailValid  = email.toLowerCase().endsWith('@mail.escuelaing.edu.co');
  const birthDateValid = (() => {
    if (!birthDate) return false;
    if (birthDate > today) return false;
    if (birthDate > maxBirthDate) return false;
    if (birthDate < minBirthDate) return false;
    return true;
  })();
  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[!@#$,.]/.test(password);
  const step1Valid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    emailValid &&
    birthDateValid &&
    gender !== '' &&
    passwordValid &&
    password === confirmPassword;
  const step3Valid = program !== '' && semester !== '' && /^\d{10}$/.test(studentId);
  useEffect(() => {
    if (step !== 2 || otpTimeLeft <= 0) return;
    const t = setInterval(() => {
      setOtpTimeLeft(s => {
        if (s <= 1) { setOtpStatus('expired'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [step, otpTimeLeft]);
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown(s => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);
  useEffect(() => {
    if (!touched.firstName) return;
    setErrors(e => ({ ...e, firstName: firstName.trim().length >= 2 ? '' : 'Mínimo 2 caracteres' }));
  }, [firstName, touched.firstName]);
  useEffect(() => {
    if (!touched.lastName) return;
    setErrors(e => ({ ...e, lastName: lastName.trim().length >= 2 ? '' : 'Mínimo 2 caracteres' }));
  }, [lastName, touched.lastName]);
  useEffect(() => {
    if (!touched.email) return;
    setErrors(e => ({ ...e, email: emailValid ? '' : 'El correo debe terminar en @mail.escuelaing.edu.co' }));
  }, [email, touched.email, emailValid]);
  useEffect(() => {
    if (!touched.birthDate) return;
    if (!birthDate) {
      setErrors(e => ({ ...e, birthDate: 'Ingresa tu fecha de nacimiento' }));
    } else if (!birthDateValid) {
      if (birthDate > today) {
        setErrors(e => ({ ...e, birthDate: 'La fecha no puede ser futura' }));
      } else if (birthDate > maxBirthDate) {
        setErrors(e => ({ ...e, birthDate: 'Debes tener mínimo 15 años para registrarte' }));
      } else if (birthDate < minBirthDate) {
        setErrors(e => ({ ...e, birthDate: 'Fecha inválida' }));
      } else {
        setErrors(e => ({ ...e, birthDate: 'Debes tener mínimo 15 años para registrarte' }));
      }
    } else {
      setErrors(e => ({ ...e, birthDate: '' }));
    }
  }, [birthDate, touched.birthDate, birthDateValid, today, maxBirthDate, minBirthDate]);
  useEffect(() => {
    if (!touched.gender) return;
    setErrors(e => ({ ...e, gender: gender ? '' : 'Selecciona tu género' }));
  }, [gender, touched.gender]);
  useEffect(() => {
    if (!touched.password) return;
    setErrors(e => ({ ...e, password: password.length >= 8 ? '' : 'Mínimo 8 caracteres' }));
  }, [password, touched.password]);
  useEffect(() => {
    if (!touched.confirmPassword) return;
    setErrors(e => ({ ...e, confirmPassword: confirmPassword === password ? '' : 'Las contraseñas no coinciden' }));
  }, [confirmPassword, password, touched.confirmPassword]);
  useEffect(() => {
    if (!touched.studentId) return;
    setErrors(e => ({ ...e, studentId: /^\d{10}$/.test(studentId) ? '' : 'Debe tener exactamente 10 dígitos' }));
  }, [studentId, touched.studentId]);
  const markTouched = (field: string) => setTouched(t => ({ ...t, [field]: true }));
  const handleCodeChange = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...code]; next[idx] = digit; setCode(next);
    setOtpStatus('idle'); setErrors({});
    if (digit && idx < 5) codeRefs.current[idx + 1]?.focus();
  };
  const handleCodeKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) codeRefs.current[idx - 1]?.focus();
  };
  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted.length) return;
    const next = [...code];
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setCode(next); setOtpStatus('idle');
    codeRefs.current[Math.min(pasted.length, 5)]?.focus();
  };
  const handleResend = () => {
    if (resendCooldown > 0) return;
    setOtpTimeLeft(OTP_DURATION); setCode(['', '', '', '', '', '']);
    setOtpStatus('idle'); setOtpAttempts(0); setResendCooldown(RESEND_COOLDOWN); setErrors({});
    setTimeout(() => codeRefs.current[0]?.focus(), 50);
  };
  const handleVerifyOtp = async () => {
    if (otpStatus === 'expired') {
      setErrors({ code: 'El código ha expirado. Por favor reenvía un nuevo código.' }); return;
    }
    if (otpStatus === 'locked') {
      setErrors({ code: 'Has superado el máximo de intentos. Por favor reenvía un nuevo código.' }); return;
    }
    const full = code.join('');
    if (full.length < 6) {
      setErrors({ code: 'Ingresa los 6 dígitos del código.' }); return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);
    setOtpStatus('idle'); setErrors({});
    setStep(3);
  };
  const toggleInterest = (key: string) => {
    setSelectedInterests(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };
  const handleNext = () => {
    if (step === 1) {
      if (EXISTING_EMAILS.includes(email.toLowerCase())) {
        setShowEmailExistsModal(true);
        return;
      }
      setOtpTimeLeft(OTP_DURATION); setCode(['', '', '', '', '', '']);
      setOtpAttempts(0); setOtpStatus('idle'); setResendCooldown(0);
      setStep(2);
      setTimeout(() => codeRefs.current[0]?.focus(), 300);
    } else if (step === 3) {
      const errs: Record<string, string> = {};
      if (!program)  errs.program  = 'Selecciona tu programa';
      if (!semester) errs.semester = 'Selecciona tu semestre';
      if (!/^\d{10}$/.test(studentId)) errs.studentId = 'El código estudiantil debe tener exactamente 10 dígitos';
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setErrors({}); setStep(4);
    }
  };
  const handleBack = () => { if (step === 1) navigate('/'); else setStep(s => s - 1); };
  const handleFinish = async () => {
    if (selectedInterests.length < MIN_INTERESTS) {
      setErrors({ interests: `Selecciona al menos ${MIN_INTERESTS} intereses` }); return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    login({
      id: 'u1',
      name: `${firstName} ${lastName}`,
      email,
      avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
      faculty: program,
      semester: parseInt(semester),
      interests: selectedInterests,
      bio: '', socialImpact: 0, xp: 0, level: 1, activeParches: 0,
      streak: 0, rankFaculty: 0, monas: [],
    });
    setIsLoading(false);
    navigate('/home');
  };
  const inputBase = `w-full py-3 sm:py-3.5 rounded-xl border transition-all focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 bg-white dark:bg-[#112240]`;
  const inputBorder = (field: string, forceErr?: boolean) => {
    if (focused === field) return 'border-gray-200 dark:border-[#233554] focus:border-[#06B6D4]';
    if (touched[field] && (errors[field] || forceErr)) return 'border-red-400 focus:border-red-500';
    if (touched[field] && !errors[field] && !forceErr) return 'border-emerald-400 focus:border-emerald-500';
    return 'border-gray-200 dark:border-[#233554] focus:border-[#06B6D4]';
  };
  const steps = ['Cuenta', 'Verificación', 'Perfil', 'Intereses'];
  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col md:flex-row relative">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("${isDark ? fondoOscuro : fondoClaro}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#1A304F] shadow-md text-gray-900 dark:text-white active:scale-90 transition-transform"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        <div className="relative z-10 flex flex-col flex-1">
        <div className="px-4 sm:px-6 py-4 flex-shrink-0">
          <button onClick={handleBack} className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#1A304F] shadow-sm text-gray-900 dark:text-white active:scale-90 transition-transform">
            <ArrowLeft size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col px-4 sm:px-6 md:px-8 pb-8 w-full max-w-xl mx-auto">
          <div
            className="rounded-3xl px-6 py-5 mb-2"
            style={{
              background: isDark ? 'rgba(8,16,40,0.72)' : 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(16px)',
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(10,25,47,0.10)',
            }}
          >
          <div className="mb-5 sm:mb-6 mt-1">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                      style={
                        i + 1 <= step
                          ? { background: GRADIENT, color: 'white' }
                          : { background: isDark ? '#1A304F' : '#E5E7EB', color: '#9CA3AF' }
                      }
                    >
                      {i + 1 < step ? <Check size={12} /> : i + 1}
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-gray-900 dark:text-white text-center leading-tight">{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-1 rounded-full bg-gray-200 dark:bg-[#233554] overflow-hidden mb-3">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: i + 1 < step ? '100%' : '0%', background: GRADIENT }} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden mx-auto mb-3 bg-white shadow-lg">
                    <img src={logoImg} alt="patrici.a" className="w-full h-full object-cover" />
                  </div>
                  <h1 className="text-gray-900 dark:text-white">Crea tu cuenta</h1>
                  <p className="text-sm text-gray-900 dark:text-white">Comienza tu viaje en patrici.a</p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">Nombre</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                        <input value={firstName} onChange={e => setFirstName(e.target.value)} onFocus={() => setFocused('firstName')} onBlur={() => { setFocused(''); markTouched('firstName'); }} placeholder="Tu nombre" className={`${inputBase} pl-10 pr-4 ${inputBorder('firstName')}`} />
                        {touched.firstName && focused !== 'firstName' && !errors.firstName && firstName.trim().length >= 2 && <Check size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />}
                      </div>
                      {touched.firstName && focused !== 'firstName' && errors.firstName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">Apellidos</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                        <input value={lastName} onChange={e => setLastName(e.target.value)} onFocus={() => setFocused('lastName')} onBlur={() => { setFocused(''); markTouched('lastName'); }} placeholder="Tus apellidos" className={`${inputBase} pl-10 pr-4 ${inputBorder('lastName')}`} />
                        {touched.lastName && focused !== 'lastName' && !errors.lastName && lastName.trim().length >= 2 && <Check size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />}
                      </div>
                      {touched.lastName && focused !== 'lastName' && errors.lastName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">Correo institucional</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocused('email')} onBlur={() => { setFocused(''); markTouched('email'); }} placeholder="usuario@mail.escuelaing.edu.co" className={`${inputBase} pl-10 pr-4 text-sm ${inputBorder('email')}`} />
                      {touched.email && focused !== 'email' && emailValid && <Check size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />}
                    </div>
                    {touched.email && focused !== 'email' && errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.email}</p>}
                    <p className="text-[10px] text-gray-600 dark:text-gray-200 mt-1">Solo correos @mail.escuelaing.edu.co</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">Fecha de nacimiento</label>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
                        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} onFocus={() => setFocused('birthDate')} onBlur={() => { setFocused(''); markTouched('birthDate'); }} min={minBirthDate} max={maxBirthDate} className={`${inputBase} pl-10 pr-2 ${inputBorder('birthDate')}`} />
                      </div>
                      {touched.birthDate && focused !== 'birthDate' && errors.birthDate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.birthDate}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">Género</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {genderOptions.map(opt => (
                          <button key={opt.id} type="button" onClick={() => { setGender(opt.id); markTouched('gender'); }}
                            className="flex items-center gap-1.5 px-2 py-2 rounded-xl border-2 transition-all text-left"
                            style={gender === opt.id ? { borderColor: TEAL, background: 'rgba(6,182,212,0.08)' } : { borderColor: isDark ? '#233554' : '#E5E7EB', background: isDark ? '#112240' : 'white' }}
                          >
                            <EmojiIcon emoji={opt.emoji} size={12} color={gender === opt.id ? TEAL : (isDark ? '#9CA3AF' : '#6B7280')} strokeWidth={2} />
                            <span className="text-[11px] font-medium truncate" style={{ color: gender === opt.id ? TEAL : (isDark ? '#D1D5DB' : '#374151') }}>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                      {touched.gender && errors.gender && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.gender}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">Contraseña</label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocused('password')} onBlur={() => { setFocused(''); markTouched('password'); }} placeholder="Mín. 8 caracteres" className={`${inputBase} pl-10 pr-9 ${inputBorder('password')}`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                      </div>
                      {touched.password && focused !== 'password' && errors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.password}</p>}
                      {password.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-[#1A304F] overflow-hidden mb-2">
                            <motion.div className="h-full rounded-full transition-all duration-300" initial={{ width: 0 }} animate={{ width: `${pwStrength.pct}%` }} style={{ background: pwStrength.color }} />
                          </div>
                          {[
                            { ok: password.length >= 8,         text: 'Mínimo 8 caracteres' },
                            { ok: /[A-Z]/.test(password),       text: 'Mínimo una mayúscula' },
                            { ok: /[!@#$,.]/.test(password),    text: 'Mínimo un caracter especial (!@#$,.)' },
                          ].map(r => (
                            <p key={r.text} className={`text-[10px] flex items-center gap-1.5 ${r.ok ? 'text-emerald-500' : 'text-gray-400 dark:text-white/70'}`}>
                              {r.ok
                                ? <Check size={9} strokeWidth={3} />
                                : <span className="w-2 h-2 rounded-full border border-current flex-shrink-0" />}
                              {r.text}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">Confirmar contraseña</label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                        <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onFocus={() => setFocused('confirmPassword')} onBlur={() => { setFocused(''); markTouched('confirmPassword'); }} placeholder="Repite tu contraseña" className={`${inputBase} pl-10 pr-9 ${inputBorder('confirmPassword')}`} />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">{showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                      </div>
                      {confirmPassword.length > 0 && focused !== 'confirmPassword' && confirmPassword !== password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />No coinciden</p>}
                      {confirmPassword.length > 0 && focused !== 'confirmPassword' && confirmPassword === password && password.length >= 8 && <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1"><Check size={10} />Coinciden</p>}
                    </div>
                  </div>
                </div>
                <div className="mt-8 space-y-3">
                  <motion.button
                    onClick={handleNext} disabled={!step1Valid} whileTap={step1Valid ? { scale: 0.97 } : {}}
                    className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-lg"
                    style={{ background: step1Valid ? GRADIENT : (isDark ? '#1E3A5F' : '#CBD5E1'), opacity: step1Valid ? 1 : 0.6, cursor: step1Valid ? 'pointer' : 'not-allowed' }}
                  >
                    Continuar <ArrowRight size={18} />
                  </motion.button>
                  <p className="text-center text-sm text-gray-900 dark:text-white">
                    ¿Ya tienes cuenta?{' '}
                    <button onClick={() => navigate('/login')} className="font-semibold" style={{ color: PINK }}>Iniciar Sesión</button>
                  </p>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: GRADIENT, boxShadow: '0 8px 24px rgba(6,182,212,0.35)' }}>
                    <ShieldCheck size={28} color="white" strokeWidth={2} />
                  </div>
                  <h1 className="text-gray-900 dark:text-white">Verifica tu correo</h1>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">Enviamos un código de 6 dígitos a</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: TEAL }}>{maskEmail(email)}</p>
                </div>
                <div className="flex justify-center mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                    style={{
                      background: otpStatus === 'expired' ? 'rgba(239,68,68,0.1)' : otpTimeLeft > 60 ? 'rgba(6,182,212,0.1)' : 'rgba(245,158,11,0.1)',
                      color: otpStatus === 'expired' ? '#EF4444' : otpTimeLeft > 60 ? TEAL : GOLD,
                      border: `1px solid ${otpStatus === 'expired' ? 'rgba(239,68,68,0.3)' : otpTimeLeft > 60 ? 'rgba(6,182,212,0.3)' : 'rgba(245,158,11,0.3)'}`,
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: otpStatus === 'expired' ? '#EF4444' : otpTimeLeft > 60 ? TEAL : GOLD }} />
                    {otpStatus === 'expired' ? 'Código expirado' : `Código válido por ${formatTime(otpTimeLeft)}`}
                  </div>
                </div>
                {otpAttempts > 0 && otpStatus !== 'locked' && (
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(245,158,11,0.1)', color: GOLD, border: '1px solid rgba(245,158,11,0.3)' }}>
                      <AlertCircle size={12} />Intentos restantes: {MAX_ATTEMPTS - otpAttempts}
                    </div>
                  </div>
                )}
                <div className="flex gap-1.5 sm:gap-2.5 justify-center mb-4 px-1">
                  {code.map((digit, i) => (
                    <input key={i} ref={el => { codeRefs.current[i] = el; }}
                      value={digit} onChange={e => handleCodeChange(e.target.value, i)}
                      onKeyDown={e => handleCodeKeyDown(e, i)} onPaste={handleCodePaste}
                      maxLength={1} inputMode="numeric"
                      disabled={otpStatus === 'locked' || otpStatus === 'expired'}
                      className="text-center rounded-xl border-2 font-black transition-all focus:outline-none disabled:opacity-50"
                      style={{
                        flex: '1 1 0',
                        minWidth: 0,
                        maxWidth: 56,
                        height: 52,
                        fontSize: 20,
                        background: isDark ? '#112240' : 'white',
                        borderColor: otpStatus === 'invalid' || otpStatus === 'locked' ? '#EF4444' : digit ? TEAL : isDark ? '#233554' : '#E5E7EB',
                        color: isDark ? 'white' : '#111827',
                        boxShadow: digit ? `0 0 0 3px ${TEAL}22` : 'none',
                      }}
                    />
                  ))}
                </div>
                {errors.code && (
                  <div className="flex items-center gap-2 justify-center mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <XCircle size={14} className="text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.code}</p>
                  </div>
                )}
                <div className="text-center mb-4">
                  {resendCooldown > 0 ? (
                    <p className="text-xs text-gray-700 dark:text-gray-400">Puedes reenviar en <span className="font-semibold" style={{ color: TEAL }}>{resendCooldown}s</span></p>
                  ) : (
                    <button type="button" onClick={handleResend} className="flex items-center gap-1.5 mx-auto text-sm font-semibold active:scale-95" style={{ color: TEAL }}>
                      <RefreshCw size={13} />Reenviar código
                    </button>
                  )}
                </div>
                <div className="p-3 rounded-xl text-xs text-gray-700 dark:text-gray-400" style={{ background: isDark ? '#112240' : '#F0F7FF' }}>
                  <p className="flex items-start gap-2">
                    <Send size={12} className="mt-0.5 flex-shrink-0" style={{ color: TEAL }} />
                    Revisa tu carpeta de spam. El código es válido por 10 minutos y tienes 3 intentos.
                  </p>
                </div>
                <div className="mt-6">
                  <motion.button onClick={handleVerifyOtp} disabled={isLoading || otpStatus === 'locked'} whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                    style={{ background: otpStatus === 'locked' ? '#6B7280' : GRADIENT }}
                  >
                    {isLoading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verificando...</> : <><ShieldCheck size={18} />Verificar código</>}
                  </motion.button>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1">
                <div className="mb-6">
                  <h1 className="text-gray-900 dark:text-white">Tu perfil académico</h1>
                  <p className="text-sm text-gray-900 dark:text-white">Ayúdanos a conectarte mejor</p>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Carrera</label>
                    <div className="relative">
                      <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none z-10" />
                      <select
                        value={program}
                        onChange={e => setProgram(e.target.value)}
                        className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white focus:outline-none focus:border-[#06B6D4] transition-all appearance-none"
                      >
                        <option value="">Selecciona tu carrera</option>
                        {pregradoPrograms.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
                    </div>
                    {errors.program && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.program}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                      Segunda carrera <span className="text-gray-500 font-normal">(opcional)</span>
                    </label>
                    <div className="relative">
                      <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none z-10" />
                      <select
                        value={secondProgram}
                        onChange={e => setSecondProgram(e.target.value)}
                        className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white focus:outline-none focus:border-[#06B6D4] transition-all appearance-none"
                      >
                        <option value="">Ninguna</option>
                        {pregradoPrograms.filter(p => p !== program).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Semestre actual</label>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(s => (
                        <button key={s} type="button" onClick={() => setSemester(String(s))}
                          className="py-2.5 sm:py-3 rounded-xl font-medium text-sm transition-all"
                          style={semester === String(s) ? { background: GRADIENT, color: 'white' } : { background: isDark ? '#172A45' : '#EFF6FF', color: isDark ? '#9CA3AF' : '#0A192F' }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {errors.semester && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.semester}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Código estudiantil</label>
                    <div className="relative">
                      <IdCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                      <input value={studentId} onChange={e => setStudentId(e.target.value.replace(/\D/g, '').slice(0, 10))} onBlur={() => markTouched('studentId')} placeholder="Ej: 2023123456" inputMode="numeric" maxLength={10}
                        className={`${inputBase} pl-10 pr-4 ${inputBorder('studentId', touched.studentId && !/^\d{10}$/.test(studentId))}`}
                      />
                      {/^\d{10}$/.test(studentId) && <Check size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />}
                    </div>
                    <div className="flex justify-between mt-1">
                      {touched.studentId && errors.studentId ? <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.studentId}</p> : <span />}
                      <span className={`text-[10px] ml-auto ${studentId.length === 10 ? 'text-emerald-500' : 'text-gray-600 dark:text-gray-200'}`}>{studentId.length}/10</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <motion.button onClick={handleNext} disabled={!step3Valid} whileTap={step3Valid ? { scale: 0.97 } : {}}
                    className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg"
                    style={{ background: step3Valid ? GRADIENT : (isDark ? '#1E3A5F' : '#CBD5E1'), opacity: step3Valid ? 1 : 0.6, cursor: step3Valid ? 'pointer' : 'not-allowed' }}
                  >
                    Continuar <ArrowRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1">
                <div className="mb-5">
                  <h1 className="text-gray-900 dark:text-white">¿Qué te apasiona?</h1>
                  <p className="text-sm text-gray-900 dark:text-white">Explora las categorías y elige lo que más te gusta</p>
                </div>
                <div className="sticky top-0 z-10 mb-4">
                  <div
                    className="rounded-2xl p-3 flex items-center justify-between backdrop-blur-sm"
                    style={{
                      background: isDark ? 'rgba(17,34,64,0.95)' : 'rgba(240,247,255,0.95)',
                      border: `1px solid ${selectedInterests.length >= MIN_INTERESTS ? `${TEAL}44` : (isDark ? '#233554' : '#E5E7EB')}`,
                      boxShadow: selectedInterests.length >= MIN_INTERESTS ? `0 4px 20px ${TEAL}20` : '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {selectedInterests.length >= MIN_INTERESTS ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: GRADIENT }}>
                          <Check size={14} color="white" strokeWidth={3} />
                        </motion.div>
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: isDark ? '#172A45' : '#E5E7EB' }}>
                          <Heart size={14} className="text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                          {selectedInterests.length >= MIN_INTERESTS ? '¡Listo para continuar!' : `Selecciona al menos ${MIN_INTERESTS}`}
                        </p>
                        <p className="text-[10px] text-gray-600 dark:text-gray-200">
                          {selectedInterests.length} seleccionado{selectedInterests.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: MIN_INTERESTS }, (_, i) => (
                        <motion.div
                          key={i}
                          className="rounded-full transition-all duration-300"
                          animate={{
                            width: i < selectedInterests.length ? 20 : 8,
                            background: i < selectedInterests.length ? TEAL : (isDark ? '#233554' : '#E5E7EB'),
                          }}
                          style={{ height: 8 }}
                        />
                      ))}
                      {selectedInterests.length > MIN_INTERESTS && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: `${TEAL}22`, color: TEAL }}
                        >
                          +{selectedInterests.length - MIN_INTERESTS}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
                {errors.interests && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.interests}</p>
                  </div>
                )}
                <div className="space-y-3">
                  {interestCategories.map((cat, idx) => {
                    const catCount = cat.options.filter(o => selectedInterests.includes(`${cat.id}::${o}`)).length;
                    return (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <InterestCategory
                          cat={cat}
                          selected={selectedInterests}
                          onToggle={toggleInterest}
                          isDark={isDark}
                        />
                      </motion.div>
                    );
                  })}
                </div>
                {selectedInterests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 p-4 rounded-2xl"
                    style={{ background: isDark ? '#112240' : '#F0F9FF', border: `1px solid ${TEAL}33` }}
                  >
                    <p className="text-xs font-semibold mb-2" style={{ color: TEAL }}>Tus intereses seleccionados</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInterests.map(key => {
                        const [catId, opt] = key.split('::');
                        const cat = interestCategories.find(c => c.id === catId);
                        return (
                          <motion.button
                            key={key}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            onClick={() => toggleInterest(key)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium text-white"
                            style={{ background: cat?.gradient ?? GRADIENT }}
                          >
                            {opt}
                            <XCircle size={10} />
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
                <div className="mt-6 space-y-3">
                  <motion.button
                    onClick={handleFinish}
                    disabled={isLoading || selectedInterests.length < MIN_INTERESTS}
                    whileTap={selectedInterests.length >= MIN_INTERESTS ? { scale: 0.97 } : {}}
                    className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 transition-all"
                    style={{
                      background: selectedInterests.length >= MIN_INTERESTS ? GRADIENT : (isDark ? '#1E3A5F' : '#CBD5E1'),
                      cursor: selectedInterests.length >= MIN_INTERESTS ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {isLoading ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creando tu cuenta...</>
                    ) : (
                      <>
                        <Check size={18} />
                        Finalizar registro
                        {selectedInterests.length > 0 && (
                          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
                            {selectedInterests.length}
                          </span>
                        )}
                      </>
                    )}
                  </motion.button>
                  <p className="text-center text-sm text-gray-900 dark:text-white">
                    ¿Ya tienes cuenta?{' '}
                    <button onClick={() => navigate('/login')} className="font-semibold" style={{ color: PINK }}>Iniciar Sesión</button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
          </div>
        </div>
        </div>
      </div>

      <div className="hidden md:flex md:w-5/12 flex-col items-center justify-center sticky top-0 h-screen flex-shrink-0 z-10" style={{ pointerEvents: 'none' }}>
        <img src={patyRegistro} alt="Paty" className="w-auto object-contain drop-shadow-2xl" style={{ maxHeight: '70vh' }} />
      </div>

      <AnimatePresence>
        {showEmailExistsModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowEmailExistsModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-50 rounded-3xl p-6 shadow-2xl"
              style={{ background: isDark ? '#0D1B2E' : 'white', border: `1px solid ${isDark ? '#1E3A5F' : 'rgba(10,25,47,0.08)'}` }}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                  <Mail size={26} className="text-red-500" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-black text-lg">Correo ya registrado</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  El correo <span className="font-semibold text-gray-700 dark:text-gray-300">{email}</span> ya está asociado a una cuenta en PATRICI.A.
                </p>
                <div className="flex flex-col gap-2 w-full mt-2">
                  <button
                    onClick={() => { setShowEmailExistsModal(false); navigate('/login'); }}
                    className="w-full py-3 rounded-2xl text-white font-semibold text-sm"
                    style={{ background: GRADIENT }}
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={() => setShowEmailExistsModal(false)}
                    className="w-full py-3 rounded-2xl text-sm font-medium text-gray-600 dark:text-gray-300"
                    style={{ background: isDark ? '#1A304F' : '#F3F4F6' }}
                  >
                    Usar otro correo
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}