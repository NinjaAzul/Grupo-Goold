import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TimeInput } from './index';
import { ClockIcon } from '@/@components/icons';
import { useState } from 'react';

const meta: Meta<typeof TimeInput> = {
  title: 'UI/TimeInput',
  component: TimeInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimeInput>;

export const Default: Story = {
  args: {
    label: 'Time',
    placeholder: 'HH:mm',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return <TimeInput {...args} value={value} onChange={setValue} />;
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Time',
    placeholder: 'HH:mm',
    leftIcon: <ClockIcon className="w-5 h-5 text-gray-400" />,
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return <TimeInput {...args} value={value} onChange={setValue} />;
  },
};

export const WithError: Story = {
  args: {
    label: 'Time',
    placeholder: 'HH:mm',
    error: 'Invalid time format',
  },
  render: (args) => {
    const [value, setValue] = useState('25:00');
    return <TimeInput {...args} value={value} onChange={setValue} />;
  },
};

