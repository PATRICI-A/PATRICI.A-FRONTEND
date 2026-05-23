import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Globe, Lock, MapPin, Clock, Calendar, Users, Image as ImageIcon, Ticket, Save, CheckCircle } from 'lucide-react';
import { GRADIENT, PINK, ORANGE, events, ECI_LOCATIONS } from '../types/mockData';
import { updateParche, getParcheById, type ParcheDetailResponse } from '../services/parches.service';
import { EmojiIcon } from '../components/ui/EmojiIcon';

const categories = [
  { id: 'musica', label: 'Música', emoji: '🎵', gradient: GRADIENT },
  { id: 'deporte', label: 'Deporte', emoji: '⚽', gradient: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)' },
  { id: 'tecnologia', label: 'Tecnología', emoji: '💻', gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' },
  { id: 'estudio', label: 'Estudio', emoji: '📚', gradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)' },
  { id: 'cultura', label: 'Cultura', emoji: '🎨', gradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)' },
  { id: 'social', label: 'Social', emoji: '🤝', gradient: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)' },
  { id: 'gastronomia', label: 'Foodie', emoji: '🍕', gradient: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)' },
  { id: 'bienestar', label: 'Bienestar', emoji: '🧘', gradient: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' },
];

export function EditParchePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [parche, setParche] = useState<ParcheDetailResponse | null>(null);

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxMembers, setMaxMembers] = useState('10');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (id) {
      getParcheById(id)
        .then(res => {
          setParche(res);
          setDescription(res.description || '');
          setCategory(res.category || '');
          setIsPublic(res.type === 'PUBLIC');
          setLocation(res.place?.displayName || res.lugar || '');
          setDate(res.date || '');
          setTime(res.hour || '');
          setMaxMembers(String(res.maximumQuota || 10));
          setCoverImage(res.imageUrl || null);
          setEventId(res.event?.id || '');
        })
        .catch(() => {
          navigate('/parches');
        });
    }
  }, [id, navigate]);

  if (!parche) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!category || !parche) return;
    
    // Business rule: max members cannot be less than current members
    const newMax = parseInt(maxMembers);
    const actualMembers = parche.actualMembers || parche.members.length;
    if (newMax < actualMembers) {
      setErrorMsg(`El cupo máximo no puede ser menor a los miembros actuales (${actualMembers})`);
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      const formattedTime = time ? (time.length === 5 ? `${time}:00` : time) : "00:00:00";
      const formattedDate = date || new Date().toISOString().split('T')[0];
      await updateParche(parche.id, {
        description,
        category,
        type: isPublic ? 'PUBLIC' : 'PRIVATE',
        lugar: location,
        date: formattedDate,
        hour: formattedTime,
        maximumQuota: newMax,
        imageUrl: coverImage || undefined,
        eventId: eventId || undefined,
      });
      setSaved(true);
      setTimeout(() => navigate(`/parches/${parche.id}`), 1500);
    } catch (e) {
      setErrorMsg('Error al guardar los cambios');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === category);

  if (saved) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl bg-green-500"
          >
            <CheckCircle size={40} color="white" />
          </div>
          <h2 className="text-gray-900 dark:text-white mb-2">¡Cambios guardados!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            El parche ha sido actualizado con éxito.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="bg-white dark:bg-[#112240] px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 md:top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#172A45] text-gray-500 dark:text-gray-400"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-gray-900 dark:text-white text-base">Editar Parche</h1>
          <p className="text-xs text-gray-400">Actualiza los detalles</p>
        </div>
      </div>

      <div className="px-5 pt-6 max-w-lg mx-auto">
        <div className="space-y-5">
          {/* Imagen de Portada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagen de Portada</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-[#1A2C4E]"
                   style={{ borderColor: coverImage ? PINK : '#E5E7EB', overflow: 'hidden' }}>
              {coverImage ? (
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={28} className="mb-2" />
                  <span className="text-sm font-medium">Toca para cambiar imagen</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Nombre Fijo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del parche (Fijo)</label>
            <input
              value={parche.name}
              disabled
              className="w-full px-4 py-3.5 rounded-xl bg-gray-100 dark:bg-[#172A45] border border-gray-200 dark:border-[#233554] text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-80"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="¿De qué trata tu parche? ¿Qué van a hacer?"
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1D4ED8] transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/200</p>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría *</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all"
                  style={
                    category === cat.id
                      ? { borderColor: PINK, background: 'rgba(232,36,90,0.05)' }
                      : { borderColor: 'transparent', background: '#EFF6FF' }
                  }
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: cat.gradient }}
                  >
                    <EmojiIcon emoji={cat.emoji} size={17} color="white" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-600" style={category === cat.id ? { color: PINK } : {}}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de parche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de parche</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: true, icon: Globe, title: 'Público', desc: 'Cualquiera puede unirse' },
                { value: false, icon: Lock, title: 'Privado', desc: 'Solo por invitación' },
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setIsPublic(opt.value)}
                  className="flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all"
                  style={
                    isPublic === opt.value
                      ? { borderColor: PINK, background: 'rgba(29,78,216,0.05)' }
                      : { borderColor: '#E5E7EB', background: 'white' }
                  }
                >
                  <opt.icon size={20} style={{ color: isPublic === opt.value ? PINK : '#9CA3AF' }} />
                  <div>
                    <p className="font-semibold text-sm text-gray-800" style={isPublic === opt.value ? { color: PINK } : {}}>
                      {opt.title}
                    </p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Evento asociado (Opcional)</label>
            <div className="relative">
              <Ticket size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={eventId}
                onChange={e => setEventId(e.target.value)}
                className="w-full pl-8 pr-3 py-3 rounded-xl bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white focus:outline-none focus:border-[#1D4ED8] text-sm transition-all appearance-none"
              >
                <option value="">Ninguno</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ubicacion y hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lugar</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-8 pr-10 py-3 rounded-xl bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white focus:outline-none focus:border-[#1D4ED8] text-sm transition-all appearance-none"
                >
                  <option value="" disabled>Selecciona el lugar...</option>
                  {ECI_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hora</label>
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full pl-8 pr-3 py-3 rounded-xl bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white focus:outline-none focus:border-[#1D4ED8] text-sm transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-3 rounded-xl bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white focus:outline-none focus:border-[#1D4ED8] text-sm transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Máx. miembros</label>
              <div className="relative">
                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={maxMembers}
                  onChange={e => setMaxMembers(e.target.value)}
                  min={parche.actualMembers || parche.members?.length || 1} // No less than current members
                  max="100"
                  className="w-full pl-8 pr-3 py-3 rounded-xl bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white focus:outline-none focus:border-[#1D4ED8] text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!category || isLoading}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all active:scale-95 disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
            style={{ background: GRADIENT }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <><Save size={18} /> Guardar Cambios</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
