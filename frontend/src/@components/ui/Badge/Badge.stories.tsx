import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from './index';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: {
    children: 'Badge',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Badge',
    variant: 'secondary',
  },
};

export const CustomColors: Story = {
  args: {
    children: 'Custom Badge',
    variant: 'primary',
    textColor: '#ffffff',
    backgroundColor: '#10C3A9',
  },
};

