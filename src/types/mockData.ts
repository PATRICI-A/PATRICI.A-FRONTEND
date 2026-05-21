import imgTourCampus from '../../Imagenes_monas/Edificios/Tour por el campus.png';
import imgConquistadorCampus from '../../Imagenes_monas/Legendarias/Conquistador del campus.png';
import imgLeyendaCampus from '../../Imagenes_monas/Legendarias/Leyenda del Campus.png';
import imgAnfitrion from '../../Imagenes_monas/Networking/Anfitrion.png';
import imgCapitanEquipo from '../../Imagenes_monas/Networking/Capitan de Equipo.png';
import imgConectorVeloz from '../../Imagenes_monas/Networking/Conector veloz.png';
import imgIniciadorParche from '../../Imagenes_monas/Networking/Iniciador de parche.png';
import imgNetworking25 from '../../Imagenes_monas/Networking/Networking 25.png';
import imgNetworking5 from '../../Imagenes_monas/Networking/Networking 5.png';
import imgOrganizadorElite from '../../Imagenes_monas/Networking/Organizador de elite.png';
import imgPrimerContacto from '../../Imagenes_monas/Networking/Primer Contacto.png';
import imgPrimerMensajero from '../../Imagenes_monas/Networking/Primer Mensajero.png';
import imgMaratonUniversitaria from '../../Imagenes_monas/Zonas y actividad/Maraton Universitaria.png';

