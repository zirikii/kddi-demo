import { useEffect, useRef, useState } from 'react';
import { makeLiveAlert } from '../data/alertTemplates.js';
import { AUTO_REFRESH_INTERVAL_MS } from '../lib/constants.js';

/**
 * Simulates a "live" NOC feed: while enabled, calls `onAlert` with a freshly
 * synthesized alert every `intervalMs` (default from env, 45s).
 *
 * @param {(alert:object)=>void} onAlert
 * @param {{intervalMs?:number, initialEnabled?:boolean}} [options]
 */
export function useAutoRefresh(onAlert, { intervalMs = AUTO_REFRESH_INTERVAL_MS, initialEnabled = true } = {}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const savedCallback = useRef(onAlert);

  useEffect(() => {
    savedCallback.current = onAlert;
  }, [onAlert]);

  useEffect(() => {
    if (!enabled) return undefined;
    const timer = setInterval(() => {
      savedCallback.current?.(makeLiveAlert());
    }, intervalMs);
    return () => clearInterval(timer);
  }, [enabled, intervalMs]);

  return {
    enabled,
    toggle: () => setEnabled((v) => !v),
    setEnabled,
  };
}

export default useAutoRefresh;
