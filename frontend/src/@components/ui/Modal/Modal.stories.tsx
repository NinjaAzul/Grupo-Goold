import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './index';
import { Button } from '@/@components/ui/Button';
import { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
          <div className="p-4">
            <p>This is the modal content.</p>
          </div>
        </Modal>
      </>
    );
  },
};

export const Small: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Small Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Small Modal"
          size="sm"
        >
          <div className="p-4">
            <p>This is a small modal.</p>
          </div>
        </Modal>
      </>
    );
  },
};

export const Large: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Large Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Large Modal"
          size="lg"
        >
          <div className="p-4">
            <p>This is a large modal with more content.</p>
          </div>
        </Modal>
      </>
    );
  },
};

export const WithoutCloseButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Without Close Button"
          showCloseButton={false}
        >
          <div className="p-4">
            <p>This modal doesn't have a close button.</p>
            <Button onClick={() => setIsOpen(false)} className="mt-4">
              Close
            </Button>
          </div>
        </Modal>
      </>
    );
  },
};

