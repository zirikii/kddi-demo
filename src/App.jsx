import { useCallback } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import StatusBar from './components/status/StatusBar.jsx';
import Toolbar from './components/toolbar/Toolbar.jsx';
import AlertFeed from './components/alerts/AlertFeed.jsx';
import { useAlerts } from './hooks/useAlerts.js';
import { useAutoRefresh } from './hooks/useAutoRefresh.js';

/**
 * KDDI NOC dashboard. Layout: header → status bar → toolbar → 2-column
 * (alert feed | escalation history). Escalation modal + detail drawer are
 * layered in by later phases.
 */
export default function App() {
  const { alerts, filtered, filters, setFilter, prependAlert, counts } = useAlerts();

  const handleLiveAlert = useCallback(
    (alert) => {
      prependAlert(alert);
    },
    [prependAlert],
  );

  const autoRefresh = useAutoRefresh(handleLiveAlert);

  return (
    <AppShell>
      <StatusBar alerts={alerts} />
      <Toolbar filters={filters} setFilter={setFilter} counts={counts} autoRefresh={autoRefresh} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
        <div className="min-h-0 h-[calc(100vh-340px)]">
          <AlertFeed
            alerts={filtered}
            totalCount={counts.total}
            onEscalate={(a) => console.info('escalate', a.id)}
            onOpenDetail={(a) => console.info('detail', a.id)}
          />
        </div>
        <aside className="rounded-xl border border-noc-border bg-noc-card p-4 text-sm text-noc-muted">
          Escalation history — added in the next phase.
        </aside>
      </div>
    </AppShell>
  );
}
