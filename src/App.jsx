import { useCallback, useState } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import StatusBar from './components/status/StatusBar.jsx';
import Toolbar from './components/toolbar/Toolbar.jsx';
import AlertFeed from './components/alerts/AlertFeed.jsx';
import AlertDetailDrawer from './components/alerts/AlertDetailDrawer.jsx';
import EscalateModal from './components/escalation/EscalateModal.jsx';
import EscalationHistory from './components/escalation/EscalationHistory.jsx';
import { useAlerts } from './hooks/useAlerts.js';
import { useAutoRefresh } from './hooks/useAutoRefresh.js';
import { useEscalations } from './hooks/useEscalations.js';
import { useToast } from './context/ToastContext.jsx';
import { getTeam } from './data/teams.js';
import { priorityLabel } from './lib/formatters.js';

/**
 * KDDI NOC dashboard. Layout: header → status bar → toolbar → 2-column
 * (alert feed | escalation history). Owns escalation-modal and detail-drawer state.
 */
export default function App() {
  const { alerts, filtered, filters, setFilter, prependAlert, markEscalated, counts } = useAlerts();
  const { addEscalation } = useEscalations();
  const { push } = useToast();

  const [escalateTarget, setEscalateTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

  const handleLiveAlert = useCallback((alert) => prependAlert(alert), [prependAlert]);
  const autoRefresh = useAutoRefresh(handleLiveAlert);

  const requestEscalate = useCallback((alert) => {
    // Re-escalation policy: confirm before escalating an already-escalated alert.
    if (alert.escalated) {
      const ok = window.confirm(
        `“${alert.title}” is already escalated. Escalate again?`,
      );
      if (!ok) return;
    }
    setEscalateTarget(alert);
  }, []);

  const handleEscalateSubmit = useCallback(
    (payload) => {
      addEscalation(payload);
      markEscalated(payload.alertId);
      const teamName = getTeam(payload.team)?.name ?? payload.team;
      push({
        type: 'success',
        message: `Escalated to ${teamName} · ${priorityLabel(payload.priority, 'short')}`,
      });
      if (payload.notify) {
        push({ type: 'info', message: `Notification sent to ${teamName} channel (mock)` });
      }
      setEscalateTarget(null);
    },
    [addEscalation, markEscalated, push],
  );

  return (
    <AppShell>
      <StatusBar alerts={alerts} />
      <Toolbar filters={filters} setFilter={setFilter} counts={counts} autoRefresh={autoRefresh} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
        <div className="h-[calc(100vh-340px)] min-h-0">
          <AlertFeed
            alerts={filtered}
            totalCount={counts.total}
            onEscalate={requestEscalate}
            onOpenDetail={setDetailTarget}
          />
        </div>
        <aside className="h-[calc(100vh-340px)] min-h-0">
          <EscalationHistory />
        </aside>
      </div>

      <EscalateModal
        open={Boolean(escalateTarget)}
        alert={escalateTarget}
        onClose={() => setEscalateTarget(null)}
        onSubmit={handleEscalateSubmit}
      />

      <AlertDetailDrawer
        alert={detailTarget}
        allAlerts={alerts}
        onClose={() => setDetailTarget(null)}
        onEscalate={(a) => {
          setDetailTarget(null);
          requestEscalate(a);
        }}
        onOpenRelated={setDetailTarget}
      />
    </AppShell>
  );
}
