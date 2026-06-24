/**
 * Templates used by useAutoRefresh to synthesize new "live" alerts.
 * Each call to makeLiveAlert() picks a random template and stamps a fresh id/timestamp.
 */

const templates = [
  {
    severity: 'warning',
    title: 'Latency spike — {asset} (RTT {n}ms)',
    region: 'kansai',
    assets: ['osaka-pe-05.kddi.net', 'kobe-pe-01.kddi.net', 'kyoto-agg-02.kddi.net'],
    tags: ['latency', 'metro'],
    metricLabel: 'RTT (ms)',
  },
  {
    severity: 'critical',
    title: 'BGP session flap — {asset} ↔ AS{n}',
    region: 'kanto',
    assets: ['tky-core-rt-03.kddi.net', 'tky-edge-rt-01.kddi.net'],
    tags: ['bgp', 'backbone'],
    metricLabel: 'Prefixes (x1k)',
  },
  {
    severity: 'warning',
    title: 'Capacity threshold — {asset} uplink {n}%',
    region: 'kanto',
    assets: ['tky-core-rt-04.kddi.net', 'yokohama-agg-01.kddi.net'],
    tags: ['capacity', 'backbone'],
    metricLabel: 'Utilization (%)',
  },
  {
    severity: 'info',
    title: 'Config drift detected — {asset}',
    region: 'kansai',
    assets: ['osaka-agg-03.kddi.net', 'nara-acc-01.kddi.net'],
    tags: ['config', 'audit'],
    metricLabel: 'Drift items',
  },
  {
    severity: 'critical',
    title: 'au 5G core — RAN paging overload ({asset})',
    region: 'kanto',
    assets: ['amf-kanto-02.5gc.kddi.net', 'amf-kanto-03.5gc.kddi.net'],
    tags: ['5g', 'core', 'mobile'],
    metricLabel: 'Paging/s (x1k)',
  },
  {
    severity: 'warning',
    title: 'Optical power low — {asset} (Rx {n} dBm)',
    region: 'kyushu',
    assets: ['fukuoka-olt-09.kddi.net', 'oita-olt-01.kddi.net'],
    tags: ['optical', 'access'],
    metricLabel: 'Rx (dBm)',
  },
  {
    severity: 'info',
    title: 'Telehouse {city} — environmental sensor nominal',
    region: 'overseas',
    assets: ['sin-agg-01.telehouse.net', 'nyc-agg-02.telehouse.net'],
    cities: ['Singapore', 'New York', 'Paris'],
    tags: ['datacenter', 'telehouse'],
    metricLabel: 'Temp (°C)',
  },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

let liveCounter = 0;

/** Synthesize a new live alert for the simulated feed. */
export function makeLiveAlert() {
  const t = pick(templates);
  const asset = pick(t.assets);
  const n = rand(50, 99);
  const city = t.cities ? pick(t.cities) : '';
  const title = t.title
    .replace('{asset}', asset)
    .replace('{n}', String(n))
    .replace('{city}', city);

  liveCounter += 1;
  const id = `evt-live-${Date.now().toString(36)}-${liveCounter}`;
  const metric = Array.from({ length: 7 }, (_, i) => rand(10, 40) + i * rand(2, 8));

  return {
    id,
    severity: t.severity,
    title,
    description: `Auto-detected by the live feed monitor at ${asset}. Synthetic demo event for NOC console fidelity.`,
    region: t.region,
    asset,
    circuitId: `CKT-LIVE-${rand(100, 999)}`,
    metricLabel: t.metricLabel,
    metric,
    timestamp: new Date().toISOString(),
    escalated: false,
    tags: [...t.tags, 'live'],
    affectedNodes: [asset],
    relatedIds: [],
    isNew: true,
  };
}
