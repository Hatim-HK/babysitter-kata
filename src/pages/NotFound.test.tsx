import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

// Mock console.error to avoid noise in tests
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('NotFound Page', () => {
  afterEach(() => {
    mockConsoleError.mockClear();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  it('renders 404 error message', () => {
    render(
      <MemoryRouter initialEntries={['/nonexistent']}>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
  });

  it('renders return to home link', () => {
    render(
      <MemoryRouter initialEntries={['/nonexistent']}>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Return to Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('logs error to console with attempted route', () => {
    render(
      <MemoryRouter initialEntries={['/invalid-route']}>
        <NotFound />
      </MemoryRouter>
    );

    expect(mockConsoleError).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      '/invalid-route'
    );
  });

  it('has proper styling classes', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <NotFound />
      </MemoryRouter>
    );

    const container = screen.getByText('404').closest('div').parentElement;
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
  });
});