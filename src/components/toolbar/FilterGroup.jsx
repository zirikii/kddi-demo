import { cx } from '../../lib/cx.js';

/**
 * Segmented filter control.
 * @param {{label:string, options:Array<{value,label}>, value, onChange}} props
 */
export default function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label={label}>
      <span className="text-[11px] uppercase tracking-wide text-noc-muted">{label}</span>
      <div className="flex overflow-hidden rounded-md border border-noc-border">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={cx(
                'px-2.5 py-1 text-xs font-medium transition-colors',
                active
                  ? 'bg-kddi text-white'
                  : 'bg-noc-card text-noc-muted hover:bg-noc-elevated hover:text-kddi-fg',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
