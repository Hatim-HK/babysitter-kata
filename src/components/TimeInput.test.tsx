import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeInput from './TimeInput';

describe('TimeInput', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with placeholder text', () => {
    render(
      <TimeInput
        id="test-time"
        value=""
        onChange={mockOnChange}
        placeholder="Select time"
      />
    );

    expect(screen.getByText('Select time')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(
      <TimeInput
        id="test-time"
        value="5:00 PM"
        onChange={mockOnChange}
        placeholder="Select time"
      />
    );

    expect(screen.getByText('5:00 PM')).toBeInTheDocument();
  });

  it('toggles between picker and manual input modes', () => {
    render(
      <TimeInput
        id="test-time"
        value=""
        onChange={mockOnChange}
        placeholder="Select time"
      />
    );

    const toggleButton = screen.getByTitle(/use time picker|type manually/i);
    fireEvent.click(toggleButton);

    // Should show manual input mode
    expect(screen.getByPlaceholderText('Select time')).toBeInTheDocument();
    expect(screen.getByText('💡 Enter time in format: 5:00 PM or 12:30 AM')).toBeInTheDocument();
  });

  it('filters invalid characters in manual input mode', () => {
    render(
      <TimeInput
        id="test-time"
        value=""
        onChange={mockOnChange}
        placeholder="Select time"
      />
    );

    // Switch to manual input mode
    const toggleButton = screen.getByTitle(/use time picker|type manually/i);
    fireEvent.click(toggleButton);

    const input = screen.getByPlaceholderText('Select time');
    fireEvent.change(input, { target: { value: '5:00 PM xyz123' } });

    expect(mockOnChange).toHaveBeenCalledWith('5:00 PM 123');
  });

  it('calls onChange when value changes in manual mode', () => {
    render(
      <TimeInput
        id="test-time"
        value=""
        onChange={mockOnChange}
        placeholder="Select time"
      />
    );

    // Switch to manual input mode
    const toggleButton = screen.getByTitle(/use time picker|type manually/i);
    fireEvent.click(toggleButton);

    const input = screen.getByPlaceholderText('Select time');
    fireEvent.change(input, { target: { value: '6:00 PM' } });

    expect(mockOnChange).toHaveBeenCalledWith('6:00 PM');
  });
});