import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ActionButton } from './index';

const meta: Meta<typeof ActionButton> = {
  title: 'UI/ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Check: Story = {
  args: {
    variant: 'check',
  },
};

export const Close: Story = {
  args: {
    variant: 'close',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'check',
    disabled: true,
  },
};

