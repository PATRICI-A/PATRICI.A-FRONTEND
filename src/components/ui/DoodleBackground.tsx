import { useMemo } from 'react';
interface DoodleBackgroundProps {
  isDark?: boolean;
  opacity?: number;
  className?: string;
  fixed?: boolean;
}
export function DoodleBackground({ isDark = true, opacity, className, fixed = false }: DoodleBackgroundProps) {
  const defaultOpacity = opacity ?? 1;
  const posClass = fixed ? 'fixed' : 'absolute';
  const waveSvg = useMemo(() => {
    if (!isDark) return null;
    if (isDark) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
  <defs>
    <!-- Fondo base: degradado radial navy -->
    <radialGradient id="dbg" cx="52%" cy="38%" r="80%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#0C1E3E"/>
      <stop offset="55%"  stop-color="#060F22"/>
      <stop offset="100%" stop-color="#030915"/>
    </radialGradient>
    <!-- Onda 1 relleno: azul-medio con variación L→R -->
    <linearGradient id="w1fill" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#143566" stop-opacity="0.95"/>
      <stop offset="25%"  stop-color="#1E4A8A" stop-opacity="1.00"/>
      <stop offset="55%"  stop-color="#2A5FAE" stop-opacity="0.95"/>
      <stop offset="80%"  stop-color="#1C4480" stop-opacity="0.90"/>
      <stop offset="100%" stop-color="#122E60" stop-opacity="0.85"/>
    </linearGradient>
    <!-- Onda 1 borde superior: crest luminoso -->
    <linearGradient id="w1crest" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#2A6CD4" stop-opacity="0.50"/>
      <stop offset="20%"  stop-color="#4A90E8" stop-opacity="1.00"/>
      <stop offset="50%"  stop-color="#5CA0F0" stop-opacity="1.00"/>
      <stop offset="80%"  stop-color="#4080D8" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#2050A8" stop-opacity="0.50"/>
    </linearGradient>
    <!-- Onda 1 glow difuso (banda más amplia y transparente) -->
    <linearGradient id="w1glow" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#1840A0" stop-opacity="0.00"/>
      <stop offset="30%"  stop-color="#2A60CC" stop-opacity="0.35"/>
      <stop offset="60%"  stop-color="#3570D8" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#1840A0" stop-opacity="0.00"/>
    </linearGradient>
    <!-- Onda 2 relleno -->
    <linearGradient id="w2fill" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#0E2448" stop-opacity="0.90"/>
      <stop offset="30%"  stop-color="#163560" stop-opacity="0.95"/>
      <stop offset="60%"  stop-color="#1D4070" stop-opacity="0.90"/>
      <stop offset="100%" stop-color="#0E2448" stop-opacity="0.80"/>
    </linearGradient>
    <!-- Onda 2 crest -->
    <linearGradient id="w2crest" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#1E50A0" stop-opacity="0.30"/>
      <stop offset="30%"  stop-color="#3070C8" stop-opacity="0.85"/>
      <stop offset="65%"  stop-color="#3878D0" stop-opacity="0.80"/>
      <stop offset="100%" stop-color="#1E50A0" stop-opacity="0.30"/>
    </linearGradient>
    <!-- Reflejo sutil en la parte inferior de la onda 1 -->
    <linearGradient id="w1reflect" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#1840A0" stop-opacity="0.00"/>
      <stop offset="35%"  stop-color="#2558B8" stop-opacity="0.22"/>
      <stop offset="65%"  stop-color="#2A60C0" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#1840A0" stop-opacity="0.00"/>
    </linearGradient>
  </defs>
  <!-- ── Fondo base ── -->
  <rect width="1440" height="900" fill="url(#dbg)"/>
  <!-- ═══════════════════════════════════════════════
       ONDA 2  (inferior, se pinta primero)
  ════════════════════════════════════════════════ -->
  <!-- Aura / glow difuso alrededor de la onda 2 -->
  <path d="
    M -60,680
    C  200,540  500,730  780,590
    C 1020,460 1260,560 1500,490
    L 1500,830
    C 1260,880 1020,790  780,880
    C  500,970  200,820  -60,860
    Z"
    fill="url(#w2fill)" opacity="0.30"/>
  <!-- Cuerpo principal de la onda 2 -->
  <path d="
    M 0,700
    C 220,565  500,745  780,605
    C 1020,480 1260,575 1440,510
    L 1440,780
    C 1260,830 1020,745  780,850
    C  500,945  220,820    0,860
    Z"
    fill="url(#w2fill)"/>
  <!-- Borde luminoso superior de la onda 2 -->
  <path d="
    M 0,700
    C 220,565  500,745  780,605
    C 1020,480 1260,575 1440,510"
    fill="none" stroke="url(#w2crest)" stroke-width="3.5"/>
  <!-- Filo brillante (línea fina encima del crest) -->
  <path d="
    M 0,700
    C 220,565  500,745  780,605
    C 1020,480 1260,575 1440,510"
    fill="none" stroke="#6090E8" stroke-width="1.2" stroke-opacity="0.45"/>
  <!-- ═══════════════════════════════════════════════
       ONDA 1  (superior, más prominente)
  ════════════════════════════════════════════════ -->
  <!-- Glow difuso amplio antes del cuerpo de la onda 1 -->
  <path d="
    M -80,380
    C  150,230  440,490  760,310
    C 1000,170 1280,230 1520,170
    L 1520,500
    C 1280,530 1000,470  760,610
    C  440,760  150,550  -80,680
    Z"
    fill="url(#w1glow)"/>
  <!-- Cuerpo principal de la onda 1 -->
  <path d="
    M 0,430
    C 200,295  460,515  760,340
    C 1000,205 1280,260 1440,210
    L 1440,450
    C 1280,475 1000,440  760,575
    C  460,720  200,520    0,640
    Z"
    fill="url(#w1fill)"/>
  <!-- Borde luminoso superior de la onda 1 (crest) -->
  <path d="
    M 0,430
    C 200,295  460,515  760,340
    C 1000,205 1280,260 1440,210"
    fill="none" stroke="url(#w1crest)" stroke-width="4"/>
  <!-- Filo brillante (línea muy fina sobre el crest) -->
  <path d="
    M 0,430
    C 200,295  460,515  760,340
    C 1000,205 1280,260 1440,210"
    fill="none" stroke="#80B8FF" stroke-width="1.3" stroke-opacity="0.60"/>
  <!-- Reflejo interior en la pared inferior de la onda 1 -->
  <path d="
    M 0,635
    C 200,515  460,708  760,565
    C 1000,435 1280,450 1440,440"
    fill="none" stroke="url(#w1reflect)" stroke-width="2.5"/>
</svg>`;
    } else {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
  <defs>
    <!-- Base: warm radial gradient — bright parchment center, warm edges -->
    <radialGradient id="lbase" cx="50%" cy="38%" r="72%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#FDFCF8"/>
      <stop offset="40%"  stop-color="#F7F5F0"/>
      <stop offset="75%"  stop-color="#F0EDE5"/>
      <stop offset="100%" stop-color="#E8E3D8"/>
    </radialGradient>
    <!-- Gold sunrise blob: top-right corner — morning light entering -->
    <radialGradient id="lgold" cx="88%" cy="8%" r="42%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#F5A623" stop-opacity="0.13"/>
      <stop offset="45%"  stop-color="#D4890A" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#D4890A" stop-opacity="0.00"/>
    </radialGradient>
    <!-- Secondary gold warmth: bottom-right -->
    <radialGradient id="lgold2" cx="95%" cy="92%" r="30%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#E8A020" stop-opacity="0.09"/>
      <stop offset="100%" stop-color="#E8A020" stop-opacity="0.00"/>
    </radialGradient>
    <!-- Teal accent blob: bottom-left — brand echo -->
    <radialGradient id="lteal" cx="8%" cy="88%" r="32%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#06B6D4" stop-opacity="0.10"/>
      <stop offset="55%"  stop-color="#0891B2" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#0891B2" stop-opacity="0.00"/>
    </radialGradient>
    <!-- Secondary teal: top-left subtle -->
    <radialGradient id="lteal2" cx="5%" cy="12%" r="25%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#06B6D4" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.00"/>
    </radialGradient>
    <!-- Central brightness: pure white airy spot on content area -->
    <radialGradient id="lspot" cx="50%" cy="32%" r="48%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="0.72"/>
      <stop offset="60%"  stop-color="#FFFFFF" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.00"/>
    </radialGradient>
    <!-- Soft navy tint for bottom area depth -->
    <linearGradient id="lbottom" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="60%"  stop-color="#0A192F" stop-opacity="0.00"/>
      <stop offset="100%" stop-color="#0A192F" stop-opacity="0.03"/>
    </linearGradient>
  </defs>
  <!-- ── Base warm background ── -->
  <rect width="1440" height="900" fill="url(#lbase)"/>
  <!-- ── Color accent blobs ── -->
  <rect width="1440" height="900" fill="url(#lgold)"/>
  <rect width="1440" height="900" fill="url(#lgold2)"/>
  <rect width="1440" height="900" fill="url(#lteal)"/>
  <rect width="1440" height="900" fill="url(#lteal2)"/>
  <rect width="1440" height="900" fill="url(#lbottom)"/>
  <!-- ═══════════════════════════════════════════════
       DOODLES UNIVERSITARIOS — 3% opacity (marca de agua elegante)
       Trazo navy #0A192F, stroke-width fino y consistente
  ════════════════════════════════════════════════ -->
  <g opacity="0.032" fill="none" stroke="#0A192F" stroke-linecap="round" stroke-linejoin="round">
    <!-- ── Libro abierto (top-left) ── -->
    <path d="M 85,72 L 85,108 Q 110,102 118,108 L 118,72 Q 110,66 85,72 Z" stroke-width="1.5"/>
    <path d="M 118,72 Q 126,66 151,72 L 151,108 Q 126,102 118,108" stroke-width="1.5"/>
    <line x1="118" y1="72" x2="118" y2="108" stroke-width="1.2"/>
    <line x1="91" y1="82" x2="112" y2="80" stroke-width="1"/>
    <line x1="91" y1="90" x2="112" y2="88" stroke-width="1"/>
    <line x1="91" y1="98" x2="108" y2="96" stroke-width="1"/>
    <line x1="124" y1="82" x2="145" y2="80" stroke-width="1"/>
    <line x1="124" y1="90" x2="145" y2="88" stroke-width="1"/>
    <!-- ── Birrete de graduación (top-right) ── -->
    <polygon points="1298,68 1264,86 1298,104 1332,86" stroke-width="1.6" fill="none"/>
    <path d="M 1298,104 L 1298,136" stroke-width="1.5"/>
    <path d="M 1332,86 L 1332,108 Q 1332,120 1318,126" stroke-width="1.5"/>
    <circle cx="1332" cy="110" r="0" fill="none"/>
    <path d="M 1326,122 Q 1332,128 1332,134" stroke-width="2"/>
    <line x1="1286" y1="118" x2="1310" y2="136" stroke-width="1.2"/>
    <!-- ── Brújula / compass (middle-left) ── -->
    <circle cx="108" cy="460" r="26" stroke-width="1.6"/>
    <circle cx="108" cy="460" r="3" fill="#0A192F" stroke="none"/>
    <line x1="108" y1="436" x2="108" y2="484" stroke-width="1"/>
    <line x1="82"  y1="460" x2="134" y2="460" stroke-width="1"/>
    <!-- Norte flecha -->
    <polygon points="108,438 112,452 108,449 104,452" fill="#0A192F" stroke="none"/>
    <!-- Sur flecha vacío -->
    <polygon points="108,482 112,468 108,471 104,468" stroke-width="1" fill="none"/>
    <!-- ── Red de nodos (middle-right) ── -->
    <circle cx="1320" cy="380" r="5" stroke-width="1.5"/>
    <circle cx="1350" cy="355" r="5" stroke-width="1.5"/>
    <circle cx="1380" cy="388" r="5" stroke-width="1.5"/>
    <circle cx="1345" cy="415" r="5" stroke-width="1.5"/>
    <circle cx="1308" cy="410" r="3" stroke-width="1.5"/>
    <line x1="1325" y1="380" x2="1345" y2="360" stroke-width="1.2"/>
    <line x1="1355" y1="358" x2="1375" y2="386" stroke-width="1.2"/>
    <line x1="1378" y1="393" x2="1350" y2="412" stroke-width="1.2"/>
    <line x1="1341" y1="414" x2="1312" y2="412" stroke-width="1.2"/>
    <line x1="1308" y1="408" x2="1318" y2="384" stroke-width="1.2"/>
    <line x1="1325" y1="378" x2="1346" y2="416" stroke-width="0.8"/>
    <!-- ── Taza de café (bottom-left) ── -->
    <path d="M 75,788 L 82,840 L 132,840 L 139,788 Z" stroke-width="1.5"/>
    <path d="M 139,800 Q 158,800 158,814 Q 158,828 139,828" stroke-width="1.5"/>
    <line x1="75" y1="800" x2="139" y2="800" stroke-width="1"/>
    <!-- Vapor -->
    <path d="M 95,776 Q 98,768 95,760" stroke-width="1.2" fill="none"/>
    <path d="M 107,774 Q 110,764 107,755" stroke-width="1.2" fill="none"/>
    <path d="M 119,776 Q 122,768 119,760" stroke-width="1.2" fill="none"/>
    <!-- ── WiFi / señal (bottom-center) ── -->
    <circle cx="725" cy="838" r="3" fill="#0A192F" stroke="none"/>
    <path d="M 712,826 Q 725,815 738,826" stroke-width="1.5" fill="none"/>
    <path d="M 702,815 Q 725,798 748,815" stroke-width="1.5" fill="none"/>
    <path d="M 692,804 Q 725,782 758,804" stroke-width="1.5" fill="none"/>
    <!-- ── Estrella de 5 puntas (bottom-right) ── -->
    <polygon points="1280,800 1285,820 1305,820 1289,832 1295,852 1280,841 1265,852 1271,832 1255,820 1275,820"
             stroke-width="1.4" fill="none"/>
    <!-- ── Diamantes (scattered premium accent) ── -->
    <polygon points="400,92 412,75 424,92 412,109" stroke-width="1.4" fill="none"/>
    <polygon points="64,300 72,290 80,300 72,310"  stroke-width="1.3" fill="none"/>
    <polygon points="1390,180 1398,169 1406,180 1398,191" stroke-width="1.3" fill="none"/>
    <polygon points="960,858 970,845 980,858 970,871" stroke-width="1.3" fill="none"/>
    <!-- ── Signos plus (energía, campus) ── -->
    <line x1="500" y1="140" x2="500" y2="162" stroke-width="1.5"/>
    <line x1="489" y1="151" x2="511" y2="151" stroke-width="1.5"/>
    <line x1="1180" y1="620" x2="1180" y2="638" stroke-width="1.5"/>
    <line x1="1171" y1="629" x2="1189" y2="629" stroke-width="1.5"/>
    <line x1="210" y1="820" x2="210" y2="836" stroke-width="1.5"/>
    <line x1="202" y1="828" x2="218" y2="828" stroke-width="1.5"/>
    <line x1="1050" y1="110" x2="1050" y2="126" stroke-width="1.5"/>
    <line x1="1042" y1="118" x2="1058" y2="118" stroke-width="1.5"/>
    <!-- ── Grid de puntos (sensación académica / papel cuadriculado) ── -->
    <circle cx="580" cy="88"  r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="604" cy="88"  r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="628" cy="88"  r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="652" cy="88"  r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="580" cy="108" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="604" cy="108" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="628" cy="108" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="652" cy="108" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="580" cy="128" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="604" cy="128" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="628" cy="128" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="652" cy="128" r="1.8" fill="#0A192F" stroke="none"/>
    <!-- Grid puntos esquina inferior derecha -->
    <circle cx="1320" cy="820" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="1344" cy="820" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="1368" cy="820" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="1320" cy="840" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="1344" cy="840" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="1368" cy="840" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="1320" cy="860" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="1344" cy="860" r="1.8" fill="#0A192F" stroke="none"/>
    <circle cx="1368" cy="860" r="1.8" fill="#0A192F" stroke="none"/>
    <!-- ── Circuito PCB simple (middle-bottom) ── -->
    <rect x="330" y="780" width="18" height="12" rx="2" stroke-width="1.5"/>
    <line x1="330" y1="786" x2="310" y2="786" stroke-width="1.2"/>
    <line x1="348" y1="786" x2="368" y2="786" stroke-width="1.2"/>
    <line x1="310" y1="786" x2="310" y2="810" stroke-width="1.2"/>
    <line x1="310" y1="810" x2="295" y2="810" stroke-width="1.2"/>
    <circle cx="293" cy="810" r="3" stroke-width="1.5"/>
    <circle cx="370" cy="786" r="3" stroke-width="1.5"/>
    <line x1="338" y1="792" x2="338" y2="810" stroke-width="1.2"/>
    <circle cx="338" cy="812" r="3" stroke-width="1.5"/>
  </g>
  <!-- ── Central brightness: airy content zone ── -->
  <rect width="1440" height="900" fill="url(#lspot)"/>
</svg>`;
    }
  }, [isDark]);
  const waveEncoded = useMemo(() => {
    if (!waveSvg) return null;
    try {
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(waveSvg)))}`;
    } catch {
      return `data:image/svg+xml,${encodeURIComponent(waveSvg)}`;
    }
  }, [waveSvg]);
  if (!isDark) return null;
  return (
    <div
      className={`${posClass} inset-0 pointer-events-none overflow-hidden ${className ?? ''}`}
      style={{ opacity: defaultOpacity, zIndex: -1 }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: waveEncoded ? `url("${waveEncoded}")` : undefined,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />
    </div>
  );
}