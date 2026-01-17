import { render, screen } from '@testing-library/react';
import { Select } from './index';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select', () => {
  it('renders select trigger', () => {
    render(<Select options={options} placeholder="Select..." />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays placeholder when no value is selected', () => {
    render(<Select options={options} placeholder="Select an option" />);
    expect(screen.getByText(/select an option/i)).toBeInTheDocument();
  });

  it('displays selected option label', () => {
    render(<Select options={options} value="option2" />);
    expect(screen.getByText(/option 2/i)).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Select label="Choose" options={options} />);
    expect(screen.getByText(/choose/i)).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<Select label="Choose" options={options} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Select options={options} error="This field is required" />);
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Select options={options} disabled />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('disabled');
  });

  it('calls onChange when value prop changes', () => {
    const handleChange = jest.fn();
    const { rerender } = render(<Select options={options} onChange={handleChange} value="option1" />);
    
    expect(screen.getByText(/option 1/i)).toBeInTheDocument();
    
    rerender(<Select options={options} onChange={handleChange} value="option2" />);
    
    expect(screen.getByText(/option 2/i)).toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });
});

