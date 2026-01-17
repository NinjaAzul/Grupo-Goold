import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from './index';

const meta: Meta<typeof PasswordInput> = {
  title: 'UI/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
};

export const Required: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    error: 'Password must be at least 8 characters',
    defaultValue: '123',
  },
};

