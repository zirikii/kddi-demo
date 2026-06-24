import { Users } from 'lucide-react';
import { cx } from '../../lib/cx.js';
import { teams } from '../../data/teams.js';

/**
 * Radio-style team picker. Each option shows mock on-call capacity — this is the
 * surface the live browser-loop demo refines.
 *
 * @param {{value:string, onChange:(id:string)=>void}} props
 */
export default function TeamSelector({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-1 block text-xs font-medium text-noc-muted">
        Team<span className="ml-0.5 text-sev-critical">*</span>
      </legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {teams.map((team) => {
          const selected = value === team.id;
          const available = team.capacity.total - team.capacity.onCall;
          return (
            <label
              key={team.id}
              className={cx(
                'flex cursor-pointer flex-col gap-1 rounded-lg border p-3 transition-colors',
                selected
                  ? 'border-kddi-arc bg-kddi-arc/10'
                  : 'border-noc-border bg-noc-bg hover:border-noc-muted',
              )}
            >
              <span className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-kddi-fg">
                  <Users size={13} className="text-kddi-arc" aria-hidden="true" />
                  {team.name}
                </span>
                <input
                  type="radio"
                  name="escalation-team"
                  value={team.id}
                  checked={selected}
                  onChange={() => onChange(team.id)}
                  className="h-3.5 w-3.5 accent-kddi-arc"
                />
              </span>
              <span className="text-[11px] text-noc-muted">{team.nameJa}</span>
              <span
                className={cx(
                  'mt-1 text-[11px] font-medium',
                  available > 0 ? 'text-region-healthy' : 'text-sev-warning',
                )}
              >
                {team.name} — {team.capacity.onCall}/{team.capacity.total} on-call slots used
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
