import { ArrowUpRight } from 'lucide-react';
import Button from '../ui/Button.jsx';

/**
 * Outline Escalate button. The parent owns modal state; this just signals intent.
 */
export default function EscalateButton({ onClick, size = 'sm', alertTitle }) {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      aria-label={alertTitle ? `Escalate alert: ${alertTitle}` : 'Escalate alert'}
    >
      <ArrowUpRight size={14} aria-hidden="true" />
      Escalate
    </Button>
  );
}
