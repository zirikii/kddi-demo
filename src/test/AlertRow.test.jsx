import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertRow from '../components/alerts/AlertRow.jsx';

const alert = {
  id: 'evt-x',
  severity: 'critical',
  title: 'BGP session down — tky-core-rt-01',
  region: 'kanto',
  asset: 'tky-core-rt-01.kddi.net',
  circuitId: 'CKT-TKY-OSK-014',
  timestamp: new Date().toISOString(),
  escalated: false,
  tags: ['bgp'],
};

describe('AlertRow', () => {
  it('renders event data (title, asset, circuit)', () => {
    render(<AlertRow alert={alert} onEscalate={() => {}} onOpenDetail={() => {}} />);
    expect(screen.getByText(alert.title)).toBeInTheDocument();
    expect(screen.getByText(alert.asset)).toBeInTheDocument();
    expect(screen.getByText(alert.circuitId)).toBeInTheDocument();
  });

  it('calls onEscalate (and not onOpenDetail) when the Escalate button is clicked', async () => {
    const onEscalate = vi.fn();
    const onOpenDetail = vi.fn();
    render(<AlertRow alert={alert} onEscalate={onEscalate} onOpenDetail={onOpenDetail} />);

    await userEvent.click(screen.getByRole('button', { name: /Escalate alert:/i }));
    expect(onEscalate).toHaveBeenCalledWith(alert);
    expect(onOpenDetail).not.toHaveBeenCalled();
  });

  it('opens the detail drawer when the row body is clicked', async () => {
    const onOpenDetail = vi.fn();
    render(<AlertRow alert={alert} onEscalate={() => {}} onOpenDetail={onOpenDetail} />);
    await userEvent.click(screen.getByRole('button', { name: /Open details for/i }));
    expect(onOpenDetail).toHaveBeenCalledWith(alert);
  });

  it('shows an Escalated chip when already escalated', () => {
    render(
      <AlertRow alert={{ ...alert, escalated: true }} onEscalate={() => {}} onOpenDetail={() => {}} />,
    );
    expect(screen.getByText('Escalated')).toBeInTheDocument();
  });
});
