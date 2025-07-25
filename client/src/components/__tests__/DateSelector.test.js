import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateSelector from '../DateSelector';

// Mock react-router-dom useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock moment to have consistent dates in tests
jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment');
  return (date) => {
    if (date) {
      return actualMoment(date);
    }
    return actualMoment('2025-07-11'); // Fixed test date
  };
});

describe('DateSelector Component', () => {
  const mockOnClose = jest.fn();
  const availableDates = [
    '2025-07-10',
    '2025-07-09',
    '2025-07-08',
    '2025-07-01',
    '2025-06-30',
    '2025-06-15',
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  test('renders when visible', () => {
    render(
      <DateSelector
        visible={true}
        onClose={mockOnClose}
        availableDates={availableDates}
      />
    );
    
    expect(screen.getByText('Browse News by Date')).toBeInTheDocument();
    expect(screen.getByText(/days of positive news available/)).toBeInTheDocument();
  });

  test('does not render when not visible', () => {
    render(
      <DateSelector
        visible={false}
        onClose={mockOnClose}
        availableDates={availableDates}
      />
    );
    
    expect(screen.queryByText('Browse News by Date')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <DateSelector
        visible={true}
        onClose={mockOnClose}
        availableDates={availableDates}
      />
    );
    
    const closeButton = screen.getByRole('button', { name: /close date selector/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays calendar navigation controls', () => {
    render(
      <DateSelector
        visible={true}
        onClose={mockOnClose}
        availableDates={availableDates}
      />
    );
    
    expect(screen.getByRole('button', { name: '◀' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '▶' })).toBeInTheDocument();
    expect(screen.getByText(/july 2025/i)).toBeInTheDocument();
  });

  test('displays weekday headers', () => {
    render(
      <DateSelector
        visible={true}
        onClose={mockOnClose}
        availableDates={availableDates}
      />
    );
    
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test('marks available dates as clickable', () => {
    render(
      <DateSelector
        visible={true}
        onClose={mockOnClose}
        availableDates={availableDates}
        currentDate="2025-07-10"
      />
    );
    
    // Date 10 should be active and clickable
    const date10 = screen.getByRole('button', { name: '10' });
    expect(date10).toBeInTheDocument();
    expect(date10.closest('.calendar-day')).toHaveClass('calendar-day-active');
  });

  test('navigates to selected date and closes', async () => {
    render(
      <DateSelector
        visible={true}
        onClose={mockOnClose}
        availableDates={availableDates}
      />
    );
    
    const date9 = screen.getByRole('button', { name: '9' });
    fireEvent.click(date9);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/2025-07-09');
  });

  test('navigates to home for latest date', async () => {
    render(
      <DateSelector
        visible={true}
        onClose={mockOnClose}
        availableDates={availableDates}
      />
    );
    
    const date10 = screen.getByRole('button', { name: '10' });
    fireEvent.click(date10);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('handles empty available dates array', () => {
    render(
      <DateSelector
        visible={true}
        onClose={mockOnClose}
        availableDates={[]}
      />
    );
    
    expect(screen.getByText('Browse News by Date')).toBeInTheDocument();
    expect(screen.getByText(/0 days of positive news available/)).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(
      <DateSelector
        visible={true}
        onClose={mockOnClose}
        availableDates={availableDates}
      />
    );
    
    const overlay = document.querySelector('.date-selector-overlay');
    expect(overlay).toBeInTheDocument();
    
    const modal = document.querySelector('.date-selector-modal');
    expect(modal).toBeInTheDocument();
    
    const content = document.querySelector('.date-selector-content');
    expect(content).toBeInTheDocument();
  });
});
