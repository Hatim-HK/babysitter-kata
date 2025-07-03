import { describe, it, expect } from 'vitest';

// Create utility functions that could be extracted from payCalculator
export const parseTime = (timeStr: string): number => {
  const cleaned = timeStr.trim().toUpperCase();
  
  let hours: number;
  let minutes: number = 0;
  
  if (cleaned.includes('PM') || cleaned.includes('AM')) {
    const isPM = cleaned.includes('PM');
    const timeOnly = cleaned.replace(/[APM\s]/g, '');
    
    if (timeOnly.includes(':')) {
      const [h, m] = timeOnly.split(':');
      hours = parseInt(h);
      minutes = parseInt(m) || 0;
    } else {
      hours = parseInt(timeOnly);
    }
    
    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }
  } else {
    if (cleaned.includes(':')) {
      const [h, m] = cleaned.split(':');
      hours = parseInt(h);
      minutes = parseInt(m) || 0;
    } else {
      hours = parseInt(cleaned);
    }
  }
  
  return hours + minutes / 60;
};

export const validateTime = (time: number): boolean => {
  if (time >= 17) return true; // 5PM to 11:59PM
  if (time >= 0 && time <= 4) return true; // 12AM to 4AM
  return false;
};

export const formatTimeRange = (start: number, end: number): string => {
  const formatHour = (hour: number) => {
    if (hour >= 24) hour -= 24;
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  };
  
  return `${formatHour(start)} - ${formatHour(end)}`;
};

describe('Time Utilities', () => {
  describe('parseTime', () => {
    it('parses 12-hour format with AM/PM', () => {
      expect(parseTime('5:00 PM')).toBe(17);
      expect(parseTime('5:30 PM')).toBe(17.5);
      expect(parseTime('12:00 AM')).toBe(0);
      expect(parseTime('12:00 PM')).toBe(12);
      expect(parseTime('1:00 AM')).toBe(1);
    });

    it('parses time without minutes', () => {
      expect(parseTime('5 PM')).toBe(17);
      expect(parseTime('5PM')).toBe(17);
      expect(parseTime('12 AM')).toBe(0);
      expect(parseTime('12PM')).toBe(12);
    });

    it('parses 24-hour format', () => {
      expect(parseTime('17:00')).toBe(17);
      expect(parseTime('17:30')).toBe(17.5);
      expect(parseTime('0:00')).toBe(0);
      expect(parseTime('23:59')).toBe(23.983333333333334);
    });

    it('handles edge cases', () => {
      expect(parseTime('  5:00 PM  ')).toBe(17); // whitespace
      expect(parseTime('5:00 pm')).toBe(17); // lowercase
      expect(parseTime('05:00 PM')).toBe(17); // leading zero
    });
  });

  describe('validateTime', () => {
    it('validates allowed babysitting hours', () => {
      expect(validateTime(17)).toBe(true); // 5 PM
      expect(validateTime(23)).toBe(true); // 11 PM
      expect(validateTime(0)).toBe(true); // 12 AM
      expect(validateTime(4)).toBe(true); // 4 AM
    });

    it('rejects invalid hours', () => {
      expect(validateTime(16)).toBe(false); // 4 PM
      expect(validateTime(5)).toBe(false); // 5 AM
      expect(validateTime(12)).toBe(false); // 12 PM
    });
  });

  describe('formatTimeRange', () => {
    it('formats time ranges correctly', () => {
      expect(formatTimeRange(17, 21)).toBe('5:00 PM - 9:00 PM');
      expect(formatTimeRange(23, 25)).toBe('11:00 PM - 1:00 AM');
      expect(formatTimeRange(0, 4)).toBe('12:00 AM - 4:00 AM');
    });

    it('handles midnight crossover', () => {
      expect(formatTimeRange(23, 24)).toBe('11:00 PM - 12:00 AM');
      expect(formatTimeRange(24, 28)).toBe('12:00 AM - 4:00 AM');
    });
  });
});