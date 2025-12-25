import { useEffect, useState } from 'react';

/**
 * Debounce a value so it only updates after `delayMs` without changes.
 * Useful to avoid expensive work (e.g. 3D rebuilds) on every slider tick.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}


