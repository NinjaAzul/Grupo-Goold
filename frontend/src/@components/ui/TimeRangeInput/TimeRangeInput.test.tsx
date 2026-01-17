import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeRangeInput } from './index';

describe('TimeRangeInput', () => {
  it('renders time range input', () => {
    render(<TimeRangeInput label="Time Range" startTime="" endTime="" onChange={jest.fn()} />);
    expect(screen.getByText(/time range/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/HH:mm - HH:mm/i)).toBeInTheDocument();
  });

  it('displays time range value', () => {
    render(<TimeRangeInput label="Time Range" startTime="09:00" endTime="18:00" onChange={jest.fn()} />);
    const input = screen.getByPlaceholderText(/HH:mm - HH:mm/i) as HTMLInputElement;
    expect(input.value).toContain('09:00');
    expect(input.value).toContain('18:00');
  });

  it('calls onChange when time range changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<TimeRangeInput label="Time Range" startTime="" endTime="" onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/HH:mm - HH:mm/i);
    await user.type(input, '09:00 - 18:00');
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const { container } = render(<TimeRangeInput label="Time Range" startTime="" endTime="" onChange={jest.fn()} disabled />);
    const input = container.querySelector('input');
    expect(input).toBeDisabled();
  });

  it('allows user to type time range', async () => {
    const user = userEvent.setup();
    render(<TimeRangeInput label="Time Range" startTime="" endTime="" onChange={jest.fn()} />);
    const input = screen.getByPlaceholderText(/HH:mm - HH:mm/i) as HTMLInputElement;
    await user.type(input, '09:00 - 18:00');
    expect(input.value).toContain('09:00');
    expect(input.value).toContain('18:00');
  });
});

