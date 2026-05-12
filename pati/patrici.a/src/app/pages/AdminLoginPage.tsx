import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, Mail, ShieldCheck, AlertCircle, Sun, Moon } from 'lucide-react';
import { GRADIENT, PINK, ORANGE } from '../data/mockData';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import { useApp } from '../context/AppContext';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useApp();
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation for admin access
    if (email === 'admin@admin.com' && password.length > 0) {
      // Store admin session
      localStorage.setItem('adminSession', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Credenciales de administrador inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A192F] relative flex items-center justify-center p-5">
      <DoodleBackground isDark={isDark} opacity={0.5} />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 w-10 h-10 rounded-full bg-white dark:bg-[#112240] shadow-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:scale-110 transition-transform z-50"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Admin Badge */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: GRADIENT, boxShadow: '0 8px 32px rgba(29,78,216,0.4)' }}
          >
            <ShieldCheck size={40} className="text-white" />
          </motion.div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            patrici.a
          </h1>
          <p className="text-sm font-semibold" style={{ color: PINK }}>
            PANEL DE ADMINISTRACIÓN
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Acceso restringido para administradores
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#112240] rounded-2xl p-6 shadow-xl">
          {/* Info Banner */}
          <div
            className="flex items-start gap-3 p-3 rounded-xl mb-6"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}
          >
            <AlertCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Acceso de administrador habilitado para este flujo
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Use las credenciales de administrador para acceder al panel de control
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                Correo de Administrador
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@admin.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A2F4A] border border-gray-200 dark:border-[#233554] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2"
              style={{ background: GRADIENT }}
            >
              <ShieldCheck size={18} />
              Acceder al Panel
            </motion.button>
          </form>

          {/* Back to App */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#1E3A5F]">
            <button
              onClick={() => navigate('/login')}
              className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              ← Volver al inicio de sesión de usuario
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          Este acceso está protegido y monitoreado
        </p>
      </motion.div>
    </div>
  );
}
