
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TableRow, TableCell } from '@/components/ui/table';
import { 
  SalaryComputation, 
  Employee, 
  TimeRecord 
} from '@/types/employee';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface PayrollSummaryProps {
  employee: Employee;
  timeRecords: TimeRecord[];
  weekStart: Date;
  weekEnd: Date;
}

const PayrollSummary = ({ employee, timeRecords, weekStart, weekEnd }: PayrollSummaryProps) => {
  // Calculate salary data based on time records within the specified week
  const salaryData = useMemo(() => {
    // Filter time records for the current week
    const weekRecords = timeRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });
    
    // Calculate hours
    let regularHours = 0;
    let overtimeHours = 0;
    
    weekRecords.forEach(record => {
      // Calculate regular hours (simple calculation)
      const timeInParts = record.timeIn.split(':').map(Number);
      const timeOutParts = record.timeOut.split(':').map(Number);
      
      const timeInMinutes = timeInParts[0] * 60 + timeInParts[1];
      const timeOutMinutes = timeOutParts[0] * 60 + timeOutParts[1];
      
      // Calculate total worked time
      let workedMinutes = timeOutMinutes - timeInMinutes;
      
      // Adjust for late arrival
      if (record.late > 0) {
        workedMinutes -= record.late;
      }
      
      // Adjust for undertime
      if (record.undertime > 0) {
        workedMinutes -= record.undertime;
      }
      
      // Standard workday is 8 hours (480 minutes)
      const standardDay = 480;
      
      // Anything over 8 hours is overtime
      if (workedMinutes > standardDay) {
        regularHours += standardDay / 60;
        overtimeHours += (workedMinutes - standardDay) / 60;
      } else {
        regularHours += workedMinutes / 60;
      }
    });
    
    // Calculate pay
    const regularPay = regularHours * employee.hourlyRate;
    const overtimePay = overtimeHours * employee.hourlyRate * 1.25; // 25% overtime premium
    const grossPay = regularPay + overtimePay;
    
    // Calculate deductions (simplified)
    const sssDeduction = grossPay * 0.0363; // 3.63% for SSS
    const philhealthDeduction = grossPay * 0.03; // 3% for PhilHealth
    const pagibigDeduction = Math.min(grossPay * 0.02, 100); // 2% for Pag-IBIG, max of 100
    
    // Simple tax calculation (progressive)
    let taxDeduction = 0;
    if (grossPay <= 20833) {
      taxDeduction = 0; // Tax-exempt
    } else if (grossPay <= 33332) {
      taxDeduction = (grossPay - 20833) * 0.15; // 15% of excess over 20,833
    } else if (grossPay <= 66666) {
      taxDeduction = 1875 + (grossPay - 33333) * 0.20; // 20% of excess over 33,333
    } else if (grossPay <= 166666) {
      taxDeduction = 8541.80 + (grossPay - 66667) * 0.25; // 25% of excess over 66,667
    } else if (grossPay <= 666666) {
      taxDeduction = 33541.80 + (grossPay - 166667) * 0.30; // 30% of excess over 166,667
    } else {
      taxDeduction = 183541.80 + (grossPay - 666667) * 0.35; // 35% of excess over 666,667
    }
    
    const totalDeductions = sssDeduction + philhealthDeduction + pagibigDeduction + taxDeduction;
    const netPay = grossPay - totalDeductions;
    
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
  }, [employee, timeRecords, weekStart, weekEnd]);
  
  // Format number as currency (PHP)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          {employee.profileImage && (
            <img 
              src={employee.profileImage} 
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-medium">{employee.firstName} {employee.lastName}</div>
            <div className="text-xs text-muted-foreground">{employee.employeeNumber}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{employee.position}</TableCell>
      <TableCell>{employee.department}</TableCell>
      <TableCell>
        {salaryData.regularHours.toFixed(1)} / {salaryData.overtimeHours > 0 ? `+${salaryData.overtimeHours.toFixed(1)} OT` : '0 OT'}
      </TableCell>
      <TableCell>{formatCurrency(salaryData.grossPay)}</TableCell>
      <TableCell>{formatCurrency(salaryData.totalDeductions)}</TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(salaryData.netPay)}
      </TableCell>
    </TableRow>
  );
};

export default PayrollSummary;
