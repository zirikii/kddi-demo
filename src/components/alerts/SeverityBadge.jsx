import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import { cx } from '../../lib/cx.js';
import { severityLabel } from '../../lib/formatters.js';

const CONFIG = {
  critical: {
    icon: AlertOctagon,
    cls: 'text-sev-critical bg-sev-critical-bg border-sev-critical-border',
  },
  warning: {
    icon: AlertTriangle,
    cls: 'text-sev-warning bg-sev-warning-bg border-sev-warning-border',
  },
  info: {
    icon: Info,
    cls: 'text-sev-info bg-sev-info-bg border-sev-info-border',
  },
};

/**
 * Severity pill with icon + bilingual label.
 * @param {{severity:'critical'|'warning'|'info', locale?:string, showIcon?:boolean}} props
 */
export default function SeverityBadge({ severity, locale, showIcon = true }) {
  const config = CONFIG[severity] || CONFIG.info;
  const Icon = config.icon;
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold',
        config.cls,
      )}
      aria-label={`Severity: ${severityLabel(severity, 'en')}`}
      data-severity={severity}
    >
      {showIcon && <Icon size={12} aria-hidden="true" />}
      {severityLabel(severity, locale)}
    </span>
  );
}
