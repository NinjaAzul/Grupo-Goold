import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index';
import { SearchIcon, EyeIcon } from '@/@components/icons';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Input component with label, error states, icons (left/right), and loading state support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label text',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator (*)',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading spinner on the right',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: 'This field is required',
    defaultValue: 'invalid-email',
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    leftIcon: <SearchIcon className="w-5 h-5 text-gray-400" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    rightIcon: <EyeIcon className="w-5 h-5 text-gray-400" />,
  },
};

export const Loading: Story = {
  args: {
    label: 'Searching...',
    placeholder: 'Enter search term',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot type here',
    disabled: true,
    defaultValue: 'Disabled value',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[400px]">
      <Input placeholder="Default input" />
      <Input label="With Label" placeholder="Enter text" />
      <Input label="Required" placeholder="Enter text" required />
      <Input
        label="With Error"
        placeholder="Enter text"
        error="This field is required"
        defaultValue="invalid"
      />
      <Input
        label="With Left Icon"
        placeholder="Search..."
        leftIcon={<SearchIcon className="w-5 h-5 text-gray-400" />}
      />
      <Input
        label="With Right Icon"
        placeholder="Enter password"
        type="password"
        rightIcon={<EyeIcon className="w-5 h-5 text-gray-400" />}
      />
      <Input label="Loading" placeholder="Loading..." isLoading />
      <Input label="Disabled" placeholder="Disabled" disabled defaultValue="Disabled value" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All input states displayed together.',
      },
    },
  },
};

