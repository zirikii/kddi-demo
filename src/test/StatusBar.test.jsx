import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBar from '../components/status/StatusBar.jsx';

const alerts = [
  { id: '1', severity: 'critical', region: 'kanto', timestamp: '2026-06-24T10:00:00Z' },
  { id: '2', severity: 'warning', region: 'kanto', timestamp: '2026-06-24T09:00:00Z' },
  { id: '3', severity: 'warning', region: 'kansai', timestamp: '2026-06-24T08:00:00Z' },
  // kyushu + overseas have no alerts -> healthy
];

describe('StatusBar', () => {
  it('renders all four regions', () => {
    render(<StatusBar alerts={alerts} />);
    expect(screen.getByLabelText(/Kanto region/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kansai region/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kyushu region/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Overseas region/)).toBeInTheDocument();
  });

  it('derives health from alerts (critical > warning > healthy)', () => {
    render(<StatusBar alerts={alerts} />);
    expect(screen.getByLabelText('Kanto region — critical')).toBeInTheDocument();
    expect(screen.getByLabelText('Kansai region — degraded')).toBeInTheDocument();
    expect(screen.getByLabelText('Kyushu region — healthy')).toBeInTheDocument();
    expect(screen.getByLabelText('Overseas region — healthy')).toBeInTheDocument();
  });
});
