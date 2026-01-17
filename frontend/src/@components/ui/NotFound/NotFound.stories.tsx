import type { Meta, StoryObj } from '@storybook/react';
import { NotFound } from './index';

const meta: Meta<typeof NotFound> = {
  title: 'UI/NotFound',
  component: NotFound,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NotFound>;

export const Default: Story = {
  args: {},
};

export const CustomTitle: Story = {
  args: {
    title: 'No results found',
  },
};

