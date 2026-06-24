import { Inbox } from 'lucide-react';

/** Centered empty-state placeholder for lists/panels. */
export default function EmptyState({ icon: Icon = Inbox, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
      <Icon size={28} className="text-noc-muted" />
      <p className="text-sm font-medium text-kddi-fg">{title}</p>
      {message && <p className="max-w-xs text-xs text-noc-muted">{message}</p>}
    </div>
  );
}
