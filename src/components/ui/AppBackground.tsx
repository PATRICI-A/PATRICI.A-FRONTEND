import { useApp } from '../../store/AppContext';
import lightBg from '../../assets/image-3.png';
import darkBg from '../../assets/image-4.png';
export function AppBackground() {
  const { isDark } = useApp();
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundImage: `url(${isDark ? darkBg : lightBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none',
      }}
    />
  );
}