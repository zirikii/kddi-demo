import { MapPin } from 'lucide-react';
import { regionLabel } from '../../lib/formatters.js';
import { REGION_LABELS } from '../../lib/constants.js';

/** Compact region tag with EN + 日本語. */
export default function RegionTag({ region }) {
  const ja = REGION_LABELS[region]?.ja;
  return (
    <span className="inline-flex items-center gap-1 rounded border border-noc-border bg-noc-bg px-1.5 py-0.5 text-[11px] text-noc-muted">
      <MapPin size={11} aria-hidden="true" />
      <span className="text-kddi-fg">{regionLabel(region, 'en')}</span>
      {ja && <span className="text-noc-muted">· {ja}</span>}
    </span>
  );
}
