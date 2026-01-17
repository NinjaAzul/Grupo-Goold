import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './index';

describe('Pagination', () => {
  it('renders pagination controls', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={jest.fn()} />);
    expect(screen.getByLabelText(/página anterior/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/próxima página/i)).toBeInTheDocument();
  });

  it('displays current page number', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={jest.fn()} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={jest.fn()} />);
    const prevButton = screen.getByLabelText(/página anterior/i);
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={10} totalPages={10} onPageChange={jest.fn()} />);
    const nextButton = screen.getByLabelText(/próxima página/i);
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when next button is clicked', async () => {
    const handlePageChange = jest.fn();
    const user = userEvent.setup();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={handlePageChange} />);
    const nextButton = screen.getByLabelText(/próxima página/i);
    await user.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when previous button is clicked', async () => {
    const handlePageChange = jest.fn();
    const user = userEvent.setup();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={handlePageChange} />);
    const prevButton = screen.getByLabelText(/página anterior/i);
    await user.click(prevButton);
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange when page number is clicked', async () => {
    const handlePageChange = jest.fn();
    const user = userEvent.setup();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={handlePageChange} />);
    const pageButton = screen.getByLabelText(/página 3/i);
    await user.click(pageButton);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('shows ellipsis for many pages', () => {
    render(<Pagination currentPage={50} totalPages={100} onPageChange={jest.fn()} />);
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });

  it('shows all pages when totalPages is small', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });
});

