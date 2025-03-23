
export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  birthday: string; // ISO format date string
  position: string;
  department: string;
  hourlyRate: number;
  profileImage?: string;
}

export interface TimeRecord {
  id: string;
  employeeId: string;
  date: string; // ISO format date string
  timeIn: string; // 24-hour format (HH:MM)
  timeOut: string; // 24-hour format (HH:MM)
  late: number; // Late minutes
  undertime: number; // Undertime minutes
  overtime: number; // Overtime minutes
}

export interface SalaryComputation {
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  grossPay: number;
  sssDeduction: number;
  philhealthDeduction: number;
  pagibigDeduction: number;
  taxDeduction: number;
  totalDeductions: number;
  netPay: number;
}

export type Week = {
  start: Date;
  end: Date;
  weekNumber: number;
};
