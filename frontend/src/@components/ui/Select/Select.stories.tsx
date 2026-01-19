import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Select } from './index';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Select component with options, label, error states, and support for default and hour types.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Select label text',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator (*)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select',
    },
    type: {
      control: 'select',
      options: ['default', 'hour'],
      description: 'Select type (default or hour)',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  value: `${i.toString().padStart(2, '0')}:00`,
  label: `${i.toString().padStart(2, '0')}:00`,
}));

export const Default: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Select an option...',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Select Option',
    options: defaultOptions,
    placeholder: 'Choose an option...',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const Required: Story = {
  args: {
    label: 'Select Option',
    options: defaultOptions,
    placeholder: 'Choose an option...',
    required: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const WithError: Story = {
  args: {
    label: 'Select Option',
    options: defaultOptions,
    placeholder: 'Choose an option...',
    error: 'This field is required',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const HourType: Story = {
  args: {
    label: 'Select Hour',
    options: hourOptions,
    placeholder: 'Select hour...',
    type: 'hour',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options: defaultOptions,
    placeholder: 'Cannot select',
    disabled: true,
    value: 'option1',
  },
  render: (args) => {
    return <Select {...args} />;
  },
};

export const WithValue: Story = {
  args: {
    label: 'Selected Option',
    options: defaultOptions,
    placeholder: 'Choose an option...',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>('option2');
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const AllStates: Story = {
  render: () => {
    const [value1, setValue1] = useState<string | number | undefined>(undefined);
    const [value2, setValue2] = useState<string | number | undefined>(undefined);
    const [value3, setValue3] = useState<string | number | undefined>(undefined);

    return (
      <div className="flex flex-col gap-6 w-[400px]">
        <Select
          label="Default"
          options={defaultOptions}
          placeholder="Select an option..."
          value={value1}
          onChange={setValue1}
        />
        <Select
          label="Required"
          options={defaultOptions}
          placeholder="Select an option..."
          required
          value={value2}
          onChange={setValue2}
        />
        <Select
          label="With Error"
          options={defaultOptions}
          placeholder="Select an option..."
          error="This field is required"
          value={value3}
          onChange={setValue3}
        />
        <Select
          label="Hour Type"
          options={hourOptions}
          placeholder="Select hour..."
          type="hour"
        />
        <Select
          label="Disabled"
          options={defaultOptions}
          placeholder="Cannot select"
          disabled
          value="option1"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'All select states displayed together.',
      },
    },
  },
};

