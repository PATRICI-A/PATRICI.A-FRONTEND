export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}
export function formatTime(time: string): string {
  // If already in 12h format (contains AM/PM), return as-is
  if (/[AP]M/i.test(time)) return time;
  // Try to parse HH:MM 24h format
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = hours >= 12 ? 'PM' : 'AM';
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  return `${hours}:${minutes} ${period}`;
}
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}\u2026`;
}
export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  return `${user.slice(0, 2)}${'*'.repeat(Math.max(user.length - 2, 3))}@${domain}`;
}
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}