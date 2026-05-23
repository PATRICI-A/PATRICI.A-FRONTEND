import * as React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, MapPin, X, ChevronUp, ChevronDown, ChevronRight, Calendar,
  Building2, GraduationCap, Monitor, FlaskConical, Zap, Wrench, Radio,
  Trophy, Activity, Droplets, Leaf, UtensilsCrossed,
  Navigation, Car, Map, Cpu,
  LocateFixed, Locate, AlertTriangle, CheckCircle2, Loader2, AlertCircle,
} from 'lucide-react';
import SportsBasketball from '@mui/icons-material/SportsBasketball';
import SportsTennis from '@mui/icons-material/SportsTennis';
import SportsVolleyball from '@mui/icons-material/SportsVolleyball';
import SportsSoccer from '@mui/icons-material/SportsSoccer';
import { useApp } from '../store/AppContext';
import { events, GOLD_GRADIENT, GOLD_LIGHT, GRADIENT } from '../types/mockData';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import campusMap from '../assets/campus_map.png';
type LucideIconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
type LandmarkFilter = 'all' | 'edificios' | 'zonas' | 'deporte' | 'alimento' | 'bienestar';
interface Landmark {
  id: string;
  name: string;
  shortName: string;
  x: number; // % left
  y: number; // % top
  Icon: LucideIconType;
  color: string;
  type: 'building' | 'food' | 'sport' | 'nature' | 'entry';
}

const LANDMARKS: Landmark[] = [
  { id: 'bloque-a', name: 'Bloque A',           shortName: 'A',       x: 71.3, y: 52.7, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'bloque-b', name: 'Bloque B',           shortName: 'B',       x: 71.5, y: 44.2, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'bloque-c', name: 'Bloque C',           shortName: 'C',       x: 76.9, y: 68.7, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'bloque-d', name: 'Bloque D',           shortName: 'D',       x: 56.9, y: 38.0, Icon: GraduationCap,  color: '#6366F1', type: 'building' },
  { id: 'bloque-e', name: 'Bloque E',           shortName: 'E',       x: 55.9, y: 58.2, Icon: Wrench,         color: '#0EA5E9', type: 'building' },
  { id: 'bloque-f', name: 'Bloque F',           shortName: 'F',       x: 62.1, y: 24.0, Icon: Monitor,        color: '#8B5CF6', type: 'building' },
  { id: 'bloque-g', name: 'Bloque G',           shortName: 'G',       x: 72.3, y: 29.7, Icon: FlaskConical,   color: '#EC4899', type: 'building' },
  { id: 'bloque-h', name: 'Bloque H',           shortName: 'H',       x: 34.2, y: 84.2, Icon: Zap,            color: '#F59E0B', type: 'building' },
  { id: 'bloque-i', name: 'Bloque I',           shortName: 'I',       x: 44.2, y: 79.6, Icon: Cpu,            color: '#10B981', type: 'building' },
  { id: 'bloque-l', name: 'Bloque L',           shortName: 'L',       x: 44.6, y: 25.9, Icon: Radio,          color: '#06B6D4', type: 'building' },
  { id: 'coliseo',  name: 'Coliseo El Otoño',   shortName: 'C',       x: 9.2, y: 41.8, Icon: Trophy,         color: '#EF4444', type: 'building'    },
  { id: 'diali',    name: 'Diali',              shortName: 'D',       x: 44.6, y: 37.4, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'reggio',   name: 'Reggio\'s',          shortName: 'R',       x: 51.6, y: 46.4, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'harvies-b',name: 'Harvies',            shortName: 'H',       x: 24.1, y: 26.4, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'bienestar',name: 'Bienestar',          shortName: 'B',       x: 78.3, y: 53.2, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'z1',       name: 'Z1',                 shortName: 'Z1',      x: 63.5, y: 38.7, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'z2',       name: 'Z2',                 shortName: 'Z2',      x: 50.1, y: 57.4, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'z3',       name: 'Z3',                 shortName: 'Z3',      x: 33.8, y: 50.8, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'futbol',   name: 'Fútbol',             shortName: 'Fútbol',  x: 23.3, y: 41.5, Icon: Activity,      color: '#16A34A', type: 'building' },
  { id: 'lago',     name: 'El Lago',            shortName: 'Lago',    x: 33, y: 40, Icon: Droplets,       color: '#0284C7', type: 'nature'   },
  { id: 'nativos',  name: 'Nativos',            shortName: 'Nativos', x: 50, y: 58, Icon: Leaf,           color: '#15803D', type: 'nature'   },
  { id: 'basket',    name: 'Basket',             shortName: 'Basket',  x: 11.5, y: 7.9,  Icon: Building2,    color: '#3B82F6', type: 'building' },
  { id: 'tennis',    name: 'Tennis',             shortName: 'Tennis',  x: 9.9,  y: 18.9, Icon: Building2,    color: '#3B82F6', type: 'building' },
  { id: 'volley',    name: 'Volley',             shortName: 'Volley',  x: 14.7, y: 24.0, Icon: Building2,    color: '#3B82F6', type: 'building' },
  { id: 'entrada-p', name: 'Entrada Peatonal',  shortName: 'Peat.',   x: 90, y: 27, Icon: Navigation,     color: '#475569', type: 'entry'    },
  { id: 'entrada-v', name: 'Entrada Vehicular', shortName: 'Veh.',    x: 89, y: 72, Icon: Car,            color: '#475569', type: 'entry'    },
];
const EVENT_LOCATION: Record<string, string> = {
  e1: 'bloque-d',
  e2: 'bloque-f',
  e3: 'bloque-a',
  e4: 'bloque-f',
  e5: 'bloque-l',
  e6: 'bloque-g',
};

