import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from './index';

describe('PasswordInput', () => {
  it('renders password input with label', () => {
    const { container } = render(<PasswordInput label="Password" />);
    expect(screen.getByText(/password/i)).toBeInTheDocument();
    const input = container.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<PasswordInput label="Password" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<PasswordInput label="Password" error="This field is required" />);
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    const { container } = render(<PasswordInput label="Password" error="Error" />);
    const input = container.querySelector('input[type="password"]');
    expect(input).toHaveClass('border-error');
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordInput label="Password" />);
    const input = container.querySelector('input') as HTMLInputElement;
    const toggleButton = screen.getByRole('button');

    expect(input.type).toBe('password');
    await user.click(toggleButton);
    expect(input.type).toBe('text');
    await user.click(toggleButton);
    expect(input.type).toBe('password');
  });

  it('allows user to type password', async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordInput label="Password" />);
    const input = container.querySelector('input') as HTMLInputElement;
    await user.type(input, 'mypassword123');
    expect(input.value).toBe('mypassword123');
  });

  it('calls onChange handler when value changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    const { container } = render(<PasswordInput label="Password" onChange={handleChange} />);
    const input = container.querySelector('input');
    if (input) {
      await user.type(input, 'a');
      expect(handleChange).toHaveBeenCalled();
    }
  });
});

