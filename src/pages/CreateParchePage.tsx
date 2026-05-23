import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Globe, Lock, MapPin, Clock, Calendar, Users, Plus, X, Check, Rocket, Sparkles, Image as ImageIcon, Ticket } from 'lucide-react';
import { GRADIENT, PINK, ORANGE, events, ECI_LOCATIONS } from '../types/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import patySelfieImg from '../assets/PATY SELFIE.png';
import patyBalonesImg from '../assets/PATY BALONES.png';
const categories = [
  { id: 'MUSIC', label: 'Música', emoji: '🎵', gradient: GRADIENT },
  { id: 'SPORT', label: 'Deporte', emoji: '⚽', gradient: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)' },
  { id: 'TECHNOLOGY', label: 'Tecnología', emoji: '💻', gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' },
  { id: 'STUDY', label: 'Estudio', emoji: '📚', gradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)' },
  { id: 'CULTURE', label: 'Cultura', emoji: '🎨', gradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)' },
  { id: 'SOCIAL', label: 'Social', emoji: '🤝', gradient: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)' },
  { id: 'FOOD', label: 'Foodie', emoji: '🍕', gradient: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)' },
  { id: 'WELLNESS', label: 'Bienestar', emoji: '🧘', gradient: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' },
];
const friends = [
  { id: 'u2', name: 'Valentina R.', avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50' },
  { id: 'u3', name: 'Mateo S.', avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50' },
  { id: 'u4', name: 'Sofía M.', avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50' },
  { id: 'u5', name: 'Daniel C.', avatar: 'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50' },
];
import { useApp } from '../store/AppContext';
import { createParche, sendInvitation } from '../services/parches.service';

export function CreateParchePage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxMembers, setMaxMembers] = useState('10');
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const toggleFriend = (id: string) => {
    setInvitedFriends(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };
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
  const handleCreate = async () => {
    if (!name || !category) return;
    setIsLoading(true);
    try {
      const formattedTime = time ? `${time}:00` : "00:00:00";
      const formattedDate = date || new Date().toISOString().split('T')[0];
      
      const newParche = await createParche({
        name,
        description,
        lugar: location || 'Campus',
        category,
        date: formattedDate,
        hour: formattedTime,
        maximumQuota: parseInt(maxMembers) || 10,
        type: isPublic ? 'PUBLIC' : 'PRIVATE',
        eventId: eventId || undefined,
        imageUrl: coverImage || undefined,
      }, currentUser?.id || 'u1');

      if (invitedFriends.length > 0) {
        await Promise.allSettled(
          invitedFriends.map(friendId => sendInvitation(newParche.id, friendId))
        );
      }
      
      setCreated(true);
      setTimeout(() => navigate('/parches'), 2000);
    } catch (err: unknown) {
      alert("Error al crear parche");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const selectedCategory = categories.find(c => c.id === category);
  if (created) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <img src={patySelfieImg} alt="Mascota" className="w-40 h-40 object-contain drop-shadow-2xl" />
          </div>
          <h2 className="text-gray-900 dark:text-white mb-2 text-2xl font-black">¡Parche creado!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tu parche <strong style={{ color: PINK }}>{name}</strong> ya está activo
          </p>
          <p className="text-xs text-gray-400 mt-2">Redirigiendo...</p>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen pb-8">
      <div className="bg-white dark:bg-[#112240] px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 md:top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#172A45] text-gray-500 dark:text-gray-400 hover:scale-105 transition-transform"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-gray-900 dark:text-white font-bold text-base">Crear Parche</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Arma tu plan perfecto</p>
          </div>
        </div>
        <img src={patyBalonesImg} alt="Paty" className="w-12 h-12 object-contain drop-shadow-sm -my-1" />
      </div>
      <div className="px-5 pt-6 w-full md:w-4/6 md:mx-auto">
        {}
        {(name || selectedCategory) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl p-5 text-white shadow-lg"
            style={{ background: selectedCategory?.gradient || GRADIENT }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(4px)' }}
              >
                <EmojiIcon emoji={selectedCategory?.emoji || '✨'} size={22} color="white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{name || 'Nombre del parche'}</h3>
                <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                  {isPublic ? <><Globe size={10} /> Público</> : <><Lock size={10} /> Privado</>}
                  {' · '}{selectedCategory?.label || 'Categoría'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
        <div className="space-y-5">
          {/* Imagen de Portada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagen de Portada *</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-[#1A2C4E]"
                   style={{ borderColor: coverImage ? PINK : '#E5E7EB', overflow: 'hidden' }}>
              {coverImage ? (
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={28} className="mb-2" />
                  <span className="text-sm font-medium">Toca para subir imagen</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del parche *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Melómanos del Campus"
              maxLength={50}
              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1D4ED8] transition-all"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{name.length}/50</p>
          </div>
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
                  min="2"
                  max="100"
                  className="w-full pl-8 pr-3 py-3 rounded-xl bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#233554] text-gray-800 dark:text-white focus:outline-none focus:border-[#1D4ED8] text-sm transition-all"
                />
              </div>
            </div>
          </div>
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Invitar amigos ({invitedFriends.length} seleccionados)
            </label>
            <div className="space-y-2">
              {friends.map(friend => {
                const isInvited = invitedFriends.includes(friend.id);
                return (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() => toggleFriend(friend.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all"
                    style={
                      isInvited
                        ? { borderColor: PINK, background: 'rgba(232,36,90,0.05)' }
                        : { borderColor: '#E5E7EB', background: 'white' }
                    }
                  >
                    <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-full object-cover" />
                    <span className="flex-1 text-sm font-medium text-gray-800 text-left">{friend.name}</span>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={isInvited ? { background: GRADIENT } : { background: '#E5E7EB' }}
                    >
                      {isInvited ? <Check size={12} color="white" /> : <Plus size={12} color="#9CA3AF" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {}
          <button
            onClick={handleCreate}
            disabled={!name || !category || isLoading}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all active:scale-95 disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
            style={{ background: GRADIENT }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando parche...
              </>
            ) : (
              <><Rocket size={18} /> Crear Parche</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}