const FILTERS = [
  { key: 'all', label: 'Todo', Icon: Map },
  { key: 'edificios', label: 'Edificios', Icon: Building2 },
  { key: 'zonas', label: 'Zonas', Icon: Leaf },
  { key: 'deporte', label: 'Deporte', Icon: Activity },
  { key: 'alimento', label: 'Alimento', Icon: UtensilsCrossed },
  { key: 'bienestar', label: 'Bienestar', Icon: CheckCircle2 },
] as const;

const LANDMARK_CATEGORY_IDS = {
  edificios: new Set(['bloque-a', 'bloque-b', 'bloque-c', 'bloque-d', 'bloque-e', 'bloque-f', 'bloque-g', 'bloque-h', 'bloque-i', 'bloque-l']),
  zonas: new Set(['z1', 'z2', 'z3']),
  deporte: new Set(['coliseo', 'basket', 'tennis', 'volley', 'futbol']),
  alimento: new Set(['harvies-b', 'diali', 'reggio']),
  bienestar: new Set(['bienestar']),
} satisfies Record<Exclude<LandmarkFilter, 'all'>, Set<string>>;

function getLandmarkCategory(lm: Landmark): Exclude<LandmarkFilter, 'all'> | null {
  for (const [category, ids] of Object.entries(LANDMARK_CATEGORY_IDS) as Array<[Exclude<LandmarkFilter, 'all'>, Set<string>]>) {
    if (ids.has(lm.id)) return category;
  }
  return null;
}

function EventPinIcon({ emoji, size = 14, color = 'white' }: { emoji: string; size?: number; color?: string }) {
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.8), color }}>
      {emoji}
    </div>
  );
}

