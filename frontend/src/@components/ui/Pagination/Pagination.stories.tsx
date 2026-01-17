import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './index';
import { useState } from 'react';

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  },
};

export const FewPages: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />;
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(50);
    return <Pagination currentPage={page} totalPages={100} onPageChange={setPage} />;
  },
};

export const FirstPage: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />;
  },
};

export const LastPage: Story = {
  render: () => {
    const [page, setPage] = useState(20);
    return <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />;
  },
};

