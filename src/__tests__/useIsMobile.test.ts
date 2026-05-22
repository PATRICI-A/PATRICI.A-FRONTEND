import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../hooks/useIsMobile';

describe('useIsMobile', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true when window width is below the default breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false when window width is above the default breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1280 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('respects a custom breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    const { result } = renderHook(() => useIsMobile(1024));
    expect(result.current).toBe(true);
  });

  it('returns false at exactly the breakpoint value', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 });
    const { result } = renderHook(() => useIsMobile(768));
    expect(result.current).toBe(false);
  });
});
