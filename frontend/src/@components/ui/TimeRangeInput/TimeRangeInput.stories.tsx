import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TimeRangeInput } from './index';
import { useState } from 'react';

const meta: Meta<typeof TimeRangeInput> = {
  title: 'UI/TimeRangeInput',
  component: TimeRangeInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimeRangeInput>;

export const Default: Story = {
  render: () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    return (
      <TimeRangeInput
        label="Time Range"
        startTime={startTime}
        endTime={endTime}
        onChange={(start, end) => {
          setStartTime(start);
          setEndTime(end);
        }}
      />
    );
  },
};

export const WithValues: Story = {
  render: () => {
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('18:00');
    return (
      <TimeRangeInput
        startTime={startTime}
        endTime={endTime}
        onChange={(start, end) => {
          setStartTime(start);
          setEndTime(end);
        }}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    startTime: '09:00',
    endTime: '18:00',
    disabled: true,
  },
};

