import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { employees, getEmployeeById, getEmployeeTimeRecords } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Calculator, Download } from 'lucide-react';
import Header from '@/components/Header';
import PayrollSummary from '@/components/PayrollSummary';
import { getCurrentWeek, getWeek } from '@/utils/dateUtils';
import { formatDate } from '@/utils/dateUtils';

const Payroll = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [week, setWeek] = useState(getCurrentWeek());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  
  useEffect(() => {
    setWeek(getWeek(currentWeekOffset));
  }, [currentWeekOffset]);
  
  const departments = ['all', ...new Set(employees.map(emp => emp.department))];
  
  const filteredEmployees = selectedDepartment === 'all'
    ? employees
    : employees.filter(emp => emp.department === selectedDepartment);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Payroll</h1>
          <p className="text-muted-foreground mt-1">Calculate and process employee salaries</p>
        </motion.div>
        
        <div className="mb-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle>Payroll Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                >
                  Previous Week
                </Button>
                
                <div className="text-center">
                  <div className="font-medium">
                    Week {week.weekNumber}, {new Date(week.start).getFullYear()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(week.start)} - {formatDate(week.end)}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                  disabled={currentWeekOffset >= 0}
                >
                  Next Week
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Payroll Summary</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Department:</span>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.filter(d => d !== 'all').map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
        
        <Card className="border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead className="text-right">Net Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map(employee => {
                  const timeRecords = getEmployeeTimeRecords(employee.id);
                  return (
                    <PayrollSummary 
                      key={employee.id}
                      employee={employee}
                      timeRecords={timeRecords}
                      weekStart={week.start}
                      weekEnd={week.end}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Payroll;
