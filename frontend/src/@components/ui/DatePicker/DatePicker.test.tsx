import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './index';

describe('DatePicker', () => {
  it('renders date picker button', () => {
    const { container } = render(<DatePicker />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('displays placeholder when no value', () => {
    render(<DatePicker placeholder="Select date" />);
    expect(screen.getByText(/select date/i)).toBeInTheDocument();
  });

  it('displays formatted date when value is provided', () => {
    const date = new Date('2024-01-15');
    const { container } = render(<DatePicker value={date} />);
    const button = container.querySelector('button');
    expect(button?.textContent).toMatch(/\d{2}\/\d{2}\/2024/);
  });

  it('renders with label', () => {
    render(<DatePicker label="Date" />);
    expect(screen.getByText(/date/i)).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<DatePicker label="Date" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<DatePicker error="This field is required" />);
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    const { container } = render(<DatePicker disabled />);
    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('opens date picker when clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<DatePicker />);
    const button = container.querySelector('button');
    if (button) {
      await user.click(button);
      const datePicker = document.querySelector('.react-datepicker');
      expect(datePicker).toBeInTheDocument();
    }
  });
});

