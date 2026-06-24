import { useEffect, useState } from 'react';

/** Ticks every `intervalMs` (default 1s) and returns the current Date. */
export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export default useClock;
