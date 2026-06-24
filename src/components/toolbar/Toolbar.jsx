import { Search, RefreshCw, Pause } from 'lucide-react';
import { cx } from '../../lib/cx.js';
import FilterGroup from './FilterGroup.jsx';
import { REGIONS, REGION_LABELS } from '../../lib/constants.js';

const SEVERITY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
];

const REGION_OPTIONS = [
  { value: 'all', label: 'All' },
  ...REGIONS.map((r) => ({ value: r, label: REGION_LABELS[r].en })),
];

/**
 * Filter + search + auto-refresh toolbar.
 */
export default function Toolbar({ filters, setFilter, counts, autoRefresh }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-noc-border bg-noc-card px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-4">
        <FilterGroup
          label="Severity"
          options={SEVERITY_OPTIONS}
          value={filters.severity}
          onChange={(v) => setFilter('severity', v)}
        />
        <FilterGroup
          label="Region"
          options={REGION_OPTIONS}
          value={filters.region}
          onChange={(v) => setFilter('region', v)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-noc-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Search hostname / circuit…"
            aria-label="Search alerts by hostname or circuit"
            className="h-8 w-56 rounded-md border border-noc-border bg-noc-bg pl-8 pr-3 font-mono text-xs text-kddi-fg placeholder:text-noc-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kddi-arc"
          />
        </div>

        <div className="flex items-center gap-2 text-[11px] text-noc-muted">
          <span className="rounded border border-noc-border px-1.5 py-0.5">
            {counts.filtered}/{counts.total} shown
          </span>
          {counts.critical > 0 && (
            <span className="rounded border border-sev-critical-border bg-sev-critical-bg px-1.5 py-0.5 text-sev-critical">
              {counts.critical} critical
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={autoRefresh.toggle}
          aria-pressed={autoRefresh.enabled}
          className={cx(
            'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
            autoRefresh.enabled
              ? 'border-region-healthy/40 bg-region-healthy/10 text-region-healthy'
              : 'border-noc-border bg-noc-bg text-noc-muted hover:text-kddi-fg',
          )}
          title="Toggle the simulated live feed"
        >
          {autoRefresh.enabled ? (
            <RefreshCw size={13} className="animate-spin [animation-duration:3s]" aria-hidden="true" />
          ) : (
            <Pause size={13} aria-hidden="true" />
          )}
          Auto-refresh {autoRefresh.enabled ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
}
