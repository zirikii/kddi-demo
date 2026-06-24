import {
  SEVERITY_LABELS,
  PRIORITY_LABELS,
  REGION_LABELS,
  REGION_HEALTH,
} from './constants.js';

const JST_TZ = 'Asia/Tokyo';

/**
 * Format an ISO timestamp as an absolute JST time string, e.g. "2026-06-24 14:32:05 JST".
 * @param {string|number|Date} input
 */
export function formatJST(input) {
  if (!input) return '—';
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return '—';

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: JST_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')} JST`;
}

/** Short JST clock, e.g. "14:32:05". */
export function formatJSTClock(input = new Date()) {
  const date = input instanceof Date ? input : new Date(input);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: JST_TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Relative "time ago" string in English. Compact NOC style.
 * @param {string|number|Date} input
 * @param {Date} [now]
 */
export function timeAgo(input, now = new Date()) {
  if (!input) return '—';
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return '—';

  const diffMs = now.getTime() - date.getTime();
  const sec = Math.round(diffMs / 1000);

  if (sec < 0) return 'in the future';
  if (sec < 10) return 'just now';
  if (sec < 60) return `${sec}s ago`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;

  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

/** Severity label, bilingual or single locale. */
export function severityLabel(severity, locale) {
  const entry = SEVERITY_LABELS[severity];
  if (!entry) return severity;
  if (locale === 'ja') return entry.ja;
  if (locale === 'en') return entry.en;
  return `${entry.en} · ${entry.ja}`;
}

export function priorityLabel(priority, variant = 'en') {
  const entry = PRIORITY_LABELS[priority];
  if (!entry) return priority;
  return entry[variant] || entry.en;
}

export function regionLabel(region, locale = 'en') {
  const entry = REGION_LABELS[region];
  if (!entry) return region;
  return locale === 'ja' ? entry.ja : entry.en;
}

export function regionHealthLabel(health, locale = 'en') {
  const entry = REGION_HEALTH[health];
  if (!entry) return health;
  return locale === 'ja' ? entry.ja : entry.en;
}

/** Truncate a string to `max` chars with an ellipsis. */
export function truncate(text, max = 80) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
