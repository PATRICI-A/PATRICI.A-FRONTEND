import * as React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, Check, X, Upload } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GRADIENT, PINK, interestOptions } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';

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

export function EditProfilePage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [faculty, setFaculty] = useState(currentUser?.faculty || '');
  const [semester, setSemester] = useState(String(currentUser?.semester || 1));
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser?.interests.map(i => i.toLowerCase().replace(/ /g, '')) || []
  );

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : prev.length < 8
        ? [...prev, id]
        : prev
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => navigate(-1), 1000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!currentUser) return null;

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
          disabled={isSaving || saved}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-70"
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
            <div
              className="w-24 h-24 rounded-2xl overflow-hidden"
              style={{ boxShadow: `0 0 0 3px ${PINK}` }}
            >
              <img
                src={photoPreview || currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-90"
              style={{ background: GRADIENT }}
            >
              <Camera size={14} />
            </button>
            {photoPreview && (
              <button
                onClick={clearPhoto}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md bg-red-500 transition-all active:scale-90"
              >
                <X size={11} />
              </button>
            )}
          </div>
          {photoPreview ? (
            <div className="flex items-center gap-1.5">
              <Upload size={11} style={{ color: PINK }} />
              <p className="text-xs font-medium" style={{ color: PINK }}>
                {photoFile?.name && photoFile.name.length > 22
                  ? photoFile.name.slice(0, 19) + '...'
                  : photoFile?.name}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Toca <span className="font-medium" style={{ color: PINK }}>📷</span> para cambiar tu foto</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Nombre completo
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#151729] border border-gray-200 dark:border-[#2A2D4A] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#E8245A] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Bio
          </label>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Facultad / Carrera
          </label>
          <select
            value={faculty}
            onChange={e => setFaculty(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#151729] border border-gray-200 dark:border-[#2A2D4A] text-gray-800 dark:text-white focus:outline-none focus:border-[#E8245A] transition-all appearance-none"
          >
            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Semestre actual
          </label>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSemester(String(s))}
                className="py-3 rounded-xl font-medium text-sm transition-all active:scale-95"
                style={
                  semester === String(s)
                    ? { background: GRADIENT, color: 'white' }
                    : { background: '#F3F4F6', color: '#374151' }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Intereses ({selectedInterests.length}/8)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map(interest => {
              const isSelected = selectedInterests.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest(interest.id)}
                  className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left active:scale-95"
                  style={
                    isSelected
                      ? { borderColor: PINK, background: 'rgba(232,36,90,0.06)' }
                      : { borderColor: '#E5E7EB', background: 'white' }
                  }
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: isSelected ? GRADIENT : '#F3F4F6' }}
                  >
                    <EmojiIcon emoji={interest.emoji} size={15} color={isSelected ? 'white' : '#9CA3AF'} strokeWidth={2} />
                  </div>
                  <span
                    className="text-sm font-medium flex-1"
                    style={{ color: isSelected ? PINK : '#374151' }}
                  >
                    {interest.label}
                  </span>
                  {isSelected && <Check size={13} style={{ color: PINK }} />}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || saved}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base shadow-lg transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ background: saved ? '#10B981' : GRADIENT }}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando cambios...
            </>
          ) : saved ? (
            <>
              <Check size={18} /> ¡Perfil actualizado!
            </>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </div>
    </div>
  );
}