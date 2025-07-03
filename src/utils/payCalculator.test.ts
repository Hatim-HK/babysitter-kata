import { describe, it, expect } from 'vitest';
import { calculatePay } from './payCalculator';

describe('Pay Calculator', () => {
  describe('Family A rates', () => {
    it('should calculate pay for hours before 11PM', () => {
      const result = calculatePay('5:00 PM', '9:00 PM', 'A');
      expect(result.totalPay).toBe(60); // 4 hours * $15
      expect(result.totalHours).toBe(4);
      expect(result.breakdown).toHaveLength(1);
      expect(result.breakdown[0].rate).toBe(15);
    });

    it('should calculate pay for hours after 11PM', () => {
      const result = calculatePay('11:00 PM', '2:00 AM', 'A');
      expect(result.totalPay).toBe(60); // 3 hours * $20
      expect(result.totalHours).toBe(3);
      expect(result.breakdown).toHaveLength(1);
      expect(result.breakdown[0].rate).toBe(20);
    });

    it('should calculate pay across rate change at 11PM', () => {
      const result = calculatePay('9:00 PM', '1:00 AM', 'A');
      expect(result.totalPay).toBe(70); // 2 hours * $15 + 2 hours * $20
      expect(result.totalHours).toBe(4);
      expect(result.breakdown).toHaveLength(2);
    });
  });

  describe('Family B rates', () => {
    it('should calculate pay with all three rate periods', () => {
      const result = calculatePay('8:00 PM', '2:00 AM', 'B');
      expect(result.totalPay).toBe(72); // 2*$12 + 2*$8 + 2*$16
      expect(result.totalHours).toBe(6);
      expect(result.breakdown).toHaveLength(3);
    });

    it('should handle 10PM to midnight period', () => {
      const result = calculatePay('10:00 PM', '12:00 AM', 'B');
      expect(result.totalPay).toBe(16); // 2 hours * $8
      expect(result.totalHours).toBe(2);
    });
  });

  describe('Family C rates', () => {
    it('should calculate pay before 9PM', () => {
      const result = calculatePay('5:00 PM', '8:00 PM', 'C');
      expect(result.totalPay).toBe(63); // 3 hours * $21
      expect(result.totalHours).toBe(3);
    });

    it('should calculate pay across 9PM rate change', () => {
      const result = calculatePay('8:00 PM', '11:00 PM', 'C');
      expect(result.totalPay).toBe(51); // 1 hour * $21 + 2 hours * $15
      expect(result.totalHours).toBe(3);
      expect(result.breakdown).toHaveLength(2);
    });
  });

  describe('Time validation', () => {
    it('should throw error for start time before 5PM', () => {
      expect(() => calculatePay('4:00 PM', '8:00 PM', 'A')).toThrow('Start time must be between 5:00 PM and 4:00 AM');
    });

    it('should throw error for end time after 4AM', () => {
      expect(() => calculatePay('5:00 PM', '5:00 AM', 'A')).toThrow('End time must be between 5:00 PM and 4:00 AM');
    });

    it('should throw error for end time before start time', () => {
      expect(() => calculatePay('10:00 PM', '9:00 PM', 'A')).toThrow('End time must be after start time');
    });

    it('should throw error for less than 1 hour work', () => {
      expect(() => calculatePay('5:00 PM', '5:30 PM', 'A')).toThrow('Must work at least 1 full hour');
    });

    it('should throw error for invalid family', () => {
      expect(() => calculatePay('5:00 PM', '8:00 PM', 'D')).toThrow('Invalid family selection');
    });
  });

  describe('Time parsing', () => {
    it('should handle different time formats', () => {
      const result1 = calculatePay('5PM', '8PM', 'A');
      const result2 = calculatePay('5:00 PM', '8:00 PM', 'A');
      expect(result1.totalPay).toBe(result2.totalPay);
    });

    it('should handle midnight correctly', () => {
      const result = calculatePay('11:00 PM', '12:00 AM', 'A');
      expect(result.totalPay).toBe(20); // 1 hour * $20
      expect(result.totalHours).toBe(1);
    });

    it('should handle 4AM end time', () => {
      const result = calculatePay('3:00 AM', '4:00 AM', 'A');
      expect(result.totalPay).toBe(20); // 1 hour * $20
      expect(result.totalHours).toBe(1);
    });
  });

  describe('Edge cases', () => {
    it('should calculate full night shift correctly', () => {
      const result = calculatePay('5:00 PM', '4:00 AM', 'A');
      expect(result.totalHours).toBe(11);
      expect(result.totalPay).toBe(190); // 6*$15 + 5*$20 = 90 + 100 = 190
    });

    it('should throw error for same start and end time', () => {
      expect(() => calculatePay('5:00 PM', '5:00 PM', 'A')).toThrow('Must work at least 1 full hour');
    });
  });
});