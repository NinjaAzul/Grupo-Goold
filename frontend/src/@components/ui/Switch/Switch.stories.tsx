import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Switch } from './index';
import { useState } from 'react';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onChange={setChecked} />;
  },
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return <Switch checked={checked} onChange={setChecked} />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center gap-2">
        <Switch checked={checked} onChange={setChecked} label="Enable notifications" />
        <span>Enable notifications</span>
      </div>
    );
  },
};

export const Small: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onChange={setChecked} size="sm" />;
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

