import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PayBreakdown from './PayBreakdown';

describe('PayBreakdown', () => {
  const mockPayResult = {
    totalPay: 85,
    totalHours: 5,
    breakdown: [
      {
        period: '5:00 PM - 9:00 PM',
        hours: 4,
        rate: 15,
        pay: 60
      },
      {
        period: '9:00 PM - 10:00 PM',
        hours: 1,
        rate: 25,
        pay: 25
      }
    ],
    family: 'A'
  };

  it('renders total pay correctly', () => {
    render(<PayBreakdown payResult={mockPayResult} />);

    expect(screen.getByTestId('main-total-pay')).toHaveTextContent('$85.00');
  });

  it('displays total hours and family', () => {
    render(<PayBreakdown payResult={mockPayResult} />);

    // Check for specific elements that should contain the hours and family info
    expect(screen.getByText('Total Hours')).toBeInTheDocument();
    
    // Use queryAllByText to find all elements and check if any contain the family info
    const elements = screen.queryAllByText(/Family A/);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('shows breakdown periods with correct details', () => {
    render(<PayBreakdown payResult={mockPayResult} />);

    // Check first breakdown item
    expect(screen.getByText('5:00 PM - 9:00 PM')).toBeInTheDocument();
    expect(screen.getByTestId('breakdown-item-pay-0')).toHaveTextContent('$60.00');

    // Check second breakdown item
    expect(screen.getByText('9:00 PM - 10:00 PM')).toBeInTheDocument();
    expect(screen.getByTestId('breakdown-item-pay-1')).toHaveTextContent('$25.00');
  });

  it('displays summary totals', () => {
    render(<PayBreakdown payResult={mockPayResult} />);

    // Check summary section
    expect(screen.getByText('Total Hours')).toBeInTheDocument();
    expect(screen.getByText('Avg Rate')).toBeInTheDocument();
    expect(screen.getByTestId('summary-total-pay')).toHaveTextContent('$85.00');
  });

  it('renders with proper styling classes', () => {
    render(<PayBreakdown payResult={mockPayResult} />);

    const card = screen.getByText('Payment Breakdown').closest('.shadow-2xl');
    expect(card).toBeInTheDocument();
  });

  it('handles single breakdown item', () => {
    const singleBreakdownResult = {
      totalPay: 60,
      totalHours: 4,
      breakdown: [
        {
          period: '5:00 PM - 9:00 PM',
          hours: 4,
          rate: 15,
          pay: 60
        }
      ],
      family: 'B'
    };

    render(<PayBreakdown payResult={singleBreakdownResult} />);

    expect(screen.getByTestId('main-total-pay')).toHaveTextContent('$60.00');
    expect(screen.getByText('Total Hours')).toBeInTheDocument();
    
    // Use queryAllByText to find all elements and check if any contain the family info
    const elements = screen.queryAllByText(/Family B/);
    expect(elements.length).toBeGreaterThan(0);
    
    expect(screen.getByText('5:00 PM - 9:00 PM')).toBeInTheDocument();
  });
});