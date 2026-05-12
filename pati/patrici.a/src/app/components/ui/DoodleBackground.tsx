import React, { useMemo } from 'react';

interface DoodleBackgroundProps {
  isDark?: boolean;
  opacity?: number;
  className?: string;
  fixed?: boolean;
}

/**
 * patrici.a – Wave background system (sin iconos).
 *
 * Dark mode  → navy profundo + dos bandas diagonales de onda muy visibles
 *              con bordes luminosos y glow interior
 * Light mode → blanco + ondas lavanda acentuadas y muy visibles
 *
 * SVG puro con preserveAspectRatio="none" → se estira a cualquier
 * tamaño de pantalla sin pérdida de calidad.
 */
export function DoodleBackground({ isDark = true, opacity, className, fixed = false }: DoodleBackgroundProps) {
  const defaultOpacity = opacity ?? 1;
  const posClass = fixed ? 'fixed' : 'absolute';

  const waveSvg = useMemo(() => {
    if (isDark) {
      // ── DARK MODE ─────────────────────────────────────────────────────────
      // Fondo navy muy oscuro + dos bandas diagonales de onda bien marcadas
      // con relleno azul-medio y borde luminoso (crest glow)
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
      // ── LIGHT MODE ────────────────────────────────────────────────────────
      // Fondo blanco + capas de ondas lavanda-azul muy visibles
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
  <defs>

    <!-- Fondo base: blanco puro arriba, leve azul-hielo abajo -->
    <linearGradient id="lbg" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#FFFFFF"/>
      <stop offset="40%"  stop-color="#F8F9FF"/>
      <stop offset="100%" stop-color="#EAEEfB"/>
    </linearGradient>

    <!-- Onda izquierda (barrido lateral) -->
    <linearGradient id="lwa" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#B8C6E8" stop-opacity="1.00"/>
      <stop offset="60%"  stop-color="#C8D4F0" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#D4DEEF" stop-opacity="0.60"/>
    </linearGradient>

    <!-- Onda inferior principal -->
    <linearGradient id="lwb" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#A8BCE6" stop-opacity="0.95"/>
      <stop offset="35%"  stop-color="#B8CCF0" stop-opacity="1.00"/>
      <stop offset="65%"  stop-color="#BACEF2" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#A8BCE6" stop-opacity="0.90"/>
    </linearGradient>

    <!-- Onda inferior rincón derecho -->
    <linearGradient id="lwc" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#A0B4E0" stop-opacity="0.90"/>
      <stop offset="100%" stop-color="#AABCE8" stop-opacity="1.00"/>
    </linearGradient>

    <!-- Onda media horizontal -->
    <linearGradient id="lwd" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#C2CEEC" stop-opacity="0.95"/>
      <stop offset="30%"  stop-color="#CDD8F4" stop-opacity="1.00"/>
      <stop offset="60%"  stop-color="#C8D4F2" stop-opacity="0.90"/>
      <stop offset="100%" stop-color="#C2CEEC" stop-opacity="0.85"/>
    </linearGradient>

    <!-- Brillo blanco central (para mantener el centro aireado) -->
    <radialGradient id="lhigh" cx="50%" cy="25%" r="55%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="1"/>
      <stop offset="70%"  stop-color="#FFFFFF" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>

    <!-- Borde superior de onda (crest oscuro para modo claro) -->
    <linearGradient id="lcrest" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#8BA8D8" stop-opacity="0.20"/>
      <stop offset="25%"  stop-color="#7090C8" stop-opacity="0.75"/>
      <stop offset="55%"  stop-color="#6888C4" stop-opacity="0.80"/>
      <stop offset="80%"  stop-color="#7090C8" stop-opacity="0.70"/>
      <stop offset="100%" stop-color="#8BA8D8" stop-opacity="0.20"/>
    </linearGradient>

  </defs>

  <!-- ── Fondo base ── -->
  <rect width="1440" height="900" fill="url(#lbg)"/>

  <!-- ═══════════════════════════════════════════════
       ONDA A: gran barrido desde esquina superior-izquierda
  ════════════════════════════════════════════════ -->
  <!-- Sombra/glow de la onda A -->
  <path d="
    M -60,0
    C  80,0   260,60   310,310
    C  355,530  180,700   -60,840
    Z"
    fill="url(#lwa)" opacity="0.40"/>

  <!-- Cuerpo de la onda A -->
  <path d="
    M 0,0
    C 130,0   290,70   340,320
    C 390,560  210,710    0,820
    Z"
    fill="url(#lwa)"/>

  <!-- Borde derecho de la onda A -->
  <path d="
    M 340,320
    C 390,560  210,710  0,820"
    fill="none" stroke="#8BA8D8" stroke-width="2.5" stroke-opacity="0.70"/>

  <!-- ═══════════════════════════════════════════════
       ONDA MEDIA HORIZONTAL
  ════════════════════════════════════════════════ -->
  <!-- Glow previo -->
  <path d="
    M -40,410
    C  220,330  500,470  780,350
    C 1020,250 1280,350 1480,290
    L 1480,520
    C 1280,570 1020,480  780,590
    C  500,700  220,570  -40,640
    Z"
    fill="url(#lwd)" opacity="0.45"/>

  <!-- Cuerpo -->
  <path d="
    M 0,435
    C 240,355  500,490  780,370
    C 1020,265 1280,360 1440,305
    L 1440,510
    C 1280,555 1020,470  780,580
    C  500,690  240,565    0,640
    Z"
    fill="url(#lwd)"/>

  <!-- Crest superior de la onda media -->
  <path d="
    M 0,435
    C 240,355  500,490  780,370
    C 1020,265 1280,360 1440,305"
    fill="none" stroke="url(#lcrest)" stroke-width="3"/>

  <!-- Filo fino sobre el crest -->
  <path d="
    M 0,435
    C 240,355  500,490  780,370
    C 1020,265 1280,360 1440,305"
    fill="none" stroke="#5A7EC0" stroke-width="1" stroke-opacity="0.45"/>

  <!-- ═══════════════════════════════════════════════
       ONDA INFERIOR
  ════════════════════════════════════════════════ -->
  <!-- Glow amplio -->
  <path d="
    M -40,680
    C  240,555  540,730  820,590
    C 1060,465 1300,570 1480,510
    L 1480,900
    L -40,900
    Z"
    fill="url(#lwb)" opacity="0.45"/>

  <!-- Cuerpo -->
  <path d="
    M 0,710
    C 260,580  540,755  820,615
    C 1060,490 1300,580 1440,528
    L 1440,900
    L 0,900
    Z"
    fill="url(#lwb)"/>

  <!-- Crest onda inferior -->
  <path d="
    M 0,710
    C 260,580  540,755  820,615
    C 1060,490 1300,580 1440,528"
    fill="none" stroke="url(#lcrest)" stroke-width="3.5"/>

  <path d="
    M 0,710
    C 260,580  540,755  820,615
    C 1060,490 1300,580 1440,528"
    fill="none" stroke="#5070B8" stroke-width="1.2" stroke-opacity="0.50"/>

  <!-- ═══════════════════════════════════════════════
       RINCÓN INFERIOR DERECHO (acumulación de ondas)
  ════════════════════════════════════════════════ -->
  <path d="
    M 760,820
    C 940,710 1120,790 1300,680
    C 1390,630 1440,660 1440,660
    L 1440,900
    L 760,900
    Z"
    fill="url(#lwc)"/>

  <!-- ── Brillo blanco central (zona superior aireada) ── -->
  <rect width="1440" height="900" fill="url(#lhigh)"/>

</svg>`;
    }
  }, [isDark]);

  const waveEncoded = useMemo(() => {
    try {
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(waveSvg)))}`;
    } catch {
      return `data:image/svg+xml,${encodeURIComponent(waveSvg)}`;
    }
  }, [waveSvg]);

  return (
    <div
      className={`${posClass} inset-0 pointer-events-none overflow-hidden ${className ?? ''}`}
      style={{ opacity: defaultOpacity, zIndex: -1 }}
    >
      {/* Onda SVG — 100% × 100%, sin repetición, sin pérdida de calidad */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${waveEncoded}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
}
