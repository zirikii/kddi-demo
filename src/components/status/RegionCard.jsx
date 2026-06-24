import { cx } from '../../lib/cx.js';
import { timeAgo } from '../../lib/formatters.js';
import { regionHealthLabel } from '../../lib/formatters.js';
import Sparkline from '../ui/Sparkline.jsx';

const HEALTH = {
  healthy: { dot: 'bg-region-healthy', text: 'text-region-healthy', ring: 'border-region-healthy/30' },
  degraded: { dot: 'bg-region-degraded', text: 'text-region-degraded', ring: 'border-region-degraded/30' },
  critical: { dot: 'bg-region-critical', text: 'text-region-critical', ring: 'border-region-critical/40' },
};

/**
 * A single region health card for the status bar.
 * @param {{region:object, logo?:string}} props
 */
export default function RegionCard({ region, logo }) {
  const health = HEALTH[region.health] || HEALTH.healthy;

  return (
    <article
      className={cx(
        'flex flex-col gap-2 rounded-xl border bg-noc-card p-3.5 transition-colors',
        health.ring,
      )}
      aria-label={`${region.name} region — ${region.health}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={cx('h-2.5 w-2.5 rounded-full', health.dot, region.health !== 'healthy' && 'animate-pulse')}
              aria-hidden="true"
            />
            <h3 className="text-sm font-semibold text-kddi-fg">{region.name}</h3>
            <span className="text-xs text-noc-muted">{region.nameJa}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-noc-muted">{region.sub}</p>
        </div>
        {logo ? (
          <img src={logo} alt="" className="h-3.5 opacity-70" aria-hidden="true" />
        ) : (
          <span className={cx('text-[11px] font-semibold uppercase', health.text)}>
            {regionHealthLabel(region.health, 'en')}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-2xl font-semibold leading-none text-kddi-fg tabular-nums">
            {region.alertCount}
          </p>
          <p className="mt-1 text-[11px] text-noc-muted">
            {region.criticalCount > 0 ? (
              <span className="text-sev-critical">{region.criticalCount} critical</span>
            ) : (
              'active alerts'
            )}
          </p>
        </div>
        <Sparkline
          data={region.metric}
          className="w-20"
          height={28}
          barClassName={health.dot.replace('bg-', 'bg-') + '/60'}
        />
      </div>

      <p className="text-[11px] text-noc-muted">
        Last incident: <span className="font-mono">{region.lastIncident ? timeAgo(region.lastIncident) : '—'}</span>
      </p>
    </article>
  );
}
