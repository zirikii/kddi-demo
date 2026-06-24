import { cx } from '../../lib/cx.js';
import { PRIORITIES, PRIORITY_LABELS } from '../../lib/constants.js';

const STYLE = {
  P1: 'data-[on=true]:border-sev-critical data-[on=true]:bg-sev-critical-bg data-[on=true]:text-sev-critical',
  P2: 'data-[on=true]:border-sev-warning data-[on=true]:bg-sev-warning-bg data-[on=true]:text-sev-warning',
  P3: 'data-[on=true]:border-sev-info data-[on=true]:bg-sev-info-bg data-[on=true]:text-sev-info',
};

/**
 * Priority picker (P1/P2/P3) as a segmented control.
 * @param {{value:string, onChange:(p:string)=>void}} props
 */
export default function PrioritySelector({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-1 block text-xs font-medium text-noc-muted">
        Priority<span className="ml-0.5 text-sev-critical">*</span>
      </legend>
      <div className="grid grid-cols-3 gap-2">
        {PRIORITIES.map((p) => {
          const on = value === p;
          return (
            <button
              key={p}
              type="button"
              data-on={on}
              aria-pressed={on}
              onClick={() => onChange(p)}
              className={cx(
                'rounded-lg border border-noc-border bg-noc-bg px-3 py-2 text-sm font-medium text-noc-muted transition-colors hover:text-kddi-fg',
                STYLE[p],
              )}
            >
              {PRIORITY_LABELS[p].en}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
