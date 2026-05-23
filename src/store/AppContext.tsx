import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { notifications as initialNotifications, type Notification } from '../types/mockData';
import { decodeTokenToUser, clearAuth } from '../services/auth.service';

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

function getInitialAuthState(): { isLoggedIn: boolean; currentUser: User | null } {
  const token = localStorage.getItem('patricia-token');
  if (!token) return { isLoggedIn: false, currentUser: null };
  try {
    const user = decodeTokenToUser(token);
    return { isLoggedIn: true, currentUser: user };
  } catch {
    return { isLoggedIn: false, currentUser: null };
  }
}

export function AppProvider({ children }: { readonly children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const initialAuth = getInitialAuthState();
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth.isLoggedIn);
  const [currentUser, setCurrentUser] = useState<User | null>(initialAuth.currentUser);
  const [notificationsList, setNotificationsList] = useState<Notification[]>(initialNotifications);
  const [geo, setGeoState] = useState<GeoState>(GEO_INITIAL);

  useEffect(() => {
    const saved = localStorage.getItem('patricia-theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
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
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    clearAuth();
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

  const value = useMemo(() => ({
    isDark, toggleTheme,
    isLoggedIn, currentUser, login, logout,
    notifications: unreadNotificationsCount,
    notificationsList,
    setNotificationsList,
    geo, updateGeo, toggleGeo,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [isDark, isLoggedIn, currentUser, unreadNotificationsCount, notificationsList, geo, updateGeo, toggleGeo]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
