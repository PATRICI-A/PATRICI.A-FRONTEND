import * as React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Camera, Check, X, Upload, AlertCircle,
  Trophy, Palette, Compass, UtensilsCrossed, Leaf, Gamepad2, Music, Heart, ChevronRight,
  Eye, EyeOff, Lock, Globe, Users,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GRADIENT, PINK } from '../types/mockData';

const faculties = [
  'Ingeniería en Sistemas',
  'Ingeniería de Software',
  'Ingeniería Industrial',
  'Diseño Gráfico',
  'Administración de Empresas',
  'Ciencias Económicas',
  'Derecho',
  'Medicina',
  'Arquitectura',
  'Artes',
];

const interestCategories = [
  {
    id: 'sports', label: 'Deportes', icon: Trophy, color: '#EF4444',
    gradient: 'linear-gradient(135deg,#EF4444,#F97316)',
    options: [
      'Tenis de campo', 'Ajedrez', 'Fútbol sala masculino', 'Fútbol sala femenino',
      'Fútbol masculino', 'Fútbol femenino', 'Fútbol empleados',
      'Baloncesto femenino y masculino', 'Voleibol femenino y masculino',
      'Disco volador (Ultimate) femenino y masculino',
      'Tenis de mesa femenino y masculino', 'Taekwondo',
    ],
  },
  {
    id: 'arts', label: 'Artes & Cultura', icon: Palette, color: '#8B5CF6',
    gradient: 'linear-gradient(135deg,#8B5CF6,#EC4899)',
    options: ['Música en vivo', 'Fotografía', 'Cine & películas', 'Teatro', 'Danza', 'Arte contemporáneo', 'Museos', 'Literatura'],
  },
  {
    id: 'travel', label: 'Viajes & Aventura', icon: Compass, color: '#06B6D4',
    gradient: 'linear-gradient(135deg,#06B6D4,#3B82F6)',
    options: ['Senderismo', 'Viajes nacionales', 'Viajes internacionales', 'Acampada', 'Buceo', 'Escalada', 'Mochileo', 'Turismo de aventura'],
  },
  {
    id: 'food', label: 'Gastronomía', icon: UtensilsCrossed, color: '#F59E0B',
    gradient: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    options: ['Cocina internacional', 'Cocina local', 'Café & bebidas', 'Repostería', 'Comida saludable', 'Puestos de comida callejera', 'Vinos & cócteles'],
  },
  {
    id: 'wellness', label: 'Bienestar & Estilo de vida', icon: Leaf, color: '#10B981',
    gradient: 'linear-gradient(135deg,#10B981,#06B6D4)',
    options: ['Yoga', 'Meditación', 'Ejercicio físico', 'Nutrición', 'Moda & estilo', 'Cuidado de la piel & belleza', 'Sostenibilidad & medio ambiente'],
  },
  {
    id: 'digital', label: 'Entretenimiento Digital', icon: Gamepad2, color: '#6366F1',
    gradient: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
    options: ['Videojuegos', 'Deportes electrónicos', 'Anime & manga', 'Series en línea', 'Audioprogramas', 'Creación de contenido'],
  },
  {
    id: 'music', label: 'Música & Sonido', icon: Music, color: '#EC4899',
    gradient: 'linear-gradient(135deg,#EC4899,#F59E0B)',
    options: ['Pop', 'Rock', 'Hip-hop & rap', 'Electrónica', 'Reggaeton', 'Indie', 'Jazz & blues', 'Música latina'],
  },
  {
    id: 'volunteer', label: 'Voluntariado & Impacto Social', icon: Heart, color: '#EF4444',
    gradient: 'linear-gradient(135deg,#EF4444,#8B5CF6)',
    options: ['Voluntariado comunitario', 'Educación', 'Protección animal', 'Sostenibilidad ambiental', 'Derechos humanos', 'Emprendimiento social'],
  },
];

