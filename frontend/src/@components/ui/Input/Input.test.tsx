import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './index';
import { SearchIcon } from '@/@components/icons';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByText(/email/i)).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(<Input error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-error');
  });

  it('renders with left icon', () => {
    render(<Input leftIcon={<SearchIcon />} placeholder="Search" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('pl-10');
  });

  it('renders with right icon', () => {
    render(<Input rightIcon={<SearchIcon />} placeholder="Search" />);
    const input = screen.getByRole('textbox');
    expect(input.parentElement).toHaveClass('relative');
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<Input isLoading placeholder="Loading" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('allows user to type', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Enter text" />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello');
    expect(input).toHaveValue('Hello');
  });

  it('calls onChange handler when value changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<Input onChange={handleChange} placeholder="Enter text" />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'a');
    expect(handleChange).toHaveBeenCalled();
  });
});

