import { describe, it, expect } from 'vitest';

// Extract family rates configuration for testing
export const familyRates = {
  A: [
    { cutoff: 23, rate: 15, description: 'Before 11:00 PM' },
    { cutoff: 28, rate: 20, description: '11:00 PM - 4:00 AM' }
  ],
  B: [
    { cutoff: 22, rate: 12, description: 'Before 10:00 PM' },
    { cutoff: 24, rate: 8, description: '10:00 PM - 12:00 AM' },
    { cutoff: 28, rate: 16, description: '12:00 AM - 4:00 AM' }
  ],
  C: [
    { cutoff: 21, rate: 21, description: 'Before 9:00 PM' },
    { cutoff: 28, rate: 15, description: '9:00 PM - 4:00 AM' }
  ]
};

export const getFamilyRates = (family: string) => {
  return familyRates[family as keyof typeof familyRates];
};

export const calculateRateForTime = (family: string, time: number): number => {
  const rates = getFamilyRates(family);
  if (!rates) throw new Error('Invalid family');
  
  for (const rate of rates) {
    if (time < rate.cutoff) {
      return rate.rate;
    }
  }
  
  return rates[rates.length - 1].rate;
};

describe('Family Rates', () => {
  describe('getFamilyRates', () => {
    it('returns correct rates for Family A', () => {
      const rates = getFamilyRates('A');
      expect(rates).toHaveLength(2);
      expect(rates[0].rate).toBe(15);
      expect(rates[1].rate).toBe(20);
    });

    it('returns correct rates for Family B', () => {
      const rates = getFamilyRates('B');
      expect(rates).toHaveLength(3);
      expect(rates[0].rate).toBe(12);
      expect(rates[1].rate).toBe(8);
      expect(rates[2].rate).toBe(16);
    });

    it('returns correct rates for Family C', () => {
      const rates = getFamilyRates('C');
      expect(rates).toHaveLength(2);
      expect(rates[0].rate).toBe(21);
      expect(rates[1].rate).toBe(15);
    });

    it('returns undefined for invalid family', () => {
      const rates = getFamilyRates('D');
      expect(rates).toBeUndefined();
    });
  });

  describe('calculateRateForTime', () => {
    it('calculates correct rate for Family A at different times', () => {
      expect(calculateRateForTime('A', 20)).toBe(15); // 8 PM
      expect(calculateRateForTime('A', 22)).toBe(15); // 10 PM
      expect(calculateRateForTime('A', 23)).toBe(20); // 11 PM
      expect(calculateRateForTime('A', 25)).toBe(20); // 1 AM
    });

    it('calculates correct rate for Family B at different times', () => {
      expect(calculateRateForTime('B', 19)).toBe(12); // 7 PM
      expect(calculateRateForTime('B', 22)).toBe(8);  // 10 PM
      expect(calculateRateForTime('B', 23)).toBe(8);  // 11 PM
      expect(calculateRateForTime('B', 24)).toBe(16); // 12 AM
      expect(calculateRateForTime('B', 26)).toBe(16); // 2 AM
    });

    it('calculates correct rate for Family C at different times', () => {
      expect(calculateRateForTime('C', 18)).toBe(21); // 6 PM
      expect(calculateRateForTime('C', 20)).toBe(21); // 8 PM
      expect(calculateRateForTime('C', 21)).toBe(15); // 9 PM
      expect(calculateRateForTime('C', 25)).toBe(15); // 1 AM
    });

    it('throws error for invalid family', () => {
      expect(() => calculateRateForTime('D', 20)).toThrow('Invalid family');
    });
  });

  describe('rate boundaries', () => {
    it('handles exact cutoff times correctly', () => {
      // Family A: cutoff at 23 (11 PM)
      expect(calculateRateForTime('A', 22.99)).toBe(15);
      expect(calculateRateForTime('A', 23)).toBe(20);
      
      // Family B: cutoffs at 22 (10 PM) and 24 (12 AM)
      expect(calculateRateForTime('B', 21.99)).toBe(12);
      expect(calculateRateForTime('B', 22)).toBe(8);
      expect(calculateRateForTime('B', 23.99)).toBe(8);
      expect(calculateRateForTime('B', 24)).toBe(16);
      
      // Family C: cutoff at 21 (9 PM)
      expect(calculateRateForTime('C', 20.99)).toBe(21);
      expect(calculateRateForTime('C', 21)).toBe(15);
    });
  });
});