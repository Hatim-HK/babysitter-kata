import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import TimePicker from './TimePicker';

describe('TimePicker', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with placeholder text when no value', () => {
    render(
      <TimePicker
        value=""
        onChange={mockOnChange}
        placeholder="Select time"
      />
    );

    expect(screen.getByText('Select time')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(
      <TimePicker
        value="5:00 PM"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('5:00 PM')).toBeInTheDocument();
  });

  it('opens popover when clicked', () => {
    render(
      <TimePicker
        value=""
        onChange={mockOnChange}
      />
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByText('Select Time')).toBeInTheDocument();
  });

  it('generates correct time options for babysitting hours', () => {
    render(
      <TimePicker
        value=""
        onChange={mockOnChange}
      />
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    // Check for some expected time options
    expect(screen.getByText('Select Time')).toBeInTheDocument();
    const popover = screen.getByRole('dialog');
    
    expect(within(popover).getByText('5:00 PM')).toBeInTheDocument();
    expect(within(popover).getByText('11:30 PM')).toBeInTheDocument();
    expect(within(popover).getByText('12:00 AM')).toBeInTheDocument();
    expect(within(popover).getByText('4:00 AM')).toBeInTheDocument();
    
    // Should not have 4:30 AM
    expect(within(popover).queryByText('4:30 AM')).not.toBeInTheDocument();
  });

  it('calls onChange when time is selected', () => {
    render(
      <TimePicker
        value=""
        onChange={mockOnChange}
      />
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const popover = screen.getByRole('dialog');
    const timeOption = within(popover).getByText('6:00 PM');
    fireEvent.click(timeOption);

    expect(mockOnChange).toHaveBeenCalledWith('6:00 PM');
  });

  it('highlights selected time option', () => {
    render(
      <TimePicker
        value="7:00 PM"
        onChange={mockOnChange}
      />
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const popover = screen.getByRole('dialog');
    const selectedOption = within(popover).getByText('7:00 PM');
    expect(selectedOption).toHaveClass('bg-purple-600', 'text-white', 'font-medium');
  });
});