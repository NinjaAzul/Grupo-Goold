import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './index';

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Modal Title">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText(/modal title/i)).toBeInTheDocument();
  });

  it('displays children content', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>Modal Content</p>
      </Modal>
    );
    expect(screen.getByText(/modal content/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={handleClose} showCloseButton={true}>
        <p>Content</p>
      </Modal>
    );
    const closeButton = screen.getByRole('button', { name: /fechar modal/i });
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );
    const overlay = container.querySelector('[role="dialog"]');
    if (overlay) {
      await user.click(overlay);
      expect(handleClose).toHaveBeenCalled();
    }
  });

  it('does not show close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} showCloseButton={false}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByRole('button', { name: /fechar modal/i })).not.toBeInTheDocument();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

