import { History, Bell, BellOff } from 'lucide-react';
import { useEscalations } from '../../hooks/useEscalations.js';
import { timeAgo, formatJST, priorityLabel, truncate } from '../../lib/formatters.js';
import { getTeam } from '../../data/teams.js';
import EmptyState from '../ui/EmptyState.jsx';
import { cx } from '../../lib/cx.js';

const PRIORITY_CLS = {
  P1: 'border-sev-critical-border bg-sev-critical-bg text-sev-critical',
  P2: 'border-sev-warning-border bg-sev-warning-bg text-sev-warning',
  P3: 'border-sev-info-border bg-sev-info-bg text-sev-info',
};

/** Right-column panel listing past escalations (most recent first), persisted to localStorage. */
export default function EscalationHistory() {
  const { escalations } = useEscalations();

  return (
    <section
      aria-label="Escalation history"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-noc-border bg-noc-card"
    >
      <header className="flex items-center justify-between border-b border-noc-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <History size={15} className="text-kddi-arc" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-kddi-fg">Escalation History</h2>
        </div>
        <span className="font-mono text-xs text-noc-muted">{escalations.length}</span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {escalations.length === 0 ? (
          <EmptyState
            icon={History}
            title="No escalations yet"
            message="Escalate an alert from the feed to record it here."
          />
        ) : (
          <ul className="divide-y divide-noc-border">
            {escalations.map((esc) => {
              const team = getTeam(esc.team);
              return (
                <li key={esc.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-medium text-kddi-fg">
                        {team?.name ?? esc.team}
                      </span>
                      <span
                        className={cx(
                          'rounded border px-1.5 py-0.5 text-[10px] font-semibold',
                          PRIORITY_CLS[esc.priority] || PRIORITY_CLS.P3,
                        )}
                      >
                        {priorityLabel(esc.priority, 'short')}
                      </span>
                      {esc.notify ? (
                        <Bell size={12} className="text-region-healthy" aria-label="Team notified" />
                      ) : (
                        <BellOff size={12} className="text-noc-muted" aria-label="No notification" />
                      )}
                    </span>
                    <time
                      dateTime={esc.createdAt}
                      title={formatJST(esc.createdAt)}
                      className="shrink-0 font-mono text-[11px] text-noc-muted"
                    >
                      {timeAgo(esc.createdAt)}
                    </time>
                  </div>
                  <p className="mt-1 text-xs text-kddi-fg">
                    {truncate(esc.alertSnapshot?.title || '', 60)}
                  </p>
                  <p className="mt-1 text-[11px] text-noc-muted">{truncate(esc.note, 90)}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
