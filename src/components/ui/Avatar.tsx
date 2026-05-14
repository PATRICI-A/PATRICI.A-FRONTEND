import { GRADIENT } from '../../types/mockData';
interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
  gradient?: string;
  fontSize?: string;
}
export function Avatar({ name, size = 40, className = '', gradient = GRADIENT, fontSize }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const sizeStyle = size === 0 ? {} : { width: size, height: size };
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white ${className}`}
      style={{
        ...sizeStyle,
        background: gradient,
        fontSize: fontSize || (size > 32 ? '14px' : '10px')
      }}
    >
      {initials}
    </div>
  );
}