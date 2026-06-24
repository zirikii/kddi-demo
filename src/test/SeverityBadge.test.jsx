import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SeverityBadge from '../components/alerts/SeverityBadge.jsx';

describe('SeverityBadge', () => {
  it('renders the bilingual default label and severity data attribute', () => {
    render(<SeverityBadge severity="critical" />);
    const badge = screen.getByText(/Critical · 重大/);
    expect(badge).toHaveAttribute('data-severity', 'critical');
  });

  it('applies severity-specific color classes', () => {
    const { rerender } = render(<SeverityBadge severity="critical" locale="en" />);
    expect(screen.getByText('Critical').className).toContain('text-sev-critical');

    rerender(<SeverityBadge severity="warning" locale="en" />);
    expect(screen.getByText('Warning').className).toContain('text-sev-warning');

    rerender(<SeverityBadge severity="info" locale="en" />);
    expect(screen.getByText('Info').className).toContain('text-sev-info');
  });

  it('renders the Japanese label when locale is ja', () => {
    render(<SeverityBadge severity="warning" locale="ja" />);
    expect(screen.getByText('警告')).toBeInTheDocument();
  });

  it('exposes an accessible severity label', () => {
    render(<SeverityBadge severity="info" locale="en" />);
    expect(screen.getByLabelText('Severity: Info')).toBeInTheDocument();
  });
});
