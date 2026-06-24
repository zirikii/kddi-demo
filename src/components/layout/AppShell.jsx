import Header from './Header.jsx';

/** Page chrome: sticky header + padded main content region. */
export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-noc-bg text-kddi-fg">
      <Header />
      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-4 p-4">{children}</main>
      <footer className="border-t border-noc-border px-4 py-3 text-center text-[11px] text-noc-muted">
        KDDI Network Operations · NOC demo console — unofficial, not affiliated with KDDI Corporation.
      </footer>
    </div>
  );
}
