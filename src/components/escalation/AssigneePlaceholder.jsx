import { UserPlus, Lock } from 'lucide-react';

/**
 * INTENTIONALLY INCOMPLETE — demo stub.
 *
 * This renders a visible, disabled "Assignee" field with helper text. It is NOT wired
 * to component state or the escalation payload. During the live demo an agent will turn
 * this into a working assignee picker (multi-file edit). Do not implement it here.
 *
 * See the matching `// TODO(live-demo)` in EscalateModal.jsx.
 */
export default function AssigneePlaceholder() {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-noc-muted">
        Assignee
        <span className="ml-1.5 rounded bg-noc-elevated px-1 py-px text-[10px] font-normal text-noc-muted">
          coming soon
        </span>
      </label>
      <div
        aria-disabled="true"
        className="flex items-center justify-between gap-2 rounded-md border border-dashed border-noc-border bg-noc-bg/50 px-3 py-2 text-sm text-noc-muted"
      >
        <span className="flex items-center gap-2">
          <UserPlus size={15} aria-hidden="true" />
          Select assignee…
        </span>
        <Lock size={13} aria-hidden="true" />
      </div>
      <p className="mt-1 text-[11px] text-noc-muted">
        Assignee selection — to be added in live demo.
      </p>
    </div>
  );
}