function GeoBanner({ isDark, geo }: { isDark: boolean; geo: any }) {
  if (!geo) return null;
  const Icon = geo.loading ? <Loader2 size={16} className="animate-spin" /> : geo.error ? <AlertCircle size={16} /> : geo.onCampus ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />;
  const bg = geo.loading ? (isDark ? '#0C2A45' : '#E0F7FA') : geo.error ? (isDark ? '#2D1515' : '#FEF2F2') : geo.onCampus ? (isDark ? '#0D2A1E' : '#ECFDF5') : (isDark ? '#2D2010' : '#FFFBEB');
  const text = geo.loading ? 'Buscando ubicación…' : geo.error ? 'Error GPS' : geo.onCampus ? (geo.detectedZone ? geo.detectedZone.replace('Cerca de ', '') : 'En campus') : 'Fuera del campus';
  const subtext = geo.loading ? '' : geo.error ? String(geo.error) : '';

  if (!geo.enabled && !geo.loading && !geo.error) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        background: bg,
        borderBottom: `1px solid ${isDark ? '#1E3A5F55' : '#E5E7EB55'}`,
        overflow: 'hidden',
      }}
    >
      <div className="flex items-center gap-2 px-4 py-2">
        {Icon}
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-bold text-gray-900 dark:text-white">{text}</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-2">{subtext}</span>
        </div>
        {geo.onCampus && (
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ background: 'linear-gradient(135deg,#10B981,#06B6D4)' }}
          >
            En campus
          </span>
        )}
      </div>
    </motion.div>
  );
}
export function CampusMapPage() {
  const navigate = useNavigate();
  const { isDark, currentUser, geo, updateGeo, toggleGeo } = useApp();
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<LandmarkFilter>('all');
  const [iconSize, setIconSize] = useState<number>(12);
  const MAP_FIXED_WIDTH = 1200; // px — fixed inner map width with internal scrollbar
  // mapRenderWidth: actual width used to render map (either MAP_FIXED_WIDTH or viewport width when viewport > MAP_FIXED_WIDTH)
  const [mapRenderWidth, setMapRenderWidth] = useState<number>(MAP_FIXED_WIDTH);
  useEffect(() => {
    const computeMapWidth = () => {
      const vw = typeof window !== 'undefined' ? window.innerWidth : MAP_FIXED_WIDTH;
      setMapRenderWidth(vw > MAP_FIXED_WIDTH ? vw : MAP_FIXED_WIDTH);
    };
    computeMapWidth();
    window.addEventListener('resize', computeMapWidth);
    return () => window.removeEventListener('resize', computeMapWidth);
  }, []);
  // pin scale relative to the baseline MAP_FIXED_WIDTH
  const rawPinScale = mapRenderWidth / MAP_FIXED_WIDTH;
  const pinScale = Math.max(0.7, Math.min(rawPinScale, 1.6));
  useEffect(() => {
    function calc() {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
      let s = 12;
      if (w < 420) s = 8;
      else if (w < 768) s = 10;
      else if (w < 1024) s = 11;
      else s = 12; // cap max size to 12 on large screens
      setIconSize(s);
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  const [isMobile, setIsMobile] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const watchIdRef = useRef<number | null>(null);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Hide document-level scrollbar on desktop so only the app root scrolls
  useEffect(() => {
    if (isMobile) return;
    const doc = document.documentElement;
    const prev = doc.style.overflow;
    doc.style.overflow = 'hidden';
    return () => { doc.style.overflow = prev; };
  }, [isMobile]);
  
  useEffect(() => {
    if (!geo.enabled) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }
    if (!('geolocation' in navigator)) {
      updateGeo({ loading: false, error: 'Tu dispositivo no soporta GPS' });
      return;
    }

    const applyPosition = (pos: GeolocationPosition) => {
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      const onCampus = isOnCampus(lat, lng);
      const { x: mapX, y: mapY } = coordsToMapPct(lat, lng);
      const detectedZone = onCampus ? detectZone(mapX, mapY, LANDMARKS) : null;
      updateGeo({
        loading: false,
        lat, lng, accuracy,
        onCampus,
        detectedZone,
        mapX: onCampus ? mapX : null,
        mapY: onCampus ? mapY : null,
        error: null,
      });
    };

    const handleError = (err: GeolocationPositionError) => {
      const messages: Record<number, string> = {
        1: 'Permiso de ubicación denegado',
        2: 'Ubicación no disponible',
        3: 'Tiempo de espera agotado',
      };
      updateGeo({
        loading: false,
        error: messages[err.code] ?? 'Error al obtener ubicación',
        onCampus: false,
        detectedZone: null,
      });
    };

    updateGeo({ loading: true, error: null });

    // Quick low-accuracy fix so the user sees a position immediately
    navigator.geolocation.getCurrentPosition(applyPosition, () => { /* continue watching */ }, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 60000,
    });

    // Continuous high-accuracy tracking
    watchIdRef.current = navigator.geolocation.watchPosition(applyPosition, handleError, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 5000,
    });

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.enabled, updateGeo]);
  const mappedEvents = events.filter(ev => EVENT_LOCATION[ev.id]);
  const getEventsAt = useCallback((lmId: string) =>
    mappedEvents.filter(e => EVENT_LOCATION[e.id] === lmId), [mappedEvents]);
  
  const visibleLandmarks = activeFilter === 'all'
    ? LANDMARKS.filter(lm => getLandmarkCategory(lm) !== null)
    : LANDMARKS.filter(lm => getLandmarkCategory(lm) === activeFilter);
  const handlePin = (lm: Landmark) => {
    setSelectedLandmark(prev => prev?.id === lm.id ? null : lm);
    setEventsOpen(false);
  };
  const selectedEvents = selectedLandmark ? getEventsAt(selectedLandmark.id) : [];
  const selectedHasEvents = selectedEvents.length > 0;
  const selectedHeaderBg = selectedHasEvents ? 'rgba(194,120,0,0.14)' : 'rgba(30,64,175,0.14)';
  const selectedHeaderBorder = selectedHasEvents ? 'rgba(194,120,0,0.22)' : 'rgba(30,64,175,0.22)';
  const selectedIconBg = selectedHasEvents ? GOLD_GRADIENT : '#1E40AF';
  const selectedBlockLabel = selectedLandmark?.id.startsWith('bloque-')
    ? `Edificio ${selectedLandmark.id.replace('bloque-', '').toUpperCase()}`
    : selectedLandmark?.name ?? '';
  const selectedLandmarkTitle = selectedLandmark?.id === 'z1'
    ? 'Zona 1'
    : selectedLandmark?.id === 'z2'
    ? 'Zona 2'
    : selectedLandmark?.id === 'z3'
    ? 'Zona 3'
    : selectedLandmark?.id === 'basket'
    ? 'Cancha de Basket'
    : selectedLandmark?.id === 'tennis'
    ? 'Cancha de Tenis'
    : selectedLandmark?.id === 'volley'
    ? 'Cancha de Volley'
    : selectedLandmark?.id === 'futbol'
    ? 'Cancha de Fútbol'
    : selectedBlockLabel;
  const popupLeft = selectedLandmark ? selectedLandmark.x < 55 : true;
  const USER_PIN_DEFAULT = { x: 87, y: 30 };
  const userPin = (geo.enabled && geo.onCampus && geo.mapX !== null && geo.mapY !== null)
    ? { x: geo.mapX, y: geo.mapY }
    : USER_PIN_DEFAULT;
  const showUserPin = geo.enabled;
  const geoButtonConfig = () => {
    if (!geo.enabled) return { icon: <Locate size={16} />, color: isDark ? '#475569' : '#9CA3AF', bg: isDark ? '#172A45' : '#F3F4F6', label: 'Activar GPS' };
    if (geo.loading)  return { icon: <Loader2 size={16} className="animate-spin" />, color: '#06B6D4', bg: isDark ? '#0C2A45' : '#E0F7FA', label: 'Buscando…' };
    if (geo.error)    return { icon: <LocateFixed size={16} />, color: '#EF4444', bg: isDark ? '#2D1515' : '#FEF2F2', label: 'Error GPS' };
    if (!geo.onCampus) return { icon: <LocateFixed size={16} />, color: '#F59E0B', bg: isDark ? '#2D2010' : '#FFFBEB', label: 'Fuera del campus' };
    return { icon: <LocateFixed size={16} />, color: '#10B981', bg: isDark ? '#0D2A1E' : '#ECFDF5', label: 'GPS activo', pulse: true };
  };
  const gbc = geoButtonConfig();
  const renderMapContent = () => (
    <>
      <img
        src={campusMap}
        alt="Mapa campus ECI"
        style={{
          width: '100%',
          height: isMobile ? '100%' : 'auto',
          display: 'block',
          objectFit: isMobile ? 'fill' : 'initial',
          filter: isDark ? 'brightness(0.80) saturate(0.85)' : 'brightness(1)',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <div style={{ position: 'absolute', inset: 0 }}>
        {selectedLandmark && (
          <div
            style={{ position: 'absolute', inset: 0, zIndex: 5 }}
            onClick={() => setSelectedLandmark(null)}
          />
        )}
        {}
        <AnimatePresence>
          {showUserPin && (
            <motion.div
              key={`pin-${userPin.x.toFixed(1)}-${userPin.y.toFixed(1)}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              style={{
                position: 'absolute',
                left: `${userPin.x}%`,
                top:  `${userPin.y}%`,
                transform: 'translate(-50%, -100%)',
                zIndex: 30,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                pointerEvents: 'none',
              }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(() => {
                  const outerPulse = Math.max(28, Math.round(42 * pinScale));
                  const innerPulse = Math.max(20, Math.round(32 * pinScale));
                  const avatarSz = Math.max(18, Math.round(28 * pinScale));
                  return (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          position: 'absolute',
                          width: outerPulse, height: outerPulse,
                          borderRadius: '50%',
                          border: `2.5px solid ${geo.enabled && geo.onCampus ? '#10B981' : '#06B6D4'}`,
                          zIndex: 0,
                        }}
                      />
                      <motion.div
                        animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0.2, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        style={{
                          position: 'absolute',
                          width: innerPulse, height: innerPulse,
                          borderRadius: '50%',
                          border: `2px solid ${geo.enabled && geo.onCampus ? '#10B981' : '#06B6D4'}`,
                          zIndex: 0,
                        }}
                      />
                      {geo.enabled && geo.onCampus && geo.accuracy && geo.accuracy < 60 && (
                        <div style={{
                          position: 'absolute',
                          width: Math.min(80, geo.accuracy * 1.2),
                          height: Math.min(80, geo.accuracy * 1.2),
                          borderRadius: '50%',
                          background: 'rgba(16,185,129,0.08)',
                          border: '1px dashed rgba(16,185,129,0.35)',
                          zIndex: 0,
                        }} />
                      )}
                      <div style={{
                        width: avatarSz, height: avatarSz,
                        borderRadius: '50%',
                        border: `2.5px solid ${geo.enabled && geo.onCampus ? '#10B981' : '#06B6D4'}`,
                        boxShadow: `0 0 0 2px white, 0 4px 12px ${geo.enabled && geo.onCampus ? 'rgba(16,185,129,0.6)' : 'rgba(6,182,212,0.6)'}`,
                        overflow: 'hidden',
                        background: '#0A192F',
                        position: 'relative',
                        zIndex: 1,
                      }}>
                        {currentUser?.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt="Tú"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: GRADIENT, color: 'white', fontSize: Math.max(8, Math.round(10 * pinScale)), fontWeight: 900,
                          }}>
                            {currentUser?.name?.[0] ?? 'Y'}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
              <span style={{
                fontSize: 8, fontWeight: 900,
                color: geo.enabled && geo.onCampus ? '#10B981' : '#06B6D4',
                textShadow: isDark
                  ? '0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)'
                  : '0 1px 4px rgba(255,255,255,0.95), 0 0 8px rgba(255,255,255,0.8)',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}>
                {geo.enabled && geo.onCampus ? '📍 Tú' : 'Tú'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {visibleLandmarks.map(lm => {
          const evHere = getEventsAt(lm.id);
          const hasEv  = evHere.length > 0;
          const isSel  = selectedLandmark?.id === lm.id;
          const isWideLabelPin = lm.id === 'coliseo' || lm.id === 'diali' || lm.id === 'reggio' || lm.id === 'harvies-b' || lm.id === 'bienestar' || lm.id === 'z1' || lm.id === 'z2' || lm.id === 'z3' || lm.id === 'futbol' || lm.id === 'basket' || lm.id === 'volley' || lm.id === 'tennis';
          
          // choose pin background based on whether building has active events
          // If has event -> orange (GOLD_GRADIENT). If no event -> blue.
          // darker colors for labels and pins
          const DEFAULT_BLUE = '#1E40AF'; // darker blue for better contrast
          const pinBg = hasEv ? GOLD_GRADIENT : DEFAULT_BLUE;
          const pinBorder = isSel ? 'white' : 'rgba(255,255,255,0.8)';
          // inner text: full word for wide-label pins, shortName for standard pins
          const innerText = lm.id === 'coliseo'
            ? 'Coliseo'
            : lm.id === 'diali'
            ? 'Diali'
            : lm.id === 'reggio'
            ? 'Reggio\'s'
            : lm.id === 'harvies-b'
            ? 'Harvies'
            : lm.id === 'bienestar'
            ? 'Bienestar'
            : lm.id === 'z1'
            ? 'Z1'
            : lm.id === 'z2'
            ? 'Z2'
            : lm.id === 'z3'
            ? 'Z3'
            : lm.id === 'futbol'
            ? 'Fútbol'
            : lm.id === 'basket'
            ? 'Basket'
            : lm.id === 'volley'
            ? 'Volley'
            : lm.id === 'tennis'
            ? 'Tennis'
            : lm.shortName;
          const baseFont = isSel ? 14 : (hasEv ? 12 : 10);
          const baseFontScaled = Math.max(9, Math.round(baseFont * pinScale));
          const textLen = innerText.length;
          // approximate width based on text length and scaled font size
          const minApprox = Math.round(24 * pinScale);
          const maxApprox = Math.round(56 * pinScale);
          const approxWidth = Math.max(minApprox, Math.min(maxApprox, Math.round(textLen * (baseFontScaled * 0.6) + 8)));
          const pinSize = isSel ? Math.max(Math.round(36 * pinScale), approxWidth) : (hasEv ? Math.max(Math.round(30 * pinScale), approxWidth) : Math.max(Math.round(24 * pinScale), approxWidth));
          const widePinWidth = isSel ? Math.max(Math.round(44 * pinScale), approxWidth) : Math.max(Math.round(38 * pinScale), approxWidth - Math.round(4 * pinScale));
          const widePinHeight = isSel ? Math.max(Math.round(24 * pinScale), Math.round(24 * pinScale)) : Math.round(22 * pinScale);

          return (
            <button
              key={lm.id}
              onClick={e => { e.stopPropagation(); handlePin(lm); }}
              style={{
                position: 'absolute',
                left: `${lm.x}%`,
                top:  `${lm.y}%`,
                transform: 'translate(-50%, -100%)',
                zIndex: isSel ? 20 : hasEv ? 10 : 3,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              title={lm.name}
            >
              <motion.div
                whileHover={{ scale: 1.18, y: -2 }}
                whileTap={{ scale: 0.9 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
              >
                <div style={{ position: 'relative' }}>
                  {hasEv && (
                    <motion.div
                      animate={{ scale: [1, 1.55, 1], opacity: [0.55, 0, 0.55] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      style={{
                        position: 'absolute',
                        inset: -7,
                        borderRadius: isWideLabelPin ? '10px' : '50%',
                        border: `2px solid ${GOLD_LIGHT}`,
                        zIndex: 0,
                      }}
                    />
                  )}
                  <div style={{
                    width: isWideLabelPin ? widePinWidth : pinSize,
                    height: isWideLabelPin ? widePinHeight : pinSize,
                    borderRadius: isWideLabelPin ? 8 : '50% 50% 50% 0',
                    transform: isWideLabelPin ? 'none' : 'rotate(-45deg)',
                    background: pinBg,
                    border: `2.5px solid ${pinBorder}`,
                    boxShadow: hasEv ? `0 4px 14px rgba(217,119,6,0.65)` : '0 2px 8px rgba(0,0,0,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'width .2s, height .2s',
                    position: 'relative', zIndex: 1,
                  }}>
                    {/* counter-rotate so inner text stays upright */}
                    <div style={{ transform: isWideLabelPin ? 'none' : 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                      {isWideLabelPin ? (
                        <span style={{ color: 'white', fontWeight: 900, fontSize: baseFontScaled, lineHeight: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>{innerText}</span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: baseFontScaled, lineHeight: 1 }}>
                          {Array.from(String(lm.shortName)).map((ch, i) => (
                            <span key={i} style={{ display: 'block', transform: 'rotate(0deg)' }}>{ch}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {hasEv && evHere.length > 1 && (
                    <div style={{
                      position: 'absolute', top: -7, right: -7, zIndex: 2,
                      width: 16, height: 16, borderRadius: '50%',
                      background: '#EF4444', border: '1.5px solid white',
                      color: 'white', fontSize: 9, fontWeight: 900,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {evHere.length}
                    </div>
                  )}
                </div>
                {/* external label removed; building short name is displayed inside the pin */}
              </motion.div>
            </button>
          );
        })}
        {}
        <AnimatePresence>
          {selectedLandmark && (
            <motion.div
              key="popup"
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 6 }}
              transition={{ duration: 0.18 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute',
                left: popupLeft ? `${Math.min(selectedLandmark.x + 4, 68)}%` : undefined,
                right: !popupLeft ? `${Math.max(100 - selectedLandmark.x + 4, 20)}%` : undefined,
                top: `${Math.max(selectedLandmark.y - 22, 2)}%`,
                zIndex: 25,
                width: '185px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: isDark ? '#0D1B2E' : 'white',
                border: `1.5px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}`,
                boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.28)',
              }}
            >
              <div
                className="px-3 py-2.5 flex items-center gap-2"
                style={{
                  background: selectedHeaderBg,
                  borderBottom: `1px solid ${selectedHeaderBorder}`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: selectedIconBg }}
                >
                  {selectedLandmark?.id === 'z1' || selectedLandmark?.id === 'z2' || selectedLandmark?.id === 'z3' ? (
                    <Leaf size={13} color="white" strokeWidth={2.2} />
                  ) : selectedLandmark?.id === 'diali' || selectedLandmark?.id === 'reggio' ? (
                    <UtensilsCrossed size={13} color="white" strokeWidth={2.2} />
                  ) : selectedLandmark?.id === 'coliseo' ? (
                    <Trophy size={13} color="white" strokeWidth={2.2} />
                  ) : selectedLandmark?.id === 'basket' ? (
                    <SportsBasketball sx={{ fontSize: 14, color: 'white' }} />
                  ) : selectedLandmark?.id === 'tennis' ? (
                    <SportsTennis sx={{ fontSize: 14, color: 'white' }} />
                  ) : selectedLandmark?.id === 'volley' ? (
                    <SportsVolleyball sx={{ fontSize: 14, color: 'white' }} />
                  ) : selectedLandmark?.id === 'futbol' ? (
                    <SportsSoccer sx={{ fontSize: 14, color: 'white' }} />
                  ) : selectedLandmark?.id === 'bienestar' ? (
                    <CheckCircle2 size={13} color="white" strokeWidth={2.2} />
                  ) : (
                    <Building2 size={13} color="white" strokeWidth={2.2} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-gray-900 dark:text-white truncate">
                    {selectedLandmarkTitle}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLandmark(null)}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X size={10} />
                </button>
              </div>
              {selectedEvents.length > 0 ? (
                <div className="px-3 py-2">
                  {selectedEvents.map(ev => (
                    <button key={ev.id} onClick={() => navigate('/events')} className="w-full text-left">
                      <div className="flex items-start gap-2 mb-1.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: ev.coverGradient }}
                        >
                          <EventPinIcon emoji={ev.emoji} size={15} color="white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-gray-900 dark:text-white leading-tight line-clamp-2">
                            {ev.title}
                          </p>
                          <p className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <Calendar size={7} />
                            {ev.date} · {ev.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => navigate('/events')}
                    className="w-full text-center text-[9px] font-black py-1.5 rounded-lg mt-1 flex items-center justify-center gap-1"
                    style={{ background: GOLD_GRADIENT, color: 'white' }}
                  >
                    Ver eventos <ChevronRight size={9} />
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2.5">
                  <p className="text-[9px] text-gray-400 text-center">Sin eventos activos aquí</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
  return (
    <div
      className="flex flex-col relative"
      style={{
        height: '100dvh',
        background: isDark ? '#0A192F' : '#F0F7FF',
        overflowY: 'auto',
        overflowX: 'hidden',
        isolation: 'isolate',
      }}
    >
      <DoodleBackground isDark={isDark} opacity={isDark ? 0.68 : 0.50} />
      {}
      <header
        className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b relative"
        style={{
          background: isDark ? 'rgba(13,27,46,0.97)' : 'rgba(255,255,255,0.97)',
          borderColor: isDark ? '#1E3A5F' : '#E5E7EB',
          backdropFilter: 'blur(12px)',
          zIndex: 30,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#172A45] transition-colors active:scale-90"
          style={{ color: isDark ? '#94A3B8' : '#6B7280' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-gray-900 dark:text-white text-sm flex items-center gap-2 flex-wrap">
            <Map size={14} style={{ color: GOLD_LIGHT }} />
            Campus ECI
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex items-center gap-1"
              style={{ background: GOLD_GRADIENT }}
            >
                            <MapPin size={iconSize} />
              {mappedEvents.length} eventos
            </span>
          </h1>
          <p className="text-[10px] text-gray-400 truncate">
            Escuela Colombiana de Ingeniería · Bogotá
          </p>
        </div>
        {}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleGeo}
          aria-label={gbc.label}
          title={gbc.label}
          layout
          className="relative flex items-center justify-center flex-shrink-0 transition-all overflow-hidden"
          style={{
            height: 36,
            borderRadius: 999,
            paddingLeft: geo.enabled ? 10 : 0,
            paddingRight: geo.enabled ? 12 : 0,
            width: geo.enabled ? 'auto' : 36,
            minWidth: 36,
            background: gbc.bg,
            color: gbc.color,
            boxShadow: geo.enabled && geo.onCampus
              ? `0 0 0 2px #10B981, 0 0 16px rgba(16,185,129,0.45)`
              : geo.enabled && !geo.error
              ? `0 0 0 2px #06B6D4, 0 0 10px rgba(6,182,212,0.35)`
              : geo.enabled && geo.error
              ? `0 0 0 2px #EF4444, 0 0 10px rgba(239,68,68,0.3)`
              : '0 1px 4px rgba(0,0,0,0.10)',
          }}
        >
          {}
          {geo.enabled && !geo.error && (
            <motion.span
              animate={{ scale: [1, 1.55, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: -3,
                borderRadius: 999,
                border: `2px solid ${geo.onCampus ? '#10B981' : '#06B6D4'}`,
                pointerEvents: 'none',
              }}
            />
          )}
          {}
          <span className="flex-shrink-0 flex items-center justify-center" style={{ width: 20, height: 20 }}>
            {gbc.icon}
          </span>
          {}
          <AnimatePresence>
            {geo.enabled && (
              <motion.span
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: 'auto', marginLeft: 5 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] font-black whitespace-nowrap overflow-hidden"
                style={{ color: gbc.color }}
              >
                {geo.loading
                  ? 'Buscando…'
                  : geo.error
                  ? 'Sin señal'
                  : geo.onCampus
                  ? geo.detectedZone?.replace('Cerca de ', '') ?? 'En campus'
                  : 'Fuera'}
              </motion.span>
            )}
          </AnimatePresence>
          {}
          {geo.enabled && !geo.loading && !geo.error && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
              style={{ background: geo.onCampus ? '#10B981' : '#F59E0B', border: '1.5px solid white' }}
            />
          )}
        </motion.button>
        {}
        
      </header>
      {}
      <div
        className="flex-shrink-0 flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide border-b relative"
        style={{
          borderColor: isDark ? '#1E3A5F55' : '#E5E7EB55',
          background: isDark ? 'rgba(13,27,46,0.97)' : 'rgba(255,255,255,0.97)',
          zIndex: 29,
        }}
      >
        {FILTERS.map(({ key, label, Icon: FilterIcon }) => (
          <button
            key={key}
            onClick={() => { setActiveFilter(key as typeof activeFilter); setSelectedLandmark(null); }}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
            style={{
              background: activeFilter === key ? GOLD_GRADIENT : (isDark ? '#172A45' : '#F3F4F6'),
              color: activeFilter === key ? 'white' : (isDark ? '#9CA3AF' : '#6B7280'),
              boxShadow: activeFilter === key ? '0 2px 8px rgba(217,119,6,0.35)' : 'none',
            }}
          >
            <FilterIcon size={11} />
            {label}
          </button>
        ))}
        {}
        {geo.enabled && (
          <div
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ml-auto"
            style={{
              background: geo.loading ? 'rgba(6,182,212,0.12)' :
                          geo.error ? 'rgba(239,68,68,0.12)' :
                          geo.onCampus ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
              color: geo.loading ? '#06B6D4' :
                     geo.error ? '#EF4444' :
                     geo.onCampus ? '#10B981' : '#F59E0B',
            }}
          >
            {geo.loading
              ? <><Loader2 size={10} className="animate-spin" /> GPS</>
              : geo.onCampus
              ? <><CheckCircle2 size={10} /> {geo.detectedZone ? geo.detectedZone.replace('Cerca de ', '') : 'En campus'}</>
              : geo.error
              ? <><AlertCircle size={10} /> Sin señal GPS</>
              : <><AlertTriangle size={10} /> Fuera</>
            }
          </div>
        )}
      </div>
      {}
      <div
        className="flex-shrink-0 border-t relative"
        style={{
          background: isDark ? 'rgba(13,27,46,0.97)' : 'rgba(255,255,255,0.97)',
          borderColor: isDark ? '#1E3A5F' : '#E5E7EB',
          zIndex: 30,
          backdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={() => { setEventsOpen(v => !v); setSelectedLandmark(null); }}
          className="w-full flex items-center justify-between px-5 py-3 transition-all active:opacity-80"
        >
          <div className="flex items-center gap-2">
            <MapPin size={iconSize} style={{ color: GOLD_LIGHT }} />
            <span className="text-[11px] font-black" style={{ color: GOLD_LIGHT }}>
              {mappedEvents.length} eventos activos en campus
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-medium">
              {eventsOpen ? 'Cerrar' : 'Ver todos'}
            </span>
            {eventsOpen
              ? <ChevronUp size={14} style={{ color: GOLD_LIGHT }} />
              : <ChevronDown size={14} style={{ color: GOLD_LIGHT }} />}
          </div>
        </button>
        <AnimatePresence>
          {eventsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden' }}
            >
              <div
                className="flex gap-3 px-5 pb-4 overflow-x-auto scrollbar-hide"
                style={{ borderTop: `1px solid ${isDark ? '#1E3A5F44' : '#E5E7EB44'}` }}
              >
                {mappedEvents.map(ev => {
                  const lmId = EVENT_LOCATION[ev.id];
                  const lm   = LANDMARKS.find(l => l.id === lmId);
                  return (
                    <button
                      key={ev.id}
                      onClick={() => {
                        if (lm) {
                          const lmFilter = getLandmarkCategory(lm);
                          if (lmFilter && activeFilter !== lmFilter) {
                            setActiveFilter(lmFilter);
                          }
                          setSelectedLandmark(lm);
                          setEventsOpen(false);
                        }
                      }}
                      className="flex-shrink-0 mt-3"
                      style={{ width: '160px' }}
                    >
                      <div
                        className="rounded-2xl p-3 text-left"
                        style={{
                          background: isDark ? '#112240' : '#F8FAFC',
                          border: `1px solid ${isDark ? '#1E3A5F' : '#E5E7EB'}`,
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                          style={{ background: ev.coverGradient }}
                        >
                          <EventPinIcon emoji={ev.emoji} size={18} color="white" />
                        </div>
                        <p className="text-[10px] font-black text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1">
                          {ev.title}
                        </p>
                        <p className="text-[9px] text-gray-400 flex items-center gap-1">
                          <Calendar size={7} />
                          {ev.date} · {ev.time}
                        </p>
                        {lm && (
                          <p className="text-[9px] mt-1 font-medium flex items-center gap-1" style={{ color: lm.color }}>
                            <MapPin size={iconSize} />
                            {lm.id.startsWith('bloque-') ? `Edificio ${lm.id.replace('bloque-', '').toUpperCase()}` : lm.name}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div
        className="flex-shrink-0 relative"
        style={{
          background: isDark ? 'rgba(13,27,46,0.97)' : 'rgba(255,255,255,0.97)',
          zIndex: 28,
        }}
      >
        <AnimatePresence>
          <GeoBanner isDark={isDark} geo={geo} />
        </AnimatePresence>
      </div>
      {}
      {isMobile ? (
        <div
          ref={mapContainerRef}
          className="flex-1 relative"
          style={{ background: isDark ? '#061220' : '#D9E8F5', overflow: mapRenderWidth > MAP_FIXED_WIDTH ? 'visible' : 'auto' }}
        >
          <div style={{ width: mapRenderWidth > MAP_FIXED_WIDTH ? '100%' : MAP_FIXED_WIDTH, position: 'relative', margin: mapRenderWidth > MAP_FIXED_WIDTH ? undefined : '0 auto' }}>
            {renderMapContent()}
          </div>
        </div>
      ) : (
        <div className="flex-1" style={{ WebkitOverflowScrolling: 'touch', background: isDark ? '#061220' : '#D9E8F5', overflow: mapRenderWidth > MAP_FIXED_WIDTH ? 'visible' : 'auto' }}>
          <div style={{ position: 'relative', width: mapRenderWidth > MAP_FIXED_WIDTH ? '100%' : MAP_FIXED_WIDTH, minHeight: '0', margin: mapRenderWidth > MAP_FIXED_WIDTH ? undefined : '0 auto' }}>
            {renderMapContent()}
          </div>
        </div>
      )}
      {}
      
    </div>
  );
}
const CAMPUS_BOUNDS = {
  north: 4.9800,
  south: 4.9722,
  east:  -74.0418,
  west:  -74.0490,
};
function coordsToMapPct(lat: number, lng: number) {
  const x = ((lng - CAMPUS_BOUNDS.west) / (CAMPUS_BOUNDS.east - CAMPUS_BOUNDS.west)) * 100;
  const y = ((CAMPUS_BOUNDS.north - lat) / (CAMPUS_BOUNDS.north - CAMPUS_BOUNDS.south)) * 100;
  return {
    x: Math.max(2, Math.min(98, x)),
    y: Math.max(2, Math.min(98, y)),
  };
}
function isOnCampus(lat: number, lng: number): boolean {
  return (
    lat >= CAMPUS_BOUNDS.south &&
    lat <= CAMPUS_BOUNDS.north &&
    lng >= CAMPUS_BOUNDS.west &&
    lng <= CAMPUS_BOUNDS.east
  );
}
function detectZone(mapX: number, mapY: number, landmarks: Landmark[]): string {
  let closest = landmarks[0];
  let minDist = Infinity;
  for (const lm of landmarks) {
    if (lm.type === 'entry') continue;
    const dx = lm.x - mapX;
    const dy = lm.y - mapY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist) {
      minDist = dist;
      closest = lm;
    }
  }
  return minDist < 18 ? `Cerca de ${closest.name}` : 'Campus ECI';
}
