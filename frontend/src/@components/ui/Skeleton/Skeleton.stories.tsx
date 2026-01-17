import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './index';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: 'text',
    className: 'w-64',
  },
};

export const Badge: Story = {
  args: {
    variant: 'badge',
  },
};

export const Button: Story = {
  args: {
    variant: 'button',
  },
};

export const Cell: Story = {
  args: {
    variant: 'cell',
    className: 'w-64',
  },
};

