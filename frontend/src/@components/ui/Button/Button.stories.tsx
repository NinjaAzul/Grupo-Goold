import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Button component with multiple variants (primary, secondary, error, success, link) and loading state support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'success', 'link'],
      description: 'Button variant style',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading spinner when true',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Error: Story = {
  args: {
    children: 'Error Button',
    variant: 'error',
  },
};

export const Success: Story = {
  args: {
    children: 'Success Button',
    variant: 'success',
  },
};

export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    variant: 'primary',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="error">Error</Button>
        <Button variant="success">Success</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-4">
        <Button variant="primary" isLoading>
          Loading
        </Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants displayed together.',
      },
    },
  },
};

