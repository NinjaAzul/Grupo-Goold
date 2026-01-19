import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Divider } from './index';

const meta: Meta<typeof Divider> = {
  title: 'UI/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className="w-[400px]">
      <div className="py-4">Content above</div>
      <Divider {...args} />
      <div className="py-4">Content below</div>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="flex h-32 items-center gap-4">
      <div>Left</div>
      <Divider {...args} />
      <div>Right</div>
    </div>
  ),
};

