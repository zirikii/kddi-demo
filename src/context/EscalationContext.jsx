/* eslint-disable react-refresh/only-export-components -- provider + hook are intentionally colocated */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { readJSON, writeJSON } from '../lib/storage.js';
import { STORAGE_KEYS } from '../lib/constants.js';
import seedEscalations from '../../data/escalations.json';

const EscalationContext = createContext(null);

let counter = 0;
const newId = () => {
  counter += 1;
  return `esc-${Date.now().toString(36)}-${counter}`;
};

/**
 * Holds the escalation log. Hydrates from localStorage; on first run falls back to the
 * committed data/escalations.json seed. Persists on every change.
 *
 * NOTE: the escalation schema intentionally has NO `assignee` field yet — it can be added
 * later without a migration because new keys simply appear on future records.
 */
export function EscalationProvider({ children }) {
  const [escalations, setEscalations] = useState(() => {
    const stored = readJSON(STORAGE_KEYS.escalations, null);
    return Array.isArray(stored) ? stored : seedEscalations;
  });

  useEffect(() => {
    writeJSON(STORAGE_KEYS.escalations, escalations);
  }, [escalations]);

  const addEscalation = useCallback((escalation) => {
    const record = {
      id: newId(),
      createdAt: new Date().toISOString(),
      ...escalation,
    };
    setEscalations((prev) => [record, ...prev]);
    return record;
  }, []);

  const clearEscalations = useCallback(() => setEscalations([]), []);

  return (
    <EscalationContext.Provider value={{ escalations, addEscalation, clearEscalations }}>
      {children}
    </EscalationContext.Provider>
  );
}

export function useEscalationContext() {
  const ctx = useContext(EscalationContext);
  if (!ctx) throw new Error('useEscalationContext must be used within an EscalationProvider');
  return ctx;
}

export default EscalationContext;
