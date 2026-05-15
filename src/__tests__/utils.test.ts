import { describe, it, expect } from 'vitest';
import { cn, formatDate, truncate, maskEmail, clamp, randomBetween } from '../utils';

describe('cn', () => {
  it('joins truthy class strings', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });
  it('filters out falsy values', () => {
    expect(cn('a', null, undefined, false, 'b')).toBe('a b');
  });
  it('returns empty string when all values are falsy', () => {
    expect(cn(null, false, undefined)).toBe('');
  });
});

describe('formatDate', () => {
  it('formats a valid ISO date string in Spanish', () => {
    const result = formatDate('2025-05-15');
    expect(result).toMatch(/mayo/i);
    expect(result).toMatch(/2025/);
  });
});

describe('truncate', () => {
  it('returns the original string when shorter than maxLength', () => {
    expect(truncate('hola', 10)).toBe('hola');
  });
  it('returns the original string when equal to maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });
  it('truncates and appends ellipsis when longer than maxLength', () => {
    const result = truncate('hello world', 5);
    expect(result.startsWith('hello')).toBe(true);
    expect(result.length).toBeLessThan('hello world'.length);
  });
});

describe('maskEmail', () => {
  it('masks the local part of an email', () => {
    const result = maskEmail('patricia@mail.com');
    expect(result).toContain('@mail.com');
    expect(result).not.toBe('patricia@mail.com');
  });
  it('returns the original value if not a valid email', () => {
    expect(maskEmail('notanemail')).toBe('notanemail');
  });
});

describe('clamp', () => {
  it('returns the value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
  it('returns min when value is below range', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });
  it('returns max when value is above range', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('randomBetween', () => {
  it('returns a value within the specified range', () => {
    for (let i = 0; i < 50; i++) {
      const result = randomBetween(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    }
  });
  it('returns the only possible value when min equals max', () => {
    expect(randomBetween(7, 7)).toBe(7);
  });
});
