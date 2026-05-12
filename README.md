# Patricia Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React-Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

Red social académica y de entretenimiento para estudiantes universitarios. Conecta usuarios con intereses similares, facilita la creación de grupos de estudio y entretenimiento (Parches), y proporciona recomendaciones inteligentes basadas en perfiles.

## Descripción del proyecto

Patricia es una plataforma integral diseñada para resolver la fragmentación de conexiones estudiantiles en universidades. Los estudiantes actuales enfrentan dificultades para encontrar compañeros con intereses similares, formar grupos de estudio efectivos y participar en actividades extracurriculares organizadas. Nuestra solución automatiza el emparejamiento de usuarios ("Perfect Matches") y ofrece gestión de grupos o "Parches", creando un ecosistema de conexión académica y social.

## Equipo

Desarrollado por estudiantes de la Escuela Colombiana de Ingeniería como proyecto académico.

## Stack técnico

- **Frontend:** React 19 con TypeScript 6
- **Build tool:** Vite 8
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Animaciones:** Motion (Framer Motion)
- **Iconos:** Lucide React
- **Testing:** Vitest + React Testing Library
- **Runtime:** Node.js 18+

## Primeros pasos

### Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

### Instalación

```bash
git clone <repository-url>
cd patricia-frontend
npm install
```

### Desarrollo local

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Compilar para producción
npm run preview   # Visualizar build de producción
npm run lint      # Validación de código con ESLint
npm run test      # Ejecutar tests con Vitest
npm run coverage  # Cobertura de tests
```

## Arquitectura del proyecto

```
src/
├── __tests__/              # Tests unitarios
├── assets/                 # Imágenes y recursos estáticos
├── components/             # Componentes reutilizables
│   ├── layout/            # Layout, sidebar, bottom nav
│   └── ui/                # Componentes UI (DoodleBackground, EmojiIcon)
├── context/               # Estado global con Context API
├── data/                  # Datos mock e interfaces TypeScript
├── pages/                 # Páginas de la aplicación
├── App.tsx                # Componente raíz con RouterProvider
├── routes.tsx             # Configuración de rutas
├── main.tsx               # Entry point
└── index.css              # Estilos globales + Tailwind
```

## Módulos funcionales

### Autenticación
- Registro multi-paso con verificación OTP
- Login con correo institucional (@mail.escuelaing.edu.co)
- Recuperación de contraseña
- Selección de intereses durante el registro

### Dashboard (Home)
- Feed personalizado con recomendaciones
- Álbum de Patricias (coleccionables)
- Perfect Matches (usuarios afines)
- University Pulse (eventos activos)
- Parches sugeridos

### Gestión de Parches
- Crear, explorar y unirse a parches
- Filtrado por categoría e intereses
- Invitaciones y sistema de membresía
- Chat grupal integrado

### Sistema de Matching
- Algoritmo de compatibilidad por intereses
- Solicitudes de conexión
- Perfiles detallados de usuarios

### Chat
- Conversaciones directas 1:1
- Chat grupal por parche
- Envío de imágenes y texto

### Eventos
- Calendario de eventos del campus
- Inscripción directa
- Categorización por tipo

### Mapa del Campus
- Mapa interactivo con puntos de interés
- Geolocalización en tiempo real
- Eventos anclados a ubicaciones

### Perfil y Estadísticas
- Perfil editable con avatar, bio e intereses
- Estadísticas de participación
- Sistema de logros y XP
- Ranking por facultad

### Bienestar
- Seguimiento de estado de ánimo
- Métricas de bienestar
- Gráficas de progreso

### Administración
- Panel de administración con métricas
- Gestión de usuarios, parches y eventos
- Moderación de contenido

## Convenciones de código

- **Componentes:** PascalCase (`HomePage.tsx`)
- **Variables y funciones:** camelCase
- **Constantes:** UPPER_SNAKE_CASE
- **Estilos:** Tailwind CSS utility-first

## Diseño en Figma

[Acceder al prototipo completo en Figma](https://www.figma.com/make/59CwVEOfPEh0XDaqZfEl3o/patrici.a)

## Deployment

```bash
npm run build
```

La carpeta `dist/` contiene los archivos compilados listos para producción.

## Contribuir

1. Consulta con el equipo de desarrollo
2. Sigue los estándares de código del proyecto
3. Asegúrate de que tu código pase tests y linting

---
