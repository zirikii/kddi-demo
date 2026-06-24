import { useState } from 'react';
import { CheckCircle2, Server } from 'lucide-react';
import { cx } from '../../lib/cx.js';
import { timeAgo, formatJST } from '../../lib/formatters.js';
import SeverityBadge from './SeverityBadge.jsx';
import RegionTag from './RegionTag.jsx';
import EscalateButton from '../escalation/EscalateButton.jsx';

/**
 * A single alert row. Clicking the row (but not the Escalate button) opens the detail drawer.
 *
 * @param {{alert:object, onEscalate:(a)=>void, onOpenDetail:(a)=>void}} props
 */
export default function AlertRow({ alert, onEscalate, onOpenDetail }) {
  const [hover, setHover] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenDetail?.(alert);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${alert.title}`}
      onClick={() => onOpenDetail?.(alert)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cx(
        'group flex cursor-pointer items-center gap-3 border-b border-noc-border px-4 py-2.5 transition-colors',
        'hover:bg-noc-elevated focus-visible:bg-noc-elevated focus-visible:outline-none',
        alert.isNew && 'animate-[slide-in_0.4s_ease-out]',
      )}
    >
      <SeverityBadge severity={alert.severity} locale="ja" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-kddi-fg">{alert.title}</p>
          {alert.escalated && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded border border-region-healthy/40 bg-region-healthy/10 px-1.5 py-0.5 text-[10px] font-medium text-region-healthy">
              <CheckCircle2 size={10} aria-hidden="true" />
              Escalated
            </span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <RegionTag region={alert.region} />
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-noc-muted">
            <Server size={11} aria-hidden="true" />
            {alert.asset}
          </span>
          <span className="font-mono text-[11px] text-noc-muted">{alert.circuitId}</span>
        </div>
      </div>

      <time
        dateTime={alert.timestamp}
        title={formatJST(alert.timestamp)}
        className="shrink-0 font-mono text-[11px] text-noc-muted tabular-nums"
      >
        {timeAgo(alert.timestamp)}
      </time>

      <div
        className={cx(
          'shrink-0 transition-opacity',
          hover ? 'opacity-100' : 'opacity-70',
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <EscalateButton onClick={() => onEscalate?.(alert)} alertTitle={alert.title} />
      </div>
    </div>
  );
}
