/**
 * Shared enums and labels for the KDDI NOC console.
 * Bilingual labels (EN + 日本語) are intentional — this mirrors real KDDI internal tooling.
 */

export const SEVERITIES = ['critical', 'warning', 'info'];

export const SEVERITY_LABELS = {
  critical: { en: 'Critical', ja: '重大' },
  warning: { en: 'Warning', ja: '警告' },
  info: { en: 'Info', ja: '情報' },
};

/** Sort weight — higher is more urgent (used for region health derivation). */
export const SEVERITY_WEIGHT = {
  critical: 3,
  warning: 2,
  info: 1,
};

export const PRIORITIES = ['P1', 'P2', 'P3'];

export const PRIORITY_LABELS = {
  P1: { en: 'P1 · Immediate', ja: 'P1 · 即時', short: 'P1' },
  P2: { en: 'P2 · High', ja: 'P2 · 高', short: 'P2' },
  P3: { en: 'P3 · Normal', ja: 'P3 · 通常', short: 'P3' },
};

export const REGIONS = ['kanto', 'kansai', 'kyushu', 'overseas'];

export const REGION_LABELS = {
  kanto: { en: 'Kanto', ja: '関東', sub: 'Tokyo · Backbone' },
  kansai: { en: 'Kansai', ja: '関西', sub: 'Osaka · Metro' },
  kyushu: { en: 'Kyushu', ja: '九州', sub: 'Fukuoka · Access' },
  overseas: { en: 'Overseas', ja: 'グローバル', sub: 'Telehouse · Global' },
};

export const REGION_HEALTH = {
  healthy: { en: 'Healthy', ja: '正常' },
  degraded: { en: 'Degraded', ja: '低下' },
  critical: { en: 'Critical', ja: '重大' },
};

export const STORAGE_KEYS = {
  escalations: 'kddi-noc-escalations',
};

export const APP_NAME = import.meta.env?.VITE_APP_NAME || 'KDDI Network Operations';

export const AUTO_REFRESH_INTERVAL_MS = Number(
  import.meta.env?.VITE_AUTO_REFRESH_INTERVAL_MS || 45000,
);
