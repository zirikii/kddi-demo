import { describe, it, expect } from 'vitest';
import { filterAlerts, sortByNewest } from '../hooks/useAlerts.js';

const sample = [
  {
    id: 'a',
    severity: 'critical',
    region: 'kanto',
    title: 'BGP session down',
    asset: 'tky-core-rt-01.kddi.net',
    circuitId: 'CKT-1',
    tags: ['bgp'],
    timestamp: '2026-06-24T10:00:00Z',
  },
  {
    id: 'b',
    severity: 'warning',
    region: 'kansai',
    title: 'Latency spike',
    asset: 'osaka-pe-03.kddi.net',
    circuitId: 'CKT-2',
    tags: ['latency'],
    timestamp: '2026-06-24T11:00:00Z',
  },
  {
    id: 'c',
    severity: 'info',
    region: 'kanto',
    title: 'Maintenance',
    asset: 'rr-tky-01.kddi.net',
    circuitId: 'CKT-3',
    tags: ['maintenance'],
    timestamp: '2026-06-24T09:00:00Z',
  },
];

describe('filterAlerts', () => {
  it('returns all when no filters applied', () => {
    expect(filterAlerts(sample)).toHaveLength(3);
  });

  it('filters by severity', () => {
    const out = filterAlerts(sample, { severity: 'critical' });
    expect(out.map((a) => a.id)).toEqual(['a']);
  });

  it('filters by region', () => {
    const out = filterAlerts(sample, { region: 'kanto' });
    expect(out.map((a) => a.id)).toEqual(['a', 'c']);
  });

  it('searches across hostname, title, circuit and tags (case-insensitive)', () => {
    expect(filterAlerts(sample, { search: 'osaka' }).map((a) => a.id)).toEqual(['b']);
    expect(filterAlerts(sample, { search: 'BGP' }).map((a) => a.id)).toEqual(['a']);
    expect(filterAlerts(sample, { search: 'ckt-3' }).map((a) => a.id)).toEqual(['c']);
  });

  it('combines filters (AND semantics)', () => {
    const out = filterAlerts(sample, { severity: 'info', region: 'kanto' });
    expect(out.map((a) => a.id)).toEqual(['c']);
    expect(filterAlerts(sample, { severity: 'critical', region: 'kansai' })).toHaveLength(0);
  });
});

describe('sortByNewest', () => {
  it('orders by timestamp descending', () => {
    expect(sortByNewest(sample).map((a) => a.id)).toEqual(['b', 'a', 'c']);
  });
});
