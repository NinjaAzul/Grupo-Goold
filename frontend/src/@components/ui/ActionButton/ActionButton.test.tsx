import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionButton } from './index';

describe('ActionButton', () => {
  it('renders check variant', () => {
    render(<ActionButton variant="check" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('w-8', 'h-8');
  });

  it('renders close variant', () => {
    render(<ActionButton variant="close" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('w-8', 'h-8');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<ActionButton variant="check" onClick={handleClick} />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<ActionButton variant="check" disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<ActionButton variant="check" onClick={handleClick} disabled />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<ActionButton variant="check" className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});

