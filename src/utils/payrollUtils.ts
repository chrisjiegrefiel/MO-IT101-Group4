
import { TimeRecord } from '@/types/employee';
import { calculateWorkHours } from './dateUtils';

// Calculate weekly hours worked
export const calculateWeeklyHours = (timeRecords: TimeRecord[]): {
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
} => {
  // Aggregate hours from all time records
  const hours = timeRecords.reduce(
    (acc, record) => {
      const { regularHours, overtimeMinutes } = calculateWorkHours(record.timeIn, record.timeOut);
      
      return {
        regularHours: acc.regularHours + regularHours,
        overtimeHours: acc.overtimeHours + (overtimeMinutes / 60),
      };
    },
    { regularHours: 0, overtimeHours: 0 }
  );
  
  return {
    ...hours,
    totalHours: hours.regularHours + hours.overtimeHours
  };
};

// Calculate gross salary
export const calculateGrossSalary = (
  regularHours: number,
  overtimeHours: number,
  hourlyRate: number
): {
  regularPay: number;
  overtimePay: number;
  grossPay: number;
} => {
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * hourlyRate * 1.25; // 25% overtime premium
  
  return {
    regularPay,
    overtimePay,
    grossPay: regularPay + overtimePay
  };
};

// Calculate SSS contribution based on Philippine standards
export const calculateSSSContribution = (monthlySalary: number): number => {
  // Simplified SSS table (actual implementation would have a more complete table)
  if (monthlySalary <= 3250) return 135;
  if (monthlySalary <= 3750) return 157.50;
  if (monthlySalary <= 4250) return 180;
  if (monthlySalary <= 4750) return 202.50;
  if (monthlySalary <= 5250) return 225;
  if (monthlySalary <= 5750) return 247.50;
  if (monthlySalary <= 6250) return 270;
  if (monthlySalary <= 6750) return 292.50;
  if (monthlySalary <= 7250) return 315;
  if (monthlySalary <= 7750) return 337.50;
  if (monthlySalary <= 8250) return 360;
  if (monthlySalary <= 8750) return 382.50;
  if (monthlySalary <= 9250) return 405;
  if (monthlySalary <= 9750) return 427.50;
  if (monthlySalary <= 10250) return 450;
  if (monthlySalary <= 10750) return 472.50;
  if (monthlySalary <= 11250) return 495;
  if (monthlySalary <= 11750) return 517.50;
  if (monthlySalary <= 12250) return 540;
  if (monthlySalary <= 12750) return 562.50;
  if (monthlySalary <= 13250) return 585;
  if (monthlySalary <= 13750) return 607.50;
  if (monthlySalary <= 14250) return 630;
  if (monthlySalary <= 14750) return 652.50;
  if (monthlySalary <= 15250) return 675;
  if (monthlySalary <= 15750) return 697.50;
  if (monthlySalary <= 16250) return 720;
  if (monthlySalary <= 16750) return 742.50;
  if (monthlySalary <= 17250) return 765;
  if (monthlySalary <= 17750) return 787.50;
  if (monthlySalary <= 18250) return 810;
  if (monthlySalary <= 18750) return 832.50;
  if (monthlySalary <= 19250) return 855;
  if (monthlySalary <= 19750) return 877.50;
  if (monthlySalary <= 20250) return 900;
  if (monthlySalary <= 20750) return 922.50;
  if (monthlySalary <= 21750) return 967.50;
  if (monthlySalary <= 22750) return 1012.50;
  if (monthlySalary <= 23750) return 1057.50;
  if (monthlySalary <= 24750) return 1102.50;
  return 1125; // Maximum contribution
};

// Calculate PhilHealth contribution
export const calculatePhilHealthContribution = (monthlySalary: number): number => {
  // PhilHealth contribution is 3% of monthly salary (1.5% employee share, 1.5% employer share)
  // Here we calculate only the employee's share
  const rate = 0.015; // 1.5%
  const maxContributionBase = 60000; // Maximum salary base
  const contributionBase = Math.min(monthlySalary, maxContributionBase);
  
  return contributionBase * rate;
};

