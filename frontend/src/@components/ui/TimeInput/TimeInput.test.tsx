import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeInput } from './index';
import { ClockIcon } from '@/@components/icons';

describe('TimeInput', () => {
  it('renders time input with label', () => {
    render(<TimeInput label="Time" />);
    expect(screen.getByText(/time/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/HH:mm/i)).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<TimeInput label="Time" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<TimeInput label="Time" error="Invalid time format" />);
    expect(screen.getByText(/invalid time format/i)).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    const { container } = render(<TimeInput label="Time" error="Error" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('border-error');
  });

  it('renders with left icon', () => {
    const { container } = render(<TimeInput label="Time" leftIcon={<ClockIcon />} />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('pl-10');
  });

  it('allows user to type time', async () => {
    const user = userEvent.setup();
    const { container } = render(<TimeInput label="Time" />);
    const input = container.querySelector('input') as HTMLInputElement;
    await user.type(input, '14:30');
    expect(input.value).toBe('14:30');
  });

  it('calls onChange handler when value changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    const { container } = render(<TimeInput label="Time" onChange={handleChange} />);
    const input = container.querySelector('input');
    if (input) {
      await user.type(input, '14300');
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(handleChange).toHaveBeenCalled();
    }
  });

  it('formats time value correctly', () => {
    const { container } = render(<TimeInput label="Time" value="14:30" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('14:30');
  });
});

