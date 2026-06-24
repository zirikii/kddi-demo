import { Radio, SearchX } from 'lucide-react';
import AlertRow from './AlertRow.jsx';
import EmptyState from '../ui/EmptyState.jsx';

/**
 * Scrollable, newest-first list of alerts.
 *
 * @param {{alerts:object[], onEscalate, onOpenDetail, totalCount:number}} props
 */
export default function AlertFeed({ alerts, onEscalate, onOpenDetail, totalCount }) {
  return (
    <section
      aria-label="Live alert feed"
      className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-noc-border bg-noc-card"
    >
      <header className="flex items-center justify-between border-b border-noc-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Radio size={15} className="text-kddi-arc" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-kddi-fg">Live Alert Feed</h2>
          <span className="font-mono text-xs text-noc-muted">
            {alerts.length}
            {totalCount != null && totalCount !== alerts.length ? ` / ${totalCount}` : ''}
          </span>
        </div>
        <span className="text-[11px] text-noc-muted">newest first</span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {alerts.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No matching alerts"
            message="Adjust severity, region, or search filters to see more events."
          />
        ) : (
          alerts.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              onEscalate={onEscalate}
              onOpenDetail={onOpenDetail}
            />
          ))
        )}
      </div>
    </section>
  );
}
