import { REGIONS, REGION_LABELS, SEVERITY_WEIGHT } from '../lib/constants.js';

/**
 * Region metadata. Health is NOT static — it is derived from current alerts via
 * deriveRegionHealth() so the status bar reflects the live feed.
 */
export const regionMeta = REGIONS.map((id) => ({
  id,
  name: REGION_LABELS[id].en,
  nameJa: REGION_LABELS[id].ja,
  sub: REGION_LABELS[id].sub,
}));

/**
 * Derive per-region health from a list of alerts.
 * - any active critical  -> 'critical'
 * - any active warning   -> 'degraded'
 * - otherwise            -> 'healthy'
 * Also returns active alert count and the most recent incident timestamp.
 *
 * @param {Array} alerts
 * @returns {Array<{id,name,nameJa,sub,health,alertCount,criticalCount,lastIncident,metric}>}
 */
export function deriveRegionHealth(alerts) {
  return regionMeta.map((region) => {
    const regionAlerts = alerts.filter((a) => a.region === region.id);
    const criticalCount = regionAlerts.filter((a) => a.severity === 'critical').length;
    const warningCount = regionAlerts.filter((a) => a.severity === 'warning').length;

    let health = 'healthy';
    if (criticalCount > 0) health = 'critical';
    else if (warningCount > 0) health = 'degraded';

    const lastIncident = regionAlerts.reduce(
      (latest, a) => (!latest || a.timestamp > latest ? a.timestamp : latest),
      null,
    );

    // Simple severity-weighted bar series for the card's CSS mini chart.
    const metric = regionAlerts
      .slice(0, 7)
      .map((a) => SEVERITY_WEIGHT[a.severity] || 1)
      .reverse();

    return {
      ...region,
      health,
      alertCount: regionAlerts.length,
      criticalCount,
      warningCount,
      lastIncident,
      metric: metric.length ? metric : [1, 1, 1, 1, 1, 1, 1],
    };
  });
}
