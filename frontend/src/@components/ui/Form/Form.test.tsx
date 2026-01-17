import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from './index';
import { Input } from '../Input/index';
import { Button } from '../Button/index';

describe('Form', () => {
  it('renders form element', () => {
    const { container } = render(
      <Form>
        <Input label="Name" />
      </Form>
    );
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Form>
        <Input label="Email" id="email" />
        <Button type="submit">Submit</Button>
      </Form>
    );
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', async () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());
    const user = userEvent.setup();
    render(
      <Form onSubmit={handleSubmit}>
        <Input label="Name" />
        <Button type="submit">Submit</Button>
      </Form>
    );
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Form className="custom-class">
        <Input label="Name" />
      </Form>
    );
    const form = container.querySelector('form');
    expect(form).toHaveClass('custom-class');
  });
});

