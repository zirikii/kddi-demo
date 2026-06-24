import { useEscalationContext } from '../context/EscalationContext.jsx';

/** Convenience accessor for the escalation log. */
export function useEscalations() {
  return useEscalationContext();
}

export default useEscalations;
