export interface PayBreakdown {
  period: string;
  hours: number;
  rate: number;
  pay: number;
}

export interface PayResult {
  totalPay: number;
  totalHours: number;
  breakdown: PayBreakdown[];
  family: string;
}

// Convert time string to 24-hour format for calculations
const parseTime = (timeStr: string): number => {
  const cleaned = timeStr.trim().toUpperCase();
  
  // Handle formats like "5:00 PM", "5PM", "17:00", etc.
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
    // 24-hour format
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

// Validate that times are within allowed range (5PM to 4AM)
const validateTime = (time: number): boolean => {
  // Convert to working day format: 5PM = 17, 4AM next day = 28 (24 + 4)
  if (time >= 17) return true; // 5PM to 11:59PM
  if (time >= 0 && time <= 4) return true; // 12AM to 4AM
  return false;
};

// Convert time to working day format for easier calculations
const toWorkingDayTime = (time: number): number => {
  if (time >= 17) return time; // 5PM-11:59PM stays the same
  if (time >= 0 && time <= 4) return time + 24; // 12AM-4AM becomes 24-28
  throw new Error('Time is outside allowed range');
};

const formatTimeRange = (start: number, end: number): string => {
  const formatHour = (hour: number) => {
    if (hour >= 24) hour -= 24; // Convert back from working day format
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  };
  
  return `${formatHour(start)} - ${formatHour(end)}`;
};

export const calculatePay = (startTimeStr: string, endTimeStr: string, family: string): PayResult => {
  // Parse and validate times
  const startTime = parseTime(startTimeStr);
  const endTime = parseTime(endTimeStr);
  
  if (!validateTime(startTime)) {
    throw new Error('Start time must be between 5:00 PM and 4:00 AM');
  }
  
  if (!validateTime(endTime)) {
    throw new Error('End time must be between 5:00 PM and 4:00 AM');
  }
  
  // Convert to working day format
  const workingStart = toWorkingDayTime(startTime);
  const workingEnd = toWorkingDayTime(endTime);
  
  if (workingEnd < workingStart) {
    throw new Error('End time must be after start time');
  }
  
  // Calculate total hours (round down to full hours)
  const totalHours = Math.floor(workingEnd - workingStart);
  
  if (totalHours === 0) {
    throw new Error('Must work at least 1 full hour');
  }
  
  // Define pay rates for each family
  const familyRates = {
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
  
  const rates = familyRates[family as keyof typeof familyRates];
  if (!rates) {
    throw new Error('Invalid family selection');
  }
  
  // Calculate pay breakdown
  const breakdown: PayBreakdown[] = [];
  let totalPay = 0;
  let currentTime = workingStart;
  const endOfWork = workingStart + totalHours;
  
  for (const rateInfo of rates) {
    if (currentTime >= endOfWork) break;
    
    const periodEnd = Math.min(rateInfo.cutoff, endOfWork);
    if (currentTime < periodEnd) {
      const hoursInPeriod = periodEnd - currentTime;
      const payForPeriod = hoursInPeriod * rateInfo.rate;
      
      breakdown.push({
        period: formatTimeRange(currentTime, periodEnd),
        hours: hoursInPeriod,
        rate: rateInfo.rate,
        pay: payForPeriod
      });
      
      totalPay += payForPeriod;
      currentTime = periodEnd;
    }
  }
  
  return {
    totalPay,
    totalHours,
    breakdown,
    family
  };
};