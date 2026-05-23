import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sun, Moon, Calendar } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GRADIENT, PINK } from '../types/mockData';
import { authService } from '../services/auth.service';
import logoImg from '../assets/logo_nuevo_patricia.png';
import patiLoginImg from '../assets/pati-login.png';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import fondoClaro from '../assets/fondoClaroPATRICIA.png';
import fondoOscuro from '../assets/fondoOscuroPATRICIA.png';
export function LoginPage() {
  const navigate = useNavigate();
  const { login, isDark, toggleTheme } = useApp();
  useEffect(() => {
    document.documentElement.dataset.page = 'auth';
    return () => { delete document.documentElement.dataset.page; };
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const emailValid = email.toLowerCase().endsWith('@mail.escuelaing.edu.co') && email.includes('@');
  const emailHintColor = !emailTouched || email.length === 0 ? (isDark ? 'text-gray-400' : 'text-gray-600') : emailValid ? (isDark ? 'text-green-400' : 'text-green-700') : 'text-red-400';
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    if (!emailValid) {
      setError('Debes usar tu correo institucional (@mail.escuelaing.edu.co)');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const data = await authService.login({ email, password });
      const u = data.user as any;
      if (u?.role === 'ORGANIZADOR') {
        localStorage.setItem('organizerSession', JSON.stringify({ email, name: u.name ?? email.split('@')[0], role: 'ORGANIZADOR' }));
        navigate('/organizer/dashboard');
        return;
      }
      login({
        id: u?.id ?? u?.userId ?? 'u1',
        name: u?.name ?? u?.fullName ?? email.split('@')[0],
        email: u?.email ?? email,
        avatar: u?.avatar ?? u?.profilePicture ?? '',
        faculty: u?.faculty ?? u?.facultad ?? '',
        program: u?.program ?? u?.programa ?? '',
        semester: u?.semester ?? u?.semestre ?? 1,
        interests: u?.interests ?? u?.intereses ?? [],
        bio: u?.bio ?? '',
        socialImpact: u?.socialImpact ?? 0,
        xp: u?.xp ?? 0,
        level: u?.level ?? 1,
        activeParches: u?.activeParches ?? 0,
        streak: u?.streak ?? 0,
        rankFaculty: u?.rankFaculty ?? 0,
        monas: u?.monas ?? [],
      });
      navigate('/home');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        setError('Correo o contraseña incorrectos');
      } else if (status === 404) {
        setError('Usuario no encontrado');
      } else if (status === 0 || !status) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        setError('Ocurrió un error. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col relative">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("${isDark ? fondoOscuro : fondoClaro}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />
      {}
      <div className="relative flex flex-col flex-1" style={{ zIndex: 1 }}>
      {}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#112240] shadow-sm text-gray-800 dark:text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#112240] shadow-sm text-gray-800 dark:text-white"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 pb-8 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center w-full"
        >
          <div className="order-1 lg:order-2">
            <div className="rounded-[2rem] bg-white/90 dark:bg-[#0f172a]/90 shadow-2xl border border-gray-200 dark:border-[#1E3A5F] p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden mx-auto mb-4 bg-white shadow-lg">
                  <img src={logoImg} alt="patrici.a" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-gray-900 dark:text-white mb-1">Bienvenido de vuelta</h1>
                <p className="text-sm text-gray-800 dark:text-white">Conecta con tu comunidad universitaria</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Correo Institucional
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="nombre@mail.escuelaing.edu.co"
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-white dark:bg-[#112240] border text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        emailTouched && email.length > 0
                          ? emailValid
                            ? 'border-green-400 focus:border-green-500'
                            : 'border-red-400 focus:border-red-500'
                          : 'border-gray-200 dark:border-[#233554]'
                      }`}
                      style={{ '--tw-ring-color': PINK } as any}
                    />
                  </div>
                  {email.length > 0 && !emailValid ? (
                    <p className={`text-xs mt-1.5 transition-colors ${emailHintColor}`}>
                      ✗ Debe terminar en{' '}
                      <span className="font-medium">@mail.escuelaing.edu.co</span>
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="text-right mt-1">
                    <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs font-medium" style={{ color: isDark ? '#F59E0B' : PINK }}>
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg mt-2"
                  style={{ background: GRADIENT }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>
              <p className="text-center text-sm text-gray-800 dark:text-white mt-8">
                ¿Aún no tienes una cuenta?{' '}
                <button onClick={() => navigate('/register')} className="font-semibold" style={{ color: isDark ? '#F59E0B' : PINK }}>
                  Regístrate aquí
                </button>
              </p>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#1E3A5F] space-y-2">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="w-full text-xs text-gray-700 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Lock size={12} />
                  Acceso de administrador
                </button>
                <div className="text-center">
                  <p className="text-xs text-gray-700 dark:text-gray-400">
                    <Calendar size={12} className="inline mr-1" />
                    Organizadores de eventos: usen sus credenciales institucionales
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-2 lg:order-1 flex justify-center">
            <img
              src={patiLoginImg}
              alt="Patricia Login"
              className="w-full max-w-md rounded-[2rem] object-cover bg-transparent"
            />
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}