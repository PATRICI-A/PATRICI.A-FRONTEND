import React, { useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, MapPin, X, ChevronUp, ChevronDown, ChevronRight, Calendar,
  Building2, GraduationCap, Monitor, FlaskConical, Zap, Wrench, Radio,
  Trophy, Activity, Droplets, Leaf, Coffee, UtensilsCrossed, ShoppingBag,
  Truck, Navigation, Car, Map, BookOpen, Cpu, Dumbbell,
  Music, Lightbulb, Palette, Sparkles, Sun, Moon,
  LocateFixed, Locate, AlertTriangle, CheckCircle2, Loader2, AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { events, GOLD_GRADIENT, GOLD_LIGHT, GRADIENT } from '../data/mockData';
import { EmojiIcon } from '../components/ui/EmojiIcon';
import { DoodleBackground } from '../components/ui/DoodleBackground';
import campusMap from '../assets/campus_aerial_view.png';

// ── Types ─────────────────────────────────────────────────────────────────────
type LucideIconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

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

// ── Campus geographic bounds (ECI Bogotá) ─────────────────────────────────────
const CAMPUS_BOUNDS = {
  north: 4.9800,
  south: 4.9722,
  east:  -74.0418,
  west:  -74.0490,
};

/** Convert GPS coordinates → map image % position */
function coordsToMapPct(lat: number, lng: number) {
  const x = ((lng - CAMPUS_BOUNDS.west) / (CAMPUS_BOUNDS.east - CAMPUS_BOUNDS.west)) * 100;
  const y = ((CAMPUS_BOUNDS.north - lat) / (CAMPUS_BOUNDS.north - CAMPUS_BOUNDS.south)) * 100;
  return {
    x: Math.max(2, Math.min(98, x)),
    y: Math.max(2, Math.min(98, y)),
  };
}

/** Check if coordinates are inside ECI campus perimeter */
function isOnCampus(lat: number, lng: number): boolean {
  return (
    lat >= CAMPUS_BOUNDS.south &&
    lat <= CAMPUS_BOUNDS.north &&
    lng >= CAMPUS_BOUNDS.west &&
    lng <= CAMPUS_BOUNDS.east
  );
}

/** Detect the nearest landmark zone for a map % position */
function detectZone(mapX: number, mapY: number, landmarks: Landmark[]): string {
  let closest = landmarks[0];
  let minDist = Infinity;
  for (const lm of landmarks) {
    if (lm.type === 'entry') continue; // skip entry points
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

// ── Campus landmarks ───────────────────────────────────────────────────────────
const LANDMARKS: Landmark[] = [
  { id: 'bloque-a', name: 'Bloque A',           shortName: 'A',       x: 73, y: 50, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'bloque-b', name: 'Bloque B',           shortName: 'B',       x: 68, y: 41, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'bloque-c', name: 'Bloque C',           shortName: 'C',       x: 72, y: 60, Icon: Building2,      color: '#3B82F6', type: 'building' },
  { id: 'bloque-d', name: 'Bloque D',           shortName: 'D',       x: 50, y: 32, Icon: GraduationCap,  color: '#6366F1', type: 'building' },
  { id: 'bloque-e', name: 'Bloque E',           shortName: 'E',       x: 54, y: 49, Icon: Wrench,         color: '#0EA5E9', type: 'building' },
  { id: 'bloque-f', name: 'Bloque F',           shortName: 'F',       x: 62, y: 16, Icon: Monitor,        color: '#8B5CF6', type: 'building' },
  { id: 'bloque-g', name: 'Bloque G',           shortName: 'G',       x: 77, y: 24, Icon: FlaskConical,   color: '#EC4899', type: 'building' },
  { id: 'bloque-h', name: 'Bloque H',           shortName: 'H',       x: 36, y: 74, Icon: Zap,            color: '#F59E0B', type: 'building' },
  { id: 'bloque-i', name: 'Bloque I',           shortName: 'I',       x: 44, y: 74, Icon: Cpu,            color: '#10B981', type: 'building' },
  { id: 'bloque-l', name: 'Bloque L',           shortName: 'L',       x: 40, y: 18, Icon: Radio,          color: '#06B6D4', type: 'building' },
  { id: 'coliseo',  name: 'Coliseo El Otoño',   shortName: 'Coliseo', x:  7, y: 35, Icon: Trophy,         color: '#EF4444', type: 'sport'    },
  { id: 'canchas',  name: 'Canchas Fútbol',      shortName: 'Canchas', x: 19, y: 44, Icon: Activity,       color: '#16A34A', type: 'sport'    },
  { id: 'lago',     name: 'El Lago',            shortName: 'Lago',    x: 33, y: 40, Icon: Droplets,       color: '#0284C7', type: 'nature'   },
  { id: 'nativos',  name: 'Nativos',            shortName: 'Nativos', x: 50, y: 58, Icon: Leaf,           color: '#15803D', type: 'nature'   },
  { id: 'cafe-planet',  name: 'Café Planet',    shortName: 'Café',    x: 46, y: 44, Icon: Coffee,         color: '#92400E', type: 'food'     },
  { id: 'dialimentos',  name: 'Dialimentos',    shortName: 'Diali.',  x: 44, y: 33, Icon: UtensilsCrossed, color: '#DC2626', type: 'food'    },
  { id: 'harvies',      name: 'Harvies',        shortName: 'Harvies', x: 19, y: 22, Icon: ShoppingBag,    color: '#EA580C', type: 'food'     },
  { id: 'food-truckus', name: 'Food Truckus',   shortName: 'FT',      x:  9, y: 50, Icon: Truck,          color: '#B45309', type: 'food'     },
  { id: 'entrada-p', name: 'Entrada Peatonal',  shortName: 'Peat.',   x: 90, y: 27, Icon: Navigation,     color: '#475569', type: 'entry'    },
  { id: 'entrada-v', name: 'Entrada Vehicular', shortName: 'Veh.',    x: 89, y: 72, Icon: Car,            color: '#475569', type: 'entry'    },
];

// ── Event-to-landmark mapping ─────────────────────────────────────────────────
const EVENT_LOCATION: Record<string, string> = {
  'e1': 'bloque-d',
  'e2': 'cafe-planet',
  'e3': 'bloque-e',
  'e4': 'bloque-g',
  'e5': 'nativos',
  'e6': 'bloque-l',
};

const FILTERS = [
  { key: 'all',   label: 'Todo',     Icon: Map      },
  { key: 'event', label: 'Eventos',  Icon: MapPin   },
  { key: 'food',  label: 'Comida',   Icon: Coffee   },
  { key: 'sport', label: 'Deporte',  Icon: Dumbbell },
] as const;

function EventPinIcon({ emoji, size = 14, color = 'white' }: { emoji: string; size?: number; color?: string }) {
  return <EmojiIcon emoji={emoji} size={size} color={color} strokeWidth={2.2} />;
}

// ── Geo status banner ─────────────────────────────────────────────────────────
function GeoBanner({
  isDark, geo
}: { isDark: boolean; geo: ReturnType<typeof useApp>['geo'] }) {
  if (!geo.enabled) return null;

  let bg: string;
  let Icon: React.ReactNode;
  let text: string;
  let subtext: string;

  if (geo.loading) {
    bg = isDark ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.10)';
    Icon = <Loader2 size={13} color="#06B6D4" className="animate-spin" />;
    text = 'Obteniendo tu ubicación…';
    subtext = 'Asegúrate de tener GPS activo';
  } else if (geo.error) {
    bg = isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)';
    Icon = <AlertCircle size={13} color="#EF4444" />;
    text = 'GPS no disponible';
    subtext = geo.error;
  } else if (!geo.onCampus && geo.lat !== null) {
    bg = isDark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.08)';
    Icon = <AlertTriangle size={13} color="#F59E0B" />;
    text = 'Estás fuera del campus';
    subtext = `${geo.lat.toFixed(5)}, ${geo.lng!.toFixed(5)} · ±${Math.round(geo.accuracy ?? 0)}m`;
  } else if (geo.onCampus) {
    bg = isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)';
    Icon = <CheckCircle2 size={13} color="#10B981" />;
    text = geo.detectedZone ?? 'En el campus';
    subtext = `±${Math.round(geo.accuracy ?? 0)}m de precisión`;
  } else {
    return null;
  }

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
  const { isDark, toggleTheme, currentUser, geo, updateGeo, toggleGeo } = useApp();

  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'event' | 'food' | 'sport'>('all');

  const [isMobile, setIsMobile] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const watchIdRef = useRef<number | null>(null);

  // ── Responsive detection ───────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useLayoutEffect(() => {
    if (!isMobile) return;
    const update = () => {
      if (mapContainerRef.current) {
        const r = mapContainerRef.current.getBoundingClientRect();
        setContainerSize({ w: r.width, h: r.height });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isMobile]);

  // ── Geolocation watchPosition lifecycle ───────────────────────────────────
  useEffect(() => {
    if (!geo.enabled) {
      // Clear any active watch
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

    const onSuccess = (pos: GeolocationPosition) => {
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

    const onError = (err: GeolocationPositionError) => {
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

    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000,
    });

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [geo.enabled]);

  // ── Event helpers ──────────────────────────────────────────────────────────
  const mappedEvents = events.filter(ev => EVENT_LOCATION[ev.id]);
  const getEventsAt = useCallback((lmId: string) =>
    mappedEvents.filter(e => EVENT_LOCATION[e.id] === lmId), [mappedEvents]);
  const hasEvent = (lmId: string) => getEventsAt(lmId).length > 0;

  const isVisible = (lm: Landmark) => {
    if (activeFilter === 'all')   return true;
    if (activeFilter === 'food')  return lm.type === 'food';
    if (activeFilter === 'sport') return lm.type === 'sport';
    if (activeFilter === 'event') return hasEvent(lm.id);
    return true;
  };

  const handlePin = (lm: Landmark) => {
    setSelectedLandmark(prev => prev?.id === lm.id ? null : lm);
    setEventsOpen(false);
  };

  const selectedEvents = selectedLandmark ? getEventsAt(selectedLandmark.id) : [];
  const popupLeft = selectedLandmark ? selectedLandmark.x < 55 : true;

  // ── User pin: solo visible cuando GPS está activo ──────────────────────────
  const USER_PIN_DEFAULT = { x: 87, y: 30 };
  const userPin = (geo.enabled && geo.onCampus && geo.mapX !== null && geo.mapY !== null)
    ? { x: geo.mapX, y: geo.mapY }
    : USER_PIN_DEFAULT;
  // Mostrar pin SOLO cuando GPS está encendido (ya sea buscando, en campus o fuera)
  const showUserPin = geo.enabled;

  // ── GPS toggle button config ───────────────────────────────────────────────
  const geoButtonConfig = () => {
    if (!geo.enabled) return { icon: <Locate size={16} />, color: isDark ? '#475569' : '#9CA3AF', bg: isDark ? '#172A45' : '#F3F4F6', label: 'Activar GPS' };
    if (geo.loading)  return { icon: <Loader2 size={16} className="animate-spin" />, color: '#06B6D4', bg: isDark ? '#0C2A45' : '#E0F7FA', label: 'Buscando…' };
    if (geo.error)    return { icon: <LocateFixed size={16} />, color: '#EF4444', bg: isDark ? '#2D1515' : '#FEF2F2', label: 'Error GPS' };
    if (!geo.onCampus) return { icon: <LocateFixed size={16} />, color: '#F59E0B', bg: isDark ? '#2D2010' : '#FFFBEB', label: 'Fuera del campus' };
    return { icon: <LocateFixed size={16} />, color: '#10B981', bg: isDark ? '#0D2A1E' : '#ECFDF5', label: 'GPS activo', pulse: true };
  };
  const gbc = geoButtonConfig();

  // ── Shared map content ─────────────────────────────────────────────────────
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

        {/* ── User location pin ── */}
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
                {/* Outer pulsing ring — teal when on campus, amber when GPS off */}
                <motion.div
                  animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    width: 42, height: 42,
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
                    width: 32, height: 32,
                    borderRadius: '50%',
                    border: `2px solid ${geo.enabled && geo.onCampus ? '#10B981' : '#06B6D4'}`,
                    zIndex: 0,
                  }}
                />
                {/* GPS accuracy circle when on campus */}
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
                {/* Avatar */}
                <div style={{
                  width: 28, height: 28,
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
                      background: GRADIENT, color: 'white', fontSize: 10, fontWeight: 900,
                    }}>
                      {currentUser?.name?.[0] ?? 'Y'}
                    </div>
                  )}
                </div>
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

        {LANDMARKS.filter(isVisible).map(lm => {
          const evHere = getEventsAt(lm.id);
          const hasEv  = evHere.length > 0;
          const isSel  = selectedLandmark?.id === lm.id;
          const { Icon } = lm;

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
                {hasEv ? (
                  <div style={{ position: 'relative' }}>
                    <motion.div
                      animate={{ scale: [1, 1.55, 1], opacity: [0.55, 0, 0.55] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      style={{
                        position: 'absolute',
                        inset: -7,
                        borderRadius: '50%',
                        border: `2px solid ${GOLD_LIGHT}`,
                        zIndex: 0,
                      }}
                    />
                    <div style={{
                      width: isSel ? 36 : 30,
                      height: isSel ? 36 : 30,
                      borderRadius: '50% 50% 50% 0',
                      transform: 'rotate(-45deg)',
                      background: GOLD_GRADIENT,
                      border: `2.5px solid ${isSel ? 'white' : 'rgba(255,255,255,0.8)'}`,
                      boxShadow: `0 4px 14px rgba(217,119,6,0.65)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'width .2s, height .2s',
                      position: 'relative', zIndex: 1,
                    }}>
                      <div style={{ transform: 'rotate(45deg)' }}>
                        <Icon size={isSel ? 15 : 12} color="white" strokeWidth={2.2} />
                      </div>
                    </div>
                    {evHere.length > 1 && (
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
                ) : (
                  <div style={{
                    width: isSel ? 26 : 21,
                    height: isSel ? 26 : 21,
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    background: lm.color,
                    border: `2px solid ${isSel ? 'white' : 'rgba(255,255,255,0.65)'}`,
                    boxShadow: `0 2px 8px ${lm.color}66`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'width .2s, height .2s',
                    opacity: activeFilter === 'event' ? 0.38 : 1,
                  }}>
                    <div style={{ transform: 'rotate(45deg)' }}>
                      <Icon size={isSel ? 11 : 9} color="white" strokeWidth={2.4} />
                    </div>
                  </div>
                )}

                <span style={{
                  fontSize: 8, fontWeight: 900,
                  color: hasEv ? GOLD_LIGHT : (isDark ? '#E2E8F0' : '#1E293B'),
                  textShadow: isDark
                    ? '0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)'
                    : '0 1px 4px rgba(255,255,255,0.95), 0 0 8px rgba(255,255,255,0.8)',
                  whiteSpace: 'nowrap',
                  marginTop: 2,
                  lineHeight: 1,
                }}>
                  {lm.shortName}
                </span>
              </motion.div>
            </button>
          );
        })}

        {/* ── Popup card for selected landmark ── */}
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
                  background: `${selectedLandmark.color}18`,
                  borderBottom: `1px solid ${selectedLandmark.color}22`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: selectedLandmark.color }}
                >
                  <selectedLandmark.Icon size={13} color="white" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-gray-900 dark:text-white truncate">
                    {selectedLandmark.name}
                  </p>
                  <p className="text-[9px] capitalize font-medium" style={{ color: selectedLandmark.color }}>
                    {selectedLandmark.type}
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
                    Ver evento <ChevronRight size={9} />
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
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      <DoodleBackground isDark={isDark} opacity={isDark ? 0.68 : 0.50} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
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
              <MapPin size={8} />
              {mappedEvents.length} eventos
            </span>
          </h1>
          <p className="text-[10px] text-gray-400 truncate">
            Escuela Colombiana de Ingeniería · Bogotá
          </p>
        </div>

        {/* GPS toggle button */}
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
          {/* Outer pulse ring — only when active and no error */}
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

          {/* Icon */}
          <span className="flex-shrink-0 flex items-center justify-center" style={{ width: 20, height: 20 }}>
            {gbc.icon}
          </span>

          {/* Label — only when enabled */}
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

          {/* Status dot */}
          {geo.enabled && !geo.loading && !geo.error && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
              style={{ background: geo.onCampus ? '#10B981' : '#F59E0B', border: '1.5px solid white' }}
            />
          )}
        </motion.button>

        {/* Avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full overflow-hidden border-2 shadow-sm active:scale-95 transition-transform flex-shrink-0"
          style={{ borderColor: isDark ? '#1E3A5F' : '#E5E7EB' }}
        >
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-full h-full object-cover"
          />
        </button>

        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: isDark ? '#172A45' : '#F3F4F6',
            color: isDark ? '#FBBF24' : '#6B7280',
            boxShadow: isDark ? '0 0 10px rgba(251,191,36,0.2)' : '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>
      </header>

      {/* ── Filter chips ───────────────────────────────────────────────────── */}
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

        {/* Geo quick-info chip */}
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

      {/* ── Geo status banner ──────────────────────────────────────────────── */}
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

      {/* ── Map area ───────────────────────────────────────────────────────── */}
      {isMobile ? (
        <div
          ref={mapContainerRef}
          className="flex-1 relative overflow-hidden"
          style={{ background: isDark ? '#061220' : '#D9E8F5' }}
        >
          {containerSize.w > 0 && containerSize.h > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width:  `${containerSize.h}px`,
                height: `${containerSize.w}px`,
                transform: 'translate(-50%, -50%) rotate(90deg)',
                transformOrigin: 'center center',
              }}
            >
              {renderMapContent()}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-auto" style={{ WebkitOverflowScrolling: 'touch', background: isDark ? '#061220' : '#D9E8F5' }}>
          <div style={{ position: 'relative', width: '100%', minWidth: '480px' }}>
            {renderMapContent()}
          </div>
        </div>
      )}

      {/* ── Bottom events pill / drawer ── */}
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
            <MapPin size={13} style={{ color: GOLD_LIGHT }} />
            <span className="text-[11px] font-black" style={{ color: GOLD_LIGHT }}>
              {mappedEvents.length} eventos activos en campus
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-medium">
              {eventsOpen ? 'Cerrar' : 'Ver todos'}
            </span>
            {eventsOpen
              ? <ChevronDown size={14} style={{ color: GOLD_LIGHT }} />
              : <ChevronUp size={14} style={{ color: GOLD_LIGHT }} />}
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
                      onClick={() => navigate('/events')}
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
                            <MapPin size={7} />
                            {lm.shortName}
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
    </div>
  );
}