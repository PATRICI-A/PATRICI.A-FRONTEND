import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, Shield, Eye, EyeOff, Moon, Globe, Trash2, ChevronRight, Sun, Smartphone, Volume2, MapPin, Users, Lock } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GRADIENT, PINK } from '../types/mockData';
import { profileService } from '../services/profileService';
import { clearAuth } from '../services/auth.service';

const PRIVACY_TO_API: Record<string, string> = {
  PUBLICO: 'PUBLIC', SOLO_MATCHES: 'FRIENDS_ONLY', PRIVADO: 'PRIVATE',
};
const API_TO_PRIVACY: Record<string, string> = {
  PUBLIC: 'PUBLICO', FRIENDS_ONLY: 'SOLO_MATCHES', PRIVATE: 'PRIVADO',
};

type PrivacyLevel = 'PUBLICO' | 'SOLO_MATCHES' | 'PRIVADO';

const privacyOptions: { value: PrivacyLevel; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { value: 'PUBLICO', label: 'Perfil público', desc: 'Cualquier estudiante puede verte', icon: Globe, color: '#10B981' },
  { value: 'SOLO_MATCHES', label: 'Solo amigos', desc: 'Solo tus amigos pueden verte', icon: Users, color: '#06B6D4' },
  { value: 'PRIVADO', label: 'Privado', desc: 'Solo tú puedes ver tu perfil', icon: Lock, color: '#8B5CF6' },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme, geo, toggleGeo } = useApp();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [visibleInMatching, setVisibleInMatching] = useState(true);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('PUBLICO');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    profileService.getMyProfile().then(profile => {
      if (profile?.privacyLevel && API_TO_PRIVACY[profile.privacyLevel]) {
        setPrivacyLevel(API_TO_PRIVACY[profile.privacyLevel] as PrivacyLevel);
      }
    });
  }, []);

  const handlePrivacyChange = (level: PrivacyLevel) => {
    setPrivacyLevel(level);
    const userId = localStorage.getItem('patricia_user_id');
    if (userId) profileService.updateProfile(userId, { privacyLevel: PRIVACY_TO_API[level] });
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    const userId = localStorage.getItem('patricia_user_id');
    if (!userId) return;
    setIsDeleting(true);
    try {
      await profileService.deleteAccount(userId);
    } catch { /* ignore — still clear auth and redirect */ } finally {
      clearAuth();
      navigate('/login');
    }
  };

  const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 active:scale-95"
      style={{ background: value ? GRADIENT : '#D1D5DB' }}
    >
      <div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300"
        style={{ transform: value ? 'translateX(24px)' : 'translateX(0)' }}
      />
    </button>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-5">
      <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 mb-2">
        {title}
      </h3>
      <div className="bg-white dark:bg-[#151729] rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-[#2A2D4A]">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-8">
      <div className="bg-white dark:bg-[#151729] px-4 py-4 flex items-center gap-3 shadow-sm sticky top-[57px] z-10 border-b border-gray-100 dark:border-[#2A2D4A]">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#1E2038] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#252844] transition-colors active:scale-90"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-gray-900 dark:text-white text-base font-semibold">Configuración</h1>
          <p className="text-xs text-gray-400">Ajusta tu experiencia</p>
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto">
        <Section title="Apariencia">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(99,102,241,0.12)' }}
            >
              {isDark
                ? <Moon size={16} style={{ color: '#818CF8' }} />
                : <Sun size={16} style={{ color: '#F59E0B' }} />}
            </div>
            <span className="flex-1 text-sm font-medium text-gray-800 dark:text-white">
              {isDark ? 'Modo Oscuro' : 'Modo Claro'}
            </span>
            <ToggleSwitch value={isDark} onChange={toggleTheme} />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(16,185,129,0.12)' }}
            >
              <Globe size={16} style={{ color: '#10B981' }} />
            </div>
            <span className="flex-1 text-sm font-medium text-gray-800 dark:text-white">Idioma</span>
            <span className="text-xs text-gray-400 mr-1">Español</span>
            <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
          </div>
        </Section>

        <Section title="Notificaciones">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(232,36,90,0.12)' }}
            >
              <Bell size={16} style={{ color: PINK }} />
            </div>
            <span className="flex-1 text-sm font-medium text-gray-800 dark:text-white">Notificaciones Push</span>
            <ToggleSwitch value={pushEnabled} onChange={() => setPushEnabled(!pushEnabled)} />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(59,130,246,0.12)' }}
            >
              <Smartphone size={16} style={{ color: '#3B82F6' }} />
            </div>
            <span className="flex-1 text-sm font-medium text-gray-800 dark:text-white">Correo electrónico</span>
            <ToggleSwitch value={emailEnabled} onChange={() => setEmailEnabled(!emailEnabled)} />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(249,115,22,0.12)' }}
            >
              <Volume2 size={16} style={{ color: '#F97316' }} />
            </div>
            <span className="flex-1 text-sm font-medium text-gray-800 dark:text-white">Sonidos</span>
            <ToggleSwitch value={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
          </div>
        </Section>

        <Section title="Privacidad">
          <div className="px-4 py-3.5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(139,92,246,0.12)' }}
              >
                <Eye size={16} style={{ color: '#8B5CF6' }} />
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">Visibilidad del perfil</p>
            </div>
            <div className="flex flex-col gap-2">
              {privacyOptions.map(opt => {
                const Icon = opt.icon;
                const selected = privacyLevel === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handlePrivacyChange(opt.value)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all active:scale-[0.98]"
                    style={{
                      borderColor: selected ? opt.color : (isDark ? '#2A2D4A' : '#E5E7EB'),
                      background: selected ? `${opt.color}18` : 'transparent',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${opt.color}20` }}
                    >
                      <Icon size={14} style={{ color: opt.color }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className={`text-xs font-semibold ${selected ? '' : 'text-gray-800 dark:text-white'}`}
                        style={{ color: selected ? opt.color : undefined }}
                      >
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-gray-400">{opt.desc}</p>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: selected ? opt.color : '#D1D5DB' }}
                    >
                      {selected && (
                        <div className="w-2 h-2 rounded-full" style={{ background: opt.color }} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(16,185,129,0.12)' }}
            >
              <Shield size={16} style={{ color: '#10B981' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-white">Mostrar actividad</p>
              <p className="text-[11px] text-gray-400">Otros ven cuando estás activo</p>
            </div>
            <ToggleSwitch value={showActivity} onChange={() => setShowActivity(!showActivity)} />
          </div>

          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(232,36,90,0.12)' }}
            >
              <Users size={16} style={{ color: PINK }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-white">Visible en matching</p>
              <p className="text-[11px] text-gray-400">Aparecer en sugerencias de conexión</p>
            </div>
            <ToggleSwitch value={visibleInMatching} onChange={() => setVisibleInMatching(!visibleInMatching)} />
          </div>

          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: geo.enabled ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.12)' }}
            >
              <MapPin size={16} style={{ color: geo.enabled ? '#10B981' : '#9CA3AF' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-white">Geolocalización</p>
              <p className="text-[11px] text-gray-400">
                {geo.enabled
                  ? geo.onCampus
                    ? `En campus · ${geo.detectedZone ?? 'zona detectada'}`
                    : 'Activa · fuera del campus'
                  : 'Desactivada'}
              </p>
            </div>
            <ToggleSwitch value={geo.enabled} onChange={toggleGeo} />
          </div>
        </Section>

        <Section title="Zona de peligro">
          {showDeleteConfirm ? (
            <div className="p-4">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1 text-center">
                ¿Estás seguro? Esta acción no se puede deshacer.
              </p>
              <p className="text-[11px] text-gray-400 text-center mb-3">
                Ingresa tu contraseña para confirmar
              </p>
              <div className="relative mb-3">
                <input
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-[#2A2D4A] bg-gray-50 dark:bg-[#1E2038] text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showDeletePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-[#2A2D4A] text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1E2038] transition-colors active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={!deletePassword || isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar cuenta'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors active:scale-[0.98]"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-100 dark:bg-red-900/20">
                <Trash2 size={16} className="text-red-500" />
              </div>
              <span className="flex-1 text-sm font-medium text-red-500">Eliminar cuenta</span>
              <ChevronRight size={16} className="text-red-300" />
            </button>
          )}
        </Section>

        <p className="text-center text-[11px] text-gray-400 mt-4">
          patrici.a v1.0.0 · Campus Social ECI
        </p>
      </div>
    </div>
  );
}
