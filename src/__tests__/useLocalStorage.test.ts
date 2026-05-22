import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 42));
    expect(result.current.value).toBe(42);
  });

  it('reads an existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify(99));
    const { result } = renderHook(() => useLocalStorage('test-key', 0));
    expect(result.current.value).toBe(99);
  });

  it('updates the stored value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'a'));
    act(() => {
      result.current.setValue('b');
    });
    expect(result.current.value).toBe('b');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('b'));
  });

  it('removes the value and reverts to initial', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    act(() => {
      result.current.setValue('stored');
    });
    act(() => {
      result.current.removeValue();
    });
    expect(result.current.value).toBe('default');
    expect(localStorage.getItem('test-key')).toBeNull();
  });

  it('works with object values', () => {
    const initial = { name: 'patricia', level: 1 };
    const { result } = renderHook(() => useLocalStorage('obj-key', initial));
    act(() => {
      result.current.setValue({ name: 'patricia', level: 14 });
    });
    expect(result.current.value).toEqual({ name: 'patricia', level: 14 });
  });
});
