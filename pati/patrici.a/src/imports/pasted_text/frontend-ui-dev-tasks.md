Prompt Maestro de Desarrollo Frontend y UI
Contexto: Estamos desarrollando una aplicación móvil y de escritorio centrada en la interacción social y la gamificación (con un álbum de estampas). Necesito tu ayuda como Senior Frontend Developer y UI Designer para corregir errores, refinar la estética e implementar nuevas funcionalidades clave.

Tecnologías: [Inserta aquí tu stack tecnológico, ej: React Native, Tailwind CSS, Flutter, Next.js, etc.]

TAREA PRINCIPAL: Correcciones y Mejoras de la App

Por favor, aborda los siguientes puntos de forma secuencial y detallada, proporcionando el código necesario para cada uno:

1. DEBUGGING Y UX: Vista de Detalles del Parche
Problema Crítico: Al intentar entrar a la vista de 'Detalles de un Parche', la aplicación se rompe y muestra un error en la pantalla, impidiendo que el usuario vea la información.

Tu Tarea: Analiza las causas más probables de este error (fallos en las rutas, parámetros de ID indefinidos al realizar el fetch de datos, o componentes que intentan acceder a propiedades nulas). Propón un bloque de código robusto para esta vista, que incluya manejo de errores (try/catch o Error Boundaries) y, crucialmente, un estado de carga (como un 'Skeleton Loader') para evitar que la interfaz se renderice sin datos válidos. El objetivo es que la aplicación no se caiga y muestre información útil al usuario.

2. REFINAMIENTO ESTÉTICO: Acentos en Dorado (Impacto Elevado)
Problema/Oportunidad: Nuestra paleta de colores es hermosa, pero queremos usar el color dorado existente de forma estratégica para que la app se sienta más premium e impactante.

Tu Tarea: Identifica los componentes de mayor impacto (ej. el botón principal de 'Unirse al Parche', los bordes de tarjetas destacadas, iconos de navegación activa o medallas de usuario) y aplica el color dorado.

Importante: Dame los códigos de color hexadecimales y/o clases de estilo específicas para el modo claro y el modo oscuro. Asegúrate de mantener una excelente legibilidad y contraste (cumpliendo con WCAG). No satures la interfaz; úsalo como un acento de lujo.

3. UX DESKTOP Y CHAT: Layout y Menú Contextual
Mejora de UX Desktop: Cuando la app se use en modo escritorio, al entrar a un chat individual, la lista de todos los demás chats debe permanecer visible en una columna lateral (layout de dos columnas). Esto es crucial para la multitarea en PC.

Tu Tarea: Modifica el componente de diseño (layout) para que sea responsivo, implementando este patrón de diseño 'Master-Detail' en pantallas grandes.

Corrección de Error en Chat: Dentro de cualquier chat, al presionar el icono de los 'tres puntos' (menú contextual) en la parte superior derecha, ocurre un error.

Tu Tarea: Corrige este error y propón las funcionalidades que deberían estar presentes en este menú para un chat social, como: "Ver perfil del usuario", "Ver multimedia compartida", "Silenciar chat", "Eliminar chat", etc. Proporciona el código de UI y la lógica básica para este menú desplegable.

4. NUEVA FUNCIONALIDAD: El Álbum de Estampas (Gamificación)
El Objetivo: Crear una experiencia inmersiva para el álbum, similar a un álbum físico (ej. el del Mundial).

Fondo Dinámico: El fondo de la pantalla del álbum debe cambiar de color (más allá del blanco/negro base) dependiendo de si el usuario está en modo claro u oscuro para complementar la estética de las estampas.

Experiencia de Navegación 'Flip-Book': La navegación entre páginas no debe ser un scroll simple. Necesitamos implementar una animación de 'cambio de página' tipo libro (flip animation). El usuario debe sentir que "pasa la hoja" del álbum.

Tu Tarea: Propón una solución técnica (usando bibliotecas de animación compatibles con nuestro stack) y el código de UI para lograr este efecto visual y táctil al navegar por las páginas.

Página de Estadísticas Única: Las estadísticas del álbum (total de estampas, porcentaje completado, estampas repetidas) deben estar concentradas únicamente en la primera página del álbum.

5. DISEÑO DE FONDO: Patrón de "Doodles" Temático (Branding)
El Objetivo: Rellenar las pantallas que se vean vacías o aburridas con un fondo de textura sutil que refuerce nuestra identidad de marca.

Referencia Visual: [Inserta aquí tu imagen de referencia image_0.png, que es el fondo oscuro de WhatsApp con pequeños iconos/doodles].

Tu Tarea: Diseña un nuevo fondo de patrón repetitivo (tiling background) que sea estéticamente muy similar a la imagen de referencia, pero que reemplace los iconos genéricos por figuritas y símbolos alusivos a nuestra app (ej. si la app es para estudiantes, usa iconos de libros, mochilas, cafés, computadoras; si es de juegos, usa dados, mandos, pociones, etc. según la temática de "nuestros parches").

Requisito Crítico: Este fondo debe tener dos versiones: una versión clara para el modo claro y una versión oscura para el modo oscuro, asegurando que los "doodles" sean sutiles y no distraigan del contenido principal de la app.

Formato de respuesta:
Por favor, responde a cada punto con:

Una explicación breve de tu enfoque para solucionar el problema o implementar la funcionalidad.

Los fragmentos de código específicos y listos para usar (con comentarios).

Los códigos de color hexadecimales o clases de estilo necesarios (ej. Tailwind o CSS).