// Calculate Pag-IBIG contribution
export const calculatePagIbigContribution = (monthlySalary: number): number => {
  // Pag-IBIG contribution is 2% of monthly salary for those earning over 1,500
  // 1% for those earning 1,500 or less
  const rate = monthlySalary > 1500 ? 0.02 : 0.01;
  const maxContributionBase = 5000; // Maximum salary base
  const contributionBase = Math.min(monthlySalary, maxContributionBase);
  
  return contributionBase * rate;
};

// Calculate withholding tax
export const calculateWithholdingTax = (
  monthlySalary: number,
  sssContribution: number,
  philhealthContribution: number,
  pagibigContribution: number
): number => {
  // Calculate taxable income
  const totalDeductions = sssContribution + philhealthContribution + pagibigContribution;
  const taxableIncome = monthlySalary - totalDeductions;
  
  // Apply tax brackets (2023 Philippine tax brackets)
  if (taxableIncome <= 20833) {
    return 0;
  } else if (taxableIncome <= 33332) {
    return (taxableIncome - 20833) * 0.15;
  } else if (taxableIncome <= 66666) {
    return 1875 + (taxableIncome - 33332) * 0.20;
  } else if (taxableIncome <= 166666) {
    return 8541.80 + (taxableIncome - 66666) * 0.25;
  } else if (taxableIncome <= 666666) {
    return 33541.80 + (taxableIncome - 166666) * 0.30;
  } else {
    return 183541.80 + (taxableIncome - 666666) * 0.35;
  }
};

// Calculate net salary 
export const calculateNetSalary = (
  grossWeeklySalary: number,
  hourlyRate: number
): {
  sssDeduction: number;
  philhealthDeduction: number;
  pagibigDeduction: number;
  taxDeduction: number;
  totalDeductions: number;
  netPay: number;
} => {
  // Estimate monthly salary for deduction calculations
  const estimatedMonthlySalary = grossWeeklySalary * 4; // Simple approximation
  
  // Calculate deductions
  const sssDeduction = calculateSSSContribution(estimatedMonthlySalary) / 4; // Weekly portion
  const philhealthDeduction = calculatePhilHealthContribution(estimatedMonthlySalary) / 4;
  const pagibigDeduction = calculatePagIbigContribution(estimatedMonthlySalary) / 4;
  
  // Calculate withholding tax
  const monthlyTax = calculateWithholdingTax(
    estimatedMonthlySalary,
    sssDeduction * 4,
    philhealthDeduction * 4,
    pagibigDeduction * 4
  );
  
  const taxDeduction = monthlyTax / 4; // Weekly portion
  const totalDeductions = sssDeduction + philhealthDeduction + pagibigDeduction + taxDeduction;
  
  return {
    sssDeduction,
    philhealthDeduction,
    pagibigDeduction,
    taxDeduction,
    totalDeductions,
    netPay: grossWeeklySalary - totalDeductions
  };
};

// Complete salary computation
export const computeSalary = (
  timeRecords: TimeRecord[],
  hourlyRate: number
) => {
  // Calculate hours
  const { regularHours, overtimeHours } = calculateWeeklyHours(timeRecords);
  
  // Calculate gross salary
  const { regularPay, overtimePay, grossPay } = calculateGrossSalary(
    regularHours,
    overtimeHours,
    hourlyRate
  );
  
  // Calculate deductions and net pay
  const {
    sssDeduction,
    philhealthDeduction,
    pagibigDeduction,
    taxDeduction,
    totalDeductions,
    netPay
  } = calculateNetSalary(grossPay, hourlyRate);
  
  return {
    regularHours,
    overtimeHours,
    regularPay,
    overtimePay,
    grossPay,
    sssDeduction,
    philhealthDeduction,
    pagibigDeduction,
    taxDeduction,
    totalDeductions,
    netPay
  };
};
