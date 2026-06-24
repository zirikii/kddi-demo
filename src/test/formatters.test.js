import { describe, it, expect } from 'vitest';
import {
  formatJST,
  formatJSTClock,
  timeAgo,
  severityLabel,
  priorityLabel,
  truncate,
} from '../lib/formatters.js';

describe('formatJST', () => {
  it('formats an ISO timestamp in JST with a JST suffix', () => {
    // 2026-06-24T05:32:00Z === 14:32:00 JST (UTC+9)
    const out = formatJST('2026-06-24T05:32:00Z');
    expect(out).toBe('2026-06-24 14:32:00 JST');
  });

  it('returns an em dash for empty/invalid input', () => {
    expect(formatJST('')).toBe('—');
    expect(formatJST('not-a-date')).toBe('—');
  });
});

describe('formatJSTClock', () => {
  it('returns HH:MM:SS for a known instant', () => {
    expect(formatJSTClock(new Date('2026-06-24T05:32:09Z'))).toBe('14:32:09');
  });
});

describe('timeAgo', () => {
  const now = new Date('2026-06-24T12:00:00Z');
  it('handles seconds, minutes, hours, days', () => {
    expect(timeAgo(new Date('2026-06-24T11:59:58Z'), now)).toBe('just now');
    expect(timeAgo(new Date('2026-06-24T11:59:30Z'), now)).toBe('30s ago');
    expect(timeAgo(new Date('2026-06-24T11:45:00Z'), now)).toBe('15m ago');
    expect(timeAgo(new Date('2026-06-24T09:00:00Z'), now)).toBe('3h ago');
    expect(timeAgo(new Date('2026-06-22T12:00:00Z'), now)).toBe('2d ago');
  });

  it('handles future and invalid values', () => {
    expect(timeAgo(new Date('2026-06-24T12:01:00Z'), now)).toBe('in the future');
    expect(timeAgo('', now)).toBe('—');
  });
});

describe('labels + truncate', () => {
  it('severityLabel supports locales and bilingual default', () => {
    expect(severityLabel('critical', 'en')).toBe('Critical');
    expect(severityLabel('critical', 'ja')).toBe('重大');
    expect(severityLabel('warning')).toBe('Warning · 警告');
  });

  it('priorityLabel returns short and full variants', () => {
    expect(priorityLabel('P1', 'short')).toBe('P1');
    expect(priorityLabel('P1')).toContain('Immediate');
  });

  it('truncate adds an ellipsis only when needed', () => {
    expect(truncate('short', 10)).toBe('short');
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
  });
});
