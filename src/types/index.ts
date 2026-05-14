export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  faculty: string;
  program?: string;
  semester: number;
  interests: string[];
  bio: string;
  socialImpact: number;
  xp: number;
  level: number;
  activeParches: number;
  streak: number;
  rankFaculty: number;
  monas: string[];
}
export interface GeoState {
  enabled: boolean;
  loading: boolean;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  onCampus: boolean;
  detectedZone: string | null;
  mapX: number | null;
  mapY: number | null;
  error: string | null;
}
export interface Parche {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  members: number;
  maxMembers: number;
  location: string;
  schedule: string;
  tags: string[];
  isPrivate: boolean;
  isTrending: boolean;
  coverGradient: string;
  joined: boolean;
  pendingInvite: boolean;
  organizer: string;
}
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  emoji: string;
  coverGradient: string;
  attendees: number;
  maxAttendees: number;
  isRegistered: boolean;
  isFeatured: boolean;
  tags: string[];
  organizer: string;
  price: number;
}
export interface Match {
  id: string;
  name: string;
  avatar: string;
  faculty: string;
  program: string;
  semester: number;
  interests: string[];
  compatibility: number;
  location: string;
  isConnected: boolean;
  isPending: boolean;
}
export interface ChatMessage {
  id: string;
  sender: string;
  senderId: string;
  avatar: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  type: 'text' | 'image' | 'emoji';
}
export interface ChatConversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isGroup: boolean;
  members?: number;
  online?: boolean;
}
export interface Mona {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: string;
  color: string;
  bgColor: string;
  rarity: string;
  unlocked: boolean;
  condition: string;
  xp: number;
}
export interface Notification {
  id: string;
  type: 'match' | 'parche' | 'event' | 'mona' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
}