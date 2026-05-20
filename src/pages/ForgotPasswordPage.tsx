import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Mail, Lock, Eye, EyeOff, Check, AlertCircle,
  Sun, Moon, Send, RefreshCw, ShieldCheck, XCircle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GRADIENT, PINK } from '../types/mockData';
import fondoClaro from '../assets/fondoClaroPATRICIA.png';
import fondoOscuro from '../assets/fondoOscuroPATRICIA.png';
import patiContrasena from '../assets/Pati-Contrasena.png';
const TEAL  = '#06B6D4';
const GOLD  = '#F59E0B';
const OTP_DURATION     = 600;
const RESEND_COOLDOWN  = 30;
const MAX_SEND_ATTEMPTS = 3;
const SEND_BLOCK_SECS   = 120;
function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function getStrength(p: string) {
  if (!p) return { label: '', color: '#E5E7EB', pct: 0 };
  if (p.length < 8) return { label: 'Débil', color: '#EF4444', pct: 25 };
  if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Regular', color: GOLD, pct: 55 };
  if (/[^A-Za-z0-9]/.test(p)) return { label: 'Excelente', color: '#10B981', pct: 100 };
  return { label: 'Buena', color: TEAL, pct: 80 };
}
export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useApp();
  const [phase, setPhase] = useState<'email' | 'reset' | 'success'>('email');
  const [email, setEmail]       = useState('');
  const [sendLoading, setSendLoading]   = useState(false);
  const [sendAttempts, setSendAttempts] = useState(0);
  const [blockCooldown, setBlockCooldown] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [code, setCode]           = useState(['', '', '', '', '', '']);
  const [otpTimeLeft, setOtpTimeLeft] = useState(OTP_DURATION);
  const [otpExpired, setOtpExpired]   = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [newPassword, setNewPassword]       = useState('');
  const [confirmPwd, setConfirmPwd]         = useState('');
  const [showNew, setShowNew]               = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [codeError, setCodeError]           = useState('');
  const [resetLoading, setResetLoading]     = useState(false);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);
  const emailValid = email.toLowerCase().endsWith('@mail.escuelaing.edu.co') && email.includes('@');
  const strength   = getStrength(newPassword);
  const codeStr    = code.join('');
  const codeValid  = /^\d{6}$/.test(codeStr);
  const pwdMatch   = newPassword === confirmPwd && newPassword.length >= 8;
  const resetValid = codeValid && pwdMatch && !otpExpired;
  useEffect(() => {
    if (blockCooldown <= 0) return;
    const t = setInterval(() => setBlockCooldown(s => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [blockCooldown]);
  useEffect(() => {
    if (phase !== 'reset' || otpTimeLeft <= 0) return;
    const t = setInterval(() => {
      setOtpTimeLeft(s => {
        if (s <= 1) { setOtpExpired(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, otpTimeLeft]);
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown(s => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);
  const handleSend = async () => {
    if (!emailValid || sendLoading || blockCooldown > 0) return;
    setSendLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSendLoading(false);
    const nextAttempts = sendAttempts + 1;
    setSendAttempts(nextAttempts);
    setStatusMsg('Si existe una cuenta asociada a ese correo, hemos enviado instrucciones para restablecer la contraseña.');
    if (nextAttempts >= MAX_SEND_ATTEMPTS) {
      setBlockCooldown(SEND_BLOCK_SECS);
    }
    setPhase('reset');
    setOtpTimeLeft(OTP_DURATION);
    setOtpExpired(false);
    setResendCooldown(RESEND_COOLDOWN);
    setTimeout(() => codeRefs.current[0]?.focus(), 300);
  };
  const handleResend = () => {
    if (resendCooldown > 0) return;
    setCode(['', '', '', '', '', '']);
    setOtpTimeLeft(OTP_DURATION);
    setOtpExpired(false);
    setCodeError('');
    setResendCooldown(RESEND_COOLDOWN);
    setTimeout(() => codeRefs.current[0]?.focus(), 50);
  };
  const handleCodeChange = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...code]; next[idx] = digit; setCode(next);
    setCodeError('');
    if (digit && idx < 5) codeRefs.current[idx + 1]?.focus();
  };
  const handleCodeKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) codeRefs.current[idx - 1]?.focus();
  };
  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...code];
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setCode(next);
    setCodeError('');
    codeRefs.current[Math.min(pasted.length, 5)]?.focus();
  };
  const handleReset = async () => {
    if (!resetValid || resetLoading) return;
    if (otpExpired) { setCodeError('El código ha expirado. Solicita uno nuevo.'); return; }
    if (!codeValid) { setCodeError('Código incorrecto.'); return; }
    setResetLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setResetLoading(false);
    setPhase('success');
  };
  const handleBack = () => {
    if (phase === 'reset') { setPhase('email'); return; }
    navigate('/login');
  };
  const inputBase = `w-full py-3.5 rounded-xl border transition-all focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 bg-white dark:bg-[#112240]`;
  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col relative md:justify-center">
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
      <div className="mx-auto w-full max-w-6xl relative" style={{ zIndex: 1 }}>
        <div className="grid md:grid-cols-2 items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden md:flex justify-center md:justify-start"
          >
            <div className="w-full max-w-[460px] lg:max-w-[820px] xl:max-w-[920px] bg-transparent">
              <img
                src={patiContrasena}
                alt="Patricia ilustración de contraseña"
                className="w-full h-auto object-contain bg-transparent drop-shadow-none"
              />
            </div>
          </motion.div>
          <div className="relative w-full mx-auto md:max-w-md md:my-0 md:rounded-3xl md:shadow-2xl md:overflow-hidden flex flex-col min-h-screen md:min-h-0 dark:bg-[#0D1F3C] md:bg-white/80 md:backdrop-blur-sm md:dark:bg-[#112240] transition-colors duration-300" style={{ zIndex: 1 }}>
        {}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0">
          <button
            onClick={handleBack}
            aria-label="Volver"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#1A304F] shadow-sm text-gray-500 dark:text-gray-400 active:scale-90 transition-transform"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#1A304F] shadow-sm text-gray-500 dark:text-gray-400 active:scale-90 transition-transform"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        {}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 md:px-8 pb-10 w-full">
            <AnimatePresence mode="wait">
              {}
              {phase === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  {}
                  <div className="mb-8 mt-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-left">
                        <h1 className="text-gray-900 dark:text-white">Olvidé mi contraseña</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                          Ingresa tu correo institucional y te enviaremos instrucciones para restablecerla.
                        </p>
                        </div>
                    </div>
                  </div>
                  {}
                  <div className="mb-5">
                    <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Correo institucional
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="fp-email"
                        type="email"
                        autoFocus
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="tu.nombre@mail.escuelaing.edu.co"
                        className={`${inputBase} pl-10 pr-10 ${
                          email.length > 0 && !emailValid
                            ? 'border-red-400 focus:border-red-500'
                            : email.length > 0 && emailValid
                            ? 'border-emerald-400 focus:border-emerald-500'
                            : 'border-gray-200 dark:border-[#233554] focus:border-[#06B6D4]'
                        }`}
                        aria-describedby="fp-email-error"
                      />
                    </div>
                    <div id="fp-email-error" aria-live="polite" className="mt-1 min-h-[18px]" />
                    {}
                    <p className="mt-1.5 text-[11px] transition-colors duration-200"
                      style={{
                        color: email.length === 0
                          ? (isDark ? '#6B7280' : '#9CA3AF')
                          : emailValid
                          ? '#10B981'
                          : '#EF4444',
                      }}
                    >
                      {email.length > 0 && !emailValid ? '✗ ' : ''}
                      {email.length > 0 && !emailValid ? (
                        <>
                          Debe terminar en <span className="font-medium">@mail.escuelaing.edu.co</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                  {}
                  {sendAttempts >= 2 && sendAttempts < MAX_SEND_ATTEMPTS && blockCooldown === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 rounded-xl flex items-center gap-2"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}
                    >
                      <AlertCircle size={13} style={{ color: GOLD }} className="flex-shrink-0" />
                      <p className="text-xs font-medium" style={{ color: GOLD }}>
                        Último intento disponible antes del bloqueo temporal.
                      </p>
                    </motion.div>
                  )}
                  {}
                  {blockCooldown > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 rounded-xl flex items-center gap-2"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
                      aria-live="polite"
                    >
                      <XCircle size={13} className="text-red-500 flex-shrink-0" />
                      <p className="text-xs font-medium text-red-500">
                        Demasiados intentos. Espera <span className="font-bold">{formatTime(blockCooldown)}</span> para continuar.
                      </p>
                    </motion.div>
                  )}
                  {}
                  <motion.button
                    onClick={handleSend}
                    disabled={!emailValid || sendLoading || blockCooldown > 0}
                    whileTap={emailValid && !sendLoading && blockCooldown === 0 ? { scale: 0.97 } : {}}
                    className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg transition-all"
                    style={{
                      background: emailValid && blockCooldown === 0 ? GRADIENT : (isDark ? '#1E3A5F' : '#CBD5E1'),
                      opacity: emailValid && !sendLoading && blockCooldown === 0 ? 1 : 0.65,
                      cursor: emailValid && !sendLoading && blockCooldown === 0 ? 'pointer' : 'not-allowed',
                    }}
                    aria-busy={sendLoading}
                  >
                    {sendLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando…
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Enviar instrucciones
                      </>
                    )}
                  </motion.button>
                  <p className="text-center text-sm text-gray-400 mt-6">
                    ¿Recordaste tu contraseña?{' '}
                    <button onClick={() => navigate('/login')} className="font-semibold" style={{ color: PINK }}>
                      Iniciar sesión
                    </button>
                  </p>
                </motion.div>
              )}
              {}
              {phase === 'reset' && (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  {}
                  <div className="text-center mb-6 mt-2">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: GRADIENT }}>
                      <ShieldCheck size={28} color="white" strokeWidth={2} />
                    </div>
                    <h1 className="text-gray-900 dark:text-white">Restablecer contraseña</h1>
                    {}
                    {statusMsg && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs mt-2 px-4 leading-relaxed"
                        style={{ color: TEAL }}
                        aria-live="polite"
                      >
                        {statusMsg}
                      </motion.p>
                    )}
                  </div>
                  {}
                  <div className="flex justify-center mb-5">
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                      style={{
                        background: otpExpired ? 'rgba(239,68,68,0.1)' : otpTimeLeft > 60 ? 'rgba(6,182,212,0.1)' : 'rgba(245,158,11,0.1)',
                        color: otpExpired ? '#EF4444' : otpTimeLeft > 60 ? TEAL : GOLD,
                        border: `1px solid ${otpExpired ? 'rgba(239,68,68,0.3)' : otpTimeLeft > 60 ? 'rgba(6,182,212,0.3)' : 'rgba(245,158,11,0.3)'}`,
                      }}
                      aria-live="polite"
                      aria-label={`Tiempo restante: ${formatTime(otpTimeLeft)}`}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: otpExpired ? '#EF4444' : otpTimeLeft > 60 ? TEAL : GOLD }}
                      />
                      {otpExpired ? 'Código expirado' : `Válido por ${formatTime(otpTimeLeft)}`}
                    </div>
                  </div>
                  {}
                  <div className="mb-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                      Código de verificación
                    </label>
                    <div className="flex gap-1.5 sm:gap-2.5 justify-center px-1">
                      {code.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => { codeRefs.current[i] = el; }}
                          value={digit}
                          onChange={e => handleCodeChange(e.target.value, i)}
                          onKeyDown={e => handleCodeKeyDown(e, i)}
                          onPaste={handleCodePaste}
                          maxLength={1}
                          inputMode="numeric"
                          disabled={otpExpired}
                          aria-label={`Dígito ${i + 1}`}
                          className="text-center rounded-xl border-2 font-black transition-all focus:outline-none disabled:opacity-50"
                          style={{
                            flex: '1 1 0',
                            minWidth: 0,
                            maxWidth: 56,
                            height: 52,
                            fontSize: 20,
                            background: isDark ? '#112240' : 'white',
                            borderColor: codeError ? '#EF4444' : digit ? TEAL : isDark ? '#233554' : '#E5E7EB',
                            color: isDark ? 'white' : '#111827',
                            boxShadow: digit ? `0 0 0 3px ${TEAL}22` : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {}
                  <div className="min-h-[22px] mt-1.5 mb-3 text-center" aria-live="polite">
                    {codeError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 flex items-center justify-center gap-1"
                      >
                        <XCircle size={12} />{codeError}
                      </motion.p>
                    )}
                  </div>
                  {}
                  <div className="text-center mb-5">
                    {resendCooldown > 0 ? (
                      <p className="text-xs text-gray-400">
                        Puedes reenviar en{' '}
                        <span className="font-semibold" style={{ color: TEAL }}>{resendCooldown}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold active:scale-95 transition-transform"
                        style={{ color: TEAL }}
                      >
                        <RefreshCw size={13} />Reenviar código
                      </button>
                    )}
                  </div>
                  {}
                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Nueva contraseña
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="Nueva contraseña (mín. 8 caracteres)"
                          autoComplete="new-password"
                          className={`${inputBase} pl-10 pr-10 ${
                            newPassword.length > 0 && newPassword.length < 8
                              ? 'border-red-400 focus:border-red-500'
                              : newPassword.length >= 8
                              ? 'border-emerald-400 focus:border-emerald-500'
                              : 'border-gray-200 dark:border-[#233554] focus:border-[#06B6D4]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {}
                      {newPassword.length > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium" style={{ color: strength.color }}>
                              {strength.label}
                            </span>
                            {newPassword.length >= 8 && strength.label !== 'Excelente' && (
                              <span className="text-[9px] text-gray-400">
                                {!/[A-Z]/.test(newPassword) && 'Agrega mayúsculas'}
                                {/[A-Z]/.test(newPassword) && !/[^A-Za-z0-9]/.test(newPassword) && 'Agrega símbolos para mayor seguridad'}
                              </span>
                            )}
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-[#1A304F] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${strength.pct}%` }}
                              transition={{ duration: 0.3 }}
                              style={{ background: strength.color }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Confirmar contraseña
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          value={confirmPwd}
                          onChange={e => setConfirmPwd(e.target.value)}
                          placeholder="Repite tu nueva contraseña"
                          autoComplete="new-password"
                          className={`${inputBase} pl-10 pr-10 ${
                            confirmPwd.length > 0 && confirmPwd !== newPassword
                              ? 'border-red-400 focus:border-red-500'
                              : confirmPwd.length > 0 && confirmPwd === newPassword && newPassword.length >= 8
                              ? 'border-emerald-400 focus:border-emerald-500'
                              : 'border-gray-200 dark:border-[#233554] focus:border-[#06B6D4]'
                          }`}
                          aria-describedby="pwd-match"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      <div id="pwd-match" className="min-h-[18px] mt-1" aria-live="polite">
                        {confirmPwd.length > 0 && confirmPwd !== newPassword && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={10} />Las contraseñas no coinciden.
                          </p>
                        )}
                        {confirmPwd.length > 0 && confirmPwd === newPassword && newPassword.length >= 8 && (
                          <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <Check size={10} />Coinciden
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {}
                  <motion.button
                    onClick={handleReset}
                    disabled={!resetValid || resetLoading}
                    whileTap={resetValid && !resetLoading ? { scale: 0.97 } : {}}
                    className="w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-65"
                    style={{
                      background: resetValid ? GRADIENT : (isDark ? '#1E3A5F' : '#CBD5E1'),
                      cursor: resetValid && !resetLoading ? 'pointer' : 'not-allowed',
                    }}
                    aria-busy={resetLoading}
                  >
                    {resetLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Actualizando…
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        Actualizar contraseña
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
              {}
              {phase === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, type: 'spring', bounce: 0.35 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  {}
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl"
                    style={{ background: 'linear-gradient(135deg,#10B981,#06B6D4)' }}
                  >
                    <CheckCircle2 size={40} color="white" strokeWidth={2.5} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <h1 className="text-gray-900 dark:text-white mb-3">¡Contraseña actualizada!</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto" aria-live="assertive">
                      Contraseña actualizada. Inicia sesión con tu nueva contraseña.
                    </p>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => navigate('/login')}
                    whileTap={{ scale: 0.97 }}
                    className="mt-8 w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg"
                    style={{ background: GRADIENT }}
                  >
                    Iniciar sesión
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}