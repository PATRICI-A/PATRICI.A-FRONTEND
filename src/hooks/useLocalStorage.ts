import { useState, useEffect, useCallback } from 'react';
interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (val: T) => void;
  removeValue: () => void;
}
export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
  const [value, setValueState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = useCallback(
    (val: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(val));
        setValueState(val);
      } catch {
        setValueState(val);
      }
    },
    [key]
  );
  const removeValue = useCallback(() => {
    localStorage.removeItem(key);
    setValueState(initialValue);
  }, [key, initialValue]);
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValueState(JSON.parse(e.newValue) as T);
        } catch {
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key]);
  return { value, setValue, removeValue };
}