import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './index';
import { Button } from '@/@components/ui/Button';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <Button>Hover me</Button>,
  },
};

export const LongContent: Story = {
  args: {
    content: 'This is a longer tooltip message that explains more details',
    children: <Button>Hover for details</Button>,
  },
};

