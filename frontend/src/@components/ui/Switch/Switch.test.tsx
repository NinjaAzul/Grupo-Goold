import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './index';

describe('Switch', () => {
  it('renders switch element', () => {
    render(<Switch checked={false} onChange={jest.fn()} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  it('renders as checked when checked prop is true', () => {
    render(<Switch checked={true} onChange={jest.fn()} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when clicked', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<Switch checked={false} onChange={handleChange} />);
    const switchElement = screen.getByRole('switch');
    await user.click(switchElement);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when clicking checked switch', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<Switch checked={true} onChange={handleChange} />);
    const switchElement = screen.getByRole('switch');
    await user.click(switchElement);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('does not call onChange when disabled', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<Switch checked={false} onChange={handleChange} disabled />);
    const switchElement = screen.getByRole('switch');
    await user.click(switchElement);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Switch checked={false} onChange={jest.fn()} disabled />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();
  });

  it('renders with small size', () => {
    render(<Switch checked={false} onChange={jest.fn()} size="sm" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('h-5', 'w-9');
  });

  it('renders with default size', () => {
    render(<Switch checked={false} onChange={jest.fn()} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('h-6', 'w-11');
  });
});