export interface MatchUser {
  id: string;
  name: string;
  age: number;
  avatar: string;
  faculty: string;
  program: string;
  semester: number;
  interests: string[];
  matchPercent: number;
  commonPlace: string;
  online: boolean;
  bio?: string;
  connectionStatus?: 'none' | 'pending' | 'connected';
}
export interface Parche {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  coverColor: string;
  type: 'public' | 'private';
  members: number;
  maxMembers: number;
  memberAvatars: string[];
  location: string;
  time: string;
  date: string;
  joined: boolean;
  trending?: boolean;
  tags: string[];
  admin: string;
  adminId: string;
}
export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  emoji: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  coverImage?: string;
  coverGradient: string;
  official: boolean;
  registered: boolean;
  reminder: boolean;
  tags: string[];
  isPast?: boolean;
}
export interface WellnessResource {
  id: string;
  name: string;
  description: string;
  category: 'SALUD' | 'DEPORTE' | 'CULTURA' | 'MENTAL_HEALTH';
  schedule: string;
  contact: string;
  active: boolean;
  location?: string;
  phone?: string;
}
export interface ChatMessage {
  id: string;
  sender: string;
  senderId: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'system';
  imageUrl?: string;
  isMe?: boolean;
}
export interface DirectChat {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  faculty: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  accentColor: string;
}
export interface Mona {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  bgColor: string;
  rarity: 'común' | 'poco común' | 'raro' | 'épico' | 'legendario';
  category: 'networking' | 'cafeterias' | 'edificios' | 'actividad' | 'eventos' | 'legendarias';
  unlocked: boolean;
  unlockedAt?: string;
  xp: number;
  image?: string;
  imgSrc?: string;
}
export interface Notification {
  id: string;
  type: 'chat' | 'event' | 'match' | 'parche_invitation' | 'event_reminder';
  title: string;
  message: string;
  avatar?: string;
  icon?: string;
  color: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
export interface CafeteriaPrize {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const CAFETERIA_PRIZES: CafeteriaPrize[] = [
  { id: 'prize-cafe', name: 'Café Gratis', emoji: '☕', color: '#8B5CF6' },
  { id: 'prize-empanada', name: 'Empanada de Carne', emoji: '🥟', color: '#F59E0B' },
  { id: 'prize-jugo', name: 'Jugo Natural', emoji: '🧃', color: '#10B981' },
  { id: 'prize-almuerzo', name: 'Almuerzo Completo', emoji: '🍱', color: '#EC4899' },
  { id: 'prize-brownie', name: 'Brownie con Helado', emoji: '🍦', color: '#6366F1' },
  { id: 'prize-papas', name: 'Papas Fritas', emoji: '🍟', color: '#EAB308' },
  { id: 'prize-croissant', name: 'Croissant Relleno', emoji: '🥐', color: '#D97706' }
];
export const GRADIENT = 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)';
export const PINK = '#1D4ED8';
export const ORANGE = '#06B6D4';
export const TEAL = '#06B6D4';
export const TEAL_GRADIENT = 'linear-gradient(135deg, #0369A1 0%, #06B6D4 100%)';
export const GOLD = '#D97706';
export const GOLD_LIGHT = '#F59E0B';
export const GOLD_GRADIENT = 'linear-gradient(135deg, #92400E 0%, #D97706 50%, #F59E0B 100%)';
export interface EventEnvelope {
  code: string;
  monaIds: string[];
  label: string;
  theme: string;
  color: string;
  gradient: string;
  emoji: string;
  description: string;
}
export const EVENT_ENVELOPES: EventEnvelope[] = [
  {
    code: 'PATRICIA-TECH-001',
    monaIds: ['patricia-primer-contacto', 'patricia-conector-veloz'],
    label: 'Sobre Red Rápida',
    theme: 'networking',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
    emoji: '⚡',
    description: 'Patricias exclusivas para conexiones y parches',
  },
  {
    code: 'PATRICIA-SOCIAL-002',
    monaIds: ['patricia-networking-5', 'patricia-networking-10'],
    label: 'Sobre Conexiones Pro',
    theme: 'networking',
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #0369A1 0%, #06B6D4 100%)',
    emoji: '👥',
    description: 'Construye tu red social estudiantil',
  },
  {
    code: 'PATRICIA-CULTURA-003',
    monaIds: ['patricia-iniciador', 'patricia-organizador-elite'],
    label: 'Sobre Organizador',
    theme: 'networking',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)',
    emoji: '🔥',
    description: 'Para los creadores de parches y eventos',
  },
  {
    code: 'PATRICIA-WELLNESS-004',
    monaIds: ['patricia-zen-master', 'patricia-noctambulo-academico'],
    label: 'Sobre Exploración',
    theme: 'actividad',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    emoji: '🧘',
    description: 'Equilibrio, lugares icónicos y campus nocturno',
  },
  {
    code: 'PATRICIA-ACADEMIA-005',
    monaIds: ['patricia-primer-mensajero', 'patricia-amanecer-productivo'],
    label: 'Sobre Esfuerzo',
    theme: 'actividad',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
    emoji: '🌅',
    description: 'Reconocimiento a la actividad diaria del campus',
  },
  {
    code: 'PATRICIA-LEGEND-006',
    monaIds: ['patricia-networking-50', 'patricia-embajador-campus', 'patricia-leyenda-campus'],
    label: '✨ Sobre Legendario',
    theme: 'legendarias',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #92400E 0%, #D97706 50%, #F59E0B 100%)',
    emoji: '🌟',
    description: '¡El sobre con patricias más exclusivo de patrici.a!',
  },
];
export const matchUsers: MatchUser[] = [
  {
    id: 'u2',
    name: 'Valentina R.',
    age: 20,
    avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería de Sistemas',
    program: 'Ingeniería de Sistemas',
    semester: 6,
    interests: ['Fotografía', 'Jazz', 'Diseño'],
    matchPercent: 98,
    commonPlace: 'Tonia & Luz',
    online: true,
    bio: 'Diseñadora apasionada por la fotografía analógica y el jazz. Siempre buscando la estética perfecta.',
    connectionStatus: 'none',
  },
  {
    id: 'u3',
    name: 'Mateo S.',
    age: 21,
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería de Sistemas',
    program: 'Ingeniería de Sistemas',
    semester: 7,
    interests: ['Senderismo', 'Indie Rock', 'Programación'],
    matchPercent: 92,
    commonPlace: 'Carnitura Bogotá',
    online: false,
    bio: 'Dev full-stack y amante de la montaña. Los fines de semana me encuentras en los cerros.',
    connectionStatus: 'connected',
  },
  {
    id: 'u4',
    name: 'Sofía M.',
    age: 20,
    avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Biomédica',
    program: 'Ingeniería Biomédica',
    semester: 5,
    interests: ['Fotografía', 'Arte', 'Música'],
    matchPercent: 89,
    commonPlace: 'Cafetería Central',
    online: true,
    bio: 'Artista visual explorando la intersección entre arte tradicional y digital.',
    connectionStatus: 'none',
  },
  {
    id: 'u5',
    name: 'Daniel C.',
    age: 22,
    avatar: 'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería de Sistemas',
    program: 'Ingeniería de Sistemas',
    semester: 8,
    interests: ['Gaming', 'Programación', 'Diseño UI/UX'],
    matchPercent: 85,
    commonPlace: 'Sala de Cómputo',
    online: true,
    bio: 'Gamer y programador. Me encanta crear experiencias de usuario increíbles.',
    connectionStatus: 'connected',
  },
  {
    id: 'u6',
    name: 'Lucía T.',
    age: 19,
    avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería',
    program: 'Ingeniería de Sistemas',
    semester: 4,
    interests: ['Música', 'Programación', 'Fotografía'],
    matchPercent: 94,
    commonPlace: 'Biblioteca Central',
    online: true,
    bio: 'Desarrolladora apasionada por la música. Creando apps que conectan arte y tecnología.',
    connectionStatus: 'none',
  },
  {
    id: 'u7',
    name: 'Andrés P.',
    age: 21,
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Civil',
    program: 'Ingeniería Civil',
    semester: 6,
    interests: ['Senderismo', 'Fútbol', 'Lectura'],
    matchPercent: 78,
    commonPlace: 'Canchas Los Pinos',
    online: false,
    bio: 'Ingeniero civil en formación. Aficionado al aire libre y el deporte.',
    connectionStatus: 'none',
  },
  {
    id: 'u8',
    name: 'Carolina V.',
    age: 20,
    avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Administración de Empresas',
    program: 'Administración de Empresas',
    semester: 5,
    interests: ['Emprendimiento', 'Gastronomía', 'Yoga'],
    matchPercent: 82,
    commonPlace: 'Café del Campus',
    online: true,
    bio: 'Emprendedora en potencia. Amo el buen café y el equilibrio mente-cuerpo.',
    connectionStatus: 'none',
  },
  {
    id: 'u9',
    name: 'Sebastián L.',
    age: 22,
    avatar: 'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Industrial',
    program: 'Ingeniería Industrial',
    semester: 7,
    interests: ['Diseño', 'Arte', 'Gaming'],
    matchPercent: 87,
    commonPlace: 'Taller de Diseño',
    online: true,
    bio: 'Diseñador industrial fascinado por el diseño de videojuegos y productos tech.',
    connectionStatus: 'none',
  },
  {
    id: 'u10',
    name: 'Isabella G.',
    age: 19,
    avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Biomédica',
    program: 'Ingeniería Biomédica',
    semester: 3,
    interests: ['Voluntariado', 'Yoga', 'Lectura'],
    matchPercent: 75,
    commonPlace: 'Centro de Bienestar',
    online: false,
    bio: 'Futura médica comprometida con el servicio social y el bienestar integral.',
    connectionStatus: 'none',
  },
  {
    id: 'u11',
    name: 'Diego F.',
    age: 21,
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Electrónica',
    program: 'Ingeniería Electrónica',
    semester: 6,
    interests: ['Programación', 'Gaming', 'Música'],
    matchPercent: 90,
    commonPlace: 'Lab de Electrónica',
    online: true,
    bio: 'Ingeniero electrónico maker. Construyendo el futuro un proyecto a la vez.',
    connectionStatus: 'pending',
  },
  {
    id: 'u12',
    name: 'Camila H.',
    age: 20,
    avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Matemáticas',
    program: 'Matemáticas',
    semester: 5,
    interests: ['Música', 'Jazz', 'Baile'],
    matchPercent: 96,
    commonPlace: 'Auditorio Central',
    online: true,
    bio: 'Música de corazón. El jazz es mi lenguaje y el baile mi terapia.',
    connectionStatus: 'none',
  },
  {
    id: 'u13',
    name: 'Nicolás B.',
    age: 22,
    avatar: 'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Civil',
    program: 'Ingeniería Civil',
    semester: 8,
    interests: ['Arte', 'Diseño', 'Fotografía'],
    matchPercent: 84,
    commonPlace: 'Facultad de Arquitectura',
    online: false,
    bio: 'Arquitecto en formación obsesionado con la fotografía de espacios urbanos.',
    connectionStatus: 'none',
  },
  {
    id: 'u14',
    name: 'María José A.',
    age: 19,
    avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería',
    program: 'Ingeniería Ambiental',
    semester: 4,
    interests: ['Senderismo', 'Voluntariado', 'Fotografía'],
    matchPercent: 80,
    commonPlace: 'Jardín Botánico',
    online: true,
    bio: 'Ingeniera ambiental comprometida con la conservación. Amante de la naturaleza.',
    connectionStatus: 'none',
  },
  {
    id: 'u15',
    name: 'Juan Pablo M.',
    age: 21,
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Economía',
    program: 'Economía',
    semester: 7,
    interests: ['Emprendimiento', 'Lectura', 'Gastronomía'],
    matchPercent: 73,
    commonPlace: 'Biblioteca de Economía',
    online: false,
    bio: 'Economista y foodie. Creo que los mejores negocios se hacen alrededor de buena comida.',
    connectionStatus: 'pending',
  },
  {
    id: 'u16',
    name: 'Gabriela S.',
    age: 20,
    avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Industrial',
    program: 'Ingeniería Industrial',
    semester: 6,
    interests: ['Yoga', 'Emprendimiento', 'Música'],
    matchPercent: 88,
    commonPlace: 'Centro Deportivo',
    online: true,
    bio: 'Ingeniera industrial encontrando balance entre productividad y bienestar.',
    connectionStatus: 'connected',
  },
  {
    id: 'u17',
    name: 'Felipe R.',
    age: 22,
    avatar: 'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería',
    program: 'Ingeniería Mecánica',
    semester: 8,
    interests: ['Gaming', 'Fútbol', 'Programación'],
    matchPercent: 76,
    commonPlace: 'Taller de Mecánica',
    online: true,
    bio: 'Ingeniero mecánico gamer. La robótica es mi pasión.',
    connectionStatus: 'none',
  },
  {
    id: 'u18',
    name: 'Laura K.',
    age: 19,
    avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Administración de Empresas',
    program: 'Administración de Empresas',
    semester: 3,
    interests: ['Arte', 'Baile', 'Fotografía'],
    matchPercent: 91,
    commonPlace: 'Atelier de Moda',
    online: true,
    bio: 'Diseñadora de modas creando piezas que cuentan historias. El arte es mi lenguaje.',
    connectionStatus: 'none',
  },
  {
    id: 'u19',
    name: 'Alejandro T.',
    age: 21,
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería de Sistemas',
    program: 'Ingeniería de Sistemas',
    semester: 6,
    interests: ['Cine', 'Fotografía', 'Música'],
    matchPercent: 93,
    commonPlace: 'Estudio de Cine',
    online: false,
    bio: 'Cineasta en formación. Contando historias a través del lente.',
    connectionStatus: 'none',
  },
  {
    id: 'u20',
    name: 'Valentina C.',
    age: 20,
    avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Biomédica',
    program: 'Ingeniería Biomédica',
    semester: 5,
    interests: ['Programación', 'Voluntariado', 'Yoga'],
    matchPercent: 86,
    commonPlace: 'Lab de Biomédica',
    online: true,
    bio: 'Ingeniera biomédica fusionando tecnología y salud para mejorar vidas.',
    connectionStatus: 'none',
  },
  {
    id: 'u21',
    name: 'Roberto M.',
    age: 24,
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Maestría en Ingeniería de Sistemas',
    program: 'Maestría en Ingeniería de Sistemas',
    semester: 2,
    interests: ['Programación', 'Gaming', 'Música'],
    matchPercent: 91,
    commonPlace: 'Lab de Posgrados',
    online: true,
    bio: 'Estudiante de maestría especializándose en machine learning y sistemas distribuidos.',
    connectionStatus: 'none',
  },
  {
    id: 'u22',
    name: 'Diana P.',
    age: 21,
    avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Civil e Ingeniería Ambiental',
    program: 'Ingeniería Civil e Ingeniería Ambiental',
    semester: 7,
    interests: ['Senderismo', 'Voluntariado', 'Fotografía'],
    matchPercent: 94,
    commonPlace: 'Biblioteca Central',
    online: true,
    bio: 'Doble titulación en Civil y Ambiental. Apasionada por la sostenibilidad y construcciones verdes.',
    connectionStatus: 'none',
  },
];
export const parches: Parche[] = [
  {
    id: 'p1',
    name: 'Melómanos del Campus',
    description: 'Compartiendo vinilos, playlists y amor por la música 24/7. Todos los géneros bienvenidos.',
    category: 'Música',
    emoji: '🎵',
    coverColor: GRADIENT,
    type: 'public',
    members: 14,
    maxMembers: 20,
    memberAvatars: [
      'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
      'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
      'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    ],
    location: 'Auditorio Central',
    time: '18:00 - 20:00',
    date: 'Viernes',
    joined: true,
    trending: true,
    tags: ['Música', 'Vinilos', 'Playlists'],
    admin: 'Valentina R.',
    adminId: 'u2',
  },
  {
    id: 'p2',
    name: 'Gym Buddies',
    description: 'Rutina mañanera 6AM. Cardio, pesas y motivación. Comenzamos la semana con energía.',
    category: 'Deporte',
    emoji: '💪',
    coverColor: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)',
    type: 'public',
    members: 8,
    maxMembers: 12,
    memberAvatars: [
      'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
      'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    ],
    location: 'Gimnasio Campus',
    time: '06:00 - 07:30',
    date: 'Lunes a Viernes',
    joined: false,
    tags: ['Deporte', 'Fitness', 'Mañana'],
    admin: 'Daniel C.',
    adminId: 'u5',
  },
  {
    id: 'p3',
    name: 'Hackers Uni',
    description: 'Coffee & Python. Resolvemos problemas de algoritmos, hackatones y proyectos open source.',
    category: 'Tecnología',
    emoji: '💻',
    coverColor: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    type: 'public',
    members: 22,
    maxMembers: 30,
    memberAvatars: [
      'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
      'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
      'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    ],
    location: 'Sala de Cómputo 3',
    time: '16:00 - 19:00',
    date: 'Miércoles',
    joined: true,
    trending: true,
    tags: ['Python', 'Algoritmos', 'Open Source'],
    admin: 'Mateo S.',
    adminId: 'u3',
  },
  {
    id: 'p4',
    name: 'Estudio en la Biblio',
    description: 'Sesión de estudio enfocada. Mesas del fondo, los que tienen enchufes libres.',
    category: 'Estudio',
    emoji: '📚',
    coverColor: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
    type: 'public',
    members: 7,
    maxMembers: 10,
    memberAvatars: [
      'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
      'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    ],
    location: 'Biblioteca Central, Piso 3',
    time: '15:00 - 18:00',
    date: 'Hoy',
    joined: true,
    tags: ['Estudio', 'Concentración', 'Grupos'],
    admin: 'Sofía M.',
    adminId: 'u4',
  },
  {
    id: 'p5',
    name: 'Club de Lectura "Realismo Mágico"',
    description: 'Un parche tranquilo para disfrutar a Gabo y tomar café en La Candelaria.',
    category: 'Cultura',
    emoji: '📖',
    coverColor: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
    type: 'private',
    members: 8,
    maxMembers: 10,
    memberAvatars: [
      'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
      'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    ],
    location: 'La Candelaria, Café',
    time: '10:00 - 12:00',
    date: 'Sábado',
    joined: false,
    tags: ['Literatura', 'Café', 'Cultura'],
    admin: 'Valentina R.',
    adminId: 'u2',
  },
  {
    id: 'p6',
    name: 'Fútbol 5 - Los Pinos',
    description: 'Fútbol recreativo los jueves. Todos los niveles bienvenidos. Trae agua.',
    category: 'Deporte',
    emoji: '⚽',
    coverColor: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
    type: 'public',
    members: 10,
    maxMembers: 10,
    memberAvatars: [
      'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
      'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    ],
    location: 'Canchas Los Pinos',
    time: '17:00 - 18:30',
    date: 'Jueves',
    joined: false,
    tags: ['Fútbol', 'Deporte', 'Recreativo'],
    admin: 'Mateo S.',
    adminId: 'u3',
  },
];
export const events: Event[] = [
  {
    id: 'e1',
    title: 'Inter-U Music Fest 2024',
    description: 'La batalla de bandas más grande del año. Registro abierto hasta el viernes. Premios para las 3 mejores bandas universitarias.',
    category: 'Música',
    emoji: '🎸',
    date: '15 Mayo 2025',
    time: '15:00 - 22:00',
    location: 'Auditorio Principal',
    organizer: 'Dirección de Cultura',
    attendees: 450,
    coverImage: 'https://images.unsplash.com/photo-1772653519333-c1927e38f791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    coverGradient: GRADIENT,
    official: true,
    registered: true,
    reminder: true,
    tags: ['Música', 'Bandas', 'Concurso'],
  },
  {
    id: 'e2',
    title: 'After-Study: Rooftop',
    description: 'Tarde de networking y relajación en el rooftop del edificio internacional. DJ, snacks y buenas vibras.',
    category: 'Social',
    emoji: '🌅',
    date: '22 Abril 2025',
    time: '18:00 - 22:00',
    location: 'Edificio Internacional, Piso 12',
    organizer: 'Bienestar Universitario',
    attendees: 89,
    maxAttendees: 150,
    coverGradient: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)',
    official: false,
    registered: false,
    reminder: false,
    tags: ['Social', 'Networking', 'Rooftop'],
    isPast: true,
  },
  {
    id: 'e3',
    title: 'Taller: Bienestar Mental',
    description: 'Aprende técnicas de mindfulness, manejo del estrés académico y cómo construir hábitos saludables.',
    category: 'Bienestar',
    emoji: '🧠',
    date: '25 Abril 2025',
    time: '10:00 - 12:00',
    location: 'Sala de Bienestar, Bloque A',
    organizer: 'Psicología Universitaria',
    attendees: 34,
    maxAttendees: 50,
    coverGradient: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
    official: true,
    registered: false,
    reminder: true,
    tags: ['Bienestar', 'Salud Mental', 'Mindfulness'],
  },
  {
    id: 'e4',
    title: 'Hackathon ECI 2025',
    description: '48 horas de programación, diseño e innovación. Forma tu equipo y resuelve retos reales de la ciudad.',
    category: 'Tecnología',
    emoji: '🚀',
    date: '2 Mayo 2025',
    time: '08:00 - 08:00 (48h)',
    location: 'Laboratorio de Innovación',
    organizer: 'Facultad de Ingeniería',
    attendees: 120,
    maxAttendees: 200,
    coverGradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    official: true,
    registered: false,
    reminder: false,
    tags: ['Hackathon', 'Programación', 'Innovación'],
  },
  {
    id: 'e5',
    title: 'Feria de Emprendimiento',
    description: 'Presenta tu startup, conecta con inversores y descubre proyectos increíbles de estudiantes.',
    category: 'Emprendimiento',
    emoji: '💡',
    date: '10 Mayo 2025',
    time: '09:00 - 18:00',
    location: 'Plaza Central',
    organizer: 'Centro de Emprendimiento',
    attendees: 280,
    coverGradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
    official: true,
    registered: false,
    reminder: false,
    tags: ['Emprendimiento', 'Startup', 'Negocios'],
  },
  {
    id: 'e6',
    title: 'Taller: Muralismo',
    description: 'Aprende técnicas de muralismo urbano con artistas invitados. Transforma un muro del campus.',
    category: 'Arte',
    emoji: '🎨',
    date: '28 Abril 2025',
    time: '14:00 - 18:00',
    location: 'Facultad de Artes',
    organizer: 'Departamento de Arte',
    attendees: 25,
    maxAttendees: 30,
    coverGradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
    official: false,
    registered: false,
    reminder: false,
    tags: ['Arte', 'Muralismo', 'Urbano'],
    isPast: true,
  },
];
export const wellnessResources: WellnessResource[] = [
  { id: 'w1', name: 'Medicina General ECI', description: 'Consultas médicas generales, control de enfermedades y seguimiento de salud estudiantil.', category: 'SALUD', schedule: 'Lun–Vie 8:00 AM – 5:00 PM', contact: 'medicinageneral@escuelaing.edu.co', location: 'Bloque A, Piso 1', active: true },
  { id: 'w2', name: 'Enfermería y Primeros Auxilios', description: 'Atención de urgencias menores, primeros auxilios y acompañamiento en emergencias.', category: 'SALUD', schedule: 'Lun–Vie 7:00 AM – 7:00 PM', contact: 'enfermeria@escuelaing.edu.co', location: 'Entrada Principal', active: true },
  { id: 'w3', name: 'Nutrición y Alimentación Saludable', description: 'Asesoría nutricional personalizada para mejorar hábitos alimenticios y rendimiento académico.', category: 'SALUD', schedule: 'Mar y Jue 10:00 AM – 3:00 PM', contact: 'nutricion@escuelaing.edu.co', location: 'Bienestar, Bloque A', active: false },
  { id: 'w4', name: 'Liga de Fútbol Interfacultades', description: 'Torneos y entrenamientos de fútbol sala entre facultades, abiertos a todos los niveles.', category: 'DEPORTE', schedule: 'Lun, Mié y Vie 4:00 PM – 6:00 PM', contact: 'deportes@escuelaing.edu.co', location: 'Canchas Los Pinos', active: true },
  { id: 'w5', name: 'Yoga y Pilates', description: 'Clases de yoga y pilates para reducir el estrés y mejorar la flexibilidad y concentración.', category: 'DEPORTE', schedule: 'Mar y Jue 12:00 PM – 1:00 PM', contact: 'bienestar@escuelaing.edu.co', location: 'Sala Polideportiva', active: true },
  { id: 'w6', name: 'Natación Recreativa', description: 'Acceso a piscina y clases grupales de natación para estudiantes con carné ECI.', category: 'DEPORTE', schedule: 'Lun–Sáb 6:00 AM – 8:00 PM', contact: 'natacion@escuelaing.edu.co', location: 'Piscina ECI', active: false },
  { id: 'w7', name: 'Grupo de Teatro', description: 'Taller de actuación y expresión corporal. Presentaciones semestrales abiertas a la comunidad.', category: 'CULTURA', schedule: 'Viernes 3:00 PM – 6:00 PM', contact: 'teatro@escuelaing.edu.co', location: 'Auditorio B', active: true },
  { id: 'w8', name: 'Taller de Fotografía', description: 'Aprende fotografía análoga y digital, composición y edición con instructores profesionales.', category: 'CULTURA', schedule: 'Miércoles 2:00 PM – 5:00 PM', contact: 'fotografia@escuelaing.edu.co', location: 'Sala Multimedia', active: true },
  { id: 'w9', name: 'Cine Club ECI', description: 'Proyección y análisis de cine latinoamericano e independiente. Entrada libre para estudiantes.', category: 'CULTURA', schedule: 'Jueves 5:00 PM – 8:00 PM', contact: 'cineclub@escuelaing.edu.co', location: 'Auditorio Principal', active: false },
  { id: 'w10', name: 'Psicología Estudiantil', description: 'Atención psicológica individual y grupal. Apoyo en crisis, duelo, ansiedad y salud emocional.', category: 'MENTAL_HEALTH', schedule: 'Lun–Vie 8:00 AM – 5:00 PM', contact: 'psicologia@escuelaing.edu.co', location: 'Bloque A, Piso 2', active: true, phone: '601 745 6390 ext. 101' },
  { id: 'w11', name: 'Grupo de Apoyo: Estrés Académico', description: 'Sesiones grupales para manejar el estrés, la procrastinación y la presión del rendimiento académico.', category: 'MENTAL_HEALTH', schedule: 'Martes 4:00 PM – 6:00 PM', contact: 'bienestar@escuelaing.edu.co', location: 'Sala Bienestar', active: true },
  { id: 'w12', name: 'Orientación Vocacional y Proyecto de Vida', description: 'Acompañamiento en decisiones de carrera, exploración vocacional y construcción del proyecto de vida.', category: 'MENTAL_HEALTH', schedule: 'Lun–Vie 9:00 AM – 4:00 PM', contact: 'orientacion@escuelaing.edu.co', location: 'Bloque A, Piso 2', active: true },
];
export const vibraCategories = [
  { id: 'v1', name: 'Música en Vivo', emoji: '🎵', gradient: GRADIENT },
  { id: 'v2', name: 'Al Aire Libre', emoji: '🌿', gradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)' },
  { id: 'v3', name: 'Estudio', emoji: '📚', gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' },
  { id: 'v4', name: 'Gastronomía', emoji: '🍕', gradient: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)' },
  { id: 'v5', name: 'Videojuegos', emoji: '🎮', gradient: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)' },
  { id: 'v6', name: 'Arte y Cultura', emoji: '🎨', gradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)' },
];
export const monas: Mona[] = [
  // 🤝 Networking (12 medallas)
  { id: 'patricia-primer-contacto', name: 'Primer Contacto', description: 'Realizar tu primera conexión.', emoji: '🤝', category: 'networking', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: true, unlockedAt: 'Hace 2 meses', xp: 50, image: imgPrimerContacto },
  { id: 'patricia-networking-5', name: 'Networking 5', description: 'Tener 5 conexiones activas.', emoji: '👥', category: 'networking', color: '#10B981', bgColor: '#ECFDF5', rarity: 'poco común', unlocked: true, unlockedAt: 'Hace 1 mes', xp: 150, image: imgNetworking5 },
  { id: 'patricia-networking-10', name: 'Networking 10', description: 'Tener 10 conexiones activas.', emoji: '🌐', category: 'networking', color: '#06B6D4', bgColor: '#CFFAFE', rarity: 'raro', unlocked: false, xp: 350 },
  { id: 'patricia-networking-25', name: 'Networking 25', description: 'Tener 25 conexiones activas.', emoji: '🗣️', category: 'networking', color: '#8B5CF6', bgColor: '#F5F3FF', rarity: 'épico', unlocked: false, xp: 700, image: imgNetworking25 },
  { id: 'patricia-networking-50', name: 'Networking 50', description: 'Tener 50 conexiones activas.', emoji: '👑', category: 'networking', color: '#F59E0B', bgColor: '#FFFBEB', rarity: 'legendario', unlocked: false, xp: 1200 },
  { id: 'patricia-iniciador', name: 'Iniciador de Parche', description: 'Crear o unirte a tu primer parche.', emoji: '⚡', category: 'networking', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: true, unlockedAt: 'Hace 3 semanas', xp: 75, image: imgIniciadorParche },
  { id: 'patricia-capitan', name: 'Capitán de Equipo', description: 'Crear 2 parches.', emoji: '🏅', category: 'networking', color: '#10B981', bgColor: '#ECFDF5', rarity: 'poco común', unlocked: false, xp: 200, image: imgCapitanEquipo },
  { id: 'patricia-organizador-elite', name: 'Organizador Elite', description: 'Crear 10 parches exitosos.', emoji: '🔥', category: 'networking', color: '#8B5CF6', bgColor: '#F5F3FF', rarity: 'épico', unlocked: false, xp: 500, image: imgOrganizadorElite },
  { id: 'patricia-primer-mensajero', name: 'Primer Mensajero', description: 'Enviar el primer mensaje de un parche.', emoji: '💬', category: 'networking', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: true, unlockedAt: 'Hace 2 semanas', xp: 100, image: imgPrimerMensajero },
  { id: 'patricia-anfitrion', name: 'Anfitrión', description: 'Lograr que alguien se una a tu parche.', emoji: '🏠', category: 'networking', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: false, xp: 75, image: imgAnfitrion },
  { id: 'patricia-conector-veloz', name: 'Conector Veloz', description: 'Llegar a 10 conexiones en menos de 30 días.', emoji: '🚀', category: 'networking', color: '#8B5CF6', bgColor: '#F5F3FF', rarity: 'épico', unlocked: false, xp: 850, image: imgConectorVeloz },
  { id: 'patricia-embajador-campus', name: 'Embajador del Campus', description: 'Ayudar a conectar estudiantes de múltiples carreras.', emoji: '🌍', category: 'networking', color: '#F59E0B', bgColor: '#FFFBEB', rarity: 'legendario', unlocked: false, xp: 1500 },

  // ☕ Cafeterías (4 medallas)
  { id: 'patricia-explorador-cafeterias', name: 'Explorador de Cafeterías', description: '“Café con clase” — Visita Central, Regio, Leyenda y Harvies.', emoji: '☕', category: 'cafeterias', color: '#10B981', bgColor: '#ECFDF5', rarity: 'poco común', unlocked: true, unlockedAt: 'Ayer', xp: 200 },
  { id: 'patricia-fan-regio', name: 'Fan del Regio', description: '“Combo universitario” — Visita Regio 5 veces.', emoji: '🥤', category: 'cafeterias', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: false, xp: 100 },
  { id: 'patricia-cliente-frecuente', name: 'Cliente Frecuente', description: '“Mesa reservada” — Visita cafeterías 15 veces.', emoji: '🍽️', category: 'cafeterias', color: '#10B981', bgColor: '#ECFDF5', rarity: 'poco común', unlocked: false, xp: 250 },
  { id: 'patricia-ruta-cafe', name: 'Ruta del Café', description: '“Barista académico” — Visita todas las cafeterías del campus.', emoji: '🍩', category: 'cafeterias', color: '#06B6D4', bgColor: '#CFFAFE', rarity: 'raro', unlocked: false, xp: 450 },

  // 🏛️ Edificios (10 medallas)
  { id: 'patricia-edificio-a', name: 'Edificio A', description: '“Inicio de misión” — Visita el edificio A.', emoji: '🅰️', category: 'edificios', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: true, unlockedAt: 'Hace 2 meses', xp: 75 },
  { id: 'patricia-edificio-b', name: 'Edificio B', description: '“Ruta académica” — Visita el edificio B.', emoji: '🅱️', category: 'edificios', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: true, unlockedAt: 'Hace 2 meses', xp: 75 },
  { id: 'patricia-edificio-c', name: 'Edificio C', description: '“Circuito completo” — Visita el edificio C.', emoji: '🅲', category: 'edificios', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: false, xp: 75 },
  { id: 'patricia-edificio-d', name: 'Edificio D', description: '“Modo ingeniero” — Visita el edificio D.', emoji: '🅳', category: 'edificios', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: false, xp: 75 },
  { id: 'patricia-edificio-e', name: 'Edificio E', description: '“En construcción” — Visita el edificio E.', emoji: '🅔', category: 'edificios', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: false, xp: 75 },
  { id: 'patricia-edificio-f', name: 'Edificio F', description: '“Punto de encuentro” — Visita el edificio F.', emoji: '🅵', category: 'edificios', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: false, xp: 75 },
  { id: 'patricia-edificio-g', name: 'Edificio G', description: '“Zona de proyectos” — Visita el edificio G.', emoji: '🅶', category: 'edificios', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: false, xp: 75 },
  { id: 'patricia-edificio-h', name: 'Edificio H', description: '“Nivel avanzado” — Visita el edificio H.', emoji: '🅗', category: 'edificios', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: false, xp: 75 },
  { id: 'patricia-edificio-i', name: 'Edificio I', description: '“Destino final” — Visita el edificio I.', emoji: 'ℹ️', category: 'edificios', color: '#3B82F6', bgColor: '#DBEAFE', rarity: 'común', unlocked: false, xp: 75 },
  { id: 'patricia-tour-campus', name: 'Tour por el Campus', description: '“Ingeniero en movimiento” — Visita todos los edificios A-I.', emoji: '🏢', category: 'edificios', color: '#06B6D4', bgColor: '#CFFAFE', rarity: 'raro', unlocked: false, xp: 500, image: imgTourCampus },

  // 🌿 Lugares Emblemáticos y Actividad (5 medallas)
  { id: 'patricia-zen-master', name: 'Zen Máster', description: '“Paz entre circuitos” — Visita el Lago y Centro de Reflexión.', emoji: '🧘', category: 'actividad', color: '#10B981', bgColor: '#ECFDF5', rarity: 'poco común', unlocked: true, unlockedAt: 'Hace 1 semana', xp: 200 },
  { id: 'patricia-atleta-patio', name: 'Atleta de Patio', description: '“Dunk en el campus” — Visita la cancha de baloncesto.', emoji: '🏀', category: 'actividad', color: '#10B981', bgColor: '#ECFDF5', rarity: 'poco común', unlocked: false, xp: 150 },
  { id: 'patricia-maraton-universitaria', name: 'Maratón Universitaria', description: '“Sin perder el parcial” — Recorrer 5 zonas en un día.', emoji: '🏃', category: 'actividad', color: '#06B6D4', bgColor: '#CFFAFE', rarity: 'raro', unlocked: false, xp: 400, image: imgMaratonUniversitaria },
  { id: 'patricia-noctambulo-academico', name: 'Noctámbulo Académico', description: '“Último en salir” — Permanecer en campus en horario nocturno.', emoji: '🦉', category: 'actividad', color: '#06B6D4', bgColor: '#CFFAFE', rarity: 'raro', unlocked: false, xp: 300 },
  { id: 'patricia-amanecer-productivo', name: 'Amanecer Productivo', description: '“Primera clase survivor” — Ingresar antes de las 7 AM durante 5 días.', emoji: '🌅', category: 'actividad', color: '#06B6D4', bgColor: '#CFFAFE', rarity: 'raro', unlocked: false, xp: 300 },

  // 🎉 Eventos y Participación (2 medallas)
  { id: 'patricia-asistente-vip', name: 'Asistente VIP', description: '“Siempre presente” — Asistir a un evento institucional.', emoji: '🎟️', category: 'eventos', color: '#06B6D4', bgColor: '#CFFAFE', rarity: 'raro', unlocked: false, xp: 300 },
  { id: 'patricia-invitado-especial', name: 'Invitado Especial', description: '“Figura pública” — Asistir a 5 eventos.', emoji: '👑', category: 'eventos', color: '#8B5CF6', bgColor: '#F5F3FF', rarity: 'épico', unlocked: false, xp: 500 },

  // 👑 Medallas Legendarias (2 medallas)
  { id: 'patricia-conquistador-campus', name: 'Conquistador del Campus', description: 'Visitar todos los lugares importantes.', emoji: '🗺️', category: 'legendarias', color: '#8B5CF6', bgColor: '#F5F3FF', rarity: 'épico', unlocked: false, xp: 1000, image: imgConquistadorCampus },
  { id: 'patricia-leyenda-campus', name: 'Leyenda del Campus', description: 'Obtener 30 patricias.', emoji: '🌟', category: 'legendarias', color: '#F59E0B', bgColor: '#FFFBEB', rarity: 'legendario', unlocked: false, xp: 1500, image: imgLeyendaCampus },
];
export const directChats: DirectChat[] = [
  {
    id: 'dc1',
    userId: 'u2',
    name: 'Mariana Malagón',
    avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería de Sistemas',
    lastMessage: 'Me encantaron las fotos del último parche! 📸',
    lastTime: 'Ahora',
    unread: 2,
    online: true,
    accentColor: '#8B5CF6',
  },
  {
    id: 'dc2',
    userId: 'u3',
    name: 'Diego Fabian Andrade',
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería de Sistemas',
    lastMessage: 'Claro! Te paso el repo en un rato 💻',
    lastTime: '10 min',
    unread: 0,
    online: false,
    accentColor: '#3B82F6',
  },
  {
    id: 'dc3',
    userId: 'u4',
    name: 'Maria Jose Perez',
    avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Biomédica',
    lastMessage: 'Nos vemos en la biblio entonces! 📚',
    lastTime: '2h',
    unread: 0,
    online: true,
    accentColor: '#10B981',
  },
  {
    id: 'dc4',
    userId: 'u5',
    name: 'David Santiago Cajamarca',
    avatar: 'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería de Sistemas',
    lastMessage: '¿Tienes el link del meet? 🎮',
    lastTime: '1d',
    unread: 1,
    online: true,
    accentColor: '#06B6D4',
  },
  {
    id: 'dc5',
    userId: 'u6',
    name: 'Stiven Esneider Pardo',
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Industrial',
    lastMessage: '¿Vamos al parche de estudio esta tarde?',
    lastTime: '3h',
    unread: 0,
    online: false,
    accentColor: '#F59E0B',
  },
  {
    id: 'dc6',
    userId: 'u7',
    name: 'Juan David Gómez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    faculty: 'Ingeniería Civil',
    lastMessage: '¡El proyecto quedó increíble! 🏗️',
    lastTime: '1d',
    unread: 0,
    online: true,
    accentColor: '#EC4899',
  },
];
export const chatMessages: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'Diego Fabian',
    senderId: 'u3',
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    content: '¡Hola equipo! Ya estoy en la mesa del fondo, la que tiene los enchufes libres. 🔌',
    timestamp: '15:02',
    type: 'text',
  },
  {
    id: 'm2',
    sender: 'Mariana',
    senderId: 'u6',
    avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    content: 'Súper, llego en 5. ¿Alguien quiere un café? Paso por el Oxxo.',
    timestamp: '15:05',
    type: 'text',
  },
  {
    id: 'm3',
    sender: 'Tú',
    senderId: 'u1',
    avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    content: '¡Yo! Un latte frío si se puede Mariana. Mil gracias! ✨',
    timestamp: '15:07',
    type: 'text',
    isMe: true,
  },
  {
    id: 'm4',
    sender: 'Sistema',
    senderId: 'system',
    avatar: '',
    content: 'Stiven Esneider se unió al parche',
    timestamp: '15:10',
    type: 'system',
  },
  {
    id: 'm5',
    sender: 'David Santiago',
    senderId: 'u5',
    avatar: 'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    content: '¡Acá estamos!',
    timestamp: '15:12',
    type: 'text',
  },
  {
    id: 'm6',
    sender: 'Carlos',
    senderId: 'u5',
    avatar: 'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    content: 'Encontré el libro que necesitaban para cálculo 📚',
    timestamp: '15:13',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1763890965393-1cea435581ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'm7',
    sender: 'Mateo',
    senderId: 'u3',
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    content: '¿Alguien ya terminó los ejercicios del capítulo 3? Estoy atascado en el ejercicio 7.',
    timestamp: '15:20',
    type: 'text',
  },
  {
    id: 'm8',
    sender: 'Tú',
    senderId: 'u1',
    avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=50',
    content: 'Sí! Te lo explico cuando llegue, es más fácil con un diagrama 🙌',
    timestamp: '15:21',
    type: 'text',
    isMe: true,
  },
];
export const interestOptions = [
  { id: 'musica', label: 'Música', emoji: '🎵' },
  { id: 'programacion', label: 'Programación', emoji: '💻' },
  { id: 'fotografia', label: 'Fotografía', emoji: '📸' },
  { id: 'diseño', label: 'Diseño', emoji: '🎨' },
  { id: 'futbol', label: 'Fútbol', emoji: '⚽' },
  { id: 'senderismo', label: 'Senderismo', emoji: '🏔️' },
  { id: 'lectura', label: 'Lectura', emoji: '📚' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'gastronomia', label: 'Gastronomía', emoji: '🍕' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'emprendimiento', label: 'Emprendimiento', emoji: '🚀' },
  { id: 'arte', label: 'Arte', emoji: '🖼️' },
  { id: 'cine', label: 'Cine', emoji: '🎬' },
  { id: 'baile', label: 'Baile', emoji: '💃' },
  { id: 'voluntariado', label: 'Voluntariado', emoji: '🤝' },
  { id: 'cocina', label: 'Cocina', emoji: '👨‍🍳' },
];
export interface RankingUser {
  id: string;
  name: string;
  avatar: string;
  faculty: string;
  xp: number;
  level: number;
  monasCount: number;
  parchesCount: number;
  streak: number;
  isCurrentUser?: boolean;
}
export const rankingUsers: RankingUser[] = [
  {
    id: 'rank1',
    name: 'Alejandro V.',
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Ingeniería de Sistemas',
    xp: 5850,
    level: 18,
    monasCount: 22,
    parchesCount: 12,
    streak: 25,
  },
  {
    id: 'rank2',
    name: 'Camila O.',
    avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Ingeniería Industrial',
    xp: 5200,
    level: 17,
    monasCount: 25,
    parchesCount: 13,
    streak: 18,
  },
  {
    id: 'rank3',
    name: 'Santiago B.',
    avatar: 'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Ingeniería de Sistemas',
    xp: 4800,
    level: 16,
    monasCount: 17,
    parchesCount: 16,
    streak: 15,
  },
  {
    id: 'u1',
    name: 'Patricia S.',
    avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Ingeniería de Sistemas',
    xp: 3450,
    level: 14,
    monasCount: 11,
    parchesCount: 8,
    streak: 12,
    isCurrentUser: true,
  },
  {
    id: 'rank5',
    name: 'Valentina R.',
    avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Ingeniería de Sistemas',
    xp: 3200,
    level: 13,
    monasCount: 9,
    parchesCount: 7,
    streak: 10,
  },
  {
    id: 'rank6',
    name: 'Mateo S.',
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Ingeniería de Sistemas',
    xp: 2900,
    level: 12,
    monasCount: 8,
    parchesCount: 6,
    streak: 8,
  },
  {
    id: 'rank7',
    name: 'Sofía M.',
    avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Ingeniería Biomédica',
    xp: 2700,
    level: 11,
    monasCount: 7,
    parchesCount: 5,
    streak: 7,
  },
  {
    id: 'rank8',
    name: 'Daniel C.',
    avatar: 'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Ingeniería de Sistemas',
    xp: 2500,
    level: 10,
    monasCount: 6,
    parchesCount: 9,
    streak: 6,
  },
  {
    id: 'rank9',
    name: 'Laura B.',
    avatar: 'https://images.unsplash.com/photo-1641253762691-b5c07939449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Ingeniería Biomédica',
    xp: 2300,
    level: 9,
    monasCount: 6,
    parchesCount: 4,
    streak: 5,
  },
  {
    id: 'rank10',
    name: 'Carlos A.',
    avatar: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Ingeniería Civil',
    xp: 2100,
    level: 9,
    monasCount: 5,
    parchesCount: 4,
    streak: 4,
  },
  {
    id: 'rank11',
    name: 'Andrea L.',
    avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Administración de Empresas',
    xp: 1900,
    level: 8,
    monasCount: 4,
    parchesCount: 3,
    streak: 3,
  },
  {
    id: 'rank12',
    name: 'Pablo M.',
    avatar: 'https://images.unsplash.com/photo-1766066014773-0074bf4911de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    faculty: 'Ingeniería Industrial',
    xp: 1700,
    level: 7,
    monasCount: 3,
    parchesCount: 3,
    streak: 2,
  },
];
export const notifications: Notification[] = [
  {
    id: 'notif1',
    type: 'chat',
    title: 'Nuevo mensaje de Sofía García',
    message: '¡Hey! ¿Vienes al parche de estudio mañana?',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    color: '#3B82F6',
    timestamp: 'Hace 5 min',
    read: false,
    actionUrl: '/chats/chat1',
  },
  {
    id: 'notif2',
    type: 'match',
    title: 'Nueva solicitud de conexión',
    message: 'Carlos Mendoza quiere conectar contigo (85% compatibilidad)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    color: '#EC4899',
    timestamp: 'Hace 15 min',
    read: false,
    actionUrl: '/matches',
  },
  {
    id: 'notif3',
    type: 'parche_invitation',
    title: 'Invitación a parche',
    message: 'Te invitaron a "Gaming Night ECI" - Viernes 7:00 PM',
    icon: '🎮',
    color: '#6366F1',
    timestamp: 'Hace 1 hora',
    read: false,
    actionUrl: '/parches',
  },
  {
    id: 'notif4',
    type: 'event_reminder',
    title: 'Evento próximo',
    message: 'Hackathon ECI 2025 comienza en 2 días',
    icon: '💻',
    color: '#10B981',
    timestamp: 'Hace 2 horas',
    read: true,
    actionUrl: '/events',
  },
  {
    id: 'notif5',
    type: 'event',
    title: 'Nuevo evento cercano',
    message: 'Festival de Música en Campus - Sábado 3:00 PM',
    icon: '🎵',
    color: '#8B5CF6',
    timestamp: 'Hace 3 horas',
    read: true,
    actionUrl: '/events',
  },
  {
    id: 'notif6',
    type: 'chat',
    title: 'Nuevo mensaje en grupo',
    message: 'Parche de Estudio: Alguien compartió apuntes de Cálculo',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    color: '#3B82F6',
    timestamp: 'Hace 5 horas',
    read: true,
    actionUrl: '/chats',
  },
  {
    id: 'notif7',
    type: 'match',
    title: 'Nueva conexión aceptada',
    message: 'María Torres aceptó tu solicitud de conexión',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    color: '#EC4899',
    timestamp: 'Ayer',
    read: true,
    actionUrl: '/matches',
  },
  {
    id: 'notif8',
    type: 'parche_invitation',
    title: 'Invitación aceptada',
    message: 'Te uniste exitosamente a "Café y Conversa"',
    icon: '☕',
    color: '#F59E0B',
    timestamp: 'Ayer',
    read: true,
    actionUrl: '/parches',
  },
];