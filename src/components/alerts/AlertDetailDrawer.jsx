import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, ChevronRight, Server, Tag } from 'lucide-react';
import { formatJST, timeAgo } from '../../lib/formatters.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import SeverityBadge from './SeverityBadge.jsx';
import RegionTag from './RegionTag.jsx';
import Sparkline from '../ui/Sparkline.jsx';
import EscalateButton from '../escalation/EscalateButton.jsx';

/**
 * Right-side drawer with the full event view: description, affected nodes, metric chart,
 * related alerts, and a collapsible raw JSON block.
 *
 * @param {{alert:object|null, allAlerts:object[], onClose:()=>void, onEscalate:(a)=>void, onOpenRelated:(a)=>void}} props
 */
export default function AlertDetailDrawer({ alert, allAlerts = [], onClose, onEscalate, onOpenRelated }) {
  const panelRef = useRef(null);
  const [showJson, setShowJson] = useState(false);
  useFocusTrap(panelRef, Boolean(alert), onClose);

  useEffect(() => {
    setShowJson(false);
  }, [alert?.id]);

  if (!alert) return null;

  const related = (alert.relatedIds || [])
    .map((id) => allAlerts.find((a) => a.id === id))
    .filter(Boolean);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Alert detail: ${alert.title}`}
        tabIndex={-1}
        className="flex h-full w-full max-w-md flex-col overflow-hidden border-l border-noc-border bg-noc-card shadow-2xl animate-[slide-in_0.2s_ease-out]"
      >
        <header className="flex items-start justify-between gap-3 border-b border-noc-border px-4 py-3">
          <div className="flex items-center gap-2">
            <SeverityBadge severity={alert.severity} locale="ja" />
            <RegionTag region={alert.region} />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close detail"
            className="rounded-md p-1 text-noc-muted hover:bg-noc-elevated hover:text-kddi-fg"
          >
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <div>
            <h2 className="text-base font-semibold text-kddi-fg">{alert.title}</h2>
            <p className="mt-1 font-mono text-[11px] text-noc-muted">
              {formatJST(alert.timestamp)} · {timeAgo(alert.timestamp)}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-kddi-fg/90">{alert.description}</p>

          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md border border-noc-border bg-noc-bg p-2">
              <dt className="text-noc-muted">Asset</dt>
              <dd className="mt-0.5 font-mono text-kddi-fg">{alert.asset}</dd>
            </div>
            <div className="rounded-md border border-noc-border bg-noc-bg p-2">
              <dt className="text-noc-muted">Circuit</dt>
              <dd className="mt-0.5 font-mono text-kddi-fg">{alert.circuitId}</dd>
            </div>
          </dl>

          {/* Metric chart */}
          <div className="rounded-lg border border-noc-border bg-noc-bg p-3">
            <p className="mb-2 text-xs font-medium text-noc-muted">{alert.metricLabel || 'Metric'}</p>
            <Sparkline data={alert.metric || []} height={56} className="w-full" />
          </div>

          {/* Affected nodes */}
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-noc-muted">
              <Server size={13} aria-hidden="true" /> Affected nodes
            </p>
            <ul className="space-y-1">
              {(alert.affectedNodes || []).map((node) => (
                <li
                  key={node}
                  className="rounded border border-noc-border bg-noc-bg px-2 py-1 font-mono text-[11px] text-kddi-fg"
                >
                  {node}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          {alert.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag size={13} className="text-noc-muted" aria-hidden="true" />
              {alert.tags.map((t) => (
                <span
                  key={t}
                  className="rounded bg-noc-elevated px-1.5 py-0.5 font-mono text-[10px] text-noc-muted"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Related alerts */}
          {related.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-noc-muted">Related alerts</p>
              <ul className="space-y-1">
                {related.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => onOpenRelated?.(r)}
                      className="flex w-full items-center gap-2 rounded border border-noc-border bg-noc-bg px-2 py-1.5 text-left text-xs text-kddi-fg hover:border-noc-muted"
                    >
                      <SeverityBadge severity={r.severity} showIcon={false} locale="en" />
                      <span className="truncate">{r.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Raw JSON */}
          <div className="rounded-lg border border-noc-border bg-noc-bg">
            <button
              type="button"
              onClick={() => setShowJson((v) => !v)}
              aria-expanded={showJson}
              className="flex w-full items-center gap-1.5 px-3 py-2 text-xs font-medium text-noc-muted hover:text-kddi-fg"
            >
              {showJson ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              Raw event JSON
            </button>
            {showJson && (
              <pre className="overflow-x-auto border-t border-noc-border px-3 py-2 font-mono text-[10px] leading-relaxed text-kddi-fg/80">
                {JSON.stringify(alert, null, 2)}
              </pre>
            )}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-noc-border px-4 py-3">
          {alert.escalated ? (
            <span className="text-xs text-region-healthy">Already escalated</span>
          ) : (
            <span className="text-xs text-noc-muted">Not yet escalated</span>
          )}
          <EscalateButton size="md" onClick={() => onEscalate?.(alert)} alertTitle={alert.title} />
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
