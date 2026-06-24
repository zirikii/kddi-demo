import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EscalateModal from '../components/escalation/EscalateModal.jsx';

const alert = {
  id: 'evt-001',
  severity: 'critical',
  title: 'BGP session down — tky-core-rt-01',
  region: 'kanto',
  asset: 'tky-core-rt-01.kddi.net',
  circuitId: 'CKT-TKY-OSK-014',
  timestamp: '2026-06-24T05:32:00Z',
};

function setup() {
  const onSubmit = vi.fn();
  const onClose = vi.fn();
  render(<EscalateModal open alert={alert} onSubmit={onSubmit} onClose={onClose} />);
  return { onSubmit, onClose };
}

describe('EscalateModal', () => {
  it('renders the read-only alert summary', () => {
    setup();
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(alert.title)).toBeInTheDocument();
    expect(within(dialog).getByText(/tky-core-rt-01.kddi.net/)).toBeInTheDocument();
  });

  it('shows a validation error and does not submit when the note is too short', async () => {
    const { onSubmit } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Escalate' }));
    expect(screen.getByText(/Note is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits team + priority + note + notify and EXCLUDES assignee from the payload', async () => {
    const { onSubmit } = setup();

    // choose Security team + P1
    await userEvent.click(screen.getByRole('radio', { name: /Security/i }));
    await userEvent.click(screen.getByRole('button', { name: /P1/ }));

    await userEvent.type(
      screen.getByLabelText(/Note/i),
      'Escalating due to sustained BGP outage on backbone.',
    );

    await userEvent.click(screen.getByRole('button', { name: 'Escalate' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload).toMatchObject({
      alertId: 'evt-001',
      team: 'security',
      priority: 'P1',
      notify: true,
    });
    expect(payload.note).toContain('BGP outage');
    // The signature demo invariant: no assignee key in the payload.
    expect(payload).not.toHaveProperty('assignee');
  });

  it('renders the assignee field as a disabled, non-functional placeholder', () => {
    setup();
    expect(screen.getByText('coming soon')).toBeInTheDocument();
    expect(screen.getByText(/to be added in live demo/i)).toBeInTheDocument();
    // No interactive assignee control exists yet.
    expect(screen.queryByRole('combobox', { name: /assignee/i })).not.toBeInTheDocument();
  });
});
