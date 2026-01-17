import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './index';
import { useState } from 'react';

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return <DatePicker value={date} onChange={setDate} />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return <DatePicker label="Select Date" value={date} onChange={setDate} />;
  },
};

export const Required: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return <DatePicker label="Date" value={date} onChange={setDate} required />;
  },
};

export const WithError: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <DatePicker
        label="Date"
        value={date}
        onChange={setDate}
        error="This field is required"
      />
    );
  },
};

export const WithMinDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const minDate = new Date();
    return <DatePicker label="Date" value={date} onChange={setDate} minDate={minDate} />;
  },
};

export const Disabled: Story = {
  args: {
    label: 'Date',
    disabled: true,
    value: new Date(),
  },
};

