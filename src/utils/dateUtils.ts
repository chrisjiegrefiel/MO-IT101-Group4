
import { format, startOfWeek, endOfWeek, addWeeks, differenceInMinutes, addMinutes, parse } from 'date-fns';
import { Week } from '@/types/employee';

// Format dates consistently
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatTime = (time: string): string => {
  // Parse time from 24-hour format and format to 12-hour with AM/PM
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  
  return format(date, 'h:mm a');
};

// Get current week
export const getCurrentWeek = (): Week => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
  const end = endOfWeek(today, { weekStartsOn: 1 }); // Week ends on Sunday
  
  // Calculate week number (simplified for this example)
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = differenceInMinutes(today, firstDayOfYear);
  const weekNumber = Math.ceil((pastDaysOfYear / 60 / 24 + firstDayOfYear.getDay() + 1) / 7);
  
  return {
    start,
    end,
    weekNumber
  };
};

// Get a specific week by offset from current week
export const getWeek = (offset: number): Week => {
  const currentWeek = getCurrentWeek();
  const start = addWeeks(currentWeek.start, offset);
  const end = addWeeks(currentWeek.end, offset);
  
  return {
    start,
    end,
    weekNumber: currentWeek.weekNumber + offset
  };
};

// Calculate work hours considering grace period (10 minutes)
export const calculateWorkHours = (timeIn: string, timeOut: string, expectedTimeIn: string = '08:00'): {
  regularHours: number;
  lateMinutes: number;
  undertimeMinutes: number;
  overtimeMinutes: number;
} => {
  // Parse times into Date objects for easier manipulation
  const workDate = new Date(); // Using today's date as a base
  
  const parseTimeToDate = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(workDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };
  
  const timeInDate = parseTimeToDate(timeIn);
  const timeOutDate = parseTimeToDate(timeOut);
  const expectedTimeInDate = parseTimeToDate(expectedTimeIn);
  const graceEndTime = addMinutes(expectedTimeInDate, 10); // 10-minute grace period
  const expectedTimeOutDate = addMinutes(expectedTimeInDate, 8 * 60); // 8-hour workday
  
  // Handle crossing midnight case
  if (timeOutDate < timeInDate) {
    timeOutDate.setDate(timeOutDate.getDate() + 1);
  }
  
  // Calculate total minutes worked
  const totalMinutesWorked = differenceInMinutes(timeOutDate, timeInDate);
  
  // Calculate late minutes (only if after grace period)
  const lateMinutes = timeInDate > graceEndTime 
    ? differenceInMinutes(timeInDate, expectedTimeInDate) 
    : 0;
  
  // Calculate undertime (leaving early)
  const undertimeMinutes = timeOutDate < expectedTimeOutDate 
    ? differenceInMinutes(expectedTimeOutDate, timeOutDate)
    : 0;
  
  // Calculate overtime (staying after expected time out)
  const overtimeMinutes = timeOutDate > expectedTimeOutDate 
    ? differenceInMinutes(timeOutDate, expectedTimeOutDate)
    : 0;
  
  // Regular hours = total hours worked minus overtime, capped at 8 hours, reduced by late and undertime
  const maxRegularMinutes = 8 * 60; // 8 hours in minutes
  const regularMinutes = Math.min(totalMinutesWorked - overtimeMinutes, maxRegularMinutes) - lateMinutes - undertimeMinutes;
  const regularHours = Math.max(0, regularMinutes / 60);
  
  return {
    regularHours,
    lateMinutes,
    undertimeMinutes,
    overtimeMinutes: Math.max(0, overtimeMinutes)
  };
};
