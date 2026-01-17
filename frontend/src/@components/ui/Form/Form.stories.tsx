import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './index';
import { Input } from '../Input/index';
import { Button } from '../Button/index';

const meta: Meta<typeof Form> = {
  title: 'UI/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: () => (
    <Form>
      <div className="space-y-4">
        <Input label="Name" placeholder="Enter your name" />
        <Input label="Email" placeholder="Enter your email" type="email" />
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  ),
};

