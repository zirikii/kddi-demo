import { useAlerts } from './hooks/useAlerts.js';
import StatusBar from './components/status/StatusBar.jsx';
import AlertFeed from './components/alerts/AlertFeed.jsx';

/**
 * Phase 6 starter shell — renders the regional status bar and the live alert feed.
 * Header, toolbar, escalation, and detail drawer are layered in by later phases.
 */
export default function App() {
  const { alerts, filtered, counts } = useAlerts();

  return (
    <div className="min-h-screen bg-noc-bg text-kddi-fg">
      <main className="mx-auto max-w-[1600px] space-y-4 p-4">
        <StatusBar alerts={alerts} />
        <div className="grid h-[calc(100vh-220px)] grid-cols-1">
          <AlertFeed
            alerts={filtered}
            totalCount={counts.total}
            onEscalate={(a) => console.info('escalate', a.id)}
            onOpenDetail={(a) => console.info('detail', a.id)}
          />
        </div>
      </main>
    </div>
  );
}
