import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './index';
import { Button } from '../Button';

describe('Tooltip', () => {
  it('renders children', () => {
    render(
      <Tooltip content="Tooltip text">
        <Button>Hover me</Button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: /hover me/i })).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip text">
        <Button>Hover me</Button>
      </Tooltip>
    );
    const button = screen.getByRole('button', { name: /hover me/i });
    await user.hover(button);
    expect(screen.getByText(/tooltip text/i)).toBeInTheDocument();
  });

  it('hides tooltip when mouse leaves', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip text">
        <Button>Hover me</Button>
      </Tooltip>
    );
    const button = screen.getByRole('button', { name: /hover me/i });
    await user.hover(button);
    expect(screen.getByText(/tooltip text/i)).toBeInTheDocument();
    await user.unhover(button);
    expect(screen.queryByText(/tooltip text/i)).not.toBeInTheDocument();
  });

  it('displays correct tooltip content', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Custom tooltip message">
        <Button>Button</Button>
      </Tooltip>
    );
    const button = screen.getByRole('button');
    await user.hover(button);
    expect(screen.getByText(/custom tooltip message/i)).toBeInTheDocument();
  });

  it('does not show tooltip initially', () => {
    render(
      <Tooltip content="Tooltip text">
        <Button>Button</Button>
      </Tooltip>
    );
    expect(screen.queryByText(/tooltip text/i)).not.toBeInTheDocument();
  });
});