const privacyOptions = [
  { value: 'PUBLICO', label: 'Perfil público', desc: 'Cualquier estudiante puede verte', icon: Globe, color: '#10B981' },
  { value: 'SOLO_MATCHES', label: 'Solo conexiones', desc: 'Solo tus conexiones pueden verte', icon: Users, color: '#06B6D4' },
  { value: 'PRIVADO', label: 'Privado', desc: 'Solo tú puedes ver tu perfil', icon: Lock, color: '#8B5CF6' },
];

function InterestCategory({
  cat, selected, onToggle, isDark,
}: {
  cat: typeof interestCategories[0];
  selected: string[];
  onToggle: (key: string) => void;
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
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cat.gradient }}>
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
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
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
            <div className="px-3 pb-3 pt-1 flex flex-wrap gap-2" style={{ borderTop: `1px solid ${isDark ? '#1E3A5F' : '#F3F4F6'}` }}>
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
                        : { background: isDark ? '#172A45' : '#F8FAFC', color: isDark ? '#94A3B8' : '#475569', border: `1px solid ${isDark ? '#233554' : '#E2E8F0'}` }
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

export function EditProfilePage() {
  const navigate = useNavigate();
  const { currentUser, isDark } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [faculty, setFaculty] = useState(currentUser?.faculty || '');
  const [semester, setSemester] = useState(String(currentUser?.semester || 1));
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [tipoDoc, setTipoDoc] = useState<'CC' | 'TI' | 'CE'>('CC');
  const [identificacion, setIdentificacion] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState<'M' | 'F' | 'O' | 'PREFER_NOT_TO_SAY'>('M');
  const [privacidad, setPrivacidad] = useState<'PUBLICO' | 'SOLO_MATCHES' | 'PRIVADO'>('PUBLICO');

  const totalSelected = selectedInterests.length;
  const canSave = !isSaving && !saved && totalSelected >= 3;

  const toggleInterest = (key: string) => {
    setSelectedInterests(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => navigate(-1), 1000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('El archivo no cumple los requisitos (PNG/JPG, máx 5MB)');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('El archivo no cumple los requisitos (PNG/JPG, máx 5MB)');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setPhotoError(null);
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!currentUser) return null;

  const inputClass = `w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#151729] border border-gray-200 dark:border-[#2A2D4A] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#E8245A] transition-all`;

  return (
    <div className="min-h-screen pb-8">
      <div className="bg-white dark:bg-[#151729] px-4 py-4 flex items-center gap-3 shadow-sm sticky top-[57px] z-10 border-b border-gray-100 dark:border-[#2A2D4A]">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#1E2038] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#252844] transition-colors active:scale-90"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900 dark:text-white text-base font-semibold">Editar Perfil</h1>
          <p className="text-xs text-gray-400">Actualiza tu información</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
          style={{ background: saved ? '#10B981' : GRADIENT }}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? (
            <Check size={14} />
          ) : null}
          {saved ? 'Guardado' : isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      <div className="px-4 pt-6 max-w-lg mx-auto space-y-5">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden" style={{ boxShadow: `0 0 0 3px ${PINK}` }}>
              <img src={photoPreview || currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            </div>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={handlePhotoChange} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-90"
              style={{ background: GRADIENT }}
            >
              <Camera size={14} />
            </button>
            {photoPreview && (
              <button onClick={clearPhoto} className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md bg-red-500 transition-all active:scale-90">
                <X size={11} />
              </button>
            )}
          </div>
          {photoError ? (
            <div className="flex items-center gap-1.5">
              <AlertCircle size={12} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-500 text-center">{photoError}</p>
            </div>
          ) : photoPreview ? (
            <div className="flex items-center gap-1.5">
              <Upload size={11} style={{ color: PINK }} />
              <p className="text-xs font-medium" style={{ color: PINK }}>
                {photoFile?.name && photoFile.name.length > 22 ? photoFile.name.slice(0, 19) + '...' : photoFile?.name}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Toca <span className="font-medium" style={{ color: PINK }}>📷</span> para cambiar tu foto · PNG/JPG, máx 5MB</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre completo</label>
          <input value={name} onChange={e => setName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            maxLength={200}
            placeholder="Cuéntanos sobre ti..."
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#151729] border border-gray-200 dark:border-[#2A2D4A] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#E8245A] transition-all resize-none"
          />
          <p className="text-right text-[10px] text-gray-400 mt-0.5">{bio.length}/200</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipo de documento</label>
            <div className="flex gap-1.5">
              {(['CC', 'TI', 'CE'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipoDoc(t)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={tipoDoc === t
                    ? { background: GRADIENT, color: 'white' }
                    : { background: isDark ? '#1E2038' : '#F3F4F6', color: isDark ? '#CBD5E1' : '#374151' }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Identificación</label>
            <input
              value={identificacion}
              onChange={e => setIdentificacion(e.target.value.replace(/\D/g, '').slice(0, 15))}
              placeholder="5-15 dígitos"
              className={inputClass}
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Edad</label>
            <input
              value={edad}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '');
                if (v === '' || (Number(v) >= 1 && Number(v) <= 80)) setEdad(v);
              }}
              placeholder="15-80"
              className={inputClass}
              inputMode="numeric"
              maxLength={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Género</label>
            <div className="grid grid-cols-2 gap-1.5">
              {([
                { value: 'M', label: 'Masc.' },
                { value: 'F', label: 'Fem.' },
                { value: 'O', label: 'Otro' },
                { value: 'PREFER_NOT_TO_SAY', label: 'N/D' },
              ] as const).map(g => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGenero(g.value)}
                  className="py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={genero === g.value
                    ? { background: GRADIENT, color: 'white' }
                    : { background: isDark ? '#1E2038' : '#F3F4F6', color: isDark ? '#CBD5E1' : '#374151' }}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Facultad / Carrera</label>
          <select
            value={faculty}
            onChange={e => setFaculty(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#151729] border border-gray-200 dark:border-[#2A2D4A] text-gray-800 dark:text-white focus:outline-none focus:border-[#E8245A] transition-all appearance-none"
          >
            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Semestre actual</label>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSemester(String(s))}
                className="py-3 rounded-xl font-medium text-sm transition-all active:scale-95"
                style={semester === String(s)
                  ? { background: GRADIENT, color: 'white' }
                  : { background: isDark ? '#1E2038' : '#F3F4F6', color: isDark ? '#CBD5E1' : '#374151' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nivel de privacidad</label>
          <div className="space-y-2">
            {privacyOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = privacidad === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPrivacidad(opt.value as typeof privacidad)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all active:scale-[0.98]"
                  style={isSelected
                    ? { borderColor: opt.color, background: `${opt.color}0D` }
                    : { borderColor: isDark ? '#233554' : '#E5E7EB', background: isDark ? '#112240' : 'white' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isSelected ? opt.color : (isDark ? '#1E2038' : '#F3F4F6') }}>
                    <Icon size={16} color={isSelected ? 'white' : (isDark ? '#94A3B8' : '#6B7280')} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: isSelected ? opt.color : (isDark ? 'white' : '#1F2937') }}>{opt.label}</p>
                    <p className="text-[11px] text-gray-400">{opt.desc}</p>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                    style={{ borderColor: isSelected ? opt.color : '#D1D5DB' }}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full" style={{ background: opt.color }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Intereses</label>
              <p className="text-[11px] text-gray-400 mt-0.5">Selecciona al menos 3</p>
            </div>
            {totalSelected > 0 && (
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={totalSelected >= 3
                  ? { background: `${PINK}18`, color: PINK }
                  : { background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
              >
                {totalSelected} / mín. 3
              </span>
            )}
          </div>
          <div className="space-y-2.5">
            {interestCategories.map(cat => (
              <InterestCategory key={cat.id} cat={cat} selected={selectedInterests} onToggle={toggleInterest} isDark={isDark} />
            ))}
          </div>
          {totalSelected < 3 && (
            <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-500">Selecciona al menos 3 intereses para guardar</p>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: saved ? '#10B981' : GRADIENT }}
        >
          {isSaving ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Guardando cambios...</>
          ) : saved ? (
            <><Check size={18} /> ¡Perfil actualizado!</>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </div>
    </div>
  );
}
