import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { cx } from '../../lib/cx.js';

const STYLES = {
  success: { icon: CheckCircle2, cls: 'border-region-healthy/50 text-region-healthy' },
  warning: { icon: AlertTriangle, cls: 'border-sev-warning/50 text-sev-warning' },
  error: { icon: AlertTriangle, cls: 'border-sev-critical/50 text-sev-critical' },
  info: { icon: Info, cls: 'border-sev-info/50 text-sev-info' },
};

/** A single toast notification with auto-dismiss. */
export default function Toast({ toast, onDismiss }) {
  const { id, type = 'info', message, duration = 4000 } = toast;
  const { icon: Icon, cls } = STYLES[type] || STYLES.info;

  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onDismiss]);

  return (
    <div
      role="status"
      className={cx(
        'pointer-events-auto flex w-80 items-start gap-3 rounded-lg border bg-noc-elevated px-4 py-3 shadow-xl',
        'animate-[slide-in_0.25s_ease-out]',
        cls,
      )}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm text-kddi-fg">{message}</p>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-noc-muted transition-colors hover:text-kddi-fg"
      >
        <X size={16} />
      </button>
    </div>
  );
}
