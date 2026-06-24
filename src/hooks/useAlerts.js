import { useState, useMemo, useCallback } from 'react';
import { mockAlerts } from '../data/mockAlerts.js';

/**
 * Pure filter used by the feed (exported for unit tests).
 * @param {Array} alerts
 * @param {{severity?:string, region?:string, search?:string}} filters
 */
export function filterAlerts(alerts, { severity = 'all', region = 'all', search = '' } = {}) {
  const q = search.trim().toLowerCase();
  return alerts.filter((a) => {
    if (severity !== 'all' && a.severity !== severity) return false;
    if (region !== 'all' && a.region !== region) return false;
    if (q) {
      const haystack = [a.asset, a.title, a.circuitId, ...(a.tags || [])]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Sort newest-first by timestamp. */
export function sortByNewest(alerts) {
  return [...alerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Stateful alert store for the dashboard: holds alerts, exposes filtered view,
 * supports prepending live alerts and marking an alert escalated.
 */
export function useAlerts(initial = mockAlerts) {
  const [alerts, setAlerts] = useState(() => sortByNewest(initial));
  const [filters, setFilters] = useState({ severity: 'all', region: 'all', search: '' });

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const prependAlert = useCallback((alert) => {
    setAlerts((prev) => [alert, ...prev]);
  }, []);

  const markEscalated = useCallback((alertId) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, escalated: true } : a)));
  }, []);

  const filtered = useMemo(() => filterAlerts(alerts, filters), [alerts, filters]);

  const counts = useMemo(
    () => ({
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === 'critical').length,
      warning: alerts.filter((a) => a.severity === 'warning').length,
      info: alerts.filter((a) => a.severity === 'info').length,
      filtered: filtered.length,
    }),
    [alerts, filtered],
  );

  return {
    alerts,
    filtered,
    filters,
    setFilter,
    prependAlert,
    markEscalated,
    counts,
  };
}

export default useAlerts;
