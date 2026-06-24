import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Textarea from '../ui/Textarea.jsx';
import SeverityBadge from '../alerts/SeverityBadge.jsx';
import RegionTag from '../alerts/RegionTag.jsx';
import TeamSelector from './TeamSelector.jsx';
import PrioritySelector from './PrioritySelector.jsx';
import AssigneePlaceholder from './AssigneePlaceholder.jsx';
import { formatJST } from '../../lib/formatters.js';
import { getTeam } from '../../data/teams.js';

const NOTE_MIN = 10;

/**
 * Escalation modal. Team, priority, note, and notify are fully wired.
 *
 * The Assignee field is intentionally a non-functional placeholder rendered by
 * <AssigneePlaceholder />. It is NOT part of component state and is NOT included in the
 * submitted payload — a live demo will add it.
 *
 * @param {{open:boolean, alert:object|null, onClose:()=>void, onSubmit:(payload)=>void}} props
 */
export default function EscalateModal({ open, alert, onClose, onSubmit }) {
  const [team, setTeam] = useState('noc');
  const [priority, setPriority] = useState('P2');
  const [note, setNote] = useState('');
  const [notify, setNotify] = useState(true);
  const [touched, setTouched] = useState(false);

  // Reset the form each time the modal opens for a (possibly different) alert.
  useEffect(() => {
    if (open) {
      setTeam('noc');
      setPriority('P2');
      setNote('');
      setNotify(true);
      setTouched(false);
    }
  }, [open, alert?.id]);

  if (!alert) return null;

  const noteError =
    touched && note.trim().length < NOTE_MIN
      ? `Note is required (min ${NOTE_MIN} characters).`
      : '';
  const valid = Boolean(team) && Boolean(priority) && note.trim().length >= NOTE_MIN;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;

    // NOTE: assignee is intentionally absent from this payload.
    // TODO(live-demo): wire assignee picker — add `assignee` to state and include it here.
    onSubmit({
      alertId: alert.id,
      team,
      priority,
      note: note.trim(),
      notify,
      alertSnapshot: {
        title: alert.title,
        severity: alert.severity,
        region: alert.region,
        asset: alert.asset,
      },
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Escalate alert"
      subtitle={getTeam(team)?.description}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-only alert summary */}
        <div className="rounded-lg border border-noc-border bg-noc-bg p-3">
          <div className="mb-1.5 flex items-center gap-2">
            <SeverityBadge severity={alert.severity} locale="ja" />
            <RegionTag region={alert.region} />
          </div>
          <p className="text-sm font-medium text-kddi-fg">{alert.title}</p>
          <p className="mt-1 font-mono text-[11px] text-noc-muted">
            {alert.asset} · {alert.circuitId} · {formatJST(alert.timestamp)}
          </p>
        </div>

        <TeamSelector value={team} onChange={setTeam} />
        <PrioritySelector value={priority} onChange={setPriority} />

        {/* Intentionally non-functional — see component + TODO above */}
        <AssigneePlaceholder />

        <Textarea
          label="Note"
          required
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="エスカレーション理由を入力..."
          rows={3}
          error={noteError}
          helper={`Min ${NOTE_MIN} characters. ${note.trim().length}/${NOTE_MIN}`}
        />

        <label className="flex cursor-pointer items-center gap-2 text-sm text-kddi-fg">
          <input
            type="checkbox"
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
            className="h-4 w-4 accent-kddi-arc"
          />
          <Bell size={14} className="text-noc-muted" aria-hidden="true" />
          Send notification to team channel
        </label>

        <div className="flex items-center justify-end gap-2 border-t border-noc-border pt-4">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={touched && !valid}>
            Escalate
          </Button>
        </div>
      </form>
    </Modal>
  );
}
