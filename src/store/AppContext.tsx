import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { notifications as initialNotifications, type Notification } from '../types/mockData';
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
  studentId?: string;
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
const GEO_INITIAL: GeoState = {
  enabled: false,
  loading: false,
  lat: null,
  lng: null,
  accuracy: null,
  onCampus: false,
  detectedZone: null,
  mapX: null,
  mapY: null,
  error: null,
};
interface AppContextType {
  isDark: boolean;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  notifications: number;
  notificationsList: Notification[];
  setNotificationsList: React.Dispatch<React.SetStateAction<Notification[]>>;
  geo: GeoState;
  updateGeo: (patch: Partial<GeoState>) => void;
  toggleGeo: () => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
const mockCurrentUser: User = {
  id: 'u1',
  name: 'Patricia S.',
  email: 'patricia.smith@universidad.edu.co',
  avatar: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
  faculty: 'Ingeniería de Sistemas',
  program: 'Ingeniería de Sistemas',
  semester: 6,
  interests: ['Programación', 'Fotografía', 'Música', 'Diseño', 'Gaming'],
  bio: 'Estudiante de sistemas apasionada por el diseño y la tecnología. Busco personas con quienes aprender y crear cosas geniales.',
  socialImpact: 1240,
  xp: 3450,
  level: 14,
  activeParches: 8,
  streak: 12,
  rankFaculty: 4,
  monas: ['tech-puppy', 'honors', 'social', 'pionera', 'genio'],
  studentId: '2023123456',
};
export function AppProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(mockCurrentUser);
  // Pre-seed localStorage so the hangout service interceptor can read the studentId
  if (!localStorage.getItem('patricia-user')) {
    localStorage.setItem('patricia-user', JSON.stringify(mockCurrentUser));
  }
  const [notificationsList, setNotificationsList] = useState<Notification[]>(initialNotifications);
  const [geo, setGeoState] = useState<GeoState>(GEO_INITIAL);
  useEffect(() => {
    const saved = localStorage.getItem('patricia-theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
    const savedLogin = localStorage.getItem('patricia-logged-in');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
      setCurrentUser(mockCurrentUser);
    }
    const savedGeo = localStorage.getItem('patricia-geo-enabled') === 'true';
    if (savedGeo) {
      setGeoState(prev => ({ ...prev, enabled: true }));
    }
  }, []);
  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('patricia-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('patricia-theme', 'light');
      }
      return next;
    });
  };
  const login = (user: User) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    localStorage.setItem('patricia-logged-in', 'true');
    localStorage.setItem('patricia-user', JSON.stringify(user));
  };
  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('patricia-logged-in');
    localStorage.removeItem('patricia-user');
  };
  const updateGeo = useCallback((patch: Partial<GeoState>) => {
    setGeoState(prev => ({ ...prev, ...patch }));
  }, []);
  const toggleGeo = useCallback(() => {
    setGeoState(prev => {
      const next = !prev.enabled;
      localStorage.setItem('patricia-geo-enabled', String(next));
      if (!next) {
        return { ...GEO_INITIAL, enabled: false };
      }
      return { ...prev, enabled: true, loading: true, error: null };
    });
  }, []);
  const unreadNotificationsCount = notificationsList.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        isDark, toggleTheme,
        isLoggedIn, currentUser, login, logout,
        notifications: unreadNotificationsCount,
        notificationsList,
        setNotificationsList,
        geo, updateGeo, toggleGeo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}